
const zoomCtrl = require('../controller/zoomMeetingController');

module.exports = app =>{
app.post('/api/v1/generateZoomMeeting', zoomCtrl.generateZoomMeeting);
app.post('/api/v1/generateGoogleMeet', zoomCtrl.generateGoogleMeet);
app.post('/api/v1/createWebinarSession', zoomCtrl.createWebinarSession);
app.get('/api/v1/getAllWebinarSessions/:entity_id', zoomCtrl.getAllWebinarSessions);
app.get('/api/v1/getWebinarSessionById/:id', zoomCtrl.getWebinarSessionById);
app.put('/api/v1/updateWebinarSession/:id', zoomCtrl.updateWebinarSession);

}

