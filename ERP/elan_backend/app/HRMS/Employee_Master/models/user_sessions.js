module.exports = (sequelize, DataTypes) => {
  return sequelize.define("USER_SESSIONS", {
    user_id: DataTypes.INTEGER,
    login_time: DataTypes.DATE,
    logout_time: DataTypes.DATE,
    session_duration: DataTypes.INTEGER,
    timeout: DataTypes.TINYINT,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.TEXT,
    status: DataTypes.STRING
  },{
        freezeTableName: true,
    });
};
