const { sequelize, Sequelize } = require("../../../models");

module.exports = (sequelize,Sequelize) =>{
    const gstType = sequelize.define("MASTER_GST_TYPE",{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        gst_type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
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

    return gstType;
};