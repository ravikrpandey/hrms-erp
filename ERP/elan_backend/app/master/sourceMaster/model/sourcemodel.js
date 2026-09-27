module.exports = (sequelize, Sequelize) => {
    const source = sequelize.define("MASTER_SOURCE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        source_name: {
            type: Sequelize.STRING
        },
        createdAt:{
            type: Sequelize.DATE,
            defaultValue: new Date,
        },
        updatedAt:{
            type: Sequelize.DATE,
            defaultValue: new Date,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return source;
}