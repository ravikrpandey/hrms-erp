const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const grossDiscountMaster = sequelize.define(
        "CRM_PROPOSAL_GROSS_DISCOUNT_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            discount_name: {
                type: Sequelize.STRING,               
            },
            description: {
                type: Sequelize.STRING,
              },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
                defaultValue: 'ACTIVE'
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }
        },
        {
            freezeTableName: true,
        }
    );
    return grossDiscountMaster;
};