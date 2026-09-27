module.exports = (sequelize, Sequelize) => {
    const essApplyLeaveDetail = sequelize.define("ESS_APPLIED_LEAVE_DETAIL", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        leave_for: {
          type: Sequelize.ENUM('ME', 'TEAMMATE'),
          defaultValue: 'ME'
        },
        start_date: {
          type: Sequelize.DATEONLY('YYYY-MM-DD'),
          allowNull: true
        },  
        approved_start_date: {
          type: Sequelize.DATEONLY('YYYY-MM-DD'),
          allowNull: true
        },  
        end_date: {
          type: Sequelize.DATEONLY('YYYY-MM-DD'),
          allowNull: true
        },
        approved_end_date: {
          type: Sequelize.DATEONLY('YYYY-MM-DD'),
          allowNull: true
        },
        leave_days: {
          type: Sequelize.DECIMAL(10,2),
          defaultValue: 0
        },
        approved_days: {
          type: Sequelize.DECIMAL(10,2),
          defaultValue: 0
        },
        justification: {
          type: Sequelize.STRING,
          allowNull: true
        },
        approval_status: {
          type: Sequelize.ENUM("PENDING", "APPROVED","REJECTED","PENDING FROM APPROVAL END"),
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
    }, {
        freezeTableName: true,
        timestamps: true // Adds createdAt and updatedAt fields
    });
    return essApplyLeaveDetail;
};

