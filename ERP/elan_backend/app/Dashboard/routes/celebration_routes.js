const celebrationController = require('../controller/celebration_controller');

module.exports = app =>{
      app.get("/api/v1/get_AllUserProfile",celebrationController.getAllUserProfile);
}