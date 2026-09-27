import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';



const databaseKey: any = environment.serverUrl;
const apiViHrm: any = 'api/v1/hrm';



const routes = {
  leaveManagement: {
    addLeaveMaster: () => `${databaseKey}/${apiViHrm}/addLeave`,
    generateLeaveCode: () => `${databaseKey}/${apiViHrm}/generateLeaveCode`,

    getLeaveMasterList: (financial_id: any,entity_id:any,employee_id:any) => `${databaseKey}/${apiViHrm}/getAllLeaves/${financial_id}/${entity_id}/${employee_id}`,
    getLeaveMasterById: (leaveId: any) => `${databaseKey}/${apiViHrm}/getLeaveById/${leaveId}`,
    updateLeaveMasterById: (id: any) => `${databaseKey}/${apiViHrm}/updateLeaveById/${id}`,

    updateLeaveMasterStatusById: (id: any) => `${databaseKey}/${apiViHrm}/updateLeaveStatusById/${id}`,

    deleteLeaveMasterById: (leaveId: any) => `${databaseKey}/${apiViHrm}/deleteLeaveById/${leaveId}`,
  },


  leavePolicyList: {
    getLeavePolicyList: (withPolicy: any,financial_id:any,entity_id:any,employee_id:any) => 
      `${databaseKey}/${apiViHrm}/getAllLeavesPolicyList/${withPolicy}/${financial_id}/${entity_id}/${employee_id}`,
    deleteLeavePolicyById: (leaveId: any) => `${databaseKey}/${apiViHrm}/deleteLeavePolicyById/${leaveId}`,
  },


  leavePolicyDetail: {
    addLeavePolicyDetail: () => `${databaseKey}/${apiViHrm}/addLeavePolicy`,
    getLeavePolicyDetailById: (policy_id: any,financial_id: any,entity_id: any,employee_id: any) => 
      `${databaseKey}/${apiViHrm}/getLeavePolicyById/${policy_id}/${financial_id}/${entity_id}/${employee_id}`,
  },


  leavePolicyEntitlement: {
    addLeavePolicyEntitlement: () => `${databaseKey}/${apiViHrm}/addLeaveEntitlement`,
    getLeaveEntitlementById: (leaveId: any,financial_id: any,entity_id: any,employee_id: any) => 
      `${databaseKey}/${apiViHrm}/getLeaveEntitlementById/${leaveId}/${financial_id}/${entity_id}/${employee_id}`,
  },


  leavePolicyApplicability: {
    addLeavePolicyApplicability: () => `${databaseKey}/${apiViHrm}/addLeaveApplicability`,
    getLeaveApplicabilityById: (leaveId: any,financial_id: any,entity_id: any,employee_id: any) => 
      `${databaseKey}/${apiViHrm}/getLeaveApplicabilityById/${leaveId}/${financial_id}/${entity_id}/${employee_id}`,
    getLeaveApplicabilityForAll: (leaveId: any,financial_id: any,entity_id: any,employee_id: any) => 
      `${databaseKey}/${apiViHrm}/getLeaveApplicabilityForAll/${leaveId}/${financial_id}/${entity_id}/${employee_id}`,

    getAppDepartment: (entity_id:any) => `${databaseKey}/${apiViHrm}/getAllApplicabilityDepartment?entity_id=${entity_id}`,
    getAppDesignation: () => `${databaseKey}/${apiViHrm}/getAllApplicabilityDesignation`,
    getAppLocation: () => `${databaseKey}/${apiViHrm}/getAllApplicabilityLocation`,


  },


  leavePolicyRestrictions: {
    addLeavePolicyRestrictions: () => `${databaseKey}/${apiViHrm}/addLeaveRestrictions`,
    getLeaveRestrictionsById: (leaveId: any,financial_id: any,entity_id: any,employee_id: any) => 
      `${databaseKey}/${apiViHrm}/getLeaveRestrictionsById/${leaveId}/${financial_id}/${entity_id}/${employee_id}`,
  }




}



@Injectable({
  providedIn: 'root'
})


export class LeaveManagementService {


  private messageSource = new BehaviorSubject<string>('Policy Detail');
  currentMessage = this.messageSource.asObservable();


  constructor(private httpclient: HttpClient) {  }


  changeMessage(message: string) {
    this.messageSource.next(message);
  }


  //  LEAVE MASTER API CALLS  =================================================================================================================

  AddLeaveMaster(formData: any): Observable<any> {
    return this.httpclient.post(routes.leaveManagement.addLeaveMaster(), formData)
  }
  generateLeaveCode(formData: any): Observable<any> {
    return this.httpclient.post(routes.leaveManagement.generateLeaveCode(), formData)
  }
  GetLeaveMasterList(financial_id:any,entity_id:any,employee_id:any): Observable<any> {
    return this.httpclient.get(routes.leaveManagement.getLeaveMasterList(financial_id,entity_id,employee_id))
  }

  GetLeaveMasterById(leaveId: any): Observable<any> {
    return this.httpclient.get(routes.leaveManagement.getLeaveMasterById(leaveId))
  }

  UpdateLeaveMasterById(leaveId: any, leaveData: any): Observable<any> {
    return this.httpclient.put(routes.leaveManagement.updateLeaveMasterById(leaveId), leaveData)
  }

  UpdateLeaveMasterStatusById(leaveId: any, status: any): Observable<any> {
    return this.httpclient.put(routes.leaveManagement.updateLeaveMasterStatusById(leaveId), status)
  }

  DeleteLeaveMasterById(leaveId: any, status: any): Observable<any> {
    return this.httpclient.put(routes.leaveManagement.deleteLeaveMasterById(leaveId), status)
  }




  //  LEAVE POLICY API CALLS  ==========================================================================================================


  // GET POLICY LIST     [0 = Dont have policy  or  1 = Have policy]
  GetLeavePolicyList(withPolicy: any,financial_id:any,entity_id:any,employee_id:any): Observable<any> {
    return this.httpclient.get(routes.leavePolicyList.getLeavePolicyList(withPolicy,financial_id,entity_id,employee_id))
  }

  // DELETE POLICY LIST     = 
  DeleteLeavePolicyById(leaveId: any): Observable<any> {

    let body = { "isDeleted": 1 }
    return this.httpclient.put(routes.leavePolicyList.deleteLeavePolicyById(leaveId), body)
  }



  // POLICY DETAIL     = 
  AddLeavePolicyDetail(data: any): Observable<any> {
    return this.httpclient.post(routes.leavePolicyDetail.addLeavePolicyDetail(), data)
  }

  GetLeavePolicyDetail(policy_id: any,financial_id: any,entity_id: any,employee_id: any): Observable<any> {
    return this.httpclient.get(routes.leavePolicyDetail.getLeavePolicyDetailById(policy_id,financial_id,entity_id,employee_id))
  }



  // POLICY APPLICABILITY    ---------------------------------------------------------------------------------------------------

  AddLeavePolicyApplicability(data: any): Observable<any> {
    return this.httpclient.post(routes.leavePolicyApplicability.addLeavePolicyApplicability(), data)
  }

  GetLeavePolicyApplicability(data: any,financial_id: any,entity_id: any,employee_id: any): Observable<any> {
    return this.httpclient.get(routes.leavePolicyApplicability.getLeaveApplicabilityById(data,financial_id,entity_id,employee_id))
  }

  GetLeaveApplicabilityForAll(data: any,financial_id: any,entity_id: any,employee_id: any): Observable<any> {
    return this.httpclient.get(routes.leavePolicyApplicability.getLeaveApplicabilityForAll(data,financial_id,entity_id,employee_id))
  }

  GetLeaveAppLocation(): Observable<any> {
    return this.httpclient.get(routes.leavePolicyApplicability.getAppLocation(),)
  }
  GetLeaveAppDeparment(entity_id:any): Observable<any> {
    return this.httpclient.get(routes.leavePolicyApplicability.getAppDepartment(entity_id))
  }
  GetLeaveAppDesgination(): Observable<any> {
    return this.httpclient.get(routes.leavePolicyApplicability.getAppDesignation())
  }

  // -----------------------------------------------------------------------------------------------------------------------



  // POLICY ENTITLEMENT   ---------------------------------------------------------------------------------------------------  
  AddLeavePolicyEntitlement(data: any): Observable<any> {
    return this.httpclient.post(routes.leavePolicyEntitlement.addLeavePolicyEntitlement(), data)
  }


  GetLeaveEntitlementById(leave_id: any,financial_id: any,entity_id: any,employee_id: any): Observable<any> {
    console.log(leave_id);

    return this.httpclient.get(routes.leavePolicyEntitlement.getLeaveEntitlementById(leave_id,financial_id,entity_id,employee_id))
  }
  // -----------------------------------------------------------------------------------------------------------------------



  // POLICY RESTRICTIONS    --------------------------------------------------------------------------------------------------
  AddLeavePolicyRestrictions(data: any): Observable<any> {
    return this.httpclient.post(routes.leavePolicyRestrictions.addLeavePolicyRestrictions(), data)
  }


  GetLeaveRestrictionsById(data: any,financial_id: any,entity_id: any,employee_id: any): Observable<any> {
    return this.httpclient.get(routes.leavePolicyRestrictions.getLeaveRestrictionsById(data,financial_id,entity_id,employee_id), data)
  }
  //  -------------------------------------------------------------------------------------------------------------------------





}


