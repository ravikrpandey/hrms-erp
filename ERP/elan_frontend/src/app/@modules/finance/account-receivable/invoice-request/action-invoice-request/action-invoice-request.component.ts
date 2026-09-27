import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-action-invoice-request',
  templateUrl: './action-invoice-request.component.html',
  styleUrls: ['./action-invoice-request.component.scss']
})
export class ActionInvoiceRequestComponent implements OnInit {
  lead_genration_id: any;
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
    this.lead_genration_id = params.data.lead_genration_id;

    this.brNumberRecivable = params.data.Br_Number;
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
      { queryParams: { lead_genration_id: this.lead_genration_id } }
    );
  }

  sendFinace(e: any) {
    e.stopPropagation();
    this.route.navigate(
      ['master/finance/account-receivable/invoice-request/raise-invoice'],
      { queryParams: { br_number: this.brNumberRecivable } }
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
    // this.isPreview = true;
    // e.stopPropagation();
    // const dashboard = document.getElementById('dashboard');

    // const InvoiceHeight = dashboard!.clientHeight;
    // const InvoiceWidth = dashboard!.clientWidth;
    // const options = {
    //   background: 'white',
    //   width: InvoiceWidth,
    //   height: InvoiceHeight,
    // };

    // domtoimage.toPng(dashboard!, options).then((imgData) => {
    //   const doc = new jsPDF(
    //     InvoiceWidth > InvoiceHeight ? 'l' : 'p',
    //     'mm',
    //     [InvoiceWidth, InvoiceHeight]
    //   );
    //   const imgProps = doc.getImageProperties(imgData);
    //   const pdfWidth = doc.internal.pageSize.getWidth();
    //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    //   doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //   window.open(URL.createObjectURL(doc.output('blob')));
    // });
  }

  //   invoiceCreate(e:any){
  //     e.stopPropagation();
  // console.log(e,'eeeee');
  // this._finaceservice.passValue(this.expensezohodataid);
  // console.log(this.expensezohodataid,'this.expensezohodataid');
  // // let val=localStorage.setItem('ZohoId',this.expensezohodataid)
  // // console.log(val);

  //   }





  getByLead() {
    // console.log(this.leadId, 'getByleadid');

    this.leadService.getByIdLead(this.leadId).subscribe((res: any) => {
      this.singleLeadData = res.data;
      console.log(this.singleLeadData, 'this.singleLeadData ');

      this.brNumberPdf = res.data.br_number;
      console.log(this.brNumberPdf, 'this.brNumberPdf');

      // this.patchLeadData();
      //  if(res.data.bill_send_site===true){
      //    this.billingSite=`${this.singleLeadData.br_number}`+`${'/'}`+ `${this.singleLeadData.associated_company}`+`${'/'}`+`${this.singleLeadData?.customer_category}`+`${'/'}`+`${this.singleLeadData?.state}`+`${'/'}`+`${this.singleLeadData?.region}`

      //    console.log(this.billingSite,'this.billingSite');

      //  }

      //  if(res.data.billing_site===true){
      //    this.billingSiteDeliver=`${this.singleLeadData.br_number}`+`${'/'}`+ `${this.singleLeadData.associated_company}`+`${'/'}`+`${this.singleLeadData?.customer_category}`+`${'/'}`+`${this.singleLeadData?.state}`+`${'/'}`+`${this.singleLeadData?.region}`

      //    console.log(this.billingSite,'this.billingSite');

      //  }
    })
    // const dashboard = document.getElementById('dashboard');
    // console.log(dashboard, 'dashboard');

    // const dashboardHeight = dashboard!.clientHeight;
    // const dashboardWidth = dashboard!.clientWidth;
    // const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

    // domtoimage.toPng(dashboard!, options).then((imgData) => {
    //   const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
    //   const imgProps = doc.getImageProperties(imgData);
    //   const pdfWidth = doc.internal.pageSize.getWidth();
    //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //   // let PDF = new jsPDF('p', 'mm', 'a4');
    //   console.log(pdfHeight, 'pdfHeight');

    //   doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight - 10);
    //   window.open(URL.createObjectURL(doc.output("blob")));
    // });

  }


  getByZoho() {
    this._finaceService.getByInvoice(this.leadId).subscribe((res: any) => {
      console.log(res, 'ressss');
      this.invoiceData = res.data;
      console.log(this.invoiceData, 'this.invoiceData');
      this.brNumberInvoice = res.data.br_number;
      console.log(this.brNumberInvoice, 'this.brNumberInvoice');


    })
  }

  verificationTable() {
    this.leadService.get_invoice_list().subscribe((res: any) => {
      this.rowData = res.data
      console.log(this.rowData, 'this.rowData');
      // for (let item of this.rowData) {
      //   console.log(item.br_number,"items");
      //   console.log(this.brNumberInvoice,'this.brNumberInvoice>>>>>>>>>');
      //   this.brNumberCopy = item.brNumber;
      //   console.log( this.brNumberCopy,' this.brNumberCopy');
      //   let br:any='50252320'
      //   if(this.brNumberCopy ==br) {
      //     this.brNumberData.push(item)
      //     console.log(item.netAmount, 'item.netAmount');

      //     this.totalNetAmount += Number(item.netAmount)
      //   }
      // }
      console.log(this.totalNetAmount, 'this.totalNetAmount');
      console.log(this.brNumberData, 'this.brNumberData');

      for (let item of this.rowData) {
        // console.log(item,"items");


        this.totalNetAmount += Number(item.netAmount)

      }

      console.log(this.totalNetAmount, 'this.totalNetAmount');
      this.igstAmount = this.totalNetAmount * 18 / 100;
      console.log(this.igstAmount, 'this.igstAmount');

      this.totlepayableAmount = this.totalNetAmount + this.igstAmount;
      console.log(this.totlepayableAmount, 'this.totlepayableAmount');
      this.amountPaybaleCharge = this.totlepayableAmount + 5900;
      console.log(this.amountPaybaleCharge, ' this.amountPaybaleCharge');

    })
  }
  invoiceCreateCopy() {
    // this.isPreview = true;
    // e.stopPropagation();
    setTimeout(() => {
      let dashboard = document.getElementById("dashboardCopy");
      console.log(dashboard, 'dashboard');

      let bodyInner:any = document.body.innerHTML;
      bodyInner = dashboard;
      window.print();
      document.body.innerHTML = bodyInner;
      window.location.reload();

      // const dashboardHeight = dashboard!.clientHeight;
      // const dashboardWidth = dashboard!.clientWidth;
      // const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

      // domtoimage.toPng(dashboard!, options).then((imgData) => {
      //   const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
      //   const imgProps = doc.getImageProperties(imgData);
      //   const pdfWidth = doc.internal.pageSize.getWidth();
      //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      //   // let PDF = new jsPDF('p', 'mm', 'a4');
      //   console.log(pdfHeight, 'pdfHeight');

      //   doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      //   window.open(URL.createObjectURL(doc.output("blob")));
      // });
    }, 500)
  }

  invoiceCreate(e:any){
    e.stopPropagation();
    this.route.navigate(
      ['master/finance/account-receivable/e-invoice/invocie_pdf'],
      { queryParams: { br_number: this.expensezohodataid} }
    );
  }
}
