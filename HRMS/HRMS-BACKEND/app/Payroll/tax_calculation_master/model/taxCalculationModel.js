module.exports = (sequelize, Sequelize) => {
    const TaxCessRate = sequelize.define("TAX_CALCULATION_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cess_rate: {
            type: Sequelize.FLOAT(5, 2),
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
            allowNull: false,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        }

    );

    return TaxCessRate;
};
