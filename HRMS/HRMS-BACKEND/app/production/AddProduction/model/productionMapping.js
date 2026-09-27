module.exports = (sequelize, Sequelize) => {
    const productionMapping = sequelize.define("PRODUCTION_SUB_MASTER_LIST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        production_order_no:{
            type: Sequelize.STRING
        },
        production_qty: {
            type: Sequelize.INTEGER,
        },
        status_schedule: {
            type: Sequelize.ENUM("START", "In-Progress","HOLD","STOP"),
            defaultValue: "START"
        },
        start_date:{
            type: Sequelize.DATEONLY,
        },
        end_date:{
            type: Sequelize.DATEONLY,
        },
       
        production_manager_id:{
            type: Sequelize.INTEGER
        },
        batch_number: {
            type: Sequelize.STRING
        },
        s_number: {
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

    return productionMapping;
};