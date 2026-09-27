module.exports = (sequelize, Sequelize) => {
  const quotationApproval = sequelize.define("MASTER_QUOTATION_APPROVAL", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
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

  return quotationApproval;
};
