module.exports = (sequelize, Sequelize) => {
    const priceMasterItem = sequelize.define("MASTER_ITEM_PRICE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        discount_1: {
            type: Sequelize.INTEGER
        },
        discount_2: {
            type: Sequelize.INTEGER
        },
        discount_3: {
            type: Sequelize.INTEGER
        },
        discount1Flat: {
            type: Sequelize.DECIMAL(30, 2),
        },
        discount2Flat: {
            type: Sequelize.DECIMAL(30, 2),
        },
        discount3Flat: {
            type: Sequelize.DECIMAL(30, 2),
        },
        final_price: {
            type: Sequelize.DECIMAL(30, 2),
            defaultValue: 0
        },
        rest_price: {
            type: Sequelize.DECIMAL(30, 2),
            defaultValue: 0
        },

        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return priceMasterItem;
};