// models/failedAsset.model.js

module.exports = (sequelize, DataTypes) => {
    const FailedAsset = sequelize.define('FailedAsset', {
      asset_tag_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      purchase_date: {
        type: DataTypes.STRING,
        allowNull: true
      },
      serial_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      item_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      item_category: {
        type: DataTypes.STRING,
        allowNull: true
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      branch_address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      depriciation_by: {
        type: DataTypes.STRING,
        allowNull: true
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    });
  
    return FailedAsset;
  };
  