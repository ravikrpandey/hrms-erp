import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { GrievanceDialogComponent } from '../grievance-dialog/grievance-dialog.component';
import { ActionComponent } from 'src/app/@shared/action/action.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import * as moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-grievance-list',
  templateUrl: './grievance-list.component.html',
  styleUrls: ['./grievance-list.component.scss']
})
export class GrievanceListComponent implements OnInit {

  private gridApi!: GridApi<any>;
  rowData: any;
  rowData2: any;
  rowData1: any;
  personalIdData: any;
  propertyManager: any
  text: any;
  firstLastName: any;
  rowClass: any;
  firstname: void;
  assignAction:any;
  
  constructor(private emp_master: EmpMasterService,
    private _empRegistration: EmpRegistrationService,
    private _rbackService:RbacMasterService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    
   
    this.emp_master.getList().subscribe((res: any) => {
      // this.rowData = res.data;
      // 
      
      
      this.modifyData(res.data);
    let resisterUser=res.data[0].registered_user;

      
      this.firstname=resisterUser.first_name;
      
      
      
    })
    // this._empRegistration.grtEmployeeList().subscribe((res: any) => {
    //   
    //   this.personalIdData = res.data;
    //   this.propertyManager = Array.from(this.personalIdData, (a: any) => `${a.first_name} ${a.last_name}`)
    //   
    //   
    //   
    // })

  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  resisterUser(resisterUser: any, arg1: string) {
    throw new Error('Method not implemented.');
  }

  modifyData(data:any){
    let modufyData:any = [];
    for(let i=0; i<data.length; i++){
      let val:any = {...data[i], 
        registered_user:data[i].registered_user?.first_name,
        registered_users:data[i].registered_user?.department,

        // date:moment(data[i].toDate).format('DD-MM-YYYY')
        
      }
// 

      // delete val.registered_users
      modufyData.push(val);      
    }
    
    this.rowData = modufyData;
    
    
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
      // minWidth:150,
    },
    {
      headerName: 'Employee Name',
      field: 'registered_user',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      // minWidth:150,
      
    },
    
    {
      headerName: 'Departmant Name',
      field: 'registered_users',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      // minWidth:150,
    },
    {
      headerName: 'Grievance Type',
      field: 'grievance_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      // minWidth:150,
    },
    {
      headerName: 'Grievance Date',
      field: 'grievance_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      // minWidth:150,
    },
    {
      headerName: 'Manager Name',
      field: 'reporting_manager',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      // minWidth:150,
    },
    {
      headerName: 'Grievance Satus',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      // minWidth:150,
    },
    {
      headerName: 'Subject',
      field: 'subject',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      // minWidth:150,
    },
    {
      headerName: 'Action',
      field: 'employee_grievance_id',
      flex:1.3,
      // minWidth:200,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }

  ];
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
    
    const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { grivanceViewId: e.data.employee_grievance_id } });
    dialogRef.afterClosed().subscribe(result => {
      
    })
  }
}