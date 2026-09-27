import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-so-invoice-action',
  templateUrl: './so-invoice-action.component.html',
  styleUrls: ['./so-invoice-action.component.scss']
})
export class SoInvoiceActionComponent {
cellValue: any;
  assignAction: any;
  urlData: any;
  completedStatus :any ='';
  invoice_status: any ='';
  payment_status: any ='';
  deliveredQty: any;
  proposedQuantity: any;
  soStatus : boolean = false;
  vehiclePlanning : boolean = false;
  constructor(
    private router: Router,
    
    
  ) {}
  ngOnInit(): void {
    // this.urlData = environment.servralUrl;
    // this.assignAction = this._rbackService.accessAssignAction();
    
  }

  ngAfterViewInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.deliveredQty = params.data.delivered_qty;
    this.completedStatus = params.data?.completedStatus;
    this.proposedQuantity = params.data.total_proposed_qty;
    this.soStatus = params.data?.proposal_version_status==='REJECTED'?true:false;
    this.vehiclePlanning = params.data.vehiclePlanning;
    this.invoice_status = params.data.invoice_status;
    this.payment_status = params.data.payment_status;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

 
invoiceReturn(){
  this.router.navigate(
    ['master/sales/return/create-so-return'],
    {
      queryParams: {
        invoice_id: this.cellValue?.id,
        type: 'INVOICE_CANCEL'
      }
    }
  );
}
view(){
  
  this.router.navigate(
    ['master/sales/return/create-so-return'],
    {
      queryParams: {
        invoice_id: this.cellValue?.id,
        type: 'INVOICE_CANCEL',
        status:'VIEW'
      }
    }
  );
}
 
}
