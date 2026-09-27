const transport_controller = require("../controller/transport_controller");

module.exports = app => {
app.post("/api/v1/create_transport_master",transport_controller.create_transport_master);
app.get("/api/v1/getAll_transport",transport_controller.getAll_transport);
app.get("/api/v1/get_transport_by_id",transport_controller.get_transport_by_id);
}