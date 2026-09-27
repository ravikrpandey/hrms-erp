module.exports = (sequelize, Sequelize) => {
  const deduction_rules = sequelize.define(
    "DEDUCTION_RULES",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      deduction_rule_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      deduction_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      time: {
        type: Sequelize.STRING,
     
      },
     from_time: {
        type: Sequelize.STRING,
       
      },
     to_time: {
        type: Sequelize.STRING,
       
      },
      completed_shift_hr: {
        type: Sequelize.ENUM("YES", "NO"),
      },
      days_rebate: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      deduction_action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return deduction_rules;
};
