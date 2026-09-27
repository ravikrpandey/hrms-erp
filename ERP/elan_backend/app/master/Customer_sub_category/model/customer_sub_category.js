module.exports = (sequelize, Sequelize) => {
    const customersubcategory = sequelize.define("MASTER_CUSTOMER_SUB_CATEGORY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sub_category_name: {
            type: Sequelize.STRING
        },
        sub_category_code: {
            type: Sequelize.STRING
        },
        isDeleted:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
    },
    
    {
      freezeTableName: true,
    });
    return customersubcategory;
}