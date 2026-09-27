module.exports = (sequelize, Sequelize) => {
    const workstationmaintenance= sequelize.define("PRODUCTION_WORKSTATION_MAINTENANCE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        start_date:{
            type: Sequelize.DATEONLY,
        },
        start_time: {
            type: Sequelize.TIME
        },
        end_date:{
            type: Sequelize.DATEONLY,
        },
        end_time: {
            type: Sequelize.TIME
        },
        product_name:{
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

    return workstationmaintenance;
};