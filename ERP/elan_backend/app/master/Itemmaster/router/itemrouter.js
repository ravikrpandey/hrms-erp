const itemController = require("../controller/itemcontroller");
const { upload }  = require("../../../middleware/uploadDocs");
const verifyAuthToken = require("../../../middleware/AuthVerifyToken");


module.exports = app => {
    app.post("/api/v1/createItem", upload.array('images',10), itemController.createItem);
    app.post("/api/v1/getAllItem", itemController.getAllItem);
    app.post("/api/v1/getAllItemMasterList", itemController.getAllItemMasterList);
    app.get("/api/v1/getAllActiveItem", itemController.getAllActiveItem);
    app.get("/api/v1/getAllItemByAsset/:id", itemController.getAllItemByAsset);
    app.get("/api/v1/getItemById/:id", itemController.getItemById);
    app.put("/api/v1/updateItemMaster/:id",upload.array('images'), itemController.updateItemMaster);
    app.delete("/api/v1/deleteItemMaster/:id", itemController.deleteItemMaster);
    app.put("/api/v1/updateItemStatus/:itemId", itemController.updateItemStatus);
    app.get("/api/v1/getItemType", itemController.getItemType);
    app.get("/api/v1/getSFGItem/:entity_id", itemController.getSFGItem);
    app.get("/api/v1/getItemCategoryByItemType/:item_type", itemController.getItemCategoryByItemType);
    
    app.get("/api/v1/getAllItemgroup", itemController.getAllItemgroup);
    app.post("/api/v1/createItemgroup", itemController.createItemgroup);
    app.get("/api/v1/getAllItemgroup_byId/:id", itemController.getAllItemgroup_byId);
    app.delete("/api/v1/deleteItemMasterGroup/:id", itemController.deleteItemMasterGroup);
    app.put("/api/v1/ItemGroupCategoryStatus/:id", itemController.ItemGroupCategoryStatus);
    app.put("/api/v1/updateItemGroupCategory/:id", itemController.updateItemGroupCategory);
    
    ////////////////////////
    //////here code by ajay 04-04-2025
    ////////////
    app.get('/api/v1/getItemsBySubCategory/:sub_category_id/:asset_id',itemController.getItemsBySubCategory);
    app.get('/api/v1/getItemsPriceBySubCategory',itemController.getItemsPriceBySubCategory);
    app.get('/api/v1/getSubCategory/:id',itemController.getSubCategory);
    
    
    /* route to fetch item name on the basis of sub category id */
    app.get('/api/v1/itemname/onbasisofsubcategoryid/:id',verifyAuthToken,itemController.getItemName);
    app.post("/api/v1/uploadItemExcel", upload.single('itemExcel'), itemController.importExcel);
}