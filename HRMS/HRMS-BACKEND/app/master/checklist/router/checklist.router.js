const checklistdetailsController = require("../controllers/checklist.controller");

module.exports = app =>{
    app.post("/api/v1/create_checklist",checklistdetailsController.create_checklist);
    app.get("/api/v1/getAllCHECKLIST",checklistdetailsController.getAllCHECKLIST);
    app.get("/api/v1/getAllActiveCHECKLIST",checklistdetailsController.getAllActiveCHECKLIST);
    app.get("/api/v1/getByIdCHECKLIST/:id",checklistdetailsController.getByIdCHECKLIST);
    app.put("/api/v1/editchecklist/:id",checklistdetailsController.editchecklist);
    app.delete("/api/v1/deleteCHECKLIST/:id",checklistdetailsController.deleteCHECKLIST);
    app.put("/api/v1/CHECKLISTStatus/:id",checklistdetailsController.CHECKLISTStatus);
   
}