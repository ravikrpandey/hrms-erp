module.exports = (sequelize, Sequelize) => {
    const TaxSurcharge = sequelize.define("TAX_CALCULATION_SURCHARGE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        threshold: {
            type: Sequelize.FLOAT(12, 2),
            allowNull: false,
        },
        rate: {
            type: Sequelize.FLOAT(5, 2),
            allowNull: false,
        },
        remarks: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    },
        {
            freezeTableName: true,
        }
    );

    return TaxSurcharge;
};
