import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/app/environments/environment';



const databaseKey: any = environment.serverUrl;

const routes = {
  fnf: {
    createFnfFullData: () => `${databaseKey}/api/v1/fnf/submit`,
    getFnfFullDataById: (employee_id: any) => `${databaseKey}/api/v1/fnf/getFnfFullDataById/${employee_id}`,
    updateFnfFullData: (employee_id: any) => `${databaseKey}/api/v1/fnf/update/${employee_id}`,
    sendFnfEmail: () => `${databaseKey}/api/v1/fnf/send_fnf_email`,
}

  }


@Injectable({
  providedIn: 'root'
})
export class FnfserviceServiceTsService {

  empId: any = new BehaviorSubject(null);
  constructor(private http: HttpClient) { }

  createFnfFullData(data: any): Observable<any> {
    return this.http.post(routes.fnf.createFnfFullData(), data);
  }


  getFnfFullDataById(employee_id: any): Observable<any> {
    return this.http.get(routes.fnf.getFnfFullDataById(employee_id));
  }

  updateFnfFullData(employee_id: any, data: any): Observable<any> {
    return this.http.put(routes.fnf.updateFnfFullData(employee_id), data);
  }
  sendFnfEmail(formData: any) {
    return this.http.post(routes.fnf.sendFnfEmail(), formData);;
  }

  setEmpId(id: any) {
    this.empId.next(id);
  };

  getEmpId() {
    return this.empId;
  }

}
