const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const paymentMainCategory = sequelize.define(
        "CRM_PAYMENT_MAIN_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
           
            payment_name: {
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
    return paymentMainCategory;
};