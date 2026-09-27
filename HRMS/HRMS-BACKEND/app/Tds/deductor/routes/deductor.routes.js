const authMiddleware = require('../../../middleware/auth.middleware');
const deductorController = require('../controller/deductor.controller');

module.exports = app => {
    app.post("/api/deductor/add", authMiddleware, deductorController.addDeductorController);
};