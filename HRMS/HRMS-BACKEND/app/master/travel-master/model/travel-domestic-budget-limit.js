module.exports = (sequelize, Sequelize) => {
  const MASTER_TRAVEL_DOMESTIC_BUDGET = sequelize.define(
    "MASTER_TRAVEL_DOMESTIC_BUDGET",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      travel_conveyance_ids: {
        type: Sequelize.JSON,
        nullable: false,
      },
      travel_grade_ids: {
        type: Sequelize.JSON,
        nullable: false,
      },
      budgetLimit: {
        type: Sequelize.STRING,
        nullable: false,
      }
    },

    {
      freezeTableName: true,
    }
  );
  return MASTER_TRAVEL_DOMESTIC_BUDGET;
};
