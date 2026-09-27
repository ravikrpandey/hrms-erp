module.exports = (sequelize, Sequelize) => {
  const attendance_userid = sequelize.define(
    "ESS_ATTENDANCE_USERID",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      de_user_id: {
        type: Sequelize.INTEGER,
      },
      device_id: {
        type: Sequelize.INTEGER,
      },
      wfh_tool_id: {
        type: Sequelize.INTEGER,
      },
      job_type: {
        type: Sequelize.ENUM("WFO", "WFH"),
        defaultValue: "WFO",
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
      serial_no: {
        type: Sequelize.STRING,
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
  return attendance_userid;
};
