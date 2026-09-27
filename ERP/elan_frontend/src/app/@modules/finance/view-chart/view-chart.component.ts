import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
  styleUrls: ['./view-chart.component.scss']
})
export class ViewChartComponent implements OnInit {
  form: FormGroup;
  getAccount_data: any[] = [];
  department: any;
  chartId: any;
  employeeDetails: any = [];
  loginUser: any;
  item_masterData: any;
  idemp: any;
  conditioncheck: boolean = false;
  roleGetByemployee: any[] = []
  getSubtypeAccount_data: any;

  constructor(private location: Location,
    private fb: FormBuilder,
    private _finaceservice: FinaceService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      account_type_id: new FormControl(''),
      account_no: new FormControl(''),
      company_id: new FormControl(''),
      currency_id: new FormControl(''),
      parent_account_id: new FormControl(''),
      is_group: new FormControl(''),
      bank_name: new FormControl(''),
      parent_account_name: new FormControl(''),
      debit_balance: new FormControl('0'),
      credit_balance: new FormControl('0'),
      balance: new FormControl('0'),
      root_name: new FormControl(''),
      account_subtype_id: new FormControl(''),
      report_type: new FormControl(''),
      balance_must_be: new FormControl(''),
      status: new FormControl('ACTIVE'),
      account_name: new FormControl(''),
      account_remarks: new FormControl(''),
      account_code: new FormControl(''),
      account_description: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.chartId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    if (this.chartId) {
      this.getChartAccountById();
    }
  }

  getChartAccountById() {
    this._finaceservice.getChartOfAccountDetailsById(this.chartId).subscribe((response: any) => {
      
      // this._finaceservice.getAccountGroupByAccountTypeId(response.data[0]?.account_type_id).subscribe((response2:any)=>{
      //   this.accountGroupList = response2.data;
      //   this._configurationalMasterService.getQuotationcurrency().subscribe((resp: any) => {
      //     this.currencyList = resp.data;
      this.form.patchValue({
        account_name: response.data[0]?.account_name,
        // account_type_id: response.data[0]?.account_type_name,
        
        account_no: response.data[0]?.account_code,
        balance_must_be: response.data[0]?.balance_must_be,
        is_group: response.data[0]?.is_group,
        status: response.data[0]?.status,
        account_remarks: response.data[0]?.remarks,
        bank_name: response.data[0]?.bank_name,
        parent_account_id: response.data[0]?.parent_account,
        report_type: response.data[0]?.report_type,
        parent_account_name: response.data[0]?.parent_account_name,
        debit_balance: response.data[0]?.debit_balance,
        credit_balance: response.data[0]?.credit_balance,
        balance: response.data[0]?.balance,
        root_name: response.data[0]?.root_name
      })
      // })
      // })

    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }


  backToList(){
    this.router.navigate(['/master/finance/account-charts'])
  }
}