import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-account-payle',
  templateUrl: './account-payle.component.html',
  styleUrls: ['./account-payle.component.scss']
})
export class AccountPayleComponent {
  rowClass: any;
  docForm: any;
  non_register: boolean = false;
  // supplier_purchase: boolean = false;
  vendor_id: any;
  codeGet: any;
  cccodeGet: any;
  codeSncGet: any;
  checkRegister: string;
  supplierCheck: string;
  editBankData: any;
  supplierPurchaseChecked: boolean =false;
  type: any;
  data:any=[]
  entity_id: any= null;
  constructor(
    private route: Router,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    private vendorService: VendorManagementService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
  ) {
    this.rowClass = 'rowClass';

    this.docForm = this.fb.group({
      cc_code:new FormControl(null),
      sns_debit:new FormControl(null),
      pgc_account:new FormControl(null),
      check_register:new FormControl(null),
      supplier_purchase:new FormControl(null),
      account_chart: new FormControl(null,[Validators.required]),
    
    })

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeroute.queryParams.subscribe((params: any) => {
    this.vendor_id = params.id;
     this.type=params?.type;

    });
     this.getAccountChart();
    if(this.type =="Edit" ||  this.type =="View"){
      this.getByVendor()
      // this.getCcCode();
      // this.getSncCode();
    }
    // this.getAccountChart();
    
   
  }
  getByVendor(){
    this.vendorService.getByVendor(this.vendor_id).subscribe((res: any) => {
      this.editBankData= res.data ;
      console.log(this.editBankData?.non_registered,'this.editBankData?.non_registered');
      console.log(this.supplierPurchaseChecked,'this.supplierPurchaseChecked');
      console.log(this.editBankData,'this.editBankData');
      ;
      this.docForm.patchValue({
        account_chart: this.editBankData?.chart_of_account_id,
      })
      // chart_of_account_id
if(this.editBankData?.non_registered === "YES"){
this.docForm.patchValue({
  check_register:true
})
}
if(this.editBankData?.supplier_for_cash_pur === "YES"){
  this.docForm.patchValue({
    supplier_purchase:true
  })
  }
      
      this.docForm.patchValue({
        cc_code:this.editBankData?.cc_account_code,
sns_debit:this.editBankData?.sns_details_security,
pgc_account:this.editBankData?.pgc_account,
// check_register:this.editBankData?.check_register,
// supplier_purchase:this.editBankData?.supplier_purchase,
      })
      // this.arrayDataPush=res.data?.doc_details;
      // this.getStateByCountry(Number(this.editBankData?.country_id));
      // this.getCityByState((Number(this.editBankData?.state_id)));

       })
  }
  getAccountChart(){
    ;
    // this._commonService?.showLoader()
    this.vendorService.getAccountChart(this.entity_id).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      this.data=res?.data;
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  onSubmit(){
let val=this.docForm.value;
console.log(val,'vall');
if (this.docForm.invalid) {
  this.toast.error('Required fields should not be empty', 'Fields Error');

  return;
}
if(val?.check_register == true){
this.checkRegister='YES'
}else{
  this.checkRegister='NO'
}

if(val?.supplier_purchase == true){
this.supplierCheck="YES"
}else{
this.supplierCheck="NO"
}
let data={
    id: this.vendor_id,
    chart_of_account_id : this.docForm?.value?.account_chart,
    advanced_chart_of_account_id: this.docForm?.value?.advance_account_chart,
    tab_type: "Account_Details",
    non_registered:this.checkRegister,
    supplier_for_cash_pur:this.supplierCheck,
    // cc_account_code:val?.cc_code,
    // sns_details_security:val?.sns_debit,
    // pgc_account:val.pgc_account
}
;
// return;
console.log(data,'data');
this._commonService?.showLoader()
this.vendorService.createVendorNew(data).subscribe((res: any) => {
  if (res.code == 200) {
    this._commonService?.hideLoader()
    this.toast.success(res.message);
    this.vendor_id = res.data;

    this.route.navigate(
      ['master/vendor/vendor-list/create-vendor/tds-sections'],
      { queryParams: { id: this.vendor_id } }
    );
  }
}, (err) => {
  this._commonService?.hideLoader()
  this.toast.error(err.error.message);
})
  }
 cancels(){
    this.route.navigate(['master/vendor/vendor-list/unapproved-list'])
  }
}
