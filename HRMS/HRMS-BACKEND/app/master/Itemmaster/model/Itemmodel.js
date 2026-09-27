module.exports = (sequelize, Sequelize) => {
    const ItemMaster = sequelize.define("MASTER_ITEM", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        item_name: {
            type: Sequelize.STRING
        },
        item_code: {
            type: Sequelize.STRING
        },
        MVP: {
            type: Sequelize.STRING
        },
        description:{
            type: Sequelize.STRING
        },
        item_document:{
            type: Sequelize.STRING
        },
        threshold_stock:{
            type: Sequelize.STRING
        },
        Bar_QR_Code:{
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        manage_by:{
            type: Sequelize.ENUM("Batch Only", "S.No. Only"),
            defaultValue: "Batch Only"
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
    return ItemMaster;
}