module.exports = app => {
    const controller = require("../controllers/employmenttype.controller");

    app.post("/api/v1/employment", controller.createEmployment);
    app.get("/api/v1/employmentlist", controller.employmentList)
    app.get("/api/v1/getAll_employmentTypeList", controller.getAll_employmentTypeList)
    app.get("/api/v1/getactive_employmentTypeList", controller.active_employmenttype_List)
    app.get("/api/v1/employmentdetails/:emptype_id", controller.employmentDetails)
    app.put("/api/v1/employmentupdate/:emptype_id", controller.employmentUpdate)
    app.put("/api/v1/employmentdelete/:emptype_id", controller.employmentDeleted)
};
