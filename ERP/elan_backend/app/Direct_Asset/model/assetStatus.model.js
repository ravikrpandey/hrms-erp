
module.exports = (sequelize, DataTypes) => {
    const AssetStatus = sequelize.define('AssetStatus', {
      status_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    });
  
    return AssetStatus;
  };
  