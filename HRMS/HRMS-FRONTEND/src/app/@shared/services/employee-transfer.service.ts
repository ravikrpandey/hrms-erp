import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeTransferService {
  databaseKey: any = '';

  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  getAllEntityMasterdata(): Observable<any> {  
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_entityMaster`).pipe(
      map((response: any) => response)
    );
  }


  SavedataEmployeeTransfer(data:any): Observable<any> {  
    return this.http.post<any>(`${this.databaseKey}/api/v1/save_Employee_transfer`,data).pipe(
      map((response: any) => response)
    );
  }


  getListdataEmployeeTransfer(createdBy:any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/list_show_Employee_tranfser/${createdBy}`).pipe(
      map((response: any) => response)
    );
  }


  getSingledata(id:any): Observable<any> {  
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_Single_Data_employee_transfer/${id}`).pipe(
      map((response: any) => response)
    );
  }



  EmployeesTransfertatusUpdate(id: any, body: any): Observable<any> {
    return this.http.put<any>(`${this.databaseKey}/api/v1/statusUpate/${id}`, body)
      .pipe(map((response: any) => { return response }))
  }

 

  DeleettheEmployeeTransferdata(id:any): Observable<any>{
    return this.http.delete<any>(`${this.databaseKey}/api/v1/delete_Record_employee_Transfer/${id}`, )
    .pipe(map((response: any) => { return response }))
  }



  UpdateEmployeeTransferData(id: any, body: any): Observable<any> {
    return this.http.put<any>(`${this.databaseKey}/api/v1/update_the_employee_Transfer/${id}`, body)
      .pipe(map((response: any) => { return response }))
  }



  getListpendingforApproval(approvalEmpId:any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/getlist_Pending_For_Approval/${approvalEmpId}`).pipe(
      map((response: any) => response)
    );
  }


  approvedEmployeetransfer(id: any, body: any): Observable<any> {
    return this.http.put<any>(`${this.databaseKey}/api/v1/Approved_Employee_Transfer/${id}`, body)
      .pipe(map((response: any) => { return response }))
  }


  employeeRejected(id: any, body: any): Observable<any> {
    return this.http.put<any>(`${this.databaseKey}/api/v1/employee_Rejected/${id}`, body)
      .pipe(map((response: any) => { return response }))
  }


  
  getlistingApprvoedEmployee(approvalEmpId:any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_list_Approval_employee/${approvalEmpId}`).pipe(
      map((response: any) => response)
    );
  }



  getlistTheRejectedEmployee(approvalEmpId:any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_list_rejected_employee/${approvalEmpId}`).pipe(
      map((response: any) => response)
    );
  }

}


