module.exports = (sequelize, Sequelize) => {
    const complaintDetail = sequelize.define("ESS_COMPLAINT", {
        complaint_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        
        complaint_description: {
            type: Sequelize.TEXT
        },
        type: {
            type: Sequelize.ENUM("DEPARTMENT","USER"),
            defaultValue:"DEPARTMENT"
        },
        hr_remark: {
            type: Sequelize.TEXT
        },
        complaint_code: {
            type: Sequelize.STRING
        },
        created_by: {
            type: Sequelize.INTEGER
        },
        allocate_emp_id: {
            type: Sequelize.INTEGER
        },
        allocate_dept_id: {
            type: Sequelize.INTEGER
        },
       
        comment_Evaluator: {
            type: Sequelize.TEXT
        },
        reply_remark: {
            type: Sequelize.TEXT
        },
        upload_user_file: {
            type: Sequelize.TEXT
        },
     
        status: {
            type: Sequelize.STRING,
            defaultValue: "ACTIVE"
        },
        complain_status:{
            type:Sequelize.ENUM("PENDING","COMPLETED","HOLD","REJECTED","ASSIGNED","REPLIED"),
            defaultValue:"PENDING"
        }
    },
    {
      freezeTableName: true,
    });
    return complaintDetail;
};