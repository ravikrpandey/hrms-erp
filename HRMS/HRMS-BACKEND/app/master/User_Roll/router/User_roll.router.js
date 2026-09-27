const userrollController = require("../controller/User_roll.controller");


module.exports = app => {
    app.post("/api/v1/create_User_roll", userrollController.create_User_roll);
    app.put("/api/v1/edit_User_roll/:id", userrollController.edit_User_roll);
    app.get("/api/v1/get_ById_User_roll/:id", userrollController.get_ById_User_roll);
    app.get("/api/v1/get_All_User_roll", userrollController.get_All_User_roll);
    app.delete("/api/v1/delete_User_roll/:id", userrollController.delete_User_roll);

} 