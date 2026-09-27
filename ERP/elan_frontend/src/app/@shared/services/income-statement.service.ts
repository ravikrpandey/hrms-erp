
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class IncomeStatementService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    getIncomeStatement(entity_id:any,budgetFinancialYear_id:any,filter_fy:any,income_type:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/generate_income_statement?entity_id=${entity_id}&budgetFinancialYear_id=${budgetFinancialYear_id}&filter_fy=${filter_fy}&income_type=${income_type}`).pipe(
            map((response: any) => { return response })
        );
    }

    getIncomeStatement2(id:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getById_income_statement/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getIncomeApproval(id:any){
        return this.http.get<any>(`${this.databaseKey}/api/v1/getall_income_Approval_level/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getTotalRevenue(entity_id:any,budgetFinancialYear_id:any,filter_fy:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getall_total_revenue?entity_id=${entity_id}&budgetFinancialYear_id=${budgetFinancialYear_id}&filter_fy=${filter_fy}`).pipe(
            map((response: any) => { return response })
        );
    }

    getTotalOperatingExpense(entity_id:any,budgetFinancialYear_id:any,filter_fy:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getall_operating_expense?entity_id=${entity_id}&budgetFinancialYear_id=${budgetFinancialYear_id}&filter_fy=${filter_fy}`).pipe(
            map((response: any) => { return response })
        );
    }

    getVariableCost(entity_id:any,fid:any,filter_fy:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getall_variable_cost?entity_id=${entity_id}&budgetFinancialYear_id=${fid}&filter_fy=${filter_fy}`).pipe(
            map((response: any) => { return response })
        );
    }

    submitIncomeStatement(body:any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_income_statement`,body).pipe(
            map((response: any) => { return response })
        );
    }

    getIncomeList(entity_id:any,login_id:any,user_role:any,filter_fy:any,approval_status:any) {
        if ( !approval_status ) { 
            return this.http.get<any>(`${this.databaseKey}/api/v1/getall_income_statement?entity_id=${entity_id}&login_id=${login_id}&filter_fy=${filter_fy}&user_role=${user_role}&approval_status=${approval_status}`).pipe(
                map((response: any) => { return response })
            );
        } else {
            return this.http.get<any>(`${this.databaseKey}/api/v1/getall_income_statement?entity_id=${entity_id}&login_id=${login_id}&filter_fy=${filter_fy}&approval_status=${approval_status}`).pipe(
                map((response: any) => { return response })
            );
        }
    }
}
