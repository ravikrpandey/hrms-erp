module.exports = (sequelize, Sequelize) => {
  const MASTER_TRAVEL_LOCAL_BUDGET = sequelize.define(
    "MASTER_TRAVEL_LOCAL_BUDGET",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gradeIds: {
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
  return MASTER_TRAVEL_LOCAL_BUDGET;
};
