import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';

@Component({
  selector: 'app-e-invoice-action',
  templateUrl: './e-invoice-action.component.html',
  styleUrls: ['./e-invoice-action.component.scss']
})
export class EInvoiceActionComponent {
  
  employee_complaint_id: any;
  assignAction: any;
  rowData: any;

  constructor(private apiUrl: warehouseListService,private toaster:ToastrService, ) {
  }

  ngOnInit(): void {
   
  }
  public cellValue: any;


  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data;
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

 

  viewPdf() {
    let payload = {
      vehicle_planing_id: this.cellValue.vehicle_planing_id
    };
  
    this.apiUrl.genratePdfinvoice(payload).subscribe(
      (res: any) => {
  
        const byteArray = new Uint8Array(res.data.data);
  
        const blob = new Blob([byteArray], { type: 'application/pdf' });
  
        const url = window.URL.createObjectURL(blob);
  
        const win = window.open(url, '_blank');
  
        if (!win) {
          this.toaster.error('Popup blocked');
        }
      },
      () => this.toaster.error('Failed to open PDF')
    );
  }

  downloadPdf() {
    let payload = {
      vehicle_planing_id: this.cellValue.vehicle_planing_id
    };
  
    this.apiUrl.genratePdfinvoice(payload).subscribe(
      (res: any) => {
  
        const byteArray = new Uint8Array(res.data.data);
  
        const blob = new Blob([byteArray], { type: 'application/pdf' });
  
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = 'E-Invoice.pdf';
        a.click();
  
        window.URL.revokeObjectURL(url);
      },
      () => this.toaster.error('Failed to download PDF')
    );
  }

}
