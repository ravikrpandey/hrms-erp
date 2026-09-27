import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DispatchedService {
  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }
  userName = new BehaviorSubject('');
  getDispatchedSaleOrderList(id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/salesOrderList/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  dispatchedOrderList(id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/dispatchedOrderList/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getSaleByOrderId(id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getSaleByOrderId/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getDispachedOrderDetails(id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getDispachedOrderDetails/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getWarehouseByProductQuantity(data: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/getWarehouseListByProductQuantity?product_id=${data}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  createDispatch(data: any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/createDispatch`, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getSOForDispatch(status: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getSOForDispatch/${status}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getSOForDispatchAcknowledge() {
    return this.http.get<any>(
      `${this.databaseKey}/api/v1/getSOForDispatchAcknowledge`
    );
  }
}
