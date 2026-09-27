import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  databaseKey:any='';
  constructor(private http: HttpClient) { this.databaseKey = environment.serverUrl;}

  //upload excecl

  upload_excel(formdata:any):Observable<any>{
    return this.http.post(`${this.databaseKey}/api/v1/upload_excel`,formdata).pipe(
      map((res:any)=>res)
    )
  }

  uploadEmployeeExcel(formdata:any):Observable<any>{
    return this.http.post(`${this.databaseKey}/api/v1/upload_employee_excelData`,formdata).pipe(
      map((res:any)=>res)
    )
  }
  uploadAttendanceExcel(formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.databaseKey}/api/v1/upload_attendance_excelData`, formData);
}



  //area excel download
  area_excel_format(): Observable<Blob> {
    return this.http.get(`${this.databaseKey}/api/v1/download_area_excel`, { responseType: 'blob' });
  }

  // Employee upload
  employee_upload(formdata:any):Observable<any>{
    return this.http.post(`${this.databaseKey}/api/v1/employee_upload`,formdata).pipe(
      map((res:any)=>res)
    )
  }

  // Employee upload
  createCustomer(formdata:any):Observable<any>{
    return this.http.post(`${this.databaseKey}/api/v1/createCustomer`,formdata).pipe(
      map((res:any)=>res)
    )
  }



}
