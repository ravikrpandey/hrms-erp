import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { StateComponent } from 'src/app/@modules/dialog-popup-components/state-dialog-popup/state/state.component';
import { TimesheetService } from 'src/app/@modules/employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from 'src/app/@modules/project-management/services/project-management.service';

@Component({
  selector: 'app-dialog-calendar-event',
  templateUrl: './dialog-calendar-event.component.html',
  styleUrls: ['./dialog-calendar-event.component.scss']
})
export class DialogeCalendarEventComponent {
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
  attendanceData: any;
  Service: any;
dataList: any;
  entity_id: any;
   constructor(
     private dialog: MatDialogRef<StateComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public _fb: FormBuilder,
     public activeroute : ActivatedRoute,
     public toaster: ToastrService,
     public router: Router,
     public hrmsService :HrmServiceService,
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
      this.entity_id = localStorage.getItem("selectedEntityId");
     this.isOpenDialog = this.dialog?.componentInstance?.data?.isOpenDialog
     if(dialogeData.type){
       this.emp_id = dialogeData?.id;
       this.getAttendanceDataByEmpIdAndDate()
     }else{
       this.getAttendanceDataByEmpIdAndDate()
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
   getAttendanceDataByEmpIdAndDate(){
     this.hrmsService.getAttendanceDataByEmpIdAndDate(this.mainEmpId,this.date,this.entity_id).subscribe((res:any)=>{
       this.attendanceData = res.data[0].in_out_details;
       console.log(this.attendanceData,"freggudgddhfg");
   
       })
     }
   }
 

