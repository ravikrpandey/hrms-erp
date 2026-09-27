module.exports = (sequelize, Sequelize) => {
    const AssetDispositionItem = sequelize.define("ASSET_DISPOSITION_ITEMS", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sell_price: {
            type: Sequelize.DECIMAL(10, 2)
        },
        scrap_value: {
            type: Sequelize.DECIMAL(10, 2)
        },
        profitOrLoss: {
            type: Sequelize.DECIMAL(10, 2)
        }
    }, {
        freezeTableName: true,
    });

    return AssetDispositionItem;
};
