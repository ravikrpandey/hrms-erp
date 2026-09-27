
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class SalaryProcessService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    salary_ProcessList(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/salary_ProcessList?entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    employeeList_BY_processID(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/employeeList_BY_processID/${req.id}`).pipe(
            map((response: any) => { return response })
        );
    }

}
