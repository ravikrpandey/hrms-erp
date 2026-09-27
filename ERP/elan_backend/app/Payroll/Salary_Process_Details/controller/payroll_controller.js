const db = require("../../../models/index");
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');



exports.get_all_employee_list = async (req, res) => {
    try {
        let { entity_id, pay_slip_month, financial_year_id  } = req.query;
        // if (!current_year || current_year == 'undefined') {
        //     current_year = new Date().getFullYear();
        // }
        const fy_detail = await db.financial_year.findOne({
            where: { id: financial_year_id, status: "ACTIVE", isDeleted: false }
        });
        if (!fy_detail) {
            return res.status(404).send({ code: 404, message: 'Financial year not found' });
        }
        
        const current_year = fy_detail.financial_year;


        // Base SQL query with a conditional addition for branchId
        let sqlQuery = `
            SELECT U.employee_id, U.employee_official_email, U.employee_code, U.basic_salary, U.country_code, 
                   U.first_name, U.last_name, U.contact_number, D.designation_name, HEPS.monthly_ctc,
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
            type: db.sequelize.QueryTypes.SELECT
        });

        if (employee_list.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Employee List Successfully!", data: employee_list });
        } else {
            return res.status(404).send({ code: 403, message: "No Employee found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.get_all_employee_list_hold = async (req, res) => {
    try {
        let { entity_id, pay_slip_month, current_year } = req.query;

        // Default current_year if not provided
        if (!current_year || current_year == 'undefined') {
            current_year = new Date().getFullYear();
        }

        // SQL query to fetch the employee list
        let sqlQuery = `
            SELECT U.employee_id, U.employee_official_email, U.employee_code, U.basic_salary, U.country_code, 
                   U.first_name, U.last_name, U.contact_number, D.designation_name, HEPS.monthly_ctc,
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

        // Execute the query
        const employee_list = await db.sequelize.query(sqlQuery, {
            replacements: {
                entity_id,
                current_year,
                pay_slip_month,
            },
            type: db.sequelize.QueryTypes.SELECT
        });

        // Respond with the results
        if (employee_list.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Employee List Successfully!", data: employee_list });
        } else {
            return res.status(404).send({ code: 403, message: "No Employee found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};



exports.total_monthly_attendance = async (req, res) => {
    try {
        let { entity_id, start_date, end_date, financial_year_id, salary_process_month, att_month } = req.query;

        if (!start_date || !end_date || start_date === 'null' || end_date === 'null') {
            return res.status(400).send({ code: '400', message: "Payroll Cycle date is mandatory" });
        }

        const employees = await db.user.findAll({
            where: { primary_entity_id: entity_id, status: "ACTIVE", isDeleted: false }
        });

        const payrollCycleStart = new Date(start_date);
        const payrollCycleEnd = new Date(end_date);
        
        // Adjust end_date for the next year if it's earlier in the calendar than the start_date
        if (payrollCycleEnd < payrollCycleStart) {
            payrollCycleEnd.setFullYear(payrollCycleEnd.getFullYear() + 1);
        }
        
        const daysInCycle = Math.ceil((payrollCycleEnd - payrollCycleStart) / (1000 * 60 * 60 * 24)) + 1;
        const currentDate = new Date();
        // const att_month = currentDate.getMonth() + 1;
        // const salary_process_month = currentDate.getMonth() + 1;
        
        const fy_detail = await db.financial_year.findOne({
            where: { id: financial_year_id, status: "ACTIVE", isDeleted: false }
        });
        if (!fy_detail) {
            return res.status(404).send({ code: 404, message: 'Financial year not found' });
        }
        
        const att_year = fy_detail.financial_year;
        // const financial_year_id = fy_detail.id;

        const attendancePromises = employees.map(async (employee) => {
            const { employee_id } = employee;

            const attendance = await db.sequelize.query(
                `SELECT DISTINCT
                    COUNT(CASE WHEN attendance_status = 'P' THEN 1 END) AS total_P,
                    COUNT(CASE WHEN attendance_status = 'A' THEN 1 END) AS total_A,
                    COUNT(CASE WHEN attendance_status = 'PL' THEN 1 END) AS total_PL,
                    COUNT(CASE WHEN attendance_status = 'UL' THEN 1 END) AS total_UL,
                    COUNT(CASE WHEN attendance_status = 'DA' THEN 1 END) AS total_DA,
                    COUNT(CASE WHEN attendance_status = 'HD' THEN 1 END) AS total_HD,
                    COUNT(CASE WHEN attendance_status = 'PHL' THEN 1 END) AS total_PHL,
                    COUNT(CASE WHEN attendance_status = 'UHL' THEN 1 END) AS total_UHL,
                    COUNT(CASE WHEN attendance_status = 'CO' THEN 1 END) AS total_CO,
                    COUNT(CASE WHEN attendance_status = 'WFO' THEN 1 END) AS total_WFO,
                    COUNT(CASE WHEN attendance_status = 'WHO' THEN 1 END) AS total_WHO
                FROM ESS_DAILY_ATTENDANCE_MASTER
                WHERE employee_id = :employee_id
                AND entity_id = :entity_id
                AND att_date BETWEEN :start_date AND :end_date
                AND isDeleted = 0
                GROUP BY entity_id, att_month`,
                {
                    replacements: { employee_id, entity_id, start_date, end_date },
                    type: db.sequelize.QueryTypes.SELECT
                }
            );

            const totals = attendance[0] || {
                total_P: 0,
                total_A: 0,
                total_PL: 0,
                total_UL: 0,
                total_DA: 0,
                total_HD: 0,
                total_PHL: 0,
                total_UHL: 0,
                total_CO: 0,
                total_WFO: 0,
                total_WHO: 0
            };

            const totalPresentDay =
                (parseInt(totals.total_P) || 0) +
                (parseInt(totals.total_PL) || 0) +
                ((parseInt(totals.total_DA) || 0) + (parseInt(totals.total_HD) || 0) + (parseInt(totals.total_PHL) || 0)) * 0.5;


            await db.payroll_att_month.destroy({
                where: { employee_id, entity_id, financial_year_id, att_year, att_month: att_month - 1 }
            });

            await db.payroll_att_month.create({
                employee_id,
                financial_year_id,
                entity_id,
                total_P: totals.total_P,
                total_A: totals.total_A,
                total_PL: totals.total_PL,
                total_UL: totals.total_UL,
                total_DA: totals.total_DA,
                total_HD: totals.total_HD,
                total_PHL: totals.total_PHL,
                total_UHL: totals.total_UHL,
                total_CO: totals.total_CO,
                total_WFO: totals.total_WFO,
                total_WHO: totals.total_WHO,
                working_days: daysInCycle,
                salary_process_month,
                att_month:att_month,
                att_year ,
                payroll_cycle_start_date: start_date,
                payroll_cycle_end_date: end_date,
                total_present_day: totalPresentDay
            });
        });

        await Promise.all(attendancePromises);

        res.status(200).send({ code: 200, message: 'Attendance marked successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ code: 500, message: error.message || 'Server Error' });
    }
};



// exports.employee_attendance_details = async (req, res) => {
//     try {
//         const { entity_id, att_month, financial_year_id } = req.query;
//         const cur_year = await db.financial_year.findOne({ where: { id: financial_year_id, status: "ACTIVE", isDeleted: false } });
//         const salary_details = await db.sequelize.query(
//             `SELECT DISTINCT U.employee_id,U.employee_official_email,U.employee_code, U.first_name, U.last_name,MT.total_P,MT.total_A,MT.total_PL,MT.total_UL,MT.total_DA,MT.total_HD,MT.total_PHL,MT.total_UHL,MT.status 
//             FROM HRMS_REGISTERED_USER AS U 
//             LEFT JOIN HRMS_PAYROLL_MONTH_ATTENDANCE AS MT ON U.employee_id = MT.employee_id AND MT.entity_id = :entity_id AND MT.att_year = :current_year  AND MT.att_month = :att_month
//             WHERE U.primary_entity_id = :entity_id AND U.isDeleted = 0 AND U.status = 'ACTIVE'`,
//             {
//                 replacements: {
//                     entity_id, att_year: cur_year.financial_year, att_month
//                 },
//                 type: db.sequelize.QueryTypes.SELECT
//             }
//         );

//         if (salary_details.length > 0) {
//             return res.status(200).send({ code: 200, message: "Get Employee Salary Details Successfully!", data: salary_details });
//         } else {
//             return res.status(404).send({ code: 403, message: "No Employee found" });
//         }

//     } catch (error) {

//         return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
//     }
// }


exports.employee_attendance_details = async (req, res) => {
    try {
        const { entity_id, att_month, financial_year_id } = req.query;

        if (!entity_id || !att_month || !financial_year_id) {
            return res.status(400).send({ code: 400, message: "Missing required parameters." });
        }

        const cur_year = await db.financial_year.findOne({ where: { id: financial_year_id, status: "ACTIVE", isDeleted: false } });
        if (!cur_year) return res.status(404).send({ code: 404, message: "Financial year not found." });

        const salary_details = await db.sequelize.query(
            `SELECT DISTINCT 
                U.employee_id, U.employee_official_email, U.employee_code, 
                U.first_name, U.last_name, MT.total_P, MT.total_A, MT.total_PL, 
                MT.total_UL, MT.total_DA, MT.total_HD, MT.total_PHL, MT.total_UHL, MT.status
            FROM HRMS_REGISTERED_USER U
            LEFT JOIN HRMS_PAYROLL_MONTH_ATTENDANCE MT 
                ON U.employee_id = MT.employee_id AND MT.entity_id = :entity_id 
                AND MT.att_year = :att_year AND MT.att_month = :att_month
            WHERE U.primary_entity_id = :entity_id AND U.isDeleted = 0 AND U.status = 'ACTIVE'`,
            {
                replacements: { entity_id, att_year: cur_year.financial_year, att_month },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (salary_details.length > 0) {
            return res.status(200).send({ code: 200, message: "Employee attendance details retrieved!", data: salary_details });
        } else {
            return res.status(404).send({ code: 404, message: "No employees found." });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};


exports.employee_salary_detailsBYID = async (req, res) => {
    try {
        const { employee_id, entity_id, att_month, financial_year_id } = req.query;
        const cur_year = await db.financial_year.findOne({ where: { id: financial_year_id, status: "ACTIVE", isDeleted: false } });

        let [salary_details] = await Promise.all([
            db.sequelize.query(
                `SELECT U.employee_id, U.employee_official_email, U.employee_code, U.first_name, U.last_name, CONCAT('+', U.country_code, ' ', U.contact_number) as contact_number, U.date_of_birth, U.parmanent_address, B.bank_name, MT.* FROM HRMS_REGISTERED_USER AS U 
                 LEFT JOIN HRMS_PAYROLL_MONTH_ATTENDANCE AS MT ON U.employee_id = MT.employee_id AND MT.entity_id = :entity_id AND MT.att_year = :current_year  
                    AND MT.att_month = :att_month
                 LEFT JOIN MASTER_BANK as B ON B.id = U.bank_id
                 WHERE U.primary_entity_id = :entity_id AND U.isDeleted = 0 AND U.status = 'ACTIVE' AND U.employee_id = :employee_id AND MT.employee_id = :employee_id`,
                {
                    replacements: {
                        employee_id, entity_id, current_year: cur_year.financial_year, att_month
                    },
                    type: db.sequelize.QueryTypes.SELECT
                }
            ),

        ]);

        // Assuming `salary_data` is a property for each employee:
        salary_details.forEach(employee => {
            if (employee.salary_data && employee.salary_data.length > 0) {
                employee.salary_data.forEach(salary => {
                    const totalDeductionAmt = salary.deductionComponentList.reduce((sum, deduction) => {
                        return sum + parseFloat(deduction.salary_amt);
                    }, 0);

                    // Insert total_deduction_amt into salary_data
                    employee.total_deduction_amt = totalDeductionAmt.toFixed(2); // Format to 2 decimal places if needed
                });
            }
        });

        return res.status(200).send({
            code: 200,
            message: "Get Employee Salary Detail Successfully!",
            data: salary_details
        })


    } catch (error) {

        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};




// calculation of Income Tax slab----------------------------------

async function calculateTax(salaryData) {
    let tax_amount = 0;
    const currentDate = new Date();

    if (salaryData.tax_calculation === true) {
        let isTax = await db.payroll_tax_slab.findOne({
            where: { id: salaryData.tax_slab_id, isDeleted: false },
        });

        if (isTax) {
            let totalMonthlyEarnings = 0;

            let extraSaving;
            const att_year = currentDate.getFullYear();

            const fy_detail = await db.financial_year.findOne({
                where: { financial_year: att_year, status: "ACTIVE", isDeleted: false }
            });
            if (!fy_detail) {
                return res.status(404).send({ code: 404, message: 'Financial year not found' });
            }

            const financial_year_id = fy_detail.id;
            let otherSaving = await db.payroll_declaration_form.findOne({ where: { login_id: salaryData.employee_id, approval_status: "APPROVED", financial_year_id: financial_year_id, status: "ACTIVE", isDeleted: false } })
            if (otherSaving) {
                extraSaving = otherSaving.saving_amout || 0;
            }


            let taxable_amount = 0; // Declare globally to use later

            // Loop through the earningComponentList
            if (salaryData && Array.isArray(salaryData.earningComponentList)) {
                taxable_amount = salaryData.earningComponentList
                    .map(component => component.is_taxable ? parseFloat(component.monthlyBasic || component.fixedAllowanceMonthly) || 0 : 0)
                    .reduce((sum, value) => sum + value, 0); // Update the global taxable_amount
                console.log("Total Taxable Amount:", taxable_amount);
            }
            let allowance_taxable_amount = 0;
            // other allowance if it is taxable
            if (salaryData && Array.isArray(salaryData.reiembursementComponentList)) {
                allowance_taxable_amount = salaryData.reiembursementComponentList
                    .map(component => component.is_taxable ? parseFloat(component.monthlyBasic || component.fixedAllowanceMonthly) || 0 : 0)
                    .reduce((sum, value) => sum + value, 0); // Update the global allowance_taxable_amount
                console.log("Total Taxable Amount:", allowance_taxable_amount);
            }


            let annualSalary;
            let taxableIncome;
            // Calculate annualSalary and taxableIncome
            if (salaryData) {
                annualSalary = taxable_amount * 12; // Use the updated taxable_amount
                annualSalary = annualSalary + allowance_taxable_amount;
                taxableIncome = annualSalary - (
                    (parseFloat(isTax.standard_deduction) || 0) +
                    (parseFloat(extraSaving) || 0)
                );

                console.log("Annual Salary:", annualSalary);
                console.log("Taxable Income:", taxableIncome);
            }


            // Calculate tax from slabs
            if (taxableIncome > 0) {
                for (let slab of isTax.tax_slab_row) {
                    let min = slab.min === "Upto" ? 0 : parseInt(slab.min);
                    let max = slab.max === "Upto" ? Infinity : parseInt(slab.max);
                    let percentage = slab.percentage === "NIL" ? 0 : parseFloat(slab.percentage);

                    if (taxableIncome > min) {
                        let taxableAmountInSlab = Math.min(taxableIncome, max) - min;
                        if (taxableAmountInSlab > 0) {
                            tax_amount += (taxableAmountInSlab * percentage) / 100;
                        }
                    }
                }
            }
        }
    }

    // Assign tax_amount to salaryData
    salaryData.tax_amount = (tax_amount / 12).toFixed(2);

    return salaryData; // Return updated salaryData with tax_amount
}


async function generateSalary(employee_list, entity_id, financial_year_id, att_month, att_year) {
    const currentDate = new Date();
    // const att_month = currentDate.getMonth(); // Current month (1-based)
    // const att_year = currentDate.getFullYear();

    

    const attendancePromises = employee_list.map(async (employee) => {
        const { employee_id } = employee;

        // Fetch salary and attendance data
        let salaryData = await db.payroll_pay_salary.findOne({
            where: { employee_id, entity_id, g_pay: false, financial_year_id },
        });

        let attendance_data = await db.payroll_att_month.findOne({
            where: {
                entity_id,
                financial_year_id,
                employee_id,
                att_month: att_month, // Previous month
                att_year,
            },
        });

        if (!salaryData || !attendance_data) {
            console.warn(`Missing data for employee_id: ${employee_id}`);
            return null;
        }

        // Calculate base salary details
        let base_salary = parseFloat(salaryData.monthly_ctc) || 0;
        const daily_wages = base_salary / parseFloat(attendance_data.working_days) || 0;

        // Function to calculate earned salary for components
        const calculateEarnSalaryAmt = (component) => {
            const amount = parseFloat(component.monthlyBasic || component.fixedAllowanceMonthly) || 0;
            return (amount / attendance_data.working_days) * attendance_data.total_present_day; // Daily * Present Days
        };

        // Process salary components
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



        // Calculate tax
        salaryData = await calculateTax(salaryData); // Ensure the returned object is updated

        return salaryData;
    });

    // Resolve all promises and return salary data for all employees
    const allSalaries = await Promise.all(attendancePromises);
    return allSalaries.filter((salary) => salary !== null); // Filter out nulls
}



exports.generate_salary_slip = async (req, res) => {
    try {
        const { entity_id, financial_year_id, att_month, employee_list } = req.body;

        const fy_detail = await db.financial_year.findOne({
            where: { id: financial_year_id, status: "ACTIVE", isDeleted: false }
        });
        if (!fy_detail) {
            return res.status(404).send({ code: 404, message: 'Financial year not found' });
        }
        
        let att_year = fy_detail.financial_year;
        const salaryDataList = await generateSalary(employee_list, entity_id, financial_year_id, att_month, att_year);

        if (!salaryDataList || salaryDataList.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No salary data generated. Please check the input data.",
            });
        }

        const htmlPath = 'app/Payroll/Salary_Process_Details/salary_slip.html';
        const BATCH_SIZE = 5;
        const pdfDir = 'generated_payslip';
        const process_number = "PROC";

        if (!fs.existsSync(htmlPath)) {
            return res.status(404).send({ code: 404, message: 'HTML file not found' });
        }


        const cur_date = new Date().toLocaleDateString('en-GB').replace(/\//g, '_');
        const current_year = new Date().getFullYear();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const [current_month, daysInSalaryMonth] = [(d => monthNames[d.getMonth()])((p => new Date(p.getFullYear(), p.getMonth() - 1))(new Date())), (d => new Date(d.getFullYear(), d.getMonth(), 0).getDate())(new Date())];

        const htmlTemplate = fs.readFileSync(htmlPath, 'utf8');
        if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

        const lastEntry = await db.payroll_process.findOne({
            where: { status: "ACTIVE" },
            order: [["createdAt", "DESC"]],
            attributes: ["process_id"],
        });

        const lastNumber = lastEntry && parseInt(lastEntry.process_id.slice(-5), 10);
        const number = !isNaN(lastNumber) ? lastNumber + 1 : 1;
        const process_no = `${process_number}${String(number).padStart(5, "0")}`;

        const pay_process = await db.payroll_process.create({
            process_id: process_no,
            pay_slip_month: att_month,
            pay_slip_year: att_year, entity_id
        });
        let company_logo, company_branch, company_address;

        const entityData = await db.sequelize.query(
            ` SELECT em.*
            FROM ENTITY_MASTER AS em
            WHERE em.id = :entity_id AND em.isDeleted = false;`,
            {
                replacements: { entity_id: entity_id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (entityData.length > 0) {
            company_logo = `uploaded_files/${entityData[0].logo}`;
            company_branch = entityData[0].company_branch
            company_address = entityData[0].branch_address
        }


        let pdfFilename;
        let totalEarnings;
        let netPay;
        let total_tax;
        const processEmployee = async (employee) => {
            try {
                // Fetch employee data and salary details based on employee_id, entity_id, and financial year
                console.log(employee)

                let [emp_data, attendance_data] = await Promise.all([
                    // Fetch employee data
                    db.sequelize.query(
                        `SELECT 
                            u.employee_id, 
                            u.first_name, 
                            u.last_name, 
                            u.employee_code, 
                            u.basic_salary, 
                            u.account_number,  
                            u.pf_account_number, 
                            u.UAN_number, 
                            u.ESIC_number, 
                            u.ifsc_code, 
                            u.emirates_id_number, 
                            u.date_of_birth, 
                            u.emp_pan_card, 
                            u.emp_adhar_card_number, 
                            u.bank_id,
                            bm.bank_name,
                            uf.member_name
                        FROM 
                            HRMS_REGISTERED_USER u
                        LEFT JOIN 
                            MASTER_BANK bm ON u.bank_id = bm.id
                            AND bm.isDeleted = false
                        LEFT JOIN 
                            HRMS_REGISTERED_USER_FAMILY uf ON u.employee_id = uf.employee_id 
                            AND uf.relation = 'Father'
                      
                        WHERE 
                            u.employee_id = :employee_id
                            AND u.primary_entity_id = :entity_id
                            AND u.status = 'ACTIVE'
                            AND u.isDeleted = false`,
                        {
                            replacements: { employee_id: employee.employee_id, entity_id },
                            type: db.sequelize.QueryTypes.SELECT
                        }
                    ),

                    // Fetch salary details
                    db.sequelize.query(
                        `SELECT 
                            MT.* 
                        FROM 
                            HRMS_PAYROLL_MONTH_ATTENDANCE AS MT 
                        WHERE 
                            MT.employee_id = :employee_id 
                            AND MT.entity_id = :entity_id 
                            AND MT.att_year = :att_year 
                            AND MT.att_month = :att_month`,
                        {
                            replacements: { employee_id: employee.employee_id, entity_id, att_year, att_month },
                            type: db.sequelize.QueryTypes.SELECT
                        }
                    )
                ]);

                let matchingSalaryData = salaryDataList.filter(data => data.employee_id === employee.employee_id);

                // Assuming you want the first match (if any)
                let salary_data = matchingSalaryData.length > 0 ? matchingSalaryData[0] : null;

                console.log( salary_data)
                if (!emp_data || attendance_data.length === 0) {
                    return {
                        employee_id: employee.employee_id,
                        status: 'failed',
                        error: emp_data ? 'Salary Details not found' : 'Employee not found',
                        // data1: emp_data,
                        // data2: attendance_data,
                        // data3: salaryData, 

                    };
                }

                console.log(emp_data[0])

                // Generate allowance rows
                const allowances = salary_data.earningComponentList.map(({ componentName, monthlyBasic, fixedAllowanceMonthly, salary_amt }) =>
                    `<tr>
                        <td style="text-align: left;">${componentName || 'N/A'}</td>
                        <td style="text-align: right;">
                            ${monthlyBasic != null
                        ? parseFloat(monthlyBasic).toFixed(2)
                        : (fixedAllowanceMonthly != null
                            ? parseFloat(fixedAllowanceMonthly).toFixed(2)
                            : '0.00')}
                        </td>
                        <td style="text-align: right;">${salary_amt != null ? parseFloat(salary_amt).toFixed(2) : '0.00'}</td>
                    </tr>
`
                ).join(''); // Convert array to string without commas

                // Generate reimbursement rows
                const reimbursements = salary_data.reiembursementComponentList.map(({ componentName, fixedAllowanceMonthly }) =>
                    `<tr>
                            <td style="text-align: left;">${componentName || 'N/A'}</td>
                            <td style="text-align: right;">
                                ${fixedAllowanceMonthly != null
                        ? parseFloat(fixedAllowanceMonthly).toFixed(2)
                        : '0.00'}
                            </td>
                            <td style="text-align: right;">
                                ${fixedAllowanceMonthly != null
                        ? parseFloat(fixedAllowanceMonthly).toFixed(2)
                        : '0.00'}
                            </td>
                        </tr>
`
                ).join(''); // Convert array to string without commas

                // Combine allowances and reimbursements into one list
                let allowanceDetails = allowances + reimbursements; // Direct string concatenation

                // Conditionally add "TDS" to the deduction list based on tax_calculation
                let updatedDeductionList = [...salary_data.deductionComponentList];

                if (salary_data.tax_calculation === true) {
                    updatedDeductionList.push({
                        componentName: "TDS",
                        monthlyBasic: null,
                        fixedAllowanceMonthly: null,
                        salary_amt: salary_data.tax_amount || '0.00' // Ensure tax amount is assigned correctly
                    });
                }

                // Generate deduction rows
                let deductions = updatedDeductionList.map(({ componentName, monthlyBasic,fixedAllowanceMonthly}) =>
                    `<tr>
                            <td style="text-align: left;">${componentName || 'N/A'}</td>
                                       <td style="text-align: right;">
                            ${monthlyBasic != null
                        ? parseFloat(monthlyBasic).toFixed(2)
                        : (fixedAllowanceMonthly != null
                            ? parseFloat(fixedAllowanceMonthly).toFixed(2)
                            : '0.00')}
                        </td>
                        </tr>`
                ).join(''); // Convert array to string without commas


                // Determine the maximum number of rows between earnings and deductions
                const maxRows = Math.max(allowanceDetails.split('</tr>').length - 1, deductions.split('</tr>').length - 1);

                // Pad smaller list with empty rows (dashes) to equalize the number of rows
                while (allowanceDetails.split('</tr>').length - 1 < maxRows) {
                    allowanceDetails += `
                    <tr>
                        <td style="text-align: left;">-</td>
                        <td style="text-align: right;">-</td>
                        <td style="text-align: right;">-</td>
                    </tr>`;
                }

                while (deductions.split('</tr>').length - 1 < maxRows) {
                    deductions += `
                    <tr>
                        <td style="text-align: left;">-</td>
                        <td style="text-align: right;">-</td>
                    </tr>`;
                }

                // Combine both allowance and deduction rows for the final table
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
                            ${allowanceDetails.split('</tr>').map((allowanceRow, index) => {
                    const deductionRow = deductions.split('</tr>')[index] || `
                                    <tr>
                                        <td style="text-align: left;">-</td>
                                        <td style="text-align: right;">-</td>
                                    </tr>`;
                    return allowanceRow + deductionRow;
                }).join('')}
                        </tbody>
                    </table>
                        `;


                // Use `finalTable` to display the combined rows in your table


                // Use `finalTable` to display the combined rows in your table

                let currency_name;
                let currency_word;
                if (salary_data.currency_id) {
                    let currencyData = await db.currency_convert.findOne({ where: { Currency_Convert_id: salary_data.currency_id } })
                    if (currencyData) {
                        currency_name = currencyData.symbols
                        currency_word = currencyData.word_symbols
                    }else {
                        currency_name = "₹"
                        currency_word = "Rupees"
                    }
                } else {
                    currency_name = "₹"
                    currency_word = "Rupees"
                }

                // return res.send(sala)
                // Calculate totals
                const totalGross = calculateMontlyGross(salary_data)
                totalEarnings = calculateTotalEarnings(salary_data);
                const totalDeductions = calculateTotalDeductions(salary_data);
                netPay = (totalGross+totalEarnings) - totalDeductions;
                total_tax = salary_data.tax_amount;
                const netPayInWords = convertNumberToWords(Math.floor(netPay), currency_word);

                let current_pay_year = attendance_data[0].att_month;
                if(current_pay_year == 12){
                   current_pay_year = attendance_data[0].att_year - 1
                }
                // Populate the final HTML template
                let finalHtml = htmlTemplate
                    .replace('{{employee_code}}', emp_data[0].employee_code || 'NA')
                    .replace('{{company_address}}', company_address || "Janakpuri, New Delhi, India")
                    .replace('{{company_branch}}', company_branch || 'ELITE MINDZ')
                    .replace('{{employee_name}}', `${emp_data[0].first_name} ${emp_data[0].last_name}` || 'NA')
                    .replace('{{emirates_id_number}}', emp_data[0].emirates_id_number || 'NA')
                    .replace('{{sal_month}}', current_month || 'NA')
                    .replace('{{sal_year}}', current_pay_year|| 'NA')
                    .replace('{{pf_account_number}}', emp_data[0].pf_account_number || 'NA')
                    .replace('{{working_days}}', attendance_data[0].working_days)
                    .replace('{{days_paid}}', parseInt(attendance_data[0].total_present_day))
                    .replace('{{ifsc_code}}', emp_data[0].ifsc_code || 'NA')
                    .replace('{{father_name}}', emp_data[0].member_name || 'NA')
                    .replace('{{uan_number}}', emp_data[0].UAN_number || 'NA')
                    .replace('{{esi_number}}', emp_data[0].ESIC_number || 'NA')
                    .replace('{{account_number}}', emp_data[0].account_number || 'NA')
                    .replace('{{pan_number}}', emp_data[0].emp_pan_card || 'NA')
                    .replace('{{dob}}', emp_data[0].date_of_birth || 'NA')
                    .replace('{{aadhar_nuber}}', emp_data[0].emp_adhar_card_number || 'NA')
                    .replace('{{logo}}', company_logo)
                    .replace('{{allowance_details}}', allowances + reimbursements)
                    .replace('{{deduction_details}}', deductions)
                    .replace('{{total_gross_salary}}', totalGross.toFixed(2) || 0)
                    .replace('{{total_earning}}', totalEarnings.toFixed(2) || 0)
                    .replace('{{total_deduction}}', totalDeductions.toFixed(2) || 0)
                    .replace('{{net_pay}}', Math.max(0, parseInt(netPay) || 0).toFixed(2))
                    .replace('{{net_pay_in_words}}', netPayInWords || 'NA')
                    .replace('{{currency_name}}', currency_name || '₹');


                    const browser = await puppeteer.launch({
                        headless: true,  
                        args: ['--no-sandbox', '--disable-setuid-sandbox']
                    });
                    const page = await browser.newPage();
                await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
                const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
                await browser.close();

                pdfFilename = `${cur_date}_Ind_Salary-Slip_${employee.employee_id}.pdf`;
                const pdfPath = path.join(pdfDir, pdfFilename);
                fs.writeFileSync(pdfPath, pdfBuffer);

                await db.payroll_payslip.update(
                    { pay_slip_status: "INACTIVE" },
                    { where: { employee_id: employee.employee_id, entity_id, pay_slip_month: att_month, pay_slip_year: att_year } }
                );

                await db.payroll_payslip.create({
                    employee_id: employee.employee_id,
                    entity_id,
                    salary_data: salary_data,
                    tax_amount: total_tax,
                    pay_slip_year: att_year,
                    pay_slip_month: att_month,
                    recieve_amount: netPay,
                    gross_salary: totalEarnings,
                    pay_slip_status: "PROCESSED",
                    pay_slip_doc: pdfFilename,
                    process_id: pay_process.id
                });

                return { employee_id: employee.employee_id, status: 'success' };

            } catch (error) {
                return { employee_id: employee.employee_id, status: 'failed', error: error.message };
            }
        };

        const processInBatches = async (items, batchSize) => {
            const results = [];
            for (let i = 0; i < items.length; i += batchSize) {
                const batch = items.slice(i, i + batchSize);
                results.push(...await Promise.all(batch.map(processEmployee)));
            }
            return results;
        };

        const finalResults = await processInBatches(employee_list, BATCH_SIZE);
        return res.status(200).send({ code: 200, message: 'Salary slips generated successfully', results: finalResults });

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
        const { employee_id, pay_slip_month } = req.query;
        
        const current_year = new Date().getFullYear();

        const salary_slip = await db.payroll_payslip.findOne({
            where: { employee_id, pay_slip_month, pay_slip_year: current_year, status: "ACTIVE", pay_slip_status: "PROCESSED" }
        });
        if (!salary_slip) {
            return res.status(404).send({ message: "Salary Slip not found." });
        }
        let filePath = path.join(__dirname, '../../../../generated_payslip/', salary_slip.pay_slip_doc);



        res.download(filePath, (err) => {
            if (err) {
                return res.status(500).send({ message: "Could not download the file. " + err });
            }
        });
    } catch (error) {

        res.status(500).send({ message: "An error occurred. " + error });
    }
};


exports.download_allsalary_slips_zip = async (req, res) => {
    try {
        const { employee_id, pay_slip_month , financial_year_id} = req.query;
        const fy_detail = await db.financial_year.findOne({
            where: { id: financial_year_id, status: "ACTIVE", isDeleted: false }
        });
        if (!fy_detail) {
            return res.status(404).send({ code: 404, message: 'Financial year not found' });
        }
        
        const current_year = fy_detail.financial_year;
        // const current_year = new Date().getFullYear();

        if (!employee_id || !pay_slip_month) {
            return res.status(400).send({ message: "employee_id and pay_slip_month are required." });
        }

        // Ensure employee_id is converted into an array of numbers
        const employeeIds = Array.isArray(employee_id) ? employee_id.map(Number) : employee_id.split(',').map(id => parseInt(id.trim(), 10));

        // Fetch salary slips
        const salary_slips = await db.payroll_payslip.findAll({
            where: {
                employee_id: employeeIds,
                pay_slip_month,
                pay_slip_year: current_year,
                status: "ACTIVE",
                pay_slip_status: "PROCESSED",
            }
        });

        if (!salary_slips || salary_slips.length === 0) {
            return res.status(404).send({ message: "No Salary Slips found." });
        }

        // Prepare file paths
        const filePaths = salary_slips.map(slip =>
            path.resolve(__dirname, '../../../../generated_payslip/', slip.pay_slip_doc)
        );

        // Ensure the folder for ZIP exists inside the app folder
        const appFolder = path.resolve(__dirname, '../app/downloads');
        if (!fs.existsSync(appFolder)) {
            fs.mkdirSync(appFolder, { recursive: true });
        }

        // Define ZIP file path
        const zipFileName = `Salary_Slips_${pay_slip_month}_${current_year}.zip`;
        const zipFilePath = path.join(appFolder, zipFileName);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        // Setup event listeners
        output.on('close', () => {
            res.download(zipFilePath, (err) => {
                if (err) {
                    return res.status(500).send({ message: "Could not download the file. " + err });
                }

                // Clean up the ZIP file after download
                if (fs.existsSync(zipFilePath)) {
                    fs.unlinkSync(zipFilePath);
                }
            });
        });

        archive.on('error', (err) => {
            return res.status(500).send({ message: "Error creating ZIP file. " + err });
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Add files to the ZIP
        filePaths.forEach(filePath => {
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

        const emp_data = await db.user.findOne({
            where: {
                employee_id,
                primary_entity_id: entity_id,
                status: "ACTIVE",
                isDeleted: false
            },
            attributes: [
                "employee_id", "title", "first_name", "last_name",
                "employee_photo", "employee_code", "date_of_birth",
                "parmanent_address", "contact_number", "start_working_date",
                "basic_salary", "employee_official_email"
            ],
            include: {
                model: db.bank_master,
                required: false,
                where: { status: "ACTIVE", isDeleted: false },
                attributes: ["bank_name", "bank_code"]
            }
        }, { transaction });

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
                    replacements: { employee_id, entity_id, current_year: new Date().getFullYear(), att_month },
                    type: db.sequelize.QueryTypes.SELECT
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
                    type: db.sequelize.QueryTypes.SELECT
                }
            ),
            db.sequelize.query(`
                SELECT COUNT(UF.relation) as no_of_dependencies 
                FROM HRMS_REGISTERED_USER_FAMILY AS UF
                WHERE UF.employee_id = :employee_id AND UF.status = "ACTIVE" AND (UF.relation = 'Son' OR UF.relation = 'Daughter');
            `, {
                replacements: { employee_id },
                type: db.sequelize.QueryTypes.SELECT
            })
        ]);

        if (!salary_details.length) {
            await transaction.rollback();
            return res.status(404).send({ employee_id, status: 'failed', error: 'No salary details found' });
        }

        const tax_slab_data = await db.sequelize.query(
            `SELECT * FROM HRMS_PAYROLL_TAX_SLAB AS TS
            WHERE TS.financial_year_id = :financial_year_id AND TS.entity_id = :entity_id 
            AND :gross_salary BETWEEN TS.min_salary AND TS.max_salary
            ORDER BY TS.id ASC LIMIT 1`,
            {
                replacements: { financial_year_id, entity_id, gross_salary: salary_details[0]?.gross_salary || 0 },
                type: db.sequelize.QueryTypes.SELECT,
                transaction
            }
        );

        if (!tax_slab_data.length) {
            await transaction.rollback();
            return res.status(404).send({ employee_id, status: 'failed', error: 'No tax slab found' });
        }

        const details = salary_details[0];
        const { monthly_base_salary: emp_base_salary, gross_salary, income_tax: total_tax, soc_secur_tax, final_tax, recieve_amount } = details;

        const total_allowance = allowances.reduce((sum, a) => sum + a.allowance_amount, 0);
        const tot_taxable_allowance = allowances.reduce((sum, a) => sum + (a.amount_type === "TAXABLE" ? a.allowance_amount : 0), 0);

        const dependencies = family_members[0]?.no_of_dependencies || 0;
        const slab = tax_slab_data[0];
        const amountKey = `d${Math.max(dependencies - 1, 0)}_ts_amount`;
        const dependency_Amount = slab[amountKey] || 0;

        emp_data.dataValues = {
            ...emp_data.dataValues, allowance_detail: allowances, no_of_dependency: dependencies, emp_base_salary, total_allowance, gross_salary, min_salary: slab.min_salary, dependency_Amount, coefficient: slab.coefficient, total_tax, tot_taxable_allowance, soc_secur_tax, final_tax, recieve_amount
        };

        await transaction.commit();
        return res.status(200).send({ code: 200, message: "Employee detail retrieved successfully", data: emp_data });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.salary_process_list = async (req, res) => {
    try {
        const { entity_id, financial_year_id } = req.query;
        const cur_year = await db.financial_year.findOne({ where: { id: financial_year_id, status: "ACTIVE", isDeleted: false } });
        const process_list = await db.sequelize.query(
            `SELECT DISTINCT(PP.id),PP.process_id,PP.pay_slip_month,PP.pay_slip_year,PP.payroll_status,COUNT(DISTINCT PS.id) AS no_of_employee FROM HRMS_PAYROLL_PROCESS AS PP
            LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS ON PS.process_id = PP.id
            WHERE PP.entity_id = :entity_id AND PP.isDeleted = 0 AND PP.status = 'ACTIVE' GROUP BY PP.id, PP.pay_slip_month, PP.pay_slip_year, PP.payroll_status ORDER BY PP.id DESC`,
            {
                replacements: {
                    entity_id, current_year: cur_year.financial_year
                },
                type: db.sequelize.QueryTypes.SELECT
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

        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}

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
                AND PS.status = 'ACTIVE'`,
            {
                replacements: {
                    process_id
                },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (employee_list.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Get Employee List Successfully!",
                data: employee_list
            });
        } else {
            return res.status(404).send({
                code: 403,
                message: "No Employee found"
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error"
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
                        LEFT JOIN MASTER_BANK bm ON u.bank_id = bm.id AND bm.isDeleted = false
                        LEFT JOIN HRMS_REGISTERED_USER_FAMILY uf ON u.employee_id = uf.employee_id AND uf.relation = 'Father'
                        WHERE u.employee_id = :employee_id AND u.primary_entity_id = :entity_id AND u.status = 'ACTIVE' AND u.isDeleted = false`,
                        { replacements: { employee_id: employee, entity_id }, type: db.sequelize.QueryTypes.SELECT }
                    ),
                    db.sequelize.query(
                        `SELECT MT.* FROM HRMS_PAYROLL_MONTH_ATTENDANCE MT 
                        WHERE MT.employee_id = :employee_id AND MT.entity_id = :entity_id 
                        AND MT.att_year = :current_year AND MT.att_month = :att_month`,
                        { replacements: { employee_id: employee, entity_id, current_year, att_month }, type: db.sequelize.QueryTypes.SELECT }
                    )
                ]);
                return {
                    employee_id: employee.employee_id,
                    emp_data: {
                        ...emp_data[0], // Spread emp_data[0] properties
                        attendance_data: attendance_data[0] || {} // Add attendance_data as a nested key
                    }
                };
            } catch (error) {
                // Return default structure if any error occurs
                return {
                    employee_id: employee.employee_id,
                    emp_data: {
                        ...emp_data[0], // Spread emp_data[0] properties if available
                        attendance_data: attendance_data[0] || {} // Add attendance_data as a nested key
                    }
                };
            }
        };

        // Process employees in batches
        const processInBatches = async (items, batchSize) => {
            const results = [];
            for (let i = 0; i < items.length; i += batchSize) {
                const batchResults = await Promise.all(items.slice(i, i + batchSize).map(processEmployee));
                results.push(...batchResults);
            }
            return results;
        };

        // Execute batch processing
        const finalResults = await processInBatches(employee_list, BATCH_SIZE);
        return res.status(200).send({
            code: 200,
            message: 'Downloaded salary data successfully',
            results: finalResults
        });
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};






function calculateTotalGross(salary_data) {
    return salary_data.earningComponentList.reduce((total, component) => {
        const salaryAmt = parseFloat(component.salary_amt) || 0;
        return total + salaryAmt;
    }, 0);
}


function calculateMontlyGross(salary_data) {
    const allowanceTotal = salary_data.earningComponentList.reduce((total, component) => {
        const salaryAmt = parseFloat(component.monthlyBasic || component.fixedAllowanceMonthly) || 0;
        return total + salaryAmt;
    }, 0);

    const reimbursementTotal = salary_data.reiembursementComponentList.reduce((total, component) => {
        const salaryAmt = parseFloat(component.fixedAllowanceMonthly) || 0;
        return total + salaryAmt;
    }, 0);

    return allowanceTotal + reimbursementTotal;
}


function calculateTotalEarnings(salary_data) {
    const allowanceTotal = salary_data.earningComponentList.reduce((total, component) => {
        const salaryAmt = parseFloat(component.salary_amt) || 0;
        return total + salaryAmt;
    }, 0);

    const reimbursementTotal = salary_data.reiembursementComponentList.reduce((total, component) => {
        const salaryAmt = parseFloat(component.fixedAllowanceMonthly) || 0;
        return total + salaryAmt;
    }, 0);

    return allowanceTotal + reimbursementTotal;
}


function calculateTotalDeductions(salary_data) {
    const normalDeduction = salary_data.deductionComponentList.reduce((total, component) => {
        const salaryAmt = parseFloat(component.monthlyBasic) || 0;
        return total + salaryAmt;
    }, 0);
    const fixedDeduction = salary_data.deductionComponentList.reduce((total, component) => {
        const salaryAmt = parseFloat(component.fixedAllowanceMonthly) || 0;
        return total + salaryAmt;
    }, 0);

    const taxDeduction = parseFloat(salary_data.tax_amount) || 0; // Ensure tax_amount is a number or 0 if undefined/null

    return normalDeduction + taxDeduction + fixedDeduction;
}


function convertNumberToWords(num, currency_word) {
    const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const twoDigits = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const placeValues = ["", "Thousand", "Lakh", "Crore"];

    num = parseInt(num);
    
    // Handle negative or invalid input
    if (num < 0 || isNaN(num)) {
        num = 0;
    }

    if (num === 0) return `Zero ${currency_word} Only`;

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
        let divisor = group === 1 ? 100 : 1000; // Thousand is handled separately (2 digits)
        const part = num % divisor;

        if (part > 0) {
            words = numToWords(part, placeValues[group]) + " " + words;
        }

        num = Math.floor(num / divisor);
        group++;
    }

    return words.trim() + ` ${currency_word} Only`;
}
