module.exports = (sequelize, Sequelize) => {
    const financeCostCenterMap = sequelize.define("FINANCE_COST_CENTER_MAPPING", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        extend_type:{
            type: Sequelize.ENUM("Increase", "Decrease")
        },
        cost_center_type: {
            type: Sequelize.ENUM("Capex", "Opex")
        },
        cost_amount: {
            type: Sequelize.DECIMAL(20,2),
        },
        remaining_cost_amount: {
            type: Sequelize.DECIMAL(20,2),
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
    return financeCostCenterMap;
}
