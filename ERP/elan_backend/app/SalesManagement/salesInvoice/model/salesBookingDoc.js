const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const salesBookingDocs = sequelize.define(
        "SALES_BOOKING_DOCS",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            file_name:{
                type:Sequelize.STRING,
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

    return salesBookingDocs;
};