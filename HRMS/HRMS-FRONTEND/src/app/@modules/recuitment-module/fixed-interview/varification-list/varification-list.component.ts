import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ActionsComponent } from '../actions/actions.component';
import { FixedinterviewDialogComponent } from '../fixedinterview-dialog/fixedinterview-dialog.component';
import moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-varification-list',
  templateUrl: './varification-list.component.html',
  styleUrls: ['./varification-list.component.scss']
})
export class FixedInterviewComponent implements OnInit {

  private gridApi!: GridApi<any>;
  rowData: Candidate[] = [];
  rowData2: any;
  rowData1: any;
  personalIdData: any;
  propertyManager: any
  text: any;
  firstLastName: any;
  rowClass: any;
  assignAction:any;
  
  constructor(private emp_master: RecruitService,
    private empService: EmpRegistrationService,
    private _rbackService:RbacMasterService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    
    // this.empService.grtEmployeeList().subscribe((res:any)=>{
    //   this.rowData1 = res.data;
    //   // 
    // })
    this.emp_master.getAllfixedInterview().subscribe((res: any) => {
      this.rowData = res.result;
      // this.propertyManager = Array.from(this.rowData, (a: any) => `${a.registered_users[0]}`);
      // this.rowData1 = this.rowData[0].registered_users;
      
      // // this.rowData = this.rowData2.push(this.rowData1);
      // 

    })

    // this.empService.grtEmployeeList().subscribe((res: any) => {
    //   this.personalIdData = res.data;
    //   // this.reportingManager = JSON.parse(res.data.reporting_manager);
    //   this.propertyManager = Array.from(this.personalIdData, (a: any) => `${a.title} ${a.first_name} ${a.last_name}`);
    //   this.firstLastName = Array.from(this.personalIdData, (a: any) => `${a.first_name}`);
    //   this.text = this.firstLastName.toString();
    //   
    // })
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueGetter: 'node.rowIndex+1',
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
      valueFormatter: 'value[0].first_name',
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'E-mail Id',
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
      headerName: 'Round level',
      field: 'round_level',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Schedule Date & Time',
      valueGetter: function (params: any) {
      console.log('params',params);


        return params.data.schedule_interview_date === null && params.data.schedule_interview_time === null ? 'Not Schedule' : moment(params.data.schedule_interview_date).format('DD/MM/YYYY') + ", " + params.data.schedule_interview_time
      },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Action',
      field: 'employee_candidate_id',
      flex:1,
      minWidth:150,
      cellRenderer: ActionsComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }

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
  onCellClicked(e: any) {
    
    const dialogRef = this.dialog.open(FixedinterviewDialogComponent, { width: '500px', data: { id: e.data.candidate_id } });
    dialogRef.afterClosed().subscribe(result => {
      
    })
  }
}
export interface Candidate {
  candidate_id: number;
  condidate_name: string;
  email: string;
  mobile: string;
  assigned_hiring_manager: string;
  round_level: number;
  job_role: string;
  address: string;
  spoc_name: string;
}