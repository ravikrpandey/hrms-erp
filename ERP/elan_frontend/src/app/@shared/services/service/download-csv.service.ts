
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class DownloadCsvService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    downloadEmployeeData(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/downloadEmployeeData`, body).pipe(
            map((response: any) => { return response })
        );
    }
    checkGrammar(text: string) {
        const payload = {
          text: text,
          language: 'en-US',
        };
        return this.http.post('https://api.languagetool.org/v2/check', payload);
      }
}
