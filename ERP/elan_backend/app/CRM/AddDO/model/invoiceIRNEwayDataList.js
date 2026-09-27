const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const ewayDatalIST = sequelize.define(
        "CRM_EWAY_DATA_LIST_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            PrdDesc: {
                type: Sequelize.STRING,
            },
            HsnCd: {
                type: Sequelize.STRING,
            },
            Qty: {
                type: Sequelize.STRING,
            },
            PreTaxVal: {
                type: Sequelize.STRING,
            },
            GstRt: {
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
    return ewayDatalIST;
};