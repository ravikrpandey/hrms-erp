import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Observable, Subject, map } from 'rxjs';
const databaseKey: any = environment.serverUrl;
const routes = {
  payroll_filemanagement: {
    createFineManagement: () => `${databaseKey}/api/v1/create_fine_management`,
    getAllFineManagement: (entity_id: any) => `${databaseKey}/api/v1/get_all_fine_management?entity_id=${entity_id}`,
    getFineManagementById: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/get_all_fine_management_by_id?entity_id=${entity_id}&id=${id}`,
    deleteFineManagement: (id: any) =>
      `${databaseKey}/api/v1/delete_fine_management_by_id?id=${id}`,
  },

}


@Injectable({
  providedIn: 'root'
})
export class FineManagementService {
  databaseKey: any;
  constructor(private httpclient: HttpClient) { }

  createFineManagement(data: any) {
    return this.httpclient.post(
      routes.payroll_filemanagement.createFineManagement(),
      data
    );
  }

  getAllFineManagement(entity_id: any) {
    return this.httpclient.get(routes.payroll_filemanagement.getAllFineManagement(entity_id));
  }

  getFineManagementById(id: any, entity_id: any) {
    return this.httpclient.get(routes.payroll_filemanagement.getFineManagementById(id,entity_id));
  }

  deleteFineManagement(id: any): Observable<any> {
    return this.httpclient.delete(routes.payroll_filemanagement.deleteFineManagement(id));
  }
}