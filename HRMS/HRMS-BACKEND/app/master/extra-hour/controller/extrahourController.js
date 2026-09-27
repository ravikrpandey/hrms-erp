
const db = require("../../../models/index");

const logger = require('../../../../logger/index');
class extrahourController {

 async  create_extraHour(req, res) {
  try {
    const { from, to, percentage, entity_id, created_by, id } = req.body;

    if (!from || !to || !percentage || !entity_id || !created_by) {
      return res.status(400).send({
        code: 400,
        message: "Missing required fields: from, to, percentage, entity_id, created_by",
      });
    }

    if (id) {
      const existing = await db.extrahour_Master.findByPk(id);
      if (!existing) {
        return res.status(404).send({
          code: 404,
          message: `Extra hour entry with ID ${id} not found`,
        });
      }

      await existing.update({
        from,
        to,
        percentage,
        entity_id,
        created_by,
      });

      return res.status(200).send({
        code: 200,
        message: "Extra hour updated successfully",
        data: existing,
      });
    } else {
      const newRecord = await db.extrahour_Master.create({
        from,
        to,
        percentage,
        entity_id,
        created_by,
      });

      return res.status(201).send({
        code: 201,
        message: "Extra hour created successfully",
        data: newRecord,
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
}

async getAll_extraHour(req, res) {
  try {
    const { entity_id, created_by, role } = req.query;

    let baseQuery = `
      SELECT H.id, H.from, H.to, H.percentage,
      CONCAT(U.first_name, ' ', U.last_name) AS created_by
      FROM MASTER_EXTRA_HOUR AS H
      INNER JOIN HRMS_REGISTERED_USER AS U ON U.employee_id = H.created_by
      WHERE H.entity_id = :entity_id
    `;

    if (role !== 'Super Admin') {
      baseQuery += ' AND H.created_by = :created_by';
    }

    const response = await db.sequelize.query(baseQuery, {
      replacements: { entity_id, created_by },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: 'Data fetched successfully',
      data: response,
    });

  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
}
async get_extraHourbyId(req, res) {
  try {
    const { id } = req.query;

    let baseQuery = `
      SELECT * FROM MASTER_EXTRA_HOUR AS H WHERE H.id= :id;
    `;

    const [response] = await db.sequelize.query(baseQuery, {
      replacements: { id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      code: 200,
      message: 'Data fetched successfully',
      data: response,
    });

  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
}


}




module.exports = new extrahourController();