module.exports = (sequelize, Sequelize) => {
    const PROCUREMENT_PURCHASE_VENDOR_QUOTATION = sequelize.define("PROCUREMENT_PURCHASE_VENDOR_QUOTATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quotation_for: {
            type: Sequelize.ENUM("RFP", "Negotiation"),
            comment: "RFP or Negotiation"
        },
        quotation_code: {
            type: Sequelize.STRING,
            comment: "RFP or Negotiation code"
        },
        approval_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING",
            comment: "Approval status"
        },
        remarks_approval: {
            type: Sequelize.STRING,
            comment: "Approval remarks"
        },
        // negotiation_id: {
        //     type: Sequelize.INTEGER,
        //     comment: "Negotiation ID"
        // },
        // pr_id: {
        //     type: Sequelize.INTEGER,
        //     comment: "PR ID for rfp"
        // },
        rfp_number: {
            type: Sequelize.STRING
        },
    },
        {
            freezeTableName: true,
        });
    return PROCUREMENT_PURCHASE_VENDOR_QUOTATION
}