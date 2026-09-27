const db = require("../../../models/index");

class TravelBudgetController {
  async addTravelBudget(req, res) {
    try {
      // Update
      if (req.body.id) {
        const travelBudget = await db.MASTER_TRAVEL_BUDGET_LIMIT.findByPk(req.body.id);
        if (!travelBudget) {
          return res.status(404).send({ message: "Travel type not found" });
        }

        // Update existing travel budget
        await travelBudget.update(req.body);

        // ----- Local Budget Limits -----
        // Remove existing local budgets for this travel budget
        await db.MASTER_TRAVEL_LOCAL_BUDGET.destroy({
          where: { travel_budget_id: travelBudget.id }
        });

        // Insert new local budgets
        if (Array.isArray(req.body.localBudgetLimits) && req.body.localBudgetLimits.length > 0) {
          const localBudgetPromises = req.body.localBudgetLimits.map(limit =>
            db.MASTER_TRAVEL_LOCAL_BUDGET.create({
              ...limit,
              travel_grade_ids: limit.travel_grade_ids || [],
              travel_budget_id: travelBudget.id
            })
          );
          await Promise.all(localBudgetPromises);
        }

        // ----- Domestic Budget Limits -----
        // Remove existing domestic budgets for this travel budget
        await db.MASTER_TRAVEL_DOMESTIC_BUDGET.destroy({
          where: { travel_budget_id: travelBudget.id }
        });

        // Insert new domestic budgets
        if (Array.isArray(req.body.domesticBudgetLimits) && req.body.domesticBudgetLimits.length > 0) {
          const domesticBudgetPromises = req.body.domesticBudgetLimits.map(limit =>
            db.MASTER_TRAVEL_DOMESTIC_BUDGET.create({
              ...limit,
              travel_budget_id: travelBudget.id,
              travel_conveyance_ids: req.body.travel_conveyance_ids || [],
              travel_grade_ids: req.body.travel_grade_ids || []
            })
          );
          await Promise.all(domesticBudgetPromises);
        }

        return res.status(200).send(travelBudget);
      }

      // Create
      const newTravelBudget = await db.MASTER_TRAVEL_BUDGET_LIMIT.create(
        req.body
      );

      if (req.body.localBudgetLimits && req.body.localBudgetLimits.length > 0) {
        const localBudgetPromises = req.body.localBudgetLimits.map((limit) => {
          console.log("Creating local budget limit:", JSON.stringify(limit));

          return db.MASTER_TRAVEL_LOCAL_BUDGET.create({
            ...limit,
            travel_grade_ids: limit.travel_grade_ids || [],
            travel_budget_id: newTravelBudget.id,
          });
        });
        await Promise.all(localBudgetPromises);
      }
      if (
        req.body.domesticBudgetLimits &&
        req.body.domesticBudgetLimits.length > 0
      ) {
        const domesticBudgetPromises = req.body.domesticBudgetLimits.map(
          (limit) => {
            return db.MASTER_TRAVEL_DOMESTIC_BUDGET.create({
              ...limit,
              travel_budget_id: newTravelBudget.id,
              travel_conveyance_ids: req.body.travel_conveyance_ids || [],
              travel_grade_ids: req.body.travel_grade_ids || [],
            });
          }
        );
        await Promise.all(domesticBudgetPromises);
      }
      return res.status(201).send(newTravelBudget);
    } catch (error) {
      console.error("Error adding travel type:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async getAllTravelBudget(req, res) {
    try {
      const travelTypes = await db.MASTER_TRAVEL_BUDGET_LIMIT.findAll({
        include: [
          {
            model: db.TravelType,
            as: "travelType",
            attributes: ["id", "name", "type"],
          },
          {
            model: db.MASTER_TRAVEL_LOCAL_BUDGET,
            as: "localBudgetLimits",
            required: false,
          },
          {
            model: db.MASTER_TRAVEL_DOMESTIC_BUDGET,
            as: "domesticBudgetLimits",
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).send({ data: travelTypes });
    } catch (error) {
      console.error("Error fetching travel types:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async deleteTravelBudget(req, res) {
    try {
      const { id } = req.params;
      const travelBudget = await db.MASTER_TRAVEL_BUDGET_LIMIT.findByPk(id);
      if (!travelBudget) {
        return res.status(404).send({ message: "Travel budget not found" });
      }

      // Delete related local budget limits
      await db.MASTER_TRAVEL_LOCAL_BUDGET.destroy({ where: { travel_budget_id: id } });

      // Delete related domestic budget limits
      await db.MASTER_TRAVEL_DOMESTIC_BUDGET.destroy({ where: { travel_budget_id: id } });
  
      // Delete related domestic budget limits
      await db.MASTER_REIMBURSEMENT_BUDGET.destroy({ where: { travel_budget_id: id } });
      // Delete the master travel budget itself
      await travelBudget.destroy();

      return res.status(200).send({ message: "Travel budget and its child records deleted successfully" });
    } catch (error) {
      console.error("Error deleting travel budget:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async getTravelBudgetById(req, res) {
    try {
      const { id } = req.params;
      const travelType = await db.MASTER_TRAVEL_BUDGET_LIMIT.findByPk(id, {
        include: [
          {
            model: db.TravelType,
            as: "travelType",
            attributes: ["id"],
          },
          {
            model: db.MASTER_TRAVEL_LOCAL_BUDGET,
            as: "localBudgetLimits",
            required: false,
            include: [
              {
                model: db.TravelType,
                as: "conveyanceType",
                attributes: ["id", "name"],
              },
            ],
          },
          {
            model: db.MASTER_TRAVEL_DOMESTIC_BUDGET,
            as: "domesticBudgetLimits",
            required: false,
          },
          {
            model: db.MASTER_REIMBURSEMENT_BUDGET,
            as: "reimbursementsBudgets",
            required: false,
          },
        ],
      });
      if (!travelType) {
        return res.status(404).send({ message: "Travel type not found" });
      }
      return res.status(200).send(travelType);
    } catch (error) {
      console.error("Error fetching travel type by ID:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * 
   * @param {*} req.body {reimbursement_budgets[], remark, travel_type_id}
   * @param {*} res 
   * @returns 
   */
  async addReimbursementBudget(req, res) {
  try {
    const { id, travel_type_id, reimbursementBudgets, ...rest } = req.body;

    if (!travel_type_id) {
      return res.status(400).send({ message: "travel_type_id is required" });
    }

    // ------------------ UPDATE ------------------
    if (id) {
      const travelBudget = await db.MASTER_TRAVEL_BUDGET_LIMIT.findByPk(id);
      if (!travelBudget) {
        return res.status(404).send({ message: "Reimbursement type not found" });
      }

      // ✅ Check duplicate travel_type_id (excluding current record)
      const duplicate = await db.MASTER_TRAVEL_BUDGET_LIMIT.findOne({
        where: {
          travel_type_id,
          id: { [db.Sequelize.Op.ne]: id }  // exclude current record
        }
      });
      if (duplicate) {
        return res.status(400).send({ message: "Travel Budget name already exists" });
      }

      // Update existing travel budget
      await travelBudget.update({ travel_type_id, ...rest });

      // ----- Local Budget Limits -----
      await db.MASTER_REIMBURSEMENT_BUDGET.destroy({
        where: { travel_budget_id: travelBudget.id }
      });

      if (Array.isArray(reimbursementBudgets) && reimbursementBudgets.length > 0) {
        const localBudgetPromises = reimbursementBudgets.map(limit =>
          db.MASTER_REIMBURSEMENT_BUDGET.create({
            ...limit,
            gradeIds: limit.travel_grade_ids || [],
            travel_budget_id: travelBudget.id
          })
        );
        await Promise.all(localBudgetPromises);
      }

      return res.status(200).send(travelBudget);
    }

    // ------------------ CREATE ------------------
    // ✅ Check duplicate travel_type_id
    const duplicate = await db.MASTER_TRAVEL_BUDGET_LIMIT.findOne({
      where: { travel_type_id }
    });
    if (duplicate) {
      return res.status(400).send({ message: "Travel Budget name already exists" });
    }

    const newTravelBudget = await db.MASTER_TRAVEL_BUDGET_LIMIT.create({
      travel_type_id,
      ...rest
    });

    if (reimbursementBudgets && reimbursementBudgets.length > 0) {
      const localBudgetPromises = reimbursementBudgets.map(limit =>
        db.MASTER_REIMBURSEMENT_BUDGET.create({
          ...limit,
          gradeIds: limit.travel_grade_ids || [],
          travel_budget_id: newTravelBudget.id
        })
      );
      await Promise.all(localBudgetPromises);
    }

    return res.status(201).send(newTravelBudget);
  } catch (error) {
    console.error("Error adding reimbursement budget:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
}


  async getAllReimbursementBudget(req, res) {
    try {
      const travelTypes = await db.MASTER_TRAVEL_BUDGET_LIMIT.findAll({
        include: [
          {
            model: db.TravelType,
            as: "travelType",
            attributes: ["id", "name", "type"],
          },
          {
            model: db.MASTER_REIMBURSEMENT_BUDGET,
            as: "reimbursementsBudgets",
            required: true,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).send({ data: travelTypes });
    } catch (error) {
      console.error("Error fetching travel types:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

module.exports = new TravelBudgetController();
