import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-vendor-invoice-pdf',
  templateUrl: './vendor-invoice-pdf.component.html',
  styleUrls: ['./vendor-invoice-pdf.component.scss']
})
export class VendorInvoicePdfComponent {
  leadId: any;
  singleLeadData: any;
  idZogo: string | null;
  invoiceData: any;
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
  zohoId: number;
  byData: any;
  dataInvoice: any;
  dataBrSame: any[];


  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    // private route: Router,
    private toast: ToastrService,

    private activeroute: ActivatedRoute,
    private _finaceService: FinaceService,
    // public dialog: MatDialogRef<InvoicePdfComponent>,
    // @Inject(MAT_DIALOG_DATA)
    // public data: any
  ) {



  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.brNumber = Number(params.br_num);
      // console.log(this.brNumber, 'brNumber');
      console.log(params, 'params  ');
      this.zohoId = Number(params.ZohoId)

    })
    this.idZogo = localStorage.getItem('ZohoId');
    console.log(this.idZogo, 'this.idZogo');
    // this.idZoho()
    if (this.idZogo) {


    }
    this.getByZoho();

    this.verificationTable();
    this.getByRecivable(this.brNumber)


  }


  idZoho() {
    console.log('resss');
    this._finaceService.getEmpTitle().subscribe((res: any) => {
      console.log(res, 'resss');
    })
  }
  getByZoho() {
    this._finaceService.getByInvoice(this.zohoId).subscribe((res: any) => {
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

      const brSameData = []
      for (let item of this.rowData) {
        console.log(item.br_number, "items");
        console.log(this.brNumberInvoice, 'this.brNumberInvoice>>>>>>>>>');
        this.brNumberCopy = Number(item.br_number);
        console.log(this.brNumberCopy, ' this.brNumberCopy');
        // let br:any='50252320'
        console.log(this.brNumber, 'this.brNumber');

        if (this.brNumberCopy === this.brNumber) {
          brSameData.push(item)
          console.log(item.netAmount, 'item.netAmount');

          // this.totalNetAmount += Number(item.netAmount)
        }
      }
      console.log(this.totalNetAmount, 'this.totalNetAmount');
      console.log(brSameData, 'brSameData');
      this.dataBrSame = brSameData;
      console.log(this.dataBrSame, 'this.dataBrSame');

      for (let item of this.dataBrSame) {
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

      const dashboardHeight = dashboard!.clientHeight;
      const dashboardWidth = dashboard!.clientWidth;
      const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

      domtoimage.toPng(dashboard!, options).then((imgData) => {
        const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        // let PDF = new jsPDF('p', 'mm', 'a4');
        console.log(pdfHeight, 'pdfHeight');

        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        window.open(URL.createObjectURL(doc.output("blob")));
      });
    }, 500)
  }

  getByRecivable(e: any) {
    this._finaceService.getByRecivable(e).subscribe((res: any) => {
      console.log(res, 'resss');
      this.byData = res.data;
      console.log(this.byData, 'this.byData');
      this.leadId = res.data.lead_genrate_id;
      console.log(this.leadId, 'this.leadId');
      this.dataInvoice = res.data.getData
      // this.leadForm.patchValue({
      //   ICT_Date: moment(this.dataInvoice?.createdAt).format('YYYY-MM-DD'),
      //   jobTitle:this.dataInvoice?.item_description
      // })

      this.getByLead();
    })
  }

  getByLead() {
    // console.log(this.leadId, 'getByleadid');
    this.leadService.getByIdLead(this.leadId).subscribe((res: any) => {
      this.singleLeadData = res.data;
      console.log(this.singleLeadData, 'this.singleLeadData ');

      this.brNumberPdf = res.data.br_number;
      console.log(this.brNumberPdf, 'this.brNumberPdf');

    })
      ;

  }
}
