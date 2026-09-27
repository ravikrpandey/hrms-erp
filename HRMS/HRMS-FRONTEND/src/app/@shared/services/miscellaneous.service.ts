
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class MiscellaneousService {
    documents(formData: FormData) {
      throw new Error('Method not implemented.');
    }

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }

    exportToExcel(formData: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/exportToExcel`, formData).pipe(
            map((response: any) => { return response })
        );
    }

}
