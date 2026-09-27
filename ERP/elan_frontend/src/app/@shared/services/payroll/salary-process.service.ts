
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
        return this.http.get<any>(`${this.databaseKey}/api/v1/salary_ProcessList?entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}&branchId=${req?.branchId}`).pipe(
            map((response: any) => { return response })
        );
    }

    employeeList_BY_processID(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/employeeList_BY_processID/${req.id}`).pipe(
            map((response: any) => { return response })
        );
    }
    createPayrollAppro(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/payroll_bulk_approval_request`,body)
    }
     
    pendingForAprverList(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/approval_salary_process_list?entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}&branchId=${req?.branchId}`).pipe(
            map((response: any) => { return response })
        );
    }

    getSaleryPendingLIst(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/approval_employeeList_BY_processID/${req.id}`).pipe(
            map((response: any) => { return response })
        );
    }

    
    payrolApprover(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/payroll_approval_status`,body)
    }
    
   
    saleryProcessApproved(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/approved_salary_processList?entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getAllEssPayRoll(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_login_employee_list?entity_id=${req?.entity_id}&current_year=${req?.current_year}&branchId=${req?.branchId}&pay_slip_month=${req?.pay_slip_month}&login_id=${req?.login_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getBySaleryApproveLIst(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/approved_loginEmp_list_BYprocessID/${req.id}?login_id=${req?.login_id}&entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    processAprverList(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/approved_loginSalary_processList?login_id=${req?.login_id}&entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getSaleryApprovedLIst(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/approved_emp_list_BYprocessID/${req.id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getSaleryRejectLIst(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/rejected_loginSalary_processList?login_id=${req.login_id}&entity_id=${req?.entity_id}&financial_year_id=${req?.financial_year_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getSaleryRejectListEmploye(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/rejected_employeeList_BY_processID/${req.id}?login_id=${req?.login_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    allSalerySlipZip(req: any) {
        // Convert employee_ids array into a comma-separated string
        const employeeIds = req?.employee_id.join(','); // Join array of IDs into a string
        
        // Send the HTTP GET request with the correct response type to handle binary data (blob)
        return this.http.get(`${this.databaseKey}/api/v1/download_allsalary_slips_zip?employee_id=${employeeIds}&pay_slip_month=${req?.pay_slip_month}&financial_year_id=${req?.financial_year_id}`, {
            responseType: 'blob'  // This makes sure we get the file as a blob
        });
    }
    
    }

