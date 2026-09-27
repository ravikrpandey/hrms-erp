module.exports = (sequelize, Sequelize) => {
    const financial_year = sequelize.define("MASTER_FINANCIAL_YEAR", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        financial_year: {
            type: Sequelize.STRING,
            allowNull: false,
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
        })
        ;
    return financial_year;
};
