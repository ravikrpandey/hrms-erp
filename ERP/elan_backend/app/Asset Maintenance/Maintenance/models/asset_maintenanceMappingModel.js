module.exports = (sequelize, Sequelize) => {
    const  assetMaintenanceMapping= sequelize.define("ASSETMAINTENANCE_MAPPING", {
       
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        maintenanceMappingId: {
            type: Sequelize.INTEGER,
        },
     asset_tagIds: {
            type: Sequelize.STRING,
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
    return assetMaintenanceMapping;
}