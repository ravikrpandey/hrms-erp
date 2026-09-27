module.exports = (sequelize, Sequelize) => {
    const payroll_work_flow_range = sequelize.define('HRMS_PAYROLL_WORKFLOW_RANGE', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
      
        level:{
            type: Sequelize.INTEGER
        },
        status:{
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
     
    },
    {
        freezeTableName: true
    });
    return payroll_work_flow_range;
}