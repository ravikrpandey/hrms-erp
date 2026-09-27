import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import Swal from 'sweetalert2';

interface QueryParams {
  leaveId?: string;
  mode?: string;
}

@Component({
  selector: 'app-leave-applicability',
  templateUrl: './leave-applicability.component.html',
  styleUrls: ['./leave-applicability.component.scss'],
})
export class LeaveApplicabilityComponent implements OnInit {
  applicabilityForm: FormGroup;
  genderList = ['Male', 'Female', 'Others'];
  maritalStatusList = ['Unmarried', 'Married', 'Separated'];
  isDisabled = false;
  leavesEntitlement: any;
  payload: any;
  appDepartmentList: any;
  appDesignationList: any;
  appLocationList: any;
  routeLeaveId: any;
  isForAll: Boolean = true;
  leaveApplicabilityData: any;
  showUpdate: boolean = false;
  financial_id: any;
  entity_id: any;
  employeeId: any;
  pageMode: string | undefined;
  appDesignationList2: any;
  appDepartmentList2: any;
  appLocationList2: any;
  departments: any;
  locations: any;
  designations: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private leaveManagementService: LeaveManagementService
  ) {}

  ngOnInit(): void {
    this.leaveManagementService.changeMessage('Policy Applicability');

    //LOCAL STORAGE DATA============
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');

    let localStorageJSON: any = localStorage.getItem('signInUser');
    const jsonObject = JSON.parse(localStorageJSON);
    this.employeeId = jsonObject.employee_id;

    this.route.queryParams.subscribe((params) => {
      const queryParams: QueryParams = params;
      this.routeLeaveId = queryParams.leaveId;
      this.pageMode = queryParams.mode;

      if (this.pageMode === 'viewMode') {
      }
      if (this.routeLeaveId) {
        this.getApplicability(this.routeLeaveId);
      }
    });
    //==============================

    this.getDepartmentList();
    this.getDesignationList();
    this.getLocationList();

    this.applicabilityForm = this.fb.group({
      allEmployees: new FormControl(false),
      department: new FormControl({ value: [], disabled: this.isDisabled }),
      gender: new FormControl({ value: [], disabled: this.isDisabled }),
      maritalStatus: new FormControl({ value: [], disabled: this.isDisabled }),
      locations: new FormControl({ value: [], disabled: this.isDisabled }),
      designation: new FormControl({ value: [], disabled: this.isDisabled }), // Added designation form control
    });

    this.applicabilityForm
      .get('allEmployees')
      ?.valueChanges.subscribe((value: any) => this.toggleFields(value));

    [
      'department',
      'gender',
      'maritalStatus',
      'locations',
      'designation',
    ].forEach((field) => {
      this.applicabilityForm
        .get(field)
        ?.valueChanges.subscribe((value: any) => {
          // if (value.length) {
          // this.applicabilityForm.get('allEmployees')?.setValue(false, { emitEvent: false });
          // console.log('applicabilityForm =>', this.applicabilityForm);
          // }
        });
    });
  }

  forAllCheck(event: any) {
    this.isForAll = event.checked;
  }

  getApplicability(leaveId: any) {
    this.leaveManagementService
      .GetLeavePolicyApplicability(
        leaveId,
        this.financial_id,
        this.entity_id,
        this.employeeId
      )
      .subscribe(
        (res: any) => {
          this.leaveApplicabilityData = res.data;
          this.showUpdate = true;
          // Setting the data from the response to the form controls
          this.applicabilityForm
            .get('department')
            ?.setValue(
              this.leaveApplicabilityData.department.map(
                (dept: any) => dept.dept_id
              )
            );
          this.applicabilityForm
            .get('gender')
            ?.setValue(
              this.leaveApplicabilityData.gender.map(
                (gender: any) => gender.gender
              )
            );
          this.applicabilityForm
            .get('maritalStatus')
            ?.setValue(
              this.leaveApplicabilityData.marital.map(
                (marital: any) => marital.marital
              )
            );
          this.applicabilityForm
            .get('locations')
            ?.setValue(
              this.leaveApplicabilityData.locations.map(
                (location: any) => location.MASTER_BRANCH.id
              )
            );
          this.applicabilityForm
            .get('designation')
            ?.setValue(
              this.leaveApplicabilityData.designation.map(
                (designation: any) => designation.DESIGNATION.designation_id
              )
            );

          this.isForAll = false;

          if (this.leaveApplicabilityData.isForAll === '1') {
            this.showUpdate = true;
            this.getApplicabilityForAll(this.routeLeaveId);
          } else if (this.leaveApplicabilityData.isForAll === '0') {
            this.showUpdate = false;
          }
        },
        (err: any) => {
          this.showUpdate = false;
          // if (err.error.message === "Leave does not exist") {
          //   this.router.navigate(['/master/hrms/leave-management/leave-policy']);
          // }
          console.log(err.error.message);
        }
      );
  }

  getApplicabilityForAll(leaveId: any) {
    let forALL = this.isForAll === true ? 1 : 0;
    this.leaveManagementService
      .GetLeaveApplicabilityForAll(
        leaveId,
        this.financial_id,
        this.entity_id,
        this.employeeId
      )
      .subscribe(
        (res: any) => {
          this.showUpdate = true;
          this.isForAll = true;
          this.applicabilityForm.get('allEmployees')?.setValue(true);
        },
        (err: any) => {
          this.showUpdate = false;
          // if (err.error.message === "Leave does not exist") {
          //   this.router.navigate(['/master/hrms/leave-management/leave-policy']);
          // }
          // this.toaster.error(`${err.error.message}`);
        }
      );
  }

  filterDepartment: any;
  getDepartmentList() {
    this.leaveManagementService.GetLeaveAppDeparment(this.entity_id).subscribe(
      (res: any) => {
        this.appDepartmentList = res.data;
        this.filterDepartment = [...this.appDepartmentList];
        this.appDepartmentList2 = res.data;
        this.departments = this.appDepartmentList2?.map(
          (res: any) => res.department_name
        );
        // this.toaster.success('Leave applicability fetched successfully');
      },
      (err: any) => {
        // this.toaster.error(`${err.error.message}`);
      }
    );
  }


  locationfilter:any
  getLocationList() {
    this.leaveManagementService.GetLeaveAppLocation().subscribe(
      (res: any) => {
        this.appLocationList = res.data;
        this.locationfilter = [...this.appLocationList]
        this.appLocationList2 = res.data;
        this.locations = this.appLocationList2?.map(
          (res: any) => res.branch_name
        );
        // this.toaster.success('Leave applicability fetched successfully');
      },
      (err: any) => {
        // this.toaster.error(`${err.error.message}`);
      }
    );
  }

  filterappDesignationList: any;
  getDesignationList() {
    this.leaveManagementService.GetLeaveAppDesgination().subscribe(
      (res: any) => {
        this.appDesignationList = res.data;
        this.filterappDesignationList = [...this.appDesignationList];
        this.appDesignationList2 = res.data;
        this.designations = this.appDesignationList2?.map(
          (res: any) => res.designation_name
        );
        // this.toaster.success('Leave applicability fetched successfully');
      },
      (err: any) => {
        // this.toaster.error(`${err.error.message}`);
      }
    );
  }

  designationSearch(e: any) {
    const aa = e;
    let filteredVariable = this.appDesignationList2.filter((item: any) =>
      aa.includes(item.designation_name)
    );
    this.appDesignationList = filteredVariable;
  }

  departmentSearch(e: any) {
    const aa = e;
    let filteredVariable = this.appDepartmentList2.filter((item: any) =>
      aa.includes(item.department_name)
    );
    this.appDepartmentList = filteredVariable;
  }

  locationSearch(e: any) {
    const aa = e;
    let filteredVariable = this.appLocationList2.filter((item: any) =>
      aa.includes(item.branch_name)
    );
    this.appLocationList = filteredVariable;
  }

  onAdd(): void {
    let formValues = this.applicabilityForm.value;
    if (this.isForAll === true) {
      // If for all is selected
      this.payload = {
        leaveId: this.routeLeaveId,
        for_all: 1,
        for_allStatus: 'ACTIVE',
        for_allDeleted: '0',
        appDepartment: [],
        appDesignation: [],
        appLocation: [],
        appGender: [],
        appMaritalStatus: [],
        financial_id: this.financial_id,
        entity_id: this.entity_id,
        employee_id: this.employeeId,
      };
    } else {
      // If for all is not selected
      this.payload = {
        leaveId: this.routeLeaveId,
        for_all: 0,
        for_allStatus: 'INACTIVE',
        for_allDeleted: '0',
        appDepartment: formValues.department,
        appDesignation: formValues.designation,
        appLocation: formValues.locations,
        appGender: formValues.gender,
        appMaritalStatus: formValues.maritalStatus,
        financial_id: this.financial_id,
        entity_id: this.entity_id,
        employee_id: this.employeeId,
      };
    }

    if (
      formValues.allEmployees == false &&
      formValues.department == 0 &&
      formValues.designation.length == 0 &&
      formValues.gender.length == 0 &&
      formValues.locations.length == 0 &&
      formValues.maritalStatus.length == 0
    ) {
      this.toaster.warning(
        `Please select at least one option before proceeding.`
      );
      return;
    }

    this.leaveManagementService
      .AddLeavePolicyApplicability(this.payload)
      .subscribe(
        (res: any) => {
          this.router.navigate(
            [
              'master/hrms/leave-management/leave-policy/policy-information/leave-restrictions',
            ],
            { queryParams: { leaveId: this.routeLeaveId, mode: this.pageMode } }
          );
          if (this.showUpdate == true) {
            return this.toaster.success(
              'Policy applicability updated successfully'
            );
          } else {
            return this.toaster.success(
              'Policy applicability added successfully'
            );
          }
        },
        (err: any) => {
          if (
            err.error.message ===
            'Leave not available in this financial year or entity'
          ) {
            this.router.navigate([
              '/master/hrms/leave-management/leave-master',
            ]);
            return this.toaster.error(err.error.message);
          }
          this.toaster.error(`Something went wrong `);
        }
      );
  }

  onCancel(): void {
    this.applicabilityForm.reset();
    this.toggleFields(false);
  }

  toggleFields(disable: boolean): void {
    [
      'department',
      'gender',
      'maritalStatus',
      'locations',
      'designation',
    ].forEach((field) => {
      this.applicabilityForm.get(field)?.setValue([]);
      disable
        ? this.applicabilityForm.get(field)?.disable()
        : this.applicabilityForm.get(field)?.enable();
    });
    this.isDisabled = disable;
  }
}
