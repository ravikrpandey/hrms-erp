const express = require('express');

const router = express.Router();

const superUserController = require('../controller/superUserController');

router.post('/api/v1/createSuperUser', superUserController.createSuperUser);
router.get('/api/v1/getAllSuperUser/:entity_id', superUserController.getAllSuperUser);
router.get('/api/v1/getAllActiveSuperUser/:entity_id', superUserController.getAllActiveSuperUser);
router.get('/api/v1/getAllSuperUsers/:entity_id/:financial_year', superUserController.getAllSuperUsers);
router.get('/api/v1/getSuperUserById/:id', superUserController.getSuperUserById);
router.patch('/api/v1/updateSuperUser/:id', superUserController.updateSuperUser);
router.delete('/api/v1/deleteSuperUser/:id', superUserController.deleteSuperUser);
router.put("/api/v1/updateSuperUserStatus/:id", superUserController.updateSuperUserStatus);
router.post("/api/v1/customerCreditDebit", superUserController.customerCreditDebit);
router.get("/api/v1/customerCreditDebit/:customer_id", superUserController.getCustomerCreditDebitByCustomerId);
router.get("/api/v1/getCustomerInvoiceList/:customer_id", superUserController.getCustomerInvoiceList);

module.exports = router;