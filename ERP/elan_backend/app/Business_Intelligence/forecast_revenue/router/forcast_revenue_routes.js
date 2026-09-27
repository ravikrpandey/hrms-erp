const forcastRevenueController = require("../controller/forcast_revenue_controller");
const { upload } = require("../../../middleware/uploadDocs");

module.exports = app => {

    app.post("/api/v1/create_forcast_revenue", forcastRevenueController.create_forcast_revenue);
    app.get("/api/v1/getAll_active_forcast_revenue", forcastRevenueController.getAll_active_forcast_revenue);
    app.get("/api/v1/getbyId_forcast_revenue/:id", forcastRevenueController.getbyId_forcast_revenue);
    app.put("/api/v1/update_forcast_revenue/:id",  forcastRevenueController.update_forcast_revenue);
    app.delete("/api/v1/delete_forcast_revenue/:id",  forcastRevenueController.delete_forcast_revenue);
    app.get("/api/v1/download_forcast_revenue_format",  forcastRevenueController.download_forcast_revenue_format);
    app.post("/api/v1/bulkCreate_forcast_revenue",upload.array('file', 1), forcastRevenueController.bulkCreate_forcast_revenue);
}