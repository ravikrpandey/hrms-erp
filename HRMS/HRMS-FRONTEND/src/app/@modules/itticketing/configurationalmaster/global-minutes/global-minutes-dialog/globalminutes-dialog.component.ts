import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-globalminutes-dialog',
  templateUrl: './globalminutes-dialog.component.html',
  styleUrls: ['./globalminutes-dialog.component.scss']
})
export class GlobalMinutesDialogComponent {
  designation_id: any;
  singleCountryData: any;
  globalminutesform: FormGroup
  loginUser: any;
  entity_Id: any;
  employeeId: any;
  pageMode: string | undefined;
  showUpdate: boolean = false;
  appDesignationList2: any;
  appDepartmentList2: any;
  appDesignationList: any;
  appDepartmentList: any;
  departments: any;
  locations: any;
  designations: any;
  isForAll: Boolean = false;
  isDisabled = false;
  constructor(
    private dialog: MatDialogRef<GlobalMinutesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private leaveManagementService: LeaveManagementService,
    public _fb: FormBuilder, public toaster: ToastrService, public route: Router,
  ) {
    this.designation_id = Number(data.id);
    this.globalminutesform = this._fb.group({
      allEmployees: new FormControl(false),
      global_minute_value: new FormControl(null, [Validators.required,]),
      effective_from: new FormControl(null, [Validators.required,]),
      department: new FormControl({ value: [], disabled: this.isDisabled }),
      designation: new FormControl({ value: [], disabled: this.isDisabled }),
      entity_id: new FormControl(null),
    })

    this.globalminutesform.get('allEmployees')?.valueChanges.subscribe((value: any) => this.toggleFields(value));
  }
  editDesignation: any
  addDesignation: any;
  visibility: any;
  ngOnInit() {
    this.localStorage()
    if (this.designation_id) {
      this.getByIdDesignation();
    }
    this.getDepartmentList()
    this.getDesignationList()
    this.addDesignation = this.data.data;
    this.editDesignation = this.data.edit;
    this.visibility = this.data.view;
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }
  forAllCheck(event: any) {
    this.isForAll = event.checked
  }
  getDepartmentList() {
    this.leaveManagementService.GetLeaveAppDeparment(this.entity_Id).subscribe((res: any) => {

      this.appDepartmentList = res.data;
      this.appDepartmentList2 = res.data;
      this.departments = this.appDepartmentList2?.map((res: any) => res.department_name)
      // this.toaster.success('Leave applicability fetched successfully');
    }, (err: any) => {
      // this.toaster.error(`${err.error.message}`);
    }
    );
  }
  getDesignationList() {
    this.leaveManagementService.GetLeaveAppDesgination().subscribe((res: any) => {

      this.appDesignationList = res.data;
      this.appDesignationList2 = res.data;
      this.designations = this.appDesignationList2?.map((res: any) => res.designation_name)
      // this.toaster.success('Leave applicability fetched successfully');
    }, (err: any) => {
      // this.toaster.error(`${err.error.message}`);
    }
    );
  }
  designationSearch(e: any) {
    const aa = e
    let filteredVariable = this.appDesignationList2.filter((item: any) => aa.includes(item.designation_name));
    this.appDesignationList = filteredVariable
  }

  departmentSearch(e: any) {
    const aa = e
    let filteredVariable = this.appDepartmentList2.filter((item: any) => aa.includes(item.department_name));
    this.appDepartmentList = filteredVariable
  }

  getByIdDesignation() {
    this._configurationalmasterService.global_minutes(this.designation_id).subscribe((res: any) => {
      if (res?.data) {
        this.singleCountryData = res.data;
        const departmentIds = this.singleCountryData.applicable_department?.map((dept: any) => dept.dept_id) || [];
        this.globalminutesform.get('department')?.setValue(departmentIds);

        const designationIds = this.singleCountryData.applicable_designation?.map(
          (designation: any) => designation.designation_id
        ) || [];
        this.globalminutesform.get('designation')?.setValue(designationIds);

        if (this.designation_id) {
          this.globalminutesform.patchValue({
            global_minute_value: this.singleCountryData?.global_minute_value,
            effective_from: this.singleCountryData?.effective_from
              ? new Date(this.singleCountryData.effective_from).toISOString().split('T')[0]
              : '',
          })
          if (this.singleCountryData?.applicable_forall === "1") {
            this.isForAll = true;
            this.globalminutesform.get('allEmployees')?.setValue(true);
          } else if (this.singleCountryData?.applicable_forall === "0") {
            this.isForAll = false;
          } else {
            this.isForAll = false;
          }
        }
      } else {
        console.error('No data returned for the provided designation ID');
      }
    }, error => {
      console.error('Error fetching designation data:', error);
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  payload: any;
  ngSubmitDesignation(data: any) {
    data.value.entity_id = this.entity_Id

    if (this.isForAll === true) {
      this.payload = {
        ...data.value,
        "for_all": '1',
      }

    } else {
      this.payload = {
        ...data.value,
        "for_all": '0',
      }
    }
    console.log(data)
    if (this.globalminutesform.invalid) {
      this.globalminutesform.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
    if (this.editDesignation == 'Designation') {
      this._configurationalmasterService.global_minute_update(this.designation_id, this.payload).subscribe((res: any) => {
        if (res) {
          if (res.message == "Global Minutes Already Exists!") {
            this.toaster.warning('Global Minutes Already Exists!');
          }
          else {
            this.toaster.success('Global Minutes Updated Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
          }
        }
      },)
    }
    if (this.addDesignation == 'Add_Designation') {
      if (this.globalminutesform.invalid) {
        this.globalminutesform.markAllAsTouched()
        return
      }
      this._configurationalmasterService.create_global_minutes(this.payload).subscribe((res: any) => {
        if (res) {
          if (res.message === "Global Minutes Already Exists!") {
            this.toaster.warning('Global Minutes Already Exists!');
          }
          else {
            this.toaster.success('Global Minutes Added Successfully');
            this.dialog.close();
            this.reloadCurrentRoute()
          }
        }

      }, (err: any) => {
        if (err.status == 409) {
          this.toaster.error('Global Minutes Already Exists!');
        } else {
          this.toaster.error('An unexpected error occurred.', 'Error Occurred!', err);
        }
      })
    }
  }

  onDateChange(event: any): void {
    const selectedDate = event.value;
    this.globalminutesform.patchValue({
      effective_from: this.normalizeDate(selectedDate)
    });
  }

  normalizeDate(date: Date): Date {
    if (!date) return date;
    const normalizedDate = new Date(date);
    normalizedDate.setHours(12, 0, 0, 0); // Set time to noon to avoid timezone issues
    return normalizedDate;
  }
  onCancel(): void {
    this.globalminutesform.reset();
    this.toggleFields(false);
  }

  toggleFields(disable: boolean): void {
    ['department', 'designation'].forEach(field => {
      this.globalminutesform.get(field)?.setValue([]);
      disable ? this.globalminutesform.get(field)?.disable() : this.globalminutesform.get(field)?.enable();
    });
    this.isDisabled = disable;
  }

}



