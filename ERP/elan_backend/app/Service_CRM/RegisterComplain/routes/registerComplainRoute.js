
const registerComplainController = require('../controllers/registerComplainController')

module.exports = app=> {
    app.post('/api/v1/createregistercomplain',registerComplainController.createRegisterComplain);
    app.put('/api/v1/assignservicecenter',registerComplainController.assignServiceCenter);
    app.get('/api/v1/registercomplainlist',registerComplainController.registerComplainList);
    app.get('/api/v1/getComplaintById/:register_complain_id',registerComplainController.getComplaintById);
    app.get('/api/v1/assignedcomplainlist',registerComplainController.assignedComplainList);
    app.put('/api/v1/updatecomplaindetail/:register_complain_id',registerComplainController.updateComplainDetail);
    app.get('/api/v1/open_complainList',registerComplainController.openComplainList);
    app.get('/api/v1/resolve_complainList',registerComplainController.resloveComplainList);
    app.get('/api/v1/rejected_complainList',registerComplainController.rejectedComplainList);
    app.get('/api/v1/complainlistbyservicecenter/:service_center_id',registerComplainController.complainListByServiceCenter);
    app.get('/api/v1/getregistercomplainbyid/:register_complain_id',registerComplainController.getRegisterComplainById);
    app.post('/api/v1/createMaterialRequest',registerComplainController.createMaterialRequest);
    app.get('/api/v1/getMaterialRequestbyComplainId/:register_complain_id',registerComplainController.getMaterialRequestbyComplainId);
    app.get('/api/v1/allMaterialRequestList',registerComplainController.allMaterialRequestList);
    app.get('/api/v1/complainstatuslist',registerComplainController.complainStatusList);
    app.post('/api/v1/materialRequestAllocate',registerComplainController.materialRequestAllocate);
    app.get('/api/v1/todayLogDashboard',registerComplainController.todayLogDashboard);
    app.get('/api/v1/complaintStatus',registerComplainController.complainStatus);
}
