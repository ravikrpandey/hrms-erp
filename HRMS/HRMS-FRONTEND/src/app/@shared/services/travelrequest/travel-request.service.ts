import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { TravelPlan } from '../../interface/travel-plan.interface';

const databaseKey: any = environment.serverUrl;
@Injectable({
  providedIn: 'root'
})
export class TravelRequestService {

  private statusSource = new BehaviorSubject<string>('0');
  currentStatus = this.statusSource.asObservable();

  constructor(private http: HttpClient) { }

  changeStatus(status: string) {
    this.statusSource.next(status);
  }

  get_travel_details_by_id(id: any, entity_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/get_travel_details_by_id/${id}/${entity_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAllcountry() {
    return this.http.get<any>(`${databaseKey}/api/v1/getAllcountry`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getEmployeeLeave(employeeId: string, financialYearId: string) {
    return this.http.get<any>(`${databaseKey}/api/v1/hrm/getEmployeeLeave/${employeeId}/${financialYearId}`);
  }
  getAllEmployeeCancelLeaveData(employeeId: string, financialYearId: string) {
    return this.http.get<any>(`${databaseKey}/api/v1/hrm/getAllCancelLeave/${employeeId}/${financialYearId}`);
  }
  getEmployeeLeavesData(employeeId: string, financialYearId: string) {
    return this.http.get<any>(`${databaseKey}/api/v1/hrm/getLeaveDetailsByEmployee/${employeeId}/${financialYearId}`);
  }
  getstatesbycountryid(id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/getstatesbycountryid/${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getcitybystateid(id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/getcitybystateid/${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAllstates() {
    return this.http.get<any>(`${databaseKey}/api/v1/getallstatescontroller`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getActive_Allowance(entity_id: any, fy_id: any) {
    return this.http
      .get<any>(
        `${databaseKey}/api/v1/getActive_Allowance?entity_id=${entity_id}&fy_id=${fy_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getAll_Currency() {
    return this.http.get<any>(`${databaseKey}/api/v1/getAll_Currency`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAll_Active_BANK(entity_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/getAll_Active_BANK/${entity_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  documents(body: any) {
    return this.http.post<any>(`${databaseKey}/documents`, body).pipe(
      map((response: any) => { return response })
    );
  }

  multiple_documents(body: any) {
    return this.http.post<any>(`${databaseKey}/array_documents`, body).pipe(
      map((response: any) => { return response })
    );
  }

  create_travel_request(id: any, body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/create_travel_request/${id}`, body).pipe(
      map((response: any) => { return response })
    );
  }
  update_travel_request(id: any,employee_id:any, body: any) {
    return this.http.put<any>(`${databaseKey}/api/v1/update_travel_request/${id}/${employee_id}`, body).pipe(
      map((response: any) => { return response })
    );
  }

  get_travel_request_by_id(id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/get_travel_request_by_id/${id}`).pipe(
      map((response: any) => { return response })
    );
  }

  get_all_travel_request(data: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/get_all_travel_request`, data).pipe(
      map((response: any) => { return response })
    );
  }

  get_travel_levels_to_be_approved(empid: any, entity_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/get_travel_levels_to_be_approved/${empid}/${entity_id}`).pipe(
      map((response: any) => { return response })
    );
  }
  get_approved_travel_request(financial_year_id: any, entity_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/get_approved_travel_request/${financial_year_id}/${entity_id}`).pipe(
      map((response: any) => { return response })
    );
  }
  get_all_advance_travel_booking(data: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/get_all_advance_travel_booking`, data).pipe(
      map((response: any) => { return response })
    );
  }
  get_travel_approvals_list(empid: any, entity_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/get_travel_approvals_list/${empid}/${entity_id}`).pipe(
      map((response: any) => { return response })
    );
  }
  get_travel_rejected_approvals(empid: any, entity_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/get_travel_rejected_approvals/${empid}/${entity_id}`).pipe(
      map((response: any) => { return response })
    );
  }

  travel_approve_level(id: any, body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/travel_approve_level/${id}`, body).pipe(
      map((response: any) => { return response })
    );
  }

  create_advance_booking(body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/create_advance_booking`, body).pipe(
      map((response: any) => { return response })
    );
  }

  get_all_approval_level(id: any, body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/get_all_approval_level/${id}`, body).pipe(
      map((response: any) => { return response })
    );
  }

  delete_travel_request_by_id(id: any) {
    return this.http.delete<any>(`${databaseKey}/api/v1/delete_travel_request_by_id/${id}`).pipe(
      map((response: any) => { return response })
    );
  }

  //expense module

  getAll_active_expenseType() {
    return this.http.get<any>(`${databaseKey}/api/v1/getAll_active_expenseType`).pipe(
      map((response: any) => { return response })
    );
  }

  get_all_travel(entity_id: any, fy_id: any, emp_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/get_all_travel?entity_id=${entity_id}&fy_id=${fy_id}&employee_id=${emp_id}`).pipe(
      map((response: any) => { return response })
    );
  }

  get_travel_details(travel_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/get_travel_details/${travel_id}`).pipe(
      map((response: any) => { return response })
    );
  }
   get_expense_request_by_id(type: any, travel_exp_id: any) {
    return this.http
      .get<any>(
        `${databaseKey}/api/v1/get_expense_request_by_id/${travel_exp_id}?expense_type=${type}`
      )
      .pipe(map((response: any) => response));
  }

  create_expense_request(body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/create_expense_request`, body).pipe(
      map((response: any) => { return response })
    );
  }

  get_all_exp_request(body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/get_all_exp_request`, body).pipe(
      map((response: any) => { return response })
    );
  }

  delete_expense_request(id: any) {
    return this.http.delete<any>(`${databaseKey}/api/v1/delete_expense_request/${id}`).pipe(
      map((response: any) => { return response })
    );
  }

  get_exp_levels_to_be_approved(empid: any, entity_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/get_exp_levels_to_be_approved/${empid}/${entity_id}`).pipe(
      map((response: any) => { return response })
    );
  }

  get_expense_rejected_list(
    empid: any,
    entity_id: any,
    expense_request_type: string
  ) {
    return this.http.get<any>(
      `${databaseKey}/api/v1/get_expense_rejected_list/${empid}/${entity_id}?expense_request_type=${expense_request_type}`
    );
  }

   getTravelRequestOfEmp(entity_Id: string, financial_year_id: string,employee_id:any) {
    return this.http.get(
      `${databaseKey}/api/v1/getTravelRequestOfEmp?entity_Id=${entity_Id}&financial_year_id=${financial_year_id}&employee_id=${employee_id}`
    );
  }

 get_expense_approved_list(
    empid: any,
    entity_id: any,
    expense_request_type: string
  ) {
    return this.http.get<any>(
      `${databaseKey}/api/v1/get_expense_approved_list/${empid}/${entity_id}?expense_request_type=${expense_request_type}`
    );
  }

  update_expense_request(body: any) {
    return this.http.put<any>(`${databaseKey}/api/v1/update_expense_request`, body).pipe(
      map((response: any) => { return response })
    );
  }
  expense_approve_level(id: any, body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/expense_approved_level/${id}`, body).pipe(
      map((response: any) => { return response })
    );
  }

  get_all_approver_level(id: any, body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/get_all_approver_level/${id}`, body).pipe(
      map((response: any) => { return response })
    );
  }
  //travel-management-uploadfiles
  get_all_advanced_approved_data(body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/get_all_advanced_approved_data`, body).pipe(
      map((response: any) => { return response })
    );
  }
  cancel_leave_request(body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/hrm/cancelEmployeeLeave`, body).pipe(
      map((response: any) => { return response })
    );
  }

  getBudgetDataOfGrade(cityId: any, gradeId: any) {
  return this.http.get<any>(
    `${databaseKey}/api/v1/getBudgetDataOfGrade/${cityId}?grade_id=${gradeId}`
  );
}


get_all_otherExpense(
    empid: any,
    entity_id: any,
    expense_request_type: string
  ) {
    return this.http.get<any>(
      `${databaseKey}/api/v1/get_all_otherExpense/${empid}/${entity_id}?expense_request_type=${expense_request_type}`
    );
  }
get_by_otherExpense(
    id: any,
    expense_request_type: string = 'Other_Expense'
  ): Observable<any> {
    return this.http.get<any>(
      `${databaseKey}/api/v1/get_by_otherExpense/${id}?expense_request_type=${expense_request_type}`
    );
  }
  getReimbursementDataOfGrade(employee_id: any) {
    return this.http.get<any>(
      `${databaseKey}/api/v1/getReimbursementDataOfGrade?employee_id=${employee_id}`
    );
  }
getLocalConveyanceDataOfGrade(employee_id: any) {
    return this.http.get<any>(
      `${databaseKey}/api/v1/getLocalConveyanceDataOfGrade?employee_id=${employee_id}`
    );
  }

  getTravelJourneyByDate(
    entity_Id: string,
    financial_year_id: string,
    type: 'ess' | 'expense' | 'date',
    dataId: string,
    employee_id:any
  ) {
    return this.http.get(
      `${databaseKey}/api/v1/getTravelJourneyByDate?entity_Id=${entity_Id}&financial_year_id=${financial_year_id}&type=${type}&dataId=${dataId}&employee_id=${employee_id}`
    );
  }
  createTravelPlan(data: TravelPlan) {
    return this.http.post(`${databaseKey}/api/v1/travel/plan/`, data);
  }

  updateTravelPlan(data: TravelPlan) {
    return this.http.put(`${databaseKey}/api/v1/travel/plan/`, data);
  }

  deleteTravelPlan(id: number) {
    return this.http.delete(`${databaseKey}/api/v1/travel/plan/${id}`);
  }

  getMonthTravelPlan(employee_id: number) {
    return this.http.get(`${databaseKey}/api/v1/travel/plan/?employee_id=${employee_id}`);
  }

    approveTravelPlan(
    planId: number,
    status: string,
  ) {
    return this.http.get(
      `${databaseKey}/api/v1/travel/plan/approve?planId=${planId}&status=${status}`
    );
  }


}
