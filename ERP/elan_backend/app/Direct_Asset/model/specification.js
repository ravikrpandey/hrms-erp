module.exports = (sequelize, Sequelize) => {
    const asset_specification = sequelize.define('ASSET_SPECIFICATION', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      specificationType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      specificationDetails: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
      },
  
        isDeleted: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "0",
        },
      },
      {
        freezeTableName: true,
      }
    );
    return asset_specification;
  };
  