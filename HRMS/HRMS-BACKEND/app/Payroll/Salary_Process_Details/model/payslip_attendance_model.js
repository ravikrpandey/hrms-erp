module.exports = (sequelize, Sequelize) => {
    const payroll_att_month = sequelize.define("HRMS_PAYROLL_MONTH_ATTENDANCE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        total_P: {
            type: Sequelize.INTEGER,
        },
        total_DP: {
            type: Sequelize.INTEGER,
        },
        total_A: {
            type: Sequelize.INTEGER,
        },
        total_DA: {
            type: Sequelize.INTEGER,
        },
        total_HD: {
            type: Sequelize.INTEGER,
        },
        total_PFD: {
            type: Sequelize.INTEGER,
        },
        total_PHD: {
            type: Sequelize.INTEGER,
        },
        total_HPFD: {
            type: Sequelize.INTEGER,
        },
        total_HPHD: {
            type: Sequelize.INTEGER,
        },
        total_NPFD: {
            type: Sequelize.INTEGER,
        },
        total_NPHD: {
            type: Sequelize.INTEGER,
        },
        total_UL: {
            type: Sequelize.INTEGER,
        },
        total_UHL: {
            type: Sequelize.INTEGER,
        },
        total_CO: {
            type: Sequelize.INTEGER,
        },
        total_WFO: {
            type: Sequelize.INTEGER,
        },
        total_WHO: {
            type: Sequelize.INTEGER,
        },
        total_H: {
            type: Sequelize.INTEGER,
        },
        att_month: {
            type: Sequelize.INTEGER,
        },
        salary_process_month: {
            type: Sequelize.INTEGER,
        },
        att_year: {
            type: Sequelize.INTEGER,
        },
        payroll_cycle_start_date: {
            type: Sequelize.DATEONLY,
        },
        payroll_cycle_end_date: {
            type: Sequelize.DATEONLY,
        },
        working_days: {
            type: Sequelize.INTEGER,
        },
        total_present_day: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
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
    return payroll_att_month;
};
