import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BreakdownManagementService {

  databaseKey;
   constructor(private http: HttpClient) {
     this.databaseKey = environment.servralUrl;
   }

   getActive_IssueType(entity_id:any,financial_year_id:any) {
     return this.http.get<any>(`${this.databaseKey}/api/v1/getActive_IssueType?entity_id=${entity_id}&financial_year_id=${financial_year_id}`).pipe(
       map((response: any) => {
         return response;
       })
     );
   }
   getAll_BreakdownIndent(entity_id:any,financial_year_id:any) {
     return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_BreakdownIndent?entity_id=${entity_id}&financial_year_id=${financial_year_id}`).pipe(
       map((response: any) => {
         return response;
       })
     );
   }
   getBreakIndent_byId(id:any) {
     return this.http.get<any>(`${this.databaseKey}/api/v1/getBreakIndent_byId?id=${id}`).pipe(
       map((response: any) => {
         return response;
       })
     );
   }
   getAll_AssignedIndent(emp_id:any) {
     return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_AssignedIndent?emp_id=${emp_id}`).pipe(
       map((response: any) => {
         return response;
       })
     );
   }
   getAll_Status() {
     return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Status`).pipe(
       map((response: any) => {
         return response;
       })
     );
   }
   getAll_OpenIndent(entity_id:any,financial_year_id:any) {
     return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_OpenIndent?entity_id=${entity_id}&financial_year_id=${financial_year_id}`).pipe(
       map((response: any) => {
         return response;
       })
     );
   }
   getAll_AllocatedIndent(entity_id:any,financial_year_id:any) {
     return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_AllocatedIndent?entity_id=${entity_id}&financial_year_id=${financial_year_id}`).pipe(
       map((response: any) => {
         return response;
       })
     );
   }
   createBreakdownIndent(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createBreakdownIndent`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  assigned_breakdownIndent(body: any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/assigned_breakdownIndent`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
