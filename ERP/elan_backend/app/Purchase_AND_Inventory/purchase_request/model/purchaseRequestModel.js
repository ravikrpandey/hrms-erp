module.exports = (sequelize, Sequelize) => {
    const purchase_details = sequelize.define("PROCUREMENT_PURCHASE_REQUEST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pr_category: {
            type: Sequelize.ENUM("Item", "Service"),
        },
        pr_date: {
            type: Sequelize.DATEONLY,
        },
        pr_number: {
            type: Sequelize.STRING,
        },
        pr_type: {
            type: Sequelize.ENUM("Capex", "Opex")
        },
        total_purchase: {
            type: Sequelize.INTEGER,
        },
        vendors_invited_count: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        vendors_responded_count: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        final_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING"
        },
        remark: {
            type: Sequelize.TEXT,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        rfp_Initiated: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        rfp_start_date: {
            type: Sequelize.DATEONLY
        },
        rfp_end_date: {
            type: Sequelize.DATEONLY
        },
        rfp_stop_date: {
            type: Sequelize.DATEONLY
        },
        rfp_delivery_date: {
            type: Sequelize.DATEONLY
        },
        rfp_status: {
            type: Sequelize.ENUM("LIVE RFP", "CLOSE RFP"),
            defaultValue: "CLOSE RFP"
        },
        nego_status: {
            type: Sequelize.ENUM("LIVE NEGO", "CLOSE NEGO"),
            defaultValue: "CLOSE NEGO"
        },
        rfp_number: {
            type: Sequelize.STRING
        },
    },
        {
            freezeTableName: true,
        });
    return purchase_details;
};
