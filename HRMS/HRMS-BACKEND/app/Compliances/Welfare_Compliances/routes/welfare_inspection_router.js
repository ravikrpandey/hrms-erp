const welfare_inspec_controller = require('../controller/welfare_inspection_controller');

module.exports = app => {
    app.post("/api/v1/create_welfare_inspection", welfare_inspec_controller.create_welfare_inspection);
    app.get("/api/v1/get_all_welfare_inspec", welfare_inspec_controller.get_all_welfare_inspec);
    app.get("/api/v1/get_all_welfare_inspec_by_id", welfare_inspec_controller.get_all_welfare_inspec_by_id);
    app.delete("/api/v1/delete_welfare_inspec_by_id", welfare_inspec_controller.delete_welfare_inspec_by_id);
}