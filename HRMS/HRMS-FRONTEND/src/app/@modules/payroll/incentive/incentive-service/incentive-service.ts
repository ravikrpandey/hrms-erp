import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
const databaseKey: any = environment.serverUrl;
const routes = {
  payroll_incentive: {
    createIncentive: () => `${databaseKey}/api/v1/createIncentive`,
    getIncentive: (entity_id: any) => `${databaseKey}/api/v1/getAllIncentive?entity_id=${entity_id}`,
    getAllIncentiveById: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/getAllIncentiveById?entity_id=${entity_id}&id=${id}`,
    deleteIncentive: (id: any) =>
      `${databaseKey}/api/v1/deleteIncentive?id=${id}`,
  },
}


@Injectable({
  providedIn: 'root'
})
export class IncentiveService {
 databaseKey:any='';
  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
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

  getAllDepartmentData(entity_id:any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_department_data`,{params:{entity_id:entity_id}}).pipe(
      map((response: any) => { return response })
  );
  }



  getAssessmentShowonDashboard(entity_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getall_assessment_data_shwoDashboard?entity_id=${entity_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  getSelfRatingShowDashboard(entity_id: any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_Alldata_showDashboard?entity_id=${entity_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  getDataReportingOrApprovalManager(entity_id: any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_Alldata_technical_ReportingorApproval?entity_id=${entity_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }



  getBehaviourDataReportingOrApprovalManager(entity_id: any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_Alldata_behaviour_ReportingorApproval?entity_id=${entity_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  

  getAllDoughnutchartdata(entity_id: any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_doughnutchartData_showdashboard?entity_id=${entity_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
   createIncentive(data: any) {
      return this.http.post(
        routes.payroll_incentive.createIncentive(),
        data
      );
    }
  
    getAllIncentive(entity_id: any) {
      return this.http.get(routes.payroll_incentive.getIncentive(entity_id));
    }
  
    getIncentiveById(id: any, entity_id: any) {
      return this.http.get(routes.payroll_incentive.getAllIncentiveById(id,entity_id));
    }
  
    deletePayrollIncentive(id: any): Observable<any> {
      return this.http.delete(routes.payroll_incentive.deleteIncentive(id));
    }
}
