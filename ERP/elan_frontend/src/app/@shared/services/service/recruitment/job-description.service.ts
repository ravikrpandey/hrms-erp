
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class JobDescriptionService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    get_all_approved_jobrequest(entity_id: any,financial_year_id:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_approved_jobrequest?entity_id=${entity_id}&financial_year_id=${financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }
    getID_job_request(id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getID_job_request/${id}`).pipe(
            map((response: any) => { return response })
        );
    }
    getAll_Job_Type() {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Job_Type`).pipe(
            map((response: any) => { return response })
        );
    }
    getAll_Job_Profile_Type() {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Job_Profile_Type`).pipe(
            map((response: any) => { return response })
        );
    }

}
