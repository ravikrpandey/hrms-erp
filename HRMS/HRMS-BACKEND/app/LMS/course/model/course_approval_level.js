module.exports = (sequelize, Sequelize) => {
    const lmsApprovalCourse = sequelize.define(
      "LMS_APPROVAL_COURSE",
      {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        level: {
            type: Sequelize.INTEGER
        },
        approvel_status: {
            type: Sequelize.ENUM("APPROVED", "PENDING","REJECTED"),
            defaultValue: "PENDING"
        },
        remark:{
            type: Sequelize.TEXT
        },
        progressStatus: {
            type: Sequelize.ENUM("OPEN", "CLOSE"),
            defaultValue: "OPEN"
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
        freezeTableName: true,
      }
    );
  
    return lmsApprovalCourse;
  };