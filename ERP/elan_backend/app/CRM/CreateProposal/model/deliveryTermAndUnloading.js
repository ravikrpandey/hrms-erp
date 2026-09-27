const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const deliveryTermAndUnloading = sequelize.define(
        "CRM_DELIVERY_TERM_AND_UNLOADING",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: Sequelize.STRING
            },
            delivery_term: {
                type: Sequelize.STRING
            },
            unloading:{
                type:Sequelize.STRING
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
    return deliveryTermAndUnloading;
};