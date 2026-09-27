import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { LeadService } from 'src/app/@shared/services/lead.service';

@Component({
  selector: 'app-action-manual-invoice',
  templateUrl: './action-manual-invoice.component.html',
  styleUrls: ['./action-manual-invoice.component.scss']
})
export class ActionManualInvoiceComponent {
  Manual_Invoice_id: any;
  lead_id: boolean;
  showPrint: boolean;
  showInvoice: boolean;
  isPreview: boolean = false;
  invoiceData: any;
  singleLeadData: any;
  showRecivable: boolean = false;
  brNumberRecivable: any;
  approvedStatus: boolean;
  brNumberApproved: any;
  expensezohodataid: any;
  zoho_id_show: boolean = false;
  leadId: any;
  // singleLeadData: any;
  idZogo: string | null;
  // invoiceData: any;
  rowData: any;
  brNumberData: any;
  totalNetAmount: number = 0;
  brNumber: any;
  brNumberPdf: any;
  brNumberInvoice: any;
  brNumberCopy: any;
  igstAmount: any;
  totlepayableAmount: any;
  amountPaybaleCharge: any;
  constructor(
    private route: Router,
    private toast: ToastrService,
    private leadService: LeadService,
    private _finaceservice: FinaceService,
    private _finaceService: FinaceService,
  ) {
  }

  ngOnInit(): void {

  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }
  openHouseClick(e: any) { }
  getValueToDisplay(params: ICellRendererParams) {
    console.log(params, 'params');

    this.invoiceData = params.data;
    this.Manual_Invoice_id = params.data.Manual_Invoice_id;
    console.log('23',  this.Manual_Invoice_id);
    

    this.brNumberRecivable = params.data.br_number;
    console.log(this.brNumberRecivable, ' this.brNumberRecivable');

    this.brNumberApproved = params.data.br_number;
    console.log(this.brNumberApproved, 'this.brNumberApproved');

    this.expensezohodataid = params.data.expense_zoho_data_id;
    console.log(this.expensezohodataid, 'this.expensezohodataid');

    if (params.data.status === 'Invoice Raised') {
      this.showPrint = true;

    }
    if (params.data.status === 'Send Finance') {
      this.showInvoice = true;

    }

    if (params.data.statusInvoice === 'Send Finance') {
      this.showRecivable = true;

    }

    if (params.data.status === "Approved") {
      this.approvedStatus = true;
    }

    if (params.data.expense_zoho_data_id) {
      console.log(params.data.expense_zoho_data_id, 'params.data.expense_zoho_data_id');

      this.zoho_id_show = true;
    }



  }

  emailSend(e: any) {
    e.stopPropagation();
    this.route.navigate(
      ['master/finance/account-receivable/invoice-request/raise-invoice'],
      { queryParams: { Manual_Invoice_id: this.Manual_Invoice_id } }
    );
  }

  sendFinace(e: any) {
    e.stopPropagation();
    this.route.navigate(
      ['master/finance/account-receivable/invoice-request/raise-invoice'],
      { queryParams: { id: this.Manual_Invoice_id,br_number: this.brNumberRecivable } }
    );
  }

  sendZohoInvoice(e: any) {
    e.stopPropagation();
    this.route.navigate(
      ['master/finance/account-receivable/invoice-request/invoice-request-create'],
      { queryParams: { br_number: this.brNumberApproved } }
    );
  }
  printInvoice(e: any) {
  
  }

}
