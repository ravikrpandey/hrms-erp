module.exports = app => {
    const menuController = require("../menu-management/menuManagement.controller");

    app.post("/api/v1/createUpdateMenu", menuController.createUpdateMenu);
    app.get("/api/v1/getAllMenuList",menuController.getAllMenuList);

}