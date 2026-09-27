import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { add } from 'date-fns';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

const routes = {
  getPoList: {
    createPoInvoice: () => `${databaseKey}/api/v1/createPoInvoice`,
    createmultipleposingalInvoice: () =>
      `${databaseKey}/api/v1/createmultipleposingalInvoice`,
    createPoInvoiceBulk: () => `${databaseKey}/api/v1/createPoInvoiceBulk`,
    getAllPoList: (id: any) =>
      `${databaseKey}/api/v1/grnPoList?employee_id=${id}&status=${0}`,
    getAllPoListApproved: (id: any) =>
      `${databaseKey}/api/v1/grnPoList?employee_id=${id}&status=${1}`,
    get_all_GRN: (query: any) =>
      `${databaseKey}/api/v1/get_all_GRN?financial_year_id=${query?.financial_year_id}&entity_id=${query?.entity_id}&employee_id=${query?.employee_id}`,
    getPoListById: (id: any) => `${databaseKey}/api/v1/get_all_po_id/${id}`,
    getAllGRNData: (
      financial_year_id: any,
      entity_id: any,
      employee_id: any,
      status: any,
      addstock_status: any,
    ) =>
      `${databaseKey}/api/v1/get_all_GRN/?financial_year_id=${financial_year_id}&entity_id=${entity_id}&employee_id=${employee_id}&status=${status}`,
    getAllGRNDataInvoice: (
      financial_year_id: any,
      entity_id: any,
      employee_id: any,
    ) =>
      `${databaseKey}/api/v1/get_all_GRN_invoice/?financial_year_id=${financial_year_id}&entity_id=${entity_id}&employee_id=${employee_id}`,
    getAllGRNDataInvoice1: (
      financial_year_id: any,
      entity_id: any,
      employee_id: any,
    ) =>
      `${databaseKey}/api/v1/getAllInvoiceList?financial_year_id=${financial_year_id}&entity_id=${entity_id}&employee_id=${employee_id}`,
    getAllCompletedInvoice: (
      financial_year_id: any,
      entity_id: any,
      employee_id: any,
    ) =>
      `${databaseKey}/api/v1/getAllCompletedInvoice?financial_year_id=${financial_year_id}&entity_id=${entity_id}&employee_id=${employee_id}`,
    getCompletedGRNInvoice: (id: any, version_id: any) =>
      `${databaseKey}/api/v1/getCompleteGRNInvoiceById?id=${id}&version_id=${version_id}`,
    getVendorPoList: (id: any) =>
      `${databaseKey}/api/v1/get_vendor_po_list?vendor_id=${id}`,
  },
  createCode: {
    createCodeStatus: (id: any) => `${databaseKey}/api/v1/createCode/${id}`,
  },
  createGrnItem: {
    createItemGrn: () => `${databaseKey}/api/v1/create_grn`,
    getAllGrnItems: (id: any) => `${databaseKey}/api/v1/get_all_po_id/${id}`,
  },
  createGrnData: {
    createGrnData: () => `${databaseKey}/api/v1/createGRN`,
    updateGrnItem: (id: any) => `${databaseKey}/api/v1/updateData_GRN/${id}`,
    createStockData: () => `${databaseKey}/api/v1/createAddStock`,
  },
  getByIdItem: {
    getByIdItem: (id: any, status: any) =>
      `${databaseKey}/api/v1/get_all_grnItem_id?id=${id}&status=${status}`,
  },
  createGrnNumber: {
    createGrnNo: () => `${databaseKey}/api/v1/Code_grn_create`,
  },
  getByIdGrnData: {
    get_GRN_ByPO_AND_GRN_id: (po_id: any, grn_id: any) =>
      `${databaseKey}/api/v1/get_GRN_ByPO_AND_GRN_id/${po_id}/grn_id/${grn_id}`,
    get_GRN_bygrnANDpoID: (po_id: any, grn_id: any) =>
      `${databaseKey}/api/v1/get_GRN_bygrnANDpoID?po_id=${po_id}&grn_id=${grn_id}`,
    download_GRN_ByPO_AND_GRN_id: (po_id: any, grn_id: any) =>
      `${databaseKey}/api/v1/download_GRN_ByPO_AND_GRN_id/${po_id}/grn_id/${grn_id}`,
  },
  getByIdGrnDataPdf: {
    download_grn_data: (po_id: any, grn_id: any) =>
      `${databaseKey}/api/v1/grnDownload?po_id=${po_id}&grn_id=${grn_id}`,
  },

  grnModuleMain: {
    getPoGrnList: (fine_id: any, entity_id: any) =>
      `${databaseKey}/api/v1/get_all_PO?financial_year_id=${fine_id}&entity_id=${entity_id}`,
    get_all_PO: (req: any) =>
      `${databaseKey}/api/v1/get_all_PO?financial_year_id=${req?.financial_year_id}&entity_id=${req?.entity_id}&employee_id=${req?.employee_id}`,
    getPoGrnGetBy: (
      id: any,
      status: any,
      version_id: any,
      invoiceNo?: string,
      ship_id?: any,
    ) =>
      `${databaseKey}/api/v1/get_all_po_id?id=${id}&status=${status}&version_id=${version_id}&invoice_number=${invoiceNo}&ship_id=${ship_id}`,
    rejectedGRN: (id: any) =>
      `${databaseKey}/api/v1/patchGrnDiscard?grn_id=${id}`,
    getPOAdvanceUtilization: (id: any) =>
      `${databaseKey}/api/v1/getPOAdvanceUtilization?poId=${id}`,
  },
  getAccountNumberByID: {
    getAccountByid: (id: any) =>
      `${databaseKey}/api/v1/getBankAccountNameByBankId/${id}`,
  },

  getBankAccountNameByBankId: {
    getAccountNameByid: (id: any) =>
      `${databaseKey}/api/v1/getBankAccountNameByBankId/${id}`,
  },

  // download_qoutationProforma_pdf(proposal_id: any, version_id: any, page_mode: any): Observable<any> {
  //     return this.http.get(`${this.databaseKey}/api/v1/download_qoutationProforma_pdf?proposal_id=${proposal_id}&version_id=${version_id}&page_mode=${page_mode}`, { responseType: 'blob' });
  //   }
  downloadPurchaseInvoiceById: {
    downloadPurchaseInvoiceById: (id: any, version_id: any) =>
      `${databaseKey}/api/v1/downloadPurchaseInvoiceById?id=${id}&version_id=${version_id}`,
  },
  allExistingPo: {
    allExistingPo: (entity_id: any) =>
      `${databaseKey}/api/v1/allExistingPo/${entity_id}`,
  },
  getPOFromVendorId: {
    getvendorwithdatepolist: (vendor_id: any) =>
      `${databaseKey}/api/v1/getvendorwithdatepolist?vendor_id=${vendor_id}`,
  },
  getItemcostCategoryById: {
    getItemcostCategoryById: () =>
      `${databaseKey}/api/v1/getAllItemcostCategory`,
  },
};
// http://localhost:5000/api/v1/grnDownload?po_id=1&grn_id=1
@Injectable({
  providedIn: 'root',
})
export class GrnServiceService {
  constructor(private _httpClint: HttpClient) {}

  createPoInvoice(data: any) {
    return this._httpClint.post(routes.getPoList.createPoInvoice(), data);
  }

  createmultipleposingalInvoice(data: any) {
    return this._httpClint.post(
      routes.getPoList.createmultipleposingalInvoice(),
      data,
    );
  }
  createPoInvoiceBulk(data: any) {
    return this._httpClint.post(routes.getPoList.createPoInvoiceBulk(), data);
  }
  getAllPoList(id: any) {
    return this._httpClint.get(routes.getPoList.getAllPoList(id));
  }
  getAllPoListApproved(id: any) {
    return this._httpClint.get(routes.getPoList.getAllPoListApproved(id));
  }
  get_all_GRN(query: any) {
    return this._httpClint.get(routes.getPoList.get_all_GRN(query));
  }

  getPoListById(id: any) {
    return this._httpClint.get(routes.getPoList.getPoListById(id));
  }
  createCode(id: any) {
    return this._httpClint.get(routes.createCode.createCodeStatus(id));
  }

  getAllGRNData(a: any, b: any, c: any, status: any, flag: any) {
    return this._httpClint.get(
      routes.getPoList.getAllGRNData(a, b, c, status, flag),
    );
  }
  getAllGRNDataInvoice(financial_year: any, entity_id: any, employee_id: any) {
    return this._httpClint.get(
      routes.getPoList.getAllGRNDataInvoice(
        financial_year,
        entity_id,
        employee_id,
      ),
    );
  }
  getAllCompletedInvoice(
    financial_year: any,
    entity_id: any,
    employee_id: any,
    data: any,
  ) {
    return this._httpClint.post(
      routes.getPoList.getAllCompletedInvoice(
        financial_year,
        entity_id,
        employee_id,
      ),
      data,
    );
  }

  getAllInvoiceData(financial_year: any, entity_id: any, employee_id: any) {
    return this._httpClint.get(
      routes.getPoList.getAllGRNDataInvoice1(
        financial_year,
        entity_id,
        employee_id,
      ),
    );
  }

  getCompletedGRNInvoice(id: any, version_id: any) {
    return this._httpClint.get(
      routes.getPoList.getCompletedGRNInvoice(id, version_id),
    );
  }

  createGrnItem(data: any) {
    return this._httpClint.post(routes.createGrnItem.createItemGrn(), data);
  }

  getAllGrnItems(id: any) {
    return this._httpClint.get(routes.createGrnItem.getAllGrnItems(id));
  }

  createGrnData(data: any) {
    return this._httpClint.post(routes.createGrnData.createGrnData(), data);
  }

  createStockData(data: any) {
    return this._httpClint.post(routes.createGrnData.createStockData(), data);
  }

  getByIdItem(id: any, status: any) {
    return this._httpClint.get(routes.getByIdItem.getByIdItem(id, status));
  }
  updateGrnItem(id: any, data: any) {
    return this._httpClint.put(routes.createGrnData.updateGrnItem(id), data);
  }
  CreateGrnNo() {
    return this._httpClint.get(routes.createGrnNumber.createGrnNo());
  }

  getGRNByPOandGrnId(po_id: any, grn_id: any) {
    return this._httpClint.get(
      routes.getByIdGrnData.get_GRN_ByPO_AND_GRN_id(po_id, grn_id),
    );
  }

  get_GRN_bygrnANDpoID(po_id: any, grn_id: any) {
    return this._httpClint.get(
      routes.getByIdGrnData.get_GRN_bygrnANDpoID(po_id, grn_id),
    );
  }

  getDownloadGrn(po_id: any, grn_id: any) {
    return this._httpClint.get(
      routes.getByIdGrnDataPdf.download_grn_data(po_id, grn_id),
    );
  }

  // new grn module
  getPoGrnList(fine_id: any, entity_id: any) {
    return this._httpClint.get(
      routes.grnModuleMain.getPoGrnList(fine_id, entity_id),
    );
  }

  get_all_PO(req: any) {
    return this._httpClint.get(routes.grnModuleMain.get_all_PO(req));
  }

  getPoGrnGetBy(
    id: any,
    status: any,
    version_id: any,
    invoiceNo?: string,
    ship_id?: any,
  ) {
    return this._httpClint.get(
      routes.grnModuleMain.getPoGrnGetBy(
        id,
        status,
        version_id,
        invoiceNo,
        ship_id,
      ),
    );
  }
  getPOAdvanceUtilization(id: any) {
    return this._httpClint.get(
      routes.grnModuleMain.getPOAdvanceUtilization(id),
    );
  }

  getAccountNumberByID(id: any) {
    return this._httpClint.get(routes.getAccountNumberByID.getAccountByid(id));
  }

  getAccountNameByID(id: any) {
    return this._httpClint.get(
      routes.getBankAccountNameByBankId.getAccountNameByid(id),
    );
  }
  rejectedGRN(id: any) {
    return this._httpClint.patch(routes.grnModuleMain.rejectedGRN(id), '');
  }
  downloadPurchaseInvoiceById(id: any, version_id: any): Observable<any> {
    return this._httpClint.get(
      routes.downloadPurchaseInvoiceById.downloadPurchaseInvoiceById(
        id,
        version_id,
      ),
      { responseType: 'blob' },
    );
  }

  downloadPurchaseGRNById(id: any, version_id: any): Observable<any> {
    return this._httpClint.get(
      `${databaseKey}/api/v1/downloadPurchaseGRNById?id=${id}&version_id=${version_id}`,
      { responseType: 'blob' },
    );
  }

  allExistingPo(entity_id: any) {
    return this._httpClint.get(routes.allExistingPo.allExistingPo(entity_id));
  }

  getVendorPoList(entity_id: any) {
    return this._httpClint.get(routes.getPoList.getVendorPoList(entity_id));
  }

  getvendorwithdatepolist(vendorId: any) {
    return this._httpClint.get(
      routes.getPOFromVendorId.getvendorwithdatepolist(vendorId),
    );
  }
  getItemcostCategoryById() {
    return this._httpClint.get(
      routes.getItemcostCategoryById.getItemcostCategoryById(),
    );
  }

  bulkUploadSBExcelAPI(data: any) {
    return this._httpClint.post(`${databaseKey}/api/v1/bulkUploadSBExcel`, data);
  }
}
