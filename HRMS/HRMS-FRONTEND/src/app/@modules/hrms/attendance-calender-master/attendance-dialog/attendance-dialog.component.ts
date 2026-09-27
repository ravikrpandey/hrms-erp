import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrls: ['./attendance-dialog.component.scss'],
})
export class AttendanceDialogComponent implements OnInit {
  inTime: string = '';
  outTime: string = '';
  dataList: any = [];
  selectedDate: any;
  selectedMonth: any;
  selectedAttTime: any;
  AttedanceForm: FormGroup;
  dayName: any;
  date: any;
  employee_id: any;
  currentYear: any;
  currentMonth: any;
  currentdate: any;
  invalidOutTimes: boolean[] = [];
  entity_id: any;
  attTime: any;
  @ViewChild('timeInput') timeInput!: ElementRef;
  @ViewChild('timeOutTime') timeOutTime!: ElementRef;

  formattedTime: string = '';
  employeedata: any = [];
  job_type: any;
  entry_type: any;

  attendanceStatus: any = [
    { value: 'Present', color: '#28a745', code: 'P' },
    { value: 'Absent', color: '#dc3545', code: 'A' },
    { value: 'Paid Leave', color: '#007bff', code: 'PL' },
    { value: 'Unpaid Leave', color: '#fd7e14', code: 'UL' },
    { value: 'Default Absent', color: '#6c757d', code: 'DA' },
    { value: 'Default Present', color: '#d4edda', code: 'DP' },
    { value: 'Half Day', color: '#ffc107', code: 'HD' },
    { value: 'Holiday', color: '#dd4bf5', code: 'H' },
    { value: 'Paid HalfDay Leave', color: '#cce5ff', code: 'PHL' },
    { value: 'Unpaid HalfDay Leave', color: '#ffe5b4', code: 'UHL' },
  ];

  punchData: any;
  attendancePairs: {
    inTime: string;
    outTime: string;
    inMode?: string;
    outMode?: string;
  }[] = [];

  constructor(
    public dialog: MatDialogRef<AttendanceDialogComponent>,
    private toaster: ToastrService,
    private hrmsService: HrServiceService,
    private route: Router,
    private services: AttendanceService,
    private location: Location,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataList = this.data?.data?.details;
    this.punchData = this.data.punchData;

    this.AttedanceForm = this.fb.group({
      att_day: [''],
      att_month: [''],
      att_year: [''],
      att_date: [''],
      att_checktime: [''],
      att_time: [''],
      entry_type: [''],
      employee_id: [''],
      entity_id: [''],
      job_type: [''],
    });
  }

  getFormattedDateTime() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    this.attTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  ngOnInit(): void {
  this.getFormattedDateTime();
  this.entity_id = Number(localStorage.getItem('selectedEntityId')) || 0;

  if (this.dataList && this.dataList.length > 0) {
    const inTimes = this.dataList
      .filter((item: any) => item.entry_type === 'IN')
      .map((item: any) => item.att_checktime);

    const outTimes = this.dataList
      .filter((item: any) => item.entry_type === 'OUT')
      .map((item: any) => item.att_checktime);

    const parseTime = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes, seconds] = time.split(':').map(Number);
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return { hours, minutes };
    };

    const formatToHHMM = (parsed: { hours: number; minutes: number }) =>
      `${parsed.hours.toString().padStart(2, '0')}:${parsed.minutes
        .toString()
        .padStart(2, '0')}`;

    if (inTimes.length > 0) {
      const earliestIn = inTimes
        .map(parseTime)
        .sort(
          (a: { hours: number; minutes: number; }, b: { hours: number; minutes: number; }) =>
            a.hours * 60 + a.minutes - (b.hours * 60 + b.minutes)
        )[0];
      this.inTime = formatToHHMM(earliestIn);
    }

    if (outTimes.length > 0) {
      const latestOut = outTimes
        .map(parseTime)
        .sort(
          (a: { hours: number; minutes: number; }, b: { hours: number; minutes: number; }) =>
            b.hours * 60 + b.minutes - (a.hours * 60 + a.minutes)
        )[0];
      this.outTime = formatToHHMM(latestOut);
    }
  }

  this.services.selectedEmployee$.subscribe((res: any) => {
    this.employeedata = res;
    this.employee_id = this.employeedata.employee_id;
    this.job_type = this.employeedata.job_type;

    const today = new Date();
    this.dayName = today.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth() + 1;
    this.currentdate = today.toISOString().split('T')[0];
  });

  this.services.selectedDate$.subscribe((data: any) => {
    this.selectedDate = data.formattedDate;
    this.selectedMonth = data.date;
    this.selectedAttTime = data.attTime;
  });

  // Initialize attendance pairs from punch data
  const inOut =
    this.punchData?.filter(
      (d: { entry_type: string }) =>
        d.entry_type === 'IN' || d.entry_type === 'OUT'
    ) || [];
  this.attendancePairs = [];

  if (inOut.length > 0) {
    for (let i = 0; i < inOut.length; i += 2) {
      const inRaw = inOut[i]?.entry_type === 'IN' ? inOut[i] : null;
      const outRaw = inOut[i + 1]?.entry_type === 'OUT' ? inOut[i + 1] : null;

      const inTime = inRaw
        ? this.convertTo24HourWithSeconds(inRaw.att_checktime)
        : '';
      const outTime = outRaw
        ? this.convertTo24HourWithSeconds(outRaw.att_checktime)
        : '';

      this.attendancePairs.push({
        inTime,
        outTime,
        inMode: inRaw?.att_mode || '',
        outMode: outRaw?.att_mode || '',
      });
    }
  }

  // If no data, ensure at least one blank row
  if (this.attendancePairs.length === 0) {
    this.attendancePairs.push({
      inTime: '',
      outTime: '',
      inMode: 'MANUAL',
      outMode: 'MANUAL',
    });
  }
}


  addMore(index: number) {
    const currentPair = this.attendancePairs[index];
    if (!currentPair.inTime && !currentPair.outTime) {
      this.toaster.warning('Please fill current row before adding a new one!');
      return;
    }
    const newPair = {
      inTime: '',
      outTime: '',
      inMode: 'MANUAL',
      outMode: 'MANUAL'
    };
    this.attendancePairs.splice(index + 1, 0, newPair);
  }

  deleteRow(index: number) {
    if (this.attendancePairs.length > 1) {
      this.attendancePairs.splice(index, 1);
    }
  }

  validateOutTime(index: number): void {
    const pair = this.attendancePairs[index];
    if (pair.inTime && pair.outTime) {
      const inTime = this.convertTimeToMinutes(pair.inTime);
      const outTime = this.convertTimeToMinutes(pair.outTime);

      if (outTime < inTime) {
        this.invalidOutTimes[index] = true;
        this.toaster.error('OUT time can not be before IN time!');
        this.attendancePairs[index].outTime = '';
      } else {
        this.invalidOutTimes[index] = false;
      }
    }
  }

  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  convertTo24HourWithSeconds(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes, seconds] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  addAtTop() {
  // Check if the first row is empty
  const firstPair = this.attendancePairs[0];
  if (firstPair && !firstPair.inTime && !firstPair.outTime) {
    this.toaster.warning('Please fill the top row before adding another!');
    return;
  }

  const newPair = {
    inTime: '',
    outTime: '',
    inMode: 'MANUAL',
    outMode: 'MANUAL'
  };
  this.attendancePairs.unshift(newPair);
}


 onSubmit2() {
  // Validate that all rows have both inTime and outTime
  const hasIncompleteRow = this.attendancePairs.some(pair => !pair.inTime || !pair.outTime);
  if (this.attendancePairs.length === 0 || hasIncompleteRow) {
    this.toaster.error('Please provide both IN time and OUT time for all rows!');
    return;
  }

  try {
    const formatTime = (dateStr: string, timeStr: string) => {
      const [hourRaw, minuteRaw, secondRaw] = timeStr.split(':');
      const hour = hourRaw.padStart(2, '0');
      const minute = minuteRaw.padStart(2, '0');
      const second = (secondRaw || '00').padStart(2, '0');

      const date = new Date(`${dateStr}T${hour}:${minute}:${second}`);

      // 12-hour time with AM/PM
      const checkHours = date.getHours();
      const amPm = checkHours >= 12 ? 'PM' : 'AM';
      const hours12 = (checkHours % 12 || 12).toString().padStart(2, '0');
      const att_checktime = `${hours12}:${minute}:${second} ${amPm}`;

      // 24-hour time
      const hours24 = checkHours.toString().padStart(2, '0');
      const att_time = `${dateStr} ${hours24}:${minute}:${second}`;

      return { att_checktime, att_time };
    };

    const attendanceData: any[] = [];

    this.attendancePairs.forEach(pair => {
  const att_date = this.selectedDate ?? this.currentdate;

  const att_day = new Date(att_date).toLocaleDateString('en-US', { weekday: 'long' });

  const baseData = {
    att_date,
    att_day, // <-- now dynamically computed from att_date
    att_month: this.selectedMonth ?? this.currentMonth,
    att_year: this.currentYear,
    employee_id: this.employee_id,
    entity_id: this.entity_id,
    job_type: this.job_type
  };

  // ...rest remains the same


      if (pair.inTime) {
        const { att_checktime, att_time } = formatTime(att_date, pair.inTime);
        attendanceData.push({
          ...baseData,
          att_checktime,
          att_time,
          entry_type: 'IN',
          att_mode: pair.inMode || 'MANUAL'
        });
      }

      if (pair.outTime) {
        const { att_checktime, att_time } = formatTime(att_date, pair.outTime);
        attendanceData.push({
          ...baseData,
          att_checktime,
          att_time,
          entry_type: 'OUT',
          att_mode: pair.outMode || 'MANUAL'
        });
      }
    });

    // Submit to backend
    this.hrmsService.updateAttendanceStatus(attendanceData).subscribe(
      (res: any) => {
        this.dialog.close();
        if (res.code === 200) {
          this.route.navigateByUrl('/master/hrms/attendance-calendar', { skipLocationChange: true })
            .then(() => this.route.navigate(['/master/hrms/attendance-calendar']));
        } else {
          this.toaster.success(`${res.message || 'Unexpected response received.'}`);
          this.route.navigateByUrl('/master/hrms/attendance-calendar', { skipLocationChange: true })
            .then(() => this.route.navigate(['/master/hrms/attendance-calendar']));
        }
      },
      (err: any) => {
        console.error('Error updating attendance:', err);
        this.toaster.error(`${err.error?.message || 'Failed to update attendance. Please try again!'}`);
      }
    );

  } catch (error) {
    console.error('Unexpected Error:', error);
    this.toaster.error('An unexpected error occurred. Please contact support.');
  }
}



}
