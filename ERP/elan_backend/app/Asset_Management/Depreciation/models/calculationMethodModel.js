module.exports = (sequelize, Sequelize) => {
    const calculationMethod = sequelize.define("tbl_calculationMethods", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        calculationMethod: {
            type: Sequelize.ENUM("SLM", "WDV"),
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
    return calculationMethod;
}