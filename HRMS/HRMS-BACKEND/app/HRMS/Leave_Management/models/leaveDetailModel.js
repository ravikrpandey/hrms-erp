module.exports = (sequelize, Sequelize) => {
  const hrmsLeaveDetail = sequelize.define("HRMS_LEAVE_POLICY_DETAIL", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      leave_type: {
        type: Sequelize.ENUM('PAID', 'NON PAID','HALF PAID'),
        defaultValue: 'PAID',
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATEONLY('YYYY-MM-DD'),
        defaultValue : null
      },  
      endDate: {
        type: Sequelize.DATEONLY('YYYY-MM-DD'),
        allowNull: true
      },
      onceInServiceLeave: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false          
      },
      isQuotaAllotedMonthly: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false          
      },
      includeWeekendHoliday: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      },
      isApplAftrProb: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      },
      policy_validity: {
        type: Sequelize.ENUM('1', '0'), // 1:Check and 2:Uncheck 
        allowNull: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false), // 0:Not and 2:Deleted 
        defaultValue: false
      }
  }, {
      freezeTableName: true,
      timestamps: true // Adds createdAt and updatedAt fields
  });
  return hrmsLeaveDetail;
};

