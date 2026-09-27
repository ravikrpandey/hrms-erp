
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class SalaryDetailService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }

    employee_AttendanceDetails(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/employee_AttendanceDetails?entity_id=${req?.entity_id}&att_month=${req?.att_month}&financial_year_id=${req?.financial_year_id}&att_year=${req?.att_year}`).pipe(
            map((response: any) => { return response })
        );
    }

    employee_salary_Details_BYID(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/employee_salary_Details_BYID?employee_id=${req?.employee_id}&entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}&att_month=${req?.att_month}`).pipe(
            map((response: any) => { return response })
        );
    }

    total_MonthlyAttendance(fromDate?:any,toDate?:any,entity_id?:any,financial_year_id?:any,salary_att_month?:any,att_month?:any,att_year?:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/total_MonthlyAttendance?start_date=${fromDate}&end_date=${toDate}&entity_id=${entity_id}&financial_year_id=${financial_year_id}&salary_process_month=${salary_att_month}&att_month=${att_month}&att_year=${att_year}`).pipe(
            map((response: any) => { return response })
        );
    }

}
