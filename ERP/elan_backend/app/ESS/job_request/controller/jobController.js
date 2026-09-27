const db = require("../../../models/index");
const { Op, where } = require("sequelize");
const WorkFlow = db.WorkFlow_Master
const userdetail = db.user;
const logger = require('../../../../logger/index');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: "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" });
const OpenAIApi = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai");


exports.getALL_job_request = async (req, res) => {
  try {
    const { user_id, entity_id, user_role, financial_year_id } = req.query;
    let job_request_details;
    if (user_role == 'Super Admin') {
      job_request_details = await db.sequelize.query(
        `SELECT JR.*, JR.entity_id, EM.entity_name, MC.contract_type, MFY.financial_year, HRU.first_name, HRU.last_name, JR.user_id,
         MD.department_name, MA.area_name, MB.branch_name, D.designation_name, MRR.reason_for_recruitment, MCC.cost_center_name
         FROM ESS_JOB_REQUEST AS JR
         INNER JOIN ENTITY_MASTER AS EM ON EM.id = JR.entity_id
         INNER JOIN MASTER_CONTRACT AS MC ON MC.id = JR.contract_types_id
         INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON MFY.id = JR.financial_id
         INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = JR.user_id
         INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = JR.department_id
         INNER JOIN MASTER_AREA AS MA ON MA.id = JR.area_id
         INNER JOIN MASTER_BRANCH AS MB ON MB.id = JR.branch_id
         INNER JOIN DESIGNATION AS D ON D.designation_id = JR.designation_id
         INNER JOIN MASTER_REASON_RECRUITMENT AS MRR ON MRR.id = JR.reason_id
         LEFT JOIN FINANCE_COST_CENTER AS MCC ON MCC.id = JR.cost_center_id
         WHERE JR.entity_id = ${entity_id} AND JR.financial_id=${financial_year_id} AND JR.isDeleted = 0
          ORDER BY JR.id DESC`,
        {
          type: db.sequelize.QueryTypes.SELECT
        }
      );
    } else {
      job_request_details = await db.sequelize.query(
        `SELECT JR.*, JR.entity_id, EM.entity_name, MC.contract_type, MFY.financial_year, HRU.first_name, HRU.last_name, JR.user_id,
         MD.department_name, MA.area_name, MB.branch_name, D.designation_name, MRR.reason_for_recruitment, MCC.cost_center_name
         FROM ESS_JOB_REQUEST AS JR
         INNER JOIN ENTITY_MASTER AS EM ON EM.id = JR.entity_id
         INNER JOIN MASTER_CONTRACT AS MC ON MC.id = JR.contract_types_id
         INNER JOIN MASTER_FINANCIAL_YEAR AS MFY ON MFY.id = JR.financial_id
         INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = JR.user_id
         INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = JR.department_id
         INNER JOIN MASTER_AREA AS MA ON MA.id = JR.area_id
         INNER JOIN MASTER_BRANCH AS MB ON MB.id = JR.branch_id
         INNER JOIN DESIGNATION AS D ON D.designation_id = JR.designation_id
         INNER JOIN MASTER_REASON_RECRUITMENT AS MRR ON MRR.id = JR.reason_id
         LEFT JOIN FINANCE_COST_CENTER AS MCC ON MCC.id = JR.cost_center_id
         WHERE JR.user_id = ${user_id} AND JR.entity_id = ${entity_id} AND JR.financial_id=${financial_year_id} AND JR.isDeleted = 0
         ORDER BY JR.id DESC`,
        {
          type: db.sequelize.QueryTypes.SELECT
        }
      );
    }

    if (job_request_details.length > 0) {
      return res.status(200).send({ code: 200, message: "Job Details found", data: job_request_details });
    } else {
      return res.status(404).send({ code: 404, message: "No Job Details found for the given user_id and entity_id", data: [] });
    }

  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.getID_job_request = async (req, res) => {
  try {
    const jobId = req.params.id;
    const jobData = await db.sequelize.query(
      `SELECT JR.id, JR.cost_center_id, JR.job_title, JR.leadership, JR.start_date, JR.end_date,
        JR.job_specification, JR.upload_document, JR.editor_msg, JR.budget_status,
        JR.budget_Justification, JR.final_status, JR.entity_id, JR.contract_types_id,
        JR.financial_id, JR.user_id, JR.department_id, JR.area_id, JR.branch_id,
        JR.designation_id, JR.reason_id, EM.entity_name, MC.contract_type, MFY.financial_year,
        HRU.first_name AS requested_by_first_name, HRU.last_name AS requested_by_last_name,
        U.first_name AS created_by_first_name, MD.department_name, MA.area_name,
        MB.branch_name, D.designation_name, MRR.reason_for_recruitment, MCC.cost_center_name
        FROM ESS_JOB_REQUEST JR
        INNER JOIN ENTITY_MASTER EM ON EM.id = JR.entity_id
        INNER JOIN MASTER_CONTRACT MC ON MC.id = JR.contract_types_id
        INNER JOIN MASTER_FINANCIAL_YEAR MFY ON MFY.id = JR.financial_id
        INNER JOIN HRMS_REGISTERED_USER HRU ON HRU.employee_id = JR.user_id
        INNER JOIN MASTER_DEPARTMENT MD ON MD.dept_id = JR.department_id
        INNER JOIN MASTER_AREA MA ON MA.id = JR.area_id
        INNER JOIN MASTER_BRANCH MB ON MB.id = JR.branch_id
        INNER JOIN DESIGNATION D ON D.designation_id = JR.designation_id
        INNER JOIN MASTER_REASON_RECRUITMENT MRR ON MRR.id = JR.reason_id
        INNER JOIN HRMS_REGISTERED_USER U ON U.employee_id = JR.user_id
        LEFT JOIN FINANCE_COST_CENTER MCC ON MCC.id = JR.cost_center_id
        WHERE JR.id = :jobId`,
      {
        replacements: { jobId },
        type: db.sequelize.QueryTypes.SELECT
      }
    );

    if (jobData.length > 0) {
      return res.status(200).send({ code: 200, message: "Job Details Found", data: jobData[0] });
    } else {
      return res.status(404).send({ code: 404, message: "Job Details Not Found", data: [] });
    }

  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error('Error fetching job details:', error);
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.delete_job_request = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const createdJob = await db.Job_Request.update({ isDeleted: true },
        { where: { id: id } }
      );
      if (createdJob) {
        return res.status(200).send({
          code: 200,
          message: 'Job request deleted successfully'
        });
      }
    }
    else {
      res.status(500).send({ code: 500, message: error.message || "Id is not round!" });
    }

  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error in createJob_request:", error);
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.createJob_request = async (req, res) => {
  try {
    const {
      id, entity_id, contract_types_id, financial_id, user_id, department_id, area_id, branch_id, designation_id, job_title, upload_document,
      leadership, start_date, end_date, job_specification, editor_msg, budget_status, budget_Justification, reason_id, cost_center_id, created_by
    } = req.body;

    let newJobRequest = {
      entity_id, contract_types_id, financial_id, user_id, department_id, area_id,
      branch_id, designation_id, job_title, leadership, start_date, end_date,
      job_specification, upload_document, editor_msg, budget_status, reason_id, created_by
    };

    if (budget_status === 'NO') {
      newJobRequest.budget_Justification = budget_Justification;
    } else {
      newJobRequest.cost_center_id = cost_center_id;
    }
    const getData = await WorkFlow.findOne({
      where: {
        entity_id: entity_id,
        department_id: department_id,
        job_name: "Job Request",
        status: "ACTIVE"
      },
      attributes: ["id"]
    });

    if (!getData) {
      return res.status(500).send({
        code: 500,
        message: "Workflow is not created for required department and job!"
      });
    }

    let createdJob = null;
    if (!id) {
      createdJob = await db.Job_Request.create(newJobRequest);
    }
    else {
      createdJob = await db.Job_Request.update(newJobRequest,
        { where: { id: id } }
      );
    }

    const jobId = createdJob.id;
    const dep_id = createdJob.department_id;


    const getLevels = await db.Work_Flow_range.findAll({
      where: {
        workflow_id: getData.id,
        status: "ACTIVE"
      },
      attributes: ["level", "employee_id", "role_id", "workflow_id"]
    });

    const levelPromises = getLevels.map(async (level) => {
      const createdLevel = await db.Job_approval.create({
        level: level.level,
        employee_id: level.employee_id,
        workflow_id: level.workflow_id,
        job_request_id: jobId,
        role_id: level.role_id,
        department_id: dep_id,
      });
      return createdLevel;
    });

    await Promise.all(levelPromises);

    return res.status(200).send({
      code: 200,
      message: 'Job request created successfully',
      data: createdJob
    });

  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error in createJob_request:", error);
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_levels_to_be_approved = async (req, res) => {
  try {
    const { loggedEmployeeId, entity_id, financial_year_id } = req.query;
    const query = `
    SELECT pp.*,JR.*,HRU.first_name,HRU.last_name,MD.department_name,MA.area_name,
    MB.branch_name,D.designation_name,MC.contract_type,R.reason_for_recruitment,F.cost_center_name
    FROM ESS_JOB_APPROVEL_LEVEL AS pp
    INNER JOIN ESS_JOB_REQUEST AS JR ON JR.id = pp.job_request_id
    INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = JR.user_id
    INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = JR.department_id
    INNER JOIN MASTER_AREA AS MA ON MA.id = JR.area_id
    INNER JOIN MASTER_BRANCH AS MB ON MB.id = JR.branch_id
    INNER JOIN DESIGNATION AS D ON D.designation_id = JR.designation_id
    INNER JOIN MASTER_CONTRACT AS MC ON JR.contract_types_id = MC.id
    INNER JOIN MASTER_REASON_RECRUITMENT AS R ON JR.reason_id = R.id
    LEFT JOIN FINANCE_COST_CENTER AS F ON JR.cost_center_id = F.id
    WHERE pp.employee_id =${loggedEmployeeId} AND JR.entity_id = ${entity_id} AND JR.financial_id=${financial_year_id}
    AND pp.status = 'ACTIVE' 
    AND pp.approvel_status = 'PENDING'
    AND NOT EXISTS (
        SELECT 1
        FROM ESS_JOB_APPROVEL_LEVEL AS prev
        WHERE prev.job_request_id = pp.job_request_id 
          AND prev.level < pp.level
          AND prev.approvel_status != 'APPROVED'
      )
      `;

    const getAllData = await db.sequelize.query(query, {
      replacements: { employeeId: loggedEmployeeId },
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All JOB Data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "Record Not Found !",
        data: []

      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
}

exports.get_Rejected_Approvals = async (req, res) => {
  try {
    const { employee_id, entity_id, financial_year_id } = req.query;
    let getAllData;
    const query = `
    SELECT pp.*,JR.*,HRU.first_name,HRU.last_name,MD.department_name,MA.area_name,MB.branch_name,D.designation_name,
    MC.contract_type,F.cost_center_name,R.reason_for_recruitment
    FROM ESS_JOB_APPROVEL_LEVEL AS pp
    INNER JOIN ESS_JOB_REQUEST AS JR ON JR.id = pp.job_request_id
    INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = JR.user_id
    INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = JR.department_id
    INNER JOIN MASTER_AREA AS MA ON MA.id = JR.area_id
    INNER JOIN MASTER_BRANCH AS MB ON MB.id = JR.branch_id
    INNER JOIN DESIGNATION AS D ON D.designation_id = JR.designation_id
    INNER JOIN MASTER_CONTRACT AS MC ON JR.contract_types_id = MC.id
    LEFT JOIN FINANCE_COST_CENTER AS F ON JR.cost_center_id = F.id
    INNER JOIN MASTER_REASON_RECRUITMENT AS R ON JR.reason_id = R.id
      WHERE pp.employee_id = '${employee_id}' AND JR.entity_id = ${entity_id} AND JR.financial_id=${financial_year_id}
      AND pp.approvel_status = 'REJECTED'
      ORDER BY pp.id DESC;`;
    getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });


    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Product Successfully",
        data: getAllData,
      });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "Record Not Found", data: [] });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_Approved_Approvals = async (req, res) => {
  try {
    const { employee_id, entity_id, financial_year_id } = req.query;
    const query = `
    SELECT pp.*,JR.*,HRU.first_name,HRU.last_name,MD.department_name,MA.area_name,MB.branch_name,D.designation_name,
    MC.contract_type,F.cost_center_name,R.reason_for_recruitment
    FROM ESS_JOB_APPROVEL_LEVEL AS pp
    INNER JOIN ESS_JOB_REQUEST AS JR ON JR.id = pp.job_request_id
    INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = JR.user_id
    INNER JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = JR.department_id
    INNER JOIN MASTER_AREA AS MA ON MA.id = JR.area_id
    INNER JOIN MASTER_BRANCH AS MB ON MB.id = JR.branch_id
    INNER JOIN DESIGNATION AS D ON D.designation_id = JR.designation_id
    INNER JOIN MASTER_CONTRACT AS MC ON JR.contract_types_id = MC.id
    LEFT JOIN FINANCE_COST_CENTER AS F ON JR.cost_center_id = F.id
    INNER JOIN MASTER_REASON_RECRUITMENT AS R ON JR.reason_id = R.id
      WHERE pp.employee_id = '${employee_id}' AND JR.entity_id = ${entity_id} AND JR.financial_id=${financial_year_id}
      AND pp.approvel_status = 'APPROVED'
      ORDER BY pp.id DESC;
      `;
    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Approved Approvals Successfully !",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Approved Approvals Found for This Employee !",
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.approve_levels = async (req, res) => {
  try {
    const job_Id = req.params.id;
    const { approvel_status, progressStatus, employee_id, final_status, remark } = req.body;

    const allLevelsData = await db.Job_approval.findAll({
      where: { employee_id, job_request_id: job_Id },
      order: [["level", "ASC"]],
    });
    if (!allLevelsData || allLevelsData.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No Level has been Assigned to this Employee!",
      });
    }
    const maxLevel = await db.Job_approval.max("level", {
      where: { job_request_id: job_Id },
    });
    const currentLevelData = await db.Job_approval.findOne({
      attributes: ["level"],
      where: { employee_id, job_request_id: job_Id },
    });
    const currentLevelValue = currentLevelData?.level;
    if (!currentLevelValue) {
      return res.status(404).send({
        code: 404,
        message: "Current level not found for the given employee",
      });
    }
    await db.Job_approval.update(
      { approvel_status, progressStatus, remark },
      { where: { employee_id, job_request_id: job_Id } }
    );
    if (approvel_status === "REJECTED") {
      await db.Job_approval.update(
        { approvel_status },
        { where: { job_request_id: job_Id, employee_id } }
      );
    }
    if (final_status === "REJECTED") {
      await db.Job_Request.update(
        { final_status: "REJECTED" },
        { where: { id: job_Id } }
      );
    }
    if (currentLevelValue === maxLevel) {
      await db.Job_Request.update(
        { final_status: approvel_status },
        { where: { id: job_Id } }
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

exports.getAll_Approval_level = async (req, res) => {
  try {
    const job_id = req.params.id;
    const { dep_id, employeeId } = req.body;

    const getData = await db.Job_approval.findAll({
      where: {
        job_request_id: job_id,
      },
      attributes: ["approvel_status", "level", "employee_id", "department_id", "remark"],
    });

    if (!getData || getData.length === 0) {
      return res.status(400).send({ code: 400, message: "Data not found" });
    }

    if (dep_id && employeeId) {
      getData.employee_id = employeeId;
      getData.department_id = dep_id;
    }
    const levelsWithNames = [];
    for (const levelInfo of getData) {
      const employeeInfo = await userdetail.findOne({
        where: {
          employee_id: levelInfo.employee_id,
        },
        attributes: ["first_name", "last_name"],
      });

      if (!employeeInfo) {
        return res.status(400).send({ code: 400, message: "User not found for level" + levelInfo.level });
      }

      const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;
      const levelWithName = {
        level: levelInfo.level,
        name: fullName,
        status: levelInfo.approvel_status,
        remark: levelInfo.remark
      };
      levelsWithNames.push(levelWithName);
    }

    return res.status(200).send({ code: 200, message: "Data Fetched Successfully!", data: levelsWithNames });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllArea_active = async (req, res) => {
  try {
    const dep_id = req.body.dep_id;

    let query = `
      SELECT A.id, D.department_name, D.department_code, A.area_name, A.status
      FROM MASTER_AREA A
      INNER JOIN MASTER_DEPARTMENT D ON A.department_id = D.dept_id
      WHERE A.isDeleted = false AND A.status = 'ACTIVE' `;


    if (dep_id) {
      query += `AND D.dept_id = :dep_id `;
    }

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { dep_id: dep_id }
    });

    if (getAllData.length === 0) {
      return res.status(404).send({ code: 404, message: "No areas found", data: [] });
    }

    return res.status(200).send({ code: 200, message: "Get All Areas Successfully", data: getAllData });
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.branch_get_active = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeletedCondition = `WHERE T.isDeleted = false AND T.status = 'ACTIVE' `;

    const query = `SELECT T.id, T.branch_name, T.branch_code, T.branch_contact_person_name, T.branch_contact_no,
      T.contact_no, T.branch_email, T.branch_alt_email, T.branch_pin_code, T.branch_address, 
      T.status AS branch_status,T.billing_status,
      T.branch_gstnumber, T.status, CT.*, S.states_id AS branch_states_id ,S.*, C.*  
      FROM MASTER_BRANCH AS T
      INNER JOIN MASTER_COUNTRY AS CT ON T.country_id = CT.countryss_id
      INNER JOIN MASTER_STATE AS S ON T.state_id = S.states_id
      LEFT JOIN MASTER_CITY AS C ON T.city_id = C.city_id 
                  ${isDeletedCondition}
                  ${id ? 'AND T.id = :id' : ''} 
                 ORDER BY T.id DESC`;

    const data = await db.sequelize.query(query, { replacements: { id: id, isDeleted: false }, type: db.sequelize.QueryTypes.SELECT });

    if (id) {
      if (data.length > 0) {
        return res.status(200).send({ code: 200, message: "Get Branch Data Successfully", data: data[0] });
      } else {
        return res.status(404).send({ code: 404, message: "No Branch Data found for the provided ID", data: [] });
      }
    } else {
      return res.status(200).send({ code: 200, message: "Get All Branch Data Successfully", data: data });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error, "Error");
    return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.getContractTypes_active = async (req, res) => {
  try {
    const entity_id = req.params.entity_id;
    const financial_id = req.params.financial_id;
    const contractTypes = await db.contract_types.findAll({
      where: {
        isDeleted: false,
        status: 'ACTIVE',
        entity_id: entity_id,
        financial_id: financial_id
      }
    });
    if (contractTypes.length > 0) {
      return res.status(200).send({ code: 200, message: "All Contract Types Retrieved", data: contractTypes });
    } else {
      return res.status(404).send({ code: 404, message: "No Contract Types Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error:", error);
    return res.status(500).send({ code: 500, message: "Internal Server Error" });
  }
};

exports.getAllReason_active = async (req, res) => {
  try {
    const entity_id = req.params.entity_id;
    const reasons = await db.reason_for.findAll({ where: { isDeleted: false, status: 'ACTIVE', entity_id: entity_id, } });
    if (reasons.length > 0) {
      return res.status(200).send({ code: 200, message: "All Reason for Recruitment fetched successfully!", data: reasons });
    } else {
      return res.status(404).send({ code: 404, message: "Reason for Recruitment not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error("Error:", error);
    return res.status(500).send({ code: 500, message: error.message });
  }
};

exports.getAllDesignation_active = async (req, res) => {
  try {
    const getAllData = await db.designation.findAll({
      where: {
        isDeleted: false,
        status: 'ACTIVE'
      },
      attributes: ['designation_id', 'designation_name', 'status'],
      order: [['designation_id', 'DESC']],
    })
    if (getAllData) {
      return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    };
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  };
};

exports.getAllDepartment_all_active = async (req, res) => {
  try {
    let { entity_id, financial_id } = req.query;
    entity_id = parseInt(entity_id, 10);

    if (isNaN(entity_id)) {
      return res.status(400).send({ code: 400, message: "Invalid entity_id provided" });
    }

    const getAllData = await db.sequelize.query(
      `SELECT D.*, 
              U.first_name, 
              U.last_name, 
              R.role_master_name 
              FROM MASTER_DEPARTMENT AS D
              LEFT JOIN HRMS_REGISTERED_USER AS U 
              ON U.employee_id = D.employee_id
              LEFT JOIN HRMS_RBAC_ROLE_MASTER AS R 
              ON R.role_master_id = D.role_master_id
              WHERE D.isDeleted = 0 
              AND (U.status = 'ACTIVE' OR U.employee_id IS NULL)
              AND (R.status = 'ACTIVE' OR R.role_master_id IS NULL)
              AND D.entity_id = :entity_id ;
          `,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { entity_id, financial_id }
      }
    );

    // Check if data was returned from the query
    if (getAllData && getAllData.length > 0) {
      return res.status(200).send({ code: 200, message: "Fetch All Department Data Successfully", data: getAllData });
    } else {
      return res.status(404).send({ code: 404, message: "No data found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error('Error fetching department data:', error);
    return res.status(500).send({ code: 500, message: "Server error" });
  }
};
exports.OpenAI_APi = async (req, res) => {
  try {
    const { message, aiEngine } = req.body;
    let bulletPoints = "";

    if (aiEngine === "Gemini") {
      const genAI = new GoogleGenerativeAI("AIzaSyDHnSYwbJ7u0x2NfxMF9RygLo-D2rM0_cY");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([message]);
      bulletPoints = result.response.text();
    }
    if (aiEngine === "Groq") {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model: "llama3-8b-8192",
      });

      const content = response.choices[0]?.message?.content || "No content returned";
      bulletPoints = content.split("\n").map(line => `• ${line.trim()}`).join("\n");
    }
    if (aiEngine === "OpenAi") {
      const openai = new OpenAIApi.OpenAI({
        apiKey: "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"
      });

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: 'user', content: message }],
        max_tokens: 100,
      });

      bulletPoints = chatCompletion.choices[0].message.content;
    }
    return res.status(200).send({code: 200, message: bulletPoints});

  } catch (error) {
    return res.status(500).send({code: 500,error: "GOOGLE API KEY is missing"});
  }
};