
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class OnboardingService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }

    get_OnboardedEmployeeList(entity_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_OnboardedEmployeeList/${entity_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    sendmail_to_fill_candidate_details(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/sendmail_to_fill_candidate_details`, body).pipe(
            map((response: any) => { return response })
        );
    }

    getCandidate_detailsByID(candidate_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getCandidate_detailsByID/${candidate_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    register_onboarded_employee(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/register_onboarded_employee`, body).pipe(
            map((response: any) => { return response })
        );
    }

    update_onboarded_employee_status(body: any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/update_onboarded_employee_status`, body).pipe(
            map((response: any) => { return response })
        );
    }

}
