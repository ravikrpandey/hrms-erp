module.exports = (sequelize, Sequelize) => {
    const grnItemCost = sequelize.define("GRN_ITEM_COST", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
       
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        grn_item_status: {
            type: Sequelize.ENUM("PENDING", "APPROVED","REJECTED"),
            defaultValue: "PENDING"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        mapping_amount:{
            type: Sequelize.DECIMAL(10,2)
        },
        grand_total:{
            type: Sequelize.DECIMAL(10,2)
        },
        
      
    }, {
        freezeTableName: true
    });
    return grnItemCost;
};