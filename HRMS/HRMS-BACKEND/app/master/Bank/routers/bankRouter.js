module.exports = app => {
    const bankController = require("../controller/bankController");

    app.post("/api/v1/create_Bank", bankController.createBank);
    app.get("/api/v1/getAllBANK", bankController.getAllBANK);
    app.get("/api/v1/getAll_Active_BANK", bankController.getAll_Active_BANK);
    app.get("/api/v1/getByBankID/:id", bankController.getByIdBank);
    app.put("/api/v1/updateBankById/:id", bankController.updateBankById);
    app.delete("/api/v1/delete_Bank/:id", bankController.deleteBank);
    app.put("/api/v1/BankStatus/:id", bankController.BankStatus);
  
}