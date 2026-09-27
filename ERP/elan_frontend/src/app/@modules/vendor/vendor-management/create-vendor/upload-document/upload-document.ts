import { Component, OnInit } from '@angular/core';
import {  ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

declare var require: any;
const FileSaver = require('file-saver');

@Component({
  selector: 'app-pdf-download',
  template: ` <a
    href="javascript:void(0)"
    style="cursor:pointer"
    (click)="downloadPdf($event)"
  >
    {{ value?.vendor_management?.vendor_name}}.Pdf
  </a>`,

  styles: ['p{color:cadetblue}'],
})
export class UploadDocument implements ICellRendererAngularComp {
    value?: any;
  cellValue: any;
  constructor() {}

  agInit(params: ICellRendererParams<any, any>): void {
    this.value = this.getValueToDisplay(params);
    
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.data;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  downloadPdf(e: any) {
    
    const pdfUrl = this.value?.others_documents;
    const pdfName = this.value?.candidate_name;
    FileSaver.saveAs(pdfUrl, pdfName);
    e.stopPropagation();
  }
}
