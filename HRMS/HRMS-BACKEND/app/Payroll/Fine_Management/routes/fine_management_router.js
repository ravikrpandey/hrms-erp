const finemanagement_controller = require('../controller/fine_management_controller');

module.exports = app => {
    app.post("/api/v1/create_fine_management", finemanagement_controller.create_fine_management);
    app.get("/api/v1/get_all_fine_management", finemanagement_controller.get_all_fine_management);
    app.get("/api/v1/get_all_fine_management_by_id", finemanagement_controller.get_all_fine_management_by_id);
    app.delete("/api/v1/delete_fine_management_by_id", finemanagement_controller.delete_fine_management_by_id);
}