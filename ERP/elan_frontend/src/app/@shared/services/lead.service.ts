import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { id } from 'date-fns/locale';

const databaseKey: any = environment.servralUrl;
// const databaseKey1: any = environment.servralUrl1;
const routes = {
  lead: {
    createQuote: () => `${databaseKey}/api/v1/createquotation_details`,
    createItemDetails: (id: any) =>
      `${databaseKey}/api/v1/create_item_details/${id}`,
    get_productpricebycertificatetype: () =>
      `${databaseKey}/api/v1/get_productpricebycertificatetype`,

    bookedAuditor: () =>
      `${databaseKey}/api/v1/create_auditor_bookingattaskorder  `,
    raisedOrder: () => `${databaseKey}/api/v1/audit_booking  `,
    //
    multipleWorkOrderCreate: () => `${databaseKey}/api/v1/workOrderForLead`,
    multipleWorkOrderCreateNonCert: () =>
      `${databaseKey}/api/v1/workOrderForLeadnoncert`,
    requestForm: () => `${databaseKey}/api/v1/createinterCompany`,
    getRequestFormList: () => `${databaseKey}/api/v1/interCompanyList`,
    getByIdRqstForm: (interConpanyId: any) =>
      `${databaseKey}/api/v1/getbyInterCompany/${interConpanyId}`,
    putRqstorm: (interConpanyId: any) =>
      `${databaseKey}/api/v1/updatebyInterCompany/${interConpanyId}`,

    createLead: (id: any) => `${databaseKey}/api/v1/createleadmanagment/${id}`,
    createInvoice: () => `${databaseKey}/api/v1/create_manul_invoice`,
    createChildLead: () => `${databaseKey}/api/v1/createnewLocation`,

    getByIdChildNewLocation: (new_location_id: any) =>
      `${databaseKey}/api/v1/getbyleadnewLocation/${new_location_id}`, //vikash//
    getLead: () => `${databaseKey}/api/v1/getallleadmanagment`,
    getAllSalesPerson: () => `${databaseKey}/api/auth/allsalesPreson`,
    getAccount: (id: any) =>
      `${databaseKey}/api/v1/getAll_account_leadmanagment/${id}`,
    getLeadOpen: (lead_created_by_id: any) =>
      `${databaseKey}/api/v1/getallleadmanagmentopenstatus/${lead_created_by_id}`,
    getLeadValidate: () =>
      `${databaseKey}/api/v1/getallleadmanagmentValidatedstatus`,
    getLeadAssign: () =>
      `${databaseKey}/api/v1/getallleadmanagmentAssignedstatus`,
    getLeadQuotaion: () =>
      `${databaseKey}/api/v1/getAllleadmanagmentQuotationSent`,
    getPinCode: (cityId: any) =>
      `${databaseKey}/api/v1/getidpincodecontroller/${cityId}`,
    getPinCodeNew: (cityId: any) =>
      `${databaseKey}/api/v1/getpincodebycityid/${cityId}`,
    getRegionBuisness: (new_region_id: any) =>
      `${databaseKey}/api/v1/get_Bynew_regionId_new_regional_business_head/${new_region_id}`,
    getGlobalMSales: (new_region_id: any) =>
      `${databaseKey}/api/v1/get_Bynew_regionId_new_global_manager_sales/${new_region_id}`,
    getLeadApproved: () =>
      `${databaseKey}/api/v1/getallleadmanagmentApprovedstatus`,
    getLeadProspect: (id: any) =>
      `${databaseKey}/api/v1/getallleadmanagmentProspect/${id}`,
    getLeadAccount: (id: any) =>
      `${databaseKey}/api/v1/getallleadmanagmentAccount/${id}`,
    // getLeadOpportunity: () =>
    //   `${databaseKey}/api/v1/getallleadmanagmentOpportunity`,
    getLeadOpportunity: (id: any) =>
      `${databaseKey}/api/v1/getdataOpportunity/${id}`,

    getLeadSent: (user_id: any) =>
      `${databaseKey}/api/v1/getallapprover_name_l1/${user_id}`,
    get_contact: () => `${databaseKey}/api/v1/getAllcontactSource`,
    get_All_Channel_Partner: () =>
      `${databaseKey}/api/v1/get_All_Channel_Partner_Name`,

    // getLeadSent: () => `${databaseKey}/api/v1/getallleadmanagmentgetSentL1`,
    getLeadPreL1: (id: any) =>
      `${databaseKey}/api/v1/getAllleadmanagmentPreL1/${id}`,
    getLeadPreL1New: (id: any) =>
      `${databaseKey}/api/v1/getallapprover_name_l2/${id}`,

    getLeadPreL2: (id: any) =>
      `${databaseKey}/api/v1/getAllleadmanagmentPreL2/${id}`,
    getComp: () => `${databaseKey}/api/v1/getAllleadmanagmentNew`,
    editLead: (leadId: any) =>
      `${databaseKey}/api/v1/updateleadmanagment/${leadId}`,
    booking: () => `${databaseKey}/api/v1/pre_audit_booking_update_status`,

    //
    editContact: (leadId: any) =>
      `${databaseKey}/api/v1/editchildSite/${leadId}`,
    //
    getOpenHouseData: (br_number: any) =>
      `${databaseKey}/api/v1/getbybrnumberOpen_house_training/${br_number}`,
    sales_request: (leadId: any) =>
      `${databaseKey}/api/v1/sales_Request_For_leadmanagement/${leadId}`,
    updateCertificate: (certificate_id: any) =>
      `${databaseKey}/api/v1/editApprovel/${certificate_id}`,
    editLeadStatus: (leadId: any) =>
      `${databaseKey}/api/v1/edit_Verification_Status/${leadId}`,

    update_invoice_verification_comments: () =>
      `${databaseKey}/api/v1/create_manul_invoice`,
    //
    editChild: (childId: any) =>
      `${databaseKey}/api/v1/editchildSite/${childId}`,
    updateChildLead: (leadId: any) =>
      `${databaseKey}/api/v1/updatenewLocation/${leadId}`,
    editLeadDoc: (leadId: any) =>
      `${databaseKey}/api/v1/updateleadmanagmentfile/${leadId}`,
    getByIdLead: (leadId: any) =>
      `${databaseKey}/api/v1/getbyideadmanagment/${leadId}`,
    getBooked_Auditor: () =>
      `${databaseKey}/api/v1/auditor_bookingtaskorderList`,

    //
    getByIdDocument: (leadId: any) =>
      `${databaseKey}/api/v1/get_updated_leadmangement_doc/${leadId}`,
    getByIdCertificate: (leadId: any) =>
      `${databaseKey}/api/v1/getbyidcertificate/${leadId}`,
    //accept quote

    //create_line_items
    createLineItmes: (br: any) =>
      `${databaseKey}/api/v1/create_quation_invoicestatus/${br}`,
    getByIdLead1: (leadId: any) =>
      `${databaseKey}/api/v1/getnewLocation/${leadId}`,
    getByIdLeadChild: (leadId: any) =>
      `${databaseKey}/api/v1/getAllleadmanagmentwithchild/${leadId}`,

    deleteDays: (id: any) => `${databaseKey}/api/v1/deletemandays/${id}`,
    deleteChild: (id: any) => `${databaseKey}/api/v1/delete_childSite/${id}`,
    getChildLead: (id: any) => `${databaseKey}/api/v1/getchildsitebyid/${id}`,
    create_Status: () => `${databaseKey}/api/v1/createAdvancePlanningstatus`,
    getNonCertLead: () => `${databaseKey}/api/v1/getAllleadmanagmentnoncert`,

    //getChildLead
    getByIdLead_notification: (leadId: any) =>
      `${databaseKey}/api/v1/getbyidlead_management/${leadId}`,
    getByIdChildLead: (leadId: any) =>
      `${databaseKey}/api/v1/getnewLocation/${leadId}`,
    getByID_BR: (leadId: any) =>
      `${databaseKey}/api/v1/getchildbybr_numberprimary/${leadId}`,
    getLeadDataby_BR: (br: any) =>
      `${databaseKey}/api/v1/getAllChildSitewithbr/${br}`,

    //
    getByIdNewChild: (leadId: any) =>
      `${databaseKey}/api/v1/getchildsitewithid/${leadId}`,
    addStage: () => `${databaseKey}/api/v1/createcreatemandays`,
    createStage: () => `${databaseKey}/api/v1/createmand_for_workorder`,

    getStage: (br1: any) => `${databaseKey}/api/v1/getAllmandays/${br1}`,
    getStageByLead_id: (leadId: any) =>
      `${databaseKey}/api/v1/getAllleadmanagmentwithchild/${leadId}`,
    getPerform: () => `${databaseKey}/api/v1/getAllPerformInvoiceSent`,
    getWork: () => `${databaseKey}/api/v1/getallgetAllworkOrderCreated`,
    getSendForReview: () =>
      `${databaseKey}/api/v1/getAllleadmanagmentsendforreviewlist`,
    getSendForReviewList: () =>
      `${databaseKey}/api/v1/getAllleadmanagmentsendforreviewlist`,
    getQuotationSent: (id: any) =>
      `${databaseKey}/api/v1/getAllleadmanagmentQuotationSents/${id}`,
    getQuotation: (id: any) =>
      `${databaseKey}/api/v1/getAllleadmanagmentQuotations/${id}`,
    getSignedDoc: () => `${databaseKey}/api/v1/get_all_digitallySignedDocument`,
    snmHeadApproved: () => `${databaseKey}/api/v1/saleMarketingHeadApproved`,
    getDigitalSignedDoc: () => `${databaseKey}/api/v1/documentsSignedUploaded`,
    getOrder: () => `${databaseKey}/api/v1/get_document_signed`,
    getApprovedOne: () => `${databaseKey}/api/v1/getallleadmanagmentApproved1`,
    getQuoteAccepted: () =>
      `${databaseKey}/api/v1/getallleadmanagmentQuoteAccepte`,
    getWorkOne: () => `${databaseKey}/api/v1/getallgetAllworkOrderCreated1`,
    // getWorkLatest: () => `${databaseKey}/api/v1/getallworkOrderForLead`,
    getWorkLatest: () => `${databaseKey}/api/v1/workOrderListall_cert`,

    getWorkNonCert: () => `${databaseKey}/api/v1/workOrderListall_non`,
    // getBlockedAuditor: () => `${databaseKey}/api/v1/getallgetAllblockedauditor`,
    getBlockedAuditor: () => `${databaseKey}/api/v1/Check_find_PRE_AUDIT`,

    getBlockedTraining: () =>
      `${databaseKey}/api/v1/getall_status_audit_non_Blocked`,
    getTrainingResult: () => `${databaseKey}/api/v1/getAll_data_training_list`,

    getTaskOrder: () => `${databaseKey}/api/v1/getAllTaskOrderrejected`,
    getTaskOrderNew: (id: any) =>
      `${databaseKey}/api/v1/riseTaskOrerlist_PRE_AUDIT/${id}`,

    getTaskOrderDetails: () =>
      `${databaseKey}/api/v1/get_lead_taskordercreated_pre_audit_list`,

    //getTaskOrderDetails
    // getTaskOrderNew: () => `${databaseKey}/api/v1/getalltaskorderdetails`,

    getTaskOrderForPost: () => `${databaseKey}/api/v1/getAlltaskorderapproved`,
    getAllTechnicalReview: () =>
      `${databaseKey}/api/v1/get_All_Technical_Review`,
    getAllPaymentVerification: () =>
      `${databaseKey}/api/v1/get_All_Payment_Verification`,
    getAllRbhVerification: () =>
      `${databaseKey}/api/v1/get_All_RBH_Verification`,
    // localhost:5000/api/v1/getAllTaskOrderrejected

    getSMApproved: () => `${databaseKey}/api/v1/getallgetSMapproved`,
    getManagedDates: () => `${databaseKey}/api/v1/getallleadmanagmentl1reviews`,
    getUploadedDocs: () =>
      `${databaseKey}/api/v1/getallleadmanagmentdocumentuploaded`,
    getUploadDocu2: () =>
      `${databaseKey}/api/v1/getAllleadmanagmentDatesManaged`,
    getProformaInvoice: () =>
      `${databaseKey}/api/v1/getallgetPerforminvoicesent`,
    getL1Review: () => `${databaseKey}/api/v1/getallleadmanagmentl1reviews`,
    getStateByID: (countryId: any) =>
      `${databaseKey}/api/WL/getstatesbycountryid/${countryId}`,
    getCertificateByID: (certificate_type_id: any) =>
      `${databaseKey}/api/v1/get_BysegmentId_certificate_type/${certificate_type_id}`,
    getRegionBySegID: (certificate_type_id: any) =>
      `${databaseKey}/api/v1/get_BysegmentId_new_region/${certificate_type_id}`,
    getCategoryBySegID: (certificate_type_id: any) =>
      `${databaseKey}/api/v1/get_BysegmentId_new_category_master/${certificate_type_id}`,
    getAssesmentByID: (certificate_type_id: any) =>
      `${databaseKey}/api/v1/get_Bycertificate_typeId_new_spa/${certificate_type_id}`,
    getCityByID: (stateId: any) =>
      `${databaseKey}/api/WL/getcitybystateid/${stateId}`,
    getPriceTableData: (leadId: any) =>
      `${databaseKey}/api/v1/calculate2/${leadId}`,
    getUploadCertificate: () =>
      `${databaseKey}/api/v1/getallleadmanagmentdocumentuploaded`,
    // getInterCompanyList: () => `${databaseKey}/api/v1/interCompanyList`,
    getInterCompanyList: () =>
      `${databaseKey}/api/v1/getInterCompanyrequestraisedlist`,
    getInterCompanyListRecieved: () =>
      `${databaseKey}/api/v1/getInterCompanyrequestlist`,
    getVerifiedDqs: () => `${databaseKey}/api/v1/getAllleadmanagmentverified`,
    getVerifiedDqsDataSus: () => `${databaseKey}/api/v1/getverfiedData`,

    rbhApprovalList: () => `${databaseKey}/api/v1/get_widthdrawallsit`,

    //
    suspensionList: () => `${databaseKey}/api/v1/get_suspenselist`,
    get_suspenselist_on_conditions: () =>
      `${databaseKey}/api/v1/get_suspenselist_on_conditions`,
    //
    getNotificationData: (id: any) =>
      `${databaseKey}/api/v1/get_notificationlist/${id}`,
    updateRequest: (interCompanyId: any) =>
      `${databaseKey}/api/v1/updatebyInterCompany/${interCompanyId}`,
    getRequestById: (interCompanyId: any) =>
      `${databaseKey}/api/v1/getbyInterCompany/${interCompanyId}`,
    getPOReceived: () => `${databaseKey}/api/v1/getAllleadmanagmentPOReceived`,
    getRegionList: () => `${databaseKey}/api/v1/regionlist`,
    getBusinessHead: () => `${databaseKey}/api/auth/registrationallName`,
    getEmployeee: () => `${databaseKey}/api/auth/registrationallName`,
    getGlobalManager: () => `${databaseKey}/api/auth/allListGlobalSalesManager`,
    getRejection: () => `${databaseKey}/api/v1/getAllleadmanagmentRejection`,
    getOpenHouse: () => `${databaseKey}/api/v1/getAllleadmanagmentOpenHouseNew`,
    createUpload: () => `${databaseKey}/app/v1/createcertificatechild`,
    getByUploadCert: (id: any) =>
      `${databaseKey}/api/v1/getcertificateByleadId/${id}`,
    CreateViewCalender: () => `${databaseKey}/api/v1/createauditortable`,
    getByViewCalender: (id: any) =>
      `${databaseKey}/api/v1/getauditortable/${id}`,
    getByIdMangeCsv: (id: any) => `${databaseKey}/api/v1/upload_Csv_Date/${id}`,
    getUnderL1Date: () => `${databaseKey}/app/v1/getAllallselectedDate`,
    getByRolemenuAccess: (id: any) =>
      `${databaseKey}/api/v1/getrolemenuaccess/${id}`,
    createOpenHouse: () => `${databaseKey}/api/v1/createOpen_house_training`,
    createRevenue: () => `${databaseKey}/api/v1/create_Program_Estimate`,
    // getOpenHouseNew: () => `${databaseKey}/api/v1/getAllOpen_house_training`,
    getOpenHouseNew1: (id: any) =>
      `${databaseKey}/api/v1/getAllOpen_house_trainingone/${id}`,
    updateOpenHouse: (id: any) =>
      `${databaseKey}/api/v1/editOpen_house_training/${id}`,
    getRoleMenuAccess: (userId: any, assignById: any) =>
      `${databaseKey}/api/v1/getrolemenuaccess?userId=${userId}&assignById=${assignById}`,
    createAddParticipant: () => `${databaseKey}/api/v1/createAdd_participant`,
    updateAddparticipant: (id: any) =>
      `${databaseKey}/api/v1/editAdd_participant/${id}`,
    updateRevenueData: (id: any) =>
      `${databaseKey}/api/v1/update_Program_Estimate/${id}`,
    updateAssumption: (id: any) =>
      `${databaseKey}/api/v1/update_assimption/${id}`,
    updateOvershotData: (id: any) =>
      `${databaseKey}/api/v1/update_overshot/${id}`,
    getByAddParticipant: (lead_id: any, addId: any) =>
      `${databaseKey}/api/v1/getbyidparticipant?lead_genration_id=${lead_id}&open_house_training_id=${addId}`,
    getByIdOpenHouseTraining: (id: any) =>
      `${databaseKey}/api/v1/getbyIdOpen_house_training/${id}`,
    getById_Program_Estimate: (id: any) =>
      `${databaseKey}/api/v1/getby_open_house_training_id/${id}`,
    getbyIdOpenHouseHrms: (id: any) =>
      `${databaseKey}/api/v1/getbyopenIdOpen_house_training/${id}`,
    createTravelRequest: () => `${databaseKey}/api/v1/createtravelRequest`,
    getTravelRequest: () => `${databaseKey}/api/v1/travelrequestlist`,
    getByIdTravel: (id: any) =>
      `${databaseKey}/api/v1/getbytravelrequest/${id}`,
    updateTravel: (id: any) =>
      `${databaseKey}/api/v1/updatetravelrequest/${id}`,
    createTravelTicket: () => `${databaseKey}/api/v1/createtravelticket`,
    getTravelTicket: (id: any) =>
      `${databaseKey}/api/v1/travelticketlist/${id}`,
    getByTravelTicket: (id: any) =>
      `${databaseKey}/api/v1/getbytravelticket/${id}`,
    updateTravelTicket: (id: any) =>
      `${databaseKey}/api/v1/updatetravelticket/${id}`,
    updateBookTicketFile: (id: any) =>
      `${databaseKey}/api/v1/updatestatustravelticket/${id}`,
    getByexpenceDetails: (id: any) =>
      `${databaseKey}/api/v1/getbyexpensedetails/${id}`,
    getByExpenseTicketBy: (id: any) =>
      `${databaseKey}/api/v1/getbytravelticketbyid/${id}`,
    getTravelTicketCopy: (id: any, id2: any) =>
      `${databaseKey}/api/v1/travelticketlist/${id}/${id2}`,
    getTravelTicketConfirmcopy: (id: any, id2: any) =>
      `${databaseKey}/api/v1/travelticketlist_status/${id}/${id2}`,
    getAllTravelDraft: () => `${databaseKey}/api/v1/travelrequestdraftlist`,
    updateTravelRequest: (id: any) =>
      `${databaseKey}/api/v1/update_ExpenseRequest/${id}`,
    getSnmHeadApproval: () => `${databaseKey}/api/v1/getbySalesHeadApproval`,

    // api/v1/update_ExpenseRequest/:id

    //GetAll RA TRA List
    getAllRaTraList: () => `${databaseKey}/api/v1/getAll_ra_tra_list`,
    get_All_BR_Number: (lead_id: any) =>
      `${databaseKey}/api/v1/get_ById_BRNumber/${lead_id}`,
    updateInvoice: (br: any) =>
      `${databaseKey}/api/v1/updateinlineinvoicestatus/${br}`,
    //
    getAllBR_onTASK_Order: () =>
      `${databaseKey}/api/v1/getAllTaskOrderrejectedlist`,
    book_auditor: (id: any) =>
      `${databaseKey}/api/v1/edit_Auditor_Qualification/${id}`,
    assesList: () => `${databaseKey}/api/v1/getAll_new_spa`,
    inline_create_invoice: () => `${databaseKey}/api/v1/createinlineinvoice`,
    quotation_create: () => `${databaseKey}/api/v1/create_new_quation`,
    quotation_create_invoice: (br: any) =>
      `${databaseKey}/api/v1/update_quation_status/${br}`,

    //quotation_create_invoice
    get_ById_BR_Number: (br: any) =>
      `${databaseKey}/api/v1/get_ById_BR_Number/${br}`,
    InvoiceLineItems: (id: any) =>
      `${databaseKey}/api/v1/getinvoice_detail_list/${id}`,
    get_invoice_verification: (id: any) =>
      `${databaseKey}/api/v1/invoice_getById/${id}`,
    get_auditor_by_id: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Auditor_Qualification/${id}`,
    InvoiceLineItemsChecks: (id: any) =>
      `${databaseKey}/api/v1/getinvoice_detail/${id}`,
    QuotationLineItemsChecks: (id: any) =>
      `${databaseKey}/api/v1/get_quotation_detail/${id}`,

    //
    getPdf_Inline: (br: any) =>
      `${databaseKey}/api/v1/get_quation_status/${br}`,

    //
    getByTravelTicketConfirm: () => `${databaseKey}/api/v1/getbytravelticket`,
    // getByTravelTicketConfirm:()=>`${databaseKey}/api/v1/getbytravelticket`,
    createMultipleCont: () => `${databaseKey}/api/v1/createNewSite`,
    getMultipleCont: (id: any) => `${databaseKey}/api/v1/getAllChildSite/${id}`,
    responstReq: () => `${databaseKey}/api/v1/responstOfficeReq`,
    postAuditVeriusDataPatch: (id: any) =>
      `${databaseKey}/api/v1/upload_Certificate_Data/${id}`,
    postAuditL1reviewDataPatch: (id: any) =>
      `${databaseKey}/api/v1/Create_L1_Review/${id}`,
    updateL1ReviewFile: (id: any) =>
      `${databaseKey}/api/v1/upload_CSV_L1_Reviewer/${id}`,

    // get price Slab based on product
    getPriceSlabBYleadId: (id: any) =>
      `${databaseKey}/api/v1/getproductslabwithleadId/${id}`,

    // get Account information for post audit payment verification
    getPreviousAcountDetails: (id: any) =>
      `${databaseKey}/api/v1/get_All_Post_AuditDetails/${id}`,
    getCurrentAcountDetails: (id: any) =>
      `${databaseKey}/api/v1/get_All_Pre_AuditDetails/${id}`,
    getAllAuditManagement: () => `${databaseKey}/api/v1/get_aduitor_emp`,
    getAllAuditManagementss: () =>
      `${databaseKey}/api/auth/get_All_Aduitorlistwithname`,
    auditor_maping: (id: any) =>
      `${databaseKey}/api/v1/get_auditorMappingbyId/${id}`,
    //
    updateAddAuditor: () => `${databaseKey}/api/v1/create_auditorMapping`,
    update_auditorbyid: (map_id: any) =>
      `${databaseKey}/api/v1/update_auditorbyid/${map_id}`,
    get_by_idAuditor: (id: any) =>
      `${databaseKey}/api/v1/get_auditorbyid/${id}`,

    //
    // get Advance Payment get_by_idAuditor
    getAllAdvancePayment: () => `${databaseKey}/api/v1/getallAdvancePayment`,

    // get All Rejected Auditor report

    getAllRejectedReport: () =>
      `${databaseKey}/api/v1/getAllrejected_auditor_status`,
    getRejectedReportById: (id: any) =>
      `${databaseKey}/api/v1/getAllrejected_auditor_statusbyleadid/${id}`,

    create_manual_invoice: () => `${databaseKey}/api/v1/create_manual_invoice`,
    manual_By_Id: (id: any) =>
      `${databaseKey}/api/v1/get_manaual_invoice_byId/${id}`,

    getdocById: (id: any) =>
      `${databaseKey}/api/v1/get_ByleadId_review_doc/${id}`,
    leadAssignRole: (id: any) =>
      `${databaseKey}/api/v1/getAllleadmanagmentassigned/${id}`,
    leadFirstStageGet: (id: any) =>
      `${databaseKey}/api/v1/getAllleadmanagmentfirststage/${id}`,
    getAllApproverNew: () => `${databaseKey}/api/auth/alll1approver`,
    getAllApproverL2New: () => `${databaseKey}/api/auth/alll2approver`,
    getQuotationlistnew: (id: any) =>
      `${databaseKey}/api/v1/getAllPrepareQuations/${id}`,
    getExistingCustomerCreate: (id: any) =>
      `${databaseKey}/api/v1/get_child_data/${id}`,
    getCompletnessCheck: (id: any) =>
      `${databaseKey}/api/v1/get_all_completeness_check/${id}`,
    getAllAgent: () => `${databaseKey}/api/auth/allListAgent`,
    getAllQuotationListNew: (id: any) =>
      `${databaseKey}/api/v1/getAllPrepareQuationList/${id}`,
    getAllSMapprovelNew: (id: any) =>
      `${databaseKey}/api/v1/getAllleadmanagmentApprovedone/${id}`,
    getAllSmApprovedNew: (id: any) =>
      `${databaseKey}/api/v1/getallgetSMApprovedOne/${id}`,
    getSignedDocNew: (id: any) =>
      `${databaseKey}/api/v1/get_all_digitallySignedDocumentOne/${id}`,
    getAllMakePaymentNew: (id: any) =>
      `${databaseKey}/api/v1/getallAdvancePaymentOne/${id}`,
    getAllFeaPendingNew: (id: any) =>
      `${databaseKey}/api/v1/sentFEAApprovalPendingOne/${id}`,
    getAllFeaApprovelNew: (id: any) =>
      `${databaseKey}/api/v1/get_approvalListOne/${id}`,

    getChildLeadById: (id: any) =>
      `${databaseKey}/api/v1/getbynewLocationforlead/${id}`,
    updateChildLeadById: (id: any) =>
      `${databaseKey}/api/v1/updatenewLocation/${id}`,
    updateSlabQuote: (id: any) =>
      `${databaseKey}/api/v1/updateLeadManagmentslabquote/${id}`,
    getAllSMHeadApprovelNew: (id: any) =>
      `${databaseKey}/api/v1/getbySalesHeadApproval/${id}`,
    getAllCancelTicket: (id: any, id2: any) =>
      `${databaseKey}/api/v1/travelticketcancellist/${id}/${id2}`,
    createExpenseMaster: () => `${databaseKey}/api/v1/create_expense_master`,
    updateExpenseMaster: (id: any) =>
      `${databaseKey}/api/v1/update_expense_master/${id}`,
    getAllExpenseMaster: (entity_id: any) =>
      `${databaseKey}/api/v1/getAll_expense_master/${entity_id}`,
    getByexpenseMaster: (id: any) =>
      `${databaseKey}/api/v1/get_ById_expense_master/${id}`,
    expenseDetailDelete: (id: any) =>
      `${databaseKey}/api/v1/delete_exp_detail/${id}`,
    myExpenseDraftGet: () => `${databaseKey}/api/v1/myExpenselistdraft`,
    getbr_no: () => `${databaseKey}/api/v1/get_all_Br_number`,
    leadData_br_number: (br: any) =>
      `${databaseKey}/api/v1/lead_Data_on_br_number/${br}`,
  },
  adv_planning_suspensen_withdrawal: {
    RA_TRA_LIST: () => `${databaseKey}/api/v1/getAllleadmanagmenttaskOrder_no`,
    get_invoice_request_list: () => `${databaseKey}/api/v1/getAll_invoice`,
    get_invoice_list: () => `${databaseKey}/api/v1/getinvoice_detail_status`,
    getInvoiceListCopy: () => `${databaseKey}/api/v1/getAllBR_invoice`,
    //
    updatedbyCSP: () => `${databaseKey}/api/v1/createadvanceplanning`,
    updatedListByLead_id: (id: any) =>
      `${databaseKey}/api/v1/advanceplanninglist/${id}`,
    notificationUpdatedListByLead_id: (id: any) =>
      `${databaseKey}/api/v1/createap_notification/${id}`,
    updatewidthdrawalstatus: (id: any) =>
      `${databaseKey}/api/v1/updatewidthdrawalstatus/${id}`,
    //certificate_update
    certificate_update: (id: any) =>
      `${databaseKey}/api/v1/updateleadmanagment/${id}`,

    getWidthdrawal: () => `${databaseKey}/api/v1/get_widthdrawallsit`,
    getallFeaList: () =>
      `${databaseKey}/api/v1/getAll_fea_approved_leadmanagment`,
    getallFeaApprovelList: () =>
      `${databaseKey}/api/v1/getAll_sent_fea_approvel_leadmanagment`,
    getallFeaApprovelList2: () => `${databaseKey}/api/v1/get_approvalList`,

    //
    getallFeaPendingList: () => `${databaseKey}/api/v1/sentFEAApprovalPending`,

    //
    upload_other_doc: (id: any) =>
      `${databaseKey}/api/v1/update_leadmangement_doc/${id}`,
    //
  },

  manual_invoice: {
    get_all_manual_invoice: () => `${databaseKey}/api/v1/get_all_pendings_data`,
    get_all_approve_data: () => `${databaseKey}/api/v1/get_all_approve_data`,
    get_all_rejected_data: () =>
      `${databaseKey}/api/v1/manual_invoice_rejected_data`,
    aproved_manual_invoice: (id: any) =>
      `${databaseKey}/api/v1/approve_manual_invoice/${id}`,
    reject_manual_invoice: (id: any) =>
      `${databaseKey}/api/v1/rejecte_manual_invoice/${id}`,
    get_alldata_zoho_invoice: (id: any) =>
      `${databaseKey}/api/v1/get_alldata_zoho_invoice/${id}`,
  },
  upload_more_doc: {
    upload_more_doc: (id: any) =>
      `${databaseKey}/api/v1/updatel1review_doc/${id}`,
    update_doc_status: (id: any) =>
      `${databaseKey}/api/v1/updatestatusl1review_doc/${id}`,
  },

  interCompany: {
    getbyInterCompanyByID: (id: any) =>
      `${databaseKey}/api/v1/intercompany_get_by_id/${id}`,
    update_interCompany_ByID: (id: any) =>
      `${databaseKey}/api/v1/rasied_request_intercompany_get_by_id/${id}`,
  },

  open_house_training: {
    create_payment: () =>
      `${databaseKey}/api/v1/createpaymentfor_open_house_training`,
    craete_registration: () =>
      `${databaseKey}/api/v1/createRegisterfor_openHouse_participants`,
  },
};
@Injectable({
  providedIn: 'root',
})
export class LeadService {
  newData: any;
  changeColor: any = new BehaviorSubject(false);
  
  constructor(private httpclient: HttpClient) {}

  // **********************Advance Planning suspensen withdrawal***********************************

  RA_TRA_LIST() {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.RA_TRA_LIST()
    );
  }

  //
  get_invoice_request_list() {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.get_invoice_request_list()
    );
  }
  get_invoice_list() {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.get_invoice_list()
    );
  }

  getInvoiceListCopy() {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.getInvoiceListCopy()
    );
  }
  //

  updatedbyCSP(data: any) {
    return this.httpclient.post(
      routes.adv_planning_suspensen_withdrawal.updatedbyCSP(),
      data
    );
  }
  updatedListByLead_id(id: any) {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.updatedListByLead_id(id)
    );
  }
  notificationUpdatedListByLead_id(id: any, data: any) {
    return this.httpclient.post(
      routes.adv_planning_suspensen_withdrawal.notificationUpdatedListByLead_id(
        id
      ),
      data
    );
  }
  certificate_update(id: any, data: any) {
    return this.httpclient.put(
      routes.adv_planning_suspensen_withdrawal.certificate_update(id),
      data
    );
  }
  updatewidthdrawalstatus(id: any, data: any) {
    return this.httpclient.patch(
      routes.adv_planning_suspensen_withdrawal.updatewidthdrawalstatus(id),
      data
    );
  }
  //
  getWidthdrawal() {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.getWidthdrawal()
    );
  }

  //

  // *********************************************************
  //
  get_All_BR_Number(lead_id: any): Observable<any> {
    return this.httpclient.get(routes.lead.get_All_BR_Number(lead_id));
  }
  updateInvoice(br: any, data: any): Observable<any> {
    return this.httpclient.put(routes.lead.updateInvoice(br), data);
  }

  //

  create_manual_invoice(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.create_manual_invoice(), data);
  }

  manualById(id: any) {
    return this.httpclient.get(routes.lead.manual_By_Id(id));
  }

  inline_create_invoice(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.inline_create_invoice(), data);
  }
  quotation_create(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.quotation_create(), data);
  }

  quotation_create_invoice(br: any, data: any): Observable<any> {
    return this.httpclient.put(routes.lead.quotation_create_invoice(br), data);
  }

  //
  getAllBR_onTASK_Order() {
    return this.httpclient.get(routes.lead.getAllBR_onTASK_Order());
  }
  listAsses(): Observable<any> {
    return this.httpclient.get(routes.lead.assesList());
  }

  book_auditor(id: any, data: any) {
    return this.httpclient.put(routes.lead.book_auditor(id), data);
  }

  //Invoice and Quotation
  InvoiceLineItemsChecks(id: any, data: any) {
    return this.httpclient.post(routes.lead.InvoiceLineItemsChecks(id), data);
  }
  QuotationLineItemsChecks(id: any, data: any) {
    return this.httpclient.post(routes.lead.QuotationLineItemsChecks(id), data);
  }
  getPdf_Inline(br: any) {
    return this.httpclient.get(routes.lead.getPdf_Inline(br));
  }
  //
  InvoiceLineItems(id: any) {
    return this.httpclient.get(routes.lead.InvoiceLineItems(id));
  }
  get_invoice_verification(id: any) {
    return this.httpclient.get(routes.lead.get_invoice_verification(id));
  }
  getbyidauditor(id: any) {
    return this.httpclient.get(routes.lead.get_auditor_by_id(id));
  }
  //
  get_ById_BR_Number(br: any) {
    return this.httpclient.get(routes.lead.get_ById_BR_Number(br));
  }
  getAllRaList(): Observable<any> {
    return this.httpclient.get(routes.lead.getAllRaTraList());
  }

  getByIdLead(leadId: any) {
    return this.httpclient.get(routes.lead.getByIdLead(leadId));
  }
  getBooked_Auditor(data: any) {
    return this.httpclient.post(routes.lead.getBooked_Auditor(), data);
  }

  //
  getByIdDocument(leadId: any) {
    return this.httpclient.get(routes.lead.getByIdDocument(leadId));
  }
  getByIdCertificate(leadId: any) {
    return this.httpclient.get(routes.lead.getByIdCertificate(leadId));
  }

  getByIdLeadId(leadId: any) {
    return this.httpclient.get(routes.lead.getByIdLead1(leadId));
  }
  getByIdChild(leadId: any) {
    return this.httpclient.get(routes.lead.getByIdLeadChild(leadId));
  }
  createLineItmes(br: any, data: any) {
    return this.httpclient.post(routes.lead.createLineItmes(br), data);
  }
  //
  //Delete ManDays
  deleteMandays(id: any) {
    return this.httpclient.delete(routes.lead.deleteDays(id));
  }

  getByIdLead_notification(leadId: any) {
    return this.httpclient.get(routes.lead.getByIdLead_notification(leadId));
  }

  //getchildbybr_numberprimary

  getByIdChildLead(leadId: any) {
    return this.httpclient.get(routes.lead.getByIdChildLead(leadId));
  }
  getByID_BR(leadId: any) {
    return this.httpclient.get(routes.lead.getByID_BR(leadId));
  }
  getLeadDataby_BR(br: any) {
    return this.httpclient.get(routes.lead.getLeadDataby_BR(br));
  }

  getByIdNewChild(leadId: any) {
    return this.httpclient.get(routes.lead.getByIdNewChild(leadId));
  }

  editLead(leadId: any, data: any) {
    return this.httpclient.put(routes.lead.editLead(leadId), data);
  }

  booking(data: any) {
    return this.httpclient.post(routes.lead.booking(), data);
  }

  //
  editContact(leadId: any, data: any) {
    return this.httpclient.put(routes.lead.editContact(leadId), data);
  }
  getOpenHouseData(br_number: any) {
    return this.httpclient.get(routes.lead.getOpenHouseData(br_number));
  }
  updateChildLead(leadId: any, data: any) {
    return this.httpclient.put(routes.lead.updateChildLead(leadId), data);
  }
  sales_request(leadId: any, data: any) {
    return this.httpclient.put(routes.lead.sales_request(leadId), data);
  }

  //
  createQuote(data: any) {
    return this.httpclient.post(routes.lead.createQuote(), data);
  }
  updateCertificate(certificate_id: any, data: any) {
    return this.httpclient.put(
      routes.lead.updateCertificate(certificate_id),
      data
    );
  }

  editLeadStatusValue(leadId: any, data: any) {
    return this.httpclient.put(routes.lead.editLeadStatus(leadId), data);
  }
  update_invoice_verification_comments(data: any) {
    return this.httpclient.post(
      routes.lead.update_invoice_verification_comments(),
      data
    );
  }
  //
  editChildLead(child: any, data: any) {
    return this.httpclient.put(routes.lead.editChild(child), data);
  }

  deleteChildLead(child: any) {
    return this.httpclient.delete(routes.lead.deleteChild(child));
  }
  getChildLead(child: any) {
    return this.httpclient.get(routes.lead.getChildLead(child));
  }
  create_Status(data: any) {
    return this.httpclient.post(routes.lead.create_Status(), data);
  }
  editLeadDoc(leadId: any, data: any) {
    console.log('data status-->', data.status);
    const formData = new FormData();
    formData.append('contact_review_form', data.contact_review_form);
    formData.append('gst_file', data.gst_file);
    formData.append('basic_form', data.basic_form);
    formData.append('company_logo', data.company_logo);
    formData.append('document_remark', data.document_remark);
    formData.append('other_file', data.other_file);
    return this.httpclient.put(routes.lead.editLeadDoc(leadId), formData);
  }

  editLeadDoc_Status(leadId: any, data: any) {
    const formData = new FormData();
    console.log('data for status--->', data);
    formData.append('contact_review_form', data.contact_review_form);
    formData.append(
      'contact_review_form_status',
      data.contact_review_form_status
    );
    formData.append('gst_file', data.gst_file);
    formData.append('gst_file_status', data.gst_file_status);
    formData.append('basic_form', data.basic_form);
    formData.append('Basic_Form_status', data.Basic_Form_status);
    formData.append('company_logo', data.company_logo);
    formData.append('compnay_logo_file_status', data.compnay_logo_file_status);
    // formData.append('other_file', data.other_file);
    // formData.append('other_status', data.other_status);
    formData.append('document_remark', data.document_remark);

    return this.httpclient.put(routes.lead.editLeadDoc(leadId), formData);
  }

  getByNewLocationChild(new_location_id: any): Observable<any> {
    return this.httpclient.get(
      routes.lead.getByIdChildNewLocation(new_location_id)
    );
  }

  getAccountMaster(id: any) {
    return this.httpclient.get(routes.lead.getAccount(id));
  }

  getLead() {
    return this.httpclient.get(routes.lead.getLead());
  }
  getAllSalesPerson() {
    return this.httpclient.get(routes.lead.getAllSalesPerson());
  }
  getLeadOpen(lead_created_by_name: any) {
    return this.httpclient.get(routes.lead.getLeadOpen(lead_created_by_name));
  }

  getLeadValidate() {
    return this.httpclient.get(routes.lead.getLeadValidate());
  }
  getLeadAssign() {
    return this.httpclient.get(routes.lead.getLeadAssign());
  }
  getLeadQuotaion() {
    return this.httpclient.get(routes.lead.getLeadQuotaion());
  }
  getLeadApproved() {
    return this.httpclient.get(routes.lead.getLeadApproved());
  }
  getLeadProspect(id: any) {
    return this.httpclient.get(routes.lead.getLeadProspect(id));
  }
  getLeadAccount(id: any) {
    return this.httpclient.get(routes.lead.getLeadAccount(id));
  }
  getLeadOpportunity(id: any) {
    return this.httpclient.get(routes.lead.getLeadOpportunity(id));
  }
  getLeadSent(user_id: any) {
    return this.httpclient.get(routes.lead.getLeadSent(user_id));
  }
  get_contact() {
    return this.httpclient.get(routes.lead.get_contact());
  }
  get_All_Channel_Partner() {
    return this.httpclient.get(routes.lead.get_All_Channel_Partner());
  }
  getLeadPreL1(id: any) {
    return this.httpclient.get(routes.lead.getLeadPreL1(id));
  }
  getLeadPreL2(id: any) {
    return this.httpclient.get(routes.lead.getLeadPreL2(id));
  }
  getCompany() {
    return this.httpclient.get(routes.lead.getComp());
  }
  createLead(id: any, data: any) {
    return this.httpclient.post(routes.lead.createLead(id), data);
  }
  createInvoice(data: any) {
    return this.httpclient.post(routes.lead.createInvoice(), data);
  }
  createChildLead(data: any) {
    return this.httpclient.post(routes.lead.createChildLead(), data);
  }
  // Request Form
  rqstFormGet() {
    return this.httpclient.get(routes.lead.getRequestFormList());
  }
  getRequestt(data: any) {
    return this.httpclient.post(routes.lead.requestForm(), data);
  }
  //  Region List {mat select}
  regionListGet() {
    return this.httpclient.get(routes.lead.getRegionList());
  }
  // business head list {mat select}
  getListBusiness() {
    return this.httpclient.get(routes.lead.getBusinessHead());
  }
  // empppp
  getListEMP() {
    return this.httpclient.get(routes.lead.getEmployeee());
  }

  //  GLobal manager sales {mat select}
  getGlobalSalesM() {
    return this.httpclient.get(routes.lead.getGlobalManager());
  }

  setColor(is: boolean) {
    this.changeColor.next(is);
  }
  getColor() {
    return this.changeColor;
  }

  addStage(data: any) {
    return this.httpclient.post(routes.lead.addStage(), data);
  }
  getStage(leadId: any) {
    return this.httpclient.get(routes.lead.getStage(leadId));
  }
  getStageByLeadId(leadId: any) {
    return this.httpclient.get(routes.lead.getStageByLead_id(leadId));
  }
  getPerform() {
    return this.httpclient.get(routes.lead.getPerform());
  }
  getWork() {
    return this.httpclient.get(routes.lead.getWork());
  }
  getSendForReviewList() {
    return this.httpclient.get(routes.lead.getSendForReviewList());
  }
  getQuotationSent(id: any) {
    return this.httpclient.get(routes.lead.getQuotationSent(id));
  }
  getQuotation(id: any) {
    return this.httpclient.get(routes.lead.getQuotation(id));
  }
  getSignedDoc() {
    return this.httpclient.get(routes.lead.getSignedDoc());
  }
  snmHeadApproved() {
    return this.httpclient.get(routes.lead.snmHeadApproved());
  }
  getDigitalSignedDoc() {
    return this.httpclient.get(routes.lead.getDigitalSignedDoc());
  }
  getOrder() {
    return this.httpclient.get(routes.lead.getOrder());
  }
  getApprovedOne() {
    return this.httpclient.get(routes.lead.getApprovedOne());
  }
  getQuoteAccepted() {
    return this.httpclient.get(routes.lead.getQuoteAccepted());
  }
  getBlockedAuditor() {
    return this.httpclient.get(routes.lead.getBlockedAuditor());
  }
  getTrainingAuditor() {
    return this.httpclient.get(routes.lead.getBlockedTraining());
  }
  getTrainingResult() {
    return this.httpclient.get(routes.lead.getTrainingResult());
  }
  getTaskOrder() {
    return this.httpclient.get(routes.lead.getTaskOrder());
  }
  getTaskOrderNew(id: any) {
    return this.httpclient.get(routes.lead.getTaskOrderNew(id));
  }
  getTaskOrderDetails(data: any) {
    return this.httpclient.post(routes.lead.getTaskOrderDetails(), data);
  }
  getApprovalTaskOrder() {
    return this.httpclient.get(routes.lead.getTaskOrderForPost());
  }
  getAllTechnicalReview() {
    return this.httpclient.get(routes.lead.getAllTechnicalReview());
  }
  getAllPaymentVerification() {
    return this.httpclient.get(routes.lead.getAllPaymentVerification());
  }

  getAllRbhVerification() {
    return this.httpclient.get(routes.lead.getAllRbhVerification());
  }
  getSMApproved() {
    return this.httpclient.get(routes.lead.getSMApproved());
  }
  getProformaInvoice() {
    return this.httpclient.get(routes.lead.getProformaInvoice());
  }
  getWorkOne() {
    return this.httpclient.get(routes.lead.getWorkOne());
  }
  getWorkLatest() {
    return this.httpclient.get(routes.lead.getWorkLatest());
  }
  getWorkNonCert() {
    return this.httpclient.get(routes.lead.getWorkNonCert());
  }
  getL1Reviewed(): Observable<any> {
    return this.httpclient.get(routes.lead.getL1Review());
  }
  getStateByID(countryId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getStateByID(countryId));
  }
  getCertificateByID(certificateId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getCertificateByID(certificateId));
  }
  getRegionByID(certificateId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getRegionBySegID(certificateId));
  }
  getCategoryBySegID(certificateId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getCategoryBySegID(certificateId));
  }
  getAssesmentByID(certificate_id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getAssesmentByID(certificate_id));
  }

  getCityByID(stateId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getCityByID(stateId));
  }
  getSendForReview(): Observable<any> {
    return this.httpclient.get(routes.lead.getSendForReview());
  }
  getPinCode(cityId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getPinCode(cityId));
  }
  getPinCodeNew(cityId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getPinCodeNew(cityId));
  }
  getRBuisnessHead(new_region_id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getRegionBuisness(new_region_id));
  }
  getGlobalManagerSales(new_region_id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getGlobalMSales(new_region_id));
  }
  getManagedDates(): Observable<any> {
    return this.httpclient.get(routes.lead.getManagedDates());
  }
  getUploadedDocs(): Observable<any> {
    return this.httpclient.get(routes.lead.getUploadedDocs());
  }

  getUploadDoc2(): Observable<any> {
    return this.httpclient.get(routes.lead.getUploadDocu2());
  }
  getPriceTableData(leadId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getPriceTableData(leadId));
  }

  getUploadCertificates(): Observable<any> {
    return this.httpclient.get(routes.lead.getUploadCertificate());
  }

  getInterCompanyList(): Observable<any> {
    return this.httpclient.get(routes.lead.getInterCompanyList());
  }
  getInterCompanyListRecieved(): Observable<any> {
    return this.httpclient.get(routes.lead.getInterCompanyListRecieved());
  }

  addRequest(data: any) {
    return this.httpclient.post(
      databaseKey + '/api/v1/createinterCompany',
      data
    );
  }

  getVerifiedDqsData(): Observable<any> {
    return this.httpclient.get(routes.lead.getVerifiedDqs());
  }
  getVerifiedDqsDataSus(): Observable<any> {
    return this.httpclient.get(routes.lead.getVerifiedDqsDataSus());
  }
  rbhApprovalList(): Observable<any> {
    return this.httpclient.get(routes.lead.rbhApprovalList());
  }

  suspensionList(): Observable<any> {
    return this.httpclient.get(routes.lead.suspensionList());
  }

  get_suspenselist_on_conditions(): Observable<any> {
    return this.httpclient.get(routes.lead.get_suspenselist_on_conditions());
  }
  //
  getNotificationData(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getNotificationData(id));
  }

  //
  updateRequest(interCompanyId: any, data: any) {
    return this.httpclient.put(routes.lead.updateRequest(interCompanyId), data);
  }
  getRequestById(interCompanyId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getRequestById(interCompanyId));
  }

  getPOReceived(): Observable<any> {
    return this.httpclient.get(routes.lead.getPOReceived());
  }
  getRejection(): Observable<any> {
    return this.httpclient.get(routes.lead.getRejection());
  }

  getOpenHouse(): Observable<any> {
    return this.httpclient.get(routes.lead.getOpenHouse());
  }

  createUploadile(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.createUpload(), data);
  }

  getByUpladCertificate(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getByUploadCert(id));
  }

  createViewCalender(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.CreateViewCalender(), data);
  }

  getByViewCalender(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getByViewCalender(id));
  }

  getByIdCsvMange(id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.lead.getByIdMangeCsv(id), data);
  }

  getUnderL1Date(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.getUnderL1Date(), data);
  }

  getbyRoleAssign(id: any) {
    return this.httpclient.get(routes.lead.getByRolemenuAccess(id));
  }

  getROlemenuAccess(userId: any, assignById: any): Observable<any> {
    return this.httpclient.get(
      routes.lead.getRoleMenuAccess(userId, assignById)
    );
  }
  createOpenHouse(data: any) {
    return this.httpclient.post(routes.lead.createOpenHouse(), data);
  }
  createRevenue(data: any) {
    return this.httpclient.post(routes.lead.createRevenue(), data);
  }
  updateRevenue(data: any, Program_Estimate_id: any) {
    return this.httpclient.put(
      routes.lead.updateRevenueData(Program_Estimate_id),
      data
    );
  }
  updateAssumption(data: any, Program_Estimate_id: any) {
    return this.httpclient.put(
      routes.lead.updateAssumption(Program_Estimate_id),
      data
    );
  }
  updateOvershot(data: any, Program_Estimate_id: any) {
    return this.httpclient.put(
      routes.lead.updateOvershotData(Program_Estimate_id),
      data
    );
  }
  getById_Program_Estimate(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getById_Program_Estimate(id));
  }
  // getOpenHouseNew() {
  //   return this.httpclient.get(routes.lead.getOpenHouseNew());
  // }
  getOpenHouseNew1(id: any) {
    return this.httpclient.get(routes.lead.getOpenHouseNew1(id));
  }
  updateOpenHouse(id: any, data: any) {
    return this.httpclient.put(routes.lead.updateOpenHouse(id), data);
  }

  createAddParticipants(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.createAddParticipant(), data);
  }

  updateAddParticipants(id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.lead.updateAddparticipant(id), data);
  }

  getByAddParticipant(lead_id: any, addId: any): Observable<any> {
    return this.httpclient.get(routes.lead.getByAddParticipant(lead_id, addId));
  }
  getByIdOpenHouseTraining(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getByIdOpenHouseTraining(id));
  }

  getbyOpenHouseHrms(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getbyIdOpenHouseHrms(id));
  }

  createTravelRequest(data: any, file: File): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('expense_approval', file, file.name);
    } else {
      formData.append('expense_approval', 'undefined');
    }
    for (let key in data) {
      formData.append(`${key}`, data[key]);
    }

    return this.httpclient.post(routes.lead.createTravelRequest(), formData);
  }

  getTravelRequest() {
    return this.httpclient.get(routes.lead.getTravelRequest());
  }

  getByIdTravel(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getByIdTravel(id));
  }

  updateTravel(id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.lead.updateTravel(id), data);
  }

  createTravelTicket(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.createTravelTicket(), data);
  }
  getTravelTicket(id: any) {
    return this.httpclient.get(routes.lead.getTravelTicket(id));
  }
  getByTravelTicket(id: any) {
    return this.httpclient.get(routes.lead.getByTravelTicket(id));
  }

  updateTravelTiket(id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.lead.updateTravelTicket(id), data);
  }

  updateBookTicketFile(id: any, data: any) {
    return this.httpclient.put(routes.lead.updateBookTicketFile(id), data);
  }

  getByExpenseDetails(id: any) {
    return this.httpclient.get(routes.lead.getByexpenceDetails(id));
  }

  messageSubject = new Subject<any>();
  sayMessage(message: any) {
    this.messageSubject.next(message);
  }

  ticketSubject = new Subject<any>();
  ticket(ticke: any) {
    this.ticketSubject.next(ticke);
  }

  ticketIdCopy = new Subject<any>();
  ticketIdShare(id: any) {
    this.ticketIdCopy.next(id);
  }

  getByTravelTicketConfirm(): Observable<any> {
    return this.httpclient.get(routes.lead.getByTravelTicketConfirm());
  }

  ticketId = new Subject<any>();
  ticketIdConfirm(ticket: any) {
    this.ticketId.next(ticket);
  }

  travelChiledId = new Subject<any>();
  travelChiled(chiledId: any) {
    console.log(chiledId, 'chiledId');

    this.travelChiledId.next(chiledId);
  }

  getByExpenseTicketBy(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getByExpenseTicketBy(id));
  }
  createMultipleContact(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.createMultipleCont(), data);
  }
  getMultipleContact(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getMultipleCont(id));
  }
  multipleWorkOrderCreate(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.multipleWorkOrderCreate(), data);
  }
  multipleWorkOrderCreateNonCert(data: any): Observable<any> {
    return this.httpclient.post(
      routes.lead.multipleWorkOrderCreateNonCert(),
      data
    );
  }

  sendResponce(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.responstReq(), data);
  }

  postAuditVeriusDataPatch(id: any, data: any) {
    return this.httpclient.put(routes.lead.postAuditVeriusDataPatch(id), data);
  }
  postAuditL1reviewDataPatch(id: any, data: any) {
    return this.httpclient.put(
      routes.lead.postAuditL1reviewDataPatch(id),
      data
    );
  }

  getTravelTicketCopy(id: any, id2: any): Observable<any> {
    return this.httpclient.get(routes.lead.getTravelTicketCopy(id, id2));
  }
  getTravelTicketConfirmcopy(id: any, id2: any): Observable<any> {
    return this.httpclient.get(routes.lead.getTravelTicketConfirmcopy(id, id2));
  }

  updateL1ReviewFile(id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.lead.updateL1ReviewFile(id), data);
  }

  getallFeaList(): Observable<any> {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.getallFeaList()
    );
  }
  getallFeaApprovelList(): Observable<any> {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.getallFeaApprovelList()
    );
  }
  getallFeaApprovelList2(): Observable<any> {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.getallFeaApprovelList2()
    );
  }
  getallFeaPendingList(): Observable<any> {
    return this.httpclient.get(
      routes.adv_planning_suspensen_withdrawal.getallFeaPendingList()
    );
  }

  getPriceSlabBYleadId(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getPriceSlabBYleadId(id));
  }

  getPreviousAcountDetails(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getPreviousAcountDetails(id));
  }

  getCurrentAcountDetails(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getCurrentAcountDetails(id));
  }

  uploadOtherDoc(id: any, data: any) {
    return this.httpclient.post(
      routes.adv_planning_suspensen_withdrawal.upload_other_doc(id),
      data
    );
  }

  getAllAuditManagement(): Observable<any> {
    return this.httpclient.get(routes.lead.getAllAuditManagement());
  }
  getAllAuditManagementss(): Observable<any> {
    return this.httpclient.get(routes.lead.getAllAuditManagementss());
  }
  auditor_maping(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.auditor_maping(id));
  }

  //

  updateAddAuditor(data: any): Observable<any> {
    return this.httpclient.post(routes.lead.updateAddAuditor(), data);
  }
  update_auditorbyid(map_id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.lead.update_auditorbyid(map_id), data);
  }
  get_by_idAuditor(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.get_by_idAuditor(id));
  }

  getallAdvancePayment(): Observable<any> {
    return this.httpclient.get(routes.lead.getAllAdvancePayment());
  }

  getAllRejectedReport(): Observable<any> {
    return this.httpclient.get(routes.lead.getAllRejectedReport());
  }

  getRejectedReportById(id: any): Observable<any> {
    return this.httpclient.get(routes.lead.getRejectedReportById(id));
  }

  createStage(data: any) {
    return this.httpclient.post(routes.lead.createStage(), data);
  }

  createItemDetails(id: any, data: any) {
    return this.httpclient.patch(routes.lead.createItemDetails(id), data);
  }
  //
  get_productpricebycertificatetype(data: any) {
    return this.httpclient.post(
      routes.lead.get_productpricebycertificatetype(),
      data
    );
  }

  bookedAuditor(data: any) {
    return this.httpclient.post(routes.lead.bookedAuditor(), data);
  }

  raisedOrder(data: any) {
    return this.httpclient.post(routes.lead.raisedOrder(), data);
  }

  /// manual Invoice  bookedAuditor

  pandingManualInvoice() {
    return this.httpclient.get(routes.manual_invoice.get_all_manual_invoice());
  }

  get_all_approve_data() {
    return this.httpclient.get(routes.manual_invoice.get_all_approve_data());
  }

  get_all_rejected_data() {
    return this.httpclient.get(routes.manual_invoice.get_all_rejected_data());
  }

  aprovedManual_invoice(id: any) {
    return this.httpclient.patch(
      routes.manual_invoice.aproved_manual_invoice(id),
      ''
    );
  }

  rejectManual_invoice(id: any, data: any) {
    return this.httpclient.patch(
      routes.manual_invoice.reject_manual_invoice(id),
      data
    );
  }

  getzohoByIdData(id: any) {
    return this.httpclient.get(
      routes.manual_invoice.get_alldata_zoho_invoice(id)
    );
  }

  upload_more_doc(id: any, data: any) {
    return this.httpclient.post(
      routes.upload_more_doc.upload_more_doc(id),
      data
    );
  }

  getdocById(id: any) {
    return this.httpclient.get(routes.lead.getdocById(id));
  }

  doc_Verify(id: any, data: any) {
    return this.httpclient.put(
      routes.upload_more_doc.update_doc_status(id),
      data
    );
  }

  getAllTravelDraft() {
    return this.httpclient.get(routes.lead.getAllTravelDraft());
  }
  updateTravelRequest(id: any, data: any) {
    return this.httpclient.put(routes.lead.updateTravelRequest(id), data);
  }

  getByIdInterCompany(id: any) {
    return this.httpclient.get(routes.interCompany.getbyInterCompanyByID(id));
  }

  updateInterCompany(id: any) {
    return this.httpclient.patch(
      routes.interCompany.update_interCompany_ByID(id),
      ''
    );
  }

  leadAssignRole(id: any) {
    return this.httpclient.get(routes.lead.leadAssignRole(id));
  }
  leadFirstStageGet(id: any) {
    return this.httpclient.get(routes.lead.leadFirstStageGet(id));
  }
  // getAllApproverNew
  getAllApproverNew() {
    return this.httpclient.get(routes.lead.getAllApproverNew());
  }
  getAllL2ApproverNew() {
    return this.httpclient.get(routes.lead.getAllApproverL2New());
  }

  getLeadPreL1New(id: any) {
    return this.httpclient.get(routes.lead.getLeadPreL1New(id));
  }

  getQuotationlistnew(id: any) {
    return this.httpclient.get(routes.lead.getQuotationlistnew(id));
  }

  getSnmHeadApprovalList() {
    return this.httpclient.get(routes.lead.getSnmHeadApproval());
  }
  getExistingCustomerCreate(id: any) {
    return this.httpclient.get(routes.lead.getExistingCustomerCreate(id));
  }
  getCompletnessCheck(id: any) {
    return this.httpclient.get(routes.lead.getCompletnessCheck(id));
  }
  getAllAgent() {
    return this.httpclient.get(routes.lead.getAllAgent());
  }

  getNonCertList() {
    return this.httpclient.get(routes.lead.getNonCertLead());
  }

  getAllQuotationListNew(id: any) {
    return this.httpclient.get(routes.lead.getAllQuotationListNew(id));
  }

  getAllSMapprovelNew(id: any) {
    return this.httpclient.get(routes.lead.getAllSMapprovelNew(id));
  }

  getAllSmApprovedNew(id: any) {
    return this.httpclient.get(routes.lead.getAllSmApprovedNew(id));
  }

  getSignedDocNew(id: any) {
    return this.httpclient.get(routes.lead.getSignedDocNew(id));
  }

  getAllMakePaymentNew(id: any) {
    return this.httpclient.get(routes.lead.getAllMakePaymentNew(id));
  }
  getAllFeaPendingNew(id: any) {
    return this.httpclient.get(routes.lead.getAllFeaPendingNew(id));
  }
  getAllFeaApprovelNew(id: any) {
    return this.httpclient.get(routes.lead.getAllFeaApprovelNew(id));
  }

  getChildLeadById(id: any) {
    return this.httpclient.get(routes.lead.getChildLeadById(id));
  }
  updateChildLeadById(id: any, data: any) {
    return this.httpclient.put(routes.lead.updateChildLeadById(id), data);
  }

  updateSlabQuoteById(id: any, data: any) {
    return this.httpclient.put(routes.lead.updateSlabQuote(id), data);
  }

  getAllSMHeadApprovelNew(id: any) {
    return this.httpclient.get(routes.lead.getAllSMHeadApprovelNew(id));
  }
  getAllCancelTicket(id: any, id2: any) {
    return this.httpclient.get(routes.lead.getAllCancelTicket(id, id2));
  }
  createExpenseMaster(data: any) {
    return this.httpclient.post(routes.lead.createExpenseMaster(), data);
  }
  updateExpenseMaster(id: any, data: any) {
    return this.httpclient.put(routes.lead.updateExpenseMaster(id), data);
  }
  getAllExpenseMaster(entity_id: any) {
    return this.httpclient.get(routes.lead.getAllExpenseMaster(entity_id));
  }
  getByexpenseMaster(id: any) {
    return this.httpclient.get(routes.lead.getByexpenseMaster(id));
  }

  createTraningPayment(data: any) {
    return this.httpclient.post(
      routes.open_house_training.create_payment(),
      data
    );
  }

  createRegistration(data: any) {
    return this.httpclient.post(
      routes.open_house_training.craete_registration(),
      data
    );
  }

  expenseDetailDelete(id: any) {
    return this.httpclient.delete(routes.lead.expenseDetailDelete(id));
  }

  myExpenseDraftGet() {
    return this.httpclient.get(routes.lead.myExpenseDraftGet());
  }

  getAllBrNo() {
    return this.httpclient.get(routes.lead.getbr_no());
  }

  leadData_br_number(br: any) {
    return this.httpclient.get(routes.lead.leadData_br_number(br));
  }
}
