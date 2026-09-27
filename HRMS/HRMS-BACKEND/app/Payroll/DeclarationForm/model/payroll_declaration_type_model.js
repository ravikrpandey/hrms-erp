
module.exports = (sequelize, Sequelize) => {
  const declaration_type = sequelize.define("PAYROLL_DECLARATION_TYPE",{
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      declaration_type: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      section: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      age: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      maxLimit: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      status: {
          type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
          defaultValue: "ACTIVE",
          allowNull: true,
        },
      isDeleted: {
          type: Sequelize.BOOLEAN(true, false),
          defaultValue: false,
        },
      },
    {
      freezeTableName: true,
    }
  );
  return declaration_type;
};
