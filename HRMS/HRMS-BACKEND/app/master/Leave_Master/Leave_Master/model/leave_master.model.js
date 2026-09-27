module.exports = (sequelize, Sequelize) => {
    const leavePolicyDetails = sequelize.define("MASTER_LEAVE_POLICY_DETAILS", {
        leavePolicyId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        attendance_calender_id: {
            type: Sequelize.INTEGER,
        },
        employee_id: {
            type: Sequelize.INTEGER,
        },
        leave_id: {
            type: Sequelize.INTEGER,
        },
        leaveName: {
            type: Sequelize.STRING,
        },
        applier_name: {
            type: Sequelize.STRING,
        },
        leaveCount: {
            type: Sequelize.INTEGER
        },
        total_leave_count: {
            type: Sequelize.INTEGER
        },
        remaning_leave: {
            type: Sequelize.INTEGER
        },
        leaveType: {
            type: Sequelize.STRING,
        },
        leave_type: {
            type: Sequelize.STRING,
        },
        leaveUnit: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
        fromDate: {
            type: Sequelize.DATEONLY("2023-01-01"),
        },
        toDate: {
            type: Sequelize.DATEONLY("2023-01-01"),
        },
        leaveCode: {
            type: Sequelize.STRING,
        },
        accrualLeave: {
            type: Sequelize.JSON
        },
        resetLeave: {
            type: Sequelize.JSON,
        },
        creditLeave: {
            type: Sequelize.JSON,
        },
        prorateLeave: {
            type: Sequelize.JSON,
        },
        openingBalance: {
            type: Sequelize.JSON,
        },
        maximumBalance: {
            type: Sequelize.JSON,
        },
        applicableGender: {
            type: Sequelize.STRING,
        },
        applicableMaritalStatus: {
            type: Sequelize.STRING,
        },
        department_name: {
            type: Sequelize.STRING
        },
        role_master_name: {
            type: Sequelize.STRING
        },
        employee: {
            type: Sequelize.STRING
        },
        countAsLeaveBtWeekend: {
            type: Sequelize.JSON,
        },
        countAsLeaveBtHoliday: {
            type: Sequelize.JSON,
        },
        isLeaveExcide: {
            type: Sequelize.STRING,
        },
        DurationAllowed: {
            type: Sequelize.STRING,
        },
        MaxLeaveAllowed: {
            type: Sequelize.STRING,
        },
        LeaveSubmittedBefore: {
            type: Sequelize.STRING,
        },
        on_date: {
            type: Sequelize.DATEONLY("YYYY-MM-DD"),
        },
        number_of_hours: {
            type: Sequelize.STRING,
        },
        start_time: {
            type: Sequelize.STRING,
        },
        leave_status: {
            type: Sequelize.ENUM("APPROVED", "UNAPPROVED", "REJECTED"),
            defaultValue: "APPROVED"
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
    
    {
      freezeTableName: true,
    });
    return leavePolicyDetails;
};

