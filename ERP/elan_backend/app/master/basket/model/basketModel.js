module.exports = (sequelize, Sequelize) => {
    const Master_basket = sequelize.define("MASTER_BASKET", {
       id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type_of_basket: {
            type: Sequelize.STRING,
            allowNull: false,
        },
         no_of_partition: {
            type: Sequelize.STRING,
            allowNull: false,
        },
         basket_qty: {
            type: Sequelize.STRING,
            allowNull: false,
        },
         price_per_unit: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
    
    {
      freezeTableName: true,
    })
    ;
    return Master_basket;
};
