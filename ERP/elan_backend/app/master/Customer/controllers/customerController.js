const { where } = require("@sequelize/core");
const db = require("../../../models/index");
const { Op } = require("sequelize");
const axios = require("axios");
const { sendMail } = require("../../../CRM/utils/mail/thirdPartyCustomerApi");
const {registerForGSTPortalLink,verifyOtpForGSTPortalLink} = require('../../../Kdk/kdkController')

exports.getAllActiveIndustryType = async (req, res) => {
  try {
    const getAllData = await db.master_industry_type.findAll({
      where: { isDeleted: false, status: "ACTIVE" },
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Data fetched successfully!",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Records not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getAllCustomersList = async (req, res) => {
  try {
    const { entity_id, financial_year_id, employee_id, status } =
      req.query;
    let userRole = req.user.role_master_id;

    let existRole = await db.role_master.findOne({ where: { role_master_id: userRole } });

    let whereClause = {
      is_Deleted: false,
      // entity_id,
      // financial_year_id,
      data_status: status,
      customerParentId: null,
    };
    if (status === 'Quotation') {
      whereClause.data_status = {
        [Op.ne]: 'Rejected',
      };
    } else {
      whereClause.data_status = status;
    }

    if (userRole !== 1 && existRole?.role_master_id !== 7) {
      let existEmp = await db.user.findAll({ where: { role_master_id: 1 } })
      let superAdminEmpId = existEmp.map(x => x.employee_id);
      whereClause.employee_id = {
        [Op.in]: [employee_id, ...superAdminEmpId]
      };
    }

    const getAllData = await db.customerProfile.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        { model: db.customerBilling, required: false },
        { model: db.customerDelivery, required: false },
        { model: db.customer_business_details, required: false },
        { model: db.customer_document, required: false },
        { model: db.customerType, required: false },
        { model: db.customer_category, required: false },
        { model: db.customerAddress, required: false },
        { model: db.user, required: false, attributes: ["employee_id", "last_name", "first_name"] },
      ],
    });

    if (!getAllData || getAllData.length === 0) {
      return res.status(404).send({ code: 404, message: "Records not found!" });
    }

    const enrichedData = getAllData.map((customer) => {
      const billing = customer.CUSTOMER_CONTACT_BILLING_MSTs[0] || {};
      const delivery = customer.CUSTOMER_CONTACT_DELIVERY_MSTs[0] || {};
      const bank = customer.CUSTOMER_BUSINESS_DETAILS_MSTs[0] || {};
      const document = customer.CUSTOMER_DOCUMENT_MSTs[0] || {};

      const isBillingComplete =
        billing?.full_billing_add &&
        billing?.full_billing_land_add &&
        billing?.billing_loc_code &&
        billing?.billing_pin_code &&
        billing?.billing_mobile_no1 &&
        billing?.billing_mobile_no2 &&
        billing?.billing_mobile_no3 &&
        billing?.land_line_no &&
        billing?.billing_email_id1 &&
        billing?.billing_email_id2 &&
        billing?.billing_email_id3 &&
        billing?.tds_app &&
        billing?.tcs_app &&
        billing?.city_id &&
        billing?.states_id &&
        billing?.countryss_id;

      const isDeliveryComplete =
        delivery?.full_delivery_add &&
        delivery?.delivery_loc_code &&
        delivery?.full_delivery_land_add &&
        delivery?.delivery_pin_code &&
        delivery?.delivery_mobile_no1 &&
        delivery?.delivery_mobile_no2 &&
        delivery?.delivery_mobile_no3 &&
        delivery?.delivery_land_line_no &&
        delivery?.delivery_email_id1 &&
        delivery?.delivery_email_id2 &&
        delivery?.delivery_email_id3 &&
        delivery?.city_id &&
        delivery?.states_id &&
        delivery?.countryss_id;

      const isBankComplete =
        bank?.preffered_payment_terms &&
        bank?.existing_vendor_code &&
        bank?.bank_name &&
        bank?.bank_account_number &&
        bank?.total_purchase_value &&
        bank?.amc_status &&
        bank?.amc_expiry_date;

      const isDocumentComplete =
        document?.document_name && document?.upload_document;

      const status =
        isBillingComplete &&
          isDeliveryComplete &&
          isBankComplete &&
          isDocumentComplete
          ? "Approve"
          : "Pending";

      return {
        ...customer.toJSON(),
        status,
      };
    });

    return res
      .status(200)
      .send({
        code: 200,
        message: "Data fetched successfully!",
        data: enrichedData,
      });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getAllCustomersWithContactList = async (req, res) => {
  try {
    const { entity_id, financial_year_id, employee_id, userRole } = req.query;

    let whereCondition = `CP.is_Deleted = false AND CP.entity_id = :entity_id AND CP.financial_year_id = :financial_year_id`;
    let replacements = { entity_id, financial_year_id };

    if (userRole !== "Super Admin") {
      whereCondition += ` AND CP.employee_id = :employee_id`;
      replacements.employee_id = employee_id;
    }

    const getAllData = await db.sequelize.query(
      `
            SELECT 
                CP.*, 
                CC.id AS contact_id,
                CC.primary_contact_person AS contact_person_name,
                CC.mobile AS contact_number,
                CC.email_id AS mail_id
            FROM CUSTOMER_PROFILE_MST CP
            LEFT JOIN CUSTOMER_CONTACT_MST CC 
                ON CC.customer_id = CP.id 
                AND CC.is_Deleted = false
                AND CC.id = (SELECT MIN(id) FROM CUSTOMER_CONTACT_MST WHERE customer_id = CP.id AND is_Deleted = false)
            WHERE ${whereCondition}
            ORDER BY CP.createdAt DESC;
            `,
      {
        replacements,
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (getAllData.length > 0) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Data fetched successfully!",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Records not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.createCustomerContact = async (req, res) => {
  try {
    let reqData = req.body;
    const customerContact = await db.customerContact.findOne({
      where: { customer_id: reqData[0].customer_id },
    });
    if (customerContact) {
      await db.customerContact.destroy({
        where: { customer_id: reqData[0].customer_id },
      });

      if (Array.isArray(reqData) && reqData.length > 0) {
        const contactEntries = reqData.map((contact) => ({
          ...contact,
        }));

        await db.customerContact.bulkCreate(contactEntries);
      }
      return res
        .status(200)
        .send({ code: 200, message: "Contact updated successfully!" });
    } else {
      if (Array.isArray(reqData) && reqData.length > 0) {
        const contactEntries = reqData.map((contact) => ({
          ...contact,
        }));

        await db.customerContact.bulkCreate(contactEntries);
      }
      return res
        .status(200)
        .send({ code: 200, message: "Contact added successfully!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

async function validateContact(contact) {

  const conditions = [];

  if (contact.email_id) {
    conditions.push({ email_id: contact.email_id });
  }

  if (contact.mobile) {
    conditions.push({ mobile: contact.mobile });
  }

  if (!conditions.length) {
    return null;
  }

  const whereClause = {
    [Op.or]: conditions
  };

  // current record ignore in edit case
  if (contact.id) {
    whereClause.id = {
      [Op.ne]: contact.id
    };
  }

  const existingContact = await db.customerAddressContact.findOne({
    where: whereClause
  });

  if (!existingContact) {
    return null;
  }

  if (
    contact.email_id &&
    existingContact.email_id === contact.email_id
  ) {
    return "Email ID already exists!";
  }

  if (
    contact.mobile &&
    existingContact.mobile === contact.mobile
  ) {
    return "Mobile Number already exists!";
  }

  return "Email ID or Mobile Number already exists!";
}

exports.createCustomerAddressInfo = async (req, res) => {
  try {
    let {
      customer_id,
      billing_city_id,
      billing_state_id,
      billing_country_id,
      billing_pin_code,
      billing_address,
      billing_postal_address,
      shipping_city_id,
      shipping_state_id,
      shipping_country_id,
      shipping_pin_code,
      shipping_address,
      shipping_postal_address,
      contact_info_data,
      shipping_address_data,
      billing_address_data
    } = req.body;
    customer_id = parseInt(customer_id);
    const data = await db.customerProfile.findOne({
      where: { id: customer_id },
    });
    if (!data) {
      return res
        .status(400)
        .send({ code: 400, message: "Customer not found!" });
    }
    let address = await db.customerAddress.findAll({ where: { customer_id } });
    if (address.length) {


      if (Array.isArray(billing_address_data) && billing_address_data.length > 0) {

        const billingIds = address.map(x => x.id);
        const billingAddressIds = billing_address_data.map(x => x.id);
        const notExistingIds = billingIds.filter(id => !billingAddressIds.includes(id));
        for (const elem of notExistingIds) {
          await db.customerAddress.update({ is_Deleted: true, status: "INACTIVE" }, { where: { id: elem } });
        }

        for (const el of billing_address_data) {
          if (el.id && el.id.toString().trim() !== "") {
            await db.customerAddress.update({
              ...el
            }, { where: { id: el.id } });
          } else {
            delete el.id;
            await db.customerAddress.create({
              ...el,
              customer_id
            })
          }
        }
        console.log('Not existing IDs:', notExistingIds);

      }

      if (Array.isArray(shipping_address_data) && shipping_address_data.length > 0) {
        const shippingAddress = await db.customerShippingAddress.findAll({ where: { customer_id } })
        const shippingIds = shippingAddress.map(x => x.id);
        const shippingAddressIds = shipping_address_data.map(x => x.id);
        const notExistingIds = shippingIds.filter(id => !shippingAddressIds.includes(id));
        for (const elem of notExistingIds) {
          await db.customerShippingAddress.update({ is_Deleted: true, status: "INACTIVE" }, { where: { id: elem } });
        }


        for (const el of shipping_address_data) {
          if (el.id && el.id.toString().trim() !== "") {
            await db.customerShippingAddress.update({
              ...el
            }, { where: { id: el.id } });
          } else {
            delete el.id;
            await db.customerShippingAddress.create({
              ...el,
              customer_id
            })
          }
        }
      }

      if (Array.isArray(contact_info_data) && contact_info_data.length > 0) {

        // Duplicate Check
        for (const contact of contact_info_data) {
          const validationMessage = await validateContact(contact);

          if (validationMessage) {
            return res.status(400).send({
              code: 400,
              message: validationMessage
            });
          }
        }

        for (const contact of contact_info_data) {
        
          if (contact.id) {

            await db.customerAddressContact.update(
              {
                ...contact,
                customer_id,
              },
              {
                where: { id: contact.id }
              }
            );

          } else {

            await db.customerAddressContact.create({
              ...contact,
              customer_id,
            });
          }

        }

      }


      return res
        .status(200)
        .send({
          code: 200,
          message: "Customer address and contacts updated successfully!",
        });
    } else {

      if (Array.isArray(contact_info_data) && contact_info_data.length > 0) {
        // Duplicate Check
        for (const contact of contact_info_data) {
          const validationMessage = await validateContact(contact);
          if (validationMessage) {
            return res.status(400).send({code: 400,message: validationMessage});
          }
        }

        const contactEntries = contact_info_data.map((contact) => ({
          ...contact,
          customer_id
        }));

        await db.customerAddressContact.bulkCreate(contactEntries);
      }
      if (Array.isArray(shipping_address_data) && shipping_address_data.length > 0) {
        const shippingEntries = shipping_address_data.map(addr => {
          const { id, ...rest } = addr;   // id remove
          return {
            ...rest,
            customer_id
          };
        });
        const createdShippingAddresses = await db.customerShippingAddress.bulkCreate(shippingEntries, { returning: true });
      }
      if (Array.isArray(billing_address_data) && billing_address_data.length > 0) {
        const billingEntries = billing_address_data.map(addr => ({
          ...addr,
          customer_id,
        }));
        const createdShippingAddresses = await db.customerAddress.bulkCreate(billingEntries, { returning: true });
      }
      return res
        .status(200)
        .send({
          code: 200,
          message: "Customer address and contacts added successfully!",
        });
    }
  } catch (error) {

  if (error.name === "SequelizeUniqueConstraintError") {

    let message = "Email ID or Mobile Number already exists!";

    if (error.fields?.email_id) {
      message = "Email ID already exists!";
    }

    if (error.fields?.mobile) {
      message = "Mobile Number already exists!";
    }

    return res.status(400).send({
      code: 400,
      message
    });
  }

  return res.status(500).send({
    code: 500,
    message: error.message || "Internal server error!"
  });
}
};

exports.createCustomerBusinessDetails = async (req, res) => {
  try {
    const {
      customer_id,
      preffered_payment_terms,
      existing_vendor_code,
      bank_name,
      bank_account_number,
      total_purchase_value,
      amc_status,
      amc_expiry_date,
      beneficiary_name,
      account_type,
      ifsc_code
    } = req.body;
    const data = await db.customerProfile.findOne({
      where: { id: customer_id },
    });
    let businessDetails = await db.customer_business_details.findOne({
      where: { customer_id },
    });
    if (!data) {
      return res
        .status(400)
        .send({ code: 400, message: "Customer not found!" });
    }
    if (businessDetails) {
      const updateData = await db.customer_business_details.update(
        {
          preffered_payment_terms,
          existing_vendor_code,
          bank_name,
          bank_account_number,
          total_purchase_value,
          amc_status,
          beneficiary_name,
          account_type,
          ifsc_code,
          amc_expiry_date,
        },
        { where: { customer_id } }
      );

      return res
        .status(200)
        .send({
          code: 200,
          message: "Customer business details updated successfully!",
        });
    } else {
      await db.customer_business_details.create({
        customer_id,
        preffered_payment_terms,
        existing_vendor_code,
        bank_name,
        bank_account_number,
        total_purchase_value,
        amc_status,
        beneficiary_name,
        account_type,
        ifsc_code,
        amc_expiry_date,
      });

      return res
        .status(200)
        .send({
          code: 200,
          message: "Customer business details added successfully!",
        });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getCustomerProfileById = async (req, res) => {
  const { customer_id } = req.params;
  const { status } = req.body;
  try {
    let customerData;

    customerData = await db.customerProfile.findOne({
      where: { id: customer_id, is_Deleted: false },
    });

    if (customerData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Data fetched successfully!",
          data: customerData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Records not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getAllCustomerContactsById = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const customerContacts = await db.customerAddressContact.findAll({
      where: { customer_id: customer_id, is_Deleted: false },
    });

    if (!customerContacts || customerContacts.length === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "No contacts found for this customer!" });
    }
    return res
      .status(200)
      .send({
        code: 200,
        message: "Customer contacts fetched successfully!",
        data: customerContacts,
      });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getCustomerContactById = async (req, res) => {
  const { customer_id } = req.params;
  try {
    const getAllData = await db.customerContact.findAll({
      where: { customer_id: customer_id, is_Deleted: false },
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Data fetched successfully!",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Records not found!" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getCustomerAddressInfoById = async (req, res) => {
  const { customer_id } = req.params;
  try {
    // 🔹 Query for customerAddress
    // const [customerAddressResult] = await db.sequelize.query(
    //   `
    //   SELECT * 
    //   FROM CUSTOMER_ADDRESS_MST 
    //   WHERE customer_id = :customer_id
    //   LIMIT 1
    //   `,
    //   {
    //     replacements: { customer_id },
    //     type: db.Sequelize.QueryTypes.SELECT,
    //   }
    // );

    // 🔹 Query for customerContacts
    const customerAddress = await db.customerAddress.findAll({ where: { customer_id, is_Deleted: false, status: "ACTIVE" } })
    const customerContactsRaw = await db.sequelize.query(
      `
      SELECT * 
      FROM CUSTOMER_ADDRESS_CONTACT_MST 
      WHERE customer_id = :customer_id
      `,
      {
        replacements: { customer_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    const shipping_address_data = await db.customerShippingAddress.findAll({ where: { customer_id, is_Deleted:false, status:"ACTIVE" } })

    // 🔹 Add full_name key
    const customerContacts = customerContactsRaw.map((c) => ({
      ...c,
      full_name: [c.title, c.contact_person_name].filter(Boolean).join(" "),
    }));

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully!",
      data: {
        // customerAddress: customerAddressResult || null,
        shipping_address_data: shipping_address_data,
        billing_address_data: customerAddress,
        customerContacts,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getCustomerBusinessDetailsById = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const businessDetails = await db.customer_business_details.findOne({
      where: { customer_id: customer_id },
    });

    if (!businessDetails) {
      return res
        .status(404)
        .send({ code: 404, message: "Customer business details not found!" });
    } else {
      return res
        .status(200)
        .send({
          code: 200,
          data: businessDetails,
          message: "Data fetched successfully!",
        });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.dealerByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const customer = await db.customerProfile.findOne({
      where: { id: customer_id },
    });
    if (!customer) {
      return res
        .status(404)
        .send({ code: 404, message: "Customer not found!" });
    }
    if (!customer.dealer_id) {
      return res
        .status(400)
        .send({ code: 400, message: "This customer has no associated dealer!" });
    }
    const dealer = await db.customerProfile.findOne({
      where: { id: customer.dealer_id },
    });

    if (!dealer) {
      return res
        .status(404)
        .send({ code: 404, message: "Dealer details not found!" });
    }

    return res.status(200).send({
      code: 200,
      data: dealer,
      message: "Data fetched successfully!",
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal server error!",
    });
  }

};

exports.getCustomerDocumentsById = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const documents = await db.customer_document.findAll({
      where: { customer_id: parseInt(customer_id) },
    });

    if (!documents || documents.length === 0) {
      return res
        .status(404)
        .send({ code: 404, message: "No documents found!" });
    }

    return res
      .status(200)
      .send({
        code: 200,
        message: "Data fetched successfully!",
        data: documents,
      });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.deleteCustomerById = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const customer = await db.customerProfile.findOne({
      where: { id: customer_id },
    });
    if (!customer) {
      return res
        .status(404)
        .send({ code: 404, message: "Customer not found!" });
    }

    await db.customerProfile.update(
      { is_Deleted: true },
      { where: { id: customer_id } }
    );
    await db.customerContact.update(
      { is_Deleted: true },
      { where: { customer_id } }
    );
    await db.customerAddress.update(
      { is_Deleted: true },
      { where: { customer_id } }
    );
    await db.customerAddressContact.update(
      { is_Deleted: true },
      { where: { customer_id } }
    );
    await db.customer_business_details.update(
      { is_Deleted: true },
      { where: { customer_id } }
    );
    await db.customer_document.update(
      { is_Deleted: true },
      { where: { customer_id } }
    );

    return res
      .status(200)
      .send({ code: 200, message: "Customer deleted successfully!" });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.createCustomerProfile = async (req, res) => {
  try {
    const {
      employee_id,
      entity_id,
      financial_year_id,
      company_name,
      identification,
      customer_code,
      customer_type_id,
      customer_sub_category_id,
      customer_industry_type_id,
      pan_number,
      customer_category_id,
      customer_status,
      website,
      customer_micro_category_id,
      gst_in,
      gst_category,
      gst_registration_date,
      registration_date_of_party,
      is_group,
      parent_id,
      price_type_id,
      supply_type
    } = req.body;

    const transaction = await db.sequelize.transaction();

    const response = await db.customerProfile.create(
      {
        employee_id,
        entity_id,
        financial_year_id,
        company_name,
        identification,
        customer_code,
        customer_type_id,
        customer_sub_category_id,
        customer_industry_type_id,
        gst_in,
        pan_number,
        customer_category_id,
        customer_status,
        website,
        customer_micro_category_id,
        registration_date_of_party,
        gst_category,
        gst_registration_date,
        is_group,
        parent_id,
        price_type_id,
        supply_type
      },
      { transaction }
    );

    await transaction.commit();

    return res
      .status(200)
      .send({
        code: 200,
        message: "Customer added successfully!",
        data: response,
      });
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.createCustomerbilling = async (req, res) => {
  try {
    const {
      full_billing_add,full_billing_land_add,billing_loc_code,billing_pin_code,billing_mobile_no1,billing_mobile_no2,billing_mobile_no3,
      land_line_no,billing_email_id1,billing_email_id2,billing_email_id3,tds_app,tcs_app,customer_id,city_id,states_id,countryss_id,
    } = req.body;
    await db.customerBilling.create({
      full_billing_add,full_billing_land_add,billing_loc_code,billing_pin_code,billing_mobile_no1,billing_mobile_no2,billing_mobile_no3,
      land_line_no,billing_email_id1,billing_email_id2,billing_email_id3,tds_app,tcs_app,city_id,states_id,countryss_id,customer_id,
    });
    return res.status(200).send({code: 200,message: "Customer Billing Data Create successfully!",});
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.createCustomerdelivery = async (req, res) => {
  try {
    const {
      full_delivery_add,
      delivery_loc_code,
      full_delivery_land_add,
      delivery_pin_code,
      delivery_mobile_no1,
      delivery_mobile_no2,
      delivery_mobile_no3,
      delivery_land_line_no,
      delivery_email_id1,
      delivery_email_id2,
      delivery_email_id3,
      customer_id,
      city_id,
      states_id,
      countryss_id,
    } = req.body;
    await db.customerDelivery.create({
      full_delivery_add,
      delivery_loc_code,
      full_delivery_land_add,
      delivery_pin_code,
      delivery_mobile_no1,
      delivery_mobile_no2,
      delivery_mobile_no3,
      delivery_land_line_no,
      delivery_email_id1,
      delivery_email_id2,
      delivery_email_id3,
      customer_id,
      city_id,
      states_id,
      countryss_id,
    });
    return res
      .status(200)
      .send({
        code: 200,
        message: "Customer Delivery Data Create successfully!",
      });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.createCustomerBank = async (req, res) => {
  try {
    const {
      customer_id,
      payment_terms,
      credit_limit,
      internal_credit_limit,
      credit_days,
      grace_period,
      bank_name,
      bank_branch,
      bank_ac_num,
      swift_code,
      ifsc_code,
      interest,
    } = req.body;
    await db.customerBank.create({
      customer_id,
      payment_terms,
      credit_limit,
      internal_credit_limit,
      credit_days,
      grace_period,
      bank_name,
      bank_branch,
      bank_ac_num,
      swift_code,
      ifsc_code,
      interest,
    });
    return res
      .status(200)
      .send({ code: 200, message: "Customer Bank Data Create successfully!" });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.addCustomerDocument = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { customer_id, upload_document } = req.body;

    if (!customer_id) {
      await t.rollback();
      return res.status(400).send({ code: 400, message: "customer_id is required" });
    }

    if (!Array.isArray(upload_document) || upload_document.length === 0) {
      await t.rollback();
      return res.status(400).send({ code: 400, message: "upload_document must be a non-empty array" });
    }

    let created = 0;
    let updated = 0;
    for (const item of upload_document) {
      if (!item.document_name || !item.upload_document) {
        // skip invalid entries (or you can return 400)
        continue;
      }

      const [instance, wasCreated] = await db.customer_document.findOrCreate({
        where: {
          customer_id,
          document_name: item.document_name
        },
        defaults: {
          customer_id,
          document_name: item.document_name,
          upload_document: item.upload_document
        },
        transaction: t
      });

      if (wasCreated) {
        created++;
      } else {
        // Optionally update upload_document if it changed
        const needsUpdate = instance.upload_document !== item.upload_document;
        if (needsUpdate) {
          await instance.update(
            { upload_document: item.upload_document },
            { transaction: t }
          );
          updated++;
        }
      }
    }

    await t.commit();
    return res.status(200).send({
      code: 200,
      message: "Customer Doc processed successfully",
      result: { created, updated }
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getAllCustomerData = async (req, res) => {
  try {
    const getAllData = await db.customerProfile.findAll({
      order: [["id", "DESC"]],
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch All customerProfile Data Successfully",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.deleteAllCustomerData = async (req, res) => {
  try {
    const id = req.params.id;
    const getData = await db.customerProfile.findOne({ where: { id: id } });
    if (getData) {
      const updated = await db.customerProfile.update(
        { is_Deleted: true },
        { where: { id: id } }
      );
      return res
        .status(200)
        .send({
          code: 200,
          message: "customer Profile Data is Deleted Successfully!",
          data: updated,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllCustomerById = async (req, res) => {
  try {
    let id = req.params.id;
    const query = `
           SELECT CPM.id,CPM.company_name,CPM.customer_code,CPM.pan_number,
           CPM.customer_status,CPM.website,CPM.entity_id,CPM.financial_year_id,CPM.customer_industry_type_id,
           CPM.customer_type_id,CPM.customer_category_id,CPM.customer_sub_category_id,
           CPM.customer_micro_category_id,CPM.employee_id,CPM.gst_in,CPM.gst_category,
           CPM.gst_registration_date,CPM.registration_date_of_party,
           CBM.full_billing_add,CBM.full_billing_land_add,CBM.billing_loc_code,
           CBM.billing_pin_code,CBM.billing_mobile_no1,CBM.billing_mobile_no2,CBM.billing_mobile_no3,
           CBM.land_line_no,CBM.billing_email_id1,CBM.billing_email_id2,CBM.billing_email_id3,CBM.city_id,CBM.states_id,
           CBM.countryss_id,CBM.tds_app,CBM.tcs_app,
           CDM.full_delivery_add,CDM.delivery_loc_code,CDM.full_delivery_land_add,
           CDM.delivery_pin_code,CDM.delivery_mobile_no1,CDM.delivery_mobile_no2,
           CDM.delivery_mobile_no3,CDM.delivery_land_line_no,CDM.delivery_email_id1,
           CDM.delivery_email_id2,CDM.delivery_email_id3,CDM.city_id,CDM.states_id,
           CDM.countryss_id,CBDM.payment_terms,CBDM.credit_limit,
           CBDM.internal_credit_limit,CBDM.internal_credit_limit,CBDM.credit_days,
           CBDM.grace_period,CBDM.interest,CBDM.bank_name,CBDM.bank_branch,CBDM.bank_ac_num,
           CBDM.swift_code,CBDM.ifsc_code,CDOM.document_name,CDOM.upload_document
           FROM CUSTOMER_PROFILE_MST AS CPM
           INNER JOIN CUSTOMER_CONTACT_BILLING_MST AS CBM ON CBM.customer_id = CPM.id
           INNER JOIN CUSTOMER_CONTACT_DELIVERY_MST AS CDM ON CDM.customer_id = CPM.id
           INNER JOIN CUSTOMER_CONTACT_BANK_DETAILS_MST AS CBDM ON CBDM.customer_id = CPM.id
           INNER JOIN CUSTOMER_DOCUMENT_MST AS CDOM ON CDOM.customer_id = CPM.id
           WHERE CPM.id = ${id}`;

    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All customer details Successfully!",
        data: getAllData,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "No Found Data!",
        data: [],
      });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.updateCustomerProfile = async (req, res) => {
  try {
    let id = req.params.id;
    const {
      employee_id,
      entity_id,
      financial_year_id,
      company_name,
      identification,
      customer_code,
      customer_type_id,
      customer_sub_category_id,
      customer_industry_type_id,
      pan_number,
      customer_category_id,
      customer_status,
      website,
      customer_micro_category_id,
      gst_in,
      gst_category,
      gst_registration_date,
      registration_date_of_party,
      is_group,
      parent_id,
      price_type_id,
      supply_type
    } = req.body;
    const response = await db.customerProfile.update(
      {
        employee_id,
        entity_id,
        financial_year_id,
        company_name,
        identification,
        customer_code,
        customer_type_id,
        customer_sub_category_id,
        customer_industry_type_id,
        gst_in,
        pan_number,
        customer_category_id,
        customer_status,
        website,
        customer_micro_category_id,
        registration_date_of_party,
        gst_category,
        gst_registration_date,
        is_group,
        parent_id,
        price_type_id,
        supply_type
      },
      { where: { id: id } }
    );
    return res
      .status(200)
      .send({
        code: 200,
        message: "Customer update successfully!",
        data: response,
      });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.updateCustomerbilling = async (req, res) => {
  try {
    let id = req.params.id;
    const {
      full_billing_add,
      full_billing_land_add,
      billing_loc_code,
      billing_pin_code,
      billing_mobile_no1,
      billing_mobile_no2,
      billing_mobile_no3,
      land_line_no,
      billing_email_id1,
      billing_email_id2,
      billing_email_id3,
      tds_app,
      tcs_app,
      customer_id,
      city_id,
      states_id,
      countryss_id,
    } = req.body;
    await db.customerBilling.update(
      {
        full_billing_add,
        full_billing_land_add,
        billing_loc_code,
        billing_pin_code,
        billing_mobile_no1,
        billing_mobile_no2,
        billing_mobile_no3,
        land_line_no,
        billing_email_id1,
        billing_email_id2,
        billing_email_id3,
        tds_app,
        tcs_app,
        city_id,
        states_id,
        countryss_id,
        customer_id,
      },
      { where: { customer_id: id } }
    );
    return res
      .status(200)
      .send({
        code: 200,
        message: "Customer Billing Data update successfully!",
      });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.updateCustomerdelivery = async (req, res) => {
  try {
    let id = req.params.id;
    const {
      full_delivery_add,
      delivery_loc_code,
      full_delivery_land_add,
      delivery_pin_code,
      delivery_mobile_no1,
      delivery_mobile_no2,
      delivery_mobile_no3,
      delivery_land_line_no,
      delivery_email_id1,
      delivery_email_id2,
      delivery_email_id3,
      customer_id,
      city_id,
      states_id,
      countryss_id,
    } = req.body;
    await db.customerDelivery.update(
      {
        full_delivery_add,
        delivery_loc_code,
        full_delivery_land_add,
        delivery_pin_code,
        delivery_mobile_no1,
        delivery_mobile_no2,
        delivery_mobile_no3,
        delivery_land_line_no,
        delivery_email_id1,
        delivery_email_id2,
        delivery_email_id3,
        customer_id,
        city_id,
        states_id,
        countryss_id,
      },
      { where: { customer_id: id } }
    );
    return res
      .status(200)
      .send({
        code: 200,
        message: "Customer Delivery Data update successfully!",
      });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.updateCustomerBank = async (req, res) => {
  try {
    let id = req.params.id;
    const {
      customer_id,
      payment_terms,
      credit_limit,
      internal_credit_limit,
      credit_days,
      grace_period,
      bank_name,
      bank_branch,
      bank_ac_num,
      swift_code,
      ifsc_code,
      interest,
    } = req.body;
    await db.customerBank.update(
      {
        customer_id,
        payment_terms,
        credit_limit,
        internal_credit_limit,
        credit_days,
        grace_period,
        bank_name,
        bank_branch,
        bank_ac_num,
        swift_code,
        ifsc_code,
        interest,
      },
      { where: { customer_id: id } }
    );
    return res
      .status(200)
      .send({ code: 200, message: "Customer Bank Data update successfully!" });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.updateCustomerDocument = async (req, res) => {
  try {
    let id = req.params.id;
    const { customer_id, document_name, upload_document } = req.body;
    await db.customer_document.update(
      {
        customer_id,
        document_name,
        upload_document,
      },
      { where: { customer_id: id } }
    );
    return res
      .status(200)
      .send({ code: 200, message: "Customer Doc Data update successfully!" });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

exports.getAllCustomerBiling = async (req, res) => {
  try {
    let id = req.params.id;
    const getAllData = await db.customerBilling.findAll({
      order: [["id", "DESC"]],
      where: { customer_id: id },
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch All customerBilling Data Successfully",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    // logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllCustomerBank = async (req, res) => {
  try {
    let id = req.params.id;
    const getAllData = await db.customerBank.findAll({
      order: [["id", "DESC"]],
      where: { customer_id: id },
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch All customerBank Data Successfully",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    // logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllCustomerdelivery = async (req, res) => {
  try {
    let id = req.params.id;
    const getAllData = await db.customerDelivery.findAll({
      order: [["id", "DESC"]],
      where: { customer_id: id },
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch All customerDelivery Data Successfully",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.getAllCustomerdoc = async (req, res) => {
  try {
    let id = req.params.id;
    const getAllData = await db.customer_document.findAll({
      order: [["id", "DESC"]],
      where: { customer_id: id },
    });
    if (getAllData) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Fetch All customer_document Data Successfully",
          data: getAllData,
        });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.deleteCustomerDoc = async (req, res) => {
  try {
    const id = req.params.id;

    const docData = await db.customer_document.findOne({
      where: { id: id }
    });

    if (!docData) {
      return res.status(404).send({
        code: 404,
        message: "Customer document not found"
      });
    }

    await db.customer_document.destroy({
      where: { id: id }
    });

    return res.status(200).send({
      code: 200,
      message: "Customer document deleted successfully"
    });

  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error"
    });
  }
};

module.exports.getAllParentIsGroupYes = async (req, res) => {
  try {
    const { entity_id } = req.query;
    const dataList = await db.customerProfile.findAll({
      where: {
        is_group: "YES",
        entity_id,
        customer_status: "ACTIVE",
        is_Deleted: false,
      },
      attributes: ["id", "company_name", "parent_id"],
    });
    if (dataList) {
      return res
        .status(200)
        .send({ code: 200, messege: "sucess", data: dataList });
    } else {
      return res.status(200).send({ code: 404, messege: "Data Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, messege: error.messege });
  }
};

module.exports.getCompanyTreeViewList = async (req, res) => {
  try {
    const { entity_id } = req.query;

    const [costCenterHierarchyView] = await db.sequelize.query(`
            SELECT id,company_name AS name,parent_id, customer_code
            FROM CUSTOMER_PROFILE_MST
            WHERE  is_Deleted = '0' AND customer_status = 'ACTIVE' AND entity_id = ${entity_id} ORDER BY id DESC`);

    const accountMap = {};
    costCenterHierarchyView.forEach((account) => {
      account.children = [];
      accountMap[account.id] = account;
    });

    const rootAccounts = [];
    costCenterHierarchyView.forEach((account) => {
      if (account.parent_id === null || account.parent_id === "") {
        rootAccounts.push(account);
      } else {
        const parent = accountMap[account.parent_id];
        if (parent) {
          parent.children.push(account);
        }
      }
    });

    const response = {
      costCenterHierarchyView: rootAccounts,
    };

    res.json(response);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getPriceList = async (req, res) => {
  try {
    let { customer_type, entity_id } = req.query;
    const priceData = await db.price_master.findAll({
      where: {
        isDeleted: false,
        entity_id: entity_id,
        customer_type: customer_type,
        status: "ACTIVE",
      },
      order: [["id", "DESC"]],
    });

    if (priceData.length > 0) {
      return res
        .status(200)
        .send({
          code: 200,
          message: "Price data Fetched successfully",
          data: priceData,
        });
    } else {
      return res
        .status(404)
        .send({ code: 404, message: "No Data found", data: [] });
    }
  } catch (error) {
    // logger.error(`Error ${error.message}`, { error });
    console.error("Error fetching area data: ", error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.approveSelectedCustomers = async (req, res) => {
  try {
    const { customers, parentId } = req.body;

    // Update each customer
    if (Array.isArray(customers) || customers.length > 0) {
      for (const customer of customers) {
        const { id, parentId } = customer;
        if (!id || !parentId) continue;
        await db.customerProfile.update(
          { customerParentId: parentId, data_status: "Approve" },
          { where: { id } }
        );

        const proposal = await db.proposalData.findOne({
          where: { customer_id: id, new_customer: "YES" },
        });
        if (proposal) {
          await db.proposalData.update(
            { parent_customer_id: parentId },
            { where: { id: proposal.id } }
          );
        }
      }
    }

    await db.customerProfile.update(
      { data_status: "Approve" },
      { where: { id: parentId } }
    );

    return res
      .status(200)
      .send({
        code: 200,
        message: "Selected customers approved successfully!",
      });
  } catch (error) {
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Internal server error!" });
  }
};

module.exports.customerAccoutRecieableDetail = async (req, res) => {
  try {
    const { id, chart_of_account_id, advanced_chart_of_account_id } = req.body;
    const upadateData = await db.customerProfile.update({ chart_of_account_id, advanced_chart_of_account_id }, { where: { id } })
    if (upadateData) {
      return res.status(200).send({ code: 200, message: 'Updated Succesfully' })
    } else {
      return res.status(404).send({ code: 404, message: 'Data Not Updated' })
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message })
  }
}

module.exports.customerAccoutRecieableDetailById = async (req, res) => {
  try {
    const { id } = req.query;
    const upadateData = await db.customerProfile.findOne({ where: { id }, attributes: ['id', 'chart_of_account_id', 'advanced_chart_of_account_id'] })
    if (upadateData) {
      return res.status(200).send({ code: 200, message: 'Success', data: upadateData })
    } else {
      return res.status(404).send({ code: 404, message: 'Data Not Updated', data: [] })
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message })
  }
}


module.exports.verifyOtpForGSTPortal = async (req, res) => {
  try {
    const { id, otp } = req.body;

    const customerExist = await db.customerProfile.findOne({
      where: { id   },
      attributes: [ "id", "company_name" ]});

    if (!customerExist) {
      return res.status(404).send({
        code: 404,
        message: "Customer not found"
      });
    }

    const addressContactExist =
      await db.customerAddressContact.findOne({
        where: {
          customer_id: id
        }
      });

    if (!addressContactExist) {
      return res.status(404).send({
        code: 404,
        message: "Customer contact details not found"
      });
    }

    const otpVerification =
      await db.otpVerificationCustomer.findOne({
        where: {
          customer_id: id
        }
      });

    if (!otpVerification) {
      return res.status(404).send({
        code: 404,
        message: "OTP verification record not found"
      });
    }

    const data = {
      mobile: addressContactExist.mobile,
      email_id: addressContactExist.email_id,
      contact_person_name: addressContactExist.contact_person_name,
      company_name: customerExist.company_name,
      otp_verification_id: otpVerification.otp_verification_id,
      otp: otp
    };

    const result =await verifyOtpForGSTPortalLink(data);

    return res.status(200).send({
      code: 200,
      message: "OTP verified and GST portal account created successfully",
      data: result
    });

  } catch (error) {
    
    return res.status(404).send({
      code: 404,
      message: error.message
    });
  }
};

module.exports.registerForGSTPortal = async (req, res) => {
  try {
    const { id } = req.query;

    const customerExist = await db.customerProfile.findOne({
      where: { id },
      attributes: [
        "id",
        "company_name",
        "customer_code",
        "entity_id",
        "financial_year_id",
        "pan_number"
      ]
    });

    if (!customerExist) {
      return res.status(404).send({
        code: 404,
        message: "Customer not found"
      });
    }

    const AddressContactExist =
      await db.customerAddressContact.findOne({
        where: {
          customer_id: customerExist.id
        }
      });

    if (!AddressContactExist) {
      return res.status(404).send({
        code: 404,
        message: "Customer address/contact not found"
      });
    }

    const data = {
      mobile: AddressContactExist.mobile,
      email: AddressContactExist.email_id,
      company_name: customerExist.company_name
    };


    const sendOtpSignup =  await registerForGSTPortalLink(data);
    const otpVerificationId =  sendOtpSignup.data?.data?.otp_verification_id;

    if (!otpVerificationId) {
      return res.status(400).send({
        code: 400,
        message: "OTP verification ID not received",
        data: sendOtpSignup.data
      });
    }

    await db.otpVerificationCustomer.destroy({
      where: {
        customer_id: id
      }
    });

    await db.otpVerificationCustomer.create({
      otp_verification_id: otpVerificationId,
      customer_id: id
    });

    return res.status(200).send({
      code: 200,
      message: "OTP has been sent successfully via WhatsApp.",
      data: sendOtpSignup.data
    });

  } catch (error) {

    const errMsg =
      error.response?.data?.errors?.[0] ||
      error.message ||
      "Something went wrong";

    return res.status(404).send({
      code: 404,
      message: errMsg
    });
  }
};

module.exports.customerItemName=async(req,res)=>{
  try {
    if(!req.body.length){
      return res.status(400).send({code:400,message:'Select at least one item'})
    }
    for (const element of req.body) {
      let isExist = await db.customerItemMapping.findOne({where:{item_id:element.id,customer_id:req.params.customer_id}});
      if(!isExist){
        await db.customerItemMapping.create({
          item_name:element.customer_item_name,
          item_id:element.id,
          customer_id:req.params.customer_id
        })
      }else{
        await db.customerItemMapping.update({item_name:element.customer_item_name},{where:{id:isExist.id}})
      }
    }
    return res.status(200).send({
      code: 200,
      message: "Customer items saved successfully"
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message }) 
  }
}

module.exports.getItemListForCustomer=async(req,res)=>{
  try {
    const {category_id,sub_category_id,customer_id}=req.query;
    if(!category_id || !sub_category_id){
      return res.status(400).send({code:400,message:'Category or Sub Category missing'});
    }
    const itemList = await db.ItemMaster.findAll({where:{asset_id:category_id,sub_category_id:sub_category_id},
    include:[
      {
        model:db.customerItemMapping,
        where:{customer_id:customer_id},
        required:false
      }
    ]})
   
    return res.status(200).send({
      code: 200,
      data:itemList,
      message: "Item list"
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message }) 
  }
}
module.exports.getCustomerItems=async(req,res)=>{
  try {
    const {customer_id}=req.query;
    // if(!category_id || !sub_category_id){
    //   return res.status(400).send({code:400,message:'Category or Sub Category missing'});
    // }
    const itemList = await db.ItemMaster.findAll({
    include:[
      {
        model:db.customerItemMapping,
        where:{customer_id:customer_id},
        required:true
      }
    ]})
   
    return res.status(200).send({
      code: 200,
      data:itemList,
      message: "Item list"
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message }) 
  }
}
module.exports.getsCustomerShippingAddress=async(req,res)=>{
  try {
   
    const shippingAddress = await db.customerShippingAddress.findAll();
   
    return res.status(200).send({
      code: 200,
      data:shippingAddress,
      message: "Customer shipping Address list"
    });
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message }) 
  }
}