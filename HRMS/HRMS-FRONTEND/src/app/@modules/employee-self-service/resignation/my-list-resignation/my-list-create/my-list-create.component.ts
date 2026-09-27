import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { HeadService } from 'src/app/@shared/services/head.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { GridApi } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Location } from '@angular/common';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { LeaveApplyService } from 'src/app/@shared/services/ess/leave-apply.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-my-list-create',
  templateUrl: './my-list-create.component.html',
  styleUrls: ['./my-list-create.component.scss'],
})
export class MyListCreateComponent {
  dataObj: any = {};

  requestNewPositionForm: any;
  public designationList: any;
  public locations: any;
  public departments: any;
  public jdToUpload: any;
  public areaList: any;
  getContractData: any;
  getAllSuperviserData: any;
  selectJob: boolean = true;
  getAllReasonData: any;
  createPrForm: any;
  imageToUpload: any;
  imagePath: any;
  employee_id: any;
  branchAllData: any;
  typeData: { type: string; id: number }[];
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  maxDate = moment({
    year: this.year + 100,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  minEndDate: any;
  cost_center_idData: any;
  newAreaList: any;
  newCostList: any;
  rowDataCheck: any;
  entity_id: any;
  jobData: any;
  jobId: any;
  fileBind: any;
  budgetCheck: boolean;
  paramsData: any;
  fileUpload: any;
  loginUser: any;
  finacial_id: any;
  costCenterData: any;
  departments2: any;
  departmentList: any;
  newAreaList2: any;
  designationList2: any;
  designations: any;
  supervisers: any;
  locations2: any;
  locationValues: any;
  newCostList2: any;
  costCenters: any;
  disable: boolean = true;
  todayDate: string;
  id: any;
  isCheckboxChecked: boolean = false;
  rowData: any;
  financial_id: string | null;
  http: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private recruitService: RecruitService,
    private LeaveApplyService: LeaveApplyService,

    private _commonService: CommonService,
    private _empRegistration: EmpRegistrationService
  ) {
    this.requestNewPositionForm = this.fb.group({
      employee_name: new FormControl(null),
      employee_code: new FormControl(null),
      leaderPosition: new FormControl(null),
      joining_date: new FormControl(null),
      job_location: new FormControl(null),
      department: new FormControl(null),
      manager: new FormControl(null),
      notice_period: new FormControl(null, Validators.required),
      last_working_day: new FormControl(null, Validators.required),
      // paid_leaves: new FormControl(null),
      reason: new FormControl(null, Validators.required),
      remarks: new FormControl(null, Validators.required),
      resign_date: new FormControl(),
      // gratuity: [0],
    });
    const today = new Date();
    this.todayDate = moment(today).format('MM/DD/YYYY');
  }

  // resetGratuityOnDateChange() {
  //   const control = this.requestNewPositionForm.get('last_working_day');
  //   if (!control) return;

  //   control.valueChanges.subscribe(() => {
  //     this.requestNewPositionForm.patchValue(
  //       { gratuity: null },
  //       { emitEvent: false }
  //     );
  //   });
  // }

  // toggleInput() {
  //   const lastWorkingDay: Date =
  //     this.requestNewPositionForm.get('last_working_day')?.value;
  //   if (!lastWorkingDay) {
  //     this.toast.warning('Please select Last Working Day', 'Warning', {
  //       timeOut: 3000,
  //     });
  //     return;
  //   }

  //   const year = lastWorkingDay.getFullYear();
  //   const month = ('0' + (lastWorkingDay.getMonth() + 1)).slice(-2);
  //   const day = ('0' + lastWorkingDay.getDate()).slice(-2);
  //   const formattedDate = `${year}-${month}-${day}`;

  //   const payload = {
  //     employee_id: this.employee_id,
  //     exit_date: formattedDate,
  //   };

  //   this.recruitService.calculateGratuity(payload).subscribe({
  //     next: (res: any) => {
  //       const gratuityValue = res?.data?.gratuity || 0;
  //       this.requestNewPositionForm.patchValue({ gratuity: gratuityValue });

  //       if (res?.message) {
  //         this.toast.info(res.message);
  //       }
  //     },
  //     error: (err: any) => {
  //       console.error('API Error:', err);

  //       const errMsg = err?.error?.message || 'Failed to calculate gratuity';
  //       this.toast.error(errMsg, 'Error', { timeOut: 3000 });
  //     },
  //   });
  // }

  ngOnInit(): void {
    let idEntity = localStorage.getItem('selectedEntityId');
    this.entity_id = Number(idEntity);
    console.log(this.entity_id, 'this.entity_id');
    let finacial_id = localStorage.getItem('financial_id');
    this.financial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id);
    var empData: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(empData);
    const singleEmpData = JSON.parse(empData);
    this.employee_id = singleEmpData?.employee_id;
    console.log('sssss', this.employee_id);
    this.requestNewPositionForm?.get('jobSpecification')?.setValue('YES');
    this.requestNewPositionForm?.get('budget')?.setValue('YES');

    this.activeroute.queryParams.subscribe((params: any) => {
      this.jobId = params?.id;
      this.paramsData = params?.type;
    });

    this.getByIdUse();

    this.getEmployeeLeaveList(this.employee_id);
    // this.resetGratuityOnDateChange();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params['id'];
      if (this.id) {
        this.getIdResignation(this.id);
      }
    });
  }

  getIdResignation(id: any): void {
    this.recruitService.getIdResignation(id).subscribe((res: any) => {
      let val = res.data;
      console.log('gfdsagd', val);
this.isCheckboxChecked = val?.[0]?.is_notice_adjust == 1 ? true : false;
      this.requestNewPositionForm.patchValue({
        reason: val?.[0].reason,
        notice_period: val?.[0].notice_period,
        resign_date: val?.[0].resign_date,
        last_working_day: moment(
          val?.[0].last_working_day,
          'DD-MM-YYYY'
        ).toDate(),
        // paid_leaves: val?.[0].paid_leaves,
        remarks: val?.[0].remarks,
      });
    });
  }

  onCheckboxChange(event: any): void {
    this.isCheckboxChecked = event.checked;
    console.log('Checkbox state:', this.isCheckboxChecked);
  }

  getEmployeeLeaveList(employee_id: any): void {
    this._commonService?.showLoader();
    const allLeaves = false;

    this.LeaveApplyService.getAllAppliedLeavesById(
      this.financial_id,
      this.entity_id,
      employee_id,
      allLeaves
    ).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.requestNewPositionForm.patchValue({
          // paid_leaves: this.rowData[0]?.approved_days,
        });
        this.rowData?.map((item: any) => {
          item.approval_name =
            item?.approval_details?.first_name +
            ' ' +
            item?.approval_details?.last_name;
        });
        this._commonService?.hideLoader();
      },
      (err: any) => {
        console.error('Error fetching leave data', err);
        this._commonService?.hideLoader();
      }
    );
  }

  getByIdUse() {
    const employee_id = this.employee_id;
    this._empRegistration.getByUserId(employee_id).subscribe((res: any) => {
      this.dataObj = res.data;
      console.log('sss', this.dataObj);
    });
  }

  ngSubmit(value: any) {
    let val = this.requestNewPositionForm.value;

    if (this.requestNewPositionForm.invalid) {
      this.toast.error('Form is invalid. Please fill out all required fields.');
      return;
    }

    const data = {
      employee_name: this.dataObj?.first_name + ' ' + this.dataObj?.last_name,
      employee_code: this.dataObj?.employee_code,
      joining_date: this.dataObj?.emp_join_date,
      job_location: this.dataObj?.prev_employer_details?.[0]?.location,
      department: this.dataObj?.department_name,
      manager: this.dataObj?.reporting_manager,
      reason: val?.reason,
      notice_period: val?.notice_period,
      last_working_day: moment(val.last_working_day).format('DD-MM-YYYY'),
      // paid_leaves: val?.paid_leaves,
      remarks: val?.remarks,
      // gratuity: val?.gratuity,
      employee_id: this.employee_id,
      reporting_manager_id: this.dataObj?.reporting_manager_id,
      reporting_manager_name: this.dataObj?.reporting_manager,
      resign_date: this.todayDate,
      entity_id: this.entity_id,
      department_id: this.dataObj?.department_id,
      is_notice_adjust: this.isCheckboxChecked ? 1 : 0,
    };
    this.recruitService.createResignation(data).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.route.navigate(['/master/ess/resignation/my-request-resignation']);
      },
      (err) => {
        if (err.status == 409) {
          this.toast.error('You Already Apply for Resignation');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  cancel() {
    this.route.navigate(['master/ess/manpower-request/my-request-manpower']);
  }
}
