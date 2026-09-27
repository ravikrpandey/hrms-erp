module.exports = (sequelize, Sequelize) => {
    const financeIncomeStatement = sequelize.define("FINANCE_INCOME_STATEMENT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        income_type: {
            type: Sequelize.ENUM("Forecast", "Actual"),
        },
        total_revenue: {
            type: Sequelize.DECIMAL(10,2),
        },
        operating_expense: {
            type: Sequelize.DECIMAL(10,2),
        },
        variable_cost: {
            type: Sequelize.DECIMAL(10,2),
        },
        gross_profit_loss: {
            type: Sequelize.DECIMAL(10,2),
        },
        ebitda: {
            type: Sequelize.DECIMAL(10,2),
        },
        depreciation_and_amortization: {
            type: Sequelize.DECIMAL(10,2),
        },
        operating_profit_loss: {
            type: Sequelize.DECIMAL(10,2),
        },
        investment_income: {
            type: Sequelize.DECIMAL(10,2),
        },
        interest_paid_and_finance_charges: {
            type: Sequelize.DECIMAL(10,2),
        },
        net_income_loss_before_tax: {
            type: Sequelize.DECIMAL(10,2),
        },
        attributable_earning: {
            type: Sequelize.DECIMAL(10,2),
        },
        remarks: {
            type: Sequelize.TEXT
        },
        final_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING"
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
        });
    return financeIncomeStatement
}