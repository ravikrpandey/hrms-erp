import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShiftServiceService } from 'src/app/@shared/services/service/hrmServices/shift-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shift-create',
  templateUrl: './shift-create.component.html',
  styleUrls: ['./shift-create.component.scss'],
})
export class ShiftCreateComponent {
  shiftForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  ShiftData: any;
  shiftid: any;
  view: any;
  entity_id: any;
  shiftData: any;
  allemp: any;
  ShiftServiceService: any;
  financial_id: string | null;

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private toast: ToastrService,
    private $shiftService: ShiftServiceService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<ShiftCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.shiftForm = this.fb.group({
  shift_name: new FormControl(null, [Validators.required]),
  Start_Time: new FormControl(null, [Validators.required]),
  end_Time: new FormControl(null, [Validators.required]),
  shift_Duration: new FormControl(null, [Validators.required]),
  Grace_Period: new FormControl(null, [Validators.required]),
  // isOvertimeApplicable: new FormControl(false)
});
    this.shiftData = data?.data;
  }

  ngOnInit() {
    this.shiftid = this.data?.id;
    this.view = this.data?.view;
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.getAllShift();
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.loginUserID = this.loginUser.employee_id;
    this.getAllShiftbyId();
  }

  getAllShiftbyId() {
    this.$shiftService.getAllShiftbyId(this.shiftid).subscribe((res: any) => {
      this.ShiftData = res.data;
      const [start_time, end_time] = this.ShiftData.shift_time.split(' to ');
      let startTime = this.formatTime(start_time);
      let Endtime = this.formatTime(end_time);
      this.shiftForm.patchValue({
        shift_name: this.ShiftData?.shift_name,
        Start_Time: startTime,
        end_Time: Endtime,
        shift_Duration: this.ShiftData?.shift_duration,
        Grace_Period: this.ShiftData?.grace_peroid,
        // isOvertimeApplicable: this.ShiftData?.is_overtime_applicable ?? false
      });
    });
  }

  getAllShift() {
    this.$shiftService.getAllShift(this.entity_id).subscribe((res: any) => {
      this.allemp = res.data;
    });
  }

  onSubmitForm() {
    this.submitted = false;
    if (this.shiftForm.invalid) {
      Object.keys(this.shiftForm.controls).forEach(field => {
      const control = this.shiftForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
      return;
    }
    let val = this.shiftForm.value;
    const data = {
  shift_name: val.shift_name,
  start_time: val.Start_Time,
  end_time: val.end_Time,
  shift_duration: val.shift_Duration,
  grace_peroid: val.Grace_Period,
  // is_overtime_applicable: val.isOvertimeApplicable,
  entity_id: this.entity_id,
  financial_year_id: this.financial_id,
};

    this.$shiftService.createShiftList(data, this.entity_id).subscribe(
      (res: any) => {
        if (res.message === 'Shift Name is Already Exits!') {
          //this.toast.warning('Shift Name is Already Exits!');
        } else {
          this.toast.success('Shift added successfully!');
          // this.route.navigate([
          //   'master/itticket/configurational-master/department',
          // ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err: any) => {
        if (err.status == 400) {
          this.toast.error('Something went wrong!');
        } else if (err.status == 201) {
          this.toast.error('Shift name already exits!');
        } else {
          this.toast.error('Shift name already exisiting!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.shiftForm.controls).forEach((key) => {
      this.shiftForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.shiftForm.invalid) {
      Object.keys(this.shiftForm.controls).forEach(field => {
      const control = this.shiftForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
      return;
    }
    let val = this.shiftForm.value;

    const formatTimeTo24Hour = (time: string) => {
      let [timeStr, modifier] = time.split(' ');
      let [hours, minutes] = timeStr.split(':');
      if (modifier === 'PM' && hours !== '12') {
        hours = String(parseInt(hours) + 12);
      }
      if (modifier === 'AM' && hours === '12') {
        hours = '00';
      }

      return `${hours}:${minutes}`;
    };


    const formattedStartTime = formatTimeTo24Hour(val.Start_Time);
    const formattedEndTime = formatTimeTo24Hour(val.end_Time);
    const data = {
  shift_name: val.shift_name,
  start_time: formattedStartTime,
  end_time: formattedEndTime,
  shift_duration: val.shift_Duration,
  grace_peroid: val.Grace_Period,
  // is_overtime_applicable: val.isOvertimeApplicable,
  financial_year_id: 1,
};
    this.$shiftService.updateShift(this.data.id, data).subscribe(
      (res: any) => {
        if (res.message == 'Shift Name is Already Exits!') {
          this.toast.warning('Shift name is already exits!');
        } else {
          this.toast.success('Shift updated successfully');
        }
        this.route.navigate([
          'master/itticket/configurational-master/department',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err: any) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('Allowance name is already exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  confirmDialog() {
    this.dialog.close(this.shiftForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  formatTime(timeString: string): string {
    const matches = timeString.match(/\d+/g);
    if (!matches) {
      throw new Error('Invalid time format');
    }
    const hourString = matches[0];
    const minuteString = matches[1] || '0';
    const hours = parseInt(hourString, 10);
    const minutes = parseInt(minuteString, 10);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return this.datePipe.transform(date, 'h:mm a')!;
  }
}
