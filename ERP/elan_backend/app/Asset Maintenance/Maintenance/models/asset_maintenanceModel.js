module.exports = (sequelize, Sequelize) => {
    const  assetMaintenance= sequelize.define("ASSETMAINTENANCE", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    
        entity_id: {
            type: Sequelize.INTEGER,
        },
        isUnderAmc: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },
        expireAmc: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        },

        maintenanceBy: {
            type: Sequelize.INTEGER,
        },
       

        repairDetails: {
            type: Sequelize.STRING,
        },
        completionDate: {
            type: Sequelize.DATE,
        },
        scheduledDate: {
            type: Sequelize.DATE,
        },
        
         amount: {
            type: Sequelize.INTEGER,
        },
        

        maintenanceStatus: {
            type: Sequelize.ENUM("INPROGRESS", "COMPLETED","CANCELLED","PENDING"),
            defaultValue: "INPROGRESS"
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
    return assetMaintenance;
}