
const costController = require('../controllers/cost_center_controller');

module.exports = app => {   
    app.post("/api/v1/generate_cost_center_code", costController.generate_cost_center_code);
    app.post("/api/v1/create_cost_center", costController.create_cost_center);
    app.get("/api/v1/getAll_Active_Cost_Center", costController.getAll_Active_Cost_Center);
    app.get("/api/v1/getAll_Cost_Center", costController.getAll_Cost_Center);
    app.get("/api/v1/get_Cost_Center_ById/:id", costController.get_Cost_Center_ById);
    app.put("/api/v1/update_cost_center/:id", costController.update_cost_center);
    app.put("/api/v1/update_cost_center_status/:id", costController.update_cost_center_status);
    app.delete("/api/v1/delete_Cost_Center_ById/:id", costController.delete_Cost_Center_ById);
    app.get("/api/v1/get_all_cost/:dept_id", costController.get_all_cost);
};   