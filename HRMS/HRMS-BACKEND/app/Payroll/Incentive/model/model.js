module.exports = (sequelize, Sequelize) => {
    const payroll_incentive = sequelize.define(
        "PAYROLL_INCENTIVE",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            incentive_type: {
                type: Sequelize.ENUM("PERFORMANCE_BONUS", "SALES_COMMISSION", "EXTRA_HOURS", "LEAD_CLOSE", "OTHERS"),
                defaultValue: "OTHERS",
            },
            plan_name: {
                type: Sequelize.STRING,
            },
            start_date: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            end_date: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            target_kpi: {
                type: Sequelize.DECIMAL(20, 2),
            },
            target_value: {
                type: Sequelize.DECIMAL(20, 2),
            },
            achieved_value: {
                type: Sequelize.DECIMAL(20, 2),
            },
            multiplier: {
                type: Sequelize.DECIMAL(5, 2),
            },
            payment_mode: {
                type: Sequelize.ENUM("BANK_TRANSFER", "CHEQUE", "CASH", "PAYROLL"),
                defaultValue: "PAYROLL",
            },
            frequency: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            payroll_financial_year_id: {
                type: Sequelize.INTEGER,
            },
            payroll_month: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 12,
                },
            },
            recurring_payroll_fy_id: {
                type: Sequelize.INTEGER,
            },
            payroll_start_month: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 12,
                },
            },
            payroll_end_month: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 12,
                },
            },
            is_taxable: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            remarks: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
                defaultValue: "ACTIVE",
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            freezeTableName: true,
        }
    );
    return payroll_incentive;
};
