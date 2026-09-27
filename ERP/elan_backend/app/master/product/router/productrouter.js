const ProductMaster = require('../controllers/productcontroller');

module.exports = app => {
    app.post("/api/v1/create_product", ProductMaster.createProduct);
    app.get("/api/v1/getAllproduct/:entity_id", ProductMaster.getAllproduct);
    app.put("/api/v1/update_product/:id", ProductMaster.update_product);
    app.get("/api/v1/getProductHsn/:id",ProductMaster.getHSNCode);
    app.delete("/api/v1/delete_product/:id", ProductMaster.delete_product);
    app.put("/api/v1/productStatus/:id", ProductMaster.productStatus);
    app.get("/api/v1/getAllCustomerItemList/:id", ProductMaster.getAllCustomerItemList);

    app.get("/api/v1/getProductDetailsByVariantId/:variantId", ProductMaster.getProductDetailsByVariantId);
    app.get("/api/v1/get_variants_by_product_id/:productId", ProductMaster.get_variants_by_product_id);
    app.get("/api/v1/get_active_variants_by_product_id/:productId", ProductMaster.get_active_variants_by_product_id);
    app.get("/api/v1/getProductById/:product_id", ProductMaster.getProductById);
    app.get("/api/v1/getProductByCatAndSubcatId/:cat_id/:sub_cat_id", ProductMaster.getProductByCatAndSubcatId);
    app.get("/api/v1/getProductBycat_Id/:cat_id", ProductMaster.getProductBycat_Id);
    app.get("/api/v1/getProductVariantByproduct_id/:id", ProductMaster.getProductVariantByproduct_id);
    app.post("/api/v1/add_product_price", ProductMaster.add_product_price);
    app.get("/api/v1/getAll_product_price/:id", ProductMaster.getAll_product_price);


    app.post("/api/v1/createProductgroup", ProductMaster.createProductgroup);
    app.post("/api/v1/createProductType", ProductMaster.createProductType);
}