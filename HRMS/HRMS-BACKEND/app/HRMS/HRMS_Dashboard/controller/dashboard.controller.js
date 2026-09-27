const db = require("../../../models/index");
const { where } = require("sequelize");

exports.get_All_Leave_data_get = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const query = `
        SELECT 
          ESS_APPLIED_LEAVE_DETAIL.*, 
          ESS_APPLIED_LEAVE_DETAIL.employee_id, 
          ESS_APPLIED_LEAVE_DETAIL.leaveId, 
          HRMS_REGISTERED_USER.employee_id, 
          HRMS_REGISTERED_USER.first_name, 
          HRMS_REGISTERED_USER.middle_name, 
          HRMS_REGISTERED_USER.last_name, 
          HRMS_REGISTERED_USER.employee_code, 
          HRMS_REGISTERED_USER.gender, 
          HRMS_LEAVE_MASTER.id, 
          HRMS_LEAVE_MASTER.leave_name, 
          HRMS_LEAVE_MASTER.total_available
        FROM 
          ESS_APPLIED_LEAVE_DETAIL 
        JOIN 
          HRMS_REGISTERED_USER 
          ON ESS_APPLIED_LEAVE_DETAIL.employee_id = HRMS_REGISTERED_USER.employee_id
        JOIN 
          HRMS_LEAVE_MASTER 
          ON HRMS_LEAVE_MASTER.id = ESS_APPLIED_LEAVE_DETAIL.leaveId
        WHERE 
          HRMS_LEAVE_MASTER.entity_id = :entity_id;
      `;
    const secondQuery = `
        SELECT 
          ESS_DAILY_ATTENDANCE_MASTER.*, 
          ESS_APPLIED_LEAVE_DETAIL.employee_id
        FROM 
          ESS_DAILY_ATTENDANCE_MASTER
        JOIN 
          ESS_APPLIED_LEAVE_DETAIL
          ON ESS_DAILY_ATTENDANCE_MASTER.employee_id = ESS_APPLIED_LEAVE_DETAIL.employee_id
        WHERE 
          ESS_DAILY_ATTENDANCE_MASTER.entity_id = :entity_id;
      `;
    const result = await db.sequelize.query(query, {
      replacements: { entity_id: entity_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    const secResult = await db.sequelize.query(secondQuery, {
      replacements: { entity_id: entity_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    const data = {
      leaveDetails: result,
      attendanceDetails: secResult,
    };
    res.status(200).json({ data: data });
  } catch (error) {
    console.error("Error fetching leave data:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.get_All_LeaveApplyData = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const query = `
        SELECT *FROM ESS_APPLIED_LEAVE_DETAIL
      `;
    const result = await db.sequelize.query(query, {
      replacements: { entity_id: entity_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching leave data:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.get_AllBirthDayAndOtherAnnouncementdata = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const query = `
        SELECT *FROM HRMS_REGISTERED_USER
      `;
    const result = await db.sequelize.query(query, {
      replacements: { entity_id: entity_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching leave data:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.get_OnlyWFHemployeeList = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const query = `
      SELECT 
        ess.employee_id,
        ess.job_type,
        MIN(hr.employee_code) AS employee_code,
        MIN(hr.first_name) AS first_name,
        MIN(hr.last_name) AS last_name
      FROM HRMS_REGISTERED_USER hr
      JOIN ESS_DAILY_ATTENDANCE ess ON ess.employee_id = hr.employee_id
      WHERE ess.job_type = 'WFH' AND ess.entity_id = :entity_id
      GROUP BY ess.employee_id;
    `;
    const result = await db.sequelize.query(query, {
      replacements: { entity_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching leave data:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


exports.getAllUpComingHoliday = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const query = `
      SELECT 
        mh.*, 
        mf.financial_year
      FROM MASTER_HOLIDAY mh
      JOIN MASTER_FINANCIAL_YEAR mf ON mh.financial_year_id = mf.id
      WHERE mh.entity_id = :entity_id
    `;
    const result = await db.sequelize.query(query, {
      replacements: { entity_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching holiday data:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
