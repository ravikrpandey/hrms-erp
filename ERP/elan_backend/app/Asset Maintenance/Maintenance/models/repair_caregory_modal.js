module.exports = (sequelize, Sequelize) => {
    const  repairCategory= sequelize.define("ASSET_REPAIR_CATEGORY", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        repair_category_name: {
            type: Sequelize.STRING,
        },

        remarks: {
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
    return repairCategory;
}