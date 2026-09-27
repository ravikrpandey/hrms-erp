import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

const routes = {
  kpa: {
    getHrmKpa: (data: any) =>
      `${databaseKey}/api/v1/get_all_kpa/${data.entity_id}?financial_id=${data.financial_id}`,
    getByKpaRequest: (id: any) => `${databaseKey}/api/v1/get_kpa_by_id/${id}`,
    createHrmKpa: () => `${databaseKey}/api/v1/create_kpa`,
    updateHrmKpa: (id: any) => `${databaseKey}/api/v1/update_kpa/${id}`,
    status: (id: any) => `${databaseKey}/api/v1/kpa_status/${id}`,
  },
  dropdownList: {
    getAllObjective_dropDown: () => `${databaseKey}/api/v1/get_all_kpaObj`,
    getemployeeById: (empid: any) =>
      `${databaseKey}/api/v1/get_kpa_emp_byId/${empid}`,
    countAttendanceByEmpId: (empid: any, entity_id: any) =>
      `${databaseKey}/api/v1/countAttendanceByEmpId/${empid}/${entity_id}`,
    getAllYears: (empid: any, entity_id: any) =>
      `${databaseKey}/api/v1/getAllYears/${empid}/${entity_id}`,
    getAllUpcomingHolidays: (entity_id: any, financial_id: string) =>
      `${databaseKey}/api/v1/getAllUpcomingHolidays?entity_id=${entity_id}&financial_id=${financial_id}`,
    SuperadmingetAllUserProfile: () =>
      `${databaseKey}/api/v1/SuperadmingetAllUserProfile`,
    getWorkingHoursByEmpId: (empid: any) =>
      `${databaseKey}/api/v1/getWorkingHoursByEmpId/${empid}`,
    getAttendanceByEmpId: (empid: any, entity_id: any) =>
      `${databaseKey}/api/v1/getAttendanceByEmpId/${empid}/${entity_id}`,
    getAttendanceDataByEmpIdAndDate: (empid: any, date: any, entity_id: any) =>
      `${databaseKey}/api/v1/getAttendanceDataByEmpIdAndDate/${empid}/${date}/${entity_id}`,
    getRemainingLeavesByEmpId: (
      empid: any,
      entity_id: any,
      financial_id: any
    ) => {
      return `${databaseKey}/api/v1/hrm/getRemainingLeavesByEmpId/${financial_id}/${empid}/${entity_id}`;
    },
    getGenderDemographics: () => `${databaseKey}/api/v1/getGenderDemographics`,
    getEmployeesDepartmentWise: (id: any) =>
      `${databaseKey}/api/v1/getEmployeesDepartmentWise/${id}`,
  },
  reports: {
    getDailyReportByDate: (entity_id: any) =>
      `${databaseKey}/api/v1/getDailyReportByDate/${entity_id}`,
    getDailyAttendanceReportByFilter: (entity_id: any) =>
      `${databaseKey}/api/v1/getDailyAttendanceReportByFilter/${entity_id}`,
    getFinancialYear: () => `${databaseKey}/api/v1/getAllfinancial`,
    getMonthlyReportByMonthYear: (entity_id: any) =>
      `${databaseKey}/api/v1/getMonthlyReportByMonthYear/${entity_id}`,
    getAttendanceTimeReportByDate: (entity_id: any) =>
      `${databaseKey}/api/v1/getAttendanceTimeReportByDate/${entity_id}`,
    getAbsentPresentLeaveReport: (entity_id: any) =>
      `${databaseKey}/api/v1/getAbsentPresentLeaveReport/${entity_id}`,
    getAllDepartments: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllDepartments/${entity_id}`,
    getAllShifts: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllShifts/${entity_id}`,
    getAllDesignations: () => `${databaseKey}/api/v1/getAllDesignation_active`,
    getAllLeaves: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllLeaves/${entity_id}`,
    getLeaveReport: (entity_id: any) =>
      `${databaseKey}/api/v1/getLeaveReport/${entity_id}`,
    getYearEndLeaveReport: (entity_id: any) =>
      `${databaseKey}/api/v1/getYearEndLeaveReport/${entity_id}`,
  },
};
@Injectable({
  providedIn: 'root',
})
export class HrmServiceService {
  data: any = [{}];
  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }

  // Get hrm kpa list
  getHrmKpa(data: any) {
    return this.http.get(routes.kpa.getHrmKpa(data));
  }
  // create hrm kpa
  createHrmKpa(data: any) {
    return this.http.post(routes.kpa.createHrmKpa(), data);
  }
  // update hrm kpa
  updateHrmKpa(id: any, data: any) {
    return this.http.put(routes.kpa.updateHrmKpa(id), data);
  }

  // update kpa Status
  updatekpaStatus(id: any, body: any) {
    return this.http.put(routes.kpa.status(id), body);
  }
  // get all objective list
  getAllObjective_dropDown() {
    return this.http.get(routes.dropdownList.getAllObjective_dropDown());
  }

  getemployeeById(id: any) {
    return this.http.get(routes.dropdownList.getemployeeById(id));
  }

  getByKpaRequest(id: any) {
    return this.http.get(routes.kpa.getByKpaRequest(id));
  }
  countAttendanceByEmpId(id: any, id2: any, data: any) {
    return this.http.post(
      routes.dropdownList.countAttendanceByEmpId(id, id2),
      data
    );
  }
  getAllYears(id: any, id2: any) {
    return this.http.get(routes.dropdownList.getAllYears(id, id2));
  }
  getAllUpcomingHolidays(entity_id: any, financial_id: string) {
    return this.http.get(
      routes.dropdownList.getAllUpcomingHolidays(entity_id, financial_id)
    );
  }

  getHolidayFromDate(
    entity_id: any,
    financial_id: any,
    fromDate: any,
    user_id: any
  ) {
    return this.http.get(
      `${databaseKey}/api/v1/getHolidayFromDate?entity_id=${entity_id}&financial_id=${financial_id}&fromDate=${fromDate}&user_id=${user_id}`
    );
  }

  SuperadmingetAllUserProfile() {
    return this.http.get(routes.dropdownList.SuperadmingetAllUserProfile());
  }
  getWorkingHoursByEmpId(id: any) {
    return this.http.get(routes.dropdownList.getWorkingHoursByEmpId(id));
  }
  getAttendanceByEmpId(id: any, id2: any) {
    return this.http.get(routes.dropdownList.getAttendanceByEmpId(id, id2));
  }
  getAttendanceDataByEmpIdAndDate(id: any, date: any, entity_id: any) {
    return this.http.get(
      routes.dropdownList.getAttendanceDataByEmpIdAndDate(id, date, entity_id)
    );
  }
  getRemainingLeavesByEmpId(empid: any, entity_id: any, financial_id: any) {
    const url = routes.dropdownList.getRemainingLeavesByEmpId(
      empid,
      entity_id,
      financial_id
    );
    return this.http.get(url);
  }

  accessAssignAction() {
    let a: any = localStorage?.getItem('local');
    if (a) {
      let b: any = window?.atob(a);
      return JSON?.parse(b);
    }
  }
  getGenderDemographics() {
    return this.http.get(routes.dropdownList.getGenderDemographics());
  }
  getEmployeesDepartmentWise(id: any) {
    return this.http.get(routes.dropdownList.getEmployeesDepartmentWise(id));
  }
  getDailyReportByDate(id: any, data: any) {
    let params = new HttpParams();
    for (const key in data) {
      if (data[key]) {
        params = params.set(key, data[key]);
      }
    }
    return this.http.get(routes.reports.getDailyReportByDate(id), { params });
  }
  getDailyAttendanceReportByFilter(id: any, data: any) {
    let params = new HttpParams();
    for (const key in data) {
      if (data[key]) {
        params = params.set(key, data[key]);
      }
    }
    return this.http.get(routes.reports.getDailyAttendanceReportByFilter(id), {
      params,
    });
  }
  getFinancialYear() {
    return this.http.get(routes.reports.getFinancialYear());
  }
  getMonthlyReportByMonthYear(entity_id: any, data: any) {
    let params = new HttpParams();
    for (const key in data) {
      if (data[key]) {
        params = params.set(key, data[key]);
      }
    }
    return this.http.get(
      routes.reports.getMonthlyReportByMonthYear(entity_id),
      { params }
    );
  }
  getAttendanceTimeReportByDate(id: any, data: any) {
    let params = new HttpParams();
    for (const key in data) {
      if (data[key]) {
        params = params.set(key, data[key]);
      }
    }
    return this.http.get(routes.reports.getAttendanceTimeReportByDate(id), {
      params,
    });
  }
  getAbsentPresentLeaveReport(id: any, data: any) {
    let params = new HttpParams();
    for (const key in data) {
      if (data[key]) {
        params = params.set(key, data[key]);
      }
    }
    return this.http.get(routes.reports.getAbsentPresentLeaveReport(id), {
      params,
    });
  }
  getAllDepartments(entity_id: any) {
    return this.http.get(routes.reports.getAllDepartments(entity_id));
  }
  getAllShifts(entity_id: any) {
    return this.http.get(routes.reports.getAllShifts(entity_id));
  }
  getAllDesignations() {
    return this.http.get(routes.reports.getAllDesignations());
  }
  getAllLeaves(entity_id: any) {
    return this.http.get(routes.reports.getAllLeaves(entity_id));
  }
  getLeaveReport(id: any, data: any) {
    let params = new HttpParams();
    for (const key in data) {
      if (data[key]) {
        params = params.set(key, data[key]);
      }
    }
    return this.http.get(routes.reports.getLeaveReport(id), { params });
  }
  getYearEndLeaveReport(id: any, data: any) {
    let params = new HttpParams();
    for (const key in data) {
      if (data[key]) {
        params = params.set(key, data[key]);
      }
    }
    return this.http.get(routes.reports.getYearEndLeaveReport(id), { params });
  }
}
