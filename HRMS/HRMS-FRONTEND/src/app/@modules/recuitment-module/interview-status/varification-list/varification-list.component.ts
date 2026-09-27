import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { ActionDupComponent } from '../actions/actions.component';
import { ActionNotiComponent } from '../actionsNoti/actionsNoti.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { GrievanceDialogComponent } from '../grievance-dialog/grievance-dialog.component';
// import { ActionComponent } from './action/action.component';
@Component({
  selector: 'app-varification-list',
  templateUrl: './varification-list.component.html',
  styleUrls: ['./varification-list.component.scss']
})
export class InterviewStatusListComponent  implements OnInit {

  private gridApi!: GridApi<any>;
  rowData:any;
  rowData2:any;
  rowData1:any;
  personalIdData:any;
  propertyManager:any
  text:any;
  firstLastName:any;
  rowClass: any;
  assignAction:any;
  
  constructor(private emp_master:EmpMasterService, private recruitService: RecruitService,
    private empService : EmpRegistrationService,
    private _rbackService:RbacMasterService,
    public dialog: MatDialog) {
      this.rowClass = 'rowClass'
     }

  ngOnInit(): void {
    let finalShortListedCandidate:any = []
    this.recruitService.getAllfinalList().subscribe(
      (res: any) => {
        
        let c_Arr = res.data;
        this.rowData = c_Arr;
        
      }, (err: any) => {
        
      }
    )
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }
  public columnDefs = [
    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Candidate Name',
      field: 'condidate_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Email ID',
      field: 'email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Mobile Number',
      field: 'mobile',    
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'value[0].department',
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Job Designation',
      field: 'job_role',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Assigned Manager',
      field: 'assigned_hiring_manager',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'SPOC Name',
      field: 'spoc_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Location',
      field: 'address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Round Level',
      field: 'round_level',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Final Interview Status',
      field: 'final_interview_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Requisition Status',
      field: 'requisition_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Action',
      field: 'candidate_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellRenderer: ActionDupComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    // {
    //   headerName: 'Notification',
    //   field: 'candidate_id',
    //   flex:1,
    //   minWidth:150,
    //   cellRenderer: ActionNotiComponent,
    //   cellRendererParams: {
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false, 
    //   },
    // }

  ];

  // rowData = [
  //   {
  //     employee_name: 'nana',
  //     group_name: 'a',
  //     Departmant_Name: 'yes',
  //     Grievance_type: 'user',
  //     Grievance_date: '11-12-2020',
  //     Manager_Name: 'Roshni',
  //     Grievance_Satus: 'undefine',
  //   },
  //   {
  //     employee_name: 'harsh',
  //     group_name: 'b',
  //     Departmant_Name: 'mindz',
  //     Grievance_type: 'nor',
  //     Grievance_date: '11-12-2020',
  //     Manager_Name: 'harshdip',
  //     Grievance_Satus: 'null',
  //   },

  // ]


  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    

  }
  onCellClicked(e:any){
    
    const dialogRef = this.dialog.open(AppListDialogComponent,{width:'500px',data:{interview_id:e.data.candidate_id}});
      dialogRef.afterClosed().subscribe(result => {
        
      })
  }
}
