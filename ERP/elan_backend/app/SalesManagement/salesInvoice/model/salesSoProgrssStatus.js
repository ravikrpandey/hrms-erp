const Sequelize = require("sequelize");
const db = require('../../../models/index')
module.exports = (sequelize, Sequelize) => {
    const salesSoProgressStatus = sequelize.define(
        "SALES_SO_PROGRESS_STATUS",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            remark: {
                type: Sequelize.STRING
            },
            
          
            is_deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
                defaultValue: 'ACTIVE',
            },
        },

        {
            freezeTableName: true,
        }
    );

    return salesSoProgressStatus;
};