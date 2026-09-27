// models/AttendanceMaster.js
module.exports = (sequelize, Sequelize) => {
  const attendance_request = sequelize.define(
    "ATTENDANCE_REQUEST",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      selected_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      attendance_month: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      attendance_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      approval_status: {
        type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
        defaultValue: "PENDING",
      },
    },
    {
      freezeTableName: true,
    }
  );

  return attendance_request;
};
