module.exports = (sequelize, Sequelize) => {
    const prodqualityControlParameter= sequelize.define("PRODUCTION_QUALITY_CONTROL_PARAMETER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quality_parameter_name:{
            type: Sequelize.STRING
        }, 
        quality_status:{
            type: Sequelize.ENUM("Pass", "Fail"),
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        remark:{
            type: Sequelize.STRING
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        freezeTableName: true
    });

    return prodqualityControlParameter;
};