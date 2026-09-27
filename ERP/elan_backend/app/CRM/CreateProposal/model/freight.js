const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const freight = sequelize.define(
        "CRM_FREIGHT_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            freight_name: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
                defaultValue: 'ACTIVE'
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }
        },
        {
            freezeTableName: true,
        }
    );
    return freight;
};