const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const customerCreditDebit = sequelize.define(
        "SALES_SUPER_CREDIT_DEBIT_MST",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            payment_terms: {
                type: Sequelize.STRING
            },
            sactioned_credit_limit: {
                type: Sequelize.DECIMAL(20,2),
            },
            utilized_credit_limit: {
                type: Sequelize.DECIMAL(20,2),
            },
            sactioned_credit_period: {
                type: Sequelize.DECIMAL(20,2),
            },
            available_credit_limit: {
                type: Sequelize.DECIMAL(20,2),
            },
            utilized_credit_days: {
                type: Sequelize.INTEGER,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
                defaultValue: 'ACTIVE',
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            remainig_credit_days: {
                type: Sequelize.INTEGER,
            },
            grace_period: {
                type: Sequelize.INTEGER,
            },
            swift_code: {
                type: Sequelize.STRING,
            },
            ifsc_code: {
                type: Sequelize.STRING
            },
            interest: {
                type: Sequelize.STRING
            },
            tab_type: {
                type: Sequelize.STRING
            },
            bank_name: {
                type: Sequelize.STRING
            },
            bank_branch: {
                type: Sequelize.STRING
            },
            bank_ac_num: {
                type: Sequelize.STRING
            },
            
        },

        {
            freezeTableName: true,
        }
    );

    return customerCreditDebit;
};