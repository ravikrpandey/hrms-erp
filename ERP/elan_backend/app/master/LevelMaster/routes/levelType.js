module.exports = app => {
    const levelTypeController = require("../controller/levelTypeController.js");

    app.get("/api/v1/levelType", levelTypeController.levelType);
  
}