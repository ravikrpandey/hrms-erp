
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ContractLocationService {

  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  createContractLocation(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createContractLocation`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getContractLocation() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getContractLocation`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteContractLocation(query: any) {
    return this.http.delete<any>(`${this.databaseKey}/api/v1/deleteContractLocation/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}
