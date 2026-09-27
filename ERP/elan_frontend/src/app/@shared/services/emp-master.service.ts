import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

// const databaseKey: any = environment.servralUrl;
const databaseKey: any = environment.servralUrl;
// const databaseKey1: any = environment.servralUrl;

const routes = {
  grievance: {
    list: () => `${databaseKey}/api/v1/grievancyList`,
    create: () => `${databaseKey}/api/v1/createGrievance`,
    getById: (employee_grievance_id: any) => `${databaseKey}/api/v1/editGrievance/${employee_grievance_id}`,
    userGetById: (employee_grievance_id: any) => `${databaseKey}/api/v1/grievancyGetById/${employee_grievance_id}`,
    deletegrievave: (employee_grievance_id: any) => `${databaseKey}/api/v1/grievancyDelete/${employee_grievance_id}`,
  },
  complaint: {
    list: () => `${databaseKey}/api/v1/getAllComplaint`,
    create: () => `${databaseKey}/api/v1/createComplaint`,
    getById: (employee_complaint_id: any) => `${databaseKey}/api/v1/editComplaint/${employee_complaint_id}`,
    userGetById: (employee_complaint_id: any) => `${databaseKey}/api/v1/getByIdAllComplaint/${employee_complaint_id}`,
    deletecomplain: (employee_complaint_id: any) => `${databaseKey}/api/v1/deleteComplaint/${employee_complaint_id}`,
  },
  announcement: {
    getAnnounce: () => `${databaseKey}/api/v1/announce_list`,
    create: () => `${databaseKey}/api/v1/create_annouce_mail`,
    send_LIO_to_candidate:(id:any)=>`${databaseKey}/api/v1/send_LIO_to_candidate/${id}`,
    draft: () => `${databaseKey}/api/v1/create_annouce_draft`,
    getByannounce: (email_id: any) => `${databaseKey}/api/v1/announce_details/${email_id}`,
    updateAnnounce: (email_id: any) => `${databaseKey}/api/v1/announce_update/${email_id}`,
    deleteAnnounce: (email_id: any) => `${databaseKey}/api/v1/announce_delete/${email_id}`,
    draftUpdate: (email_id: any) => `${databaseKey}/api/v1/announce_draft_update/${email_id}`,
    getDepartment:(id:any)=>`${databaseKey}/api/v1/bulkAnnounceMail/${id}`,
    getDepartmentByID:(id:any)=>`${databaseKey}/api/v1/getuser_email/${id}`
  },


  helpDesk: {
    loggedInlist: (id : any) => `${databaseKey}/api/v1/getByIdAllHelpDesk/${id}`,
    list: () => `${databaseKey}/api/v1/getAllHelpDesk`,
    create: () => `${databaseKey}/api/v1/createHelpDesk`,
    getById: (employee_helpDesk_id: any) => `${databaseKey}/api/v1/getByIdHelpDesk/${employee_helpDesk_id}`,
    deleteData: (employee_helpDesk_id: any) => `${databaseKey}/api/v1/deleteHelpDesk/${employee_helpDesk_id}`,
    update: (employee_helpDesk_id: any) => `${databaseKey}/api/v1/editHelpDesk/${employee_helpDesk_id}`,
    assigneeList: () => `${databaseKey}/api/v1/getAllHelpDesk`,
    requestAutoNumber:() => `${databaseKey}/api/v1/getUniqueNumber`,
    getUniqueNumber:()=>`${databaseKey}/api/v1/getUniqueNumber`,
    getByUniqueNumber:(id:any)=>`${databaseKey}/api/v1/getUniqueNumber/${id}`

  },

  leaveApply: {
    list: () => `${databaseKey}/api/v1/getAllLeaveTypesMaster`,
    loggedInInlist: (emp_id:any) => `${databaseKey}/api/v1/getByIdLeaveemployee/${emp_id}`,

    getall_leaves_tobe_Approved: (query: any) =>
      `${databaseKey}/api/v1/ess/getall_leaves_tobe_Approved?entity_id=${query?.entity_id}&employee_id=${query?.employee_id}&approval_status=${query?.approval_status}`,

    create: () => `${databaseKey}/api/v1/createLeaveTypesMaster`,
    getByIdLeave: (emp_leave_id: any) => `${databaseKey}/api/v1/getByIdLeaveTypesMaster/${emp_leave_id}`,
    getLeaveTypes: () => `${databaseKey}/api/v1/getAllLeaveTypes`,
    deleteData: (employee_leave_id: any) => `${databaseKey}/app/v1/deleteLeaveTypesMaster/${employee_leave_id}`,
    update: (employee_leave_id: any) => `${databaseKey}/api/v1/editLeaveTypesMaster/${employee_leave_id}`,
    remaningLeave: () => `${databaseKey}/api/v1/createRemaningLeave`,
    getByUserId: (employee_id: any) => `${databaseKey}/api/v1/getByIdLeaveemployee/${employee_id}`,
    getStatusUpdate:(id:any)=>`${databaseKey}/api/v1/updateStatusLeaveTypesMaster/${id}`,
    deleteLeaveApply:(id:any)=>`${databaseKey}/api/v1/deleteTimeSheet/${id}`
  },

  employeeProbation: {
    list: () => `${databaseKey}/api/v1/employeeProbationList`,
    getById: (id: any) => `${databaseKey}/api/v1/getByIdEmployeeProbation/${id}`,
    editProbation: (id: any) => `${databaseKey}/api/v1/editProbation/${id}`
  },

  timeSheet: {
    list: () => `${databaseKey}/api/v1/getAllTimeSheet`,
    create: () => `${databaseKey}/api/v1/createTimeSheet`,
    getById: (timesheet_id: any) => `${databaseKey}/api/v1/getByIdTimeSheet/${timesheet_id}`,
    updateBy: (employee_id: any) => `${databaseKey}/api/v1/editTimeSheet/${employee_id}`,
    userGetById: (employee_grievance_id: any) => `${databaseKey}/api/v1/grievancyGetById/${employee_grievance_id}`,
    deleteById: (employee_grievance_id: any) => `${databaseKey}/api/v1/grievancyDelete/${employee_grievance_id}`,
  },
}
@Injectable({
  providedIn: 'root'
})
export class EmpMasterService {

  constructor(private http: HttpClient) { }

  //Grievance-Api
  getList() {
    return this.http.get(routes.grievance.list())
  }
  grievanceCreate(data: any): Observable<any> {
    return this.http.post(routes.grievance.create(), data)
  }
  grievanceUpdateById(employee_grievance_id: any, formData: any) {
    return this.http.put(routes.grievance.getById(employee_grievance_id), formData)
  }
  grievanceAddById(employee_grievance_id: any) {
    return this.http.get(routes.grievance.userGetById(employee_grievance_id));
  }
  deleteGrievanceById(employee_grievance_id: any) {
    return this.http.delete(routes.grievance.deletegrievave(employee_grievance_id));
  }

   //Complaint-Api
   getListComplaint() {
    return this.http.get(routes.complaint.list())
  }
  complaintCreate(data: any): Observable<any> {
    return this.http.post(routes.complaint.create(), data)
  }
  complaintUpdateById(employee_complaint_id: any, formData: any) {
    return this.http.put(routes.complaint.getById(employee_complaint_id), formData)
  }
  complaintAddById(employee_complaint_id: any) {
    return this.http.get(routes.complaint.userGetById(employee_complaint_id));
  }
  deleteCompalintById(employee_complaint_id: any) {
    return this.http.delete(routes.complaint.deletecomplain(employee_complaint_id));
  }

  //internal announment
  getAnnouncment(): Observable<any> {
    return this.http.get(routes.announcement.getAnnounce())
  }
  createAnnouncement(data: any,file:File): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('attach_file', file, file.name);
    } else {
      formData.append('attach_file', 'undefined');
    }
    for (let key in data) {


      formData.append(`${key}`, data[key]);
    }
    return this.http.post(routes.announcement.create(), formData)
  }
  draftAnnouncement(data: any,file:File): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('attach_file', file, file.name);
    } else {
      formData.append('attach_file', 'undefined');
    }
    for (let key in data) {


      formData.append(`${key}`, data[key]);
    }
    return this.http.post(routes.announcement.draft(), data)
  }

  getByIdAnnouncement(email_id: any): Observable<any> {
    return this.http.get(routes.announcement.getByannounce(email_id))
  }

  updateAnnounce(email_id: any, data: any): Observable<any> {
    return this.http.put(routes.announcement.updateAnnounce(email_id), data)
  }

  deleteAnnounce(email_id: any, data: any): Observable<any> {
    return this.http.put(routes.announcement.deleteAnnounce(email_id), data)
  }

  updateDraft(email_id: any, data: any): Observable<any> {
    return this.http.put(routes.announcement.draftUpdate(email_id), data)
  }

  employeeeId: any
  setDATA(data: any) {

    this.employeeeId = data;
  }

  get() {
    return this.employeeeId;
  }

  send_LIO_to_candidate(id:any, data:any){
    return this.http.patch(routes.announcement.send_LIO_to_candidate(id), data)
  }


  createEmailSender(data: any,file:any): Observable<any> {

    const formData = new FormData();
    if (file) {
      formData.append('attach_file', file, file.name);
    } else {
      formData.append('attach_file', 'undefined');
    }
    for (let key in data) {


      formData.append(`${key}`, data[key]);
    }
    return this.http.post(routes.announcement.create(), formData)
  }


  getByDepartment(id:any,data:any){
    return this.http.post(routes.announcement.getDepartment(id),data)
  }

  //Help-Desk-Api
  getLoggedInListHelpDesk(id:any) {
    return this.http.get(routes.helpDesk.loggedInlist(id))
  }
  getListHelpDesk() {
    return this.http.get(routes.helpDesk.list())
  }
  getAssineeList() {
    return this.http.get(routes.helpDesk.assigneeList())
  }
  helpDeskCreate(data: any): Observable<any> {
    return this.http.post(routes.helpDesk.create(), data)
  }
  helpDeskGetById(employee_helpDesk_id: any) {
    return this.http.get(routes.helpDesk.getById(employee_helpDesk_id));
  }
  // AutoGenerate Request Number
  AutoGenerateRequestNo(){
    return this.http.get(routes.helpDesk.requestAutoNumber());
  }
  deleteHelpDesk(employee_helpDesk_id: any) {
    return this.http.delete(routes.helpDesk.deleteData(employee_helpDesk_id));
  }
  updateHelpDesk(employee_helpDesk_id: any, formData: any) {
    return this.http.put(routes.helpDesk.update(employee_helpDesk_id), formData)
  }


  //Leave-Apply
  applyLeaveList(emp_id:any,body:any) {
    return this.http.post(routes.leaveApply.loggedInInlist(emp_id),body)
  }
  getall_leaves_tobe_Approved(query: any) {
    return this.http.get(routes.leaveApply.getall_leaves_tobe_Approved(query));
  }


  applyLeaveRemainingCreate(data: any): Observable<any> {
    return this.http.post(routes.leaveApply.remaningLeave(), data)
  }
  leaveCreate(data: any): Observable<any> {
    return this.http.post(routes.leaveApply.create(), data)
  }
  applyLeaveGetById(emp_leave_id: any) {
    return this.http.get(routes.leaveApply.getByIdLeave(emp_leave_id));
  }
  getLeaveTypes() {
    return this.http.get(routes.leaveApply.getLeaveTypes());
  }
  getLeaveByUserId(emp_leave_id: any) {
    return this.http.get(routes.leaveApply.getByUserId(emp_leave_id));
  }
  deleteApplyLeave(emp_leave_id: any) {
    return this.http.delete(routes.leaveApply.deleteData(emp_leave_id));
  }
  updateApplyLeave(emp_leave_id: any, formData: any) {
    return this.http.put(routes.leaveApply.update(emp_leave_id), formData)
  }

statusupdate(id:any,data:any):Observable<any>{
    return this.http.put(routes.leaveApply.getStatusUpdate(id),data)
}

deleteLeaveApply(id:any):Observable<any>{
  return this.http.delete(routes.leaveApply.deleteLeaveApply(id))
}

  //Employee Probation
  EmployeeProbationList() {
    return this.http.get(routes.employeeProbation.list())
  }
  probationGetById(id: any) {
    return this.http.get(routes.employeeProbation.getById(id))
  }
  editProbation(id: any,formData: any) {
    return this.http.put(routes.employeeProbation.editProbation(id),formData);
  }

  //TimeSheet
  timeSheetList() {
    return this.http.get(routes.timeSheet.list())
  }
  timeSheetCreate(data: any): Observable<any> {
    return this.http.post(routes.timeSheet.create(), data)
  }
  timeSheetGetById(timesheet_id: any) {
    return this.http.get(routes.timeSheet.getById(timesheet_id));
  }
  timeSheetUpdateById(employee_id: any,formData: any) {
    return this.http.put(routes.timeSheet.updateBy(employee_id),formData);
  }

  getDepartmentById(id:any): Observable<any>{
    return this.http.get(routes.announcement.getDepartmentByID(id))
  }
  getUniqueNumber(): Observable<any>{
    return this.http.get(routes.helpDesk.getUniqueNumber())
  }
  getByUniqueNumber(id:any): Observable<any>{
    return this.http.get(routes.helpDesk.getByUniqueNumber(id))
  }
}
