import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
 databaseKey;
   constructor(private http: HttpClient) {
     this.databaseKey = environment.servralUrl;
   }


   create_plan_maintenance(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/create_plan_maintenance`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  maintenanceApprove_Reject(body: any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/maintenanceApprove_Reject`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  Update_plan_maintenance(id:any,body: any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/Update_plan_maintenance?id=${id}`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getall_Plan_Maintenance(entity_id: any,financial_year_id:any) {
    return this.http.get<any>
    (`${this.databaseKey}/api/v1/getall_Plan_Maintenance?entity_id=${entity_id}&financial_year_id=${financial_year_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAllPending_maintenance(emp_id:any,status:any) {
    return this.http.get<any>
    (`${this.databaseKey}/api/v1/getAllPending_maintenance?emp_id=${emp_id}&status=${status}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getSchedule_Maintenanceby_Id(id:any) {
    return this.http.get<any>
    (`${this.databaseKey}/api/v1/getSchedule_Maintenanceby_Id?id=${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAll_remark_ByPlanId(id:any) {
    return this.http.get<any>
    (`${this.databaseKey}/api/v1/getAll_remark_ByPlanId?id=${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getall_Schedule_Maintenanceby_status(entity_id:any,financial_year_id:any,status:any) {
    return this.http.get<any>
    (`${this.databaseKey}/api/v1/getall_Schedule_Maintenanceby_status?entity_id=${entity_id}&financial_year_id=${financial_year_id}&status=${status}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAll_maintenanceTypeby_Workstation_id(workstation_id:any) {
    return this.http.get<any>
    (`${this.databaseKey}/api/v1/getAll_maintenanceTypeby_Workstation_id?workstation_id=${workstation_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}

