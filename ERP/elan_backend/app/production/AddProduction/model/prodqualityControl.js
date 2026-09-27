module.exports = (sequelize, Sequelize) => {
    const prodqualityControl= sequelize.define("PROD_QUALITY_CONTROL", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sample_no:{
            type: Sequelize.STRING
        }, 
        date:{
            type: Sequelize.DATEONLY,
        },
        workstation_incharge_name:{
            type: Sequelize.STRING
        },
        total_quality_check:{
            type: Sequelize.INTEGER
        },
        total_quality_pass:{
            type: Sequelize.INTEGER
        },
        total_quality_fail:{
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        freezeTableName: true
    });

    return prodqualityControl;
};