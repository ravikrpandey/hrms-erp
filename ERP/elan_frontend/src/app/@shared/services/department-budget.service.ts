import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

const routes = {

  deparment_budget:{
    getDepartment_budget:()=>`${databaseKey}/api/v1/getAllDepartment_pro`,
    editDepartment_budget:(id:any)=>`${databaseKey}/api/v1/editDepartment/${id}`,
    // getByIdDepartment:(id:any)=>`${databaseKey}/api/v1/getByIdDepartment_pro/${id}`,
    getByIdDepartments:()=>`${databaseKey}/api/v1/getByIdDepartment_pro`,
    getByDepartmentTypeFinancial:()=>`${databaseKey}/api/v1/get_budget_details`,


  }
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentBudgetService {
  vendor_Id:any = new BehaviorSubject(null);
  vendorTitle:any = new BehaviorSubject(null);

  constructor( private http: HttpClient) { }

  //department Budget
  getDepartment_budget(){
    return this.http.get(routes.deparment_budget.getDepartment_budget());
  }
  editDepartment_budget(dept_id:any,data:any){
    return this.http.put(routes.deparment_budget.editDepartment_budget(dept_id),data);
  }
  // getByIdDepartment(dept_id:any){
  //   return this.http.get(routes.deparment_budget.getByIdDepartment(dept_id));
  // }
  getByIdDepartments(data:any){
    return this.http.put(routes.deparment_budget.getByIdDepartments(),data);
  }

  getBudgetTypeFinancialDepartment(data:any){
    return this.http.post(routes.deparment_budget.getByDepartmentTypeFinancial(),data);
  }
}