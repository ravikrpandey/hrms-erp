import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { ExpenseDetailDialogComponent } from '../expense-detail-dialog/expense-detail-dialog.component';
import { ExpenseRejectDialogComponent } from '../expense-reject-dialog/expense-reject-dialog.component';
import { ExpenseActionCellComponent } from '../expense-action-cell/expense-action-cell.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  activeTab: 'my_expenses' | 'pending' | 'approved' | 'rejected' = 'my_expenses';
  expenses: any[] = [];
  loading: boolean = false;

  counts = {
    my_expenses: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  userRoleInfo: any = null;
  canViewAllTabs: boolean = false;
  isPM: boolean = false;
  isFinance: boolean = false;
  isAdmin: boolean = false;

  searchTerm: string = '';
  selectedProjectId: any = 'All';
  selectedCategory: string = 'All';
  projects: any[] = [];
  categories: any[] = [];

  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  currentPage: number = 1;

  gridApi!: GridApi;
  rowClass: string = 'rowClass';
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 100
  };

  gridOptions: any = {
    rowSelection: 'single',
    enableCellTextSelection: true,
    rowHeight: 52,
    headerHeight: 42,
    suppressCellFocus: true,
    suppressHorizontalScroll: true,
    overlayLoadingTemplate: '<span class="ag-overlay-loading-center"><i class="fa fa-spinner fa-spin fa-2x mb-2 text-primary"></i><br>Loading expenses...</span>',
    overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No expenses recorded</span>'
  };

  constructor(
    private expenseService: ExpenseService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupColumnDefs();
    this.loadUserRoleInfo();
    this.loadFilterOptions();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  loadUserRoleInfo(): void {
    this.expenseService.getUserRoleInfo().subscribe({
      next: (res: any) => {
        this.userRoleInfo = res.data;
        this.isPM = !!res.data.isProjectManager;
        this.isFinance = !!res.data.isFinanceApprover;
        this.isAdmin = !!res.data.isAdmin;
        this.canViewAllTabs = this.isPM || this.isFinance || this.isAdmin;
        this.setupColumnDefs();
        this.loadExpenses();
      },
      error: (err: any) => {
        console.error('Error loading role info:', err);
        this.canViewAllTabs = false;
        this.setupColumnDefs();
        this.loadExpenses();
      }
    });
  }

  loadFilterOptions(): void {
    this.expenseService.getProjects().subscribe({
      next: (res: any) => {
        this.projects = res.data || [];
      }
    });

    this.expenseService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
      }
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    if (this.expenses && this.expenses.length > 0) {
      this.gridApi.setRowData(this.expenses);
    }
    setTimeout(() => {
      this.gridApi?.sizeColumnsToFit();
    }, 50);
  }

  setupColumnDefs(): void {
    if (this.activeTab === 'my_expenses') {
      this.columnDefs = [
        {
          headerName: 'EXPENSE NUMBER',
          field: 'expense_number',
          minWidth: 140,
          flex: 1.1,
          cellRenderer: (params: any) => {
            if (!params.value) return '—';
            return `<span class="expense-no-link" title="Click to view details">${params.value}</span>`;
          },
          onCellClicked: (params: any) => this.viewDetails(params.data)
        },
        {
          headerName: 'EXPENSE TYPE',
          field: 'expense_type',
          minWidth: 140,
          flex: 1.1
        },
        {
          headerName: 'EXPENSE DATE',
          field: 'expense_date',
          minWidth: 125,
          flex: 0.9,
          valueFormatter: (params: any) => this.formatDate(params.value)
        },
        {
          headerName: 'PROJECT',
          field: 'project_name',
          minWidth: 180,
          flex: 1.6,
          cellRenderer: (params: any) => this.renderProjectCell(params)
        },
        {
          headerName: 'EMPLOYEE NAME',
          field: 'employee_name',
          minWidth: 140,
          flex: 1.1,
          cellRenderer: (params: any) => this.renderEmployeeCell(params)
        },
        {
          headerName: 'AMOUNT',
          field: 'amount',
          minWidth: 100,
          flex: 0.8,
          valueFormatter: (params: any) => this.formatCurrency(params.value),
          cellStyle: { 'text-align': 'right', 'font-weight': '600' }
        },
        {
          headerName: 'STATUS',
          field: 'status',
          minWidth: 120,
          flex: 0.9,
          cellRenderer: (params: any) => this.renderStatusBadge(params.value)
        },
        {
          headerName: 'ACTIONS',
          field: 'id',
          sortable: false,
          filter: false,
          headerClass: 'header-align-center',
          cellStyle: { 'justify-content': 'center' },
          minWidth: 160,
          maxWidth: 200,
          flex: 1.0,
          cellClass: 'action-cell-renderer',
          cellRenderer: ExpenseActionCellComponent,
          cellRendererParams: {
            activeTab: this.activeTab,
            onView: (data: any) => this.viewDetails(data),
            onEdit: (data: any) => this.openEditExpenseModal(data),
            onResubmit: (data: any) => this.openEditExpenseModal(data),
            onDelete: (data: any) => this.deleteExpense(data),
            canApprove: () => false,
            canReject: () => false,
            canEdit: (data: any) => data.status === 'Draft' && data.employee_id === this.userRoleInfo?.employee_id,
            canResubmit: (data: any) => data.status === 'Rejected' && data.employee_id === this.userRoleInfo?.employee_id,
            canDelete: (data: any) => data.status === 'Draft' && data.employee_id === this.userRoleInfo?.employee_id
          }
        }
      ];
    } else if (this.activeTab === 'pending') {
      this.columnDefs = [
        {
          headerName: 'EXPENSE NUMBER',
          field: 'expense_number',
          minWidth: 130,
          flex: 1.0,
          cellRenderer: (params: any) => {
            if (!params.value) return '—';
            return `<span class="expense-no-link" title="Click to view details">${params.value}</span>`;
          },
          onCellClicked: (params: any) => this.viewDetails(params.data)
        },
        {
          headerName: 'EMPLOYEE',
          field: 'employee_name',
          minWidth: 150,
          flex: 1.2,
          cellRenderer: (params: any) => this.renderEmployeeCell(params)
        },
        {
          headerName: 'PROJECT',
          field: 'project_name',
          minWidth: 170,
          flex: 1.5,
          cellRenderer: (params: any) => this.renderProjectCell(params)
        },
        {
          headerName: 'EXPENSE TYPE',
          field: 'expense_type',
          minWidth: 130,
          flex: 1.0
        },
        {
          headerName: 'EXPENSE DATE',
          field: 'expense_date',
          minWidth: 125,
          flex: 0.9,
          valueFormatter: (params: any) => this.formatDate(params.value)
        },
        {
          headerName: 'AMOUNT',
          field: 'amount',
          minWidth: 100,
          flex: 0.8,
          valueFormatter: (params: any) => this.formatCurrency(params.value),
          cellStyle: { 'text-align': 'right', 'font-weight': '600' }
        },
        {
          headerName: 'SUBMITTED ON',
          field: 'submitted_at',
          minWidth: 130,
          flex: 0.9,
          valueFormatter: (params: any) => this.formatDate(params.value)
        },
        {
          headerName: 'STAGE',
          field: 'status',
          minWidth: 110,
          flex: 0.8,
          cellRenderer: (params: any) => this.renderStatusBadge(params.value)
        },
        {
          headerName: 'ACTIONS',
          field: 'id',
          sortable: false,
          filter: false,
          headerClass: 'header-align-center',
          cellStyle: { 'justify-content': 'center' },
          minWidth: 240,
          maxWidth: 260,
          flex: 1.2,
          cellClass: 'action-cell-renderer',
          cellRenderer: ExpenseActionCellComponent,
          cellRendererParams: {
            activeTab: this.activeTab,
            onView: (data: any) => this.viewDetails(data),
            onApprove: (data: any) => this.approveExpense(data),
            onReject: (data: any) => this.rejectExpense(data),
            canApprove: (data: any) => this.canApprove(data),
            canReject: (data: any) => this.canReject(data),
            canEdit: () => false,
            canResubmit: () => false,
            canDelete: () => false
          }
        }
      ];
    } else if (this.activeTab === 'approved') {
      this.columnDefs = [
        {
          headerName: 'EXPENSE NUMBER',
          field: 'expense_number',
          minWidth: 130,
          flex: 1.0,
          cellRenderer: (params: any) => {
            if (!params.value) return '—';
            return `<span class="expense-no-link" title="Click to view details">${params.value}</span>`;
          },
          onCellClicked: (params: any) => this.viewDetails(params.data)
        },
        {
          headerName: 'EMPLOYEE',
          field: 'employee_name',
          minWidth: 140,
          flex: 1.1,
          cellRenderer: (params: any) => this.renderEmployeeCell(params)
        },
        {
          headerName: 'PROJECT',
          field: 'project_name',
          minWidth: 170,
          flex: 1.4,
          cellRenderer: (params: any) => this.renderProjectCell(params)
        },
        {
          headerName: 'EXPENSE TYPE',
          field: 'expense_type',
          minWidth: 130,
          flex: 1.0
        },
        {
          headerName: 'EXPENSE DATE',
          field: 'expense_date',
          minWidth: 125,
          flex: 0.9,
          valueFormatter: (params: any) => this.formatDate(params.value)
        },
        {
          headerName: 'AMOUNT',
          field: 'amount',
          minWidth: 100,
          flex: 0.8,
          valueFormatter: (params: any) => this.formatCurrency(params.value),
          cellStyle: { 'text-align': 'right', 'font-weight': '600' }
        },
        {
          headerName: 'PM APPROVER',
          field: 'pm_approver_name',
          minWidth: 130,
          flex: 1.0,
          cellRenderer: (params: any) => {
            if (!params.data?.pm_approver_name) return '—';
            const dateStr = params.data.pm_approval_date ? `<small style="color: #64748b; font-size: 11px; display: block;">${this.formatDate(params.data.pm_approval_date)}</small>` : '';
            return `<div style="line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><div style="font-weight: 500;">${params.data.pm_approver_name}</div>${dateStr}</div>`;
          }
        },
        {
          headerName: 'FINANCE APPROVER',
          field: 'finance_approver_name',
          minWidth: 130,
          flex: 1.0,
          cellRenderer: (params: any) => {
            if (!params.data?.finance_approver_name) return '—';
            const dateStr = params.data.finance_approval_date ? `<small style="color: #64748b; font-size: 11px; display: block;">${this.formatDate(params.data.finance_approval_date)}</small>` : '';
            return `<div style="line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><div style="font-weight: 500;">${params.data.finance_approver_name}</div>${dateStr}</div>`;
          }
        },
        {
          headerName: 'STATUS',
          field: 'status',
          minWidth: 105,
          flex: 0.8,
          cellRenderer: (params: any) => this.renderStatusBadge(params.value)
        },
        {
          headerName: 'ACTIONS',
          field: 'id',
          sortable: false,
          filter: false,
          headerClass: 'header-align-center',
          cellStyle: { 'justify-content': 'center' },
          minWidth: 90,
          maxWidth: 120,
          flex: 0.7,
          cellClass: 'action-cell-renderer',
          cellRenderer: ExpenseActionCellComponent,
          cellRendererParams: {
            activeTab: this.activeTab,
            onView: (data: any) => this.viewDetails(data),
            canApprove: () => false,
            canReject: () => false,
            canEdit: () => false,
            canResubmit: () => false,
            canDelete: () => false
          }
        }
      ];
    } else if (this.activeTab === 'rejected') {
      this.columnDefs = [
        {
          headerName: 'EXPENSE NUMBER',
          field: 'expense_number',
          minWidth: 130,
          flex: 1.0,
          cellRenderer: (params: any) => {
            if (!params.value) return '—';
            return `<span class="expense-no-link" title="Click to view details">${params.value}</span>`;
          },
          onCellClicked: (params: any) => this.viewDetails(params.data)
        },
        {
          headerName: 'EMPLOYEE',
          field: 'employee_name',
          minWidth: 140,
          flex: 1.1,
          cellRenderer: (params: any) => this.renderEmployeeCell(params)
        },
        {
          headerName: 'PROJECT',
          field: 'project_name',
          minWidth: 160,
          flex: 1.3,
          cellRenderer: (params: any) => this.renderProjectCell(params)
        },
        {
          headerName: 'EXPENSE TYPE',
          field: 'expense_type',
          minWidth: 120,
          flex: 0.9
        },
        {
          headerName: 'AMOUNT',
          field: 'amount',
          minWidth: 100,
          flex: 0.8,
          valueFormatter: (params: any) => this.formatCurrency(params.value),
          cellStyle: { 'text-align': 'right', 'font-weight': '600' }
        },
        {
          headerName: 'REJECTED BY',
          field: 'rejected_by_name',
          minWidth: 120,
          flex: 0.9
        },
        {
          headerName: 'STAGE',
          field: 'rejection_stage',
          minWidth: 90,
          flex: 0.7
        },
        {
          headerName: 'REJECTION REASON',
          field: 'rejection_reason',
          minWidth: 160,
          flex: 1.3,
          tooltipField: 'rejection_reason',
          cellRenderer: (params: any) => {
            if (!params.value) return '—';
            return `<span style="color: #b91c1c; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;" title="${params.value}">${params.value}</span>`;
          }
        },
        {
          headerName: 'STATUS',
          field: 'status',
          minWidth: 105,
          flex: 0.8,
          cellRenderer: (params: any) => this.renderStatusBadge(params.value)
        },
        {
          headerName: 'ACTIONS',
          field: 'id',
          sortable: false,
          filter: false,
          headerClass: 'header-align-center',
          cellStyle: { 'justify-content': 'center' },
          minWidth: 150,
          maxWidth: 180,
          flex: 1.0,
          cellClass: 'action-cell-renderer',
          cellRenderer: ExpenseActionCellComponent,
          cellRendererParams: {
            activeTab: this.activeTab,
            onView: (data: any) => this.viewDetails(data),
            onResubmit: (data: any) => this.openEditExpenseModal(data),
            canApprove: () => false,
            canReject: () => false,
            canEdit: () => false,
            canResubmit: (data: any) => data.status === 'Rejected' && data.employee_id === this.userRoleInfo?.employee_id,
            canDelete: () => false
          }
        }
      ];
    }
  }

  renderEmployeeCell(params: any): string {
    if (!params.data) return '';
    const name = params.data.employee_name || '—';
    const email = params.data.employee_email ? `<small style="color: #64748b; font-size: 11px; display: block; overflow: hidden; text-overflow: ellipsis;">${params.data.employee_email}</small>` : '';
    return `<div style="line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;" title="${name}"><div style="font-weight: 500; color: #1e293b; overflow: hidden; text-overflow: ellipsis;">${name}</div>${email}</div>`;
  }

  renderProjectCell(params: any): string {
    if (!params.data) return '';
    const name = params.data.project_name || '—';
    const code = params.data.project_code ? `<small style="color: #64748b; font-size: 11px; display: block; overflow: hidden; text-overflow: ellipsis;">${params.data.project_code}</small>` : '';
    return `<div style="line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;" title="${name}"><div style="font-weight: 500; color: #1e293b; overflow: hidden; text-overflow: ellipsis;">${name}</div>${code}</div>`;
  }

  renderStatusBadge(status: string): string {
    const safeStatus = status || 'Draft';
    const slug = safeStatus.toLowerCase().replace(/\s+/g, '-');
    return `<span class="status-badge status-${slug}">${safeStatus}</span>`;
  }

  formatDate(dateStr: any): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatCurrency(val: any): string {
    if (val == null) return '₹0.00';
    return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  setTab(tab: 'my_expenses' | 'pending' | 'approved' | 'rejected'): void {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.currentPage = 1;
    this.setupColumnDefs();
    this.loadExpenses();
    setTimeout(() => {
      this.gridApi?.sizeColumnsToFit();
    }, 60);
  }

  loadExpenses(): void {
    this.loading = true;
    this.expenseService.getExpenses({
      tab: this.activeTab,
      search: this.searchTerm,
      project_id: this.selectedProjectId,
      expense_type: this.selectedCategory,
      page: this.currentPage,
      limit: 1000
    }).subscribe({
      next: (res: any) => {
        this.expenses = res.data || [];
        if (res.counts) {
          this.counts = res.counts;
        }
        if (this.gridApi) {
          this.gridApi.setRowData(this.expenses);
          setTimeout(() => {
            this.gridApi?.sizeColumnsToFit();
          }, 60);
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching expenses:', err);
        this.toast.error(err.error?.message || 'Failed to load expenses', 'Error');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.gridApi) {
      this.gridApi.setQuickFilter(this.searchTerm);
    }
  }

  onFilterChange(): void {
    this.loadExpenses();
  }

  onPageSizeChanged(): void {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(this.pageSize));
    }
  }

  onExportDataAsCsv(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: `expenses_${this.activeTab}_${Date.now()}.csv`
      });
    }
  }

  openAddExpenseModal(): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '680px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.created) {
        this.loadExpenses();
      }
    });
  }

  openEditExpenseModal(expense: any): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '680px',
      disableClose: true,
      data: { expense }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.updated) {
        this.loadExpenses();
      }
    });
  }

  viewDetails(expense: any): void {
    const dialogRef = this.dialog.open(ExpenseDetailDialogComponent, {
      width: '780px',
      data: { id: expense.id }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.updated) {
        this.loadExpenses();
      } else if (res && res.openEdit) {
        this.openEditExpenseModal(res.expense);
      }
    });
  }

  approveExpense(expense: any): void {
    const isPMStage = expense.status === 'Submitted';
    const stageLabel = isPMStage ? 'Project Manager' : 'Finance Approver';

    Swal.fire({
      title: 'Approve Expense?',
      html: `
        <div style="font-size: 14px; color: #475569; line-height: 1.6; text-align: center;">
          Are you sure you want to approve expense <strong>${expense.expense_number}</strong>
          of <strong style="color: #0c85c0;">₹${Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          as <strong>${stageLabel}</strong>?
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.expenseService.approveExpense(expense.id, `Approved by ${stageLabel}`).subscribe({
          next: (res: any) => {
            this.toast.success(res.message || 'Expense approved successfully', 'Success');
            this.loadExpenses();
          },
          error: (err: any) => {
            this.toast.error(err.error?.message || 'Approval failed', 'Error');
          }
        });
      }
    });
  }

  rejectExpense(expense: any): void {
    const dialogRef = this.dialog.open(ExpenseRejectDialogComponent, {
      width: '480px',
      data: {
        expense_number: expense.expense_number,
        amount: expense.amount,
        employee_name: expense.employee_name
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.rejection_reason) {
        this.expenseService.rejectExpense(expense.id, res.rejection_reason).subscribe({
          next: (apiRes: any) => {
            this.toast.success(apiRes.message || 'Expense rejected', 'Notice');
            this.loadExpenses();
          },
          error: (err: any) => {
            this.toast.error(err.error?.message || 'Rejection failed', 'Error');
          }
        });
      }
    });
  }

  deleteExpense(expense: any): void {
    Swal.fire({
      title: 'Delete Draft Expense?',
      html: `
        <div style="font-size: 14px; color: #475569; line-height: 1.6; text-align: center;">
          Are you sure you want to delete draft expense <strong>${expense.expense_number}</strong>?
          <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">This action cannot be undone.</div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.expenseService.deleteExpense(expense.id).subscribe({
          next: (res: any) => {
            this.toast.success('Draft expense deleted', 'Success');
            this.loadExpenses();
          },
          error: (err: any) => {
            this.toast.error(err.error?.message || 'Failed to delete expense', 'Error');
          }
        });
      }
    });
  }

  canApprove(expense: any): boolean {
    if (this.isAdmin) return expense.status === 'Submitted' || expense.status === 'Finance Pending';
    if (this.isPM && expense.status === 'Submitted') {
      const managed = this.userRoleInfo?.managedProjectIds || [];
      return managed.includes(expense.project_id) || expense.project_manager_id === this.userRoleInfo?.employee_id;
    }
    if (this.isFinance && expense.status === 'Finance Pending') {
      return true;
    }
    return false;
  }

  canReject(expense: any): boolean {
    return this.canApprove(expense);
  }
}
