module.exports = (sequelize, Sequelize) => {
    const bom = sequelize.define("PRODUCTION_BOM_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        bom_type: {
            type: Sequelize.STRING
        },
        product_variant:{
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

    return bom;
};
