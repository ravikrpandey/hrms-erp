import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from '../../timesheet.service';

@Component({
  selector: 'app-create-timesheet',
  templateUrl: './create-timesheet.component.html',
  styleUrls: ['./create-timesheet.component.scss']
})
export class CreateTimesheetComponent {
  timesheetForm: FormGroup<any>;
  projects : any[]=[]; 
  tasks: any[]=[];
  availableTasks: { id: number; task_name: string }[] = [];
  type:any;
view: any;
  mainEmpId: string | null;
  totalHours: number;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private cdr: ChangeDetectorRef,
    private _timesheetService : TimesheetService
  ){
    this.timesheetForm = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required], 
      project_name: ['', Validators.required],
      task_name: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      total_hours: [{ value: '', disabled: true }],
      billable: [false],
      non_billable: [false],
      remarks: ['']
    })
  }
  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.timesheetForm.get('project_name')?.valueChanges.subscribe((projectId: number) => {
      this.updateAvailableTasks(projectId);
    });
    this.timesheetForm.valueChanges.subscribe(() => {
      this.calculateTotalHours();
    });
    this.getProjectsList();
  }
  getProjectsList(){
    this._timesheetService.getProjectList(this.mainEmpId).subscribe((res:any)=>{
      console.log(res)
      this.projects = res.data;
    })
  }
  onProjectChange(event: any) {
    const selectedProjectId = event.value;
    this.getProjectTaskList(selectedProjectId)
    this.timesheetForm.controls['task_name'].setValue('');
  }
  getProjectTaskList(projectId: any) {
    this._timesheetService.getProjectTaskList(projectId,this.mainEmpId).subscribe(
      (res: any) => {
        console.log(res);
        this.availableTasks = res.data || [];
        this.timesheetForm.controls['task_name'].setValue('');
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }
  updateAvailableTasks(projectId: number) {
    this._timesheetService.getProjectTaskList(projectId,this.mainEmpId).subscribe((res:any)=>{
      console.log(res)
      this.tasks = res.data
      this.availableTasks = this.tasks[projectId] || [];
    })
    this.timesheetForm.get('task_name')?.reset(); 
  }
  calculateTotalHours() {
    const startTime = this.timesheetForm.controls['start_time'].value;
    const endTime = this.timesheetForm.controls['end_time'].value;
  
    if (startTime && endTime) {
      const start = moment(startTime, 'HH:mm A');
      const end = moment(endTime, 'HH:mm A');
      const diff = moment.duration(end.diff(start));
      this.totalHours = diff.asHours();
  
      this.timesheetForm.controls['total_hours'].setValue(
        this.totalHours > 0 ? this.totalHours.toFixed(2) : '0',
        { emitEvent: false } 
      );
    }
  }
  toggleBillable(field: string) {
    if (field === 'billable') {
      this.timesheetForm.controls['non_billable'].setValue(false);
    } else if (field === 'non_billable') {
      this.timesheetForm.controls['billable'].setValue(false);
    }
  }
  backBtn(){
    this.route.navigate(['master/ess/timesheet/my-timesheet'])
  }
  onSubmit() {
    Object.keys(this.timesheetForm.controls).forEach(key => {
      this.timesheetForm.controls[key].markAsTouched();
    });
    if (this.timesheetForm.invalid) {
      this.toast.error('Please fill in all required fields!', 'Close');
      return;
    }
    const timesheetType =
    this.timesheetForm.value.billable ? 'BILLABLE' : 'NON-BILLABLE';
    const data = {
      employee_id: this.mainEmpId,
      project_id: this.timesheetForm.value.project_name,
      task_id: this.timesheetForm.value.task_name,
      timesheet_date: this.timesheetForm.value.date,
      start_time: this.timesheetForm.value.start_time,
      end_time: this.timesheetForm.value.end_time,
      total_hour :this.totalHours,
      timesheet_type: timesheetType, 
      remarks : this.timesheetForm.value.remarks
    }
    if (this.timesheetForm.valid) {
      console.log('Form Submitted:', data);
      this._timesheetService.createTimesheet(data).subscribe({
        next: (response) => {
          this.toast.success('Timesheet Submitted Successfully!');
          this.route.navigate(['master/ess/timesheet/my-timesheet'])
        },
        error: (error) => {
          this.toast.error('Failed to submit the Timesheet. Please try again.');
          console.error(error);
        },
      });
    }
  }
}
