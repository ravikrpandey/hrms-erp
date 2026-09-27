const Contract_Controller = require("../controller/ContractController")

module.exports = app =>{
    app.post("/api/v1/createContractType", Contract_Controller.createContractType);
    app.get("/api/v1/get_Contract/:entity_id/:financial_id",Contract_Controller.getContractTypes);
    app.get("/api/WL/get_Active_ContractTypes",Contract_Controller.get_Active_ContractTypes);
    app.get("/api/v1/get_ContractById/:id",Contract_Controller.getContractTypeById);
    app.put("/api/v1/update_ContractById/:id",Contract_Controller.updateContractTypeById);
    app.delete("/api/v1/delete_ContractById/:id",Contract_Controller.deleteContractTypeById);
    app.put("/api/v1/CONStatus/:id",Contract_Controller.CONStatus);

}