module.exports = (sequelize, Sequelize) => {
    const tbl_itemType = sequelize.define("MASTER_ITEM_ITEMTYPE", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        itemType: {
            type: Sequelize.STRING
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
    });
    return tbl_itemType;
}