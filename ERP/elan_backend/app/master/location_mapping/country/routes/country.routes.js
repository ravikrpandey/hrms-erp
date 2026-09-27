module.exports = app => {
    const countryController = require("../controller/country.controller");
 
    app.post("/api/v1/createcountry", countryController.createcountry);
    app.get("/api/WL/getAllcountry", countryController.getAllcountry);
    app.get("/api/v1/getAllActivecountry", countryController.getAllActivecountry);
    app.get("/api/v1/getByIdcountry/:countryss_id", countryController.getByIdcountry);
    app.delete("/api/v1/deletecountry/:countryss_id", countryController.deletecountry);
    app.put("/api/v1/editcountry/:countryss_id", countryController.editcountry);
    app.put("/api/v1/updateCountryStatus/:countryss_id", countryController.updateCountryStatus);
    
}