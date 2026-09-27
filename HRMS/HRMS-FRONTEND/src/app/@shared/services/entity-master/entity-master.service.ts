import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;



const routes = {
  // CompanyMaster: {
  //   AddCompany: () => `${databaseKey}/api/v1/createCompanyMaster`,
  //  getAllCompany:()=>`${databaseKey}/api/v1/getAll_companyMaster`,
  //  deletecompanyData:(id:any)=>`${databaseKey}/api/v1/delete_companyMaster/${id}`,
  //  getByIdCompany:(id:any)=>`${databaseKey}/api/v1/getById_companyMaster/${id}`,
  //  updateById:(id:any)=>`${databaseKey}/api/v1/update_companyMaster/${id}`
  // },

  entityMaster: {
    createEntityMaster: () => `${databaseKey}/api/v1/create_entity`,
    updateEntityMaster: (id: any) => `${databaseKey}/api/v1/update_entity/${id}`,
    getEntityById: (id: any) => `${databaseKey}/api/v1/getById_entity/${id}`,
    getAll_active_Entity: () => `${databaseKey}/api/v1/getAll_active_Entity`,
    getAllApprovalManagerData: () => `${databaseKey}/api/v1/getAllApprovalManager`,
    getAllEmployeesByDepartment: () => `${databaseKey}/api/v1/get-all-employees-by-department`,
    getAllEmployeeByVarEarning: () => `${databaseKey}/api/v1/getAllEmployeeByVarEarning`,
    getAllVarEarning: () => `${databaseKey}/api/v1/getVarEarningData`,
    entityList: () => `${databaseKey}/api/v1/getAll_Entity`,
    newEntityList: () => `${databaseKey}/api/v1/new_getAll_entity`,
    get_entity_list: (req: any) => `${databaseKey}/api/v1/get_entity_list?role_master_id=${req?.role_master_id}&employee_id=${req?.employee_id}`,
    deleteEntity: (id: any) => `${databaseKey}/api/v1/delete_entity/${id}`,
    updateEntityStatus: (id: any) => `${databaseKey}/api/v1/status_entity/${id}`
  }

}


@Injectable({
  providedIn: 'root'
})
export class EntityMasterService {

  constructor(private http: HttpClient) { }


  createEntity(data: any) {
    return this.http.post(
      routes.entityMaster.createEntityMaster(),
      data
    );
  }

  updateEntity(data: any, id: any) {
    return this.http.put(
      routes.entityMaster.updateEntityMaster(id),
      data
    );
  }

  getEntity(id: any) {
    return this.http.get(
      routes.entityMaster.getEntityById(id),
    );
  }

  getEntityList() {
    return this.http.get(
      routes.entityMaster.entityList(),
    );
  }

  newEntityList() {
    return this.http.get(
      routes.entityMaster.newEntityList(),
    );
  }

  get_entity_list(req: any) {
    return this.http.get(
      routes.entityMaster.get_entity_list(req),
    );
  }

  getAll_active_Entity() {
    return this.http.get(
      routes.entityMaster.getAll_active_Entity(),
    );
  }
  getAllApprovalManager() {
    return this.http.get(
      routes.entityMaster.getAllApprovalManagerData(),
    );
  }
  getAllEmployeesByDepartment(deptIds: number[]) {
  const params = new HttpParams().set('department_ids', deptIds.join(','));
  return this.http.get(
    routes.entityMaster.getAllEmployeesByDepartment(),
    { params }
  );
}
 getAllEmployeeByVarEarning(payload: { deptIds: number[] }) {
  return this.http.post(
    routes.entityMaster.getAllEmployeeByVarEarning(),
    payload
  );
}
getAllVarEarning(payload: { employee_ids: number[] }) {
  return this.http.post(
    routes.entityMaster.getAllVarEarning(),
    payload
  );
}





  deleteEntity(id: any) {
    return this.http.delete(
      routes.entityMaster.deleteEntity(id)
    )
  }

  updateEntityStatus(id: any, body: any) {
    return this.http.post(
      routes.entityMaster.updateEntityStatus(id),
      body
    );
  }

  getAllcountry() {
    return this.http.get<any>(`${databaseKey}/api/v1/getAllcountry`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  get_all_company_list() {
    return this.http.get<any>(`${databaseKey}/api/v1/get_all_company_list`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // addCompanyData(data:any): Observable<any> {
  //   return this.httpclient.post<any>(routes.CompanyMaster.AddCompany(),data);
  // }
  // getAllCompanyData(): Observable<any> {
  //   return this.httpclient.get<any>(routes.CompanyMaster.getAllCompany());
  // }
  // deleteCompanyData(id:any): Observable<any> {
  //   return this.httpclient.delete<any>(routes.CompanyMaster.deletecompanyData(id));
  // }
  // getByIDCompany(id:any): Observable<any> {
  //   return this.httpclient.get<any>(routes.CompanyMaster.getByIdCompany(id));
  // }
  // updateByIdCompany(id:any,data:any): Observable<any> {
  //   return this.httpclient.put<any>(routes.CompanyMaster.updateById(id),data);
  // }
}
