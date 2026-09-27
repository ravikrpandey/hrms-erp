module.exports = (sequelize, Sequelize) => {
    const  assetMaintenanceRepairCategoryMapping= sequelize.define("ASSETMAINTENANCE_REPAIRCATEGORY_MAPPING", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }, 
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true
        }
    )
    return assetMaintenanceRepairCategoryMapping;
}