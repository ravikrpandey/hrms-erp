
const db = require("../../../models/index");
const { Op } = require('sequelize');

class ArrearSalaryController {

    async create_arrear_salary(req, res) {
        try {
            const {
                id,
                entity_id,
                financial_year_id,
                department_id,
                employee_id,
                month,
                arrear_type,
                start_arrear_date,
                end_arrear_date,
                amount,
                is_epfapplicable,
                is_esiapplicable,
                is_taxable,
                remark,
                created_by,
            } = req.body;
            if (!amount || !month || !arrear_type) {
                return res.status(400).json({
                    code: 400,
                    message: "Missing required fields: amount, month, or arrear_type",
                });
            }

            let responseMessage = "";
            if (id) {
                const existingArrear = await db.arrear_salary.findOne({ where: { id } });
                if (!existingArrear) {
                    return res.status(404).json({
                        code: 404,
                        message: "Arrear salary record not found",
                    });
                }

                await existingArrear.update({
                    id,
                    entity_id,
                    financial_year_id,
                    department_id,
                    employee_id,
                    month,
                    arrear_type,
                    start_arrear_date,
                    end_arrear_date,
                    amount,
                    is_epf_applicable: is_epfapplicable,
                    is_esi_applicable: is_esiapplicable,
                    is_taxable,
                    remark,
                    created_by,
                });

                responseMessage = "Updated successfully!";
            } else {
                const newArrear = await db.arrear_salary.create({
                    entity_id,
                    financial_year_id,
                    department_id,
                    employee_id,
                    month,
                    arrear_type,
                    start_arrear_date,
                    end_arrear_date,
                    amount,
                    is_epf_applicable: is_epfapplicable,
                    is_esi_applicable: is_esiapplicable,
                    is_taxable,
                    remark,
                    created_by,
                });

                responseMessage = "Added successfully!";
            }

            return res.status(200).json({
                code: 200, message: responseMessage
            });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: error.message || "Internal server error!",
            });
        }
    }

    async get_all_arrear_salary(req, res) {
        try {
            const { entity_id } = req.query;
            if (!entity_id) {
                return res.status(400).send({
                    code: 400,
                    message: "Entity id is required!",
                });
            }
            let base_query = `
  SELECT 
      PAS.*, 
      CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
      CONCAT(CR.first_name, ' ', CR.last_name) AS created_by,
      MD.department_name,MFY.financial_year
  FROM PAYROLL_ARREAR_SALARY AS PAS
  LEFT JOIN HRMS_REGISTERED_USER AS RU 
      ON RU.employee_id = PAS.employee_id
  LEFT JOIN HRMS_REGISTERED_USER AS CR 
      ON CR.employee_id = PAS.created_by
  LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY 
      ON MFY.id = PAS.financial_year_id
      
 LEFT JOIN MASTER_DEPARTMENT AS MD 
      ON RU.department_id = MD.dept_id

  WHERE PAS.isDeleted = false 
    AND PAS.entity_id = ?
`;
            const replacements = [entity_id];
            const response = await db.sequelize.query(base_query, {
                replacements: replacements,
                type: db.sequelize.QueryTypes.SELECT,
            });

            return res.status(200).send({
                code: 200,
                message: "Data fetched successfully!",
                data: response,
            });
        } catch (error) {
            return res.status(500).send({
                code: 500,
                message: error.message || "Internal server error!",
            });
        }
    }

    async get_all_arrear_salary_by_id(req, res) {
        try {
            const { id, entity_id } = req.query;

            // Validation
            if (!id || !entity_id) {
                return res.status(400).json({
                    code: 400,
                    message: "Both id and entity_id are required!",
                });
            }

            const base_query = `
      SELECT 
        PAS.*, 
        CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
        MD.department_name,
        MD.dept_id,
        MFY.financial_year
      FROM PAYROLL_ARREAR_SALARY AS PAS
      LEFT JOIN HRMS_REGISTERED_USER AS RU 
        ON RU.employee_id = PAS.employee_id
      LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY 
        ON MFY.id = PAS.financial_year_id
      LEFT JOIN MASTER_DEPARTMENT AS MD 
        ON RU.department_id = MD.dept_id
      WHERE PAS.isDeleted = false 
        AND PAS.entity_id = :entity_id
        AND PAS.id = :id
    `;

            const response = await db.sequelize.query(base_query, {
                replacements: { id, entity_id },
                type: db.Sequelize.QueryTypes.SELECT,
            });

            return res.status(200).json({
                code: 200,
                message: "Data fetched successfully!",
                data: response,
            });

        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: error.message || "Internal server error!",
            });
        }
    }


    async delete_arrear_salary_by_id(req, res) {
        try {
            const { id } = req.query;
            const data = await db.arrear_salary.findOne({ where: { id: id } });

            if (!data) {
                return res.status(404).send({ code: 404, message: "Record not found!" });
            }

            await db.arrear_salary.update({ isDeleted: true }, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Deleted successfully!" });
        } catch (error) {
            return res.status(500).send({ code: 500, message: "Internal server error!" });
        }
    }
}

module.exports = new ArrearSalaryController();