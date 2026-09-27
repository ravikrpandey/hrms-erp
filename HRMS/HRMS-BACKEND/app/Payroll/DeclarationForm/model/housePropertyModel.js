module.exports = (sequelize, Sequelize) => {
  const housePropertyDeclaration = sequelize.define("HOUSE_PROPERTY_DECLARATION", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    self_occupied_property: {
      type: Sequelize.JSON,
      allowNull: false
    },
    let_out_properties: {
      type: Sequelize.JSON,
      allowNull: false
    },
    summary_table: {
      type: Sequelize.JSON,
      allowNull: false
    },
    other_income: {
      type: Sequelize.JSON,
      allowNull: true
    },
    tcs_tds_deductions: {
      type: Sequelize.JSON,
      allowNull: true
    },
    remarks: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    // approval_status: {
    //   type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
    //   defaultValue: "PENDING"
    // },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE"
    },
    // approver: {
    //   type: Sequelize.INTEGER,
    //   allowNull: true
    // },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
  {
    freezeTableName: true,
  });

  return housePropertyDeclaration;
};
