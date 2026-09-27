import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, shareReplay, switchMap } from 'rxjs/operators';
import moment from 'moment';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;
// const databaseKey= 'http://192.168.20.157:7000';
const routes = {
  contact: {
    apiEp: () => `${databaseKey}/api/v1/campaign/contacts`,
    apiEp_id: (id: string ) => `${databaseKey}/api/v1/campaign/contacts/${id}`,
    apiEpByListId: (ls_id: string|number ) => `${databaseKey}/api/v1/campaign/contact-list/${ls_id}/contacts`,
    downloadSample:(file:string)=> `${databaseKey}/api/v1/download-excel?file=${file}`,
    downloadContactEmp:()=> `${databaseKey}/api/v1/downloadExampleFile`,
    importContact:() => `${databaseKey}/api/v1/multi-upload-contacts`,
    // importContact:() => `${databaseKey}/api/v1/uploadContacts`,
  },
  list:{
    apiEp: () => `${databaseKey}/api/v1/campaign/contact-list`,
    apiEp_id: ( id: string ) => `${databaseKey}/api/v1/campaign/contact-list/${id}`,
    byFolder:(folder_id:string) => `${databaseKey}/api/v1/campaign/contact-folder/${folder_id}/list`
  },
  folder:{
    apiEp: ()=>`${databaseKey}/api/v1/campaign/contact-folder`,
    apiEpFolder: ()=>`${databaseKey}/api/v1/getDataOfContactList`,
    apiEp_id: ( id: string ) => `${databaseKey}/api/v1/campaign/contact-folder/${id}`,
  },

}

@Injectable({
  providedIn: 'root'
})
export class CampaingContactService {
  // folder
  private folderSubject : BehaviorSubject<any> = new BehaviorSubject<any>(null);
 foldersData$ : Observable<any> = this.folderSubject.asObservable().pipe(shareReplay(1));
//  list
 private listSubject : BehaviorSubject<any> = new BehaviorSubject<any>(null);
 listsData$ : Observable<any> = this.listSubject.asObservable().pipe(shareReplay(1));


  constructor(private http: HttpClient) { }

  // folder api's 
  getFolderData(): Observable<any[]> {
    return this.foldersData$;
  }
  fetchFolderData(queryParams?: any): void {
    this.http.get<any[]>(routes.folder.apiEp(), {params: queryParams}).pipe(
      tap((data) => this.folderSubject.next(data)),
      catchError((error) => this.handleError(error))
    ).subscribe();
  }
  fetchFolderData1(queryParams?: any): void {
    this.http.get<any[]>(routes.folder.apiEpFolder(), {params: queryParams}).pipe(
      tap((data) => this.folderSubject.next(data)),
      catchError((error) => this.handleError(error))
    ).subscribe();
  }

  updateFolderData(id: string, data: any): Observable<any> {
    return this.http.put(`${routes.folder.apiEp_id(id)}`, data)
    .pipe(
      switchMap(() => this.http.get<any[]>(routes.folder.apiEp())),
      tap((updatedData) => this.folderSubject.next(updatedData)),
      catchError((error) => this.handleError(error))
    );
  }

 deleteFolderData(id: string): Observable<any> {
   return this.http.delete(`${routes.folder.apiEp_id(id)}`).pipe(
     switchMap(() => this.http.get<any[]>(routes.folder.apiEp())),
     tap((updatedData) => this.folderSubject.next(updatedData)),
     catchError((error) => this.handleError(error))
   );
 }
//  old 
  addContactFolder(body: any){
    return this.http.post(routes.folder.apiEp(), body)
  }
  getContactFolders(queryParams?: any){
    return this.http.get(routes.folder.apiEp(), { params: queryParams })
  }
  deleteConctactFolder(id:string){
    return this.http.delete(routes.folder.apiEp_id(id))
  }
  updateConctactFolder(id:string, body:any){
    return this.http.put(routes.folder.apiEp_id(id), body)
  }

 /**
  * Handles API errors.
  */
 private handleError(error: any): Observable<never> {
   console.error('An error occurred:', error);
   return throwError(() => new Error('Failed to perform the operation.'));
 }

  /**/
 
//  lists api's
getListData(): Observable<any[]> {
  return this.listsData$;
}
fetchListData(queryParams?: any): void {
  this.http.get<any[]>(routes.list.apiEp(), { params: queryParams })
    .pipe(
      tap((data) => this.listSubject.next(data)),
      catchError((error) => this.handleError(error))
    ).subscribe();
}

updateListData(id: string, data: any): Observable<any> {
  return this.http.put(`${routes.list.apiEp_id(id)}`, data)
    .pipe(
      switchMap(() => this.http.get<any[]>(routes.list.apiEp())),
      tap((updatedData) => this.listSubject.next(updatedData)),
      catchError((error) => this.handleError(error))
    );
}

deleteListData(id: string): Observable<any> {
 return this.http.delete(`${routes.list.apiEp_id(id)}`)
  .pipe(
    switchMap(() => this.http.get<any[]>(routes.list.apiEp())),
    tap((updatedData) => this.listSubject.next(updatedData)),
    catchError((error) => this.handleError(error))
  );
}
//old
  addContactList(body: any){
    return this.http.post(routes.list.apiEp(), body)
  }
  getContactLists(queryParams?: any){
    return this.http.get(routes.list.apiEp(), { params: queryParams })
  }
  getContactByFolder(folder_id: string){
    return this.http.get(routes.list.byFolder(folder_id))
  }
  // getOneList(id: string){
  //   return this.http.get(routes.list.apiEp_id(id))
  // }
  getListById(id: string){
    return this.http.get(routes.list.apiEp_id(id))
  }
  deleteList(id: string){
    return this.http.delete(routes.list.apiEp_id(id))
  }
  updateList(id: string, data:any){
    return this.http.put(routes.list.apiEp_id(id), data)
  }
  addContact(data:any){
    // data['valid_until'] = moment(data['valid_until']).format('YYYY-MM-DD');
    return this.http.post(routes.contact.apiEp(), data)
  }
  getContacts(queryParams?: any){
    return this.http.get(routes.contact.apiEp(), { params: queryParams })
  }
  getContactsByListId(list_Id:string|number, queryParams?: any){
    return this.http.get(routes.contact.apiEpByListId(list_Id), { params: queryParams })
  }
  getContactById(id:string){
    return this.http.get(routes.contact.apiEp_id(id))
  }
  deleteContact(id:string, params?:any){
    return this.http.delete(routes.contact.apiEp_id(id), {params})
  }

  importContact(file: File, list_id:any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name); // Append file to FormData
    formData.append('list_id', list_id);
    return this.http.post(routes.contact.importContact(), formData); // Send FormData in the request
  }
  downloadExcel(file:string) {
    return this.http.get(routes.contact.downloadSample(file),{
      responseType: 'blob'
    },
    );
  }
  downloadContactExcel() {
    return this.http.get(routes.contact.downloadContactEmp(),{
      responseType: 'blob'
    },
    );
  }
//  for folderdata 
  getExistingFolderData(): void {
    if (this.folderSubject.value === null) {
      this.getContactFolders().pipe(
        tap((data) => this.folderSubject.next(data))
      ).subscribe();
    }
  }
  updatefolderSubject(data: any){
    this.folderSubject.next(data)
  }

}

