import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.serverUrl;

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
   getByExpenseZohoPayble:(id:any)=>`${databaseKey}/api/v1/newExpenseDetails/${id}`,
   getAllVendorNewInvoice:()=>`${databaseKey}/api/v1/getAll_issued`,
   getByVendeoNewInvoice:(id:any)=>`${databaseKey}/api/v1/getAll_Approved_pr_getBy_id/${id}`,
   getAllInterAuditor:()=>`${databaseKey}/api/v1/get_all_leadManagement_data`

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
  chartaccount: {
    getAccountTypeBySubtypeList: (id: any)=> `${databaseKey}/api/v1/get_all_accSubtypes_ByAccType/${id}`,
    getAccountBySubtypeList: (id: any)=> `${databaseKey}/api/v1/get_all_account_bysubtypeId/${id}`,
    getChartAccountList: ()=> `${databaseKey}/api/v1/get_all_account_list`,
    createChartAccount: ()=> `${databaseKey}/api/v1/Create_account`,
    getChartAccountById: (chart_id: any)=> `${databaseKey}/api/v1/get_account_ById/${chart_id}`,
    updateChartAccount: (chart_id: any)=> `${databaseKey}/api/v1/update_account/${chart_id}`,
    statusChartAccount: (chart_id: any)=> `${databaseKey}/api/v1/update_Account_Status/${chart_id}`,
  },
}
@Injectable({
  providedIn: 'root'
})
export class FinaceService {

  constructor(private httpclient: HttpClient) { 

  }

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
}
