import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { VariableEarningActionComponent } from '../variable-earning-action/variable-earning-action.component';
import { VariableEarningToggleComponent } from '../variable-earning-toggle/variable-earning-toggle.component';

@Component({
  selector: 'app-variable-earning-allotment',
  templateUrl: './variable-earning-list.component.html',
  styleUrls: ['./variable-earning-list.component.scss']
})
export class VariableEarningListComponent {

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData:any=[];
 
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private payrollService: PayrollService,
    private toast: ToastrService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.getAllVariableAllotmentData()
  }


  getAllVariableAllotmentData() {
    this.payrollService.getAllVariableEarning().subscribe((res: any) => {
      if (res && res.data) {
        // Assuming res.data is an array of objects
        this.rowData = res.data
        console.log("var data----->>>", this.rowData);

      }
    }, err => {
      // this.toast.error(err.error.message);
    });
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
      headerName: 'Employee Name',
      valueGetter: (params: any) => {
        const user = params.data.HRMS_REGISTERED_USER;
        return user
          ? [user.first_name, user.middle_name, user.last_name]
            .filter(Boolean)
            .join(" ")
          : '';
      },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },

    {
      headerName: 'Credit Type',
      field: 'credit_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Approve Salary Percent',
      field: 'approve_salary_percentage',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Approve Salary Amount',
      field: 'approve_salary_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: VariableEarningToggleComponent,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 120,
      cellRenderer: VariableEarningActionComponent,
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
