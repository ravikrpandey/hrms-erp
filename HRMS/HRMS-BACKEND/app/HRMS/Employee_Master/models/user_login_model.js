module.exports = (sequelize, Sequelize) => {
    const user_loginModels = sequelize.define("HRMS_REGISTERED_USER_LOGIN", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      employee_official_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      employee_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role_master_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      employee_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE"
      },
      isDeleted: {
        type: Sequelize.BOOLEAN(true, false),
        defaultValue: false
      },
    },
      {
        freezeTableName: true,
      });
    return user_loginModels;
  };