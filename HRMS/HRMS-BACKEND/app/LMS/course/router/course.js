module.exports = app => {
    const courseController = require("../controller/course");

    app.post("/api/v1/createCourse", courseController.createCourse);
    app.post("/api/v1/createCoursewithAssessment", courseController.createCourseWithAssessment);
    app.get("/api/v1/getAllCourses", courseController.getAllCourses);
    app.get("/api/v1/getCommonCourses", courseController.getCommonCourses);
    app.get("/api/v1/getByIdCourse/:course_id", courseController.getCourseDetails);
    app.delete("/api/v1/deleteCourse/:course_id", courseController.deleteCourse);  
    app.put("/api/v1/updateCourseAssessment/:course_id", courseController.updateCourseWithAssessment);
    app.put("/api/v1/updateCourseContent/:course_id", courseController.updateCourseWithContent);
    app.post("/api/v1/course/list",courseController.courseList);
    // Assign Course

    app.post("/api/v1/allocateCourse", courseController.allocateCourse);
    app.post("/api/v1/getAssignCourses", courseController.getAllAllocationsByEmployeeId);
    app.get("/api/v1/AssignCourselist", courseController.getAllAllocationsList);
    app.get("/api/v1/getByIdAssignCourse", courseController.getAllocationById);
    app.get("/api/v1/getAllocationRequestById", courseController.getAllocationRequestById);
    app.get("/api/v1/getByIdAssignCourse2/:assign_id", courseController.getAssignedCourseById);
    
    app.get("/api/v1/assignSubmissionDetail/:assign_id", courseController.getAssignCourseSubmissionDetails);
    app.put("/api/v1/updateAssignCourse/:assign_id", courseController.updateAssignedCourse);
    app.delete("/api/v1/deleteAssignCourse/:assign_id", courseController.deleteAssignedCourse);

    app.post("/api/v1/assignCourseSubmitAssessmentDetail",courseController.assignCourseSubmitAssessmentDetail);
    // Assesment
    app.get('/api/v1/getByIdAssessment',courseController.getAssessmentDetailById)
    app.post('/api/v1/submitAssessment',courseController.submitAssessment)
    app.put('/api/v1/submitAssessmentUpdate',courseController.submitAssessmentUpdate)
    app.get('/api/v1/getAssesmentResult',courseController.getAssesmentResult)
    app.get('/api/v1/getSubmitAssessmentDetail',courseController.getSubmitAssessmnetDetail)

    //Requested Course 

    app.post('/api/v1/create_course_request',courseController.createRequestCourse);
    app.post('/api/v1/approve_course_request',courseController.lms_approve_levels)
    app.get('/api/v1/get_course_request_list',courseController.listRequestedCourses);

    // course approval 

    app.post('/api/v1/getPendingRequestlist',courseController.get_levels_to_be_approved);
    app.post('/api/v1/getRejectedRequestlist',courseController.get_Rejected_Approvals);
    app.post('/api/v1/getApprovedRequestlist',courseController.get_Approved_Approvals);
    app.get('/api/v1/getByIdCourseRequest/:id',courseController.courseRequestDetail)

    //Request Course Allocate

    app.post('/api/v1/assignRequestCourse',courseController.requestedCourseAssign);
    app.get('/api/v1/requestCourseList/:user_id', courseController.listRequestedCourseAssign);
    app.get('/api/v1/assignRequestCourseList/:user_id', courseController.requestedCourseList);

    // 
    app.post('/api/v1/lms/reportingManagerList', courseController.approvalEmployeelist);
    app.post('/api/v1/lms/submissionList/:assign_id',courseController.submisstionList)

}