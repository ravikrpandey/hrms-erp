module.exports = (sequelize, Sequelize) => {
    const user_entity_Models = sequelize.define("HRMS_REGISTERED_USERS_ENTITY", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      // entity_name: {
      //   type: Sequelize.STRING,
      // },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },
    },
    {
      freezeTableName: true,
    });
    return user_entity_Models;
  };