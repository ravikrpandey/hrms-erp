module.exports = (sequelize, DataTypes) => {
  return sequelize.define("USER_ACTIVITY_LOGS", {
    user_id: DataTypes.INTEGER,
    session_id: DataTypes.INTEGER,
    page_url: DataTypes.STRING,
    page_name: DataTypes.STRING,
    total_time_seconds: DataTypes.INTEGER,
  },{
        freezeTableName: true,
    });
};
