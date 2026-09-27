const db = require("../../../models/index");
const { DateTime } = require("luxon");


// exports.createBioAtt_workingList = async (req, res) => {
//   try {
// //     let today = new Date();
// // let att_date = today.toISOString().split('T')[0];
//  let  att_date  = req.body.att_date;
//     if (!att_date) {
//       return res.status(400).json({
//         code: 400,
//         message: "Attendance date (att_date) is required",
//       });
//     }

//     // Step 1: Fetch all active shifts
//     const all_shifts = await db.shift.findAll({
//       where: { status: "ACTIVE", isDeleted: false },
//       raw: true,
//     });

//     let allEmployees = [];

//     // Step 2: Fetch all employees for each shift
//     for (const shift of all_shifts) {
//       const employees = await db.shift_Allocation.findAll({
//         where: {
//           entity_id: shift.entity_id,
//           shift_master_id: shift.id,
//           isDeleted: false,
//         },
//         raw: true,
//       });

//       const mappedEmployees = employees.map((emp) => ({
//         ...emp,
//         shift_details: shift,
//       }));

//       allEmployees.push(...mappedEmployees);
//     }

//     // Step 3: Process all employees
//     const results = await Promise.all(
//       allEmployees.map(async (emp) => {
//         const entries = await db.daily_attendance.findAll({
//           where: {
//             employee_id: emp.employee_id,
//             att_date,
//             entity_id: emp.entity_id,
//             isDeleted: false,
//             status: "Active",
//           },
//           attributes: ["att_checktime", "entry_type"],
//           order: [["att_checktime", "ASC"]],
//           raw: true,
//         });

//         const formatTime = (date) =>
//           date
//             .toLocaleTimeString("en-US", {
//               hour: "2-digit",
//               minute: "2-digit",
//               hour12: true,
//             })
//             .replace(" ", "");

//         const formatDuration = (ms) => {
//           const totalMinutes = Math.floor(ms / 60000);
//           const hours = Math.floor(totalMinutes / 60);
//           const minutes = totalMinutes % 60;
//           return `${hours}:${minutes} hr`;
//         };

//         const validEntries = entries
//           .filter((e) => e.att_checktime)
//           .map((e) => ({
//             entry_type: e.entry_type,
//             datetime: new Date(`${att_date} ${e.att_checktime.trim()}`),
//           }))
//           .filter((e) => !isNaN(e.datetime.getTime()))
//           .sort((a, b) => a.datetime - b.datetime);

//         let totalMilliseconds = 0;
//         const inStack = [];
//         const working_hr_list = [];

//         for (const entry of validEntries) {
//           if (entry.entry_type === "IN") {
//             inStack.push(entry.datetime);
//           } else if (entry.entry_type === "OUT" && inStack.length > 0) {
//             const inTime = inStack.shift();
//             const outTime = entry.datetime;
//             const duration = outTime - inTime;

//             if (duration > 0) {
//               totalMilliseconds += duration;
//               const hours = Math.floor(duration / (1000 * 60 * 60));
//               const minutes = Math.floor((duration / (1000 * 60)) % 60);
//               working_hr_list.push({
//                 in_time: formatTime(inTime),
//                 out_time: formatTime(outTime),
//                 working_hr: `${hours}:${minutes} hr`,
//               });
//             }
//           }
//         }

//         const total_working_hr = formatDuration(totalMilliseconds);

//         const [shiftStartStr, shiftEndStr] = emp.shift_details.shift_time
//           .split("to")
//           .map((t) => t.trim());

//         const shiftStart = new Date(`${att_date} ${shiftStartStr}`);
//         const shiftEnd = new Date(`${att_date} ${shiftEndStr}`);

//         const firstIn = validEntries.find((e) => e.entry_type === "IN")?.datetime;
//         const lastOut = [...validEntries]
//           .reverse()
//           .find((e) => e.entry_type === "OUT")?.datetime;

//         let early_in_hr = "0:0 hr";
//         let late_in_hr = "0:0 hr";
//         let early_out_hr = "0:0 hr";
//         let late_out_hr = "0:0 hr";
//         let left_grace_day = emp.shift_details.grace_day ?? 0;

//         // --- Previous date for grace tracking ---
//         const givenDate = new Date(att_date);
//         const prevDate = new Date(givenDate);
//         prevDate.setDate(givenDate.getDate() - 1);
//         const formattedPrevDate = prevDate.toISOString().split("T")[0];

//         const previousRecord = await db.bioAttendance_timelist.findOne({
//           where: {
//             employee_id: emp.employee_id,
//             att_date: formattedPrevDate,
//           },
//           attributes: ["left_grace_day"],
//           raw: true,
//         });

//         if (previousRecord && previousRecord.left_grace_day !== undefined) {
//           left_grace_day = previousRecord.left_grace_day;
//         }

//         // --- Grace period logic ---
//         const gracePeriodMinutes = parseInt(emp.shift_details.grace_peroid) || 0;

//         if (firstIn && shiftStart) {
//           const diffMs = firstIn - shiftStart;

//           if (diffMs < 0) {
//             early_in_hr = formatDuration(Math.abs(diffMs));
//           } else if (diffMs > 0) {
//             const diffMinutes = Math.floor(diffMs / (1000 * 60));

//             if (diffMinutes <= gracePeriodMinutes && left_grace_day > 0) {
//               left_grace_day--;
//               late_in_hr = "0:0 hr";
//             } else {
//               late_in_hr = formatDuration(diffMs);
//             }
//           }
//         }

//         if (lastOut && shiftEnd) {
//           if (lastOut < shiftEnd) {
//             early_out_hr = formatDuration(shiftEnd - lastOut);
//           } else if (lastOut > shiftEnd) {
//             late_out_hr = formatDuration(lastOut - shiftEnd);
//           }
//         }

//         const late_working_hr =
//           lastOut && shiftEnd && lastOut > shiftEnd
//             ? formatDuration(lastOut - shiftEnd)
//             : "0:0 hr";

//         const dateObj = new Date(att_date);
//         const att_month = dateObj.getMonth() + 1;
//         const att_year = dateObj.getFullYear();

//         // --- ⚡ DELETE existing record if exists ---
//         await db.bioAttendance_timelist.destroy({
//           where: {
//             employee_id: emp.employee_id,
//             att_date,
//           },
//         });

//         // --- 🟢 CREATE new record ---
//         const newRecord = await db.bioAttendance_timelist.create({
//           employee_id: emp.employee_id,
//           shift_id: emp.shift_master_id,
//           entity_id: emp.entity_id,
//           total_working_hr,
//           late_working_hr,
//           working_hr_list,
//           early_in_hr,
//           late_in_hr,
//           early_out_hr,
//           late_out_hr,
//           left_grace_day,
//           isDeleted: false,
//           att_date,
//           att_month,
//           att_year,
//         });

//         // --- Final response for this employee ---
//         return {
//           ...emp,
//           att_date,
//           total_working_hr,
//           working_hr_list,
//           early_in_hr,
//           late_in_hr,
//           early_out_hr,
//           late_out_hr,
//           left_grace_day,
//         };
//       })
//     );

//     // Step 4: Send response
//     return res.status(200).send({
//       code: 200,
//       message:
//         "Employee working hours & early/late calculation generated successfully",
//       data: results,
//     });
//   } catch (error) {
//     console.error("Error creating bio attendance working list:", error);
//     return res.status(500).json({
//       code: 500,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };


// exports.getAllBioAttOfEmp = async (req, res) => {
//   try {
//     let { month, year, shift_id } = req.body;

//     // ✅ Default: last month if not provided
//     const today = new Date();
//     if (!month || !year) {
//       today.setMonth(today.getMonth() - 1);
//       month = today.getMonth() + 1;
//       year = today.getFullYear();
//     }

//     const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
//     const endDate = new Date(year, month, 0).toISOString().split("T")[0];

//     // ✅ Fetch attendance data only (no extra processing)
//     const [bioAttData] = await db.sequelize.query(`
//       SELECT 
//         bio.*,
//         CONCAT(hr.first_name, ' ', hr.last_name) AS employee_name,
//         hsa.dept_id AS department_id,
//         ms.shift_name,
//         ms.shift_time,
//         ms.shift_duration,
//         ms.grace_peroid
//       FROM BIO_ATT_TIME_EMP_MST bio
//       LEFT JOIN HRMS_REGISTERED_USER hr 
//         ON hr.employee_id = bio.employee_id
//       LEFT JOIN HRMS_SHIFT_ALLOCATION hsa
//         ON hsa.employee_id = bio.employee_id 
//         AND hsa.shift_master_id = bio.shift_id
//         AND hsa.isDeleted = 0
//       LEFT JOIN MASTER_SHIFT ms
//         ON ms.id = hsa.shift_master_id
//         AND ms.isDeleted = 0
//       WHERE bio.att_date BETWEEN '${startDate}' AND '${endDate}'
//         AND bio.isDeleted = 0
//         ${shift_id ? `AND bio.shift_id = ${shift_id}` : ""}
//       ORDER BY bio.employee_id, bio.att_date
//     `);

//     if (!bioAttData.length) {
//       return res.status(404).json({
//         code: 404,
//         message: "No Bio Attendance found for selected month/year",
//         data: [],
//       });
//     }

//     return res.status(200).json({
//       code: 200,
//       message: "Bio Attendance fetched successfully",
//       data: bioAttData,
//     });
//   } catch (error) {
//     console.error("Error fetching attendance:", error);
//     res.status(500).json({
//       code: 500,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

exports.cron_BioAtt_workingList = async (req, res) => {
  try {
    // const att_date = req.body.att_date;
 let today = new Date();
let att_date = today.toISOString().split('T')[0];
    if (!att_date) {
      return res.status(400).json({
        code: 400,
        message: "Attendance date (att_date) is required",
      });
    }

    // Step 1: Fetch all active shifts
    const all_shifts = await db.shift.findAll({
      where: { status: "ACTIVE", isDeleted: false },
      raw: true,
    });

    let allEmployees = [];

    // Step 2: Fetch all employees for each shift
    for (const shift of all_shifts) {
      const employees = await db.shift_Allocation.findAll({
        where: {
          entity_id: shift.entity_id,
          shift_master_id: shift.id,
          isDeleted: false,
        },
        raw: true,
      });

      const mappedEmployees = employees.map((emp) => ({
        ...emp,
        shift_details: shift,
      }));

      allEmployees.push(...mappedEmployees);
    }

    // Step 3: Process all employees
    const results = await Promise.all(
      allEmployees.map(async (emp) => {
        const entries = await db.daily_attendance.findAll({
          where: {
            employee_id: emp.employee_id,
            att_date,
            entity_id: emp.entity_id,
            isDeleted: false,
            status: "Active",
          },
          attributes: ["att_checktime", "entry_type"],
          order: [["att_checktime", "ASC"]],
          raw: true,
        });

        const formatTime = (date) =>
          date
            .toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .replace(" ", "");

        const formatDuration = (ms) => {
          const totalMinutes = Math.floor(ms / 60000);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return `${hours}:${minutes} hr`;
        };

        const validEntries = entries
          .filter((e) => e.att_checktime)
          .map((e) => ({
            entry_type: e.entry_type,
            datetime: new Date(`${att_date} ${e.att_checktime.trim()}`),
          }))
          .filter((e) => !isNaN(e.datetime.getTime()))
          .sort((a, b) => a.datetime - b.datetime);

        let totalMilliseconds = 0;
        const inStack = [];
        const working_hr_list = [];

        for (const entry of validEntries) {
          if (entry.entry_type === "IN") {
            inStack.push(entry.datetime);
          } else if (entry.entry_type === "OUT" && inStack.length > 0) {
            const inTime = inStack.shift();
            const outTime = entry.datetime;
            const duration = outTime - inTime;

            if (duration > 0) {
              totalMilliseconds += duration;
              const hours = Math.floor(duration / (1000 * 60 * 60));
              const minutes = Math.floor((duration / (1000 * 60)) % 60);
              working_hr_list.push({
                in_time: formatTime(inTime),
                out_time: formatTime(outTime),
                working_hr: `${hours}:${minutes} hr`,
              });
            }
          }
        }

        const total_working_hr = formatDuration(totalMilliseconds);

        const [shiftStartStr, shiftEndStr] = emp.shift_details.shift_time
          .split("to")
          .map((t) => t.trim());

        const shiftStart = new Date(`${att_date} ${shiftStartStr}`);
        const shiftEnd = new Date(`${att_date} ${shiftEndStr}`);

        const firstIn = validEntries.find((e) => e.entry_type === "IN")?.datetime;
        const lastOut = [...validEntries]
          .reverse()
          .find((e) => e.entry_type === "OUT")?.datetime;

        let early_in_hr = "0:0 hr";
        let late_in_hr = "0:0 hr";
        let early_out_hr = "0:0 hr";
        let late_out_hr = "0:0 hr";
        let left_grace_day = emp.shift_details.grace_day ?? 0;

        // --- Previous date for grace tracking ---
        const givenDate = new Date(att_date);
        const prevDate = new Date(givenDate);
        prevDate.setDate(givenDate.getDate() - 1);
        const formattedPrevDate = prevDate.toISOString().split("T")[0];

        const previousRecord = await db.bioAttendance_timelist.findOne({
          where: {
            employee_id: emp.employee_id,
            att_date: formattedPrevDate,
          },
          attributes: ["left_grace_day"],
          raw: true,
        });

        if (previousRecord && previousRecord.left_grace_day !== undefined) {
          left_grace_day = previousRecord.left_grace_day;
        }

        // --- Grace period logic ---
        const gracePeriodMinutes = parseInt(emp.shift_details.grace_peroid) || 0;

        if (firstIn && shiftStart) {
          const diffMs = firstIn - shiftStart;

          if (diffMs < 0) {
            early_in_hr = formatDuration(Math.abs(diffMs));
          } else if (diffMs > 0) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            if (diffMinutes <= gracePeriodMinutes && left_grace_day > 0) {
              left_grace_day--;
              late_in_hr = "0:0 hr";
            } else {
              late_in_hr = formatDuration(diffMs);
            }
          }
        }

        if (lastOut && shiftEnd) {
          if (lastOut < shiftEnd) {
            early_out_hr = formatDuration(shiftEnd - lastOut);
          } else if (lastOut > shiftEnd) {
            late_out_hr = formatDuration(lastOut - shiftEnd);
          }
        }

        const late_working_hr =
          lastOut && shiftEnd && lastOut > shiftEnd
            ? formatDuration(lastOut - shiftEnd)
            : "0:0 hr";

        const dateObj = new Date(att_date);
        const att_month = dateObj.getMonth() + 1;
        const att_year = dateObj.getFullYear();

        // ✅ Step 4: Fetch deduction rules for this employee’s shift & entity
        const deductionQuery = `
          SELECT dr.*
          FROM DEDUCTION_RULES AS dr
          WHERE dr.isDeleted = 0
          AND dr.status = 'ACTIVE'
          AND dr.entity_id = ${emp.entity_id}
          AND dr.shift_id = ${emp.shift_master_id}
        `;
        const [deductionRules] = await db.sequelize.query(deductionQuery);

        let appliedDeductionRule = null;

        if (deductionRules?.length && firstIn) {
          const inTime = new Date(firstIn);
          const empWorkingHr = parseFloat(total_working_hr.split(":")[0] || 0);

          for (const rule of deductionRules) {
            const fromTime = rule.from_time ? new Date(`${att_date} ${rule.from_time}`) : null;
            const toTime = rule.to_time ? new Date(`${att_date} ${rule.to_time}`) : null;

            // Skip rule if employee completed full shift & rule.completed_shift_hr = "YES"
            if (rule.completed_shift_hr === "YES" && empWorkingHr >= 9) continue;

            let match = false;

            if (fromTime && toTime) {
              if (inTime >= fromTime && inTime <= toTime) match = true;
            } else if (fromTime && !toTime) {
              if (inTime >= fromTime) match = true;
            }

            if (match) {
              appliedDeductionRule = rule;
              break; // ✅ Only one rule applies
            }
          }
        }

        // --- ⚡ DELETE existing record if exists ---
        await db.bioAttendance_timelist.destroy({
          where: {
            employee_id: emp.employee_id,
            att_date,
          },
        });

        // --- 🟢 CREATE new record ---
        await db.bioAttendance_timelist.create({
          employee_id: emp.employee_id,
          shift_id: emp.shift_master_id,
          entity_id: emp.entity_id,
          total_working_hr,
          late_working_hr,
          working_hr_list,
          early_in_hr,
          late_in_hr,
          early_out_hr,
          late_out_hr,
          left_grace_day,
          deduction_rule_id: appliedDeductionRule ? appliedDeductionRule.id : null,
          isDeleted: false,
          att_date,
          att_month,
          att_year,
        });

        return {
          ...emp,
          att_date,
          total_working_hr,
          working_hr_list,
          early_in_hr,
          late_in_hr,
          early_out_hr,
          late_out_hr,
          left_grace_day,
          deduction_rule_id: appliedDeductionRule ? appliedDeductionRule.id : null,
        };
      })
    );

    return res.status(200).send({
      code: 200,
      message:
        "Employee working hours, early/late & deduction rule calculation generated successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error creating bio attendance working list:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};





exports.getAllBioAttOfEmp = async (req, res) => {
  try {
    let { month, year, shift_id } = req.body;

    // ✅ Default month/year if not provided
    const today = new Date();
    if (!month || !year) {
      today.setMonth(today.getMonth() - 1);
      month = today.getMonth() + 1;
      year = today.getFullYear();
    }

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    console.log("Fetching Bio Attendance from", startDate, "to", endDate);

    // ✅ Step 1: Fetch all attendance data (includes deduction_rule_id)
    const [bioAttData] = await db.sequelize.query(`
      SELECT 
        bio.*,
        CONCAT(hr.first_name, ' ', hr.last_name) AS employee_name,
        hsa.dept_id AS department,
        ms.id AS shift_id,
        ms.shift_name,
        ms.shift_time,
        ms.shift_duration,
        ms.grace_peroid,
        bio.entity_id,
        dr.id AS deduction_rule_id
      FROM BIO_ATT_TIME_EMP_MST bio
      LEFT JOIN HRMS_REGISTERED_USER hr 
        ON hr.employee_id = bio.employee_id
      LEFT JOIN HRMS_SHIFT_ALLOCATION hsa
        ON hsa.employee_id = bio.employee_id 
        AND hsa.shift_master_id = bio.shift_id
        AND hsa.isDeleted = 0
      LEFT JOIN DEDUCTION_RULES dr
        ON dr.id = bio.deduction_rule_id
        AND dr.isDeleted = 0
        AND dr.status = 'ACTIVE'
      LEFT JOIN MASTER_SHIFT ms
        ON ms.id = hsa.shift_master_id
        AND ms.isDeleted = 0
      WHERE bio.att_date BETWEEN '${startDate}' AND '${endDate}'
        AND bio.isDeleted = 0
        ${shift_id ? `AND bio.shift_id = ${shift_id}` : ""}
      ORDER BY bio.employee_id, bio.att_date
    `);

    if (!bioAttData.length) {
      return res.status(404).json({
        code: 404,
        message: "No Bio Attendance found for selected criteria",
        data: [],
      });
    }

    // ✅ Step 2: Fetch all deduction rules (once)
    let deductionQuery = `
      SELECT dr.*
      FROM DEDUCTION_RULES AS dr
      WHERE dr.isDeleted = 0
      AND dr.status = 'ACTIVE'
    `;
    if (shift_id) deductionQuery += ` AND dr.shift_id = ${shift_id}`;
    const [deductionRules] = await db.sequelize.query(deductionQuery);

    // ✅ Step 3: Process employee summary
    const employeeSummary = {};

    for (const record of bioAttData) {
      const empId = record.employee_id;
      const shiftId = record.shift_id;
      const totalHr = parseFloat(record.total_working_hr || 0);

      if (!employeeSummary[empId]) {
        employeeSummary[empId] = {
          emp_id: empId,
          employee_name: record.employee_name,
          department: record.department,
          month,
          year,
          entity_id: record.entity_id,
          shift_id: shiftId,
          total_working_hours: 0,
          present_days: 0,
          total_occassions: 0,
          after_2_concessions: 0,
          hod_remarks: record.hod_remarks || null,
          hod_approval: record.hod_approval || 0,
          leave_deduction: null,
          leave_balance: null,
          lwp: null,
          remarks: null,
          deduction_count_map: {}, // temporary counter
        };
      }

      const emp = employeeSummary[empId];

      // ✅ Add total working hours & present days
      emp.total_working_hours += totalHr;
      emp.present_days += 1;

      // ✅ Count late occasions
      const inTime = record.in_time || null;
      if (inTime) {
        const [hourStr, minuteStr] = inTime.split(":");
        const hr = parseInt(hourStr);
        const min = parseInt(minuteStr);
        if (hr > 9 || (hr === 9 && min > 30)) emp.total_occassions += 1;
      }

      // ✅ Count occurrences per deduction_rule_id
      if (record.deduction_rule_id) {
        const ruleId = record.deduction_rule_id;
        emp.deduction_count_map[ruleId] = (emp.deduction_count_map[ruleId] || 0) + 1;
      }
    }

    // ✅ Step 4: Merge deduction rules + count
    for (const empId in employeeSummary) {
      const emp = employeeSummary[empId];
      emp.after_2_concessions = Math.max(0, emp.total_occassions - 2);

      // add no_of_occation inside rule array
      emp.deduction_rules = deductionRules
        .filter(rule => rule.shift_id === emp.shift_id)
        .map(rule => ({
          ...rule,
          no_of_occation: emp.deduction_count_map[rule.id] || 0,
        }));

      // remove temp map
      delete emp.deduction_count_map;
    }

    // ✅ Step 5: Final response
    return res.status(200).json({
      code: 200,
      message: "Monthly Bio Attendance Summary fetched successfully",
      data: Object.values(employeeSummary),
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.getbyIdBioAttOfEmp = async (req, res) => {
  try {
    let { emp_id, month, year, entity_id, shift_id } = req.body;

    // ✅ Step 1: Required field validation
    if (!emp_id) {
      return res.status(400).json({
        code: 400,
        message: "emp_id is required",
      });
    }

    if (!entity_id) {
      return res.status(400).json({
        code: 400,
        message: "entity_id is required",
      });
    }

    // ✅ Step 2: Default month/year handling
    const today = new Date();
    if (!month || !year) {
      today.setMonth(today.getMonth() - 1);
      month = today.getMonth() + 1;
      year = today.getFullYear();
    }

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    console.log(`Fetching Bio Attendance for emp_id ${emp_id}, entity_id ${entity_id}, from ${startDate} to ${endDate}`);

    // ✅ Step 3: Fetch full bio attendance data (entire month)
    const [bioAttData] = await db.sequelize.query(`
      SELECT 
        bio.*,  
        CONCAT(hr.first_name, ' ', hr.last_name) AS employee_name,
        hsa.dept_id AS department,
        ms.id AS shift_id,
        ms.shift_name,
        ms.shift_time,
        ms.shift_duration,
        ms.grace_peroid,
        bio.entity_id
      FROM BIO_ATT_TIME_EMP_MST bio
      LEFT JOIN HRMS_REGISTERED_USER hr 
        ON hr.employee_id = bio.employee_id
      LEFT JOIN HRMS_SHIFT_ALLOCATION hsa
        ON hsa.employee_id = bio.employee_id 
        AND hsa.shift_master_id = bio.shift_id
        AND hsa.isDeleted = 0
      LEFT JOIN MASTER_SHIFT ms
        ON ms.id = hsa.shift_master_id
        AND ms.isDeleted = 0
      WHERE bio.att_date BETWEEN '${startDate}' AND '${endDate}'
        AND bio.employee_id = ${emp_id}
        AND bio.entity_id = ${entity_id}
        AND bio.isDeleted = 0
        ${shift_id ? `AND bio.shift_id = ${shift_id}` : ""}
      ORDER BY bio.att_date
    `);

    if (!bioAttData.length) {
      return res.status(404).json({
        code: 404,
        message: "No Bio Attendance found for this employee in selected month",
        data: [],
      });
    }

    // ✅ Step 4: Fetch ALL active deduction rules (entity-wise + shift-wise)
    let deductionQuery = `
      SELECT dr.*
      FROM DEDUCTION_RULES AS dr
      WHERE dr.isDeleted = 0
      AND dr.status = 'ACTIVE'
      AND dr.entity_id = ${entity_id}
    `;
    if (shift_id) {
      deductionQuery += ` AND dr.shift_id = ${shift_id}`;
    }

    const [deductionRules] = await db.sequelize.query(deductionQuery);

    // ✅ Add default no_of_occation = 0 in each rule
    const deduction_rules = deductionRules.map(rule => ({
      ...rule,
      no_of_occation: 0,
    }));

    // ✅ Step 5: Summary calculations
    let total_working_hours = 0;
    let total_occassions = 0;
    let present_days = 0;
    let after_2_concessions = 0;

    const dailyData = bioAttData.map(record => {
      const totalHr = parseFloat(record.total_working_hr || 0);
      total_working_hours += totalHr;

      present_days += 1;

      const inTime = record.in_time;
      let isLate = false;
      if (inTime) {
        const [hourStr, minuteStr] = inTime.split(":");
        const hr = parseInt(hourStr);
        const min = parseInt(minuteStr);
        if (hr > 9 || (hr === 9 && min > 30)) {
          total_occassions += 1;
          isLate = true;
        }
      }

      return {
        ...record,
        late_occasion: isLate,
      };
    });

    // ✅ Step 6: Concession rule (2 occasions allowed)
    after_2_concessions = Math.max(0, total_occassions - 2);

    // ✅ Step 7: Summary object
    const summary = {
      emp_id,
      employee_name: bioAttData[0].employee_name,
      department: bioAttData[0].department,
      month,
      year,
      entity_id,
      shift_id,
      total_working_hours,
      present_days,
      total_occassions,
      after_2_concessions,
    };

    // ✅ Step 8: Final response
    return res.status(200).json({
      code: 200,
      message: "Employee monthly attendance with full data fetched successfully",
      summary,
      deduction_rules, // ✅ same structure as getAll
      daily_data: dailyData,
    });

  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};




