const holidayController = require("../controller/holiday.controller");
// const { upload } = require("../../../middleware/holiday_csv");

module.exports = app => {
    app.post("/api/v1/create_holiday", holidayController.create_holiday);
    app.get("/api/v1/get_ById_holiday/:id?",  holidayController.get_ById_holiday);
    app.get("/api/v1/get_All_holiday",  holidayController.get_All_holiday);
    app.put("/api/v1/edit_holiday/:id?",  holidayController.edit_holiday);
    app.delete("/api/v1/delete_holiday/:id?",  holidayController.delete_holiday);
    app.put("/api/v1/upload_Holiday_By_file/:id?",  holidayController.upload_Holiday_By_file);
    app.put("/api/v1/updateHolidayStatus/:id?/:status",  holidayController.updateHolidayStatus);
    app.get("/api/v1/download_Document_Holiday/:fileName", holidayController.download_Document_Holiday);
}
