
const announcementController = require('../controller/announcementController')

module.exports = app => {
  app.post("/api/v1/create_Announcement",announcementController.create_Announcement);
  app.get("/api/v1/getAll_Announcement",announcementController.getAll_Announcement);
  app.get("/api/v1/getAll_AnnouncementBy_dept",announcementController.getAll_AnnouncementBy_dept);
  app.get("/api/v1/get_Announcement/:id", announcementController.get_AnnouncementById);
  app.post("/api/v1/update_Announcement/:id",announcementController.update_Announcement);
}
