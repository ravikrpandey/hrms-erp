
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class CondidateProfileService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    getAll_candidate_profile(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_candidate_profile?user_id=${query?.user_id}&entity_id=${query?.entity_id}&user_role=${query?.user_role}&financial_year_id=${query?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getAll_candidate_BY_JD_id(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_candidate_BY_JD_id?jd_id=${query?.jd_id}&selection_status=${query?.selection_status}`).pipe(
            map((response: any) => { return response })
        );
    }

    update_candidate_profile(body: any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/update_candidate_profile`, body).pipe(
            map((response: any) => { return response })
        );
    }

    create_new_candidate(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_new_candidate`, body).pipe(
            map((response: any) => { return response })
        );
    }

    create_interview_schedule(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_interview_schedule`, body).pipe(
            map((response: any) => { return response })
        );
    }

    get_candidates_interview_details(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_candidates_interview_details?candidate_id=${query?.candidate_id}&jd_id=${query?.jd_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_interview_round_details_byID(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_interview_round_details_byID?candidate_id=${query?.candidate_id}&jd_id=${query?.jd_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    update_candidate_selection_status(body: any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/update_candidate_selection_status`, body).pipe(
            map((response: any) => { return response })
        );
    }

    get_cand_interviewer_details(query: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_cand_interviewer_details?candidate_id=${query?.candidate_id}&jd_id=${query?.jd_id}&interview_round=${query?.interview_round}`).pipe(
            map((response: any) => { return response })
        );
    }

    getAll_Country_codes() {
        return this.http.get<any>(`${this.databaseKey}/api/WL/getAll_Country_codes`).pipe(
            map((response: any) => { return response })
        );
    }
    solr_search(keyword:any) {
        return this.http.get<any>(`https://eliteerpapi.elitetraveltech.in/api/v1/solr_search?search_word=${keyword}`).pipe(
            map((response: any) => { return response })
        );
    }
    getAll_profile(entity_id:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_profile?entity_id=${entity_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    ////vendor panel
    getAll_candidate_BY_JD_idByVendor(query: any) {
      return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_candidate_BY_JD_idByVendor?jd_id=${query?.jd_id}&selection_status=${query?.selection_status}&vendor_id=${query?.vendor_id}`).pipe(
          map((response: any) => { return response })
      );
  }

}
