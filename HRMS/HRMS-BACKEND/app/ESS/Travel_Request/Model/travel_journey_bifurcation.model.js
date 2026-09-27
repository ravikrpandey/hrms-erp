module.exports = (sequelize, Sequelize) => {
  const ESS_TRAVEL_JOURNEY_BIFURCATION = sequelize.define(
    "ESS_TRAVEL_JOURNEY_BIFURCATION",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      from_date: {
        type: Sequelize.DATE,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return ESS_TRAVEL_JOURNEY_BIFURCATION;
};
