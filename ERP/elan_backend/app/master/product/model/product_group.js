module.exports = (sequelize, Sequelize) => {
    const ProductGroup = sequelize.define("MASTER_PRODUCT_GROUP", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_group: {
            type: Sequelize.STRING
        },
        product_group_code: {
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
    return ProductGroup;
}