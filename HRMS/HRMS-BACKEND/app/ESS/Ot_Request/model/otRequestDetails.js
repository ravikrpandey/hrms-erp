module.exports = (sequelize, Sequelize) => {
    const overtime_Request_Details = sequelize.define("ESS_OVERTIME_REQUEST_DETAILS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
         from_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        to_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        from_time: {
            type: Sequelize.TIME,
        },
        to_time: {
           type: Sequelize.TIME,
        },
        total_hour: {
              type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        approve_hours: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        employee_remark: {
            type: Sequelize.TEXT,
        },
        payroll_month: {
            type: Sequelize.INTEGER,
            allowNull: true
        },

        payroll_year: {
            type: Sequelize.STRING,
            allowNull: true
        },
        applied_rate: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull: true
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
    return overtime_Request_Details;
};
