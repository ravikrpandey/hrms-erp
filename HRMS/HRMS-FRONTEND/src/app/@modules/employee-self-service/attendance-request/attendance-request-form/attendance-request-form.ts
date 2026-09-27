
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
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
import { Subscription } from 'rxjs';

interface AttendancePair {
  inTime: string;
  outTime: string;
  inMode?: string;
  outMode?: string;
  job_type?: any;
}

@Component({
  selector: 'app-attendance-request-form',
  templateUrl: './attendance-request-form.html',
  styleUrls: ['./attendance-request-form.scss'],
})
export class AttendanceRequestForm implements OnInit, OnDestroy {
  inTime = '';
  outTime = '';
  dataList: any[] = [];


  selectedAttTime: any = null;
  AttedanceForm: FormGroup;
  dayName: string | null = null;
  date: any;
  employee_id: any;
  currentYear: number | null = null;
  currentMonth: number | null = null;
  currentdate: string | null = null;
  invalidOutTimes: boolean[] = [];
  entity_id: number | null = null;
  attTime: any;
  @ViewChild('timeInput') timeInput!: ElementRef;
  @ViewChild('timeOutTime') timeOutTime!: ElementRef;

  formattedTime = '';
  employeedata: any = [];
  job_type: any;
  entry_type: any;

  attendanceStatus = [
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
  attendancePairs: AttendancePair[] = [];
  private subs = new Subscription();

  constructor(

    private toaster: ToastrService,
    private hrmsService: HrServiceService,
    private route: Router,
    private services: AttendanceService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.dataList = [];
    this.punchData = [];

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

  ngOnInit(): void {
    this.getFormattedDateTime();
    this.entity_id = Number(localStorage.getItem('selectedEntityId')) || 0;

    // derive earliest IN / latest OUT from dataList (if present)
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
            (a: { hours: number; minutes: number }, b: { hours: number; minutes: number }) =>
              a.hours * 60 + a.minutes - (b.hours * 60 + b.minutes)
          )[0];
        this.inTime = formatToHHMM(earliestIn);
      }

      if (outTimes.length > 0) {
        const latestOut = outTimes
          .map(parseTime)
          .sort(
            (a: { hours: number; minutes: number }, b: { hours: number; minutes: number }) =>
              b.hours * 60 + b.minutes - (a.hours * 60 + a.minutes)
          )[0];
        this.outTime = formatToHHMM(latestOut);
      }
    }
    const today = new Date();
    this.dayName = today.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth() + 1;
    this.currentdate = today.toISOString().split('T')[0];
    // subscribe to selected employee
    const s1 = this.services.selectedEmployee$.subscribe((res: any) => {
      if (!res) return;
      this.employeedata = res;
      this.employee_id = this.employeedata.employee_id;
      this.job_type = this.employeedata.job_type;

      const today = new Date();
      this.dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      this.currentYear = today.getFullYear();
      this.currentMonth = today.getMonth() + 1;
      this.currentdate = today.toISOString().split('T')[0];
    });
    this.subs.add(s1);

    // subscribe to selected date
    const s2 = this.services.selectedDate$.subscribe((data: any) => {
      if (!data) return;
      this.selectedDate = data.formattedDate;
      this.selectedMonth = data.date;
      this.selectedAttTime = data.attTime;
    });
    this.subs.add(s2);

    // Build attendance pairs from punchData (pair IN & OUT sequentially)

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  selectedYear: number = new Date().getFullYear();
  selectedMonth: string | number = new Date().getMonth() + 1; // keep backward-compatible (1..12)
  selectedDate: Date | null = null;

  // keep your existing fields
  mainId: string | null = null;
  selectedEmployee: any;
  day: any = [];


  // month names used below
  private monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // handler for top datepicker
  onTopDateChange(date: Date | null) {
    if (!date) return;

    // save selectedDate
    this.selectedDate = date;


    this.selectedYear = date.getFullYear();

    const monthName = this.monthNames[date.getMonth()];
    this.selectedMonth = monthName;

    const yyyy = this.selectedYear;
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;


    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.attTime = `${formattedDate} ${hours}:${minutes}:${seconds}`;

    const monthIndex = this.monthNames.indexOf(monthName) + 1; // 1..12
    const finalFormattedDate = monthIndex <= 9 ? `${monthIndex}` : monthIndex.toString().padStart(2, '0');

    this.services.updateSelectedDate({
      formattedDate,           // "YYYY-MM-DD"
      date: finalFormattedDate,// month number as string (e.g. "03")
      attTime: this.attTime,
    });

    // optionally: fetch data for this date (mirrors openDialog behavior)
    const entity_id = localStorage.getItem('selectedEntityId');
    const financial_id = localStorage.getItem('financial_id');
    const employeeId = this.selectedEmployee ? this.selectedEmployee : (localStorage.getItem('EmpMainId') ?? null);

    const req = {
      att_date: formattedDate,
      entity_id,
      employee_id: employeeId,
      financial_year_id: financial_id,
    };

    // fetch attendance data for this date (your existing service)
    this.services.get_daily_Attendance_Data(req).subscribe((res) => {
      if (res) {
        // handle response — your existing openDialog had an empty 'if (res) {}' block.
        // If you want to open the dialog or populate UI, do that here.
        console.log('daily attendance data', res);
        this.punchData = res.data
        const inOut =
          this.punchData?.filter((d: any) => d.entry_type === 'IN' || d.entry_type === 'OUT') ?? [];
        this.attendancePairs = [];

        if (inOut.length > 0) {
          for (let i = 0; i < inOut.length; i += 2) {
            const inRaw = inOut[i]?.entry_type === 'IN' ? inOut[i] : null;
            const outRaw = inOut[i + 1]?.entry_type === 'OUT' ? inOut[i + 1] : null;
            const inTime = inRaw ? this.convertTo24HourWithSeconds(inRaw.att_checktime) : '';
            const outTime = outRaw ? this.convertTo24HourWithSeconds(outRaw.att_checktime) : '';

            this.attendancePairs.push({
              inTime,
              outTime,
              job_type: inOut[i]?.job_type,

              inMode: inRaw?.att_mode || '',
              outMode: outRaw?.att_mode || '',
            });
          }
        }

        if (this.attendancePairs.length === 0) {
          this.attendancePairs.push({
            inTime: '',
            outTime: '',
            inMode: 'MANUAL',
            outMode: 'MANUAL',
          });
        }
      }
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

  addMore(index: number) {
    const currentPair = this.attendancePairs[index];
    if (!currentPair.inTime && !currentPair.outTime) {
      this.toaster.warning('Please fill current row before adding a new one!');
      return;
    }
    const newPair: AttendancePair = {
      inTime: '',
      outTime: '',
      inMode: 'MANUAL',
      outMode: 'MANUAL',
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
    const [hours = '0', minutes = '0'] = time.split(':');
    return Number(hours) * 60 + Number(minutes);
  }

  convertTo24HourWithSeconds(time12h: string): string {
    if (!time12h) return '';
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes, seconds] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${(minutes ?? 0)
      .toString()
      .padStart(2, '0')}:${(seconds ?? 0).toString().padStart(2, '0')}`;
  }

  addAtTop() {
    const firstPair = this.attendancePairs[0];
    if (firstPair && !firstPair.inTime && !firstPair.outTime) {
      this.toaster.warning('Please fill the top row before adding another!');
      return;
    }

    const newPair: AttendancePair = {
      inTime: '',
      outTime: '',
      inMode: 'MANUAL',
      outMode: 'MANUAL',
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
      console.log(this.attendancePairs)
      const employeeId = this.selectedEmployee ? this.selectedEmployee : (localStorage.getItem('EmpMainId') ?? null);
      this.attendancePairs.forEach(pair => {
        const att_date: any = this.selectedDate ?? this.currentdate;

        const att_day = new Date(att_date).toLocaleDateString('en-US', { weekday: 'long' });
        const baseData = {
          att_date,
          att_day, // <-- now dynamically computed from att_date
          att_month: this.selectedMonth ?? this.currentMonth,
          att_year: this.currentYear,
          employee_id: employeeId,
          entity_id: this.entity_id,
          job_type: pair?.job_type
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
      let entity_id = localStorage.getItem('selectedEntityId');

      let financial_id = localStorage.getItem('financial_id');
      // Submit to backend'
      let newpayload = {
        employee_id: employeeId,
        attendance_data: attendanceData,
        attendance_month: this.selectedMonth,
        selected_date: this.selectedDate,
        entity_id: entity_id,
        financial_id: financial_id
      }
      console.log(newpayload)

      this.services.createAttendance_request(newpayload).subscribe(
        (res: any) => {
          console.log(res, 'res')
          this.toaster.success(res.message);
          this.route.navigate(['/master/ess/attendance-request/attendance-request-list'])

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
  isBiometricPair(pair: any) {
    return pair?.inMode === 'BIOMETRIC' || pair?.outMode === 'BIOMETRIC';
  }

  goToList() {

    this.route.navigateByUrl('/master/ess/attendance-request/attendance-request-form');

  }
}
