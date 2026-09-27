
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class ShortlistedCandidateService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }

    get_all_shortlisted_candidate(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_shortlisted_candidate?user_id=${query?.user_id}&entity_id=${query?.entity_id}&user_role=${query?.user_role}&financial_year_id=${query?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_shortlisted_candidateBYID(query: any) {
        
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_shortlisted_candidateBYID/${query?.candidate_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    create_candidate_offer_letter(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_candidate_offer_letter`, body).pipe(
            map((response: any) => { return response })
        );
    }

    getActive_Allowance() {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getActive_Allowance`).pipe(
            map((response: any) => { return response })
        );
    }
    
    getActive_Allowance_migration(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getActive_Allowance?entity_id=${req?.entity_id}&fy_id=${req?.fy_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getActive_Allowancenw(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getActive_Allowance?entity_id=${req?.entity_id}&fy_id=${req?.fy_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_Active_ContractTypes(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_Active_ContractTypes?entity_id=${query?.entity_id}&role_master_name=${query?.role_master_name}`).pipe(
            map((response: any) => { return response })
        );
    }

    registrationall(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/auth/registrationall?entity_id=${query?.entity_id}&role_master_name=${query?.role_master_name}`).pipe(
            map((response: any) => { return response })
        );
    }

}
