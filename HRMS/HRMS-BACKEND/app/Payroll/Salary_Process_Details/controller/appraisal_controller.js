const db = require("../../../models/index");
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');


exports.getall_employee_for_appraisal = async (req, res) => {
    try {
        let { entity_id, financial_year_id, dept_id } = req.body;

        // Check if dept_id is undefined or null and adjust query accordingly
        let sqlQuery = `
            SELECT 
                 U.employee_id, 
                 U.employee_official_email, 
                 U.employee_code, 
                 U.basic_salary, 
                 U.country_code, 
                 U.first_name, 
                 U.last_name, 
                 U.primary_branch_id, 
                 U.contact_number, 
                 D.designation_name, 
                 HEPS.monthly_ctc,
                 HEPS.ctc,
                 HEPS.id AS salary_template_id,
                 MD.department_name,
                 (
                     SELECT PRD.increment_date
                     FROM HRMS_PAYROLL_APPRAISAL_DETAILS AS PRD
                     WHERE PRD.employee_id = U.employee_id
                     ORDER BY 
                         CASE 
                             WHEN PRD.increment_date IS NOT NULL THEN 0 
                             ELSE 1 
                         END, -- Prioritize non-null increment dates
                         PRD.increment_date DESC, -- Latest increment_date
                         PRD.id DESC -- Break ties using primary_key
                     LIMIT 1
                 ) AS last_increment_date,
                   (
                     SELECT PRD.final_status
                     FROM HRMS_PAYROLL_APPRAISAL_DETAILS AS PRD
                     WHERE PRD.employee_id = U.employee_id
                     ORDER BY PRD.id DESC 
                     LIMIT 1
                 ) AS final_status
             FROM HRMS_REGISTERED_USER AS U
             LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY AS HEPS ON U.employee_id = HEPS.employee_id 
                 AND HEPS.g_pay = false 
                -- AND HEPS.financial_year_id = :financial_year_id
             LEFT JOIN MASTER_DEPARTMENT AS MD ON MD.dept_id = U.department_id
             LEFT JOIN DESIGNATION AS D ON D.designation_id = U.designation_id
             WHERE U.primary_entity_id = :entity_id 
                 AND U.isDeleted = 0 
                 AND U.status = 'ACTIVE'
                 ${dept_id ? 'AND U.department_id = :dept_id' : ''}
                -- AND HEPS.id IS NOT NULL`;

        const employee_list = await db.sequelize.query(sqlQuery, {
            replacements: {
                entity_id,
                financial_year_id,
                dept_id: dept_id || null // Pass null if dept_id is not provided
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







exports.send_appraisal_approval = async (req, res) => {
    try {
        const { employee_id, workflow_type, login_id, entity_id, financial_year_id, salary_type, appraisal_type, appraisal_mode, appraisal_comp_type, appraisal_percentage, appraisal_amount }
            = req.body;
        // return res.end

        const getData = await db.WorkFlow_Master.findAll({
            where: {
                entity_id: entity_id,
                job_name: workflow_type,
            }
        });

        if (!getData || getData.length === 0) {
            return res.status(500).send({
                code: 500,
                message: "Workflow is not created for required Payroll!"
            });
        }

        for (const employee of employee_id) {

            // check appraisal
            let existAppraisal = await db.appraisalDuration.findAll({ where: { status: 'ACTIVE', isDeleted: false } })
            if (existAppraisal) {
                let isExistPayroll = await db.payroll_pay_salary.findOne({ where: { employee_id: employee.employee_id, g_pay : false } })
                if (isExistPayroll) {
                    let start_date = isExistPayroll.createdAt
                    console.log(start_date)
                    let last_increment_date = employee.last_increment_date
                    await checkProbationPeriod(existAppraisal, start_date, last_increment_date);
                }
            }

            const appraisalDetails = await db.payroll_Appraisal_Details.create({
                employee_id: employee.employee_id,
                entity_id: entity_id,
                financial_year_id: financial_year_id,
                salary_template_id: employee.salary_template_id,
                salary_type: salary_type,
                created_by: login_id,
                appraisal_type: appraisal_type,
                appraisal_mode: appraisal_mode,
                appraisal_comp_type: appraisal_comp_type,
                appraisal_percentage: appraisal_percentage,
                appraisal_amount: appraisal_amount,
            });

            const getLevels = await db.Work_Flow_range.findAll({
                where: {
                    workflow_id: getData[0].id,
                    status: "ACTIVE"
                },
                attributes: ["level", "employee_id", "role_id", "workflow_id"]
            });

            for (const level of getLevels) {
                await db.payroll_Appraisal_Approval.create({
                    level: level.level,
                    workflow_id: level.workflow_id,
                    role_id: level.role_id,
                    employee_id: level.employee_id,
                    payrollDetails_id: appraisalDetails.id
                });
            }
        }

        return res.status(200).send({ code: 200, message: "Appraisal and Approval processed successfully for all employees!" });
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_all_sendAppraisal_request = async (req, res) => {
    try {
        const { employee_id, entity_id, employee_role, financial_year_id } = req.body;
        let payroll_details;

        if (employee_role == 'Super Admin') {
            payroll_details = await db.sequelize.query(
                `SELECT DISTINCT PR.id,PR.employee_id, 
                  PR.entity_id,PR.financial_year_id,HRU.employee_code, HEPS.ctc, PR.increment_date, HRU.employee_official_email,HRU.contact_number, UD.designation_name,HRU.first_name, HRU.last_name,PR.final_status
                  FROM HRMS_PAYROLL_APPRAISAL_DETAILS AS PR
                  INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = PR.employee_id
                   LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY AS HEPS ON HEPS.employee_id = HRU.employee_id 
                 AND HEPS.id = PR.salary_template_id
                 -- AND HEPS.financial_year_id = :financial_year_id
                  LEFT JOIN DESIGNATION AS UD ON UD.designation_id = HRU.designation_id
                WHERE PR.entity_id = :entity_id AND PR.financial_year_id = :financial_year_id
                ORDER BY PR.id DESC`,
                {
                    replacements: { entity_id, financial_year_id },
                    type: db.sequelize.QueryTypes.SELECT
                }
            );
        } else {
            payroll_details = await db.sequelize.query(
                `SELECT DISTINCT 
                    PR.id, 
                    PR.employee_id, 
                    PR.entity_id, 
                    PR.financial_year_id, 
                    HRU.employee_code, 
                    HEPS.ctc, 
                    PR.increment_date,
                    HRU.employee_official_email, 
                    HRU.contact_number, 
                    UD.designation_name, 
                    HRU.first_name, 
                    HRU.last_name, 
                    PR.final_status
                FROM HRMS_PAYROLL_APPRAISAL_DETAILS PR
                INNER JOIN HRMS_REGISTERED_USER HRU ON HRU.employee_id = PR.employee_id
                LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY HEPS ON HEPS.employee_id = HRU.employee_id 
                    AND HEPS.id = PR.salary_template_id AND HEPS.financial_year_id = :financial_year_id
                LEFT JOIN DESIGNATION UD ON UD.designation_id = HRU.designation_id
                WHERE PR.created_by = :employee_id AND  PR.entity_id =:entity_id AND PR.financial_year_id = :financial_year_id
                ORDER BY  PR.id DESC;
                `,
                {
                    replacements: { employee_id, entity_id, financial_year_id },
                    type: db.sequelize.QueryTypes.SELECT
                }
            );
        }

        if (payroll_details.length > 0) {
            return res.status(200).send({ code: 200, message: "Payroll Details found", data: payroll_details });
        } else {
            return res.status(404).send({ code: 404, message: "No Data Found!", data: [] });
        }

    } catch (error) {
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


// exports.getAll_Approval_level_appraisal = async (req, res) => {
//     try {
//         const pr_id = req.params.pr_id;
//         const { workflow_type } = req.body;

//         const getData = await db.procurement_approval.findAll({
//             where: {
//                 purchase_request_id: pr_id,
//                 workflow_type
//             },
//             attributes: ["approvel_status", "level", "employee_id", "department_id", "remark", "workflow_type", "role_id"],
//         });

//         if (!getData || getData.length === 0) {
//             return res.status(400).send({ code: 400, message: "Data not found" });
//         }

//         if (dep_id) {
//             getData.forEach(levelInfo => {
//                 levelInfo.department_id = dep_id;
//                 levelInfo.workflow_type = req.body.workflow_type
//             });
//         }

//         const levelsWithNames = [];
//         for (const levelInfo of getData) {
//             const employeeInfo = await userdetail.findOne({
//                 where: {
//                     employee_id: levelInfo.employee_id,
//                 },
//                 attributes: ["first_name", "last_name"],
//             });

//             if (!employeeInfo) {
//                 return res.status(400).send({
//                     code: 400,
//                     message: "User not found for level" + levelInfo.level,
//                 });
//             }

//             const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;
//             const levelWithName = {
//                 level: levelInfo.level,
//                 name: fullName,
//                 status: levelInfo.approvel_status,
//                 remark: levelInfo.remark
//             };
//             levelsWithNames.push(levelWithName);
//         }

//         return res.status(200).send({
//             code: 200,
//             message: "Data Fetched Successfully!",
//             data: levelsWithNames,
//         });
//     } catch (error) {
//         console.error(error);
//         return res
//             .status(500)
//             .send({ code: 500, message: error.message || "Server Error" });
//     }
// };


exports.get_levels_to_be_approved_appraisal = async (req, res) => {
    try {
        const employee_id = req.params.id;
        let { entityType, financialYear } = req.query;
        let entity_id = entityType;
        let financial_year_id = financialYear;

        // SQL query with corrections and improvements
        const query = `
        SELECT DISTINCT PA.id AS approval_id, PA.level, HRU.employee_id, HEPS.ctc, 
                        HRU.first_name, HRU.last_name, PA.approval_status, PA.progress_status, 
                        PA.payrollDetails_id, PR.appraisal_type, HRU.employee_code, UD.designation_name,
                        HRU.employee_official_email, HRU.contact_number, PR.entity_id, PR.financial_year_id
        FROM HRMS_PAYROLL_APPRAISAL_APPROVAL AS PA
        LEFT JOIN HRMS_PAYROLL_APPRAISAL_DETAILS AS PR 
            ON PR.id = PA.payrollDetails_id
        INNER JOIN HRMS_REGISTERED_USER AS HRU 
            ON HRU.employee_id = PR.employee_id
            LEFT JOIN DESIGNATION AS UD ON UD.designation_id = HRU.designation_id
        LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY AS HEPS 
            ON HEPS.employee_id = HRU.employee_id 
            AND HEPS.g_pay = false 
           -- AND HEPS.financial_year_id = :financialYearId
        WHERE PA.employee_id = :employeeId
            AND PA.status = 'ACTIVE'
            AND PA.approval_status = 'PENDING'
            AND PR.entity_id = :entityId
            AND PR.financial_year_id = :financialYearId
            AND NOT EXISTS (
                SELECT 1 
                FROM HRMS_PAYROLL_APPRAISAL_APPROVAL AS prev
                WHERE prev.payrollDetails_id = PR.id
                    AND prev.level < PA.level
                    AND prev.approval_status != 'APPROVED'
            )`;

        // Execute the query with parameter replacements
        const getAllData = await db.sequelize.query(query, {
            replacements: {
                employeeId: employee_id,
                entityId: entity_id,
                financialYearId: financial_year_id,
            },
            type: db.sequelize.QueryTypes.SELECT,
        });

        // Respond with data or a message if no data is found
        if (getAllData.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetch All PR Data Successfully",
                data: getAllData,
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "Record Not Found!",
                data: [],
            });
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};




async function salaryAppraisalOfEmp(employee_id, payrollDetails_id, payrollData, entityType, financialYear) {
    try {
        const requestedAppraisal = await db.payroll_Appraisal_Details.findOne({
            where: { id: payrollDetails_id, final_status: "APPROVED" }
        });

        if (!requestedAppraisal) {
            throw new Error("Appraisal not approved");
        }

        let isExistpaytemp = await db.payroll_pay_salary.findOne({
            where: { employee_id: requestedAppraisal.employee_id, g_pay: false }
        });

        if (isExistpaytemp) {
            await db.payroll_pay_salary.update({ g_pay: true }, { where: { employee_id: requestedAppraisal.employee_id } });
        }

        let salary = await db.user.update(
            { basic_salary: payrollData.monthlyCTC },
            { where: { employee_id: requestedAppraisal.employee_id } }
        );

        let updateSalaryData = await db.payroll_pay_salary.create({
            ctc: payrollData.annualCTC,
            monthly_ctc: payrollData.monthlyCTC,
            earningComponentList: payrollData.earningComponentList,
            reiembursementComponentList: payrollData.reiembursementComponentList,
            deductionComponentList: payrollData.deductionComponentList,
            total_annual_gross: payrollData.totalAnnualCTC,
            total_monthly_gross: payrollData.totalMonthlyCTC,
            deduction_amt: payrollData.deduction_amt,
            employer_contri_epf_amt: payrollData.employer_contri_epf_amt,
            employer_contri_esi_amt: payrollData.employer_contri_esi_amt,
            payroll_template_id: payrollData.payroll_template_id,
            entity_id: entityType,
            financial_year_id: financialYear,
            employee_id: requestedAppraisal.employee_id,
            tax_calculation: payrollData.tax_calculation,
            tax_slab_id: payrollData.tax_slab,
            template_name: payrollData.template_name,
            description: payrollData.description,
            currency_id: payrollData.currency_id,
            created_by: employee_id,
        });

        return {
            code: 200,
            message: "Salary appraisal successfully updated",
            data: updateSalaryData
        };
    } catch (error) {
        console.error(error);
        throw new Error(error.message || "Internal Server Error");
    }
}




exports.approved_level_of_appraisal_request = async (req, res) => {
    try {
        const payrollDetails_id = req.params.id;
        const { entityType, financialYear } = req.query;
        const {
            approval_status,
            progress_status,
            employee_id,
            final_status,
            remarks,
        } = req.body;
        const payrollData = req.body;

        console.log(req.body)
        if (progress_status && progress_status.length > 20) {
            return res.status(400).send({
                code: 400,
                message: "Progress Status value is too long.",
            });
        }
        const allLevelsData = await db.payroll_Appraisal_Approval.findAll({
            where: { employee_id, payrollDetails_id: payrollDetails_id },
            order: [["level", "ASC"]],
        });

        if (!allLevelsData || allLevelsData.length === 0) {
            return res.status(404).send({
                code: 404,
                message: "No Level has been Assigned to this Employee!",
            });
        }

        const maxLevel = await db.payroll_Appraisal_Approval.max("level", {
            where: { payrollDetails_id: payrollDetails_id },
        });

        const currentLevelData = await db.payroll_Appraisal_Approval.findOne({
            attributes: ["level"],
            where: { employee_id, payrollDetails_id: payrollDetails_id },
        });

        const currentLevelValue = currentLevelData?.level;

        if (!currentLevelValue) {
            return res.status(404).send({
                code: 404,
                message: "Current level not found for the given employee",
            });
        }

        await db.payroll_Appraisal_Approval.update(
            { approval_status, progress_status, remarks },
            { where: { employee_id, payrollDetails_id: payrollDetails_id } }
        );

        if (approval_status === "REJECTED") {
            await db.payroll_Appraisal_Approval.update(
                { approval_status, remarks },
                { where: { payrollDetails_id: payrollDetails_id, employee_id } }
            );

            if (final_status === "REJECTED") {
                await db.payroll_Appraisal_Details.update(
                    { final_status: "REJECTED" },
                    { where: { id: payrollDetails_id } }
                );
                return res.status(200).send({
                    code: 200,
                    message: "Appraisal Request Rejected Successfully!",
                });
            }

        } else if (approval_status === "APPROVED") {
            if (currentLevelValue === maxLevel) {
                let incrementDate = new Date();
                incrementDate.setDate(incrementDate.getDate()); 
                incrementDate = `${incrementDate.getFullYear()}-${String(incrementDate.getMonth() + 1).padStart(2, '0')}-${String(incrementDate.getDate()).padStart(2, '0')}`;
                await db.payroll_Appraisal_Details.update(
                    { final_status: "APPROVED", increment_date: incrementDate },
                    { where: { id: payrollDetails_id } }
                );
                await salaryAppraisalOfEmp(employee_id, payrollDetails_id, payrollData, entityType, financialYear)
            }
            await db.payroll_Appraisal_Approval.update(
                { approval_status: "APPROVED", remarks: remarks },
                { where: { level: currentLevelValue, payrollDetails_id: payrollDetails_id } }
            );
        }
        return res.status(200).send({
            code: 200,
            message: "Update Processed Successfully!",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};


exports.get_Approved_Approvals_appraisal = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { entityType: entityId, financialYear: financialYearId } = req.query;

        const query = `
    SELECT DISTINCT 
        PA.id AS approval_id, PA.level, PA.approval_status, PA.progress_status,
        PA.payrollDetails_id, PR.appraisal_type, HEPS.ctc,UD.designation_name,
        HRU.employee_code, PA.employee_id, HRU.employee_official_email,
        HRU.contact_number, PR.entity_id, PR.financial_year_id, 
        HRU.first_name, HRU.last_name
    FROM HRMS_PAYROLL_APPRAISAL_APPROVAL PA
    JOIN HRMS_PAYROLL_APPRAISAL_DETAILS PR 
        ON PR.id = PA.payrollDetails_id
    INNER JOIN HRMS_REGISTERED_USER HRU 
        ON HRU.employee_id = PR.employee_id
        LEFT JOIN DESIGNATION AS UD ON UD.designation_id = HRU.designation_id
    LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY AS HEPS 
        ON HEPS.employee_id = HRU.employee_id 
        AND HEPS.g_pay = false 
       -- AND HEPS.financial_year_id = :financialYearId
    WHERE PA.employee_id = :employeeId 
        AND PR.entity_id = :entityId 
        AND PR.financial_year_id = :financialYearId 
        AND PA.approval_status = 'APPROVED'
    ORDER BY PA.id DESC;
`;


        const data = await db.sequelize.query(query, {
            replacements: { employeeId, entityId, financialYearId },
            type: db.sequelize.QueryTypes.SELECT,
        });

        return data.length
            ? res.status(200).send({ code: 200, message: "Data fetched successfully", data })
            : res.status(404).send({ code: 404, message: "No data found", data: [] });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server error" });
    }
};



exports.get_Rejected_Approvals_appraisal = async (req, res) => {
    try {
        const employee_id = req.params.id;
        let { entityType, financialYear } = req.query;
        let entity_id = entityType;
        let financial_year_id = financialYear;

        const query = `
            SELECT DISTINCT PA.id AS approval_id, 
                            PA.level, 
                            PA.approval_status, 
                            PA.progress_status,
                            PA.payrollDetails_id, 
                            PR.appraisal_type, 
                            HRU.employee_code, 
                            HEPS.ctc, 
                            UD.designation_name, 
                            PA.employee_id, 
                            HRU.employee_official_email, 
                            HRU.contact_number, 
                            PR.entity_id, 
                            PR.financial_year_id, 
                            HRU.first_name, 
                            HRU.last_name
            FROM HRMS_PAYROLL_APPRAISAL_APPROVAL AS PA
            JOIN HRMS_PAYROLL_APPRAISAL_DETAILS AS PR 
                ON PR.id = PA.payrollDetails_id
            INNER JOIN HRMS_REGISTERED_USER AS HRU 
                ON HRU.employee_id = PR.employee_id
            LEFT JOIN DESIGNATION AS UD 
                ON UD.designation_id = HRU.designation_id
            LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY AS HEPS 
                ON HEPS.employee_id = HRU.employee_id 
                AND HEPS.g_pay = false 
              --  AND HEPS.financial_year_id = :financialYearId
            WHERE PA.employee_id = :employeeId
            AND PR.entity_id = :entityId
            AND PR.financial_year_id = :financialYearId
            AND PA.approval_status = 'REJECTED'
            ORDER BY PA.id DESC;
        `;

        const getAllData = await db.sequelize.query(query, {
            replacements: {
                employeeId: employee_id,
                entityId: entity_id,
                financialYearId: financial_year_id,
            },
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (getAllData.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Fetched All Rejected Approvals Successfully!",
                data: getAllData
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No Rejected Approvals Found!",
                data: []
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};


//------------------------------------------------------


exports.get_requested_appraisal_data = async (req, res) => {
    try {
        const payrollDetailsId = req.params.id;

        // SQL query to fetch requested appraisal data
        const query = `
            SELECT *
            FROM HRMS_PAYROLL_APPRAISAL_DETAILS AS HPAD
            LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY AS HEPS
            ON HPAD.salary_template_id = HEPS.id AND HEPS.g_pay = false
            WHERE HPAD.id = :payrollDetailsId
            LIMIT 1;
        `;

        // Execute the query with parameter replacements
        const appraisalData = await db.sequelize.query(query, {
            replacements: { payrollDetailsId },
            type: db.sequelize.QueryTypes.SELECT,
        });

        // Check if data exists
        if (!appraisalData.length) {
            return res.status(404).send({
                code: 404,
                message: "Requested Appraisal Data Not Found!",
            });
        }

        // Respond with the fetched data
        return res.status(200).send({
            code: 200,
            message: "Data Fetched Successfully!",
            data: appraisalData[0],
        });
    } catch (error) {
        console.error("Error fetching appraisal data:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};




exports.getAll_Approval_level_appraisal = async (req, res) => {
    try {
        const payrollDetails_id = req.params.id;
        // const { workflow_type, payrollDetails_id } = req.body;

        const getData = await db.payroll_Appraisal_Approval.findAll({
            where: {
                payrollDetails_id: payrollDetails_id,
            },
            attributes: ["approval_status", "level", "employee_id", "remarks"],
        });

        if (!getData || getData.length === 0) {
            return res.status(400).send({ code: 400, message: "Data not found" });
        }

        const levelsWithNames = [];
        for (const levelInfo of getData) {
            const employeeInfo = await db.user.findOne({
                where: {
                    employee_id: levelInfo.employee_id,
                },
                attributes: ["first_name", "last_name"],
            });

            if (!employeeInfo) {
                return res.status(400).send({
                    code: 400,
                    message: "User not found for level" + levelInfo.level,
                });
            }

            const fullName = `${employeeInfo.first_name} ${employeeInfo.last_name}`;
            const levelWithName = {
                level: levelInfo.level,
                name: fullName,
                status: levelInfo.approval_status,
                remarks: levelInfo.remarks
            };
            levelsWithNames.push(levelWithName);
        }

        return res.status(200).send({
            code: 200,
            message: "Data Fetched Successfully!",
            data: levelsWithNames,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.get_all_payroll_id = async (req, res) => {
    try {
        const id = req.params.id;
        const [data] = await db.sequelize.query(`
        SELECT DISTINCT PA.id AS approval_id, PA.level, PA.approval_status, PA.progress_status,
        PA.payroll_payslip_id, PR.id,PA.employee_id, PR.payroll_payslip_id,
        PR.entity_id,PR.financial_year_id,HRU.first_name, HRU.last_name,PA.remarks
        FROM HRMS_PAYROLL_APPROVAL AS PA
        JOIN HRMS_PAYROLL_EMPOLYEE_DETAILS AS PR ON PR.id = PA.payrollDetails_id
        INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = PA.employee_id
        WHERE PR.id = :id 
        ORDER BY PR.id DESC   
      `, {
            replacements: { id }
        });

        if (data) {
            return res.status(200).send({ code: 200, message: "Data fetched successfully!", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Data Not Found", data: [] });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ code: 500, message: 'An error occurred while fetching data.', error: error.message });
    }
};


exports.get_all_appraisal_history = async (req, res) => {
    try {
        const { employee_id, entity_id, financial_year_id } = req.body;
        let payroll_details = await db.sequelize.query(
            `SELECT DISTINCT 
                PR.id, 
                PR.employee_id, 
                PR.entity_id, 
                PR.financial_year_id, 
                PR.appraisal_type,
                PR.appraisal_mode,
                PR.appraisal_comp_type,
                PR.appraisal_percentage,
                PR.appraisal_amount,
                HRU.employee_code,  
                PR.increment_date,
                HRU.employee_official_email, 
                HRU.contact_number, 
                UD.designation_name, 
                HRU.first_name, 
                HRU.last_name, 
                PR.final_status,
                HEPS.id,
                HEPS.earningComponentList,
                HEPS.ctc AS old_ctc,
                HEPS.monthly_ctc AS gross_salary,
                JSON_UNQUOTE(
                    JSON_EXTRACT(
                        HEPS.earningComponentList, 
                        '$[0].monthlyBasic'
                    )
                ) AS basic_salary,
                CASE 
                    WHEN PR.appraisal_mode = 'Flat' AND PR.appraisal_type = 'Increment' THEN HEPS.ctc + PR.appraisal_amount
                    WHEN PR.appraisal_mode = 'Flat' AND PR.appraisal_type = 'Decrement' THEN HEPS.ctc - PR.appraisal_amount
                    WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'Basic Salary' AND PR.appraisal_type = 'Increment' THEN HEPS.ctc + ((JSON_UNQUOTE(JSON_EXTRACT(HEPS.earningComponentList, '$[0].monthlyBasic')) * 12) * PR.appraisal_percentage / 100)
                    WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'Basic Salary' AND PR.appraisal_type = 'Decrement' THEN HEPS.ctc - ((JSON_UNQUOTE(JSON_EXTRACT(HEPS.earningComponentList, '$[0].monthlyBasic')) * 12) * PR.appraisal_percentage / 100)
                    WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'Gross Salary' AND PR.appraisal_type = 'Increment' THEN HEPS.ctc + (HEPS.monthly_ctc * 12 * PR.appraisal_percentage / 100)
                    WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'Gross Salary' AND PR.appraisal_type = 'Decrement' THEN HEPS.ctc - (HEPS.monthly_ctc * 12 * PR.appraisal_percentage / 100)
                    WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'CTC' AND PR.appraisal_type = 'Increment' THEN HEPS.ctc + (HEPS.ctc * PR.appraisal_percentage / 100)
                    WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'CTC' AND PR.appraisal_type = 'Decrement' THEN HEPS.ctc - (HEPS.ctc * PR.appraisal_percentage / 100)
                    ELSE HEPS.ctc 
                END AS new_ctc,
                ROUND(
                    CASE 
                        WHEN PR.appraisal_mode = 'Flat' AND PR.appraisal_type = 'Increment' THEN (HEPS.ctc + PR.appraisal_amount) / 12
                        WHEN PR.appraisal_mode = 'Flat' AND PR.appraisal_type = 'Decrement' THEN (HEPS.ctc - PR.appraisal_amount) / 12
                        WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'Basic Salary' AND PR.appraisal_type = 'Increment' THEN (HEPS.ctc + ((JSON_UNQUOTE(JSON_EXTRACT(HEPS.earningComponentList, '$[0].monthlyBasic')) * 12) * PR.appraisal_percentage / 100)) / 12
                        WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'Basic Salary' AND PR.appraisal_type = 'Decrement' THEN (HEPS.ctc - ((JSON_UNQUOTE(JSON_EXTRACT(HEPS.earningComponentList, '$[0].monthlyBasic')) * 12) * PR.appraisal_percentage / 100)) / 12
                        WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'Gross Salary' AND PR.appraisal_type = 'Increment' THEN (HEPS.ctc + (HEPS.monthly_ctc * 12 * PR.appraisal_percentage / 100)) / 12
                        WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'Gross Salary' AND PR.appraisal_type = 'Decrement' THEN (HEPS.ctc - (HEPS.monthly_ctc * 12 * PR.appraisal_percentage / 100)) / 12
                        WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'CTC' AND PR.appraisal_type = 'Increment' THEN (HEPS.ctc + (HEPS.ctc * PR.appraisal_percentage / 100)) / 12
                        WHEN PR.appraisal_mode = 'Percentage' AND PR.appraisal_comp_type = 'CTC' AND PR.appraisal_type = 'Decrement' THEN (HEPS.ctc - (HEPS.ctc * PR.appraisal_percentage / 100)) / 12
                        ELSE HEPS.ctc / 12
                    END, 2
                ) AS monthly_ctc,
                CASE 
                    WHEN MONTH(PR.increment_date) = 1 THEN 'January'
                    WHEN MONTH(PR.increment_date) = 2 THEN 'February'
                    WHEN MONTH(PR.increment_date) = 3 THEN 'March'
                    WHEN MONTH(PR.increment_date) = 4 THEN 'April'
                    WHEN MONTH(PR.increment_date) = 5 THEN 'May'
                    WHEN MONTH(PR.increment_date) = 6 THEN 'June'
                    WHEN MONTH(PR.increment_date) = 7 THEN 'July'
                    WHEN MONTH(PR.increment_date) = 8 THEN 'August'
                    WHEN MONTH(PR.increment_date) = 9 THEN 'September'
                    WHEN MONTH(PR.increment_date) = 10 THEN 'October'
                    WHEN MONTH(PR.increment_date) = 11 THEN 'November'
                    WHEN MONTH(PR.increment_date) = 12 THEN 'December'
                    ELSE NULL 
                END AS month,
                YEAR(PR.increment_date) AS year
            FROM HRMS_PAYROLL_APPRAISAL_DETAILS PR
            INNER JOIN HRMS_REGISTERED_USER HRU ON HRU.employee_id = PR.employee_id
            LEFT JOIN HRMS_EMPLOYEE_PAY_SALARY HEPS ON HEPS.employee_id = HRU.employee_id 
                AND HEPS.id = PR.salary_template_id 
                AND g_pay = true
            LEFT JOIN DESIGNATION UD ON UD.designation_id = HRU.designation_id
            WHERE PR.employee_id = :employee_id 
                AND PR.entity_id = :entity_id 
                AND PR.financial_year_id = :financial_year_id 
                AND PR.final_status = "APPROVED"
                AND PR.increment_date IS NOT NULL
            ORDER BY PR.id DESC;
            `,
            {
                replacements: { employee_id, entity_id, financial_year_id },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

     // Remove the create_by and add the employee_id  Ritik

        // Check if payroll details exist
        if (payroll_details.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Payroll Details found",
                data: payroll_details
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No Data Found!",
                data: []
            });
        }
    } catch (error) {
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};






async function calculateLastDate(start_date, period, effective_after) {
    // Parse the start_date to a Date object
    let startDate = new Date(start_date);

    let lastDate;

    // Depending on the period, calculate the last date
    if (period === "MONTHS") {
        lastDate = new Date(startDate);
        lastDate.setMonth(startDate.getMonth() + effective_after);  // Add months to start date
    } else if (period === "YEAR") {
        lastDate = new Date(startDate);
        lastDate.setFullYear(startDate.getFullYear() + effective_after);  // Add years to start date
    } else if (period === "DAYS") {
        lastDate = new Date(startDate);
        lastDate.setDate(startDate.getDate() + effective_after);  // Add days to start date
    } else {
        throw new Error("Invalid period");
    }

    return lastDate;
}

async function checkProbationPeriod(existAppraisal, start_date, last_increment_date) {

    let period = existAppraisal[0].period;  // period (MONTHS, YEAR, DAYS)
    let effective_after = existAppraisal[0].effective_after;  // effective after (4 months, years, or days)
    let last_date
    if (last_increment_date) {
        last_date = new Date(last_increment_date);
    } else {
        last_date =  await calculateLastDate(start_date, period, effective_after);
    }
    let current_date = new Date();  // Get current date

    // Check if current date is past the last date
    if (current_date >= last_date) {
        console.log("Condition met, probation is over.");
        return true;
    } else {
        throw new Error("Appraisal Interval date not over");
    }
}


