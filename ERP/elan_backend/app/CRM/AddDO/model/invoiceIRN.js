const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const salesIrnData = sequelize.define(
        "CRM_INVOICE_IRN_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            GSTIN: {
                type: Sequelize.STRING
            },
            DocNo: {
                type: Sequelize.STRING,
            },
            DocType: {
                type: Sequelize.STRING,
            },
            DocDate: {
                type: Sequelize.STRING,
            },
            Irn: {
                type: Sequelize.STRING,
            },
            AckDate: {
                type: Sequelize.STRING,
            },
            AckNo: {
                type: Sequelize.STRING,
            },
            EwbNo: {
                type: Sequelize.STRING,
            },
            EwbDt: {
                type: Sequelize.STRING,
            },
            EwbValidTill: {
                type: Sequelize.STRING,
            },
            SignedQRCode: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            },
            SignedInvoice: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
            },
            InfoDtls: {
                type: Sequelize.STRING,
            },
            Remarks: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
                defaultValue: "ACTIVE",
            },
            isDeleted: {
                type: Sequelize.BOOLEAN(true, false),
                defaultValue: false
            }
        },

        {
            freezeTableName: true,
        }
    );
    return salesIrnData;
};