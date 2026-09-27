const ktMasterController = require("../controller/ktMasterController");

module.exports = (app) => {

    app.post("/api/v1/createKtCategory", ktMasterController.createKtCategory);
    app.get("/api/v1/KtCategoryList", ktMasterController.KtCategoryList);
    app.get("/api/v1/KtCategoryById/:id", ktMasterController.KtCategoryById);
    app.put("/api/v1/KtCategoryUpdate/:id", ktMasterController.KtCategoryUpdate);
    app.put("/api/v1/updateKtCategoryStatus/:id", ktMasterController.updateKtCategoryStatus);
    app.delete("/api/v1/deleteKtCategoryById/:id", ktMasterController.deleteKtCategoryById);
};
