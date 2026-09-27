const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const proforma = sequelize.define(
        "SALES_PROFORMA_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            proforma_doc_code: {
                type: Sequelize.STRING
            },
            delivery_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            proforma_create_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            details_photo: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            sales_created: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
                defaultValue: 'PENDING',
            },
        },

        {
            freezeTableName: true,
        }
    );

    return proforma;
};