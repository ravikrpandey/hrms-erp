// models/assetCompanyDepreciationDailyLog.model.js

module.exports = (sequelize, DataTypes) => {
    const acdl = sequelize.define('ASSETCOMPANY_DEPRECIATIONCALCULATION_DAILYLOG', {
      depreciationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      depAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      cumulativeDepreciation: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      closingValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE'
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });
  
    return acdl;
  };
  