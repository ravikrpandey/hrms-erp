module.exports = (sequelize, Sequelize) => {
    const masterBonus = sequelize.define("PAYROLL_BONUS_DEDUCTION", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        month: {
            type: Sequelize.INTEGER
        },
        amount_type: {
            type: Sequelize.ENUM("TAXABLE", "NON_TAXABLE"),
            defaultValue: "NON_TAXABLE",
        },
        bonus_name: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.TEXT
        },
        bonus_type: {
            type: Sequelize.ENUM("Bonus", "Deduction"),
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return masterBonus;
};