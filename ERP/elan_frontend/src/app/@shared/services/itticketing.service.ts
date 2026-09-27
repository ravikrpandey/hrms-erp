import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

const routes = {
  Itticketing: {
    itticketingCreate: () => `${databaseKey}/api/v1/create_itTicketing`,
    itticketingGet: () => `${databaseKey}/api/v1/get_itTicketing`,
    itticketingGetById: (employee_id: any) =>`${databaseKey}/api/v1/getById_itTicketing/${employee_id}`,
    itticketingUpdate: (employee_id: any) =>`${databaseKey}/api/v1/edit_itTicketing/${employee_id}`,
    userGetById:(employee_id:any) =>`${databaseKey}/api/v1/getByUserId_itTicketing/${employee_id}`,
    loginID: (id: any) => `${databaseKey}/api/WL/userbyid/${id}`,
    getAllDataNameDropDown: () => `${databaseKey}/api/v1/get_NAME_EmpID`,
    /*dropdown selection */
    todayitticketing: () => `${databaseKey}/api/v1/get_AllToday_itTicketing`,
    weakselectitTicketing: () => `${databaseKey}/api/v1/getAll_preWeek_itTicketing`,
    monthselectitTicketing: () => `${databaseKey}/api/v1/getAll_currentMonth_itTicketing`,
    /*dropdown selection */
     /*calendar date */
     selectdate_itTicketing: () => `${databaseKey}/api/v1/getAll_manualSelect_itTicketing`,
     /*calendar date */
    /*status satart */
    allstatusitticketing: () => `${databaseKey}/api/v1/get_Allstatus_itTicketing`,
    openstatusitticketing: () => `${databaseKey}/api/v1/get_AllOPEN_itTicketing`,
    inprogressitticketing: () => `${databaseKey}/api/v1/get_All_inPROGRES_itTicketing`,
    closeitticketing: () => `${databaseKey}/api/v1/get_AllClose_itTicketing`,
    /* status end */

    // expense module
    createExpenseDetails:()=>`${databaseKey}/api/v1/createexpensedetails`,
   getExpenseDetails:()=>`${databaseKey}/api/v1/expensedetailslist`,
   getAllAccreId:()=> `${databaseKey}/api/v1/getAllAccredition_logo_details`,
   getAllSign:()=> `${databaseKey}/api/v1/getAll_signature`,
   getByExpenseDetails:(id:any)=>`${databaseKey}/api/v1/getbyexpensedetails/${id}`,
   //vikash start //
   getAllverifierstatus: () =>`${databaseKey}/api/v1/getAll_verifier_status`,
   updateverifierstatus: (id:any) =>`${databaseKey}/api/v1/updatetravelticketdetails_status/${id}`,
   updatexpenseverifierstatus: (id:any)=>`${databaseKey}/api/v1/edit_exp_detail_verifier/${id}`,
   //vikash end //
   createExpense:()=>`${databaseKey}/api/v1/createmyexpenses`,
   createSignature:()=>`${databaseKey}/api/v1/create_signature`,
   updateSignature:(id:any)=>`${databaseKey}/api/v1/edit_signature/${id}`,
   getByIDSignature:(id:any) => `${databaseKey}/api/v1/get_ById_signature/${id}`,
   getExpenseList:(id:any)=>`${databaseKey}/api/v1/myexpenseslist/${id}`,
   getByIdExpense:(id:any)=>`${databaseKey}/api/v1/getbymyexpenses/${id}`,
   getTaskOrder:()=>`${databaseKey}/api/v1/getAllleadmanagmenttaskOrder_no`,
   editByIdExpense:(id:any)=>`${databaseKey}/api/v1/updatemyexpenses/${id}`,
   updateExpenseDetails:(id:any)=>`${databaseKey}/api/v1/updateexpensedetails/${id}`,
   getPending:()=>`${databaseKey}/api/v1/getmyexpensespending`,
   getApprove:()=>`${databaseKey}/api/v1/getmyexpensesapproved`,
   getPaid:()=>`${databaseKey}/api/v1/getallmyexpensespaid`,
   gettravelConfirmTicket:()=>`${databaseKey}/api/v1/getmyexpensesconfirmticket`,
   updateReturnTicket:(id:any)=>`${databaseKey}/api/v1/update_ExpenseRequest/${id}`,
   createExpenseDetailsCopy:()=>`${databaseKey}/api/v1/createexpensedetailsShallocopy`,
   getExpenseDetailsCopy:(id:any)=>`${databaseKey}/api/v1/getbyexpensedetails/${id}`,
   travelerMultipleCreate:()=>`${databaseKey}/api/v1/createexpensechild`,
   getByTravlerMultiCreate:(id:any)=>`${databaseKey}/api/v1/getbyTravelRequestchild/${id}`,
   updateCancelReuest:(id:any)=>`${databaseKey}/api/v1/updatetravelticketdetails/${id}`,
   getCancelReuest:()=>`${databaseKey}/api/v1/getbyTravelTicketcancel`,
   getCancelRequestData:(id:any)=>`${databaseKey}/api/v1/getbytravelticketcancelledbyid/${id}`,
   zipGetFile:(id:any)=>`${databaseKey}/api/v1/getallbyidMyExpenses/${id}`,
   getExpenseProcessing:()=>`${databaseKey}/api/v1/myExpenselistProcessing`,
   getExpensePosted:()=>`${databaseKey}/api/v1/myExpenselistPosted`,
   getExpenseMangeApprovel:()=>`${databaseKey}/api/v1/getallmyexpensesmanageapproval`,
   updateUploadOnbording:(id:any)=>`${databaseKey}/api/v1/update_Onboarding_Travel_Request/${id}`,
   getOpenStatusData:()=>`${databaseKey}/api/v1/myExpenselistOpen`,
   getByTravelBookTicket:(id:any)=>`${databaseKey}/api/v1/getbyTravelRequestchild/${id}`,
   getAllUserList:(id:any)=>`${databaseKey}/api/v1/getExpenseAll_User/${id}`,
   getAllAgentList:(id:any)=>`${databaseKey}/api/v1/getExpenseAll_Agent/${id}`,
   getAllMangerList:(id:any)=>`${databaseKey}/api/v1/getExpenseAll_Manager/${id}`,
   getAllExpenseCurrency:()=>`${databaseKey}/api/v1/getAll_Currency`,
   getAllCancelTicket:(id:any,id2:any)=>`${databaseKey}/api/v1/travelticketcancellist_status/${id}/${id2}`,
   getGstFileDownload:(id:any,id2:any)=>`${databaseKey}/api/v1/TravelTicketlistbyidfile/${id}/${id2}`,
   getByCurrency:(id:any)=>`${databaseKey}/api/v1/getbyAll_Currency/${id}`,
   getmyExpenseBookTicket:(id:any)=>`${databaseKey}/api/v1/travelticketlist_detail/${id}`,
   getByExpenseDetailsIdCopy:(id:any)=>`${databaseKey}/api/v1/getbyexpensedetailsbyid/${id}`,
   getApprovedRejectTravel:()=>`${databaseKey}/api/v1/getmyexpensesrejected`,
   getPreAuditExpense:()=>`${databaseKey}/api/v1/getAll_expenseforCopy`,
   createTravelTicketCopy:()=>`${databaseKey}/api/v1/createtravelticketcopy`,
   getTravelTicktCopy:(id:any)=>`${databaseKey}/api/v1/TravelTicketlistBYEMP_TCKT/${id}`,
   getTravelTicketInactive:(id:any)=>`${databaseKey}/api/v1/TravelTicketlistDetail_Inactive/${id}`,
   updateTicketexpense:(id:any)=>`${databaseKey}/api/v1/update_expense_status_TravelTicket/${id}`,
   getOnBordingFile:(id:any)=>`${databaseKey}/api/v1/getOnboarding_Travel_RequestByexpense_id/${id}`,
   getStateMyExpense:()=>`${databaseKey}/api/v1/getallstatescontroller`,
   getCityMyExpense:()=>`${databaseKey}/api/v1/getallcitycontroller`,
   getExpenseTicketActive:(id:any,id2:any)=>`${databaseKey}/api/v1/TravelTicketlistDetail_active/${id}/${id2}`,
   getUpdateStaus:()=>`${databaseKey}/api/v1/getAllMyexpenses_Paid_withupdate`,
   getByDownloadPdf:(file:any)=>`${databaseKey}/api/v1/download_Document_attach_invoice/${file}`,
   getByTravelTicketCopy:(empId:any, expenseId:any,ticketId:any)=>`${databaseKey}/api/v1/travelticketlist_info/${empId}/${expenseId}/${ticketId}`,
   getByTravelRequestChildDetails:(expenseId:any,childid:any)=>`${databaseKey}/api/v1/getbyTravelRequestchild_details/${expenseId}/${childid}`,
   filterExpenseData:(id:any)=>`${databaseKey}/api/v1/myexpenseslist_date_filter/${id}`,
   filterPostExpenseDetail:(id:any)=>`${databaseKey}/api/v1/myexpenseslist_date_filter/${id}`,
   getAllCancel:(id:any)=>`${databaseKey}/api/v1/getAllCancelTicket/${id}`,
   getAllNewCancelTicket:(id:any,id2:any)=>`${databaseKey}/api/v1/travelticketcancellist_data/${id}/${id2}`
  },
}


@Injectable({
  providedIn: 'root'
})
export class ItticketingService {
ticketsumbit(itTicketing_number: (itTicketing_number: any) => void) {
  throw new Error('Method not implemented.');
}
constructor(private http: HttpClient) {}
CreateItticketing(data: any,fileAttch:File): Observable<any> {
  const formData=new FormData();
  for(let key in data){
    formData.append(`${key}`,data[key]);
  }
  if(fileAttch){
    formData.append("attachment",fileAttch,fileAttch.name)

  }
  return this.http.post(routes.Itticketing.itticketingCreate(), formData);
}
getittIcketing(): Observable<any> {
  return this.http.get(routes.Itticketing.itticketingGet());
}
getByIdItticketing(employee_id: any): Observable<any> {
  return this.http.get(routes.Itticketing.itticketingGetById(employee_id));
}
getByIduser(employee_id:any): Observable<any>{
  return this.http.get(routes.Itticketing.userGetById(employee_id));
}
updateItticketing(employee_id: any, data: any,fileAttch:File): Observable<any> {
  
  
  const formData=new FormData();
  for(let key in data){
    formData.append(`${key}`,data[key]);
  }
  if(fileAttch){
    formData.append("attachment",fileAttch,fileAttch.name)

  }
  
  return this.http.put<any>(routes.Itticketing.itticketingUpdate(employee_id), formData);

}
get_logIn_Admin_name(id: any):Observable<any> {
  return this.http.get<any>(routes.Itticketing.loginID(id));
} 
getUserNameDropDown(): Observable<any> {
  return this.http.get(routes.Itticketing.getAllDataNameDropDown());
}
/*status satart */
ticketingallstatus(): Observable<any>{
  return this.http.get(routes.Itticketing.allstatusitticketing());
}
ticketingopenstatus(): Observable<any>{
  return this.http.get(routes.Itticketing.openstatusitticketing()); 
}
ticketinginprogressstatus(): Observable<any>{
  return this.http.get(routes.Itticketing.inprogressitticketing()); 
}
ticketingclosestatus(): Observable<any>{
  return this.http.get(routes.Itticketing.closeitticketing()); 
}
/*status end */
/*dropdown selection */
itTicketingtodayselect(): Observable<any> {
  return this.http.get(routes.Itticketing.todayitticketing());
}
itTicketingweakselect(): Observable<any>{
  return this.http.get(routes.Itticketing.weakselectitTicketing());
}
itTicketingmonthselect(): Observable<any> {
  return this.http.get(routes.Itticketing.monthselectitTicketing());
}
/*dropdown selection */
/*calendar date */
itTicketingcalendardate_select(data:any): Observable<any> {
  return this.http.post<any>(routes.Itticketing.selectdate_itTicketing(),data);
}
/*calendar date */

// expense module

createExpenseDetails(data:any,file: File):Observable<any>{


  const formData = new FormData();
    if (file) {
      formData.append('attachedBill', file, file.name);
    } else {
      formData.append('attachedBill', 'undefined');
    }
    for (let key in data) {
      
      
      formData.append(`${key}`, data[key]);
    }
  return this.http.post(routes.Itticketing.createExpenseDetails(),formData)
}

getExpenseDetails():Observable<any>{
return this.http.get(routes.Itticketing.getExpenseDetails())
}
getAllAccreditionId(): Observable<any>{
  return this.http.get(routes.Itticketing.getAllAccreId())
}
getAllSignature(): Observable<any>{
  return this.http.get(routes.Itticketing.getAllSign())
}

createExpense(data:any,file:File){
  

  const formData = new FormData();
  if (file) {
    formData.append('attach_bill', file, file.name);
  } else {
    formData.append('attach_bill', 'undefined');
  }
  for (let key in data) {
    
    
    formData.append(`${key}`, data[key]);
  }
  return this.http.post(routes.Itticketing.createExpense(),formData)
}

// createSignature(data:any,file:File){

//   const formData = new FormData();
//   if (file) {
//     formData.append('attach_bill', file, file.name);
//   } else {
//     formData.append('attach_bill', 'undefined');
//   }
//   for (let key in data) {
//     
    
//     formData.append(`${key}`, data[key]);
//   }
//   return this.http.post(routes.Itticketing.createExpense(),formData)
// }
createSignature(data: any, file: File): Observable<any> {
  const formData = new FormData();
  if (file) {
    formData.append('signature_upload', file, file.name);
  } else {
    formData.append('signature_upload', 'undefined');
  }
  for (let key in data) {
    formData.append(`${key}`, data[key]);
  }

  return this.http.post(
    routes.Itticketing.createSignature(),
    formData
  );
}

editSignature(id:any,data: any, file: File): Observable<any> {
  const formData = new FormData();
  if (file) {
    formData.append('signature_upload', file, file.name);
  } else {
    formData.append('signature_upload', 'undefined');
  }
  for (let key in data) {
    formData.append(`${key}`, data[key]);
  }

  return this.http.put(
    routes.Itticketing.updateSignature(id),
    formData
  );
}
signaturegetById(id:any): Observable<any>{
  return this.http.get(routes.Itticketing.getByIDSignature(id))
}


getExpenselist(id:any):Observable<any>{
  return this.http.get(routes.Itticketing.getExpenseList(id))
}

getByExpense(id:any):Observable<any>{
  return this.http.get(routes.Itticketing.getByIdExpense(id))
}

getByExpenseDetails(id:any):Observable<any>{
  return this.http.get(routes.Itticketing.getByExpenseDetails(id))
}
//vikash start//
Allverifierstatusget():Observable<any>{
  return this.http.get(routes.Itticketing.getAllverifierstatus())
}
verifierstatusupdate(id:any,data:any):Observable<any>{
  return this.http.put(routes.Itticketing.updateverifierstatus(id),data)
}
expenseverifierstatusupdate(id:any,data:any):Observable<any>{
return this.http.put(routes.Itticketing.updatexpenseverifierstatus(id),data)
}
//vikash end//
getTaskOrder():Observable<any>{
  return this.http.get(routes.Itticketing.getTaskOrder())
}

editByExpense(id:any, data: any):Observable<any>{
  return this.http.put(routes.Itticketing.editByIdExpense(id), data)
}

updateExpense(id:any,data:any){
  return this.http.put(routes.Itticketing.updateExpenseDetails(id),data)
}

getPending():Observable<any>{
return this.http.get(routes.Itticketing.getPending())
}
getApproved():Observable<any>{
  return this.http.get(routes.Itticketing.getApprove())
  }

  getPaid():Observable<any>{
    return this.http.get(routes.Itticketing.getPaid())
    }

    getTravelConfirmTicket():Observable<any>{
      return this.http.get(routes.Itticketing.gettravelConfirmTicket())
    }

    updateReturnTicket(id:any,data:any){
      return this.http.put(routes.Itticketing.updateReturnTicket(id),data)
    }

    // createExpenseDetailsCopy(data:any){
    //   return this.http.post(routes.Itticketing.createExpenseDetailsCopy(),data)
    // }
    createExpenseDetailsCopy(data:any,file: File):Observable<any>{


      const formData = new FormData();
        if (file) {
          formData.append('attach_bill', file, file.name);
        } else {
          formData.append('attach_bill', 'undefined');
        }
        for (let key in data) {
          
          
          formData.append(`${key}`, data[key]);
        }
      return this.http.post(routes.Itticketing.createExpenseDetailsCopy(),formData)
    }
    getExpenseDetailsCopy(id:any){
      return this.http.get(routes.Itticketing.getExpenseDetailsCopy(id))
    }

    travelerMultipleCreate(data:any){
      return this.http.post(routes.Itticketing.travelerMultipleCreate(),data)
    }

    travelMultipleGetBy(id:any){
      return this.http.get(routes.Itticketing.getByTravlerMultiCreate(id))
    }

    updateCancelReuest(id:any,data:any):Observable<any>{
      return this.http.put(routes.Itticketing.updateCancelReuest(id),data)
    }

    getCancelReuest():Observable<any>{
      return this.http.get(routes.Itticketing.getCancelReuest())
    }

    getCancelRequestData(id:any):Observable<any>{
      return this.http.get(routes.Itticketing.getCancelRequestData(id))
    }

    zipGetFile(id:any):Observable<any>{
      return this.http.get(routes.Itticketing.zipGetFile(id))
    }
    getExpenseProcessing():Observable<any>{
      return this.http.get(routes.Itticketing.getExpenseProcessing())
    }
    getExpensePosted():Observable<any>{
      return this.http.get(routes.Itticketing.getExpensePosted())
    }
    getExpenseMangeApprovel(){
      return this.http.get(routes.Itticketing.getExpenseMangeApprovel())

    }

    updateUploadOnbording(id:any,data:any):Observable<any>{
       return this.http.put(routes.Itticketing.updateUploadOnbording(id),data)
    }

    getOpenStatusData(){
      return this.http.get(routes.Itticketing.getOpenStatusData())
    }
    getBybookTravelTicket(id:any):Observable<any>{
      return this.http.get(routes.Itticketing.getByTravelBookTicket(id))
    }

    getAllUserList(id:any):Observable<any>{
      return this.http.get(routes.Itticketing.getAllUserList(id))
    }
    getAllAgentList(id:any):Observable<any>{
      return this.http.get(routes.Itticketing.getAllAgentList(id))
    }
    getAllMangerList(id:any):Observable<any>{
       return this.http.get(routes.Itticketing.getAllMangerList(id))
     }

     getAllExpenseCurrency(){
      return this.http.get(routes.Itticketing.getAllExpenseCurrency())
     }
     getAllCancelTicket(id:any,id2:any):Observable<any>{
      return this.http.get(routes.Itticketing.getAllCancelTicket(id,id2))
    }

    getGstFileDownload(id:any,id2:any):Observable<any>{
       return this.http.get(routes.Itticketing.getGstFileDownload(id,id2))
    }

    getByCurrency(id:any):Observable<any>{
      return this.http.get(routes.Itticketing.getByCurrency(id))
    }

    getmyExpenseBookTicket(id:any):Observable<any>{
      return this.http.get(routes.Itticketing.getmyExpenseBookTicket(id))
    }

    getByExpenseDetailsIdCopy(id:any){
      return this.http.get(routes.Itticketing.getByExpenseDetailsIdCopy(id))
    }

    getApprovedRejectTravel(){
      return this.http.get(routes.Itticketing.getApprovedRejectTravel())
    }

    getPreAuditExpense():Observable<any>{
      return this.http.get(routes.Itticketing.getPreAuditExpense())
    }

    messageSubject = new Subject<any>();
    sayMessages(message:any){
      
      
    this.messageSubject.next(message);
  }

  createExpenseTicketCopy(data:any):Observable<any>{
    return this.http.post(routes.Itticketing.createTravelTicketCopy(),data)
  }

  getTravelTicketCopy(id:any):Observable<any>{
    return this.http.get(routes.Itticketing.getTravelTicktCopy(id))
  }

  getTravelTicketInactive(id:any){
    return this.http.get(routes.Itticketing.getTravelTicketInactive(id))
  }

  updateTicketexpense(id:any,data:any){
    return this.http.put(routes.Itticketing.updateTicketexpense(id),data)
  }

  getOnBordingFile(id:any):Observable<any>{
    return this.http.get(routes.Itticketing.getOnBordingFile(id))
  }

  getStateMyExpense(){
    return this.http.get(routes.Itticketing.getStateMyExpense())
  }
  getCityMyExpense(){
  return this.http.get(routes.Itticketing.getCityMyExpense())
   }

   getExpenseTicketActive(id:any,id2:any){
    return this.http.get(routes.Itticketing.getExpenseTicketActive(id,id2))
   }

   getUpdateStaus():Observable<any>{
    return this.http.get(routes.Itticketing.getUpdateStaus())
   }

   getByDownloadPdf(file:any):Observable<any>{
    return this.http.get(routes.Itticketing.getByDownloadPdf(file))
   }

   getByTravelTicketCopy(empId:any,expenseId:any,ticketId:any){
    return this.http.get(routes.Itticketing.getByTravelTicketCopy(empId,expenseId,ticketId))
   }

   getByTravelRequestChildDetails(expenseId:any,childId:any){
    return this.http.get(routes.Itticketing.getByTravelRequestChildDetails(expenseId,childId))
   }

   filterExpenseData(id:any,data:any){
    return this.http.post(routes.Itticketing.filterExpenseData(id),data)
   }

   filterPostExpenseDetail(id:any,data:any):Observable<any>{
return this.http.post(routes.Itticketing.filterPostExpenseDetail(id),data)
   }

   getAllCancel(id:any){
    return this.http.get(routes.Itticketing.getAllCancel(id))
}

getAllNewCancelTicket(id:any,id2:any){
  return this.http.get(routes.Itticketing.getAllNewCancelTicket(id,id2))

}
}
