const shiftcontroller = require("../controller/shiftcontroller");

module.exports = app => {
    app.post("/api/v1/createShift", shiftcontroller.createShift);
    app.get("/api/v1/getAllShiftbyId/:id?",  shiftcontroller.getAllShiftbyId);
    app.get("/api/v1/getAllShift",  shiftcontroller.getAllShift);
    app.put("/api/v1/updateShift/:id?",  shiftcontroller.updateShift);
    app.put("/api/v1/updateShiftStatus/:id?/:status",  shiftcontroller.updateShiftStatus);
    app.delete("/api/v1/deleteShift/:id?",  shiftcontroller.deleteShift);
    app.put("/api/v1/shiftStatus/:id?",  shiftcontroller.shiftStatus);
    app.post("/api/v1/create_allot_shift", shiftcontroller.createAllotShift);
    app.get("/api/v1/get_shift_alloted_employee/:entity_id?",  shiftcontroller.getShiftAllotedEmployee);
    app.get("/api/v1/get_employee_shift_log/:employee_id?",  shiftcontroller.getEmployeeShiftLog);
}