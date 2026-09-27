module.exports = (sequelize, Sequelize) => {
    const asset_category_master = sequelize.define("ASSET_CATEGORY_MASTER", {
        asset_category_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        asset_category_name: {
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

    return asset_category_master;
};
