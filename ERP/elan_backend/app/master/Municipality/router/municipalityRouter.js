const municipalityController = require("../controller/municipalityController")

module.exports = app =>{

    app.post("/api/v1/createMunicipality", municipalityController.create_Municipality);
    app.get("/api/v1/get_Municipality/:id", municipalityController.get_Municipality);
    app.get("/api/v1/get_active_municipality/:entity_id", municipalityController.get_allactive_Municipality);
    app.get("/api/v1/get_MunicipalityById/:id", municipalityController.getMunicipalityById)
    app.put("/api/v1/update_MunicipalityById/:id", municipalityController.updateMunicipalityById)
    app.delete("/api/v1/deleteMunicipalityById/:id", municipalityController.deleteMunicipalityById)

}