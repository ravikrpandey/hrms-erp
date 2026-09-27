module.exports = (sequelize, Sequelize) => {
    const resignationDetail = sequelize.define("ESS_EMPLOYEE_RESIGNATION", {
         id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // employee_id: {
        //     type: Sequelize.INTEGER
        // },
        employee_name: {
            type: Sequelize.STRING
        },
        department: {
            type: Sequelize.STRING
        },
        joining_date: {
            type: Sequelize.DATEONLY
        },
        notice_period: {
            type: Sequelize.STRING
        },
        is_notice_adjust:{
            type: Sequelize.INTEGER
        },
        job_location: {
            type: Sequelize.STRING
        },
        manager: {
            type: Sequelize.STRING
        },
        resign_date: {
            type: Sequelize.DATEONLY
        },
        reason: {
            type: Sequelize.STRING
        },
        remarks: {
            type: Sequelize.STRING
        },
        // remarks_manager: {
        //     type: Sequelize.STRING
        // },
        reporting_manager_id:{
            type: Sequelize.INTEGER
        },
        paid_leaves:{
            type: Sequelize.INTEGER
        },
        reporting_manager_name:{
            type: Sequelize.STRING
        },
        last_working_day:{
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("APPROVED", "REJECTED", "PENDING","OFFBOARDING"),
            defaultValue: "PENDING"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        last_day: {
            type: Sequelize.DATEONLY
        },
        hr_remarks: {
            type: Sequelize.STRING
        },
        gratuity: {
            type: Sequelize.STRING
        },
        
        
    },
    {
      freezeTableName: true,
    });
    return resignationDetail;
};