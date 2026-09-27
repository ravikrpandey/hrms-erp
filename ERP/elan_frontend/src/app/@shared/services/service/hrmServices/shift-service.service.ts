
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class ShiftServiceService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    createShiftList(body: any, entity_id: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/createShift`,body).pipe(
            map((response: any) => { return response })
        );
    }
    
    getAllShift(entity_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAllShift`).pipe(
            map((response: any) => { return response })
        );
    } 
    updateShift(id:any,body:any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/updateShift/${id}`,body).pipe(
            map((response: any) => { return response })
        );
    }
    getAllShiftbyId(id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAllShiftbyId/${id}`).pipe(
            map((response: any) => { return response })
        );
    } 
    updateShiftStatus(id: any,status:any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/updateShiftStatus/${id}/${status}`,{}).pipe(
            map((response: any) => { return response })
        );
    }  
    deleteShift(id: any) {
        return this.http.delete<any>(`${this.databaseKey}/api/v1/deleteShift/${id}`).pipe(
            map((response: any) => { return response })
        );
    }
    
    getShiftAllotedEmployee(entity_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_shift_alloted_employee/${entity_id}`).pipe(
            map((response: any) => { return response })
        );
    } 
    getEmployeeShiftLog(employee_id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_employee_shift_log/${employee_id}`).pipe(
            map((response: any) => { return response })
        );
    }
}
