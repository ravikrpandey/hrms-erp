import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
// import { GrievanceDialogComponent } from '../grievance-dialog/grievance-dialog.component';
// import { ActionComponent } from './action/action.component';
@Component({
  selector: 'app-varification-list',
  templateUrl: './varification-list.component.html',
  styleUrls: ['./varification-list.component.scss']
})
export class CandidateProfileComponent1 implements OnInit {

  private gridApi!: GridApi<any>;
  rowData: any;
  rowData2: any;
  rowData1: any;
  personalIdData: any;
  propertyManager: any
  text: any;
  firstLastName: any;
  rowClass: any;
  loginUser: any;

  constructor(private emp_master: EmpMasterService,
    private empService: EmpRegistrationService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

    // this.empService.grtEmployeeList().subscribe((res:any)=>{
    //   this.rowData1 = res.data;
    //   // 
    // })
    this.emp_master.getList().subscribe((res: any) => {
      this.rowData = res.data;
      // this.propertyManager = Array.from(this.rowData, (a: any) => `${a.registered_users[0]}`);
      // this.rowData1 = this.rowData[0].registered_users;

      // // this.rowData = this.rowData2.push(this.rowData1);
      // 

    })

    let entity_id = localStorage.getItem("selectedEntityId");
    this.empService.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
      this.personalIdData = res.data;
      // this.reportingManager = JSON.parse(res.data.reporting_manager);
      this.propertyManager = Array.from(this.personalIdData, (a: any) => `${a.title} ${a.first_name} ${a.last_name}`);
      this.firstLastName = Array.from(this.personalIdData, (a: any) => `${a.first_name}`);
      this.text = this.firstLastName.toString();

    })
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'employee_grievance_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered"
    },
    {
      headerName: 'Employee Name',
      field: 'registered_users',
      // valueGetter: (params:any) => 
      // params.data.registered_users[0].first_name,

      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueFormatter: 'registered_users[0].first_name',
      valueFormatter: 'value[0].first_name'
    },
    {
      headerName: 'Group Name',
      field: 'group_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered"
    },
    {
      headerName: 'Departmant Name',
      field: 'registered_users',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'value[0].department'
    },
    {
      headerName: 'Grievance Type',
      field: 'grievance_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Grievance Date',
      field: 'grievance_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Manager Name',
      field: 'reporting_manager',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Grievance Satus',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Subject',
      field: 'subject',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Action',
      field: 'emploee_id',
      // cellRenderer: ActionComponent,
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
  onGridReady(params: GridReadyEvent | any) {
    this.gridApi = params.api;


  }
  // onCellClicked(e:any){
  //   
  //   const dialogRef = this.dialog.open(GrievanceDialogComponent,{width:'400px',data:{id:e.data.employee_grievance_id}});
  //     dialogRef.afterClosed().subscribe(result => {
  //       
  //     })
  // }
}
