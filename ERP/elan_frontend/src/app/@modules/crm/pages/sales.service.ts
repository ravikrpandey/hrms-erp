import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

const routes = {
  customer: {
    list: () => `${databaseKey}/api/v1/getAllCustomerList`,
    getCustomerContactById: (id: any) =>
      `${databaseKey}/api/v1/getCustomerContactById/${id}`,
    dealerByCustomer: (id: any) =>
      `${databaseKey}/api/v1/dealerByCustomer/${id}`,
  },
  existingClient: {
    getClientList: (client_id: any) =>
      `${databaseKey}/api/v1/getAllClientNames/${client_id}`,
  },
  salesOrderList: {
    salesOderList: (id: any) =>
      `${databaseKey}/api/v1/salesOrderById?proposal_id=${id}`,
    getSalesOrderListById: (id: any) =>
      `${databaseKey}/api/v1/salesOrderByProposalId?so_id=${id}`,
    createAddDo: () => `${databaseKey}/api/v1/createAddDo`,
    getAllDOHistory: (proposal_id: any) =>
      `${databaseKey}/api/v1/salesOrderHistory?proposal_id=${proposal_id}`,
      generateSalesBookingNo:(finance_id:number)=>`${databaseKey}/api/v1/generateSalesBookingNo/${finance_id}`,

  },
  dashboard: {
    getcard_details: (id: any) => `${databaseKey}/api/v1/getcard_details/${id}`,
    getLeadSourceAnalysis: (id: any) =>
      `${databaseKey}/api/v1/getLeadSourceAnalysis/${id}`,
    getDetailsForDashboard: (id: any) =>
      `${databaseKey}/api/v1/getDetailsForDashboard/${id}`,
    getConversionRate: (id: any) =>
      `${databaseKey}/api/v1/getConversionRate/${id}`,
  },
};

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  constructor(private http: HttpClient) {}

  dealerByCustomer(customerId:any) {
    return this.http.get(routes.customer.dealerByCustomer(customerId));
  }
  getCustomerList() {
    return this.http.get(routes.customer.list());
  }
  existingClient(client_id: any, data: any) {
    return this.http.post(routes.existingClient.getClientList(client_id), data);
  }
  salesOderByid(id: any) {
    return this.http.get(routes.salesOrderList.salesOderList(id));
  }
  createAddDoData(data: any) {
    return this.http.post(routes.salesOrderList.createAddDo(), data);
  }
  getSalesByProsalId(id: any) {
    return this.http.get(routes.salesOrderList.getSalesOrderListById(id));
  }
  getDOHistoryData(id: any) {
    return this.http.get(routes.salesOrderList.getAllDOHistory(id));
  }
  getCardDetails(id: any) {
    return this.http.get(routes.dashboard.getcard_details(id));
  }
  getLeadSourceAnalysis(id: any) {
    return this.http.get(routes.dashboard.getLeadSourceAnalysis(id));
  }
  getDetailsForDashboard(id: any) {
    return this.http.get(routes.dashboard.getDetailsForDashboard(id));
  }
  getConversionRate(id: any) {
    return this.http.get(routes.dashboard.getConversionRate(id));
  }
  getCustomerContactById(id: any) {
    return this.http.get(routes.customer.getCustomerContactById(id));
  }

  generateSalesBookingNo(finance_id:number) {
    return this.http.get(routes.salesOrderList.generateSalesBookingNo(finance_id));
  }
}
