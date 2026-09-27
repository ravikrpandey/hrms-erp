const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const gstInfo = sequelize.define(
        "CRM_GST_INFO_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            CDKey: {
                type: Sequelize.STRING
            },
            EInvUserName: {
                type: Sequelize.STRING,
            },
            EInvPassword: {
                type: Sequelize.STRING,
            },
            EFUserName: {
                type: Sequelize.STRING,
            },
            EFPassword: {
                type: Sequelize.STRING,
            },
            GSTIN: {
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
    return gstInfo;
};