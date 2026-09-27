
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AttendanceService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    get_attendance(entity_id: any, financial_id: any, employee_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_attendance/${entity_id}/${financial_id}/${employee_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    attendanceBYmonth(entity_id: any, financial_id: any, employee_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/attendanceBYmonth/${entity_id}/${financial_id}/${employee_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_attendanceBYmonth(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_attendanceBYmonth?att_month=${req?.att_month}&att_year=${req?.att_year}&entity_id=${req?.entity_id}&employee_id=${req?.employee_id}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_all_employe(id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_employe/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

    create_DAILY_attendance(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_DAILY_attendance`, body).pipe(
            map((response: any) => { return response })
        );
    }

    get_DAILY_attendance(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_DAILY_attendance?att_day=${query?.att_day}&att_month=${query?.att_month}&att_year=${query?.att_year}&entity_id=${query?.entity_id}&employee_id=${query?.employee_id}&att_date=${query?.att_date}`).pipe(
            map((response: any) => { return response })
        );
    }

}
