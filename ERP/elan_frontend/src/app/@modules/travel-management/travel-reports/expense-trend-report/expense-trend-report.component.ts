import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-expense-trend-report',
  templateUrl: './expense-trend-report.component.html',
  styleUrls: ['./expense-trend-report.component.scss']
})
export class ExpenseTrendReportComponent {
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
  totalExpense: any;
  categoryBreakdownData: any;
  expenseTypeData: any;
  departmentData: any;
  

  constructor(
    private reportService : TravelRequestService,
    private toaster: ToastrService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.mainEmpId = localStorage.getItem('EmpMainId');
    
    this.getExpenseTrendReport();
  }
  onSelectionChange() {
    this.getExpenseTrendReport();
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

  getExpenseTrendReport() {
    const data = {
      month_id: this.selectedMonth,
      employee_id: this.selectedEmployee,
      financial_year_id: this.selectedYear,
      department_id: this.selectedDepartment,
      branch_id: this.selectedLocation,
      status: this.selectedStatus
    };
  
    this.reportService.getExpenseTrendReport(this.entity_id, data).subscribe({
      next: (res: any) => {
        if (res.data.expenseReimbursementReport.length > 0) {
          const expenseData = res.data.expenseReimbursementReport[0];

          this.animateCounting("total_expense", expenseData.total_expense || 0);
          this.animateCounting("reimbursement_amount", expenseData.reimbursement_amount || 0);
          this.departmentData = res.data.departmentExpenseReport;
          this.categoryBreakdownData = res.data.categoryExpenseReport;
          this.expenseTypeData = res.data.expenseTypeUsageReport;
        }
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.totalExpense = {};
          this.departmentData = [];
          this.expenseTypeData = [];
          this.categoryBreakdownData = [];
          this.toaster.error('No travel data found!.');
        } else {
          console.error('Error fetching report:', err);
          this.toaster.error('An error occurred while fetching the report.');
        }
      }
    });
  }
  
  animateCounting(field: keyof typeof this.totalExpense, targetValue: number) {
    if (!this.totalExpense) {
      this.totalExpense = {};
    }
  
    let current = 0;
    const increment = Math.ceil(targetValue / 90);
  
    const interval = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(interval);
      }
      this.totalExpense[field] = current;
    }, 10); 
  }
  
    
  // public columnDefs = [
  //   {
  //     headerName: 'S No',
  //     field: 'node.rowIndex+1',
  //     sortable: false,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 80,
  //     valueGetter: (params: any) => params.node.rowIndex + 1,
  //     tooltipValueGetter: (params: any) => `Serial Number: ${params.node.rowIndex + 1}`
  //   },
  //   {
  //     headerName: 'Total Travel Expenses',
  //     field: 'employee_codew',
  //     sortable: false,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 120,
  //     tooltipField: 'employee_code',
  //     cellStyle: () => {
  //       return { fontWeight: 'bold' };
  //     },
  //     cellRenderer: (params: any) => params.value ? params.value : 'N/A'
  //   },
  //   {
  //     headerName: 'Total Reimbursement Amount',
  //     field: 'travel_names',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 120,
  //     tooltipField: 'travel_name',
  //     cellRenderer: (params: any) => params.value ? params.value : 'N/A'
  //   },
  //   {
  //     headerName: 'Expense Category-wise Breakdown',
  //     field: 'departments',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 120,
  //     tooltipField: 'department',
  //     cellRenderer: (params: any) => params.value ? params.value : 'N/A'
  //   },
  //   {
  //     headerName: 'Top Spending Departments',
  //     field: 'travel_request_numberss',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 100,
  //     tooltipField: 'travel_request_number',
  //     cellRenderer: (params: any) => params.value ? params.value : 'N/A'
  //   },
  //   {
  //     headerName: 'Most Frequent Expense Types',
  //     field: 'travel_from_datee',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     flex: 1,
  //     minWidth: 100,
  //     tooltipField: 'travel_from_date',
  //     cellClass: "grid-cell-centered",
  //     cellRenderer: (params: any) => params.value ? params.value : 'N/A'
  //   },
  //   {
  //     headerName: 'Comparison with Previous Period',
  //     field: 'travel_to_dates',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     flex: 1,
  //     minWidth: 100,
  //     tooltipField: 'travel_to_date',
  //     cellClass: "grid-cell-centered",
  //     cellRenderer: (params: any) => params.value ? params.value : 'N/A'
  //   }
  // ];
  

  onFiltersUpdated(filters: any) {
    this.selectedMonth = filters.selectedMonth;
    this.selectedDepartment = filters.selectedDepartment;
    this.selectedEmployee = filters.selectedEmployee;
    this.selectedLocation = filters.selectedLocation;
    this.selectedYear = filters.selectedYear;
    this.selectedStatus = filters.selectedStatus;

    this.getExpenseTrendReport();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
