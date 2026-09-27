module.exports = (sequelize, Sequelize) => {
    const product__variant_master = sequelize.define("MASTER_PRODUCT_VARIANT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        product_variant_code: {
            type: Sequelize.STRING
        },
        variant_name: {
            type: Sequelize.STRING
        },
        product_description: {
            type: Sequelize.STRING
        },
        mvp: {
            type: Sequelize.INTEGER
        },
        price_per_unit: {
            type: Sequelize.INTEGER
        },
        average_production_cost: {
            type: Sequelize.INTEGER
        },
        product_specification: {
            type: Sequelize.STRING
        },
        maximum_discount:{
            type: Sequelize.INTEGER
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
        freezeTableName:true
    });
    return product__variant_master;
};