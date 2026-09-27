module.exports = (sequelize, Sequelize) => {
    const addProduction = sequelize.define("ADD_PRODUCTION_MST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        total_qty: {
            type: Sequelize.INTEGER
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