
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AttendanceUserIDService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }

    Create_device_user(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_attand_userID`, body).pipe(
            map((response: any) => { return response })
        );
    }

    get_AlluserID() {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_userID_list`).pipe(
            map((response: any) => { return response })
        );
    }

    get_userID_details(id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/get_userIDdetailBYID/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

    delete_userId_detail(id: any) {
        return this.http.delete<any>(`${this.databaseKey}/api/v1/delete_userIDdetailBYID/${id}`).pipe(
            map((response: any) => { return response })
        );
    }


    getSerialNumber(){
          return this.http.get<any>(`${this.databaseKey}/api/v1/getSerialNumber`).pipe(
            map((response: any) => { return response })
        );
    }

}
