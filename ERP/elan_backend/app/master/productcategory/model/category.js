module.exports = (sequelize, Sequelize) => {
    const product_category = sequelize.define("MASTER_PRODUCT_CATEGORY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        category_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        category_code:{
            type: Sequelize.STRING,
            allowNull:false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false,
        },
        status: {
            type: Sequelize.ENUM("ACTIVE" , "INACTIVE"),
            defaultValue: "ACTIVE",
            allowNull :true
          },
    },
    {
        freezeTableName: true
    }
);
    return product_category;
};