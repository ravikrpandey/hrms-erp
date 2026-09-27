module.exports = (sequelize, Sequelize) => {
  const MASTER_TRAVEL_TYPE = sequelize.define(
    "MASTER_TRAVEL_TYPE",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        nullable: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
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
  return MASTER_TRAVEL_TYPE;
};
