import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AllAssessmentService {
  databaseKey:any='';
  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }
  
getAllSelfAssessment(id:any,employee_id:any,b:any):Observable<any> {
  return this.http.get<any>(`${this.databaseKey}/api/v1/get_Self_Assessment/${id}?employee_id=${employee_id}&filter_fy=${b}`).pipe(
    map((response: any) => { return response })
);
}

// get all department wise data
getAllAssessmentDeptWise(entity_id:any,filter_fy:any,yearly_assessment_id:any): Observable<any> {
  const url = `${this.databaseKey}/api/v1/getall_assessment_dept_wise/?filter_fy=${filter_fy}&entity_id=${entity_id}&yearly_assessment_id=${yearly_assessment_id}`;
  return this.http.get<any>(url);
}

// get all user list for a department 
getDepartmentAssessmentList(filter_fy:any,entity_id:any,yearly_assessment_id:any,department_id:any): Observable<any> {
  const url = `${this.databaseKey}/api/v1/get_assessmentlist_by_dept/?filter_fy=${filter_fy}&entity_id=${entity_id}&yearly_assessment_id=${yearly_assessment_id}&department_id=${department_id}`;
  return this.http.get<any>(url);
}

getAlluserCountThedesignationbase(entity_id:any,filter_fy:any,yearly_assessment_id:any){
  const url = `${this.databaseKey}/api/v1/getall_totalnumber_employee/?filter_fy=${filter_fy}&entity_id=${entity_id}&yearly_assessment_id=${yearly_assessment_id}`;
  return this.http.get<any>(url);
}

getSelfAssessentRating():Observable<any> {
  return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_selfratings`).pipe(
    map((response: any) => { return response })
);
}

getSelfAssessentemployee(data: { id: any,entity_id: any, financial_id: any, employee_id: any }): Observable<any> {
  const url = `${this.databaseKey}/api/v1/get_selfemployee/${data.entity_id}?financial_id=${data.financial_id}&employee_id=${data.employee_id}&id=${data.id}`;
  return this.http.get<any>(url);
}

getSelfAssessment(data: { entity_id: any, financial_id: any, employee_id: any ,submit_assessment_id:any}): Observable<any> {
  const url = `${this.databaseKey}/api/v1/get_submited_self_assessment/${data.entity_id}?financial_id=${data.financial_id}&employee_id=${data.employee_id}&submit_assessment_id=${data.submit_assessment_id}`;
  return this.http.get<any>(url);
}

postSelfAssessment(endpoints:any,requestBody: any) {
  const payload = {
    endpoints: endpoints,
    body: requestBody
  };
  return this.http.post<any>(`${this.databaseKey}/api/v1/submit_self_assessment`, payload).pipe(
    map((response: any) => { return response })
  );
}

updateAssessment(endpoints:any,requestBody: any) {
  const payload = {
    endpoints: endpoints,
    body: requestBody
  };
  return this.http.put<any>(`${this.databaseKey}/api/v1/updateSubmit_SelfAssessment`, payload).pipe(
    map((response: any) => { return response })
  );
}

documents(body: any) {
  return this.http.post<any>(`${this.databaseKey}/documents`, body).pipe(
    map((response: any) => { return response })
  );
}

  accessAssignAction() {
    let a: any = localStorage?.getItem('local');
    if (a) {
      let b: any = window?.atob(a);
      return JSON?.parse(b);
    }
  }

  getCompleteSelfAssessment(entity_id:any,filter_fy:any,employee_id:any,yearly_assessment_id:any):Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_by_id_self_assessment?entity_id=${entity_id}&filter_fy=${filter_fy}&employee_id=${employee_id}&yearly_assessment_id=${yearly_assessment_id}`).pipe(
      map((response: any) => { return response })
  );
  }

}
