import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaderResponse,
  HttpHeaders,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';
import { Injectable, Component, } from '@angular/core';
// import JSZip = require('jszip');
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
// import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
// import { Content } from '@angular/compiler/src/render3/r3_ast';
// import * as JSZipUtils from '../../jszip-utils.js';
// import { Content } from '@angular/compiler/src/render3/r3_ast.js';



export class DownloadModel {
  link: string = '';
  fileSize: number = 0;
  fileName: string = '';
}
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  public department:any = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient) {}

  async getFile(url: string) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': this.getContentType(url),
      }),
      responseType: 'blob',
    };
    const res = await this.httpClient
      .get<any>(url, httpOptions)
      .toPromise()
      .catch((err: HttpErrorResponse) => {
        const error = err.error;
        return error;
      });
    return res;
  }

  async createZip(files: any[], zipName: string) {
    const zip = new JSZip();
    const name = zipName + '.zip';

    // tslint:disable-next-line:prefer-for-of
    for (let counter = 0; counter < files.length; counter++) {
      const element = files[counter];
      const fileData: any = await this.getFile(element);
      const b: any = new Blob([fileData], {
        type: fileData.type,
      });

      

    //   var fileURL = URL.createObjectURL(fileData.data);
    //   
    // window.open(fileURL);

      
      //   JSZipUtils.getBinaryContent(element, function (err, data) {
      //     
      //     if(err) {
      //        throw err; // or handle the error
      //     }
      //     zip.file(element.substring(element.lastIndexOf('/') + 1), data, {binary:true});
      //  });

      zip.file(element.substring(element.lastIndexOf('/') + 1), b);
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (content) {
        FileSaver.saveAs(content, name);
      }
    });
  }

  getContentType(url: string): string {
    
    var extension=url.split('.').pop();
    
    
    
    // var extension = new RegExp(/(?:\.([^.]+))?$/).exec(url)[1];
    var contentType = '';

    switch (extension) {
      case 'pdf': {
        return 'application/pdf';
      }
      case 'xlsx': {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }
      case 'xsl': {
        return 'application/vnd.ms-excel';
      }
      case 'csv': {
        return 'application/vnd.ms-excel';
      }
      case 'jpg':{
        return 'image/jpg';
      }
      case 'jpge':{
        return 'image/jpge';
      }
      default: {
        return 'application/json-patch+json';
      }
    }
  }


  setDepartmentType(val:any){
    this.department.next(val)
    
  };
  getDepartmentType(){
    return this.department;
  }

  // downloadFile(data: Response) {
  //   const blob = new Blob([data], { type: 'application/octet-stream' });
  //   const url = window.URL.createObjectURL(blob);
  //   window.open(url);
  // }
}
