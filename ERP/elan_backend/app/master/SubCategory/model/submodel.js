module.exports = (sequelize, Sequelize) => {
    const SubCategory= sequelize.define("MASTER_SUB_CATEGORY", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sub_category_name: {
            type: Sequelize.STRING
        },
        sub_category_code: {
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
    return SubCategory;
}