import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin,{ DateClickArg }  from '@fullcalendar/interaction';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from '../timesheet.service';
import { DialogeMyTimesheetComponent } from './dialoge-my-timesheet/dialoge-my-timesheet.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-my-timesheet',
  templateUrl: './my-timesheet.component.html',
  styleUrls: ['./my-timesheet.component.scss']
})
export class MyTimesheetComponent {
filterForm: FormGroup<any>;
months : any[]= [];
fromDate: string = '';
toDate: string = '';
totalHours: number = 0;
billableHours: number = 0;
nonBillableHours: number = 0;
timesheetData: any;
minDate: string = '';
maxDate: string = '';
mainEmpId: string | null;
  assignAction: any;

constructor(
  private toastr: ToastrService,
  private _rbackService:RbacMasterService,
  private fb: FormBuilder,
  private route: Router,
  private _timesheetService : TimesheetService,
  private dialog: MatDialog
){
  this.filterForm = this.fb.group({
    month_id: ['', Validators.required], 
    from_date: [null, Validators.required],
    to_date: [null, Validators.required],
  });
}
ngOnInit(): void {
  this.assignAction = this._rbackService.accessAssignAction();
  this.mainEmpId = localStorage.getItem('EmpMainId')
  this.getMonthList();
  this.getTimesheetDataById();

}
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    events: [],
    eventClick: (info) => this.onEventClick(info),
    dayCellClassNames: (arg) => {
      const date = arg.date;
      const dayOfWeek = date.getDay(); 
      if (dayOfWeek === 6) {
        return 'saturday'; 
      } else if (dayOfWeek === 0) {
        return 'sunday';
      }
      return ''; 
    },
    eventDidMount: (info) => {
      info.el.style.cursor = 'pointer'; 
    }
  };

 
  handleDateClick(arg: DateClickArg) {
    const dialogRef = this.dialog.open(DialogeMyTimesheetComponent, {
      width: '1000px',
      data: {
        type : 'date',
        date: arg.dateStr,
        id: this.mainEmpId,
      },
      panelClass: 'custom-dialog-container' 
    });
  }
  onEventClick(info: EventClickArg) {
    const dialogRef = this.dialog.open(DialogeMyTimesheetComponent, {
      width: '1000px',
      data: {
        title: info.event.title,
        date: info.event.startStr,
        id: info.event.id
      },
      panelClass: 'custom-dialog-container' 
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        console.log('User confirmed action:', result);
      } else {
        console.log('Dialog was closed without action.');
      }
    });
  }

  getTimesheetDataById(){
    this._timesheetService.getTimesheetsById(this.mainEmpId).subscribe((res:any)=>{
      this.timesheetData = res.data;
      const events = this.timesheetData.map((entry: any) => ({
        id: entry.id,
        title: `${entry.total_hour} Hr (${entry.timesheet_request_code})`,
        start: entry.timesheet_date,
        color: this.getEventColor(entry.timesheet_approval_status),
        textColor: 'white',
      }));
      this.calendarOptions.events = events;
    });
  }
  getEventColor(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return 'blue';
    }
  }
  getMonthList(){
    this._timesheetService.getMonthList().subscribe((res:any)=>{
      this.months = res.data;
    })
  }

  getFilteredHours() {
    Object.keys(this.filterForm.controls).forEach(key => {
      this.filterForm.controls[key].markAsTouched();
    });
    if (this.filterForm.invalid) {
      this.toastr.error('Please fill in all required fields!', 'Close');
      return;
    }
    const data = {
      month_id: this.filterForm.value.month_id,
      start_date: this.filterForm.value.from_date,
      end_date: this.filterForm.value.to_date
    };

    this._timesheetService.getTimesheetDataonMonth(this.mainEmpId,data).subscribe({
      next: (res: any) => {
        if (res) {
          this.totalHours = res.data.totalHours;
          this.billableHours = res.data.billable_total_hours;
          this.nonBillableHours = res.data.non_billable_total_hours;
          this.toastr.success('Total Hours fetched successfully!', 'Success');
        }
      },
      error: (err: any) => {
      this.totalHours = 0;
      this.billableHours = 0;
      this.nonBillableHours = 0;
        if (err.status === 404) {
          const errorMessage = err.error?.message;
          this.toastr.error(errorMessage, 'Not Found (404)');
        } else {
          const genericMessage = 'The selected month and date range must match. Please adjust your selection and try again.';
          this.toastr.error(genericMessage, 'Error');
        }
      }
    });
  }
  addTimesheet(path:any){
    this.route.navigate([path]);
  }
}
