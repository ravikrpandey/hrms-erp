module.exports = (sequelize, Sequelize) => {
  const orgTypeMaster = sequelize.define(
    "3PL_ORG_TYPE_MASTER",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },

    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return orgTypeMaster;
};
