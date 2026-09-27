const db = require("../../models");
const moment = require("moment-timezone");

module.exports = (app) => {
  app.post("/api/v1/ess/create_attendance_whatsapp", async (req, res) => {
    try {
      const { MobileNumber } = req.body;

      if (!MobileNumber) {
        return res
          .status(400)
          .json({ code: 400, message: "Mobile number is required" });
      }

      // Normalize mobile number
      const cleanNumber = MobileNumber.replace("91", "").replace(/\s+/g, "");

      // Find employee
      const employee = await db.sequelize.query(
        `
        SELECT employee_id, first_name, last_name, employee_code, primary_entity_id
        FROM HRMS_REGISTERED_USER
        WHERE contact_number LIKE :cleanNumber
          AND status = 'ACTIVE'
        LIMIT 1
        `,
        {
          replacements: { cleanNumber: `%${cleanNumber}` },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (employee.length === 0) {
        return res
          .status(204)
          .json({ code: 204, message: "Employee not found!" });
      }

      const emp = employee[0];
      const employee_id = emp.employee_id;
      const entity_id = emp.primary_entity_id;

      // Use IST timezone (always consistent)
      const now = moment().tz("Asia/Kolkata");

      const att_date = now.format("YYYY-MM-DD");
      const att_month = parseInt(now.format("MM"));
      const att_year = parseInt(now.format("YYYY"));
      const att_day = now.format("dddd");
      const att_checktime = now.format("hh:mm:ss A"); // e.g. "03:45:21 PM"
      const att_time = now.toISOString(); // ISO UTC for DB
      const createdAt = now.format("YYYY-MM-DD HH:mm:ss");
      const updatedAt = createdAt;

      const att_mode = "ONLINE";
      const job_type = "WFO";
      const status = "ACTIVE";
      const isDeleted = 0;

      // Get last record for today
      const [lastRecord] = await db.sequelize.query(
        `
        SELECT entry_type 
        FROM ESS_DAILY_ATTENDANCE
        WHERE employee_id = :employee_id
          AND att_date = :att_date
        ORDER BY id DESC
        LIMIT 1
        `,
        {
          replacements: { employee_id, att_date },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      // Alternate IN / OUT logic
      let entry_type = "IN";
      if (lastRecord) {
        entry_type = lastRecord.entry_type === "IN" ? "OUT" : "IN";
      }

      // Insert attendance
      await db.sequelize.query(
        `
        INSERT INTO ESS_DAILY_ATTENDANCE 
        (att_day, att_month, att_year, att_date, att_checktime, att_time, job_type, entry_type, status, isDeleted, createdAt, updatedAt, employee_id, entity_id, checkInloc, checkoutloc, att_mode)
        VALUES (:att_day, :att_month, :att_year, :att_date, :att_checktime, :att_time, :job_type, :entry_type, :status, :isDeleted, :createdAt, :updatedAt, :employee_id, :entity_id, :checkInloc, :checkoutloc, :att_mode)
        `,
        {
          replacements: {
            att_day,
            att_month,
            att_year,
            att_date,
            att_checktime,
            att_time,
            job_type,
            entry_type,
            status,
            isDeleted,
            createdAt,
            updatedAt,
            employee_id,
            entity_id,
            checkInloc: null,
            checkoutloc: null,
            att_mode,
          },
          type: db.Sequelize.QueryTypes.INSERT,
        }
      );

      // Success response
      return res.status(200).json({
        code: 200,
        message: `Checked ${entry_type} successfully for ${emp.first_name} ${emp.last_name}!`,
        data: {
          employee_name: `${emp.first_name} ${emp.last_name}`,
          employee_code: emp.employee_code,
          employee_id,
          entity_id,
          entry_type,
          att_day,
          att_month,
          att_year,
          att_date,
          att_checktime,
          att_time,
          job_type,
          att_mode,
        },
      });
    } catch (error) {
      console.error("❌ Attendance Error:", error);
      return res.status(500).json({
        code: 500,
        message: error.message || "Internal server error!",
      });
    }
  });
};
