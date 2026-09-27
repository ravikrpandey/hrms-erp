const express = require('express')
const router = express.Router()
const BomDetails = require('../controller/bomcontroller');

router.post("/api/v1/createBom", BomDetails.createBom); 
router.get("/api/v1/getBomAll/:id?", BomDetails.getBomAll); 
router.put("/api/v1/bomStatus/:id?", BomDetails.bomStatus); 
router.put("/api/v1/updateBom/:id?", BomDetails.updateBom); 
router.delete("/api/v1/bomDelete/:id?", BomDetails.bomDelete); 
router.post("/api/v1/get_Bom_By_Type", BomDetails.get_Bom_By_Type); 
router.get("/api/v1/getProductVarient/:id", BomDetails.productVarient);
router.post("/api/v1/getAllItems/:id", BomDetails.getAllItems); 
router.get("/api/v1/BOM_get_id/:id", BomDetails.BOM_get_id); 






module.exports= router