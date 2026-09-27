module.exports = (sequelize, Sequelize) => {
    const asset_depreciation = sequelize.define("ASSET_MANAGEMENT_DEPRECIATION", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        depreciation_amount: {
            type: Sequelize.DECIMAL(10,2),
        },
        depreciation_type: {
            type: Sequelize.ENUM("Forecast", "Actual"),
        },
        depreciation_month: {
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
    return asset_depreciation;
}