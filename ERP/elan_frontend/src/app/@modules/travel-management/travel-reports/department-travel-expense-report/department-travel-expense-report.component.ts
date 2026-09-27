import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { DepartmentReportActionComponent } from './department-report-action/department-report-action.component';
import { DepartmentCityDialogeComponent } from './department-city-dialoge/department-city-dialoge.component';
import { MatDialog } from '@angular/material/dialog';
import { TopEmployeesDialogComponent } from './top-employees-dialog/top-employees-dialog.component';
import { TopEmployeesActionComponent } from './top-employees-action/top-employees-action.component';

@Component({
  selector: 'app-department-travel-expense-report',
  templateUrl: './department-travel-expense-report.component.html',
  styleUrls: ['./department-travel-expense-report.component.scss']
})
export class DepartmentTravelExpenseReportComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  entity_id: string | null;
  mainEmpId: string | null;
  public rowData: any;
  gridOptions: GridOptions<any>;
  
  selectedDepartment: any;
  selectedMonth: any;
  selectedYear:any;
  selectedYearID:any;
  selectedLocation: any;
  selectedEmployee:any;
  selectedStatus:any;

  constructor(
    private reportService : TravelRequestService,
    private toaster: ToastrService,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.getDepartmentTravelExpenceReport();
  }
  onSelectionChange() {
    this.getDepartmentTravelExpenceReport();
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

  getDepartmentTravelExpenceReport() {
    const data = {
      month_id : this.selectedMonth,
      employee_id : this.selectedEmployee,
      financial_year_id : this.selectedYearID,
      department_id: this.selectedDepartment,
      branch_id : this.selectedLocation,
      status : this.selectedStatus
    };

    this.reportService.getDepartmentTravelExpenceReport(this.entity_id, data).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.rowData = [];
          this.toaster.error('No travel data found!.');
        } else {
          console.error('Error fetching report:', err);
          this.toaster.error('An error occurred while fetching the report.');
        }
      }
    });
  }
  public columnDefs = [
    {
      headerName: 'S No',
      field: 'node.rowIndex+1',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
      valueGetter: (params: any) => params.node.rowIndex + 1,
      tooltipValueGetter: (params: any) => `Serial Number: ${params.node.rowIndex + 1}`
    },
    {
      headerName: 'Department ',
      field: 'department',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'department',
      cellStyle: () => {
        return { fontWeight: 'bold' };
      },
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Total Travel Requests',
      field: 'total_travel_requests',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'total_travel_requests',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Approved Travel Requests',
      field: 'approved_travel_requests',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'approved_travel_requests',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Approved Expense Amount',
      field: 'total_approved_expense_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'total_approved_expense_amount',
      cellRenderer: (params: any) => {
        if (params.value) {
          return new Intl.NumberFormat('en-IN').format(params.value);
        }
        return '0';
      }
    },
    {
      headerName: 'Pending Expenses',
      field: 'total_pending_expense_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'total_pending_expense_amount',
      cellRenderer: (params: any) => {
        if (params.value) {
          return new Intl.NumberFormat('en-IN').format(params.value);
        }
        return '0';
      }
    },
    {
      headerName: 'Top Spending Employees',
      field: 'department_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      cellClass: "grid-cell-centered",
      cellRenderer: TopEmployeesActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, 
      },
    },
    {
      headerName: 'Most Frequent Travel Destinations',
      field: 'department_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      cellClass: "grid-cell-centered",
      cellRenderer: DepartmentReportActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, 
      },
    }
  ];
  

  onFiltersUpdated(filters: any) {
    this.selectedMonth = filters.selectedMonth;
    this.selectedDepartment = filters.selectedDepartment;
    this.selectedEmployee = filters.selectedEmployee;
    this.selectedLocation = filters.selectedLocation;
    this.selectedYear = filters.selectedYear;
    this.selectedYearID = filters.selectedYearID;
    this.selectedStatus = filters.selectedStatus;

    this.getDepartmentTravelExpenceReport();
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
