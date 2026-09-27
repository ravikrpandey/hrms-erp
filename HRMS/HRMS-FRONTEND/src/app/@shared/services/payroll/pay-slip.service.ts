
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class PaySlipService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }

    generate_SalarySlip(req: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/generate_SalarySlip`, req).pipe(
            map((response: any) => { return response })
        );
    }

   
    registrationall(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Employee_List?entity_id=${req?.entity_id}&pay_slip_month=${req?.pay_slip_month}&current_year=${req?.current_year}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }
    registrationall_hold(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Employee_List_hold?entity_id=${req?.entity_id}&pay_slip_month=${req?.pay_slip_month}&current_year=${req?.current_year}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    download_SalarySlip(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/download_SalarySlip?employee_id=${req?.employee_id}&pay_slip_month=${req?.pay_slip_month}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    get_employeesdetails(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_employeesdetails?employee_id=${req?.employee_id}&entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}&att_month=${req?.att_month}`).pipe(
            map((response: any) => { return response })
        );
    }
    getAllCompanyWith(company_id:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAllCompany_with_entity?company_id=${company_id}`)
          
    }
}
