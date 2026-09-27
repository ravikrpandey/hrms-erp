const transport_management_controller = require("../controller/transport_management_controller");

module.exports = app => {
  app.post("/api/v1/create_transport_request",transport_management_controller.createTransportRequest);
  app.get("/api/v1/getAll_TransportRequest/:entity_id/:financial_year_id/:login_id",transport_management_controller.getAll_TransportRequest);
  app.put("/api/v1/approvedRequestById/:transport_id",transport_management_controller.approvedRequestById);
  app.put("/api/v1/editTransportRequest/:id",transport_management_controller.editTransportRequest);
  app.get("/api/v1/getTransportRequestById/:id",transport_management_controller.get_request_byId);
  app.get("/api/v1/getAll_Approvals_level/:transport_id",transport_management_controller.getAll_Approval_level);
  app.delete("/api/v1/delete_transport_request/:id",transport_management_controller.deleteTransportRequest);
  app.get('/api/v1/dispatchedOrderLists/:employee_id',transport_management_controller.dispatchedOrderLists);
  app.get('/api/v1/approvedTransportRequest/:entity_id',transport_management_controller.approvedTransportRequest);
  app.get('/api/v1/getApprovedProductItemData/:id',transport_management_controller.getApprovedProductItemData);
  
}