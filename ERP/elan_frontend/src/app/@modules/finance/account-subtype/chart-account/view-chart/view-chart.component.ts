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
      account_type_id: new FormControl('', [Validators.required]),
      account_subtype_id: new FormControl('', [Validators.required]),
      account_name: new FormControl('', [Validators.required]),
      account_code: new FormControl('', [Validators.required]),
      account_description: new FormControl('', [Validators.required]),
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
    this._finaceservice.getChartAccountById(this.chartId).subscribe((response: any) => {
      this.form.patchValue({
        account_type_id: response.data[0]?.account_type_name,
        account_subtype_id: response.data[0]?.account_subtype_name,
        account_name: response.data[0]?.account_name,
        account_code: response.data[0]?.account_code,
        account_description: response.data[0]?.account_description,
      })
    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }
}