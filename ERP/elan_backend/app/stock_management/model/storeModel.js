module.exports = (sequelize, Sequelize) => {
    const createStore = sequelize.define("STORE_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
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
        contact_info: {
            type: Sequelize.STRING
        },
        remaining_capacity:{
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE","ALLOCATED"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        freezeTableName: true
    });
    return createStore
}