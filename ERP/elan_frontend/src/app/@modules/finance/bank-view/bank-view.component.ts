import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-bank-view',
  templateUrl: './bank-view.component.html',
  styleUrls: ['./bank-view.component.scss']
})
export class BankViewComponent {
  form: FormGroup;
  getAccount_data: any[] = [];
  department: any;
  bankId: any;
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
      bank_name: new FormControl(''),
      swift_number: new FormControl(''),
      branch: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      status: new FormControl('ACTIVE'),
      ifsc_code: new FormControl('ACTIVE')
    });
  }
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.bankId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    if (this.bankId) {
      this.getBankDetailsById();
    }
  }

  getBankDetailsById() {
    this._finaceservice.getBankDetailsById(this.bankId).subscribe((response: any) => {
         
      this.form.patchValue({
        bank_name: response.data[0]?.bank_name,
        swift_number: response.data[0]?.swift_number,
        branch: response.data[0]?.branch,
        state:response.data[0]?.state,
        country:response.data[0]?.country_name,
        status: response.data[0]?.status,
        ifsc_code: response.data[0]?.ifsc_code,
      })
      // })
      // })

    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }

  navigateToBank(){
    this.router.navigate(['master/finance/bank-accounting/bank'])
  }
}
