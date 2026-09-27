const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const addtionalContactDetails = sequelize.define(
        "CRM_ADDTIONAL_CONTACT_DETAILS",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            phone_no: {
                type: Sequelize.STRING
            },
            email_id: {
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
    return addtionalContactDetails;
};