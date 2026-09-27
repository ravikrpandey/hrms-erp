const db = require('../../../models/index');
const PayrollCycleModel = db.master_payroll_cycle;
const { validateFields } = require('../../../utils/inputValidator');

exports.createPayrollCycle = async (req, res) => {
    try {

        let { created_by, entity_name, from_payroll_Cycle_date,  to_payroll_Cycle_date
        } = req.body;

        let { entityType, financialYear } = req.query;

        let isExist = await db.master_payroll_cycle.findOne({
            where:
            {
                start_date: from_payroll_Cycle_date,
                end_date: to_payroll_Cycle_date,
                entity_type: entityType,
                financial_year: financialYear,
                 
            }
        })
        if (isExist) {
            return res.status(400).send({ code: 400, message: "Payroll cycle date already exist" })
        }
        const response = await PayrollCycleModel.create({
            created_by: created_by,
            start_date: from_payroll_Cycle_date,
            end_date: to_payroll_Cycle_date,
            entity_type: entityType,
            entity_name: entity_name,
            financial_year: financialYear,
             
        });
        return res.status(200).send({ code: 200, message: "Created Successfully!", data: response });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

exports.getAllPayrollCycle = async (req, res) => {
    try {
        const { entity_type, financial_year } = req.body;
        let [list] = await db.sequelize.query(`  SELECT mpc.*,  em.entity_name  FROM MASTER_PAYROLL_CYCLE mpc 
     INNER JOIN ENTITY_MASTER em ON mpc.entity_type = em.id 
         WHERE is_deleted = FALSE and entity_type = '${entity_type}' and financial_year = '${financial_year}';`);
        if (list.length <= 0) {
            return res.status(400).send({
                code: 400,
                message: "Record Not found"
            });
        }
        return res.status(200).send({
            code: 200,
            message: "Fetched Successfully!",
            data: list
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.getAllPayrollCycle_Active = async (req, res) => {
    try {
        const { entity_type, financial_year } = req.body;

        if (!entity_type || !financial_year) {
            return res.status(400).send({
                code: 400,
                message: "Entity type and financial year are required fields"
            });
        }

        const query = `
            SELECT mpc.*,  em.entity_name
            FROM MASTER_PAYROLL_CYCLE mpc
            INNER JOIN ENTITY_MASTER em ON mpc.entity_type = em.id
            WHERE mpc.is_deleted = FALSE
            AND mpc.entity_type = :entity_type
            AND mpc.financial_year = :financial_year
            AND mpc.status = 'ACTIVE'
        `;

        const [list] = await db.sequelize.query(query, {
            replacements: { entity_type, financial_year }
        });

        if (list.length === 0) {
            return res.status(404).send({
                code: 404,
                message: "No records found"
            });
        }

        return res.status(200).send({
            code: 200,
            message: "Fetched Successfully!",
            data: list
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};


exports.getPayrollCycleById = async (req, res) => {
    try {
        const payrollCycleId = req.params.id
        const { entity_type, financial_year } = req.body;
        let [list] = await db.sequelize.query(`SELECT mpc.*,  em.entity_name  FROM MASTER_PAYROLL_CYCLE mpc 
     INNER JOIN ENTITY_MASTER em ON mpc.entity_type = em.id 
         WHERE is_deleted = FALSE and entity_type = '${entity_type}' 
        and financial_year = '${financial_year}' and mpc.id = '${payrollCycleId}';`);
        if (!list) {
            return res.status(400).send({
                code: 400,
                message: "Record Not found"
            });
        }
        return res.status(200).send({
            code: 200,
            message: "Fetched Successfully!",
            data: list[0]
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};

exports.updatePayrollCycleById = async (req, res) => {
    try {
        const payrollCycleId = req.params.id;
        const { entityType, financialYear } = req.query;
        const { status } = req.body;

        if (!payrollCycleId) {
            return res.status(400).send({ code: 400, message: "Payroll cycle ID is required" });
        }

        let query = `
            UPDATE MASTER_PAYROLL_CYCLE mpc
            SET mpc.id = :payrollCycleId
        `;

        if (status !== undefined && status !== null) {
            query += `, status = :status`;
        }

        query += `
            WHERE mpc.entity_type = :entityType
              AND mpc.financial_year = :financialYear
              AND mpc.id = :payrollCycleId
        `;

        const [results] = await db.sequelize.query(query, {
            replacements: {
                entityType,
                financialYear,
                payrollCycleId,
                status
            }
        });

        if (results.affectedRows === 0) {
            return res.status(404).send({ code: 404, message: "No matching record found for update" });
        }

        return res.status(200).send({ code: 200, message: "Payroll cycle updated successfully!" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};

