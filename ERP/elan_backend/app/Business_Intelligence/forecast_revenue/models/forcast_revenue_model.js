module.exports = (sequelize, Sequelize) => {
    const forcastRevenue = sequelize.define("BUSINESS_INTELLIGENCE_FORCAST_REVENUE", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        forcast_month: {
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
    return forcastRevenue;
}