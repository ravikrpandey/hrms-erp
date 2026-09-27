module.exports = (sequelize, Sequelize) => {
    const productionWorkStation= sequelize.define("PRODUCTION_LIST_MST_WORKSTATION", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        net_production: {
            type: Sequelize.INTEGER
        },
        rework: {
            type: Sequelize.INTEGER
        },
        date:{
            type: Sequelize.DATEONLY,
        },
        workstation_type:{
            type: Sequelize.STRING
        },
        running_cost:{
            type: Sequelize.STRING
        },
        description:{
            type: Sequelize.STRING
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

    return productionWorkStation;
};