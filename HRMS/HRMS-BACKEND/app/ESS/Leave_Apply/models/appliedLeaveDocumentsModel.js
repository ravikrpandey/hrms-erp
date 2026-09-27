module.exports = (sequelize, Sequelize) => {
  const essAppliedLeaveDocuments = sequelize.define("ESS_APPLIED_LEAVE_DOCUMENTS", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uploaded_document:{
      type: Sequelize.STRING,
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
  }, {
    freezeTableName: true,
    timestamps: true
  });


  
  return essAppliedLeaveDocuments;
};

