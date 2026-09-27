const Controller = require("../controller/bomkitcontroller");

module.exports = app => {
    app.get("/api/v1/getItemListForBOM", Controller.getItemList);
    app.get("/api/v1/getBOMList", Controller.getBOMList);
    app.post("/api/v1/createUpdateBOM", Controller.createUpdateBOM);
    app.get("/api/v1/getBOMDataById", Controller.getBOMDataById);
    app.post("/api/v1/approveBOM", Controller.approveBOM);
}