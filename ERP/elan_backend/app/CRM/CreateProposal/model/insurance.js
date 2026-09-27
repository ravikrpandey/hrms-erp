const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const insurance = sequelize.define(
        "CRM_INSURANCE_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
           
            insurance_name: {
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
    return insurance;
};