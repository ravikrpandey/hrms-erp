import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { ToastrService } from 'ngx-toastr';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin,{ DateClickArg } from '@fullcalendar/interaction';
import { DialogeMyTimesheetComponent } from 'src/app/@modules/employee-self-service/timesheet/my-timesheet/dialoge-my-timesheet/dialoge-my-timesheet.component';
import { TimesheetService } from 'src/app/@modules/employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from '../../services/project-management.service';
import { DialogeAllTimesheetComponent } from './dialoge-all-timesheet/dialoge-all-timesheet.component';

@Component({
  selector: 'app-all-timesheet',
  templateUrl: './all-timesheet.component.html',
  styleUrls: ['./all-timesheet.component.scss']
})
export class AllTimesheetComponent {
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
  employees: any;
  employee_id: any;
  employee_month_id: any;
  rawEmp: any;
  employeesList: any;
  
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: Router,
    private _timesheetService : TimesheetService,
    private dialog: MatDialog,
    private _projectService : ProjectManagementService
  ){
    this.filterForm = this.fb.group({
      employee_id : ['',Validators.required],
      employee_month_id : ['',Validators.required],
      month_id: ['', Validators.required], 
      from_date: [null, Validators.required],
      to_date: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.getMonthList();
    this.getTimesheetDataById();
    this.getEmployees();
  
    this.filterForm.get('employee_id')?.valueChanges.subscribe((employeeId) => {
      this.employee_id = employeeId;
  
      this.filterForm.get('employee_month_id')?.setValue(null);
  
      if (this.employee_id && this.employee_month_id) {
        this.getTimesheetDataById();
      }
    });

    this.filterForm.get('employee_month_id')?.valueChanges.subscribe((monthId) => {
      this.employee_month_id = monthId;
      if (this.employee_id && this.employee_month_id) {
        this.getTimesheetDataById();
      }
    });
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
  
    getEmployees() {
      this._projectService.getAllTeamMembersByManagerId(this.mainEmpId).subscribe(
        (response: any) => {
          if (response?.data?.length) {
            this.rawEmp = response.data;
            this.employeesList = response.data; 
            this.employees = response.data.map(
              (employee: any) => employee.employee_name 
            );
          }
        },
        (error) => {
          console.error('Error fetching employees:', error);
        }
      );
    }
    
    employeeSearch(filteredNames: any) {
      this.employeesList = this.rawEmp.filter((item: any) =>
        filteredNames.includes(item.employee_name)
      );
    }
    
  handleDateClick(arg: DateClickArg) {
    const dialogRef = this.dialog.open(DialogeAllTimesheetComponent, {
      width: '1000px',
      data: {
        type : 'date',
        date: arg.dateStr,
        id: this.employee_id,
      },
      panelClass: 'custom-dialog-container' 
    });
  }

    onEventClick(info: EventClickArg) {
      const dialogRef = this.dialog.open(DialogeAllTimesheetComponent, {
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
    getTimesheetDataById() {
      if (!this.employee_id || !this.employee_month_id) return;
      this._projectService
        .getTimesheetsByEmployeeIdAndMonth(this.employee_id, this.employee_month_id)
        .subscribe((res: any) => {
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
    
      this._timesheetService.getTimesheetDataonMonth(this.employee_id,data).subscribe({
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

}
