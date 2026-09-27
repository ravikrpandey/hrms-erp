module.exports = app => {
    const pincode_controller = require('../controller/pincode_controller');

    app.post("/api/v1/createpincodecontroller",pincode_controller.createpincode);
    app.get("/api/v1/getallpincodecontroller",pincode_controller.getAllpincode);
    app.get("/api/v1/getidpincodecontroller/:pincode_id",pincode_controller.getByIdpincode);
    app.put("/api/v1/editpincodecontroller/:pincode_id",pincode_controller.editpincode);
    app.delete("/api/v1/deletepincodecontroller/:pincode_id",pincode_controller.deletepincode);
    app.get("/api/v1/getpincodebycityid/:id",pincode_controller.getpincodebycityid);
};