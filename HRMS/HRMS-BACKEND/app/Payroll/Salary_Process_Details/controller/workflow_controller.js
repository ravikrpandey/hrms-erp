const db = require("../../../models/index");


exports.payroll_bulk_approval_request = async (req, res) => {
    try {
        let { approval_data } = req.body; // if approval_data = [1,2,3,5,9,8,6]
        console.log(req.body)
        for (let i = 0; i < approval_data.length; i++) {
            let approval_id = approval_data[i].id;

            await db.payroll_payslip.update({
                approval_status: "PENDING"
            }, { where: { id: approval_id } });
        }

        return res.status(200).send({ code: 200, message: "Approval Request Sent Successfully" });
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message || "Server Error" });
    }
};



exports.approval_salary_process_list = async (req, res) => {
    try {
        const { entity_id, financial_year_id } = req.query;

        const cur_year = await db.financial_year.findOne({
            where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
        });

        if (!cur_year) {
            return res.status(404).send({
                code: 404,
                message: "Financial year not found or inactive",
            });
        }

        const process_list = await db.sequelize.query(
            `SELECT DISTINCT PP.id, 
                    PP.process_id, 
                    PP.pay_slip_month, 
                    PP.pay_slip_year, 
                    PP.payroll_status,
                    COUNT(DISTINCT PS.id) AS no_of_employee 
             FROM HRMS_PAYROLL_PROCESS AS PP
             LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS 
                ON PS.process_id = PP.id AND PS.approval_status = 'PENDING'
             WHERE PP.entity_id = :entity_id 
               AND PP.isDeleted = 0 
               AND PP.status = 'ACTIVE' 
             GROUP BY PP.id, PP.pay_slip_month, PP.pay_slip_year, PP.payroll_status 
             ORDER BY PP.id DESC`,
            {
                replacements: { entity_id },
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
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};




exports.approval_employee_list_BYprocessID = async (req, res) => {
    try {
        const process_id = req.params.id;
        const employee_list = await db.sequelize.query(
            `SELECT U.employee_id,U.employee_official_email,U.employee_code,U.basic_salary,U.country_code,U.first_name,U.last_name,U.contact_number,D.designation_name,PS.* FROM HRMS_PAYROLL_PAY_SLIPS AS PS
            LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = PS.employee_id 
            LEFT JOIN DESIGNATION AS D ON D.designation_id = U.designation_id 
            WHERE PS.process_id = :process_id AND PS.isDeleted = 0 AND PS.status = 'ACTIVE' AND PS.approval_status = 'PENDING'`,
            {
                replacements: {
                    process_id
                },
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        if (employee_list.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Employee List Successfully!", data: employee_list });
        } else {
            return res.status(404).send({ code: 403, message: "No Employee found" });
        }
    } catch (error) {

        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}




// exports.payroll_approval_status = async (req, res) => {
//     try {
//         let { approval_data, remarks, status } = req.body; // if approval_data = [1,2,3,5,9,8,6]
//         console.log(req.body)
//         for (let i = 0; i < approval_data.length; i++) {
//             let approval_id = approval_data[i].id;

//             if (status == "APPROVED") {
//                 await db.payroll_payslip.update({
//                     approval_status: status,
//                     remarks: remarks
//                 }, { where: { id: approval_id } });
//             }

//             else if(status == "REJECTED") {

//                 await db.payroll_payslip.delete({
//                     where: {
//                             id: approval_id,
//                     }
//                 })


//             }
//         }
//         return res.status(200).send({ code: 200, message: "Approval Request Sent Successfully" });
//     } catch (error) {
//         return res.status(500).json({ code: 500, message: error.message || "Server Error" });
//     }
// };




exports.payroll_approval_status = async (req, res) => {
    try {
        let { approval_data, remarks, status, login_id } = req.body; // approval_data = [{ id: 1 }, { id: 2 }, ...]
        console.log(req.body);

        // return res.send(req.body)
        for (let i = 0; i < approval_data.length; i++) {
            let approval_id = approval_data[i].id;

            if (status === "APPROVED") {
                await db.payroll_payslip.update(
                    {
                        approval_status: status,
                        remark: remarks,
                        approval_login_id: login_id,
                    },
                    {
                        where: { id: approval_id },
                    }
                );
            } else if (status === "REJECTED") {
                const payslip = await db.payroll_payslip.findOne({
                    where: { id: approval_id },
                    attributes: ["process_id"],
                });

                if (payslip) {
                    await db.payroll_payslip.update(
                        {
                            pay_slip_status: 'INACTIVE',
                            remark: remarks,
                            approval_status: status,
                            rejected_login_id: login_id,
                        },
                        { where: { id: approval_id } });

                    const remainingPayslips = await db.payroll_payslip.count({
                        where: { process_id: payslip.process_id },
                    });

                    if (remainingPayslips === 0) {
                        await db.payroll_process.update(
                            {
                                payroll_status: 'INACTIVE',
                                status: 'INACTIVE',
                                isDeleted: true,
                            }, {
                            where: { process_id: payslip.process_id },
                        });
                    }
                }
            }
        }

        return res
            .status(200)
            .send({ code: 200, message: "Approval Request Processed Successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ code: 500, message: error.message || "Server Error" });
    }
};



exports.approved_emp_list_BYprocessID = async (req, res) => {
    try {
        const process_id = req.params.id;
        let employee_list = await db.sequelize.query(
            `SELECT U.employee_id,U.employee_official_email,U.employee_code,U.basic_salary,U.country_code,U.first_name,U.last_name,U.contact_number,D.designation_name,PS.* FROM HRMS_PAYROLL_PAY_SLIPS AS PS
            LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = PS.employee_id 
            LEFT JOIN DESIGNATION AS D ON D.designation_id = U.designation_id 
            WHERE PS.process_id = :process_id AND PS.isDeleted = 0 AND PS.status = 'ACTIVE' AND PS.approval_status IN ('APPROVED', 'CLOSED')`,
            {
                replacements: {
                    process_id
                },
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        if (employee_list.length > 0) {
            let approved_salary = true
            employee_list = employee_list.map(item => ({
                ...item,
                approved_salary
            }));
            return res.status(200).send({ code: 200, message: "Get Employee List Successfully!", data: employee_list });
        } else {
            return res.status(404).send({ code: 403, message: "No Employee found" });
        }
    } catch (error) {

        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}


exports.approved_salary_processList = async (req, res) => {
    try {
        const { entity_id, financial_year_id } = req.query;

        const cur_year = await db.financial_year.findOne({
            where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
        });

        if (!cur_year) {
            return res.status(404).send({
                code: 404,
                message: "Financial year not found or inactive",
            });
        }

        const process_list = await db.sequelize.query(
            `SELECT 
                    PP.id, 
                    PP.process_id, 
                    PP.pay_slip_month, 
                    PP.pay_slip_year, 
                    PP.payroll_status, 
                    PS.approval_status, 
                    COUNT(DISTINCT PS.id) AS no_of_employee 
                FROM HRMS_PAYROLL_PROCESS AS PP
                LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS 
                    ON PS.process_id = PP.id 
                        AND PS.approval_status IN ('APPROVED', 'CLOSED')
                WHERE PP.entity_id = :entity_id 
                AND PP.isDeleted = 0 
                AND PP.status = 'ACTIVE'
                GROUP BY PP.id, 
                        PP.process_id, 
                        PP.pay_slip_month, 
                        PP.pay_slip_year, 
                        PP.payroll_status, 
                        PS.approval_status
                ORDER BY PP.id DESC`,
            {
                replacements: { entity_id },
                type: db.sequelize.QueryTypes.SELECT,
            }
        );

        let filtered_process_list = process_list.filter(
            (process) => process.no_of_employee > 0
        );

        let process_status = "salary_approved";

        if (filtered_process_list.length > 0) {
            // Update the process status for each item in the list
            filtered_process_list = filtered_process_list.map(item => ({
                ...item,
                process_status
            }));

            return res.status(200).send({
                code: 200,
                message: "Process list retrieved successfully!",
                data: filtered_process_list
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No process list found with employees."
            });
        }

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};


exports.get_login_employee_list = async (req, res) => {
    try {
        let { entity_id, pay_slip_month, current_year, branchId, login_id } = req.query;

        const mon_name = [
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
            "December"
        ];


        if (!current_year || current_year === 'undefined') {
            current_year = new Date().getFullYear();
        }

        // Base SQL query with conditional filtering for approval_status
        let sqlQuery = `
            SELECT U.employee_id, U.employee_official_email, U.employee_code, U.basic_salary, U.country_code, 
                   U.first_name, U.last_name, U.primary_branch_id, U.contact_number, D.designation_name, 
                   PS.pay_slip_status, PS.pay_slip_month, PS.approval_status
            FROM HRMS_REGISTERED_USER AS U
            LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS ON U.employee_id = PS.employee_id 
                  AND PS.entity_id = :entity_id 
                  AND PS.pay_slip_year = :current_year 
                  AND PS.pay_slip_month = :pay_slip_month
                  AND PS.createdAt = (SELECT MAX(createdAt)
                    FROM HRMS_PAYROLL_PAY_SLIPS
                    WHERE employee_id = U.employee_id
                    AND entity_id = :entity_id
                    AND pay_slip_year = :current_year
                    AND pay_slip_month = :pay_slip_month
   )
                 
            LEFT JOIN DESIGNATION AS D ON D.designation_id = U.designation_id 
            WHERE U.primary_entity_id = :entity_id 
              AND U.isDeleted = 0 
              AND U.status = 'ACTIVE'
              
        `;

        // Append conditions for login_id or branchId
        if (login_id && login_id !== 'undefined') {
            sqlQuery += ` AND U.employee_id = :login_id`;
        }

        if (branchId && branchId !== 'undefined') {
            sqlQuery += ` AND U.primary_branch_id = :branchId`;
        }

        const employee_data = await db.sequelize.query(sqlQuery, {
            replacements: {
                entity_id,
                current_year,
                pay_slip_month,
                branchId,
                login_id
            },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (employee_data.length > 0 && employee_data[0].approval_status == 'CLOSED') {
            let pay_month = mon_name[pay_slip_month - 1];
            let approved_salary = true
            employee_data[0].pay_month = pay_month
            employee_data[0].approved_salary = approved_salary;
            return res.status(200).send({ code: 200, message: "Employee data fetched successfully!", data: employee_data[0] });
        } else {
            return res.status(404).send({ code: 403, message: "No Employee found" });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};


exports.approved_loginEmp_list_BYprocessID = async (req, res) => {
    try {
        const process_id = req.params.id;
        const { login_id } = req.query;
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
                    WHERE PS.process_id = :process_id 
                    AND PS.isDeleted = 0 
                    AND PS.status = 'ACTIVE' 
                    AND PS.approval_status IN ('APPROVED', 'CLOSED') 
                    AND PS.approval_login_id = :login_id`,
            {
                replacements: {
                    process_id, login_id
                },
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        if (employee_list.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Employee List Successfully!", data: employee_list });
        } else {
            return res.status(404).send({ code: 403, message: "No Employee found" });
        }
    } catch (error) {

        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}


exports.approved_loginSalary_processList = async (req, res) => {
    try {
        const { entity_id, financial_year_id, login_id } = req.query;

        const cur_year = await db.financial_year.findOne({
            where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
        });

        if (!cur_year) {
            return res.status(404).send({
                code: 404,
                message: "Financial year not found or inactive",
            });
        }

        const process_list = await db.sequelize.query(
            `SELECT DISTINCT 
       PP.id, 
       PP.process_id, 
       PP.pay_slip_month, 
       PP.pay_slip_year, 
       PP.payroll_status, 
       PS.approval_status, 
       COUNT(DISTINCT PS.id) AS no_of_employee 
FROM HRMS_PAYROLL_PROCESS AS PP
LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS 
       ON PS.process_id = PP.id 
          AND PS.approval_status IN ('APPROVED', 'CLOSED') 
          AND PS.approval_login_id = :login_id
WHERE PP.entity_id = :entity_id 
  AND PP.isDeleted = 0 
  AND PP.status = 'ACTIVE'
GROUP BY PP.id, 
         PP.process_id, 
         PP.pay_slip_month, 
         PP.pay_slip_year, 
         PP.payroll_status, 
         PS.approval_status
ORDER BY PP.id DESC`,
            {
                replacements: { entity_id, login_id },
                type: db.sequelize.QueryTypes.SELECT,
            }
        );

        let filtered_process_list = process_list.filter(
            (process) => process.no_of_employee > 0
        );

        let process_status = "salary_approved";

        if (filtered_process_list.length > 0) {
            // Update the process status for each item in the list
            filtered_process_list = filtered_process_list.map(item => ({
                ...item,
                process_status
            }));

            return res.status(200).send({
                code: 200,
                message: "Approved list retrieved successfully!",
                data: filtered_process_list
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No process list found with employees."
            });
        }

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};


exports.rejected_loginSalary_processList = async (req, res) => {
    try {
        const { entity_id, financial_year_id, login_id } = req.query;

        const cur_year = await db.financial_year.findOne({
            where: { id: financial_year_id, status: "ACTIVE", isDeleted: false },
        });

        if (!cur_year) {
            return res.status(404).send({
                code: 404,
                message: "Financial year not found or inactive",
            });
        }

        const process_list = await db.sequelize.query(
            `SELECT DISTINCT PP.id, 
                    PP.process_id, 
                    PP.pay_slip_month, 
                    PP.pay_slip_year, 
                    PP.payroll_status, 
                    PS.approval_status, 
                    COUNT(DISTINCT PS.id) AS no_of_employee 
             FROM HRMS_PAYROLL_PROCESS AS PP
             LEFT JOIN HRMS_PAYROLL_PAY_SLIPS AS PS 
                ON PS.process_id = PP.id AND PS.approval_status = 'REJECTED' AND PS.rejected_login_id = :login_id
             WHERE PP.entity_id = :entity_id 
               AND PP.isDeleted = 0 
               AND PP.status = 'ACTIVE' 
             GROUP BY PP.id, PP.pay_slip_month, PP.pay_slip_year, PP.payroll_status 
             ORDER BY PP.id DESC`,
            {
                replacements: { entity_id, login_id },
                type: db.sequelize.QueryTypes.SELECT,
            }
        );

        let filtered_process_list = process_list.filter(
            (process) => process.no_of_employee > 0
        );

        let process_status = "salary_rejected";

        if (filtered_process_list.length > 0) {
            // Update the process status for each item in the list
            filtered_process_list = filtered_process_list.map(item => ({
                ...item,
                process_status
            }));

            return res.status(200).send({
                code: 200,
                message: "Rejected list retrieved successfully!",
                data: filtered_process_list
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No process list found with employees."
            });
        }

    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Internal Server Error",
        });
    }
};


exports.rejected_employeeList_BY_processID = async (req, res) => {
    try {
        const process_id = req.params.id;
        const { login_id } = req.query;
        const employee_list = await db.sequelize.query(
            `SELECT U.employee_id,U.employee_official_email,U.employee_code,U.basic_salary,U.country_code,U.first_name,U.last_name,U.contact_number,D.designation_name,PS.* FROM HRMS_PAYROLL_PAY_SLIPS AS PS
            LEFT JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = PS.employee_id 
            LEFT JOIN DESIGNATION AS D ON D.designation_id = U.designation_id 
            WHERE PS.process_id = :process_id AND PS.isDeleted = 0 AND PS.status = 'ACTIVE' AND PS.approval_status = 'REJECTED' AND PS.rejected_login_id = :login_id`,
            {
                replacements: {
                    process_id, login_id
                },
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        if (employee_list.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Employee List Successfully!", data: employee_list });
        } else {
            return res.status(404).send({ code: 403, message: "No Employee found" });
        }
    } catch (error) {

        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
}


exports.payroll_approval_closed_status = async (req, res) => {
    try {
        let { approval_data, remarks, status, login_id } = req.body; // approval_data = [{ id: 1 }, { id: 2 }, ...]

        // return res.send(req.body)
        for (let i = 0; i < approval_data.length; i++) {
            let approval_id = approval_data[i].id;

            if (status === "CLOSED") {
                await db.payroll_payslip.update(
                    {
                        approval_status: status,
                        closed_remark: remarks,
                        closed_login_id: login_id,
                    },
                    {
                        where: { id: approval_id },
                    }
                );
            }

        }
        return res
            .status(200)
            .send({ code: 200, message: "Processed Salary Closed Successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ code: 500, message: error.message || "Server Error" });
    }
};