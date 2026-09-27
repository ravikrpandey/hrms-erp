module.exports = (sequelize, Sequelize) => {
  const quotationApprovalDetails = sequelize.define("MASTER_QUOTATION_APPROVAL_DETAILS", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    // quotationApprovalId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "MASTER_QUOTATION_APPROVAL", 
    //     key: "id"
    //   },
    //   onDelete: "CASCADE"
    // },
    // sub_category_id: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false
    // },
    // level_id: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false
    // },
    discount: {
       type: Sequelize.INTEGER,
      allowNull: false
    },
     isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    freezeTableName: true
  });

  return quotationApprovalDetails;
};
