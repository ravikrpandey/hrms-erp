import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;



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
    entityList: () => `${databaseKey}/api/v1/getAll_Entity`,
    getAll_active_Entity: () => `${databaseKey}/api/v1/getAll_active_Entity`,
    // get_entity_list: (req: any) => `${databaseKey}/api/v1/get_entity_list?role_master_id=${req?.role_master_id}&employee_id=${req?.employee_id}`,
    get_entity_list: (req: any) => 
  `${databaseKey}/api/v1/get_entity_list?role_master_id=${req?.role_master_id}&employee_id=${req?.employee_id || ''}`,

    deleteEntity: (id: any) => `${databaseKey}/api/v1/delete_entity/${id}`,
    updateEntityStatus: (id: any) => `${databaseKey}/api/v1/status_entity/${id}`,
    getAllIsgroupData: (is_group: any) => `${databaseKey}/api/v1/getEntityDataByGroupName?is_group=${is_group}`,
    getEntityDataHierarchyView: () => `${databaseKey}/api/v1/getEntityDataHierarchyView`
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

  getAll_active_Entity() {
    return this.http.get(
      routes.entityMaster.getAll_active_Entity(),
    );
  }

  get_entity_list(req: any) {
    return this.http.get(
      routes.entityMaster.get_entity_list(req),
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
  getAllIsgroupData(is_group: any) {
    return this.http.get(
      routes.entityMaster.getAllIsgroupData(is_group),
    );
  }
  getEntityDataHierarchyView() {
    return this.http.get(
      routes.entityMaster.getEntityDataHierarchyView(),
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
