const Sequelize = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const fieldType = sequelize.define(
    "SYS_FIELD_TYPE_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      field_type: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return fieldType;
};
