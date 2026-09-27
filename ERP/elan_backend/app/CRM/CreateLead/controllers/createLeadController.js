const { where } = require("sequelize");
const db = require("../../../models/index");
const { Op } = require("sequelize");

module.exports.getLeadData = async (req, res) => {
  try {
    const { today_follow_up, missed_follow_up, upcoming_follow_up, id, login_id, financial_year_id, entity_id } = req.query;
    let condition = "";
    if (today_follow_up === "1") {
      condition = ` WHERE DATE(C.follow_up_date) = CURDATE()`;
    } else if (missed_follow_up === "0") {
      condition = ` WHERE C.follow_up_date < CURDATE()`;
    } else if (upcoming_follow_up === "2") {
      condition = ` WHERE C.follow_up_date > CURDATE()`;
    } else if (id) {
      condition = `WHERE C.id = ${id} AND C.entity_id=${entity_id}`
    }
    const query = `SELECT C.id, C.company_name, C.lead_owner, C.contact_person_name, C.contact_number, C.mail_id, 
    C.lead_created_date, C.follow_up_date, C.upload_image,C.address,C.dynamic_fields,C.source_id,
    DATE_FORMAT(C.createdAt, '%Y-%m-%d') AS createdAt,
    CONCAT_WS(' ', R.first_name, R.middle_name, R.last_name) AS full_name
    FROM CRM_CREATE_LEAD_MST AS C
    INNER JOIN HRMS_REGISTERED_USER AS RU ON RU.employee_id = C.login_id
    LEFT JOIN HRMS_REGISTERED_USER AS R ON R.employee_id = C.user_id
    ${condition} AND JSON_UNQUOTE(JSON_EXTRACT(C.dynamic_fields, '$.status')) != "Deal Close" AND (C.login_id = ${login_id} OR RU.reporting_manager_id = ${login_id}) 
     ORDER BY C.id DESC `
    const data = await db.sequelize.query(query, { replacements: { id }, type: db.sequelize.QueryTypes.SELECT });
    if (id) {
      const crmDetail = await db.createLeadDetails.findAll({
        where: { create_lead_id: id, isDeleted: false },
        include: {
          model: db.ItemMaster
        }
      });
      if (data) {
        return res.status(200).send({ code: 200, message: "Get Data Successfully", data: data[0], crmDetail });
      } else {
        return res.status(404).send({ code: 404, message: "No Data Found " });
      }
    } else {
      return res.status(200).send({ code: 200, message: "Get All Data Successfully", data: data });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getStatusName = async (req, res) => {
  try {
    const { id } = req.params;
    const getStatusNameData = await db.sequelize.query(
      `SELECT C.id,C.field_value FROM CRM_FIELD_VALUE_MST  AS C
      INNER JOIN CRM_LEAD_FORM_SETUP_MST AS R ON R.id= C.lead_form_id
      WHERE R.id = ${id} ORDER BY C.id DESC`
    );
    if (getStatusNameData) {
      const fieldName = await db.leadFormSetup.findOne({
        where: { id: id },
        attributes: ["field_name"],
      });
      return res.status(200).send({ code: 200, message: "Success", field_detail: fieldName, data: getStatusNameData[0] });
    } else {
      return res.status(404).send({ code: 404, message: "Not Created" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

module.exports.getFormDetails = async (req, res) => {
  try {
    const getFieldNameData = await db.sequelize.query(`
      SELECT L.id, L.field_name, F.field_type,L.mandatory, FV.field_value, F.id AS Field_type_id
      FROM CRM_LEAD_FORM_SETUP_MST AS L
      INNER JOIN SYS_FIELD_TYPE_MST AS F ON F.id = L.field_type_id
      LEFT JOIN CRM_FIELD_VALUE_MST AS FV ON FV.lead_form_id = L.id
      WHERE L.status = '1'
    `);

    if (getFieldNameData.length > 0) {
      const groupedData = {};
      getFieldNameData[0].forEach((row) => {
        const key = `${row.field_name}-${row.field_type.toLowerCase()}`;
        if (!(key in groupedData)) {
          groupedData[key] = {
            type: row.field_type.toLowerCase(),
            field_name: row.field_name,
            mandatory: row.mandatory,
            Field_type_id:
              row.field_type.toLowerCase() === "dropdown"
                ? row.Field_type_id
                : undefined,
            options:
              row.field_type.toLowerCase() === "dropdown" ? [] : undefined,
          };
        }
        if (row.field_type.toLowerCase() === "dropdown") {
          groupedData[key].options.push({
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
        message: "Not Created",
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message,
    });
  }
};

module.exports.viewDescription = async (req, res) => {
  try {
    const result = await db.sequelize.query(`
    SELECT C.lead_owner, DATE_FORMAT(D.createdAt, '%Y-%m-%d') AS createdAt , D.description,D.follow_up_date,
    D.stage AS field_value
    FROM CRM_CREATE_LEAD_MST AS C
    INNER JOIN CRM_DESCRIPTION_CREATE_MST AS D ON D.create_lead_id = C.id
    Where C.id=${req.params.id} ORDER BY C.id DESC`);
    if (result[0].length > 0) {
      return res
        .status(200)
        .send({ code: 200, message: "Success", data: result[0] });
    } else {
      return res.status(404).send({ code: 404, message: "Data Not Found " });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

module.exports.updateLeadData = async (req, res) => {
  try {
    const id = req.params.id
    const lead = await db.createLead.findOne({
      where: { id: req.params.id },
      attributes: ['dynamic_fields']
    });
    const createLeadDetails = req.body.createLeadDetails;
    let dynamicFields = lead.dynamic_fields;
    dynamicFields.status = req.body.status;
    const updateData = await db.createLead.update(
      {
        follow_up_date: req.body.follow_up_date,
        upload_image: req.body.upload_image,
        login_id: req.body.login_id,
        dynamic_fields: dynamicFields
      },
      { where: { id: req.params.id } }
    );

    if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {

      await db.createLeadDetails.update(
        { isDeleted: true },
        { where: { create_lead_id: req.params.id, } }
      );
      await Promise.all(
        createLeadDetails.map((item) => {
          const { product_category_id, product_master_id, variant_id } = item;
          return db.createLeadDetails.create(
            {
              product_category_id,
              product_id: product_master_id,
              variant_id,
              create_lead_id: id
            },
            // { where: { create_lead_id: req.params.id } }
          );
        })
      );
    }

    await db.createDescription.upsert(
      {
        description: req.body.description,
        create_lead_id: req.params.id,
        stage: req.body.status,
        follow_up_date: req.body.follow_up_date
      },
      { where: { create_lead_id: req.params.id } }
    );
    if (updateData) {
      return res
        .status(200)
        .send({ code: 200, message: "Lead has been Updated Successfully!" });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to Update" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message || " Server Error" });
  }
};

module.exports.createLead = async (req, res) => {
  try {
    const { financial_year_id, entity_id, product_category_id, product_id, user_id, login_id, createLeadDetails, source_id } = req.body;

    // const checkProduct = await db.product_master.findOne({
    //   where: {product_category_id, id: product_id },
    // });

    // if (!checkProduct) {
    //   return res.status(400).send({ code: 400, message: "No Product Data Found" });
    // }
    const mainFields = {
      entity_id,
      financial_year_id,
      product_category_id,
      product_id: product_id,
      user_id: login_id,
      login_id: login_id,
      company_name: req.body.company_name,
      lead_owner: req.body.lead_owner,
      contact_person_name: req.body.contact_person_name,
      contact_number: req.body.contact_number,
      mail_id: req.body.mail_id,
      address: req.body.address,
      lead_created_date: req.body.lead_created_date,
      follow_up_date: req.body.follow_up_date,
      upload_image: req.body.upload_image,
      source_id: source_id,
    };
    const dynamicFields = Object.keys(req.body)
      .filter((key) => !(key in mainFields))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
    const dynamicData = dynamicFields;
    const createData = await db.createLead.create({
      ...mainFields,
      dynamic_fields: dynamicData,
    });

    if (Array.isArray(createLeadDetails) && createLeadDetails.length > 0) {
      await Promise.all(createLeadDetails.map((item) => {
        const { product_category_id, product_master_id, variant_id, product_sub_category_id } = item;
        return db.createLeadDetails.create({
          product_category_id,
          product_id: product_master_id,
          pro_sub_cat_id: product_sub_category_id,
          // variant_id:null,
          create_lead_id: createData.id
        });
      }));
    }

    await db.createDescription.create({
      create_lead_id: createData.id,
      description: req.body.description,
      stage: dynamicData.status,
      follow_up_date: req.body.follow_up_date
    });

    if (createData) {
      return res.status(201).send({ code: 201, message: "Created Successfully" });
    } else {
      return res.status(400).send({ code: 400, message: "Failed to Create Lead" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

// module.exports.getAllClientNames = async (req, res) => {
//   try {
//     let client_id = req.params.client_id;
//       const getAllData = await db.customerProfile.findOne({where:{id:client_id},
//         include:[
//           {model:db.customerAddressContact}
//         ]
//       });
//       // const [getAllData] = await db.sequelize.query(`
//       // SELECT CPD.id, CLM.company_name,CLM.contact_person_name,CLM.contact_number, CLM.mail_id, CLM.address, 
//       // CLM.lead_created_date, CLM.follow_up_date, CLM.upload_image,CLM.dynamic_fields,MS.source_name
//       // FROM CRM_PROPOSAL_DEAL_CLOSE_MST AS CPD
//       // INNER JOIN CRM_CREATE_PROPOSAL_MST AS CPM ON CPM.id=CPD.proposal_id
//       // INNER JOIN CRM_CREATE_LEAD_MST AS CLM ON CLM.id=CPM.create_lead_id
//       // INNER JOIN MASTER_SOURCE AS MS ON CLM.source_id=MS.id
//       // WHERE CPD.status=1 AND CPM.status=1 AND CLM.status=1 AND JSON_CONTAINS(CLM.dynamic_fields, '{"status":"Deal Close"}')`)
//       if (getAllData) {
//         return res.status(200).send({ code: 200, message: "Fetch All Clients Successfully", data: getAllData });
//       } else {
//         return res.status(200).send({ code: 200, message: "Record Not Found", data: getAllData });
//       }

//   } catch (error) {
//     return res.status(500).send({ code: 500, message: "Server Error" });
//   }
// }


module.exports.getAllClientNames = async (req, res) => {
  try {
    let client_id = req.params.client_id;
    let { proposal_no } = req.body;

    // Get main customer and address/contact info
    const [getAllData] = await db.sequelize.query(
      `SELECT cp.*, cac.contact_person_name AS contact_person , cac.mobile, cac.email_id, CAM.billing_address AS address, cac.title,
      CAM.billing_pin_code AS pincode, CAM.billing_country_id AS country_id, CAM.billing_state_id AS state_id, SCDM.sactioned_credit_limit, SCDM.utilized_credit_limit, SCDM.sactioned_credit_period, SCDM.available_credit_limit,
      CAM.billing_city_id AS city_id , CAM.billing_postal_address AS postal_address
      FROM CUSTOMER_PROFILE_MST cp
       LEFT JOIN CUSTOMER_ADDRESS_MST AS CAM ON CAM.customer_id = cp.id
       LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST cac 
       LEFT JOIN SALES_SUPER_CREDIT_DEBIT_MST AS SCDM ON SCDM.customer_id = :client_id
       ON cp.id = cac.customer_id WHERE cp.id = :client_id`,
      {
        replacements: { client_id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    await remove_scheme_exist_customer(client_id, proposal_no)
    // Get customer item list
    const customerItems = await db.sequelize.query(
      `SELECT DISTINCT 
    cil.*, 
    mi.item_name, 
    mi.item_code, 
    mi.description, 
    mi.hsn_code_id, 
    mi.variant, 
    ma.asset_category_name, 
    ms.scheme_name,
    msc.sub_category_name
FROM CUSTOMER_ITEM_LIST AS cil
LEFT JOIN MASTER_ITEM AS mi ON mi.id = cil.product_id
LEFT JOIN MASTER_ASSET AS ma ON ma.id = cil.product_category_id
LEFT JOIN MASTER_SUB_CATEGORY AS msc ON msc.id = cil.pro_sub_cat_id
LEFT JOIN MASTER_SCHEME AS ms ON ms.id = cil.scheme_id
WHERE cil.customer_id = :client_id
  AND cil.isDeleted = 0`,
      {
        replacements: { client_id },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );


    // Attach schemes inside each item
    for (const item of customerItems) {

      const schemeResult = await db.sequelize.query(
        `SELECT * FROM CRM_PROPOSAL_SCHEME_TYPE WHERE customer_item_id = :item_id LIMIT 1`,
        {
          replacements: { item_id: item.id },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      const scheme = schemeResult[0];

      if (scheme) {
        const customisationData = await db.sequelize.query(
          `SELECT * FROM CRM_PROPOSAL_SCHEME_DATA WHERE proposal_scheme_type_id = :scheme_id`,
          {
            replacements: { scheme_id: scheme.id },
            type: db.sequelize.QueryTypes.SELECT,
          }
        );

        scheme.customisationData = customisationData;
        item.scheme = scheme;
      }

      const brandingResult = await db.sequelize.query(
        `SELECT * FROM CRM_PROPOSAL_BRANDING_SCHEME WHERE customer_item_id = :item_id`,
        {
          replacements: { item_id: item.id },
          type: db.sequelize.QueryTypes.SELECT,
        }
      )
      if (brandingResult.length > 0) {
        scheme.branding_data = brandingResult ? brandingResult : [];
      }
    }

    if (getAllData) {
      getAllData.customer_item_list = customerItems || [];

      let scheme_id = null;
      const foundItem = getAllData.customer_item_list.find(item =>
        item.apply_scheme === true && item.promo_item === true && item.scheme_id !== null
      );

      if (foundItem) {
        scheme_id = foundItem.scheme_id;
      }

      return res.status(200).send({
        code: 200,
        message: "Fetch All Clients Successfully",
        scheme_id: scheme_id,
        data: getAllData,
        hasItems: customerItems.length > 0,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "Record Not Found",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};


const remove_scheme_exist_customer = async (customer_id, proposal_no) => {
  try {


    let isExist = await db.customer_item_list.findOne({ where: { customer_id: customer_id, proposal_no: proposal_no } })
    if (isExist) {
      return { code: 200, message: "Proposal already existed" };
    }
    const whereCondition = {
      apply_scheme: true
    };

    if (customer_id) {
      whereCondition.customer_id = customer_id;
    }

    // Delete promo items
    const deleteCondition = {
      proposal_no: { [Op.ne]: proposal_no },
      isDeleted: { [Op.ne]: 1 }
    };

    if (customer_id) {
      deleteCondition.customer_id = customer_id;

      // Fetch all items
      let itemNo = await db.customer_item_list.findAll({
        where: { customer_id: customer_id, isDeleted: false }
      });

      if (itemNo.length) {
        for (let item of itemNo) {
          if (item.id) {
            await db.proposal_branding_scheme.destroy({
              where: { customer_item_id: item.id }
            });

            const schemeTypes = await db.proposal_scheme_type.findAll({
              where: { customer_item_id: item.id }
            });

            for (let schemeType of schemeTypes) {
              if (schemeType.id) {
                await db.proposal_scheme_data.destroy({
                  where: { proposal_scheme_type_id: schemeType.id }
                });

                await db.proposal_scheme_type.destroy({
                  where: { id: schemeType.id }
                });
              }
            }
          }
        }
      }

      await db.customer_item_list.update({ proposal_no: null }, { where: { customer_id: customer_id, isDeleted: true } })

      await db.customer_item_list.destroy({ where: deleteCondition });
      await db.customer_item_list.update({ isDeleted: false }, { where: { customer_id: customer_id } });
    }

    // Reset scheme flags
    const updateCondition = {
      apply_scheme: 0,
      scheme_id: null
    };

    if (customer_id) {
      await db.customer_item_list.update(updateCondition, { where: { create_lead_id: quotation_id } });
    }

    return { code: 200, message: "Promo scheme removed successfully." };

  } catch (error) {
    console.error("Error in remove_scheme_handler:", error.message);
    return { code: 500, message: error.message };
  }
};


// module.exports.getAllClientNames = async (req, res) => {
//   try {
//     let client_id = req.params.client_id;

//     // Get main customer and address/contact info
//     const getAllDataList = await db.sequelize.query(
//       `SELECT cp.*, cac.*
//        FROM CUSTOMER_PROFILE_MST cp
//        LEFT JOIN CUSTOMER_ADDRESS_CONTACT_MST cac 
//        ON cp.id = cac.customer_id
//        WHERE cp.id = :client_id`,
//       {
//         replacements: { client_id },
//         type: db.sequelize.QueryTypes.SELECT,
//       }
//     );

//     let getAllData = null;

//     if (getAllDataList.length > 0) {
//       // Prepare profile and address/contact info separately
//       const profile = {};
//       const addressContactList = [];

//       for (const row of getAllDataList) {
//         if (Object.keys(profile).length === 0) {
//           // Pick profile fields (all cp.* fields)
//           for (const key in row) {
//             if (!key.startsWith('cac_')) {
//               profile[key] = row[key];
//             }
//           }
//         }

//         // Pick address/contact fields (all cac.* fields)
//         const addressContact = {};
//         for (const key in row) {
//           if (key.startsWith('cac_')) {
//             const cleanKey = key.replace('cac_', ''); // remove cac_ prefix
//             addressContact[cleanKey] = row[key];
//           }
//         }

//         // If address/contact has data, push it
//         if (Object.keys(addressContact).some(k => addressContact[k] !== null)) {
//           addressContactList.push(addressContact);
//         }
//       }

//       getAllData = {
//         ...profile,
//         CUSTOMER_ADDRESS_CONTACT_MST: addressContactList.length > 0 ? addressContactList : [],
//       };
//     }

//     // Get customer item list
//     const customerItems = await db.sequelize.query(
//       `SELECT DISTINCT 
//       cil.*, 
//       mi.item_name, 
//       mi.item_code, 
//       mi.description, 
//       mi.variant,
//       mu.uom_name,
//       hsn.hsn_sac_code
//       FROM CUSTOMER_ITEM_LIST AS cil
//       LEFT JOIN MASTER_ITEM AS mi ON mi.id = cil.product_id
//       LEFT JOIN MASTER_UOM AS mu ON mu.uom_id = mi.uom_id
//       LEFT JOIN MASTER_HSN_SAC_CODE AS hsn ON hsn.id = mi.hsn_code_id
//       WHERE cil.customer_id = :client_id;`,
//       {
//         replacements: { client_id },
//         type: db.sequelize.QueryTypes.SELECT,
//       }
//     );

//     // Attach scheme inside each item
//     for (const item of customerItems) {
//       const schemeResult = await db.sequelize.query(
//         `SELECT * FROM CRM_PROPOSAL_SCHEME_TYPE WHERE customer_item_id = :item_id LIMIT 1`,
//         {
//           replacements: { item_id: item.id },
//           type: db.sequelize.QueryTypes.SELECT,
//         }
//       );

//       const scheme = schemeResult[0];
//       if (scheme) {
//         item.scheme = scheme; 
//       }
//     }

//     if (getAllData) {
//       getAllData.customer_item_list = customerItems || [];

//       return res.status(200).send({
//         code: 200,
//         message: "Fetch All Clients Successfully",
//         data: getAllData,
//         hasItems: customerItems.length > 0,
//       });
//     } else {
//       return res.status(200).send({
//         code: 200,
//         message: "Record Not Found",
//         data: null,
//       });
//     }
//   } catch (error) {
//     return res.status(500).send({
//       code: 500,
//       message: error.message || "Server Error",
//     });
//   }
// };



module.exports.getAllCustomerList = async (req, res) => {
  try {
    const [getAllData] = await db.sequelize.query(`
      SELECT CLM.* FROM CRM_CREATE_LEAD_MST AS CLM
      WHERE JSON_CONTAINS(CLM.dynamic_fields, '{"status":"Deal Close"}')`)
    if (getAllData.length > 0) {
      return res.status(200).send({ code: 200, message: "Fetch All Clients Successfully", data: getAllData });
    } else {
      return res.status(200).send({ code: 200, message: "Record Not Found", data: getAllData });
    }

  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
}