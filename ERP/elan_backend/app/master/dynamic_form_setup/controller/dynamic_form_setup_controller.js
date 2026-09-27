
const db = require("../../../models/index");

module.exports.createFromSetup = async (req, res) => {
  try {
    const { field_type_id, dynamic_field_name, component_type_id } = req.body;
    const type_id = parseInt(field_type_id);
     const comp_type_id = parseInt(component_type_id)

    const fieldTypeExists = await db.models.fieldType.findOne({
      where: { id: type_id },
    });

const componentTypeExist = await db.models.dynamicComponentType.findOne({
  where: {id: comp_type_id}
})

    const dataExists = await db.models.dynamicFieldName.findOne({
      where: {
        field_type_id: type_id,
        dynamic_field_name: dynamic_field_name,
        component_type_id : comp_type_id,
      },
    });

    
    if (!dataExists && fieldTypeExists && componentTypeExist) {
      const createLeadFormSetup = await db.models.dynamicFieldName.create({
        field_type_id: type_id,
        dynamic_field_name,
        component_type_id : comp_type_id,
      });

      if (createLeadFormSetup) {
        return res.status(201).send({ code: 201, message: "Created Successfully" });
      } else {
        return res.status(500).send({ code: 500, message: "Failed to create formsetup" });
      }
    } else if (dataExists) {
      return res.status(409).send({ code: 409, message: "Data already exists" });
    } else {
      return res.status(404).send({ code: 404, message: "Field Type not found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};


module.exports.getFormSetup = async (req, res) => {
  try {
    const { id } = req.params;
    const getFormSetup = await db.sequelize.query(
      `SELECT L.id, L.dynamic_field_name, L.component_type_id, T.component_type, L.status, L.mandatory, S.field_type, L.field_type_id,
      DATE_FORMAT(L.createdAt, '%Y-%m-%d') AS createdAt
      FROM DYNAMIC_FIELD_NAME AS L
      INNER JOIN SYS_FIELD_TYPE_MST AS S ON L.field_type_id = S.id
      INNER JOIN DYNAMIC_COMPONENT_TYPE AS T ON L.component_type_id = T.id
      WHERE L.component_type_id = ? AND L.status = true
      ORDER BY T.id DESC`,
      {
        replacements: [id],
        type: db.sequelize.QueryTypes.SELECT
      }
    );
    if (getFormSetup.length > 0) { 
      return res
        .status(200)
        .send({ code: 200, message: "Success", data: getFormSetup });
    } else {
      return res.status(404).send({ code: 404, message: "Not Found", data: [] });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

module.exports.getFormSetup_all = async (req, res) => {
  try {
    
    const getFormSetup = await db.sequelize.query(
      `SELECT L.id, L.dynamic_field_name, L.component_type_id,T.component_type, L.status, L.mandatory, S.field_type, L.field_type_id,
      DATE_FORMAT(L.createdAt, '%Y-%m-%d') AS createdAt
      FROM DYNAMIC_FIELD_NAME AS L
      INNER JOIN SYS_FIELD_TYPE_MST AS S ON L.field_type_id = S.id
      INNER JOIN DYNAMIC_COMPONENT_TYPE AS T ON L.component_type_id = T.id
      
      ORDER BY T.id DESC`
    );
    if (getFormSetup[0].length > 0) { // Check if any data is returned
      return res
        .status(200)
        .send({ code: 200, message: "Success", data: getFormSetup[0] });
    } else {
      return res.status(200).send({ code: 200, message: "Not Found" ,data: getFormSetup[0] });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};


exports. updateFormSetup = async (req, res) => {
  try {
    const { field_type_id, dynamic_field_name, id, status, mandatory } = req.body;
    const existingRecord = await db.models.dynamicFieldName.findOne({ where: { id } });
    
    if (!existingRecord) {
      return res.status(404).send({ code: 404, message: "Record with specified ID not found!" });
    }

    const fieldTypeExists = await db.models.fieldType.findOne({ where: { id: field_type_id } });
    
    if (!fieldTypeExists) {
      return res.status(404).send({ code: 404, message: "Field Type not found!" });
    }

    const dataExists = await db.models.dynamicFieldName.findOne({
      where: { field_type_id, dynamic_field_name }
    });

    if (dataExists) {
      const [rowsUpdated] = await db.models.dynamicFieldName.update(
        { status, mandatory },
        { where: { id } }
      );
      
      if (rowsUpdated === 1) {
        return res.status(200).send({ code: 200, message: "Successfully Updated!" });
      } else {
        return res.status(404).send({ code: 404, message: "No changes made during update!" });
      }
    } else {
      const [rowsUpdated] = await db.models.dynamicFieldName.update(
        { field_type_id, dynamic_field_name, status, mandatory },
        { where: { id } }
      );

      if (rowsUpdated === 1) {
        return res.status(200).send({ code: 200, message: "Successfully Updated!" });
      } else {
        return res.status(404).send({ code: 404, message: "No changes made during update!" });
      }
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message|| "Server Error" });
  }
};


module.exports.formDynamicFieldValue = async (req, res) => {
  try {
    const form_field = req.body;
    const {field_name_id}= req.query;
    if (!Array.isArray(form_field)) {
      return res.status(400).send({ code: 400, message: "Invalid request format. Expected an array of form_field." });
    }

    const results = [];
    await db.models.dynamicFieldValue.destroy({
      where: { field_name_id },
    });
    for (const form of form_field) {
      const { dynamic_field_value } = form;
      const existFieldName = await db.models.dynamicFieldName.findOne({ where: { id: field_name_id } });

      if (existFieldName) {
        const createFormField = await db.models.dynamicFieldValue.create({
          field_name_id: field_name_id,
          dynamic_field_value
          
        });

        results.push(createFormField ? { success: true, message: "Lead created successfully" } : { success: false, message: "Failed to create lead" });
      } else {
        results.push({ success: false, message: "Record with specified ID not found for lead" });
      }
    }

    const successResults = results.filter((result) => result.success);

    if (successResults.length > 0) {
      return res.status(201).send({ code: 201, message: "Created Successfully" });
    } else {
      return res.status(500).send({ code: 500, message: "Failed to create leads"});
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};


module.exports.getDynamicFormDetails = async (req, res) => {
  try {
    let { id } = req.params;
    const getFieldNameData = await db.sequelize.query(`
      SELECT 
        DN.id,
        DN.dynamic_field_name AS field_name,
        FT.field_type,
        DN.mandatory,
        DN.component_type_id,
        DFV.DYNAMIC_FIELD_VALUE AS field_value,
        FT.id AS field_type_id
      FROM 
        DYNAMIC_FIELD_NAME AS DN
        INNER JOIN SYS_FIELD_TYPE_MST AS FT ON FT.id = DN.field_type_id
        LEFT JOIN DYNAMIC_FIELD_VALUE AS DFV ON DFV.field_name_id = DN.id
      WHERE 
        DN.component_type_id = ${id}
        AND DN.status = ${true}
       
    `, {
      replacements: { id: id },
      type: db.sequelize.QueryTypes.SELECT
    });

    if (getFieldNameData.length > 0) {
      const groupedData = {};
      getFieldNameData.forEach((row) => {
        const key = `${row.field_name}-${row.field_type.toLowerCase()}`;
        if (!(key in groupedData)) {
          groupedData[key] = {
            type: row.field_type.toLowerCase(),
            field_name: row.field_name,
            mandatory: row.mandatory,
            Field_type_id: row.field_type.toLowerCase() === "dropdown" ? row.field_type_id : undefined,
            options: row.field_type.toLowerCase() === "dropdown" || row.field_type.toLowerCase() === 'multi select' ? [] : undefined,
          };
        }
        if (row.field_type.toLowerCase() === "dropdown" || row.field_type.toLowerCase() === 'multi select') {
          groupedData[key]?.options?.push({
            id: row.id,
            field_value: row.field_value || null,
          });
        }
      });

      const formattedData = Object.values(groupedData);

      return res.status(200).send({
        code: 200,
        message: "Success",
        data: formattedData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "Not Found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};



module.exports.getStatusOfDynamicField = async (req, res) => {
  try {
    const { id } = req.params;
    const getStatusNameData = await db.sequelize.query(
      `SELECT C.id, C.dynamic_field_value 
      FROM DYNAMIC_FIELD_VALUE AS C
      INNER JOIN DYNAMIC_FIELD_NAME AS R ON R.id = C.field_name_id
      WHERE R.id = ${id} AND C.status = true`
    );
    if (getStatusNameData[0].length > 0) {
      const fieldName = await db.models.dynamicFieldName.findOne({
        where: { id: id },
        attributes: ["dynamic_field_name"],
      });
      return res.status(200).send({ code: 200, message: "Success", field_detail: fieldName, data: getStatusNameData[0] });
    } else {
      return res.status(404).send({ code: 404, message: "Not Created" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
  }
};








