
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
        this.databaseKey = environment.servralUrl;
    }

    employee_AttendanceDetails(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/employee_AttendanceDetails?entity_id=${req?.entity_id}&att_month=${req?.att_month}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    employee_salary_Details_BYID(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/employee_salary_Details_BYID?employee_id=${req?.employee_id}&entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}&att_month=${req?.att_month}`).pipe(
            map((response: any) => { return response })
        );
    }

    total_MonthlyAttendance() {
        return this.http.get<any>(`${this.databaseKey}/api/v1/total_MonthlyAttendance`).pipe(
            map((response: any) => { return response })
        );
    }

}
