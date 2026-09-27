const db = require("../../../models/index");
const {
  connectToSqlServer,
  connectToWfhSQLServer, 
  closeSqlServerConnection,
} = require("../../../config/s3config");
const dbconfig = require("../../../config/db.config");
const mysql = require("mysql2/promise");
const { Op, Sequelize } = require("sequelize");
const moment = require("moment");
const { DateTime } = require("luxon");
const { validateGeofence } = require("../../../utils/geofence");
const { verifyEmployeeFace, verifyLivenessAndMatch, enrollFaceDescriptor } = require("../../../utils/faceMatch");

exports.create_dailyattendance = async (req, res) => {
  const {
    att_day,
    att_month,
    att_year,
    att_date,
    att_checktime,
    att_time,
    entity_id,
    employee_id,
    entry_type,
    checkInloc,
    checkoutloc,
  } = req.body;
  const att_mode = "ONLINE";
  try {
    const create_attendance = await db.daily_attendance.create({
      att_day,
      att_month,
      att_year,
      att_date,
      att_checktime,
      att_time,
      entity_id,
      employee_id,
      entry_type,
      checkInloc,
      checkoutloc,
      att_mode,
    });
    if (create_attendance) {
      return res.status(200).send({
        code: 200,
        message: `Checked ${entry_type} Successfully!`,
        data: create_attendance,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: `Not able to ${entry_type}!` });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/**
 * Verified Punch (Check-In / Check-Out) Controller
 * Enforces:
 *  1. Authenticated employee identity (req.user.employee_id)
 *  2. Server-authoritative Asia/Kolkata date & time
 *  3. Branch Geofence Haversine verification (with WFH exemption support)
 *  4. 1:1 Live Face Biometric verification against employee's face_descriptor
 *  5. Database transaction with row-level pessimistic locking (concurrency & race protection)
 *  6. Sequential state transition (IN -> OUT -> IN)
 *  7. Immutable telemetry audit logging in ESS_ATTENDANCE_VERIFICATION_AUDIT
 */
exports.verified_punch = async (req, res) => {
  const employee_id = req.user?.employee_id || req.userId || req.body.employee_id;
  const {
    entry_type,
    face_image_base64,
    latitude,
    longitude,
    accuracy,
    job_type,
    burst_frames,
    liveness_data,
  } = req.body;

  const idempotency_key = req.headers["x-idempotency-key"] || req.body.idempotency_key || null;

  if (!employee_id) {
    return res.status(401).json({
      code: 401,
      success: false,
      message: "Authentication required. Please log in again.",
    });
  }

  if (!entry_type || !["IN", "OUT"].includes(String(entry_type).toUpperCase())) {
    return res.status(400).json({
      code: 400,
      success: false,
      message: "Valid entry_type ('IN' or 'OUT') is required.",
    });
  }

  const normalizedEntryType = String(entry_type).toUpperCase();

  if (idempotency_key && db.attendance_verification_audit) {
    try {
      const existingAudit = await db.attendance_verification_audit.findOne({
        where: { idempotency_key, overall_status: "SUCCESS" },
      });
      if (existingAudit) {
        return res.status(200).json({
          code: 200,
          success: true,
          message: `Checked ${normalizedEntryType} Verified & Marked (Idempotent Request)`,
          data: {
            entry_type: normalizedEntryType,
            verification_status: "VERIFIED",
          },
        });
      }
    } catch (idemErr) {
      console.warn("Idempotency check warning:", idemErr.message);
    }
  }

  const user = await db.user.findByPk(employee_id);
  if (!user || user.status !== "ACTIVE" || user.isDeleted) {
    return res.status(403).json({
      code: 403,
      success: false,
      message: "Employee profile is inactive or not found.",
    });
  }

  const now = new Date();
  const istDateObj = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const att_day = daysOfWeek[istDateObj.getDay()];
  const att_month = istDateObj.getMonth() + 1;
  const att_year = istDateObj.getFullYear();
  const att_date = `${att_year}-${String(att_month).padStart(2, "0")}-${String(istDateObj.getDate()).padStart(2, "0")}`;
  
  const hours = istDateObj.getHours();
  const minutes = String(istDateObj.getMinutes()).padStart(2, "0");
  const seconds = String(istDateObj.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = String(hours % 12 || 12).padStart(2, "0");
  const att_checktime = `${formattedHour}:${minutes}:${seconds} ${ampm}`;
  const att_time = now.toISOString();

  const effectiveJobType = job_type || (user && user.job_type) || "WFO";
  const isWfh = effectiveJobType === "WFH";

  let branch = null;
  const branchId = user.primary_branch_id || user.branch_id || user.location_id;
  if (branchId) {
    branch = await db.tbl_branch.findByPk(branchId);
  }

  const userAgent = req.headers["user-agent"] || "";
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isDesktop = !isMobile;

  const geofenceResult = validateGeofence(
    { latitude, longitude, accuracy },
    branch,
    { isWfh, isDesktop, maxAccuracyMeters: 150 }
  );

  if (!geofenceResult.isWithinGeofence) {
    if (db.attendance_verification_audit) {
      await db.attendance_verification_audit.create({
        employee_id,
        entry_type: normalizedEntryType,
        overall_status: "FAILED",
        face_status: "SKIPPED",
        location_status: geofenceResult.status,
        latitude: latitude || null,
        longitude: longitude || null,
        accuracy_meters: accuracy || null,
        calculated_distance_meters: geofenceResult.distanceMeters || null,
        target_branch_id: branch?.id || null,
        ip_address: req.ip || req.headers["x-forwarded-for"] || null,
        user_agent: req.headers["user-agent"] || null,
        failure_reason: geofenceResult.failureReason,
        idempotency_key,
      }).catch((e) => console.warn("Audit log error:", e.message));
    }

    return res.status(403).json({
      code: 403,
      success: false,
      error_code: geofenceResult.status,
      message: geofenceResult.failureReason,
      distance_meters: geofenceResult.distanceMeters,
      allowed_radius_meters: branch?.geofence_radius_meters || 150,
    });
  }

  if (!face_image_base64) {
    return res.status(422).json({
      code: 422,
      success: false,
      error_code: "NO_FACE",
      message: "A live camera photo is required to verify your attendance.",
    });
  }

  const is_fallback = req.body.is_fallback === true || req.body.fallback_mode === true;

  if (!user.face_descriptor && user.employee_photo) {
    try {
      const fs = require("fs");
      const path = require("path");
      const clean = user.employee_photo.replace(/^.*uploaded_files\//, "uploaded_files/");
      const photoFullPath = path.join(process.cwd(), clean);

      if (fs.existsSync(photoFullPath)) {
        const { getFaceDescriptor } = require("../../../utils/faceMatch");
        const autoDescriptor = await getFaceDescriptor(photoFullPath);
        if (autoDescriptor) {
          const descriptorJson = JSON.stringify(Array.from(autoDescriptor));
          await db.user.update(
            { face_descriptor: descriptorJson },
            { where: { employee_id } }
          );
          user.face_descriptor = descriptorJson;
        }
      }
    } catch (autoErr) {
    }
  }

  let faceResult = null;
  if (user.face_descriptor) {
    faceResult = await verifyLivenessAndMatch(
      face_image_base64,
      burst_frames,
      user.face_descriptor,
      0.48,
      liveness_data
    );
  } else {
    faceResult = {
      success: false,
      status: "NOT_ENROLLED",
      matchScore: null,
      distance: null,
      error: "Face descriptor not registered yet. Please enroll your face or proceed with live fallback capture.",
    };
  }

  const effectiveFallback = is_fallback && (!faceResult || !faceResult.success) && faceResult.status !== "SPOOF_DETECTED";

  if (!faceResult.success && !is_fallback) {
    if (db.attendance_verification_audit) {
      await db.attendance_verification_audit.create({
        employee_id,
        entry_type: normalizedEntryType,
        overall_status: "FAILED",
        face_status: faceResult.status,
        face_match_score: faceResult.matchScore,
        face_distance: faceResult.distance,
        location_status: geofenceResult.status,
        latitude: latitude || null,
        longitude: longitude || null,
        accuracy_meters: accuracy || null,
        calculated_distance_meters: geofenceResult.distanceMeters || null,
        target_branch_id: branch?.id || null,
        ip_address: req.ip || req.headers["x-forwarded-for"] || null,
        user_agent: req.headers["user-agent"] || null,
        failure_reason: faceResult.error,
        idempotency_key,
      }).catch((e) => console.warn("Audit log error:", e.message));
    }

    return res.status(422).json({
      code: 422,
      success: false,
      error_code: faceResult.status,
      can_fallback: faceResult.status !== "SPOOF_DETECTED",
      message: faceResult.error,
    });
  }

  let savedLivePhotoPath = null;
  if (effectiveFallback && face_image_base64 && face_image_base64.startsWith("data:image")) {
    try {
      const fs = require("fs");
      const path = require("path");
      const captureDir = path.join(process.cwd(), "uploaded_files", "attendance_captures");
      if (!fs.existsSync(captureDir)) {
        fs.mkdirSync(captureDir, { recursive: true });
      }
      const fileName = `punch_${employee_id}_${Date.now()}.jpg`;
      const fullFilePath = path.join(captureDir, fileName);
      const base64Data = face_image_base64.split(",")[1];
      fs.writeFileSync(fullFilePath, Buffer.from(base64Data, "base64"));
      savedLivePhotoPath = `uploaded_files/attendance_captures/${fileName}`;
    } catch (saveErr) {
    }
  }

  const transaction = await db.sequelize.transaction();
  try {
    const lastPunch = await db.daily_attendance.findOne({
      where: {
        employee_id,
        att_date,
        isDeleted: false,
        status: "ACTIVE",
      },
      order: [["id", "DESC"]],
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (normalizedEntryType === "IN" && lastPunch && lastPunch.entry_type === "IN") {
      await transaction.rollback();
      return res.status(409).json({
        code: 409,
        success: false,
        message: "You have already Checked In today. Please Check Out when leaving.",
      });
    }

    if (normalizedEntryType === "OUT" && (!lastPunch || lastPunch.entry_type === "OUT")) {
      await transaction.rollback();
      return res.status(409).json({
        code: 409,
        success: false,
        message: "You cannot Check Out without Checking In first.",
      });
    }

    const branchName = branch?.branch_name || "Office";
    const locString = isWfh ? "Remote (WFH)" : branchName;

    const verificationStatus = effectiveFallback ? "FALLBACK_CAPTURE" : "VERIFIED";
    const punchMode = effectiveFallback ? "FALLBACK_LIVE_PHOTO" : "FACE_MATCHED";

    const newPunch = await db.daily_attendance.create(
      {
        att_day,
        att_month,
        att_year,
        att_date,
        att_checktime,
        att_time,
        entity_id: user.primary_entity_id || req.body.entity_id,
        employee_id,
        entry_type: normalizedEntryType,
        job_type: effectiveJobType,
        att_mode: "FACE",
        verification_status: verificationStatus,
        punch_mode: punchMode,
        punch_image_path: savedLivePhotoPath,
        face_verified: !effectiveFallback,
        location_verified: ["VERIFIED", "DESKTOP_VERIFIED", "SKIPPED"].includes(geofenceResult.status),
        punch_latitude: latitude || null,
        punch_longitude: longitude || null,
        punch_accuracy_meters: accuracy || null,
        calculated_distance_meters: geofenceResult.distanceMeters || null,
        geofence_branch_id: branch?.id || null,
        checkInloc: normalizedEntryType === "IN" ? locString : (lastPunch?.checkInloc || null),
        checkoutloc: normalizedEntryType === "OUT" ? locString : null,
      },
      { transaction }
    );

    let auditId = null;
    if (db.attendance_verification_audit) {
      const audit = await db.attendance_verification_audit.create(
        {
          employee_id,
          entry_type: normalizedEntryType,
          overall_status: effectiveFallback ? "WARNING" : "SUCCESS",
          face_status: effectiveFallback ? "FALLBACK_CAPTURE" : "VERIFIED",
          face_match_score: faceResult?.matchScore || null,
          face_distance: faceResult?.distance || null,
          location_status: geofenceResult.status,
          latitude: latitude || null,
          longitude: longitude || null,
          accuracy_meters: accuracy || null,
          calculated_distance_meters: geofenceResult.distanceMeters || null,
          target_branch_id: branch?.id || null,
          ip_address: req.ip || req.headers["x-forwarded-for"] || null,
          user_agent: req.headers["user-agent"] || null,
          failure_reason: effectiveFallback ? `Live selfie captured via fallback mode: ${faceResult?.error || 'Face match bypassed'}` : null,
          idempotency_key,
        },
        { transaction }
      );
      auditId = audit.id;
      await newPunch.update({ audit_id: auditId }, { transaction });
    }

    await transaction.commit();

    return res.status(200).json({
      code: 200,
      success: true,
      message: effectiveFallback
        ? `Checked ${normalizedEntryType} Marked with Live Selfie (Fallback Mode)!`
        : `Checked ${normalizedEntryType} Verified & Marked Successfully!`,
      data: {
        id: newPunch.id,
        employee_id: user.employee_id,
        employee_code: user.employee_code || null,
        employee_name: [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ") || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        first_name: user.first_name,
        last_name: user.last_name,
        entry_type: normalizedEntryType,
        att_date,
        att_checktime,
        server_timestamp: att_time,
        distance_meters: geofenceResult.distanceMeters,
        verification_status: verificationStatus,
        punch_mode: punchMode,
        punch_image_path: savedLivePhotoPath,
        face: {
          match_score: faceResult?.matchScore || null,
          status: faceResult?.status || null
        },
        location: {
          is_wfh: isWfh,
          calculated_distance_meters: geofenceResult.distanceMeters
        }
      },
    });
  } catch (txError) {
    await transaction.rollback();
    console.error("Transaction error in verified_punch:", txError);
    return res.status(500).json({
      code: 500,
      success: false,
      message: txError.message || "Failed to record verified attendance.",
    });
  }
};

exports.enroll_face = async (req, res) => {
  try {
    const employee_id = req.user?.employee_id || req.userId || req.body.employee_id;
    const { face_image_base64 } = req.body;

    if (!employee_id) {
      return res.status(401).json({
        code: 401,
        success: false,
        message: "Authentication required. Please log in again.",
      });
    }

    if (!face_image_base64) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "A clear camera photo is required to enroll your biometric face.",
      });
    }

    const user = await db.user.findByPk(employee_id);
    if (!user || user.status !== "ACTIVE" || user.isDeleted) {
      return res.status(403).json({
        code: 403,
        success: false,
        message: "Employee profile is inactive or not found.",
      });
    }

    const enrollResult = await enrollFaceDescriptor(face_image_base64);
    if (!enrollResult.success) {
      return res.status(422).json({
        code: 422,
        success: false,
        message: enrollResult.error,
      });
    }

    await user.update({ face_descriptor: enrollResult.descriptorJson });

    return res.status(200).json({
      code: 200,
      success: true,
      message: "Biometric face template registered successfully! You can now verify and mark attendance.",
      data: {
        employee_id,
        face_enrolled: true,
      },
    });
  } catch (error) {
    console.error("Enroll face error:", error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Failed to enroll biometric face template.",
    });
  }
};

exports.get_face_status = async (req, res) => {
  try {
    const employee_id = req.params.employee_id || req.user?.employee_id || req.userId || req.query.employee_id;
    if (!employee_id) {
      return res.status(401).json({
        code: 401,
        success: false,
        message: "Authentication required.",
      });
    }

    const user = await db.user.findByPk(employee_id, {
      attributes: ["employee_id", "first_name", "last_name", "face_descriptor", "employee_photo", "status", "isDeleted"],
    });

    if (!user || user.status !== "ACTIVE" || user.isDeleted) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: "Active employee profile not found.",
      });
    }

    let isEnrolled = !!user.face_descriptor;

    // If descriptor is missing but user has an employee_photo on disk, auto-enroll vector on the fly
    if (!isEnrolled && user.employee_photo) {
      try {
        const fs = require("fs");
        const path = require("path");
        const clean = user.employee_photo.replace(/^.*uploaded_files\//, "uploaded_files/");
        const photoFullPath = path.join(process.cwd(), clean);
        if (fs.existsSync(photoFullPath)) {
          const { getFaceDescriptor } = require("../../../utils/faceMatch");
          const autoDescriptor = await getFaceDescriptor(photoFullPath);
          if (autoDescriptor) {
            const descriptorJson = JSON.stringify(Array.from(autoDescriptor));
            await db.user.update(
              { face_descriptor: descriptorJson },
              { where: { employee_id: user.employee_id } }
            );
            user.face_descriptor = descriptorJson;
            isEnrolled = true;
            console.log(`✅ [get_face_status] Auto-enrolled face vector from profile photo for employee ${user.employee_id}`);
          }
        }
      } catch (autoErr) {
        console.warn("Notice [get_face_status]: Auto-enroll error:", autoErr.message);
      }
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        employee_id: user.employee_id,
        is_enrolled: isEnrolled,
        has_photo: !!user.employee_photo,
      },
    });
  } catch (error) {
    console.error("Get face status error:", error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Failed to check biometric enrollment status.",
    });
  }
};

////////////////Previous Day Function////////////////
const prevDayName = (year, month, dayName) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const targetIndex = daysOfWeek.indexOf(dayName);
  const today = new Date(year, month - 1);
  today.setDate(
    today.getDate() - ((today.getDay() - targetIndex + 7) % 7 || 7) - 1
  );
  return daysOfWeek[(today.getDay() + 7) % 7];
};

//////////////Previous Date Function //////////////////
const getPreviousDate = (att_date) => {
  const [year, month, day] = att_date.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  const prevDay = String(date.getDate()).padStart(2, "0");
  const prevMonth = String(date.getMonth() + 1).padStart(2, "0");
  const prevYear = date.getFullYear();
  return `${prevYear}-${prevMonth}-${prevDay}`;
};

exports.get_dailyattendance = async (req, res) => {
  const { att_date, att_day, att_month, att_year, entity_id, employee_id } =
    req.query;
  try {
    let in_time;
    let out_time;
    let checktime;
    let prev_in_time;
    let prev_out_time;

    const loc = await db.daily_attendance.findOne({
      where: {
        att_date,
        att_day,
        att_month,
        att_year,
        entity_id,
        employee_id,
        isDeleted: false,
        status: "ACTIVE",
        entry_type: "IN",
      },
      attributes: ["checkInloc", "checkoutloc"],
      order: [["id", "ASC"]],
    });

    const get_firstIN = await db.daily_attendance.findOne({
      where: {
        att_date,
        att_day,
        att_month,
        att_year,
        entity_id,
        employee_id,
        isDeleted: false,
        status: "ACTIVE",
        entry_type: "IN",
      },
      attributes: ["att_checktime"],
      order: [["id", "ASC"]],
    });
    if (get_firstIN) {
      in_time = get_firstIN.att_checktime;
    }
    const get_lastOUT = await db.daily_attendance.findOne({
      where: {
        att_date,
        att_day,
        att_month,
        att_year,
        entity_id,
        employee_id,
        isDeleted: false,
        status: "ACTIVE",
        entry_type: "OUT",
      },
      attributes: ["att_checktime"],
      order: [["id", "DESC"]],
    });
    if (get_lastOUT) {
      out_time = get_lastOUT.att_checktime;
    }
    const last_checktime = await db.daily_attendance.findOne({
      where: {
        att_date,
        att_day,
        att_month,
        att_year,
        entity_id,
        employee_id,
        isDeleted: false,
        status: "ACTIVE",
      },
      attributes: ["entry_type"],
      order: [["id", "DESC"]],
    });
    if (last_checktime) {
      checktime = last_checktime.entry_type;
    }
    const previousDate = getPreviousDate(att_date);
    const prev_day = prevDayName(att_year, att_month, att_day);

    const preDay_firstIN = await db.daily_attendance.findOne({
      where: {
        att_date: previousDate,
        att_day: prev_day,
        att_month,
        att_year,
        entity_id,
        employee_id,
        isDeleted: false,
        status: "ACTIVE",
        entry_type: "IN",
      },
      attributes: ["att_checktime"],
      order: [["id", "ASC"]],
    });
    if (preDay_firstIN) {
      prev_in_time = preDay_firstIN.att_checktime;
    }
    const preDay_lastOut = await db.daily_attendance.findOne({
      where: {
        att_date: previousDate,
        att_day: prev_day,
        att_month,
        att_year,
        entity_id,
        employee_id,
        isDeleted: false,
        status: "ACTIVE",
        entry_type: "OUT",
      },
      attributes: ["att_checktime"],
      order: [["id", "DESC"]],
    });
    if (preDay_lastOut) {
      prev_out_time = preDay_lastOut.att_checktime;
    }
    if (
      !get_firstIN ||
      get_firstIN ||
      get_lastOUT ||
      last_checktime ||
      preDay_firstIN ||
      preDay_lastOut
    ) {
      return res.status(200).send({
        code: 200,
        message: `Get attendance Successfully!`,
        IN_time: in_time,
        out_time,
        checktime,
        prev_in_time,
        prev_out_time,
        previousDate,
        loc,
      });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: `Not attendance found!`, data: [] });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_monthly_attendance = async (req, res) => {
  const { att_month, att_year, entity_id, employee_id } = req.query;
  try {
    const attendance_records = await db.daily_attendance_master.findAll({
      where: {
        att_month,
        att_year,
        entity_id,
        employee_id,
      },
      order: [["att_date", "ASC"]],
      attributes: [
        "id",
        "att_date",
        "att_datetime",
        "attendance_status",
        "employee_id",
        "entity_id",
      ],
    });
    const attendance_with_details = await Promise.all(
      attendance_records.map(async (record) => {
        const in_out_details = await db.daily_attendance.findAll({
          where: {
            att_date: record.att_date,
            entity_id,
            employee_id,
          },
          attributes: [
            "id",
            "att_date",
            "att_checktime",
            "att_day",
            "entry_type",
            "employee_id",
            "entity_id",
            "job_type",
          ],
        });
        return {
          ...record.toJSON(),
          in_out_details,
        };
      })
    );

    const holidays = await db.holidayDetail.findAll({
      where: {
        entity_id,
        status: "ACTIVE",
        isDeleted: false,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("date")),
            att_year
          ),
          Sequelize.where(
            Sequelize.fn("MONTH", Sequelize.col("date")),
            att_month
          ),
        ],
      },
    });

    if (attendance_with_details.length === 0 && holidays.length === 0) {
      return res
        .status(200)
        .send({ code: 200, message: `No attendance records found!`, data: [] });
    } else {
      return res.status(200).send({
        code: 200,
        message: `Attendance fetched successfully!`,
        data: attendance_with_details,
        holidays,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_daily_attendancedata = async (req, res) => {
  const { att_date, entity_id, employee_id, financial_year_id } = req.query;
  try {
    let in_out_details = await db.daily_attendance.findAll({
      where: {
        att_date,
        entity_id,
        employee_id,
      },
      attributes: [
        "id",
        "att_date",
        "att_checktime",
        "att_day",
        "entry_type",
        "employee_id",
        "entity_id",
        "job_type",
        "att_mode",
        "att_time",
      ],
      order: [["att_time", "ASC"]],
    });

    const holiday = await db.holidayDetail.findOne({
      where: {
        date: att_date,
        entity_id,
        financial_year_id,
      },
      attributes: ["id", "holiday_name", "date"],
    });

    const [result, metadata] = await db.sequelize.query(`
            SELECT
                hs.id AS allocation_id,
                hs.employee_id,
                hs.shift_master_id,
                ms.*
            FROM
                HRMS_SHIFT_ALLOCATION AS hs
            JOIN
                MASTER_SHIFT AS ms
                ON hs.shift_master_id = ms.id;
        `);
    let shiftMasterData = null;
    let LATEIN = null;
    let LATEGO = null;
    if (result && result.length > 0) {
      shiftMasterData = result.find(
        (item) => item.employee_id === parseInt(employee_id)
      );
      if (shiftMasterData && shiftMasterData.shift_time) {
        const [shiftStartStr, shiftEndStr] = shiftMasterData.shift_time
          .split(" to ")
          .map((t) => t.trim());
        const shiftStart = moment(shiftStartStr, "HH:mm");
        const shiftEnd = moment(shiftEndStr, "HH:mm");
        const gracePeriod = parseInt(shiftMasterData.grace_peroid, 10) || 0;
        const firstCheckinRecord = in_out_details.find(
          (record) => record.entry_type === "IN"
        );
        if (firstCheckinRecord) {
          const firstCheckinTime = moment(
            firstCheckinRecord.att_checktime,
            "hh:mm:ss A"
          );
          const allowedLateTime = shiftStart
            .clone()
            .add(gracePeriod, "minutes");

          if (firstCheckinTime.isAfter(allowedLateTime)) {
            LATEIN = `${firstCheckinTime.diff(
              allowedLateTime,
              "minutes"
            )} Min Late In`;
          } else {
            LATEIN = "On time";
          }
        }
        const lastCheckoutRecord = in_out_details
          .filter((record) => record.entry_type === "OUT")
          .pop();
        if (lastCheckoutRecord) {
          const lastCheckoutTime = moment(
            lastCheckoutRecord.att_checktime,
            "hh:mm:ss A"
          );
          if (lastCheckoutTime.isBefore(shiftEnd)) {
            LATEGO = `${shiftEnd.diff(
              lastCheckoutTime,
              "minutes"
            )} Min Early Going`;
          } else {
            LATEGO = "Left on time";
          }
        }
      }
    }
    if (in_out_details.length === 0) {
      return res.status(200).send({
        code: 200,
        message: `No attendance records found!`,
        data: [],
        shift_data: result,
        LATEIN,
        LATEGO,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: `Attendance fetched successfully!`,
        data: in_out_details,
        holiday,
        shift_data: result,
        shift_name: shiftMasterData ? shiftMasterData.shift_name : null,
        LATEIN,
        LATEGO,
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

function getWeekOfMonth(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  const dayOfMonth = date.getDate();
  const firstDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay();
  const adjustedDay = dayOfMonth + firstDayOfMonth;
  const weekNumber = Math.ceil(adjustedDay / 7);
  const suffix =
    weekNumber === 1
      ? "st"
      : weekNumber === 2
      ? "nd"
      : weekNumber === 3
      ? "rd"
      : "th";
  const weekKey = `week_${weekNumber}${suffix}`;
  return weekKey;
}

// exports.markdailyAttendance = async (req, res) => {
//     try {
//         const all_shifts = await db.shift.findAll({ where: { status: "ACTIVE", isDeleted: false } });
//         for (const shift of all_shifts) {
//             const employees = await db.shift_Allocation.findAll({ where: { entity_id: shift.entity_id, shift_master_id: shift.id, isDeleted: false } });
//             const [inshift, outshift] = shift.shift_time.split(" to ");
//             const shift_in = formatShiftTime(inshift, -1);
//             const shift_out = formatShiftTime(outshift, 1);
//             let currentDate = new Date();
//             const [shiftInHour] = inshift.split(":").map(Number);
//             const [shiftOutHour] = outshift.split(":").map(Number);
//             if (shiftOutHour < shiftInHour) {
//                 currentDate.setDate(currentDate.getDate() - 1);
//             }
//             const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
//             const today = currentDate.toISOString().split('T')[0];
//             const currentMonth = currentDate.getMonth() + 1;
//             const currentYear = currentDate.getFullYear();
//             const weekName = getWeekOfMonth(today);
//             const { shiftInDate, outdateshift } = getShiftDates(today, shift_in, shift_out);
//             const shift_time = new Date(outdateshift);
//             const current_time = new Date();
//             const halfHourInMs = 30 * 60 * 1000;
//             const lowerBound = new Date(current_time.getTime() - halfHourInMs);
//             const upperBound = new Date(current_time.getTime() + halfHourInMs);

//             if (shift_time >= lowerBound && shift_time <= upperBound) {
//                 const shiftOutDate = outdateshift.toISOString().split("T")[0];
//                 const dateshiftin = formatDateTime(shiftInDate);
//                 const dateshiftout = formatDateTime(outdateshift);
//                 for (const employee of employees) {
//                     const entity_id = employee.entity_id;
//                     const get_attendance_records = await db.daily_attendance.findAll({
//                         where: {
//                             att_date: {
//                                 [Op.between]: [today, shiftOutDate],
//                             },
//                             entity_id, employee_id: employee.employee_id,
//                             att_time: {
//                                 [Op.between]: [dateshiftin, dateshiftout],
//                             }
//                         },
//                         attributes: ["id", "att_checktime", "entry_type"],
//                         order: [["att_checktime", "ASC"]]
//                     });

//                     let totalWorkingMinutes = 0;
//                     let lastIN = null;
//                     get_attendance_records.sort((a, b) => parseTime(a.att_checktime) - parseTime(b.att_checktime));

//                     get_attendance_records.forEach((record) => {
//                         if (record.entry_type === "IN") {
//                             lastIN = parseTime(record.att_checktime);
//                         } else if (record.entry_type === "OUT" && lastIN) {
//                             let outTime = parseTime(record.att_checktime);
//                             if (outTime > lastIN) {
//                                 totalWorkingMinutes += (outTime - lastIN) / (1000 * 60);
//                                 lastIN = null;
//                             }
//                         }
//                     });

//                     const hours = Math.floor(totalWorkingMinutes / 60);
//                     const minutes = Math.round(totalWorkingMinutes % 60);
//                     const totalWorkingHours = `${hours}:${minutes} hours`;

//                     const get_firstIN = await db.daily_attendance.findOne({
//                         where: {
//                             att_date: today, entity_id, employee_id: employee.employee_id, isDeleted: false, status: "ACTIVE", entry_type: "IN"
//                         },
//                         attributes: ["id", "att_checktime"], order: [["id", "ASC"]]
//                     });

//                     const get_lastOUT = await db.daily_attendance.findOne({
//                         where: {
//                             att_time: { [Op.between]: [dateshiftin, dateshiftout] }, entity_id, employee_id: employee.employee_id, isDeleted: false, status: "ACTIVE", entry_type: "OUT"
//                         },
//                         attributes: ["id", "att_checktime"], order: [["id", "DESC"]]
//                     });

//                     const alreadyMarked = await db.daily_attendance_master.findOne({
//                         where: {
//                             employee_id: employee.employee_id,
//                             att_date: today,
//                             status: "ACTIVE",
//                             isDeleted: false
//                         },
//                     });
//                     const weekoff = await db.setup_work_calender.findOne({
//                         where: {
//                             entity_id: entity_id,
//                             employee_id: employee.employee_id,
//                             week_name: dayName,
//                             status: "ACTIVE",
//                             isDeleted: false
//                         },
//                         attributes: ["week_1st", "week_2nd", "week_3rd", "week_4th", "week_5th"]
//                     });
//                     let weekValue = weekoff ? weekoff[weekName] : null;
//                     let attendance_status;
//                     const leave_detail = await db.sequelize.query(
//                         `SELECT AL.id,LM.leave_name,AL.leave_date,AL.leave_day,AL.leave_period,AL.leave_type FROM ESS_APPLIED_LEAVE_DETAIL AS L
//                         INNER JOIN ESS_APPLIED_LEAVE_DAYS_DETAIL AS AL ON AL.apply_leave_id=L.id
//                         INNER JOIN HRMS_LEAVE_MASTER AS LM ON LM.id=L.leaveId
//                         WHERE L.employee_id=${employee.employee_id} AND LM.entity_id=${entity_id} AND AL.isDeleted=0 AND AL.leave_date='${today}' AND LM.isDeleted=0 AND LM.status="ACTIVE"  AND L.approval_status="APPROVED" LIMIT 1`,
//                         {
//                             type: db.sequelize.QueryTypes.SELECT
//                         });

//                     const HD_detail = await db.holidayDetail.findOne({
//                         where: {
//                             date: today, entity_id, isDeleted: false, status: "ACTIVE"
//                         }, order: [["id", "ASC"]]
//                     });

//                     if (alreadyMarked) {
//                         return res.status(400).send({ code: 400, message: `Attendance Already Marked!` });
//                     } else if (get_firstIN && get_lastOUT && !weekValue) {
//                         attendance_status = "P";
//                     } else if (get_firstIN && !get_lastOUT && !weekValue) {
//                         attendance_status = "DA";
//                     } else if (weekValue) {
//                         if (!get_firstIN && !get_lastOUT) {
//                             attendance_status = weekValue === "Full Day" ? "WFO" : "WHO";
//                         } else {
//                             attendance_status = "CO";
//                         }
//                     } else if (weekValue && (get_firstIN || get_lastOUT)) {
//                         attendance_status = "CO";
//                     } else if (HD_detail != null) {
//                         attendance_status = "H";
//                     } else if (leave_detail.length > 0) {
//                         const leave = leave_detail[0];
//                         if (leave.leave_type === "PAID") {
//                             attendance_status = leave.leave_period === '0' ? "PL" : "PHL";
//                         } else {
//                             attendance_status = leave.leave_period === '0' ? "UL" : "UHL";
//                         }
//                     } else {
//                         attendance_status = "A";
//                     }
//                     await db.daily_attendance_master.create({
//                         employee_id: employee.employee_id,
//                         att_date: today,
//                         att_day: dayName,
//                         att_datetime: currentDate,
//                         entity_id,
//                         att_month: currentMonth,
//                         att_year: currentYear,
//                         attendance_status,
//                         working_hours: totalWorkingHours
//                     });
//                 }
//             } else {
//                 console.log("Not the current Shift time to fetch attendance data.");
//             }
//         }
//         return res.status(200).send({ code: 200, message: `Attendance Marked successfully!` });
//     } catch (error) {
//         return res.status(500).send({ code: 500, message: error.message || "Server Error" });
//     }
// }

exports.markdailyAttendance = async (req, res) => {
  try {
    const all_shifts = await db.shift.findAll({
      where: { status: "ACTIVE", isDeleted: false },
    });

    for (const shift of all_shifts) {
      const employees = await db.shift_Allocation.findAll({
        where: {
          entity_id: shift.entity_id,
          shift_master_id: shift.id,
          isDeleted: false,
        },
      });

      const [inshift, outshift] = shift.shift_time.split(" to ");
      const shift_in = formatShiftTime(inshift, -1);
      const shift_out = formatShiftTime(outshift, 1);

      let currentDate = new Date();
      const [shiftInHour] = inshift.split(":").map(Number);
      const [shiftOutHour] = outshift.split(":").map(Number);

      if (shiftOutHour < shiftInHour) {
        currentDate.setDate(currentDate.getDate() - 1);
      }

      const dayName = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const today = currentDate.toISOString().split("T")[0];
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const weekName = getWeekOfMonth(today);

      const { shiftInDate, outdateshift } = getShiftDates(
        today,
        shift_in,
        shift_out
      );
      const shift_time = new Date(outdateshift);
      const current_time = new Date();
      const halfHourInMs = 30 * 60 * 1000;
      const lowerBound = new Date(current_time.getTime() - halfHourInMs);
      const upperBound = new Date(current_time.getTime() + halfHourInMs);

      if (shift_time >= lowerBound && shift_time <= upperBound) {
        const shiftOutDate = outdateshift.toISOString().split("T")[0];
        const dateshiftin = formatDateTime(shiftInDate);
        const dateshiftout = formatDateTime(outdateshift);

        for (const employee of employees) {
          const entity_id = employee.entity_id;

          const get_attendance_records = await db.daily_attendance.findAll({
            where: {
              att_date: {
                [Op.between]: [today, shiftOutDate],
              },
              entity_id,
              employee_id: employee.employee_id,
              att_time: {
                [Op.between]: [dateshiftin, dateshiftout],
              },
            },
            attributes: ["id", "att_checktime", "entry_type"],
            order: [["att_checktime", "ASC"]],
          });

          let totalWorkingMinutes = 0;
          let lastIN = null;

          get_attendance_records.sort(
            (a, b) => parseTime(a.att_checktime) - parseTime(b.att_checktime)
          );

          get_attendance_records.forEach((record) => {
            if (record.entry_type === "IN") {
              lastIN = parseTime(record.att_checktime);
            } else if (record.entry_type === "OUT" && lastIN) {
              let outTime = parseTime(record.att_checktime);
              if (outTime > lastIN) {
                totalWorkingMinutes += (outTime - lastIN) / (1000 * 60);
                lastIN = null;
              }
            }
          });

          const hours = Math.floor(totalWorkingMinutes / 60);
          const minutes = Math.round(totalWorkingMinutes % 60);
          const totalWorkingHours = `${hours}:${minutes} hours`;

          const get_firstIN = await db.daily_attendance.findOne({
            where: {
              att_date: today,
              entity_id,
              employee_id: employee.employee_id,
              isDeleted: false,
              status: "ACTIVE",
              entry_type: "IN",
            },
            attributes: ["id", "att_checktime"],
            order: [["id", "ASC"]],
          });

          const get_lastOUT = await db.daily_attendance.findOne({
            where: {
              att_time: { [Op.between]: [dateshiftin, dateshiftout] },
              entity_id,
              employee_id: employee.employee_id,
              isDeleted: false,
              status: "ACTIVE",
              entry_type: "OUT",
            },
            attributes: ["id", "att_checktime"],
            order: [["id", "DESC"]],
          });

          const alreadyMarked = await db.daily_attendance_master.findOne({
            where: {
              employee_id: employee.employee_id,
              att_date: today,
              status: "ACTIVE",
              isDeleted: false,
            },
          });

          const weekoff = await db.setup_work_calender.findOne({
            where: {
              entity_id: entity_id,
              employee_id: employee.employee_id,
              week_name: dayName,
              status: "ACTIVE",
              isDeleted: false,
            },
            attributes: [
              "week_1st",
              "week_2nd",
              "week_3rd",
              "week_4th",
              "week_5th",
            ],
          });

          let weekValue = weekoff ? weekoff[weekName] : null;
          let attendance_status;

          // Fetch leave detail with deduction_done flag
          const leave_detail = await db.sequelize.query(
            `SELECT AL.id, LM.leave_name, AL.leave_date, AL.leave_day, AL.leave_period, AL.leave_type, AL.deduction_done, L.leaveId
                         FROM ESS_APPLIED_LEAVE_DETAIL AS L 
                         INNER JOIN ESS_APPLIED_LEAVE_DAYS_DETAIL AS AL ON AL.apply_leave_id = L.id
                         INNER JOIN HRMS_LEAVE_MASTER AS LM ON LM.id = L.leaveId
                         WHERE L.employee_id = ${employee.employee_id} AND LM.entity_id = ${entity_id} AND AL.status = "ACTIVE" AND AL.isDeleted = 0 AND AL.leave_date = '${today}' AND LM.isDeleted = 0 AND LM.status = "ACTIVE" AND L.approval_status = "APPROVED" LIMIT 1`,
            {
              type: db.sequelize.QueryTypes.SELECT,
            }
          );

          const HD_detail = await db.holidayDetail.findOne({
            where: {
              date: today,
              entity_id,
              isDeleted: false,
              status: "ACTIVE",
            },
            order: [["id", "ASC"]],
          });

          if (alreadyMarked) {
            return res
              .status(400)
              .send({ code: 400, message: `Attendance Already Marked!` });
          } else if (get_firstIN && get_lastOUT && !weekValue) {
            attendance_status = "P";
          } else if (get_firstIN && !get_lastOUT && !weekValue) {
            attendance_status = "DA";
          } else if (weekValue) {
            if (!get_firstIN && !get_lastOUT) {
              attendance_status = weekValue === "Full Day" ? "WFO" : "WHO";
            } else {
              attendance_status = "CO";
            }
          } else if (weekValue && (get_firstIN || get_lastOUT)) {
            attendance_status = "CO";
          } else if (HD_detail != null) {
            attendance_status = "H";
          } else if (leave_detail.length > 0) {
            const leave = leave_detail[0];
            let attendanceCode = "UL"; // default fallback
            let quotaLeft = 0;
            const isFullDay = leave.leave_period === "0";
            const deduction = isFullDay ? 1 : 0.5;

            const allotment = await db.hrmsLeaveAllotment.findOne({
              where: {
                employee_id: employee.employee_id,
                leave_id: leave.leaveId,
                isDeleted: false,
              },
              attributes: ["available_days"],
            });
            if (allotment) {
              quotaLeft = allotment.available_days;
            }

            if (!leave.deduction_done) {
              if (leave.leave_type === "PAID") {
                if (quotaLeft >= deduction) {
                  attendanceCode = isFullDay ? "PFD" : "PHD"; // Paid Full Day / Paid Half Day
                  quotaLeft -= deduction;

                  await db.hrmsLeaveAllotment.update(
                    { available_days: quotaLeft },
                    {
                      where: {
                        employee_id: employee.employee_id,
                        leave_id: leave.leaveId,
                      },
                    }
                  );

                  await db.essLeavedaysDetail.update(
                    { deduction_done: true },
                    { where: { id: leave.id } }
                  );
                } else {
                  attendanceCode = isFullDay ? "UL" : "UHL";
                }
              } else if (leave.leave_type === "NON PAID") {
                if (quotaLeft >= deduction) {
                  attendanceCode = isFullDay ? "NPFD" : "NPHD"; // Non Paid Full Day / Half Day
                  quotaLeft -= deduction;

                  await db.hrmsLeaveAllotment.update(
                    { available_days: quotaLeft },
                    {
                      where: {
                        employee_id: employee.employee_id,
                        leave_id: leave.leaveId,
                      },
                    }
                  );

                  await db.essLeavedaysDetail.update(
                    { deduction_done: true },
                    { where: { id: leave.id } }
                  );
                } else {
                  attendanceCode = isFullDay ? "UL" : "UHL";
                }
              } else if (leave.leave_type === "HALF PAID") {
                if (quotaLeft >= deduction) {
                  attendanceCode = isFullDay ? "HPFD" : "HPHD"; // Half Paid Full Day / Half Day
                  quotaLeft -= deduction;

                  await db.hrmsLeaveAllotment.update(
                    { available_days: quotaLeft },
                    {
                      where: {
                        employee_id: employee.employee_id,
                        leave_id: leave.leaveId,
                      },
                    }
                  );

                  await db.essLeavedaysDetail.update(
                    { deduction_done: true },
                    { where: { id: leave.id } }
                  );
                } else {
                  attendanceCode = isFullDay ? "UL" : "UHL";
                }
              }
            } else {
              // Deduction already done - just assign appropriate code
              if (leave.leave_type === "PAID") {
                attendanceCode = isFullDay ? "PFD" : "PHD";
              } else if (leave.leave_type === "NON PAID") {
                attendanceCode = isFullDay ? "NPFD" : "NPHD";
              } else if (leave.leave_type === "HALF PAID") {
                attendanceCode = isFullDay ? "HPFD" : "HPHD";
              }
            }

            attendance_status = attendanceCode;
          } else {
            attendance_status = "A"; // Absent
          }

          await db.daily_attendance_master.create({
            employee_id: employee.employee_id,
            att_date: today,
            att_day: dayName,
            att_datetime: currentDate,
            entity_id,
            att_month: currentMonth,
            att_year: currentYear,
            attendance_status,
            working_hours: totalWorkingHours,
          });
        }
      } else {
        console.log("Not the current Shift time to fetch attendance data.");
      }
    }

    return res
      .status(200)
      .send({ code: 200, message: `Attendance Marked successfully!` });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

function formatShiftTime(time, hourDifference) {
  let [hours, minutes] = time.split(":").map(Number);
  hours = (hours + hourDifference + 24) % 24;
  let period = hours >= 12 ? "PM" : "AM";
  let formattedHours = hours % 12 || 12;
  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatDateTime(date) {
  const pad = (num) => num.toString().padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`
  );
}

function parseTime(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }
  const now = new Date();
  now.setHours(hours, minutes, seconds, 0);
  return now;
}

function getShiftDates(today, shift_in, shift_out) {
  const shiftInDate = new Date(`${today} ${shift_in}`);
  let outdateshift = new Date(`${today} ${shift_out}`);
  if (outdateshift <= shiftInDate) {
    outdateshift.setDate(outdateshift.getDate() + 1);
  }
  return { shiftInDate, outdateshift };
}

exports.attendanceMarkedData = async (req, res) => {
  let targetConnection;
  let sourceConnection;
  try {
    sourceConnection = await connectToSqlServer();
    targetConnection = await mysql.createConnection(targetDbConfig);
    console.log("Database Connection stablised successfully");

    var att_date = new Date().toISOString().split("T")[0];
    var cur_date = new Date();
    var att_month = cur_date.getMonth() + 1;
    var att_year = cur_date.getFullYear();
    var att_day = cur_date.toLocaleDateString("en-IN", { weekday: "long" });
    const tableNames = [
      `DeviceLogsTechnew_${att_month}_${att_year}`,
      `DON_DeviceLogs_${att_month}_${att_year}`,
      `BYVDeviceLogs_${att_month}_${att_year}`,
      `DeviceLogsGur_${att_month}_${att_year}`,
      `DeviceLogsNJO_${att_month}_${att_year}`,
      `DeviceLogsSuratnew_${att_month}_${att_year}`,
      `DeviceLogs_${att_month}_${att_year}`,
    ];

    let rows = [];
    for (const tableName of tableNames) {
      try {
        const result = await sourceConnection
          .request()
          .query(
            `SELECT * FROM ${tableName} WHERE CONVERT(DATE, LogDate) = '${att_date}'`
          );
        rows = rows.concat(result.recordset);
      } catch (error) {
        console.error(
          `Error fetching data from table ${tableName}:`,
          error.message
        );
      }
    }
    for (let row of rows) {
      const dateStr = row.LogDate;
      const att_time = formatAsLocalTime(dateStr);
      const att_checktime = formatTime(dateStr);
      const emp_det = await db.attendance_userid.findOne({
        where: {
          de_user_id: row.UserId,
          device_id: row.DeviceId,
          serial_no: row.C2,
          status: "ACTIVE",
          isDeleted: false,
        },
      });

      if (emp_det != null || emp_det != undefined) {
        const [existingRows] = await targetConnection.execute(
          "SELECT entry_type FROM ESS_DAILY_ATTENDANCE WHERE att_date = ? AND employee_id = ? AND entity_id = ? ORDER BY id DESC LIMIT 1",
          [att_date, emp_det.employee_id, emp_det.entity_id]
        );
        let entry_type = "IN";
        if (existingRows.length > 0) {
          entry_type = existingRows[0].entry_type === "IN" ? "OUT" : "IN";
        }

        const [duplicateCheck] = await targetConnection.execute(
          `SELECT COUNT(*) AS count FROM ESS_DAILY_ATTENDANCE 
                     WHERE att_date = ? AND att_checktime = ? AND employee_id = ? AND entity_id = ?`,
          [att_date, att_checktime, emp_det.employee_id, emp_det.entity_id]
        );
        if (duplicateCheck[0].count === 0) {
          const insertQuery = `INSERT INTO ESS_DAILY_ATTENDANCE (att_day, att_month, att_year, att_date, att_checktime, att_time, entry_type, employee_id, entity_id, createdAt, updatedAt,job_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          await targetConnection.execute(insertQuery, [
            att_day,
            att_month,
            att_year,
            att_date,
            att_checktime,
            att_time,
            entry_type,
            emp_det.employee_id,
            emp_det.entity_id,
            cur_date,
            cur_date,
            "WFO",
          ]);
        } else {
          console.log(
            `Attendance already exists for Employee: ${emp_det.employee_id} at ${att_checktime}`
          );
        }
      }
    }
    res.status(200).send({
      message: "Data synchronized successfully!",
      totalRecords: rows.length,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  } finally {
    if (targetConnection) await targetConnection.end();
    if (targetConnection) await closeSqlServerConnection();
    console.log("Database connections closed.");
  }
};


exports.WFHattendanceData = async (req, res) => {
  let targetConnection;
  try {
    const wfhsourceConnection = await connectToWfhSQLServer();
    targetConnection = await mysql.createConnection(targetDbConfig);
    console.log("WFH DB Connection stablised successfully");

    var att_date = new Date().toISOString().split("T")[0];
    var cur_date = new Date();
    var att_month = cur_date.getMonth() + 1;
    var att_year = cur_date.getFullYear();
    var att_day = cur_date.toLocaleDateString("en-IN", { weekday: "long" });

    let rows = [];
    try {
      const result = await wfhsourceConnection.request()
        .query(`SELECT * FROM NT_Sessions WHERE StartDate >= '${att_date}' 
                    AND StartDate < DATEADD(DAY, 1, '${att_date}')`);
      rows = rows.concat(result.recordset);
    } catch (error) {
      console.error(
        `Error fetching data from table NT_Sessions:`,
        error.message
      );
    }

    for (const row of rows) {
      const [inTime, outTime] = [
        formatTimeUTC(row.StartDate),
        formatTimeUTC(row.EndDate),
      ];
      const emp_det = await db.attendance_userid.findOne({
        where: {
          wfh_tool_id: row.UserId,
          status: "ACTIVE",
          isDeleted: false,
          job_type: "WFH",
        },
      });

      if (emp_det) {
        const [existingrows] = await targetConnection.execute(
          `SELECT 1 FROM ESS_DAILY_ATTENDANCE 
                    WHERE att_date = ? AND employee_id = ? AND att_checktime = ? AND entry_type = ? LIMIT 1`,
          [att_date, emp_det.employee_id, outTime, "OUT"]
        );

        if (existingrows.length === 0) {
          const insertQuery = `INSERT INTO ESS_DAILY_ATTENDANCE 
                    (att_day, att_month, att_year, att_date, att_checktime, att_time, entry_type, employee_id, entity_id, createdAt, updatedAt, job_type) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          await targetConnection.execute(insertQuery, [
            att_day,
            att_month,
            att_year,
            att_date,
            inTime,
            row.StartDate,
            "IN",
            emp_det.employee_id,
            emp_det.entity_id,
            cur_date,
            cur_date,
            "WFH",
          ]);
          await targetConnection.execute(insertQuery, [
            att_day,
            att_month,
            att_year,
            att_date,
            outTime,
            row.EndDate,
            "OUT",
            emp_det.employee_id,
            emp_det.entity_id,
            cur_date,
            cur_date,
            "WFH",
          ]);
        } else {
          console.log(
            `WFH Attendance already exists for Employee: ${emp_det.employee_id}`
          );
        }
      }
    }
    res.status(200).send({
      message: "Data synchronized successfully!",
      totalRecords: rows.length,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  } finally {
    if (targetConnection) await targetConnection.end();
    if (targetConnection) await closeSqlServerConnection();
    console.log("Database connections closed.");
  }
};

const targetDbConfig = {
  host: dbconfig.HOST,
  user: dbconfig.USER,
  password: dbconfig.PASSWORD,
  database: dbconfig.DB,
  port: dbconfig.port,
};

function formatTime(dateStr) {
  const str = typeof dateStr === "string" ? dateStr : dateStr.toISOString();
  const timePart = str.slice(11, 19);
  const [hour, minute, second] = timePart.split(":");

  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;

  return `${formattedHour
    .toString()
    .padStart(2, "0")}:${minute}:${second} ${ampm}`;
}

function formatTimeUTC(dateStr) {
  const date = new Date(dateStr);
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = String(hours % 12 || 12).padStart(2, "0");
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

exports.create_attandance_userID = async (req, res) => {
  const {
    entity_id,
    employee_id,
    de_user_id,
    device_id,
    att_user_id,
    job_type,
    wfh_tool_id,
    serial_no,
  } = req.body;
  try {
    let create_attendance;
    if (!att_user_id || att_user_id == null || att_user_id == undefined) {
      const find_attendance = await db.attendance_userid.findOne({
        where: {
          isDeleted: false,
          de_user_id,
          device_id,
          serial_no,
        },
      });
      if (find_attendance) {
        return res.status(409).send({
          code: 409,
          message: `Provided user id , device id and serial no already exists for another employee!`,
        });
      } else {
        const jobType = job_type ? "WFH" : "WFO";
        create_attendance = await db.attendance_userid.create({
          entity_id,
          employee_id,
          de_user_id,
          device_id,
          job_type: jobType,
          wfh_tool_id,
          serial_no,
        });
        if (create_attendance) {
          return res.status(200).send({
            code: 200,
            message: `Employee userID created Successfully!`,
            data: create_attendance,
          });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: `Not able to create!` });
        }
      }
    } else {
      const get_attendance = await db.attendance_userid.findOne({
        where: {
          isDeleted: false,
          de_user_id,
          device_id,
          serial_no,
          id: { [Op.ne]: att_user_id },
        },
        attributes: { exclude: ["att_user_id"] },
      });
      if (get_attendance) {
        return res.status(409).send({
          code: 409,
          message: `Provided user id , device id and serial no already exists for another employee!`,
        });
      } else {
        const jobType = job_type ? "WFH" : "WFO";
        create_attendance = await db.attendance_userid.update(
          {
            entity_id,
            employee_id,
            de_user_id,
            device_id,
            job_type: jobType,
            wfh_tool_id,
            serial_no,
          },
          { where: { id: att_user_id } }
        );
        if (create_attendance) {
          return res.status(200).send({
            code: 200,
            message: `UserID Updated Successfully!`,
            data: create_attendance,
          });
        } else {
          return res
            .status(404)
            .send({ code: 404, message: `Not able to update!` });
        }
      }
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_userID_list = async (req, res) => {
  try {
    const userID_list = await db.sequelize.query(
      `SELECT AU.*,RU.first_name, RU.last_name,RU.employee_code,EM.company_branch FROM ESS_ATTENDANCE_USERID AS AU
            INNER JOIN HRMS_REGISTERED_USER AS RU ON RU.employee_id=AU.employee_id
            INNER JOIN ENTITY_MASTER AS EM ON EM.id=AU.entity_id where AU.isDeleted = 0`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    if (userID_list.length > 0) {
      return res.status(200).send({
        code: 200,
        message: `Fetch All USERID Successfully!`,
        data: userID_list,
      });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: `No data Found!`, data: [] });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getSerialNumber = async (req, res) => {
  try {
    const query = `SELECT * FROM ESS_SERIAL_NUMBER`;

    const results = await db.sequelize.query(query, {
      type: db.Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching serial numbers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch serial numbers",
      error: error.message,
    });
  }
};

exports.get_userBY_entity_id = async (req, res) => {
  try {
    let { entity_id } = req.params;
    const user_list = await db.sequelize.query(
      `SELECT RU.employee_id, RU.first_name, RU.last_name,RU.employee_code FROM HRMS_REGISTERED_USER AS RU where RU.primary_entity_id = ${entity_id} AND RU.isDeleted = 0 AND RU.status="ACTIVE"`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    if (user_list.length > 0) {
      return res.status(200).send({
        code: 200,
        message: `Fetch All USER Successfully!`,
        data: user_list,
      });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: `No user found in this Entity!` });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_USERID_detailBYID = async (req, res) => {
  try {
    const attuser_id = parseInt(req.params.id);
    const userID_detail = await db.sequelize.query(
      `SELECT AU.*,RU.first_name, RU.last_name,RU.employee_code,EM.company_branch FROM ESS_ATTENDANCE_USERID AS AU
            INNER JOIN HRMS_REGISTERED_USER AS RU ON RU.employee_id=AU.employee_id
            INNER JOIN ENTITY_MASTER AS EM ON EM.id=AU.entity_id where AU.isDeleted = 0 AND AU.id = ${attuser_id}`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    if (userID_detail.length > 0) {
      return res.status(200).send({
        code: 200,
        message: `Fetch All USERID Successfully!`,
        data: userID_detail,
      });
    } else {
      return res.status(404).send({ code: 404, message: `No Data found!` });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.delete_USERID_dBYID = async (req, res) => {
  try {
    const att_user_id = req.params.id;
    const delete_userid = await db.attendance_userid.update(
      {
        isDeleted: true,
      },
      {
        where: {
          id: att_user_id,
        },
      }
    );
    if (delete_userid) {
      return res.status(200).send({
        code: 200,
        message: "UserID Deleted successfully",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_emp_global_minutes = async (req, res) => {
  try {
    const { designation_id, department_id, entity_id } = req.query;

    const queries = [
      {
        query: `SELECT GM.global_minute_value, GM.effective_from, GM.applicable_forall, GMD.*, GD.designation_id 
                        FROM GLOBAL_MINUTE_DEPARTMENTAPPL AS GMD
                        LEFT JOIN MASTER_GLOBAL_MINUTE AS GM ON GMD.gm_id = GM.global_minutes_id
                        LEFT JOIN GLOBAL_MINUTE_DESIGNATIONAPPL AS GD ON GD.gm_id = GM.global_minutes_id
                        WHERE GMD.dept_id = ? AND GD.designation_id = ? AND GM.entity_id = ? AND GM.status = "ACTIVE" AND GD.isDeleted=0 AND GM.isDeleted=0 AND GMD.isDeleted=0`,
        params: [department_id, designation_id, entity_id],
      },
      {
        query: `SELECT GM.global_minute_value, GM.effective_from, GM.applicable_forall, GD.* 
                        FROM GLOBAL_MINUTE_DESIGNATIONAPPL AS GD
                        LEFT JOIN MASTER_GLOBAL_MINUTE AS GM ON GD.gm_id = GM.global_minutes_id
                        WHERE GM.entity_id = ? AND GD.designation_id = ? AND GM.status = "ACTIVE" AND GD.isDeleted=0 AND GM.isDeleted=0 `,
        params: [entity_id, designation_id],
      },
      {
        query: `SELECT GM.global_minute_value, GM.effective_from, GM.applicable_forall, GMD.* 
                        FROM GLOBAL_MINUTE_DEPARTMENTAPPL AS GMD
                        LEFT JOIN MASTER_GLOBAL_MINUTE AS GM ON GMD.gm_id = GM.global_minutes_id
                        WHERE GM.entity_id = ? AND GMD.dept_id = ? AND GM.status = "ACTIVE" AND GM.isDeleted=0 AND GMD.isDeleted=0`,
        params: [entity_id, department_id],
      },
      {
        query: `SELECT GM.* 
                        FROM MASTER_GLOBAL_MINUTE AS GM
                        WHERE GM.entity_id = ? AND GM.applicable_forall = "1" AND GM.isDeleted = 0 AND GM.status = "ACTIVE" AND GM.isDeleted=0`,
        params: [entity_id],
      },
    ];

    for (const { query, params } of queries) {
      const result = await db.sequelize.query(query, {
        replacements: params,
        type: db.sequelize.QueryTypes.SELECT,
      });

      if (result.length > 0) {
        return res.status(200).send({
          code: 200,
          message: "Global Minutes fetched successfully",
          data: result[0],
        });
      }
    }
    return res
      .status(200)
      .send({ code: 200, message: "No data Found!", data: [] });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.save_dailyattendance = async (req, res) => {
  try {
    const attendanceRecords = req.body;

    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res.status(400).send({
        code: 400,
        message: "Request body must be a non-empty array of attendance records",
      });
    }

    const validRecords = attendanceRecords.filter(
      (record) => record.att_date && record.employee_id && record.entry_type
    );

    if (validRecords.length === 0) {
      return res.status(400).send({
        code: 400,
        message:
          "No valid records found! Each record must have att_date, employee_id, and entry_type",
      });
    }

    // Step 1: Hard delete all existing records for same employee_id, att_date, and entity_id
    const uniqueCombos = [
      ...new Set(
        validRecords.map((r) => `${r.employee_id}_${r.att_date}_${r.entity_id}`)
      ),
    ];

    await Promise.all(
      uniqueCombos.map(async (combo) => {
        const [employee_id, att_date, entity_id] = combo.split("_");
        await db.daily_attendance.destroy({
          where: {
            employee_id,
            att_date,
            entity_id,
          },
        });
      })
    );

    const newRecords = await db.daily_attendance.bulkCreate(
      validRecords.map((record) => ({
        att_day: record.att_day,
        att_month: record.att_month,
        att_year: record.att_year,
        att_date: record.att_date,
        att_checktime: record.att_checktime,
        att_time: record.att_time,
        entry_type: record.entry_type,
        employee_id: record.employee_id,
        entity_id: record.entity_id,
        job_type: record.job_type,
        status: "Active",
        isDeleted: false,
        att_mode: record.att_mode,
      }))
    );

    // Step 3: Calculate working hours and update daily_attendance_master
    const submittedCombos = [
      ...new Set(
        newRecords.map((r) => `${r.employee_id}_${r.att_date}_${r.entity_id}`)
      ),
    ];

    const hourResults = await Promise.all(
      submittedCombos.map(async (combo) => {
        const [employee_id, att_date, entity_id] = combo.split("_");
        const entries = await db.daily_attendance.findAll({
          where: {
            employee_id,
            att_date,
            entity_id,
            isDeleted: false,
            status: "Active",
          },
          attributes: ["att_checktime", "entry_type"],
          order: [["att_checktime", "ASC"]],
        });

        const fullEntries = entries
          .filter((e) => e.att_checktime)
          .map((e) => {
            const timeString = e.att_checktime.toString().trim();
            const fullDateTime = DateTime.fromFormat(
              `${att_date} ${timeString}`,
              "yyyy-MM-dd hh:mm:ss a"
            );
            return {
              entry_type: e.entry_type,
              datetime: fullDateTime,
            };
          })
          .filter((e) => e.datetime.isValid)
          .sort((a, b) => a.datetime.toMillis() - b.datetime.toMillis());

        let totalMilliseconds = 0;
        const inStack = [];
        for (const entry of fullEntries) {
          if (entry.entry_type === "IN") {
            inStack.push(entry.datetime);
          } else if (entry.entry_type === "OUT" && inStack.length > 0) {
            const inTime = inStack.shift();
            const duration = entry.datetime.diff(inTime).milliseconds;
            if (duration > 0) totalMilliseconds += duration;
          }
        }

        const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        const totalMinutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
        const formatted = `${totalHours} hour(s) ${totalMinutes} minute(s)`;

        await db.daily_attendance_master.update(
          { working_hours: formatted },
          {
            where: { employee_id, att_date, entity_id },
          }
        );

        return {
          employee_id,
          att_date,
          entity_id,
          totalHours,
          totalMinutes,
          formatted,
        };
      })
    );

    const finalHourRecord = hourResults[hourResults.length - 1];

    return res.status(201).send({
      code: 201,
      message: `${newRecords.length} Attendance records saved successfully!`,
      finalRecord: finalHourRecord,
    });
  } catch (error) {
    console.error("Error Saving Attendance:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.export_data_to_Excel = async (req, res) => {
  const entity_id = req.params.entity_id;
  try {
    const baseQuery = `
                    SELECT 
                    fc.employee_id AS employee_id,
                    fc.first_name AS first_name,
                    fc.last_name AS last_name,
                    fc.department_id,
                    fc.primary_entity_id AS entity_id,
                    ft.entity_name,
                    fc.employee_code,
                    ad.dept_id,
                    ad.department_name,
                    fc.department_id,
                    ea.*,
                    ea.employee_id AS attendance_employee_id
                FROM
                    HRMS_REGISTERED_USER AS fc
                LEFT JOIN 
                    ENTITY_MASTER AS ft ON ft.id = fc.primary_entity_id
                JOIN
                    MASTER_DEPARTMENT AS ad ON ad.dept_id = fc.department_id
                JOIN
                    ESS_DAILY_ATTENDANCE AS ea ON ea.employee_id = fc.employee_id
                WHERE
                    fc.isDeleted = false
                    AND ft.id = :entity_id;
            `;

    const getAllData = await db.sequelize.query(baseQuery, {
      replacements: { entity_id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Data Successfully!",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Data Found!",
      });
    }
  } catch (error) {
    console.error("Error in getting data:", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

////////////////////////////////////////////////////////////////////////////

exports.missing_punch_data = async (req, res) => {
  let targetConnection;
  let sourceConnection;
  try {
    sourceConnection = await connectToSqlServer();
    targetConnection = await mysql.createConnection(targetDbConfig);
    console.log("Database Connection established successfully");

    const { start_date, end_date } = req.body;
    if (!start_date || !end_date) {
      return res
        .status(400)
        .send({ message: "start_date and end_date are required" });
    }

    await db.daily_attendance.destroy({
      where: {
        att_date: { [Op.between]: [start_date, end_date] },
        att_mode: "BIOMETRIC",
      },
    });

    const cur_date = new Date();
    let totalRecords = 0;
    let currentDate = moment(start_date);
    const endDate = moment(end_date);

    while (currentDate.isSameOrBefore(endDate)) {
      let att_date = currentDate.format("YYYY-MM-DD");
      let att_day = currentDate.format("dddd");
      let att_month = currentDate.month() + 1;
      let att_year = currentDate.year();
      const tableNames = [
        `DeviceLogsTechnew_${att_month}_${att_year}`,
        `DON_DeviceLogs_${att_month}_${att_year}`,
        `BYVDeviceLogs_${att_month}_${att_year}`,
        `DeviceLogsGur_${att_month}_${att_year}`,
        `DeviceLogsNJO_${att_month}_${att_year}`,
        `DeviceLogsSuratnew_${att_month}_${att_year}`,
        `DeviceLogs_${att_month}_${att_year}`,
      ];

      let rows = [];
      for (const tableName of tableNames) {
        try {
          const result = await sourceConnection
            .request()
            .query(
              `SELECT * FROM ${tableName} WHERE CONVERT(DATE, LogDate) = '${att_date}'`
            );
          rows = rows.concat(result.recordset);
        } catch (error) {
          console.error(
            `Error fetching data from table ${tableName}:`,
            error.message
          );
        }
      }

      for (let row of rows) {
        const dateStr = row.LogDate;
        const att_time = formatAsLocalTime(dateStr);
        const att_checktime = formatTime(dateStr);

        const emp_det = await db.attendance_userid.findOne({
          where: {
            de_user_id: row.UserId,
            device_id: row.DeviceId,
            serial_no: row.C2,
            status: "ACTIVE",
            isDeleted: false,
          },
        });

        if (emp_det) {
          const [existingRows] = await targetConnection.execute(
            `SELECT id FROM ESS_DAILY_ATTENDANCE 
                         WHERE att_date = ? AND att_checktime = ? AND employee_id = ? AND entity_id = ?`,
            [att_date, att_checktime, emp_det.employee_id, emp_det.entity_id]
          );

          if (existingRows.length > 0) {
            await targetConnection.execute(
              `DELETE FROM ESS_DAILY_ATTENDANCE 
                             WHERE att_date = ? AND att_checktime = ? AND employee_id = ? 
                             AND entity_id = ? AND att_mode ='BIOMETRIC'`,
              [att_date, att_checktime, emp_det.employee_id, emp_det.entity_id]
            );
            console.log(
              `Deleted existing attendance for Employee: ${emp_det.employee_id} on ${att_date} at ${att_checktime}`
            );
          }
          const [lastEntry] = await targetConnection.execute(
            `SELECT entry_type FROM ESS_DAILY_ATTENDANCE 
                         WHERE att_date = ? AND employee_id = ? AND entity_id = ? 
                         ORDER BY id DESC LIMIT 1`,
            [att_date, emp_det.employee_id, emp_det.entity_id]
          );
          let entry_type = "IN";
          if (lastEntry.length > 0) {
            entry_type = lastEntry[0].entry_type === "IN" ? "OUT" : "IN";
          }
          const insertQuery = `INSERT INTO ESS_DAILY_ATTENDANCE 
                        (att_day, att_month, att_year, att_date, att_checktime, att_time, entry_type, employee_id, entity_id, createdAt, updatedAt, job_type,att_mode) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

          await targetConnection.execute(insertQuery, [
            att_day,
            att_month,
            att_year,
            att_date,
            att_checktime,
            att_time,
            entry_type,
            emp_det.employee_id,
            emp_det.entity_id,
            cur_date,
            cur_date,
            "WFO",
            "BIOMETRIC",
          ]);
          totalRecords++;
          console.log(
            `Inserted new attendance for Employee: ${emp_det.employee_id} on ${att_date} at ${att_checktime}`
          );
        }
      }
      currentDate.add(1, "days");
    }
    res.status(200).send({
      message: "Data synchronized successfully!",
      totalRecords: totalRecords,
    });
    setImmediate(async () => {
      let currentDate = new Date(start_date);
      let finalDate = new Date(end_date);
      while (currentDate <= finalDate) {
        await mark_missing_attendanceinBG(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  } finally {
    if (targetConnection) await targetConnection.end();
    if (sourceConnection) await closeSqlServerConnection();
    console.log("Database connections closed.");
  }
};

const mark_missing_attendanceinBG = async (date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    console.log(`Processing attendance for ${formattedDate}...`);
    const all_shifts = await db.shift.findAll({
      where: { status: "ACTIVE", isDeleted: false },
    });

    for (const shift of all_shifts) {
      const employees = await db.shift_Allocation.findAll({
        where: {
          entity_id: shift.entity_id,
          shift_master_id: shift.id,
          isDeleted: false,
        },
      });

      const [inshift, outshift] = shift.shift_time.split(" to ");
      const shift_in = formatShiftTime(inshift, -1);
      const shift_out = formatShiftTime(outshift, 1);

      const today = formattedDate;
      const currentMonth = date.getMonth() + 1;
      const currentYear = date.getFullYear();
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      const weekName = getWeekOfMonth(today);
      const { shiftInDate, outdateshift } = getShiftDates(
        today,
        shift_in,
        shift_out
      );
      const shiftOutDate = outdateshift.toISOString().split("T")[0];
      const dateshiftin = formatDateTime(shiftInDate);
      const dateshiftout = formatDateTime(outdateshift);

      for (const employee of employees) {
        const entity_id = employee.entity_id;
        const get_attendance_records = await db.daily_attendance.findAll({
          where: {
            att_date: { [Op.between]: [today, shiftOutDate] },
            entity_id,
            employee_id: employee.employee_id,
            att_time: { [Op.between]: [dateshiftin, dateshiftout] },
          },
          attributes: ["id", "att_checktime", "entry_type"],
          order: [["att_checktime", "ASC"]],
        });

        let totalWorkingMinutes = 0;
        let lastIN = null;
        get_attendance_records.forEach((record) => {
          if (record.entry_type === "IN") {
            lastIN = parseTime(record.att_checktime);
          } else if (record.entry_type === "OUT" && lastIN) {
            let outTime = parseTime(record.att_checktime);
            if (outTime > lastIN) {
              totalWorkingMinutes += (outTime - lastIN) / (1000 * 60);
              lastIN = null;
            }
          }
        });

        const hours = Math.floor(totalWorkingMinutes / 60);
        const minutes = Math.round(totalWorkingMinutes % 60);
        const totalWorkingHours = `${hours}:${minutes} hours`;

        const get_firstIN = await db.daily_attendance.findOne({
          where: {
            att_date: today,
            entity_id,
            employee_id: employee.employee_id,
            isDeleted: false,
            status: "ACTIVE",
            entry_type: "IN",
          },
          attributes: ["id", "att_checktime"],
          order: [["id", "ASC"]],
        });

        const get_lastOUT = await db.daily_attendance.findOne({
          where: {
            att_time: { [Op.between]: [dateshiftin, dateshiftout] },
            entity_id,
            employee_id: employee.employee_id,
            isDeleted: false,
            status: "ACTIVE",
            entry_type: "OUT",
          },
          attributes: ["id", "att_checktime"],
          order: [["id", "DESC"]],
        });

        const alreadyMarked = await db.daily_attendance_master.findOne({
          where: {
            employee_id: employee.employee_id,
            att_date: today,
            status: "ACTIVE",
            isDeleted: false,
          },
        });
        if (alreadyMarked) {
          await db.daily_attendance_master.destroy({
            where: {
              employee_id: employee.employee_id,
              att_date: today,
              entity_id,
            },
          });
        }

        const weekoff = await db.setup_work_calender.findOne({
          where: {
            entity_id,
            employee_id: employee.employee_id,
            week_name: dayName,
            status: "ACTIVE",
            isDeleted: false,
          },
          attributes: [
            "week_1st",
            "week_2nd",
            "week_3rd",
            "week_4th",
            "week_5th",
          ],
        });

        let weekValue = weekoff ? weekoff[weekName] : null;
        let attendance_status;

        const leave_detail = await db.sequelize.query(
          `SELECT AL.id,LM.leave_name,AL.leave_date,AL.leave_day,AL.leave_period,AL.leave_type, AL.deduction_done, L.leaveId FROM ESS_APPLIED_LEAVE_DETAIL AS L 
                    INNER JOIN ESS_APPLIED_LEAVE_DAYS_DETAIL AS AL ON AL.apply_leave_id=L.id
                    INNER JOIN HRMS_LEAVE_MASTER AS LM ON LM.id=L.leaveId
                    WHERE L.employee_id=${employee.employee_id} AND LM.entity_id=${entity_id} AND AL.status = "ACTIVE" AND AL.isDeleted=0 AND AL.leave_date='${today}' 
                    AND LM.isDeleted=0 AND LM.status="ACTIVE" AND L.approval_status="APPROVED" LIMIT 1`,
          { type: db.sequelize.QueryTypes.SELECT }
        );

        const HD_detail = await db.holidayDetail.findOne({
          where: { date: today, entity_id, isDeleted: false, status: "ACTIVE" },
          order: [["id", "ASC"]],
        });

        if (get_firstIN && get_lastOUT && !weekValue) {
          attendance_status = "P";
        } else if (get_firstIN && !get_lastOUT && !weekValue) {
          attendance_status = "DA";
        } else if (weekValue) {
          attendance_status = weekValue === "Full Day" ? "WFO" : "WHO";
        } else if (weekValue && (get_firstIN || get_lastOUT)) {
          attendance_status = "CO";
        } else if (HD_detail != null) {
          attendance_status = "H";
        } else if (leave_detail.length > 0) {
          const leave = leave_detail[0];
          let attendanceCode = "UL"; // default fallback
          let quotaLeft = 0;
          const isFullDay = leave.leave_period === "0";
          const deduction = isFullDay ? 1 : 0.5;

          const allotment = await db.hrmsLeaveAllotment.findOne({
            where: {
              employee_id: employee.employee_id,
              leave_id: leave.leaveId,
              isDeleted: false,
            },
            attributes: ["available_days"],
          });
          if (allotment) {
            quotaLeft = allotment.available_days;
          }

          if (!leave.deduction_done) {
            if (leave.leave_type === "PAID") {
              if (quotaLeft >= deduction) {
                attendanceCode = isFullDay ? "PFD" : "PHD"; // Paid Full Day / Paid Half Day
                quotaLeft -= deduction;

                await db.hrmsLeaveAllotment.update(
                  { available_days: quotaLeft },
                  {
                    where: {
                      employee_id: employee.employee_id,
                      leave_id: leave.leaveId,
                    },
                  }
                );

                await db.essLeavedaysDetail.update(
                  { deduction_done: true },
                  { where: { id: leave.id } }
                );
              } else {
                attendanceCode = isFullDay ? "UL" : "UHL";
              }
            } else if (leave.leave_type === "NON PAID") {
              if (quotaLeft >= deduction) {
                attendanceCode = isFullDay ? "NPFD" : "NPHD"; // Non Paid Full Day / Half Day
                quotaLeft -= deduction;

                await db.hrmsLeaveAllotment.update(
                  { available_days: quotaLeft },
                  {
                    where: {
                      employee_id: employee.employee_id,
                      leave_id: leave.leaveId,
                    },
                  }
                );

                await db.essLeavedaysDetail.update(
                  { deduction_done: true },
                  { where: { id: leave.id } }
                );
              } else {
                attendanceCode = isFullDay ? "UL" : "UHL";
              }
            } else if (leave.leave_type === "HALF PAID") {
              if (quotaLeft >= deduction) {
                attendanceCode = isFullDay ? "HPFD" : "HPHD"; // Half Paid Full Day / Half Day
                quotaLeft -= deduction;

                await db.hrmsLeaveAllotment.update(
                  { available_days: quotaLeft },
                  {
                    where: {
                      employee_id: employee.employee_id,
                      leave_id: leave.leaveId,
                    },
                  }
                );

                await db.essLeavedaysDetail.update(
                  { deduction_done: true },
                  { where: { id: leave.id } }
                );
              } else {
                attendanceCode = isFullDay ? "UL" : "UHL";
              }
            }
          } else {
            // Deduction already done - just assign appropriate code
            if (leave.leave_type === "PAID") {
              attendanceCode = isFullDay ? "PFD" : "PHD";
            } else if (leave.leave_type === "NON PAID") {
              attendanceCode = isFullDay ? "NPFD" : "NPHD";
            } else if (leave.leave_type === "HALF PAID") {
              attendanceCode = isFullDay ? "HPFD" : "HPHD";
            }
          }

          attendance_status = attendanceCode;
        } else {
          attendance_status = "A"; // Absent
        }

        await db.daily_attendance_master.create({
          employee_id: employee.employee_id,
          att_date: today,
          att_day: dayName,
          att_datetime: date,
          entity_id,
          att_month: currentMonth,
          att_year: currentYear,
          attendance_status,
          working_hours: totalWorkingHours,
        });
        console.log(
          `Attendance marked for employee ${employee.employee_id} on ${today}`
        );
      }
    }
  } catch (error) {
    console.error(`Error processing attendance...`, error.message);
  }
};

function formatAsLocalTime(dateStr) {
  const date = new Date(dateStr);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

exports.global_Minute_decrease = async (req, res) => {
  const { employee_id, month, year } = req.query;

  try {
    const startDate = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(startDate).endOf("month").format("YYYY-MM-DD");

    let in_out_details = await db.daily_attendance.findAll({
      where: {
        employee_id,
        att_date: {
          [db.Sequelize.Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        "id",
        "att_date",
        "att_checktime",
        "att_day",
        "entry_type",
        "employee_id",
        "entity_id",
        "job_type",
      ],
    });

    const [result, metadata] = await db.sequelize.query(`
            SELECT
                hs.id AS allocation_id,
                hs.employee_id,
                hs.shift_master_id,
                ms.*
            FROM
                HRMS_SHIFT_ALLOCATION AS hs
            JOIN
                MASTER_SHIFT AS ms
                ON hs.shift_master_id = ms.id;
        `);

    let totalLateInMinutes = 0;
    let totalEarlyOutMinutes = 0;
    let shiftMasterData = null;
    let LATEIN = "On time";
    let LATEGO = "Left on time";

    if (result && result.length > 0) {
      shiftMasterData = result.find(
        (item) => item.employee_id === parseInt(employee_id)
      );

      if (shiftMasterData && shiftMasterData.shift_time) {
        const [shiftStartStr, shiftEndStr] = shiftMasterData.shift_time
          .split(" to ")
          .map((t) => t.trim());
        const shiftStart = moment(shiftStartStr, "HH:mm");
        const shiftEnd = moment(shiftEndStr, "HH:mm");
        const gracePeriod = parseInt(shiftMasterData.grace_peroid, 10) || 0;

        in_out_details.forEach((record) => {
          if (record.entry_type === "IN") {
            const firstCheckinTime = moment(record.att_checktime, "hh:mm:ss A");
            const allowedLateTime = shiftStart
              .clone()
              .add(gracePeriod, "minutes");

            if (firstCheckinTime.isAfter(allowedLateTime)) {
              const lateIn = firstCheckinTime.diff(allowedLateTime, "minutes");
              totalLateInMinutes += lateIn;
            }
          } else if (record.entry_type === "OUT") {
            const lastCheckoutTime = moment(record.att_checktime, "hh:mm:ss A");
            if (lastCheckoutTime.isBefore(shiftEnd)) {
              const earlyGo = shiftEnd.diff(lastCheckoutTime, "minutes");
              totalEarlyOutMinutes += earlyGo;
            }
          }
        });

        LATEIN =
          totalLateInMinutes > 0
            ? `${totalLateInMinutes} Min Late In`
            : "On time";
        LATEGO =
          totalEarlyOutMinutes > 0
            ? `${totalEarlyOutMinutes} Min Early Going`
            : "Left on time";
      }
    }

    return res.status(200).send({
      code: 200,
      message: in_out_details.length
        ? `Attendance fetched successfully!`
        : `No attendance records found!`,
      data: in_out_details,
      shift_data: result,
      shift_name: shiftMasterData ? shiftMasterData.shift_name : null,
      LATEIN,
      LATEGO,
      totalLateInMinutes,
      totalEarlyOutMinutes,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
/////////////////////////////////////// For Setting Multiple Device Id in our DB Exported Devices data from exel to CLIENT_DEVICE_DATA_TEMPP table in our db itself ////////////
// exports.syncMultipleDeviceId = async (req, res) => {
//   try {
//     const matchedUsers = await db.sequelize.query(`
//       SELECT
//         RU.employee_id,
//         RU.first_name,
//         RU.last_name,
//         RU.date_of_birth,
//         RU.primary_entity_id AS entity_id,
//         TEMP.ssl_id AS de_user_id,
//         TEMP.device_id_1,
//         TEMP.device_id_2,
//         TEMP.device_id_3,
//         TEMP.device_id_4,
//         TEMP.device_id_5,
//         TEMP.device_id_6,
//         TEMP.device_id_7
//       FROM HRMS_REGISTERED_USER AS RU
//       JOIN CLIENT_DEVICE_DATA_TEMPP AS TEMP
//         ON RU.first_name COLLATE utf8mb4_general_ci = TEMP.first_name COLLATE utf8mb4_general_ci
//         AND RU.last_name COLLATE utf8mb4_general_ci = TEMP.last_name COLLATE utf8mb4_general_ci
//         AND RU.date_of_birth = TEMP.date_of_birth
//     `, { type: db.sequelize.QueryTypes.SELECT });

//     for (const user of matchedUsers) {
//       const {
//         employee_id, entity_id, de_user_id,
//         device_id_1, device_id_2, device_id_3,
//         device_id_4, device_id_5, device_id_6, device_id_7
//       } = user;

//       const allDeviceIds = [
//         device_id_1, device_id_2, device_id_3,
//         device_id_4, device_id_5, device_id_6, device_id_7
//       ].filter(id => id && id.trim() !== '');

//       if (allDeviceIds.length === 0) continue;

//       for (const deviceId of allDeviceIds) {
//         const existingEntry = await db.sequelize.query(`
//           SELECT id FROM ESS_ATTENDANCE_USERID
//           WHERE employee_id = ? AND device_id = ?
//         `, {
//           replacements: [employee_id, deviceId],
//           type: db.sequelize.QueryTypes.SELECT
//         });

//         if (existingEntry.length > 0) {
//           await db.sequelize.query(`
//             UPDATE ESS_ATTENDANCE_USERID
//             SET de_user_id = ?, updatedAt = NOW()
//             WHERE id = ?
//           `, {
//             replacements: [de_user_id, existingEntry[0].id],
//             type: db.sequelize.QueryTypes.UPDATE
//           });
//         } else {
//           await db.sequelize.query(`
//             INSERT INTO ESS_ATTENDANCE_USERID (
//               de_user_id, job_type, status, isDeleted,
//               createdAt, updatedAt, employee_id, entity_id, device_id
//             ) VALUES (?, 'WFO', 'ACTIVE', 0, NOW(), NOW(), ?, ?, ?)
//           `, {
//             replacements: [de_user_id, employee_id, entity_id, deviceId],
//             type: db.sequelize.QueryTypes.INSERT
//           });
//         }
//       }
//     }

//     res.json({ success: true, message: 'ESS_ATTENDANCE_USERID synced using CLIENT_DEVICE_DATA_TEMPP.' });

//   } catch (err) {
//     console.error('Error syncing ESS_ATTENDANCE_USERID:', err);
//     res.status(500).json({ success: false, message: 'Server error occurred.' });
//   }
// };

///////////////////////////////////// For Setting Device Id in our DB throught clent data matching////////////
// exports.syncDeviceIdToAttendanceUserId = async (req, res) => {
//     let sourceConnection;
//     let targetConnection;

//     try {
//         sourceConnection = await connectToSqlServer();  // MSSQL
//         targetConnection = await mysql.createConnection(targetDbConfig);  // MySQL
//         console.log("Connected to both databases.");

//         const years = [2021,2022,2023, 2024, 2025];
//         const months = Array.from({ length: 12 }, (_, i) => i + 1);  // [1, 2, ..., 12]

//         const logPrefixes = [
//             'DeviceLogsTechnew',
//             'DON_DeviceLogs',
//             'BYVDeviceLogs',
//             'DeviceLogsGur',
//             'DeviceLogsNJO',
//             'DeviceLogsSuratnew',
//             'DeviceLogsSur',
//             'DeviceLogs',
//             'DO_DeviceLogs',
//         ];

//         let uniqueUserDeviceMap = new Map();

//         for (const year of years) {
//             for (const month of months) {
//                 for (const prefix of logPrefixes) {
//                     const tableName = `${prefix}_${month}_${year}`;
//                     try {
//                         const result = await sourceConnection.request()
//                             .query(`SELECT DISTINCT UserId, DeviceId FROM ${tableName} WHERE DeviceId != 0`);

//                         for (const row of result.recordset) {
//                             if (!uniqueUserDeviceMap.has(row.UserId)) {
//                                 uniqueUserDeviceMap.set(row.UserId, row.DeviceId);
//                             }
//                         }
//                     } catch (err) {
//                         if (err.message.includes("Invalid object name")) {
//                             console.warn(`Table ${tableName} not found.`);
//                         } else {
//                             console.warn(`Error querying ${tableName}: ${err.message}`);
//                         }
//                     }
//                 }
//             }
//         }

//         let updatedCount = 0;

//         for (const [userId, deviceId] of uniqueUserDeviceMap.entries()) {
//             const [results] = await targetConnection.execute(
//                 `UPDATE ESS_ATTENDANCE_USERID
//                  SET device_id = ?
//                  WHERE de_user_id = ? AND isDeleted = false AND status = 'ACTIVE'`,
//                 [deviceId, userId]
//             );
//             if (results.affectedRows > 0) {
//                 updatedCount += results.affectedRows;
//             }
//         }

//         res.status(200).send({
//             message: 'DeviceId synced successfully.',
//             updatedRecords: updatedCount,
//             totalUsersChecked: uniqueUserDeviceMap.size
//         });

//     } catch (error) {
//         console.error("Sync Error:", error.message);
//         res.status(500).send({ message: "Failed to sync DeviceId", error: error.message });
//     } finally {
//         if (targetConnection) await targetConnection.end();
//         if (sourceConnection) await closeSqlServerConnection();
//         console.log('Connections closed.');
//     }
// };

//////////////////////////////////////////

///////////////////////////////////////////////////////////////////

exports.export_excel_att_report = async (req, res) => {
  const { entity_id, month, year } = req.params;
  const entity_ids = req.body.entity_ids;

  try {
    const baseQuery = `
      SELECT 
        RU.employee_id,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS employee_name,
        RU.department_id,
        RU.primary_entity_id AS entity_id,
        EM.entity_name,
        CONCAT(EM.entity_name, '-', RU.employee_code) AS employee_code,
        MD.dept_id,
        MD.department_name,
        DG.designation_name,
        DG.designation_id,
        MS.shift_time,
        DA.att_date,
        DA.att_day,
        DA.att_checktime,
        DAM.attendance_status AS type,
        DAM.working_hours
      FROM HRMS_REGISTERED_USER AS RU
      LEFT JOIN ENTITY_MASTER AS EM 
        ON EM.id = RU.primary_entity_id
      JOIN MASTER_DEPARTMENT AS MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION AS DG 
        ON DG.designation_id = RU.designation_id
      JOIN ESS_DAILY_ATTENDANCE AS DA 
        ON DA.employee_id = RU.employee_id
      LEFT JOIN ESS_DAILY_ATTENDANCE_MASTER AS DAM 
        ON DAM.employee_id = DA.employee_id 
        AND DAM.att_date = DA.att_date
      LEFT JOIN HRMS_SHIFT_ALLOCATION AS HSA 
        ON HSA.employee_id = RU.employee_id
      LEFT JOIN MASTER_SHIFT AS MS 
        ON MS.id = HSA.shift_master_id
      WHERE RU.isDeleted = false
        AND EM.id IN (:entity_ids)
        AND DA.att_month = :month
        AND DA.att_year = :year
      ORDER BY RU.employee_id, DA.att_date, DA.att_time
    `;
    const [monthResults] = await db.sequelize.query(baseQuery, {
      replacements: { month, year, entity_ids },
    });

    const yearlyQuery = `
      SELECT 
        RU.employee_id,
        CONCAT_WS(' ', RU.first_name, RU.middle_name, RU.last_name) AS employee_name,
        RU.department_id,
        RU.primary_entity_id AS entity_id,
        EM.entity_name,
        CONCAT(EM.entity_name, '-', RU.employee_code) AS employee_code,
        MD.dept_id,
        MD.department_name,
        DG.designation_name,
        DG.designation_id,
        MS.shift_time,
        DA.att_date,
        DA.att_day,
        DA.att_checktime,
        DAM.attendance_status AS type,
        DAM.working_hours
      FROM HRMS_REGISTERED_USER AS RU
      LEFT JOIN ENTITY_MASTER AS EM 
        ON EM.id = RU.primary_entity_id
      JOIN MASTER_DEPARTMENT AS MD 
        ON MD.dept_id = RU.department_id
      LEFT JOIN DESIGNATION AS DG 
        ON DG.designation_id = RU.designation_id
      JOIN ESS_DAILY_ATTENDANCE AS DA 
        ON DA.employee_id = RU.employee_id
      LEFT JOIN ESS_DAILY_ATTENDANCE_MASTER AS DAM 
        ON DAM.employee_id = DA.employee_id 
        AND DAM.att_date = DA.att_date
      LEFT JOIN HRMS_SHIFT_ALLOCATION AS HSA 
        ON HSA.employee_id = RU.employee_id
      LEFT JOIN MASTER_SHIFT AS MS 
        ON MS.id = HSA.shift_master_id
      WHERE RU.isDeleted = false
        AND EM.id IN (:entity_ids)
        AND DA.att_year = :year
      ORDER BY RU.employee_id, DA.att_date, DA.att_time
    `;
    const [yearlyResults] = await db.sequelize.query(yearlyQuery, {
      replacements: { year, entity_ids },
    });

    const groupedYearly = {};
    yearlyResults.forEach((row) => {
      const key = `${row.employee_id}_${row.att_date}`;
      if (!groupedYearly[key]) groupedYearly[key] = { ...row, logs: [] };
      groupedYearly[key].logs.push(row.att_checktime);
    });
    const yearlyData = Object.values(groupedYearly).map((item) => {
      item.logs.sort(
        (a, b) => new Date(`1970-01-01T${a}`) - new Date(`1970-01-01T${b}`)
      );
      const checkIn = item.logs[0];
      const checkOut = item.logs[item.logs.length - 1];
      let lateIn = 0,
        earlyOut = 0;
      if (item.shift_time?.includes("to") && checkIn) {
        const [sStart, sEnd] = item.shift_time.split("to").map((s) => s.trim());
        const mStart = moment(sStart, "H:mm");
        const mEnd = moment(sEnd, "H:mm");
        const mIn = moment(checkIn, "hh:mm:ss A");
        const mOut = checkOut ? moment(checkOut, "hh:mm:ss A") : null;
        if (mIn.isAfter(mStart)) lateIn = Math.floor(mIn.diff(mStart) / 60000);
        if (mOut && mOut.isBefore(mEnd))
          earlyOut = Math.floor(mEnd.diff(mOut) / 60000);
      }
      return {
        employee_id: item.employee_id,
        att_date: item.att_date,
        late_in_minutes: lateIn,
        early_out_minutes: earlyOut,
      };
    });

    const groupedMonth = {};
    monthResults.forEach((row) => {
      const key = `${row.employee_id}_${row.att_date}`;
      if (!groupedMonth[key]) groupedMonth[key] = { ...row, logs: [] };
      groupedMonth[key].logs.push(row.att_checktime);
    });
    const monthlyData = Object.values(groupedMonth).map((item) => {
      item.logs.sort(
        (a, b) => new Date(`1970-01-01T${a}`) - new Date(`1970-01-01T${b}`)
      );
      const checkIn = item.logs[0];
      const checkOut =
        item.logs.length > 1 ? item.logs[item.logs.length - 1] : null;
      let lateIn = 0,
        earlyOut = 0,
        worked = null,
        lateDur = null,
        earlyDur = null;
      if (item.shift_time?.includes("to") && checkIn) {
        const [sStart, sEnd] = item.shift_time.split("to").map((s) => s.trim());
        const mStart = moment(sStart, "H:mm");
        const mEnd = moment(sEnd, "H:mm");
        const mIn = moment(checkIn, "hh:mm:ss A");
        const mOut = checkOut ? moment(checkOut, "hh:mm:ss A") : null;
        if (mIn.isAfter(mStart)) {
          const d = mIn.diff(mStart);
          lateIn = Math.floor(d / 60000);
          lateDur = moment.utc(d).format("HH:mm:ss");
        }
        if (mOut && mOut.isBefore(mEnd)) {
          const d = mEnd.diff(mOut);
          earlyOut = Math.floor(d / 60000);
          earlyDur = moment.utc(d).format("HH:mm:ss");
        }
        if (mOut) worked = moment.utc(mOut.diff(mIn)).format("HH:mm:ss");
      }
      const logs = {};
      item.logs.forEach((l, i) => (logs[`log_${i + 1}`] = l));
      return {
        employee_id: item.employee_id,
        employee_name: item.employee_name,
        entity_id: item.entity_id,
        entity_name: item.entity_name,
        employee_code: item.employee_code,
        dept_id: item.dept_id,
        department_name: item.department_name,
        designation_name: item.designation_name,
        designation_id: item.designation_id,
        shift_time: item.shift_time,
        att_date: item.att_date,
        att_day: item.att_day,
        type: item.type,
        check_in: checkIn,
        check_out: checkOut,
        hours_worked: worked,
        late_in_minutes: lateIn,
        early_out_minutes: earlyOut,
        late_in_full: lateDur,
        early_out_full: earlyDur,
        ...logs,
      };
    });

    const [mgmList] = await db.sequelize.query(
      `SELECT * FROM MASTER_GLOBAL_MINUTE
         WHERE entity_id IN (:entity_ids) AND isDeleted = false`,
      { replacements: { entity_ids } }
    );
    const [gmDeptAppl] = await db.sequelize.query(
      `SELECT * FROM GLOBAL_MINUTE_DEPARTMENTAPPL WHERE isDeleted = false`
    );
    const [gmDesigAppl] = await db.sequelize.query(
      `SELECT * FROM GLOBAL_MINUTE_DESIGNATIONAPPL WHERE isDeleted = false`
    );
    const deptApplMap = new Map(),
      desigApplMap = new Map();
    gmDeptAppl.forEach((d) => {
      if (!deptApplMap.has(d.gm_id)) deptApplMap.set(d.gm_id, new Set());
      deptApplMap.get(d.gm_id).add(d.dept_id);
    });
    gmDesigAppl.forEach((d) => {
      if (!desigApplMap.has(d.gm_id)) desigApplMap.set(d.gm_id, new Set());
      desigApplMap.get(d.gm_id).add(d.designation_id);
    });

    const runningBalances = {};
    yearlyData.sort((a, b) =>
      a.employee_id === b.employee_id
        ? new Date(a.att_date) - new Date(b.att_date)
        : a.employee_id - b.employee_id
    );
    mgmList.forEach((mgm) => {
      const effDate =
        mgm.effective_from instanceof Date
          ? mgm.effective_from
          : new Date(mgm.effective_from);
      yearlyData.forEach((d) => {
        if (new Date(d.att_date) < effDate) return;
        const empId = d.employee_id;
        const sample = monthResults.find((r) => r.employee_id === empId);
        if (!sample) return;
        const okAll =
          mgm.applicable_forall === 1 || mgm.applicable_forall === true;
        const okDept = deptApplMap
          .get(mgm.global_minutes_id)
          ?.has(sample.dept_id);
        const okDesig = desigApplMap
          .get(mgm.global_minutes_id)
          ?.has(sample.designation_id);
        if (!(okAll || okDept || okDesig)) return;
        if (!runningBalances[empId]) {
          runningBalances[empId] = {
            balance: mgm.global_minute_value,
            history: {},
          };
        }
        const loss = (d.late_in_minutes || 0) + (d.early_out_minutes || 0);
        runningBalances[empId].balance -= loss;
        runningBalances[empId].history[d.att_date] =
          runningBalances[empId].balance;
      });
    });

    monthlyData.sort((a, b) =>
      a.employee_id === b.employee_id
        ? new Date(a.att_date) - new Date(b.att_date)
        : a.employee_id - b.employee_id
    );
    const finalMonthlyData = monthlyData.map((row) => ({
      ...row,
      balance_global_minute:
        runningBalances[row.employee_id]?.history?.[row.att_date] ?? "NA",
    }));

    return res.status(200).json({ data: finalMonthlyData, code: 200 });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

/* Google Api Key */

exports.getGoogleApiKey = async (req, res) => {
  try {
    const data = await db.google_api_key.findAll();
    if (data) {
      return res.status(200).json({ data: data });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

