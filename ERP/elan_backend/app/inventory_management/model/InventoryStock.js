module.exports = (sequelize, Sequelize) => {
    const inventory_stock = sequelize.define("INVENTORY_STOCK", {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        available_qty: { // Free stock          
            type: Sequelize.INTEGER.UNSIGNED,
            defaultValue: 0,           
            comment: "Sellable stock"
        },
        hold_qty: { // SO reserve              
            type: Sequelize.INTEGER.UNSIGNED,
            defaultValue: 0,           
            comment: "Reserved for SO"
        },
        delivered_qty: { // Delivered qty           
            type: Sequelize.BIGINT.UNSIGNED,
            defaultValue: 0,           
            comment: "Total delivered"
        },
        scrap_qty: { // Damaged / scrap            
            type: Sequelize.INTEGER.UNSIGNED,
            defaultValue: 0,           
            comment: "Total scrap"
        }
    },
    {
        freezeTableName: true,
    });

    return inventory_stock;
};