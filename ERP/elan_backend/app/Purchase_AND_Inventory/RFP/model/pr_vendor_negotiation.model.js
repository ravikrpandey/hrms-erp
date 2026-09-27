module.exports = (sequelize, Sequelize) => {
    const PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION = sequelize.define("PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        negotiation_code: {
            type: Sequelize.STRING
        },
        start_date_nego: {
            type: Sequelize.STRING
        },
        end_date_nego: {
            type: Sequelize.STRING
        },
        stop_nego_date: {
            type: Sequelize.STRING
        },
        vendors_invited_count: {
            type: Sequelize.INTEGER,
        },
        vendors_responded_count: {
            type: Sequelize.INTEGER,
        },
        approval_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING"
        },
        remarks_approval: {
            type: Sequelize.STRING
        },
        nego_status: {
            type: Sequelize.ENUM("LIVE NEGO", "CLOSE NEGO"),
            defaultValue: "LIVE NEGO"
        },
        // re_negotiation: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: false
        // },
        // renegovend: {
        //     type: Sequelize.ENUM("TRUE", "FALSE"),
        //     defaultValue: "FALSE"
        // },
        rfp_number: {
            type: Sequelize.STRING
        },
    },
        {
            freezeTableName: true,
        });
    return PROCUREMENT_PURCHASE_VENDOR_NEGOTIATION
}