import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-view-bank-account',
  templateUrl: './view-bank-account.component.html',
  styleUrls: ['./view-bank-account.component.scss']
})
export class ViewBankAccountComponent {
  form: FormGroup;
  getAccount_data: any[] = [];
  department: any;
  fiscalYearId: any;
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

      party_type: new FormControl(''),
      employee_id: new FormControl(''),
      vendor_id:new FormControl(''),
      iban: new FormControl(''),
      bank_account_no: new FormControl(''),
      branch: new FormControl(''),
      is_default_account: new FormControl(''),
      is_company_account: new FormControl(''),
      status: new FormControl('ACTIVE'),
      account_name: new FormControl(''),
      bank_id: new FormControl(''),
      company_account_id: new FormControl(''),
      country: new FormControl(''),
      parent_account_id: new FormControl(''),
      account_type: new FormControl('')
      
    });
  }
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.fiscalYearId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    if (this.fiscalYearId) {
      this.getBankAccountDetailsById();
    }
  }

  getBankAccountDetailsById() {
    this._finaceservice.getBankAccountDetailsById(this.fiscalYearId).subscribe((response: any) => {
         
      this.form.patchValue({
        account_name: response.data[0]?.account_name,
        bank_name: response.data[0]?.bank_name,
        is_default_account: response.data[0]?.is_default_account,
        account_type: response.data[0]?.account_type,
        bank_account_no: response.data[0]?.bank_account_no,
        is_company_account: response.data[0]?.is_company_account,
        party_type: response.data[0]?.party_type,
        iban: response.data[0]?.iban,
        branch: response.data[0]?.branch,
        country: response.data[0]?.country,
        employee_id: response.data[0]?.employee_id,
        vendor_id: response.data[0]?.vendor_id
      })
      // })
      // })

    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }

  navigateToBankAccount(){
    this.router.navigate(['master/finance/bank-accounting/bank-accounting'])
  }
}
