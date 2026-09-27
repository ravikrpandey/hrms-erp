import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesTargetService {

  apiURL;
  constructor(private http: HttpClient) {
    this.apiURL = environment.servralUrl + '/api/v1/';
  }

  getAllReportingManager(entity_id: any) {
    return this.http.get<any>(`${this.apiURL}getAllReportingManager?entity_id=${entity_id}`);
  }

  getAllSalesEmployee(reporting_manager_id: any) {
    return this.http.get<any>(`${this.apiURL}getAllSalesEmployee?reporting_manager_id=${reporting_manager_id}`);
  }

  createUpdateTarget(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}createUpdateTarget`, data);
  }

  getTargetDetails(id: any) {
    return this.http.get<any>(`${this.apiURL}getTargetDetails?id=${id}`);
  }

  getTargetList(entity_id: any, status: any) {
    return this.http.get<any>(`${this.apiURL}getTargetList?entity_id=${entity_id}&status=${status}`);
  }

  targetStatusChange(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}targetStatusChange`, data);
  }

  getAchievementList(entity_id: any) {
    return this.http.get<any>(`${this.apiURL}getAchievementList?entity_id=${entity_id}`);
  }

   getAchievementDetails(id: any) {
    return this.http.get<any>(`${this.apiURL}getAchievementDetails?id=${id}`);
  }

}