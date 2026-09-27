const { sequelize, Sequelize } = require("../../../models");

module.exports = (sequelize,Sequelize) =>{
    const gstGlAccountMapping = sequelize.define("GST_GL_ACCOUNT_MAPPING",{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // gst_type: {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        // },
        // additional_hsn_code: {
        //     type:Sequelize.STRING,
        //     allowNull: false,
        // },
        direction: {
            type:Sequelize.STRING,
            allowNull: false,
        },
             description: {
            type:Sequelize.STRING,
            allowNull: true,
        },

         gl_account_name: {
            type: Sequelize.INTEGER,
        },

         applicable_for: {
            type: Sequelize.STRING,
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

    return gstGlAccountMapping;
};