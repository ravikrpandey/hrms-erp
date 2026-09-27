module.exports = (sequelize, Sequelize) => {
  const EmployeeDeclaration = sequelize.define("EMPLOYEE_DECLARATION", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    section: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    declaration_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    age: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    document: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    maxLimit: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    amount: {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
     freezeTableName: true,
  });

  return EmployeeDeclaration;
};
