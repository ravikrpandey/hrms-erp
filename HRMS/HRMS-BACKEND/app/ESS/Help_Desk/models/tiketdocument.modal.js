module.exports = (sequelize, Sequelize) => {
  const myticketDoceument = sequelize.define(
    "ESS_MY_TICKET_DOCUMENT",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      filename: {
        type: Sequelize.STRING(4000),
      },
      status: {
        type: Sequelize.ENUM,
        values: ["ACTIVE", "INACTIVE"],
        defaultValue: "ACTIVE",
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      }
    },
    {
      freezeTableName: true,
    }
  );
  return myticketDoceument;
};
