import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.serverUrl;

const routes = {
  kpa: {
    getHrmKpa: (data:any) => `${databaseKey}/api/v1/get_all_kpa/${data.entity_id}?financial_id=${data.financial_id}`,
    getByKpaRequest: (id: any) => `${databaseKey}/api/v1/get_kpa_by_id/${id}`,
    createHrmKpa: () => `${databaseKey}/api/v1/create_kpa`,
    updateHrmKpa: (id: any) => `${databaseKey}/api/v1/update_kpa/${id}`,
    status: (id: any) => `${databaseKey}/api/v1/kpa_status/${id}`,
    },
    dropdownList:{
      getAllObjective_dropDown: () => `${databaseKey}/api/v1/get_all_kpaObj`,
      getemployeeById: (empid: any) =>`${databaseKey}/api/v1/get_emp_byId_bonus/${empid}`,
    },
    dept : {
      getAllDepartments : (entity_id:any)=> `${databaseKey}/api/v1/getAllDepartments/${entity_id}`,}
  }


@Injectable({
  providedIn: 'root'
})
export class HrmServiceService {
  data:any = [{}];
  databaseKey;
  constructor(private http: HttpClient) {
      this.databaseKey = environment.serverUrl;
  }

  // listHrm(data?:any):Observable<any> {
  //   return this.http.get<any>(`${this.databaseKey}/api/v1/get_hrm_list/${data}`).pipe(
  //     map((response: any) => { return response })
  // );
  // }

// Get hrm kpa list
  getHrmKpa(data:any){
    return this.http.get(routes.kpa.getHrmKpa(data))
  }
  // create hrm kpa
  createHrmKpa(data:any){
    return this.http.post(routes.kpa.createHrmKpa(), data)
  }
  // update hrm kpa
  updateHrmKpa(id: any, data: any){
    return this.http.put(routes.kpa.updateHrmKpa(id), data)
  }
 
  // update kpa Status
  updatekpaStatus(id: any, body: any) {
    return this.http.put(routes.kpa.status(id), body);
  }
  // get all objective list
  getAllObjective_dropDown(){
    return this.http.get(routes.dropdownList.getAllObjective_dropDown())
  }

  getemployeeById(id:any){
    return this.http.get(routes.dropdownList.getemployeeById(id))
  }

  getByKpaRequest(id: any) {
    return this.http.get(routes.kpa.getByKpaRequest(id))
  }


  accessAssignAction() {
    let a: any = localStorage?.getItem('local');
    if (a) {
      let b: any = window?.atob(a);
      return JSON?.parse(b);
    }
  }
///
  getAllDepartments(entity_id:any){
    return this.http.get(routes.dept.getAllDepartments(entity_id))
  }
////
}
