
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }

  createProposal(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createProposal`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateSalesBooking(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/updateSalesBooking`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  pdfQuotationVersionMail(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/pdfQuotationVersionMail`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createproforma(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/generate_performa_invoice`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateVersionStatus(version_id: any) {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/updateVersionStatus/${version_id}`,null).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createAddSo(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/create_addPO`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  createProposalNew(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createnProposalNew`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  //////
  ////
  ///here  this code for quotation changes | 06 july
  ////
  getLeadSource(financial_year_id: any, entity_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getLeadSource?financial_year_id=${financial_year_id}&entity_id=${entity_id}`);
  }
  

  createLeadSource(payload: any) {
    return this.http.post(`${this.databaseKey}/api/v1/leadSource/create`, payload);
  }

  updateLeadSource(payload: any) {
    return this.http.put(`${this.databaseKey}/api/v1/leadSource/${payload.id}`, payload);
  }

  getLeadSourceById(id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/leadSource/${id}`);
  }

  deleteLeadSourceById(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/leadSource/${id}`);
  }

  getSalesCustomers() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getSalesCustomers`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

   getGrossDiscountList() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getGrossDiscMst`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  // deliveryTermUnloadings
  deliveryTermUnloadings() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/deliveryTermUnloadings`);
  }

  createdeliveryTermUnloading(payload: any) {
    return this.http.post(`${this.databaseKey}/api/v1/deliveryTermUnloadings/create`, payload);
  }

  updatedeliveryTermUnloading(payload: any) {
    return this.http.put(`${this.databaseKey}/api/v1/deliveryTermUnloadings/${payload.id}`, payload);
  }

  getdeliveryTermUnloadingById(id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/deliveryTermUnloadings/${id}`);
  }

  deletedeliveryTermUnloadingById(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/deliveryTermUnloadings/${id}`);
  }


  // Paymen Main
  paymentMainList() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/paymentMainList`);
  }

  createPaymentMain(payload: any) {
    return this.http.post(`${this.databaseKey}/api/v1/paymentMain/create`, payload);
  }

  updatePaymentMain(payload: any) {
    return this.http.put(`${this.databaseKey}/api/v1/paymentMain/${payload.id}`, payload);
  }

  getPaymentMainById(id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/paymentMain/${id}`);
  }

  deletePaymentMainById(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/paymentMain/${id}`);
  }

  // Sub Payment Main
  subPaymentMainList(payment_main_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/subPaymentMainList/${payment_main_id}`);
  }

  getAllSubPaymentMainList() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/subPaymentMainList`);
  }

  createSubPaymentMain(payload: any) {
    return this.http.post(`${this.databaseKey}/api/v1/subPaymentMain/create`, payload);
  }

  updateSubPaymentMain(payload: any) {
    return this.http.put(`${this.databaseKey}/api/v1/subPaymentMain/${payload.id}`, payload);
  }

  getSubPaymentMainById(id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/subPaymentMain/${id}`);
  }

  deleteSubPaymentMainById(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/subPaymentMain/${id}`);
  }

  // Insurrance
  insuranceList() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/insuranceList`);
  }

  createInsurrance(payload: any) {
    return this.http.post(`${this.databaseKey}/api/v1/insurance/create`, payload);
  }

  updateInsurrance(payload: any) {
    return this.http.put(`${this.databaseKey}/api/v1/insurance/${payload.id}`, payload);
  }

  getInsurranceById(id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/insurance/${id}`);
  }

  deleteInsurranceById(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/insurance/${id}`);
  }

  // Freight
  freightList() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/freightList`);
  }

  createFreight(payload: any) {
    return this.http.post(`${this.databaseKey}/api/v1/freight/create`, payload);
  }

  updateFreight(payload: any) {
    return this.http.put(`${this.databaseKey}/api/v1/freight/${payload.id}`, payload);
  }

  getFreightById(id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/freight/${id}`);
  }

  deleteFreightById(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/freight/${id}`);
  }
  ////////////////////////////////
  /////////////////////
  /////////////////

  getProposalCompanyData(query: any, data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/getProposalCompanyData/${query}`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getProposalList(query: any, type: any, login_id: any, typecheck: any,action:any) {
    let url = ""
    if (query && type == "status") url = `status=${query}`;
    if (query && type == "proposal_no") url = `id=${query}`;
    return this.http.get<any>(`${this.databaseKey}/api/v1/getProposalList?${url}${url ? '&' : ''}login_id=${login_id}&typecheck=${typecheck}&action=${action}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAllProposalList(query: any, type: any, login_id: any, typecheck: any,dealer:boolean) {

    let url = ""
    if (query && type == "status") url = `status=${query}`;
    if (query && type == "proposal_no") url = `id=${query}`;
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAllProposalList?${url}${url ? '&' : ''}login_id=${login_id}&typecheck=${typecheck}&dealer=${dealer}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }







  updateProposalStatus(body: any) {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/updateProposalStatus`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }



  getAllProposalData(id: any, version_id: number) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getDealCloseById?id=${id}&version_id=${version_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  getAllBookingSales(id: any, role_master_id: any, status: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAllBookingList?login_id=${id}&role_master_id=${role_master_id}&status=${status}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getList(id: any, status: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAllPendingBookingList?login_id=${id}&status=${status}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  createProposalPayment(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createProposalPayment`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateProposalPayment(body: any) {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/updateProposalPayment`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteProposalPayment(body: any) {
    return this.http.delete<any>(`${this.databaseKey}/api/v1/deleteProposalPayment?id=${body?.id}&proposal_id=${body?.proposal_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getProposalPaymentList(query: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getProposalPaymentList/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createBilling(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createBilling`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createInvoice(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createInvoice`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getInvoiceList(query: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getInvoiceList/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getUpdatedAddress() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getUpdatedAddress`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  proposalVersionList(proposal_id: any,versionPiStatus:boolean) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/proposalVersionList?id=${proposal_id}&isPiCreated=${versionPiStatus}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  dealCloseVersionByLeadId(lead_id: any, login_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/dealCloseVersionByLeadId?lead_id=${lead_id}&login_id=${login_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createDealClosed(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createDealClosed`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getDealClosedList(login_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getDealClosedList?login_id=${login_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getSalesOrderList(login_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getSalesOrderList?login_id=${login_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getDealClosedList1(login_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getDealClosedList?login_id=${login_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  proposalVersionListById(version_id: any, proposal_id: any, proposal_approval_id: any, action_type: any,userLoginId:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/proposalVersionListById?id=${version_id}&proposal_id=${proposal_id}&proposalApprovelId=${proposal_approval_id}&action_type=${action_type}&userLoginId=${userLoginId}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getsCustomerAddress(customer_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getsCustomerAddress/${customer_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  previewProposal(version_id: any, proposal_id: any,action_type:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/previewProposal?id=${version_id}&proposal_id=${proposal_id}&action_type=${action_type}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
 
  proformaInvoiceGetBy(version_id: any,proposal_id:any,proposal_approval_id:any,action_type:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/proposalVersionMailData?id=${version_id}&proposal_id=${proposal_id}&proposalApprovelId=${proposal_approval_id}&action_type=${action_type}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  uploadDoc(body: any) {
    return this.http.post<any>(`${this.databaseKey}/uploadDoc`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  sendEmailSalesOrder(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/SalesOrderMail`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAllproposalById(id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getExistingProposalById?id=${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getClosedListData(id: any, version_id: number, proposalApprovalId: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getDealCloseById?id=${id}&version_id=${version_id}&proposalApprovalId=${proposalApprovalId}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAllorderListData() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/orderList`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateProposalVersion(version_id: number, data: any) {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/updateProposalVersion/${version_id}`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateBookingStatus(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/updateBookingStatus`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  forwardSOToRM(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/forwardSOToRM`, data);
  }

  getCreditWorklowApprovalList(data: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getCreditWorklowApprovalList`, { params: data });
  }

  updateProposalVersionBooking(version_id: number, proposal_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/updateBookingProposalVersion/${version_id}/${proposal_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  add_promo_item(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/add_promo_item`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  add_promo_itemVersion(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/add_proposal_promo_item`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  remove_promo_item(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/remove_promo_item`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllApprovalLevelProposal(dep_id: any, workflow_type: any, id: any, version_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAllApprovalLevelProposal?dep_id=${dep_id}&workflow_type=${workflow_type}&id=${id}&version_id=${version_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateProposalItemStatus(control: any, status: string, approveLeavelId: number, version_id: number, proposalId: number, remark:any ) {

    control.remark = remark;
    return this.http.patch<any>(`${this.databaseKey}/api/v1/updateProposalItemStatus?status=${status}&proposalApprovalId=${approveLeavelId}&version_id=${version_id}&proposal_id=${proposalId}`, control).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllAdditionalCharge(entity_id: any, financial_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getall_additional?entity_id=${entity_id}&financial_id=${financial_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllAdditionalChargeGetBy(id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getby_additional/${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateAcceptPI(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/updateMailStatus`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllPI(entity_id: any, financial_id: any, login_id: any, role_master_id: any,dealer_status:boolean) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_generate_performa?entity_id=${entity_id}&financial_year_id=${financial_id}&login_id=${login_id}&role_master_id=${role_master_id}&dealer=${dealer_status}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  allProposalCustomer(financial_id: any, status: string) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/allProposalCustomer/${financial_id}/${status}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  AllProposalNo(financial_id: any, status: string) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/AllProposalNo/${financial_id}/${status}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  allProposalItems(financial_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/allProposalItems/${financial_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateFollowUpDate(version_id: any, data: any) {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/updateFollowupDate/${version_id}`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllSalesReason() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Active_salesReason`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  getAllBackOfficeReject(login_id: any, role_master_id: any, status: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAllBookingList_backOffice?login_id=${login_id}&role_master_id=${role_master_id}&status=${status}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createNewCustomer(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/crm/createNewCustomer`, data);
  }
  googleGeminiAi(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/googleGeminiAi`, data);
  }

  download_qoutationProforma_pdf(proposal_id: any, version_id: any, page_mode: any): Observable<any> {
      return this.http.get(`${this.databaseKey}/api/v1/download_qoutationProforma_pdf?proposal_id=${proposal_id}&version_id=${version_id}&page_mode=${page_mode}`, { responseType: 'blob' });
    }

  checkSchemeStatusByClientCategory(clientId: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/checkSchemeStatusByClientCategory?clientId=${clientId}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getProposalDocumentsList(proposalId: any, versionId: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getProposalDocumentsList?proposalId=${proposalId}&versionId=${versionId}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteProposalDocument(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/deleteProposalDocument/${id}`);
  }

  uploadProposalDocuments(formData: FormData) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/uploadMultipleDocuments`, formData);
  }

  getAllKitBomList(entity_id: any, getAllData: any) {
    return this.http.get<any>(
    `${this.databaseKey}/api/v1/getInstallationKitBomList`,
      {
        params: {
          entity_id,
          ...getAllData
        }
      }
    );
  }


  /////////////
  ///// here code for pass data component to another component
  /////

  private dataSource = new BehaviorSubject<string>('');
  currentData = this.dataSource.asObservable();

  updateData(data: any) {
    this.dataSource.next(data);
  }
}
