module.exports = (sequelize, Sequelize) => {
    const asset = sequelize.define("MASTER_ASSET", {
         id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        asset_category_code: {
            type: Sequelize.STRING
        },
        asset_category_name: {
            type: Sequelize.STRING
        },
        asset_category_description: {
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
    },{
        freezeTableName: true
    });
    return asset;
};