
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
        this.databaseKey = environment.serverUrl;
    }

    get_all_approved_jobrequest(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_approved_jobrequest?entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_all_jobrequest() {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_jobrequest`).pipe(
            map((response: any) => { return response })
        );
    }

    getID_job_request(id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getID_job_request/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

}
