module.exports = (sequelize, Sequelize) => {
    const financeCostCenter = sequelize.define("FINANCE_COST_CENTER", {
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
            type: Sequelize.DECIMAL(20,2)
        },
        type:{
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.INTEGER
        },
        used_budget_amount: {
            type: Sequelize.DECIMAL(20,2)
        },
        cost_center_type: {
            type: Sequelize.ENUM("Capex", "Opex")
        },
        expense_type: {
            type: Sequelize.STRING
        },
        cost_profit_center_name: {
            type: Sequelize.STRING
        },

        valid_from: {
            type: Sequelize.DATEONLY,
            allowNull: true
          },

          valid_to: {
            type: Sequelize.DATEONLY,
            allowNull: true
          },
          is_group: {
            type: Sequelize.ENUM("YES", "NO"),
            defaultValue: 'NO'
        },
        remark:{
            type: Sequelize.STRING
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        parent_cost_center_id:{
            type: Sequelize.INTEGER
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return financeCostCenter;
}
