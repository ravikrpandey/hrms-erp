module.exports = app => {
    const states_controller = require('../controller/states_controller');

    app.post("/api/v1/createstatescontroller",states_controller.createstates);
    app.get("/api/v1/getAllStatesData",states_controller.getAllStatesData);
    app.get("/api/v1/getallstatescontroller",states_controller.getAllstates);
    app.get("/api/v1/getStates/:countryss_id",states_controller.getStates);
    app.get("/api/v1/getidstatescontroller/:states_id",states_controller.getByIdstates);
    app.put("/api/v1/editstatescontroller/:states_id",states_controller.editstates);
    app.delete("/api/v1/deletestatescontroller/:states_id",states_controller.deletestate);
    app.get("/api/WL/getstatesbycountryid/:id",states_controller.getstatesbycountryid);
    app.put("/api/v1/updateStateStatus/:state_id", states_controller.updateStateStatus);

};