import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { BodyDropTarget } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  get_attendance(entity_id: any, financial_id: any, employee_id: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/get_attendance/${entity_id}/${financial_id}/${employee_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  attendanceBYmonth(entity_id: any, financial_id: any, employee_id: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/attendanceBYmonth/${entity_id}/${financial_id}/${employee_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  get_attendanceBYmonth(req: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/get_attendanceBYmonth?att_month=${req?.att_month}&att_year=${req?.att_year}&entity_id=${req?.entity_id}&employee_id=${req?.employee_id}&financial_year_id=${req?.financial_year_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  get_all_employe(id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/get_all_employe/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  create_DAILY_attendance(body: any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/create_DAILY_attendance`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  verified_punch(body: any) {
    let headers: any = {};
    const signIn = localStorage.getItem('signInUser');
    if (signIn) {
      try {
        const user = JSON.parse(signIn);
        if (user?._token) {
          headers['Authorization'] = `Bearer ${user._token}`;
          headers['x-access-token'] = user._token;
        }
      } catch (e) {}
    }
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/attendance/verified_punch`, body, { headers })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  enroll_face(body: any) {
    let headers: any = {};
    const signIn = localStorage.getItem('signInUser');
    if (signIn) {
      try {
        const user = JSON.parse(signIn);
        if (user?._token) {
          headers['Authorization'] = `Bearer ${user._token}`;
          headers['x-access-token'] = user._token;
        }
      } catch (e) {}
    }
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/attendance/enroll_face`, body, { headers })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  check_face_status(employeeId?: any) {
    let headers: any = {};
    const signIn = localStorage.getItem('signInUser');
    let empId = employeeId;
    if (signIn) {
      try {
        const user = JSON.parse(signIn);
        if (user?._token) {
          headers['Authorization'] = `Bearer ${user._token}`;
          headers['x-access-token'] = user._token;
        }
        if (!empId) {
          empId = user.employee_id || user.employeeId || user.user_id || user.id;
        }
      } catch (e) {}
    }
    const url = empId
      ? `${this.databaseKey}/api/v1/attendance/face_status/${empId}`
      : `${this.databaseKey}/api/v1/attendance/face_status`;
    return this.http.get<any>(url, { headers }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  get_DAILY_attendance(query: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/get_DAILY_attendance?att_day=${query?.att_day}&att_month=${query?.att_month}&att_year=${query?.att_year}&entity_id=${query?.entity_id}&employee_id=${query?.employee_id}&att_date=${query?.att_date}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  get_gobal_minutes(query: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/get_emp_GlobalMinutes?designation_id=${query?.designation_id}&department_id=${query?.department_id}&entity_id=${query?.entity_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  get_daily_Attendance_Data(req: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/get_daily_Attendance_Data?att_date=${req?.att_date}&entity_id=${req?.entity_id}&employee_id=${req?.employee_id}&financial_year_id=${req?.financial_year_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  export_to_Excel_data(entity_id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/Export_to_Excel_Data/${entity_id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  export_excel_att_report(month: any, year: any, body: any) {
    return this.http
      .post<any>(
        `${this.databaseKey}/api/v1/export_excel_att_report/${month}/${year}`,
        body
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getLateMinutes(employeeId: number, month: any, year: any) {
    const params = new HttpParams()
      .set('employee_id', employeeId.toString())
      .set('month', month)
      .set('year', year);
    return this.http.get(
      `${this.databaseKey}/api/v1/global_min_decrementAfterlate`,
      { params }
    );
  }

  private selectedEmployeeSubject = new BehaviorSubject<any>(null);
  selectedEmployee$ = this.selectedEmployeeSubject.asObservable();

  updateSelectedEmployee(employee: any) {
    this.selectedEmployeeSubject.next(employee);
  }

  private selecteddateSubject = new BehaviorSubject<any>(null);
  selectedDate$ = this.selecteddateSubject.asObservable();

  updateSelectedDate(date: any) {
    this.selecteddateSubject.next(date);
  }

  //start the downlaod report
  getDepartmentdata(entity_id: any) {
    return this.http.get(
      `${this.databaseKey}/api/v1/getDepartmentForReportPurpose/${entity_id}`
    );
  }

  export_excel_att_AttedanceReport(dept_id: any, body: any) {
    let url = `${this.databaseKey}/api/v1/exportReportInExcel`;
    if (dept_id) {
      url += `?dept_id=${dept_id}`;
    }
    return this.http
      .post<any>(url, body)
      .pipe(map((response: any) => response));
  }

  exportToExcelInLateComingAndEarlyGoing(dept_id: any, body: any) {
    let url = `${this.databaseKey}/api/v1/exportToLateComingEarlyGoing`;
    if (dept_id) {
      url += `?dept_id=${dept_id}`;
    }
    return this.http
      .post<any>(url, body)
      .pipe(map((response: any) => response));
  }

  exportToExcelAbsentReport(dept_id: any, body: any) {
    let url = `${this.databaseKey}/api/v1/exportToExcelAbsentReports`;
    if (dept_id) {
      url += `?dept_id=${dept_id}`;
    }
    return this.http
      .post<any>(url, body)
      .pipe(map((response: any) => response));
  }

  getDepartmentEntitySelected(entityIds: number[]) {
    const params = new HttpParams().set('ids', entityIds.join(','));
    return this.http.get(
      `${this.databaseKey}/api/v1/departmentSelectedOnMultipleEntity`,
      { params }
    );  
  }
  getAllActDeptForReports(entity_id:any) {
    return this.http.get(
      `${this.databaseKey}/api/v1/get-all-act-dept-for-reports/${entity_id}`, 
    );
  }
    getAllPayRegisterData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/pay-register-report`,data 
    );
  }
    equalRemunerationReports(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/equal-Remuneration-Reports`,data 
    );
  }
  getAllRegisterEmployeeData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/register-of-employee-report`,data 
    );
  }
  getAllRegisterWorkmanReport(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/register-of-workman-report`,data 
    );
  }
    getAllWageRegisterData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/wage-register-report`,data 
    );
  }
  
    getAllMusterRollData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/muster-roll-report`,data 
    );
  }

  getAllDeductionRegisterData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/deduction-register-report`,data 
    );
  }

  getAllAdvanseRegisterReport(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/advanse-register-report`,data 
    );
  }
  
  getAllFineRegisterReport(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/fine-register-report`,data 
    );
  }
  
  getAllLeaveRegisterReport(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/leave-register-report`,data 
    );
  }
    getSafData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/saf-reports`,data 
    );
  }
    getPtData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/pt-reports`,data 
    );
  }
    getTDSData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/tds-reports`,data 
    );
  }

    getAllOverTimeData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/over-Time-Reports`,data 
    );
  }

  getAllESICData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/esic-register-Reports`,data 
    );
  }
  getAllEPFCData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/epf-register-Reports`,data 
    );
  }
  getAllECRData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/ecr-report`,data 
    );
  }
  getLabourWelfareFundData(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/labour-welfare-fund-Reports`,data 
    );
  }
  getNpsReports(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/nps-Reports`,data 
    );
  }
  getEdliReports(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/edli-Reports`,data 
    );
  }
  getIncentiveReports(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/incentive-reports`,data 
    );
  }
  getBonusReports(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/bonus-Reports`,data 
    );
  }
  getLeaveEncashmentReports(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/leave-encashment-Reports`,data 
    );
  }
  getAdHocDeductionReports(data:any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/adhocDeduction-Reports`,data 
    );
  }
  


  getEmployeeBasedonDepartment(deptId: number[]) {
    const params = new HttpParams().set('ids', deptId.join(','));
    return this.http.get(
      `${this.databaseKey}/api/v1/getEmployeeDataBasedOndepartment`,
      {
        params,
      }
    );
  }

  getLeaveMasterData(entityIds: number[]) {
    const params = new HttpParams().set('ids', entityIds.join(','));
    return this.http.get(`${this.databaseKey}/api/v1/getLeaveMaster`, {
      params,
    });
  }

  exportsToExcelDataInLeaveMaster(data: any) {
    return this.http.post(`${this.databaseKey}/api/v1/getDataLeaveMasterRecord`, data);
  }
  exportToExcelDesignationReport(data: any) {
    return this.http.post(`${this.databaseKey}/api/v1/exportToExcelDesignationReport`, data);
  }
  exportToExcelBankReport(data: any) {
    return this.http.post(`${this.databaseKey}/api/v1/exportToExcelBankReport`, data);
  }
  exportToExcelManagerReport(data: any) {
    return this.http.post(`${this.databaseKey}/api/v1/exportToExcelManagerReport`, data);
  }

  getBranchData(entityIds: number[]) {
    const params = new HttpParams().set('ids', entityIds.join(','));
    return this.http.get(`${this.databaseKey}/api/v1/getBranchBasedOnentityid`, {
      params,
    });
  }

   getAllBranchData() {
    return this.http.get(`${this.databaseKey}/api/v1/getAllBranch`);
  }

    createAttendance_request(data:any) {
    return this.http.post(`${this.databaseKey}/api/v1/createAttendance_request`, data);
  }

  
   attendance_request_by_id(id:any) {
    return this.http.get(`${this.databaseKey}/api/v1/attendance_request_by_id/${id}`);
  }

     get_attendance_request_by_manager(data:any) {
    return this.http.post(`${this.databaseKey}/api/v1/get_attendance_request_by_manager`, data);
  }
     updateAttendancestatus(data:any) {
    return this.http.post(`${this.databaseKey}/api/v1/updateAttendancestatus`, data);
  }
  
}
