const authController = require('../controller/auth.controller');

module.exports = app => {
    app.post("/api/auth/login", authController.loginController);
};