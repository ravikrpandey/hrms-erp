import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YearlyAssessmentService {
  databaseKey:any='';
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }

  assessmentFinanceYear():Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_assessment_financial_year`).pipe(
      map((response: any) => { return response })
  );
  }

  getAllAssessment(id:any,filter_fy:any):Observable<any> {  
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_assessment/${id}?filter_fy=${filter_fy}`).pipe(
      map((response: any) => { return response })
  );
  }

  getAssessmentById(id:any):Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_assessmentById/${id}`).pipe(
      map((response: any) => { return response })
  );
  }

  createYearlyAssessment(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/create_assessment`, body).pipe(
      map((response: any) => { return response })
    );
  }

  updateYearlyAssessment(id:any,body: any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/update_assessmentById/${id}`, body).pipe(
      map((response: any) => { return response })
    );
  }

  deleteAssessment(id:any) {
    return this.http.delete<any>(`${this.databaseKey}/api/v1/deleteAssessmentById/${id}`).pipe(
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
}
