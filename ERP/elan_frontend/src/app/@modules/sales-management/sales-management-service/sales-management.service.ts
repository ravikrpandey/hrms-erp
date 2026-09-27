import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpClient } from '@angular/common/http';

const databaseKey: any = environment.servralUrl;

const routes = {
  superUser: {
    createSuperUserData: () => `${databaseKey}/api/v1/createSuperUser`,
    getAllActiveSuperUser: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllActiveSuperUser/${entity_id}`,
    getAllSuperUsers: (entity_id: any, fiancial_year: any) =>
      `${databaseKey}/api/v1/getAllSuperUsers/${entity_id}/${fiancial_year}`,
    deleteSuperUser: (id: any) => `${databaseKey}/api/v1/deleteSuperUser/${id}`,
    getAllRecordsByid: (id: any) =>
      `${databaseKey}/api/v1/getSuperUserById/${id}`,
    updateUserById: (id: any) => `${databaseKey}/api/v1/updateSuperUser/${id}`,
    updateSuperUserStatus: (id: any) =>
      `${databaseKey}/api/v1/updateSuperUserStatus/${id}`,
  },
  quotations: {
    createQuotationData: () => `${databaseKey}/api/v1/createQuotation`,
    deleteQuotationData: (id: any) =>
      `${databaseKey}/api/v1/delete_quotation/${id}`,
    getQuotationByIdData: (id: any, entity_id: any) =>
      `${databaseKey}/api/v1/getQuotationById/${id}/${entity_id}`,
    getQuotationByMainIdData: (id: any) =>
      `${databaseKey}/api/v1/getQuotationByMainId/${id}`,
    updateQuotationByDepIdData: (id: any) =>
      `${databaseKey}/api/v1/updateQuotationByDepId/${id}`,

    viewQuotationLevel: (id: any) =>
      `${databaseKey}/api/v1/getAllQuotationApprovalLevel/${id}`,
  },
  deliveryOrders: {
    createDeliveryOrderData: () => `${databaseKey}/api/v1/createDeliveryOrder`,
    getDeliveryOrderByMainIdData: (id: any) =>
      `${databaseKey}/api/v1/getDeliveryOrderByMainId/${id}`,
    // getApprovedDeliveryByMainIdData: (id:any,role:any,entityId:any) =>
    //   `${databaseKey}/api/v1/getApprovedDeliveryByMainId?empid=${id}&role=${role}&entityId=${entityId}`,
    // getRejectedDeliveryByMainIdData: (id:any,role:any,entityId:any) =>
    //   `${databaseKey}/api/v1/getRejectedDeliveryByMainId?empid=${id}&role=${role}&entityId=${entityId}`,
    // getDeliveryPendingByDepIdData: (id:any,entity_id:any) =>
    //   `${databaseKey}/api/v1/getPendingDeliveryByDepId/${id}/${entity_id}`,
    updateDeliveryByDepIdData: (id: any) =>
      `${databaseKey}/api/v1/updatDelStatusByDepId/${id}`,
    deleteDeliveryData: (id: any) =>
      `${databaseKey}/api/v1/deleteDeliveryById/${id}`,
    getDeliveryByIdData: (id: any, entity_id: any) =>
      `${databaseKey}/api/v1/getDeliveryById/${id}/${entity_id}`,
    getApprovedSalesInvoiceData: (id: any) =>
      `${databaseKey}/api/v1/getApprovedSalesInvoices/${id}`,
    getApprovedSalesInvoiceDetailByIdData: (id: any) =>
      `${databaseKey}/api/v1/getApprovedSalesInvoiceDetailById/${id}`,
    getItemsDataByIdData: (id: any) =>
      `${databaseKey}/api/v1/getApprovedQuotationItemDetailById/${id}`,
    viewDeliveryLevel: (id: any) =>
      `${databaseKey}/api/v1/getAllDeliveryOrderApprovalLevel/${id}`,
  },
  proforma: {
    getQuotationDocCode: (entityId: any) =>
      `${databaseKey}/api/v1/getQuotationDocCode/${entityId}`,
    getApprovedQuotationDetailById: (quotation_id: Number) =>
      `${databaseKey}/api/v1/getApprovedQuotationDetailById/${quotation_id}`,
    getApprovedQuotationItemDetailById: (id: any) =>
      `${databaseKey}/api/v1/getApprovedQuotationItemDetailById/${id}`,
    createProforma: (id: any) => `${databaseKey}/api/v1/createProforma/${id}`,
    getAllProforma: (id: any) => `${databaseKey}/api/v1/getAllProforma/${id}`,
    // getAllPendingProforma: (id:any,entityId:any) =>
    //   `${databaseKey}/api/v1/getPendingProformaByDepId/${id}/${entityId}`,
    // getApprovedProforma: (empid:any,role:any,entityId:any) =>
    //   `${databaseKey}/api/v1/getApprovedDataByCustomerId?empid=${empid}&role=${role}&entityId=${entityId}`,
    // getRejectedProforma: (empid:any,role:any,entityId:any) =>
    //   `${databaseKey}/api/v1/getRejectedDataByCustomerId?empid=${empid}&role=${role}&entityId=${entityId}`,
    updateProformaStatus: (id: any) =>
      `${databaseKey}/api/v1/updateProformaStatus/${id}`,
    viewProforma: (id: any) => `${databaseKey}/api/v1/getProformaById/${id}`,
    viewProformaLevel: (id: any) =>
      `${databaseKey}/api/v1/getAllProformaApprovalLevel/${id}`,
  },
  saleInvoice: {
    getProformaDocCode: (entityId: any) =>
      `${databaseKey}/api/v1/getPorformaDocCode/${entityId}`,
    getApprovedProformaDetailById: (proforma_id: Number) =>
      `${databaseKey}/api/v1/getApprovedProformaDetailById/${proforma_id}`,
    createSalesInvoice: (id: any) =>
      `${databaseKey}/api/v1/createSalesInvoice/${id}`,
    getAllInvoiceData: (id: any) =>
      `${databaseKey}/api/v1/getAllInvoiceData/${id}`,
    // getPendingInvoiceByDepId: (empid:any,entityId:any) =>
    //   `${databaseKey}/api/v1/getPendingInvoiceByDepId/${empid}/${entityId}`,
    updateSaleInvoiceStatus: (id: any) =>
      `${databaseKey}/api/v1/updateInvoiceStatus/${id}`,
    // getApprovedSaleInvoice: (empid:any,role:any,entityId:any) =>
    //   `${databaseKey}/api/v1/getInvoiceApprovedDataByCustomerId?empid=${empid}&role=${role}&entityId=${entityId}`,
    // getRejectedSaleInvoice: (empid:any,role:any,entityId:any) =>
    //   `${databaseKey}/api/v1/getInvoiceRejectedDataByCustomerId?empid=${empid}&role=${role}&entityId=${entityId}`,
    getSaleInvoiceById: (id: any) =>
      `${databaseKey}/api/v1/getSaleInvoiceById/${id}`,
    viewSaleInvoiceLevel: (id: any) =>
      `${databaseKey}/api/v1/getAllSalesInvoiceApprovalLevel/${id}`,
  },
  cash_book:{
    getAllFundTransferApprovalLevel: (id:any) => `${databaseKey}/api/v1/getAllFundTransferApprovalLevel/${id}`,
    getSalesReprentative:(asset_id:any)=>`${databaseKey}/api/v1/getAssetByIdSalesRepresentative/${asset_id}`
  },
};

@Injectable({
  providedIn: 'root',
})
export class SalesManagementService {
  constructor(private http: HttpClient) {}
  ////////// Delivery Orders
  createDeliveryOrder(data: any) {
    return this.http.post(
      routes.deliveryOrders.createDeliveryOrderData(),
      data
    );
  }

  getDeliveryOrderByMainId(
    id: any,
    status?: string,
    entity_id?: any,
    role?: any
  ) {
    let url = routes.deliveryOrders.getDeliveryOrderByMainIdData(id);
    if (status || entity_id || role) {
      url +=
        `?${status ? `status=${status}` : ''}` +
        `${status && entity_id ? '&' : ''}${
          entity_id ? `entity_id=${entity_id}` : ''
        }` +
        `${(status || entity_id) && role ? '&' : ''}${
          role ? `role=${role}` : ''
        }`;
    }

    return this.http.get(url);
  }

  // getApprovedDeliveryByMainId(id:any,role:any,entityId:any) {
  //   return this.http.get(
  //     routes.deliveryOrders.getApprovedDeliveryByMainIdData(id,role,entityId),

  //   );
  // }
  // getRejectedDeliveryByMainId(id:any,role:any,entityId:any) {
  //   return this.http.get(
  //     routes.deliveryOrders.getRejectedDeliveryByMainIdData(id,role,entityId),

  //   );
  // }
  // getPendingDeliveryByDepId(id:any,entity_id:any) {
  //   return this.http.get(
  //     routes.deliveryOrders.getDeliveryPendingByDepIdData(id,entity_id),

  //   );
  // }
  updateDeliveryByDepId(id: any, data: any) {
    return this.http.put(
      routes.deliveryOrders.updateDeliveryByDepIdData(id),
      data
    );
  }
  deleteDelivery(id: any) {
    return this.http.delete(routes.deliveryOrders.deleteDeliveryData(id));
  }
  getDeliveryById(id: any, entity_id: any) {
    return this.http.get(
      routes.deliveryOrders.getDeliveryByIdData(id, entity_id)
    );
  }
  viewDeliveryLevel(id: any) {
    return this.http.get(routes.deliveryOrders.viewDeliveryLevel(id));
  }
  getApprovedSalesInvoice(id: any) {
    return this.http.get(routes.deliveryOrders.getApprovedSalesInvoiceData(id));
  }
  getApprovedSalesInvoiceDetailById(id: any) {
    return this.http.get(
      routes.deliveryOrders.getApprovedSalesInvoiceDetailByIdData(id)
    );
  }
  getItemsDataById(id: any) {
    return this.http.get(routes.deliveryOrders.getItemsDataByIdData(id));
  }
  ///////
  createQuotation(data: any) {
    return this.http.post(routes.quotations.createQuotationData(), data);
  }
  deleteQuotation(id: any) {
    return this.http.delete(routes.quotations.deleteQuotationData(id));
  }
  getQuotationById(id: any, entity_id: any) {
    return this.http.get(routes.quotations.getQuotationByIdData(id, entity_id));
  }
  getQuotationByMainId(id: any, status?: string, entity_id?: any, role?: any) {
    let url = routes.quotations.getQuotationByMainIdData(id);
    if (status || entity_id || role) {
      url +=
        `?${status ? `status=${status}` : ''}` +
        `${status && entity_id ? '&' : ''}${
          entity_id ? `entity_id=${entity_id}` : ''
        }` +
        `${(status || entity_id) && role ? '&' : ''}${
          role ? `role=${role}` : ''
        }`;
    }
    return this.http.get(url);
  }

  updateQuotationByDepId(id: any, status: string) {
    return this.http.put(
      routes.quotations.updateQuotationByDepIdData(id),
      status
    );
  }
  viewQuotationLevel(quotation_id: Number) {
    return this.http.get(routes.quotations.viewQuotationLevel(quotation_id));
  }
  createSuperUserDetails(data: any) {
    return this.http.post(routes.superUser.createSuperUserData(), data);
  }
  updateSuperUserStatus(id:any,data:any){
    return this.http.put(routes.superUser.updateSuperUserStatus(id),data);
  
  }

  getAllActiveSuperUser(entity_id: any) {
    return this.http.get(routes.superUser.getAllActiveSuperUser(entity_id));
  }
  getAllSuperUsers(entity_id: any, fian: any) {
    return this.http.get(routes.superUser.getAllSuperUsers(entity_id, fian));
  }

  deleteSuperUser(id: any) {
    return this.http.delete(routes.superUser.deleteSuperUser(id));
  }
  getAllRecordsByid(id: any) {
    return this.http.get(routes.superUser.getAllRecordsByid(id));
  }
  updateUserById(id: any, data: any) {
    return this.http.patch(routes.superUser.updateUserById(id), data);
  }
  getQuotationDocCode(entityId: any) {
    return this.http.get(routes.proforma.getQuotationDocCode(entityId));
  }
  getApprovedQuotationDetailById(quotation_id: Number) {
    return this.http.get(
      routes.proforma.getApprovedQuotationDetailById(quotation_id)
    );
  }
  getApprovedQuotationItemDetailById(quotation_id: Number) {
    return this.http.get(
      routes.proforma.getApprovedQuotationItemDetailById(quotation_id)
    );
  }

  createProforma(data: Number, id: any) {
    return this.http.post(routes.proforma.createProforma(id), data);
  }

  getAllProforma(id: any, status?: string, entity_id?: any, role?: any) {
    let url = routes.proforma.getAllProforma(id);
    if (status || entity_id || role) {
      url +=
        `?${status ? `status=${status}` : ''}` +
        `${status && entity_id ? '&' : ''}${
          entity_id ? `entity_id=${entity_id}` : ''
        }` +
        `${(status || entity_id) && role ? '&' : ''}${
          role ? `role=${role}` : ''
        }`;
    }

    return this.http.get(url);
  }

  // getAllPendingProforma(id:any,entityId:any) {
  //   return this.http.get(routes.proforma.getAllPendingProforma(id,entityId) );
  // }
  updateProformaStatus(id: any, status: any) {
    return this.http.put(routes.proforma.updateProformaStatus(id), status);
  }
  // getApprovedProforma(empid:any,role:any,entityId:any) {
  //   return this.http.get(routes.proforma.getApprovedProforma(empid,role,entityId));
  // }
  // getRejectedProforma(empid:any,role:any,entityId:any) {
  //   return this.http.get(routes.proforma.getRejectedProforma(empid,role,entityId) );
  // }
  viewProforma(id: any) {
    return this.http.get(routes.proforma.viewProforma(id));
  }
  viewProformaLevel(id: any) {
    return this.http.get(routes.proforma.viewProformaLevel(id));
  }

  ////////////////////////
  getProformaDocCode(entityId: any) {
    return this.http.get(routes.saleInvoice.getProformaDocCode(entityId));
  }
  getApprovedProformaDetailById(proforma_id: Number) {
    return this.http.get(
      routes.saleInvoice.getApprovedProformaDetailById(proforma_id)
    );
  }
  createSalesInvoice(proforma_id: Number, data: any) {
    return this.http.post(
      routes.saleInvoice.createSalesInvoice(proforma_id),
      data
    );
  }
  // getAllInvoiceData(entity_id:Number) {
  //   return this.http.get(routes.saleInvoice.getAllInvoiceData(entity_id) );
  // }

  getAllInvoiceData(id: any, status?: string, entity_id?: any, role?: any) {
    let url = routes.saleInvoice.getAllInvoiceData(id);
    if (status || entity_id || role) {
      url +=
        `?${status ? `status=${status}` : ''}` +
        `${status && entity_id ? '&' : ''}${
          entity_id ? `entity_id=${entity_id}` : ''
        }` +
        `${(status || entity_id) && role ? '&' : ''}${
          role ? `role=${role}` : ''
        }`;
    }

    return this.http.get(url);
  }
  // getPendingInvoiceByDepId(empid:any,entityId:any) {
  //   return this.http.get(routes.saleInvoice.getPendingInvoiceByDepId(empid,entityId) );
  // }
  updateSaleInvoiceStatus(id: any, status: any) {
    return this.http.put(
      routes.saleInvoice.updateSaleInvoiceStatus(id),
      status
    );
  }
  // getApprovedSaleInvoice(empid:any,role:any,entityId:any) {
  //   return this.http.get(routes.saleInvoice.getApprovedSaleInvoice(empid,role,entityId));
  // }
  // getRejectedSaleInvoice(empid:any,role:any,entityId:any) {
  //   return this.http.get(routes.saleInvoice.getRejectedSaleInvoice(empid,role,entityId));
  // }
  getSaleInvoiceById(id: Number) {
    return this.http.get(routes.saleInvoice.getSaleInvoiceById(id));
  }
  viewSaleInvoiceLevel(id: Number) {
    return this.http.get(routes.saleInvoice.viewSaleInvoiceLevel(id));
  }

  getAllFundTransferApprovalLevel(id:any)
  {
    return this.http.get(routes.cash_book.getAllFundTransferApprovalLevel(id));
  }
  
  getSalesReprentative(id:any)
  {
    return this.http.get(routes.cash_book.getSalesReprentative(id));
  }
}
