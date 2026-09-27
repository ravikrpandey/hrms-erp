import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActionComponent } from 'src/app/@shared/action/action.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ProbationActionComponent } from '../probation-action/probation-action.component';
import { ProbationDialogComponent } from '../probation-dialog/probation-dialog.component';
// import { ActionComponent } from '../../../../../@shared/action/action.component';

@Component({
  selector: 'app-employe-probation',
  templateUrl: './employe-probation.component.html',
  styleUrls: ['./employe-probation.component.scss']
})
export class EmployeProbationComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi;
  rowData: any;
  title:any;
  emp:any;
  constructor(private _EmpMester: EmpMasterService,public dialog: MatDialog) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.rowData="No Data Found"
    this._EmpMester.EmployeeProbationList().subscribe((res: any) => {
      this.rowData = res.data;
      console.log("row data is ,",this.rowData)
      
      this.emp = Array.from(this.rowData, (a: any) => `${a.reporting_manager}`)
      // 
      // this.title = JSON.parse(res.data);
      // 
    })
  }

  jsonFormatter() {
    return JSON.stringify(this.emp);
  }

  columnDefs = [
    {
      headerName: 'S.No',
      field: 'i',
      autoHeaderHeight: true,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      filter: true,
      // valueFormatter: 'value[i]',
      valueGetter: 'node.rowIndex+1',
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Employee Name',
      field: 'first_name',
      autoHeaderHeight: true,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      filter: true,
      flex:1 ,
      minWidth:150,
    },
    {
      headerName: 'Reporting Manager',
      field: 'reporting_manager',
      autoHeaderHeight: true,
      sortable: true,
      resizable: true,
      //editable: true,
      wrapHeaderText: true,
      filter: true,
      valueFormatter: 'JSON.parse(value)',
      flex:1,
      minWidth:150, 
    },
    {
      headerName: 'Joining Date',
      field: 'date_of_joining',
      autoHeaderHeight: true,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      filter: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Probation Date',
      field: 'probation1',
      autoHeaderHeight: true,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      filter: true,
      flex:1,
      minWidth:150, 
      // valueGetter: function(params:any) {
      //   const value = params.node.data[params.colDef.headerName];
      //   return value === undefined ? 'NA' : value;
      // },
    },
    {
      headerName: 'Probation',
      field: 'probation',
      autoHeaderHeight: true,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      filter: true,
      flex:1,
      minWidth:150, 
    },
    {
      headerName: 'Action',
      field: 'status1',
      flex:1,
      minWidth:150,
      cellRenderer: ProbationActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: "grid-cell-centered"
    }
  ];

  // rowData = [
  //     { employeeName: 'Toyota', reportingManager: 'Celica', joiningDate: 35000,probationDate:'6-09-2080',Status:'abc' },
  //     { employeeName: 'scaes', reportingManager: 'slice', joiningDate: 5000,probationDate:'16-09-200',Status:'tatc' },
  //     { employeeName: 'rat', reportingManager: 'book', joiningDate: 7000,probationDate:'02-09-2005',Status:'cadc'  }
  // ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  // public paginationNumberFormatter: (
  //   params: PaginationNumberFormatterParams
  // ) => string = (params: PaginationNumberFormatterParams) => {
  //   return '[' + params.value.toLocaleString() + ']';
  // };


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
  onCellClicked(e:any){
    
    const dialogRef = this.dialog.open(ProbationDialogComponent,{width:'400px',data:{probationId:e.data.employee_id}});
      dialogRef.afterClosed().subscribe(result => {
        
      })
  }
}
