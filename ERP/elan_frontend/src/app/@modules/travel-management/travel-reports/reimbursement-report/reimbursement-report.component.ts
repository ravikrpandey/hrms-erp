import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-reimbursement-report',
  templateUrl: './reimbursement-report.component.html',
  styleUrls: ['./reimbursement-report.component.scss']
})
export class ReimbursementReportComponent {
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

  constructor(
    private reportService : TravelRequestService,
    private toaster: ToastrService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.getReimbursementReport();
  }
  onSelectionChange() {
    this.getReimbursementReport();
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

  getReimbursementReport() {
    const data = {
      month_id : this.selectedMonth,
      employee_id : this.selectedEmployee,
      financial_year_id : this.selectedYear,
      department_id: this.selectedDepartment,
      branch_id : this.selectedLocation,
      status : this.selectedStatus
    };

    this.reportService.getReimbursementReport(this.entity_id, data).subscribe({
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
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'department_name',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Expense ID',
      field: 'expense_request_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'expense_request_number',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Approved Expense Amount',
      field: 'total_approved_advance_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      tooltipField: 'total_approved_advance_amount',
      cellClass: "grid-cell-centered",
      cellRenderer: (params: any) => {
        if (params.value) {
          return new Intl.NumberFormat('en-IN').format(params.value);
        }
        return 'N/A';
      }
    },
    {
      headerName: 'Reimbursement Amount',
      field: 'total_reimbursement_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      tooltipField: 'total_reimbursement_amount',
      cellClass: "grid-cell-centered",
      cellRenderer: (params: any) => {
        if (params.value) {
          return new Intl.NumberFormat('en-IN').format(params.value);
        }
        return 'N/A';
      }
    },
    {
      headerName: 'Reimbursement Date',
      field: 'reimbursement_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'reimbursement_date',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Reimbursement Status',
      field: 'expense_final_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'expense_final_status',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    }
  ];
  

  onFiltersUpdated(filters: any) {
    this.selectedMonth = filters.selectedMonth;
    this.selectedDepartment = filters.selectedDepartment;
    this.selectedEmployee = filters.selectedEmployee;
    this.selectedLocation = filters.selectedLocation;
    this.selectedYear = filters.selectedYear;
    this.selectedStatus = filters.selectedStatus;

    this.getReimbursementReport();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
