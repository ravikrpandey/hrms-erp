module.exports = (sequelize, Sequelize) => {
  const ESS_TRAVEL_PLAN = sequelize.define(
    "ESS_TRAVEL_PLAN",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("PENDING", "REJECTED", "APPROVED"),
        defaultValue: "PENDING",
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
  return ESS_TRAVEL_PLAN;
};
