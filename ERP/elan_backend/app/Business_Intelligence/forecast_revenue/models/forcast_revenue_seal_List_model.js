module.exports = (sequelize, Sequelize) => {
    const forcastRevenueMonth = sequelize.define("BUSINESS_INTELLIGENCE_FORCAST_REVENUE_SEAL", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        seal_volume: {
            type: Sequelize.DECIMAL(10,2),
        },
        seal_amount: {
            type: Sequelize.DECIMAL(10,2),
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
    return forcastRevenueMonth;
}