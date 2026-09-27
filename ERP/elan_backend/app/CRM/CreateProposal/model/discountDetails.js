const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const discountDetails = sequelize.define(
        "CRM_PROPOSAL_GROSS_DISCOUNT",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            discount_type: {
                type: Sequelize.ENUM('percent', 'flat')                
            },
            discount_value: {
                type: Sequelize.DECIMAL(20, 2),
            },
            discount_amount: {
                type: Sequelize.DECIMAL(20, 2),
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
    return discountDetails;
};