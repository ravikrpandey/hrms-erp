const itemController = require("../controller/itemcontroller");
const { upload }  = require("../../../middleware/uploadDocs");



module.exports = app => {
    app.post("/api/v1/createItem", upload.single('image'), itemController.createItem);
    app.get("/api/v1/getAllItem", itemController.getAllItem);
    app.get("/api/v1/getAllItemByAsset/:id", itemController.getAllItemByAsset);
    app.get("/api/v1/getItemById/:id", itemController.getItemById);
    app.put("/api/v1/updateItemMaster/:id",upload.single('image'), itemController.updateItemMaster);
    app.delete("/api/v1/deleteItemMaster/:id", itemController.deleteItemMaster);
    app.put("/api/v1/updateItemStatus/:itemId", itemController.updateItemStatus);
}