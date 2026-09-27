
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class MiscellaneousService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }
   

    documents(body: any) {
        return this.http.post<any>(`${this.databaseKey}/documents`, body).pipe(
            map((response: any) => { return response })
        );
    }

    parseResume(body: FormData) {
        return this.http.post<any>(
            `${environment.pythonServerUrl}/parse/upload`,
            body
        );
    }

    getAllActivefinancial_year() {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAllActivefinancial_year`).pipe(
            map((response: any) => { return response })
        );
    }

}
