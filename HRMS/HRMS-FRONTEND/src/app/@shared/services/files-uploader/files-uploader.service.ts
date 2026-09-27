import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/app/environments/environment';
import { map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesUploaderService {
  private databaseKey:string;

  constructor(private http: HttpClient) { 
    this.databaseKey = environment.serverUrl;
  }
  
  singleBlobUploader(file:File): Observable<any>{
    const formData = new FormData();
    formData.append('file', file)
    return this.http.post(`${this.databaseKey}/api/v1/single-upload-blob`, formData)
  }
  
  bulkBlobUploader(fileInput: any): Observable<any> {
    const formData = new FormData();
  
    if (!fileInput.files || fileInput.files.length === 0) {
      console.error("No files selected for upload.");
      return throwError(() => new Error("No files selected"));
    }
    const files: FileList = fileInput.files;

    Array.from(files).forEach((file: File) => {
      formData.append("files", file, file.name);
    });
  
    return this.http.post(`${this.databaseKey}/api/v1/bulk-upload-blob`, formData);
  }
  crmBulkuploder(fileInput: any): Observable<any> {
    const formData = new FormData();
  
    if (!fileInput.files || fileInput.files.length === 0) {
      console.error("No files selected for upload.");
      return throwError(() => new Error("No files selected"));
    }
    const files: FileList = fileInput.files;

    Array.from(files).forEach((file: File) => {
      formData.append("files", file, file.name);
    });
    debugger
    return this.http.post(`${this.databaseKey}/api/v1/bulk-upload-crm`, formData);
  }
  singleServerUploader(file:File): Observable<any>{
    const formData = new FormData();
    formData.append('file', file)
    return this.http.post(`${this.databaseKey}/api/v1/single-upload-lserver`, formData)
  }

  bulkServerUploader(fileInput: any): Observable<any> {
    const formData = new FormData();
  
    if (!fileInput.files || fileInput.files.length === 0) {
      console.error("No files selected for upload.");
      return throwError(() => new Error("No files selected"));
    }
    const files: FileList = fileInput.files;

    Array.from(files).forEach((file: File) => {
      formData.append("files", file, file.name);
    });
  
    return this.http.post(`${this.databaseKey}/api/v1/bulk-upload-lserver`, formData);
  }
  
  uploadToBlobObservable(data: any, upload_field: string): Observable<any> {
    if (data[upload_field] instanceof File) {
      return this.singleBlobUploader(data[upload_field]).pipe(
        map((uploadResponse: any) => {  
          let updatedFileFiled = { ...data, [upload_field]: uploadResponse?.file?.fileName }
          return updatedFileFiled
        })
      );
    }
    return of(data);
  }
  
  uploadToServerObservable(data: any, upload_field: string): Observable<any> {
    if (data[upload_field] instanceof File) {
      return this.singleServerUploader(data[upload_field]).pipe(
        map((uploadResponse: any) => ({ ...data, [upload_field]: uploadResponse?.file?.fileName }))
      );
    }
    return of(data);
  }
  uploadToCrmBlobBulkObservable(data: any, upload_field: string): Observable<any> {
    debugger
    // if (data[upload_field] instanceof File) {
      return this.crmBulkuploder(data[upload_field]).pipe(
        map((uploadResponse: any) => {  
          
          let updatedFileFiled = { ...data, [upload_field]:  uploadResponse.files}

          return updatedFileFiled
        })
      );
    // }
    // return of(data);
  }
}
