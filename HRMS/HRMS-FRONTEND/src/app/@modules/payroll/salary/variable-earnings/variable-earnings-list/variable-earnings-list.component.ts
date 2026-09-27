import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { VariableEarningsActionComponent } from '../variable-earnings-action/variable-earnings-action.component';

@Component({
  selector: 'app-variable-earnings-list',
  templateUrl: './variable-earnings-list.component.html',
  styleUrls: ['./variable-earnings-list.component.scss']
})
export class VariableEarningsListComponent {
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
    this.getAllEarningComponentList()
  }


  getAllEarningComponentList(){
  this.payrollService.getAllVariableEarningComponentList().subscribe((res:any) => {
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
      headerName: 'Variable Earning Name',
      field: 'variable_earning_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Calculation Amount',
      field: 'calculation_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'is_active',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: { value: number; }) => params.value == 1 ? 'Active' : 'Inactive'
    },
   
    {
      headerName: 'Action',
      field: 'employee_id',
      flex: 2,
      minWidth: 160,
      cellRenderer: VariableEarningsActionComponent,
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
