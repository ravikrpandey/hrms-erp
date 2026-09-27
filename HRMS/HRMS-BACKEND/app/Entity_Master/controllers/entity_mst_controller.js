const db = require("../../models/index");
/** create enity master */
exports.createEntityMaster = async (req, res) => {
  try {
    const {
      stake_holder_form,
      entity_name,
      tax_registeration_number,
      registered_office,
      smtp_server_address,
      smtp_port_no,
      username,
      password,
      employee_code_prefix,
      employer_name,
      country_id,
      currency_id,
      pf,
      esic,
      tan,
      pan,
      lin,
      gst,
      registration_certificate,
      zip_code,
      state_id,
      address,
      company_id,
      branch_id,
    } = req.body;

    let stakeholders = JSON.parse(stake_holder_form);

    // check duplicate entity
    const isExitEntity = await db.entityMaster.findOne({
      where: { entity_name: entity_name, isDeleted: false },
    });
    if (isExitEntity) {
      return res
        .status(400)
        .send({ code: 400, message: "Entity Name Already Exist" });
    }

    const company_detail = await db.company_master.findOne({
      where: { id: company_id, status: "ACTIVE", isDeleted: false },
    });
    const branch_detail = await db.tbl_branch.findOne({
      where: { id: branch_id, status: "ACTIVE", isDeleted: false },
    });

    const company_name = company_detail.company_name;
    const branch_name = branch_detail.branch_name;
    const company_branch = company_name + "-" + branch_name;

    let logo = null;
    let signature_file = null;

    if (req.files && req.files["company_logo"]) {
      logo = req.files["company_logo"][0].filename;
    }
    if (req.files && req.files["signature_logo"]) {
      signature_file = req.files["signature_logo"][0].filename;
    }

    const saveEntity = await db.entityMaster.create({
      entity_name,
      tax_registration_number: tax_registeration_number,
      registered_office,
      logo,
      signature_logo: signature_file,
      smtp_server_address,
      smtp_port_number: smtp_port_no,
      smtp_username: username,
      smtp_password: password,
      employee_code_prefix,
      employer_name,
      country_id,
      company_id,
      branch_id,
      company_branch,
      currency_id,
      pf_number: pf,
      esic_number: esic,
      tan_number: tan,
      pan_number: pan,
      lin_number: lin,
      gst_number: gst,
      registration_certificate_number: registration_certificate,
      zip_code,
      states_id: state_id,
      address,
    });

    if (saveEntity) {
      const stakeHolder_data = stakeholders.map((stakeHolder) => ({
        ...stakeHolder,
        entity_id: saveEntity.id,
      }));

      await db.entityStake.bulkCreate(stakeHolder_data);
    }

    return res
      .status(200)
      .send({ code: 200, message: "Entity Created Successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAll_Entity = async (req, res) => {
  try {
    const query = `
        SELECT 
            EM.id AS entity_id,
            EM.branch_id,
            EM.company_branch,
            EM.entity_name,
            CM.company_name,
            CM.abbreviation,
            B.branch_name,
            EM.tax_registration_number,
            EM.registered_office,
            EM.logo,
            EM.signature_logo,
            EM.smtp_server_address,
            EM.smtp_port_number,
            EM.smtp_username,
            EM.smtp_password,
            EM.status,
            EM.createdAt AS entity_createdAt,
            EM.updatedAt AS entity_updatedAt,
            EM.employee_code_prefix,
            EM.employer_name,
            EM.country_id,
            EM.company_id,
            EM.currency_id,
            EM.zip_code,
            EM.states_id,
            EM.address,
            EM.pf_number,
            EM.esic_number,
            EM.tan_number,
            EM.pan_number,
            EM.lin_number,
            EM.gst_number,
            EM.registration_certificate_number,
            ES.id AS stakeholder_id,
            ES.stakeholder_name AS stakeholder_name,
            ES.designation AS stakeholder_designation,
            ES.status AS stakeholder_status,
            ES.createdAt AS stakeholder_createdAt,
            ES.updatedAt AS stakeholder_updatedAt,
            ES.contact_no AS stakeholder_contact_no,
            ES.email_id AS stakeholder_email_id
        FROM ENTITY_MASTER EM
        LEFT JOIN ENTITY_STAKEHOLDER AS ES 
            ON EM.id = ES.entity_id AND ES.isDeleted = false
        LEFT JOIN COMPANY_DETAILS_MASTER AS CM 
            ON CM.id = EM.company_id AND CM.isDeleted = false
        LEFT JOIN MASTER_BRANCH AS B 
            ON B.id = EM.branch_id AND B.isDeleted = false
        WHERE EM.isDeleted = false`;

    const results = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const entities = [];
    const entityMap = new Map();

    results.forEach((row) => {
      const entityKey = row.entity_id;

      if (!entityMap.has(entityKey)) {
        entityMap.set(entityKey, {
          entity_id: row.entity_id,
          entity_name: row.entity_name,
          company_name: row.company_name,
          branch_name: row.branch_name,
          company_branch: row.company_branch,
          tax_registration_number: row.tax_registration_number,
          registered_office: row.registered_office,
          logo: row.logo,
          signature_logo:row.signature_logo,
          smtp_server_address: row.smtp_server_address,
          smtp_port_number: row.smtp_port_number,
          smtp_username: row.smtp_username,
          smtp_password: row.smtp_password,
          status: row.status,
          entity_createdAt: row.entity_createdAt,
          entity_updatedAt: row.entity_updatedAt,
          employee_code_prefix: row.employee_code_prefix,
          employer_name: row.employer_name,
          country_id: row.country_id,
          company_id: row.company_id,
          currency_id: row.currency_id,
          zip_code: row.zip_code,
          states_id: row.states_id,
          address: row.address,
          pf_number: row.pf_number,
          esic_number: row.esic_number,
          tan_number: row.tan_number,
          pan_number: row.pan_number,
          lin_number: row.lin_number,
          gst_number: row.gst_number,
          registration_certificate_number: row.registration_certificate_number,
          stakeholders: [],
        });
      }

      if (row.stakeholder_id) {
        entityMap.get(entityKey).stakeholders.push({
          stakeholder_id: row.stakeholder_id,
          stakeholder_name: row.stakeholder_name,
          stakeholder_designation: row.stakeholder_designation,
          stakeholder_status: row.stakeholder_status,
          stakeholder_createdAt: row.stakeholder_createdAt,
          stakeholder_updatedAt: row.stakeholder_updatedAt,
          stakeholder_contact_no: row.stakeholder_contact_no,
          stakeholder_email_id: row.stakeholder_email_id,
        });
      }
    });

    entityMap.forEach((value) => {
      entities.push(value);
    });

    return res.status(200).send({
      code: 200,
      message: "Get All Data Successfully",
      data: entities,
    });
  } catch (error) {
    console.error("Error fetching entity data: ", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.new_getAll_Entity = async (req, res) => {
  try {
    const query = `
        SELECT 
            EM.company_branch,
            EM.entity_name,
            CM.company_name,
            CM.abbreviation,
            B.branch_name,
            EM.tax_registration_number,
            EM.registered_office,
            EM.logo,
            EM.signature_logo,
            EM.smtp_server_address,
            EM.smtp_port_number,
            EM.smtp_username,
            EM.smtp_password,
            EM.status,
            EM.employee_code_prefix,
            EM.employer_name
        FROM ENTITY_MASTER EM
        LEFT JOIN COMPANY_DETAILS_MASTER AS CM ON CM.id = EM.company_id AND CM.isDeleted = false
        LEFT JOIN MASTER_BRANCH AS B ON B.id = EM.branch_id AND B.isDeleted = false
        WHERE EM.isDeleted = false`;

    const results = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const entities = results.map((row) => ({
      company_branch: row.company_branch,
      entity_name: row.entity_name,
      company_name: row.company_name,
      abbreviation: row.abbreviation,
      branch_name: row.branch_name,
      tax_registration_number: row.tax_registration_number,
      registered_office: row.registered_office,
      logo: row.logo,
      signature_logo:row.logo,
      smtp_server_address: row.smtp_server_address,
      smtp_port_number: row.smtp_port_number,
      smtp_username: row.smtp_username,
      smtp_password: row.smtp_password,
      status: row.status,
      entity_createdAt: row.entity_createdAt,
      entity_updatedAt: row.entity_updatedAt,
      employee_code_prefix: row.employee_code_prefix,
      employer_name: row.employer_name,
    }));

    return res.status(200).send({
      code: 200,
      message: "Get All Data Successfully",
      data: entities,
    });
  } catch (error) {
    console.error("Error fetching entity data: ", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getById_Entity = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
        SELECT 
            EM.id AS entity_id,
            EM.company_branch,
            EM.entity_name,
            EM.branch_id,
            C.company_name,
            C.abbreviation,
            B.branch_name,
            EM.tax_registration_number,
            EM.registered_office,
            EM.logo,
            EM.signature_logo,
            EM.smtp_server_address,
            EM.smtp_port_number,
            EM.smtp_username,
            EM.smtp_password,
            EM.status,
            EM.employee_code_prefix,
            EM.employer_name,
            EM.company_id,
            EM.country_id,
            CM.countryss_name,
            MS.states_name,
            EM.currency_id,
            EM.zip_code,
            EM.states_id,
            EM.address,
            EM.pf_number,
            EM.esic_number,
            EM.tan_number,
            EM.pan_number,
            EM.lin_number,
            EM.gst_number,
            EM.registration_certificate_number,
            EM.createdAt AS entity_createdAt,
            EM.updatedAt AS entity_updatedAt,
            ES.id AS stakeholder_id,
            ES.stakeholder_name AS stakeholder_name,
            ES.designation AS stakeholder_designation,
            ES.status AS stakeholder_status,
            ES.createdAt AS stakeholder_createdAt,
            ES.updatedAt AS stakeholder_updatedAt,
            ES.contact_no AS stakeholder_contact_no,
            ES.email_id AS stakeholder_email_id
        FROM ENTITY_MASTER EM
        LEFT JOIN ENTITY_STAKEHOLDER ES 
            ON EM.id = ES.entity_id AND ES.isDeleted = false
        LEFT JOIN COMPANY_DETAILS_MASTER AS C 
            ON C.id = EM.company_id AND C.isDeleted = false
        LEFT JOIN MASTER_BRANCH AS B 
            ON B.id = EM.branch_id AND B.isDeleted = false
        LEFT JOIN MASTER_COUNTRY CM 
            ON EM.country_id = CM.countryss_id
        LEFT JOIN MASTER_STATE MS
            ON EM.states_id = MS.states_id            
        WHERE EM.isDeleted = false AND EM.id = :entity_id`;

    const results = await db.sequelize.query(query, {
      replacements: { entity_id: id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return res.status(404).send({ code: 404, message: "Entity not found" });
    }

    const entity = {
      entity_id: results[0].entity_id,
      entity_name: results[0].entity_name,
      tax_registration_number: results[0].tax_registration_number,
      registered_office: results[0].registered_office,
      logo: results[0].logo,
      signature_logo:results[0].signature_logo,
      smtp_server_address: results[0].smtp_server_address,
      smtp_port_number: results[0].smtp_port_number,
      smtp_username: results[0].smtp_username,
      smtp_password: results[0].smtp_password,
      status: results[0].status,
      entity_createdAt: results[0].entity_createdAt,
      entity_updatedAt: results[0].entity_updatedAt,
      employee_code_prefix: results[0].employee_code_prefix,
      employer_name: results[0].employer_name,
      company_id: results[0].company_id,
      country_id: results[0].country_id,
      branch_id: results[0].branch_id,
      company_branch: results[0].company_branch,
      currency_id: results[0].currency_id,
      zip_code: results[0].zip_code,
      state_id: results[0].states_id,
      address: results[0].address,
      pf_number: results[0].pf_number,
      esic_number: results[0].esic_number,
      tan_number: results[0].tan_number,
      pan_number: results[0].pan_number,
      lin_number: results[0].lin_number,
      gst_number: results[0].gst_number,
      registration_certificate_number:
        results[0].registration_certificate_number,
      stakeholders: results
        .filter((row) => row.stakeholder_id)
        .map((row) => ({
          stakeholder_id: row.stakeholder_id,
          stakeholder_name: row.stakeholder_name,
          stakeholder_designation: row.stakeholder_designation,
          stakeholder_status: row.stakeholder_status,
          stakeholder_createdAt: row.stakeholder_createdAt,
          stakeholder_updatedAt: row.stakeholder_updatedAt,
          stakeholder_contact_no: row.stakeholder_contact_no,
          stakeholder_email_id: row.stakeholder_email_id,
        })),
    };

    return res.status(200).send({
      code: 200,
      message: "Entity fetched successfully",
      data: entity,
    });
  } catch (error) {
    console.error("Error fetching entity data: ", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/** update entity master */
exports.update_Entity = async (req, res) => {
  try {
    let entity_id = req.params.id;
    let {
      stake_holder_form,
      entity_name,
      tax_registeration_number,
      registered_office,
      smtp_server_address,
      smtp_port_no,
      username,
      password,
      employee_code_prefix,
      employer_name,
      country_id,
      company_id,
      currency_id,
      pf,
      esic,
      tan,
      pan,
      lin,
      gst,
      registration_certificate,
      zip_code,
      state_id,
      address,
      branch_id,
    } = req.body;

    // handle JSON parsing safely
    stake_holder_form =
      typeof stake_holder_form === "string"
        ? JSON.parse(stake_holder_form)
        : stake_holder_form;

    // check for duplicate entity name (except current)
    const existingEntity = await db.entityMaster.findOne({
      where: {
        entity_name: entity_name,
        isDeleted: false,
        id: { [db.Sequelize.Op.ne]: entity_id },
      },
    });

    if (existingEntity) {
      return res
        .status(400)
        .send({ code: 400, message: "Entity name already exists" });
    }

    // fetch company & branch
    const company_detail = await db.company_master.findOne({
      where: { id: company_id, status: "ACTIVE", isDeleted: false },
    });
    if (!company_detail) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid company selected" });
    }

    const branch_detail = await db.tbl_branch.findOne({
      where: { id: branch_id, status: "ACTIVE", isDeleted: false },
    });
    if (!branch_detail) {
      return res
        .status(400)
        .send({ code: 400, message: "Invalid branch selected" });
    }

    const company_name = company_detail.company_name;
    const branch_name = branch_detail.branch_name;
    const company_branch = company_name + "-" + branch_name;

    // 🔹 Fetch existing entity to keep old logos if not updated
    const existingEntityData = await db.entityMaster.findOne({
      where: { id: entity_id, isDeleted: false },
    });

    if (!existingEntityData) {
      return res.status(404).send({ code: 404, message: "Entity not found" });
    }

    // handle logo
    let logo;
    let signature_file;

    if (req.files && req.files["company_logo"]) {
      logo = req.files["company_logo"][0].filename;
    } else {
      logo = existingEntityData.logo; // keep old logo
    }

    if (req.files && req.files["signature_logo"]) {
      signature_file = req.files["signature_logo"][0].filename;
    } else {
      signature_file = existingEntityData.signature_logo; // keep old signature logo
    }

    // update entity
    const saveEntity = await db.entityMaster.update(
      {
        entity_name,
        tax_registration_number: tax_registeration_number,
        registered_office,
        logo,
        signature_logo: signature_file,
        smtp_server_address,
        smtp_port_number: smtp_port_no,
        smtp_username: username,
        smtp_password: password,
        employee_code_prefix,
        employer_name,
        country_id,
        company_id,
        branch_id,
        company_branch,
        currency_id,
        pf_number: pf,
        esic_number: esic,
        tan_number: tan,
        pan_number: pan,
        lin_number: lin,
        gst_number: gst,
        registration_certificate_number: registration_certificate,
        zip_code,
        states_id:state_id,
        address,
      },
      { where: { id: entity_id } }
    );

    if (saveEntity) {
      // clear old stakeholders
      await db.entityStake.destroy({
        where: { entity_id },
        force: true,
      });

      // add new stakeholders
      if (stake_holder_form?.length) {
        const stakeHolder_data = stake_holder_form.map((stakeHolder) => ({
          ...stakeHolder,
          entity_id,
        }));

        await db.entityStake.bulkCreate(stakeHolder_data);
      }
    }

    return res
      .status(200)
      .send({ code: 200, message: "Entity Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};


exports.delete_Entity = async (req, res) => {
  try {
    const entity_id = req.params.id;

    let existCompany = await db.entityMaster.findOne({
      where: { id: entity_id, isDeleted: true },
    });
    if (existCompany) {
      return res
        .status(404)
        .send({ code: 404, message: "Entity Already Deleted" });
    }

    let del_stack = await db.entityStake.update(
      { isDeleted: true },
      { where: { entity_id: entity_id } }
    );

    let del_Company = await db.entityMaster.update(
      { isDeleted: true },
      { where: { id: entity_id } }
    );

    return res
      .status(200)
      .send({ code: 200, message: "Entity Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting entity data: ", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.status_entity = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (status === undefined) {
      return res.status(400).send({
        code: 400,
        message:
          "Bad Request: 'status' property is missing in the request body",
      });
    }

    await db.entityMaster.update(
      {
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return res.status(200).send({
      code: 200,
      message: "Entity Status Changed Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllactive_Entity = async (req, res) => {
  try {
    const query = `
        SELECT 
            EM.id AS entity_id,EM.company_branch,
            EM.entity_name,
            EM.tax_registration_number,
            EM.registered_office,
            EM.logo,
            EM.signature_logo,
            EM.smtp_server_address,
            EM.smtp_port_number,
            EM.smtp_username,
            EM.smtp_password,
            EM.company_branch,
            EM.status,
            EM.employee_code_prefix,
            EM.employer_name,
            EM.createdAt AS entity_createdAt,
            EM.updatedAt AS entity_updatedAt,
            ES.id AS stakeholder_id,
            ES.stakeholder_name AS stakeholder_name,
            ES.designation AS stakeholder_designation,
            ES.status AS stakeholder_status,
            ES.createdAt AS stakeholder_createdAt,
            ES.updatedAt AS stakeholder_updatedAt,
            ES.contact_no AS stakeholder_contact_no,
            ES.email_id AS stakeholder_email_id
        FROM ENTITY_MASTER EM
        LEFT JOIN ENTITY_STAKEHOLDER ES ON EM.id = ES.entity_id AND ES.isDeleted = false
        WHERE EM.isDeleted = false AND EM.status = "ACTIVE"`;

    const results = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    const entities = [];

    const entityMap = new Map();

    results.forEach((row) => {
      const entityKey = row.entity_id;

      if (!entityMap.has(entityKey)) {
        entityMap.set(entityKey, {
          entity_id: row.entity_id,
          entity_name: row.entity_name,
          tax_registration_number: row.tax_registration_number,
          registered_office: row.registered_office,
          logo: row.logo,
          company_branch: row.company_branch,
          smtp_server_address: row.smtp_server_address,
          smtp_port_number: row.smtp_port_number,
          smtp_username: row.smtp_username,
          smtp_password: row.smtp_password,
          status: row.status,
          entity_createdAt: row.entity_createdAt,
          entity_updatedAt: row.entity_updatedAt,
          employee_code_prefix: row.employee_code_prefix,
          employer_name: row.employer_name,
          stakeholders: [],
        });
      }

      if (row.stakeholder_id) {
        entityMap.get(entityKey).stakeholders.push({
          stakeholder_id: row.stakeholder_id,
          stakeholder_name: row.stakeholder_name,
          stakeholder_designation: row.stakeholder_designation,
          stakeholder_status: row.stakeholder_status,
          stakeholder_createdAt: row.stakeholder_createdAt,
          stakeholder_updatedAt: row.stakeholder_updatedAt,
          stakeholder_contact_no: row.stakeholder_contact_no,
          stakeholder_email_id: row.stakeholder_email_id,
        });
      }
    });

    entityMap.forEach((value) => {
      entities.push(value);
    });

    return res.status(200).send({
      code: 200,
      message: "Get All Data Successfully",
      data: entities,
    });
  } catch (error) {
    console.error("Error fetching entity data: ", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/** get all company */
exports.getAllCompany = async (req, res) => {
  try {
    // const query = 'SELECT company_id FROM COMPANY_DETAILS_MASTER';

    const query = `
        SELECT C.* FROM COMPANY_DETAILS_MASTER C where C.isDeleted = 0 and C.status="ACTIVE"`;

    const results = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (results.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Data Fetched Successfully!",
        data: results,
      });
    } else {
      return res.status(404).send({ code: 200, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

/** get all company */
exports.getAllEntityBranch = async (req, res) => {
  try {
    const { company_id } = req.query;

    const query = `
            SELECT * 
            FROM COMPANY_DETAILS_MASTER 
            WHERE isDeleted = 0 AND status = "ACTIVE" AND company_id = :company_id`;

    const results = await db.sequelize.query(query, {
      replacements: { company_id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    const message =
      results.length > 0 ? "Data Fetched Successfully!" : "No Data Found";
    const statusCode = results.length > 0 ? 200 : 404;

    return res
      .status(statusCode)
      .send({ code: statusCode, message, data: results });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};
