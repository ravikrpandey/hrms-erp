const db = require("../../../models/index");
const archiver = require("archiver");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

exports.get_all_employee_list = async (req, res) => {
  try {
    let { entity_id, pay_slip_month, financial_year_id } = req.query;

    const fy_detail = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });
    if (!fy_detail) {
      return res
        .status(404)
        .send({ code: 404, message: "Financial year not found" });
    }

    let att_month = pay_slip_month;

    let [startYear, endYear] = fy_detail.financial_year.split("-").map(Number);

    let current_year;
    if (pay_slip_month >= 4 && pay_slip_month <= 12) {
      current_year = startYear; // April → December
    } else {
      current_year = endYear; // January → March
    }
    let sqlQuery = `
            SELECT U.employee_id, U.employee_official_email, U.employee_code, U.basic_salary, U.country_code, 
                   U.first_name, U.last_name, U.primary_branch_id, U.contact_number, D.designation_name, HEPS.monthly_ctc, PS.approval_status, HEPS.id AS salary_pay_id,
                   PS.pay_slip_status, PS.pay_slip_month 
            FROM HRMS_REGISTERED_USER AS U
            LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY AS HEPS ON U.employee_id = HEPS.employee_id AND HEPS.g_pay = false 
            LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS ON U.employee_id = PS.employee_id 
                  AND PS.entity_id = :entity_id 
                  AND PS.pay_slip_year = :current_year 
                  AND PS.pay_slip_month = :pay_slip_month
            LEFT JOIN DESIGNATION AS D ON D.designation_id = U.designation_id 
            WHERE U.primary_entity_id = :entity_id 
              AND U.isDeleted = 0 
              AND U.status = 'ACTIVE'
        `;

    const employee_list = await db.sequelize.query(sqlQuery, {
      replacements: {
        entity_id,
        current_year,
        pay_slip_month,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (employee_list.length > 0) {
      employee_list.forEach((employee) => {
        employee.att_mon = pay_slip_month;
      });
      return res.status(200).send({
        code: 200,
        message: "Get Employee List Successfully!",
        data: employee_list,
      });
    } else {
      return res.status(404).send({ code: 403, message: "No Employee found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.get_all_employee_list_pending = async (req, res) => {
  try {
    let { entity_id, pay_slip_month, financial_year_id } = req.query;

    const fy_detail = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });
    if (!fy_detail) {
      return res
        .status(404)
        .send({ code: 404, message: "Financial year not found" });
    }

    let current_year = parseInt(fy_detail.financial_year);
    if (pay_slip_month == 12) {
      current_year = current_year - 1;
    }

    let sqlQuery = `
            SELECT U.employee_id, U.employee_official_email, U.employee_code, U.basic_salary, U.country_code, 
                   U.first_name, U.last_name, U.primary_branch_id, U.contact_number, D.designation_name, HEPS.monthly_ctc,
                   PS.pay_slip_status, PS.pay_slip_month 
            FROM HRMS_REGISTERED_USER AS U
            LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY AS HEPS ON U.employee_id = HEPS.employee_id AND HEPS.g_pay = false 
            LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS ON U.employee_id = PS.employee_id 
                  AND PS.entity_id = :entity_id 
                  AND PS.pay_slip_year = :current_year 
                  AND PS.pay_slip_month = :pay_slip_month
            LEFT JOIN DESIGNATION AS D ON D.designation_id = U.designation_id 
            WHERE U.primary_entity_id = :entity_id 
              AND U.isDeleted = 0 
              AND U.status = 'ACTIVE'
        `;

    const employee_list = await db.sequelize.query(sqlQuery, {
      replacements: {
        entity_id,
        current_year,
        pay_slip_month,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (employee_list.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get Employee List Successfully!",
        data: employee_list,
      });
    } else {
      return res.status(404).send({ code: 403, message: "No Employee found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.get_all_employee_list_hold = async (req, res) => {
  try {
    let { entity_id, pay_slip_month, financial_year_id } = req.query;

    const fy_detail = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });
    if (!fy_detail) {
      return res
        .status(404)
        .send({ code: 404, message: "Financial year not found" });
    }

    // let current_year = parseInt(fy_detail.financial_year);
    // if (pay_slip_month == 12) {
    //   current_year = current_year - 1;

    // }
    let [startYear, endYear] = fy_detail.financial_year.split("-").map(Number);

    let current_year;
    if (pay_slip_month >= 4 && pay_slip_month <= 12) {
      current_year = startYear; // April → December
    } else {
      current_year = endYear; // January → March
    }

    let sqlQuery = `
            SELECT U.employee_id, U.employee_official_email, U.employee_code, U.basic_salary, U.country_code, 
                   U.first_name, U.last_name, U.primary_branch_id, U.contact_number, D.designation_name, HEPS.monthly_ctc,
                   PS.pay_slip_status, PS.pay_slip_month 
            FROM HRMS_REGISTERED_USER AS U
            LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY AS HEPS ON U.employee_id = HEPS.employee_id AND HEPS.g_pay = false 
            LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS ON U.employee_id = PS.employee_id 
                  AND PS.entity_id = :entity_id 
                  AND PS.pay_slip_year = :current_year 
                  AND PS.pay_slip_month = :pay_slip_month
                  AND PS.id = (
                      SELECT MAX(subPS.id) 
                      FROM HRMS_PAYROLL_PAY_SLIPS AS subPS 
                      WHERE subPS.employee_id = U.employee_id 
                        AND subPS.pay_slip_year = :current_year 
                        AND subPS.pay_slip_month = :pay_slip_month 
                        AND subPS.entity_id = :entity_id
                  )
            LEFT JOIN DESIGNATION AS D ON D.designation_id = U.designation_id 
            WHERE U.primary_entity_id = :entity_id 
              AND U.isDeleted = 0 
              AND U.status = 'ACTIVE'
        `;

    const employee_list = await db.sequelize.query(sqlQuery, {
      replacements: {
        entity_id,
        current_year,
        pay_slip_month,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (employee_list.length > 0) {
      employee_list.forEach((employee) => {
        employee.att_mon = pay_slip_month;
      });
      return res.status(200).send({
        code: 200,
        message: "Get Employee List Successfully!",
        data: employee_list,
      });
    } else {
      return res.status(404).send({ code: 403, message: "No Employee found" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

// Function to determine the payroll cycle dates
// async function getPayrollCycleDates(start_date, end_date, att_year, current_year) {
//     let payrollCycleStart, payrollCycleEnd;

//     payrollCycleStart = new Date(att_year, 11, start_date);
//     if (end_date >= start_date) {
//         payrollCycleEnd = new Date(att_year, 11, end_date); // Same December
//     } else {
//         payrollCycleEnd = new Date(current_year, 0, end_date); // January of the current year
//     }

//     const daysInCycle = Math.ceil((payrollCycleEnd - payrollCycleStart) / (1000 * 60 * 60 * 24)) + 1;

//     const formatDate = (date) => {
//         const day = String(date.getDate()).padStart(2, "0");
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const year = date.getFullYear();
//         return `${year}-${month}-${day}`;
//     };

//     return {
//         payrollCycleStart: formatDate(payrollCycleStart),
//         payrollCycleEnd: formatDate(payrollCycleEnd),
//         daysInCycle,
//     };
// }

async function getPayrollCycleDates(
  start_date, // like 28
  end_date, // like 27
  att_year,
  current_year, // not used in this logic, can be removed if unused
  att_month // like 6 for June
) {
  const year = parseInt(att_year);
  const month = parseInt(att_month) - 1; // 0-based month

  const startDay = parseInt(start_date);
  const endDay = parseInt(end_date);

  if (
    isNaN(year) ||
    isNaN(month) ||
    month < 0 ||
    month > 11 ||
    isNaN(startDay) ||
    isNaN(endDay) ||
    startDay < 1 ||
    startDay > 31 ||
    endDay < 1 ||
    endDay > 31
  ) {
    throw new Error(
      "Invalid input: Please provide valid year, month, and dates."
    );
  }

  // If startDay > endDay, payroll starts in previous month
  let payrollStart, payrollEnd;

  if (startDay > endDay) {
    // Start is in the previous month
    const prevMonth = new Date(year, month - 1, 1);
    const adjustedStartDay = Math.min(
      startDay,
      new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate()
    );

    payrollStart = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth(),
      adjustedStartDay
    );
    payrollEnd = new Date(
      year,
      month,
      Math.min(endDay, new Date(year, month + 1, 0).getDate())
    );
  } else {
    // Same month
    payrollStart = new Date(year, month, startDay);
    payrollEnd = new Date(
      year,
      month,
      Math.min(endDay, new Date(year, month + 1, 0).getDate())
    );
  }

  // Helper function to format date
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${formattedMonth}-${day}`;
  };

  // Generate full attendance date list
  const attendanceDates = [];
  let current = new Date(payrollStart);
  while (current <= payrollEnd) {
    attendanceDates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return {
    payrollCycleStart: formatDate(payrollStart),
    payrollCycleEnd: formatDate(payrollEnd),
    daysInCycle: attendanceDates.length,
    attendanceDates,
  };
}

exports.total_monthly_attendance = async (req, res) => {
  try {
    let {
      entity_id,
      start_date,
      end_date,
      financial_year_id,
      salary_process_month,
      att_month,
    } = req.query;

    if (
      !start_date ||
      !end_date ||
      start_date === "null" ||
      end_date === "null"
    ) {
      return res
        .status(400)
        .send({ code: "400", message: "Payroll Cycle date is mandatory" });
    }

    const fy_detail = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });
    if (!fy_detail) {
      return res
        .status(404)
        .send({ code: 404, message: "Financial year not found" });
    }
    let att_year = parseInt(fy_detail.financial_year);
    if (att_month == 12) {
      att_year = att_year - 1;
    }

    let current_year = fy_detail.financial_year;

    // let payrollCycledates = await getPayrollCycleDates(start_date, end_date, att_year, current_year)
    let payrollCycledates = await getPayrollCycleDates(
      start_date,
      end_date,
      att_year,
      current_year,
      att_month
    );

    let payrollCycleStart;
    let payrollCycleEnd;
    let daysInCycle;
    if (payrollCycledates) {
      payrollCycleStart = payrollCycledates.payrollCycleStart;
      payrollCycleEnd = payrollCycledates.payrollCycleEnd;
      daysInCycle = payrollCycledates.daysInCycle;
    }

    const employees = await db.user.findAll({
      where: {
        primary_entity_id: entity_id,
        status: "ACTIVE",
        isDeleted: false,
      },
    });

    const attendancePromises = employees.map(async (employee) => {
      const { employee_id } = employee;

      const attendance = await db.sequelize.query(
        `SELECT DISTINCT
            COUNT(CASE WHEN attendance_status = 'P' THEN 1 END) AS total_P,
            COUNT(CASE WHEN attendance_status = 'DP' THEN 1 END) AS total_DP,
            COUNT(CASE WHEN attendance_status = 'A' THEN 1 END) AS total_A,
            COUNT(CASE WHEN attendance_status = 'DA' THEN 1 END) AS total_DA,
            COUNT(CASE WHEN attendance_status = 'PFD' THEN 1 END) AS total_PFD,
            COUNT(CASE WHEN attendance_status = 'PHD' THEN 1 END) AS total_PHD,
            COUNT(CASE WHEN attendance_status = 'HPFD' THEN 1 END) AS total_HPFD,
            COUNT(CASE WHEN attendance_status = 'HPHD' THEN 1 END) AS total_HPHD,
            COUNT(CASE WHEN attendance_status = 'NPFD' THEN 1 END) AS total_NPFD,
            COUNT(CASE WHEN attendance_status = 'NPHD' THEN 1 END) AS total_NPHD,
            COUNT(CASE WHEN attendance_status = 'UL' THEN 1 END) AS total_UL,
            COUNT(CASE WHEN attendance_status = 'UHL' THEN 1 END) AS total_UHL,
            COUNT(CASE WHEN attendance_status = 'CO' THEN 1 END) AS total_CO,
            COUNT(CASE WHEN attendance_status = 'WFO' THEN 1 END) AS total_WFO,
            COUNT(CASE WHEN attendance_status = 'WHO' THEN 1 END) AS total_WHO,
            COUNT(CASE WHEN attendance_status = 'H' THEN 1 END) AS total_H
        FROM ESS_DAILY_ATTENDANCE_MASTER
        WHERE employee_id = :employee_id
        AND entity_id = :entity_id
        AND att_date BETWEEN :payrollCycleStart AND :payrollCycleEnd
        AND isDeleted = 0
        GROUP BY entity_id`,
        {
          replacements: {
            employee_id,
            entity_id,
            payrollCycleStart,
            payrollCycleEnd,
            att_month,
            att_year,
          },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      const totals = attendance[0] || {
        total_P: 0,
        total_DP: 0,
        total_A: 0,
        total_DA: 0,
        total_PFD: 0,
        total_PHD: 0,
        total_HPFD: 0,
        total_HPHD: 0,
        total_NPFD: 0,
        total_NPHD: 0,
        total_UL: 0,
        total_UHL: 0,
        total_CO: 0,
        total_WFO: 0,
        total_WHO: 0,
        total_H: 0,
      };

      const totalPresentDay =
        (parseInt(totals.total_P) || 0) +
        (parseInt(totals.total_H) || 0) +
        (parseInt(totals.total_DP) || 0) +
        (parseInt(totals.total_WFO) || 0) +
        (parseInt(totals.total_WHO) || 0) +
        (parseInt(totals.total_PFD) || 0) +
        (parseInt(totals.total_HPFD) || 0) * 0.5 + ////half paid
        (parseInt(totals.total_PHD) || 0) + ///paid half day but employee assumed present for another half of the day
        (parseInt(totals.total_HPHD) || 0) * 0.75; // 75% paid: 0.75 of day ///half of hald day is paid and employee assumed present for another half of the day

      await db.payroll_att_month.destroy({
        where: {
          employee_id,
          entity_id,
          financial_year_id,
          att_year,
          att_month,
        },
      });

      await db.payroll_att_month.create({
        employee_id,
        financial_year_id,
        entity_id,
        total_P: totals.total_P,
        total_DP: totals.total_DP,
        total_A: totals.total_A,
        total_DA: totals.total_DA,
        total_PFD: totals.total_PFD,
        total_PHD: totals.total_PHD,
        total_HPFD: totals.total_HPFD,
        total_HPHD: totals.total_HPHD,
        total_NPFD: totals.total_NPFD,
        total_NPHD: totals.total_NPHD,
        total_UL: totals.total_UL,
        total_UHL: totals.total_UHL,
        total_CO: totals.total_CO,
        total_WFO: totals.total_WFO,
        total_WHO: totals.total_WHO,
        total_H: totals.total_H,
        working_days: daysInCycle,
        salary_process_month,
        att_month,
        att_year,
        payroll_cycle_start_date: payrollCycleStart,
        payroll_cycle_end_date: payrollCycleEnd,
        total_present_day: totalPresentDay,
      });
    });

    await Promise.all(attendancePromises);

    res
      .status(200)
      .send({ code: 200, message: "Attendance marked successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.employee_attendance_details = async (req, res) => {
  try {
    const { entity_id, att_month, financial_year_id, att_year } = req.query;

    const cur_year = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });

    const salary_details = await db.sequelize.query(
      `SELECT DISTINCT 
                U.employee_id,
                U.employee_official_email,
                U.employee_code, 
                U.first_name, 
                U.last_name, 
                MT.total_P,
                MT.total_DP,
                MT.total_A,
                MT.total_DA,
                MT.total_PFD,
                MT.total_PHD,
                MT.total_HPFD,
                MT.total_HPHD,
                MT.total_NPFD,
                MT.total_NPHD,
                MT.total_UL,
                MT.total_UHL,
                MT.total_CO,
                MT.total_WFO,
                MT.total_WHO,
                MT.total_H,
                MT.att_month AS att_mon,
                MT.status 
            FROM HRMS_REGISTERED_USER AS U 
            LEFT JOIN HRMS_PAYROLL_MONTH_ATTENDANCE AS MT 
                ON U.employee_id = MT.employee_id 
                AND MT.entity_id = :entity_id 
                AND MT.att_year = :att_year  
                AND MT.att_month = :att_month 
                AND MT.isDeleted = 0 
                AND MT.status = 'ACTIVE'
            WHERE 
                U.primary_entity_id = :entity_id 
                AND U.isDeleted = 0 
                AND U.status = 'ACTIVE'`,
      {
        replacements: { entity_id, att_year, att_month },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (salary_details.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get Employee Salary Details Successfully!",
        data: salary_details,
      });
    } else {
      return res.status(404).send({
        code: 403,
        message: "No Employee found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.employee_salary_detailsBYID = async (req, res) => {
  try {
    const { employee_id, entity_id, att_month, financial_year_id } = req.query;
    const cur_year = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });

    let att_year = parseInt(cur_year.financial_year);

    if (att_month == 12) {
      att_year = att_year - 1;
    }

    let [salary_details] = await Promise.all([
      db.sequelize.query(
        `SELECT U.employee_id, U.employee_official_email, U.employee_code, U.first_name, U.last_name, 
                        CONCAT('+', U.country_code, ' ', U.contact_number) as contact_number, U.date_of_birth, 
                        U.parmanent_address, B.bank_name, PS.approval_status, MT.*, PS.salary_data
                 FROM HRMS_REGISTERED_USER AS U 
                 LEFT JOIN HRMS_PAYROLL_MONTH_ATTENDANCE AS MT 
                    ON U.employee_id = MT.employee_id 
                    AND MT.entity_id = :entity_id 
                    AND MT.att_year = :att_year  
                    AND MT.att_month = :att_month
                    AND MT.isDeleted = 0
                    AND MT.status = 'ACTIVE'
                 LEFT JOIN MASTER_BANK_DETAILS as B 
                    ON B.id = U.bank_id
                 LEFT JOIN HRMS_PAYROLL_PAY_SLIPS as PS 
                    ON PS.employee_id = U.employee_id 
                    AND PS.id = (
                        SELECT MAX(PPS.id) 
                        FROM HRMS_PAYROLL_PAY_SLIPS PPS 
                        WHERE PPS.employee_id = U.employee_id 
                          AND PPS.approval_status = 'REJECTED'
                    )
                 WHERE U.primary_entity_id = :entity_id 
                   AND U.isDeleted = 0 
                   AND U.status = 'ACTIVE' 
                   AND U.employee_id = :employee_id 
                   AND MT.employee_id = :employee_id`,
        {
          replacements: {
            employee_id,
            entity_id,
            att_year,
            att_month,
          },
          type: db.sequelize.QueryTypes.SELECT,
        }
      ),
    ]);
    if (salary_details.length > 0) {
      const employeeList = salary_details.map((emp) => ({
        employee_id: emp.employee_id,
      }));

      const generatedSalaries = await generateSalary(
        employeeList,
        entity_id,
        financial_year_id,
        att_month,
        att_year
      );

      salary_details.forEach((employee) => {
        const matchedSalary = generatedSalaries.find(
          (s) => s.employee_id === employee.employee_id
        );
        if (matchedSalary) {
          employee.salary_data = matchedSalary;

          if (
            matchedSalary.deductionComponentList &&
            Array.isArray(matchedSalary.deductionComponentList)
          ) {
            const totalDeductionAmt =
              matchedSalary.deductionComponentList.reduce((sum, deduction) => {
                const salaryAmt = parseFloat(deduction.salary_amt) || 0;
                return sum + salaryAmt;
              }, 0);
            employee.total_deduction_amt = totalDeductionAmt.toFixed(2);
          } else {
            employee.total_deduction_amt = "0.00";
          }

          if (
            matchedSalary.earningComponentList &&
            Array.isArray(matchedSalary.earningComponentList)
          ) {
            const totalEarningAmt = matchedSalary.earningComponentList.reduce(
              (sum, earning) => {
                const salaryAmt = parseFloat(earning.salary_amt) || 0;
                return sum + salaryAmt;
              },
              0
            );
            employee.total_earning_amt = totalEarningAmt.toFixed(2);
          } else {
            employee.total_earning_amt = "0.00";
          }
        }
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Get Employee Salary Detail Successfully!",
      data: salary_details,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.temployee_salary_detailsBYID = async (req, res) => {
  try {
    const { employee_id, entity_id, att_month, financial_year_id } = req.query;
    const cur_year = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });

    let att_year = parseInt(cur_year.financial_year);

    if (att_month == 12) {
      att_year = att_year - 1;
    }

    let [salary_details] = await Promise.all([
      db.sequelize.query(
        `SELECT U.employee_id, U.employee_official_email, U.employee_code, U.first_name, U.last_name, 
                        CONCAT('+', U.country_code, ' ', U.contact_number) as contact_number, U.date_of_birth, 
                        U.parmanent_address, B.bank_name, PS.approval_status, MT.*, PS.salary_data
                 FROM HRMS_REGISTERED_USER AS U 
                 LEFT JOIN HRMS_PAYROLL_MONTH_ATTENDANCE AS MT 
                    ON U.employee_id = MT.employee_id 
                    AND MT.entity_id = :entity_id 
                    AND MT.att_year = :att_year  
                    AND MT.att_month = :att_month
                    AND MT.isDeleted = 0
                    AND MT.status = 'ACTIVE'
                 LEFT JOIN MASTER_BANK_DETAILS as B 
                    ON B.id = U.bank_id
                 LEFT JOIN HRMS_PAYROLL_PAY_SLIPS as PS 
                    ON PS.employee_id = U.employee_id 
                    AND PS.id = (
                        SELECT MAX(PPS.id) 
                        FROM HRMS_PAYROLL_PAY_SLIPS PPS 
                        WHERE PPS.employee_id = U.employee_id 
                          AND PPS.approval_status = 'REJECTED'
                    )
                 WHERE U.primary_entity_id = :entity_id 
                   AND U.isDeleted = 0 
                   AND U.status = 'ACTIVE' 
                   AND U.employee_id = :employee_id 
                   AND MT.employee_id = :employee_id`,
        {
          replacements: {
            employee_id,
            entity_id,
            att_year,
            att_month,
          },
          type: db.sequelize.QueryTypes.SELECT,
        }
      ),
    ]);
    if (salary_details.length > 0 && salary_details[0].salary_data) {
      salary_details.forEach((employee) => {
        const salaryDataArray = Array.isArray(employee.salary_data)
          ? employee.salary_data
          : [employee.salary_data];

        if (salaryDataArray.length > 0) {
          salaryDataArray.forEach((salary) => {
            if (
              salary.deductionComponentList &&
              Array.isArray(salary.deductionComponentList)
            ) {
              const totalDeductionAmt = salary.deductionComponentList.reduce(
                (sum, deduction) => {
                  const salaryAmt = parseFloat(deduction.salary_amt) || 0;
                  const fixedAllowance =
                    parseFloat(deduction.fixedAllowanceMonthly) || 0;
                  return sum + salaryAmt + fixedAllowance;
                },
                0
              );

              employee.total_deduction_amt = totalDeductionAmt.toFixed(2); // Format to 2 decimal places
            }
          });
        }
      });
    }

    return res.status(200).send({
      code: 200,
      message: "Get Employee Salary Detail Successfully!",
      data: salary_details,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};
async function calculateLWF(employee, totalGross, att_month, att_year) {
  const [empDetails] = await db.sequelize.query(
    `
    SELECT 
      ms.states_name AS state_name,
      ecs.labour_welfare_fund AS lwf_enabled
    FROM HRMS_REGISTERED_USER u
    LEFT JOIN MASTER_STATE ms ON ms.states_id = u.employee_state_id
    LEFT JOIN EMPLOYEE_COMPLIANCE_SETTING ecs 
      ON ecs.employee_id = u.employee_id 
      AND ecs.isDeleted = 0
      AND ecs.status = 'ACTIVE'
    WHERE u.employee_id = :empId 
      AND u.isDeleted = 0
    LIMIT 1
    `,
    {
      replacements: { empId: employee.employee_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!empDetails || !empDetails.lwf_enabled)
    return { employee: 0, employer: 0, government: 0 };

  const [lwfRow] = await db.sequelize.query(
    `
    SELECT CAST(employee AS CHAR) AS employee,
           CAST(employer AS CHAR) AS employer,
           CAST(government AS CHAR) AS government
    FROM PAYROLL_LWF
    WHERE status = 'ACTIVE'
      AND is_deleted = 0
      AND REPLACE(LOWER(state_name), ' ', '') = REPLACE(LOWER(:stateName), ' ', '')
    LIMIT 1
    `,
    {
      replacements: { stateName: empDetails.state_name },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!lwfRow || lwfRow.employee == null)
    return { employee: 0, employer: 0, government: 0 };

  const employeeRule = parseJsonFlexible(lwfRow.employee);
  const employerRule = parseJsonFlexible(lwfRow.employer);
  const governmentRule = parseJsonFlexible(lwfRow.government);

  const monthName = new Date(att_year, att_month - 1).toLocaleString("en-US", {
    month: "long",
  });

  function isApplicable(rule, monthName) {
    const freq = (rule.frequency || "").toUpperCase();

    switch (freq) {
      case "MONTHLY":
        return true;
      case "YEARLY":
        if (
          Array.isArray(rule.deductionMonths) &&
          rule.deductionMonths.length
        ) {
          return (
            rule.deductionMonths[0].toLowerCase() === monthName.toLowerCase()
          );
        } else if (typeof rule.deductionMonths === "string") {
          return rule.deductionMonths.toLowerCase() === monthName.toLowerCase();
        }
        return false;
      case "HALF_YEARLY":
        if (Array.isArray(rule.deductionMonths)) {
          return rule.deductionMonths.some(
            (m) => m.toLowerCase() === monthName.toLowerCase()
          );
        }
        return false;
    }
  }

  function computeAmount(rule) {
    if (!rule || !isApplicable(rule, monthName)) return 0;
    const type = String(rule.type || "").toUpperCase();
    const val = Number(rule.value) || 0;
    let amt = 0;

    if (type === "FIXED") amt = val;
    else if (type === "PERCENT") amt = (val / 100) * (Number(totalGross) || 0);

    if (rule.isCapped && rule.capAmount != null) {
      const cap = Number(rule.capAmount);
      if (!Number.isNaN(cap)) amt = Math.min(amt, cap);
    }
    return Number((amt || 0).toFixed(2));
  }

  const employeeAmt = computeAmount(employeeRule);
  const employerAmt = computeAmount(employerRule);
  const governmentAmt = computeAmount(governmentRule);

  return {
    employeeLwf: employeeAmt,
    employerLwf: employerAmt,
    governmentLwf: governmentAmt,
  };
}

// ---- helper ----
function parseJsonFlexible(raw) {
  if (raw == null) return null;
  if (Buffer.isBuffer(raw)) raw = raw.toString("utf8");
  if (typeof raw === "object") return raw;

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return null;

    try {
      return JSON.parse(s);
    } catch (_) {}
    try {
      return JSON.parse(JSON.parse(s));
    } catch (_) {}
    try {
      return JSON.parse(s.replace(/\\n|\\r/g, ""));
    } catch (_) {}
  }

  return null;
}


/////////////////
async function calculateFine(salaryData, att_month, att_year) {
  const empId = salaryData.employee_id;
  const financialYearId = salaryData.financial_year_id;

  if (!empId || !financialYearId) {
    throw new Error("Missing employee_id or financial_year_id in salaryData!");
  }

  const [fineRows] = await db.sequelize.query(
    `
    SELECT 
      IFNULL(SUM(amount), 0) AS totalFine
    FROM PAYROLL_FINE_MANAGEMENT
    WHERE 
      employee_id = :empId
      AND financial_year_id = :fyId
      AND month = :month
      AND status = 'ACTIVE'
      AND isDeleted = 0
    `,
    {
      replacements: { 
        empId, 
        fyId: financialYearId, 
        month: att_month 
      },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  const totalFine = Number(fineRows.totalFine || 0);

  return {
    fineAmount: totalFine,
    month: att_month,
    year: att_year,
  };
}

/////////////
async function calculateProfessionalTax(
  employee,
  totalGross,
  att_month,
  att_year
) {
  let ptAmount = 0; // monthly
  let yearlyPTAmount = 0; // yearly

  // Step 1: Get employee state + gender + compliance
  const [empDetails] = await db.sequelize.query(
    `
    SELECT 
      ms.states_name AS state_name,
      u.gender,
      ecs.professional_tax AS pt_enabled
    FROM HRMS_REGISTERED_USER u
    LEFT JOIN MASTER_STATE ms ON ms.states_id = u.employee_state_id
    LEFT JOIN EMPLOYEE_COMPLIANCE_SETTING ecs 
      ON ecs.employee_id = u.employee_id AND ecs.isDeleted = 0
    WHERE u.employee_id = :empId AND u.isDeleted = 0
    LIMIT 1
  `,
    {
      replacements: { empId: employee.employee_id },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!empDetails || !empDetails.pt_enabled) return { monthly: 0, yearly: 0 };

  // Step 2: Fetch PT slab for the employee's state
  const [ptSlabRow] = await db.sequelize.query(
    `
    SELECT pt.pt_slabs
    FROM PAYROLL_PT pt
    WHERE pt.status = 'ACTIVE'
      AND pt.is_deleted = 0
      AND REPLACE(LOWER(pt.state_name), ' ', '') = REPLACE(LOWER(:stateName), ' ', '')
    LIMIT 1
  `,
    {
      replacements: { stateName: empDetails.state_name },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!ptSlabRow || !ptSlabRow.pt_slabs) return { monthly: 0, yearly: 0 };

  const ptSlabs =
    typeof ptSlabRow.pt_slabs === "string"
      ? JSON.parse(ptSlabRow.pt_slabs)
      : ptSlabRow.pt_slabs;

  // Step 3: Convert month to short format for slab matching
  const monthShort = new Date(att_year, att_month - 1)
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase(); // "JAN", "FEB", ...

  // Step 4: Match slab (monthly calculation, unchanged)
  let matchedSlabs = [];

  for (let slab of ptSlabs) {
    const monthMatch =
      slab.month === "ALL" || slab.month.toUpperCase() === monthShort;
    const genderMatch =
      slab.gender === "ALL" ||
      slab.gender.toLowerCase() === empDetails.gender.toLowerCase();
    const salaryMatch =
      totalGross >= slab.fromAmount &&
      (slab.noUpperLimit ||
        (slab.toAmount !== null && totalGross <= slab.toAmount));

    if (monthMatch && genderMatch && salaryMatch) {
      matchedSlabs.push(slab);
    }
  }

  if (matchedSlabs.length > 0) {
    matchedSlabs.sort((a, b) => {
      const monthPriorityA = a.month === "ALL" ? 0 : 1;
      const monthPriorityB = b.month === "ALL" ? 0 : 1;
      if (monthPriorityB !== monthPriorityA)
        return monthPriorityB - monthPriorityA;
      return b.fromAmount - a.fromAmount;
    });

    ptAmount = matchedSlabs[0].ptAmount;
  }

  // Step 5: Yearly PT calculation (loop Apr–Mar)
  for (let m = 1; m <= 12; m++) {
    const monthShortLoop = new Date(att_year, m - 1)
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();

    let matchedForMonth = [];
    for (let slab of ptSlabs) {
      const monthMatch =
        slab.month === "ALL" || slab.month.toUpperCase() === monthShortLoop;
      const genderMatch =
        slab.gender === "ALL" ||
        slab.gender.toLowerCase() === empDetails.gender.toLowerCase();
      const salaryMatch =
        totalGross >= slab.fromAmount &&
        (slab.noUpperLimit ||
          (slab.toAmount !== null && totalGross <= slab.toAmount));

      if (monthMatch && genderMatch && salaryMatch) {
        matchedForMonth.push(slab);
      }
    }

    if (matchedForMonth.length > 0) {
      matchedForMonth.sort((a, b) => {
        const monthPriorityA = a.month === "ALL" ? 0 : 1;
        const monthPriorityB = b.month === "ALL" ? 0 : 1;
        if (monthPriorityB !== monthPriorityA)
          return monthPriorityB - monthPriorityA;
        return b.fromAmount - a.fromAmount;
      });

      yearlyPTAmount += matchedForMonth[0].ptAmount;
    }
  }

  return { monthly: ptAmount, yearly: yearlyPTAmount };
}

//-- Tax Calculation of generated Salary---------------
// async function calculateTax(salaryData, attendanceCount, working_days) {
//   let tax_amount = 0;
//   const currentDate = new Date();

//   if (salaryData.tax_calculation === true) {
//     let isTax = await db.payroll_tax_slab.findOne({
//       where: { id: salaryData.tax_slab_id, isDeleted: false },
//     });

//     if (isTax && attendanceCount > 0) {
//       let totalMonthlyEarnings = 0;

//       let extraSaving;
//       const att_year = currentDate.getFullYear();

//       const fy_detail = await db.financial_year.findOne({
//         where: { financial_year: att_year, status: "ACTIVE", isDeleted: false },
//       });
//       if (!fy_detail) {
//         return res
//           .status(404)
//           .send({ code: 404, message: "Financial year not found" });
//       }

//       const financial_year_id = fy_detail.id;

//       let otherSaving = await db.payroll_declaration_form.findOne({
//         where: {
//           login_id: salaryData.employee_id,
//           approval_status: "APPROVED",
//           financial_year_id: financial_year_id,
//           status: "ACTIVE",
//           isDeleted: false,
//         },
//       });
//       if (otherSaving) {
//         extraSaving = otherSaving.saving_amout || 0;
//       }

//       let taxable_amount = 0;

//       // Loop through the earningComponentList
//       if (salaryData && Array.isArray(salaryData.earningComponentList)) {
//         taxable_amount = salaryData.earningComponentList
//           .map((component) =>
//             component.is_taxable
//               ? parseFloat(
//                   component.monthlyBasic || component.fixedAllowanceMonthly
//                 ) || 0
//               : 0
//           )
//           .reduce((sum, value) => sum + value, 0);
//         console.log("Total Taxable Amount:", taxable_amount);
//       }

//       let allowance_taxable_amount = 0;
//       // other allowance if it is taxable
//       if (salaryData && Array.isArray(salaryData.reiembursementComponentList)) {
//         allowance_taxable_amount = salaryData.reiembursementComponentList
//           .map((component) =>
//             component.is_taxable
//               ? parseFloat(
//                   component.monthlyBasic || component.fixedAllowanceMonthly
//                 ) || 0
//               : 0
//           )
//           .reduce((sum, value) => sum + value, 0);
//         console.log("Total Taxable Amount:", allowance_taxable_amount);
//       }

//       let annualSalary;
//       let taxableIncome;

//       if (salaryData) {
//         annualSalary = (taxable_amount+allowance_taxable_amount) * 12;
//         // annualSalary = annualSalary + allowance_taxable_amount;

//         // === EPF & ESI deduction for OLD REGIME only ===
//         let employeeEPF = 0;
//         let employeeESI = 0;
//         if (
//           isTax.tax_slab_name &&
//           isTax.tax_slab_name.toLowerCase().includes("old")
//         ) {
//           if (Array.isArray(salaryData.deductionComponentList)) {
//             for (const deduction of salaryData.deductionComponentList) {
//               if (deduction.deduction_plan === "EPF") {
//                 employeeEPF += (parseFloat(deduction.monthlyBasic ) || 0) * 12;
//               }
//               if (deduction.deduction_plan === "ESI") {
//                 employeeESI += (parseFloat(deduction.monthlyBasic ) || 0) * 12;
//               }
//             }
//             // EPF capped to ₹1.5L under 80C
//             employeeEPF = Math.min(employeeEPF, 150000);
//           }
//         }
//         let employeePT = 0;
//         if (Array.isArray(salaryData.deductionComponentList)) {
//           for (const deduction of salaryData.deductionComponentList) {
//             if (deduction.componentName  === "PT") {
//               employeePT += (parseFloat(deduction.yearly_pt_amt) || 0);
//             }
//           }
//         }
//         taxableIncome =
//           annualSalary -
//           ((parseFloat(isTax.standard_deduction) || 0) +
//             (parseFloat(extraSaving) || 0) +
//             employeeEPF +
//             employeeESI +
//             employeePT);

//         console.log("Annual Salary:", annualSalary);
//         console.log("Taxable Income:", taxableIncome);
//       }

//       // Calculate tax from slabs
//       if (taxableIncome > 0) {
//         for (let slab of isTax.tax_slab_row) {
//           let min = slab.min === "Upto" ? 0 : parseInt(slab.min);
//           let max = slab.max === "Upto" ? Infinity : parseInt(slab.max);
//           let percentage =
//             slab.percentage === "NIL" ? 0 : parseFloat(slab.percentage);

//           if (taxableIncome > min) {
//             let taxableAmountInSlab = Math.min(taxableIncome, max) - min;
//             if (taxableAmountInSlab > 0) {
//               tax_amount += (taxableAmountInSlab * percentage) / 100;
//             }
//           }
//         }

//         // === Apply surcharge ===
//         let surchargeRate = 0;
//         if (taxableIncome > 50000000) {
//           surchargeRate = 0.37;
//         } else if (taxableIncome > 20000000) {
//           surchargeRate = 0.25;
//         } else if (taxableIncome > 10000000) {
//           surchargeRate = 0.15;
//         } else if (taxableIncome > 5000000) {
//           surchargeRate = 0.1;
//         }

//         if (surchargeRate > 0) {
//           tax_amount += tax_amount * surchargeRate;
//         }

//         // === Apply cess (4% on tax + surcharge) ===
//         tax_amount += tax_amount * 0.04;
//       }
//     }
//   }

//   // === Prorate monthly tax according to attendance ===
//   let monthlyTax = tax_amount / 12;
//   if (working_days && working_days > 0) {
//     monthlyTax = (monthlyTax * attendanceCount) / working_days;
//   }
//   salaryData.tax_amount = monthlyTax.toFixed(2);

//   return salaryData;
// }

async function checkEmployerLimit(salaryData) {
  if (!salaryData?.employee_id || !salaryData?.financial_year_id) {
    return {
      epf_exceeded: false,
      nps_exceeded: false,
      saf_exceeded: false,
      aggregate_exceeded: false,
    };
  }

  const empId = salaryData.employee_id;
  const fyId = salaryData.financial_year_id;

  // 1️⃣ Get FY limits
  const [fyLimit] = await db.sequelize.query(
    `SELECT * FROM PAYROLL_COMPLIANCE_FY_LIMITS 
     WHERE status='ACTIVE' AND is_deleted=0 LIMIT 1`,
    { type: db.Sequelize.QueryTypes.SELECT }
  );

  if (!fyLimit) {
    throw new Error("Compliance FY limits not found");
  }

  // 2️⃣ Sum employer contributions from closed/processed payslips in this FY
  const [totals] = await db.sequelize.query(
    `SELECT 
       COALESCE(SUM(employer_epf),0) AS total_epf,
       COALESCE(SUM(nps_employer_contribution),0) AS total_nps,
       COALESCE(SUM(saf_employer_contribution),0) AS total_saf
     FROM HRMS_PAYROLL_PAY_SLIPS
     WHERE employee_id = :empId
       AND financial_year_id = :fyId
       AND pay_slip_status IN ('CLOSED','PROCESSED')
       AND isDeleted = 0`,
    {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: { empId, fyId },
    }
  );

  // 3️⃣ Calculate current year totals (including current month)
  const current_epf =
    parseFloat(totals.total_epf || 0) +
    parseFloat(salaryData.employer_contri_epf_amt || 0);
  const current_nps =
    parseFloat(totals.total_nps || 0) +
    parseFloat(salaryData.nps_employer_contribution || 0);
  const current_saf =
    parseFloat(totals.total_saf || 0) +
    parseFloat(salaryData.saf_employer_contribution || 0);

  // 4️⃣ Pick limits from master (fallbacks if zero or null)
  const epfLimit =
    parseFloat(fyLimit.epf_individual_limit) > 0
      ? parseFloat(fyLimit.epf_individual_limit)
      : 0; // EPF has no individual cap

  const npsLimit =
    parseFloat(fyLimit.nps_individual_limit) > 0
      ? parseFloat(fyLimit.nps_individual_limit)
      : 0; // NPS has no individual cap

  const safLimit =
    parseFloat(fyLimit.saf_individual_limit) > 0
      ? parseFloat(fyLimit.saf_individual_limit)
      : 150000; // fallback ₹1.5L

  // 5️⃣ Aggregate cap (combined limit)
  const aggregateCap = Math.min(
    parseFloat(fyLimit.epf_aggregate_cap) || 750000,
    parseFloat(fyLimit.nps_aggregate_cap) || 750000,
    parseFloat(fyLimit.saf_aggregate_cap) || 750000
  );

  // 6️⃣ Check exceed conditions
  const epf_exceeded = epfLimit > 0 ? current_epf > epfLimit : false;
  const nps_exceeded = npsLimit > 0 ? current_nps > npsLimit : false;
  const saf_exceeded = safLimit > 0 ? current_saf > safLimit : false;

  // 7️⃣ Combined aggregate check (Section 17(2)(vii))
  const totalCombined = current_epf + current_nps + current_saf;
  const aggregate_exceeded = totalCombined > aggregateCap;

  // 8️⃣ Optionally calculate excess amounts (useful for taxable addition)
  const excess_epf = epf_exceeded ? current_epf - epfLimit : 0;
  const excess_nps = nps_exceeded ? current_nps - npsLimit : 0;
  const excess_saf = saf_exceeded ? current_saf - safLimit : 0;
  const excess_total = aggregate_exceeded ? totalCombined - aggregateCap : 0;

  return {
    epf_exceeded,
    nps_exceeded,
    saf_exceeded,
    aggregate_exceeded,
    excess_epf,
    excess_nps,
    excess_saf,
    excess_total,
  };
}

const { Op } = require("sequelize");

async function calculateTax(
  salaryData,
  attendanceCount,
  working_days,
  att_month,
  att_year
) {
  let tax_amount = 0;

  if (!salaryData.tax_calculation) {
    salaryData.tax_amount = "0";
    return salaryData;
  }

  // === Tax Slab ===
  const isTax = await db.payroll_tax_slab.findOne({
    where: { id: salaryData.tax_slab_id, isDeleted: false },
  });
  if (!isTax) {
    salaryData.tax_amount = "0";
    return salaryData;
  }

  // === Financial Year ===
  const fy_detail = await db.financial_year.findOne({
    where: {
      id: salaryData.financial_year_id,
      status: "ACTIVE",
      isDeleted: false,
    },
  });
  if (!fy_detail) throw new Error("Financial year not found");

  const [taxCalDetails] = await db.sequelize.query(`
  SELECT 
    TCM.cess_rate,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'surcharge_id', TCS.id,
            'threshold', TCS.threshold,
            'rate', TCS.rate
        )
    ) AS surcharges
FROM TAX_CALCULATION_MASTER AS TCM
LEFT JOIN TAX_CALCULATION_SURCHARGE AS TCS 
    ON TCM.id = TCS.tax_master_id
WHERE TCM.status = 'ACTIVE' 
  AND TCM.isDeleted = 0
GROUP BY TCM.id, TCM.cess_rate;

`);

  if (taxCalDetails.length == 0)
    throw new Error("Tax calculation master details not found!");
  ////////////////////////
  const financial_year_id = fy_detail.id;
  const [fyStartYear, fyEndYear] = fy_detail.financial_year
    .split("-")
    .map(Number);
  const fy_start = new Date(fyStartYear, 3, 1);
  const fy_end = new Date(fyEndYear, 2, 31);

  // === Other Savings ===
  const decl = await db.payroll_declaration_form.findOne({
    where: {
      login_id: salaryData.employee_id,
      approval_status: "APPROVED",
      financial_year_id,
      status: "ACTIVE",
      isDeleted: false,
    },
  });
  const extraSaving = decl ? Math.round(parseFloat(decl.saving_amout || 0)) : 0;

  // === Monthly taxable income ===
  let monthlyTaxable = 0;
  let tempEarningAmt = 0;

  if (Array.isArray(salaryData.earningComponentList)) {
    salaryData.earningComponentList.forEach((c) => {
      if (c.is_taxable) {
        if (c.type === "adhoc" || c.type === "leave_encash" || c.type === "incentive") {
          // store adhoc separately
          tempEarningAmt += Math.round(parseFloat(c.salary_amt) || 0);
        } else {
          // normal taxable earnings
          monthlyTaxable += Math.round(
            parseFloat(c.monthlyBasic) ||
              parseFloat(c.fixedAllowanceMonthly) ||
              0
          );
        }
      }
    });
  }
  if (Array.isArray(salaryData.deductionComponentList)) {
    tempEarningAmt += salaryData.deductionComponentList
      .filter((c) => c.type === "loan_adjust")
      .reduce((sum, c) => sum + Math.round(parseFloat(c.salary_amt) || 0), 0);
  }
  if (Array.isArray(salaryData.reiembursementComponentList)) {
    monthlyTaxable += salaryData.reiembursementComponentList
      .filter((c) => c.is_taxable)
      .reduce(
        (sum, c) =>
          sum +
          Math.round(
            parseFloat(c.monthlyBasic) ||
              parseFloat(c.fixedAllowanceMonthly) ||
              0
          ),
        0
      );
  }
  // ======== OVERTIME EARNINGS ========
  if (salaryData.ot_data && salaryData.ot_data.overtime_earning > 0) {
    const otEarning = Math.round(
      parseFloat(salaryData.ot_data.overtime_earning) || 0
    );
    // Add to adhoc/temp taxable earnings (one-time)
    tempEarningAmt += otEarning;
  }

  // ======== VARIABLE EARNING COMPONENTS ========
  if (Array.isArray(salaryData.variableearningComponentList)) {
    let variableAdded = false;

    salaryData.variableearningComponentList.forEach((v) => {
      if (v.is_taxable) {
        // Case 1: deduct monthly → take full monthly equivalent immediately
        if (v.deduct_monthly) {
          monthlyTaxable += Math.round(
            parseFloat(v.fixedAllowanceAnnual) / 12 || 0
          );
        }

        // Case 2: deduct when credited → add only if credited this month

        if (
          v.deduct_when_credited &&
          salaryData.variableAllot &&
          variableAdded == false
        ) {
          const credited = salaryData.variableAllot;

          tempEarningAmt += Math.round(
            parseFloat(credited.variable_earning) || 0
          );

          // mark as added so next iterations won't add again
          variableAdded = true;
        }
      }
    });
  }
  monthlyTaxable = Math.round(monthlyTaxable);

  // === Employee join date ===
  const emp = await db.user.findOne({
    where: { employee_id: salaryData.employee_id, isDeleted: false },
    attributes: ["emp_join_date"],
  });
  const joinDate = emp?.emp_join_date ? new Date(emp.emp_join_date) : null;

  // === Projection months & annual salary ===
  let annualSalary = 0;
  let monthsForProjection = 0;

  if (joinDate && joinDate >= fy_start && joinDate <= fy_end) {
    const joinMonth = joinDate.getMonth() + 1;
    const joinDay = joinDate.getDate();

    const monthDays = new Date(joinDate.getFullYear(), joinMonth, 0).getDate();
    const proratedFraction = (monthDays - joinDay + 1) / monthDays;

    const proratedMonthSalary = Math.round(monthlyTaxable * proratedFraction);
    annualSalary += proratedMonthSalary;

    const remainingFullMonths = 12 - (joinMonth - 4) - 1;
    annualSalary += Math.round(monthlyTaxable * remainingFullMonths);

    monthsForProjection = proratedFraction + remainingFullMonths;
  } else {
    monthsForProjection = 12;
    annualSalary = Math.round(monthlyTaxable * monthsForProjection);
  }

  // === Deductions (old regime only) ===
  let employeeEPF = 0;
  let employeeESI = 0;
  let employeeNPS = 0;
  let employeeSAF = 0;
  if (isTax.tax_slab_name?.toLowerCase().includes("old")) {
    if (Array.isArray(salaryData.deductionComponentList)) {
      for (const d of salaryData.deductionComponentList) {
        if (d.deduction_plan === "EPF")
          employeeEPF += Math.round(
            (parseFloat(d.monthlyBasic) || 0) * monthsForProjection
          );
        if (d.deduction_plan === "ESI")
          employeeESI += Math.round(
            (parseFloat(d.monthlyBasic) || 0) * monthsForProjection
          );
        // NPS deduction (employee contribution)
        if (d.componentName?.toUpperCase() === "NPS") {
          employeeNPS += Math.round(
            (parseFloat(d.salary_amt) || 0) * monthsForProjection
          );
        }
        if (d.componentName?.toUpperCase() === "SAF") {
          employeeSAF += Math.round(
            (parseFloat(d.salary_amt) || 0) * monthsForProjection
          );
        }
      }

      employeeEPF = Math.min(employeeEPF, 150000); // 80C limit (EPF + other eligible contributions)
      employeeNPS = Math.min(employeeNPS, 50000); // Additional NPS limit under 80CCD(1B)
      const safEligible = Math.min(employeeSAF, 150000 - employeeEPF); // SAF limit (usually part of 80C, include in total80C)
      employeeSAF = safEligible;
    }
  }

  let employeePT = 0;
  if (Array.isArray(salaryData.deductionComponentList)) {
    for (const d of salaryData.deductionComponentList) {
      if (d.componentName === "PT")
        employeePT += Math.round(parseFloat(d.yearly_pt_amt) || 0);
    }
  }

  const employerLimitStatus = await checkEmployerLimit(salaryData);
  let employerExcessTaxable = 0;

  // ✅ Aggregate 7.5L cap across EPF+NPS+SAF
  if (employerLimitStatus.aggregate_exceeded) {
    employerExcessTaxable += employerLimitStatus.excess_total;
  }

  // ✅ Individual excesses (if any master rules defined)
  if (employerLimitStatus.excess_epf) {
    employerExcessTaxable += employerLimitStatus.excess_epf;
  }
  if (employerLimitStatus.excess_nps) {
    employerExcessTaxable += employerLimitStatus.excess_nps;
  }
  if (employerLimitStatus.excess_saf) {
    employerExcessTaxable += employerLimitStatus.excess_saf;
  }

  // === Taxable Income ===
  const taxableIncome = Math.max(
    0,
    Math.round(
      annualSalary +
        tempEarningAmt +
        employerExcessTaxable - // add all taxable excesses
        (Math.round(parseFloat(isTax.standard_deduction) || 0) +
          extraSaving +
          employeeEPF +
          employeeESI +
          employeePT +
          employeeNPS +
          employeeSAF)
    )
  );

  // === Tax via slabs ===
  if (taxableIncome > 0) {
    for (const slab of isTax.tax_slab_row) {
      const min = slab.min === "Upto" ? 0 : parseInt(slab.min);
      const max = slab.max === "Upto" ? Infinity : parseInt(slab.max);
      const pct = slab.percentage === "NIL" ? 0 : parseFloat(slab.percentage);
      if (taxableIncome > min) {
        const amt = Math.min(taxableIncome, max) - min;
        if (amt > 0) tax_amount += Math.round((amt * pct) / 100);
      }
    }

    let surchargeRate = 0;
    if (Array.isArray(taxCalDetails[0].surcharges)) {
      // Sort thresholds descending so highest wins
      const sortedSurcharges = [...taxCalDetails[0].surcharges].sort(
        (a, b) => b.threshold - a.threshold
      );

      for (const s of sortedSurcharges) {
        if (taxableIncome > s.threshold) {
          surchargeRate = s.rate / 100; // stored as % → convert
          break;
        }
      }
    }

    if (surchargeRate > 0) {
      tax_amount = Math.round(tax_amount + tax_amount * surchargeRate);
    }

    // === Apply cess ===
    if (taxCalDetails[0].cess_rate) {
      const cessRate = parseFloat(taxCalDetails[0].cess_rate) / 100;
      tax_amount = Math.round(tax_amount + tax_amount * cessRate);
    }
  }

  tax_amount = Math.round(tax_amount);

  // === Monthly allocation ===
  let monthlyTax = Math.round(tax_amount / monthsForProjection);
  if (working_days && working_days > 0) {
    monthlyTax = Math.round((monthlyTax * attendanceCount) / working_days);
  }

  // === Previous payments ===
  const prevRecords = await db.payroll_tax_tracking.findAll({
    where: {
      employee_id: salaryData.employee_id,
      financial_year_id,
      isDeleted: false,
    },
  });

  // === Previous payments (strictly previous months in same FY) ===
  const cumulative_paid = prevRecords
    .filter((r) => {
      // r.month is 1–12, att_month is current month
      if (att_month >= 4) {
        // Apr–Dec
        return r.year === att_year && r.month >= 4 && r.month < att_month;
      } else {
        // Jan–Mar
        return (
          (r.year === att_year && r.month < att_month) ||
          (r.year === att_year - 1 && r.month >= 4)
        );
      }
    })
    .reduce((sum, r) => sum + Math.round(parseFloat(r.monthly_tax || 0)), 0);

  const total_paid = cumulative_paid + monthlyTax;
  const remaining = Math.max(0, Math.round(tax_amount - total_paid));

  // === Insert or update ===
  const existingCurrent = await db.payroll_tax_tracking.findOne({
    where: {
      employee_id: salaryData.employee_id,
      financial_year_id,
      month: att_month,
      year: att_year,
      isDeleted: false,
    },
  });

  if (existingCurrent) {
    await existingCurrent.update({
      monthly_tax: monthlyTax,
      cumulative_tax_paid: total_paid,
      taxable_income_to_date: taxableIncome,
      tax_amount_remaining: remaining,
      attendance_days: attendanceCount,
      working_days,
    });
  } else {
    await db.payroll_tax_tracking.create({
      employee_id: salaryData.employee_id,
      financial_year_id,
      month: att_month,
      year: att_year,
      monthly_tax: monthlyTax,
      cumulative_tax_paid: total_paid,
      taxable_income_to_date: taxableIncome,
      tax_amount_remaining: remaining,
      attendance_days: attendanceCount,
      working_days,
    });
  }

  salaryData.tax_amount = monthlyTax.toString();
  return salaryData;
}

function calculateEmployerEpfEsi(salaryData, attendanceCount, working_days) {
  const monthlyEPF = parseFloat(salaryData.employer_contri_epf_amt) || 0;
  const monthlyESI = parseFloat(salaryData.employer_contri_esi_amt) || 0;

  // Default = monthly amount (no proration)
  let epfProrated = monthlyEPF;
  let esiProrated = monthlyESI;

  // Apply proration only if attendance & working_days are valid
  if (
    typeof attendanceCount === "number" &&
    attendanceCount > 0 &&
    typeof working_days === "number" &&
    working_days > 0 &&
    attendanceCount < working_days
  ) {
    epfProrated = (monthlyEPF * attendanceCount) / working_days;
    esiProrated = (monthlyESI * attendanceCount) / working_days;
  }

  return {
    epfEmployer: parseFloat(epfProrated.toFixed(2)),
    esiEmployer: parseFloat(esiProrated.toFixed(2)),
  };
}

async function calculateBonusDed(salaryData, att_month, att_year) {
  const employeeId = salaryData.employee_id;
  const entityId = salaryData.entity_id;
  const fyId = salaryData.financial_year_id;

  // Pull all active rows for the employee/month
  const rows = await db.masterBonus.findAll({
    where: {
      employee_id: employeeId,
      entity_id: entityId,
      financial_year_id: fyId,
      month: att_month,
      isDeleted: 0,
      status: "ACTIVE",
    },
  });

  // Build arrays
  const earningBonus = [];
  const deductionBonus = [];

  rows.forEach((row) => {
    const { bonus_name, bonus_type, amount, amount_type } = row;

    if (bonus_type && bonus_type.toLowerCase() === "bonus") {
      earningBonus.push({
        componentName: bonus_name,
        salary_amt: parseFloat(amount) || 0,
        is_taxable:
          amount_type && amount_type.toUpperCase() === "TAXABLE" ? 1 : 0,
      });
    } else if (bonus_type && bonus_type.toLowerCase() === "deduction") {
      deductionBonus.push({
        componentName: bonus_name,
        salary_amt: parseFloat(amount) || 0,
      });
    }
  });

  return { earningBonus, deductionBonus };
}

async function variableEarningAllotment(salaryData, att_month, att_year) {
  if (!salaryData || !salaryData.employee_id) {
    return {
      employee_id: salaryData?.employee_id || null,
      payroll_month: att_month,
      payroll_year: att_year,
      variable_earning: 0,
      variable_component_names: "",
    };
  }

  const empId = salaryData.employee_id;
  const fyId = salaryData.financial_year_id;

  // 1️⃣ Fetch active allotment for employee & FY
  const [allotment] = await db.sequelize.query(
    `
    SELECT 
      variable_component_details,
      credit_allotment_details
    FROM PAYROLL_VARIABLE_EARNING_ALLOTMENT
    WHERE employee_id = :empId
      AND financial_id = :fyId
      AND status = 'ACTIVE'
      AND isDeleted = 0
    LIMIT 1
    `,
    {
      replacements: { empId, fyId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  // If no allotment found → return 0
  if (!allotment) {
    return {
      employee_id: empId,
      payroll_month: att_month,
      payroll_year: att_year,
      variable_earning: 0,
      variable_component_names: "",
    };
  }

  let variable_earning = 0;
  let creditDetails = [];
  let componentNames = "";

  // 2️⃣ Parse credit_allotment_details safely
  if (allotment.credit_allotment_details) {
    if (typeof allotment.credit_allotment_details === "string") {
      try {
        creditDetails = JSON.parse(allotment.credit_allotment_details);
      } catch {
        creditDetails = [];
      }
    } else if (Array.isArray(allotment.credit_allotment_details)) {
      creditDetails = allotment.credit_allotment_details;
    } else if (typeof allotment.credit_allotment_details === "object") {
      creditDetails = [allotment.credit_allotment_details];
    }
  }

  // 3️⃣ Match current payroll month and financial year
  const match = creditDetails.find(
    (d) =>
      Number(d.year) === Number(fyId) && Number(d.month) === Number(att_month)
  );

  variable_earning = match ? parseFloat(match.amount || 0) : 0;

  // 4️⃣ Parse variable_component_details safely and collect names
  if (allotment.variable_component_details) {
    if (typeof allotment.variable_component_details === "string") {
      try {
        const parsed = JSON.parse(allotment.variable_component_details);
        if (Array.isArray(parsed)) {
          componentNames = parsed
            .map((c) => c.component_name)
            .filter(Boolean)
            .join(", ");
        } else if (parsed?.component_name) {
          componentNames = parsed.component_name;
        }
      } catch {
        componentNames = "";
      }
    } else if (Array.isArray(allotment.variable_component_details)) {
      componentNames = allotment.variable_component_details
        .map((c) => c.component_name)
        .filter(Boolean)
        .join(", ");
    } else if (
      typeof allotment.variable_component_details === "object" &&
      allotment.variable_component_details.component_name
    ) {
      componentNames = allotment.variable_component_details.component_name;
    }
  }

  // 5️⃣ Return final standardized response
  return {
    employee_id: empId,
    payroll_month: att_month,
    payroll_year: att_year,
    variable_earning: parseFloat(variable_earning.toFixed(2)),
    variable_component_names: componentNames || "",
  };
}

async function calculateOvertimeEarning(salaryData, att_month, att_year) {
  if (!salaryData || !salaryData.employee_id) {
    return {
      employee_id: salaryData?.employee_id || null,
      overtime_earning: 0,
    };
  }

  const empId = salaryData.employee_id;

  // 0️⃣ Check compliance for overtime
  const [compliance] = await db.sequelize.query(
    `
    SELECT overtime
    FROM EMPLOYEE_COMPLIANCE_SETTING
    WHERE employee_id = :empId
      AND status = 'ACTIVE'
      AND isDeleted = 0
    LIMIT 1
    `,
    {
      replacements: { empId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  // If no row or overtime flag is 0/false → return 0
  if (!compliance || !Number(compliance.overtime)) {
    return {
      employee_id: empId,
      payroll_month: att_month,
      payroll_year: att_year,
      overtime_earning: 0,
    };
  }

  // 1️⃣ Fetch approved OT rows
  const rows = await db.sequelize.query(
    `
    SELECT d.approve_hours,
           d.applied_rate
    FROM ESS_OVERTIME_REQUEST_DETAILS d
    JOIN ESS_OVERTIME_REQUEST r ON r.id = d.request_id
    WHERE r.employee_id   = :empId
      AND r.approval_status = 'APPROVED'
      AND d.payroll_month  = :month
      AND d.payroll_year   = :year
      AND d.isDeleted = 0
    `,
    {
      replacements: { empId, month: att_month, year: att_year },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  // 2️⃣ Get OT components
  const otComponents =
    salaryData.earningComponentList?.filter((c) => c.is_overtime === 1) || [];

  const totalOtComponent = otComponents.reduce(
    (sum, c) =>
      sum + parseFloat(c.monthlyBasic || c.fixedAllowanceMonthly || 0),
    0
  );

  // 3️⃣ Hourly rate from component
  const hourlyRateFromComponent =
    totalOtComponent > 0 ? totalOtComponent / (26 * 8) : 0;

  // 4️⃣ Calculate OT
  let overtime_earning = 0;
  for (const row of rows) {
    const hrs = parseFloat(row.approve_hours) || 0;
    const multiplier = row.applied_rate ? parseFloat(row.applied_rate) : 1;

    if (hrs > 0 && hourlyRateFromComponent > 0) {
      overtime_earning += hrs * hourlyRateFromComponent * multiplier;
    }
  }

  // 5️⃣ Return result
  return {
    employee_id: empId,
    payroll_month: att_month,
    payroll_year: att_year,
    overtime_earning: parseFloat(overtime_earning.toFixed(2)),
  };
}

async function calculateLoanAdvance(salaryData, att_month, att_year) {
  if (!salaryData || !salaryData.employee_id) {
    return {
      employee_id: salaryData?.employee_id || null,
      disbursed_amount: 0,
      adjustment_amount: 0,
    };
  }

  const empId = salaryData.employee_id;

  // 1️⃣ Fetch all active loan/advance entries
  const records = await db.sequelize.query(
    `
    SELECT 
      id,
      month,
      amount,
      adjustments
    FROM PAYROLL_LOAN_ADVANCE
    WHERE employee_id = :empId
      AND status = 'ACTIVE'
      AND isDeleted = 0
      AND financial_year_id=${salaryData.financial_year_id}
    `,
    {
      replacements: { empId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!records || !records.length) {
    return {
      employee_id: empId,
      payroll_month: att_month,
      payroll_year: att_year,
      disbursed_amount: 0,
      adjustment_amount: 0,
    };
  }

  let disbursed_amount = 0;
  let adjustment_amount = 0;

  // 2️⃣ Loop through all records
  for (const rec of records) {
    // ➤ A. If loan was *disbursed* in this month
    if (parseInt(rec.month) === parseInt(att_month)) {
      disbursed_amount += parseFloat(rec.amount) || 0;
    }

    // ➤ B. If this record has *adjustments* (repayments)
    if (rec.adjustments) {
      try {
        const adjustments = JSON.parse(rec.adjustments);

        const match = adjustments.find(
          (a) =>
            parseInt(a.month) === parseInt(att_month) &&
            parseInt(a.year) === parseInt(salaryData.financial_year_id)
        );

        if (match && match.amount) {
          adjustment_amount += parseFloat(match.amount);
        }
      } catch (err) {
        console.error(
          `Error parsing adjustments JSON for record ID ${rec.id}`,
          err
        );
      }
    }
  }

  // 3️⃣ Return both disbursement and adjustment details
  return {
    employee_id: empId,
    payroll_month: att_month,
    payroll_year: att_year,
    disbursed_amount: parseFloat(disbursed_amount.toFixed(2)),
    adjustment_amount: parseFloat(adjustment_amount.toFixed(2)),
  };
}

async function calculateNPS(salaryData, att_month, att_year) {
  if (!salaryData || !salaryData.employee_id) {
    return {
      employee_id: salaryData?.employee_id || null,
      payroll_month: att_month,
      payroll_year: att_year,
      nps_employee_contribution: 0,
      nps_employer_contribution: 0,
    };
  }

  const empId = salaryData.employee_id;
  const [compliance] = await db.sequelize.query(
    `
      SELECT nps
      FROM EMPLOYEE_COMPLIANCE_SETTING
      WHERE employee_id = :empId
        AND status = 'ACTIVE'
        AND isDeleted = 0
      LIMIT 1
      `,
    {
      replacements: { empId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!compliance?.nps) {
    return {
      employee_id: empId,
      payroll_month: att_month,
      payroll_year: att_year,
      nps_employee_contribution: 0,
      nps_employer_contribution: 0,
    };
  }
  const [scheme] = await db.sequelize.query(
    `
      SELECT *
      FROM PAYROLL_NPS_SCHEME
      WHERE status = 'ACTIVE'
        AND isDeleted = 0
      LIMIT 1
      `,
    {
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!scheme) {
    return {
      employee_id: empId,
      payroll_month: att_month,
      payroll_year: att_year,
      nps_employee_contribution: 0,
      nps_employer_contribution: 0,
    };
  }

  const npsBase =
    salaryData.earningComponentList
      ?.filter((c) => c.consider_for_nps)
      ?.reduce((sum, c) => sum + parseFloat(c.salary_amt || 0), 0) || 0;

  let nps_employee_contribution = (npsBase * scheme.employeeContribution) / 100;
  let nps_employer_contribution = (npsBase * scheme.employerContribution) / 100;

  if (scheme.IsMinimum) {
    if (nps_employee_contribution < parseFloat(scheme.minimumAmount || 0)) {
      nps_employee_contribution = parseFloat(scheme.minimumAmount);
    }
    if (nps_employer_contribution < parseFloat(scheme.minimumAmount || 0)) {
      nps_employer_contribution = parseFloat(scheme.minimumAmount);
    }
  }

  if (scheme.Iscapping) {
    const cap = parseFloat(scheme.cappingAmount || 0);
    nps_employee_contribution = Math.min(nps_employee_contribution, cap);
    nps_employer_contribution = Math.min(nps_employer_contribution, cap);
  }

  nps_employee_contribution = parseFloat(nps_employee_contribution.toFixed(2));
  nps_employer_contribution = parseFloat(nps_employer_contribution.toFixed(2));

  return {
    employee_id: empId,
    payroll_month: att_month,
    payroll_year: att_year,
    nps_employee_contribution,
    nps_employer_contribution,
  };
}

async function calculateSAF(salaryData, att_month, att_year) {
  if (!salaryData || !salaryData.employee_id) {
    return {
      employee_id: salaryData?.employee_id || null,
      payroll_month: att_month,
      payroll_year: att_year,
      saf_employee_contribution: 0,
      saf_employer_contribution: 0,
    };
  }

  const empId = salaryData.employee_id;

  // 0️⃣ Check SAF compliance
  const [compliance] = await db.sequelize.query(
    `
    SELECT saf
    FROM EMPLOYEE_COMPLIANCE_SETTING
    WHERE employee_id = :empId
      AND status = 'ACTIVE'
      AND isDeleted = 0
    LIMIT 1
    `,
    {
      replacements: { empId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!compliance?.saf) {
    return {
      employee_id: empId,
      payroll_month: att_month,
      payroll_year: att_year,
      saf_employee_contribution: 0,
      saf_employer_contribution: 0,
    };
  }

  // 1️⃣ Fetch active SAF scheme
  const [scheme] = await db.sequelize.query(
    `
    SELECT *
    FROM PAYROLL_SUPERANNUATION_DATA
    WHERE status = 'ACTIVE'
      AND isDeleted = 0
    LIMIT 1
    `,
    {
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!scheme) {
    return {
      employee_id: empId,
      payroll_month: att_month,
      payroll_year: att_year,
      saf_employee_contribution: 0,
      saf_employer_contribution: 0,
    };
  }

  // 2️⃣ Identify salary base for SAF
  const safBase =
    salaryData.earningComponentList
      ?.filter((c) => c.consider_for_saf)
      ?.reduce((sum, c) => sum + parseFloat(c.salary_amt || 0), 0) || 0;

  // 3️⃣ Calculate contributions
  let saf_employee_contribution =
    (safBase * parseFloat(scheme.employeeContribution)) / 100;
  let saf_employer_contribution =
    (safBase * parseFloat(scheme.employerContribution)) / 100;

  saf_employee_contribution = parseFloat(saf_employee_contribution.toFixed(2));
  saf_employer_contribution = parseFloat(saf_employer_contribution.toFixed(2));

  return {
    employee_id: empId,
    payroll_month: att_month,
    payroll_year: att_year,
    saf_employee_contribution,
    saf_employer_contribution,
  };
}
async function calculateLeaveEncashment(salaryData, att_month, att_year) {
  if (!salaryData || !salaryData.employee_id) {
    return {
      employee_id: salaryData?.employee_id || null,
      payroll_month: att_month,
      payroll_year: att_year,
      leave_encashment_amount: 0,
      encashed_days: 0,
      is_taxable: false,
      leave_breakup: [],
    };
  }

  const empId = salaryData.employee_id;

  // 🔹 0️⃣ Check if leave_encash_data already exists in payroll pay slips for this month & FY
  const existingPayslip = await db.payroll_payslip.findOne({
    where: {
      employee_id: empId,
      pay_slip_month: att_month,
      pay_slip_year: att_year,
      financial_year_id: salaryData.financial_year_id,
      leave_encash_data: { [db.Sequelize.Op.ne]: null },
    },
    order: [["id", "DESC"]],
  });

  // 🔹 Revert previously encashed leaves (if any)
  if (
    existingPayslip &&
    existingPayslip.leave_encash_data?.leave_breakup?.length
  ) {
    for (const leave of existingPayslip.leave_encash_data.leave_breakup) {
      await db.hrmsLeaveAllotment.increment(
        { available_days: leave.encashedDays },
        { where: { leave_id: leave.leaveId, employee_id: empId } }
      );
    }

    // Optional: clear previous leave_encash_data if you want a fresh calculation
    // await db.payroll_payslip.update(
    //   { leave_encash_data: null },
    //   { where: { id: existingPayslip.id } }
    // );
  }

  // 🔹 1️⃣ Get all active encashment requests for this employee and month
  const encashments = await db.sequelize.query(
    `
    SELECT 
      id,
      month,
      description,
      is_taxable,
      leaveId,
      employee_id,
      department_id,
      financial_year_id
    FROM PAYROLL_LEAVE_ENCASHMENT
    WHERE employee_id = :empId
      AND month = :att_month
      AND status = 'ACTIVE'
      AND isDeleted = 0
    `,
    {
      replacements: { empId, att_month },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  // 🔹 If no encashment requests found
  if (!encashments.length) {
    return {
      employee_id: empId,
      payroll_month: att_month,
      payroll_year: att_year,
      leave_encashment_amount: 0,
      encashed_days: 0,
      is_taxable: false,
      leave_breakup: [],
    };
  }

  // 🔹 2️⃣ Setup calculation base
  let totalEncashAmount = 0;
  let totalEncashDays = 0;
  const leaveBreakup = [];

  // Compute per day rate (usually from basic + fixed allowances)
  const perDayRate =
    (salaryData.earningComponentList || [])
      .filter((c) => c.is_overtime === 1)
      .reduce((sum, c) => sum + parseFloat(c.fixedAllowanceMonthly ||c.monthlyBasic || 0), 0) /
    26;

  // 🔹 3️⃣ Process each encashment record
  const processedLeaveIds = new Set(); // Prevent duplicate leave encashments

  for (const encashment of encashments) {
    // Split comma-separated leave IDs (e.g., "131,132")
    const leaveIds = encashment.leaveId
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    for (const leaveId of leaveIds) {
      if (processedLeaveIds.has(leaveId)) continue; // Skip duplicates
      processedLeaveIds.add(leaveId);

      // Fetch leave allotment record
      const [leaveAllot] = await db.sequelize.query(
        `
        SELECT id, available_days, leave_id
        FROM HRMS_USER_LEAVE_ALLOTMENT
        WHERE leave_id = :leaveId
          AND employee_id = :empId
          AND status = 'ACTIVE'
          AND isDeleted = 0
        LIMIT 1
        `,
        {
          replacements: { leaveId, empId },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (!leaveAllot) continue;

      // Fetch leave policy for encashment rules
      const [policy] = await db.sequelize.query(
        `
        SELECT 
          is_encash, 
          encash_val, 
          encash_type, 
          encash_max_val
        FROM HRMS_LEAVE_POLICY_ENTITLEMENT
        WHERE leaveId = :leaveId
          AND isDeleted = 0
        LIMIT 1
        `,
        {
          replacements: { leaveId: leaveAllot.leave_id },
          type: db.Sequelize.QueryTypes.SELECT,
        }
      );

      if (!policy || policy.is_encash !== 1) continue;

      const availableDays = parseFloat(leaveAllot.available_days || 0);
      let encashDays = 0;

      // Determine encashable days
      if (policy.encash_type === "UNIT") {
        encashDays = Math.min(policy.encash_val, availableDays);
      } else if (policy.encash_type === "PERCENT") {
        encashDays = (availableDays * policy.encash_val) / 100;
      }

      if (policy.encash_max_val && encashDays > policy.encash_max_val) {
        encashDays = policy.encash_max_val;
      }

      encashDays = parseFloat(encashDays.toFixed(2));

      // Calculate encashment amount
      const encashAmount = parseFloat((perDayRate * encashDays).toFixed(2));

      totalEncashDays += encashDays;
      totalEncashAmount += encashAmount;

      leaveBreakup.push({
        leaveId: leaveAllot.leave_id,
        encashedDays: encashDays,
        encashAmount,
      });

      // Update remaining available leave days
      const newAvailable = availableDays - encashDays;
      await db.hrmsLeaveAllotment.update(
        { available_days: newAvailable },
        { where: { id: leaveAllot.id } }
      );
    }
  }

  // 🔹 4️⃣ Return final computed result
  return {
    employee_id: empId,
    payroll_month: att_month,
    payroll_year: att_year,
    leave_encashment_amount: parseFloat(totalEncashAmount.toFixed(2)),
    encashed_days: parseFloat(totalEncashDays.toFixed(2)),
    is_taxable: encashments.some((e) => e.is_taxable === 1),
    leave_breakup: leaveBreakup,
  };
}

///////////////

async function calculateIncentive(salaryData, att_month, att_year) {
  if (!salaryData || !salaryData.employee_id) {
    return {
      employee_id: salaryData?.employee_id || null,
      payroll_month: att_month,
      payroll_year: att_year,
      incentive_amount: 0,
      incentive_breakup: [],
      is_taxable: false,
    };
  }

  const empId = salaryData.employee_id;
  const currentFyId = salaryData.financial_year_id; // Important for recurring validation

  // 🔹 Fetch all active incentives (one-time + recurring)
  const incentives = await db.sequelize.query(
    `
    SELECT 
      id,
      incentive_type,
      plan_name,
      start_date,
      end_date,
      target_kpi,
      target_value,
      achieved_value,
      multiplier,
      payment_mode,
      frequency,
      payroll_financial_year_id,
      payroll_month,
      recurring_payroll_fy_id,
      payroll_start_month,
      payroll_end_month,
      is_taxable,
      remarks
    FROM PAYROLL_INCENTIVE
    WHERE employee_id = :empId
      AND status = 'ACTIVE'
      AND isDeleted = 0
    `,
    {
      replacements: { empId },
      type: db.Sequelize.QueryTypes.SELECT,
    }
  );

  if (!incentives.length) {
    return {
      employee_id: empId,
      payroll_month: att_month,
      payroll_year: att_year,
      incentive_amount: 0,
      incentive_breakup: [],
      is_taxable: false,
    };
  }

  // 🔹 Compute per-day rate (basic + overtime + fixed allowances)
  const perDayRate =
    (salaryData.earningComponentList || [])
      .filter((c) => c.is_overtime === 1)
      .reduce(
        (sum, c) =>
          sum + parseFloat(c.fixedAllowanceMonthly || c.monthlyBasic || 0),
        0
      ) / 26;

  let totalIncentiveAmount = 0;
  const incentiveBreakup = [];

  for (const inc of incentives) {
    const {
      id,
      plan_name,
      incentive_type,
      achieved_value,
      target_value,
      multiplier,
      payment_mode,
      is_taxable,
      remarks,
      payroll_month,
      payroll_start_month,
      payroll_end_month,
      recurring_payroll_fy_id,
    } = inc;

    // 🔹 Determine applicability
    let isApplicable = false;
    let isMultiMonth = false;

    // Case 1️⃣: One-Time Incentive (specific month)
    if (payroll_month && parseInt(payroll_month) === parseInt(att_month)) {
      isApplicable = true;
    }

    // Case 2️⃣: Multi-Month / Recurring Incentive
    else if (
      payroll_start_month &&
      payroll_end_month &&
      recurring_payroll_fy_id &&
      parseInt(recurring_payroll_fy_id) === parseInt(currentFyId) &&
      parseInt(att_month) >= parseInt(payroll_start_month) &&
      parseInt(att_month) <= parseInt(payroll_end_month)
    ) {
      isApplicable = true;
      isMultiMonth = true;
    }

    if (!isApplicable) continue;

    // 🔹 Calculation Logic
    const target = parseFloat(target_value) || 0;
    const achieved = parseFloat(achieved_value) || 0;
    const factor = parseFloat(multiplier) || 1;

    let incentiveAmt = 0;

    if (target > 0 && achieved > 0) {
      const achievementRatio = Math.min(achieved / target, 1); // capped at 100%
      incentiveAmt = achievementRatio * factor * perDayRate;

      // Optional: prorate if multi-month
      if (isMultiMonth) {
        const durationMonths =
          parseInt(payroll_end_month) - parseInt(payroll_start_month) + 1;
        incentiveAmt = incentiveAmt / durationMonths;
      }
    }

    incentiveAmt = parseFloat(incentiveAmt.toFixed(2));
    totalIncentiveAmount += incentiveAmt;

    incentiveBreakup.push({
      incentive_id: id,
      incentive_type,
      plan_name,
      payment_mode,
      multiplier: factor,
      achieved_value: achieved,
      target_value: target,
      per_day_rate: perDayRate,
      incentive_amount: incentiveAmt,
      is_taxable: is_taxable === 1,
      remarks,
      applicable_month: att_month,
      is_multi_month: isMultiMonth,
      recurring_payroll_fy_id,
    });
  }

  // 🔹 Final Return Object
  return {
    employee_id: empId,
    payroll_month: att_month,
    payroll_year: att_year,
    incentive_amount: parseFloat(totalIncentiveAmount.toFixed(2)),
    incentive_breakup: incentiveBreakup,
    is_taxable: incentiveBreakup.some((i) => i.is_taxable),
  };
}


////////////////

async function calculateEdliAndAdminCharges(salaryData) {
  if (!salaryData || !salaryData.employee_id) {
    return {
      employee_id: salaryData?.employee_id || null,
      edli: 0,
      adminCharges: 0,
    };
  }

  const empId = salaryData.employee_id;

  const deductionList = salaryData.deductionComponentList || [];
  const earningList = salaryData.earningComponentList || [];

  let employerEdli = 0;
  let employerAdminCharges = 0;

  // EPF components
  const epfEligibleComponents = earningList.filter(e => e.consider_for_epf == 1);
  const epfDeduction = deductionList.find(d => d.componentName === "EPF");

  if (epfEligibleComponents.length && epfDeduction) {
    // ✅ Calculate EPF wage base (Basic + eligible components)
    let epfWage = epfEligibleComponents.reduce(
      (sum, comp) => sum + parseFloat(comp.monthlyBasic || 0),
      0
    );

    // ✅ Apply PF wage cap if applicable (₹15000 default)
    const pfCap = 15000;
    if (epfWage > pfCap) epfWage = pfCap;

    // ✅ EDLI: 0.5% of capped EPF wage (if enabled in plan)
    // if (epfDeduction.is_edli_contribution_in_ctc === 1) {
    if (epfDeduction) {
      const edliRate = parseFloat(epfDeduction.edli_rate || "0.5"); // default 0.5%
      employerEdli = parseFloat(((epfWage * edliRate) / 100).toFixed(2));
    }

    // ✅ Admin Charges: e.g. 0.01% of EPF wage, capped
    // if (epfDeduction.is_admin_charges_in_ctc === 1) {
    if (epfDeduction) {
      const rate = parseFloat(epfDeduction.admin_charges_rate || "0.01");
      const cap = parseFloat(epfDeduction.admin_charges_cap || "25"); // ₹25 cap

      let adminCharge = (epfWage * rate) / 100;
      if (cap && adminCharge > cap) adminCharge = cap;

      employerAdminCharges = parseFloat(adminCharge.toFixed(2));
    }
  }

  return {
    employee_id: empId,
    edli: employerEdli,
    adminCharges: employerAdminCharges,
  };
}


async function generateSalary(
  employee_list,
  entity_id,
  financial_year_id,
  att_month,
  att_year
) {
  const currentDate = new Date();
  // const att_month = currentDate.getMonth() + 1; // Current month (1-based)
  // const att_year = currentDate.getFullYear();

  const attendancePromises = employee_list.map(async (employee) => {
    const { employee_id } = employee;

    let salaryData = await db.payroll_pay_salary.findOne({
      where: { employee_id, entity_id, g_pay: false },
    });
    if (salaryData) {
      salaryData.dataValues.financial_year_id = financial_year_id;
    }

    let attendance_data = await db.payroll_att_month.findOne({
      where: {
        entity_id,
        financial_year_id,
        employee_id,
        att_month: att_month,
        att_year,
        isDeleted: 0,
        status: "ACTIVE",
      },
    });

    if (!salaryData || !attendance_data) {
      console.warn(`Missing data for employee_id: ${employee_id}`);
      return null;
    }
    let base_salary = parseFloat(salaryData.monthly_ctc) || 0;
    const daily_wages =
      base_salary / parseFloat(attendance_data.working_days) || 0;

    const calculateEarnSalaryAmt = (component) => {
      const amount =
        parseFloat(component.monthlyBasic || component.fixedAllowanceMonthly) ||
        0;
      return (
        (amount / attendance_data.working_days) *
        parseFloat(attendance_data.total_present_day)
      ); // Daily * Present Days
    };
    salaryData = JSON.parse(JSON.stringify(salaryData));

    if (salaryData.earningComponentList) {
      salaryData.earningComponentList.forEach((component) => {
        component.salary_amt = calculateEarnSalaryAmt(component).toFixed(2);
      });
    }

    if (salaryData.deductionComponentList) {
      salaryData.deductionComponentList.forEach((component) => {
        component.salary_amt = calculateEarnSalaryAmt(component).toFixed(2);
      });
    }
    let attendanceCount = parseFloat(attendance_data.total_present_day);
    let working_days = parseFloat(attendance_data.working_days);
    const totalGross =
      salaryData.earningComponentList
        ?.map((c) => parseFloat(c.salary_amt) || 0)
        .reduce((a, b) => a + b, 0) || 0;

    const loanAdvance = await calculateLoanAdvance(
      salaryData,
      att_month,
      att_year
    );
    if (loanAdvance.disbursed_amount > 0) {
      salaryData.earningComponentList.push({
        componentName: "Loan Credit",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: loanAdvance.disbursed_amount.toFixed(2),
        is_taxable: 0,
        type: "loan_credit",
      });
    }
    salaryData.loan_disbursed = loanAdvance.disbursed_amount;

    if (loanAdvance.adjustment_amount > 0) {
      salaryData.deductionComponentList.push({
        componentName: "Loan Adjust",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: loanAdvance.adjustment_amount.toFixed(2),
        type: "loan_adjust",
      });
    }
    salaryData.loan_adjusted = loanAdvance.adjustment_amount;

    const otAmount = await calculateOvertimeEarning(
      salaryData,
      att_month,
      att_year
    );
    const variableAllot = await variableEarningAllotment(
      salaryData,
      att_month,
      att_year
    );

    if (!Array.isArray(salaryData.earningComponentList)) {
      salaryData.earningComponentList = [];
    }

    if (otAmount.overtime_earning > 0) {
      salaryData.earningComponentList.push({
        componentName: "Overtime",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: otAmount.overtime_earning.toFixed(2),
        is_taxable: 1,
      });
    }
    salaryData.overtime_earning = otAmount.overtime_earning;
    salaryData.ot_data = otAmount;
    ////////////
    if (variableAllot.variable_earning > 0) {
      salaryData.earningComponentList.push({
        componentName: variableAllot.variable_component_names,
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: variableAllot.variable_earning.toFixed(2),
      });
    }
    salaryData.variableAllot = variableAllot;
    ////////////

    const employerEpfEsi = await calculateEmployerEpfEsi(
      salaryData,
      attendanceCount,
      working_days
    );

    salaryData.employer_epf = employerEpfEsi.epfEmployer;
    salaryData.employer_esi = employerEpfEsi.esiEmployer;

    // ---- Fetch Bonus/Deductions ----
    const { earningBonus, deductionBonus } = await calculateBonusDed(
      salaryData,
      att_month,
      att_year
    );

    // ---- Ensure arrays exist ----
    if (!Array.isArray(salaryData.earningComponentList)) {
      salaryData.earningComponentList = [];
    }
    if (!Array.isArray(salaryData.deductionComponentList)) {
      salaryData.deductionComponentList = [];
    }

    // ---- Push Bonuses into earnings ----
    earningBonus.forEach((b) => {
      salaryData.earningComponentList.push({
        componentName: b.componentName,
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: b.salary_amt.toFixed(2),
        is_taxable: b.is_taxable,
        type: "adhoc",
      });
    });

    // ---- Push Deductions ----
    deductionBonus.forEach((d) => {
      salaryData.deductionComponentList.push({
        componentName: d.componentName,
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: d.salary_amt.toFixed(2),
        type: "adhoc",
      });
    });

    // ---- Store JSON on salaryData ----
    salaryData.bonus_json = earningBonus;
    salaryData.deduction_json = deductionBonus;

    const ptAmount = await calculateProfessionalTax(
      { employee_id },
      totalGross,
      att_month,
      att_year
    );
    salaryData.ptAmount = ptAmount.monthly || 0;
    if (!Array.isArray(salaryData.deductionComponentList)) {
      salaryData.deductionComponentList = [];
    }
    if (ptAmount.monthly > 0) {
      salaryData.deductionComponentList.push({
        componentName: "PT",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: ptAmount.monthly.toFixed(2),
        yearly_pt_amt: ptAmount.yearly.toFixed(2),
      });
    }
    npsData = await calculateNPS(salaryData, att_month, att_year);
    if (npsData.nps_employee_contribution > 0) {
      salaryData.deductionComponentList.push({
        componentName: "NPS",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: npsData.nps_employee_contribution.toFixed(2),
      });
    }
    salaryData.nps_employee_contribution = npsData.nps_employee_contribution;
    salaryData.nps_employer_contribution = npsData.nps_employer_contribution;

    leaveEncashData = await calculateLeaveEncashment(
      salaryData,
      att_month,
      att_year
    );

    //////
    if (leaveEncashData.leave_encashment_amount > 0) {
      salaryData.earningComponentList.push({
        componentName: "Leave Encash",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: leaveEncashData.leave_encashment_amount.toFixed(2),
        is_taxable: leaveEncashData.is_taxable,
        type: "leave_encash",
      });
      salaryData.leave_encash_data = leaveEncashData;
    }

    //////

    //////
 incentiveData = await calculateIncentive(
      salaryData,
      att_month,
      att_year
    );
    if (incentiveData.incentive_amount > 0 && Array.isArray(incentiveData.incentive_breakup)) {
  incentiveData.incentive_breakup.forEach((inc) => {
      salaryData.earningComponentList.push({
        componentName: inc.plan_name,
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: inc.incentive_amount.toFixed(2),
         is_taxable: inc.is_taxable,
        type: "incentive",
      });
    
  });
  salaryData.incentive_data = incentiveData;
}
////////

    safData = await calculateSAF(salaryData, att_month, att_year);
    if (safData.saf_employee_contribution > 0) {
      salaryData.deductionComponentList.push({
        componentName: "SAF",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: safData.saf_employee_contribution.toFixed(2),
      });
    }
    salaryData.saf_employee_contribution = safData.saf_employee_contribution;
    salaryData.saf_employer_contribution = safData.saf_employer_contribution;
    edliAdminChargeData = await calculateEdliAndAdminCharges(salaryData);

    if (edliAdminChargeData.edli > 0 || edliAdminChargeData.adminCharges > 0) {
      salaryData.employers_edli_share = edliAdminChargeData.edli;
      salaryData.employers_admin_charge_share =
        edliAdminChargeData.adminCharges;
    }

    salaryData = await calculateTax(
      salaryData,
      attendanceCount,
      working_days,
      att_month,
      att_year
    );
    //////////
    if (parseFloat(salaryData.tax_amount) > 0) {
      salaryData.deductionComponentList.push({
        componentName: "TDS",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: salaryData.tax_amount,
      });
    }
    let salary_data = salaryData;
    const totalGross2 = calculateMontlyGross(salary_data);
    const lwfAmount = await calculateLWF(
      employee,
      totalGross2,
      att_month,
      att_year
    );
    if (lwfAmount.employeeLwf > 0) {
      salaryData.deductionComponentList.push({
        componentName: "LWF",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: lwfAmount.employeeLwf.toFixed(2) || "0.00",
      });
    }
    salary_data.lwfAmount = lwfAmount.employeeLwf || 0;
    salary_data.employerLwf = lwfAmount.employerLwf || 0;
    salary_data.governmentLwf = lwfAmount.governmentLwf || 0;
    /////////////////
    //////////////
    const fineData = await calculateFine(
      salaryData,
      att_month,
      att_year
    );
    if (fineData.fineAmount > 0) {
      salaryData.deductionComponentList.push({
        componentName: "Fine",
        monthlyBasic: null,
        fixedAllowanceMonthly: null,
        salary_amt: fineData.fineAmount.toFixed(2) || "0.00",
      });
    }
    salary_data.fineAmount = fineData.fineAmount || 0;
    ////////////////
    return salaryData;
  });

  const allSalaries = await Promise.all(attendancePromises);
  return allSalaries.filter((salary) => salary !== null);
}

exports.generate_salary_slip = async (req, res) => {
  try {
    const { entity_id, financial_year_id, att_month, employee_list } = req.body;

    const fy_detail = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });
    if (!fy_detail) {
      return res
        .status(404)
        .send({ code: 404, message: "Financial year not found" });
    }

    // let att_year = parseInt(fy_detail.financial_year);
    // if (att_month == 12) {
    //   att_year = att_year - 1;
    // }
    let [startYear, endYear] = fy_detail.financial_year.split("-").map(Number);
    let att_year;

    if (att_month >= 4 && att_month <= 12) {
      att_year = startYear; // April → December
    } else {
      att_year = endYear; // January → March
    }

    const salaryDataList = await generateSalary(
      employee_list,
      entity_id,
      financial_year_id,
      att_month,
      att_year
    );

    if (!salaryDataList || salaryDataList.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No salary data generaggted. Please check the input data.",
      });
    }

    const htmlPath = "app/Payroll/Salary_Process_Details/salary_slip.html";
    const BATCH_SIZE = 5;
    const pdfDir = "generated_payslip";
    const process_number = "PROC";

    if (!fs.existsSync(htmlPath)) {
      return res
        .status(404)
        .send({ code: 404, message: "HTML file not found" });
    }

    const cur_date = new Date().toLocaleDateString("en-GB").replace(/\//g, "_");
    const current_year = new Date().getFullYear();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    // const [current_month, daysInSalaryMonth] = [
    //   ((d) => monthNames[d.getMonth()])(
    //     ((p) => new Date(p.getFullYear(), p.getMonth() - 1))(new Date())
    //   ),
    //   ((d) => new Date(d.getFullYear(), d.getMonth(), 0).getDate())(new Date()),
    // ];
    const [current_month, daysInSalaryMonth] = [
      monthNames[att_month - 1], // because att_month is 1-based (Jan=1)
      new Date(att_year, att_month, 0).getDate(), // get days in that salary month
    ];

    const htmlTemplate = fs.readFileSync(htmlPath, "utf8");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const lastEntry = await db.payroll_process.findOne({
      where: { status: "ACTIVE" },
      order: [["createdAt", "DESC"]],
      attributes: ["process_id"],
    });

    const lastNumber =
      lastEntry && parseInt(lastEntry.process_id.slice(-5), 10);
    const number = !isNaN(lastNumber) ? lastNumber + 1 : 1;
    const process_no = `${process_number}${String(number).padStart(5, "0")}`;

    const pay_process = await db.payroll_process.create({
      process_id: process_no,
      pay_slip_month: att_month,
      pay_slip_year: att_year,
      entity_id,
    });
    let company_logo, company_branch, company_address;

    const entityData = await db.sequelize.query(
      ` SELECT 
          em.*, 
          mb.branch_address,
          hps.entity_id AS payroll_entity_id,
          MC.countryss_id,
          MC.country_code
      FROM ENTITY_MASTER AS em
      INNER JOIN MASTER_BRANCH AS mb 
          ON mb.id = em.branch_id
      LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS hps 
          ON em.id = hps.entity_id
      LEFT JOIN MASTER_COUNTRY AS MC 
          ON MC.countryss_id = em.country_id
      WHERE em.id = :entity_id 
          AND em.isDeleted = false;`,
      {
        replacements: { entity_id: entity_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (entityData.length > 0) {
      company_logo = `uploaded_files/${entityData[0].logo}`;
      company_branch = entityData[0].company_branch;
      company_address = entityData[0].branch_address;
      country_code = entityData[0].country_code;
    }

    let pdfFilename;
    let totalEarnings;
    let netPay;
    let total_tax;
    const processEmployee = async (employee) => {
      try {
        console.log(employee);

        let [emp_data, attendance_data] = await Promise.all([
          db.sequelize.query(
            `SELECT 
                            u.employee_id, 
                            u.first_name, 
                            u.last_name, 
                            u.emp_join_date, 
                            u.employee_code, 
                            u.basic_salary, 
                            u.account_number, 
                            u.employee_country_id, 
                            u.pf_account_number, 
                            u.UAN_number, 
                            u.ESIC_number, 
                            u.ifsc_code, 
                            u.iban_number, 
                            u.emirates_id_number, 
                            u.date_of_birth, 
                            u.emp_pan_card, 
                            u.emp_adhar_card_number, 
                            u.designation_id,
                            u.bank_id,
                            bm.bank_name,
                            uf.member_name,
                            desig.designation_name,
                            MD.department_name

                        FROM 
                            HRMS_REGISTERED_USER u
                        LEFT JOIN 
                            MASTER_BANK_DETAILS bm ON u.bank_id = bm.id
                            AND bm.isDeleted = false
                        LEFT JOIN 
                            HRMS_REGISTERED_USER_FAMILY uf ON u.employee_id = uf.employee_id 
                            AND uf.relation = 'Father'
                        LEFT JOIN 
                            DESIGNATION desig ON u.designation_id = desig.designation_id
                            AND desig.isDeleted = false
                        LEFT JOIN 
                            MASTER_DEPARTMENT MD ON u.department_id = MD.dept_id
                            AND MD.isDeleted = false
                        WHERE 
                            u.employee_id = :employee_id
                            AND u.primary_entity_id = :entity_id
                            AND u.status = 'ACTIVE'
                            AND u.isDeleted = false`,
            {
              replacements: { employee_id: employee.employee_id, entity_id },
              type: db.sequelize.QueryTypes.SELECT,
            }
          ),

          db.sequelize.query(
            `SELECT 
                            MT.* 
                        FROM 
                            HRMS_PAYROLL_MONTH_ATTENDANCE AS MT 
                        WHERE 
                            MT.employee_id = :employee_id 
                            AND MT.entity_id = :entity_id 
                            AND MT.att_year = :att_year 
                            AND MT.att_month = :att_month
                            AND MT.isDeleted = 0
                            AND MT.status = 'ACTIVE'`,
            {
              replacements: {
                employee_id: employee.employee_id,
                entity_id,
                att_year,
                att_month,
              },
              type: db.sequelize.QueryTypes.SELECT,
            }
          ),
        ]);

        let matchingSalaryData = salaryDataList.filter(
          (data) => data.employee_id === employee.employee_id
        );

        let salary_data =
          matchingSalaryData.length > 0 ? matchingSalaryData[0] : null;

        console.log(salary_data);
        if (!emp_data || attendance_data.length === 0) {
          return {
            employee_id: employee.employee_id,
            status: "failed",
            error: emp_data ? "Salary Details not found" : "Employee not found",
          };
        }

        console.log(emp_data[0]);

        // Generate allowance rows
        const allowances = salary_data.earningComponentList
          .map(
            ({
              componentName,
              monthlyBasic,
              fixedAllowanceMonthly,
              salary_amt,
            }) =>
              `<tr>
                        <td style="text-align: left;">${
                          componentName || "N/A"
                        }</td>
                        <td style="text-align: right;">
                            ${
                              monthlyBasic != null
                                ? parseFloat(monthlyBasic).toFixed(2)
                                : fixedAllowanceMonthly != null
                                ? parseFloat(fixedAllowanceMonthly).toFixed(2)
                                : "-"
                            }
                        </td>
                        <td style="text-align: right;">${
                          salary_amt != null
                            ? parseFloat(salary_amt).toFixed(2)
                            : "0.00"
                        }</td>
                    </tr>
`
          )
          .join("");

        let reimbursements = "";

        if (parseInt(attendance_data[0].total_present_day) > 0) {
          reimbursements = salary_data.reiembursementComponentList
            .map(
              ({ componentName, fixedAllowanceMonthly }) =>
                `<tr>
             <td style="text-align: left;">${componentName || "N/A"}</td>
             <td style="text-align: right;">
                 ${
                   fixedAllowanceMonthly != null
                     ? parseFloat(fixedAllowanceMonthly).toFixed(2)
                     : "0.00"
                 }
             </td>
             <td style="text-align: right;">
                 ${
                   fixedAllowanceMonthly != null
                     ? parseFloat(fixedAllowanceMonthly).toFixed(2)
                     : "0.00"
                 }
             </td>
         </tr>`
            )
            .join("");
        } else {
          reimbursements = salary_data.reiembursementComponentList
            .map(
              ({ componentName, fixedAllowanceMonthly }) =>
                `<tr>
             <td style="text-align: left;">${componentName || "N/A"}</td>
              <td style="text-align: right;">
                 ${
                   fixedAllowanceMonthly != null
                     ? parseFloat(fixedAllowanceMonthly).toFixed(2)
                     : "0.00"
                 }
             </td>
             <td style="text-align: right;">0.00</td>
         </tr>`
            )
            .join("");
        }

        // Combine allowances and reimbursements into one list
        let allowanceDetails = allowances + reimbursements; // Direct string concatenation

        // Conditionally add "TDS" to the deduction list based on tax_calculation
        let updatedDeductionList = [...salary_data.deductionComponentList];

        // if (salary_data.tax_calculation === true) {
        //   updatedDeductionList.push({
        //     componentName: "TDS",
        //     monthlyBasic: null,
        //     fixedAllowanceMonthly: null,
        //     salary_amt: salary_data.tax_amount || "0.00",
        //   });
        // }
        const totalGross = calculateMontlyGross(salary_data);
        // const lwfAmount = await calculateLWF(
        //   employee,
        //   totalGross,
        //   att_month,
        //   att_year
        // );
        // if (lwfAmount.employeeLwf > 0) {
        //   updatedDeductionList.push({
        //     componentName: "LWF",
        //     monthlyBasic: null,
        //     fixedAllowanceMonthly: null,
        //     salary_amt: lwfAmount.employeeLwf.toFixed(2) || "0.00",
        //   });
        // }
        // salary_data.lwfAmount = lwfAmount.employeeLwf || 0;
        // salary_data.employerLwf = lwfAmount.employerLwf || 0;
        // salary_data.governmentLwf = lwfAmount.governmentLwf || 0;

        // const ptAmount = await calculateProfessionalTax(
        //   employee,
        //   totalGross,
        //   att_month,
        //   att_year
        // );

        // if (ptAmount > 0) {
        //   updatedDeductionList.push({
        //     componentName: "PT",
        //     monthlyBasic: null,
        //     fixedAllowanceMonthly: null,
        //     salary_amt: ptAmount.toFixed(2) || "0.00",
        //   });
        // }
        // salary_data.ptAmount = ptAmount || 0;

        // Generate deduction rows
        let deductions = updatedDeductionList
          .map(
            ({ componentName, salary_amt }) =>
              `<tr>
                            <td style="text-align: left;">${
                              componentName || "N/A"
                            }</td>
                            <td style="text-align: right;">${
                              salary_amt != null ? salary_amt : "0.00"
                            }</td>
                        </tr>`
          )
          .join("");

        // Determine the maximum number of rows between earnings and deductions
        const maxRows = Math.max(
          allowanceDetails.split("</tr>").length - 1,
          deductions.split("</tr>").length - 1
        );

        // Pad smaller list with empty rows (dashes) to equalize the number of rows
        while (allowanceDetails.split("</tr>").length - 1 < maxRows) {
          allowanceDetails += `
                    <tr>
                        <td style="text-align: left;">-</td>
                        <td style="text-align: right;">-</td>
                        <td style="text-align: right;">-</td>
                    </tr>`;
        }

        while (deductions.split("</tr>").length - 1 < maxRows) {
          deductions += `
                    <tr>
                        <td style="text-align: left;">-</td>
                        <td style="text-align: right;">-</td>
                    </tr>`;
        }

        // Combine both allowance and deduction rows for the final table
        // Split & clean rows
        // Split & clean Allowances
        let allowanceRows = allowanceDetails
          .split("</tr>")
          .filter((r) => r.trim())
          .map((r) => r + "</tr>");

        // Split & clean Deductions
        let deductionRows = deductions
          .split("</tr>")
          .filter((r) => r.trim())
          .map((r) => r + "</tr>");

        const totalRows = Math.max(allowanceRows.length, deductionRows.length);

        // Pad allowances if fewer
        while (allowanceRows.length < totalRows) {
          allowanceRows.push(`
    <tr>
      <td style="text-align:left;">-</td>
      <td style="text-align:right;">-</td>
      <td style="text-align:right;">-</td>
    </tr>`);
        }

        // Pad deductions if fewer
        while (deductionRows.length < totalRows) {
          deductionRows.push(`
    <tr>
      <td style="text-align:left;">-</td>
      <td style="text-align:right;">-</td>
    </tr>`);
        }
        let finalTable = `
                    <table>
                        <thead>
                            <tr>
                                <th>Earnings</th>
                                <th>Amount</th>
                                <th>Deductions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allowanceDetails
                              .split("</tr>")
                              .map((allowanceRow, index) => {
                                const deductionRow =
                                  deductions.split("</tr>")[index] ||
                                  `
                                    <tr>
                                        <td style="text-align: left;">-</td>
                                        <td style="text-align: right;">-</td>
                                    </tr>`;
                                return allowanceRow + deductionRow;
                              })
                              .join("")}
                        </tbody>
                    </table>
                        `;

        let currency_name;
        let currency_word;
        if (salary_data.currency_id) {
          const currencyRecord = await db.currency_convert.findOne({
            where: { Currency_Convert_id: salary_data.currency_id },
          });
          if (currencyRecord && currencyRecord.Currency_Type) {
            const currencyData = await db.currency_convert.findOne({
              where: { Currency_Type: currencyRecord.Currency_Type },
            });
            if (currencyData) {
              currency_name = currencyData.symbols;
              currency_word = currencyData.word_symbols;
            }
          }
        }
        let attendanceCount = parseFloat(attendance_data[0].total_present_day);

        totalEarnings = calculateTotalEarnings(salary_data, attendanceCount);
        const totalDeductions = calculateTotalDeductions(salary_data);
        netPay = totalEarnings - totalDeductions;
        total_tax = salary_data.tax_amount;
        const netPayInWords = convertNumberToWords(netPay, currency_word);
        const isAE = country_code === "AE";
        const isIN = country_code === "IN";
        let pfAccountStyle = isIN ? "" : 'style="display:none;"';
        let EsicStyle = isIN ? "" : 'style="display:none;"';
        let ifsc_style = isIN ? "" : 'style="display:none;"';
        let panCardStyle = isIN ? "" : 'style="display:none;"';
        let UANStyle = isIN ? "" : 'style="display:none;"';
        let AddharStyle = isIN ? "" : 'style="display:none;"';
        let emirateStyle = isAE ? "" : 'style="display:none;"';
        // Populate the final HTML template
        let finalHtml = htmlTemplate
          .replace("{{employee_code}}", emp_data[0].employee_code || "NA")
          .replace("{{company_address}}", company_address || "Zyno Group")
          .replace("{{country_code}}", country_code || "NA")
          .replace("{{company_branch}}", company_branch || "ZYNO GROUP")
          .replace(
            "{{employee_name}}",
            `${emp_data[0].first_name} ${emp_data[0].last_name}` || "NA"
          )
          .replace("{{emirateStyle}}", emirateStyle)
          .replace(
            "{{emirates_id_number}}",
            emp_data[0].emirates_id_number || "NA"
          )
          .replace("{{sal_month}}", current_month || "NA")
          .replace("{{sal_year}}", att_year || "NA")
          .replace("{{pfAccountStyle}}", pfAccountStyle)
          .replace(
            "{{pf_account_number}}",
            emp_data[0].pf_account_number || "NA"
          )
          .replace("{{working_days}}", attendance_data[0].working_days)
          .replace(
            "{{days_paid}}",
            parseInt(attendance_data[0].total_present_day)
          )
          .replace("{{ifsc_style}}", ifsc_style)
          .replace("{{ifsc_code}}", emp_data[0].ifsc_code || "NA")
          .replace("{{iban_number}}", emp_data[0].iban_number || "NA")
          .replace("{{department_name}}", emp_data[0].department_name || "NA")
          .replace("{{designation_name}}", emp_data[0].designation_name || "NA")
          .replace("{{emp_join_date}}", emp_data[0].emp_join_date || "NA")
          .replace("{{father_name}}", emp_data[0].member_name || "NA")
          .replace("{{UANStyle}}", UANStyle)
          .replace("{{uan_number}}", emp_data[0].UAN_number || "NA")
          .replace("{{EsicStyle}}", EsicStyle)
          .replace("{{esi_number}}", emp_data[0].ESIC_number || "NA")
          .replace("{{account_number}}", emp_data[0].account_number || "NA")
          .replace("{{panCardStyle}}", panCardStyle)
          .replace("{{emp_pan_card}}", emp_data[0].emp_pan_card || "NA")
          .replace("{{dob}}", emp_data[0].date_of_birth || "NA")
          .replace("{{AddharStyle}}", AddharStyle)
          .replace(
            "{{aadhar_nuber}}",
            emp_data[0].emp_adhar_card_number || "NA"
          )
          .replace("{{logo}}", company_logo)
          .replace("{{allowance_details}}", allowanceRows.join("")) // 👈 padded allowances
          .replace("{{deduction_details}}", deductionRows.join("")) // 👈 padded deductions
          .replace("{{total_gross_salary}}", totalGross.toFixed(2) || 0)
          .replace("{{total_earning}}", totalEarnings.toFixed(2) || 0)
          .replace("{{total_deduction}}", totalDeductions.toFixed(2) || 0)
          .replace("{{net_pay}}", parseInt(netPay).toFixed(2) || 0)
          .replace("{{net_pay_in_words}}", netPayInWords || "NA")
          .replace("{{currency_name}}", currency_name || "₹");

        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        // let browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'] })
        const page = await browser.newPage();
await page.setContent(finalHtml, {
  waitUntil: "networkidle0",
  timeout: 0 // disables timeout
});        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
        });
        await browser.close();

        pdfFilename = `${cur_date}_${emp_data[0].employee_code}_Salary-Payslip.pdf`;
        const pdfPath = path.join(pdfDir, pdfFilename);
        fs.writeFileSync(pdfPath, pdfBuffer);

        await db.payroll_payslip.update(
          { pay_slip_status: "INACTIVE" },
          {
            where: {
              employee_id: employee.employee_id,
              entity_id,
              pay_slip_month: att_month,
              pay_slip_year: att_year,
            },
          }
        );

        await db.payroll_payslip.create({
          employee_id: employee.employee_id,
          entity_id,
          salary_data: salary_data,
          tax_amount: total_tax,
          pt_amount: salary_data.ptAmount,
          lwf_amount: salary_data.lwfAmount,
          employer_lwf_amount: salary_data.employerLwf,
          government_lwf_amount: salary_data.governmentLwf,
          fine_amount: salary_data.fineAmount,
          ot_amount: salary_data.overtime_earning,
          loan_disbursed: salary_data.loan_disbursed,
          loan_adjusted: salary_data.loan_adjusted,
          nps_employee_contribution: salary_data.nps_employee_contribution,
          nps_employer_contribution: salary_data.nps_employer_contribution,
          saf_employee_contribution: salary_data.saf_employee_contribution,
          saf_employer_contribution: salary_data.saf_employer_contribution,
          incentive_data: salary_data.incentive_data,
          employers_edli_share: salary_data.employers_edli_share,
          employers_admin_charge_share:
            salary_data.employers_admin_charge_share,
          leave_encash_data: salary_data.leave_encash_data,
          bonus_details: salary_data.bonus_json,
          deduction_details: salary_data.deduction_json,
          employer_epf: salary_data.employer_epf,
          employer_esi: salary_data.employer_esi,
          financial_year_id: salary_data.financial_year_id,
          pay_slip_year: att_year,
          pay_slip_month: att_month,
          recieve_amount: netPay,
          gross_salary: totalEarnings,
          pay_slip_status: "PROCESSED",
          pay_slip_doc: pdfFilename,
          process_id: pay_process.id,
        });

        return { employee_id: employee.employee_id, status: "success" };
      } catch (error) {
        return {
          employee_id: employee.employee_id,
          status: "failed",
          error: error.message,
        };
      }
    };

    const processInBatches = async (items, batchSize) => {
      const results = [];
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        results.push(...(await Promise.all(batch.map(processEmployee))));
      }
      return results;
    };

    const finalResults = await processInBatches(employee_list, BATCH_SIZE);
    return res.status(200).send({
      code: 200,
      message: "Salary slips generated successfully",
      results: finalResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

exports.download_salary_slip = async (req, res) => {
  try {
    const { employee_id, pay_slip_month, financial_year_id } = req.query;

    const fy_detail = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });
    if (!fy_detail) {
      return res
        .status(404)
        .send({ code: 404, message: "Financial year not found" });
    }

    let current_year = parseInt(fy_detail.financial_year);
    if (pay_slip_month == 12) {
      current_year = current_year - 1;
    }

    const salary_slip = await db.payroll_payslip.findOne({
      where: {
        employee_id,
        pay_slip_month,
        pay_slip_year: current_year,
        status: "ACTIVE",
        pay_slip_status: "PROCESSED",
      },
    });
    if (!salary_slip) {
      return res.status(404).send({ message: "Salary Slip not found." });
    }
    let filePath = path.join(
      __dirname,
      "../../../../generated_payslip/",
      salary_slip.pay_slip_doc
    );

    res.download(filePath, (err) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Could not download the file. " + err });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "An error occurred. " + error });
  }
};

exports.download_allsalary_slips_zip = async (req, res) => {
  try {
    const { employee_id, pay_slip_month, financial_year_id } = req.query;
    const fy_detail = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });
    if (!fy_detail) {
      return res
        .status(404)
        .send({ code: 404, message: "Financial year not found" });
    }

    let current_year = parseInt(fy_detail.financial_year);
    if (pay_slip_month == 12) {
      current_year = current_year - 1;
    }

    if (!employee_id || !pay_slip_month) {
      return res
        .status(400)
        .send({ message: "employee_id and pay_slip_month are required." });
    }

    const employeeIds = Array.isArray(employee_id)
      ? employee_id.map(Number)
      : employee_id.split(",").map((id) => parseInt(id.trim(), 10));

    const salary_slips = await db.payroll_payslip.findAll({
      where: {
        employee_id: employeeIds,
        pay_slip_month,
        pay_slip_year: current_year,
        status: "ACTIVE",
        pay_slip_status: "PROCESSED",
      },
    });

    if (!salary_slips || salary_slips.length === 0) {
      return res.status(404).send({ message: "No Salary Slips found." });
    }

    const filePaths = salary_slips.map((slip) =>
      path.resolve(
        __dirname,
        "../../../../generated_payslip/",
        slip.pay_slip_doc
      )
    );

    const appFolder = path.resolve(__dirname, "../app/downloads");
    if (!fs.existsSync(appFolder)) {
      fs.mkdirSync(appFolder, { recursive: true });
    }

    // Define ZIP file path
    const zipFileName = `Salary_Slips_${pay_slip_month}_${current_year}.zip`;
    const zipFilePath = path.join(appFolder, zipFileName);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Setup event listeners
    output.on("close", () => {
      res.download(zipFilePath, (err) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Could not download the file. " + err });
        }

        // Clean up the ZIP file after download
        if (fs.existsSync(zipFilePath)) {
          fs.unlinkSync(zipFilePath);
        }
      });
    });

    archive.on("error", (err) => {
      return res
        .status(500)
        .send({ message: "Error creating ZIP file. " + err });
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add files to the ZIP
    filePaths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: path.basename(filePath) });
      }
    });

    // Finalize the archive
    await archive.finalize();
  } catch (error) {
    res.status(500).send({ message: "An error occurred. " + error.message });
  }
};

exports.get_employee_sdetailsBYID = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { employee_id, entity_id, financial_year_id, att_month } = req.query;

    const emp_data = await db.user.findOne(
      {
        where: {
          employee_id,
          primary_entity_id: entity_id,
          status: "ACTIVE",
          isDeleted: false,
        },
        attributes: [
          "employee_id",
          "title",
          "first_name",
          "last_name",
          "employee_photo",
          "employee_code",
          "date_of_birth",
          "parmanent_address",
          "contact_number",
          "start_working_date",
          "basic_salary",
          "employee_official_email",
        ],
        include: {
          model: db.bank_master,
          required: false,
          where: { status: "ACTIVE", isDeleted: false },
          attributes: ["bank_name", "bank_code"],
        },
      },
      { transaction }
    );

    if (!emp_data) {
      await transaction.rollback();
      return res.status(404).send({ code: 404, message: "No employee found" });
    }

    const [salary_details, allowances, family_members] = await Promise.all([
      db.sequelize.query(
        `SELECT MT.* FROM HRMS_PAYROLL_MONTH_ATTENDANCE AS MT 
                WHERE MT.employee_id = :employee_id AND MT.entity_id = :entity_id 
                AND MT.att_year = :current_year AND MT.att_month = :att_month`,
        {
          replacements: {
            employee_id,
            entity_id,
            current_year: new Date().getFullYear(),
            att_month,
          },
          type: db.sequelize.QueryTypes.SELECT,
        }
      ),
      db.sequelize.query(
        `SELECT AL.allowance_name, AL.amount_type, UA.allowance_amount 
                FROM HRMS_REGISTERED_USER_ALLOWANCE AS UA
                LEFT JOIN MASTER_ALLOWANCE AS AL ON AL.id = UA.allowance_id
                WHERE UA.employee_id = :employee_id AND AL.entity_id = :entity_id 
                AND AL.financial_id = :financial_year_id AND AL.isDeleted = 0 
                AND AL.status = "ACTIVE"`,
        {
          replacements: { employee_id, entity_id, financial_year_id },
          type: db.sequelize.QueryTypes.SELECT,
        }
      ),
      db.sequelize.query(
        `
                SELECT COUNT(UF.relation) as no_of_dependencies 
                FROM HRMS_REGISTERED_USER_FAMILY AS UF
                WHERE UF.employee_id = :employee_id AND UF.status = "ACTIVE" AND (UF.relation = 'Son' OR UF.relation = 'Daughter');
            `,
        {
          replacements: { employee_id },
          type: db.sequelize.QueryTypes.SELECT,
        }
      ),
    ]);

    if (!salary_details.length) {
      await transaction.rollback();
      return res.status(404).send({
        employee_id,
        status: "failed",
        error: "No salary details found",
      });
    }

    const tax_slab_data = await db.sequelize.query(
      `SELECT * FROM HRMS_PAYROLL_TAX_SLAB AS TS
            WHERE TS.financial_year_id = :financial_year_id AND TS.entity_id = :entity_id 
            AND :gross_salary BETWEEN TS.min_salary AND TS.max_salary
            ORDER BY TS.id ASC LIMIT 1`,
      {
        replacements: {
          financial_year_id,
          entity_id,
          gross_salary: salary_details[0]?.gross_salary || 0,
        },
        type: db.sequelize.QueryTypes.SELECT,
        transaction,
      }
    );

    if (!tax_slab_data.length) {
      await transaction.rollback();
      return res
        .status(404)
        .send({ employee_id, status: "failed", error: "No tax slab found" });
    }

    const details = salary_details[0];
    const {
      monthly_base_salary: emp_base_salary,
      gross_salary,
      income_tax: total_tax,
      soc_secur_tax,
      final_tax,
      recieve_amount,
    } = details;

    const total_allowance = allowances.reduce(
      (sum, a) => sum + a.allowance_amount,
      0
    );
    const tot_taxable_allowance = allowances.reduce(
      (sum, a) => sum + (a.amount_type === "TAXABLE" ? a.allowance_amount : 0),
      0
    );

    const dependencies = family_members[0]?.no_of_dependencies || 0;
    const slab = tax_slab_data[0];
    const amountKey = `d${Math.max(dependencies - 1, 0)}_ts_amount`;
    const dependency_Amount = slab[amountKey] || 0;

    emp_data.dataValues = {
      ...emp_data.dataValues,
      allowance_detail: allowances,
      no_of_dependency: dependencies,
      emp_base_salary,
      total_allowance,
      gross_salary,
      min_salary: slab.min_salary,
      dependency_Amount,
      coefficient: slab.coefficient,
      total_tax,
      tot_taxable_allowance,
      soc_secur_tax,
      final_tax,
      recieve_amount,
    };

    await transaction.commit();
    return res.status(200).send({
      code: 200,
      message: "Employee detail retrieved successfully",
      data: emp_data,
    });
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.salary_process_list = async (req, res) => {
  try {
    const { entity_id, financial_year_id } = req.query;
    const cur_year = await db.financial_year.findOne({
      where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
    });
    const process_list = await db.sequelize.query(
      `SELECT DISTINCT(PP.id),PP.process_id,PP.pay_slip_month,PP.pay_slip_year,PP.payroll_status,COUNT(DISTINCT PS.id) AS no_of_employee FROM HRMS_PAYROLL_PROCESS AS PP
            LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS ON PS.process_id = PP.id AND PS.pay_slip_status = 'PROCESSED'
            WHERE PP.entity_id = :entity_id AND PP.isDeleted = 0 AND PP.status = 'ACTIVE' GROUP BY PP.id, PP.pay_slip_month, PP.pay_slip_year, PP.payroll_status ORDER BY PP.id DESC`,
      {
        replacements: {
          entity_id,
          current_year: cur_year.financial_year,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const filtered_process_list = process_list.filter(
      (process) => process.no_of_employee > 0
    );

    if (filtered_process_list.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get Process List Successfully!",
        data: filtered_process_list,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Process List Found with employees",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal Server Error" });
  }
};

exports.employee_list_BYprocessID = async (req, res) => {
  try {
    const process_id = req.params.id;
    const employee_list = await db.sequelize.query(
      `SELECT 
                U.employee_id,
                U.employee_official_email,
                U.employee_code,
                U.basic_salary,
                U.country_code,
                U.first_name,
                U.last_name,
                U.contact_number,
                D.designation_name,
                PS.* 
            FROM HRMS_PAYROLL_PAY_SLIPS AS PS
            LEFT JOIN HRMS_REGISTERED_USER AS U 
                ON U.employee_id = PS.employee_id
            LEFT JOIN DESIGNATION AS D 
                ON D.designation_id = U.designation_id 
            WHERE 
                PS.process_id = :process_id 
                AND PS.isDeleted = 0 
                AND PS.status = 'ACTIVE'
                `,

      {
        replacements: {
          process_id,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (employee_list.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Get Employee List Successfully!",
        data: employee_list,
      });
    } else {
      return res.status(404).send({
        code: 403,
        message: "No Employee found",
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.downloadEmployeeSalaryData = async (req, res) => {
  try {
    const { entity_id, financial_year_id, att_month, employee_list } = req.body;
    const current_year = new Date().getFullYear();
    const BATCH_SIZE = 10;

    // Process an individual employee
    const processEmployee = async (employee) => {
      try {
        const [emp_data, attendance_data] = await Promise.all([
          db.sequelize.query(
            `SELECT u.employee_id, u.first_name, u.last_name, u.employee_code, u.basic_salary, 
                        u.account_number, bm.bank_name, uf.member_name AS father_name 
                        FROM HRMS_REGISTERED_USER u
                        LEFT JOIN MASTER_BANK_DETAILS bm ON u.bank_id = bm.id AND bm.isDeleted = false
                        LEFT JOIN HRMS_REGISTERED_USER_FAMILY uf ON u.employee_id = uf.employee_id AND uf.relation = 'Father'
                        WHERE u.employee_id = :employee_id AND u.primary_entity_id = :entity_id AND u.status = 'ACTIVE' AND u.isDeleted = false`,
            {
              replacements: { employee_id: employee, entity_id },
              type: db.sequelize.QueryTypes.SELECT,
            }
          ),
          db.sequelize.query(
            `SELECT MT.* FROM HRMS_PAYROLL_MONTH_ATTENDANCE MT 
                        WHERE MT.employee_id = :employee_id AND MT.entity_id = :entity_id 
                        AND MT.att_year = :current_year AND MT.att_month = :att_month`,
            {
              replacements: {
                employee_id: employee,
                entity_id,
                current_year,
                att_month,
              },
              type: db.sequelize.QueryTypes.SELECT,
            }
          ),
        ]);
        return {
          employee_id: employee.employee_id,
          emp_data: {
            ...emp_data[0],
            attendance_data: attendance_data[0] || {},
          },
        };
      } catch (error) {
        return {
          employee_id: employee.employee_id,
          emp_data: {
            ...emp_data[0],
            attendance_data: attendance_data[0] || {},
          },
        };
      }
    };

    const processInBatches = async (items, batchSize) => {
      const results = [];
      for (let i = 0; i < items.length; i += batchSize) {
        const batchResults = await Promise.all(
          items.slice(i, i + batchSize).map(processEmployee)
        );
        results.push(...batchResults);
      }
      return results;
    };

    const finalResults = await processInBatches(employee_list, BATCH_SIZE);
    return res.status(200).send({
      code: 200,
      message: "Downloaded salary data successfully",
      results: finalResults,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.update_total_attendance = async (req, res) => {
  try {
    const {
      attendance_id,
      entity_id,
      financial_year_id,
      start_date,
      end_date,
      salary_process_month,
      employee_id,
      att_month,
      total_P,
      total_A,
      total_PL,
      total_UL,
      total_DA,
      total_HD,
      total_PHL,
      total_UHL,
      total_CO,
      total_WFO,
      total_WHO,
      total_present_day,
      att_year,
      total_DP,
      total_PFD,
      total_PHD,
      total_HPFD,
      total_HPHD,
      total_NPFD,
      total_NPHD,
      total_H,
    } = req.body;

    const totalPresentDay =
      (parseInt(total_P) || 0) +
      (parseInt(total_H) || 0) +
      (parseInt(total_DP) || 0) +
      (parseInt(total_WFO) || 0) +
      (parseInt(total_WHO) || 0) +
      (parseInt(total_PFD) || 0) +
      (parseInt(total_HPFD) || 0) * 0.5 +
      (parseInt(total_PHD) || 0) +
      (parseInt(total_HPHD) || 0) * 0.75;

    await db.payroll_att_month.update(
      { isDeleted: true, status: "INACTIVE" },
      {
        where: {
          employee_id,
          entity_id,
          financial_year_id,
          att_year,
          att_month,
          id: attendance_id,
        },
      }
    );

    await db.payroll_att_month.create({
      employee_id,
      financial_year_id,
      entity_id,
      total_P: total_P,
      total_A: total_A,
      total_PL: total_PL,
      total_UL: total_UL,
      total_DA: total_DA,
      total_HD: total_HD,
      total_PHL: total_PHL,
      total_UHL: total_UHL,
      total_CO: total_CO,
      total_WFO: total_WFO,
      total_WHO: total_WHO,
      total_DP: total_DP,
      total_PFD: total_PFD,
      total_PHD: total_PHD,
      total_HPFD: total_HPFD,
      total_HPHD: total_HPHD,
      total_NPFD: total_NPFD,
      total_NPHD: total_NPHD,
      total_H: total_H,
      working_days: total_present_day,
      salary_process_month,
      att_month,
      att_year,
      payroll_cycle_start_date: start_date,
      payroll_cycle_end_date: end_date,
      //   total_present_day: total_P,
      total_present_day: totalPresentDay,
    });

    // Success response
    res
      .status(200)
      .send({ code: 200, message: "Attendance marked successfully!" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

// // Helper function to calculate attendance totals (implement your logic here)
// async function calculateAttendanceTotals(employee_id, start_date, end_date) {
//     // Mocked logic: Replace with actual calculations based on your data
//     return {
//         total_P: 20,
//         total_A: 2,
//         total_PL: 1,
//         total_UL: 1,
//         total_DA: 0,
//         total_HD: 0,
//         total_PHL: 0,
//         total_UHL: 0,
//         total_CO: 0,
//         total_WFO: 18,
//         total_WHO: 2
//     };
// }

// // Mocked function to get payroll cycle dates (implement your logic here)
// async function getPayrollCycleDates(start_date, end_date, att_year, current_year) {
//     // Mocked logic: Replace with actual calculations based on your data
//     return {
//         payrollCycleStart: start_date,
//         payrollCycleEnd: end_date,
//         daysInCycle: 30
//     };
// }

function calculateTotalGross(salary_data) {
  return salary_data.earningComponentList.reduce((total, component) => {
    const salaryAmt = parseFloat(component.salary_amt) || 0;
    return total + salaryAmt;
  }, 0);
}

function calculateMontlyGross(salary_data) {
  const allowanceTotal = salary_data.earningComponentList.reduce(
    (total, component) => {
      const salaryAmt =
        parseFloat(component.monthlyBasic || component.fixedAllowanceMonthly) ||
        0;
      return total + salaryAmt;
    },
    0
  );

  const reimbursementTotal = salary_data.reiembursementComponentList.reduce(
    (total, component) => {
      const salaryAmt = parseFloat(component.fixedAllowanceMonthly) || 0;
      return total + salaryAmt;
    },
    0
  );

  return allowanceTotal + reimbursementTotal;
}

function calculateTotalEarnings(salary_data, attendanceCount) {
  const allowanceTotal = salary_data.earningComponentList.reduce(
    (total, component) => {
      const salaryAmt = parseFloat(component.salary_amt) || 0;
      return total + salaryAmt;
    },
    0
  );

  let reimbursementTotal = 0;
  if (attendanceCount > 0) {
    reimbursementTotal = salary_data.reiembursementComponentList.reduce(
      (total, component) => {
        const salaryAmt = parseFloat(component.fixedAllowanceMonthly) || 0;
        return total + salaryAmt;
      },
      0
    );
  } else {
    reimbursementTotal = 0; // Explicitly set to 0 if the condition is false
  }

  return allowanceTotal + reimbursementTotal;
}
function calculateTotalDeductions(salary_data) {
  const normalDeduction = salary_data.deductionComponentList.reduce(
    (total, component) => {
      const salaryAmt = parseFloat(component.salary_amt) || 0;
      return total + salaryAmt;
    },
    0
  );

  // const taxDeduction = parseFloat(salary_data.tax_amount) || 0;
  // const lwfDeduction = parseFloat(salary_data.lwfAmount) || 0;

  // return normalDeduction + taxDeduction + lwfDeduction;
  return normalDeduction;
}

function convertNumberToWords(num, currency_word) {
  const singleDigits = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const twoDigits = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const teens = [
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const placeValues = ["", "Thousand", "Lakh", "Crore"];
  num = parseInt(num);
  if (num === 0) return "Zero";

  let words = "";

  function numToWords(n, suffix) {
    let str = "";

    if (n > 99) {
      str += singleDigits[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n > 10 && n < 20) {
      str += teens[n - 11] + " ";
    } else {
      str += twoDigits[Math.floor(n / 10)] + " ";
      str += singleDigits[n % 10] + " ";
    }

    str = str.trim();
    if (str && suffix) {
      str += " " + suffix;
    }
    return str;
  }

  let group = 0;
  while (num > 0) {
    let divisor = group === 1 ? 100 : 1000;
    const part = num % divisor;

    if (part > 0) {
      words = numToWords(part, placeValues[group]) + " " + words;
    }

    num = Math.floor(num / divisor);
    group++;
  }

  // Add the final string
  return words.trim() + ` ${currency_word} Only`;
}
exports.getAllEmployeesByDepartment = async (req, res) => {
  try {
    const departmentIdsParam = req.query.department_ids; // e.g., "4465,4392"

    if (!departmentIdsParam) {
      return res.status(400).send({ message: "No department IDs provided." });
    }

    const department_ids = departmentIdsParam
      .split(",")
      .map((id) => Number(id.trim()));

    const employees = await db.user.findAll({
      where: {
        department_id: department_ids, // Sequelize will handle `IN` clause
        isDeleted: false,
      },
      attributes: ["employee_id", "first_name", "last_name"],
    });

    // Map and add full_name field
    const formattedEmployees = employees.map((emp) => ({
      employee_id: emp.employee_id,
      full_name: `${emp.first_name} ${emp.last_name}`,
    }));

    return res.status(200).send({
      message: "Employees fetched successfully!",
      data: formattedEmployees,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};
