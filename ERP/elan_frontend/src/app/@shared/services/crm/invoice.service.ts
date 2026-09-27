import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }

  getSOListFORInvoice(loginUser: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getSOListFORInvoice/${loginUser}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
