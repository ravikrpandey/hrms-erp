const { sequelize, Sequelize } = require("../../../models");

module.exports = (sequelize,Sequelize) =>{
    const mapSalesAccount = sequelize.define("MAP_SALE_ACCOUNT",{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },


        // account_name: {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        // },
        // additional_hsn_code: {
        //     type:Sequelize.STRING,
        //     allowNull: false,
        // },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
    },
    {
        freezeTableName: true,
    })
    ;

    return mapSalesAccount;
};