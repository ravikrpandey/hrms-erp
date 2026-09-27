const { error } = require("pdf-lib");
const db = require("../models/index");
const { Op, Sequelize } = require("sequelize");
const literal = db.Sequelize.literal;
const moment = require("moment");

exports.getDepartmentForReportPurpose = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const query = `SELECT * FROM MASTER_DEPARTMENT WHERE entity_id = :entity_id`;
    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: { entity_id },
    });

    return res.status(200).json({
      message: "Department fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.export_excel_att_AttedanceReport = async (req, res) => {
  try {
    const { entity_id, from_date, to_date } = req.body;
    const { dept_id } = req.query;
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    const formattedFromDate = formatDate(from_date);
    const formattedToDate = formatDate(to_date);
    const result = await db.sequelize.query(
      `SELECT 
        hru.employee_code,
        hru.employee_id AS registered_employee_id,
        hru.first_name,
        hru.middle_name,
        hru.last_name,
        hru.department_id,
        hru.designation_id,
        esd.att_date,
        esd.att_day,
        esd.status,
        esd.*,
        esm.working_hours,
        md.department_name,
        dsg.designation_name,
        hsm.employee_id AS shift_employee_id,
        hsm.shift_master_id,
        ms.shift_name,
        ms.shift_time,
        ms.shift_duration,
        ms.grace_peroid,
        ms.id AS shift_id,
        entity_mater.entity_name,
        entity_mater.company_branch
    FROM HRMS_REGISTERED_USER AS hru
    LEFT JOIN ESS_DAILY_ATTENDANCE AS esd
        ON esd.employee_id = hru.employee_id
        AND esd.att_date BETWEEN :from_date AND :to_date
    LEFT JOIN ESS_DAILY_ATTENDANCE_MASTER AS esm
        ON esm.employee_id = esd.employee_id
        AND esm.att_date = esd.att_date
    LEFT JOIN MASTER_DEPARTMENT AS md
        ON hru.department_id = md.dept_id
    LEFT JOIN DESIGNATION AS dsg
        ON hru.designation_id = dsg.designation_id
    LEFT JOIN HRMS_SHIFT_ALLOCATION AS hsm
        ON hsm.employee_id = hru.employee_id
    LEFT JOIN MASTER_SHIFT AS ms
        ON ms.id = hsm.shift_master_id
    LEFT JOIN ENTITY_MASTER AS entity_mater
        ON hru.primary_entity_id = entity_mater.id
    WHERE hru.primary_entity_id IN (:entity_ids)
      AND (:dept_id IS NULL OR hru.department_id = :dept_id)`,
      {
        type: db.Sequelize.QueryTypes.SELECT,
        replacements: {
          entity_ids: entity_id,
          dept_id: dept_id || null,
          from_date: formattedFromDate,
          to_date: formattedToDate,
        },
      }
    );

    if (!result.length) {
      return res.status(404).json({ message: "No data found" });
    }
    const mappedData = result.map((row) => {
      let check_in = null;
      let check_out = null;
      let entry_type = row.entry_type || "OUT";

      let entries = [];

      if (row.att_checktime) {
        if (typeof row.att_checktime === "string") {
          if (row.att_checktime.startsWith("[")) {
            try {
              entries = JSON.parse(row.att_checktime);
            } catch (err) {
              console.warn("Invalid JSON in att_checktime:", row.att_checktime);
              entries = [];
            }
          } else {
            entries = row.att_checktime.split(",").map((t) => t.trim());
          }
        }
      }
      if (entry_type === "IN") {
        check_in = entries[0] || null;
      } else if (entry_type === "OUT") {
        check_out =
          entries.length > 1 ? entries[entries.length - 1] : entries[0] || null;
      }
      return {
        employee_id: row.employee_id || row.registered_employee_id,
        employee_code: row.employee_code,
        employee_name: `${row.first_name || ""} ${row.middle_name || ""} ${
          row.last_name || ""
        }`.trim(),
        entity_name: row.entity_name || "",
        company_branch: row.company_branch,
        department_name: row.department_name,
        designation_name: row.designation_name,
        shift_time: row.shift_time,
        att_date: row.att_date,
        att_day: row.att_day,
        type: row.type || row.status,
        entry_type: entry_type,
        check_in,
        check_out,
        hours_worked: row.working_hours || "",
      };
    });

    return res.status(200).json({
      message: "Attendance report fetched successfully",
      data: mappedData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.exportToExcelLateComingEarlyLeave = async (req, res) => {
  try {
    const { entity_id, from_date, to_date } = req.body;
    const { dept_id } = req.query;

    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    const formattedFromDate = formatDate(from_date);
    const formattedToDate = formatDate(to_date);

    const result = await db.sequelize.query(
      `SELECT 
        hru.employee_code,
        hru.employee_id AS registered_employee_id,
        hru.first_name,
        hru.middle_name,
        hru.last_name,
        hru.department_id,
        hru.designation_id,
        esd.att_date,
        esd.att_day,
        esd.status,
        esd.att_checktime,
        esd.entry_type,
        esm.working_hours,
        md.department_name,
        dsg.designation_name,
        hsm.employee_id AS shift_employee_id,
        hsm.shift_master_id,
        ms.shift_name,
        ms.shift_time,
        ms.grace_peroid,
        ms.shift_duration,
        ms.id AS shift_id,
        entity_mater.entity_name,
        entity_mater.company_branch
      FROM HRMS_REGISTERED_USER AS hru
      LEFT JOIN ESS_DAILY_ATTENDANCE AS esd
        ON esd.employee_id = hru.employee_id
        AND esd.att_date BETWEEN :from_date AND :to_date
      LEFT JOIN ESS_DAILY_ATTENDANCE_MASTER AS esm
        ON esm.employee_id = esd.employee_id
        AND esm.att_date = esd.att_date
      LEFT JOIN MASTER_DEPARTMENT AS md
        ON hru.department_id = md.dept_id
      LEFT JOIN DESIGNATION AS dsg
        ON hru.designation_id = dsg.designation_id
      LEFT JOIN HRMS_SHIFT_ALLOCATION AS hsm
        ON hsm.employee_id = hru.employee_id
      LEFT JOIN MASTER_SHIFT AS ms
        ON ms.id = hsm.shift_master_id
      LEFT JOIN ENTITY_MASTER AS entity_mater
        ON hru.primary_entity_id = entity_mater.id
      WHERE hru.primary_entity_id IN (:entity_ids)
        AND (:dept_id IS NULL OR hru.department_id = :dept_id)`,
      {
        type: db.Sequelize.QueryTypes.SELECT,
        replacements: {
          entity_ids: entity_id,
          dept_id: dept_id || null,
          from_date: formattedFromDate,
          to_date: formattedToDate,
        },
      }
    );

    if (!result.length) {
      return res.status(404).json({ message: "No data found" });
    }

    const grouped = {};

    for (const row of result) {
      const key = `${row.registered_employee_id}_${row.att_date}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }

      let entries = [];

      if (row.att_checktime) {
        if (typeof row.att_checktime === "string") {
          if (row.att_checktime.startsWith("[")) {
            try {
              entries = JSON.parse(row.att_checktime);
            } catch {
              entries = [];
            }
          } else {
            entries = row.att_checktime.split(",").map((t) => t.trim());
          }
        }
      }

      entries.forEach((time) => {
        grouped[key].push({
          ...row,
          time,
        });
      });
    }

    const finalData = [];

    for (const key in grouped) {
      let punches = grouped[key];

      punches = punches.filter((p) => p.time);
      punches?.sort((a, b) =>
        moment(a.time, "hh:mm:ss A").diff(moment(b.time, "hh:mm:ss A"))
      );

      if (punches.length == 0) continue;

      const firstPunch = punches[0];
      const lastPunch = punches[punches.length - 1];

      const check_in = firstPunch?.time || null;
      const check_out = lastPunch?.time || null;

      let LATEIN = null;
      let LATEGO = null;

      if (firstPunch.shift_time && check_in && check_out) {
        const [shiftStartStr, shiftEndStr] = firstPunch.shift_time
          .split(" to ")
          .map((t) => t.trim());

        const shiftStart = moment(shiftStartStr, "HH:mm");
        const shiftEnd = moment(shiftEndStr, "HH:mm");
        const gracePeriod = parseInt(firstPunch.grace_peroid || "0", 10);

        const allowedLateTime = shiftStart.clone().add(gracePeriod, "minutes");
        const inTime = moment(check_in, "hh:mm:ss A");
        const outTime = moment(check_out, "hh:mm:ss A");

        if (inTime.isAfter(allowedLateTime)) {
          LATEIN = `${inTime.diff(allowedLateTime, "minutes")} Min Late In`;
        } else {
          LATEIN = "On time";
        }

        if (outTime.isBefore(shiftEnd)) {
          LATEGO = `${shiftEnd.diff(outTime, "minutes")} Min Early Going`;
        } else {
          LATEGO = "Left on time";
        }
      }

      finalData.push({
        employee_id: firstPunch.registered_employee_id,
        employee_code: firstPunch.employee_code,
        employee_name: `${firstPunch.first_name || ""} ${
          firstPunch.middle_name || ""
        } ${firstPunch.last_name || ""}`.trim(),
        entity_name: firstPunch.entity_name,
        company_branch: firstPunch.company_branch,
        department_name: firstPunch.department_name,
        designation_name: firstPunch.designation_name,
        shift_time: firstPunch.shift_time,
        att_date: firstPunch.att_date,
        att_day: firstPunch.att_day,
        check_in,
        check_out,
        working_hours: firstPunch.working_hours,
        LATEIN,
        LATEGO,
      });
    }

    return res.status(200).json({
      message:
        "Filtered attendance report (first IN, last OUT) fetched successfully",
      data: finalData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.exportToExcelAbsentRecord = async (req, res) => {
  try {
    const { entity_id, from_date, to_date } = req.body;
    const { dept_id } = req.query;

    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    const formattedFromDate = formatDate(from_date);
    const formattedToDate = formatDate(to_date);

    const result = await db.sequelize.query(
      `SELECT 
        hru.employee_code,
        hru.employee_id AS registered_employee_id,
        hru.first_name,
        hru.middle_name,
        hru.last_name,
        hru.department_id,
        hru.designation_id,
        esd.att_date,
        esd.att_day,
        esd.status,
        esd.att_checktime,
        esd.entry_type,
        esm.working_hours,
        esm.attendance_status,
        md.department_name,
        dsg.designation_name,
        hsm.employee_id AS shift_employee_id,
        hsm.shift_master_id,
        ms.shift_name,
        ms.shift_time,
        ms.grace_peroid,
        ms.shift_duration,
        ms.id AS shift_id,
        entity_mater.entity_name,
        entity_mater.company_branch
      FROM HRMS_REGISTERED_USER AS hru
      LEFT JOIN ESS_DAILY_ATTENDANCE AS esd
        ON esd.employee_id = hru.employee_id
        AND esd.att_date BETWEEN :from_date AND :to_date
      LEFT JOIN ESS_DAILY_ATTENDANCE_MASTER AS esm
        ON esm.employee_id = esd.employee_id
        AND esm.att_date = esd.att_date
      LEFT JOIN MASTER_DEPARTMENT AS md
        ON hru.department_id = md.dept_id
      LEFT JOIN DESIGNATION AS dsg
        ON hru.designation_id = dsg.designation_id
      LEFT JOIN HRMS_SHIFT_ALLOCATION AS hsm
        ON hsm.employee_id = hru.employee_id
      LEFT JOIN MASTER_SHIFT AS ms
        ON ms.id = hsm.shift_master_id
      LEFT JOIN ENTITY_MASTER AS entity_mater
        ON hru.primary_entity_id = entity_mater.id
      WHERE hru.primary_entity_id IN (:entity_ids)
        AND (:dept_id IS NULL OR hru.department_id = :dept_id)
        AND esm.attendance_status IN ('A', 'DA')`,
      {
        type: db.Sequelize.QueryTypes.SELECT,
        replacements: {
          entity_ids: entity_id,
          dept_id: dept_id || null,
          from_date: formattedFromDate,
          to_date: formattedToDate,
        },
      }
    );

    if (!result.length) {
      return res.status(404).json({ message: "No absent data found" });
    }

    const finalData = result.map((row) => ({
      employee_id: row.registered_employee_id,
      employee_code: row.employee_code,
      employee_name: `${row.first_name || ""} ${row.middle_name || ""} ${
        row.last_name || ""
      }`.trim(),
      entity_name: row.entity_name,
      company_branch: row.company_branch,
      department_name: row.department_name,
      designation_name: row.designation_name,
      shift_time: row.shift_time,
      att_date: row.att_date,
      att_day: row.att_day,
      status: row.status,
      attendance_status: row.attendance_status,
      working_hours: row.working_hours,
    }));

    return res.status(200).json({
      message: "Absent records fetched successfully",
      data: finalData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDepartmentMultipleEntitySelected = async (req, res) => {
  try {
    const ids = req.query.ids;
    const entity_ids = ids.split(",").map((id) => parseInt(id, 10));
    const query = `
          SELECT 
        em.id AS entity_id,
        em.entity_name,
        md.*
      FROM 
        MASTER_DEPARTMENT AS md
       JOIN 
        ENTITY_MASTER AS em ON em.id = md.entity_id
      WHERE 
        md.entity_id IN (:entity_ids);

    `;
    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: { entity_ids },
    });

    return res.status(200).json({
      message: "Departments fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getEmployeebasedOnDepartment = async (req, res) => {
  try {
    const ids = req.query.ids;
    const deptids = ids.split(",").map((id) => parseInt(id, 10));
    const query = `
      SELECT 
        hru.department_id,
        hru.first_name,
        hru.middle_name,
        hru.last_name,
        hru.employee_code,
        hru.employee_id,
        md.department_name,
        md.dept_id
      FROM 
        MASTER_DEPARTMENT AS md
       JOIN 
        HRMS_REGISTERED_USER AS hru ON hru.department_id = md.dept_id
      WHERE 
        md.dept_id IN (:deptids)
    `;

    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: { deptids },
    });

    return res.status(200).json({
      message: "Employees fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getAllLeaveMasterData = async (req, res) => {
  try {
    const idsParam = req.query.ids;
    const entity_id = idsParam.split(",").map((id) => parseInt(id.trim(), 10));
    const query = `
      SELECT 
        em.id,
        em.entity_name, 
        hlm.* 
      FROM HRMS_LEAVE_MASTER AS hlm
      JOIN ENTITY_MASTER AS em ON em.id = hlm.entity_id
      WHERE hlm.entity_id IN (:entity_id)
    `;

    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: { entity_id },
    });

    return res.status(200).json({
      message: "Leave master data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching leave master data:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.exportToExcelLeaveMasterReport = async (req, res) => {
  let { entity_id, dept_id, employee_id, financial_id } = req.body;
  try {
    const user = await db.user.findOne({
      where: {
        employee_id,
        primary_entity_id: entity_id,
        isDeleted: false,
      },
      attributes: [
        "first_name",
        "middle_name",
        "last_name",
        "employee_code",
        "designation_id",
        "department_id",
      ],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (!dept_id) {
      dept_id = user.department_id;
    }
    const departmentData = await db.department.findOne({
      where: { dept_id },
      attributes: ["department_name"],
    });

    const designationData = await db.designation.findOne({
      where: { designation_id: user.designation_id },
      attributes: ["designation_name"],
    });
    const [leaveAllotments] = await db.sequelize.query(
      `
      SELECT 
        LM.leave_name, LM.leave_code, LM.total_available, 
        ULA.employee_id, ULA.leave_id, ULA.no_of_days, ULA.available_days
      FROM HRMS_USER_LEAVE_ALLOTMENT AS ULA
      INNER JOIN HRMS_LEAVE_MASTER AS LM ON LM.id = ULA.leave_id
      WHERE 
        ULA.isDeleted = false AND 
        ULA.status = 'ACTIVE' AND 
        ULA.employee_id IN (:employee_ids)
      ORDER BY ULA.id DESC
    `,
      {
        replacements: { employee_ids: employee_id },
      }
    );
    for (const allotment of leaveAllotments) {
      const leaveId = allotment.leave_id;

      const leaveStats = await db.essApplyLeaveDetail.findAll({
        where: {
          leaveId,
          isDeleted: false,
          employee_id,
          financial_year_id: financial_id,
        },
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
        raw: true,
      });

      allotment.name = `${user.first_name} ${user.middle_name || ""} ${
        user.last_name
      }`.trim();
      allotment.employee_code = user.employee_code;
      allotment.designation = designationData?.designation_name || null;
      allotment.department = departmentData?.department_name || null;
      allotment.total_leave_applied = leaveStats[0]?.total_days || 0;
      allotment.total_approved_days = leaveStats[0]?.total_approved_days || 0;
    }
    return res.status(200).send({
      message: "Leave Master Report fetched successfully",
      employeeDetails: leaveAllotments,
    });
  } catch (error) {
    console.error("Error generating leave master report:", error);
    return res.status(500).send({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getBranchRecord = async (req, res) => {
  try {
    const idsParam = req.query.ids;
    const entity_id = idsParam.split(",").map((id) => parseInt(id.trim(), 10));
    const query = `
      SELECT 
        mb.id,
        mb.branch_name, 
        hru.primary_branch_id 
      FROM 
        HRMS_REGISTERED_USER AS hru 
      JOIN 
        MASTER_BRANCH AS mb 
        ON mb.id = hru.primary_branch_id 
      WHERE 
        hru.primary_entity_id IN (:idsParam);
    `;
    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: { idsParam: entity_id },
    });

    return res.status(200).json({
      message: "Branch data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching branch data:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const { entity_id } = req.params;
    const departments = await db.department.findAll({
      where: {
        entity_id,
        isDeleted: 0,
      },
    });
    return res.status(200).send({
      message: "Departments fetched succesfully",
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching Departments data:", error);
    return res.status(500).send({
      message: "An error occurred while fetching Departments data.",
      error: error.message,
    });
  }
};
/////////////////
exports.getAllBranch = async (req, res) => {
  try {
    const query = `
      SELECT 
        MB.id,
        MB.branch_name
      FROM 
        MASTER_BRANCH AS MB`;
    const result = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: {},
    });

    return res.status(200).json({
      message: "Branch data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching branch data:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.exportToExcelDesignationReport = async (req, res) => {
  const {
    entity_id,
    designation_id,
    branch_id,
    dept_id,
    year,
    year_type, // "DOB" or "DOJ"
    nationality_id,
  } = req.body;

  try {
    const whereClause = { isDeleted: false };

    const applyFilter = (field, value) => {
      if (Array.isArray(value) && value.length > 0) {
        whereClause[field] = { [Op.in]: value };
      } else if (value) {
        whereClause[field] = value;
      }
    };

    applyFilter("designation_id", designation_id);
    applyFilter("department_id", dept_id);
    applyFilter("primary_branch_id", branch_id);
    applyFilter("primary_entity_id", entity_id);
    applyFilter("employee_country_id", nationality_id); // ✅ Now handles array or single value

    // Handle year and year_type logic
    if (year && year_type) {
      const yearField = year_type === "DOB" ? "date_of_birth" : "emp_join_date";
      whereClause[yearField] = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      };
    }

    console.log("Export Filter whereClause ===>", whereClause);

    const users = await db.user.findAll({ where: whereClause });

    if (!users || users.length === 0) {
      return res.status(201).json({ message: "No users found!" });
    }

    const allData = [];

    for (const user of users) {
      const [department, designation, entity, branch, nationality] =
        await Promise.all([
          db.department.findOne({ where: { dept_id: user.department_id } }),
          db.designation.findOne({
            where: { designation_id: user.designation_id },
          }),
          db.entityMaster.findOne({ where: { id: user.primary_entity_id } }),
          db.tbl_branch.findOne({ where: { id: user.primary_branch_id } }),
          db.countryss.findOne({
            where: { countryss_id: user.employee_country_id },
          }),
        ]);

      const full_name = [user.first_name, user.middle_name, user.last_name]
        .filter(Boolean)
        .join(" ");

      allData.push({
        employee_code: user.employee_code || "N/A",
        full_name,
        date_of_birth: user.date_of_birth || "N/A",
        gender: user.gender || "N/A",
        employee_official_email: user.employee_official_email || "N/A",
        status: user.status || "N/A",
        countrys: nationality?.countryss_name || "N/A",
        entity_name: entity?.entity_name || "N/A",
        branch_name: branch?.branch_name || "N/A",
        department_name: department?.department_name || "N/A",
        designation_name: designation?.designation_name || "N/A",
        date_of_joining: user.emp_join_date || "N/A",
      });
    }

    return res.status(200).json({
      message: "Data fetched successfully!",
      data: allData,
      code: 200,
    });
  } catch (error) {
    console.error("Export error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

exports.getAllBANK = async (req, res) => {
  try {
    const data = await db.bank_master.findAll({
      where: {
        isDeleted: false,
      },
      order: [["id", "DESC"]],
    });
    if (data) {
      return res.status(200).send({
        code: 200,
        message: "Get All Bank data successfully",
        data: data,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Item found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};
exports.getAllNationality = async (req, res) => {
  try {
    const data = await db.countryss.findAll({
      where: {
        status: "ACTIVE",
      },
      attributes: ["countryss_id", "countryss_name"],
      order: [["countryss_name", "ASC"]],
    });
    if (data) {
      return res.status(200).send({
        code: 200,
        message: "Get All Country data successfully",
        data: data,
      });
    } else {
      return res.status(404).send({ code: 404, message: "No Item found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.exportToExcelBankReport = async (req, res) => {
  const { entity_id, bank_id, branch_id, dept_id } = req.body;

  try {
    const whereClause = { isDeleted: false };

    const applyFilter = (field, value) => {
      if (Array.isArray(value) && value.length > 0) {
        whereClause[field] = { [Op.in]: value };
      }
    };

    applyFilter("bank_id", bank_id);
    applyFilter("department_id", dept_id);
    applyFilter("primary_branch_id", branch_id);
    applyFilter("primary_entity_id", entity_id);

    const users = await db.user.findAll({
      where: whereClause,
      attributes: [
        "employee_code",
        "first_name",
        "middle_name",
        "last_name",
        "gender",
        "employee_official_email",
        "status",
        "department_id",
        "bank_id",
        "account_number",
        "iban_number",
        "swift_code",
        "ifsc_code",
        "primary_entity_id",
        "primary_branch_id",
      ],
    });

    if (!users || users.length === 0) {
      return res.status(201).json({ message: "No users found!" });
    }

    const allData = [];

    for (const user of users) {
      const [department, bank, entity] = await Promise.all([
        db.department.findOne({ where: { dept_id: user.department_id } }),
        db.bank_master.findOne({ where: { id: user.bank_id } }),
        db.entityMaster.findOne({ where: { id: user.primary_entity_id } }),
      ]);

      const full_name = [user.first_name, user.middle_name, user.last_name]
        .filter(Boolean)
        .join(" ");

      allData.push({
        employee_code: user.employee_code,
        full_name,
        gender: user.gender || "N/A",
        employee_official_email: user.employee_official_email || "N/A",
        status: user.status || "N/A",
        department_name: department?.department_name || "N/A",
        entity_name: entity?.entity_name || "N/A",
        bank_name: bank?.bank_name || "N/A",
        account_number: user.account_number || "N/A",
        iban: user.iban_number || "N/A",
        swift_code: user.swift_code || "N/A",
        ifsc: user.ifsc_code || "N/A",
      });
    }

    return res.status(200).json({
      message: "Data fetched successfully!",
      data: allData,
      code: 200,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

exports.getAllApprovalManager = async (req, res) => {
  try {
    const data = await db.user.findAll({
      where: { isDeleted: false },
      attributes: [
        "employee_id",
        [
          literal("CONCAT(first_name, ' ', last_name)"),
          "reporting_manager_name",
        ],
      ],
    });

    return res.status(200).send({
      code: 200,
      message: "Fetched approval managers successfully",
      data,
    });
  } catch (error) {
    console.error("getAllApprovalManager error:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
exports.exportToExcelManagerReport = async (req, res) => {
  const {
    entity_id,
    branch_id,
    dept_id,
    reporting_manager_id,
    approval_manager_id,
  } = req.body;

  try {
    const whereClause = { isDeleted: false };
    const applyFilter = (field, value) => {
      if (Array.isArray(value) && value.length > 0) {
        whereClause[field] = { [Op.in]: value };
      }
    };

    applyFilter("approval_manager_id", approval_manager_id);
    applyFilter("reporting_manager_id", reporting_manager_id);
    applyFilter("department_id", dept_id);
    applyFilter("primary_branch_id", branch_id);
    applyFilter("primary_entity_id", entity_id);

    const users = await db.user.findAll({ where: whereClause });

    if (!users || users.length === 0) {
      return res.status(201).json({ message: "No users found!" });
    }

    const allData = [];

    for (const user of users) {
      const [department, approvalManager, reportingManager, entity, branch] =
        await Promise.all([
          db.department.findOne({ where: { dept_id: user.department_id } }),
          db.user.findOne({ where: { employee_id: user.approval_manager_id } }),
          db.user.findOne({
            where: { employee_id: user.reporting_manager_id },
          }),
          db.entityMaster.findOne({ where: { id: user.primary_entity_id } }),
          db.tbl_branch.findOne({ where: { id: user.primary_branch_id } }),
        ]);

      const full_name = [user.first_name, user.middle_name, user.last_name]
        .filter(Boolean)
        .join(" ");

      allData.push({
        employee_code: user.employee_code || "N/A",
        full_name: full_name || "N/A",
        gender: user.gender || "N/A",
        employee_official_email: user.employee_official_email || "N/A",
        status: user.status || "N/A",
        branch_name: branch?.branch_name || "N/A",
        department_name: department?.department_name || "N/A",
        entity_name: entity?.entity_name || "N/A",
        aprroval_manager: approvalManager
          ? [
              approvalManager.first_name,
              approvalManager.middle_name,
              approvalManager.last_name,
            ]
              .filter(Boolean)
              .join(" ")
          : "N/A",
        reporting_manager: reportingManager
          ? [
              reportingManager.first_name,
              reportingManager.middle_name,
              reportingManager.last_name,
            ]
              .filter(Boolean)
              .join(" ")
          : "N/A",
      });
    }

    return res.status(200).json({
      message: "Data fetched successfully!",
      data: allData,
      code: 200,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

////////////////////////Payroll Reports////////////////////////////////////////////////////////

exports.getAllActDeptForReports = async (req, res) => {
  try {
    let entity_id = req.params.entity_id;
    entity_id = parseInt(entity_id);
    const getAllData = await db.department.findAll({
      where: { entity_id, isDeleted: false, status: "ACTIVE" },
      attributes: ["dept_id", "department_name", "department_code"],
      order: [["dept_id", "DESC"]],
    });
    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched all active departments data successfully!",
        data: getAllData,
      });
    } else {
      return res.status(400).send({ code: 400, message: "Records not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};
exports.payRegisterReport = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;
    const [entityData] = await db.sequelize.query(`
  SELECT 
    EM.entity_name,
    EM.tax_registration_number,
    EM.registration_certificate_number,
    EM.registered_office,
    EM.logo,
    EM.company_branch,
    EM.employer_name,
    MB.branch_address
  FROM ENTITY_MASTER EM
  LEFT JOIN MASTER_BRANCH MB 
    ON MB.id = EM.branch_id
  WHERE EM.id = ${entity_id} 
    AND EM.isDeleted = 0 
    AND EM.status = 'ACTIVE'
`);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.salary_data->'$.earningComponentList' AS earningComponentList,
        PS.salary_data->'$.deductionComponentList' AS deductionComponentList,
        PS.salary_data->'$.reiembursementComponentList' AS reiembursementComponentList,
        PS.tax_amount,
        PS.pt_amount,
        PS.lwf_amount
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
  `,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const earnings = Array.isArray(row.earningComponentList)
        ? row.earningComponentList
        : JSON.parse(row.earningComponentList || "[]");

      const reimbursements = Array.isArray(row.reiembursementComponentList)
        ? row.reiembursementComponentList
        : JSON.parse(row.reiembursementComponentList || "[]");

      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      if (row.tax_amount) {
        deductions.push({
          componentName: "Income Tax",
          salary_amt: row.tax_amount,
        });
      }
      if (row.lwf_amount) {
        deductions.push({
          componentName: "LWF",
          salary_amt: row.lwf_amount,
        });
      }

      const componentMap = {};
      let totalGrossEarning = 0;
      let totalGrossDeduction = 0;
      earnings.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      // Add reimbursements into earnings (use fixedAllowanceMonthly)
      reimbursements.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.fixedAllowanceMonthly || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      const netPay = totalGrossEarning - totalGrossDeduction;
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        ...componentMap,
        "Total Gross Earning": totalGrossEarning,
        "Total Gross Deduction": totalGrossDeduction,
        "Net pay": netPay,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
exports.registerOfEmployeeReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;
    const [entityData] = await db.sequelize.query(`
  SELECT 
    EM.entity_name,
    EM.tax_registration_number,
    EM.registration_certificate_number,
    EM.registered_office,
    EM.logo,
    EM.company_branch,
    EM.employer_name,
    MB.branch_address
  FROM ENTITY_MASTER EM
  LEFT JOIN MASTER_BRANCH MB 
    ON MB.id = EM.branch_id
  WHERE EM.id = ${entity_id} 
    AND EM.isDeleted = 0 
    AND EM.status = 'ACTIVE'
`);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.salary_data->'$.earningComponentList' AS earningComponentList,
        PS.salary_data->'$.deductionComponentList' AS deductionComponentList,
        PS.salary_data->'$.reiembursementComponentList' AS reiembursementComponentList,
        PS.tax_amount,
        PS.pt_amount,
        PS.lwf_amount,
        RU.date_of_birth,
        RU.emp_join_date,
        RU.gender,
        RU.contact_number,
        RU.emp_adhar_card_number,
        RU.emp_pan_card,
        RU.present_address,
        UF.member_name AS father_name
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN HRMS_REGISTERED_USER_FAMILY AS UF 
      ON UF.employee_id = RU.employee_id
       AND UF.relation = 'Father'
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      
  `,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const earnings = Array.isArray(row.earningComponentList)
        ? row.earningComponentList
        : JSON.parse(row.earningComponentList || "[]");

      const reimbursements = Array.isArray(row.reiembursementComponentList)
        ? row.reiembursementComponentList
        : JSON.parse(row.reiembursementComponentList || "[]");

      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      if (row.tax_amount) {
        deductions.push({
          componentName: "Income Tax",
          salary_amt: row.tax_amount,
        });
      }
      if (row.lwf_amount) {
        deductions.push({
          componentName: "LWF",
          salary_amt: row.lwf_amount,
        });
      }

      const componentMap = {};
      let totalGrossEarning = 0;
      let totalGrossDeduction = 0;
      earnings.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      // Add reimbursements into earnings (use fixedAllowanceMonthly)
      reimbursements.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.fixedAllowanceMonthly || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      const netPay = totalGrossEarning - totalGrossDeduction;
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Father Name": row.father_name,
        Gender: row.gender,
        "Date of Birth": row.date_of_birth,
        "Date of Joining": row.emp_join_date,
        "Contact Number": row.contact_number,
        "Present Address": row.present_address,
        "PAN Number": row.emp_pan_card,
        "AADHAR Number": row.emp_adhar_card_number,
        ...componentMap,
        "Total Gross Earning": totalGrossEarning,
        "Total Gross Deduction": totalGrossDeduction,
        "Net pay": netPay,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.wageRegisterReport = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;
    const [entityData] = await db.sequelize.query(`
      SELECT 
        entity_name,
        tax_registration_number,
        registration_certificate_number
        registered_office,
        logo,
        company_branch,
        employer_name,
      MB.branch_address
  FROM ENTITY_MASTER EM
  LEFT JOIN MASTER_BRANCH MB 
    ON MB.id = EM.branch_id
  WHERE EM.id = ${entity_id} 
    AND EM.isDeleted = 0 
    AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
    RU.employee_code,
    MD.department_name,
    DS.designation_name,
    PAD.working_days,
    PAD.total_present_day,
    CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
    PS.salary_data->'$.earningComponentList'        AS earningComponentList,
    PS.salary_data->'$.deductionComponentList'      AS deductionComponentList,
    PS.salary_data->'$.reiembursementComponentList' AS reiembursementComponentList,
    PS.tax_amount,
    PS.pt_amount,
    PS.lwf_amount
FROM HRMS_REGISTERED_USER RU
JOIN HRMS_PAYROLL_PAY_SLIPS PS
      ON PS.employee_id   = RU.employee_id
     AND PS.isDeleted     = 0
     AND PS.pay_slip_month = :month
     AND PS.pay_slip_year  = :year
     AND PS.pay_slip_status = 'PROCESSED'
LEFT JOIN MASTER_DEPARTMENT MD
    ON MD.dept_id = RU.department_id
LEFT JOIN DESIGNATION DS
    ON DS.designation_id = RU.designation_id
LEFT JOIN (
    SELECT pa.*
    FROM HRMS_PAYROLL_MONTH_ATTENDANCE pa
    JOIN (
        SELECT employee_id, MAX(id) AS max_id
        FROM HRMS_PAYROLL_MONTH_ATTENDANCE
        WHERE att_month = :month
          AND att_year  = :year
        GROUP BY employee_id
    ) latest ON latest.max_id = pa.id
) PAD
    ON PAD.employee_id = RU.employee_id
WHERE RU.isDeleted = 0
  AND RU.employee_id IN (:employee_ids);

  `,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const earnings = Array.isArray(row.earningComponentList)
        ? row.earningComponentList
        : JSON.parse(row.earningComponentList || "[]");

      const reimbursements = Array.isArray(row.reiembursementComponentList)
        ? row.reiembursementComponentList
        : JSON.parse(row.reiembursementComponentList || "[]");

      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      if (row.tax_amount) {
        deductions.push({
          componentName: "Income Tax",
          salary_amt: row.tax_amount,
        });
      }
      if (row.lwf_amount) {
        deductions.push({
          componentName: "LWF",
          salary_amt: row.lwf_amount,
        });
      }

      const componentMap = {};
      let totalGrossEarning = 0;
      let totalGrossDeduction = 0;
      earnings.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      // Add reimbursements into earnings (use fixedAllowanceMonthly)
      reimbursements.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.fixedAllowanceMonthly || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      const netPay = totalGrossEarning - totalGrossDeduction;
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Days In Month": row.working_days,
        "Days Paid": row.total_present_day,
        ...componentMap,
        "Total Gross Earning": totalGrossEarning,
        "Total Gross Deduction": totalGrossDeduction,
        "Net pay": netPay,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.musterRollReport = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;
    const [entityData] = await db.sequelize.query(`
  SELECT 
    EM.entity_name,
    EM.tax_registration_number,
    EM.registration_certificate_number,
    EM.registered_office,
    EM.logo,
    EM.company_branch,
    EM.employer_name,
    MB.branch_address
  FROM ENTITY_MASTER EM
  LEFT JOIN MASTER_BRANCH MB 
    ON MB.id = EM.branch_id
  WHERE EM.id = ${entity_id} 
    AND EM.isDeleted = 0 
    AND EM.status = 'ACTIVE'
`);

    const rows = await db.sequelize.query(
      `SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.salary_data->'$.earningComponentList' AS earningComponentList,
        PS.salary_data->'$.deductionComponentList' AS deductionComponentList,
        PS.salary_data->'$.reiembursementComponentList' AS reiembursementComponentList,
        PS.tax_amount,
        PS.pt_amount,
        PS.lwf_amount,
        RU.emp_join_date,
        RU.gender,
        RU.contact_number,
        MB.branch_name,
        MG.grade_name,
        HET.emptype_name,
        PMA.working_days,
        PMA.total_P,
        PMA.total_A,
        PMA.total_DA,
        PMA.total_PFD,
        PMA.total_PHD,
        PMA.total_HPFD,
        PMA.total_HPHD,
        PMA.total_NPFD,
        PMA.total_NPHD,
        PMA.total_UL,
        PMA.total_UHL,
        PMA.total_HD,
        PMA.total_CO,
        PMA.total_WFO,
        PMA.total_WHO,
        PMA.total_H
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
      ON DS.designation_id = RU.designation_id
      LEFT JOIN MASTER_BRANCH MB 
      ON MB.id = RU.primary_branch_id
      LEFT JOIN MASTER_GRADE MG 
      ON MG.grade_id = RU.grade_id
      INNER JOIN HRMS_EMPLOYMENT_TYPE HET 
      ON HET.emptype_id = RU.emplyoment_type_id
      LEFT JOIN HRMS_PAYROLL_MONTH_ATTENDANCE PMA 
      ON (PMA.employee_id = RU.employee_id 
      AND PMA.att_month = :month 
      AND PMA.att_year = :year
      AND PMA.status = 'ACTIVE')
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
      AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED" GROUP BY PMA.employee_id`,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const earnings = Array.isArray(row.earningComponentList)
        ? row.earningComponentList
        : JSON.parse(row.earningComponentList || "[]");

      const reimbursements = Array.isArray(row.reiembursementComponentList)
        ? row.reiembursementComponentList
        : JSON.parse(row.reiembursementComponentList || "[]");

      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      if (row.tax_amount) {
        deductions.push({
          componentName: "Income Tax",
          salary_amt: row.tax_amount,
        });
      }
      if (row.lwf_amount) {
        deductions.push({
          componentName: "LWF",
          salary_amt: row.lwf_amount,
        });
      }

      const componentMap = {};
      let totalGrossEarning = 0;
      let totalGrossDeduction = 0;
      earnings.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      // Add reimbursements into earnings (use fixedAllowanceMonthly)
      reimbursements.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.fixedAllowanceMonthly || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      const netPay = totalGrossEarning - totalGrossDeduction;
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        Gender: row.gender,
        "Date of Joining": row.emp_join_date,
        "Work Branch": row.branch_name,
        "Grade Name": row.grade_name,
        "Employee Type": row.emptype_name,
        "Working Days": row.working_days,
        "Present Days": row.total_P,
        "Absent Days": row.total_A,
        "Default Absent": row.total_DA,
        "Paid Leave Full Day": row.total_PFD,
        "Paid Leave Half Day": row.total_PHD,
        "Half Paid Leave Full Day": row.total_HPFD,
        "Half Paid Leave Half Day": row.total_HPHD,
        "Non Paid Leave Full Day": row.total_NPFD,
        "Non Paid Leave Half Day": row.total_NPHD,
        "Unpaid Leave": row.total_UL,
        "Unpaid Half Leave": row.total_UHL,
        "Half Day": row.total_HD,
        "Comp Off": row.total_CO,
        "Week Off Full Day": row.total_WFO,
        "Week Off Half Day": row.total_WHO,
        Holiday: row.total_H,
        ...componentMap,
        "Total Gross Earning": totalGrossEarning,
        "Total Gross Deduction": totalGrossDeduction,
        "Net pay": netPay,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.deductionRegisterReport = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.salary_data->'$.deductionComponentList' AS deductionComponentList,
        PS.tax_amount,
        PS.pt_amount,
        PS.lwf_amount
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      // Append tax and LWF as deductions if present
      if (row.tax_amount) {
        deductions.push({
          componentName: "Income Tax",
          salary_amt: row.tax_amount,
        });
      }
      if (row.lwf_amount) {
        deductions.push({ componentName: "LWF", salary_amt: row.lwf_amount });
      }

      const componentMap = {};
      let totalGrossDeduction = 0;

      // Add all deductions (no filtering)
      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        ...componentMap,
        "Total Gross Deduction": totalGrossDeduction,
        // ❌ removed Net Pay
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll deduction register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
exports.safReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.saf_employee_contribution,
        PS.saf_employer_contribution
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Employee Contribution": row.saf_employee_contribution,
        "Employer Contribution": row.saf_employer_contribution,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll SAF report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
exports.ptReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.pt_amount
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "PT Amount": row.pt_amount,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll PT report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
exports.tdsReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
        SELECT 
          EM.entity_name,
          EM.tax_registration_number,
          EM.registration_certificate_number,
          EM.registered_office,
          EM.logo,
          EM.company_branch,
          EM.employer_name,
          MB.branch_address
        FROM ENTITY_MASTER EM
        LEFT JOIN MASTER_BRANCH MB 
          ON MB.id = EM.branch_id
        WHERE EM.id = ${entity_id} 
          AND EM.isDeleted = 0 
          AND EM.status = 'ACTIVE'
      `);

    const rows = await db.sequelize.query(
      `
        SELECT 
          RU.employee_code,
          MD.department_name,
          DS.designation_name,
          CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
          PS.tax_amount
        FROM HRMS_PAYROLL_PAY_SLIPS PS
        JOIN HRMS_REGISTERED_USER RU 
          ON PS.employee_id = RU.employee_id
        LEFT JOIN MASTER_DEPARTMENT MD 
          ON MD.dept_id = RU.department_id
        LEFT JOIN DESIGNATION DS 
          ON DS.designation_id = RU.designation_id
        WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
        AND RU.employee_id IN (:employee_ids)
        AND PS.pay_slip_month = :month
        AND PS.pay_slip_year = :year
        AND PS.pay_slip_status = "PROCESSED"
        `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "TDS Amount": row.tax_amount,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll TDS report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.registerOfEmployeeReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;
    const [entityData] = await db.sequelize.query(`
  SELECT 
    EM.entity_name,
    EM.tax_registration_number,
    EM.registration_certificate_number,
    EM.registered_office,
    EM.logo,
    EM.company_branch,
    EM.employer_name,
    MB.branch_address
  FROM ENTITY_MASTER EM
  LEFT JOIN MASTER_BRANCH MB 
    ON MB.id = EM.branch_id
  WHERE EM.id = ${entity_id} 
    AND EM.isDeleted = 0 
    AND EM.status = 'ACTIVE'
`);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.salary_data->'$.earningComponentList' AS earningComponentList,
        PS.salary_data->'$.deductionComponentList' AS deductionComponentList,
        PS.salary_data->'$.reiembursementComponentList' AS reiembursementComponentList,
        PS.tax_amount,
        PS.pt_amount,
        PS.lwf_amount,
        RU.date_of_birth,
        RU.emp_join_date,
        RU.gender,
        RU.contact_number,
        RU.emp_adhar_card_number,
        RU.emp_pan_card,
        RU.present_address,
        UF.member_name AS father_name
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN HRMS_REGISTERED_USER_FAMILY AS UF 
      ON UF.employee_id = RU.employee_id
       AND UF.relation = 'Father'
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      
  `,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const earnings = Array.isArray(row.earningComponentList)
        ? row.earningComponentList
        : JSON.parse(row.earningComponentList || "[]");

      const reimbursements = Array.isArray(row.reiembursementComponentList)
        ? row.reiembursementComponentList
        : JSON.parse(row.reiembursementComponentList || "[]");

      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      if (row.tax_amount) {
        deductions.push({
          componentName: "Income Tax",
          salary_amt: row.tax_amount,
        });
      }
      if (row.lwf_amount) {
        deductions.push({
          componentName: "LWF",
          salary_amt: row.lwf_amount,
        });
      }

      const componentMap = {};
      let totalGrossEarning = 0;
      let totalGrossDeduction = 0;
      earnings.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      // Add reimbursements into earnings (use fixedAllowanceMonthly)
      reimbursements.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.fixedAllowanceMonthly || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      const netPay = totalGrossEarning - totalGrossDeduction;
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Father Name": row.father_name,
        Gender: row.gender,
        "Date of Birth": row.date_of_birth,
        "Date of Joining": row.emp_join_date,
        "Contact Number": row.contact_number,
        "Present Address": row.present_address,
        "PAN Number": row.emp_pan_card,
        "AADHAR Number": row.emp_adhar_card_number,
        ...componentMap,
        "Total Gross Earning": totalGrossEarning,
        "Total Gross Deduction": totalGrossDeduction,
        "Net pay": netPay,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.equalRemunerationReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;
    const [entityData] = await db.sequelize.query(`
  SELECT 
    EM.entity_name,
    EM.tax_registration_number,
    EM.registration_certificate_number,
    EM.registered_office,
    EM.logo,
    EM.company_branch,
    EM.employer_name,
    MB.branch_address
  FROM ENTITY_MASTER EM
  LEFT JOIN MASTER_BRANCH MB 
    ON MB.id = EM.branch_id
  WHERE EM.id = ${entity_id} 
    AND EM.isDeleted = 0 
    AND EM.status = 'ACTIVE'
`);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.salary_data->'$.earningComponentList' AS earningComponentList,
        PS.salary_data->'$.deductionComponentList' AS deductionComponentList,
        PS.salary_data->'$.reiembursementComponentList' AS reiembursementComponentList,
        PS.tax_amount,
        PS.pt_amount,
        PS.lwf_amount,
        RU.emp_join_date,
        RU.gender,
        RU.contact_number,
        MB.branch_name,
        MG.grade_name,
        HET.emptype_name
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
       ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      LEFT JOIN MASTER_BRANCH MB 
      ON MB.id = RU.primary_branch_id
      LEFT JOIN MASTER_GRADE MG 
      ON RU.grade_id = MG.grade_id
      LEFT JOIN HRMS_EMPLOYMENT_TYPE HET 
      ON HET.emptype_id = RU.emplyoment_type_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
  `,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const earnings = Array.isArray(row.earningComponentList)
        ? row.earningComponentList
        : JSON.parse(row.earningComponentList || "[]");

      const reimbursements = Array.isArray(row.reiembursementComponentList)
        ? row.reiembursementComponentList
        : JSON.parse(row.reiembursementComponentList || "[]");

      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      if (row.tax_amount) {
        deductions.push({
          componentName: "Income Tax",
          salary_amt: row.tax_amount,
        });
      }
      if (row.lwf_amount) {
        deductions.push({
          componentName: "LWF",
          salary_amt: row.lwf_amount,
        });
      }

      const componentMap = {};
      let totalGrossEarning = 0;
      let totalGrossDeduction = 0;
      earnings.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      // Add reimbursements into earnings (use fixedAllowanceMonthly)
      reimbursements.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.fixedAllowanceMonthly || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      const netPay = totalGrossEarning - totalGrossDeduction;
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        Gender: row.gender,
        "Date of Joining": row.emp_join_date,
        "Work Branch": row.branch_name,
        "Grade Name": row.grade_name,
        "Employee Type": row.emptype_name,
        ...componentMap,
        "Total Gross Earning": totalGrossEarning,
        "Total Gross Deduction": totalGrossDeduction,
        "Net pay": netPay,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.getAllESICData = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;
    const [entityData] = await db.sequelize.query(`
      SELECT 
        entity_name,
        tax_registration_number,
        registration_certificate_number
        registered_office,
        logo,
        company_branch,
        employer_name,
        esic_number,
      MB.branch_address
  FROM ENTITY_MASTER EM
  LEFT JOIN MASTER_BRANCH MB 
    ON MB.id = EM.branch_id
  WHERE EM.id = ${entity_id} 
    AND EM.isDeleted = 0 
    AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
    RU.employee_code,
    RU.ESIC_number,
    MD.department_name,
    DS.designation_name,
    PAD.working_days,
    PAD.total_present_day,
    CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
    PS.salary_data->'$.deductionComponentList'      AS deductionComponentList,
    CAST(PS.salary_data->>'$.employer_contri_esi_amt' AS DECIMAL(12,2)) AS employer_contri_esi_amt,
      PS.employer_esi
FROM HRMS_REGISTERED_USER RU
JOIN HRMS_PAYROLL_PAY_SLIPS PS
      ON PS.employee_id   = RU.employee_id
     AND PS.isDeleted     = 0
     AND PS.pay_slip_month = :month
     AND PS.pay_slip_year  = :year
     AND PS.pay_slip_status = 'PROCESSED'
LEFT JOIN MASTER_DEPARTMENT MD
    ON MD.dept_id = RU.department_id
LEFT JOIN DESIGNATION DS
    ON DS.designation_id = RU.designation_id
LEFT JOIN (
    SELECT pa.*
    FROM HRMS_PAYROLL_MONTH_ATTENDANCE pa
    JOIN (
        SELECT employee_id, MAX(id) AS max_id
        FROM HRMS_PAYROLL_MONTH_ATTENDANCE
        WHERE att_month = :month
          AND att_year  = :year
        GROUP BY employee_id
    ) latest ON latest.max_id = pa.id
) PAD
    ON PAD.employee_id = RU.employee_id
WHERE RU.isDeleted = 0
  AND RU.employee_id IN (:employee_ids);

  `,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      const componentMap = {};
      let totalGrossEarning = 0;
      let totalGrossDeduction = 0;

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      const esiDeduction = deductions.find((d) => d.componentName === "ESI");
      const netPay = totalGrossEarning - totalGrossDeduction;
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Employee ESIC No.": row.ESIC_number,
        "Days In Month": row.working_days,
        "Total Days Paid": row.total_present_day,
        "Employee Monthly ESIC Share": esiDeduction?.monthlyBasic || 0,
        "Employer Monthly ESIC Share": row.employer_contri_esi_amt,
        "Employee Actual ESIC Share": esiDeduction?.salary_amt || 0,
        "Employer Actual ESIC Share": row.employer_esi,
        "Total Monthly ESIC Share":
          (parseFloat(esiDeduction?.monthlyBasic) || 0) +
          (parseFloat(row.employer_contri_esi_amt) || 0),
        "Total Actual ESIC Share":
          (parseFloat(esiDeduction?.salary_amt) || 0) +
          (parseFloat(row.employer_esi) || 0),
        "Days In Month": row.working_days,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.overTimeReport = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    // Entity Data
    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    // Employee + Overtime Data
    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_id,
        RU.employee_code,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        MD.department_name,
        DS.designation_name,
        OTD.from_date,
        OTD.to_date,
        OTD.from_time,
        OTD.to_time,
        OTD.total_hour,
        OTD.approve_hours,
        OTD.employee_remark,
        OTD.payroll_month,
        OTD.payroll_year,
        OTD.applied_rate
      FROM ESS_OVERTIME_REQUEST OTR
      JOIN ESS_OVERTIME_REQUEST_DETAILS OTD 
        ON OTD.request_id = OTR.id AND OTD.isDeleted = 0
      JOIN HRMS_REGISTERED_USER RU 
        ON RU.employee_id = OTR.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE OTR.isDeleted = 0 
        AND OTR.status = 'ACTIVE'
        AND RU.employee_id IN (:employee_ids)
        AND (:month IS NULL OR OTD.payroll_month = :month)
        AND (:year IS NULL OR OTD.payroll_year = :year)
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    // Formatting data according to required headings
    const reportData = rows.map((row) => {
      return {
        Name: row.full_name,
        "Designation and Department": `${row.designation_name || ""} - ${
          row.department_name || ""
        }`,
        "Dates on which overtime worked": `${row.from_date} to ${row.to_date}`,
        "Extent of Over time on each occasion": row.total_hour || 0,
        "Total overtime worked or production in case of Price workers":
          row.approve_hours || 0,
        "Normal hours": "", // leave blank (fill later if needed)
        "Normal earnings": "",
        "Overtime earnings": row.applied_rate
          ? row.total_hour * row.applied_rate
          : 0,
        "Total earnings": row.applied_rate
          ? row.total_hour * row.applied_rate
          : 0, // adjust logic if you want normal + overtime
        "Dates on which over time payment made": "", // not in given tables
        Remarks: row.employee_remark || "",
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Overtime report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.getAllEPFData = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;
    const [entityData] = await db.sequelize.query(`
      SELECT 
        entity_name,
        tax_registration_number,
        registration_certificate_number
        registered_office,
        logo,
        company_branch,
        employer_name,
        pf_number,
      MB.branch_address
  FROM ENTITY_MASTER EM
  LEFT JOIN MASTER_BRANCH MB 
    ON MB.id = EM.branch_id
  WHERE EM.id = ${entity_id} 
    AND EM.isDeleted = 0 
    AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
    RU.employee_code,
    RU.pf_account_number,
    MD.department_name,
    DS.designation_name,
    PAD.working_days,
    PAD.total_present_day,
    CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
    PS.salary_data->'$.deductionComponentList'      AS deductionComponentList,
    CAST(PS.salary_data->>'$.employer_contri_epf_amt' AS DECIMAL(12,2)) AS employer_contri_epf_amt,
      PS.employer_epf
FROM HRMS_REGISTERED_USER RU
JOIN HRMS_PAYROLL_PAY_SLIPS PS
      ON PS.employee_id   = RU.employee_id
     AND PS.isDeleted     = 0
     AND PS.pay_slip_month = :month
     AND PS.pay_slip_year  = :year
     AND PS.pay_slip_status = 'PROCESSED'
LEFT JOIN MASTER_DEPARTMENT MD
    ON MD.dept_id = RU.department_id
LEFT JOIN DESIGNATION DS
    ON DS.designation_id = RU.designation_id
LEFT JOIN (
    SELECT pa.*
    FROM HRMS_PAYROLL_MONTH_ATTENDANCE pa
    JOIN (
        SELECT employee_id, MAX(id) AS max_id
        FROM HRMS_PAYROLL_MONTH_ATTENDANCE
        WHERE att_month = :month
          AND att_year  = :year
        GROUP BY employee_id
    ) latest ON latest.max_id = pa.id
) PAD
    ON PAD.employee_id = RU.employee_id
WHERE RU.isDeleted = 0
  AND RU.employee_id IN (:employee_ids);

  `,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      const componentMap = {};
      let totalGrossEarning = 0;
      let totalGrossDeduction = 0;

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      const epfDeduction = deductions.find((d) => d.componentName === "EPF");
      const netPay = totalGrossEarning - totalGrossDeduction;
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Employee EPF No.": row.pf_account_number,
        "Days In Month": row.working_days,
        "Total Days Paid": row.total_present_day,
        "Employee Monthly EPF Share": epfDeduction?.monthlyBasic || 0,
        "Employer Monthly EPF Share": row.employer_contri_epf_amt,
        "Employee Actual EPF Share": epfDeduction?.salary_amt || 0,
        "Employer Actual EPF Share": row.employer_epf,
        "Total Monthly EPF Share":
          (parseFloat(epfDeduction?.monthlyBasic) || 0) +
          (parseFloat(row.employer_contri_epf_amt) || 0),
        "Total Actual EPF Share":
          (parseFloat(epfDeduction?.salary_amt) || 0) +
          (parseFloat(row.employer_epf) || 0),
        "Days In Month": row.working_days,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
exports.getAllLabourWelfareFundData = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    // Fetch entity details including employer_name and branch_address
    const [entityData] = await db.sequelize.query(
      `
      SELECT 
        EM.entity_name,
        EM.employer_name,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = :entity_id 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
      `,
      {
        replacements: { entity_id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    // Fetch employee payroll data
    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        PAD.working_days,
        PAD.total_present_day,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.salary_data->'$.deductionComponentList' AS deductionComponentList,
        PS.lwf_amount,
        PS.employer_lwf_amount
      FROM HRMS_REGISTERED_USER RU
      JOIN HRMS_PAYROLL_PAY_SLIPS PS
        ON PS.employee_id   = RU.employee_id
       AND PS.isDeleted     = 0
       AND PS.pay_slip_month = :month
       AND PS.pay_slip_year  = :year
       AND PS.pay_slip_status = 'PROCESSED'
      LEFT JOIN MASTER_DEPARTMENT MD
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS
        ON DS.designation_id = RU.designation_id
      LEFT JOIN (
          SELECT pa.* 
          FROM HRMS_PAYROLL_MONTH_ATTENDANCE pa
          JOIN (
              SELECT employee_id, MAX(id) AS max_id
              FROM HRMS_PAYROLL_MONTH_ATTENDANCE
              WHERE att_month = :month
                AND att_year  = :year
              GROUP BY employee_id
          ) latest ON latest.max_id = pa.id
      ) PAD
        ON PAD.employee_id = RU.employee_id
      WHERE RU.isDeleted = 0
        AND RU.employee_id IN (:employee_ids);
      `,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    // Process report data
    let contributionEmployees = [];

    const reportData = rows.map((row) => {
      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      const componentMap = {};
      let totalGrossDeduction = 0;

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      // Track employees who contributed to LWF
      if (row.lwf_amount && parseFloat(row.lwf_amount) > 0) {
        contributionEmployees.push(row.full_name);
      }

      return {
        "Name of employees from whom contribution realised": row.full_name,
        "Total amount of employee's contribution": row.lwf_amount || 0,
        "Total amount of employer's contribution": row.employer_lwf_amount || 0,
        "Total Contribution paid":
          (parseFloat(row.lwf_amount) || 0) +
          (parseFloat(row.employer_lwf_amount) || 0),
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Labour Welfare Fund report generated successfully!",
      data: reportData,
      entityData: entityData || null,
      contributionSummary: {
        totalEmployees: contributionEmployees.length,
        employeeNames: contributionEmployees,
      },
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

// API: Generate PF ECR Rows
exports.generateEcrReport = async (req, res) => {
  try {
    const { month, year, entity_id, employee_ids } = req.body;

    if (!employee_ids || !employee_ids.length) {
      return res.status(400).json({ message: "Employee IDs are required." });
    }

    // query to join employee + payroll + payslip
    const rows = await db.sequelize.query(
      `
      SELECT 
        ru.UAN_number,
        CONCAT(ru.first_name, ' ', ru.last_name) AS employee_name,
        ru.pf_account_number,
        ps.gross_salary
      FROM HRMS_REGISTERED_USER ru
      INNER JOIN HRMS_PAYROLL_PAY_SLIPS ps 
        ON ru.employee_id = ps.employee_id
      WHERE ps.pay_slip_month = :month
        AND ps.pay_slip_year = :year
        AND ps.pay_slip_status = "PROCESSED"
        AND ru.primary_entity_id = :entity_id
        AND ru.employee_id IN (:employee_ids)
        AND ru.isDeleted = 0
      `,
      {
        replacements: { month, year, entity_id, employee_ids },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (!rows.length) {
      return res
        .status(200)
        .json({ message: "No employees found for PF ECR!", data: [] });
    }

    // Build ECR rows with keys
    const ecrRows = rows.map((emp) => {
      const gross = Number(emp.gross_salary || 0);
      const pfWages = Math.min(gross, 15000); // EPF/EPS/EDLI capped @15k

      const employeeEPS = Math.round((pfWages * 8.33) / 100);
      const employerEPF = Math.round((pfWages * 3.67) / 100);

      return {
        "UAN No": emp.UAN_number || "",
        "Employee Name": emp.employee_name || "",
        "PF Account No": emp.pf_account_number || "",
        "Gross Salary": gross,
        "EPF Wages": pfWages,
        "EPS Wages": pfWages,
        "EDLI Wages": pfWages,
        "Employee EPS Contribution": employeeEPS,
        "Employer EPF Contribution": employerEPF,
        "NCP Days": 0,
        Refund: 0,
      };
    });

    return res.status(200).json({
      code: 200,
      message: "PF ECR report generated successfully!",
      ecr: ecrRows,
    });
  } catch (err) {
    console.error("PF ECR API Error:", err);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
      error: err.message || err,
    });
  }
};

exports.getNpsReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);
    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.nps_employee_contribution,
PS.nps_employer_contribution
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Employee Contribution": row.nps_employee_contribution,
        "Employer Contribution": row.nps_employer_contribution,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll NPS report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.getEdliReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.employers_edli_share,
        PS.employers_admin_charge_share
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Employer EDLI Contribution": row.employers_edli_share,
        "Employer Admin Charges Contribution": row.employers_admin_charge_share,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll EDLI report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.getBonusReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        JSON_UNQUOTE(JSON_EXTRACT(PS.bonus_details, '$[0].salary_amt')) AS salary_amt,
        JSON_UNQUOTE(JSON_EXTRACT(PS.bonus_details, '$[0].componentName')) AS componentName
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Bonus Name": row.componentName,
        "Bonus Amount": row.salary_amt,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll Bonus report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.getLeaveEncashmentReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        JSON_UNQUOTE(JSON_EXTRACT(PS.leave_encash_data, '$[0].leave_encashment_amount')) AS leave_encashment_amount,
        JSON_UNQUOTE(JSON_EXTRACT(PS.leave_encash_data, '$[0].encashed_days')) AS encashed_days
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Leave Encashed Days": row.encashed_days,
        "Leave Encashed Amount": row.leave_encashment_amount,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll Leave Encashment report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.getAdHocDeductionReports = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        JSON_UNQUOTE(JSON_EXTRACT(PS.deduction_details, '$[0].salary_amt')) AS salary_amt,
        JSON_UNQUOTE(JSON_EXTRACT(PS.deduction_details, '$[0].componentName')) AS componentName
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Deduction Name": row.componentName,
        "Deduction Amount": row.salary_amt,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll Ad Hoc Deduction report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.advanseRegisterReport = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.loan_disbursed, PS.loan_adjusted
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Loan Disbursed": row.loan_disbursed,
        "Loan Adjusted": row.loan_adjusted,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
exports.getAllRegisterWorkmanReport = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;
    const [entityData] = await db.sequelize.query(`
  SELECT 
    EM.entity_name,
    EM.tax_registration_number,
    EM.registration_certificate_number,
    EM.registered_office,
    EM.logo,
    EM.company_branch,
    EM.employer_name,
    MB.branch_address
  FROM ENTITY_MASTER EM
  LEFT JOIN MASTER_BRANCH MB 
    ON MB.id = EM.branch_id
  WHERE EM.id = ${entity_id} 
    AND EM.isDeleted = 0 
    AND EM.status = 'ACTIVE'
`);

    const rows = await db.sequelize.query(
      `SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.salary_data->'$.earningComponentList' AS earningComponentList,
        PS.salary_data->'$.deductionComponentList' AS deductionComponentList,
        PS.salary_data->'$.reiembursementComponentList' AS reiembursementComponentList,
        PS.tax_amount,
        PS.pt_amount,
        PS.lwf_amount,
        RU.date_of_birth,
        RU.emp_join_date,
        RU.gender,
        RU.contact_number,
        MB.branch_name,
        MG.grade_name,
        HET.emptype_name,
        CONCAT_WS(' ', RM.first_name, RM.middle_name, RM.last_name) AS reporting_manager,
        CONCAT_WS(' ', AM.first_name, AM.middle_name, AM.last_name) AS approval_manager
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      LEFT JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN HRMS_REGISTERED_USER_FAMILY AS UF 
      ON UF.employee_id = RU.employee_id
       AND UF.relation = 'Father'
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      LEFT JOIN MASTER_BRANCH MB 
      ON MB.id = RU.primary_branch_id
      LEFT JOIN HRMS_REGISTERED_USER RM ON RU.reporting_manager_id = RM.employee_id
      LEFT JOIN HRMS_REGISTERED_USER AM ON RU.approval_manager_id = AM.employee_id      
      LEFT JOIN MASTER_GRADE MG 
      ON RU.grade_id = MG.grade_id
      LEFT JOIN HRMS_EMPLOYMENT_TYPE HET 
      ON RU.emplyoment_type_id = HET.emptype_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED" AND RU.primary_entity_id = ${entity_id}
  `,
      {
        replacements: {
          employee_ids,
          month,
          year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      const earnings = Array.isArray(row.earningComponentList)
        ? row.earningComponentList
        : JSON.parse(row.earningComponentList || "[]");

      const reimbursements = Array.isArray(row.reiembursementComponentList)
        ? row.reiembursementComponentList
        : JSON.parse(row.reiembursementComponentList || "[]");

      const deductions = Array.isArray(row.deductionComponentList)
        ? row.deductionComponentList
        : JSON.parse(row.deductionComponentList || "[]");

      if (row.tax_amount) {
        deductions.push({
          componentName: "Income Tax",
          salary_amt: row.tax_amount,
        });
      }
      if (row.lwf_amount) {
        deductions.push({
          componentName: "LWF",
          salary_amt: row.lwf_amount,
        });
      }

      const componentMap = {};
      let totalGrossEarning = 0;
      let totalGrossDeduction = 0;
      earnings.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      // Add reimbursements into earnings (use fixedAllowanceMonthly)
      reimbursements.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.fixedAllowanceMonthly || 0);
          componentMap[component.componentName] = amount;
          totalGrossEarning += amount;
        }
      });

      deductions.forEach((component) => {
        if (component?.componentName) {
          const amount = parseFloat(component.salary_amt || 0);
          componentMap[component.componentName] = amount;
          totalGrossDeduction += amount;
        }
      });

      const netPay = totalGrossEarning - totalGrossDeduction;
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        Gender: row.gender,
        "Date of Birth": row.date_of_birth,
        "Date of Joining": row.emp_join_date,
        "Contact Number": row.contact_number,
        "Work Branch": row.branch_name,
        "Reporting Manager": row.reporting_manager,
        "Approval Manager": row.approval_manager,
        "Grade Name": row.grade_name,
        "Employee Type": row.emptype_name,
        ...componentMap,
        "Total Gross Earning": totalGrossEarning,
        "Total Gross Deduction": totalGrossDeduction,
        "Net pay": netPay,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Payroll register report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.leaveRegisterReport = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    if (year.includes("-")) {
      [startYear, endYear] = year.split("-").map((y) => parseInt(y, 10));
    } else {
      startYear = endYear = parseInt(year, 10);
    }

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        ALD.start_date, ALD.leave_days, ALD.approved_days, ALD.leave_for, ALD.end_date,
        MB.branch_name, LM.leave_name, LM.leave_code
      FROM HRMS_REGISTERED_USER RU
      LEFT JOIN ESS_APPLIED_LEAVE_DETAIL ALD 
        ON ALD.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = RU.primary_branch_id
      LEFT JOIN HRMS_LEAVE_MASTER LM 
        ON LM.id = ALD.leaveId
      WHERE RU.isDeleted = 0
      AND RU.employee_id IN (:employee_ids)
      AND MONTH(ALD.start_date) = :month
      AND YEAR(ALD.start_date) BETWEEN :startYear AND :endYear
      AND ALD.approval_status = "APPROVED"
      `,
      {
        replacements: { employee_ids, month, startYear, endYear },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Branch: row.branch_name,
        Department: row.department_name,
        Designation: row.designation_name,
        "Leave Name": row.leave_name,
        "Leave Code": row.leave_code,
        "Start Date": row.start_date,
        "End Date": row.end_date,
        "Leave Days": row.leave_days,
        "Approval Days": row.approved_days,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.fineRegisterReport = async (req, res) => {
  try {
    let { entity_id, year, month, employee_ids } = req.body;

    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB 
        ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.fine_amount
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU 
        ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS 
        ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 AND RU.isDeleted = 0
       AND RU.employee_id IN (:employee_ids)
      AND PS.pay_slip_month = :month
      AND PS.pay_slip_year = :year
      AND PS.pay_slip_status = "PROCESSED"
      AND PS.fine_amount > 0
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const reportData = rows.map((row) => {
      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Fine Amount": row.fine_amount,
      };
    });

    return res.status(200).send({
      code: 200,
      message: "Report generated successfully!",
      data: reportData,
      entityData: entityData || null,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};


exports.incentiveReport = async (req, res) => {
  try {
    const { entity_id, year, month, employee_ids } = req.body;

    // --- Entity Info ---
    const [entityData] = await db.sequelize.query(`
      SELECT 
        EM.entity_name,
        EM.tax_registration_number,
        EM.registration_certificate_number,
        EM.registered_office,
        EM.logo,
        EM.company_branch,
        EM.employer_name,
        MB.branch_address
      FROM ENTITY_MASTER EM
      LEFT JOIN MASTER_BRANCH MB ON MB.id = EM.branch_id
      WHERE EM.id = ${entity_id} 
        AND EM.isDeleted = 0 
        AND EM.status = 'ACTIVE'
    `);

    // --- Payroll Records with Incentive Data ---
    const rows = await db.sequelize.query(
      `
      SELECT 
        RU.employee_code,
        MD.department_name,
        DS.designation_name,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS full_name,
        PS.incentive_data
      FROM HRMS_PAYROLL_PAY_SLIPS PS
      JOIN HRMS_REGISTERED_USER RU ON PS.employee_id = RU.employee_id
      LEFT JOIN MASTER_DEPARTMENT MD ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION DS ON DS.designation_id = RU.designation_id
      WHERE PS.isDeleted = 0 
        AND RU.isDeleted = 0
        AND RU.employee_id IN (:employee_ids)
        AND PS.pay_slip_month = :month
        AND PS.pay_slip_year = :year
          AND PS.pay_slip_status = "PROCESSED"
      `,
      {
        replacements: { employee_ids, month, year },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    // --- Parse Incentive JSON and structure report data ---
    const reportData = rows.map((row) => {
      let incentiveJson = {};
      try {
        incentiveJson =
          typeof row.incentive_data === "string"
            ? JSON.parse(row.incentive_data)
            : row.incentive_data || {};
      } catch {
        incentiveJson = {};
      }

      const breakup = incentiveJson?.incentive_breakup || [];

      // const formattedBreakup = breakup.map((item) => ({
      //   "Incentive Plan": item.plan_name,
      //   "Incentive Type": item.incentive_type,
      //   "Payment Mode": item.payment_mode,
      //   "Multiplier": item.multiplier,
      //   "Target Value": item.target_value,
      //   "Achieved Value": item.achieved_value,
      //   "Per Day Rate": item.per_day_rate?.toFixed(2),
      //   "Incentive Amount": item.incentive_amount?.toFixed(2),
      //   "Is Multi-Month": item.is_multi_month ? "Yes" : "No",
      //   "Applicable Month": item.applicable_month,
      //   "Recurring FY ID": item.recurring_payroll_fy_id || "-",
      //   "Taxable": item.is_taxable ? "Yes" : "No",
      // }));

      return {
        "Employee Name": row.full_name,
        "Employee Code": row.employee_code,
        Department: row.department_name,
        Designation: row.designation_name,
        "Incentive Amount": incentiveJson?.incentive_amount?.toFixed(2) || 0,
        // "Incentive Details": formattedBreakup,
      };
    });

    // --- Response ---
    return res.status(200).send({
      code: 200,
      message: "Incentive report generated successfully!",
      entityData: entityData || null,
      data: reportData,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
