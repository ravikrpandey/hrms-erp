module.exports = (sequelize, Sequelize) => {
    const timeSheet_request = sequelize.define("ESS_TIMESHEET_REQUEST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        timesheet_request_code: {
            type: Sequelize.STRING,
           },
        employee_id: {
            type: Sequelize.INTEGER
        },
        project_id: {
            type: Sequelize.INTEGER
        },
        task_id: {
            type: Sequelize.STRING
        },
        timesheet_date: {
            type: Sequelize.DATEONLY('DD-MM-YYYY')
        },
        start_time: {
            type: Sequelize.STRING,  // Stores only time (HH:MM:SS)
        },
        end_time: {
            type: Sequelize.STRING,  // Stores only time (HH:MM:SS)
        },
        total_hour: {
            type: Sequelize.STRING
        },
      
        timesheet_type: {
            type: Sequelize.ENUM("BILLABLE","NON-BILLABLE"),
            defaultValue: "NON-BILLABLE"
        },
        timesheet_approval_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED"),
            defaultValue: "PENDING"
        },
        remarks: {
            type: Sequelize.STRING
        },
        manager_comments: {
            type: Sequelize.STRING
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    },
        {
            freezeTableName: true,
        }
    );
    return timeSheet_request;
};