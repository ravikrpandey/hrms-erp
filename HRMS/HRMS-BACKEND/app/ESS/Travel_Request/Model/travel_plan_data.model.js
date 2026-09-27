module.exports = (sequelize, Sequelize) => {
  const ESS_TRAVEL_PLAN_DATA = sequelize.define(
    "ESS_TRAVEL_PLAN_DATA",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATEONLY, // Better type for date
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return ESS_TRAVEL_PLAN_DATA;
};
