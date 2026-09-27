import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Observable, Subject, map } from 'rxjs';
const databaseKey: any = environment.serverUrl;

const routes = {
  document_management_system: {
    createDocumentManagementSystem: () => `${databaseKey}/api/v1/create_document_management_system`,
    getAlldocuments: (entity_id: any) => `${databaseKey}/api/v1/get_all_documents?entity_id=${entity_id}`,
    getDocumentById: (id: any, filename: any) => `${databaseKey}/api/v1/get_document_by_id/${id}/${filename}`,
    downloadDocument: (id: any, filename: any) => `${databaseKey}/api/v1/download_document/${id}/${filename}`,
  },
}

@Injectable({
  providedIn: 'root'
})
export class DocManagSystemServices {
  databaseKey: any;
  constructor(private httpclient: HttpClient) { }
  // For Helath
  createDocumentManagementSystem(data: any) {
    return this.httpclient.post(
      routes.document_management_system.createDocumentManagementSystem(),
      data
    );
  }

  getAlldocuments(entity_id: any) {
    return this.httpclient.get(routes.document_management_system.getAlldocuments(entity_id));
  }


  // View document - same as download but semantically different
  getDocumentById(id: any, filename: any): Observable<Blob> {
    return this.httpclient.get(
      routes.document_management_system.getDocumentById(id, filename),
      {
        responseType: 'blob',
      }
    );
  }

  // Download document as blob
  downloadDocument(id: any, filename: any): Observable<Blob> {
    return this.httpclient.get(
      routes.document_management_system.downloadDocument(id, filename),
      {
        responseType: 'blob',
      }
    );
  }
}
