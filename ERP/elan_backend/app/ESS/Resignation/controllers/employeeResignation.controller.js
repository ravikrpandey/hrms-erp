const e = require("cors");
const db = require("../../../models/index");
const User = db.user;
const employeeResignationDetails = db.employeeResignation;
const allResignationDetails = db.All_Resignation_approval;
const employeeReviewDetails = db.All_Resignation_review;
const Grade_model = db.grade;
const notification_model = db.lms_author_notification;
const op = db.sequelize.op;
const moment = require("moment");
const { Op, where } = require("sequelize");
const logger = require("../../../../logger/index");
const WorkFlow = db.WorkFlow_Master;

const { sendemp } = require("../../../Recruitment/utils/mail/mail");

/////////////// Create Employee Resignation ///////////////

exports.createEmployeeResignation = async (req, res) => {
  try {
    const {
      id,
      employee_name,
      department,
      joining_date,
      job_location,
      notice_period,
      manager,
      resign_date,
      reason,
      employee_id,
      remarks,
      last_working_day,
      paid_leaves,
      reporting_manager_id,
      reporting_manager_name,
      entity_id,
      department_id,
    } = req.body;

    let newResignationRequest = {
      employee_name,
      department,
      joining_date,
      job_location,
      notice_period,
      manager,
      resign_date,
      reason,
      employee_id,
      remarks,
      last_working_day,
      paid_leaves,
      reporting_manager_id,
      reporting_manager_name,
      entity_id,
      department_id,
    };

    if (reason === "Other") {
      newResignationRequest.additional_remarks = remarks;
    }

    const getData = await WorkFlow.findOne({
      where: {
        entity_id: entity_id,
        department_id: department_id,
        job_name: "Resignation",
        status: "ACTIVE",
      },
      attributes: ["id"],
    });

    if (!getData) {
      return res.status(500).send({
        code: 500,
        message: "Workflow is not created for the required department and job!",
      });
    }

    let createdResignation = null;
    if (!id) {
      createdResignation = await db.employeeResignation.create(
        newResignationRequest
      );
    } else {
      createdResignation = await db.employeeResignation.update(
        newResignationRequest,
        {
          where: { id: id },
        }
      );
    }

    const resignationId = createdResignation.id;
    const dep_id = createdResignation.department_id;

    const getLevels = await db.Work_Flow_range.findAll({
      where: {
        workflow_id: getData.id,
        status: "ACTIVE",
      },
      attributes: ["level", "employee_id", "role_id", "workflow_id"],
    });

    const levelPromises = getLevels.map(async (level) => {
      const createdLevel = await db.Resignation_approval.create({
        level: level.level,
        employee_id: level.employee_id,
        workflow_id: level.workflow_id,
        resignnation_id: resignationId,
        role_id: level.role_id,
        department_id: dep_id,
      });
      return createdLevel;
    });

    await Promise.all(levelPromises);

    return res.status(200).send({
      code: 200,
      message: "Employee resignation request created successfully",
      data: createdResignation,
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error in createEmployeeResignationRequest:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/////////////// Edit Employee Resignation ///////////////

exports.editEmployeeResignation = async (req, res) => {
  try {
    const resignationId = req.params.id;
    const helpData = await employeeResignationDetails.findOne({
      where: { id: resignationId },
    });
    if (helpData) {
      const updateData = await employeeResignationDetails.update(req.body, {
        where: { id: resignationId },
      });
      return res
        .status(200)
        .send({ code: 200, message: "Updated Successfully", data: updateData });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Get ALL Employee Resignation ///////////////

exports.getAllEmployeeResignation = async (req, res) => {
  try {
    const getAllData = await employeeResignationDetails.findAll({
      where: {
        isDeleted: false,
        status: {
          [Op.ne]: "OFFBOARDING", // This excludes 'OFFBOARDING' status
        },
      },
    });

    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};
exports.getByIdAllEmployeeResignation = async (req, res) => {
  const login_user_id = req.params.id;

  try {
    const getAllData = await employeeResignationDetails.findAll({
      where: {
        employee_id: login_user_id,
        [Op.or]: [
          { status: "ACTIVE" },
          { status: "APPROVED" },
          { status: "DENIED" },
        ],
      },
      // include: [{
      //     model: User,
      //     // attributes: ["employee_id", "first_name", "department", "date_of_joining", "working_physical_location", "reporting_manager"]
      // }]
    });

    if (getAllData && getAllData.length > 0) {
      getAllData.sort().reverse();
      return res.status(200).send({
        code: 200,
        message: "Fetch All Data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  } 
};

/////////////// GetById Employee Resignation ///////////////

exports.getByIdEmployeeResignation = async (req, res) => {
  try {
    const id = req.params.id;

    const getDt = await db.employeeResignation.findAll({
      where: { id: id },
      include: [
        {
          model: db.Resignation_approval,
          required: false,
        },
      ],
    });

    if (getDt) {
      return res
        .status(200)
        .send({ code: 200, message: "Fetch data Successfully", data: getDt });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Delete Employee Resignation ///////////////

exports.deleteEmployeeResignation = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const employeeResignation = await employeeResignationDetails.findOne({
      where: { id: id },
    });
    if (employeeResignation) {
      await employeeResignationDetails.update(
        { isDeleted: true },
        { where: { id: id } }
      );
      return res
        .status(200)
        .send({ code: 200, message: "Data is Deleted Successfully!" });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

///////////////update status //////////////////
exports.Change_Resignation_status = async (req, res) => {
  try {
    console.log("====", req.body);
    const resignationId = req.params.id;
    const { employee_id, status, emp_id, resign_date, last_working_day } =
      req.body;
    const find_Hr_Admin = await User.findOne({
      where: { employee_id: emp_id },
    });
    if (find_Hr_Admin.role_master_id == 45) {
      const getData = await employeeResignationDetails.findOne({
        where: { employee_resignation_id: resignationId },
      });
      if (getData) {
        const getData2 = await employeeResignationDetails.update(
          {
            status,
          },
          { where: { employee_resignation_id: resignationId } }
        );
        const emp_data = await User.findOne({
          where: { employee_id: employee_id },
        });
        if (emp_data && status == "APPROVED") {
          const update_emp = await User.update(
            {
              status: "Notice_Period",
              date_of_resign: resign_date,
              last_working_date: last_working_day,
            },
            { where: { employee_id: employee_id } }
          );
          return res.status(200).send({
            code: 200,
            message: "Employee Employeement status Changed",
            data: getData,
          });
        } else {
          return res.status(200).send({
            code: 200,
            message: "Resignation Rejected",
            data: getData,
          });
        }
      } else {
        return res.status(403).send({ code: 403, message: "Record Not Found" });
      }
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "Your Role is not HR_Admin" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};
exports.get_all_Ex_Employee = async (req, res) => {
  try {
    let employData = await User.findAll({
      where: {
        [Op.or]: [{ status: "Ex_Employee" }, { status: "Terminated" }],
      },
    });
    employData.sort((a, b) => {
      return b.employee_id - a.employee_id;
    });
    if (employData) {
      return res
        .status(200)
        .send({ code: 200, message: "Ex Employee List", data: employData });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No EX- Employee List Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};
exports.get_all_pending_resignation = async (req, res) => {
  try {
    const resigned_employee = await employeeResignationDetails.findAll({
      where: { status: "PENDING", isDeleted: false },
    });
    if (resigned_employee) {
      return res.status(200).send({
        code: 200,
        message: "All Pending Resignation",
        data: resigned_employee,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Pending Resignation Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};
exports.get_all_approved_resignation = async (req, res) => {
  try {
    const resigned_employee = await employeeResignationDetails.findAll({
      where: { status: "APPROVED" },
    });
    if (resigned_employee) {
      return res.status(200).send({
        code: 200,
        message: "All Approved Resignation",
        data: resigned_employee,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Approved Resignation Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.get_all_Denied_resignation = async (req, res) => {
  try {
    const resigned_employee = await employeeResignationDetails.findAll({
      where: { status: "REJECTED" },
    });
    if (resigned_employee) {
      return res.status(200).send({
        code: 200,
        message: "All Denied Resignation",
        data: resigned_employee,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Denied Resignation Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};
//////////////////////////////////////////////////////////////////////////////////////
exports.get_all_pending_resigin = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const find_emp = await User.findOne({
      where: { employee_id: employee_id },
    });
    if (find_emp.role_master_id == 45) {
      const find_pending_emps = await employeeResignationDetails.findAll({
        where: { status: "PENDING" },
      });
      return res.status(200).send({
        code: 200,
        message: "All Pending Resignations",
        data: find_pending_emps,
      });
    } else {
      const find_emp = await employeeResignationDetails.findAll({
        where: {
          [Op.and]: [{ status: "PENDING" }, { employee_id: employee_id }],
        },
      });
      if (find_emp) {
        res
          .status(200)
          .send({ code: 200, message: "Pending Resignation", data: find_emp });
      } else {
        res
          .status(400)
          .send({ code: 400, message: "No Pending Resignations Found" });
      }
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};
exports.get_all_approved_resigin = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const find_emp = await User.findOne({
      where: { employee_id: employee_id },
    });
    if (find_emp.role_master_id == 45) {
      const find_pending_emps = await employeeResignationDetails.findAll({
        where: { status: "APPROVED" },
      });
      return res.status(200).send({
        code: 200,
        message: "All Approved Resignations",
        data: find_pending_emps,
      });
    } else {
      const find_emp = await employeeResignationDetails.findAll({
        where: {
          [Op.and]: [{ status: "APPROVED" }, { employee_id: employee_id }],
        },
      });
      if (find_emp) {
        res
          .status(200)
          .send({ code: 200, message: "Approved Resignation", data: find_emp });
      } else {
        res
          .status(400)
          .send({ code: 400, message: "No Approved Resignations Found" });
      }
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.get_all_denied_resigin = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const find_emp = await User.findOne({
      where: { employee_id: employee_id },
    });
    if (find_emp.role_master_id == 45) {
      const find_pending_emps = await employeeResignationDetails.findAll({
        where: { status: "DENIED" },
      });
      return res.status(200).send({
        code: 200,
        message: "All Denied Resignations",
        data: find_pending_emps,
      });
    } else {
      const find_emp = await employeeResignationDetails.findAll({
        where: {
          [Op.and]: [{ status: "PENDING" }, { employee_id: employee_id }],
        },
      });
      if (find_emp) {
        res
          .status(200)
          .send({ code: 200, message: "Denied Resignation", data: find_emp });
      } else {
        res
          .status(400)
          .send({ code: 400, message: "No Denied Resignations Found" });
      }
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.get_all_employee_Resign = async (req, res) => {
  try {
    const employee_id = req.params.id;
    const employee_resign_data = await employeeResignationDetails.findAll({
      where: { employee_id: employee_id },
    });
    if (employee_resign_data) {
      return res.status(200).send({
        code: 200,
        message: "Employee Resign Data",
        data: employee_resign_data,
      });
    } else {
      return res
        .status(400)
        .send({ code: 400, message: "No Resign data Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: "Internal Server Error" });
  }
};

exports.get_all_notice_period_serving_emp = async (req, res) => {
  try {
    const get_all_notice_period_emp = await User.findAll({
      where: { status: "Notice_Period" },
    });
    if (get_all_notice_period_emp) {
      return res.status(200).send({
        code: 200,
        message: "All Notice Period Employee",
        data: get_all_notice_period_emp,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Notice Period Employee" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
  }
};

exports.get_employee_resign_details = async (req, res) => {
  try {
    const employee_id = req.params.id;
    let employee_deatails = await User.findOne({
      where: { employee_id: employee_id },
    });
    if (employee_deatails) {
      const find_notice_period_days = await Grade_model.findOne({
        where: { grade_name: employee_deatails.grade },
      });
      employee_deatails.dataValues.notice_period_days =
        find_notice_period_days.Notice_period_days || null;
      // employee_deatails.dataValues.last_worskingday=moment().add(find_notice_period_days.Notice_period_days,"days")
      employee_deatails.dataValues.gradewithdays =
        employee_deatails.grade +
        "-" +
        find_notice_period_days.Notice_period_days;
      return res.status(200).send({
        code: 200,
        message: "Employee details",
        data: employee_deatails,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Employee details Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.change_notice_period_employee = async (req, res) => {
  try {
    const employee_id = req.body.employee_id;
    const verify_employee = await User.findOne({
      where: { employee_id: employee_id },
    });
    if (verify_employee.status == "Notice_Period") {
      const empData = await User.update(
        { status: "Ex_Employee" },
        { where: { employee_id: employee_id } }
      );
      return res
        .status(200)
        .send({ code: 200, message: "Employee Goes to Ex_Employee" });
    } else {
      return res
        .status(403)
        .send({ code: 403, message: "No Notice period Employee found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
  }
};

exports.approve_levels = async (req, res) => {
  try {
    const id = req.params.id;
    const { approvel_status, progressStatus, employee_id, status, remark } =
      req.body;

    const allLevelsData = await db.Resignation_approval.findAll({
      where: { employee_id, resignnation_id: id },
      order: [["level", "ASC"]],
    });
    if (!allLevelsData || allLevelsData.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No Level has been Assigned to this Employee!",
      });
    }
    const name = await db.user.findOne({
      where: { employee_id: employee_id },
      attributes: ["first_name"],
    });

    const email_id = await db.user.findOne({
      where: { employee_id: employee_id },
      attributes: ["emp_personal_email"],
    });

    const getdata = await db.employeeResignation.findOne({
      where: { id: id },
      attributes: ["entity_id"],
    });
    const maxLevel = await db.Resignation_approval.max("level", {
      where: { resignnation_id: id },
    });
    const currentLevelData = await db.Resignation_approval.findOne({
      attributes: ["level"],
      where: { employee_id, resignnation_id: id },
    });
    const currentLevelValue = currentLevelData?.level;
    if (!currentLevelValue) {
      return res.status(404).send({
        code: 404,
        message: "Current level not found for the given employee",
      });
    }
    await db.Resignation_approval.update(
      { approvel_status, progressStatus, remark },
      { where: { employee_id, resignnation_id: id } }
    );
    if (approvel_status === "REJECTED") {
      await db.Resignation_approval.update(
        { approvel_status },
        { where: { resignnation_id: id, employee_id } }
      );
    }
    if (status === "REJECTED") {
      await db.employeeResignation.update(
        { status: "REJECTED" },
        { where: { id: id } }
      );
    }
    if (currentLevelValue === maxLevel) {
      await db.employeeResignation.update(
        { status: approvel_status },
        { where: { id: id } }
      );
      return res.status(200).send({
        code: 200,
        message: "Updated Successfully",
      });
    } else if (currentLevelValue === "REJECTED") {
      return res.status(200).send({
        code: 200,
        message: "Final Approval Rejected Successfully!",
      });
    }
    sendemp(approvel_status, name, getdata, email_id);
    return res.status(200).send({
      code: 200,
      message: "Updated Successfully!",
    });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.create_all_resignation = async (req, res) => {
  try {
    const {
      name,
      employee_number,
      reporting_manager,
      feedbacks,
      employee_id,
      resignnation_id,
    } = req.body;

    const data = await allResignationDetails.findOne({
      where: { employee_id: employee_id, isDeleted: false },
    });
    if (data) {
      return res
        .status(409)
        .send({
          code: 409,
          message: "Employee Already Has a Resignation Record!",
        });
    }

    const resignationData = await allResignationDetails.create({
      name,
      resignnation_id,
      employee_id,
      employee_number,
      reporting_manager,
      is_deleted: false,
    });

    if (Array.isArray(feedbacks)) {
      const reviewCommentPairs = feedbacks.map((feedback) => ({
        employee_id,
        review: feedback.review,
        comment: feedback.comment || "",
        checklist_remark: "",
        review_id: resignationData.id,
      }));
      const reviewData = await employeeReviewDetails.bulkCreate(
        reviewCommentPairs
      );

      return res
        .status(200)
        .send({ code: 200, message: "Created Successfully", data: reviewData });
    } else {
      return res
        .status(400)
        .send({
          code: 400,
          message: "Feedbacks data is missing or malformed.",
        });
    }
  } catch (error) {
    console.log(error);
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.get_all_resignation_list = async (req, res) => {
  try {
    const getAllData = await allResignationDetails.findAll({
      order: [["id"]],
      where: {
        isDeleted: false,
        status: "PENDING",
      },
    });

    if (getAllData && getAllData.length > 0) {
      const processedData = getAllData.map((item) => {
        if (item.comments) {
          const splitComments = item.comments
            .split(",")
            .map((str) => str.trim());

          const transformedComments = splitComments.map((curr) => {
            return { value: curr };
          });

          item.comments = transformedComments;
        }
        return item;
      });

      return res.status(200).send({
        code: 200,
        message: "Fetch All Data Successfully",
        data: processedData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.get_all_approved_resignation_list = async (req, res) => {
  try {
    const getAllData = await allResignationDetails.findAll({
      order: [["id"]],
      where: {
        isDeleted: false,
        status: "APPROVED",
      },
    });

    if (getAllData && getAllData.length > 0) {
      const processedData = getAllData.map((item) => {
        if (item.comments) {
          const splitComments = item.comments
            .split(",")
            .map((str) => str.trim());

          const transformedComments = splitComments.map((curr) => {
            return { value: curr };
          });

          item.comments = transformedComments;
        }
        return item;
      });

      return res.status(200).send({
        code: 200,
        message: "Fetch All Data Successfully",
        data: processedData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.editAllResignation = async (req, res) => {
  try {
    const updates = req.body;
    const id = parseInt(req.params.id);
    const helpData = await allResignationDetails.findOne({
      where: { id: id },
    });

    await db.employeeResignation.update(
      { status: "OFFBOARDING" },
      {
        where: { id: helpData.resignnation_id },
      }
    );
    await db.user_login.update(
      { status: "INACTIVE"},
      {
        where: {employee_id: helpData.employee_id},
      }
    )
    if (helpData.status === "PENDING") {
      helpData.status = "APPROVED";
      const updateData = await helpData.update({
        status: "APPROVED",
      });
      const updatePromises = updates.map((item) => {
        return db.All_Resignation_review.update(
          { checklist_remark: item.checklist_remark },
          { where: { id: item.id, review_id: id } }
        );
      });
      await Promise.all(updatePromises);
    }


    res.status(200).json({ message: "Resignations updated successfully" });
  } catch (error) {
    console.error("Error updating resignations: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating resignations" });
  }
};

exports.getAllOffboardingEmployee = async (req, res) => {
  try {
    const getAllData = await employeeResignationDetails.findAll({
      where: {
        isDeleted: false,
        status: "OFFBOARDING",
      },
    });

    if (getAllData && getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getAllReviewList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const reviews = await db.All_Resignation_review.findAll({
      where: {
        review_id: id,
      },
    });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.withdrawn_resignation = async (req, res) => {
  try {
    const employee_resignation_id = req.params.id;
    const employee_id = req.params.emp_id;
    const emp_resign_data = await employeeResignationDetails.findOne({
      where: { employee_resignation_id: employee_resignation_id },
    });
    const employee_data = await User.findOne({
      where: { employee_id: employee_id },
    });
    if (emp_resign_data && employee_data) {
      const withdrawn_resignation_data =
        await employeeResignationDetails.update(
          { status: "Withdraw" },
          { where: { employee_resignation_id: employee_resignation_id } }
        );
      const employee_status = await User.update(
        { status: "ACTIVE" },
        { where: { employee_id: employee_id } }
      );
      const create_notification = await notification_model.create({
        employee_id: employee_data.reporting_manager_id,
        emp_name: employee_data.reporting_manager,
        remark: `${employee_data.first_name} has withdraw the Resignation`,
        type: "Employee Resignation",
      });
      return res
        .status(200)
        .send({ code: 200, message: "Resignation Withdraw" });
    } else {
      return res
        .status(400)
        .send({ code: 400, message: "No Resignation Found With Employee id" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server error" });
  }
};
