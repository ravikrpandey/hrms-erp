module.exports = (sequelize, Sequelize) => {
    const customermicrocategory = sequelize.define("MASTER_CUSTOMER_MICRO_CATEGORY", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        micro_category_name: {
            type: Sequelize.STRING
        },
        micro_category_code: {
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
    return customermicrocategory;
}