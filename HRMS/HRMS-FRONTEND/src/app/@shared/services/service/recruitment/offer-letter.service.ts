import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class OfferLetterService {
  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  getAll_offerletters(query: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/getAll_offerletters?entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year_id}&user_id=${query?.user_id}&offer_status=${query?.offer_status}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getoffer_detailsBYID(offer_id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getoffer_detailsBYID/${offer_id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  approve_offer_letter(body: any) {
    return this.http
      .put<any>(`${this.databaseKey}/api/v1/approve_offer_letter`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  generate_pdf(query: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/generate_pdf?candidate_id=${query?.candidate_id}&entity_id=${query?.entity_id}&jd_id=${query?.jd_id}&offer_letter_id=${query?.offer_letter_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  download_offer_letter(candidate_id: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/download_offer_letter/${candidate_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  sendCandidate_offer_letter_link(body: any) {
    return this.http
      .post<any>(
        `${this.databaseKey}/api/v1/sendCandidate_offer_letter_link`,
        body
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getCandidateoffer_detailsBYID(candidate_id: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/getCandidateoffer_detailsBYID/${candidate_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getcandiate_detailsBYID(candidate_id: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/getcandiate_detailsBYID/${candidate_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  updateCandidate_OfferStatus(body: any) {
    return this.http
      .put<any>(`${this.databaseKey}/api/v1/updateCandidate_OfferStatus`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
