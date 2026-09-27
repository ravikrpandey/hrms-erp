module.exports = (sequelize, Sequelize) => {
    const depreciationCalculation = sequelize.define("ASSETCOMPANYDEPRECIATION_CALCULATION", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        entity_id: {
            type: Sequelize.INTEGER,
        },

        calculation_id: {
            type: Sequelize.INTEGER,
        },
        asset_id: {
            type: Sequelize.STRING,
        },
        salvage_value: {
            type: Sequelize.INTEGER,
        },

        frequency: {
            type: Sequelize.ENUM("Yearly", "Monthly", "Daily"),
            allowNull: false
        },

        use_full_life: {
            type: Sequelize.STRING,
        },

        use_full_life_days: {
            type: Sequelize.STRING,
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true
        }
    )
    return depreciationCalculation;
}