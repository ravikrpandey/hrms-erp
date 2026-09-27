import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StateComponent } from 'src/app/@modules/dialog-popup-components/state-dialog-popup/state/state.component';
import { ProjectManagementService } from 'src/app/@modules/project-management/services/project-management.service';
import { TimesheetService } from '../../timesheet.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-dialoge-my-timesheet',
  templateUrl: './dialoge-my-timesheet.component.html',
  styleUrls: ['./dialoge-my-timesheet.component.scss']
})
export class DialogeMyTimesheetComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  isOpenDialog: boolean = false;
  mainEmpId: string | null;
  timesheetForm: FormGroup<any>;
  timesheet_id: any;
  
  timesheetData: any;
  project_id: any;
  timesheet_approval_status: any;
  emp_id: any;
  date: any;
  constructor(
    private dialog: MatDialogRef<StateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _fb: FormBuilder,
    public activeroute : ActivatedRoute,
    public toaster: ToastrService,
    public router: Router,
    public _timesheetService :TimesheetService,
    public _projectService : ProjectManagementService
  ) {
    this.timesheetForm = this._fb.group({
      date: ['', Validators.required], 
      project_name: ['', Validators.required],
      task_name: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      timesheet_type: [''],
      total_hours: [''],
      timesheet_approval_status: [''],
      remarks: [''],
      manager_comment : ['',Validators.required],
      manager_comments : ['']
    })
  }

  ngOnInit(): void {
    const dialogeData = this.dialog?.componentInstance?.data;
    this.timesheet_id = dialogeData?.id;
    this.project_id = dialogeData?.project_id;
    this.date = dialogeData?.date;
    this.timesheet_approval_status = dialogeData?.timesheet_approval_status;

    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.isOpenDialog = this.dialog?.componentInstance?.data?.isOpenDialog
    if(dialogeData.type){
      this.emp_id = dialogeData?.id;
      this.getAllTimesheetsOnDate()
    }else{
      this.getTimesheetById()
    }
  }

  confirmDialog() {
    this.dialog.close(this.timesheetForm.value);
  }
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  public rowData: any[] = [];
  public columnDefs = [
    {
      headerName: 'Type',
      field: 'timesheet_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:100,
    },
    {
      headerName: 'Project Name',
      field: 'project_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:120,
    },
    {
      headerName: 'Task Name ',
      field: 'task_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Start Time',
      field: 'start_time',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:100,
    },
    {
      headerName: 'End Time',
      field: 'end_time',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:100,
    },
    {
      headerName: 'Status',
      field: 'timesheet_approval_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Manager Remarks',
      field: 'manager_comments',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:100,
      valueGetter: (params:any) => params.data.manager_comments || 'No Comments yet',
    },
  ];
  getTimesheetById(){
    this._projectService.getTimesheetById(this.timesheet_id).subscribe((res:any)=>{
      this.timesheetData = res.data;
      this.rowData = [res.data];
      this.timesheetForm.patchValue({
        date: this.timesheetData?.timesheet_date,
        start_time: this.timesheetData?.start_time,
        end_time : this.timesheetData?.end_time,
        project_name: this.timesheetData?.project_name,
        task_name : this.timesheetData?.task_name,
        timesheet_type : this.timesheetData?.timesheet_type,
        timesheet_approval_status: this.timesheetData?.timesheet_approval_status,
        remarks : this.timesheetData?.remarks,
        total_hours: this.timesheetData?.total_hour,
        manager_comments : this.timesheetData?.manager_comments
      })
    })
  }
  getAllTimesheetsOnDate(){
    this._timesheetService.getAllTimesheetsOnDate(this.emp_id,this.date).subscribe((res:any)=>{
      this.timesheetData = res.data;
      this.rowData= res.data;
      
      this.timesheetForm.patchValue({
        date: this.date,
        total_hours: res.totalHours,
      })
    })
  }
}
