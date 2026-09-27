import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { SalesService } from '../../service/sales.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],
})
export class BankComponent {
  customerProfileForm: FormGroup;
  action_type: any = "";
  entity_id: any;
  customer_id: any;
  entityList: any;
  plant: any = ['Retail', 'Corporate', 'Industrial', 'Government'];
  plantList: any = [];
  financial_year_id: any;
  loginUser: any;
  userLoginId: any;
  filemployeeList: any;
  industryTypeData: any;
  statusCustomer: any;
  data: any;
  flag: any = false;
  invoiceList:any;
  available_credit_limit: any;
  utilized_credit_limit: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private salesService: SalesService,
    private _commonService: CommonService
  ) {
    this.customerProfileForm = this.fb.group({
      // payment_terms: new FormControl(null),
      sactioned_credit_limit: new FormControl(null, [Validators.required]),
      utilized_credit_limit: new FormControl(0),
      sactioned_credit_period: new FormControl(null, [Validators.required]),
      available_credit_limit: new FormControl(0),
      utilized_credit_days: new FormControl(0),
      remainig_credit_days: new FormControl(0),
      grace_period: new FormControl(0),
      // bank_name: new FormControl(null),
      // bank_branch: new FormControl(null),
      // bank_ac_num: new FormControl(null),
      // swift_code: new FormControl(null),
      // ifsc_code: new FormControl(null),
      // interest: new FormControl(null),
      // tab_type: new FormControl(null),
    });
  }
  customer_ids: any;

  ngOnInit() {
    const customer_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
    this.customerProfileForm.patchValue({
      customer_code: customer_code,
    });
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    this.userLoginId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params: any) => {
      this.customer_id = params['id'];
      this.action_type = params['action_type'];
      this.statusCustomer = params.status;
      this.customer_ids = params.id;
      if (this.customer_id) {
        this.getBankById(this.customer_id);
        this.getCustomerInvoiceList(this.customer_id)
      }
    });
  }

  getValue(event: any) {
    const enteredAmount = Number(event.target.value) || 0;
    const availableLimit = Number(this.available_credit_limit) || 0;
    const utilizedLimit = Number(this.utilized_credit_limit) || 0;

    this.customerProfileForm.patchValue({
      // available_credit_limit: enteredAmount + availableLimit
      available_credit_limit: enteredAmount - utilizedLimit
    });
  }

  getCreditLimit(data: any) {
    let sanctioned_credit = this.customerProfileForm.get('sactioned_credit_period')?.value
    let grace_period = this.customerProfileForm.get('grace_period')?.value
    let utilized_credit_days = this.customerProfileForm.get('utilized_credit_days')?.value
    let final_data = (sanctioned_credit + grace_period) - utilized_credit_days;
    this.customerProfileForm.patchValue({
      remainig_credit_days: final_data
    })
  }

  getBankById(id: any) {
    this.salesService.getCreditLimitById(id).subscribe((response: any) => {
      let data = response.data[0];
      this.available_credit_limit = data?.available_credit_limit;
      this.utilized_credit_limit = data?.utilized_credit_limit;
      if (data) {
        this.customerProfileForm.patchValue({
          sactioned_credit_limit: data.sactioned_credit_limit,
          utilized_credit_limit: data.utilized_credit_limit,
          available_credit_limit: data.available_credit_limit,
          sactioned_credit_period: data.sactioned_credit_period,
          grace_period: data.grace_period,
          utilized_credit_days: data.utilized_credit_days,
          remainig_credit_days: data.remainig_credit_days,
          // payment_terms: data.payment_terms,
          // credit_limit: data.credit_limit,
          // internal_credit_limit: data.internal_credit_limit,
          // credit_days: data.credit_days,
          // bank_name: data.bank_name,
          // bank_branch: data.bank_branch,
          // bank_ac_num: data.bank_ac_num,
          // swift_code: data.swift_code,
          // ifsc_code: data.ifsc_code,
          // interest: data.interest,
          // tab_type: data.tab_type,
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/master/sales/customer-list/define-credit-limit']);
  }

  getCustomerInvoiceList(customerId: any) {
    this.salesService.getCustomerInvoiceList(customerId).subscribe({
      next: (res: any) => {
        this.invoiceList = res.data || [];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

// creditData:any;
// getCreditData:any;
//    getAllSanctionCreditLimits() {
//     this._configurationalMasterService.getAllSanctionCreditLimits().subscribe((res: any) => {
//       this.creditData = res.data;
    
//       res.data?.forEach((val:any)=>{
//         if(val?.customer_category_id === this.dataCus?.customer_category_id){
//             this.getCreditData = val
//         }
//       })
//     });
//   }


  onSubmitForm() {
    if (this.customerProfileForm.invalid) {
      this.toast.error('Required fields should not be empty!', 'Fields error!');
      return;
    }
    let payload = {
      ...this.customerProfileForm.value,
      customer_id: this.customer_ids
    }
    this.salesService.defineCreditLimit(payload).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message)
        this.router.navigate(['/master/sales/customer-list/define-credit-limit'])
      }
    }, err => {
      this.toast.error(err.error.message)
    })

  }
}
