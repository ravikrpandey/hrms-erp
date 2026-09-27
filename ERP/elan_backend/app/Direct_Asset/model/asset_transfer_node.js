module.exports = (sequelize, Sequelize) => {
    const asset_transfer_note = sequelize.define('ASSET_TRANSFER_NOTE', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
       remarks: {
        type: Sequelize.STRING
      },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: "0",
        },
      },
      {
        freezeTableName: true,
      }
    );
    return asset_transfer_note;
  };
  