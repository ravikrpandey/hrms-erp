import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {of} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DocumentDiscussonService {
  
  constructor(private api: ApiService) { }

  getAssignedUsers(reportId:string){
    return this.api.get(`contract-requestform/${reportId}/cc-users`)
  }
  getDisscussion(doc_id: string){
    return this.api.get(`contract-documents/${doc_id}/comments`)
  }
  addComment(doc_id: string, data:any){
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      })   
    return this.api.post(`contract-documents/${doc_id}/comments`, data)
  }
  updateUserComment(doc_id: number|null, commentID: number|null, data:any){
    if(!doc_id || !commentID){
      return of([])
    }
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      })   

    return this.api.put(`contract-documents/${doc_id}/comments/${commentID}`, data)
  }
  deleteUserComment(doc_id: number|null, commentID: number|null){
    return this.api.delete(`contract-documents/${doc_id}/comments/${commentID}`)
  }
 
  // internal
  getInternalDisscussion(doc_id: string){
    return this.api.get(`internal_document/${doc_id}/comments`)
  }
  addInternalComment(doc_id: string, data:any){
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      })   
    return this.api.post(`internal_document/${doc_id}/comments`, data)
  }
  updateInternalUserComment(doc_id: number|null, commentID: number|null, data:any){
    if(!doc_id || !commentID){
      return of([])
    }
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      })   

    return this.api.put(`internal_document/${doc_id}/comments/${commentID}`, data)
  }
  deleteInternalUserComment(doc_id: number|null, commentID: number|null){
    return this.api.delete(`internal_document/${doc_id}/comments/${commentID}`)
  }
  
}
