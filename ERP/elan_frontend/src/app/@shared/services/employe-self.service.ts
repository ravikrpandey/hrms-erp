
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.servralUrl;

const routes = {
  myRequest: {
    createMyRequest: () => `${databaseKey}/api/v1/createJob_request`,
    getAllMyRequest: (query: any) => `${databaseKey}/api/v1/getALL_job_request?entity_id=${query?.entity_id}&user_id=${query?.user_id}&user_role=${query?.user_role}&financial_year_id=${query?.financial_year_id}`,
    getAllRejectRequest: (query: any) => `${databaseKey}/api/v1/get_Rejected_Approvals?employee_id=${query?.employee_id}&entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}`,
    updateMyRequest: (id: any) => `${databaseKey}/api/v1/approve_levels/${id}`,
    getApprovelLevelRequest: (id: any) => `${databaseKey}/api/v1/getAll_Approval_level/${id}`,
    pendingApprovel: (query: any) => `${databaseKey}/api/v1/get_levels_to_be_approved?loggedEmployeeId=${query?.loggedEmployeeId}&entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}`,
    ApprovedRequest: (query: any) => `${databaseKey}/api/v1/get_Approved_Approvals?employee_id=${query?.employee_id}&entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}`,
    getByJobRequest: (id: any) => `${databaseKey}/api/v1/getID_job_request/${id}`,
    delete_job_request: (id: any) => `${databaseKey}/api/v1/delete_job_request/${id}`,
    getAllCostCenter: () => `${databaseKey}/api/v1/getAll_Cost_Center`,
    getAllAreas: (id: any) => `${databaseKey}/api/v1/get_all_dep/${id}`,
    getAllCost: (id: any) => `${databaseKey}/api/v1/get_all_cost/${id}`
  }
}
@Injectable({
  providedIn: 'root'
})
export class EmployeSelfService {


  constructor(private httpclient: HttpClient) {
  }
  createMyRequest(data: any) {
    return this.httpclient.post(routes.myRequest.createMyRequest(), data)
  }

  getAllMyRequest(query: any) {
    return this.httpclient.get(routes.myRequest.getAllMyRequest(query))
  }

  updateMyRequest(id: any, data: any) {
    return this.httpclient.post(routes.myRequest.updateMyRequest(id), data)
  }

  getApprovelLevelRequest(id: any, data: any) {
    return this.httpclient.post(routes.myRequest.getApprovelLevelRequest(id), data)
  }

  pendingApprovel(query: any) {
    return this.httpclient.get(routes.myRequest.pendingApprovel(query))
  }
  ApprovedRequest(query: any) {
    return this.httpclient.get(routes.myRequest.ApprovedRequest(query))
  }

  getByJobRequest(id: any) {
    return this.httpclient.get(routes.myRequest.getByJobRequest(id))
  }

  delete_job_request(id: any) {
    return this.httpclient.delete(routes.myRequest.delete_job_request(id))
  }
  getAllRejectRequest(query: any) {
    return this.httpclient.get(routes.myRequest.getAllRejectRequest(query))
  }

  getAllCostCenter() {
    return this.httpclient.get(routes.myRequest.getAllCostCenter())
  }

  getAllAreas(id: any) {
    return this.httpclient.get(routes.myRequest.getAllAreas(id))
  }

  getAllCost(id: any) {
    return this.httpclient.get(routes.myRequest.getAllCost(id))
  }
}
