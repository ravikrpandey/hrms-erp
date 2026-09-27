module.exports = (sequelize, Sequelize) => {
  const MASTER_HOLIDAY_WITH_CATEGORY = sequelize.define(
    "MASTER_HOLIDAY_WITH_CATEGORY",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return MASTER_HOLIDAY_WITH_CATEGORY;
};