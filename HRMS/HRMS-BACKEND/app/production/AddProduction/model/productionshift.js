module.exports = (sequelize, Sequelize) => {
    const productionMappingshift= sequelize.define("PRODUCTION_LIST_MST_SHIFT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type: Sequelize.DATEONLY,
        },
        quality_passed: {
            type: Sequelize.INTEGER
        },
        ng: {
            type: Sequelize.INTEGER
        },
        total_production: {
            type: Sequelize.INTEGER
        },
        generate_label: {
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

    return productionMappingshift;
};