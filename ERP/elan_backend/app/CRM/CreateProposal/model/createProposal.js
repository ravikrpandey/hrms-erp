const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const proposalData = sequelize.define(
    "CRM_CREATE_PROPOSAL_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      proposal_no: {
        type: Sequelize.STRING,
      },
      // proposal_type: {
      //   type: Sequelize.STRING,
      // },
      gst_no: {
        type: Sequelize.STRING,
      },
      total_cost: {
        type: Sequelize.DECIMAL(20, 2),
      },
      additional_charges: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalAMTAfterDiscount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      discount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      taxable_value: {
        type: Sequelize.DECIMAL(20, 2),
      },
      sgst: {
        type: Sequelize.DECIMAL(20, 2),
      },
      cgst: {
        type: Sequelize.DECIMAL(20, 2),
      },
      igst: {
        type: Sequelize.DECIMAL(20, 2),
      },
      grant_total: {
        type: Sequelize.DECIMAL(20, 2),
      },
      gstTotal: {
        type: Sequelize.DECIMAL(20, 2),
      },
      grossTotal: {
        type: Sequelize.DECIMAL(20, 2),
      },
      totalDiscountPercent: {
        type: Sequelize.DECIMAL(20, 2),
      },
      mail_id: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      dealer : {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is__discount_requested: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      proposal_status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected','draft'),
        defaultValue: 'pending'
      },
      request_type: {
        type: Sequelize.STRING
      },
      existing_client: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      lead_owner: {
        type: Sequelize.STRING,
      },
      contact_person_name: {
        type: Sequelize.STRING,
      },
      contact_number: {
        type: Sequelize.STRING,
      },
      mail_id: {
        type: Sequelize.STRING,
      },
      new_version: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      is_dispatch_status: {
        type: Sequelize.ENUM("PENDING", "APPROVED"),
        defaultValue: "PENDING",
      },
      new_customer: {
        type: Sequelize.ENUM('yes', 'no'),
        defaultValue: "no",
      },
      quotation_type: {
        type: Sequelize.ENUM('direct', 'in direct'),
        defaultValue: "in direct",
      },
        currency_symbol: {
        type: Sequelize.STRING,
         defaultValue: "₹",
      },
      created_by: {
        type: Sequelize.ENUM("Self", "Any Other"),
        defaultValue: "Self",
      },
      delivery_term_remark:{type:Sequelize.TEXT},
      unloading_resp_remark:{type:Sequelize.TEXT},
      unloading_resp_amount: {type: Sequelize.DECIMAL(20, 2)},
      warranty_month:{type:Sequelize.Sequelize.STRING},
      warranty_month_remark:{type:Sequelize.TEXT}, // use for Special Warranty Terms
      valid_till_date: {
        type: Sequelize.DATEONLY,
      },
      advance_check:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      advance_amount:{
        type: Sequelize.DECIMAL(20,2)
      },
      insurance_amt:{
        type: Sequelize.DECIMAL(20,2)
      }
    },
    {
      freezeTableName: true,
    }
  );
  return proposalData;
};