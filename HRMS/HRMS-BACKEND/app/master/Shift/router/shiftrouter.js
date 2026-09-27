const shiftcontroller = require("../controller/shiftcontroller");

module.exports = app => {
    app.post("/api/v1/createShift", shiftcontroller.createShift);
    app.get("/api/v1/getAllShiftbyId/:id?",  shiftcontroller.getAllShiftbyId);
    app.get("/api/v1/getAllShift/:entity_id",  shiftcontroller.getAllShift);
    app.put("/api/v1/updateShift/:id?",  shiftcontroller.updateShift);
    app.put("/api/v1/updateShiftStatus/:id?/:status",  shiftcontroller.updateShiftStatus);
    app.delete("/api/v1/deleteShift/:id?",  shiftcontroller.deleteShift);
    app.put("/api/v1/shiftStatus/:id?",  shiftcontroller.shiftStatus);

}