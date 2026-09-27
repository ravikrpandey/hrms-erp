const express = require("express");
const router = express.Router();

const customerTypeController = require("../controller/customerTypecontroller.js");

router.post("/api/v1/createCustomerType", customerTypeController.createCustomerType );
router.put("/api/v1/editCustomerType/:id", customerTypeController.editCustomerType);
router.get("/api/v1/getByIdCustomerType/:id", customerTypeController.getByIdCustomerType);
router.get("/api/v1/getAllCustomerType", customerTypeController.getAllCustomerType);
router.get("/api/v1/getAllActiveCustomer", customerTypeController.getAllActiveCustomer);
router.delete("/api/v1/deleteCustomerType/:id", customerTypeController.deleteCustomerType);
router.put("/api/v1/updateCustomerTypeStatus/:id", customerTypeController.updateCustomerTypeStatus);
router.get("/api/v1/getAllActiveCustomerIndustry", customerTypeController.getAllActiveCustomerIndustry);
router.get("/api/v1/customerlistBycustomertype/:id", customerTypeController.customerlistBycustomertype);
// router.get("/api/v1/itemlistBycustomerid", customerTypeController.itemlistBycustomerid);



module.exports = router;


