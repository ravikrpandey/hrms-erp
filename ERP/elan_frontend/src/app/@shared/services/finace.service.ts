import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.servralUrl;

const routes = {
  finace: {
    getRecivedAuditorInvoice: () => `${databaseKey}/api/v1/get_auditor_invoice`,
    getRecivedVendorInvoice:()=>`${databaseKey}/api/v1/get_All_Verfiy_Vendor_Management`,
    getRecivedExpenseInvoice: () => `${databaseKey}/api/v1/get_expense_invoice`,
    getByRecivedAuditorInvoice:(id:any)=>`${databaseKey}/api/v1/getByID_auditor_invoice/${id}`,
    getBYRecivedVendorInvoice:(id:any)=>`${databaseKey}/api/v1/getByID_vendorexpense_invoice${id}`,
    getBYRecivedExpenseInvoice:(id:any)=>`${databaseKey}/api/v1/getByID_expense_invoice/${id}`,
    getByVendorinoviceCopy:(id:any)=>`${databaseKey}/api/v1/get_ById_Vendor_Management/${id}`,
    getByExpenseInvoice:(id:any)=>`${databaseKey}/api/v1/getAllMyexpensesPaid_BYEXPID/${id}`,
    getAllExpenseInvoice:()=>`${databaseKey}/api/v1/getallmyexpensespaid`,
    createExpenseInvoice:()=>`${databaseKey}/api/v1/create_contact2`,
    getZohoExpenseInvoice:()=>`${databaseKey}/api/v1/getall_contact`,
    getByRecivable:(id:any)=>`${databaseKey}/api/v1/get_ById_InlineInvoice/${id}`,
    updateRecivable:(id:any)=>`${databaseKey}/api/v1/Update_Inline_Invoice/${id}`,
    getAllRecivableApproved:()=>`${databaseKey}/api/v1/Get_All_Accepted_Data`,
    getAllRecivableReject:()=>`${databaseKey}/api/v1/Get_All_Rejected_Data`,
    createExpenseZoho:()=>`${databaseKey}/api/v1/expense_zoho`,
    createExpenseZohoCopy:()=>`${databaseKey}/api/v1/create_contact`,
    getExpenseZoho:()=>`${databaseKey}/api/v1/getData_expense_zoho`,
    getAllDataExpenseZoho:()=>`${databaseKey}/api/v1/getAllExpenseData`,
    getAllInvoiceData:()=>`${databaseKey}/api/v1/getAllExpenseData`,
    getByZohoCopy:(id:any)=>`${databaseKey}/api/v1/getAllExpense_details/${id}`,
    getByChannelPartner:(id:any)=>`${databaseKey}/api/v1/get_All_CP_Payment_List_BYID/${id}`,
    getCustomerId:()=>`${databaseKey}/api/v1/customer_details`,
   getPaybleExpenseZoho:()=>`${databaseKey}/api/v1/newAllExpenseData`,
   createPaybleExpense:()=>`${databaseKey}/api/v1/newexpense_zoho`,
   createPaymentInvoice:()=>`${databaseKey}/api/v1/createPaymentinvoice`,
   fetchPaymentList:(id:any,version_id:any)=>`${databaseKey}/api/v1/getCompleteGRNInvoiceById?id=${id}&version_id=${version_id}`,
   getByExpenseZohoPayble:(id:any)=>`${databaseKey}/api/v1/newExpenseDetails/${id}`,
   getAllVendorNewInvoice:()=>`${databaseKey}/api/v1/getAll_issued`,
   getByVendeoNewInvoice:(id:any)=>`${databaseKey}/api/v1/getAll_Approved_pr_getBy_id/${id}`,
   getAllInterAuditor:()=>`${databaseKey}/api/v1/get_all_leadManagement_data`,
   getBankClearenceList:(entity_id:any)=>`${databaseKey}/api/v1/getBankClearenceList?entity_id=${entity_id}`,
   getAllErpDataList:(entity_id:any,id:any)=>`${databaseKey}/api/v1/getAllErpDataList?entity_id=${entity_id}&id=${id}`,

  },
  budgetManagement: {
    getBudgetList: ()=> `${databaseKey}/api/v1/getAllBudget`,
    createBudget: ()=> `${databaseKey}/api/v1/createBudget`,
    getBudgetById: (budget_id: any)=> `${databaseKey}/api/v1/getBudgetById/${budget_id}`,
    updateBudget: (budget_id: any)=> `${databaseKey}/api/v1/updateBudget/${budget_id}`,
    statusBudget: (budget_id: any)=> `${databaseKey}/api/v1/BudgetStatus/${budget_id}`,
    deleteBudget: (budget_id: any)=> `${databaseKey}/api/v1/deteleBudget/${budget_id}`,
  },
  subtype: {
    getAccountTypeList: ()=> `${databaseKey}/api/v1/get_all_account_types`,
    getAccountSubTypeList: ()=> `${databaseKey}/api/v1/get_all_account_subtypes`,
    createAccountSubtype: ()=> `${databaseKey}/api/v1/Create_account_subtype`,
    getAccountSubtypeById: (subtype_id: any)=> `${databaseKey}/api/v1/get_account_subtype_ById/${subtype_id}`,
    updateAccountSubtype: (subtype_id: any)=> `${databaseKey}/api/v1/update_account_subtype/${subtype_id}`,
    statusAccountSubtype: (subtype_id: any)=> `${databaseKey}/api/v1/update_AccSub_Status/${subtype_id}`,
  },
  // chartaccount: {
  //   getAccountTypeBySubtypeList: (id: any)=> `${databaseKey}/api/v1/get_all_accSubtypes_ByAccType/${id}`,
  //   getAccountBySubtypeList: (id: any)=> `${databaseKey}/api/v1/get_all_account_bysubtypeId/${id}`,
  //   getChartAccountList: ()=> `${databaseKey}/api/v1/get_all_account_list`,
  //   createChartAccount: ()=> `${databaseKey}/api/v1/Create_account`,
  //   getChartAccountById: (chart_id: any)=> `${databaseKey}/api/v1/get_account_ById/${chart_id}`,
  //   updateChartAccount: (chart_id: any)=> `${databaseKey}/api/v1/update_account/${chart_id}`,
  //   statusChartAccount: (chart_id: any)=> `${databaseKey}/api/v1/update_Account_Status/${chart_id}`,
  // },



  chartaccount: {
    getAccountTypeBySubtypeList: (id: any)=> `${databaseKey}/api/v1/get_all_accSubtypes_ByAccType/${id}`,
    getAccountBySubtypeList: (id: any)=> `${databaseKey}/api/v1/get_all_account_bysubtypeId/${id}`,
    getChartAccountList: ()=> `${databaseKey}/api/v1/get_all_account_list`,
    getMasterAccountType: ()=> `${databaseKey}/api/v1/get_Master_Account_Type`,
    getCompanyNameList: ()=> `${databaseKey}/api/v1/get_Company_Name_List`,
    getChartOfAccountList: (id:any)=> `${databaseKey}/api/v1/get_Chart_Of_Account_List/${id}`,
    BankClearenceAccountList: (entity_id:any)=> `${databaseKey}/api/v1/BankClearenceAccountList?entity_id=${entity_id}`,
    getParentAccList: ()=> `${databaseKey}/api/v1/get_Parent_Account_List`,
    deleteChartAccount: (chart_id:any) => `${databaseKey}/api/v1/delete_Chart_Of_Accounts/${chart_id}`,
    createChartAccount: ()=> `${databaseKey}/api/v1/Create_account`,
    createChartsOfAccount: (chart_id:any)=> `${databaseKey}/api/v1/save_Chart_Of_Accounts/${chart_id}`,
    getChartAccountById: (chart_id: any)=> `${databaseKey}/api/v1/get_Charts_Of_Account_By_Id/${chart_id}`,
    getAccountGroupById: (account_type_id: any)=> `${databaseKey}/api/v1/get_Account_Group_By_Id/${account_type_id}`,
    getChartOfAccountDetailsById: (id: any)=> `${databaseKey}/api/v1/get_Charts_Of_Account_Details_By_Id/${id}`,
    getTrialBalanceReportList: (entity_id: any,financial_id:any)=> `${databaseKey}/api/v1/get_Trial_Balance_Report_List?entity_id=${entity_id}&financial_id=${financial_id}`,
    updateChartAccount: (chart_id: any)=> `${databaseKey}/api/v1/update_account/${chart_id}`,
    statusChartAccount: (chart_id: any)=> `${databaseKey}/api/v1/update_Account_Status/${chart_id}`,
    getTrialBalance22: (id:any)=> `${databaseKey}/api/v1/getTrialBalance22?entity_id=${id}`,
    getCurrencyList: ()=> `${databaseKey}/api/v1/getCurrencyList`,
    getRootTypeByChartId: (id:any)=> `${databaseKey}/api/v1/getRootTypeByChartId/${id}`,
    getDefaultCurrencyId: ()=> `${databaseKey}/api/v1/getDefaultCurrencyId`,
    checkBankAccountForJournal: ()=> `${databaseKey}/api/v1/checkBankAccountForJournal`,
    getProductList: ()=> `${databaseKey}/api/v1/getProductList`,
    getChartOfAccountById: (id:any)=> `${databaseKey}/api/v1/getChartOfAccountById?id=${id}`,

  },

  cost_center:{
    getCostCenterHierarchyViewData: (id:any)=> `${databaseKey}/api/v1/getCostCenterHierarchyViewData?entity_id=${id}`,

  },



  financialYear: {
    getFinancialYearCopy: () => `${databaseKey}/api/v1/getAllfinancial_yearRange`,
    getFinancialYear: () => `${databaseKey}/api/v1/getAllfinancial`,
    getFinancialYearActive: () => `${databaseKey}/api/v1/getAllfinancial_active`,
    createFinancialYear: () => `${databaseKey}/api/v1/createFinancialYear`,
    updateFinancialYear: (id: any) => `${databaseKey}/api/v1/updatefinancialById/${id}`,
    deleteFinancialYear: (id: any) => `${databaseKey}/api/v1/deletefinancial/${id}`,
    status: (id: any) => `${databaseKey}/api/v1/updatefinanceStatus/${id}`
  },
  budgetPlan: {
    getBudgetPlanList: (entity_id:any,filter_fy:any) => `${databaseKey}/api/v1/getAll_budgetPlan?entity_id=${entity_id}&filter_fy=${filter_fy}`,
    createBudgetPlan: (entity_id:any,filter_fy:any) => `${databaseKey}/api/v1/create_budgetPlan?entity_id=${entity_id}&filter_fy=${filter_fy}`,
    getBudgetPlanById: (id: any)=> `${databaseKey}/api/v1/getById_budgetPlan/${id}`,
    updateBudgetPlan: (id: any)=> `${databaseKey}/api/v1/update_budgetPlan/${id}`,
    deleteBudgetPlan: (id: any)=> `${databaseKey}/api/v1/delete_budgetPlan/${id}`,
  },
  costCenter: {
    generateCCCode: () => `${databaseKey}/api/v1/generate_cost_center_code`,
    getAllCostCenterList: (entity_id:any) => `${databaseKey}/api/v1/getAll_Cost_Center?entity_id=${entity_id}`,
    getAllCostCenterListActive: (entity_id:any) => `${databaseKey}/api/v1/getAll_Active_Cost_Center?entity_id=${entity_id}`,
    getAllCostCenterListActiveByDepartment: (entity_id:any,department_id:any) => `${databaseKey}/api/v1/get_all_cost/${department_id}?entity_id=${entity_id}`,
    createCostCenter: (entity_id:any) => `${databaseKey}/api/v1/create_cost_center?entity_id=${entity_id}`,
    getCostCenterById: (id: any)=> `${databaseKey}/api/v1/get_Cost_Center_ById/${id}`,
    updateCostCenter: (id: any,entity_id:any)=> `${databaseKey}/api/v1/update_cost_center/${id}?entity_id=${entity_id}`,
    updateCostCenterStatus: (id: any)=> `${databaseKey}/api/v1/update_cost_center_status/${id}`,
    deleteCostCenter: (id: any)=> `${databaseKey}/api/v1/delete_Cost_Center_ById/${id}`,
    getAllCostCenterNew:(entity_id:any)=>`${databaseKey}/api/v1/getAll_Active_Cost_Center?entity_id=${entity_id}`,
    getAllCostCenterIsGroup:(entity_id:any)=>`${databaseKey}/api/v1/getAllCostCenterIsGroup?entity_id=${entity_id}`,
    generateFinanceCostCenterCode:(entity_id:any)=>`${databaseKey}/api/v1/generateFinanceCostCenterCode?entity_id=${entity_id}`
  },
  budgetPlanning: {
    getAllBudgetPlanning: (type:any,id:any,entity_id:any,approvel_status:any,user_id:any,dept_id?:any) => `${databaseKey}/api/v1/getAll_budgetPlanning/${type}?id=${id}&entity_id=${entity_id}&approval_status=${approvel_status}&user_id=${user_id}&dept_id=${dept_id}`,
    getDepartmentWise: (entity_id:any,user_id:any,type:any,id:any) => `${databaseKey}/api/v1/get_approval_request_by_departmentId?entity_id=${entity_id}&login_id=${user_id}&budget_planning_type=${type}&budgetFinancialYear_id=${id}`,
    createBudgetPlanning: (entity_id:any) => `${databaseKey}/api/v1/create_budgetPlanning?entity_id=${entity_id}`,
    bulkApprovalRequest: () => `${databaseKey}/api/v1/bulk_approval_request`,
    getBudgetPlanningById: (id: any)=> `${databaseKey}/api/v1/getById_budgetPlanning/${id}`,
    updateBudgetPlanning: (id: any)=> `${databaseKey}/api/v1/update_budgetPlanning/${id}`,
    mapBudgetPlanningCC: (id: any)=> `${databaseKey}/api/v1/map_budget_planning_with_cc/${id}`,
    deleteBudgetPlanning: (id: any)=> `${databaseKey}/api/v1/delete_Cost_Center_ById/${id}`,
    getBuisnessUnit: (id : any)=> `${databaseKey}/api/WL/userbyid/${id}`
  },


  JournalEntry: {
    getgeneralAccount: (status:any,id:any)=> `${databaseKey}/api/v1/getsFinancialAccountJournal?status=${status}&entity_id=${id}`,
    getgeneralNumber: ()=> `${databaseKey}/api/v1/generate_journal_number`,
    getgeneralById: (journal_id: any)=> `${databaseKey}/api/v1/getsFinancialAccountJournal?id=${journal_id}`,
    getsalesJournalById: (journal_id: any)=> `${databaseKey}/api/v1/getsalesJournalById?id=${journal_id}`,
    getchartedAccount: (id:any)=> `${databaseKey}/api/v1/get_Chart_Of_Account_List/${id}`,
    getJournalList: (entity_id:any)=> `${databaseKey}/api/v1/filterJournalDetails/${entity_id}`,

    filterTradePayableJournalDetails:(entity_id:any)=> `${databaseKey}/api/v1/filterTradePayableJournalDetails/${entity_id}`,
    getGParty: (partyType:any)=> `${databaseKey}/api/v1/get_Party_Type_List?partyType=${partyType}`,
    getGPartyByEntityId:(partyType:any,entity_id:any)=> `${databaseKey}/api/v1/get_Party_Type_List?partyType=${partyType}&entity_id=${entity_id}`,
    getCustomerBillingList:(customer_id:any)=> `${databaseKey}/api/v1/getCustomerBillingList?customer_id=${customer_id}`,
    get_Party_Name_List: (partyType:any,entity_id:any)=> `${databaseKey}/api/v1/get_Party_Name_List?partyType=${partyType}&entity_id=${entity_id}`,
    createGeneralBook: ()=> `${databaseKey}/api/v1/addFinancialAccountJournal`,
    UpdateGeneralBook: (journal_id?:any)=> `${databaseKey}/api/v1/addFinancialAccountJournal?id=${journal_id}`,
    createQuickEntry: (journal_id?:any)=> `${databaseKey}/api/v1/addFinancialAccountJournal?id=${journal_id}`,
    createGeneralQuickEntry: ()=> `${databaseKey}/api/v1/createGeneralQuickEntry`,
    journalDelete: (id: any) => `${databaseKey}/api/v1/deleteFinancialAccountJournal/${id}`,
    RepeatFrequencySetUp: ()=> `${databaseKey}/api/v1/createDraftFrequency`,
    getScheduledJournals: ()=> `${databaseKey}/api/v1/get_Scheduled_Journals`,
    getScheduledJournalDeatils: (id:any)=> `${databaseKey}/api/v1/get_Scheduled_Journals_details?journal_id=${id}`,
    deleteJournalScheduling: (id:any) => `${databaseKey}/api/v1/delete_Journal_Scheduling/${id}`,
  },

  postingPeriod:{
    addPostingPeriod: (id:any) =>`${databaseKey}/api/v1/addPostingPeriod/${id}`,
    getPostingPeriodList:(id:any)=> `${databaseKey}/api/v1/getPostingPeriodList/${id}`,
    getPostingPeriodById: (id:any)=> `${databaseKey}/api/v1/getPostingPeriodById/${id}`,
    getPostingPeriodMonthListById: (id:any)=> `${databaseKey}/api/v1/getPostingPeriodMonthListById/${id}`,
    deletePostingPeriod: (id:any)=> `${databaseKey}/api/v1/deletePostingPeriod/${id}`,
    getFinancialYearActiveMonthByEntityId:(id:any,financial_id:any)=>`${databaseKey}/api/v1/getFinancialYearActiveMonthByEntityFinancial/${id}/${financial_id}`,
    getAdditionalPostingPeriodMonthListById: (id:any)=> `${databaseKey}/api/v1/getAdditionalPostingPeriodMonthListById/${id}`,
    getFinancialYearActiveMonthByEntityId1:(id:any)=>`${databaseKey}/api/v1/getFinancialYearActiveMonthByEntityId/${id}`,
    getMonthList:()=>`${databaseKey}/api/v1/getMonthList`,
    getFinancialYearList:(id:any)=>`${databaseKey}/api/v1/getFinancialYearList/${id}`,
    getFromToMonthByEntityId:(id:any)=>`${databaseKey}/api/v1/getFromToMonthByEntityId/${id}`,
    getFromToMonthByFinancialYear:(id:any)=>`${databaseKey}/api/v1/getFromToMonthByFinancialYear/${id}`,

  },

  bank:{
    createBank: (id:any)=> `${databaseKey}/api/v1/addBank/${id}`,
    getBankList: (entity_id:any)=> `${databaseKey}/api/v1/getBankList?entity_id=${entity_id}`,
    getBankAccountList: ()=> `${databaseKey}/api/v1/getBankAccountList`,
    getBankAccountByBankId: (id: any)=> `${databaseKey}/api/v1/getbankaccountname?id=${id}`,
    getBankById: (id: any)=> `${databaseKey}/api/v1/getBankById/${id}`,
    deleteBank: (id:any)=> `${databaseKey}/api/v1/deleteBank/${id}`,
    getBankDetailsById: (id:any)=> `${databaseKey}/api/v1/getBankDetailsById/${id}`,
    getCountryList: ()=> `${databaseKey}/api/v1/getCountryList`,
    getCashInBankCOA:(id:any)=> `${databaseKey}/api/v1/getCashInBankCOA/${id}`,
    getJournalEntriesForBankClearance:(account_id:any, entity_id:any)=> `${databaseKey}/api/v1/getJournalEntriesForBankClearance/${account_id}/${entity_id}`
    ,updateClearanceDates: ()=> `${databaseKey}/api/v1/updateClearanceDates`,
    getClosingBalanceForBankReconciliation: (account_id:any, entity_id:any)=> `${databaseKey}/api/v1/getClosingBalanceForBankReconciliation/${account_id}/${entity_id}`
    ,getAllJournalEntriesForBankClearance:(account_id:any, entity_id:any)=> `${databaseKey}/api/v1/getAllJournalEntriesForBankClearance/${account_id}/${entity_id}`,
    getBankEntriesForBankReconciliationStatm:()=> `${databaseKey}/api/v1/getBankEntriesForBankReconciliationStatm`,
 getUnReconciledBankEntries: () => `${databaseKey}/api/v1/getUnReconciledBankEntries`
  },
  bankAccount:{
    createBankAccount: (id:any)=> `${databaseKey}/api/v1/addBankAccount/${id}`,
    getBankAccountList: (entity_id:any)=> `${databaseKey}/api/v1/getBankAccountList?entity_id=${entity_id}`,
    getBankAccountById: (id: any)=> `${databaseKey}/api/v1/getBankAccountById/${id}`,
    deleteBankAccount: (id:any)=> `${databaseKey}/api/v1/deleteBankAccount/${id}`,
    getAccountListForBank: ()=> `${databaseKey}/api/v1/getAccountListForBank`,
    getBankList: (entity_id:any)=> `${databaseKey}/api/v1/getBankList?entity_id=${entity_id}`,
    getBankAccount: (entity_id:any)=> `${databaseKey}/api/v1/getBankAccount?entity_id=${entity_id}`,
    getBankAccountDetailsById: (id:any)=> `${databaseKey}/api/v1/getBankAccountDetailsById`,
    get_All_Bank_Acc_List: ()=> `${databaseKey}/api/v1/get_All_Bank_Acc_List`
  },
  trial_balance:{
    getTrialBalanceList: (id:any,financial_id :any)=> `${databaseKey}/api/v1/getTrialBalance?entity_id=${id}&financial_id=${financial_id}`,
    getFilterTrialBalanceList: ( entity_id:any,financial_id:any)=> `${databaseKey}/api/v1/getTrialBalances?entity_id=${entity_id}&financial_id=${financial_id}`,
    getProfitAndLossList: (id:any,financial_id:any)=> `${databaseKey}/api/v1/getProfitLoss?entity_id=${id}&financial_id=${financial_id}`,

    // getProfitAndLossList: (id:any,fiscal_year:any)=> `${databaseKey}/api/v1/getProfitLoss?company_id=${id}&fiscal_year=${fiscal_year}`,
    getBalanceSheetList: (id:any)=> `${databaseKey}/api/v1/getBalanceSheet?entity_id=${id}`,
   getCostCenterLedger: (id:any)=> `${databaseKey}/api/v1/getCostCenterLedger/${id}`,
   getProfitCenterLedger: (id:any)=> `${databaseKey}/api/v1/getProfitCenterLedger/${id}`
  },


  cashBook: {
    getCustomerList: (entity_id:any) =>
      `${databaseKey}/api/v1/getAllSuperUsers/${entity_id}`,
  },
  cash_book:{
    getDepartNameById: (id:any)=> `${databaseKey}/api/v1/getDepartmentById/${id}`,
    getAllFundTransferApprovalLevel: (id:any)=> `${databaseKey}/api/v1/getAllFundTransferApprovalLevel/${id}`,
    requestCashbookRequest: ()=> `${databaseKey}/api/v1/requestCashbookRequest`,
    generateFundRequestNo: ()=> `${databaseKey}/api/v1/generate_fr_no`,
    getAllFundRequest: (id:any,entity_id:any, role:string) =>
      `${databaseKey}/api/v1/getAllFundRequest?id=${id}&entity_id=${entity_id}&role=${role}`,
    getAccountListForCashBook: () => `${databaseKey}/api/v1/getAccountListForCashBook`,
    getInterestIncomeAccountList: () => `${databaseKey}/api/v1/getInterestIncomeAccountList`,
    getOtherIncomeAccountList: () => `${databaseKey}/api/v1/getOtherIncomeAccountList`,
    getAllEquityAccountList: () => `${databaseKey}/api/v1/getAllEquityAccountList`,
    getVendorList: () => `${databaseKey}/api/v1/getVendorList`,
    addCashBookMoneyIn: () => `${databaseKey}/api/v1/addCashBookMoneyIn`,
    getCashBookData: (id:any) => `${databaseKey}/api/v1/getCashBookData/${id}`,
    addCashBookMoneyOut: () => `${databaseKey}/api/v1/addCashBookMoneyOut`,
    getExpenseAccountList: (id:any) => `${databaseKey}/api/v1/getExpenseAccountList/${id}`,
    getMoneyOutToAccountList: (id:any) => `${databaseKey}/api/v1/getMoneyOutToAccountList/${id}`,
    getCashBookDataById: (id:any, form_type:any) => `${databaseKey}/api/v1/getCashBookDataById?id=${id}?form_type=${form_type}`,
    getFundTransferById: (id:any, employee_id:any) =>
      `${databaseKey}/api/v1/getFundTransferById?id=${id}&emp_id=${employee_id}`,
      getAllCashAccount:(id:any) =>`${databaseKey}/api/v1/getAllCashAccount/${id}`,

    approvedFundTransferById: (id:any) =>
      `${databaseKey}/api/v1/approvedFundTransferById/${id}`,
    getVendorAccListByCode:(cc_account_code:any,sns_details_security:any,pgc_account:any)=> `${databaseKey}/api/v1/getVendorAccListByCode?cc_account_code=${cc_account_code}&sns_details_security=${sns_details_security}&pgc_account=${pgc_account}`,
    // getVendorAccListByCode:(cc_account_code:any,sns_details_security:any, pgc_account:any)=> `${databaseKey}/api/v1/getVendorAccListByCode?cc_account_code=${cc_account_code}&sns_details_security=${sns_details_security}&pgc_account=${pgc_account}`,
  },
  makePayment:{
    createMakePayment:()=>`${databaseKey}/api/v1/createPayment`,
    getCustomerCategory:(customer_id:any)=>`${databaseKey}/api/v1/getAssetByCustomerById/${customer_id}`,
    getVendorDetails:(vendor_id:any)=>`${databaseKey}/api/v1/getAssetByVendorById/${vendor_id}`,
  },
  profitCenter:{
    createProfitCenter:()=>`${databaseKey}/api/v1/createProfitCenter`,
    getAllProfitCenter:(entity_id:any)=>`${databaseKey}/api/v1/getAllProfitCenter?entity_id=${entity_id}`,
    getAllProfitCenterIsGroup:(entity_id:any)=>`${databaseKey}/api/v1/getAllProfitCenterIsGroup?entity_id=${entity_id}`,
    getProfitCenterHierarchyViewData:(entity_id:any)=>`${databaseKey}/api/v1/getProfitCenterHierarchyViewData?entity_id=${entity_id}`,
    getProfitCenterById:(id:any)=>`${databaseKey}/api/v1/getProfitCenterById?id=${id}`,
    updateProfitCenter:(id:any)=>`${databaseKey}/api/v1/updateProfitCenter/${id}`,
    deleteProfitCenter:(id:any)=>`${databaseKey}/api/v1/deleteProfitCenter/${id}`,
  },

  transactions:{
    paymentAdvice:()=>`${databaseKey}/api/v1/createPaymentAdvice`,
    getAdvicepayment:(entity_id:any)=>`${databaseKey}/api/v1/getPaymentAdviceList?entity_id=${entity_id}`,
    generateNumber:()=>`${databaseKey}/api/v1/generatePaymentAdviceNumber`,
    bankRecieptNumberDoc:()=>`${databaseKey}/api/v1/generateBankRecieptNumber`,
    createBankReciept:()=>`${databaseKey}/api/v1/createbankReciept`,
    getBankReciept:(entity_id:any)=>`${databaseKey}/api/v1/getBankRecieptList?entity_id=${entity_id}`,
    generateBankPaymentNumber:()=>`${databaseKey}/api/v1/generateBankPaymentNumber`,
    generateSalesJournalNumber:()=>`${databaseKey}/api/v1/generateSalesJournalNumber`,
    createBankPayment:()=>`${databaseKey}/api/v1/createBankPayment`,
    createSalesJournal:()=>`${databaseKey}/api/v1/createSalesJournal`,
    getBankPaymentRecord:(entity_id:any)=>`${databaseKey}/api/v1/getBankPaymentList?entity_id=${entity_id}`,
    getSalesJournalData:(entity_id:any)=>`${databaseKey}/api/v1/getSalesJournalList?entity_id=${entity_id}`,
    createPurchaseJournal:()=>`${databaseKey}/api/v1/createPurchaseJournal`,
    createPurchaseService:()=>`${databaseKey}/api/v1/createPurchaseService`,
    getPurchaseJournalData:(entity_id:any)=>`${databaseKey}/api/v1/getPurchaseJournalList?entity_id=${entity_id}`,
    getPurchaseServiceList:(entity_id:any)=>`${databaseKey}/api/v1/getPurchaseServiceList?entity_id=${entity_id}`,
    getAddvisePaymentById:(id:any)=>`${databaseKey}/api/v1/getPaymentAdviceById?id=${id}`,
    getBankRecieptById:(id:any)=>`${databaseKey}/api/v1/getBankRecieptById?id=${id}`,
    getAllPoGrnSoByVendorId:()=>`${databaseKey}/api/v1/getAllPoGrnSoByVendorId`,
    getBankPaymentById:(id:any)=>`${databaseKey}/api/v1/getBankPaymentById?id=${id}`,
    paymentAdviceHistory:()=>`${databaseKey}/api/v1/getPOInvoiceDataListById`,
    generateBankReceiptNumber:()=>`${databaseKey}/api/v1/generateBankReceiptNumber`,
    generateBankPayment:()=>`${databaseKey}/api/v1/generateBankPaymentNumber`,
    generateBankRecieptNumberNew:()=>`${databaseKey}/api/v1/generateBankRecieptNumber`,
    generatecashPaymentNumber:()=>`${databaseKey}/api/v1/generatecashPaymentNumber`,
    generatesalesJournalNumber:()=>`${databaseKey}/api/v1/generatesalesJournalNumber`,
    generatePurchaseJournalNumber:()=>`${databaseKey}/api/v1/generatePurchaseJournalNumber`,
    generatePurchaseServiceNumber:()=>`${databaseKey}/api/v1/generatePurchaseServiceNumber`,
    getCreditNoteList:(entity_id:any)=>`${databaseKey}/api/v1/getCreditNoteList?entity_id=${entity_id}`,
    getPurchaseCreditLimitList:(entity_id:any)=>`${databaseKey}/api/v1/getPurchaseCreditLimitList?entity_id=${entity_id}`,
    getPurchaseDebitLimitList:(entity_id:any)=>`${databaseKey}/api/v1/getPurchaseDebitLimitList?entity_id=${entity_id}`,
    purchaseRegister:(entity_id:any)=>`${databaseKey}/api/v1/purchaseRegister?entity_id=${entity_id}`,
    getSalesCreditLimitList:(entity_id:any)=>`${databaseKey}/api/v1/getSalesCreditLimitList?entity_id=${entity_id}`,
    getSalesDebitNoteList:(entity_id:any)=>`${databaseKey}/api/v1/getSalesDebitNoteList?entity_id=${entity_id}`,
    getCreditNoteById:(id:any,type:any)=>`${databaseKey}/api/v1/getCreditNoteById?id=${id}&type=${type}`,
    purchaseJournalById:(id:any)=>`${databaseKey}/api/v1/purchaseJournalById?id=${id}`,
    purchaseServiceById:(id:any)=>`${databaseKey}/api/v1/purchaseServiceById?id=${id}`,
    getInputOutputGstReport:(entity_id:any)=>`${databaseKey}/api/v1/getInputOutputGstReport?entity_id=${entity_id}`,
    getSalesRegisterGSTReport:(entity_id:any)=>`${databaseKey}/api/v1/getSalesRegisterGSTReport?entity_id=${entity_id}`,
    getBillingAddressById:(vendor_id:any)=>`${databaseKey}/api/v1/getBillingAddressById?vendor_id=${vendor_id}`,

  },
  serviceVoucher:{
    createServiceVoucher:()=>`${databaseKey}/api/v1/createServiceVoucher`,
    generateServiceVoucherNumber:()=>`${databaseKey}/api/v1/generateServiceVoucherNumber`,
    getServiceVoucherById:(id:any)=>`${databaseKey}/api/v1/getServiceVoucherById/${id}`,
  getAllServiceVoucherList:(entity_id:any)=>`${databaseKey}/api/v1/getServiceVoucherList?entity_id=${entity_id}`


  },
  paymentReport:{
    getPaymentAdviceReport:(entity_id:any)=>`${databaseKey}/api/v1/getPaymentAdviceReportList?entity_id=${entity_id}`,
    getBankRecieptReport:(entity_id:any)=>`${databaseKey}/api/v1/getBankRecieptReportList?entity_id=${entity_id}`,
    getBankPaymentReport:(entity_id:any)=>`${databaseKey}/api/v1/getBankPaymentReportList?entity_id=${entity_id}`,
  },
  vendorLedger:{
    filterVendorLedgerReport: (entity_id:any) =>`${databaseKey}/api/v1/filterVendorLedgerReport/${entity_id}`
  },
  directInvoice:{
    createDirectInvoice:()=> `${databaseKey}/api/v1/create_direct_invoice`,
    getDirectInvoice:(id:any,vendor_code:any)=> `${databaseKey}/api/v1/getDirectInvoice?id=${id}&vendor_code=${vendor_code}`,
    getAllDirectInvoice:()=> `${databaseKey}/api/v1/getAllDirectInvoices`,
    getCustomerListDI:(entity_id:any,financial_year_id?:any)=> `${databaseKey}/api/v1/get_all_customer?entity_id=${entity_id}`,
    getDirectInvoiceNumber:(id:any)=> `${databaseKey}/api/v1/getDirectInvoiceNumber/${id}`,
    getCompletedDirectInvoice:(invoice_id:any)=>`${databaseKey}/api/v1/getCompletedDirectInvoice?id=${invoice_id}`,
    issueNote:()=>`${databaseKey}/api/v1/issueNote`,
    getPurchaseAccounts:()=>`${databaseKey}/api/v1/get_purchase_account_list`,
    getPurchaseVatAccounts:()=>`${databaseKey}/api/v1/get_Purchase_VAT_Account_List`,
    cc_account_code_available:(acc_code:any,isVendor:any)=>`${databaseKey}/api/v1/is_cc_account_code_present/${acc_code}/${isVendor}`,
    getInvoiceNotes:(invoice_no:any)=>`${databaseKey}/api/v1/get_invoice_notes/${invoice_no}`,
    getVendorCOA:()=>`${databaseKey}/api/v1/getVendorCOA`,
    getCustomerCOA:()=>`${databaseKey}/api/v1/getCustomerCOA`,
    getNuitNumber:(isVendor:any,account_code:any)=>`${databaseKey}/api/v1/getNuitNumber?isVendor=${isVendor}&account_code=${account_code}`,
    getProformaInvoiceById:(id:any)=> `${databaseKey}/api/v1/getProformaInvoiceById/${id}`
    // getCustomerBankDetails:(customer_id:any)=>`${databaseKey}/api/v1/get_customer_bank_details?id=${customer_id}`
  },
  getVendorDataByTds:{
    getVenodrTdsById:(id:any)=> `${databaseKey}/api/v1/getVendorByIdTdsValue?id=${id}`,
    getTransporterByIdTdsValue:(id:any)=> `${databaseKey}/api/v1/getTransporterByIdTdsValue?id=${id}`,
    getTdsNatureOfTransaction:(nature_id:any,vendor_id:any)=> `${databaseKey}/api/v1/getTdsNatureOfTransaction?nature_id=${nature_id}&vendor_id=${vendor_id}`,
    getTdsNatureOfTransactionTransporter:(nature_id:any,transporter_id:any)=> `${databaseKey}/api/v1/getTdsNatureOfTransactionTransporter?nature_id=${nature_id}&transporter_id=${transporter_id}`
  },

  cashReciept:{
    createCashReciept:()=>`${databaseKey}/api/v1/createCashReciept`,
    generateCashRecieptNumber:()=>`${databaseKey}/api/v1/generateCashRecieptNumber`,
    getCashRecieptList:(entity_id:any)=>`${databaseKey}/api/v1/getCashRecieptList?entity_id=${entity_id}`,
    downloadCashRecieptById:(id:any)=>`${databaseKey}/api/v1/downloadCashRecieptById?id=${id}`,
    getCashRecieptById:(id:any)=>`${databaseKey}/api/v1/getCashRecieptById?id=${id}`,
    getCashRecieptReportList:(entity_id:any)=>`${databaseKey}/api/v1/getCashRecieptReportList?entity_id=${entity_id}`,
  },

cashPayment:{
  createCashPayment:()=>`${databaseKey}/api/v1/createCashPayment`,
  generateCashPaymentNumber:()=>`${databaseKey}/api/v1/generateCashPaymentNumber`,
  getCashPaymentList:(entity_id:any)=>`${databaseKey}/api/v1/getCashPaymentList?entity_id=${entity_id}`,
  getCashPaymentById:(id:any)=>`${databaseKey}/api/v1/getCashPaymentById?id=${id}`,
  getCashPaymentReportList:(entity_id:any)=>`${databaseKey}/api/v1/getCashPaymentReportList?entity_id=${entity_id}`,
},
mapTdsCA:{
  createGlobalTdsMapCA:()=>`${databaseKey}/api/v1/createGlobalTdsMapCA`,

},

mapSalesCA:{
  mapSalesCA:()=>`${databaseKey}/api/v1/mapSalesCA`,

},
vendorPayment:{
  createVendorRecordPayment:()=>`${databaseKey}/api/v1/createVendorRecordPayment`,
  createVendorPaymentVoucherSeries:(branch_id:any)=>`${databaseKey}/api/v1/createVendorPaymentVoucherSeries?branch_id=${branch_id}`,
  getAllVendorRecordPayment:(entity_id:any)=>`${databaseKey}/api/v1/getAllVendorRecordPayment?entity_id=${entity_id}`,
  getVendorPaymentHistoryByVendor:()=>`${databaseKey}/api/v1/getVendorPaymentHistoryByVendor`,

},

customerRecordPayment:{
  getDataDynamicById:()=>`${databaseKey}/api/v1/getDataDynamicById`,
  createCustomerRecordPayment:()=>`${databaseKey}/api/v1/createCustomerRecordPayment`,
  getListCustomerRecordPayment:(entity_id:any)=>`${databaseKey}/api/v1/getListCustomerRecordPayment?entity_id=${entity_id}`,
getRCMPurchaseRegister:(entity_id:any,financial_id:any,type:any)=>`${databaseKey}/api/v1/getRCMPurchaseRegister?entity_id=${entity_id}&financial_id=${financial_id}&type=${type}`,

},
tdsRegisterData:{
  getAllTdsRegister:(entity_id:any)=>`${databaseKey}/api/v1/getAllTdsRegisterData?entity_id=${entity_id}`
},

glAccountMap:{
  createGlMappingTransactions:()=>`${databaseKey}/api/v1/createGlMappingTransactions`,
  getAllGlMappingData:(entity_id:any)=>`${databaseKey}/api/v1/getAllGlAccountMapped?entity_id=${entity_id}`,
  createFinacialTransactionIntegration:()=>`${databaseKey}/api/v1/createFinacialTransactionIntegration`,
  getAllServiceDataById:(id:any)=>`${databaseKey}/api/v1/getAllServiceDataById?id=${id}`,

},

transportVoucher:{
  createTransportVoucher:()=>`${databaseKey}/api/v1/createTransportVoucher`,
  getAllTransportVoucherList:()=>`${databaseKey}/api/v1/getAllTransportVoucherList`,
  getLRDataList:(transporter_id:any,entity_id:any)=>`${databaseKey}/api/v1/getLRDataList?transporter_id=${transporter_id}&entity_id=${entity_id}`,
   getTransportById:(id:any)=>`${databaseKey}/api/v1/getTransportById?id=${id}`,

},

paymentProgram:{
  paymentProgram:()=>`${databaseKey}/api/v1/paymentProgram`,
    generatePaymentProgramCode:()=>`${databaseKey}/api/v1/generatePaymentProgramNumber`,
    getPaymentAmountBYpaymentAdvoiceId:(id:any,type:any)=>`${databaseKey}/api/v1/getPaymentAmountBYpaymentAdvoiceId?id=${id}&type=${type}`,

},
creditDebitNote:{
    getInvoiceItemByinvoiceId:(id:any,purchase_return_id:any,type:any)=>`${databaseKey}/api/v1/getInvoiceItemByinvoiceId?invoice_id=${id}&purchase_return_id=${purchase_return_id}&type=${type}`,
    creditDebitCodeCustomer:(type:any)=>`${databaseKey}/api/v1/generateCreditDebitCode?type=${type}`,
 createcreditdebitNote:() =>`${databaseKey}/api/v1/createCreditDebitBuilder`,
  },

adjustmentVoucher:{
  createAdjustmentVoucher:()=>`${databaseKey}/api/v1/createAdjustmentJournal`,
  getAllAdjustmentJournalList:()=>`${databaseKey}/api/v1/getAllAdjustmentJournalList`,
  getAdjustmentJournalBYId:(id:any)=>`${databaseKey}/api/v1/getAdjustmentJournalBYId?id=${id}`,
},

  sacWiseRcmReports:{
  getSacWiseTransactions:(sac_code:any)=>`${databaseKey}/api/v1/getSacWiseTransactions?sac_code=${sac_code}`,

  },
  chargesTransport:{
  getTransportChargesTotal:(id:any)=>`${databaseKey}/api/v1/getTransportChargesTotal?id=${id}`,

  },
  adjustmentVoucherPDF:{
  adjustmentVoucherPDF:(id:any)=>`${databaseKey}/api/v1/adjustment-voucher/generate/${id}`,
  purchaseServiceVoucherRoutesDownload:(id:any)=>`${databaseKey}/api/v1/purchaseServiceVoucherRoutesDownload/${id}`,

  }






}
@Injectable({
  providedIn: 'root'
})
export class FinaceService {

  constructor(private httpclient: HttpClient) {

  }
  reconcileBankStatement(data:any){
    return this.httpclient.post<any>(`${databaseKey}/api/v1/reconcile_bank_statement`,data);

  }

  uploadBankStatement(data:any) : Observable<any>{
    const file:File = data.file;
    const entity_id = data.entity_id;
    const chart_account_id =data.chart_account_id;
    const formData:FormData = new FormData();
    formData.append('file',file,file.name);
    formData.append('entity_id',entity_id);
    formData.append('chart_account_id',chart_account_id);
    return this.httpclient.post<any>(`${databaseKey}/api/v1/upload_bank_statement`,formData);
  };
  getRecivedAuditorInvoice(): Observable<any> {
    return this.httpclient.get(routes.finace.getRecivedAuditorInvoice())
  };

  getRecivedVendorInvoice(): Observable<any> {
    return this.httpclient.get(routes.finace.getRecivedVendorInvoice())
  };

  getRecivedExpenseInvoice(): Observable<any> {
    return this.httpclient.get(routes.finace.getRecivedExpenseInvoice())
  };

  getByRecivedAuditorInvoice(id:any): Observable<any> {
    return this.httpclient.get(routes.finace.getByRecivedAuditorInvoice(id))
  };

   getBYRecivedVendorInvoice(id:any): Observable<any> {
    return this.httpclient.get(routes.finace.getBYRecivedVendorInvoice(id))
  };

  getBYRecivedExpenseInvoice(id:any) : Observable<any>{
    return this.httpclient.get(routes.finace.getBYRecivedExpenseInvoice(id))
  };

  getByVendorinoviceCopy(id:any): Observable<any>{
    return this.httpclient.get(routes.finace.getByVendorinoviceCopy(id))
  }

  getByExpenseInvoice(id:any): Observable<any>{
  return this.httpclient.get(routes.finace.getByExpenseInvoice(id))
  }
  getAllExpenseInvoice(): Observable<any>{
    return this.httpclient.get(routes.finace.getAllExpenseInvoice())
    }

    createExpenseInvoice(data:any): Observable<any>{
    return this.httpclient.post(routes.finace.createExpenseInvoice(),data)
    }

    getZohoExpenseInvoice(): Observable<any>{
      return this.httpclient.get(routes.finace.getZohoExpenseInvoice())
      }

    getByRecivable(id:any): Observable<any>{
        return this.httpclient.get(routes.finace.getByRecivable(id))
      }

     updateInvoiceRecivable(id:any,data:any): Observable<any>{
      return this.httpclient.patch(routes.finace.updateRecivable(id),data)
     }

     getAllRecivableApproved(): Observable<any>{
      return this.httpclient.get(routes.finace.getAllRecivableApproved())
      }

     getAllRecivableReject(): Observable<any>{
       return this.httpclient.get(routes.finace.getAllRecivableReject())
  }


    createExpenseZoho(data:any): Observable<any>{
    return this.httpclient.post(routes.finace.createExpenseZoho(),data)
    }

    createExpenseZohoCopy(data:any): Observable<any>{
      return this.httpclient.post(routes.finace.createExpenseZohoCopy(),data)
      }

    getExpenseZoho(): Observable<any>{
      return this.httpclient.get(routes.finace.getExpenseZoho())
 }

 getAllDataExpenseZoho(): Observable<any>{
  return this.httpclient.get(routes.finace.getAllDataExpenseZoho())
}

getAllInvoice(){
  return this.httpclient.get(routes.finace.getAllInvoiceData())
}
getByInvoice(id:any){
  return this.httpclient.get(routes.finace.getByZohoCopy(id))
}

stringSubject = new BehaviorSubject(null);
   passValue(data:any) {
    console.log(data,'data idddd');
    //passing the data as the next observable
    this.stringSubject.next(data);
    console.log(this.stringSubject,'this.stringSubject');

  }

  getEmpTitle(){
    return this.stringSubject;
  }
  getByChannelPartner(id:any): Observable<any>{
    return this.httpclient.get(routes.finace.getByChannelPartner(id))
  }

  getCustomerId(): Observable<any>{
    return this.httpclient.get(routes.finace.getCustomerId())
  }


  createExpensePayble(data:any): Observable<any>{
    return this.httpclient.post(routes.finace.createPaybleExpense(),data)
    }

    createPaymentInvoice(data:any): Observable<any>{
      return this.httpclient.post(routes.finace.createPaymentInvoice(),data)
      }
    fetchPaymentList(id:any,version_id:any): Observable<any>{
        return this.httpclient.get(routes.finace.fetchPaymentList(id,version_id))
    }

    getExpensePayble(): Observable<any>{
      return this.httpclient.get(routes.finace.getPaybleExpenseZoho())
    }

    getByExpenseZohoPayble(id:any): Observable<any>{
      return this.httpclient.get(routes.finace.getByExpenseZohoPayble(id))
    }


    getAllVendorNewInvoice(){
      return this.httpclient.get(routes.finace.getAllVendorNewInvoice())
    }

    getByVendeoNewInvoice(id:any): Observable<any>{
      return this.httpclient.get(routes.finace.getByVendeoNewInvoice(id))
    }

    getAuditorIntercompany():Observable<any>{
      return this.httpclient.get(routes.finace.getAllInterAuditor())
    }

    // budget-managment start
    getAllBudgetList(){
      return this.httpclient.get(routes.budgetManagement.getBudgetList())
    }

    createBudget(data: any){
      return this.httpclient.post(routes.budgetManagement.createBudget(), data)
    }

    getBudgetById(budget_id: any){
      return this.httpclient.get(routes.budgetManagement.getBudgetById(budget_id))
    }

    updateBudget(budget_id: any, data: any){
      return this.httpclient.put(routes.budgetManagement.updateBudget(budget_id), data)
    }

    updateStatusBudget(budget_id: any, data: any){
      return this.httpclient.put(routes.budgetManagement.statusBudget(budget_id), data)
    }

    deleteBudget(budget_id: any){
      return this.httpclient.delete(routes.budgetManagement.deleteBudget(budget_id))
    }
    // budget-managment end

    // subtype start //
    getAllAccountTypeList(){
      return this.httpclient.get(routes.subtype.getAccountTypeList())
    }
    getAllAccountSubtypeList(){
      return this.httpclient.get(routes.subtype.getAccountSubTypeList())
    }

    createAccountSubtype(data: any){
      return this.httpclient.post(routes.subtype.createAccountSubtype(), data)
    }

    getAccountSubtypeById(subtype_id: any){
      return this.httpclient.get(routes.subtype.getAccountSubtypeById(subtype_id))
    }

    updateAccountSubtype(subtype_id: any, data: any){
      return this.httpclient.put(routes.subtype.updateAccountSubtype(subtype_id), data)
    }

    updateStatusAccountSubtype(subtype_id: any, data: any){
      return this.httpclient.put(routes.subtype.statusAccountSubtype(subtype_id), data)
    }
    // subtype end //

    // chart account start//
    getAllAccountTypeBySubtypeList(id: any){
      return this.httpclient.get(routes.chartaccount.getAccountTypeBySubtypeList(id))
    }
    getAllAccountBySubtypeList(id: any){
      return this.httpclient.get(routes.chartaccount.getAccountBySubtypeList(id))
    }
    getAllChartAccountList(){
      return this.httpclient.get(routes.chartaccount.getChartAccountList())
    }

    createChartAccount(data: any){
      return this.httpclient.post(routes.chartaccount.createChartAccount(), data)
    }

    getChartAccountById(chart_id: any){
      return this.httpclient.get(routes.chartaccount.getChartAccountById(chart_id))
    }

    updateChartAccount(chart_id: any, data: any){
      return this.httpclient.put(routes.chartaccount.updateChartAccount(chart_id), data)
    }

    updateStatusChartAccount(chart_id: any, data: any){
      return this.httpclient.put(routes.chartaccount.statusChartAccount(chart_id), data)
    }
    // chart account end//
    getFinancialYear(){
      return this.httpclient.get(routes.financialYear.getFinancialYear())
    }

    getFinancialYearActive(){
      return this.httpclient.get(routes.financialYear.getFinancialYearActive())
    }
    // create financial year
    createFinancialYear(data:any){
      return this.httpclient.post(routes.financialYear.createFinancialYear(), data)
    }
    // update finance
    updateFinancialYear(id: any, data: any){
      return this.httpclient.put(routes.financialYear.updateFinancialYear(id), data)
    }
    // delete finance
    deleteFinancialYear(id: any): Observable<any> {
      return this.httpclient.delete(routes.financialYear.deleteFinancialYear(id));
    }
    // update status financial year
    Financial_Status(id: any, body: any) {
      return this.httpclient.put(routes.financialYear.status(id), body);
    }

    //Budget Plan
    getAllBudgetPlan(entity_id:any,filter_fy:any){
      return this.httpclient.get(routes.budgetPlan.getBudgetPlanList(entity_id,filter_fy))
    }

    createBudgetPlan(data: any,filter_fy:any,entity_id:any){
      return this.httpclient.post(routes.budgetPlan.createBudgetPlan(entity_id,filter_fy), data)
    }

    getBudgetPlanById(id: any){
      return this.httpclient.get(routes.budgetPlan.getBudgetPlanById(id))
    }

    updateBudgetPlan(id: any, data: any){
      return this.httpclient.put(routes.budgetPlan.updateBudgetPlan(id), data)
    }

    deleteBudgetPlan(id: any){
      return this.httpclient.delete(routes.budgetPlan.deleteBudgetPlan(id))
    }

    // Cost center
    getAllCostCenter(entity_id:any){
      return this.httpclient.get(routes.costCenter.getAllCostCenterList(entity_id))
    }
    getAllCostCenterNew(entity_id:any){
      return this.httpclient.get(routes.costCenter.getAllCostCenterNew(entity_id))
    }
    getAllCostCenterActive(entity_id:any){
      return this.httpclient.get(routes.costCenter.getAllCostCenterListActive(entity_id))
    }

    getAllCostCenterActiveByDepartment(department_id:any,entity_id:any){
      return this.httpclient.get(routes.costCenter.getAllCostCenterListActiveByDepartment(entity_id,department_id))
    }

    genertateCCCode(data: any) {
      return this.httpclient.post(routes.costCenter.generateCCCode(), data)
    }

    createCostCenter(data: any,entity_id:any){
      return this.httpclient.post(routes.costCenter.createCostCenter(entity_id), data)
    }

    getCostCenterById(id: any){
      return this.httpclient.get(routes.costCenter.getCostCenterById(id))
    }

    updateCostCenter(id: any, data: any,entity_id:any){
      return this.httpclient.put(routes.costCenter.updateCostCenter(id,entity_id), data)
    }


    updateCostCenterStatus(id: any, data: any,entity_id:any){
      return this.httpclient.put(routes.costCenter.updateCostCenterStatus(id), data)
    }


    deleteCostCenter(id: any){
      return this.httpclient.delete(routes.costCenter.deleteCostCenter(id))
    }

    // Budget Planning
    getAllBudgetPlanning(type:any,id:any,entity_id:any,approvel_status:any,user_id:any,dept_id?:any){
      return this.httpclient.get(routes.budgetPlanning.getAllBudgetPlanning(type,id,entity_id,approvel_status,user_id,dept_id))
    }

    getDepartmentWise(entity_id:any,user_id:any,type:any,id:any){
      return this.httpclient.get(routes.budgetPlanning.getDepartmentWise(entity_id,user_id,type,id))
    }

    createBudgetPlanning(data: any,entity_id: any){
      return this.httpclient.post(routes.budgetPlanning.createBudgetPlanning(entity_id), data)
    }

    getBudgetPlanningById(id: any){
      return this.httpclient.get(routes.budgetPlanning.getBudgetPlanningById(id))
    }

    updateBudgetPlanning(id: any, data: any){
      return this.httpclient.put(routes.budgetPlanning.updateBudgetPlanning(id), data)
    }

    mapBudgetPlanningCC(id: any, data: any){
      return this.httpclient.put(routes.budgetPlanning.mapBudgetPlanningCC(id), data)
    }

    bulkApprovalRequest(data:any){
      return this.httpclient.post(routes.budgetPlanning.bulkApprovalRequest(), data)
    }

    deleteBudgetPlanning(id: any){
      return this.httpclient.delete(routes.budgetPlanning.deleteBudgetPlanning(id))
    }

    getBuisnessUnit(id : any){
      return this.httpclient.get(routes.budgetPlanning.getBuisnessUnit(id))
    }






// chart account start//
// getAllChartAccountList(){
//   return this.httpclient.get(routes.chartaccount.getChartAccountList())
// }

// createChartAccount(data: any){
//   return this.httpclient.post(routes.chartaccount.createChartAccount(), data)
// }

// getChartAccountById(chart_id: any){
//   return this.httpclient.get(routes.chartaccount.getChartAccountById(chart_id))
// }

getChartOfAccountDetailsById(id:any){
  return this.httpclient.get(routes.chartaccount.getChartOfAccountDetailsById(id))
}

getTrialBalanceReportList(entity_id: any,financial_id:any){
  return this.httpclient.get(routes.chartaccount.getTrialBalanceReportList(entity_id,financial_id))
}

getVendorAccListByCode(cc_account_code:any,sns_details_security:any,pgc_account:any): Observable<any>{
  return this.httpclient.get(routes.cash_book.getVendorAccListByCode(cc_account_code,sns_details_security,pgc_account))
  }


// chart account end//

// getChartAccountById(chart_id: any){
//   return this.httpclient.get(routes.chartaccount.getChartAccountById(chart_id))
// }

getAccountGroupByAccountTypeId(account_type_id: any){
  return this.httpclient.get(routes.chartaccount.getAccountGroupById(account_type_id))
}

getRootTypeByChartId(id:any){
  return this.httpclient.get(routes.chartaccount.getRootTypeByChartId(id))
}

getTrialBalance22(id:any){
  return this.httpclient.get(routes.chartaccount.getTrialBalance22(id))
}

getCostCenterHierarchyViewData(id:any){
return this.httpclient.get(routes.cost_center.getCostCenterHierarchyViewData(id))
}

// updateChartAccount(chart_id: any, data: any){
//   return this.httpclient.put(routes.chartaccount.updateChartAccount(chart_id), data)
// }

getMasterAccountType() {
  return this.httpclient.get(
    routes.chartaccount.getMasterAccountType(),
  );
}

getCurrencyList(){
  return this.httpclient.get(routes.chartaccount.getCurrencyList())
}

createChartOfAccount(chart_id:any,data: any){
  return this.httpclient.post(routes.chartaccount.createChartsOfAccount(chart_id), data)
}



getChartOfAccountList(id:any){
  return this.httpclient.get(routes.chartaccount.getChartOfAccountList(id))
}
BankClearenceAccountList(entity_id:any){
  return this.httpclient.get(routes.chartaccount.BankClearenceAccountList(entity_id))
}

getParentAccountList(){
  return this.httpclient.get(routes.chartaccount.getParentAccList())
}
getChartOfAccountById(id:any){
  return this.httpclient.get(routes.chartaccount.getChartOfAccountById(id))
}

deleteChartOfAccount(chart_id:any){
  return this.httpclient.get(routes.chartaccount.deleteChartAccount(chart_id))
}

// posting period

addPostingPeriod(id:any, data:any){
  return this.httpclient.post(routes.postingPeriod.addPostingPeriod(id), data)
}

getPostingPeriodList(id:any){
  return this.httpclient.get(routes.postingPeriod.getPostingPeriodList(id))
}

getPostingPeriodById(id:any){
  return this.httpclient.get(routes.postingPeriod.getPostingPeriodById(id))
}

getPostingPeriodMonthListById(id:any){
return this.httpclient.get(routes.postingPeriod.getPostingPeriodMonthListById(id))
}

deletePostingPeriod(id:any){
  return this.httpclient.get(routes.postingPeriod.deletePostingPeriod(id))
}

getMonthList(){
  return this.httpclient.get(routes.postingPeriod.getMonthList());
  }

  getFinancialYearList(id:any)
{
 return this.httpclient.get(routes.postingPeriod.getFinancialYearList(id));
}

getFromToMonthByEntityId(id:any){
  return this.httpclient.get(routes.postingPeriod.getFromToMonthByEntityId(id));
}

getFinancialYearActiveMonthByEntityId(id:any,financial_id:any){
  return this.httpclient.get(routes.postingPeriod.getFinancialYearActiveMonthByEntityId(id,financial_id))
}
getFinancialYearActiveMonthByEntityId1(id:any){
  return this.httpclient.get(routes.postingPeriod.getFinancialYearActiveMonthByEntityId1(id))
}


getCurrentMonth(){


  let newDate = new Date();

  let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  let newMonth = monthNames[newDate.getMonth()];
  return newMonth
}


// journal entry


getgeneralAccount(status:any, id:any):Observable<any>{
  return this.httpclient.get(routes.JournalEntry.getgeneralAccount(status,id))
}

getJournalList(data:any, entity_id:any):Observable<any>{
  return this.httpclient.post(routes.JournalEntry.getJournalList(entity_id), data)
}

getTradePayableJournalList(data:any, entity_id:any):Observable<any>{
  return this.httpclient.post(routes.JournalEntry.filterTradePayableJournalDetails(entity_id), data)
}

getgeneralById(journal_id:any):Observable<any>{
  return this.httpclient.get(routes.JournalEntry.getgeneralById(journal_id))
}
getsalesJournalById(journal_id:any):Observable<any>{
  return this.httpclient.get(routes.JournalEntry.getsalesJournalById(journal_id))
}

getgeneralNumber():Observable<any>{
  return this.httpclient.get(routes.JournalEntry.getgeneralNumber())
}

journalDelete(id: any) {
  return this.httpclient.put(routes.JournalEntry.journalDelete(id),'')
}

getchartedAccount(id:any):Observable<any>{
  return this.httpclient.get(routes.JournalEntry.getchartedAccount(id))
}

getGParty(id:any){

  return this.httpclient.get(routes.JournalEntry.getGParty(id))
}
getGPartyByEntityId(id:any,entity_id:any){

  return this.httpclient.get(routes.JournalEntry.getGPartyByEntityId(id,entity_id))
}
getCustomerBillingList(customer_id:any){

  return this.httpclient.get(routes.JournalEntry.getCustomerBillingList(customer_id))
}

get_Party_Name_List(id:any,entity_id:any){
  return this.httpclient.get(routes.JournalEntry.get_Party_Name_List(id,entity_id))
}

deleteJournalScheduling(id:any){
  return this.httpclient.get(routes.JournalEntry.deleteJournalScheduling(id))
}

createGeneralBook(data:any){
  console.log(data,'data')
  let payload = {
    "posting_date": data.general_entry.posting_date,
    "journal_no":  data.general_entry.general_number,
    "transaction_date": data.transaction_date,
    "notes": data.general_entry.notes,
    "reference": data.reference,
    "reference_date": data.reference_date,
    "total_of_debit": data.totalCredit,
    "total_of_credit": data.totalDebit,
    "entity_id": data.entity_id,
    // "company_id": Number(data.general_entry.company_id),
    "currency_id": Number(data.currency_id),
    "accountsList": data.account_detail.Account_details,
    "different": data.different,
    "journal_status": data.key,
    "journal_book_status" : 'Journal',
    "isReversal":data.isReversal,
    "parent_journal_no":data.parent_journal_no,
    "employee_id":data.employee_id,
    "customer_id":data.customer_id,
    "product_id":data.product_id,
    "vendor_id":data.vendor_id,
    "party_type":data.party_type,
    "journalDocument":data.general_entry.journalDocument,
    "voucher_id":data.general_entry.voucher_id,
    "bill_number":data.general_entry.bill_number,
    "others":data.general_entry.others,
    "po_id":data.general_entry.po_id,
    "grn_id":data.general_entry.grn_id,
    "document_type":data.general_entry.document_type,
    "invoice_id":data.general_entry.invoice_id,
    "sales_order_id":data.general_entry.sales_order_id,
    "sales_invoice_id":data.general_entry.sales_invoice_id,
    "sales_booking_id":data.general_entry.sales_booking_id,
    "proforma_invoice_id":data.general_entry.proforma_invoice_id,
    "delivery_order_id":data.general_entry.delivery_order_id,
    "financial_posting":data.general_entry.financial_posting,
    "gross_total":data.general_entry.gross_total,
    "financial_id":data.financial_id,
    "tds_amount":data.general_entry.tds_amount,
    "gst_total":data.general_entry.gst_total,
    "net_amount":data.general_entry.net_amount,
  }
  return this.httpclient.post(routes.JournalEntry.createGeneralBook(), data)
}

UpdateGeneralBook(data:any,journal_id?:any){

  let payload = {
    "posting_date": data.general_entry.posting_date,
    "journal_no":  data.general_entry.general_number,
    "transaction_date": data.transaction_date,
    "notes": data.general_entry.notes,
    "reference": data.reference,
    "reference_date": data.reference_date,
    "total_of_debit": data.totalCredit,
    "total_of_credit": data.totalDebit,
    "entity_id": data.entity_id,
    // "company_id": Number(data.general_entry.company_id),
    "currency_id": Number(data.currency_id),
    "accountsList": data.account_detail.Account_details,
    "different": data.different,
    "employee_id":data.employee_id,
    "customer_id":data.customer_id,
    "product_id":data.product_id,
    "party_type":data.party_type,
    "vendor_id":data.vendor_id,
    "journal_status": data.key,
    "journal_book_status" : 'Journal',
     "financial_id":data.financial_id,
    "journalDocument":data.general_entry.journalDocument,
    "voucher_type":data.general_entry.voucher_type,
  }
  return this.httpclient.post(routes.JournalEntry.UpdateGeneralBook(journal_id), payload)
}

createQuickEntry(data:any, journal_id?:any){
  return this.httpclient.post(routes.JournalEntry.createQuickEntry(journal_id), data)
}

createGeneralQuickEntry(data: any){
  return this.httpclient.post(routes.JournalEntry.createGeneralQuickEntry(), data)
}

// Scheduled Journals
getScheduledJournals():Observable<any>{
  return this.httpclient.get(routes.JournalEntry.getScheduledJournals())
}

getScheduledJournalDeatils(journal_id?:any):Observable<any>{
return this.httpclient.get(routes.JournalEntry.getScheduledJournalDeatils(journal_id))
}

// draft Frequency
RepeatFrequencySetUp(data: any){
return this.httpclient.post(routes.JournalEntry.RepeatFrequencySetUp(), data)
}

getDefaultCurrencyId()
{
  return this.httpclient.get(routes.chartaccount.getDefaultCurrencyId())
}



// bank

saveBank(id:any,data:any){
  return this.httpclient.post(routes.bank.createBank(id), data)
}


getBankList(entity_id:any){
  return this.httpclient.get(routes.bank.getBankList(entity_id))
}
getBankAccountListByBank(id:any){
  return this.httpclient.get(routes.bank.getBankAccountByBankId(id))
}

updateClearanceDates(data:any){
  return this.httpclient.put(routes.bank.updateClearanceDates(), data)
}

// getTrialBalanceList(company_id:any){
//   return this.httpclient.get(routes.trial_balance.getTrialBalanceList(company_id))
// }

// getFilterTrialBalanceList(financial_year_id:any,company_id:any){
//   return this.httpclient.get(routes.trial_balance.getFilterTrialBalanceList(financial_year_id,company_id))
// }
// getProfitAndLossList(company_id:any,financial_year_id:any){
//   return this.httpclient.get(routes.trial_balance.getProfitAndLossList(company_id,financial_year_id))
// }
// getBalanceSheetList(company_id:any,financial_year_id:any){
//   return this.httpclient.get(routes.trial_balance.getBalanceSheetList(company_id,financial_year_id))
// }

// getFisicalList(){
//   return this.httpclient.get(routes.fiscalYear.getFiscalYearList())
// }

getBankById(id: any){
  return this.httpclient.get(routes.bank.getBankById(id))
}

getBankDetailsById(id:any)
{
return this.httpclient.get(routes.bank.getBankDetailsById(id))
}

deleteBank(id:any){
  return this.httpclient.get(routes.bank.deleteBank(id))
}

getCountriesList() {
  return this.httpclient.get(
    routes.bank.getCountryList(),
  );
}


// bank account

saveBankAccount(id:any,data:any){
  return this.httpclient.post(routes.bankAccount.createBankAccount(id), data)
}


getBankAccountList(entity_id:any){
  return this.httpclient.get(routes.bankAccount.getBankAccountList(entity_id))
}

getBankAccountById(id: any){
  return this.httpclient.get(routes.bankAccount.getBankAccountById(id))
}

deleteBankAccount(id:any){
  return this.httpclient.get(routes.bankAccount.deleteBankAccount(id))
}

getAccountListForBank(){
  return this.httpclient.get(routes.bankAccount.getAccountListForBank())
}

getBank(entity_id:any){
  return this.httpclient.get(routes.bankAccount.getBankList(entity_id))
}
getBankAccount(entity_id:any){
  return this.httpclient.get(routes.bankAccount.getBankAccount(entity_id))
}

getBankAccountDetailsById(id:any){
  return this.httpclient.get(routes.bankAccount.getBankAccountDetailsById(id))
}

// bank clearence

getCashInBankCOA(id:any){
return this.httpclient.get(routes.bank.getCashInBankCOA(id));
}

getJournalEntriesForBankClearance(account_id:any,entity_id:any,data:any){
  return this.httpclient.post(routes.bank.getJournalEntriesForBankClearance(account_id,entity_id), data);
}

checkBankAccountForJournal(data:any){
  return this.httpclient.post(routes.chartaccount.checkBankAccountForJournal(), data);
}

getClosingBalanceForBankReconciliation(data:any, account_id:any, entity_id:any){
  return this.httpclient.post(routes.bank.getClosingBalanceForBankReconciliation(account_id, entity_id), data);
}


// trial balance


getFilterTrialBalanceList(entity_id:any,financial_id:any){
  return this.httpclient.get(routes.trial_balance.getFilterTrialBalanceList(entity_id,financial_id))
}

getTrialBalanceList(entity_id:any,financial_id:any){
  return this.httpclient.get(routes.trial_balance.getTrialBalanceList(entity_id,financial_id))
}

getAllJournalEntriesForBankClearance(account_id:any,entity_id:any,data:any){
  return this.httpclient.post(routes.bank.getAllJournalEntriesForBankClearance(account_id,entity_id), data);
}
getBankClearenceList(entity_id:any){
  return this.httpclient.get(routes.finace.getBankClearenceList(entity_id));
}
getAllErpDataList(entity_id:any,id:any){
  return this.httpclient.get(routes.finace.getAllErpDataList(entity_id,id));
}


// cash book

getCustomerList(entity_id:any){
  return this.httpclient.get(routes.cashBook.getCustomerList(entity_id));
}

// cashBook
requestCashbookRequest(data:any){
  return this.httpclient.post(routes.cash_book.requestCashbookRequest(), data);
}

getDepartNameById(department_id:any){
  return this.httpclient.get(routes.cash_book.getDepartNameById(department_id))
}

generateFundRequestNo(){
  return this.httpclient.get(routes.cash_book.generateFundRequestNo())
}

getAllFundRequest(id:any,entity_id:any, role:any){
  return this.httpclient.get(routes.cash_book.getAllFundRequest(id,entity_id,role))
}


getProfitAndLossList(entity_id:any,financial_id:any){

  return this.httpclient.get(routes.trial_balance.getProfitAndLossList(entity_id,financial_id))
}

getBalanceSheetList(entity_id:any){
  return this.httpclient.get(routes.trial_balance.getBalanceSheetList(entity_id))
}
createMakePayment(data:any){
  return this.httpclient.post(routes.makePayment.createMakePayment(),data)
}

getAccountListForCashBook(){
  return this.httpclient.get(routes.cash_book.getAccountListForCashBook());
}

getInterestIncomeAccountList(){
  return this.httpclient.get(routes.cash_book.getInterestIncomeAccountList());
}

getOtherIncomeAccountList(){

  return this.httpclient.get(routes.cash_book.getOtherIncomeAccountList());
}

getAllEquityAccountList(){
  return this.httpclient.get(routes.cash_book.getAllEquityAccountList());
}

getVendorList(){
  return this.httpclient.get(routes.cash_book.getVendorList());
}

addCashBookMoneyIn(data:any){
  return this.httpclient.post(routes.cash_book.addCashBookMoneyIn(), data)
}

addCashBookMoneyOut(data:any){
  return this.httpclient.post(routes.cash_book.addCashBookMoneyOut(),data);
}

getCashBookData(id:any)
{
  return this.httpclient.get(routes.cash_book.getCashBookData(id));
}

getExpenseAccountList(id:any){
return this.httpclient.get(routes.cash_book.getExpenseAccountList(id));
}

getMoneyOutToAccountList(id:any){
  return this.httpclient.get(routes.cash_book.getMoneyOutToAccountList(id));
  }

  getCashBookDataById(id:any, form_type:any){
    return this.httpclient.get(routes.cash_book.getCashBookDataById(id, form_type));
  }

  getFundTransferById(id:any, employee_id:any){
    return this.httpclient.get(routes.cash_book.getFundTransferById(id,employee_id));
  }

  approvedFundTransferById(id:any, status:any){
    return this.httpclient.put(routes.cash_book.approvedFundTransferById(id),status);
  }

  getCustomerCategory(id:any){
    return this.httpclient.get(routes.makePayment.getCustomerCategory(id));
  }

  getVendorDetails(vendor_id:any){
    return this.httpclient.get(routes.makePayment.getVendorDetails(vendor_id));
  }

  getProductList(){
   return this.httpclient.get(routes.chartaccount.getProductList());
  }

  getFinancialYearCopy(){
    return this.httpclient.get(routes.financialYear.getFinancialYearCopy())
  }
  getAllCashAccount(id:any){
    return this.httpclient.get(routes.cash_book.getAllCashAccount(id));
  }

  createProfitCenter(data:any){
    return this.httpclient.post(routes.profitCenter.createProfitCenter(),data);
  }
  getAllProfitCenter(entity_id:any){
    return this.httpclient.get(routes.profitCenter.getAllProfitCenter(entity_id));
  }

  getAllProfitCenterIsGroup(entity_id:any){
    return this.httpclient.get(routes.profitCenter.getAllProfitCenterIsGroup(entity_id));
  }
  getProfitCenterHierarchyViewData(entity_id:any){
    return this.httpclient.get(routes.profitCenter.getProfitCenterHierarchyViewData(entity_id));
  }

  getAllCostCenterIsGroup(entity_id:any){
    return this.httpclient.get(routes.costCenter.getAllCostCenterIsGroup(entity_id));
  }
  generateFinanceCostCenterCode(entity_id:any):Observable<any>{
    return this.httpclient.get(routes.costCenter.generateFinanceCostCenterCode(entity_id))
  }
  createAdvicePayment(data:any){
    return this.httpclient.post(routes.transactions.paymentAdvice(),data);
  }
  getAdvicepayment(id:any,data:any){
    return this.httpclient.post(routes.transactions.getAdvicepayment(id),data);
  }
  generateNumber(data:any){
    return this.httpclient.post(routes.transactions.generateNumber(),data);
  }

  // generateBankRecieptNumber(){
  //   return this.httpclient.get(routes.transactions.bankRecieptNumberDoc());
  // }
  createBankReciept(data:any){
    return this.httpclient.post(routes.transactions.createBankReciept(),data);
  }
  getBankReciept(id:any){
    return this.httpclient.get(routes.transactions.getBankReciept(id));
  }

  generateBankPaymentNumber(){
    return this.httpclient.get(routes.transactions.generateBankPaymentNumber());
  }
  generateSalesJournalNumber(){
    return this.httpclient.get(routes.transactions.generateSalesJournalNumber());
  }

  createBankPayment(data:any){
    return this.httpclient.post(routes.transactions.createBankPayment(),data);
  }

  createSalesJournal(data:any){
    return this.httpclient.post(routes.transactions.createSalesJournal(),data);
  }
  getBankPaymentRecord(id:any){
    return this.httpclient.get(routes.transactions.getBankPaymentRecord(id));
  }
  getSalesJournalData(id:any){
    return this.httpclient.get(routes.transactions.getSalesJournalData(id));
  }

  createPurchaseJournal(data:any){
    return this.httpclient.post(routes.transactions.createPurchaseJournal(),data);
  }
  createPurchaseService(data:any){
    return this.httpclient.post(routes.transactions.createPurchaseService(),data);
  }

  getPurchaseJournalData(id:any){
    return this.httpclient.get(routes.transactions.getPurchaseJournalData(id));
  }
  getPurchaseServiceList(id:any){
    return this.httpclient.get(routes.transactions.getPurchaseServiceList(id));
  }
  getAddvisePaymentById(id:any){
    return this.httpclient.get(routes.transactions.getAddvisePaymentById(id));
  }
  getBankRecieptById(id:any){
    return this.httpclient.get(routes.transactions.getBankRecieptById(id));
  }
  getPaymentAdviceReport(id:any){
    return this.httpclient.get(routes.paymentReport.getPaymentAdviceReport(id));
  }

  getBankRecieptReport(id:any){
    return this.httpclient.get(routes.paymentReport.getBankRecieptReport(id));
  }
  getBankPaymentReport(id:any){
    return this.httpclient.get(routes.paymentReport.getBankPaymentReport(id));
  }

  getAdditionalPostingPeriodMonthListById(id:any){
    return this.httpclient.get(routes.postingPeriod.getAdditionalPostingPeriodMonthListById(id))
    }

    getFromToMonthByFinancialYear(id:any){
      return this.httpclient.get(routes.postingPeriod.getFromToMonthByFinancialYear(id));
    }

    get_All_Bank_Acc_List(){
      return this.httpclient.get(routes.bankAccount.get_All_Bank_Acc_List());
    }
    filterVendorLedgerReport(data:any,entity_id:any)
{
  return this.httpclient.post(routes.vendorLedger.filterVendorLedgerReport(entity_id),data);
}
getVendorCOA(): Observable<any>{
  return this.httpclient.get(routes.directInvoice.getVendorCOA())
  }
  getCustomerCOA(): Observable<any>{
  return this.httpclient.get(routes.directInvoice.getCustomerCOA())
  }
  getCostCenterLedger(data:any,id:any){
    return this.httpclient.post(routes.trial_balance.getCostCenterLedger(id),data);
  }
  getProfitCenterLedger(data:any,id:any){
    return this.httpclient.post(routes.trial_balance.getProfitCenterLedger(id),data);
  }
  getVendorDataByTds(id:any){
    return this.httpclient.get(routes.getVendorDataByTds.getVenodrTdsById(id));
  }
  getTransporterByIdTdsValue(id:any){
    return this.httpclient.get(routes.getVendorDataByTds.getTransporterByIdTdsValue(id));
  }
  getTdsNatureOfTransaction(id:any,vendor_id:any){
    return this.httpclient.get(routes.getVendorDataByTds.getTdsNatureOfTransaction(id,vendor_id));
  }
  getTdsNatureOfTransactionTransporter(id:any,transporter_id:any){
    return this.httpclient.get(routes.getVendorDataByTds.getTdsNatureOfTransactionTransporter(id,transporter_id));
  }
  createCashReciept(data:any){
    return this.httpclient.post(routes.cashReciept.createCashReciept(),data);
  }
  generateCashRecieptNumber(){
    return this.httpclient.get(routes.cashReciept.generateCashRecieptNumber());
  }
  getCashRecieptList(entity_id: string | null){
    return this.httpclient.get(routes.cashReciept.getCashRecieptList(entity_id));
  }
  downloadCashRecieptById(id: any): Observable<ArrayBuffer> {
    return this.httpclient.get(routes.cashReciept.downloadCashRecieptById(id), {
      responseType: 'arraybuffer'
    });
  }
  getCashRecieptById(id:any){
    return this.httpclient.get(routes.cashReciept.getCashRecieptById(id));
  }
  getCashRecieptReportList(entity_id:any){
    return this.httpclient.get(routes.cashReciept.getCashRecieptReportList(entity_id));
  }
    getAllPoGrnSoByVendorId(data:any){
    return this.httpclient.post(routes.transactions.getAllPoGrnSoByVendorId(),data);
  }
  getBankPaymentById(id:any){
    return this.httpclient.get(routes.transactions.getBankPaymentById(id));
  }
  createCashPayment(data:any){
    return this.httpclient.post(routes.cashPayment.createCashPayment(),data);
  }
  generateCashPaymentNumber(){
    return this.httpclient.get(routes.cashPayment.generateCashPaymentNumber());
  }
  getCashPaymentList(entity_id:any){
    return this.httpclient.get(routes.cashPayment.getCashPaymentList(entity_id));
  }
  getCashPaymentById(id:any){
    return this.httpclient.get(routes.cashPayment.getCashPaymentById(id));
  }
  getCashPaymentReportList(entity_id:any){
    return this.httpclient.get(routes.cashPayment.getCashPaymentReportList(entity_id));
  }
  mapTdsCA(data:any){
    return this.httpclient.put(routes.mapTdsCA.createGlobalTdsMapCA(),data);
  }
  vendorPayment(data:any){
    return this.httpclient.post(routes.vendorPayment.createVendorRecordPayment(),data);
  }
  createVendorPaymentVoucherSeries(branch_id:any){
    return this.httpclient.get(routes.vendorPayment.createVendorPaymentVoucherSeries(branch_id));
  }
  getAllVendorRecordPayment(entity_id:any){
    return this.httpclient.get(routes.vendorPayment.getAllVendorRecordPayment(entity_id));
  }
  getVendorPaymentHistoryByVendor(data:any){
    return this.httpclient.post(routes.vendorPayment.getVendorPaymentHistoryByVendor(),data);
  }

  getPaymentAdviceHistory(data:any){
    return this.httpclient.post(routes.transactions.paymentAdviceHistory(),data);
  }
  customerRecordPayment(data:any){
    return this.httpclient.post(routes.customerRecordPayment.getDataDynamicById(),data);
  }

    mapSalesCA(data:any){
    return this.httpclient.post(routes.mapSalesCA.mapSalesCA(),data);
  }

  createCustomerRecordPayment(data:any){
    return this.httpclient.post(routes.customerRecordPayment.createCustomerRecordPayment(),data);
  }
  getListCustomerRecordPayment(entity_id:any){
    return this.httpclient.get(routes.customerRecordPayment.getListCustomerRecordPayment(entity_id));
  }
  getRCMPurchaseRegister(entity_id:any,financial_id:any,type:any){
    return this.httpclient.get(routes.customerRecordPayment.getRCMPurchaseRegister(entity_id,financial_id,type));
  }
  tdsRegisterData(entity_id:any){
    return this.httpclient.get(routes.tdsRegisterData.getAllTdsRegister(entity_id));
  }
  generateBankReceiptNumber(data:any){
    return this.httpclient.put(routes.transactions.generateBankReceiptNumber(),data);
  }
  generateBankPayment(data:any){
    return this.httpclient.put(routes.transactions.generateBankPayment(),data);
  }
  generateBankRecieptNumberNew(data:any){
    return this.httpclient.put(routes.transactions.generateBankRecieptNumberNew(),data);
  }
  generatecashPaymentNumber(data:any){
    return this.httpclient.put(routes.transactions.generatecashPaymentNumber(),data);
  }
  generatesalesJournalNumber(data:any){
    return this.httpclient.put(routes.transactions.generatesalesJournalNumber(),data);
  }
  generatePurchaseJournalNumber(data:any){
    return this.httpclient.put(routes.transactions.generatePurchaseJournalNumber(),data);
  }
  getBillingAddressById(vendor_id:any){
    return this.httpclient.get(routes.transactions.getBillingAddressById(vendor_id));
  }
  generatePurchaseServiceNumber(data:any){
    return this.httpclient.put(routes.transactions.generatePurchaseServiceNumber(),data);
  }
  getCreditNoteList(entity_id:any){
    return this.httpclient.get(routes.transactions.getCreditNoteList(entity_id));
  }
  getPurchaseCreditLimitList(entity_id:any){
    return this.httpclient.get(routes.transactions.getPurchaseCreditLimitList(entity_id));
  }
  getPurchaseDebitLimitList(entity_id:any){
    return this.httpclient.get(routes.transactions.getPurchaseDebitLimitList(entity_id));
  }
  purchaseRegister(entity_id:any){
    return this.httpclient.get(routes.transactions.purchaseRegister(entity_id));
  }
  getSalesCreditLimitList(entity_id:any){
    return this.httpclient.get(routes.transactions.getSalesCreditLimitList(entity_id));
  }
  getSalesDebitNoteList(entity_id:any){
    return this.httpclient.get(routes.transactions.getSalesDebitNoteList(entity_id));
  }
  getCreditNoteById(id:any,type:any){
    return this.httpclient.get(routes.transactions.getCreditNoteById(id,type));
  }
  createGlMappingTransactions(data:any){
    return this.httpclient.post(routes.glAccountMap.createGlMappingTransactions(),data);
  }
  getAllGlMappingData(entity_id:any){

    return this.httpclient.get(routes.glAccountMap.getAllGlMappingData(entity_id));
  }
  createFinacialTransactionIntegration(data:any){
    return this.httpclient.post(routes.glAccountMap.createFinacialTransactionIntegration(),data);
  }
  getBankEntriesForBankReconciliationStatm(data:any){
    return this.httpclient.post(routes.bank.getBankEntriesForBankReconciliationStatm(), data);
  }
  getUnReconciledBankEntries(data:any){
    return this.httpclient.post(routes.bank.getUnReconciledBankEntries(), data);
  }

  createServiceVoucher(data:any){
    return this.httpclient.post(routes.serviceVoucher.createServiceVoucher(), data);
  }

  generateServiceVoucherNumber(data:any){
    return this.httpclient.put(routes.serviceVoucher.generateServiceVoucherNumber(),data);
  }
  getServiceVoucherById(id:any){
    return this.httpclient.get(routes.serviceVoucher.getServiceVoucherById(id));
  }
  getAllServiceVoucherList(entity_id:any){
    return this.httpclient.get(routes.serviceVoucher.getAllServiceVoucherList(entity_id));
  }
  createTransportVoucher(data:any){
    return this.httpclient.post(routes.transportVoucher.createTransportVoucher(),data);
  }
   getAllTransportVoucherList(){
    return this.httpclient.get(routes.transportVoucher.getAllTransportVoucherList());
  }
  getLRDataList(transporter_id:any,entity_id:any){
    return this.httpclient.get(routes.transportVoucher.getLRDataList(transporter_id,entity_id));
  }
  paymentProgram(data:any){
    return this.httpclient.post(routes.paymentProgram.paymentProgram(),data);
  }
   getAllServiceDataById(id:any){
    return this.httpclient.get(routes.glAccountMap.getAllServiceDataById(id));
  }
  paymentProgramCode() {
    return this.httpclient.get(routes.paymentProgram.generatePaymentProgramCode())
  }
   getPaymentAmountBYpaymentAdvoiceId(id:any,type:any) {
    return this.httpclient.get(routes.paymentProgram.getPaymentAmountBYpaymentAdvoiceId(id,type))
  }
    getTransportById(id:any) {
    return this.httpclient.get(routes.transportVoucher.getTransportById(id))

  }
   getInvoiceItemByinvoiceId(id:any,purchase_return_id:any,type:any) {
    return this.httpclient.get(routes.creditDebitNote.getInvoiceItemByinvoiceId(id,purchase_return_id,type))
  }

  creditDebitCodeCustomer(type:any) {
    return this.httpclient.get(routes.creditDebitNote.creditDebitCodeCustomer(type))
  }

    createcreditdebitNote(data:any){
    return this.httpclient.post(routes.creditDebitNote.createcreditdebitNote(),data);
  }

  purchaseJournalById(id:any){
    return this.httpclient.get(routes.transactions.purchaseJournalById(id));
  }
  purchaseServiceById(id:any){
    return this.httpclient.get(routes.transactions.purchaseServiceById(id));
  }

  createAdjustmentVoucher(data:any){
    return this.httpclient.post(routes.adjustmentVoucher.createAdjustmentVoucher(),data);
  }

  getAllAdjustmentJournalList(){
    return this.httpclient.get(routes.adjustmentVoucher.getAllAdjustmentJournalList());
  }

  getAdjustmentJournalBYId(id:any){
    return this.httpclient.get(routes.adjustmentVoucher.getAdjustmentJournalBYId(id));
  }
  getSacWiseTransactions(sac_code:any){
    return this.httpclient.get(routes.sacWiseRcmReports.getSacWiseTransactions(sac_code))
  }
  getTransportChargesTotal(sac_code:any){
    return this.httpclient.get(routes.chargesTransport.getTransportChargesTotal(sac_code))
  }

  getProfitCenterDetailedLedger(entity_id: any, profit_center_id: any, params: any) {
    return this.httpclient.get(`${databaseKey}/api/v1/getProfitCenterDetailedLedger/${entity_id}/${profit_center_id}`, { params });
}


 getProfitCenterById(id:any){
    return this.httpclient.get(routes.profitCenter.getProfitCenterById(id));
  }

  updateProfitCenter(id:any,data:any){
    return this.httpclient.post(routes.profitCenter.updateProfitCenter(id),data);
  }
   deleteProfitCenter(id:any){
    return this.httpclient.delete(routes.profitCenter.deleteProfitCenter(id));
  }
  getInputOutputGstReport(entity_id:any){
    return this.httpclient.get(routes.transactions.getInputOutputGstReport(entity_id));
  }
  getSalesRegisterGSTReport(entity_id:any){
    return this.httpclient.get(routes.transactions.getSalesRegisterGSTReport(entity_id));
  }
  adjustmentVoucherPDF(id:any,data:any){
    return this.httpclient.post(routes.adjustmentVoucherPDF.adjustmentVoucherPDF(id),data);
  }
  purchaseServiceVoucherRoutesDownload(id:any){
    return this.httpclient.get(routes.adjustmentVoucherPDF.purchaseServiceVoucherRoutesDownload(id));
  }
}
