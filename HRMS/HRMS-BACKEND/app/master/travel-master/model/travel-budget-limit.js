module.exports = (sequelize, Sequelize) => {
  const MASTER_TRAVEL_BUDGET_LIMIT = sequelize.define(
    "MASTER_TRAVEL_BUDGET_LIMIT",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      other_towns: {
        type: Sequelize.STRING,
        nullable: true,
      },
      budget_limit: {
        type: Sequelize.STRING,
        nullable: true,
      },
      daily_allowance: {
        type: Sequelize.STRING,
        nullable: true,
      },
      remark: {
        type: Sequelize.STRING,
        nullable: true,
      },
      local_max_limit: {
        type: Sequelize.STRING,
        nullable: true,
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
  return MASTER_TRAVEL_BUDGET_LIMIT;
};
