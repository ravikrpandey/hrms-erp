const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const db = require("../../../models");
const LeaveMasterModel = db.leave_master;
const { Op } = require("sequelize");
const jobApproval = require("../../../ESS/job_request/model/jobApproval");
const LeaveEntitlementModel = db.leavePolicyEntitlement;
const LeaveRestrictionModels = db.leavePolicyRestrictions;
const LeaveDetailModel = db.leavePolicyDetailModel;
const ApplicabilityAllModel = db.applicabilityAll;
const DepartmentsModel = db.appDepartment;
const DesignationModel = db.appDesignation;
const LocationModel = db.appLocation;
const MaritalModel = db.appMarital;
const GenderModel = db.appGender;
const RestrictionsDurations = db.restrictionsDurations
const LeaveApplyESS = db.essApplyLeaveDetail



/** Add Leave */
const addLeaveMaster = async (req, res) => {
    let { leave_name, leave_code, leave_total, is_status, isDeleted, financial_year_id, entity_id, employee_id } = req.body;
    const requiredFields = ["leave_name", "leave_code", "leave_total", "is_status", "isDeleted", "financial_year_id", "entity_id", "employee_id"];

    for (const field of requiredFields) {
        if (req.body[field] === undefined || req.body[field] === null) {
            return res.status(400).send({ message: `Leave payload is incomplete: ${field} is missing`, data: [] });
        }
    }
    try {
        let info = {
            leave_name: leave_name,
            leave_code: leave_code,
            status: is_status,
            total_available: leave_total,
            isDeleted: isDeleted,
            financial_year_id: financial_year_id,
            entity_id: entity_id,
            employee_id: employee_id
        };

        let leaveCode = req.body.leave_code;
        let leaveName = req.body.leave_name;
        const existingLeave = await LeaveMasterModel.findAll({
            where: {
                [Op.or]: [
                    // { leave_name: leaveName },
                    { leave_code: leaveCode },
                ],
                [Op.and]: [
                    { isDeleted: false },
                    { entity_id: entity_id },
                    // { employee_id: employee_id },
                    // { financial_year_id: financial_year_id }
                ]
            }
        });

        if (existingLeave.length > 0) {
            return res.status(400).json({ message: "Leave with the same name or code already exists." });
        }

        const newLeave = await LeaveMasterModel.create(info);
        return res.status(200).send({ message: 'Leave has been created successfully', data: newLeave });
    } catch (error) {
         
        console.error('Error creating leave ', error);
        return res.status(500).send({ message: error.message, data: { error } });
    }

};

/** Get All Leaves */
const getAllLeaves = async (req, res) => {

    let { financial_year_id, entity_id, employee_id } = req.params;

    // Validation checks
    const requiredFields = ["financial_year_id", "entity_id", "employee_id"];

    for (const field of requiredFields) {
        if (req.params[field] === undefined || req.params[field] === null) {
            return res.status(400).send({ message: `Leave payload is incomplete: ${field} is missing`, data: [] });
        }
    }

    try {
        const allLeaves = await LeaveMasterModel.findAll({
            where: {
                [Op.and]: [
                    { isDeleted: false },
                    { entity_id: entity_id },
                    // { financial_year_id: financial_year_id }
                ]
            }
        });
        return res.status(200).send({ message: "All leaves fetch Successfully!", data: allLeaves });

    } catch (error) {
         
        console.error('Error getting leave master:', error);
        return res.status(500).send({ message: "Error in getting leaves", data: {} });
    }

}

/** Get Leave By Id */
const getLeaveById = async (req, res) => {

    const { leave_id } = req.params; // assuming leave_id is in URL params
    // Validation checks
    const requiredFields = ["leave_id"];
    for (const field of requiredFields) {
        if (req.params[field] === undefined || req.params[field] === null) {
            return res.status(400).send({ message: `Leave payload is incomplete: ${field} is missing`, data: [] });
        }
    }

    try {

        let leaveById = await LeaveMasterModel.findOne({
            where: { isDeleted: false, id: leave_id }
        });
        if (!leaveById) {
            return res.status(404).send({ message: "Leave not found!", data: {} });
        }

        return res.status(200).send({ message: "Leave fetched successfully!", data: leaveById });
    } catch (error) {
         
        console.error('Error fetching the leave by Id:', error);
        return res.status(500).send({ message: 'Error in fetching leave', data: {} });
    }

};

/** Update Leave By Id*/
const updateLeaveById = async (req, res) => {
    try {
        let { leave_id } = req.params;
        leave_id = parseInt(leave_id);
        let { leave_name, leave_code, is_status, leave_total, financial_year_id, entity_id } = req.body;
        const existingLeave = await LeaveMasterModel.findAll({
            where: {
                [Op.or]: [
                    // { leave_name: leave_name },
                    { leave_code: leave_code }
                ],
                [Op.and]: [
                    { id: { [Op.ne]: leave_id } },
                    { isDeleted: false },
                    // { financial_year_id: financial_year_id },
                    { entity_id: entity_id },
                ]
            }
        });

        if (existingLeave.length > 0) {
            return res.status(400).json({ message: "Leave with the same name or code already exists" });
        }
        let updatedLeave = await LeaveMasterModel.update(
            { leave_name: leave_name, leave_code: leave_code, status: is_status, total_available: leave_total },
            { where: { id: leave_id }, returning: true });

        return res.status(200).send({ message: "Leave updated successfully", data: updatedLeave });
    } catch (error) {
         
        return res.status(500).send({ message: 'Error in updating the leave', data: { error } });
    }
};

/** Update Leave Status*/
const updateLeaveStatusById = async (req, res) => {

    let { leave_id } = req.params;
    let { is_status } = req.body;

    if (!leave_id || leave_id == null || leave_id == undefined) {
        return res.status(400).send({ message: 'Leave data fields are incomplete', data: {} });
    }
    // Validation checks
    const requiredFields = ["is_status"];
    for (const field of requiredFields) {
        if (req.body[field] === undefined || req.body[field] === null) {
            return res.status(400).send({ message: `Leave payload is incomplete: ${field} is missing`, data: [] });
        }
    }

    try {
        // Check if is_status is 1 and is_deleted is 0
        let updatedLeave = await LeaveMasterModel.update(
            { status: is_status },
            { where: { id: leave_id }, returning: true });

        return res.status(200).send({ message: "Leave status updated successfully", data: {} });
    } catch (error) {
         
        console.error('Error updating the leave:', error);
        return res.status(500).send({ message: 'Error in updating the leave', data: {} });
    }
};

/** Delete Leave By Id*/
const deleteLeaveById = async (req, res) => {

    const { leave_id } = req.params;
    const { status } = req.body;
    try {
        await LeaveMasterModel.update({ isDeleted: true }, { where: { id: leave_id } });
        await Promise.all([
            LeaveDetailModel.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            LeaveEntitlementModel.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            LeaveRestrictionModels.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            ApplicabilityAllModel.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            DepartmentsModel.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            DesignationModel.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            LocationModel.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            MaritalModel.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            GenderModel.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            RestrictionsDurations.update({ isDeleted: true }, { where: { leaveId: leave_id } }),
            LeaveApplyESS.update({ isDeleted: true }, { where: { leaveId: leave_id } })
        ]);
        return res.status(200).send({ message: 'Leave deleted successfully', data: [] });
    } catch (error) {
         
        console.error('Error deleting the leave:', error);
        res.status(500).send({ message: 'Error in deleting the leave' });
    }
};

const generate_leave_Code = async (req, res) => {
    try {
        const { leave_name } = req.body;
        const leave_Variable = "LV";
        if (!leave_name) {
            return res.status(400).send({ code: 400, message: "Please select leave_name first", data: null });
        }
        const lastEntry = await LeaveMasterModel.findOne({
            where: { status: "ACTIVE" },
            order: [["id", "DESC"]],
            attributes: ["leave_code"],
        });
        let number = 1;
        if (lastEntry && lastEntry.leave_code) {
            const lastNumber = parseInt(lastEntry.leave_code.slice(-5), 10);
            if (!isNaN(lastNumber)) {
                number = lastNumber + 1;
            }
        }
        const code = String(number).padStart(5, "0");
        const Leave_code = `${leave_Variable}${code}`;
        return res.status(200).send({ code: 200, message: "Leave code has been generated", data: Leave_code });
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Internal Server Error" });
    }
};

const getLeaveDetails = async (req, res) => {
  const { id, financial_year_id } = req.params;
  try {
    const employeeData = await db.essApplyLeaveDetail.findAll({
      where: {
        employee_id: id,
        financial_year_id,
        isDeleted: false,
        approval_status:"APPROVED"
      },
      include: [
        {
          model: db.user,
          where: { employee_id: id },
          attributes: ["employee_code", "first_name", "middle_name", "last_name"],
        },
        {
          model: db.leave_master,
          attributes: ["leave_name"]
        }
      ],
    });

    if (!employeeData || employeeData.length === 0) {
      return res.status(201).send({ code: 201, message: "No Employee found with this Id!" });
    }

    const leaveIds = employeeData.map(item => item.id).filter(id => !!id); // filter out undefined/null if any

    const daysDetails = await db.essLeavedaysDetail.findAll({
      where: {
        apply_leave_id: leaveIds,
        status:"ACTIVE"
      },
      order: [['leave_date', 'DESC']]
    });

    return res.status(200).send({
      code: 200,
      message: "Leave data found successfully!",
      data: employeeData,
      daysDetails,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal server error"
    });
  }
};


const cancelEmployeeLeave = async (req, res) => {
  const leaveRequests = req.body; 

  try {
    let totalCredited = 0;

    for (const leave of leaveRequests) {
      const { employee_id, leaveId, financial_year_id, start_date, end_date } = leave;

        const leaveRecord = await db.essApplyLeaveDetail.findOne({
            where: {
                employee_id,
                leaveId,
                financial_year_id,
                isDeleted: false,
                start_date: { [Op.lte]: start_date },
                end_date: { [Op.gte]: end_date }
            },
        });

        if (!leaveRecord) {
            continue; 
        }

      const leaveDays = await db.essLeavedaysDetail.findAll({
        where: {
          apply_leave_id: leaveRecord.id,
          status: 'ACTIVE',
        },
      });

      const matchingDay = await db.essLeavedaysDetail.findOne({
  where: {
    apply_leave_id: leaveRecord.id,
    leave_date: start_date, 
    status: 'ACTIVE'
  }
});

if (matchingDay) {
  let creditAmount = 0;

  if (matchingDay.deduction_done == 0) {
    await db.essLeavedaysDetail.update(
      { status: 'INACTIVE' },
      { where: { id: matchingDay.id } }
    );
  } else {
    
    if (matchingDay.leave_period == 0) creditAmount = 1;
    else if (matchingDay.leave_period == 1) creditAmount = 0.5;

    await db.hrmsLeaveAllotment.increment(
      { available_days: creditAmount },
      {
        where: {
          employee_id,
          leave_id: leaveId,
        },
      }
    );

    await db.essLeavedaysDetail.update(
      { status: 'INACTIVE' },
      { where: { id: matchingDay.id } }
    );

    totalCredited += creditAmount;
  }
}

      leaveRecord.cancel_flag = true;
      await leaveRecord.save();
    }

    return res.status(200).json({
      message: 'Leave entries cancelled successfully.',
      credited_leave_days: totalCredited,
    });
  } catch (error) {
    console.error('Error cancelling leave:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const getLeaveDetailsByEmployee = async (req, res) => {
  const { id, financial_year_id } = req.params;
  try {
    const employeeData = await db.essApplyLeaveDetail.findAll({
      where: {
        employee_id: id,
        financial_year_id,
        isDeleted: false,
        approval_status:"APPROVED"
      },
      include: [
        {
          model: db.user,
          where: { employee_id: id },
          attributes: ["employee_code", "first_name", "middle_name", "last_name"],
        },
        {
          model: db.leave_master,
          attributes: ["leave_name"]
        }
      ],
    });

    if (!employeeData || employeeData.length === 0) {
      return res.status(201).send({ code: 201, message: "No Employee found with this Id!" });
    }

    const leaveIds = employeeData.map(item => item.id).filter(id => !!id); // filter out undefined/null if any

    const daysDetails = await db.essLeavedaysDetail.findAll({
      where: {
        apply_leave_id: leaveIds,
        status:"INACTIVE"
      },
      order: [['updatedAt', 'DESC']]
    });

    return res.status(200).send({
      code: 200,
      message: "Leave data found successfully!",
      data: employeeData,
      daysDetails,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal server error"
    });
  }
};


const getAllCancelLeave = async (req, res) => {
  const { entity_id, financial_year_id } = req.params;

  try {
    const query = `
      SELECT LDD.*, LD.*, RU.*
      FROM ESS_APPLIED_LEAVE_DAYS_DETAIL AS LDD
      LEFT JOIN ESS_APPLIED_LEAVE_DETAIL AS LD ON LD.id = LDD.apply_leave_id
      LEFT JOIN HRMS_REGISTERED_USER AS RU ON LD.employee_id = RU.employee_id
      WHERE RU.primary_entity_id = :entity_id
        AND LD.financial_year_id = :financial_year_id
        AND LDD.status = 'INACTIVE'
      ORDER BY LDD.updatedAt DESC
    `;

    const employeeData = await db.sequelize.query(query, {
      replacements: { entity_id, financial_year_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!employeeData || employeeData.length === 0) {
      return res.status(201).send({ code: 201, message: "No Employee found with this Id!" });
    }

    return res.status(200).send({
      code: 200,
      message: "Leave data found successfully!",
      data: employeeData
    });

  } catch (error) {
    console.error("Error in getAllCancelLeave:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal server error"
    });
  }
};



module.exports = {
    addLeaveMaster,
    getAllLeaves,
    getLeaveById,
    updateLeaveById,
    deleteLeaveById,
    updateLeaveStatusById,
    generate_leave_Code,
    getLeaveDetails,
    cancelEmployeeLeave,
    getLeaveDetailsByEmployee,
    getAllCancelLeave
};
