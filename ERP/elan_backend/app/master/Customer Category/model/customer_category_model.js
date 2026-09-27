module.exports = (sequelize, Sequelize) => {
    const customer_category = sequelize.define("MASTER_CUSTOMER_CATEGORY", {
        customer_category_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customer_category_name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        quotation_scheme_status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "INACTIVE"
        },
        isDeleted:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },

    },
    
    {
      freezeTableName: true,
    });
    return customer_category;
};