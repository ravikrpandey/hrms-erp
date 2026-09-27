import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-account-payable-details',
  templateUrl: './account-payable-details.component.html',
  styleUrls: ['./account-payable-details.component.scss']
})
export class AccountPayableDetailsComponent {
  rowClass: any;
  docForm: any;
  non_register: boolean = false;
  // supplier_purchase: boolean = false;
  customer_id: any;
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
    private salesService: SalesService,
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
      advance_account_chart: new FormControl(null,[Validators.required])
    
    })

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeroute.queryParams.subscribe((params: any) => {
    this.customer_id = params.id;
     this.type=params?.type;

    });
     this.getAccountChart();
     this.customerAccoutRecieableDetailById()
    if(this.type =="Edit" ||  this.type =="View"){
      // this.getCcCode();
      // this.getSncCode();
    }
    // this.getAccountChart();
    
   
  }
  customerAccoutRecieableDetailById(){
    this.salesService.customerAccoutRecieableDetailById(this.customer_id).subscribe((res: any) => {
      this.editBankData= res.data ;
       
      this.docForm.patchValue({
        account_chart: this.editBankData?.chart_of_account_id,
        advance_account_chart : this.editBankData?.advanced_chart_of_account_id
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

  onSubmit() {
    let val = this.docForm.value;
  



    this.checkRegister = val?.check_register ? 'YES' : 'NO';
  

    this.supplierCheck = val?.supplier_purchase ? 'YES' : 'NO';
  

    let data = {
      id: this.customer_id,
      chart_of_account_id: this.docForm?.value?.account_chart,
      // advanced_chart_of_account_id: this.docForm?.value?.advance_account_chart,
      tab_type: "account-receivable-details",
      non_registered: this.checkRegister,
      supplier_for_cash_pur: this.supplierCheck,
      // cc_account_code: val?.cc_code,
      // sns_details_security: val?.sns_debit,
      // pgc_account: val.pgc_account
    };
  
    this._commonService?.showLoader();
  

    this.salesService.accountRecievable(data).subscribe({
      next: (res: any) => {
        this._commonService?.hideLoader();
  
        console.log('Backend Response:', res); 
  
        if (res.code === 200) {
          this.toast.success(res.message);
  
         
          this.customer_id = res.data;
  
          this.route.navigate(
            ['master/sales/customer-list/prospect-list'],
            { queryParams: { id: this.customer_id } }
          );
        } else {
 
          this.toast.error(res.message || 'Something went wrong');
        }
      },
      error: (err) => {
        this._commonService?.hideLoader();
        console.error('Error from backend:', err);
  
        // Show toast for backend error
        const errorMessage = err?.error?.message || 'Failed to fetch data';
        this.toast.error(errorMessage);
      }
    });
  }
 cancels(){
    this.route.navigate(['master/vendor/vendor-list/unapproved-list'])
  }
}
