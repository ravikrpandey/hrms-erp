import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { BehaviorSubject } from 'rxjs';


const databaseKey: any = environment.serverUrl;

const routes = {
  dataCenter: {
    addDataSalesReport: () => `${databaseKey}/api/v1/addDataSalesReport`,
    addClientCenterData: () => `${databaseKey}/api/v1/addClientCenterData`,
    getAllClientCenter: () => `${databaseKey}/api/v1/getAllClientCenter`,
    deleteClientCenter: (id:any) => `${databaseKey}/api/v1/deleteClientCenter/${id}`,
    getAllSalesReportCenter: () => `${databaseKey}/api/v1/getAllSalesReportCenter`,
    allActiveBranchList: () => `${databaseKey}/api/v1/getAllActiveBranches`,
  }
}

@Injectable({
  providedIn: 'root'
})


export class DataCenterService {

  constructor(private http: HttpClient) { }
  private buttonClickSubject = new Subject<void>();

  buttonClick$ = this.buttonClickSubject.asObservable();

  triggerButtonClick() {
    this.buttonClickSubject.next();
  }

  //////////// start data //////////////
  addDataSalesReport(data: any): Observable<any> {
    return this.http.post(routes.dataCenter.addDataSalesReport(), data);
  }
  addClientCenterData(data: any): Observable<any> {
    return this.http.post(routes.dataCenter.addClientCenterData(), data);
  }
  getAllClientCenter(): Observable<any> {
    return this.http.get(routes.dataCenter.getAllClientCenter());
  }
  deleteClientCenter(id:any, payload:any): Observable<any> {
    return this.http.put(routes.dataCenter.deleteClientCenter(id),payload);
  }
  getAllSalesReportCenter(): Observable<any> {
    return this.http.get(routes.dataCenter.getAllSalesReportCenter());
  }
  getActiveBranchList(): Observable<any> {
    return this.http.get(routes.dataCenter.allActiveBranchList());
  }
  //////////// end data //////////////
}
