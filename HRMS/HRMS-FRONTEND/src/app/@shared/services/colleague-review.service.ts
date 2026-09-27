import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColleagueReviewService {
  databaseKey:any='';
  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  getAllAssessment(filter_fy:any,entity_id:any,financial_year_id:any):Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_assessment_by_year/?financial_year_id=${financial_year_id}&filter_fy=${filter_fy}&entity_id=${entity_id}`).pipe(
      map((response: any) => { return response })
  );
  }

  get_all_employeeBy_User_role(role_id:any,entity_id:any,yearly_assessment_id:any,filter_fy:any,login_id:any):Observable<any>{
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_employee_by_assessment_id?role_master_id=${role_id}&entity_id=${entity_id}&yearly_assessment_id=${yearly_assessment_id}&filter_fy=${filter_fy}&login_id=${login_id}`).pipe(
        map((response: any) => { return response })
    );
  }

  addReview(payload: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/create_colleague_review`, payload).pipe(
      map((response: any) => { return response })
    );
  }

  getAllReviews(filter_fy:any,login_id:any,entity_id:any):Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_colleague_review_list?filter_fy=${filter_fy}&login_id=${login_id}&entity_id=${entity_id}`).pipe(
      map((response: any) => { return response })
  );
  }

  getById(id:any):Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_assessment_by_year/?id=${id}`).pipe(
      map((response: any) => { return response })
  );
  }



  get_employee_based_assessment_subbmitedd_id(yearly_assessment_id: any): Observable<any> {
    const apiUrl = `${this.databaseKey}/api/v1/get_employee_based_assessment_subbmitedd_id?yearly_assessment_id=${yearly_assessment_id}`;
    return this.http.get<any>(apiUrl).pipe(
        map((response: any) => {
            return response;
        })
    );
}


}
