const db = require("../../../models/index");

module.exports.createLeadFormSetup = async (req, res) => {
  try {
    const { field_type_id, field_name,entity_id,financial_year_id } = req.body;
    const type_id = parseInt(field_type_id);

    const fieldTypeExists = await db.fieldType.findOne({
      where: { id: type_id },
    });

    const dataExists = await db.leadFormSetup.findOne({
      where: {
        field_type_id: type_id,
        field_name: field_name,
      },
    });

    if (!dataExists && fieldTypeExists) {
      const createLeadFormSetup = await db.leadFormSetup.create({
        field_type_id: type_id,
        field_name,
        entity_id,
        financial_year_id
      });

      if (createLeadFormSetup) {
        return res.status(201).send({ code: 201, message: "Created Successfully" });
      } else {
        return res.status(500).send({ code: 500, message: "Failed to create leadFormSetup" });
      }
    } else if (dataExists) {
      return res.status(409).send({ code: 409, message: "Data already exists" });
    } else {
      return res.status(404).send({ code: 404, message: "Field Type not found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message||"Server Error" });
  }
};

module.exports.getLeadFormSetup = async (req, res) => {
  try {
    const {entity_id,financial_year_id} = req.params;
    const getLeadFormSetup = await db.sequelize.query(
      ` SELECT L.id, L.field_name, L.status, L.mandatory, S.field_type ,L.field_type_id,
      DATE_FORMAT(L.createdAt, '%Y-%m-%d') AS createdAt
      FROM CRM_LEAD_FORM_SETUP_MST AS L
      INNER JOIN SYS_FIELD_TYPE_MST AS S ON L.field_type_id = S.id
      WHERE L.entity_id=${entity_id} AND L.financial_year_id=${financial_year_id}
      ORDER BY L.id DESC`
    );
    if (getLeadFormSetup) {
      return res
        .status(200)
        .send({ code: 200, message: "Success", data: getLeadFormSetup[0] });
    } else {
      return res.status(404).send({ code: 404, message: "Not Created" });
    }
  } catch (error) {
    
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

module.exports.updateLeadFormSetup = async (req, res) => {
  try {
    const { field_type_id, field_name, id, status, mandatory } = req.body;
    const existingRecord = await db.leadFormSetup.findOne({ where: { id } });
    
    if (!existingRecord) {
      return res.status(404).send({ code: 404, message: "Record with specified ID not found!" });
    }

    const fieldTypeExists = await db.fieldType.findOne({ where: { id: field_type_id } });
    
    if (!fieldTypeExists) {
      return res.status(404).send({ code: 404, message: "Field Type not found!" });
    }

    const dataExists = await db.leadFormSetup.findOne({
      where: { field_type_id, field_name }
    });

    if (dataExists) {
      const [rowsUpdated] = await db.leadFormSetup.update(
        { status, mandatory },
        { where: { id } }
      );
      
      if (rowsUpdated === 1) {
        return res.status(200).send({ code: 200, message: "Successfully Updated!" });
      } else {
        return res.status(404).send({ code: 404, message: "No changes made during update!" });
      }
    } else {
      const [rowsUpdated] = await db.leadFormSetup.update(
        { field_type_id, field_name, status, mandatory },
        { where: { id } }
      );

      if (rowsUpdated === 1) {
        return res.status(200).send({ code: 200, message: "Successfully Updated!" });
      } else {
        return res.status(404).send({ code: 404, message: "No changes made during update!" });
      }
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};


module.exports.formFieldValue = async (req, res) => {
  try {
    const leads = req.body;
    const {lead_form_id}= req.query;
    if (!Array.isArray(leads)) {
      return res.status(400).send({ code: 400, message: "Invalid request format. Expected an array of leads." });
    }

    const results = [];
    await db.fieldValue.destroy({
      where: { lead_form_id },
    });
    for (const lead of leads) {
      const { field_value } = lead;
      const findLead = await db.leadFormSetup.findOne({ where: { id: lead_form_id } });

      if (findLead) {
        const createdLead = await db.fieldValue.create({
          lead_form_id: lead_form_id,
          field_value,
        });

        results.push(createdLead ? { success: true, message: "Lead created successfully" } : { success: false, message: "Failed to create lead" });
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





