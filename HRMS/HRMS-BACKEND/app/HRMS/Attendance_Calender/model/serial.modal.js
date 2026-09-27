module.exports = (sequelize, Sequelize) => {
  const serial_no_attedance = sequelize.define(
    "ESS_SERIAL_NUMBER",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      serial_no: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return serial_no_attedance;
};
