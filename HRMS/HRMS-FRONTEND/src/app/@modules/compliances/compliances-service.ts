import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Observable, Subject, map } from 'rxjs';
const databaseKey: any = environment.serverUrl;

const routes = {
  compliances_health: {
    createHealthInspection: () => `${databaseKey}/api/v1/create_health_inspection`,
    getAllHealthInspection: (entity_id: any) => `${databaseKey}/api/v1/get_all_health_inspec?entity_id=${entity_id}`,
    getHealthInspectionById: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/get_all_health_inspec_by_id?entity_id=${entity_id}&id=${id}`,
    deleteHealthInspection: (id: any) =>
      `${databaseKey}/api/v1/delete_health_inspec_by_id?id=${id}`,
  },

  compliances_safety: {
    createSafetyInspection: () => `${databaseKey}/api/v1/create_safety_inspection`,
    getAllSafetyInspection: (entity_id: any) => `${databaseKey}/api/v1/get_all_safety_inspec?entity_id=${entity_id}`,
    getSafetyInspectionById: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/get_all_safety_inspec_by_id?entity_id=${entity_id}&id=${id}`,
    deleteSafetyInspection: (id: any) =>
      `${databaseKey}/api/v1/delete_safety_inspec_by_id?id=${id}`,
  },

  compliances_welfare: {
    createWelfareInspection: () => `${databaseKey}/api/v1/create_welfare_inspection`,
    getAllWelfareInspection: (entity_id: any) => `${databaseKey}/api/v1/get_all_welfare_inspec?entity_id=${entity_id}`,
    getWelfareInspectionById: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/get_all_welfare_inspec_by_id?entity_id=${entity_id}&id=${id}`,
    deleteWelfareInspection: (id: any) =>
      `${databaseKey}/api/v1/delete_welfare_inspec_by_id?id=${id}`,
  },


}

@Injectable({
  providedIn: 'root'
})
export class CompliancesService {
  databaseKey: any;
  constructor(private httpclient: HttpClient) { }
  // For Helath
  createHealthInspection(data: any) {
    return this.httpclient.post(
      routes.compliances_health.createHealthInspection(),
      data
    );
  }

  getAllHealthInspection(entity_id: any) {
    return this.httpclient.get(routes.compliances_health.getAllHealthInspection(entity_id));
  }

  getHealthInspectionById(id: any, entity_id: any) {
    return this.httpclient.get(routes.compliances_health.getHealthInspectionById(id, entity_id));
  }

  deleteHealthInspection(id: any): Observable<any> {
    return this.httpclient.delete(routes.compliances_health.deleteHealthInspection(id));
  }
  // For Safety
  createSafetyInspection(data: any) {
    return this.httpclient.post(
      routes.compliances_safety.createSafetyInspection(),
      data
    );
  }

  getAllSafetyInspection(entity_id: any) {
    return this.httpclient.get(routes.compliances_safety.getAllSafetyInspection(entity_id));
  }

  getSafetyInspectionById(id: any, entity_id: any) {
    return this.httpclient.get(routes.compliances_safety.getSafetyInspectionById(id, entity_id));
  }

  deleteSafetyInspection(id: any): Observable<any> {
    return this.httpclient.delete(routes.compliances_safety.deleteSafetyInspection(id));
  }

  // For Welfare
  createWelfareInspection(data: any) {
    return this.httpclient.post(
      routes.compliances_welfare.createWelfareInspection(),
      data
    );
  }

  getAllWelfareInspection(entity_id: any) {
    return this.httpclient.get(routes.compliances_welfare.getAllWelfareInspection(entity_id));
  }

  getWelfareInspectionById(id: any, entity_id: any) {
    return this.httpclient.get(routes.compliances_welfare.getWelfareInspectionById(id, entity_id));
  }

  deleteWelfareInspection(id: any): Observable<any> {
    return this.httpclient.delete(routes.compliances_welfare.deleteWelfareInspection(id));
  }
}
