module.exports = (sequelize, Sequelize) => {
    const addProduction = sequelize.define("PRODUCTION_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        total_qty: {
            type: Sequelize.INTEGER
        },
        product_variant: {
            type: Sequelize.STRING
        },
        image_upload: {
            type: Sequelize.STRING
        },
        schedule_verify: {
            type: Sequelize.ENUM("YES", "NO"),
            defaultValue: "NO"
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

    return addProduction;
};