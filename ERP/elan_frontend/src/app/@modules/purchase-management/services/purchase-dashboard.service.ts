import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;
const routes = {
  dashboard: {
    getAllPurchaseCount: (entityId: any, id: any) => `${databaseKey}/api/v1/getPurchaseDataCount/${entityId}/${id}`,
    getSpendByPRcategory: (id: any) => `${databaseKey}/api/v1/getSpendByPRcategory/${id}`,
    getSpendTrends: (id: any) => `${databaseKey}/api/v1/getSpendTrends/${id}`,
    getTotalSpendByVendors: (id: any) => `${databaseKey}/api/v1/getTotalSpendByVendors/${id}`,
    getTotalSpendByDepartment: (id: any) => `${databaseKey}/api/v1/getTotalSpendByDepartment/${id}`,
    getTotalSpendOnCategory: (id: any) => `${databaseKey}/api/v1/getTotalSpendOnCategory/${id}`,
    getSpendForecastTrends: (id: any) => `${databaseKey}/api/v1/getSpendForecastTrends/${id}`,
    getTotalSpend: (id: any) => `${databaseKey}/api/v1/getTotalSpend/${id}`,
    getQuantityLedger: (entityId: any) => `${databaseKey}/api/v1/getQuantityLedger?entity_id=${entityId}`
  },
}
@Injectable({
  providedIn: 'root'
})
export class PurchaseDashboardService {

  constructor(private http: HttpClient) { }

  getAllPurchaseCount(id: any, entityId: any, data: any) {
    return this.http.post(routes.dashboard.getAllPurchaseCount(entityId, id), data)
  }

  getSpendByPRcategory(id: any, data: any) {
    return this.http.post(routes.dashboard.getSpendByPRcategory(id), data)
  }

  getSpendTrends(id: any) {
    return this.http.get(routes.dashboard.getSpendTrends(id))
  }

  getTotalSpendByVendors(id: any, data: any) {
    return this.http.post(routes.dashboard.getTotalSpendByVendors(id), data)
  }

  getTotalSpendByDepartment(id: any, data: any) {
    return this.http.post(routes.dashboard.getTotalSpendByDepartment(id), data)
  }

  getTotalSpendOnCategory(id: any, data: any) {
    return this.http.post(routes.dashboard.getTotalSpendOnCategory(id), data)
  }

  getSpendForecastTrends(id: any) {
    return this.http.get(routes.dashboard.getSpendForecastTrends(id))
  }

  getTotalSpend(id: any, data: any) {
    return this.http.post(routes.dashboard.getTotalSpend(id), data)
  }

  getQuantityLedger(entityId: any) {
    return this.http.get(routes.dashboard.getQuantityLedger(entityId));
  }
}
