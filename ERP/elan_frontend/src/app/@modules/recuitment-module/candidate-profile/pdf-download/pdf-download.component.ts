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
    {{ value?.condidate_name || value?.candidate }} Pdf
  </a>`,

  styles: ['p{color:cadetblue}'],
})
export class PdfDownloadComponent implements ICellRendererAngularComp {
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
    console.log(this.value, 'ee');
    
    const pdfUrl = this.value?.others_documents || this.value?.upload_resume;
    const pdfName = this.value?.candidate || this.value?.condidate_name;
    FileSaver.saveAs(pdfUrl, pdfName);
    e.stopPropagation();
  }
}