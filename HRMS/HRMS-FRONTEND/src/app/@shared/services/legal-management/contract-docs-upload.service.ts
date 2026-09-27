import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractDocsUploadService {
  private databaseKey = `${environment.serverUrl}/api/v1`;

  constructor(private http: HttpClient) { }

  uploadContractAgreement(reportId: string, data:any) {
    const formData = new FormData();

    // Append each property to the FormData object
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    })   
   
    return this.http.post<any>(`${this.databaseKey}/upload-contract/${reportId}/agreement-docs`, formData) 
    // return this.http.post<any>(`${this.databaseKey}/upload-contract-agreement/${reportId}`, formData) 
  }
  
  getContractAgreementDocs(reportId: string|number|null, params?: any){
    return this.http.get<any>(`${this.databaseKey}/get-contract/${reportId}/agreement-docs`, {params}) 
    // return this.http.get<any>(`${this.databaseKey}/get-contract-agreement/${reportId}`, {params}) 
  }
  
  updateContractAgreementDocs(doc_id:string, body:any){
    return this.http.put<any>(`${this.databaseKey}/update-contract-agreement/${doc_id}`, body) 
  }
  // internal 
  uploadInternalContractAgreement(id: string, data:any) {
    const formData = new FormData();

    // Append each property to the FormData object
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    })   
    debugger
    return this.http.post<any>(`${this.databaseKey}/upload_internal_document/${id}`, formData) 
  }
  
  getInternalContractAgreementDocs(id: string|number|null, params?: any){
    return this.http.get<any>(`${this.databaseKey}/get_Internal_document/${id}`, {params}) 
  }
  
  updateInternalContractAgreementDocs(doc_id:string, body:any){
    return this.http.put<any>(`${this.databaseKey}/update-contract-agreement/${doc_id}`, body) 
  }

}
