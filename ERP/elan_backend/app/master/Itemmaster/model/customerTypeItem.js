module.exports = (sequelize, Sequelize) => {
    const customerTpyeItem = sequelize.define("ITEM_CUSTOMER_TYPE_MST", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount:{
            type: Sequelize.DECIMAL(10, 2)
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }        
    },
    
    {
      freezeTableName: true,
    })
    return customerTpyeItem;
}