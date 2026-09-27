module.exports = (sequelize, Sequelize) => {
    const fuelType_master = sequelize.define("TM_FUELTYPE_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fuelType: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.TEXT,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
        },
        {
            freezeTableName: true,
        });
    return fuelType_master;
};
