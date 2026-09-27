const usercontroller = require("../controllers/user.controller");
const { authJwt } = require("../../../middleware");

module.exports = function (app) {
  app.get("/api/v1/all", usercontroller.allAccess);
  app.get("/api/v1/user", usercontroller.userBoard);
  app.get("/api/v1/mod", [authJwt.isModerator], usercontroller.moderatorBoard);
  app.get("/api/v1/admin", [authJwt.isAdmin], usercontroller.adminBoard);
  app.get("/api/v1/userTest", usercontroller.usersTest)
   app.get("/api/v1/getChildEmployee/:emId", usercontroller.getChildEmployee);
}