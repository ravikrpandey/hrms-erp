import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.servralUrl;

const routes = {
  dashboard: {
    getCashOnHand: (entity_id:number) => `${databaseKey}/api/v1/getCashOnHand/${entity_id}`,
    getTransaction: (entity_id:number) => `${databaseKey}/api/v1/getTransaction/${entity_id}`,
    getJournalBook: (entity_id:number) => `${databaseKey}/api/v1/getJournalBook/${entity_id}`,
  },
}
@Injectable({
  providedIn: 'root'
})
export class FinanceDashboardServiceService {

  constructor(private httpclient: HttpClient) {

  }

  getCashOnHand(entity_id:number): Observable<any> {
    return this.httpclient.get(routes.dashboard.getCashOnHand(entity_id))
  };
  getTransaction(entity_id:number): Observable<any> {
    return this.httpclient.get(routes.dashboard.getTransaction(entity_id))
  };
  getJournalBook(entity_id:number): Observable<any> {
    return this.httpclient.get(routes.dashboard.getJournalBook(entity_id))
  };
}
