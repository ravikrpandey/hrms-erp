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
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { A } from '@fullcalendar/core/internal-common';
@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './missattendance-dialog.component.html',
  styleUrls: ['./missattendance-dialog.component.scss'],
})
export class MissAttendanceDialogComponent implements OnInit {
  start_date: string = '';
  end_date: string = '';
  startDate: string = '';
  endDate: any = '';
  dataList: any = [];

  AttedanceForm: FormGroup;
  dayName: any;
  date: any;
  employee_id: any;
  entity_id: any;
  @ViewChild('timeInput') timeInput!: ElementRef;
  @ViewChild('timeendDate') timeendDate!: ElementRef;

  formattedTime: string = '';
  employeedata: any = [];
  job_type: any;
  entry_type: any;

  constructor(
    public dialog: MatDialogRef<MissAttendanceDialogComponent>,
    private toaster: ToastrService,
    private hrmsService: HrServiceService,
    private route: Router,
    private services: AttendanceService,
    private location: Location,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataList = this.data?.data?.details;
  }

  ngOnInit(): void {
    this.entity_id = Number(localStorage.getItem('selectedEntityId')) || 0;
    this.services.selectedEmployee$.subscribe((res: any) => {
      this.employeedata = res;
      this.employee_id = this.employeedata.employee_id;
    });
  }

  onSubmit2() {
    if (!this.startDate && !this.endDate) {
      this.toaster.error('Please Start Date and End date Both');
      return;
    }
    try {
      const start = new Date(this.startDate);
      start.setDate(start.getDate() + 1);

      const end = new Date(this.endDate);
      end.setDate(end.getDate() + 1);

      const formattedStartDate = start.toISOString().split('T')[0];
      const formattedEndDate = end.toISOString().split('T')[0];

      const attendanceData: any = {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      };

      this.hrmsService.Mark_Missing_Attendance(attendanceData).subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.dialog.close();
            this.route
              .navigateByUrl('/master/hrms/attendance-calendar', {
                skipLocationChange: true,
              })
              .then(() => {
                this.route.navigate(['/master/hrms/attendance-calendar']);
              });
          } else {
            this.toaster.success(`${'Attendance Marked Successfully.'}`);
          }
        },
        (err: any) => {
          console.error('Error updating attendance:', err);
          this.toaster.success(`${'Attendance Marked Successfully.'}`);
        }
      );
    } catch (error) {
      console.error('Unexpected Error:', error);
      this.toaster.error(
        'An unexpected error occurred. Please contact support.'
      );
    }
  }

  onStartDateChange() {
    if (this.endDate && this.startDate && this.startDate > this.endDate) {
      this.endDate = null; 
    }
  }
}
