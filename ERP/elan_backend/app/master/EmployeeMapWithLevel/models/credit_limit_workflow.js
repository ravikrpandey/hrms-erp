module.exports = (sequelize, Sequelize) => {
  const credit_limit_approval_workflow = sequelize.define("CREDIT_LIMIT_APPROVAL_WORKFLOW", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    credit_approval_status: {
      type: Sequelize.ENUM("Pending", "Approved", "Rejected", "Forward"),
      defaultValue: "Pending"
    },

    final_credit_status: {
      type: Sequelize.ENUM("APPROVED", "PENDING", "REJECTED"),
      defaultValue: "PENDING"
    },
    approval_type: {
      type: Sequelize.ENUM("with_approval", "without_approval"),
      
    },

    remarks: {
      type: Sequelize.STRING,
    },



    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE"
    },

    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    freezeTableName: true
  });

  return credit_limit_approval_workflow;
};
