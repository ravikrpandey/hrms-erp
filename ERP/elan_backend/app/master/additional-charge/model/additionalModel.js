const { sequelize, Sequelize } = require("../../../models");

module.exports = (sequelize,Sequelize) =>{
    const additionalCharge = sequelize.define("MASTER_ADDITIONAL_CHARGE",{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        additional_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        // additional_hsn_code: {
        //     type:Sequelize.STRING,
        //     allowNull: false,
        // },
        description_additional: {
            type:Sequelize.STRING,
            allowNull: false,
        },
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

    return additionalCharge;
};