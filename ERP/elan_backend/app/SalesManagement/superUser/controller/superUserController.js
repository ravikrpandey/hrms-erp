const db = require('../../../models/index')
const logger = require('../../../../logger/index');


module.exports.createSuperUser = async (req, res) => {
    try {

        const { business_name, business_phone_number, business_email,
            business_address, business_website, zip_code,
            contract_first_name, contract_last_name, contract_phone_number, contract_address,
            contract_email, shipping_address, shipping_zip_code, same_as_bussiness_address,
            max_credit_limit_amount, total_amount_utilize, available_amount, late_charges,
            term_and_conditions, country_id, shipping_country_id,
            state_id, shipping_state_id, city_id, shipping_city_id, entity_id, financial_id } = req.body;
        const Obj = {
            business_name, business_phone_number, business_email,
            business_address, business_website, zip_code,
            contract_first_name, contract_last_name, contract_phone_number, contract_address,
            contract_email, shipping_address, shipping_zip_code, same_as_bussiness_address,
            max_credit_limit_amount, total_amount_utilize, available_amount, late_charges,
            term_and_conditions, country_id, shipping_country_id,
            state_id, shipping_state_id, entity_id,
            financial_year: financial_id
        }


        if (shipping_city_id !== "") {
            Obj.shipping_city_id = shipping_city_id
        }
        if (city_id !== "") {
            Obj.city_id = city_id
        }
        const createUser = await db.superUser.create(Obj)
        if (createUser) {
            return res.status(201).send({ code: 201, message: 'Super User Created Successfully' });
        } else {
            return res.status(200).send({ code: 400, message: 'Failed to Create Super User' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}

module.exports.getAllSuperUser = async (req, res) => {
    try {
        const superUsers = await db.superUser.findAll({ where: { is_deleted: false } });
        if (superUsers) {
            return res.status(200).send({ code: 200, massege: 'Success', data: superUsers });
        } else {
            return res.status(404).send({ code: 404, message: 'No Super Users Found' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}

module.exports.getAllActiveSuperUser = async (req, res) => {
    try {
        const superUsers = await db.superUser.findAll({ where: { is_deleted: false, status: "ACTIVE" } });
        if (superUsers) {
            return res.status(200).send({ code: 200, massege: 'Success', data: superUsers });
        } else {
            return res.status(404).send({ code: 404, message: 'No Super Users Found' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}


module.exports.getAllSuperUsers = async (req, res) => {
    try {
        let entity_id = req.params.entity_id;
        let financial_id = req.params.financial_year;
        const superUsers = await db.superUser.findAll({ where: { financial_year: financial_id, entity_id: entity_id, is_deleted: false } });
        if (superUsers) {
            return res.status(200).send({ code: 200, massege: 'Success', data: superUsers });
        } else {
            return res.status(200).send({ code: 404, message: 'No Super Users Found', data: superUsers });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}

module.exports.getSuperUserById = async (req, res) => {
    try {
        const superUser = await db.superUser.findOne({ where: { id: req.params.id } });
        if (superUser) {
            return res.status(200).send({ code: 200, massege: 'Success', data: superUser });
        } else {
            return res.status(200).send({ code: 404, message: 'No Super User Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}

module.exports.updateSuperUser = async (req, res) => {
    try {
        const { business_name, business_phone_number, business_email,
            business_address, business_website, zip_code,
            contract_first_name, contract_last_name, contract_phone_number, contract_address,
            contract_email, shipping_address, shipping_zip_code, same_as_bussiness_address,
            max_credit_limit_amount, total_amount_utilize, available_amount, late_charges,
            term_and_conditions, country_id, shipping_country_id,
            state_id, shipping_state_id, city_id, shipping_city_id, entity_id,
            financial_id } = req.body;
        const Obj = {
            business_name, business_phone_number, business_email,
            business_address, business_website, zip_code,
            contract_first_name, contract_last_name, contract_phone_number, contract_address,
            contract_email, shipping_address, shipping_zip_code, same_as_bussiness_address,
            max_credit_limit_amount, total_amount_utilize, available_amount, late_charges,
            term_and_conditions, country_id, shipping_country_id,
            state_id, shipping_state_id, entity_id,
            financial_id
        }
        if (shipping_city_id !== "") {
            Obj.shipping_city_id = shipping_city_id
        }
        if (city_id !== "") {
            Obj.city_id = city_id
        }
        const updateUser = await db.superUser.update(Obj, { where: { id: req.params.id } })


        if (updateUser[0]) {
            return res.status(200).send({ code: 200, message: 'Super User Updated Successfully' });
        } else {
            return res.status(200).send({ code: 404, message: 'No Super User Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}


module.exports.deleteSuperUser = async (req, res) => {
    try {
        const deleteUser = await db.superUser.update({ is_deleted: true }, { where: { id: req.params.id } });
        if (deleteUser) {
            return res.status(200).send({ code: 200, message: 'Super User Deleted Successfully' });
        } else {
            return res.status(200).send({ code: 404, message: 'No Super User Found with given ID' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, massege: error.message });
    }
}

exports.updateSuperUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const isExist = await db.superUser.findOne({ where: { id: id, is_deleted: false } });
        if (!isExist) {
            return res.status(404).send({ code: 404, message: "Super User Not Found!" });
        }
        await db.superUser.update({
            status: status
        }, { where: { id: id } });
        return res.status(200).send({ code: 200, message: "Status Updated Successfully" });
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    };
};

module.exports.customerCreditDebit = async (req, res) => {
  try {
    const {
      customer_id,
      payment_terms,
      bank_name,
      bank_branch,
      bank_ac_num,
      sactioned_credit_limit,
      utilized_credit_limit,
      sactioned_credit_period,
      available_credit_limit,
      utilized_credit_days,
      remainig_credit_days,
      grace_period,
      swift_code,
      ifsc_code,
      interest,
      tab_type,
      bank_id
    } = req.body;

    if (!customer_id) {
      return res.status(400).send({ code: 400, message: "Customer ID is required" });
    }

    // 🔍 Check if record already exists for customer_id
    const existingData = await db.customerCreditDebit.findOne({
      where: { customer_id: customer_id }
    });

    if (existingData) {
      // ✅ Update existing record
      await existingData.update({
        payment_terms,
        bank_name,
        bank_branch,
        bank_ac_num,
        sactioned_credit_limit,
        utilized_credit_limit,
        sactioned_credit_period,
        available_credit_limit,
        utilized_credit_days,
        remainig_credit_days,
        grace_period,
        swift_code,
        ifsc_code,
        interest,
        tab_type,
        bank_id
      });

      return res.status(200).send({
        code: 200,
        message: "Customer Credit/Debit updated successfully",
        data: existingData
      });
    } else {
      // ✅ Create new record
      const createData = await db.customerCreditDebit.create({
        customer_id,
        payment_terms,
        bank_name,
        bank_branch,
        bank_ac_num,
        sactioned_credit_limit,
        utilized_credit_limit,
        sactioned_credit_period,
        available_credit_limit,
        utilized_credit_days,
        remainig_credit_days,
        grace_period,
        swift_code,
        ifsc_code,
        interest,
        tab_type,
        bank_id
      });

      return res.status(201).send({
        code: 201,
        message: "Customer Credit/Debit created successfully",
        data: createData
      });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getCustomerCreditDebitByCustomerId = async (req, res) => {
  try {
    const { customer_id } = req.params;

    if (!customer_id) {
      return res.status(400).send({ code: 400, message: "Customer ID is required" });
    }

    // const customerData = await db.customerCreditDebit.findAll({
    //   where: { customer_id: customer_id },
    // });
    const customerData = await db.sequelize.query(`
      SELECT 
          SC.*,
          IFNULL(SUM(SIM.grand_total),0) AS utilized_credit_limit,
          SC.sactioned_credit_limit - IFNULL(SUM(SIM.grand_total),0) AS available_credit_limit
      FROM SALES_SUPER_CREDIT_DEBIT_MST SC
      LEFT JOIN CRM_CREATE_PROPOSAL_MST CPM
          ON CPM.customer_id = SC.customer_id
      LEFT JOIN SALES_ORDER_MST SOM
          ON SOM.proposal_id = CPM.id
      LEFT JOIN CRM_SALES_INVOICE_MST SIM
          ON SIM.so_id = SOM.id
          AND SIM.invoice_status = 'APPROVED'
          AND SIM.payment_status = 'UNPAID'
      WHERE SC.customer_id = ${customer_id}
      GROUP BY SC.id
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });

    if (!customerData || customerData.length === 0) {
      return res.status(404).send({ code: 404, message: "No records found for this customer" });
    }

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: customerData 
    });

  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.getCustomerInvoiceList = async (req, res) => {
  try {
    const { customer_id } = req.params;

    if (!customer_id) {
      return res.status(400).send({
        code: 400,
        message: "Customer ID is required"
      });
    }

    const invoiceList = await db.sequelize.query(
      `
      SELECT
        SIM.id,
        SIM.sales_invoice_no,
        SIM.sales_invoice_date,
        SIM.invoice_status,
        SIM.payment_status,
        SOM.sales_order_no,
        SIM.grand_total
      FROM CRM_SALES_INVOICE_MST SIM
      INNER JOIN SALES_ORDER_MST SOM
        ON SOM.id = SIM.so_id
      INNER JOIN CRM_CREATE_PROPOSAL_MST CPM
        ON CPM.id = SOM.proposal_id
      WHERE CPM.customer_id = :customer_id
      ORDER BY SIM.id DESC
      `,
      {
        replacements: { customer_id },
        type: db.sequelize.QueryTypes.SELECT
      }
    );

    return res.status(200).send({
      code: 200,
      message: "Data fetched successfully",
      data: invoiceList
    });

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message
    });
  }
};