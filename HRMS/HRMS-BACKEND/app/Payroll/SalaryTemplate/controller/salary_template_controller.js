const db = require('../../../models/index');
const PayrollSalaryTemplateModel = db.payroll_salary_template;
const { validateFields } = require('../../../utils/inputValidator');
const Grade = db.grade_master;

exports.createSalaryTemplate = async (req, res) => {
    try {
        const requiredFields = ['templateName', 'annualCTC'];
        const validation = await validateFields(req.body, requiredFields);
        const { templateName, description,currency_id, annualCTC, earningComponentList, deductionComponentList, reiembursementComponentList,variableearningComponentList, totalAnnualCTC, totalMonthlyCTC, created_by, isPF_calculate,pfCap,esiThreshold, gross_salary_monthly } = req.body;
        if (!validation.isValid) {
            return res.status(400).send({ status: false, message: validation.message });
        }

        let templatePayload = {
            template_name: templateName,
            description: description,
            ctc: annualCTC,
            total_annual_gross: totalAnnualCTC,
            total_monthly_gross: totalMonthlyCTC,
            gross_salary: gross_salary_monthly,
            created_by: created_by,
            isPF_calculate: isPF_calculate,
            pfCap: pfCap,
            esiThreshold: esiThreshold,
            currency_id: currency_id,
            earningComponentList, deductionComponentList, reiembursementComponentList,variableearningComponentList
        }
        insertedData = await PayrollSalaryTemplateModel.create(templatePayload);

        let message = '';


        if (insertedData) {
            message += `Templates created successfully.`;
        }

        message = message.trim();

        return res.status(200).json({
            status: true,
            message: message,
            data: insertedData
        });


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' })
    }
};


exports.getAllSalaryTemplate = async (req, res) => {
    try {
        // const { financialYear, entityType } = req.query;
        const [list] = await db.sequelize.query(`
            SELECT pst.id, pst.template_name, pst.description, pst.ctc, pst.status 
            FROM PAYROLL_SALARY_TEMPLATE pst
        `);

        if (list.length === 0) {
            return res.status(404).send({ status: false, message: 'No Record Found', data: list });
        }

        return res.status(200).send({ status: true, message: "Listed Successfully", data: list });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};



exports.getAllActiveSalaryTemplate = async (req, res) => {
    try {
        // const { financialYear, entityType } = req.query;
        const [list] = await db.sequelize.query(`
            SELECT pst.id, pst.template_name, pst.description, pst.ctc, pst.status 
            FROM PAYROLL_SALARY_TEMPLATE pst
            WHERE pst.status = "ACTIVE" and pst.is_deleted = false
        `);

        if (list.length === 0) {
            return res.status(404).send({ status: false, message: 'No Record Found', data: list });
        }

        return res.status(200).send({ status: true, message: "Listed Successfully", data: list });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};




exports.getSalaryTemplateById = async (req, res) => {
    try {
        const id = req.params.id;
        
        const template = await db.payroll_salary_template.findOne({
            where: { id }
        });

        if (!template) {
            return res.status(404).json({ status: false, message: 'No Record Found', data: null });
        }

        // Ensure that deductionComponentList is an array, in case it's not already
        if (!Array.isArray(template.deductionComponentList)) {
            template.dataValues.deductionComponentList = [];
        }

        // If PF calculation is enabled, check for EPF and ESI
        if (template.isPF_calculate == 1) {
            const [epf] = await db.sequelize.query(`
                SELECT pe.*, 
                       mecr.contribution_rate AS employee_contribution, 
                       mecr2.contribution_rate AS employer_contribution,
                       'EPF' AS deduction_plan ,'EPF' AS componentName 
                FROM PAYROLL_EPF pe 
                INNER JOIN MASTER_EMPLOYEE_CONTRIBUTION_RATE mecr 
                ON pe.employee_contribution_rate = mecr.emp_contribution_rate_id 
                INNER JOIN MASTER_EMPLOYER_CONTRIBUTION_RATE mecr2 
                ON pe.employer_contribution_rate = mecr2.emplr_contribution_rate_id  
                WHERE pe.status = 'Active' 
                LIMIT 1;
            `);

            const [esi] = await db.sequelize.query(`
                SELECT pe.*, 
                       'ESI' AS deduction_plan ,'ESI' AS componentName
                FROM PAYROLL_ESI pe 
                WHERE pe.status = 'Active' 
                LIMIT 1;
            `);

            // If EPF data is found, add it to the deductionComponentList directly as an object
            if (epf && epf.length > 0) {

                    
                template.deductionComponentList.push(epf[0]);
            }

            // If ESI data is found, add it to the deductionComponentList directly as an object
            if (esi && esi.length > 0) {
                template.deductionComponentList.push(esi[0]);
            }
        }

        return res.status(200).json({ status: true, message: "Listed Successfully", data: template });
    } catch (error) {
        console.error("Error fetching salary template: ", error);
        return res.status(500).json({ status: false, message: error.message || 'Server Error' });
    }
};


exports.getSalaryTemplateById_update = async (req, res) => {
    try {
        const id = req.params.id;
        
        const template = await db.payroll_salary_template.findOne({
            where: { id }
        });

        if (!template) {
            return res.status(404).json({ status: false, message: 'No Record Found', data: null });
        }

               return res.status(200).json({ status: true, message: "Listed Successfully", data: template });
    } catch (error) {
        console.error("Error fetching salary template: ", error);
        return res.status(500).json({ status: false, message: error.message || 'Server Error' });
    }
};


exports.updateSalaryTempStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let id = req.params.id;
        const list = await PayrollSalaryTemplateModel.findAll();
        if (list.length === 0) {
            res.status(400).json({ status: false, message: 'No Record To Update', data: list });
        }
        let updatedResponse = await PayrollSalaryTemplateModel.update(
            { status: status },
            {
                where: {
                    id: id
                }
            }
        );
        return res.status(200).send({ status: true, message: "Updated Successfully", data: updatedResponse })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' })
    }
};

exports.updateSalaryTemplate = async (req, res) => {
    try {
        let id = req.params.id;
     
        let updatedResponse = await PayrollSalaryTemplateModel.update(
            { ...req.body },
            {
                where: {
                    id: id
                }
            }
        );
        return res.status(200).send({ status: true, message: "Updated Successfully", data: updatedResponse })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' })
    }
};

exports.getAllGrade = async (req, res) => {
    try {
        const { entityType, financialYear } = req.query;
        const gradeData = await Grade.findAll({
            where: { isDeleted: false, entity_id: entityType },
            attributes: ['grade_id', 'grade_name', 'status'],
            order: [['grade_id', 'DESC']],
        });
        if (gradeData) {
            res.status(200).send({ message: "Grade data list fetched successfully", data: gradeData });
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ message: "Error", error: err.message });
    }
};


exports.getAllActiveBranch = async (req, res) => {
    try {
        const { entity_type, financial_year } = req.body;
        // let entityType = 1;
        const isDeletedCondition = `WHERE T.isDeleted = false AND T.status = 'ACTIVE'`;
        const query = `SELECT T.id, T.branch_name, T.branch_code, T.branch_contact_person_name, T.branch_contact_no,
                    T.branch_alt_contact_no, T.branch_email, T.branch_alt_email, T.branch_pin_code, T.branch_address, T.status AS branch_status,T.billing_status,
                    T.branch_gstnumber, T.status, CT.*, S.states_id AS branch_states_id ,S.*, C.*  FROM MASTER_BRANCH AS T
                    INNER JOIN MASTER_COUNTRY AS CT ON T.country_id = CT.countryss_id
                    INNER JOIN MASTER_STATE AS S ON T.state_id = S.states_id
                    LEFT JOIN MASTER_CITY AS C ON T.city_id = C.city_id 
                    ${isDeletedCondition}
                   ORDER BY T.id DESC`;
        const data = await db.sequelize.query(query, { replacements: { isDeleted: false }, type: db.sequelize.QueryTypes.SELECT });
        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Branch Data Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.getAllActiveCompany = async (req, res) => {
    try {
        const { entityType, financialYear } = req.params;
        const isDeletedCondition = `WHERE em.status = 'ACTIVE' AND em.isDeleted = false`;
        const query = `
            SELECT 
                em.id, 
                em.entity_name, 
                em.registered_office, 
                em.company_id, 
                cdm.company_name 
            FROM ENTITY_MASTER em
            INNER JOIN COMPANY_DETAILS_MASTER cdm ON cdm.id = em.company_id
            ${isDeletedCondition} 
            AND cdm.isDeleted = false 
            AND cdm.status = 'ACTIVE'
            ORDER BY em.createdAt DESC;`;

        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (data.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Get Branch Data Successfully",
                data,
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No Data Found",
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};



exports.getAllEntityMaster = async (req, res) => {
    try {
        const [data] = await db.sequelize.query(`SELECT *
      FROM 
        ENTITY_MASTER AS em 
      WHERE em.status = 'ACTIVE' 
        AND em.isDeleted = 0;`)
        if (data.length > 0) {
            return res.status(200).send({ code: 200, message: "Get Branch Data Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "No Data found" });
        }
    } catch (error) {
        console.log(error, "Error");
        return res.status(500).send({ code: 500, message: error.message });
    }
};


exports.getAllCompany_with_entity = async (req, res) => {
    try {
        const { company_id } = req.query;
        const isDeletedCondition = `WHERE em.status = 'ACTIVE' AND em.isDeleted = false`;
        const query = `
            SELECT 
                em.id, 
                em.entity_name, 
                em.registered_office, 
                em.company_id, 
                cdm.company_name, 
                mb.branch_name
            FROM ENTITY_MASTER em
            INNER JOIN COMPANY_DETAILS_MASTER cdm ON cdm.id = em.company_id
            INNER JOIN MASTER_BRANCH mb ON mb.id = em.branch_id
            ${isDeletedCondition} 
            AND cdm.isDeleted = false
            AND em.company_id = ${company_id} 
            AND cdm.status = 'ACTIVE'
            ORDER BY em.createdAt DESC;`;

        const data = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        if (data.length > 0) {
            return res.status(200).send({
                code: 200,
                message: "Get Branch Data Successfully",
                data,
            });
        } else {
            return res.status(404).send({
                code: 404,
                message: "No Data Found",
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error",
        });
    }
};