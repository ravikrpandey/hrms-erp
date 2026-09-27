const {
  attribute,
} = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const db = require("../../../models/index");
const { where } = require("sequelize");
const ESS_TRAVEL_PLAN = db.ESS_TRAVEL_PLAN;
const { Op } = db.Sequelize;

class TravelPlanController {
  // Create a new plan
  async create(req, res) {
    try {
      const { tmPlans, employee_id, status, plan_id } = req.body;

      // Validate inputs
      if (!tmPlans || !Array.isArray(tmPlans) || tmPlans.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No plans provided" });
      }
      if (!employee_id) {
        return res
          .status(400)
          .json({ success: false, message: "Employee ID is required" });
      }
      if (
        !tmPlans.every(
          (plan) =>
            plan.date && new Date(plan.date).toString() !== "Invalid Date"
        )
      ) {
        return res
          .status(400)
          .json({ success: false, message: "All plans must have valid dates" });
      }

      // Extract month and year from first plan
      const firstDate = new Date(tmPlans[0].date);
      if (firstDate.toString() === "Invalid Date") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date in first plan" });
      }
      const year = firstDate.getFullYear();
      const month = firstDate.getMonth() + 1; // 1-based

      // Start a transaction to ensure data consistency
      const transaction = await db.sequelize.transaction();

      try {
        // Delete existing plans for the given plan_id (if provided)
        if (plan_id) {
          const planExists = await ESS_TRAVEL_PLAN.findByPk(plan_id, {
            transaction,
          });
          if (!planExists) {
            await transaction.rollback();
            return res
              .status(404)
              .json({ success: false, message: "Plan ID not found" });
          }
          await db.ESS_TRAVEL_PLAN_DATA.destroy({
            where: { plan_id },
            transaction,
          });
        }

        // Create or update ESS_TRAVEL_PLAN
        const [travelPlan, created] = await ESS_TRAVEL_PLAN.findOrCreate({
          where: { id: plan_id || 0 }, // Use 0 if plan_id is not provided to force creation
          defaults: {
            name: `${month}/${year}`, // Use month/year as plan name
            status: status || "PENDING",
            employee_id,
          },
          transaction,
        });

        // Insert all plans in bulk
        const createdPlanData = await db.ESS_TRAVEL_PLAN_DATA.bulkCreate(
          tmPlans.map((plan) => ({
            date: new Date(plan.date),
            plan_state_id: plan.plan_state_id || null,
            plan_city_id: plan.plan_city_id || null,
            actual_state_id: plan.actual_state_id || null,
            actual_city_id: plan.actual_city_id || null,
            plan_id: travelPlan.id,
          })),
          { transaction }
        );

        // Commit transaction
        await transaction.commit();

        return res.status(201).json({
          success: true,
          message: `Monthly plans ${
            plan_id ? "updated" : "created"
          } successfully`,
          data: createdPlanData,
        });
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (err) {
      console.error(`${plan_id ? "Update" : "Create"} travel plan error:`, err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Get all plans
  async findAll(req, res) {
    try {
      const { employee_id, monthType } = req.query;

      if (!employee_id) {
        return res.status(400).json({
          success: false,
          message: "Employee ID is required",
        });
      }

      // -----------------------------------------------------
      // 📌 STEP 1: Resolve Month & Year based on monthType
      // -----------------------------------------------------
      const today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1; // 1-12

      if (monthType === "next") {
        month = month === 12 ? 1 : month + 1;
        if (month === 1) year++;
      } else if (monthType === "last") {
        month = month === 1 ? 12 : month - 1;
        if (month === 12) year--;
      }

      // Build date ranges
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);

      // Also compute last month for LM section
      const lastMonth = month === 1 ? 12 : month - 1;
      const lastMonthYear = month === 1 ? year - 1 : year;

      const startOfLastMonth = new Date(lastMonthYear, lastMonth - 1, 1);
      const endOfLastMonth = new Date(lastMonthYear, lastMonth, 0);

      // -----------------------------------------------------
      // 📌 STEP 2: Fetch LM (Last Month) Plans
      // -----------------------------------------------------
      const LM = await ESS_TRAVEL_PLAN.findAll({
        where: {
          employee_id,
          name: `${lastMonth}/${lastMonthYear}`,
        },
        include: [
          {
            model: db.ESS_TRAVEL_PLAN_DATA,
            as: "plans",
            attributes: [
              "id",
              "date",
              "plan_state_id",
              "plan_city_id",
              "actual_state_id",
              "actual_city_id",
              "tr_data_id",
            ],
            where: {
              date: {
                [Op.between]: [startOfLastMonth, endOfLastMonth],
              },
            },
            include: [
              {
                model: db.city,
                as: "planCity",
                attributes: ["city_id", "city_name", "states_id"],
                include: [{ model: db.states, where: { status: "ACTIVE" } }],
              },
              {
                model: db.city,
                as: "actualCity",
                attributes: ["city_id", "city_name", "states_id"],
                include: [{ model: db.states, where: { status: "ACTIVE" } }],
              },
              {
                model: db.travel_request_data,
                as: "travelDataPlan",
                include: [
                  {
                    model: db.travel_request,
                    attributes: ["id", "travel_request_number"],
                  },
                ],
              },
            ],
          },
        ],
        order: [
          [{ model: db.ESS_TRAVEL_PLAN_DATA, as: "plans" }, "date", "ASC"],
        ],
      });

      // -----------------------------------------------------
      // 📌 STEP 3: Fetch TM (Target Month — based on monthType)
      // -----------------------------------------------------
      const fetchTM = async () => {
        return await ESS_TRAVEL_PLAN.findAll({
          where: {
            employee_id,
            name: `${month}/${year}`,
          },
          include: [
            {
              model: db.ESS_TRAVEL_PLAN_DATA,
              as: "plans",
              where: {
                date: {
                  [Op.between]: [startOfMonth, endOfMonth],
                },
              },
              include: [
                {
                  model: db.city,
                  as: "planCity",
                  attributes: ["city_id", "city_name", "states_id"],
                  include: [{ model: db.states, where: { status: "ACTIVE" } }],
                },
                {
                  model: db.city,
                  as: "actualCity",
                  attributes: ["city_id", "city_name", "states_id"],
                  include: [{ model: db.states, where: { status: "ACTIVE" } }],
                },
                {
                  model: db.travel_request_data,
                  as: "travelDataPlan",
                  include: [
                    {
                      model: db.travel_request,
                      attributes: ["id", "travel_request_number"],
                    },
                  ],
                },
              ],
            },
          ],
          order: [
            [{ model: db.ESS_TRAVEL_PLAN_DATA, as: "plans" }, "date", "ASC"],
          ],
        });
      };

      let TM = await fetchTM();

      // -----------------------------------------------------
      // 📌 STEP 4: Auto-create TM if not exists
      // -----------------------------------------------------
      if (!TM || TM.length === 0) {
        const travelPlan = await ESS_TRAVEL_PLAN.create({
          name: `${month}/${year}`,
          status: "PENDING",
          employee_id,
        });

        const totalDays = new Date(year, month, 0).getDate();
        const plansArray = [];

        for (let day = 1; day <= totalDays; day++) {
          const dateStr = new Date(year, month - 1, day)
            .toISOString()
            .split("T")[0];
          plansArray.push({
            date: dateStr,
            plan_city_id: null,
            actual_city_id: null,
            plan_id: travelPlan.id,
          });
        }

        await db.ESS_TRAVEL_PLAN_DATA.bulkCreate(plansArray);

        TM = await fetchTM();
      }

      // -----------------------------------------------------
      // 📌 STEP 5: Fetch Holidays (for target month)
      // -----------------------------------------------------
      const holidays = await db.holidayDetail.findAll({
        where: {
          isDeleted: false,
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        attributes: ["id", "holiday_name", "date"],
      });

      const plainTM = TM[0] ? TM[0].get({ plain: true }) : null;
      const plainLM = LM[0] ? LM[0].get({ plain: true }) : null;

      // -----------------------------------------------------
      // 📌 STEP 6: Attach Holidays (TM + LM)
      // -----------------------------------------------------
      const attachHolidays = (planObj) => {
        if (!planObj || !Array.isArray(planObj.plans)) return planObj;

        planObj.plans = planObj.plans.map((plan) => {
          const found = holidays.find(
            (h) => h.date.split("T")[0] === plan.date
          );
          return { ...plan, holiday: found || null };
        });

        return planObj;
      };

      attachHolidays(plainTM);
      attachHolidays(plainLM);

      return res.status(200).json({
        success: true,
        message: "Data fetched successfully!",
        data: {
          month,
          year,
          LM: plainLM,
          TM: plainTM,
          holidays,
        },
      });
    } catch (err) {
      console.error("Fetch travel plans error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Update a plan
  async update(req, res) {
    try {
      const { id } = req.params;
      const { date, plan_city, actual_city, status } = req.body;

      const [updated] = await ESS_TRAVEL_PLAN.update(
        { date, plan_city, actual_city, status },
        { where: { id } }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Plan not found" });
      }

      const updatedPlan = await ESS_TRAVEL_PLAN.findByPk(id);
      res.status(200).json({ success: true, data: updatedPlan });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Delete a plan
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ESS_TRAVEL_PLAN.destroy({ where: { id } });

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Plan not found" });
      }

      res.status(200).json({ success: true, message: "Plan deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async approveTravelPlan(req, res) {
    try {
      const { planId, status } = req.query;

      // Validate input parameters
      if (!planId || !status) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required parameters: planId and status are required.",
        });
      }

      // Validate status value
      const validStatuses = ["APPROVED", "REJECTED", "PENDING"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}.`,
        });
      }

      const [updated] = await ESS_TRAVEL_PLAN.update(
        { status },
        { where: { id: parseInt(planId) } }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Travel plan with ID ${planId} not found.`,
        });
      }

      const updatedPlan = await ESS_TRAVEL_PLAN.findByPk(planId);
      return res.status(200).json({
        success: true,
        data: updatedPlan,
        message: `Travel plan ${planId} has been successfully ${status.toLowerCase()}.`,
      });
    } catch (err) {
      console.error("Error approving travel plan:", err.message);
      return res.status(500).json({
        success: false,
        message:
          "Failed to update travel plan due to a server error. Please try again later.",
      });
    }
  }
}

module.exports = new TravelPlanController();
