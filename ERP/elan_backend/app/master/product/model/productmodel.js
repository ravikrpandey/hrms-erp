module.exports = (sequelize, Sequelize) => {
    const product_master = sequelize.define("MASTER_PRODUCT", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        product_name: {type: Sequelize.STRING},
        product_code: {type: Sequelize.STRING},
        product_series: { type: Sequelize.STRING },
        product_model: { type: Sequelize.STRING },
        product_rating: { type: Sequelize.FLOAT },
        product_spv_wattage: { type: Sequelize.FLOAT },
        product_warranty: { type: Sequelize.INTEGER },
        product_spv_voc: { type: Sequelize.FLOAT },
        product_list_price: { type: Sequelize.FLOAT },
        product_mrp: { type: Sequelize.FLOAT },
        product_length: { type: Sequelize.FLOAT },
        product_breadth: { type: Sequelize.FLOAT },
        product_height: { type: Sequelize.FLOAT },
        product_weight: { type: Sequelize.FLOAT },
        product_description: { type: Sequelize.STRING },
        product_specification: { type: Sequelize.STRING },
        cgst:{type:Sequelize.DECIMAL(20,2)},
        sgst:{type:Sequelize.DECIMAL(20,2)},
        igst:{type:Sequelize.DECIMAL(20,2)},
        // hsn_code_id:{type:Sequelize.INTEGER},
        capacity:{type:Sequelize.STRING},
        maximum_discount:{type:Sequelize.INTEGER},
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    }, {
        freezeTableName: true
    });
    return product_master;
};



