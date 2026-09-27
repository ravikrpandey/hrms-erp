import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {
  myRequest: {
    createMyRequest: () => `${databaseKey}/api/v1/createJob_request`,
    getAllMyRequest: (query: any) =>
      `${databaseKey}/api/v1/getALL_job_request?entity_id=${query?.entity_id}&user_id=${query?.user_id}&user_role=${query?.user_role}`,
    getAllRejectRequest: () => `${databaseKey}/api/v1/get_Rejected_Approvals`,
    updateMyRequest: (id: any) => `${databaseKey}/api/v1/approve_levels/${id}`,
    getApprovelLevelRequest: (id: any) =>
      `${databaseKey}/api/v1/getAll_Approval_level/${id}`,
    pendingApprovel: () => `${databaseKey}/api/v1/get_levels_to_be_approved`,
    ApprovedRequest: () => `${databaseKey}/api/v1/get_Approved_Approvals`,
    getByJobRequest: (id: any) =>
      `${databaseKey}/api/v1/getID_job_request/${id}`,
    getAllCostCenter: () => `${databaseKey}/api/v1/getAll_Cost_Center`,
    getAllAreas: (id: any) => `${databaseKey}/api/v1/get_all_dep/${id}`,
    getAllCost: (id: any) => `${databaseKey}/api/v1/get_all_cost/${id}`,
  },
  overtime: {
    create_OvertimeRequest: () =>
      `${databaseKey}/api/v1/create_OvertimeRequest`,
    update_OvertimeRequest: () =>
      `${databaseKey}/api/v1/update_overtimerequestById`,
    approveORReject_Request: () =>
      `${databaseKey}/api/v1/approveORReject_Request`,
    get_employeeAttendence: () =>
      `${databaseKey}/api/v1/get_employeeAttendence`,
    get_ot_requests_by_status: () => `${databaseKey}/api/v1/get-ot-requests-by-status`,
    get_all_ot_req: () => `${databaseKey}/api/v1/get-all-ot-req`,
    get_requestById: (id: any, employee_id: any) =>
      `${databaseKey}/api/v1/get_requestById?id=${id}&employee_id=${employee_id}`,
  },
};
@Injectable({
  providedIn: 'root',
})
export class EmployeSelfService {
  constructor(private httpclient: HttpClient) {}
  createMyRequest(data: any) {
    return this.httpclient.post(routes.myRequest.createMyRequest(), data);
  }

  getAllMyRequest(query: any) {
    return this.httpclient.get(routes.myRequest.getAllMyRequest(query));
  }

  updateMyRequest(id: any, data: any) {
    return this.httpclient.post(routes.myRequest.updateMyRequest(id), data);
  }

  getApprovelLevelRequest(id: any, data: any) {
    return this.httpclient.post(
      routes.myRequest.getApprovelLevelRequest(id),
      data
    );
  }

  pendingApprovel(data: any) {
    return this.httpclient.post(routes.myRequest.pendingApprovel(), data);
  }
  ApprovedRequest(data: any) {
    return this.httpclient.post(routes.myRequest.ApprovedRequest(), data);
  }

  getByJobRequest(id: any) {
    return this.httpclient.get(routes.myRequest.getByJobRequest(id));
  }
  getAllRejectRequest(data: any) {
    return this.httpclient.post(routes.myRequest.getAllRejectRequest(), data);
  }

  getAllCostCenter() {
    return this.httpclient.get(routes.myRequest.getAllCostCenter());
  }

  getAllAreas(id: any) {
    return this.httpclient.get(routes.myRequest.getAllAreas(id));
  }

  getAllCost(id: any) {
    return this.httpclient.get(routes.myRequest.getAllCost(id));
  }
  get_employeeAttendence(data: any) {
    return this.httpclient.post(routes.overtime.get_employeeAttendence(), data);
  }
  create_OvertimeRequest(data: any) {
    return this.httpclient.post(routes.overtime.create_OvertimeRequest(), data);
  }
  update_OvertimeRequest(data: any) {
    return this.httpclient.put(routes.overtime.update_OvertimeRequest(), data);
  }
  approveORReject_Request(data: any) {
    return this.httpclient.post(
      routes.overtime.approveORReject_Request(),
      data
    );
  }
  get_ot_requests_by_status(data: any) {
    return this.httpclient.post(routes.overtime.get_ot_requests_by_status(), data);
  }
  get_all_ot_req(data: any) {
    return this.httpclient.post(routes.overtime.get_all_ot_req(), data);
  }
  get_requestById(id: any, employee_id: any) {
    return this.httpclient.get(
      routes.overtime.get_requestById(id, employee_id)
    );
  }
}
