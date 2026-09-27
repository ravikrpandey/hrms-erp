import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentManagement {
      databaseKey;
      constructor(private http: HttpClient) {
          this.databaseKey = environment.serverUrl;
      }
  
      createOrUpdateDocumentManagement(body: any) {
          return this.http.post<any>(`${this.databaseKey}/api/v1/document-Management-create`, body).pipe(
              map((response: any) => { return response })
          );
      }

      listDocumentManagement(params: any = {}) {
          return this.http.get<any>(`${this.databaseKey}/api/v1/document-Management-list`, { params }).pipe(
              map((response: any) => { return response })
          );
      }

    getDocumentManagementById(id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/document-Management/${id}`).pipe(
          map((response: any) => { return response })
        );
    }

    deleteDocumentManagementById(id: any) {
        return this.http.delete<any>(`${this.databaseKey}/api/v1/document-Management/${id}`).pipe(
          map((response: any) => { return response })
        );
    }

    // template assignment APIs
    listAllUsers(params: any = {}) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/users-list`, { params }).pipe(
            map((response: any) => { return response })
        );
    };

    assignTemplateToUsers(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/document-Management-assign`, body).pipe(
            map((response: any) => { return response })
        );
    };

    getUserDetailsByIds(ids: any) {
        const params = { ids: ids.join(',') };
        return this.http.get<any>(`${this.databaseKey}/api/v1/users-details`, { params }).pipe(
            map((response: any) => { return response })
        );
    };

    generateTemplatePreview(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/document-Management-preview`, body).pipe(
            map((response: any) => { return response })
        );
    };

    downloadTemplate(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/document-Management-download`, body, { responseType: 'blob' as 'json' }).pipe(
            map((response: any) => { return response })
        );  
    };

    sendTemplateMail(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/document-Management-send-mail`, body).pipe(
            map((response: any) => { return response })
        );
    };

    getTemplatesAssignedRecord(user_id: any, entity_id: any, financial_id: any) {
        const params = { user_id, entity_id, financial_id };
        return this.http.get<any>(`${this.databaseKey}/api/v1/template-assigned-user-list`, { params }).pipe(
            map((response: any) => { return response })
        );
    };

}
