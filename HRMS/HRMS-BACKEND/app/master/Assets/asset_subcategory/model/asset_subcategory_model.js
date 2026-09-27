module.exports = (sequelize, Sequelize) => {
    const asset_subcategory_master = sequelize.define("ASSET_SUBCATEGORY_MASTER", {
        asset_subcategory_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        asset_subcategory_name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
    },
        {
            freezeTableName: true
        }
    );

    return asset_subcategory_master;
};
