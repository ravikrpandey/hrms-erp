import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, forkJoin } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { id } from 'date-fns/locale';

const databaseKey: any = environment.servralUrl;
const routes = {
  product: {
    getList: () => `${databaseKey}/api/v1/getAllItem`,
    getAllPatchedItemsData: () =>
      `${databaseKey}/api/v1/getAllPatchedItemsData`,
    getAllPatchedSevicesData: () =>
      `${databaseKey}/api/v1/getAllPatchedSevicesData`,
    getWorkFlowByCategoryList: () =>
      `${databaseKey}/api/v1/check_workflow_ByCategory`,
    getProdById: (id: any) => `${databaseKey}/api/v1/get_ById_item/${id}`,
    getItemByAsset: (id: any) => `${databaseKey}/api/v1/getItemByAssetId/${id}`,
    createItem: () => `${databaseKey}/api/v1/create_item`,
    deleteItem: (id: any) => `${databaseKey}/api/v1/delete_item/${id}`,
    updateItem: (id: any) => `${databaseKey}/api/v1/edit_item/${id}`,
  },

  service: {
    serviceMaster_create: () => `${databaseKey}/api/v1/createServiceMaster`,
    serviceMaster_List: () => `${databaseKey}/api/v1/getAllServices`,
    serviceMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/getAllServices/${id}`,
    serviceMasterDelete: (id: any) =>
      `${databaseKey}/api/v1/deleteServices/${id}`,
    serviceMaster_update: (id: any) =>
      `${databaseKey}/api/v1/update_services/${id}`,
    statusById: (id: any) => `${databaseKey}/api/v1/updateServiceStatus/${id}`,
  },

  empData: {
    getEmpById: (id: any) => `${databaseKey}/api/v1/get_ById_user/${id}`,
  },

  pr: {
    create_pr: () => `${databaseKey}/api/v1/create_PR_request`,
    getAllPrList: (id: any) => `${databaseKey}/api/v1/getAll_Product/${id}`,
    getPrforPoAll: () => `${databaseKey}/api/v1/get_all_PR_for_PO`,
    getApprovePr: (id: any) => `${databaseKey}/api/v1/getAll_Approved_pr/${id}`,
    getRejectedPr: (id: any) =>
      `${databaseKey}/api/v1/getAll_Rejected_pr/${id}`,
    getCategoryIdBy: (id: any) => `${databaseKey}/api/v1/get_ById_item/${id}`,
    getAllCategory: () => `${databaseKey}/api/v1/get_All_Category_Master`,
    getAllServiceCategory: () => `${databaseKey}/api/v1/serviesgetallcategroy`,
    getToBeAppPr: (idEmp: any) =>
      `${databaseKey}/api/v1/getAll_to_be_approve_pr/${idEmp}`,
    createCategory: () => `${databaseKey}/api/v1/create_Category_Master`,
    getAssetCatById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Category_Master/${id}`,
    editCategoryMaster: (id: any) =>
      `${databaseKey}/api/v1/edit_Category_Master/${id}`,
    get_ById_PR: (pr_category: any, procurement_id: any) =>
      `${databaseKey}/api/v1/get_ById_PR?pr_category=${pr_category}&procurementId=${procurement_id}`,
    updatePr: (id: any) => `${databaseKey}/api/v1/editPR_request/${id}`,
    updatePrStatus: (id: any) => `${databaseKey}/api/v1/update_status/${id}`,
    getProductAllBom: () => `${databaseKey}/api/v1/get_Bom_By_Type`,
    getByVerient: (id: any) => `${databaseKey}/api/v1/getProductVarient/${id}`,
    getAllItemVerient: (id: any) => `${databaseKey}/api/v1/getAllItems/${id}`,
    getByPr: (id: any) => `${databaseKey}/api/v1/getAll_Product_ById/${id}`,
    getByApprovelLevel: (id: any) =>
      `${databaseKey}/api/v1/getAll_Approvel_level/${id}`,
    getInitiateRfp: (
      employee_id: any,
      entity_id: any,
      financial_year_id: any,
    ) =>
      `${databaseKey}/api/v1/get_Approved_pr?employee_id=${employee_id}&entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    getByRfpLink: (id: any, rfpNo: any, type: any) =>
      `${databaseKey}/api/v1/getVendor_replyData?vendor_id=${id}&Rfp_no=${rfpNo}&type=${type}`,
    getVendorCategory: (query: any) =>
      `${databaseKey}/api/v1/get_all_vendor_name?entity_id=${query?.entity_id}&item_categray_id=${query?.item_categray_id}`,
  },

  po: {
    create_po: () => `${databaseKey}/api/v1/Create_PO_request`,
    create_pofrompr: () => `${databaseKey}/api/v1/Create_PO_BY_PR_request`,
    create_poinvoice: () => `${databaseKey}/api/v1/create_PO_invoice`,
    all_Po_Invoice: () => `${databaseKey}/api/v1/get_All_PO_invoice`,
    generate_po: () => `${databaseKey}/api/v1/generatePoNumber`,
    getAllPoList: () => `${databaseKey}/api/v1/get_all_po`,
    getApprovePo: () => `${databaseKey}/api/v1/get_all_Approved_PO`,
    getRejectedPo: () => `${databaseKey}/api/v1/get_all_Rejected_PO`,
    get_ById_PO: (id: any) => `${databaseKey}/api/v1/get_po_Byid/${id}`,
    get_allPO_id: (id: any) => `${databaseKey}/api/v1/get_allPO_id/${id}`,
    get_GRN_ByPO_AND_GRN_id: (po_id: any, grn_id: any) =>
      `${databaseKey}/api/v1/get_GRN_ByPO_AND_GRN_id/${po_id}/grn_id/${grn_id}`,
    get_AllGRN_ByPO_id: (id: any) =>
      `${databaseKey}/api/v1/get_AllGRN_ByPO_id/${id}`,
    updatePo: (id: any) => `${databaseKey}/api/v1/update_draft_po/${id}`,
    updatePoStatus: (id: any) =>
      `${databaseKey}/api/v1/approved_po_ByPO_ID/${id}`,
    getByApprovelPoLevel: (id: any) =>
      `${databaseKey}/api/v1/getAll_PO_Approval_level/${id}`,
    getGRNList: (id: any) =>
      `${databaseKey}/api/v1/get_all_grnnumberInvoice?po_number=${id}`,

    /////// mects PO ////////

    createPoNew: () => `${databaseKey}/api/v1/createPO`,
    getAllPoDataNew: (query: any) =>
      `${databaseKey}/api/v1/get_allPO?user_id=${query?.user_id}&user_role=${query?.user_role}&entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}`,
    getLevelPo: (id: any) =>
      `${databaseKey}/api/v1/getAll_Approval_level_po/${id}`,
    getToBeApproved: (id: any) =>
      `${databaseKey}/api/v1/get_to_be_approved_po/${id}`,
    getBYPoNew: (id: any) => `${databaseKey}/api/v1/get_allPO_id/${id}`,
    updateApprovelPO: (id: any) =>
      `${databaseKey}/api/v1/approve_levels_po/${id}`,
    getApprovedApprovel: (id: any) =>
      `${databaseKey}/api/v1/get_Approved_Approvals_po/${id}`,
    getApprovedApprovelForShipping: (id: any) =>
      `${databaseKey}/api/v1/get_Creator_Approved_POs/${id}`,
    updateShippingStatus: (id: any) =>
      `${databaseKey}/api/v1/updateshipingstatus?id=${id}`,
    getRejectApprovel: (id: any) =>
      `${databaseKey}/api/v1/get_Rejected_Approvals_po/${id}`,
    getPoCode: () => `${databaseKey}/api/v1/generate_Po_No`,
    getPRList: (entity_id: number, financial_year_id: number) =>
      `${databaseKey}/api/v1/get_all_PR_for_PO?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    getDepartmentCostCenter: (id: any, query: any) =>
      `${databaseKey}/api/v1/getAllCostCenterbyDep/${id}?entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}`,
    updatePoNew: (id: any) => `${databaseKey}/api/v1/UpdatePO/${id}`,
    deletePo: (id: any) => `${databaseKey}/api/v1/deletePO/${id}`,
  },

  approverLavel: {
    createApproverLavel: () => `${databaseKey}/api/v1/create_Approved`,
    getAll_Approvel_level: () => `${databaseKey}/api/v1/getAll_Approvel_level`,
    getAppLavelById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Approver/${id}`,
    editAppLevel: (id: any) =>
      `${databaseKey}/api/v1/update_approvel_status/${id}`,
  },

  rfp: {
    sendrfp: () => `${databaseKey}/api/v1/sendRFP`,
    sendRfpLink: (id: any) => `${databaseKey}/api/v1/update_vendorData/${id}`,
    getAllLiveRfp: () => `${databaseKey}/api/v1/GetAll_liveRFP`,
    getAllRfpList: () => `${databaseKey}/api/v1/getAllRfpList`,

    updateExtendDate: (id: any) => `${databaseKey}/api/v1/update_endDate/${id}`,
    getAllCloseRfp: () => `${databaseKey}/api/v1/GetAll_CloseRFP`,
    getQuotationApproval: (id: any) =>
      `${databaseKey}/api/v1/quotation_approvel/${id}`,
    updateEndDate: (id: any) => `${databaseKey}/api/v1/update_endDate/${id}`,
    deleteLiveRfp: (id: any) => `${databaseKey}/api/v1/delete_live_rfp/${id}`,
    getPreviousQuoteDetails: (id: any, vendorId: any) =>
      `${databaseKey}/api/v1/getVendor_replyData/${id},${vendorId}`,
    sendrfpBom: () => `${databaseKey}/api/v1/sendRFPforBOM`,
    sendrfpService: () => `${databaseKey}/api/v1/sendRFPforService`,
    getByRfpBomLink: (id: any, rfpNo: any, type: any) =>
      `${databaseKey}/api/v1/getVendor_replyDataforBOM?vendor_id=${id}&Rfp_no=${rfpNo}&type=${type}`,
    getByRfpServiceLink: (id: any, rfpNo: any, type: any) =>
      `${databaseKey}/api/v1/getVendor_replyDataforService?vendor_id=${id}&Rfp_no=${rfpNo}&type=${type}`,
    vendorServiceUpdate: (id: any) =>
      `${databaseKey}/api/v1/update_vendorDataforService/${id}`,
    vendorBomUpdate: (id: any) =>
      `${databaseKey}/api/v1/update_vendorDataforBOM/${id}`,
    updateRfpStopDate: (id: any) => `${databaseKey}/api/v1/stopliverfp/${id}`,
    quotationLevelGet: (id: any) =>
      `${databaseKey}/api/v1/getItemByLowestPrice/${id}`,
    bomQuotationGet: (id: any) =>
      `${databaseKey}/api/v1/getItemByLowestPricefprBom/${id}`,
    allRfpList: () => `${databaseKey}/api/v1/getAllRfp'sList`,
  },
  quotation: {
    getAllPendingApproval: () => `${databaseKey}/api/v1/GetAll_Approved_vendor`,
    getAllapprovedCost: () => `${databaseKey}/api/v1/GetAll_Approved_Cost`,
    getAllRejectedList: () => `${databaseKey}/api/v1/GetAll_rejected`,
    quotationReject: (id: any) =>
      `${databaseKey}/api/v1/approvel_cost_rejected/${id}`,
    quotationSelect: (id: any) =>
      `${databaseKey}/api/v1/checked_value_ture/${id}`,
  },

  purchaseOrder: {
    getPOById: (id: any) =>
      `${databaseKey}/api/v1/getAll_Approved_pr_getBy_id/${id}`,
    createPurchageOrder: (id: any) => `${databaseKey}/api/v1/po_issued/${id}`,
    getAllIssuedPO: () => `${databaseKey}/api/v1/getAll_issued_po`,
    getAllPOIssuedapproved: (id: any) =>
      `${databaseKey}/api/v1/get_to_be_approved_po/${id}`,
    getAlldraftPO: () => `${databaseKey}/api/v1/getAll_draftPO`,
  },

  invoice: {
    getInvoiceDetailsById: (id: any) =>
      `${databaseKey}/api/v1/getBy_idAll_issued_po/${id}`,
    genrateInvoice: (id: any) =>
      `${databaseKey}/api/v1/invoice_status_update/${id}`,
  },

  grn: {
    getAllGRNList: () => `${databaseKey}/api/v1/getAll_GRN`,
    getForGRNById: (id: any) => `${databaseKey}/api/v1/getBy_id_GRN/${id}`,
    updateGRNById: (id: any) => `${databaseKey}/api/v1/update_grn/${id}`,
    getVendorWithGrn: (vendorId: number, grnNumber: string) =>
      `${databaseKey}/api/v1/getvendorwithdatepo?vendor_id=${vendorId}&grnNumber=${grnNumber}`,
  },

  inventory: {
    getAllInventoryList: () => `${databaseKey}/api/v1/inventory_Data`,
  },

  //assest_management
  assest_master: {
    create_assest_master: () =>
      `${databaseKey}/api/v1/create_Asset_Product_Management`,
    get_assets_product_list: () =>
      `${databaseKey}/api/v1/get_All_Asset_Product_Master`,
    getbyid_assets_product_list: (id: any) =>
      `${databaseKey}/api/v1/get_BycategoryId_Asset_Product_Master/${id}`,
  },

  negotiation: {
    vendorNegotiation: (rfId: any) =>
      `${databaseKey}/api/v1/getAllVendorsForNegotiation/${rfId}`,
    sendNegotiate: (id: any) =>
      `${databaseKey}/api/v1/sendMailForNegotiation/${id}`,
    getVendorData: (id: any, id2: any) =>
      `${databaseKey}/api/v1/getVendrosDataById/${id},${id2}`,
    getByNewNegotiate: () => `${databaseKey}/api/v1/get_ById_RFP`,
    createNegotiateId: () => `${databaseKey}/api/v1/generate_negotiation_id`,
    updateNegotiateVendor: (id: any) =>
      `${databaseKey}/api/v1/updateVendorsBid/${id}`,
    sendNegotiateService: (id: any) =>
      `${databaseKey}/api/v1/sendMailForNegotiation_service/${id}`,
    getByIdServiceVendor: (id: any, id2: any) =>
      `${databaseKey}/api/v1/getVendor_replyData_for_service_Negotiation/${id},${id2}`,
    sendNegotiateBom: (id: any) =>
      `${databaseKey}/api/v1/sendMailForNegotiation_bom/${id}`,
    updateNegotiateServiceVendor: (id: any) =>
      `${databaseKey}/api/v1/updateVendorsBidForService/${id}`,
    getByNegotiateBomVendor: (id: any, id2: any) =>
      `${databaseKey}/api/v1/getVendor_replyData_for_bom_Negotiation/${id},${id2}`,
    updateNegotiateBomVenfor: (id: any) =>
      `${databaseKey}/api/v1/updateVendorsBidForBom/${id}`,
    updateExtendDateNegotiate: (id: any) =>
      `${databaseKey}/api/v1/update_endDate_for_negotiation/${id}`,
    updateStopDateNegotiate: (id: any) =>
      `${databaseKey}/api/v1/stop_live_negotiation/${id}`,
    getAllLiveNego: () => `${databaseKey}/api/v1/GetAll_liveNego`,
    // getAllLiveNego: (query:any) => `${databaseKey}/api/v1/GetAll_liveNego?entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}`,

    getAllCloseNego: () => `${databaseKey}/api/v1/GetAll_CloseNego`,
    // getAllCloseNego: (query:any) => `${databaseKey}/api/v1/GetAll_CloseNego?entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}`,

    updateQutationnegotiate: (id: any) =>
      `${databaseKey}/api/v1/getItemByLowestPriceForNego/${id}`,
    getALLNegotiation: () => `${databaseKey}/api/v1/getAllNegoData`,
    sendItemReNegotiate: (id: any) =>
      `${databaseKey}/api/v1/sendMailForRenegotiation/${id}`,
    sendServiceReNegotiate: (id: any) =>
      `${databaseKey}/api/v1/sendMailForRenegotiation_service/${id}`,
    getNegotiateVendor: (id: any) =>
      `${databaseKey}/api/v1/getAllVendorsForRenegotiation/${id}`,
    sendBomReNegotiate: (id: any) =>
      `${databaseKey}/api/v1/sendMailForRenegotiation_bom/${id}`,
    getByRenogatiateItem: (id: any, id2: any, id3: any) =>
      `${databaseKey}/api/v1/getVendrosDataByIdforRenegoItem/${id},${id2},${id3}`,
    getByRenogatiateService: (id: any, id2: any, id3: any) =>
      `${databaseKey}/api/v1/getVendor_replyData_for_service_ReNegotiation/${id},${id2},${id3}`,
    getByRenogatiateBom: (id: any, id2: any, id3: any) =>
      `${databaseKey}/api/v1/getVendor_replyData_for_bom_ReNegotiation/${id},${id2},${id3}`,
    getByRenegotiate: () => `${databaseKey}/api/v1/get_ById_RFP_Renego_Vendors`,
    getAllInitiate: () => `${databaseKey}/api/v1/GetAll_Initiate_Nego`,
    // getAllInitiate: (query:any) => `${databaseKey}/api/v1/GetAll_Initiate_Nego?entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}`,
  },

  prRequest: {
    getAessetItem: (id: any) => `${databaseKey}/all_prod_data/${id}`,
    getAssetByItem: (id: any) => `${databaseKey}/api/v1/get_item_master/${id}`,
    getAssetByItem1: (id: any) =>
      `${databaseKey}/api/v1/get_item_master1/${id}`,
    getAllAssetbyCat_id: (entity_id: any, cat_id: any) =>
      `${databaseKey}/api/v1/getAllAssetbyCat_id?entity_id=${entity_id}&cat_id=${cat_id}`,
    getEmployeData: (id: any) =>
      `${databaseKey}/api/v1/get_employee_data/${id}`,
    getBudget: () => `${databaseKey}/api/v1/budget_data`,
    createPrNew: () => `${databaseKey}/api/v1/createPer`,
    levelApprovels: (id: any) =>
      `${databaseKey}/api/v1/get_levels_to_be_approved_pr/${id}`,

    // getAllPRRequest:()=>`${databaseKey}/api/v1/get_all_pr`,
    getAllPRRequest: (query: any) =>
      `${databaseKey}/api/v1/get_all_pr?financial_year_id=${query?.financial_year_id}&entity_id=${query?.entity_id}&user_id=${query?.user_id}&user_role=${query?.user_role}`,

    getByPRRequest: (id: any) => `${databaseKey}/api/v1/get_all_pr_id/${id}`,
    approvelUpdate: (id: any) =>
      `${databaseKey}/api/v1/approve_levels_pr/${id}`,
    levelsShowPR: (id: any) =>
      `${databaseKey}/api/v1/getAll_Approval_level_pr/${id}`,
    getApprovedAll: (id: any) =>
      `${databaseKey}/api/v1/get_Approved_Approvals_pr/${id}`,
    getRejectedAll: (id: any) =>
      `${databaseKey}/api/v1/get_Rejected_Approvals_pr/${id}`,

    getServiceAssetBy: (id: any) =>
      `${databaseKey}/api/v1/get_service_master/${id}`,
    getBudgetNew: () => `${databaseKey}/api/v1/get_budget_details_pr`,
    getPrCodeGenrate: () => `${databaseKey}/api/v1/generate_PR_No`,
    downloadPDF: (id: any) =>
      `${databaseKey}/api/v1/download_purchase_order_pdf?po_id=${id}`,
    updatedPr: (id: any) => `${databaseKey}/api/v1/UpdatePer/${id}`,
  },
  sendApprovel: {
    approvelQuoteRFP: (id: any) =>
      `${databaseKey}/api/v1/getAllDataForApprovalRFP/${id}`,
    approvelQuoteNego: (id: any) =>
      `${databaseKey}/api/v1/getAllDataForApprovalNegotiation/${id}`,
    getRFPNegoQuotationDetails: (id: any) =>
      `${databaseKey}/api/v1/getRFPNegoQuotationDetails/${id}`,
    getApprovelId: () => `${databaseKey}/api/v1/generate_Rfp_Approval_Id`,
    createApprovelRfp: () =>
      `${databaseKey}/api/v1/Create_Approval_Data_For_RFP`,
    getMyRequestApprovel: (data: any) =>
      `${databaseKey}/api/v1/get_sended_approval_data?entity_id=${data.entity_id}&financial_year_id=${data.financial_year_id}&user_role=${data.user_role}&login_employe_id=${data.login_employe_id}`,
    getLevelApprovel: (id: any) =>
      `${databaseKey}/api/v1/getAll_Levels_List/${id}`,
    getApproverSendData: (id: any) =>
      `${databaseKey}/api/v1/get_levels_to_be_approved_rfp/${id}`,
    // getByApproverSendData:(id:any)=>`${databaseKey}/api/v1/get_By_Id_Approval_Data/${id}`,
    updateApprover: (id: any) => `${databaseKey}/api/v1/approve_levels/${id}`,
    updateApproverMYRequestRfp: (id: any) =>
      `${databaseKey}/api/v1/approve_levels_rfp/${id}`,
    rejectedApprover: (id: any) =>
      `${databaseKey}/api/v1/get_Rejected_Approvals_rfp/${id}`,
    getAllApprovedApprover: (id: any) =>
      `${databaseKey}/api/v1/get_Approved_Approvals_rfp/${id}`,
    createNegoApprovelId: () =>
      `${databaseKey}/api/v1/generate_Nego_Approval_Id`,
    getByApproverSendData: (id: any, rfp_approval_id: any, renego: any) => {
      if (rfp_approval_id[0] == 'N') {
        if (renego) {
          return `${databaseKey}/api/v1/get_By_Id_Approval_Data/${id}?re_nego_approval_id=${rfp_approval_id}`;
        } else {
          return `${databaseKey}/api/v1/get_By_Id_Approval_Data/${id}?nego_approval_id=${rfp_approval_id}`;
        }
      } else {
        return `${databaseKey}/api/v1/get_By_Id_Approval_Data/${id}?rfp_approval_id=${rfp_approval_id}`;
      }
    },
  },
  getAssetById: {
    getAssetById: (id: any) => `${databaseKey}/api/v1/getAllAssetById/${id}`,
  },
  shippingAlert: {
    getPoWithVendorDetails: (id: any) =>
      `${databaseKey}/api/v1/getPoWithVendorDetails/${id}`,
    createShippingAlert: () => `${databaseKey}/api/v1/createShippingAlert`,
    getsShippingAlert: (status: any) =>
      `${databaseKey}/api/v1/getsShippingAlert?status=${status}`,
    getsShippingAlertHistory: (po_id: any, vendor_id: any) =>
      `${databaseKey}/api/v1/getsShippingAlertHistory?po_id=${po_id}&vendor_id=${vendor_id}`,
    updateShippingAlertStatus: () =>
      `${databaseKey}/api/v1/updateShippingAlertStatus`,
    getShippingAlertHistory: (id: any) =>
      `${databaseKey}/api/v1/getShippingAlertHistory/${id}`,
    updateBuyerStatus: (id: any) =>
      `${databaseKey}/api/v1/updateBuyerStatus/${id}`,
    getVendorDashboard: (vendor_id: any) =>
      `${databaseKey}/api/v1/getVendorDashboard?vendor_id=${vendor_id}`,
    getPOListForVendor: (vendor_id: any) =>
      `${databaseKey}/api/v1/getPOListForVendor?vendor_id=${vendor_id}`,
  },
};

@Injectable({
  providedIn: 'root',
})
export class PurchaseRequestService {
  procurementProductId: any = new BehaviorSubject(null);
  idShare: any = new Subject<any>();
  messageSubject = new Subject<string>();

  message$ = this.messageSubject.asObservable();
  constructor(private http: HttpClient) {}
  sendMessage(message: string): void {
    this.messageSubject.next(message);
  }
  create_assest_master(data: any): Observable<any> {
    return this.http.post(routes.assest_master.create_assest_master(), data);
  }
  get_assets_product_list(): Observable<any> {
    return this.http.get(routes.assest_master.get_assets_product_list());
  }
  getbyid_assets_product_list(id: any): Observable<any> {
    return this.http.get(routes.assest_master.getbyid_assets_product_list(id));
  }

  //

  getAllProd(): Observable<any> {
    return this.http.get(routes.product.getList());
  }

  getCategoryByWorkFlowList(data: any): Observable<any> {
    return this.http.patch(routes.product.getWorkFlowByCategoryList(), data);
  }

  getProdById(id: any) {
    return this.http.get(routes.product.getProdById(id));
  }

  getItemByAsset(id: any) {
    return this.http.get(routes.product.getItemByAsset(id));
  }
  getAllPatchedItemsData(item_ids: any[]): Observable<any> {
    return this.http.post(routes.product.getAllPatchedItemsData(), {
      item_ids,
    });
  }
  getAllPatchedSevicesData(service_ids: any[]): Observable<any> {
    return this.http.post(routes.product.getAllPatchedSevicesData(), {
      service_ids,
    });
  }

  createItem(data: any) {
    return this.http.post(routes.product.createItem(), data);
  }

  deleteItem(id: any, data: any): Observable<any> {
    return this.http.put(routes.product.deleteItem(id), data);
  }

  updateItem(id: any, data: any): Observable<any> {
    return this.http.put(routes.product.updateItem(id), data);
  }

  // service master start
  getAllServiceMaster(): Observable<any> {
    return this.http.get(routes.service.serviceMaster_List());
  }

  getServiceMasterById(id: any) {
    return this.http.get(routes.service.serviceMasterGetById(id));
  }

  createServiceMaster(data: any) {
    return this.http.post(routes.service.serviceMaster_create(), data);
  }

  deleteServiceMaster(id: any, data: any): Observable<any> {
    return this.http.delete(routes.service.serviceMasterDelete(id), data);
  }

  updateServiceMaster(id: any, data: any): Observable<any> {
    return this.http.put(routes.service.serviceMaster_update(id), data);
  }
  // service master end

  getEmpById(id: any) {
    return this.http.get(routes.empData.getEmpById(id));
  }

  createPr(data: any) {
    return this.http.post(routes.pr.create_pr(), data);
  }

  downloadPRById(poId: any) {
    return this.http.get(`${databaseKey}/api/v1/downloadPRById/${poId}`, {
      responseType: 'blob',
    });
  }

  getAllPrList(id: any, data: any) {
    return this.http.post(routes.pr.getAllPrList(id), data);
  }

  getAllPrforPoList() {
    return this.http.get(routes.pr.getPrforPoAll());
  }

  getApprovePrList(id: any, data: any) {
    return this.http.post(routes.pr.getApprovePr(id), data);
  }

  getRejectedPrList(id: any, data: any) {
    return this.http.post(routes.pr.getRejectedPr(id), data);
  }

  getAllCategory() {
    return this.http.get(routes.pr.getAllCategory());
  }
  getAllServiceCategory() {
    return this.http.get(routes.pr.getAllServiceCategory());
  }

  getCategoryIdBy(id: any) {
    return this.http.get(routes.pr.getCategoryIdBy(id));
  }

  getToBeAppPr(idEmp: any) {
    return this.http.get(routes.pr.getToBeAppPr(idEmp));
  }

  createAssetCategory(data: any) {
    return this.http.post(routes.pr.createCategory(), data);
  }

  getAssetCatById(id: any) {
    return this.http.get(routes.pr.getAssetCatById(id));
  }

  editCategoryMaster(id: any, data: any): Observable<any> {
    return this.http.put(routes.pr.editCategoryMaster(id), data);
  }

  getAllApproverList(data: any) {
    return this.http.post(routes.approverLavel.getAll_Approvel_level(), data);
  }

  createApprover(data: any) {
    return this.http.post(routes.approverLavel.createApproverLavel(), data);
  }

  getByIdApproverLavel(id: any) {
    return this.http.get(routes.approverLavel.getAppLavelById(id));
  }

  updateApproverLeval(id: any, data: any): Observable<any> {
    return this.http.put(routes.approverLavel.editAppLevel(id), data);
  }

  getByIdPR(procurement_id: any, pr_category: any, rfp_number?: string) {
    let url = routes.pr.get_ById_PR(pr_category, procurement_id);
    if (rfp_number) {
      url += `&rfp_number=${rfp_number}`;
    }
    return this.http.get(url);
  }

  updatePr(id: any, data: any): Observable<any> {
    return this.http.put(routes.pr.updatePr(id), data);
  }

  updatePrStatus(id: any, data: any): Observable<any> {
    return this.http.post(routes.pr.updatePrStatus(id), data);
  }

  ///////////// PO start ////////////
  createPo(data: any) {
    return this.http.post(routes.po.create_po(), data);
  }

  createPoFromPr(data: any) {
    return this.http.post(routes.po.create_pofrompr(), data);
  }

  createPoInvoice(data: any) {
    return this.http.post(routes.po.create_poinvoice(), data);
  }

  getAllPoInvoice(data: any) {
    return this.http.patch(routes.po.all_Po_Invoice(), data);
  }

  generatePo(data: any) {
    return this.http.post(routes.po.generate_po(), data);
  }

  getAllPoList(data: any) {
    return this.http.post(routes.po.getAllPoList(), data);
  }

  getApprovePoList(data: any) {
    return this.http.post(routes.po.getApprovePo(), data);
  }

  getRejectedPoList(data: any) {
    return this.http.post(routes.po.getRejectedPo(), data);
  }

  getByIdPO(id: any, data: any) {
    return this.http.post(routes.po.get_ById_PO(id), data);
  }

  get_allPO_id(id: any) {
    return this.http.get(routes.po.get_allPO_id(id));
  }

  getGRNByPOandGrnId(po_id: any, grn_id: any) {
    return this.http.get(routes.po.get_GRN_ByPO_AND_GRN_id(po_id, grn_id));
  }

  getAllGRNByPOid(id: any) {
    return this.http.get(routes.po.get_AllGRN_ByPO_id(id));
  }

  getGRNList(id: any) {
    return this.http.get(routes.po.getGRNList(id));
  }

  updatePo(id: any, data: any): Observable<any> {
    return this.http.put(routes.po.updatePo(id), data);
  }

  updatePoStatus(id: any, data: any): Observable<any> {
    return this.http.post(routes.po.updatePoStatus(id), data);
  }

  updatePoNew(id: any, data: any) {
    return this.http.put(routes.po.updatePoNew(id), data);
  }

  getByApprovelPoLevel(id: any) {
    return this.http.get(routes.po.getByApprovelPoLevel(id));
  }

  // /////mects PO start //////////
  createPoNew(data: any) {
    return this.http.post(routes.po.createPoNew(), data);
  }

  getAllPoDataNew(query: any) {
    return this.http.post(routes.po.getAllPoDataNew(query), null);
  }
  getLevelPo(id: any, data: any) {
    return this.http.post(routes.po.getLevelPo(id), data);
  }

  getTobeApproved(id: any) {
    return this.http.get(routes.po.getToBeApproved(id));
  }

  getBYPoNew(id: any) {
    return this.http.get(routes.po.getBYPoNew(id));
  }

  updateApprovelPO(id: any, data: any) {
    return this.http.post(routes.po.updateApprovelPO(id), data);
  }

  getApprovedApprovel(id: any) {
    return this.http.get(routes.po.getApprovedApprovel(id));
  }

  getApprovedApprovelForShipping(id: any) {
    return this.http.get(routes.po.getApprovedApprovelForShipping(id));
  }
  updateShippingStatus(id: any, data: any) {
    return this.http.put(routes.po.updateShippingStatus(id), data);
  }
  getRejectApprovel(id: any) {
    return this.http.get(routes.po.getRejectApprovel(id));
  }

  getPoCode(data: any) {
    return this.http.post(routes.po.getPoCode(), data);
  }

  getPRList(entity_id: number, financial_year_id: number) {
    return this.http.get(routes.po.getPRList(entity_id, financial_year_id));
  }

  get_all_Quotation_for_PO(entity_id: number, financial_year_id: number) {
    return this.http.get(
      `${environment.servralUrl}/api/v1/get_all_Quotation_for_PO?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    );
  }

  getDepartmentCostCenter(id: any, query: any) {
    return this.http.get(routes.po.getDepartmentCostCenter(id, query));
  }
  deletePo(id: any): Observable<any> {
    return this.http.delete(routes.po.deletePo(id));
  }
  downloadPurchaseOrderById(poId: any) {
    return this.http.get(
      `${databaseKey}/api/v1/downloadPurchaseOrderById/${poId}`,
      { responseType: 'blob' },
    );
  }
  ///////////// Po end /////////////

  sendRfpLink(data: any): Observable<any> {
    return this.http.put(routes.rfp.sendrfp(), data);
  }
  sendRfpBom(data: any): Observable<any> {
    return this.http.put(routes.rfp.sendrfpBom(), data);
  }
  sendRfpService(data: any): Observable<any> {
    return this.http.put(routes.rfp.sendrfpService(), data);
  }
  // updateVendorData(ids:number[], data:any):Observable<any[]>{
  //   const updateRequest:Observable<any>[]= ids.map(id => this.http.put(routes.rfp.sendRfpLink(id),data))
  //   // return this.http.put(routes.rfp.sendRfpLink(id),data);
  //   return forkJoin(updateRequest)
  // }

  updateVendorData(id: any, data: any): Observable<any> {
    return this.http.put(routes.rfp.sendRfpLink(id), data);
  }
  getAllLiveRfp(data: any) {
    return this.http.post(routes.rfp.getAllLiveRfp(), data);
  }
  // getAllLiveRfp(query:any) {
  //   return this.http.get(routes.rfp.getAllLiveRfp(query))
  // }
  updateExtendDate(id: any, data: any) {
    return this.http.put(routes.rfp.updateExtendDate(id), data);
  }
  updateEndDate(id: any, data: any) {
    return this.http.put(routes.rfp.updateEndDate(id), data);
  }

  getAllCloseRfp(data: any) {
    return this.http.post(routes.rfp.getAllCloseRfp(), data);
  }
  getAllRfpList(data: any) {
    return this.http.post(routes.rfp.getAllRfpList(), data);
  }

  getQuotationApproval(id: any, data: any) {
    return this.http.put(routes.rfp.getQuotationApproval(id), data);
  }

  getAllPendingApproval() {
    return this.http.get(routes.quotation.getAllPendingApproval());
  }

  getAllapprovedCost() {
    return this.http.get(routes.quotation.getAllapprovedCost());
  }

  getAllRejectedList() {
    return this.http.get(routes.quotation.getAllRejectedList());
  }

  quotationRejectById(id: any, data: any) {
    return this.http.put(routes.quotation.quotationReject(id), data);
  }

  deleteLiveRfp(id: any, data: any): Observable<any> {
    return this.http.put(routes.rfp.deleteLiveRfp(id), data);
  }

  quotationSelectById(id: any, data: any) {
    return this.http.put(routes.quotation.quotationSelect(id), data);
  }

  getPOById(id: any) {
    return this.http.get(routes.purchaseOrder.getPOById(id));
  }

  createPurchageOrder(id: any, data: any): Observable<any> {
    return this.http.put(routes.purchaseOrder.createPurchageOrder(id), data);
  }

  getAllIssuedPO(): Observable<any> {
    return this.http.get(routes.purchaseOrder.getAllIssuedPO());
  }
  getAlltobeIssuedPO(id: any): Observable<any> {
    return this.http.get(routes.purchaseOrder.getAllPOIssuedapproved(id));
  }

  getAlldraftPO(data: any): Observable<any> {
    return this.http.post(routes.purchaseOrder.getAlldraftPO(), data);
  }

  getInvoiceDetailsById(id: any): Observable<any> {
    return this.http.get(routes.invoice.getInvoiceDetailsById(id));
  }

  genrateInvoice(id: any, data: any): Observable<any> {
    return this.http.put(routes.invoice.genrateInvoice(id), data);
  }

  getAllGRNList(): Observable<any> {
    return this.http.get(routes.grn.getAllGRNList());
  }

  getForGRNById(id: any): Observable<any> {
    return this.http.get(routes.grn.getForGRNById(id));
  }

  updateGRNById(id: any, data: any): Observable<any> {
    return this.http.put(routes.grn.updateGRNById(id), data);
  }
  getVendorWithGrn(vendorId: number, grnNumber: string): Observable<any> {
    return this.http.get(routes.grn.getVendorWithGrn(vendorId, grnNumber));
  }
  getAllInventoryList(): Observable<any> {
    return this.http.get(routes.inventory.getAllInventoryList());
  }
  getPreviousQuotationDetails(id: any, vendorId: any): Observable<any> {
    return this.http.get(routes.rfp.getPreviousQuoteDetails(id, vendorId));
  }

  getProductAllBom(data: any) {
    return this.http.post(routes.pr.getProductAllBom(), data);
  }

  getByVerient(id: any) {
    return this.http.get(routes.pr.getByVerient(id));
  }

  getAllItemVerient(id: any, data: any) {
    return this.http.post(routes.pr.getAllItemVerient(id), data);
  }

  getByPr(id: any) {
    return this.http.get(routes.pr.getByPr(id));
  }

  getInitiateRfp(employee_id: any, entity_id: any, financial_year_id: any) {
    return this.http.get(
      routes.pr.getInitiateRfp(employee_id, entity_id, financial_year_id),
    );
  }

  getByApprovelLevel(id: any, data: any) {
    return this.http.post(routes.pr.getByApprovelLevel(id), data);
  }

  getByRfpLink(id: any, rfpNo: any, type: any) {
    return this.http.get(routes.pr.getByRfpLink(id, rfpNo, type));
  }
  getByRfpBomLink(id: any, rfpNo: any, type: any) {
    return this.http.get(routes.rfp.getByRfpBomLink(id, rfpNo, type));
  }
  getByRfpServiceLink(id: any, rfpNo: any, type: any) {
    return this.http.get(routes.rfp.getByRfpServiceLink(id, rfpNo, type));
  }
  vendorServiceUpdate(id: any, data: any): Observable<any> {
    return this.http.put(routes.rfp.vendorServiceUpdate(id), data);
  }
  vendorBomUpdate(id: any, data: any): Observable<any> {
    return this.http.put(routes.rfp.vendorBomUpdate(id), data);
  }
  updateRfpStopDate(id: any, data: any) {
    return this.http.post(routes.rfp.updateRfpStopDate(id), data);
  }
  quotationLevelGet(id: any, rfp_number?: string, rfp_approval_id?: string) {
    let url = routes.rfp.quotationLevelGet(id);
    const params: string[] = [];
    if (rfp_number) {
      params.push(`rfp_number=${rfp_number}`);
    }
    if (rfp_approval_id) {
      params.push(`rfp_approval_id=${rfp_approval_id}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get(url);
  }
  bomQuotationGet(id: any) {
    return this.http.get(routes.rfp.bomQuotationGet(id));
  }
  allRfpList(data: any) {
    return this.http.post(routes.rfp.allRfpList(), data);
  }
  vendorNegotiation(rfId: any) {
    return this.http.get(routes.negotiation.vendorNegotiation(rfId));
  }

  // negotiate
  sendNegotiate(id: any, data: any) {
    return this.http.post(routes.negotiation.sendNegotiate(id), data);
  }

  getVendorData(id: any, id2: any) {
    return this.http.get(routes.negotiation.getVendorData(id, id2));
  }
  getByNewNegotiate(data: any) {
    return this.http.post(routes.negotiation.getByNewNegotiate(), data);
  }
  createNegotiateId() {
    return this.http.get(routes.negotiation.createNegotiateId());
  }

  updateNegotiateVendor(id: any, data: any) {
    return this.http.post(routes.negotiation.updateNegotiateVendor(id), data);
  }

  sendNegotiateService(id: any, data: any) {
    return this.http.post(routes.negotiation.sendNegotiateService(id), data);
  }

  getByIdServiceVendor(id: any, id2: any) {
    return this.http.get(routes.negotiation.getByIdServiceVendor(id, id2));
  }
  approvelQuoteNego(id: any, negotiation_code?: string) {
    let url = routes.sendApprovel.approvelQuoteNego(id);
    if (negotiation_code) {
      url += `?negotiation_code=${negotiation_code}`;
    }
    return this.http.get(url);
  }
  sendNegotiateBom(id: any, data: any) {
    return this.http.post(routes.negotiation.sendNegotiateBom(id), data);
  }
  updateNegotiateServiceVendor(id: any, data: any) {
    return this.http.post(
      routes.negotiation.updateNegotiateServiceVendor(id),
      data,
    );
  }
  getByNegotiateBomVendor(id: any, id2: any) {
    return this.http.get(routes.negotiation.getByNegotiateBomVendor(id, id2));
  }

  updateNegotiateBomVenfor(id: any, data: any) {
    return this.http.post(
      routes.negotiation.updateNegotiateBomVenfor(id),
      data,
    );
  }
  updateExtendDateNegotiate(id: any, data: any) {
    return this.http.put(
      routes.negotiation.updateExtendDateNegotiate(id),
      data,
    );
  }
  updateStopDateNegotiate(id: any, data: any) {
    return this.http.post(routes.negotiation.updateStopDateNegotiate(id), data);
  }
  getAllLiveNego(data: any) {
    return this.http.post(routes.negotiation.getAllLiveNego(), data);
  }

  // getAllLiveNego(query:any) {
  //   return this.http.get(routes.negotiation.getAllLiveNego(query));
  // }

  getAllCloseNego(data: any) {
    return this.http.post(routes.negotiation.getAllCloseNego(), data);
  }
  updateQutationnegotiate(
    id: any,
    negotiation_code?: string,
    negotiation_id?: number,
  ) {
    let url = routes.negotiation.updateQutationnegotiate(id);
    const params: string[] = [];
    if (negotiation_code) {
      params.push(`negotiation_code=${negotiation_code}`);
    }
    if (negotiation_id) {
      params.push(`negotiation_id=${negotiation_id}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get(url);
  }
  getALLNegotiation(data: any) {
    return this.http.post(routes.negotiation.getALLNegotiation(), data);
  }

  getByRenegotiate(data: any) {
    return this.http.post(routes.negotiation.getByRenegotiate(), data);
  }
  getAllInitiate(data: any) {
    return this.http.post(routes.negotiation.getAllInitiate(), data);
  }
  // getAllInitiate(query:any){
  //   return this.http.get(routes.negotiation.getAllInitiate(query))
  // }
  // renegotiate
  sendItemReNegotiate(id: any, data: any) {
    return this.http.post(routes.negotiation.sendItemReNegotiate(id), data);
  }

  sendSeriveReNegotiate(id: any, data: any) {
    return this.http.post(routes.negotiation.sendServiceReNegotiate(id), data);
  }
  getNegotiateVendor(id: any) {
    return this.http.get(routes.negotiation.getNegotiateVendor(id));
  }

  sendBomReNegotiate(id: any, data: any) {
    return this.http.post(routes.negotiation.sendBomReNegotiate(id), data);
  }

  getByRenogatiateItem(id: any, id2: any, id3: any) {
    return this.http.get(routes.negotiation.getByRenogatiateItem(id, id2, id3));
  }

  getByRenogatiateService(id: any, id2: any, id3: any) {
    return this.http.get(
      routes.negotiation.getByRenogatiateService(id, id2, id3),
    );
  }
  getByRenogatiateBom(id: any, id2: any, id3: any) {
    return this.http.get(routes.negotiation.getByRenogatiateBom(id, id2, id3));
  }

  // new pr request start
  getAessetItem(id: any) {
    return this.http.get(routes.prRequest.getAessetItem(id));
  }

  getAssetByItem(id: any) {
    return this.http.get(routes.prRequest.getAssetByItem(id));
  }
  getAssetByItem1(id: any) {
    return this.http.get(routes.prRequest.getAssetByItem1(id));
  }
  getAllAssetbyCat_id(entity_id: any, cat_id: any) {
    return this.http.get(
      routes.prRequest.getAllAssetbyCat_id(entity_id, cat_id),
    );
  }
  getEmployeData(id: any) {
    return this.http.get(routes.prRequest.getEmployeData(id));
  }

  getBudget(data: any) {
    return this.http.post(routes.prRequest.getBudget(), data);
  }
  createPrNew(data: any) {
    return this.http.post(routes.prRequest.createPrNew(), data);
  }
  updatedPr(id: any, data: any) {
    return this.http.put(routes.prRequest.updatedPr(id), data);
  }
  levelApprovels(id: any, data: any) {
    return this.http.post(routes.prRequest.levelApprovels(id), data);
  }

  getAllPRRequest(query: any) {
    return this.http.post(routes.prRequest.getAllPRRequest(query), null);
  }

  getByPRRequest(id: any) {
    return this.http.get(routes.prRequest.getByPRRequest(id));
  }

  getVendorQuotationById(
    pr_id: number,
    quotation_id: number,
    vendor_id: number,
  ) {
    return this.http.get(
      `${environment.servralUrl}/api/v1/getVendorQuotationById/${pr_id}?quotation_id=${quotation_id}&vendor_id=${vendor_id}`,
    );
  }

  approvelUpdate(id: any, data: any) {
    return this.http.post(routes.prRequest.approvelUpdate(id), data);
  }

  levelsShowPR(id: any, data: any) {
    return this.http.post(routes.prRequest.levelsShowPR(id), data);
  }

  getApprovedAll(id: any, data: any) {
    return this.http.post(routes.prRequest.getApprovedAll(id), data);
  }

  getRejectedAll(id: any, data: any) {
    return this.http.post(routes.prRequest.getRejectedAll(id), data);
  }

  getServiceAssetBy(id: any) {
    return this.http.get(routes.prRequest.getServiceAssetBy(id));
  }

  getBudgetNew(data: any) {
    return this.http.post(routes.prRequest.getBudgetNew(), data);
  }

  getVendorCategory(data: any) {
    return this.http.get(routes.pr.getVendorCategory(data));
  }

  getPrCodeGenrate(data: any) {
    return this.http.post(routes.prRequest.getPrCodeGenrate(), data);
  }

  getApprovelId() {
    return this.http.get(routes.sendApprovel.getApprovelId());
  }

  approvelQuoteRFP(id: any, rfp_number?: string) {
    let url = routes.sendApprovel.approvelQuoteRFP(id);
    if (rfp_number) {
      url += `?rfp_number=${rfp_number}`;
    }
    return this.http.get(url);
  }

  getRFPNegoQuotationDetails(id: any, rfp_approval_id?: string) {
    let url = routes.sendApprovel.getRFPNegoQuotationDetails(id);
    if (rfp_approval_id) {
      url += `?rfp_approval_id=${rfp_approval_id}`;
    }
    return this.http.get(url);
  }

  createApprovelRfp(data: any) {
    return this.http.post(routes.sendApprovel.createApprovelRfp(), data);
  }

  createNegoApprovelId() {
    return this.http.get(routes.sendApprovel.createNegoApprovelId());
  }
  getAllRejectedApprover(id: any, data: any) {
    return this.http.post(routes.sendApprovel.rejectedApprover(id), data);
  }
  updateApprover(id: any, data: any) {
    return this.http.post(routes.sendApprovel.updateApprover(id), data);
  }

  updateApproverMYRequestRfp(id: any, data: any) {
    return this.http.post(
      routes.sendApprovel.updateApproverMYRequestRfp(id),
      data,
    );
  }

  getAllApprovedApprover(id: any, data: any) {
    return this.http.post(routes.sendApprovel.getAllApprovedApprover(id), data);
  }

  getLevelApprovel(id: any, data: any) {
    return this.http.post(routes.sendApprovel.getLevelApprovel(id), data);
  }

  getMyRequestApprovel(id: any, data: any) {
    return this.http.post(routes.sendApprovel.getMyRequestApprovel(data), data);
  }

  getApproverSendData(id: any, data: any) {
    return this.http.post(routes.sendApprovel.getApproverSendData(id), data);
  }

  getByApproverSendData(id: any, rfp_approval_id: any, renego: any) {
    return this.http.get(
      routes.sendApprovel.getByApproverSendData(id, rfp_approval_id, renego),
    );
  }
  getAssetById(id: any) {
    return this.http.get(routes.getAssetById.getAssetById(id));
  }

  downloadPDF(poId: any): Observable<any> {
    return this.http.get(
      `${databaseKey}/api/v1/download_purchase_order_pdf?po_id=${poId}`,
      { responseType: 'blob' },
    );
  }

  /////////////////////////
  //////////// here route for get po with vendor details for creating shipping alert 20/03/2026
  /////////////

  getPoWithVendorDetails(id: any) {
    return this.http.get(routes.shippingAlert.getPoWithVendorDetails(id));
  }
  createShippingAlert(data: any) {
    return this.http.post(routes.shippingAlert.createShippingAlert(), data);
  }
  getsShippingAlert(status: any) {
    return this.http.get(routes.shippingAlert.getsShippingAlert(status));
  }
  getsShippingAlertHistory(po_id: any, vendor_id: any) {
    return this.http.get(
      routes.shippingAlert.getsShippingAlertHistory(po_id, vendor_id),
    );
  }
  updateShippingAlertStatus(data: any) {
    return this.http.post(
      routes.shippingAlert.updateShippingAlertStatus(),
      data,
    );
  }
  getShippingAlertHistory(id: any) {
    return this.http.get(routes.shippingAlert.getShippingAlertHistory(id));
  }
  updateBuyerStatus(id: any, data: any) {
    return this.http.patch(routes.shippingAlert.updateBuyerStatus(id), data);
  }

  getVendorDashboard(vendor_id: any) {
    return this.http.get(routes.shippingAlert.getVendorDashboard(vendor_id));
  }

  getPOListForVendor(vendor_id: any) {
    return this.http.get(routes.shippingAlert.getPOListForVendor(vendor_id));
  }

  getAllRfpListForVendor(vendor_id: any) {
    return this.http.get(
      `${databaseKey}/api/v1/getAllRfpListForVendor?vendor_id=${vendor_id}`,
    );
  }

  getAllNegotiationListForVendor(vendor_id: any) {
    return this.http.get(
      `${databaseKey}/api/v1/getAllNegotiationListForVendor?vendor_id=${vendor_id}`,
    );
  }

  getCHAForwarderList(page: any): Observable<any> {
    return this.http.get(
      `${databaseKey}/api/v1/getCHAForwarderList?page=${page}`,
    );
  }

  getCHAForwarderData(id: any): Observable<any> {
    return this.http.get(
      `${databaseKey}/api/v1/getCHAForwarderModeList?id=${id}`,
    );
  }

  createOrUpdateBOE(data: any): Observable<any> {
    return this.http.post(`${databaseKey}/api/v1/createOrUpdateBOE`, data);
  }

  claimItemsCHA(data: any): Observable<any> {
    return this.http.put(`${databaseKey}/api/v1/claimItemsCHA`, data);
  }

  updateCHACharges(data: any): Observable<any> {
    return this.http.put(`${databaseKey}/api/v1/updateCHACharges`, data);
  }

  deleteCHADocument(id: any): Observable<any> {
    return this.http.delete(`${databaseKey}/api/v1/deleteCHADocument?id=${id}`);
  }

  generateCHABill(id: any): Observable<any> {
    return this.http.put(`${databaseKey}/api/v1/generateCHABill`, id);
  }

  createOrUpdateForwarder(data: any): Observable<any> {
    return this.http.post(
      `${databaseKey}/api/v1/createOrUpdateForwarder`,
      data,
    );
  }

  getGateInwardList(): Observable<any> {
    return this.http.get(`${databaseKey}/api/v1/getGateInwardList`);
  }

  receivedPOFromGateInward(id: any): Observable<any> {
    return this.http.put(`${databaseKey}/api/v1/receivedPOFromGateInward`, id);
  }
}
