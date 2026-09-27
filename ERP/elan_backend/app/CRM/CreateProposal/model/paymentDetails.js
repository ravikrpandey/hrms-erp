const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const paymentDetails = sequelize.define(
        "CRM_PROPOSAL_PAYMENT_DETAILS",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            payment_value: {
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
    return paymentDetails;
};