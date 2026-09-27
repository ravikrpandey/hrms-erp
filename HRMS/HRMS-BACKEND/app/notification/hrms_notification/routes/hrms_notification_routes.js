const hrms_notification_controller = require("../controller/hrms_notification_controller");
const { upload }  = require("../../../middleware/uploadDocs");



module.exports = app => {
    app.post("/api/v1/get_all_user_notification", hrms_notification_controller.getAllNotification);
    app.delete("/api/v1/delete_notification", hrms_notification_controller.deleteNotification);
    app.put("/api/v1/update_notif_read_status", hrms_notification_controller.updateNotificationStatus);
    app.put("/api/v1/update_all_notif_read_status", hrms_notification_controller.updateAllNotificationStatus);
}