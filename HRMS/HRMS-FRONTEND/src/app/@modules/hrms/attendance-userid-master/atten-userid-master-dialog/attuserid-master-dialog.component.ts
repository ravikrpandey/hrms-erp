import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttendanceUserIDService } from 'src/app/@shared/services/service/attendance/attand_userid.services';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-currency-master-dialog',
  templateUrl: './attuserid-master-dialog.component.html',
  styleUrls: ['./attuserid-master-dialog.component.scss'],
})
export class AttUseridMasterDialogComponent {
  AttendanceUserForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  view: any;
  entity_id: any;
  employee_id: any;
  de_user_id: any;
  roles: any[] = [];
  roleSelected: boolean = false;
  employees: any;
  entityList: any;
  user_details: any;
  entityIds: any;
  entityData: any = [];
  entityData2: any = [];
  employeeData: any = [];
  employeeData2: any = [];

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private AttendanceUserIDService: AttendanceUserIDService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private entityService: EntityMasterService,
    private employeeService: EmpRegistrationService,
    public dialog: MatDialogRef<AttendanceUserIDService>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.AttendanceUserForm = this.fb.group({
      entity_id: new FormControl(null, [Validators.required]),
      employee_id: new FormControl(null, [Validators.required]),
      de_user_id: new FormControl(null, [Validators.required]),
      device_id: new FormControl(null, [Validators.required]),
      serial_no: new FormControl(null, [Validators.required]),
      job_type: new FormControl(null),
      wfh_tool_id: new FormControl(null),
    });
    if (data?.id) {
      this.setData(data?.id);
    }
  }
  ngOnInit() {
    this.view = this.data?.view;
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    this.getEntityList();
    this.getSerialNumber();
  }

  setData(data: any) {
    this.AttendanceUserIDService.get_userID_details(data).subscribe(
      (res: any) => {
        this.user_details = res?.data[0];
        this.getEmployeeData(this.user_details?.entity_id);
        if (this.user_details?.wfh_tool_id) {
          this.selectWorkFormHome({ checked: true });
        }
        this.AttendanceUserForm.patchValue({
          entity_id: this.user_details?.entity_id,
          employee_id: this.user_details?.employee_id,
          de_user_id: this.user_details?.de_user_id,
          device_id: this.user_details?.device_id,
          job_type: this.user_details?.job_type,
          wfh_tool_id: this.user_details?.wfh_tool_id,
          serial_no: this.user_details?.serial_no,
        });
      }
    );
  }

  filterEntitydata: any;
  getEntityList = () => {
    this.entityList = [];
    this.entityService.getAll_active_Entity().subscribe((res: any) => {
      this.entityList = res?.data;
      this.filterEntitydata = [...this.entityList];
      this.entityData = this.entityList.map((res: any) => res.entity_name);
      this.entityData2 = this.entityList;
    });
  };

  entityFilter(e: any) {
    let filteredVariable = this.entityData2.filter((item: any) =>
      e.includes(item.entity_name)
    );
    this.entityList = filteredVariable;
  }

  getAllData: any;
  filterEmployeeName: any;
  getEmployeeData(e: any) {
    this.AttendanceUserForm.patchValue({ employee_id: null });
    this.getAllData = [];
    let entity_id = e.value ? e.value : e;
    this.employeeService.getemployeeListData(entity_id).subscribe(
      (res: any) => {
        this.getAllData = res.data;
        this.filterEmployeeName = [...this.getAllData];
        this.employeeData = this.getAllData.map((res: any) => res.first_name);
        this.employeeData2 = this.getAllData;
      },
      (err) => {
        console.log(err.error.code, 'No User found.');
        this.toast.error(err.error.message);
      }
    );
  }

  employeefilter(e: any) {
    let filteredVariable = this.employeeData2.filter((item: any) =>
      e.includes(item.first_name)
    );
    this.getAllData = filteredVariable;
  }
  payload: any;
  onSubmitForm() {
    Object.keys(this.AttendanceUserForm.controls).forEach((key) => {
      this.AttendanceUserForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    const entitySelected = this.AttendanceUserForm.get('entity_id')?.value;
    const employeeSelected = this.AttendanceUserForm.get('employee_id')?.value;

    // Custom validation: If entity selected but employee not selected
    if (
      this.AttendanceUserForm.invalid ||
      (entitySelected && !employeeSelected)
    ) {
      if (!employeeSelected) {
        this.toast.error(
          'Please select an employee after selecting entity.',
          'Validation Error!'
        );
      } else {
        this.toast.error(
          'Required fields should not be empty or incomplete.',
          'Error Occurred!'
        );
      }
      return;
    }
    if (this.AttendanceUserForm.invalid) {
      this.toast.error(
        'Required fields should not be empty.',
        'Error Occurred!'
      );
      return;
    }
    let val = this.AttendanceUserForm.value;
    if (this.data?.id) {
      this.payload = {
        ...val,
        att_user_id: this.data?.id,
      };
    } else {
      this.payload = {
        ...val,
      };
    }
    this.AttendanceUserIDService.Create_device_user(this.payload).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.route.navigate([
          'master/itticket/configurational-master/department',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  confirmDialog() {
    this.dialog.close(this.AttendanceUserForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  // For work form home start
  selectWorkFormHome(event: any) {
    if (event.checked) {
      this.AttendanceUserForm.patchValue({ job_type: 'WFH' });
      this.AttendanceUserForm.get('de_user_id')?.clearValidators();
      this.AttendanceUserForm.get('device_id')?.clearValidators();
      this.AttendanceUserForm.get('wfh_tool_id')?.setValidators([
        Validators.required,
      ]);
    } else {
      this.AttendanceUserForm.patchValue({ job_type: null });
      this.AttendanceUserForm.get('de_user_id')?.setValidators([
        Validators.required,
      ]);
      this.AttendanceUserForm.get('device_id')?.setValidators([
        Validators.required,
      ]);
      this.AttendanceUserForm.get('wfh_tool_id')?.clearValidators();
    }
    this.AttendanceUserForm.get('de_user_id')?.updateValueAndValidity();
    this.AttendanceUserForm.get('device_id')?.updateValueAndValidity();
    this.AttendanceUserForm.get('wfh_tool_id')?.updateValueAndValidity();
  }

  filterSerialNumber: any = [];
  serialNumber: any;
  getSerialNumber() {
    this.AttendanceUserIDService.getSerialNumber().subscribe((res: any) => {
      this.serialNumber = res.data;
      this.filterSerialNumber = [...this.serialNumber];
    });
  }
}
