const safety_inspec_controller = require('../controller/safety_inspection_controller');

module.exports = app => {
    app.post("/api/v1/create_safety_inspection", safety_inspec_controller.create_safety_inspection);
    app.get("/api/v1/get_all_safety_inspec", safety_inspec_controller.get_all_safety_inspec);
    app.get("/api/v1/get_all_safety_inspec_by_id", safety_inspec_controller.get_all_safety_inspec_by_id);
    app.delete("/api/v1/delete_safety_inspec_by_id", safety_inspec_controller.delete_safety_inspec_by_id);
}