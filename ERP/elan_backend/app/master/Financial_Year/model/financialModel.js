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
        year_start_date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        year_end_date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        add_start_date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        add_end_date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        is_add_date:{
            type: Sequelize.BOOLEAN,
            defaultValue:false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    },

        {
            freezeTableName: true,
        })
        ;
    return financial_year;
};
