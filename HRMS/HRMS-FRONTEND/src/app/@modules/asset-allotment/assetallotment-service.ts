import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {
  //Asset Allotment
  assetAllotment: {
    assetAllotmentCreate: () => `${databaseKey}/api/v1/assetAllotmentCreate`,
    getAllAssetAllotmentList: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllAssetAllotmentList?entity_id=${entity_id}`,
    getAllssetAllotmentListActiveStatus: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllssetAllotmentListActiveStatus?entity_id=${entity_id}`,
    assetAllotmentUpdate: (id: any) => `${databaseKey}/api/v1/assetAllotmentUpdate/${id}`,
    updateAssetAllotmentStatus: (id: any) =>
      `${databaseKey}/api/v1/updateAssetAllotmentStatus/${id}`,
    getassetAllotmentById: (id: any) => `${databaseKey}/api/v1/getassetAllotmentById/${id}`,
    getAllAvailableAssetMaster: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllAvailableAssetMaster?entity_id=${entity_id}`,
  },
}

@Injectable({
  providedIn: 'root'
})
export class AssetallotmentService {

  constructor(private http: HttpClient) { }

  //Asset Subcategory Master
  assetAllotmentCreate(data: any): Observable<any> {
    return this.http.post(routes.assetAllotment.assetAllotmentCreate(), data);
  }
  getAllAssetAllotmentList(entity_id: any): Observable<any> {
    return this.http.get(routes.assetAllotment.getAllAssetAllotmentList(entity_id));
  }
  getAllssetAllotmentListActiveStatus(entity_id: any): Observable<any> {
    return this.http.get(routes.assetAllotment.getAllssetAllotmentListActiveStatus(entity_id));
  }
  assetAllotmentUpdate(id: any, data: any): Observable<any> {
    return this.http.put(routes.assetAllotment.assetAllotmentUpdate(id), data);
  }
  updateAssetAllotmentStatus(id: any, data: any): Observable<any> {
    return this.http.put(routes.assetAllotment.updateAssetAllotmentStatus(id), data);
  }
  getassetAllotmentById(id: any): Observable<any> {
    return this.http.get(routes.assetAllotment.getassetAllotmentById(id));
  }
  getAllAvailableAssetMaster(entity_id: any): Observable<any> {
    return this.http.get(routes.assetAllotment.getAllAvailableAssetMaster(entity_id));
  }
}
