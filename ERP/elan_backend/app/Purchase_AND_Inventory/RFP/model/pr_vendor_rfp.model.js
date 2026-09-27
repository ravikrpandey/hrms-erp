module.exports = (sequelize, Sequelize) => {
  const PROCUREMENT_PURCHASE_VENDOR_RFP = sequelize.define(
    "PROCUREMENT_PURCHASE_VENDOR_RFP_ITEM",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      expected_delivery_date: {
        type: Sequelize.STRING,
        comment: "Vendor Confirm Expected Delivery Date",
      },
      confirm_date: {
        type: Sequelize.STRING,
        comment: "RFP Delivery Confirm Date",
      },
      price_amt: {
        type: Sequelize.INTEGER,
      },
      sgst: {
        type: Sequelize.INTEGER,
      },
      cgst: {
        type: Sequelize.INTEGER,
      },
      igst: {
        type: Sequelize.INTEGER,
      },
      delivery_charges: {
        type: Sequelize.INTEGER,
      },
      additional_charges: {
        type: Sequelize.INTEGER,
      },
      vendor_remarks: {
        type: Sequelize.STRING,
        comment: "Vendor Rfp Remark",
      },
      vendor_uploaded_document: {
        type: Sequelize.STRING,
        comment: "Vendor Rfp Document",
      },
      remarks_approvel: {
        type: Sequelize.STRING,
      },
      checked: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
      vendor_responded: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
      rfp_number: {
        type: Sequelize.STRING,
      },
      rfp_start_date: {
        type: Sequelize.STRING,
      },
      rfp_end_date: {
        type: Sequelize.STRING,
      },
      rfp_status: {
        type: Sequelize.STRING,
        defaultValue: "LIVE RFP",
      },
      rfp_stop_date: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
    },
  );
  return PROCUREMENT_PURCHASE_VENDOR_RFP;
};
