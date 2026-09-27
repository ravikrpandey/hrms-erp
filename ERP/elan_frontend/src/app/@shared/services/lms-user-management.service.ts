import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
const databaseKey: any = environment.servralUrl;

const routes = {
    getCourse: (id:any) => `${databaseKey}/api/v1/getBy_emp_Id_Course/${id}`,
    getAprovedCourses: (id:any) => `${databaseKey}/api/v1/get_By_Approved_Course/${id}`,
    getAssignedCourses: (id:any) => `${databaseKey}/api/v1/get_All_Assigned_Course/${id}`,
    updateRequestStatus: (id:any) => `${databaseKey}/api/v1/edit_Pending_Status/${id}`,
    sendCourseRequest: (id:any) => `${databaseKey}/api/v1/edit_Status_Course/${id}`,
    // getContent: (id:any) => `${databaseKey}/api/v1/getBy_content_traning_id/${id}`,
    getContent: () => `${databaseKey}/api/v1/getBy_content_traning_id`,
    editSingle_Content: (id:any) => `${databaseKey}/api/v1/edit_single_Content/${id}`,
    update_isAssesment_submited: () => `${databaseKey}/api/v1/update_isAssesment_submited`,
    penddingCourse: (id:any) => `${databaseKey}/api/v1/getAll_requested_pending_course/${id}`,
    getAllQuestion: (id:any) => `${databaseKey}/api/v1/get_questions_By_contentID/${id}`,
    postResult: (id:any) => `${databaseKey}/api/v1/edit_questionaries/${id}`,
    postAllQuestionOptions: (id:any) => `${databaseKey}/api/v1/editquestionaries/${id}`,
    update_current_attempt_count: () => `${databaseKey}/api/v1/update_current_attempt_count`,
    contentProgress: () => `${databaseKey}/api/v1/update_content_detail_byId`,

    
  }


@Injectable({
  providedIn: 'root'
})
export class LmsUserManagementService {

  constructor(private http: HttpClient) { }

  getCourse(id: any):Observable<any> {
    return this.http.get(routes.getCourse(id));
  };
  
  getAprovedCourses(id: any):Observable<any> {
    return this.http.get(routes.getAprovedCourses(id));
  };

  getAssignedCourses(id: any):Observable<any> {
    return this.http.get(routes.getAssignedCourses(id));
  };

  // getContent(id: any):Observable<any> {
  //   return this.http.get(routes.getContent(id));
  // };

    getContent(data: any):Observable<any> {
    return this.http.post(routes.getContent(),data);
  };

  editSingle_Content(id: any, data:any):Observable<any> {
    return this.http.put<any>(routes.editSingle_Content(id),data);
  };

  update_isAssesment_submited(data:any):Observable<any> {
    return this.http.post<any>(routes.update_isAssesment_submited(),data);
  };

  penddingCourse(id: any):Observable<any> {
    return this.http.get(routes.penddingCourse(id));
  };

  getAllQuestion(id: any):Observable<any> {
    return this.http.get(routes.getAllQuestion(id));
  };

  postResult(id:any, data:any):Observable<any> {
    return this.http.put<any>(routes.postResult(id),data);
  };

  postAllQuestionOptions(id: any,data:any):Observable<any> {
    return this.http.put(routes.postAllQuestionOptions(id),data);
  };
  update_current_attempt_count(data:any):Observable<any> {
    return this.http.post(routes.update_current_attempt_count(),data);
  };
  contentProgress(data:any):Observable<any> {
    return this.http.patch(routes.contentProgress(),data);
  };

  

  updateRequestStatus(id: any,data:any):Observable<any> {
    return this.http.put(routes.updateRequestStatus(id),data);
  }
  sendCourseRequest(id: any,data:any):Observable<any> {
    return this.http.put(routes.sendCourseRequest(id),data);
  }
}
