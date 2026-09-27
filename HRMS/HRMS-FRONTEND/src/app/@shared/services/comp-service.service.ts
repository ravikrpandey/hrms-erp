import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CompServiceService {
  databaseKey: any = '';

  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  getEmployeeBasedOnEntity(primary_entity_id: any) {
    return this.http.get(
      `${this.databaseKey}/api/v1/getUserEntityWise/${primary_entity_id}`
    );
  }

  saveRecordAssignCompOff(data: any) {
    return this.http.post(`${this.databaseKey}/api/v1/saveAssignCompOff`, data);
  }

  getCompListData(entity_id: any) {
    return this.http.get(
      `${this.databaseKey}/api/v1/getListdataCompOff/${entity_id}`
    );
  }

  getCompRecordById(id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/getCompById/${id}`);
  }

  deleteCompOff(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/deleteCompoff/${id}`);
  }

  updateCompOff(id: number, data: any) {
    return this.http.put(
      `${this.databaseKey}/api/v1/updateCompOffdata/${id}`,
      data
    );
  }



getCompOffInOut(from_date: string, to_date: string, entity_id: number, employee_ids: number[]) {
  let params = new HttpParams()
    .set('entity_id', entity_id)
    .set('from_date', from_date)
    .set('to_date', to_date);

  employee_ids.forEach(id => {
    params = params.append('employee_id', id.toString());
  });

  return this.http.get(`${this.databaseKey}/api/v1/get_daily_Attendance__InoutCompoff`, { params });
}



getOnlyLoginUserData(entity_id:any, created_by:any){
  return this.http.get(
      `${this.databaseKey}/api/v1/getCompoffOnlyLoginEmployee/${entity_id}/${created_by}`
    );
}
}
