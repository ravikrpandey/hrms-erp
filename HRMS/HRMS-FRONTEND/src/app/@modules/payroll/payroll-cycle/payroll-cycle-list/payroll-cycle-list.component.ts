import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { PayrollCycleActionComponent } from '../payroll-cycle-action/payroll-cycle-action.component';
import moment from 'moment';
@Component({
  selector: 'app-payroll-cycle-list',
  templateUrl: './payroll-cycle-list.component.html',
  styleUrls: ['./payroll-cycle-list.component.scss']
})
export class PayrollCycleListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private payrollService:PayrollService,
    private toast:ToastrService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.getAllPayrollCycleData()
  }


  getAllPayrollCycleData(){
  this.payrollService.getAllPayrollCycle().subscribe((res:any) => {
    if(res && res.data){
      this.rowData = res.data
    }
  },err => {
    this.toast.error(err.error.message)
  })
}



  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Entity Name',
      field: 'entity_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'From Payroll Cycle',
      field: 'start_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueFormatter: function (params: any) {
      //   return params.value ? moment(params.value).format('DD/MM/YYYY') : '';
      // }
    },
    {
      headerName: 'To Payroll Cycle',
      field: 'end_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // valueFormatter: function (params: any) {
      //   return params.value ? moment(params.value).format('DD/MM/YYYY') : '';
      // }
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
   
    {
      headerName: 'Action',
      field: 'employee_id',
      flex: 1,
      minWidth: 120,
      cellRenderer: PayrollCycleActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'grid-cell-centered',
    },
  ];




  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }
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


  onCellClicked(e: any) {

  }
}
