import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-dialog-account-payable',
  templateUrl: './dialog-account-payable.component.html',
  styleUrls: ['./dialog-account-payable.component.scss']
})
export class DialogAccountPayableComponent {
  vendorInvoiceId: any;
  vendorInvoiceData: any;
  vendorInvoicePdf: any;
  vendorInvoiceDataPdf: any;
  myExpenseId: any;
  myExpenseData: any;
  cpId: any;
  cpSingleData: any;


  constructor(private _finaceService:FinaceService,public dialog: MatDialogRef<DialogAccountPayableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ){


this.vendorInvoiceId=data.vendorInvoiceid;
this.vendorInvoicePdf=data.vendorPdf;

this.myExpenseId=data.expenseId;

console.log(data,'data');
this.cpId=data.cpId;
console.log(this.cpId,'this.cpId');

  }
ngOnInit(){

  if(this.vendorInvoiceId){
    this.getByVendorInvoice();
  }

  if(this.vendorInvoicePdf){
    this.getByVendorInvoicePdf();
  }

  if(this.myExpenseId){
    this.getByExpenseInvoice();
 }

 if(this.cpId){
  this.getByCp();
 }
}
  getByVendorInvoice(){
    this._finaceService.getByVendorinoviceCopy(this.vendorInvoiceId).subscribe((res:any)=>{

this.vendorInvoiceData=res.data;
    })
  }
  getByVendorInvoicePdf(){
    this._finaceService.getByVendorinoviceCopy(this.vendorInvoicePdf).subscribe((res:any)=>{

this.vendorInvoiceDataPdf=res.data;
    })
  }

  getByExpenseInvoice(){
    this._finaceService.getByExpenseInvoice(this.myExpenseId).subscribe((res:any)=>{

   this.myExpenseData=res.result;
    

    })
  }

  getByCp(){
    this._finaceService.getByChannelPartner(this.cpId).subscribe((res:any)=>{
  console.log(res,'resss cp');
  this.cpSingleData=res.data;
  // this.patchDataCp()
    })
  }
}
