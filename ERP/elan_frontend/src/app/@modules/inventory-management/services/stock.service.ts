import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
const databaseKey: any = environment.servralUrl

const routes = {
  production: {
    getAllStockData: () => `${databaseKey}/api/v1/getNewRepeat`,
    getStockLabel: () => `${databaseKey}/api/v1/getLabelByProductId`,
    getStockWarehouse: () => `${databaseKey}/api/v1/getStockWarehouse`,
    getStockBlocks: () => `${databaseKey}/api/v1/getStockBlocks`,
    getStockBays: () => `${databaseKey}/api/v1/getStockBays`,
    getStockRacks: () => `${databaseKey}/api/v1/getStockRacks`,
    savestock: () => `${databaseKey}/api/v1/addStockLocation`,
    stockRequestApproved: () => `${databaseKey}/api/v1/stockRequestApproved`,
    addRequestedStock: () => `${databaseKey}/api/v1/addRequestedStock`,
    getFullBayBlock: (payload: any) => `${databaseKey}/api/v1/getStockBlock?warehouse_id=${payload.warehouse_id}&product_id=${payload.product_id}&quantity=${payload.quantity}`,
  }
}
@Injectable({
  providedIn: 'root'
})
export class StockService {
  // databaseKey;
  constructor(private http: HttpClient) {
    // this.databaseKey = environment.servralUrl;
  }

  // getAllStockList() {
  //   return this.http.get<any>(`${this.databaseKey}/api/v1/getAllRepeat`).pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }

  getAllStockList(data: any) {
    return this.http.get(routes.production.getAllStockData(), data)
  }

  getStockLabel(payload: any) {
    return this.http.post(routes.production.getStockLabel(), payload)
  }

  getStockWarehouse(payload: any) {
    return this.http.post(routes.production.getStockWarehouse(), payload)
  }

  getStockBlocks(payload: any) {
    return this.http.post(routes.production.getStockBlocks(), payload)
  }

  getStockBays(payload: any) {
    return this.http.post(routes.production.getStockBays(), payload)
  }

  getStockRacks(payload: any) {
    return this.http.post(routes.production.getStockRacks(), payload)
  }

  savestock(data: any) {
    return this.http.post(routes.production.savestock(), data)
  }
  stockRequestApproved(data: any) {
    return this.http.post(routes.production.stockRequestApproved(), data)
  }
  addRequestedStock(data: any) {
    return this.http.post(routes.production.addRequestedStock(), data)
  }
  getFullStockBayBlock(payload: any) {
    return this.http.get(routes.production.getFullBayBlock(payload));
  }

}

