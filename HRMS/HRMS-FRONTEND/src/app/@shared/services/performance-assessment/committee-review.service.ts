import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommitteeReviewService {
  databaseKey:any='';
  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  getAllCommitteeReviewList(login_id:any,filter_fy:any,entity_id:any,status:any):Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getall_committee_review_list?login_id=${login_id}&filter_fy=${filter_fy}&entity_id=${entity_id}&status=${status}`).pipe(
      map((response: any) => { return response })
  );
  }

}
