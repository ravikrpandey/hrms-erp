import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardpageService {

  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }

  getallNotification() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAllNotification`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getCardCelender() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getCardCelender`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getcardData() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getcard_details`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
