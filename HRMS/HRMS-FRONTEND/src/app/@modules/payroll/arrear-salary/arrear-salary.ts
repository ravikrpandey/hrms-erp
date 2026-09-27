import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Observable, Subject, map } from 'rxjs';
const databaseKey: any = environment.serverUrl;
const routes = {
  payroll_arrearsalary: {
    createArrearSalary: () => `${databaseKey}/api/v1/create_arrear_salary`,
    getAllArrearSalary: (entity_id: any) => `${databaseKey}/api/v1/get_all_arrear_salary?entity_id=${entity_id}`,
    getArrearSalaryById: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/get_all_arrear_salary_by_id?entity_id=${entity_id}&id=${id}`,
    deleteArrearSalary: (id: any) =>
      `${databaseKey}/api/v1/delete_arrear_salary_by_id?id=${id}`,
  },

}

@Injectable({
  providedIn: 'root'
})
export class ArrearSalary {

  databaseKey: any;
  constructor(private httpclient: HttpClient) { }

  createArrearSalary(data: any) {
    return this.httpclient.post(
      routes.payroll_arrearsalary.createArrearSalary(),
      data
    );
  }

  getAllArrearSalary(entity_id: any) {
    return this.httpclient.get(routes.payroll_arrearsalary.getAllArrearSalary(entity_id));
  }

  getArrearSalaryById(id: any, entity_id: any) {
    return this.httpclient.get(routes.payroll_arrearsalary.getArrearSalaryById(id,entity_id));
  }

  DeleteArrearSalary(id: any): Observable<any> {
    return this.httpclient.delete(routes.payroll_arrearsalary.deleteArrearSalary(id));
  }
}
