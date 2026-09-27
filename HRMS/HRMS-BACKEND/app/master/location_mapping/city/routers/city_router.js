module.exports = app => {
    const city_controller = require('../controller/city_controller');

    app.post("/api/v1/createcitycontroller",city_controller.createcity);
    app.get("/api/v1/getallcitycontroller",city_controller.getAllcity);
    app.get("/api/v1/getidcitycontroller/:city_id",city_controller.getByIdcity);
    app.put("/api/v1/editcitycontroller/:city_id",city_controller.editcity);
    app.delete("/api/v1/deletecitycontroller/:city_id",city_controller.deletecity);
    app.get("/api/v1/getcitybystateid/:states_id",city_controller.getcitybystateid);
    app.get("/api/WL/cities/search", city_controller.searchCity);
};