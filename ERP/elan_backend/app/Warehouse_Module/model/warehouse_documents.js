module.exports = (sequelize, Sequelize) => {
    const warehouse_doc = sequelize.define("WAREHOUSE_DOCUMENTS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

       documents:{
        type: Sequelize.STRING
       },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE", "ALLOCATED"),
            defaultValue: "ACTIVE"
        },

        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },

    }, {
        freezeTableName: true
    });
    return warehouse_doc
}