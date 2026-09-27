const { upload } = require("../../../middleware/master");
const WorkStation = require("../controller/workstationcontroller");


module.exports = app =>{
    app.post("/api/v1/create_workStation", upload.array('images', 10), WorkStation.create_workStation);
    app.get("/api/v1/getAllWorkstation/:id?",WorkStation.getAllWorkstation);
    app.get("/api/v1/getAllActiveWorkstation/:id?",WorkStation.getAllActiveWorkstation);
    app.put("/api/v1/update_workStation/:id",upload.array('images',10),WorkStation.update_workStation);
    app.delete("/api/v1/delete_workStation/:id",WorkStation.delete_workStation);
    app.put("/api/v1/workStationStatus/:id",WorkStation.workStationStatus);

}
