const db = require("../../../models/index");

exports.create_welfare_inspection = async (req, res) => {
    try {
        const {
            id,
            entity_id,
            employee_id,
            department_id,
            branch_id,
            date_of_inspec,
            supervisor,
            remarks,
        } = req.body;

        let responseMessage = "";
        if (id) {
            const existingArrear = await db.wefare_inspection.findOne({ where: { id } });
            if (!existingArrear) {
                return res.status(404).json({
                    code: 404,
                    message: "Health inspection record not found",
                });
            }

            await existingArrear.update({
                id,
                entity_id,
                employee_id,
                department_id,
                branch_id,
                date_of_inspec,
                supervisor,
                remarks: remarks,
            });

            responseMessage = "Updated successfully!";
        } else {
            const newArrear = await db.welfare_inspection.create({
                entity_id,
                employee_id,
                department_id,
                branch_id,
                date_of_inspec,
                supervisor,
                remarks: remarks,
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

exports.get_all_welfare_inspec = async (req, res) => {
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
      CWI.*, 
      CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
      MD.department_name,MB.branch_name
  FROM COMPLIANCES_WELFARE_INSPECTION AS CWI
  LEFT JOIN HRMS_REGISTERED_USER AS RU 
      ON RU.employee_id = CWI.employee_id

       LEFT JOIN MASTER_BRANCH AS MB 
      ON MB.id = CWI.branch_id

      
 LEFT JOIN MASTER_DEPARTMENT AS MD 
      ON RU.department_id = MD.dept_id

  WHERE CWI.isDeleted = false 
    AND CWI.entity_id = ?
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

exports.get_all_welfare_inspec_by_id = async (req, res) => {
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
    CWI.*, 
    CONCAT(RU.first_name, ' ', RU.last_name) AS full_name,
    MD.department_name,
    MB.branch_name,
    MD.dept_id
  FROM COMPLIANCES_WELFARE_INSPECTION AS CWI
  LEFT JOIN HRMS_REGISTERED_USER AS RU 
    ON RU.employee_id = CWI.employee_id
  LEFT JOIN MASTER_BRANCH AS MB 
    ON MB.id = CWI.branch_id
  LEFT JOIN MASTER_DEPARTMENT AS MD 
    ON RU.department_id = MD.dept_id
  WHERE CWI.isDeleted = false 
    AND CWI.entity_id = :entity_id
    AND CWI.id = :id
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


exports.delete_welfare_inspec_by_id = async (req, res) => {
    try {
        const { id } = req.query;
        const data = await db.welfare_inspection.findOne({ where: { id: id } });

        if (!data) {
            return res.status(404).send({ code: 404, message: "Record not found!" });
        }

        await db.welfare_inspection.update({ isDeleted: true }, { where: { id: id } });
        return res.status(200).send({ code: 200, message: "Deleted successfully!" });
    } catch (error) {
        return res.status(500).send({ code: 500, message: "Internal server error!" });
    }
}