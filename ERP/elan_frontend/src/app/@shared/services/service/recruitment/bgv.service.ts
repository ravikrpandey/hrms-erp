
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class BgvService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    getAll_candidate_profile(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_candidate_profile?user_id=${query?.user_id}&entity_id=${query?.entity_id}&user_role=${query?.user_role}&financial_year_id=${query?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getAll_BGV_selectedcandidate(jd_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_BGV_selectedcandidate/${jd_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    create_company_details(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_company_details`, body).pipe(
            map((response: any) => { return response })
        );
    }

    get_candidate_companyDetails(cand_bgv_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_candidate_companyDetails/${cand_bgv_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_all_selfratings() {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_selfratings`).pipe(
            map((response: any) => { return response })
        );
    }

    create_company_quality_ratings(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/WL/create_company_quality_ratings`, body).pipe(
            map((response: any) => { return response })
        );
    }

    submit_employer_details(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/WL/submit_employer_details`, body).pipe(
            map((response: any) => { return response })
        );
    }

    get_candidate_company_detailsBYID(cand_bgv_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_candidate_company_detailsBYID/${cand_bgv_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    update_bgv_statusDetails(body: any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/update_bgv_statusDetails`, body).pipe(
            map((response: any) => { return response })
        );
    }

}
