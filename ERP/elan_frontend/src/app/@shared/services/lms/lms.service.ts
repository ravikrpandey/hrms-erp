import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;
const routes = {
  LmsCourseCategory: {
    getAllLmsCourseCAtegory: (entity_id :any) => `${databaseKey}/api/v1/lms/course-categories/list?entity_id=${entity_id}`,
    getLmsCourseCategoryById: (category_id: any) => `${databaseKey}/api/v1/lms/course-categories/id/${category_id}`,
    updateLmsCourseCategory: (category_id: any) => `${databaseKey}/api/v1/lms/course-categories/update/${category_id}`,
    deleteLmsCourseCategory: (category_id: any) => `${databaseKey}/api/v1/lms/course-categories/delete/${category_id}`,
    createLmsCourseCategory: () => `${databaseKey}/api/v1/lms/course-categories/create`
  },
  course: {
    createCourse: () => `${databaseKey}/api/v1/lms/courses/create`,
    createCourseWithAssessemnt: () => `${databaseKey}/api/v1/lms/courses/content-assessment/create`,
    getAllCourses: (entity_id : any) => `${databaseKey}/api/v1/lms/all-courses?entity_id=${entity_id}`,
    getCoursesList: () => `${databaseKey}/api/v1/lms/course/list`,
    getCommonCourses: (entity_id : any) => `${databaseKey}/api/v1/lms/common-courses?entity_id=${entity_id}`,
    getCourseById: (course_id: any) => `${databaseKey}/api/v1/lms/course/${course_id}`,
    deleteSingleCourse: (course_id: any) => `${databaseKey}/api/v1/lms/courses/delete/${course_id}`,
    updateSingleCourse: (course_id: any) => `${databaseKey}/api/v1/lms/courses/update/${course_id}`,
    updateSingleCourseAssessment: (course_id: any) => `${databaseKey}/api/v1/lms/courses/content-assessment/update/${course_id}`
  },
  assignCourse: {
    createAssignCourse: () => `${databaseKey}/api/v1/allocateCourse`,
    getAssignCourselist: (entity_id : any) => `${databaseKey}/api/v1/AssignCourselist?entity_id=${entity_id}`,
    getAssignCourseListByEmployee: () => `${databaseKey}/api/v1/getAssignCourses`,
    deleteAssigncourse: (assign_id: any) => `${databaseKey}/api/v1/deleteAssignCourse/${assign_id}`,
    updateAssigncourse: (assign_id: any) => `${databaseKey}/api/v1/updateAssignCourse/${assign_id}`,
    getAssignCourseById: (assign_id: any) => `${databaseKey}/api/v1/getByIdAssignCourse2/${assign_id}`,
    getAssignCourseDetails: (query: any) => `${databaseKey}/api/v1/getByIdAssignCourse?assign_id=${query.assign_id}&employee_id=${query.employee_id}`,
    assignSubmissionDetail: (assign_id: any) => `${databaseKey}/api/v1/assignSubmissionDetail/${assign_id}`,
    getAssignCourseSubmitAssessmentDetail: () => `${databaseKey}/api/v1/assignCourseSubmitAssessmentDetail`
  }
  ,
  assessment: {
    // /api/v1/getroleMenuAccessdetails?employee_id=${res?.employee_id}&role_master_id=${res?.role_master_id}&entity_id=${res?.entity_id}`,
    getAssessmentCourseDetails: (query: any) => `${databaseKey}/api/v1/getByIdAssessment?assessment_id=${query.assessment_id}&employee_id=${query.employee_id}`,
    getSubmitAssessmentDetails: (employee_id: any) => `${databaseKey}/api/v1/getSubmitAssessmentDetail?employee_id=${employee_id}`,
    submitAssessment: () => `${databaseKey}/api/v1/submitAssessment`,
  },
  requestedCourse: {
    createRequestedCourse: () => `${databaseKey}/api/v1/create_course_request`,
    approvedRequestedCourse: () => `${databaseKey}/api/v1/approve_course_request`,
    listRequestedCourseByEmpid: (query: any) => `${databaseKey}/api/v1/get_course_request_list?employee_id=${query.employee_id}`,
    pendingRequestCourse: () => `${databaseKey}/api/v1/getPendingRequestlist`,
    rejectedRequestCourse: () => `${databaseKey}/api/v1/getRejectedRequestlist`,
    approvedRequestCourse: () => `${databaseKey}/api/v1/getApprovedRequestlist`,
    requestDetailById: (req_id: any) => `${databaseKey}/api/v1/getByIdCourseRequest/${req_id}`
  },
  requestCourseModule: {
    requestCourseAssign: () => `${databaseKey}/api/v1/assignRequestCourse`,
    requestCourseList: (user_id: any) => `${databaseKey}/api/v1/requestCourseList/${user_id}`,
    requestCourseAssignList: (user_id: any) => `${databaseKey}/api/v1/assignRequestCourseList/${user_id}`,
  }
}

@Injectable({
  providedIn: 'root'
})
export class LmsService {

  databaseKey: any = '';
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }

  createCourse() { }

  documents(body: any) {
    return this.http.post<any>(`${this.databaseKey}/WL/documents`, body).pipe(
      map((response: any) => { return response })
    );
  }
  getAllCourses(entity_id : any): Observable<any> {
    return this.http.get(routes.course.getAllCourses(entity_id))
  }
  getCoursesList(data: any): Observable<any> {
    return this.http.post(routes.course.getCoursesList(), data)
  }
  getCommonCourses(entity_id : any): Observable<any> {
    return this.http.get(routes.course.getCommonCourses(entity_id))
  }
  addCourse(data: any): Observable<any> {
    return this.http.post(routes.course.createCourse(), data);
  }
  addCourseAssessment(data: any): Observable<any> {
    return this.http.post(routes.course.createCourseWithAssessemnt(), data);
  }
  getCourseDetails(course_id: any): Observable<any> {
    return this.http.get(routes.course.getCourseById(course_id));
  }

  // Assign course
  assignSubmissionDetail(assign_id: any): Observable<any> {
    return this.http.get(routes.assignCourse.assignSubmissionDetail(assign_id));
  }
  getAssignCourseDetails(assign_id: any): Observable<any> {
    return this.http.get(routes.assignCourse.getAssignCourseDetails(assign_id));
  }
  deleteSingleCourse(course_id: any, data: any) {
    return this.http.delete(routes.course.deleteSingleCourse(course_id), data);
  }
  updateSingleCourseContent(course_id: any, data: any) {
    return this.http.put(routes.course.updateSingleCourse(course_id), data);
  }
  updateSingleCourseAssessment(course_id: any, data: any) {
    return this.http.put(routes.course.updateSingleCourseAssessment(course_id), data);
  }
  getAssignCourseSubmitAssessmentDetail(data: any) {
    return this.http.post(routes.assignCourse.getAssignCourseSubmitAssessmentDetail(), data);
  }
  //////////////////
  allocateCourse(data: any) {
    return this.http.post(routes.assignCourse.createAssignCourse(), data)
  }
  getAllocateCourse(data: any) {
    return this.http.post(routes.assignCourse.getAssignCourseListByEmployee(), data)
  }
  assignCourseList(entity_id :any) {
    return this.http.get(routes.assignCourse.getAssignCourselist(entity_id))
  }
  getAssignCourseById(assign_id: any): Observable<any> {
    return this.http.get(routes.assignCourse.getAssignCourseById(assign_id));
  }
  deleteAssignCourse(assign_id: any, data: any) {
    return this.http.delete(routes.assignCourse.deleteAssigncourse(assign_id), data);
  }
  updateAssignCourse(assign_id: any, data: any) {
    return this.http.put(routes.assignCourse.updateAssigncourse(assign_id), data);
  }
  //////////////////
  getAssessmentCourseDetails(query: any): Observable<any> {
    return this.http.get(routes.assessment.getAssessmentCourseDetails(query));
  }
  getSubmitAssessmentDetail(employee_id: any): Observable<any> {
    return this.http.get(routes.assessment.getSubmitAssessmentDetails(employee_id));
  }

  submitAssessment(data: any) {
    return this.http.post(routes.assessment.submitAssessment(), data)
  }

  //request course 

  createRequestedCourse(data: any) {
    return this.http.post(routes.requestedCourse.createRequestedCourse(), data)
  }
  approvedRequestedCourse(data: any) {
    return this.http.post(routes.requestedCourse.approvedRequestedCourse(), data)
  }
  getAllRequestedCourses(query: any) {
    return this.http.get(routes.requestedCourse.listRequestedCourseByEmpid(query))
  }

  getPendingRequestCourse(data: any) {
    return this.http.post(routes.requestedCourse.pendingRequestCourse(), data)
  }
  getRejectedRequestCourse(data: any) {
    return this.http.post(routes.requestedCourse.rejectedRequestCourse(), data)
  }
  getApprovedRequestCourse(data: any) {
    return this.http.post(routes.requestedCourse.approvedRequestCourse(), data)
  }
  getRequestDetail(data: any) {
    return this.http.get(routes.requestedCourse.requestDetailById(data))
  }

  // Course Request Module

  requestCourseAllocate(data: any) {
    return this.http.post(routes.requestCourseModule.requestCourseAssign(), data);
  }
  getCourseRequestList(user_id: any) {
    return this.http.get(routes.requestCourseModule.requestCourseList(user_id));
  }
  getCourseRequestAssignList(user_id: any) {
    return this.http.get(routes.requestCourseModule.requestCourseAssignList(user_id));
  }
  getLmsCourseCategory(entity_id:any) { return this.http.get(routes.LmsCourseCategory.getAllLmsCourseCAtegory(entity_id)); }
  deleteLmsCourseCategory(category_id: any) { return this.http.delete(routes.LmsCourseCategory.deleteLmsCourseCategory(category_id)); }
  getByIdLmsCourseCategory(category_id: any) { return this.http.get(routes.LmsCourseCategory.getLmsCourseCategoryById(category_id)); }
  updateLmsCourseCategory(category_id: any, data: any) { return this.http.put(routes.LmsCourseCategory.updateLmsCourseCategory(category_id), data); }
  createLmsCourseCategory(data: any) { return this.http.post(routes.LmsCourseCategory.createLmsCourseCategory(), data); }
}
