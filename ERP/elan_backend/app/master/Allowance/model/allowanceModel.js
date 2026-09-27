module.exports = (sequelize, Sequelize) => {
    const Allowances = sequelize.define("MASTER_ALLOWANCE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        allowance_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        amount_type: {
            type: Sequelize.ENUM("TAXABLE", "NON_TAXABLE"),
            defaultValue: "NON_TAXABLE",
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        domestic_allowance: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
        international_allowance: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
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
    return Allowances;
};
