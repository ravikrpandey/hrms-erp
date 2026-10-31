import { Component, HostListener, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from 'ag-grid-community';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expense-report',
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.scss']
})
export class ExpenseReportComponent implements OnInit {
  gridApi!: GridApi;
  loading: boolean = false;

  summary: any = {
    allocated_budget: 0,
    total_actual_expenditure: 0,
    total_labor_cost: 0,
    total_expense_cost: 0,
    available_budget: 0,
    budget_utilization_pct: 0,
    total_logged_hours: 0,
    currency: 'INR',
    transaction_count: 0
  };

  transactions: any[] = [];
  projects: any[] = [];
  employees: any[] = [];

  // Filters
  selectedProjectId: any = 'all';
  selectedSourceType: string = 'ALL';
  selectedEmployeeId: any = 'all';
  startDate: string = '';
  endDate: string = '';
  searchTerm: string = '';

  // Drilldown modal
  showDrilldown: boolean = false;
  selectedTransaction: any = null;

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    suppressMovable: true,
    minWidth: 90
  };

  columnDefs: ColDef[] = [
    {
      headerName: 'Date',
      field: 'transaction_date',
      minWidth: 105,
      maxWidth: 125,
      flex: 0.8,
      valueFormatter: (params) => {
        if (!params.value) return '-';
        const d = new Date(params.value);
        return isNaN(d.getTime()) ? params.value : d.toLocaleDateString('en-GB');
      }
    },
    {
      headerName: 'Project',
      field: 'project_name',
      minWidth: 160,
      flex: 1.4,
      cellRenderer: (params: any) => {
        return `<span style="font-weight: 500; color: #1a73e8;">${params.value || '-'}</span>`;
      }
    },
    {
      headerName: 'Cost Type',
      field: 'source_type',
      minWidth: 135,
      maxWidth: 160,
      flex: 0.9,
      cellRenderer: (params: any) => {
        if (params.value === 'TIMESHEET_LABOR') {
          return '<span class="badge-source badge-labor"><i class="fas fa-clock"></i> Labor Cost</span>';
        } else if (params.value === 'PROJECT_EXPENSE') {
          return '<span class="badge-source badge-expense"><i class="fas fa-receipt"></i> Direct Expense</span>';
        }
        return `<span class="badge-source badge-adj">${params.value || '-'}</span>`;
      }
    },
    {
      headerName: 'Reference / Item',
      field: 'source_reference_name',
      minWidth: 180,
      flex: 1.8,
      valueGetter: (params) => {
        return params.data.source_reference_name || params.data.task_name || `Ref #${params.data.source_reference_id}`;
      }
    },
    {
      headerName: 'Team Member',
      field: 'employee_name',
      minWidth: 130,
      flex: 1.1
    },
    {
      headerName: 'Hours',
      field: 'hours',
      minWidth: 90,
      maxWidth: 110,
      flex: 0.7,
      valueFormatter: (params) => {
        const val = parseFloat(params.value);
        return val > 0 ? `${val.toFixed(2)} hrs` : '-';
      }
    },
    {
      headerName: 'Cost Rate',
      field: 'applied_rate',
      minWidth: 110,
      maxWidth: 130,
      flex: 0.8,
      valueFormatter: (params) => {
        if (params.value === null || params.value === undefined || params.value === '') return '-';
        const val = parseFloat(params.value);
        return isNaN(val) ? '-' : `₹${val.toLocaleString('en-IN')}/hr`;
      }
    },
    {
      headerName: 'Total Cost',
      field: 'amount',
      minWidth: 125,
      maxWidth: 155,
      flex: 0.9,
      cellRenderer: (params: any) => {
        const val = parseFloat(params.value) || 0;
        const isNegative = val < 0;
        const formatted = Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const display = isNegative ? `-₹${formatted}` : `₹${formatted}`;
        const color = isNegative ? '#dc2626' : '#202124';
        return `<span style="font-weight: 600; color: ${color};">${display}</span>`;
      }
    },
    {
      headerName: 'Ledger Status',
      field: 'posting_status',
      minWidth: 125,
      maxWidth: 140,
      flex: 0.8,
      cellRenderer: (params: any) => {
        if (params.value === 'POSTED') {
          return '<span class="badge-status badge-posted">POSTED</span>';
        } else if (params.value === 'REVERSED') {
          return '<span class="badge-status badge-reversed">REVERSED</span>';
        }
        return `<span class="badge-status">${params.value}</span>`;
      }
    },
    {
      headerName: 'Audit Drill-Down',
      minWidth: 135,
      maxWidth: 150,
      flex: 0.9,
      cellRenderer: () => {
        return `<button type="button" class="btn-drilldown"><i class="fas fa-search-plus"></i> View Audit</button>`;
      },
      onCellClicked: (params) => {
        this.openDrilldown(params.data);
      }
    }
  ];

  constructor(
    private pmService: ProjectManagementService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();
    this.loadReport();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    setTimeout(() => {
      this.gridApi?.sizeColumnsToFit();
    }, 100);
  }

  onGridSizeChanged(params: GridSizeChangedEvent): void {
    params.api?.sizeColumnsToFit();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.gridApi?.sizeColumnsToFit();
  }

  loadDropdownData(): void {
    this.pmService.getAllProjects().subscribe({
      next: (res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          this.projects = res.data;
        }
      },
      error: () => {}
    });

    this.pmService.getEmployees().subscribe({
      next: (res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.employees = res.data;
        }
      },
      error: () => {}
    });
  }

  loadReport(): void {
    this.loading = true;
    const params: any = {
      project_id: this.selectedProjectId,
      source_type: this.selectedSourceType,
      employee_id: this.selectedEmployeeId,
      start_date: this.startDate,
      end_date: this.endDate,
      search: this.searchTerm
    };

    this.pmService.getExpenseReport(params).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.success) {
          this.summary = res.summary || this.summary;
          this.transactions = res.data || [];
          setTimeout(() => {
            this.gridApi?.sizeColumnsToFit();
          }, 50);
        } else {
          this.toast.error(res?.message || 'Failed to load expense report');
        }
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err?.error?.message || 'Error loading expense report');
      }
    });
  }

  onFilterChange(): void {
    this.loadReport();
  }

  clearFilters(): void {
    this.selectedProjectId = 'all';
    this.selectedSourceType = 'ALL';
    this.selectedEmployeeId = 'all';
    this.startDate = '';
    this.endDate = '';
    this.searchTerm = '';
    this.loadReport();
  }

  openDrilldown(transaction: any): void {
    this.selectedTransaction = transaction;
    this.showDrilldown = true;
  }

  closeDrilldown(): void {
    this.showDrilldown = false;
    this.selectedTransaction = null;
  }

  exportCsv(): void {
    const params: any = {
      project_id: this.selectedProjectId,
      source_type: this.selectedSourceType,
      employee_id: this.selectedEmployeeId,
      start_date: this.startDate,
      end_date: this.endDate
    };

    this.pmService.exportExpenseReport(params).subscribe({
      next: (res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          this.downloadCsvFile(res.data);
        } else {
          this.toast.info('No data available for export');
        }
      },
      error: () => {
        this.toast.error('Failed to export expense report');
      }
    });
  }

  private downloadCsvFile(data: any[]): void {
    if (!data.length) return;
    const headers = ['Transaction ID', 'Date', 'Project Name', 'Cost Type', 'Reference / Item', 'Employee', 'Hours', 'Rate (INR)', 'Amount (INR)', 'Ledger Status', 'Idempotency Key', 'Notes'];
    const rows = data.map(d => [
      d.transaction_id,
      d.transaction_date,
      `"${(d.project_name || '').replace(/"/g, '""')}"`,
      d.source_type,
      `"${(d.source_reference_name || d.task_name || '').replace(/"/g, '""')}"`,
      `"${(d.employee_name || '').replace(/"/g, '""')}"`,
      d.hours || 0,
      d.applied_rate || 0,
      d.amount || 0,
      d.posting_status,
      `"${(d.idempotency_key || '').replace(/"/g, '""')}"`,
      `"${(d.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Project_Expense_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.success('Expense report downloaded successfully');
  }

  formatCurrency(value: number): string {
    const val = parseFloat(String(value)) || 0;
    const isNegative = val < 0;
    const formatted = Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return isNegative ? `-₹${formatted}` : `₹${formatted}`;
  }
}
