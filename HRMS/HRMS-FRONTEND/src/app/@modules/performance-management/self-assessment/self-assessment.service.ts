import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SelfAssessmentService {
  databaseKey: any = '';
  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  getAllPerformanceAssessment(entity_id: any, financial_id: any, emp_id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Manager_Assessment/${entity_id}?filter_fy=${financial_id}&employee_id=${emp_id}`).pipe(
      map((response: any) => { return response })
    );
  }


  //this used for approval
  getAllApprovalManager(entity_id: any, financial_id: any, emp_id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Approval_Manager/${entity_id}?filter_fy=${financial_id}&employee_id=${emp_id}`).pipe(
      map((response: any) => { return response })
    );
  }



  getAllCount(entity_id: any, emp_id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getall_total_team_member?entity_id=${entity_id}&employee_id=${emp_id}`).pipe(
      map((response: any) => { return response })
    );
  }

  getSelfAssessentKpi(data: { employee_id: any, financial_id: any, entity_id: any }): Observable<any> {
    const url = `${this.databaseKey}/api/v1/getall_kpa_team_employee_Assessment/${data.entity_id}?financial_id=${data.financial_id}&employee_id=${data.employee_id}`;
    return this.http.get<any>(url);
  }

  getSelfAssessentRating(): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_selfratings`).pipe(
      map((response: any) => { return response })
    );
  }

  getTeamAssessentemployee(data: { entity_id: any, employee_id: any, yearly_assessment_id: any }): Observable<any> {
    const url = `${this.databaseKey}/api/v1/selfperformance_employee/${data.entity_id}?employee_id=${data.employee_id}&yearly_assessment_id=${data.yearly_assessment_id}`;
    return this.http.get<any>(url);
  }

  getEmployeeAssessment(data: { entity_id: any, financial_id: any, employee_id: any, yearly_assessment_id: any }): Observable<any> {
    const url = `${this.databaseKey}/api/v1/get_employee_Assessment/${data.entity_id}?financial_id=${data.financial_id}&employee_id=${data.employee_id}&yearly_assessment_id=${data.yearly_assessment_id}`;
    return this.http.get<any>(url);
  }

  postSelfAssessment(endpoints: any, requestBody: any) {
    const payload = {
      endpoints: endpoints,
      body: requestBody
    };
    return this.http.post<any>(`${this.databaseKey}/api/v1/submit_self_assessment`, payload).pipe(
      map((response: any) => { return response })
    );
  }

  documents(body: any) {
    return this.http.post<any>(`${this.databaseKey}/WL/documents`, body).pipe(
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


  private reportingManagerIdSource = new BehaviorSubject<string | null>(null);
  private approvalManagerIdSource = new BehaviorSubject<string | null>(null);

  currentReportingManagerId = this.reportingManagerIdSource.asObservable();
  currentApprovalManagerId = this.approvalManagerIdSource.asObservable();

  changeReportingManagerId(reportingManagerId: string): void {
    this.reportingManagerIdSource.next(reportingManagerId);
  }

  changeApprovalManagerId(approvalManagerId: string): void {
    this.approvalManagerIdSource.next(approvalManagerId);
  }
}
