
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class ScheduledInterviewService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }

    get_scheduled_interview_list(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_scheduled_interview_list?entity_id=${query?.entity_id}&interview_status=${query?.interview_status}&interviewer_id=${query?.interviewer_id}&financial_year_id=${query?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_candidate_interview_details_by_id(query: any) {
       
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_candidate_interview_details_by_id?candidate_id=${query?.candidate_id}&interview_round=${query?.interview_round}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_interview_round_details(query: any) {
     
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_interview_round_details?candidate_id=${query?.candidate_id}&interview_round=${query?.interview_round}&interviewer_id=${query?.interviewer_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    update_candidate_interview_status(body: any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/update_candidate_interview_status`, body).pipe(
            map((response: any) => { return response })
        );
    }

}
