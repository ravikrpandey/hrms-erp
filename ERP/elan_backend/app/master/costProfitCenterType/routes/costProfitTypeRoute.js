const app = require('express')
const router = app.Router()

const costProfitCenterTypeController = require('../controller/costProfitTypeController')
router.post('/api/v1/createCostProfitType',costProfitCenterTypeController.createCostProfitType)
router.get('/api/v1/getCostProfitType',costProfitCenterTypeController.getCostProfitType)
router.delete('/api/v1/deleteCostProfitTypeById',costProfitCenterTypeController.deleteCostProfitTypeById)


module.exports = router