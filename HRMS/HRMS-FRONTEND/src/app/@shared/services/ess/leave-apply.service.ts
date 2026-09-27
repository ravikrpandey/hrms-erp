
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';



const databaseKey: any = environment.serverUrl;
const apiViEss: any = 'api/v1/ess';



const routes = {
  essApplyLeaves: {
    applyLeave: () => `${databaseKey}/${apiViEss}/applyLeave`,
    getLeaveByDepartment: (financial_id: any, department_id: any, employee_id: any, entity_id: any, marital: any, location: any, gender: any, designation: any, role_id: any) =>
      `${databaseKey}/${apiViEss}/getAllLeavesByDepartment?financial_id=${financial_id}&employeeId=${employee_id}&department_id=${department_id}&entity_id=${entity_id}&marital_id=${marital}&location_id=${location}&gender_id=${gender}&designation_id=${designation}&role_id=${role_id}`,

    getAllAppliedLeavesById: (leaveId: any) => `${databaseKey}/${apiViEss}/getAllAppliedLeaves/${leaveId}`,
    get_allemployeeBY_managerID: (manager_id: any) => `${databaseKey}/${apiViEss}/get_allemployeeBY_managerID/${manager_id}`,
    getEntityUsers: (financial_id: any, employee_id: any, entity_id: any) =>
      `${databaseKey}/${apiViEss}/getEntityUsers?financial_id=${financial_id}&employeeId=${employee_id}&entity_id=${entity_id}`,
    update_leave_approval_status: () => `${databaseKey}/${apiViEss}/update_leave_approval_status`,


    getAppliedLeaveById: (leaveId: any, employeeId: any, financial_id: any, entity_id: any, roleId: any) =>
      `${databaseKey}/${apiViEss}/getAllAppliedLeaveById?appliedLeaveId=${leaveId}&employee_id=${employeeId}&financial_id=${financial_id}&entity_id=${entity_id}&role_id=${roleId}`,
    getAllAppliedLeavesForEmployee: (financial_id: any, entity_id: any, employeeId: any, allLeaves: boolean) =>
      `${databaseKey}/${apiViEss}/getAllAppliedLeavesForEmployee?employee_id=${employeeId}&financial_id=${financial_id}&entity_id=${entity_id}&allLeaves=${allLeaves}`,




    updateAppliedLeaveById: (leaveId: any) => `${databaseKey}/${apiViEss}/updateAppliedLeaveById/${leaveId}`,
    deleteAppliedLeaveById: (appliedLeaveId: any) => `${databaseKey}/${apiViEss}/deleteAppliedLeaveById/${appliedLeaveId}`,



    documentsUpdate: () => `${databaseKey}/documents`,
    uploadDocumentsUpdate: () => `${databaseKey}/upload_document`,
    getValidLeaves: (employeeId: any, entity_id: any, leaveId: any) =>
    `${databaseKey}/${apiViEss}/getEffectiveAppliedLeave?employeeId=${employeeId}&entity_id=${entity_id}&leaveId=${leaveId}`

  },

  leaveQuota:{
    getAllLeaveQuota:(employee_id:any)=>`${databaseKey}/api/v1/ess/get_all_leave_quota_by_id/${employee_id}`,
    getAllLeave:(entity_id:any)=>`${databaseKey}/api/v1/ess/get_leave_list_by_entity_id/${entity_id}`,
    updateLeaveQuota:(employee_id:any)=>`${databaseKey}/api/v1/ess/update_leave_quota_by_id?employee_id=${employee_id}`
  }

}



@Injectable({
  providedIn: 'root'
})




export class LeaveApplyService {

  constructor(private httpclient: HttpClient,) {

  }





  // POLICY APPLICABILITY    ---------------------------------------------------------------------------------------------------


  // Apply for the leave according to your department
  applyLeave(data: any): Observable<any> {
    return this.httpclient.post(routes.essApplyLeaves.applyLeave(), data)
  }

  // Get all the leaves according to the department ==> WORKING ON
  getEntityUsers(financial_id: any, employee_id: any, entity_id: any): Observable<any> {
    return this.httpclient.get(routes.essApplyLeaves.getEntityUsers(financial_id, employee_id, entity_id))
  }

  update_leave_approval_status(body: any): Observable<any> {
    return this.httpclient.put(routes.essApplyLeaves.update_leave_approval_status(), body)
  }



  // Get all the leaves according to the department
  getLeaveByDepartment(financial_id: any, department_id: any, employee_id: any, entity_id: any,
    marital: any, location: any, gender: any, designation: any, role_id: any): Observable<any> {
    return this.httpclient.get(routes.essApplyLeaves.getLeaveByDepartment(financial_id, department_id, employee_id, entity_id,
      marital, location, gender, designation, role_id))
  }
  get_allemployeeBY_managerID(manager_id: any): Observable<any> {
    return this.httpclient.get(routes.essApplyLeaves.get_allemployeeBY_managerID(manager_id))
  }


  //  Get all the applied leaves for logged in employee
  getAllAppliedLeavesById(financial_id: any, entity_id: any, employeeId: any, allLeaves: boolean): Observable<any> {
    return this.httpclient.get(routes.essApplyLeaves.getAllAppliedLeavesForEmployee(financial_id, entity_id, employeeId, allLeaves))
  }

  //  Get specific applied leave of employee (for viewing and editing)
  getAppliedLeaveById(leaveId: any, financial_id: any, entity_id: any, employeeId: any, roleId: any): Observable<any> {
    return this.httpclient.get(routes.essApplyLeaves.getAppliedLeaveById(leaveId, employeeId, financial_id, entity_id, roleId))
  }







  //  Delete specific applied leave of employee 
  deleteAppliedLeave(appliedLeaveId: any): Observable<any> {
    const body = {};
    return this.httpclient.put(routes.essApplyLeaves.deleteAppliedLeaveById(appliedLeaveId), body)
  }


  //  Update specific applied leave of employee 
  updateAppliedLeave(leaveId: any, body: any): Observable<any> {
    return this.httpclient.put(routes.essApplyLeaves.updateAppliedLeaveById(leaveId), body)
  }





  // Documents uploading APIS calls

  documentsUpdate(data: any) {
    return this.httpclient.post(routes.essApplyLeaves.documentsUpdate(), data)
  }
  uploadDocumentsUpdate(data: any) {
    return this.httpclient.post(routes.essApplyLeaves.uploadDocumentsUpdate(), data)
  }


    //  Get all the applied leaves for logged in employee
  getValidLeave(employeeId:any, entity_id: any, leaveId:any): Observable<any> {
    return this.httpclient.get(routes.essApplyLeaves.getValidLeaves(employeeId, entity_id, leaveId ))
  }
  
  getAllLeaveQuota(employee_id:any){
    return this.httpclient.get(routes.leaveQuota.getAllLeaveQuota(employee_id))
  }
  getAllLeave(entity_id:any){
    return this.httpclient.get(routes.leaveQuota.getAllLeave(entity_id))
  }
 updateLeaveQuota(employee_id: any, payload: any) {
  return this.httpclient.put(routes.leaveQuota.updateLeaveQuota(employee_id),payload);
}


  // -----------------------------------------------------------------------------------------------------------------------












}



