import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-add-bank-payment-voucher',
  templateUrl: './add-bank-payment-voucher.component.html',
  styleUrls: ['./add-bank-payment-voucher.component.scss']
})
export class AddBankPaymentVoucherComponent {
  id : any;
  voucherForm :FormGroup;
  mode: any;
  getData: any;
  entity_id: any;
  constructor(
    private dialog: MatDialogRef<''>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private financeService : FinaceService,
    private _configurationalmasterService: ConfigurationalmasterService,private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
     
   
    this.voucherForm =this._fb.group({
      voucher_name:new FormControl('',[Validators.required]),
      voucher_series:new FormControl('',[Validators.required]),
      
    })
  }

  ngOnInit() {
    if(this.data?.id){
      this.getSealTypeById();
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  getVal(event:any){
  }
  submitData(data:any){
    if(this.voucherForm .invalid){    
      return
    }
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.voucherForm.value.entity_id=this.entity_id
    if(this.data?.id){
      this._configurationalmasterService.updateBankPaymentVoucherData(this.data?.id, data).subscribe(
        (res: any) => {
          if(res.code == 200){
            this.toaster.success('Usage Updated Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.voucherForm .reset();
          }
          else{
            this.toaster.error(res.message);
          }
        }, (err: any) => {
          this.toaster.error(err.error.message)
        }
      );
    }
    else{
      this._configurationalmasterService.createBankPaymentVoucherData(data).subscribe(
        (res: any) => {
          this.toaster.success(res.message);
          this.reloadCurrentRoute();
          this.dialog.close();
          this.voucherForm .reset();
        },
          (err: any) => {
            this.toaster.error(err.error.message)
            // if (err.status == 400) {
            //   this.toaster.error('Something went Wrong!');
            // } else if (err.status == 201) {
            //   this.toaster.error('Budget Category already Exits!');
            // } else {
            //   this.toaster.error('Error in submission!');
            // }
          }
        );
      }
  }
  getSealTypeById() { 
    this._configurationalmasterService
      .getBankPaymentVoucherDataById(this.data.id)
      .subscribe((res: any) => {
        this.getData = res.data;
        this.voucherForm .patchValue({
          voucher_name:this.getData.voucher_name,
          voucher_series:this.getData.voucher_series,
           
        })     
      });
  }


  generateServie(){
      if(this.voucherForm.value.voucher_name){

        this._configurationalmasterService.generateSeriesBankPaymentVoucher(this.voucherForm.value.voucher_name).subscribe((res:any)=>{
          if(res){
             this.voucherForm.patchValue({
              voucher_series:res.data
             })
          }
        })
      }else{
        this.toaster.warning('Please Enter Voucher Name First')
      }
  }
}
