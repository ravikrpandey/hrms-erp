module.exports = (sequelize, Sequelize) => {
    const warehouse = sequelize.define("WAREHOUSE_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        code: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        pin: {
            type: Sequelize.STRING
        },
        mark_as_default: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "INACTIVE"
        },
        manager_name: {
            type: Sequelize.INTEGER
        },
        contact_info: {
            type: Sequelize.STRING
        },
        capacity:{
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE","ALLOCATED"),
            defaultValue: "ACTIVE"
        },
        space: {
            type: Sequelize.ENUM('FULL','EMPTY'),
            defaultValue: "EMPTY"
          },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        remaining_capacity:{
            type: Sequelize.INTEGER
        },
    }, {
        freezeTableName: true
    });
    return warehouse
}