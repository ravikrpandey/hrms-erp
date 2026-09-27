import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey = environment.servralUrl;

@Injectable({
  providedIn: 'root'
})
export class PurchaseReturnService {

  constructor(private http: HttpClient) { }

  createReturn(data: any): Observable<any> {
    return this.http.post(`${databaseKey}/api/v1/purchase-return`, data);
  }

  getReturnsList(params: any = {}): Observable<any> {
    return this.http.get(`${databaseKey}/api/v1/purchase-return`, { params });
  }

  getVendorReturnsList(params: any = {}): Observable<any> {
    return this.http.get(`${databaseKey}/api/v1/purchase-return-vendor`, { params });
  }

  getVendorsWithGrns(): Observable<any> {
    return this.http.get(`${databaseKey}/api/v1/purchase-return/vendors`);
  }

  getStatusList(): Observable<any> {
    return this.http.get(`${databaseKey}/api/v1/purchase-return/status-list`);
  }

  getGrnsByVendor(vendorId: any): Observable<any> {
    return this.http.get(`${databaseKey}/api/v1/purchase-return/vendor/${vendorId}/grns`);
  }

  getGrnItemsForReturn(grnId: any): Observable<any> {
    return this.http.get(`${databaseKey}/api/v1/purchase-return/grn/${grnId}/items`);
  }

  getReturnById(id: any): Observable<any> {
    return this.http.get(`${databaseKey}/api/v1/purchase-return/${id}`);
  }

  updateReturn(id: any, data: any): Observable<any> {
    return this.http.put(`${databaseKey}/api/v1/purchase-return/${id}`, data);
  }

  deleteReturn(id: any): Observable<any> {
    return this.http.delete(`${databaseKey}/api/v1/purchase-return/${id}`);
  }

  submitReturn(id: any, data: any): Observable<any> {
    return this.http.post(`${databaseKey}/api/v1/purchase-return/${id}/submit`, data);
  }

  approveReturn(id: any, data: any): Observable<any> {
    return this.http.post(`${databaseKey}/api/v1/purchase-return/${id}/approve`, data);
  }

  completeReturn(id: any, data: any): Observable<any> {
    return this.http.post(`${databaseKey}/api/v1/purchase-return/${id}/complete`, data);
  }

  rejectReturn(id: any, data: any): Observable<any> {
    return this.http.post(`${databaseKey}/api/v1/purchase-return/${id}/reject`, data);
  }

  cancelReturn(id: any, data: any): Observable<any> {
    return this.http.post(`${databaseKey}/api/v1/purchase-return/${id}/cancel`, data);
  }
}
