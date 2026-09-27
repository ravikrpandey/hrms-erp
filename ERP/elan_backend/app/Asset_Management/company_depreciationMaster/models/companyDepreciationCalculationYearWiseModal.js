module.exports = (sequelize, Sequelize) => {
    const depreciationCalculationYearLog = sequelize.define("ASSETCOMPANY_DEPRECIATIONCALCULATION_YEARLOG", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        financialYear: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        depPeriodDays: {
            type: Sequelize.INTEGER,
        },
        depYearFraction: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        depAmount: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        cumulativeDepreciation: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        
        closingValue: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        
        cumulativeDepYearFraction: {
            type: Sequelize.FLOAT,
            allowNull: true
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
    return depreciationCalculationYearLog;
}