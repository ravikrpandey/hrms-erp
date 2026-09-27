module.exports = (sequelize, Sequelize) => {
    const ItemGroup = sequelize.define("MASTER_ITEM_GROUP", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Item_group: {
            type: Sequelize.STRING
        },
        Item_group_code: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }},
        {
            freezeTableName: true,
        })
    return ItemGroup;
}