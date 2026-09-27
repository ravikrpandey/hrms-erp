
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class WorkSetupService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    createSetupWorkCalendder(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/createSetupWorkCalendder`,body).pipe(
            map((response: any) => { return response })
        );
    }

     getAllSetupWorkCalendder(finacialId:any,entity_id:any,userId:any,month_name:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAllSetupWorkCalendder/${finacialId}/${entity_id}/${userId}/${month_name}`).pipe(
            map((response: any) => { return response })
        );
    } 
    getAllSetupWorkCalendderById(id:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAllSetupWorkCalendderById/${id}`,).pipe(
            map((response: any) => { return response })
        );
    }
    filterDataBy_Month_FinancialYear(id:any,month_name:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/filterDataBy_Month_FinancialYear/${id}/${month_name}`,).pipe(
            map((response: any) => { return response })
        );
    }
    deleteSetupWorkCalendder(id:any) {
        return this.http.delete<any>(`${this.databaseKey}/api/v1/deleteSetupWorkCalendder/${id}`).pipe(
            map((response: any) => { return response })
        );
    }
    updateSetupWorkCalender(body:any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/updateSetupWorkCalender`,body).pipe(
            map((response: any) => { return response })
        );
    } 

}
