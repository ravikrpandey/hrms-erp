module.exports = (sequelize, Sequelize) => {
    const item_cost_category = sequelize.define("ITEM_COST_CATEGORY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cost_type: {
            type: Sequelize.STRING,
            allowNull: false,
        },  
    },
    {
        freezeTableName: true
    }
);
    return item_cost_category;
};