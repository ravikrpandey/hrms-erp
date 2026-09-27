const db = require("../../../models");
const LeaveEntitlementModel = db.leavePolicyEntitlement;
const EssApplyLeaveDetail = db.essApplyLeaveDetail;
const ApplicabilityAllModel = db.applicabilityAll;
const AppDepartmentsModel = db.appDepartment;
const LeaveMasterModel = db.leave_master;
const userDetails = db.user;
const { Op, fn, col, where, literal } = require("sequelize");
const { log } = require("mathjs");
const leaveMaster = db.leave_master;
const logger = require("../../../../logger/index");

// Get employee by entity
const getAllEmployeesByEntity = async (req, res) => {
  try {
    const allLeaves = await db.user_entity.findAll({
      where: { employee_id: employee_id, isDeleted: false, leaveId: leaveIds },
      include: [
        {
          model: LeaveMasterModel,
          where: { isDeleted: false, isDeleted: false },
          attributes: [
            "employee_id",
            "title",
            "employee_code",
            "first_name",
            "last_name",
            "gender",
            "date_of_birth",
            "status",
            "parmanent_address",
          ],
        },
      ],
    });

    return res
      .status(200)
      .send({ message: "Employee fetched successfully", data: allLeaves });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error getting leave master:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// Apply Leave
// const applyLeave = async (req, res) => {
//   let {
//     financial_year_id,
//     leaveFor,
//     documents,
//     startDate,
//     endDate,
//     leaveDays,
//     justification,
//     leaveId,
//     departmentId,
//     employee_id,
//     isDeleted,
//     days_details,
//     created_by,
//   } = req.body;

//   const requiredFields = [
//     "financial_year_id",
//     "days_details",
//     "leaveFor",
//     "startDate",
//     "endDate",
//     "leaveDays",
//     "justification",
//     "leaveId",
//     "departmentId",
//     "employee_id",
//     "isDeleted",
//   ];

//   for (const field of requiredFields) {
//     if (req.body[field] === undefined || req.body[field] === null) {
//       return res
//         .status(400)
//         .send({
//           message: `Leave data incomplete: ${field} is missing`,
//           data: [],
//         });
//     }
//   }
//   try {
//     const userExist = await userDetails.findOne({
//       where: { employee_id: employee_id, isDeleted: false },
//     });
//     if (!userExist) {
//       return res
//         .status(404)
//         .send({ message: "User not found or is deleted", data: [] });
//     }
//     const leaveExist = await leaveMaster.findOne({
//       where: { id: leaveId, isDeleted: false },
//     });
//     if (!leaveExist) {
//       return res
//         .status(404)
//         .send({ message: "Leave type does not exist or is deleted", data: [] });
//     }
//     const departmentExists = await db.department.findOne({
//       where: { dept_id: departmentId, isDeleted: false },
//     });
//     if (!departmentExists) {
//       return res
//         .status(404)
//         .send({ message: "Department does not exist or is deleted", data: [] });
//     }

//     const overlappingLeaves = await EssApplyLeaveDetail.findAll({
//       where: {
//         employee_id: employee_id,
//         isDeleted: false,
//         approval_status: "APPROVED",
//         [Op.or]: [
//           { approved_start_date: { [Op.between]: [startDate, endDate] } },
//           { approved_end_date: { [Op.between]: [startDate, endDate] } },
//           {
//             approved_start_date: { [Op.lte]: startDate },
//             approved_end_date: { [Op.gte]: endDate },
//           },
//         ],
//       },
//     });
//     if (overlappingLeaves.length > 0) {
//       return res
//         .status(409)
//         .send({ message: "Leave already exists on the given dates", data: [] });
//     }

//     const overlappingLeaves_pending = await EssApplyLeaveDetail.findAll({
//       where: {
//         employee_id: employee_id,
//         isDeleted: false,
//         approval_status: "PENDING",
//         [Op.or]: [
//           { start_date: { [Op.between]: [startDate, endDate] } },
//           { end_date: { [Op.between]: [startDate, endDate] } },
//           {
//             start_date: { [Op.lte]: startDate },
//             end_date: { [Op.gte]: endDate },
//           },
//         ],
//       },
//     });
//     if (overlappingLeaves_pending.length > 0) {
//       return res
//         .status(409)
//         .send({
//           message: "Leave already applied on the given dates",
//           data: [],
//         });
//     }

//     let leaveInfo = {
//       leave_for: leaveFor,
//       start_date: startDate,
//       end_date: endDate,
//       leave_days: leaveDays,
//       justification: justification,
//       leaveId: leaveId,
//       dept_id: departmentId,
//       employee_id: employee_id,
//       financial_year_id: financial_year_id,
//       isDeleted: isDeleted,
//       created_by: created_by,
//     };

//     const leaveApplied = await EssApplyLeaveDetail.create(leaveInfo);
//     if (leaveFor === "TEAMMATE") {
//       await db.essApplyLeaveDetail.update(
//         {
//           approved_start_date: startDate,
//           approved_end_date: endDate,
//           approved_days: leaveDays,
//           approval_status: "APPROVED",
//         },
//         { where: { id: leaveApplied.id } }
//       );
//     }
//     await Promise.all(
//       documents.map(async (leaveDoc) => {
//         await db.appliedLeaveDocuments.create({
//           uploaded_document: leaveDoc,
//           applyDetailId: leaveApplied.id,
//         });
//       })
//     );
//     const created_Days = await Promise.all(
//       days_details.map(async (details) => {
//         const { leave_day, leave_date, leave_period, leave_type } = details;
//         const day_detail = await db.essLeavedaysDetail.create({
//           leave_day,
//           leave_date,
//           leave_period,
//           apply_leave_id: leaveApplied.id,
//           leave_type,
//         });
//         return day_detail;
//       })
//     );
//     return res
//       .status(200)
//       .send({
//         message: "Leave has been applied successfully",
//         data: leaveApplied,
//         created_Days,
//       });
//   } catch (error) {
//     logger.error(`Error ${error.message}`, { error });
//     console.error("Error processing leave application:", error);
//     return res
//       .status(500)
//       .send({ code: 500, message: error.message || "Server Error" });
//   }
// };

const applyLeave = async (req, res) => {
  let {
    financial_year_id,
    leaveFor,
    documents,
    startDate,
    endDate,
    leaveDays,
    justification,
    leaveId,
    departmentId,
    employee_id,
    isDeleted,
    days_details,
    created_by,
  } = req.body;

  const requiredFields = [
    "financial_year_id",
    "days_details",
    "leaveFor",
    "startDate",
    "endDate",
    "leaveDays",
    "justification",
    "leaveId",
    // "departmentId",
    "employee_id",
    "isDeleted",
  ];

  for (const field of requiredFields) {
    if (req.body[field] === undefined || req.body[field] === null) {
      return res
        .status(400)
        .send({
          message: `Leave data incomplete: ${field} is missing`,
          data: [],
        });
    }
  }

  try {
    const userExist = await userDetails.findOne({
      where: { employee_id: employee_id, isDeleted: false },
    });
    if (!userExist) {
      return res
        .status(404)
        .send({ message: "User not found or is deleted", data: [] });
    }

    const leaveExist = await leaveMaster.findOne({
      where: { id: leaveId, isDeleted: false },
    });
    if (!leaveExist) {
      return res
        .status(404)
        .send({ message: "Leave type does not exist or is deleted", data: [] });
    }

    const departmentExists = await db.department.findOne({
      where: { dept_id: userExist.department_id, isDeleted: false },
    });
    if (!departmentExists) {
      return res
        .status(404)
        .send({ message: "Department does not exist or is deleted", data: [] });
    }

    // ✅ Short Leave Validation: Allow only 1 per month
    if (leaveId === 4) {
      const newLeaveMonth = new Date(startDate).getMonth(); // 0-based (0=Jan, 11=Dec)
      const newLeaveYear = new Date(startDate).getFullYear();

      const existingShortLeave = await EssApplyLeaveDetail.findOne({
        where: {
          employee_id: employee_id,
          leaveId: 4,
          isDeleted: false,
        },
        order: [["createdAt", "DESC"]], // latest leave
      });

      if (existingShortLeave) {
        const existingMonth = new Date(existingShortLeave.createdAt).getMonth();
        const existingYear = new Date(existingShortLeave.createdAt).getFullYear();

        if (existingMonth === newLeaveMonth && existingYear === newLeaveYear) {
          return res.status(400).send({
            message: "Short leave is already applied in this month.",
            data: [],
          });
        }
      }
    }

    // ✅ Overlapping Approved Leaves
    const overlappingLeaves = await EssApplyLeaveDetail.findAll({
      where: {
        employee_id: employee_id,
        isDeleted: false,
        approval_status: "APPROVED",
        [Op.or]: [
          { approved_start_date: { [Op.between]: [startDate, endDate] } },
          { approved_end_date: { [Op.between]: [startDate, endDate] } },
          {
            approved_start_date: { [Op.lte]: startDate },
            approved_end_date: { [Op.gte]: endDate },
          },
        ],
      },
    });
    if (overlappingLeaves.length > 0) {
      return res
        .status(409)
        .send({ message: "Leave already exists on the given dates", data: [] });
    }

    // ✅ Overlapping Pending Leaves
    const overlappingLeaves_pending = await EssApplyLeaveDetail.findAll({
      where: {
        employee_id: employee_id,
        isDeleted: false,
        approval_status: "PENDING",
        [Op.or]: [
          { start_date: { [Op.between]: [startDate, endDate] } },
          { end_date: { [Op.between]: [startDate, endDate] } },
          {
            start_date: { [Op.lte]: startDate },
            end_date: { [Op.gte]: endDate },
          },
        ],
      },
    });
    if (overlappingLeaves_pending.length > 0) {
      return res
        .status(409)
        .send({
          message: "Leave already applied on the given dates",
          data: [],
        });
    }

    let leaveInfo = {
      leave_for: leaveFor,
      start_date: startDate,
      end_date: endDate,
      leave_days: leaveDays,
      justification: justification,
      leaveId: leaveId,
      dept_id: userExist.department_id,
      employee_id: employee_id,
      financial_year_id: financial_year_id,
      isDeleted: isDeleted,
      created_by: created_by,
    };

    const leaveApplied = await EssApplyLeaveDetail.create(leaveInfo);

    if (leaveFor === "TEAMMATE") {
      await db.essApplyLeaveDetail.update(
        {
          approved_start_date: startDate,
          approved_end_date: endDate,
          approved_days: leaveDays,
          approval_status: "APPROVED",
        },
        { where: { id: leaveApplied.id } }
      );
    }

    await Promise.all(
      documents.map(async (leaveDoc) => {
        await db.appliedLeaveDocuments.create({
          uploaded_document: leaveDoc,
          applyDetailId: leaveApplied.id,
        });
      })
    );

    const created_Days = await Promise.all(
      days_details.map(async (details) => {
        const { leave_day, leave_date, leave_period, leave_type } = details;
        const day_detail = await db.essLeavedaysDetail.create({
          leave_day,
          leave_date,
          leave_period,
          apply_leave_id: leaveApplied.id,
          leave_type,
        });
        return day_detail;
      })
    );

    return res
      .status(200)
      .send({
        message: "Leave has been applied successfully",
        data: leaveApplied,
        created_Days,
      });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error processing leave application:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};


// Get All Applied Leaves For Employee
const getAllAppliedLeavesForEmployee = async (req, res) => {
  try {
    let { entity_id, employee_id, allLeaves } = req.query;

    const requiredFields = ["employee_id", "allLeaves"];
    for (const field of requiredFields) {
      if (req.query[field] === undefined || req.query[field] === null) {
        return res
          .status(400)
          .send({
            message: `Leave data incomplete: ${field} is missing`,
            data: [],
          });
      }
    }
    const leaveMasters = await LeaveMasterModel.findAll({
      where: {
        isDeleted: false,
        status: "ACTIVE",
        entity_id: entity_id,
      },
    });
    let leaveIds = leaveMasters.map((leaveMaster) => leaveMaster.id);

    if (allLeaves === "true") {
      const allEmployeesLeaves = await EssApplyLeaveDetail.findAll({
        where: { isDeleted: false, leaveId: leaveIds },
        include: [
          {
            model: LeaveMasterModel,
            attributes: ["leave_name", "total_available"],
          },
          {
            model: userDetails,
            attributes: ["employee_id", "first_name", "last_name", "gender"],
          },
        ],
      });
      return res.status(200).send({
        message: "Applied leaves by employees fetched successfully!",
        data: allEmployeesLeaves,
      });
    } else {
      let allEmployeeLeaves = await EssApplyLeaveDetail.findAll({
        where: {
          employee_id: employee_id,
          isDeleted: false,
          leaveId: leaveIds,
        },
        include: [
          {
            model: LeaveMasterModel,
            attributes: ["leave_name", "total_available"],
          },
          {
            model: userDetails,
            attributes: ["employee_id", "first_name", "last_name", "gender"],
          },
        ],
      });
      const report_managr = await db.user.findOne({
        where: { employee_id, status: "ACTIVE", isDeleted: false },
        attributes: ["reporting_manager_id"],
      });
      const approval_details = await db.user.findOne({
        where: {
          employee_id: report_managr.reporting_manager_id,
          status: "ACTIVE",
          isDeleted: false,
        },
        attributes: ["first_name", "last_name"],
      });
      allEmployeeLeaves.forEach((leave) => {
        leave.dataValues.approval_details = approval_details;
      });
      return res.status(200).send({
        message: "All leaves fetched for employee Successfully!",
        data: allEmployeeLeaves,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error getting leave master:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// Get Applied Leave By Employee Id
const getAllAppliedLeaveById = async (req, res) => {
  let { employee_id, appliedLeaveId, entity_id } = req.query;
  const requiredFields = ["employee_id", "appliedLeaveId", "entity_id"];
  for (const field of requiredFields) {
    if (req.query[field] === undefined || req.query[field] === null) {
      return res
        .status(400)
        .send({
          message: `Leave data incomplete: ${field} is missing`,
          data: [],
        });
    }
  }
  try {
    const appliedLeaveById = await EssApplyLeaveDetail.findAll({
      where: { id: appliedLeaveId, employee_id: employee_id },
      include: [
        {
          model: LeaveMasterModel,
          attributes: ["id", "leave_name", "leave_code", "total_available"],
        },
      ],
    });

    if (!appliedLeaveById) {
      return res.status(200).send({ message: `Leave not found`, data: [] });
    }

    const leaveAvailable = await LeaveMasterModel.findAll({
      where: {
        id: appliedLeaveById[0]?.leaveId,
        entity_id: entity_id,
      },
    });
    if (leaveAvailable.length == 0) {
      return res.status(400).send({ message: "Leave not available", data: {} });
    }

    const appliedLeaveDetails = appliedLeaveById.map((detail) =>
      detail.toJSON()
    );
    const documentsData = await db.appliedLeaveDocuments.findAll({
      where: { applyDetailId: appliedLeaveId, isDeleted: false },
    });

    const documents = documentsData.map((document) => document.toJSON());
    // const days_details = await db.essLeavedaysDetail.findAll({ where: { apply_leave_id: appliedLeaveId, isDeleted: false } });
    const days_details = await db.essLeavedaysDetail.findAll({
      where: {
        apply_leave_id: appliedLeaveId,
        isDeleted: false,
      },
      order: [["leave_date", "ASC"]], // Sorting by leave_date in ascending order
    });

    appliedLeaveDetails.forEach((detail) => {
      (detail.documents = documents.filter(
        (doc) => doc.applyDetailId === detail.id
      )),
        (detail.days_details = days_details);
    });

    return res
      .status(200)
      .send({
        message: "Applied leave deails fetched Successfully!",
        data: appliedLeaveDetails,
      });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error getting leave master:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// Get Available Leave for department and Applied leaves count for employee
const getAllLeavesByFilter = async (req, res) => {
  try {
    let date = new Date();
    let today = date.toISOString().split("T")[0];

    const {
      department_id,
      employeeId,
      entity_id,
      designation_id,
      gender_id,
      marital_id,
      location_id,
    } = req.query;

    // Validation checks
    const requiredFields = [
      "role_id",
      "department_id",
      "employeeId",
      "entity_id",
      "designation_id",
      "gender_id",
      "marital_id",
      "location_id",
    ];
    for (const field of requiredFields) {
      if (req.query[field] === undefined || req.query[field] === null) {
        return res
          .status(400)
          .send({
            message: `Leave data incomplete: ${field} is missing`,
            data: [],
          });
      }
    }

    const user = await db.user.findOne({
      where: { employee_id: employeeId, isDeleted: false },
      attributes: ["start_working_date", "end_date_probation"],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    let entitlementCondition;
    const dateOfJoining = user.start_working_date;
    let daysSinceJoining = Math.floor(
      (new Date() - new Date(dateOfJoining)) / (1000 * 60 * 60 * 24)
    );
    daysSinceJoining += 1;
    const endOfProbation = user.end_date_probation;
    let daysSinceEndProbation = Math.floor(
      (new Date() - new Date(endOfProbation)) / (1000 * 60 * 60 * 24)
    );

    // If today is before endOfProbation
    if (new Date(today) < new Date(endOfProbation)) {
      entitlementCondition = {
        effective_duration: { [Op.lt]: daysSinceJoining },
        from: "DOJ",
      };
    }
    // If today is on or after endOfProbation
    else {
      entitlementCondition = {
        [Op.or]: [
          { effective_duration: { [Op.lt]: daysSinceJoining }, from: "DOJ" },
          {
            effective_duration: { [Op.lt]: daysSinceEndProbation },
            from: "DOC",
          },
        ],
      };
    }

    const leaveMasters = await LeaveMasterModel.findAll({
      where: {
        isDeleted: false,
        status: "ACTIVE",
        entity_id: entity_id,
      },
      include: [
        {
          model: db.leavePolicyDetailModel,
          where: {
            startDate: { [Op.lte]: today },
            [Op.or]: [{ endDate: { [Op.gte]: today } }, { endDate: null }],
          },
          required: true,
        },
        {
          model: db.leavePolicyEntitlement,
          where: entitlementCondition,
          required: true,
        },
      ],
    });
    let leaveIds = leaveMasters.map((leaveMaster) => {
      if (
        Array.isArray(leaveMaster.HRMS_LEAVE_POLICY_ENTITLEMENTs) &&
        leaveMaster.HRMS_LEAVE_POLICY_ENTITLEMENTs.length > 0
      ) {
        return leaveMaster.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].leaveId;
      }
      // return leaveMaster.id
    });

    // Fetch leaveIds from the Leave Master table
    const leaveMasterData = await LeaveMasterModel.findAll({
      where: { id: leaveIds, isDeleted: false },
      include: [
        {
          model: AppDepartmentsModel,
          where: { dept_id: department_id, isDeleted: false },
          attributes: [],
        },
        {
          model: db.appDesignation,
          where: { designation_id: designation_id, isDeleted: false },
          attributes: [],
        },
        {
          model: db.appGender,
          where: { gender: gender_id, isDeleted: false },
          attributes: [],
        },
        {
          model: db.appMarital,
          where: { marital: marital_id, isDeleted: false },
          attributes: [],
        },
        {
          model: db.appLocation,
          where: { locationId: location_id, isDeleted: false },
          attributes: [],
        },
      ],
    });

    // Loop through departmentLeaves to fetch total leave days for each leaveId
    for (let i = 0; i < leaveMasterData.length; i++) {
      const item = leaveMasterData[i];
      let leaveId = item.id;

      // Fetch and sum leave_days for the current leaveId
      const leaveDetails = await EssApplyLeaveDetail.findAll({
        where: { leaveId: leaveId, isDeleted: false, employee_id: employeeId },
        attributes: [
          [
            db.sequelize.fn("SUM", db.sequelize.col("leave_days")),
            "total_days",
          ],
          [
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                `CASE WHEN approval_status = 'APPROVED' THEN approved_days ELSE 0 END`
              )
            ),
            "total_approved_days",
          ],
        ],
      });

      const totalDays =
        leaveDetails[0] && leaveDetails[0].get("total_days") !== null
          ? leaveDetails[0].get("total_days")
          : 0;

      const totalApprovedDays =
        leaveDetails[0] && leaveDetails[0].get("total_approved_days") !== null
          ? leaveDetails[0].get("total_approved_days")
          : 0;

      // Add total_days and total_approved_days to the HRMS_LEAVE_MASTER object
      if (item.dataValues) {
        item.dataValues.total_leave_applied = totalDays;
        item.dataValues.total_approved_days = totalApprovedDays;
      }
    }

    // Fetching the leave applied for all the departments
    const forAllLeaves = await db.applicabilityAll.findAll({
      where: { isDeleted: false, leaveId: leaveIds },
      include: { model: LeaveMasterModel },
    });

    let updatedLeaves = [];
    let existingLeaveIds = new Map();
    // Loop through departmentLeaves to fetch total leave days for each leaveId
    for (let i = 0; i < forAllLeaves.length; i++) {
      const item = forAllLeaves[i];
      let leaveId = item.leaveId;
      if (existingLeaveIds.has(leaveId)) {
        continue;
      }
      existingLeaveIds.set(leaveId, true);
      const leaveDetails = await EssApplyLeaveDetail.findAll({
        where: { leaveId: leaveId, isDeleted: false, employee_id: employeeId },
        attributes: [
          [
            db.sequelize.fn("SUM", db.sequelize.col("leave_days")),
            "total_days",
          ],
          [
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                `CASE WHEN approval_status = 'APPROVED' THEN approved_days ELSE 0 END`
              )
            ),
            "total_approved_days",
          ],
        ],
      });

      const totalDays =
        leaveDetails[0] && leaveDetails[0].get("total_days") !== null
          ? leaveDetails[0].get("total_days")
          : 0;

      const totalApprovedDays =
        leaveDetails[0] && leaveDetails[0].get("total_approved_days") !== null
          ? leaveDetails[0].get("total_approved_days")
          : 0;

      if (item.HRMS_LEAVE_MASTER) {
        item.HRMS_LEAVE_MASTER.dataValues.total_leave_applied = totalDays;
        item.HRMS_LEAVE_MASTER.dataValues.total_approved_days =
          totalApprovedDays;
      }
      updatedLeaves.push(item);
    }

    let additionalLeaves = updatedLeaves
      .filter((leave) => existingLeaveIds.has(leave.leaveId)) // exclude duplicates
      .map((leave) => leave.HRMS_LEAVE_MASTER); // map to required structure

    let combinedLeaves = [...leaveMasterData, ...additionalLeaves];
    combinedLeaves = combinedLeaves.map((leave) => {
      if (leave.dataValues) {
        const totalAvailable =
          parseFloat(leave.dataValues.total_available) || 0;
        const totalApprovedDays =
          parseFloat(leave.dataValues.total_approved_days) || 0;
        // Calculate remaining leave
        leave.dataValues.remaining_leave = totalAvailable - totalApprovedDays;
      }
      return leave;
    });
    return res.status(200).send({
      message: "Leaves available for the department fetched successfully!",
      data: combinedLeaves,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error getting leave master:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// Get Available Leave for department and Applied leaves count for employee
const getEffectiveAppliedLeave = async (req, res) => {
  try {
    let date = new Date();
    let today = date.toISOString().split("T")[0];

    let { employeeId, entity_id, leaveId } = req.query;

    // Fetch user details (date of joining and end of probation)
    const user = await db.user.findOne({
      where: { employee_id: employeeId, isDeleted: false },
      attributes: ["start_working_date", "end_date_probation"],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const dateOfJoining = user.start_working_date;
    const endOfProbation = user.end_date_probation;

    // Calculate the number of days since joining and end of probation
    let daysSinceJoining =
      Math.floor(
        (new Date() - new Date(dateOfJoining)) / (1000 * 60 * 60 * 24)
      ) + 1;
    let daysSinceEndProbation = Math.floor(
      (new Date() - new Date(endOfProbation)) / (1000 * 60 * 60 * 24)
    );

    let entitlementCondition;

    // If today is before the end of probation
    if (new Date(today) < new Date(endOfProbation)) {
      entitlementCondition = {
        effective_duration: { [Op.lt]: daysSinceJoining },
        from: "DOJ",
        leaveId: leaveId,
      };
    }
    // If today is on or after the end of probation
    else {
      entitlementCondition = {
        [Op.or]: [
          { effective_duration: { [Op.lt]: daysSinceJoining }, from: "DOJ" },
          {
            effective_duration: { [Op.lt]: daysSinceEndProbation },
            from: "DOC",
          },
        ],
        leaveId: leaveId,
      };
    }

    // Fetch leave master with leave policy details and entitlement conditions
    const leaveMasters = await LeaveMasterModel.findOne({
      where: { isDeleted: false, status: "ACTIVE", entity_id: entity_id },
      include: [
        {
          model: db.leavePolicyDetailModel,
          where: {
            startDate: { [Op.lte]: today },
            [Op.or]: [{ endDate: { [Op.gte]: today } }, { endDate: null }],
          },
          required: true,
          attributes: [],
        },
        {
          model: LeaveEntitlementModel,
          where: entitlementCondition,
          required: true,
          attributes: [],
        },
      ],
    });

    if (!leaveMasters) {
      const leaveData = await LeaveMasterModel.findOne({
        where: { isDeleted: false, status: "ACTIVE", entity_id: entity_id },
        include: [
          {
            model: db.leavePolicyDetailModel,
            where: { leaveId: leaveId },
            required: true,
            attributes: [],
          },
          {
            model: LeaveEntitlementModel,
            where: { leaveId: leaveId },
            required: true,
            attributes: ["effective_value", "effective_period", "from"],
          },
        ],
      });

      leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_period =
        leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_period.charAt(0) +
        leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_period
          .slice(1)
          .toLowerCase();
      return res.status(200).send({
        code: 200,
        flag: false,
        message: `This leave policy effective after ${leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_value} ${leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].effective_period} from ${leaveData.HRMS_LEAVE_POLICY_ENTITLEMENTs[0].from}`,
      });
    }
    // Fetch leaveIds from the Leave Master table
    const leaveMasterData = await LeaveMasterModel.findAll({
      where: { id: leaveId, isDeleted: false },
      include: [
        {
          model: AppDepartmentsModel,
          where: { isDeleted: false },
          attributes: [],
        },
        {
          model: db.appDesignation,
          where: { isDeleted: false },
          attributes: [],
        },
        {
          model: db.appGender,
          where: { isDeleted: false },
          attributes: [],
        },
        {
          model: db.appMarital,
          where: { isDeleted: false },
          attributes: [],
        },
        {
          model: db.appLocation,
          where: { isDeleted: false },
          attributes: [],
        },
      ],
    });

    // Loop through departmentLeaves to fetch total leave days for each leaveId
    for (let i = 0; i < leaveMasterData.length; i++) {
      const item = leaveMasterData[i];
      let leaveId = item.id;

      // Fetch and sum leave_days for the current leaveId
      const leaveDetails = await EssApplyLeaveDetail.findAll({
        where: { leaveId: leaveId, isDeleted: false, employee_id: employeeId },
        attributes: [
          [
            db.sequelize.fn("SUM", db.sequelize.col("leave_days")),
            "total_days",
          ],
          [
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                `CASE WHEN approval_status = 'APPROVED' THEN approved_days ELSE 0 END`
              )
            ),
            "total_approved_days",
          ],
        ],
      });

      const totalDays =
        leaveDetails[0] && leaveDetails[0].get("total_days") !== null
          ? leaveDetails[0].get("total_days")
          : 0;

      const totalApprovedDays =
        leaveDetails[0] && leaveDetails[0].get("total_approved_days") !== null
          ? leaveDetails[0].get("total_approved_days")
          : 0;

      // Add total_days and total_approved_days to the HRMS_LEAVE_MASTER object
      if (item.dataValues) {
        item.dataValues.total_leave_applied = totalDays;
        item.dataValues.total_approved_days = totalApprovedDays;
      }
    }

    // Fetching the leave applied for all the departments
    const forAllLeaves = await ApplicabilityAllModel.findAll({
      where: { isDeleted: false, leaveId: leaveId },
      include: { model: LeaveMasterModel },
    });

    // Loop through departmentLeaves to fetch total leave days for each leaveId
    for (let i = 0; i < forAllLeaves.length; i++) {
      const item = forAllLeaves[i];
      let leaveId = item.leaveId;

      const leaveDetails = await EssApplyLeaveDetail.findAll({
        where: { leaveId: leaveId, isDeleted: false, employee_id: employeeId },
        attributes: [
          [
            db.sequelize.fn("SUM", db.sequelize.col("leave_days")),
            "total_days",
          ],
          [
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                `CASE WHEN approval_status = 'APPROVED' THEN approved_days ELSE 0 END`
              )
            ),
            "total_approved_days",
          ],
        ],
      });

      const totalDays =
        leaveDetails[0] && leaveDetails[0].get("total_days") !== null
          ? leaveDetails[0].get("total_days")
          : 0;

      const totalApprovedDays =
        leaveDetails[0] && leaveDetails[0].get("total_approved_days") !== null
          ? leaveDetails[0].get("total_approved_days")
          : 0;

      if (item.HRMS_LEAVE_MASTER) {
        item.HRMS_LEAVE_MASTER.dataValues.total_leave_applied = totalDays;
        item.HRMS_LEAVE_MASTER.dataValues.total_approved_days =
          totalApprovedDays;
      }
    }
    let combinedLeaves = [
      ...leaveMasterData,
      ...forAllLeaves.map((leave) => leave.HRMS_LEAVE_MASTER),
    ];
    combinedLeaves = combinedLeaves.map((leave) => {
      if (leave.dataValues) {
        const totalAvailable =
          parseFloat(leave.dataValues.total_available) || 0;
        const totalApprovedDays =
          parseFloat(leave.dataValues.total_approved_days) || 0;
        // Calculate remaining leave
        leave.dataValues.remaining_leave = totalAvailable - totalApprovedDays;
      }
      return leave;
    });
    return res.status(200).send({
      code: 200,
      flag: true,
      message: "Leaves available for the department fetched successfully!",
      data: combinedLeaves[0],
    });
  } catch (error) {
    logger.error(`Error: ${error.message}`, { error });
    console.error("Error getting leave master:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// Update Applied Leave By ID
const updateAppliedLeaveById = async (req, res) => {
  try {
    let { leave_id } = req.params;
    let {
      leaveFor,
      startDate,
      endDate,
      leaveDays,
      justification,
      leaveId,
      departmentId,
      employee_id,
      documents,
      days_details,
    } = req.body;

    const requiredFields = [
      "leaveFor",
      "startDate",
      "endDate",
      "leaveDays",
      "justification",
      "leaveId",
      "departmentId",
      "employee_id",
    ];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res
          .status(400)
          .send({
            message: `Leave data incomplete: ${field} is missing`,
            data: [],
          });
      }
    }
    const existingLeave = await EssApplyLeaveDetail.findAll({
      where: { isDeleted: false, id: leave_id },
    });
    if (existingLeave.length === 0) {
      return res
        .status(400)
        .json({ message: "Applied Leave with this id does not exist" });
    }
    const overlappingLeaves = await EssApplyLeaveDetail.findAll({
      where: {
        employee_id: employee_id,
        isDeleted: false,
        id: { [Op.ne]: leave_id },
        [Op.or]: [
          { start_date: { [Op.between]: [startDate, endDate] } },
          { end_date: { [Op.between]: [startDate, endDate] } },
          {
            start_date: { [Op.lte]: startDate },
            end_date: { [Op.gte]: endDate },
          },
        ],
      },
    });
    if (overlappingLeaves.length > 0) {
      return res
        .status(409)
        .send({ message: "Leave already exists on the given dates", data: [] });
    }

    let updatedLeave = await EssApplyLeaveDetail.update(
      {
        leave_for: leaveFor,
        start_date: startDate,
        end_date: endDate,
        leave_days: leaveDays,
        justification: justification,
        employee_id: employee_id,
        dept_id: departmentId,
        leaveId: leaveId,
      },
      { where: { id: leave_id }, returning: true }
    );
    if (leaveFor === "TEAMMATE") {
      await db.essApplyLeaveDetail.update(
        {
          approved_start_date: startDate,
          approved_end_date: endDate,
          approved_days: leaveDays,
          approval_status: "APPROVED",
        },
        { where: { id: leaveApplied.id, employee_id } }
      );
    }
    const existingLeaveDocuments = await db.appliedLeaveDocuments.findAll({
      where: { isDeleted: false, applyDetailId: leave_id },
    });

    if (existingLeaveDocuments.length === 0) {
      console.log("Applied Leave with this id does not have any documents.");
    } else {
      let updatedAppliedLeaveDocuments = await db.appliedLeaveDocuments.update(
        { isDeleted: true },
        { where: { applyDetailId: leave_id }, returning: true }
      );
      await Promise.all(
        documents.map(async (leaveDoc) => {
          await db.appliedLeaveDocuments.create({
            uploaded_document: leaveDoc,
            applyDetailId: leave_id,
          });
        })
      );
    }

    const existing_days = await db.essLeavedaysDetail.findAll({
      where: {
        isDeleted: false,
        apply_leave_id: leave_id,
      },
    });
    if (existing_days.length === 0) {
      console.log("Leave Days Details do not exist");
    } else {
      await db.essLeavedaysDetail.update(
        { isDeleted: true },
        { where: { apply_leave_id: leave_id }, returning: true }
      );

      await Promise.all(
        days_details.map(async (details) => {
          const { leave_day, leave_date, leave_period } = details;
          const day_detail = await db.essLeavedaysDetail.create({
            leave_day,
            leave_date,
            leave_period,
            apply_leave_id: leave_id,
          });
          return day_detail;
        })
      );
    }

    return res
      .status(200)
      .send({
        message: "Applied leave has been updated successfully",
        data: {},
      });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error updating the leave:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// Delete Available Leave for employee
const deleteAppliedLeaveById = async (req, res) => {
  const { leave_id } = req.params;
  const requiredFields = ["leave_id"];
  for (const field of requiredFields) {
    if (req.params[field] === undefined || req.params[field] === null) {
      return res
        .status(400)
        .send({
          message: `Leave data incomplete: ${field} is missing`,
          data: [],
        });
    }
  }
  try {
    const existingAppliedDetail = await EssApplyLeaveDetail.findAll({
      where: { isDeleted: false, id: leave_id },
    });
    if (existingAppliedDetail.length === 0) {
      console.log("Applied Leave with this id does not exists.");
    }
    await EssApplyLeaveDetail.update(
      { isDeleted: true },
      { where: { id: leave_id }, returning: true }
    );

    const existingLeaveDocuments = await db.appliedLeaveDocuments.findAll({
      where: { isDeleted: false, applyDetailId: leave_id },
    });
    if (existingLeaveDocuments.length === 0) {
      console.log("Applied Leave with this id does not have any documents.");
    }
    await db.appliedLeaveDocuments.update(
      { isDeleted: true },
      { where: { applyDetailId: leave_id }, returning: true }
    );

    const existingLeaveDays = await db.essLeavedaysDetail.findAll({
      where: { isDeleted: false, apply_leave_id: leave_id },
    });
    if (existingLeaveDays.length === 0) {
      console.log("Applied Leave with this id does not have any leave days.");
    }
    await db.essLeavedaysDetail.update(
      { isDeleted: true },
      { where: { apply_leave_id: leave_id }, returning: true }
    );

    return res
      .status(200)
      .send({
        message: "Applied leave has been deleted successfully",
        data: [],
      });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error deleting the applied leave:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// Get Details and Restrictions for Leave By ID
const getleavedetailsbyleaveID = async (req, res) => {
  try {
    let { leave_id, entity_id } = req.query;

    const leave_details = await LeaveMasterModel.findAll({
      where: { id: leave_id, entity_id, isDeleted: false },
      include: [
        { model: db.leavePolicyDetail },
        { model: db.leavePolicyRestrictions },
      ],
    });
    return res
      .status(200)
      .send({
        message: "All leaves fetched Successfully!",
        data: leave_details,
      });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error getting leave master:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

///////////////////////For TeamMates /////////////////////////////
const get_allemployeeBY_managerID = async (req, res) => {
  try {
    const manager_id = req.params.manager_id;
    const employee_list = await db.user.findAll({
      where: {
        reporting_manager_id: manager_id,
        isDeleted: false,
        status: "ACTIVE",
      },
      attributes: [
        "employee_id",
        "title",
        "employee_code",
        "first_name",
        "last_name",
        "department_id",
        "location_id",
        "role_master_id",
        "marital_status",
        "gender",
        "designation_id",
      ],
    });
    if (employee_list) {
      return res
        .status(200)
        .send({
          message: "Employee fetched successfully",
          data: employee_list,
        });
    } else {
      return res.status(200).send({ message: "Employee Not Found", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error getting leave master:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

const getAll_leaves_tobeApproved = async (req, res) => {
  try {
    let { entity_id, employee_id, approval_status } = req.query;
    const leaveMasters = await LeaveMasterModel.findAll({
      where: {
        isDeleted: false,
        status: "ACTIVE",
        entity_id: entity_id,
      },
    });

    const employee_details = await db.user.findAll({
      where: {
        isDeleted: false,
        status: "ACTIVE",
        reporting_manager_id: employee_id,
      },
    });

    let employeeIds = employee_details.map((employee) => employee.employee_id);
    let leaveIds = leaveMasters.map((leaveMaster) => leaveMaster.id);
    const allEmployeeLeaves = await EssApplyLeaveDetail.findAll({
      where: {
        employee_id: employeeIds,
        // created_by: {
        //     [Op.not]: employee_id
        // },
        isDeleted: false,
        leaveId: leaveIds,
        approval_status,
      },
      include: [
        {
          model: LeaveMasterModel,
          attributes: ["leave_name", "total_available"],
        },
        {
          model: db.user,
          attributes: [
            "employee_id",
            "title",
            "employee_code",
            "first_name",
            "last_name",
            "location_id",
            "department_id",
            "role_master_id",
            "marital_status",
            "gender",
            "designation_id",
          ],
        },
      ],
    });
    if (allEmployeeLeaves.length > 0) {
      return res.status(200).send({
        message: "All leaves fetched for employee Successfully!",
        data: allEmployeeLeaves,
      });
    } else {
      return res
        .status(200)
        .send({ message: "Unable to find the applied leaves!", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error getting leave master:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

const update_leave_approvalstatus = async (req, res) => {
  try {
    const {
      applied_leave_id,
      approved_start_date,
      approved_end_date,
      approved_days,
      approval_status,
      remarks
    } = req.body;
    const update_status = await db.essApplyLeaveDetail.update(
      {
        approved_start_date,
        approved_end_date,
        approved_days,
        approval_status,
        remarks,
      },
      { where: { id: applied_leave_id } }
    );
    if (update_status && approval_status === "REJECTED") {
      return res
        .status(200)
        .send({
          message: "Leave Approval Rejected Successfully!",
          data: update_status,
        });
    } else if (update_status && approval_status === "APPROVED") {
      return res
        .status(200)
        .send({
          message: "Leave Approval Approved Successfully!",
          data: update_status,
        });
    } else {
      return res
        .status(200)
        .send({ message: "Unable to approve the leave!", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error getting leave master:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

module.exports = {
  applyLeave,
  getAllEmployeesByEntity,
  getAllAppliedLeavesForEmployee,
  getAllAppliedLeaveById,
  getAllLeavesByFilter,
  updateAppliedLeaveById,
  deleteAppliedLeaveById,
  getleavedetailsbyleaveID,
  get_allemployeeBY_managerID,
  getAll_leaves_tobeApproved,
  update_leave_approvalstatus,
  getEffectiveAppliedLeave,
};
