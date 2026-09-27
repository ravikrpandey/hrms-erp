const db = require("../../../models/index");

exports.create_fine_management = async (req, res) => {
    try {
        const {
            id,
            entity_id,
            financial_year_id,
            employee_id,
            month,
            amount,
            fine_date,
            description,
        } = req.body;
        if (!amount || !month) {
            return res.status(400).json({
                code: 400,
                message: "Missing required fields: amount, month",
            });
        }

        let responseMessage = "";
        if (id) {
            const existingArrear = await db.fine_management.findOne({ where: { id } });
            if (!existingArrear) {
                return res.status(404).json({
                    code: 404,
                    message: "Fine management record not found",
                });
            }

            await existingArrear.update({
                id,
                entity_id,
                financial_year_id,
                employee_id,
                month,
                amount,
                fine_date,
                description,
            });

            responseMessage = "Updated successfully!";
        } else {
            const newArrear = await db.fine_management.create({
                entity_id,
                financial_year_id,
                employee_id,
                month,
                amount,
                fine_date,
                description,
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

exports.get_all_fine_management = async (req, res) => {
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
      PFM.*, 
      CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
      MD.department_name,MFY.financial_year
  FROM PAYROLL_FINE_MANAGEMENT AS PFM
  LEFT JOIN HRMS_REGISTERED_USER AS RU 
      ON RU.employee_id = PFM.employee_id
  LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY 
      ON MFY.id = PFM.financial_year_id
      
 LEFT JOIN MASTER_DEPARTMENT AS MD 
      ON RU.department_id = MD.dept_id

  WHERE PFM.isDeleted = false 
    AND PFM.entity_id = ?
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

exports.get_all_fine_management_by_id = async (req, res) => {
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
        PFM.*, 
        CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
        MD.department_name,
        MD.dept_id,
        MFY.financial_year
      FROM PAYROLL_FINE_MANAGEMENT AS PFM
      LEFT JOIN HRMS_REGISTERED_USER AS RU 
        ON RU.employee_id = PFM.employee_id
      LEFT JOIN MASTER_FINANCIAL_YEAR AS MFY 
        ON MFY.id = PFM.financial_year_id
      LEFT JOIN MASTER_DEPARTMENT AS MD 
        ON RU.department_id = MD.dept_id
      WHERE PFM.isDeleted = false 
        AND PFM.entity_id = :entity_id
        AND PFM.id = :id
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


exports.delete_fine_management_by_id = async (req, res) => {
    try {
        const { id } = req.query;
        const data = await db.fine_management.findOne({ where: { id: id } });

        if (!data) {
            return res.status(404).send({ code: 404, message: "Record not found!" });
        }

        await db.fine_management.update({ isDeleted: true }, { where: { id: id } });
        return res.status(200).send({ code: 200, message: "Deleted successfully!" });
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Internal server error!" });
    }
}