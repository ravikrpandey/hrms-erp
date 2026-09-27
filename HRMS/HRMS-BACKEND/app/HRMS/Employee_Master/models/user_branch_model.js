module.exports = (sequelize, Sequelize) => {
    const user_location_model = sequelize.define("HRMS_REGISTERED_USERS_LOCATION", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },
    },
    {
      freezeTableName: true,
    });
    return user_location_model;
  };