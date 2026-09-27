import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-travel-expense-report',
  templateUrl: './travel-expense-report.component.html',
  styleUrls: ['./travel-expense-report.component.scss']
})
export class TravelExpenseReportComponent {
rowClass: any;
  private gridApi!: GridApi<any>;
  entity_id: string | null;
  mainEmpId: string | null;
  public rowData: any;
  gridOptions: GridOptions<any>;
  
  selectedDepartment: any;
  selectedMonth: any;
  selectedYear:any;
  selectedLocation: any;
  selectedEmployee:any;
  selectedStatus:any;
  selectedCategory:any;

  constructor(
    private reportService : TravelRequestService,
    private toaster: ToastrService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.getTravelExpenceReport();
  }
  onSelectionChange() {
    this.getTravelExpenceReport();
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

  getTravelExpenceReport() {
    const data = {
      month_id : this.selectedMonth,
      employee_id : this.selectedEmployee,
      financial_year_id : this.selectedYear,
      department_id: this.selectedDepartment,
      exp_category_id : this.selectedCategory,
      status : this.selectedStatus
    };

    this.reportService.getTravelExpenceReport(this.entity_id, data).subscribe({
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
      headerName: 'Employee ID',
      field: 'employee_code',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'employee_code',
      cellStyle: () => {
        return { fontWeight: 'bold' };
      },
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Employee Name',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'employee_name',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Designation',
      field: 'designation_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'designation_name',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Travel Destination',
      field: 'last_destination',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'last_destination',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Travel Dates (Start-End)',
      field: 'travel_dates',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'travel_dates',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Travel Purpose',
      field: 'travel_remarks',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      tooltipField: 'travel_remarks',
      cellClass: "grid-cell-centered",
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Expense Category',
      field: 'expense_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'expense_type',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Total Claimed Amount',
      field: 'claimed_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'claimed_amount',
      cellRenderer: (params: any) => {
        if (params.value) {
          return new Intl.NumberFormat('en-IN').format(params.value);
        }
        return '0';
      }
    },
      {
      headerName: 'Approved Amount',
      field: 'approved_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'approved_amount',
      cellRenderer: (params: any) => {
        if (params.value) {
          return new Intl.NumberFormat('en-IN').format(params.value);
        }
        return '0';
      }
    },
    {
      headerName: 'Pending Reimbursement',
      field: 'pending_reimbursement_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'pending_reimbursement_amount',
      cellRenderer: (params: any) => {
        if (params.value) {
          return new Intl.NumberFormat('en-IN').format(params.value);
        }
        return '0';
      }
    }
  ];
  

  onFiltersUpdated(filters: any) {
    this.selectedMonth = filters.selectedMonth;
    this.selectedDepartment = filters.selectedDepartment;
    this.selectedEmployee = filters.selectedEmployee;
    this.selectedLocation = filters.selectedLocation;
    this.selectedYear = filters.selectedYear;
    this.selectedStatus = filters.selectedStatus;
    this.selectedCategory = filters.selectedCategory;

    this.getTravelExpenceReport();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
