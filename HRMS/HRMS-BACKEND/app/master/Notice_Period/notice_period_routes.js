module.exports = (app) => {
    const controller = require("../Notice_Period/notice_period_controller");

    app.post("/api/v1/noticePeriodCreate", controller.noticePeriodCreate);
    app.get("/api/v1/getAllNoticePeriod", controller.getAllNoticePeriod);
    app.get("/api/v1/getNoticePeriodById/:notice_period_id", controller.getNoticePeriodById);
    app.put("/api/v1/noticePeriodUpdate/:notice_period_id", controller.noticePeriodUpdate);
    app.put("/api/v1/updateNoticePeriodStatus/:notice_period_id", controller.updateNoticePeriodStatus);
    app.delete("/api/v1/deleteNoticePeriodById/:notice_period_id", controller.deleteNoticePeriodById);
};
