module.exports = (sequelize, Sequelize) => {
    const asset_inventory = sequelize.define('ASSET_INVENTORY', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
        },
        item_quantity: {
            type: Sequelize.INTEGER,
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
    return asset_inventory;
};
  