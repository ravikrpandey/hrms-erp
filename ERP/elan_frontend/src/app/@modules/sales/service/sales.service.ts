import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { da } from 'date-fns/locale';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

const routes = {
  existingClient: {
    getClientList: () => `${databaseKey}/api/v1/getAllClientNames`,
  },
  salesOrderList: {
    salesOderList: (id: any) =>
      `${databaseKey}/api/v1/salesOrderById?proposal_id=${id}`,
    getSalesOrderListById: (id: any, do_id: any) =>
      `${databaseKey}/api/v1/salesOrderByProposalId?so_id=${id}&do_id=${do_id}`,
    createAddDo: () => `${databaseKey}/api/v1/createAddDo`,
    createSalesInvoice: () => `${databaseKey}/api/v1/createSalesInvoice`,
    getAllDOHistory: (proposal_id: any) =>
      `${databaseKey}/api/v1/salesOrderHistory?proposal_id=${proposal_id}`,
    generateDeliveryOrderNumber: (financial_year_id: any) =>
      `${databaseKey}/api/v1/generate_delivery_order_number?financial_year_id=${financial_year_id}`,
    getSalesInvoiceData: (do_id: any, proposal_id: any) =>
      `${databaseKey}/api/v1/getSalesInvoiceData/${do_id}/${proposal_id}`,
    getAllPendingSalesInvoiceData: (status:any) =>
      `${databaseKey}/api/v1/getAllPendingSalesInvoiceData/${status}`,
    getAllApprovedSalesInvoiceData: () =>
      `${databaseKey}/api/v1/getAllApprovedSalesInvoiceData`,
    getAllEwayData: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/getAllEwayData/${entity_id}/${financial_year_id}`,
    getAllDeliveryChallan: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/getAllDeliveryChallan/${entity_id}/${financial_year_id}`,
    getAllSalesOrder: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/getAllSalesOrder/${entity_id}/${financial_year_id}`,
    getInvoiceIrnDataByDoId: (do_id: any) =>
      `${databaseKey}/api/v1/getInvoiceIrnDataByDoId/${do_id}`,
    getAllEwayDataById: (entity_id: any, financial_year_id: any, invoice_id: any, eway_id: any) =>
      `${databaseKey}/api/v1/getAllEwayDataById/${entity_id}/${financial_year_id}/${invoice_id}/${eway_id}`,
    getEwayListDetails: (entity_id: any, financial_year_id: any, eway_id: any) =>
      `${databaseKey}/api/v1/getEwayListDataById/${entity_id}/${financial_year_id}/${eway_id}`,
    getInvoiceIrnDataByInvoiceId: (invoice_id: any) =>
      `${databaseKey}/api/v1/getInvoiceIrnDataByInvoiceId/${invoice_id}`,
    createDirectInvoice: () =>
      `${databaseKey}/api/v1/invoice/create-direct-invoice`,
  },
  dashboard: {
    salesDashboard: (id: any) => `${databaseKey}/api/v1/salesDashboard/${id}`,
    getRevenueTrends: (entity_id: any, financial_id: any) =>
      `${databaseKey}/api/v1/getRevenueTrends/${entity_id}/${financial_id}`,
    getTotalSalesEmployeeWise: (id: any) =>
      `${databaseKey}/api/v1/getTotalSalesEmployeeWise/${id}`,
    getTotalSalesProductWise: (id: any) =>
      `${databaseKey}/api/v1/getTotalSalesProductWise/${id}`,
    getSalesTrends: (id: any) => `${databaseKey}/api/v1/getSalesTrends/${id}`,
    getSalesForecasting: (id: any) =>
      `${databaseKey}/api/v1/getSalesForecasting/${id}`,
  },
  billing: {
    createBillingAddress: () => `${databaseKey}/api/v1/createCustomerbilling`,
    getBillingById: (id: any) => `${databaseKey}/api/v1/getAllCustomerBiling/${id}`,
    updateBilling: (id: any) => `${databaseKey}/api/v1/updateCustomerBilling/${id}`,
  },
  customerDelivery: {
    createCustomerDelivery: () => `${databaseKey}/api/v1/createCustomerDelivery`,
    getCustomerDeliveryById: (id: any) => `${databaseKey}/api/v1/getAllCustomerdelivery/${id}`,
    updateCustomerDelivery: (id: any) => `${databaseKey}/api/v1/updateCustomerdelivery/${id}`,
  },
  bank: {
    createBankDetails: () => `${databaseKey}/api/v1/createCustomerBank`,
    updateBankDetails: (id: any) => `${databaseKey}/api/v1/updateCustomerBank/${id}`,
    getBankDetailsById: (id: any) => `${databaseKey}/api/v1/getAllCustomerBank/${id}`,
  },
  customer: {
    list: () => `${databaseKey}/api/v1/getAllCustomerList`,
    getAllCustomersList: (req: any) =>
      `${databaseKey}/api/v1/getAllCustomersList/?entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}&employee_id=${req?.employee_id}&userRole=${req?.userRole}&status=${req?.status}`,
    getsCustomerByDealer: (dealer_id: any) =>
      `${databaseKey}/api/v1/getsCustomerByDealer/${dealer_id}`,
    getAllCustomersWithContactList: (req: any) =>
      `${databaseKey}/api/v1/getAllCustomersWithContactList/?entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}&employee_id=${req?.employee_id}&userRole=${req?.userRole}`,
    getAllActiveIndustryType: () =>
      `${databaseKey}/api/v1/getAllActiveIndustryType`,
    createCustomerProfile: () => `${databaseKey}/api/v1/createCustomerProfile`,
    updateCustomerProfile: (id: any) => `${databaseKey}/api/v1/updateCustomerProfile/${id}`,
    contactInformation: () => `${databaseKey}/api/v1/createCustomerContact`,
    createCustomerAddressInfo: () =>
      `${databaseKey}/api/v1/createCustomerAddressInfo`,
    createCustomerBusinessDetails: () =>
      `${databaseKey}/api/v1/createCustomerBusinessDetails`,
    addCustomerDocument: () =>
      `${databaseKey}/api/v1/add_customer_document`,
    deleteCustomerById: (id: any) =>
      `${databaseKey}/api/v1/deleteAllCustomerData/${id}`,
    registerForGSTPortal: (id: any) =>
      `${databaseKey}/api/v1/registerForGSTPortal?id=${id}`, 
    registerForGSTPortalEntity: (id: any) =>
      `${databaseKey}/api/v1/registerForGSTPortalEntity?id=${id}`,
    verifyOtpForGSTPortal: () =>
      `${databaseKey}/api/v1/verifyOtpForGSTPortal`, 
    verifyOtpForGSTPortalEntity: () =>
      `${databaseKey}/api/v1/verifyOtpForGSTPortalEntity`,
    createChallan: (entity: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/create_delivery_challan/${entity}/${financial_year_id}`,
    getInustryType: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/getAllActiveCustomerIndustry?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    addProductAmount: () => `${databaseKey}/api/v1/add_product_price`,
    getByProductAmount: (id: any) => `${databaseKey}/api/v1/getAll_product_price/${id}`,
    parentCompanyList: (entity_id: any) => `${databaseKey}/api/v1/getAllParentIsGroupYes?entity_id=${entity_id}`,
    CustomerTreeView: (entity_id: any) => `${databaseKey}/api/v1/getCompanyTreeViewList?entity_id=${entity_id}`,
    getAllCustomerItemList: (id: any) => `${databaseKey}/api/v1/getAllCustomerItemList/${id}`,
    customerItemName: (id: any) => `${databaseKey}/api/v1/customerItemName/${id}`,
    customerWiseSB: (page: number, limit: number, customer_id:any) => `${databaseKey}/api/v1/customer-wise-sales-booking?page=${page}&limit=${limit}&customer_id=${customer_id}`
  },
  getCustomer: {
    getCustomerProfileById: (id: any) =>
      `${databaseKey}/api/v1/getCustomerProfileById/${id}`,
    getCustomerAddressInfoById: (id: any) =>
      `${databaseKey}/api/v1/getCustomerAddressInfoById/${id}`,
    getCustomerBusinessById: (id: any) =>
      `${databaseKey}/api/v1/getCustomerBusinessDetailsById/${id}`,
    getCustomerDocumentsById: (id: any) =>
      `${databaseKey}/api/v1/getAllCustomerdoc/${id}`,
     deleteCustomerDoc: (id: any) =>`${databaseKey}/api/v1/customer/doc/${id}`,
     getsShippingAddress: () =>`${databaseKey}/api/v1/getsShippingAddress`,

  },

  salesOrder: {
    createSalesOrder: () => `${databaseKey}/api/v1/createSalesOrder`,
    generateSalesOrderNO: (finance_id: number) => `${databaseKey}/api/v1/generateSalesOrderNO/${finance_id}`,
    getSOByProposal: (proposal_id: number, version_id: any) => `${databaseKey}/api/v1/getSOByProposal/${proposal_id}/${version_id}`,
    getSOHistory: (proposal_id: number) => `${databaseKey}/api/v1/getSOHistory/${proposal_id}`,
    getAllSOList: (logind_id: number, role_master_id: any, status: any) => `${databaseKey}/api/v1/getAllSOList?login_id=${logind_id}&role_master_id=${role_master_id}&status=${status}`,
    getAllPartiallyList: (logind_id: number, role_master_id: any) => `${databaseKey}/api/v1/getAllPartiallyList?login_id=${logind_id}&role_master_id=${role_master_id}`,
    getSOByid: (id: number) => `${databaseKey}/api/v1/getSOByid/${id}`,
    getAll_salesReason: () => `${databaseKey}/api/v1/getAll_salesReason`,
    salesSoProgressStatus: () => `${databaseKey}/api/v1/salesSoProgressStatus`,
    proposalVersionRejected: (pi: any) => `${databaseKey}/api/v1/proposalVersionRejected/${pi}`,
    reasonStatusList: (reasonId: any, tab: any) => `${databaseKey}/api/v1/reasonStatusList?reason_id=${reasonId}&tab=${tab}`,
    getDispatchedSO: (vpId: string) => `${databaseKey}/api/v1/getDispatchedSO?vpId=${vpId}`,
    getEntityDeatilsById: (entity_id: any) =>`${databaseKey}/api/v1/getEntityDeatilsById/${entity_id}`,
    getDispatchedSOByWareouseId: (vpId: string, warehouse_id: any) => `${databaseKey}/api/v1/getDispatchedSOByWareouseId?vpId=${vpId}&warehouse_id=${warehouse_id}`,
    getCustomerAging: (entity_id: any) => `${databaseKey}/api/v1/getCustomerAging?entity_id=${entity_id}`,
    getCustomerAgingByCustomerId: ( id: any) => `${databaseKey}/api/v1/getCustomerAgingByCustomerId/${id}`,
    getAllcollectionReportData: () => `${databaseKey}/api/v1/getAllcollectionReportData`,


  },
  defineCreditLimit: {
    createCreditLimit: () => `${databaseKey}/api/v1/customerCreditDebit`,
    getCreditLimitById: (id: any) => `${databaseKey}/api/v1/customerCreditDebit/${id}`,
    getCustomerInvoiceList: (id: any) => `${databaseKey}/api/v1/getCustomerInvoiceList/${id}`,
    getCustomerAdvanceHistory: (id: any) => `${databaseKey}/api/v1/getCustomerAdvanceHistory?customer_id=${id}`,
  },
  account_recievable:{
    accountRecievable: () => `${databaseKey}/api/v1/customerAccoutRecieableDetail`,
    advanceCustomerReciept: () => `${databaseKey}/api/v1/advanceCustomerReciept`,
    customerAccoutRecieableDetailById: (id:any) => `${databaseKey}/api/v1/customerAccoutRecieableDetailById?id=${id}`,
    advanceCustomerRecieptById: (id:any) => `${databaseKey}/api/v1/advanceCustomerRecieptById?id=${id}`,
    suspenseCustomerAccountById: (id:any) => `${databaseKey}/api/v1/suspenseCustomerAccountById?id=${id}`,
    suspenseCustomerAccountList: (entity_id:any) => `${databaseKey}/api/v1/suspenseCustomerAccountList?entity_id=${entity_id}`,
    suspenseCustomerAccount: () => `${databaseKey}/api/v1/suspenseCustomerAccount`,
  },
  generateIRN:{
    genrateIRN: () => `${databaseKey}/api/v1/genrateIRN`,

  }


};

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  constructor(private http: HttpClient) { }

  existingClient() {
    return this.http.get(routes.existingClient.getClientList());
  }
  salesOderByid(id: any) {
    return this.http.get(routes.salesOrderList.salesOderList(id));
  }
  createAddDoData(data: any) {
    return this.http.post(routes.salesOrderList.createAddDo(), data);
  }
  getSalesByProsalId(id: any, do_id: any) {
    return this.http.get(
      routes.salesOrderList.getSalesOrderListById(id, do_id)
    );
  }
  getDOHistoryData(id: any) {
    return this.http.get(routes.salesOrderList.getAllDOHistory(id));
  }
  salesDashboard(id: any, data: any) {
    return this.http.post(routes.dashboard.salesDashboard(id), data);
  }
  getRevenueTrends(entity_id: any, financial_id: any) {
    return this.http.get(
      routes.dashboard.getRevenueTrends(entity_id, financial_id)
    );
  }
  getTotalSalesEmployeeWise(id: any, data: any) {
    return this.http.post(routes.dashboard.getTotalSalesEmployeeWise(id), data);
  }
  getTotalSalesProductWise(id: any, data: any) {
    return this.http.post(routes.dashboard.getTotalSalesProductWise(id), data);
  }
  getSalesTrends(id: any) {
    return this.http.get(routes.dashboard.getSalesTrends(id));
  }
  getSalesForecasting(id: any, data: any) {
    return this.http.post(routes.dashboard.getSalesForecasting(id), data);
  }
  generateDeliveryOrderNumber(id: any) {
    return this.http.get(routes.salesOrderList.generateDeliveryOrderNumber(id));
  }
  createSalesInvoice(data: any) {
    return this.http.post(routes.salesOrderList.createSalesInvoice(), data);
  }
  getSalesInvoiceData(do_id: any, proposal_id: any) {
    return this.http.get(
      routes.salesOrderList.getSalesInvoiceData(do_id, proposal_id)
    );
  }
  getAllPendingSalesInvoiceData(status:any) {
    return this.http.get(routes.salesOrderList.getAllPendingSalesInvoiceData(status));
  }
  getInvoiceIrnDataByDoId(do_id: any) {
    return this.http.get(routes.salesOrderList.getInvoiceIrnDataByDoId(do_id));
  }
  getAllEwayDataById(entity_id: any, financial_year_id: any, invoice_id: any, eway_id: any) {
    return this.http.get(routes.salesOrderList.getAllEwayDataById(entity_id, financial_year_id, invoice_id, eway_id));
  }
  getAllApprovedSalesInvoiceData() {
    return this.http.get(
      routes.salesOrderList.getAllApprovedSalesInvoiceData()
    );
  }
  getAllEwayData(entity_id: any, financial_year_id: any) {
    return this.http.get(
      routes.salesOrderList.getAllEwayData(entity_id, financial_year_id)
    );
  }
  getAllDeliveryChallan(entity_id: any, financial_year_id: any) {
    return this.http.get(
      routes.salesOrderList.getAllDeliveryChallan(entity_id, financial_year_id)
    );
  }
  getAllSalesOrder(entity_id: any, financial_year_id: any) {
    return this.http.get(
      routes.salesOrderList.getAllSalesOrder(entity_id, financial_year_id)
    );
  }

  // create Billing Address
  createBillingAddress(data: any) {
    return this.http.post(routes.billing.createBillingAddress(), data);
  }

  getBillingById(id: any) {
    return this.http.get(routes.billing.getBillingById(id));
  }

  updateBilling(data: any, id: any) {

    return this.http.put(routes.billing.updateBilling(id), data);
  }

  //Bank Details
  createBankDetails(data: any) {
    return this.http.post(routes.bank.createBankDetails(), data);
  }

  getBankDetailsById(id: any) {
    return this.http.get(routes.bank.getBankDetailsById(id));
  }

  updateBankDetails(id: any, data: any) {
    return this.http.put(routes.bank.updateBankDetails(id), data);
  }

  //customer Delivery

  createCustomerDelivery(data: any) {
    return this.http.post(routes.customerDelivery.createCustomerDelivery(), data);
  }
  getCustomerDeliveryById(id: any) {
    return this.http.get(routes.customerDelivery.getCustomerDeliveryById(id));
  }
  updateCustomerDelivery(id: any, data: any) {
    return this.http.put(routes.customerDelivery.updateCustomerDelivery(id), data);
  }

  // customer details

  createCustomerProfile(data: any) {
    return this.http.post(routes.customer.createCustomerProfile(), data);
  }

  updateCustomerProfile(id: any, data: any) {
    return this.http.put(routes.customer.updateCustomerProfile(id), data);
  }

  contactInformation(data: any) {
    return this.http.post(routes.customer.contactInformation(), data);
  }
  createCustomerAddressInfo(data: any) {
    return this.http.post(routes.customer.createCustomerAddressInfo(), data);
  }

  createCustomerBusinessDetails(data: any) {
    return this.http.post(
      routes.customer.createCustomerBusinessDetails(),
      data
    );
  }

  getCustomerIndustryType(entity_id: any, financial_year_id: any) {
    return this.http.get(
      routes.customer.getInustryType(entity_id, financial_year_id)
    )
  }

  deleteCustomerById(id: any): Observable<any> {
    return this.http.delete(routes.customer.deleteCustomerById(id));
  }
  registerForGSTPortal(id: any): Observable<any> {
    return this.http.get(routes.customer.registerForGSTPortal(id));
  } 
  registerForGSTPortalEntity(id: any): Observable<any> {
    return this.http.get(routes.customer.registerForGSTPortalEntity(id));
  }
  verifyOtpForGSTPortal(data: any) {
    return this.http.post(routes.customer.verifyOtpForGSTPortal(),data);
  } 
  verifyOtpForGSTPortalEntity(data: any) {
    return this.http.post(routes.customer.verifyOtpForGSTPortalEntity(),data);
  }
  addCustomerDocument(data: any, id: any) {
    return this.http.post(routes.customer.addCustomerDocument(), data);
  }

  getAllActiveIndustryType() {
    return this.http.get(routes.customer.getAllActiveIndustryType());
  }
  getAllCustomersList(req: any) {
    return this.http.get(routes.customer.getAllCustomersList(req));
  }
  getsCustomerByDealer(dealer_id: any) {
    return this.http.get(routes.customer.getsCustomerByDealer(dealer_id));
  }
  getAllCustomersWithContactList(req: any) {
    return this.http.get(routes.customer.getAllCustomersWithContactList(req));
  }
  getCustomerList() {
    return this.http.get(routes.customer.list());
  }

  getparentCompanyList(entity_id: any) {
    return this.http.get(routes.customer.parentCompanyList(entity_id));
  }

  getCustomerTreeView(entity_id: any) {
    return this.http.get(routes.customer.CustomerTreeView(entity_id));
  }

  getCustomerAddressInfoById(id: any) {
    return this.http.get(routes.getCustomer.getCustomerAddressInfoById(id));
  }
  getCustomerProfileById(id: any, data: any) {
    return this.http.post(routes.getCustomer.getCustomerProfileById(id), data);
  }

  getCustomerBusinessById(id: any) {
    return this.http.get(routes.getCustomer.getCustomerBusinessById(id));
  }

  getCustomerDocumentsById(id: any) {
    return this.http.get(routes.getCustomer.getCustomerDocumentsById(id));
  }
  getsShippingAddress() {
    return this.http.get(routes.getCustomer.getsShippingAddress());
  }
  deleteCustomerDoc(id: any) {
    return this.http.delete(routes.getCustomer.deleteCustomerDoc(id));
  }


  createChallan(data: any, entity: any, finance_id: any) {
    return this.http.post(
      routes.customer.createChallan(entity, finance_id),
      data
    );
  }
  addProductAmount(data: any) {
    return this.http.post(routes.customer.addProductAmount(), data);
  }

  getByProductAmount(id: any) {
    return this.http.get(routes.customer.getByProductAmount(id))
  }

  ////direct eway
  getEwayListDetails(entity_id: any, financial_year_id: any, eway_id: any) {
    return this.http.get(routes.salesOrderList.getEwayListDetails(entity_id, financial_year_id, eway_id));
  }
  getInvoiceIrnDataByInvoiceId(invoice_id: any) {
    return this.http.get(routes.salesOrderList.getInvoiceIrnDataByInvoiceId(invoice_id));
  }


  ///////////direct sales invoice
  createDirectInvoice(data: any) {
    return this.http.post(
      routes.salesOrderList.createDirectInvoice(),
      data
    );
  }

  ///////////////////////////////////////////
  //////////////////////
  //////// create sales order
  ///////////////////////////////
  createSalesOrder(data: any) {
    return this.http.post(routes.salesOrder.createSalesOrder(),data);
  }
  generateSalesOrderNO(finance_id: number) {
    return this.http.get(routes.salesOrder.generateSalesOrderNO(finance_id));
  }
  getSOByProposal(proposal_id: number, version_id: any) {
    return this.http.get(routes.salesOrder.getSOByProposal(proposal_id, version_id));
  }
  getSOHistory(proposal_id: number) {
    return this.http.get(routes.salesOrder.getSOHistory(proposal_id));
  }
  getAllSOList(login_id: number, role_master_id: any, status: any) {
    return this.http.get(routes.salesOrder.getAllSOList(login_id, role_master_id, status));
  }
  reasonStatusList(reasonId: any, tab: any) {
    return this.http.get(routes.salesOrder.reasonStatusList(reasonId, tab));
  }
  getAll_salesReason() {
    return this.http.get(routes.salesOrder.getAll_salesReason());
  }
  salesSoProgressStatus(data: any) {
    return this.http.post(routes.salesOrder.salesSoProgressStatus(), data);
  }
  proposalVersionRejected(pi: any, data: any) {
    return this.http.patch(routes.salesOrder.proposalVersionRejected(pi), data);
  }
  getAllPartiallyList(login_id: number, role_master_id: any) {
    return this.http.get(routes.salesOrder.getAllPartiallyList(login_id, role_master_id));
  }
  getSOByid(id: number) {
    return this.http.get(routes.salesOrder.getSOByid(id));
  }
  defineCreditLimit(data: any) {
    return this.http.post(routes.defineCreditLimit.createCreditLimit(), data);
  }
  getCreditLimitById(id: any) {
    return this.http.get(routes.defineCreditLimit.getCreditLimitById(id))
  }

  getCustomerInvoiceList(id: any) {
    return this.http.get(routes.defineCreditLimit.getCustomerInvoiceList(id))
  }  
  getCustomerAdvanceHistory(id: any) {
    return this.http.get(routes.defineCreditLimit.getCustomerAdvanceHistory(id))
  } 

  approveCustomers(customers: any[], parentId: number) {
    return this.http.put(`${databaseKey}/api/v1/customers/approve`, { customers, parentId });
  }

  getAllCustomerItemList(id: any) {
    return this.http.get(routes.customer.getAllCustomerItemList(id))
  }
  customerItemName(id: any,data:any) {
    return this.http.patch(routes.customer.customerItemName(id),data)
  }
  customerWiseSB(page: number, limit: number,customer_id:any) {
    return this.http.get(routes.customer.customerWiseSB(page, limit,customer_id))
  }

  getDispatchedSO(vpId: string) {
    return this.http.get(routes.salesOrder.getDispatchedSO(vpId));
  }

  getDispatchedSOByWareouseId(vpId: string, warehouse_id: any) {
    return this.http.get(routes.salesOrder.getDispatchedSOByWareouseId(vpId,warehouse_id));
  }
  getEntityDeatilsById(entity_id: any) {
    return this.http.get(
      routes.salesOrder.getEntityDeatilsById(entity_id)
    );
  }
  accountRecievable(data: any) {
    return this.http.post(routes.account_recievable.accountRecievable(),data)
  } 
  advanceCustomerReciept(data: any) {
    return this.http.post(routes.account_recievable.advanceCustomerReciept(),data)
  }
  customerAccoutRecieableDetailById(id: any) {
    return this.http.get(routes.account_recievable.customerAccoutRecieableDetailById(id))
  } 
  advanceCustomerRecieptById(id: any) {
    return this.http.get(routes.account_recievable.advanceCustomerRecieptById(id))
  } 
  suspenseCustomerAccount(data: any) {
    return this.http.post(routes.account_recievable.suspenseCustomerAccount(),data)
  }
  suspenseCustomerAccountById(id: any) {
    return this.http.get(routes.account_recievable.suspenseCustomerAccountById(id))
  }  
  suspenseCustomerAccountList(entity_id: any) {
    return this.http.get(routes.account_recievable.suspenseCustomerAccountList(entity_id))
  } 
  
  getSalesOrderInvoice(so_id: any,finance_id:any) {
    return this.http.get<any>(`${databaseKey}/api/v1/getSODetailsByDocType?id=${so_id}&finance_id=${finance_id}`);
  }
  getSODetailsByDocType(so_id: any,type:any) {
    return this.http.get<any>(`${databaseKey}/api/v1/getSODetailsByDocType?id=${so_id}&type=${type}`);
  }
  createSalesReturn(data: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/createSalesReturn`,data);
  }
  getsSalesReturn(financial_id:any,entity_id:any) {
    return this.http.get<any>(`${databaseKey}/api/v1/getsSalesReturn?financial_id=${financial_id}&entity_id=${entity_id}`);
  }
  getSalesReturn(id:any) {
    return this.http.get<any>(`${databaseKey}/api/v1/getSalesReturn?id=${id}`);
  }
  downloadSalesInvoice(id:number) {
    return this.http.get(`${databaseKey}/api/v1/downloadInvoice/${id}`, {
      responseType: 'blob'
    });
  }
  downloadSalesOrder(id:number) {
    return this.http.get(`${databaseKey}/api/v1/downloadSalesOrder/${id}`, {
      responseType: 'blob'
    });
  }
  getAllSalesInvoiceData(financial_id:any,entity_id:any) {
    return this.http.get<any>(`${databaseKey}/api/v1/getAllSalesInvoiceData?financial_id=${financial_id}&entity_id=${entity_id}`);
  }

  getCustomerAging(entity_id: any) {
    return this.http.get(routes.salesOrder.getCustomerAging(entity_id))
  }
  getCustomerAgingByCustomerId(id: any) {
    return this.http.get(routes.salesOrder.getCustomerAgingByCustomerId(id))
  }

  getAllcollectionReportData() {
    return this.http.get(routes.salesOrder.getAllcollectionReportData())
  }
  genrateIRN(data: any) {
    return this.http.post(routes.generateIRN.genrateIRN(),data);
  }
}
