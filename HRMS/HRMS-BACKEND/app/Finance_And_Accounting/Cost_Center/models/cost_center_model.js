module.exports = (sequelize, Sequelize) => {
    const cost_center = sequelize.define("FINANCE_COST_CENTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cost_center_name: {
            type: Sequelize.STRING
        },
        cost_center_code: {
            type: Sequelize.STRING
        },
        remainingAmount: {
            type: Sequelize.FLOAT
        },
        amount: {
            type: Sequelize.INTEGER
        },
        cost_center_type: {
            type: Sequelize.ENUM("Capex", "Opex")
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
    return cost_center;
}
