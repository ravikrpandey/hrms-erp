const health_inspec_controller = require('../controller/health_inspection_controller');

module.exports = app => {
    app.post("/api/v1/create_health_inspection", health_inspec_controller.create_health_inspection);
    app.get("/api/v1/get_all_health_inspec", health_inspec_controller.get_all_health_inspec);
    app.get("/api/v1/get_all_health_inspec_by_id", health_inspec_controller.get_all_health_inspec_by_id);
    app.delete("/api/v1/delete_health_inspec_by_id", health_inspec_controller.delete_health_inspec_by_id);
}