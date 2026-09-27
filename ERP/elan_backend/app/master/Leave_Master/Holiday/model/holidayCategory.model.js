module.exports = (sequelize, Sequelize) => {
  const MASTER_HOLIDAY_CATEGORY = sequelize.define(
    "MASTER_HOLIDAY_CATEGORY",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return MASTER_HOLIDAY_CATEGORY;
};
