import { ChangeDetectorRef, Component, OnInit, HostListener } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from 'ag-grid-community';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';
import { TimesheetActionCellComponent } from '../timesheet-action-cell/timesheet-action-cell.component';

@Component({
  selector: 'app-timesheet-timesheets',
  templateUrl: './timesheet-timesheets.component.html',
  styleUrls: ['./timesheet-timesheets.component.scss']
})
export class TimesheetTimesheetsComponent implements OnInit {
  currentUser: any = null;
  employeeId: any = 1;
  employeeName: string = 'Ravi Pandey';
  canApprove: boolean = false;
  currentTab: 'my' | 'team' = 'my';

  myGridApi!: GridApi;
  teamGridApi!: GridApi;
  myColumnDefs: ColDef[] = [];
  teamColumnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    suppressMovable: true
  };

  lastSubmissionClickTime: number = 0;
  lastSubmissionClickId: any = null;
  lastHandledDetailsTime: number = 0;

  submissions: any[] = [];
  filteredSubmissions: any[] = [];
  teamSubmissions: any[] = [];
  filteredTeamSubmissions: any[] = [];

  loading: boolean = false;
  teamLoading: boolean = false;

  activeMonthDate: Date = new Date(2026, 9, 1);
  selectedStatus: string = 'All';
  statusOptions: string[] = ['All', 'Draft', 'Pending', 'Approved', 'Rejected'];

  selectedSubmissionIds: Set<number> = new Set();
  showMoreMenu: boolean = false;
  showFilterPanel: boolean = false;

  selectedPeriod: string = 'This Month';
  periodOptions: string[] = ['Today', 'This Week', 'This Month', 'Yesterday', 'Last Week', 'Last Month'];
  isPeriodDropdownOpen: boolean = true;

  showCreateModal: boolean = false;
  submittingTimesheet: boolean = false;
  createModalData: any = {
    timesheetName: '',
    comments: '',
    periodStart: '',
    periodEnd: '',
    totalHours: 0,
    billableHours: 0,
    logs: [],
    groupedByDate: []
  };
  editingModalLogId: any = null;
  inlineEditData: any = {};
  jobs: any[] = [];
  allTasks: any[] = [];

  showDetailsModal: boolean = false;
  selectedSubmission: any = null;
  loadingDetails: boolean = false;
  newComment: string = '';
  addingComment: boolean = false;

  showRejectModal: boolean = false;
  rejectionReason: string = '';
  rejecting: boolean = false;

  showRejectLogConfirmModal: boolean = false;
  logToReject: any = null;
  rejectLogReason: string = '';
  rejectLogAttempted: boolean = false;
  rejectingLog: boolean = false;

  approvingSubmission: boolean = false;

  constructor(
    private pmService: ProjectManagementService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('signInUser');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        this.employeeId = this.currentUser.employee_id || 1;
        this.employeeName = this.currentUser.employee_name || this.currentUser.name || 'Ravi Pandey';
        const role = (this.currentUser.role_master_name || this.currentUser.roles || this.currentUser.role || '').toLowerCase();
        this.canApprove =
          this.currentUser.role_master_id === 1 ||
          this.currentUser.employee_id === 1 ||
          role.includes('admin') ||
          role.includes('manager') ||
          role.includes('head') ||
          role.includes('creator');
      } catch (e) {
        console.error('Error parsing signInUser:', e);
      }
    }
    this.setupColumnDefs();
    this.loadSubmissions();
    if (this.canApprove) {
      this.loadTeamSubmissions();
    }
    this.loadJobs();
    this.loadAllTasks();
  }

  setupColumnDefs(): void {
    const commonCheckbox: ColDef = {
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      width: 48,
      maxWidth: 50,
      minWidth: 48,
      sortable: false,
      filter: false,
      suppressMenu: true,
      headerClass: 'header-align-center',
      cellStyle: { 'justify-content': 'center' }
    };

    const commonNameCol: ColDef = {
      headerName: 'TIMESHEET NAME',
      field: 'submission_name',
      minWidth: 200,
      flex: 1.8,
      cellRenderer: (params: any) => {
        if (!params.data) return '—';
        const name = this.formatTimesheetName(params.data);
        return `<span class="timesheet-title-link" title="Click to view details">${name}</span>`;
      },
      onCellClicked: (params: any) => {
        if (params.data) this.openDetails(params.data);
      }
    };

    const commonEmployeeCol: ColDef = {
      headerName: 'EMPLOYEE',
      field: 'employee_name',
      minWidth: 140,
      flex: 1.2,
      cellRenderer: (params: any) => {
        return params.data ? this.formatEmployee(params.data) : '—';
      }
    };

    const commonSubmittedCol: ColDef = {
      headerName: 'SUBMITTED HOURS',
      field: 'total_hours',
      minWidth: 130,
      flex: 1.0,
      valueFormatter: (params: any) => this.formatDuration(params.value)
    };

    const commonApprovedCol: ColDef = {
      headerName: 'APPROVED HOURS',
      field: 'approved_hours',
      minWidth: 130,
      flex: 1.0,
      cellRenderer: (params: any) => {
        return params.data ? this.formatApprovedHours(params.data) : 'NA';
      }
    };

    const commonStatusCol: ColDef = {
      headerName: 'STATUS',
      field: 'status',
      minWidth: 120,
      flex: 1.0,
      cellRenderer: (params: any) => {
        const status = params.value || 'Draft';
        const cls = this.getStatusClass(status);
        return `
          <span class="status-pill ${cls}">
            <span class="status-dot"></span>
            ${status}
          </span>
        `;
      }
    };

    this.myColumnDefs = [
      commonCheckbox,
      commonNameCol,
      commonEmployeeCol,
      commonSubmittedCol,
      commonApprovedCol,
      commonStatusCol,
      {
        headerName: 'ACTIONS',
        width: 80,
        maxWidth: 90,
        flex: 0.6,
        sortable: false,
        filter: false,
        headerClass: 'header-align-center',
        cellStyle: { 'justify-content': 'center' },
        cellClass: 'action-cell-renderer',
        cellRenderer: TimesheetActionCellComponent,
        cellRendererParams: {
          isTeamTab: false,
          onView: (s: any) => this.openDetails(s)
        }
      }
    ];

    this.teamColumnDefs = [
      commonCheckbox,
      commonNameCol,
      commonEmployeeCol,
      commonSubmittedCol,
      commonApprovedCol,
      commonStatusCol,
      {
        headerName: 'ACTIONS',
        minWidth: 110,
        maxWidth: 130,
        flex: 0.9,
        sortable: false,
        filter: false,
        headerClass: 'header-align-center',
        cellStyle: { 'justify-content': 'center' },
        cellClass: 'action-cell-renderer',
        cellRenderer: TimesheetActionCellComponent,
        cellRendererParams: {
          isTeamTab: true,
          onView: (s: any) => this.openDetails(s),
          onApprove: (s: any) => this.approveSubmission(s),
          onReject: (s: any) => this.rejectSubmission(s),
          hasPayableHours: (s: any) => this.hasPayableHours(s)
        }
      }
    ];
  }

  onMyGridReady(params: GridReadyEvent): void {
    this.myGridApi = params.api;
    if (this.filteredSubmissions && this.filteredSubmissions.length > 0) {
      this.myGridApi.setRowData(this.filteredSubmissions);
    }
    setTimeout(() => {
      this.myGridApi?.sizeColumnsToFit();
    }, 50);
  }

  onTeamGridReady(params: GridReadyEvent): void {
    this.teamGridApi = params.api;
    if (this.filteredTeamSubmissions && this.filteredTeamSubmissions.length > 0) {
      this.teamGridApi.setRowData(this.filteredTeamSubmissions);
    }
    setTimeout(() => {
      this.teamGridApi?.sizeColumnsToFit();
    }, 50);
  }

  onGridSizeChanged(params: GridSizeChangedEvent): void {
    params.api?.sizeColumnsToFit();
  }

  onSelectionChanged(tab: 'my' | 'team'): void {
    const api = tab === 'my' ? this.myGridApi : this.teamGridApi;
    if (!api) return;
    const selectedRows = api.getSelectedRows();
    this.selectedSubmissionIds = new Set(selectedRows.map(r => Number(r.submission_id)));
    this.cdr.detectChanges();
  }

  onRowDoubleClicked(event: any): void {
    if (event.data) {
      this.openDetails(event.data);
    }
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'approved') return 'badge-completed';
    if (s === 'pending' || s === 'submitted') return 'badge-inprogress';
    if (s === 'rejected') return 'badge-rejected';
    return 'badge-draft';
  }

  setTab(tab: 'my' | 'team'): void {
    this.currentTab = tab;
    this.selectedSubmissionIds.clear();
    this.myGridApi?.deselectAll();
    this.teamGridApi?.deselectAll();
    this.selectedStatus = 'All';
    if (tab === 'team') {
      this.loadTeamSubmissions();
    } else {
      this.loadSubmissions();
    }
  }

  get pendingTeamCount(): number {
    return (this.teamSubmissions || []).filter(s => s.status === 'Pending').length;
  }

  get selectedPendingCount(): number {
    if (this.currentTab !== 'team') return 0;
    return this.filteredTeamSubmissions.filter(
      s => this.selectedSubmissionIds.has(Number(s.submission_id)) && s.status === 'Pending' && this.hasPayableHours(s)
    ).length;
  }

  get monthDisplayLabel(): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[this.activeMonthDate.getMonth()]} ${this.activeMonthDate.getFullYear()}`;
  }

  prevMonth(): void {
    this.activeMonthDate = new Date(this.activeMonthDate.getFullYear(), this.activeMonthDate.getMonth() - 1, 1);
    this.applyFilters();
  }

  nextMonth(): void {
    this.activeMonthDate = new Date(this.activeMonthDate.getFullYear(), this.activeMonthDate.getMonth() + 1, 1);
    this.applyFilters();
  }

  currentMonth(): void {
    this.activeMonthDate = new Date(2026, 9, 1);
    this.applyFilters();
  }

  loadSubmissions(): void {
    if (!this.employeeId) return;
    this.loading = true;
    this.pmService.getSubmissions(this.employeeId).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.submissions = res.data;
          this.submissions.sort((a, b) => b.submission_id - a.submission_id);
          this.applyFilters();
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error fetching submissions:', err);
        this.toast.error('Failed to load timesheets');
      }
    });
  }

  loadTeamSubmissions(): void {
    this.teamLoading = true;
    this.pmService.getTeamSubmissions().subscribe({
      next: (res: any) => {
        this.teamLoading = false;
        if (res.success && res.data) {
          this.teamSubmissions = res.data;
          this.teamSubmissions.sort((a: any, b: any) => b.submission_id - a.submission_id);
          this.applyFilters();
        }
      },
      error: (err: any) => {
        this.teamLoading = false;
        console.error('Error fetching team submissions:', err);
      }
    });
  }

  loadJobs(): void {
    if (!this.employeeId) return;
    this.pmService.getJobs(this.employeeId).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.jobs = res.data;
        }
      },
      error: () => {}
    });
  }

  loadAllTasks(): void {
    this.pmService.getAllTasks().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.allTasks = res.data;
        }
      },
      error: () => {}
    });
  }

  loadTasksForProject(projectId: any): void {
    if (!projectId) return;
    this.pmService.getAllTasks({ project_id: projectId }).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const existingIds = new Set((this.allTasks || []).map(t => String(t.task_id)));
          const newTasks = res.data.filter((t: any) => !existingIds.has(String(t.task_id)));
          this.allTasks = [...(this.allTasks || []), ...newTasks];
        }
      },
      error: () => {}
    });
  }

  onStatusChange(status?: string): void {
    if (status) this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters(): void {
    const today = new Date(2026, 9, 12);
    let rangeStart: Date;
    let rangeEnd: Date;

    if (this.selectedPeriod === 'Today') {
      rangeStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      rangeEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    } else if (this.selectedPeriod === 'Yesterday') {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      rangeStart = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0);
      rangeEnd = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59);
    } else if (this.selectedPeriod === 'This Week') {
      const day = today.getDay();
      rangeStart = new Date(today);
      rangeStart.setDate(today.getDate() - day);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 6);
      rangeEnd.setHours(23, 59, 59, 999);
    } else if (this.selectedPeriod === 'Last Week') {
      const day = today.getDay();
      rangeStart = new Date(today);
      rangeStart.setDate(today.getDate() - day - 7);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 6);
      rangeEnd.setHours(23, 59, 59, 999);
    } else if (this.selectedPeriod === 'Last Month') {
      rangeStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
      rangeEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
      this.activeMonthDate = new Date(rangeStart);
    } else {
      const selYear = this.activeMonthDate.getFullYear();
      const selMonth = this.activeMonthDate.getMonth();
      rangeStart = new Date(selYear, selMonth, 1, 0, 0, 0);
      rangeEnd = new Date(selYear, selMonth + 1, 0, 23, 59, 59);
    }

    const targetList = this.currentTab === 'my' ? this.submissions : this.teamSubmissions;

    const filtered = targetList.filter(s => {
      if (s.period_start_date) {
        const sStart = new Date(s.period_start_date);
        const sEnd = s.period_end_date ? new Date(s.period_end_date) : sStart;
        if (!isNaN(sStart.getTime()) && !isNaN(sEnd.getTime())) {
          if (sStart > rangeEnd || sEnd < rangeStart) {
            return false;
          }
        }
      }

      if (this.selectedStatus && this.selectedStatus !== 'All') {
        if (s.status !== this.selectedStatus) {
          return false;
        }
      }

      return true;
    });

    if (this.currentTab === 'my') {
      this.filteredSubmissions = filtered;
      if (this.myGridApi) {
        this.myGridApi.setRowData(this.filteredSubmissions);
      }
    } else {
      this.filteredTeamSubmissions = filtered;
      if (this.teamGridApi) {
        this.teamGridApi.setRowData(this.filteredTeamSubmissions);
      }
    }
  }

  formatTimesheetName(s: any): string {
    if (s.submission_name && s.submission_name.trim()) {
      return s.submission_name;
    }
    const startStr = this.formatDdmmyyyy(s.period_start_date);
    const endStr = this.formatDdmmyyyy(s.period_end_date);
    return `Timesheet (${startStr} - ${endStr})`;
  }

  formatEmployee(s: any): string {
    const id = s.employee_id || this.employeeId || '1';
    const name = s.employee_name || this.employeeName || 'Ravi Pandey';
    return `${id} ${name}`;
  }

  formatDuration(hours: any): string {
    if (hours === undefined || hours === null || hours === '' || hours === 0 || hours === '0' || hours === '0.00') {
      return '00:00';
    }
    const totalMinutes = Math.round(Number(hours) * 60);
    const h = Math.floor(Math.abs(totalMinutes) / 60);
    const m = Math.abs(totalMinutes) % 60;
    const sign = totalMinutes < 0 ? '-' : '';
    return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  formatApprovedHours(s: any): string {
    if (s.status === 'Approved' && s.total_hours) {
      return this.formatDuration(s.total_hours);
    }
    return 'NA';
  }

  hasPayableHours(item: any): boolean {
    if (!item) return false;
    if (typeof item === 'number') return item > 0;
    if (typeof item === 'string') {
      if (item.includes(':')) {
        const parts = item.split(':');
        const h = parseFloat(parts[0]) || 0;
        const m = parseFloat(parts[1]) || 0;
        return (h * 60 + m) > 0;
      }
      return (parseFloat(item) || 0) > 0;
    }
    if (typeof item === 'object') {
      if (item.submission && item.submission.total_hours !== undefined) {
        return this.hasPayableHours(item.submission.total_hours);
      }
      if (item.total_hours !== undefined) {
        return this.hasPayableHours(item.total_hours);
      }
      if (item.hours !== undefined) {
        return this.hasPayableHours(item.hours);
      }
    }
    return false;
  }

  formatDdmmyyyy(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
  }

  toggleSelectAll(): void {
    const list = this.currentTab === 'my' ? this.filteredSubmissions : this.filteredTeamSubmissions;
    if (list.length === 0) return;
    const allSelected = list.every(s => this.selectedSubmissionIds.has(Number(s.submission_id)));
    if (allSelected) {
      this.selectedSubmissionIds.clear();
    } else {
      list.forEach(s => this.selectedSubmissionIds.add(Number(s.submission_id)));
    }
  }

  isAllSelected(): boolean {
    const list = this.currentTab === 'my' ? this.filteredSubmissions : this.filteredTeamSubmissions;
    if (list.length === 0) return false;
    return list.every(s => this.selectedSubmissionIds.has(Number(s.submission_id)));
  }

  toggleSubmissionSelection(subId: number): void {
    if (this.selectedSubmissionIds.has(Number(subId))) {
      this.selectedSubmissionIds.delete(Number(subId));
    } else {
      this.selectedSubmissionIds.add(Number(subId));
    }
  }

  isSubmissionSelected(subId: number): boolean {
    return this.selectedSubmissionIds.has(Number(subId));
  }

  toggleMoreMenu(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.showMoreMenu = !this.showMoreMenu;
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
    if (this.showFilterPanel) {
      this.isPeriodDropdownOpen = true;
    }
  }

  togglePeriodDropdown(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.isPeriodDropdownOpen = !this.isPeriodDropdownOpen;
  }

  selectPeriod(opt: string): void {
    this.selectedPeriod = opt;
    this.isPeriodDropdownOpen = false;
  }

  applySideFilter(): void {
    this.showFilterPanel = false;
    this.applyFilters();
  }

  resetSideFilter(): void {
    this.selectedPeriod = 'This Month';
    this.selectedStatus = 'All';
    this.activeMonthDate = new Date(2026, 9, 1);
    this.showFilterPanel = false;
    this.applyFilters();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showMoreMenu) {
      const target = event.target as HTMLElement;
      if (!target.closest('.more-menu-container')) {
        this.showMoreMenu = false;
      }
    }
  }

  onImportClick(): void {
    this.showMoreMenu = false;
    const fileInput = document.getElementById('timesheetSubmissionsImportInput') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  onExportClick(): void {
    this.showMoreMenu = false;
    const list = this.currentTab === 'my' ? this.filteredSubmissions : this.filteredTeamSubmissions;
    if (!list || list.length === 0) {
      this.toast.info('No timesheets available to export.');
      return;
    }
    const headers = ['Timesheet Name', 'Employee', 'Submitted Hours', 'Approved Hours', 'Status'];
    const rows = list.map(s => [
      `"${this.formatTimesheetName(s)}"`,
      `"${this.formatEmployee(s)}"`,
      `"${this.formatDuration(s.total_hours)}"`,
      `"${this.formatApprovedHours(s)}"`,
      `"${s.status || 'Draft'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const tabPrefix = this.currentTab === 'my' ? 'My_Timesheets' : 'Team_Timesheets';
    link.setAttribute('download', `${tabPrefix}_${this.monthDisplayLabel.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.success('Timesheets exported successfully');
  }

  handleFileImport(event: any): void {
    const file = event.target?.files?.[0];
    if (!file) return;
    this.toast.info(`Importing file: ${file.name}`);
    if (this.currentTab === 'my') {
      this.loadSubmissions();
    } else {
      this.loadTeamSubmissions();
    }
  }

  openCreateTimesheet(): void {
    const curDate = new Date();
    const day = curDate.getDay();
    const diffToMon = curDate.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(new Date(curDate).setDate(diffToMon));
    const sun = new Date(new Date(mon).setDate(mon.getDate() + 6));

    const startIso = this.toDateStr(mon);
    const endIso = this.toDateStr(sun);

    this.pmService.getLogList({
      employee_id: this.employeeId,
      start_date: startIso,
      end_date: endIso,
      submission_status: 'Not Submitted'
    }).subscribe({
      next: (res: any) => {
        const logs = (res && res.data) ? res.data : [];
        const totalHrs = logs.reduce((sum: number, l: any) => sum + (parseFloat(l.total_hours) || 0), 0);
        const billableHrs = logs.filter((l: any) => l.is_billable).reduce((sum: number, l: any) => sum + (parseFloat(l.total_hours) || 0), 0);

        this.createModalData = {
          timesheetName: `Timesheet (${this.formatDdmmyyyy(startIso)} - ${this.formatDdmmyyyy(endIso)})`,
          comments: '',
          periodStart: startIso,
          periodEnd: endIso,
          totalHours: Math.round(totalHrs * 100) / 100,
          billableHours: Math.round(billableHrs * 100) / 100,
          logs: logs,
          groupedByDate: this.groupLogsForModal(logs)
        };
        this.showCreateModal = true;
      },
      error: () => {
        this.createModalData = {
          timesheetName: `Timesheet (${this.formatDdmmyyyy(startIso)} - ${this.formatDdmmyyyy(endIso)})`,
          comments: '',
          periodStart: startIso,
          periodEnd: endIso,
          totalHours: 0,
          billableHours: 0,
          logs: [],
          groupedByDate: []
        };
        this.showCreateModal = true;
      }
    });
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.cancelInlineEdit();
  }

  saveAsDraft(): void {
    if (this.submittingTimesheet) return;
    this.submittingTimesheet = true;

    const payload: any = {
      employee_id: this.employeeId,
      employee_name: this.employeeName,
      submission_name: this.createModalData.timesheetName,
      period_start_date: this.createModalData.periodStart,
      period_end_date: this.createModalData.periodEnd,
      status: 'Draft',
      comments: this.createModalData.comments
    };

    if (this.createModalData.logs && this.createModalData.logs.length > 0) {
      payload.log_ids = this.createModalData.logs.map((l: any) => l.log_id);
    }

    this.pmService.submitTimesheet(payload).subscribe({
      next: (res: any) => {
        this.submittingTimesheet = false;
        this.showCreateModal = false;
        this.toast.success(res.message || 'Timesheet saved as draft');
        this.loadSubmissions();
      },
      error: (err: any) => {
        this.submittingTimesheet = false;
        console.error('Error saving draft timesheet:', err);
        this.toast.error(err.error?.message || 'Failed to save timesheet as draft');
      }
    });
  }

  submitForApproval(): void {
    if (this.submittingTimesheet) return;
    this.submittingTimesheet = true;

    const payload: any = {
      employee_id: this.employeeId,
      employee_name: this.employeeName,
      submission_name: this.createModalData.timesheetName,
      period_start_date: this.createModalData.periodStart,
      period_end_date: this.createModalData.periodEnd,
      status: 'Pending',
      comments: this.createModalData.comments
    };

    if (this.createModalData.logs && this.createModalData.logs.length > 0) {
      payload.log_ids = this.createModalData.logs.map((l: any) => l.log_id);
    }

    this.pmService.submitTimesheet(payload).subscribe({
      next: (res: any) => {
        this.submittingTimesheet = false;
        this.showCreateModal = false;
        this.toast.success(res.message || 'Timesheet submitted for approval successfully');
        this.loadSubmissions();
      },
      error: (err: any) => {
        this.submittingTimesheet = false;
        console.error('Error submitting timesheet:', err);
        this.toast.error(err.error?.message || 'Failed to submit timesheet');
      }
    });
  }

  startInlineEdit(log: any): void {
    this.editingModalLogId = log.log_id;
    const taskId = log.task_id != null ? Number(log.task_id) : null;
    this.inlineEditData = {
      task_id: taskId,
      task_name: log.task_name,
      project_id: log.project_id,
      description: log.description || log.work_item || '',
      is_billable: log.is_billable !== undefined ? log.is_billable : true,
      duration: this.formatDuration(log.total_hours)
    };
    if (log.project_id) {
      this.loadTasksForProject(log.project_id);
    }
  }

  cancelInlineEdit(): void {
    this.editingModalLogId = null;
    this.inlineEditData = {};
  }

  compareTasks(t1: any, t2: any): boolean {
    return t1 != null && t2 != null && String(t1) === String(t2);
  }

  onInlineEditJobChange(): void {
    const source = (this.allTasks && this.allTasks.length > 0) ? this.allTasks : (this.jobs || []);
    const job = source.find(j => String(j.task_id) === String(this.inlineEditData.task_id));
    if (job) {
      this.inlineEditData.task_name = job.task_name;
    }
  }

  getJobsForProject(projectId: any, currentLog?: any): any[] {
    const source = (this.allTasks && this.allTasks.length > 0) ? this.allTasks : (this.jobs || []);
    let list = projectId ? source.filter(j => String(j.project_id) === String(projectId)) : [...source];
    if (currentLog && (currentLog.task_id || currentLog.task_name)) {
      const exists = list.some(j => String(j.task_id) === String(currentLog.task_id));
      if (!exists) {
        list = [
          {
            task_id: currentLog.task_id != null ? Number(currentLog.task_id) : currentLog.task_id,
            task_name: currentLog.task_name || ('Job ' + currentLog.task_id),
            project_id: currentLog.project_id
          },
          ...list
        ];
      }
    }
    return list.length > 0 ? list : (source.length > 0 ? source : []);
  }

  saveInlineEdit(log: any): void {
    const hours = this.parseDurationToHours(this.inlineEditData.duration);
    const updatePayload: any = {
      task_id: this.inlineEditData.task_id || log.task_id,
      description: this.inlineEditData.description,
      is_billable: this.inlineEditData.is_billable,
      total_hours: hours
    };

    this.pmService.updateLog(log.log_id, updatePayload).subscribe({
      next: () => {
        log.task_id = updatePayload.task_id;
        log.task_name = this.inlineEditData.task_name || log.task_name;
        log.description = updatePayload.description;
        log.is_billable = updatePayload.is_billable;
        log.total_hours = hours;

        if (this.showCreateModal && this.createModalData.logs) {
          const totalHrs = this.createModalData.logs.reduce((sum: number, l: any) => sum + (parseFloat(l.total_hours) || 0), 0);
          const billableHrs = this.createModalData.logs.filter((l: any) => l.is_billable).reduce((sum: number, l: any) => sum + (parseFloat(l.total_hours) || 0), 0);
          this.createModalData.totalHours = Math.round(totalHrs * 100) / 100;
          this.createModalData.billableHours = Math.round(billableHrs * 100) / 100;
        }

        if (this.showDetailsModal && this.selectedSubmission?.logs) {
          const activeLogs = this.selectedSubmission.logs.filter((l: any) => l.approval_status !== 'Rejected');
          const totalHrs = activeLogs.reduce((sum: number, l: any) => sum + (parseFloat(l.total_hours) || 0), 0);
          this.selectedSubmission.submission.total_hours = Math.round(totalHrs * 100) / 100;
          this.selectedSubmissionGroupedLogs = this.groupLogsForModal(this.selectedSubmission.logs);
        }

        this.cancelInlineEdit();
        this.toast.success('Time log updated successfully');
      },
      error: (err: any) => {
        console.error('Error updating log inline:', err);
        this.toast.error(err.error?.message || 'Failed to update time log');
      }
    });
  }

  openRejectLogModal(log: any): void {
    this.logToReject = log;
    this.rejectLogReason = '';
    this.rejectLogAttempted = false;
    this.showRejectLogConfirmModal = true;
  }

  closeRejectLogModal(): void {
    this.showRejectLogConfirmModal = false;
    this.logToReject = null;
    this.rejectLogReason = '';
    this.rejectLogAttempted = false;
    this.rejectingLog = false;
  }

  confirmRejectLog(): void {
    if (!this.logToReject) return;
    this.rejectLogAttempted = true;
    const log = this.logToReject;
    const reason = (this.rejectLogReason || '').trim();

    if (!reason) {
      this.toast.warning('Please enter a reason for rejection');
      return;
    }

    this.rejectingLog = true;
    this.pmService.updateLog(log.log_id, { approval_status: 'Rejected', rejection_reason: reason }).subscribe({
      next: (res: any) => {
        this.rejectingLog = false;
        this.closeRejectLogModal();
        log.approval_status = 'Rejected';
        log.submission_status = 'Not Submitted';
        if (this.selectedSubmission?.logs) {
          const activeLogs = this.selectedSubmission.logs.filter((l: any) => l.approval_status !== 'Rejected');
          const totalHrs = activeLogs.reduce((sum: number, l: any) => sum + (parseFloat(l.total_hours) || 0), 0);
          this.selectedSubmission.submission.total_hours = Math.round(totalHrs * 100) / 100;
        }
        if (this.selectedSubmission?.activities) {
          this.selectedSubmission.activities.push({
            actor_name: this.currentUser?.first_name || 'Approver',
            actor_role: this.currentUser?.roles || 'Approver',
            createdAt: new Date().toISOString(),
            message: `Rejected time log on "${log.task_name}" (${this.formatDuration(log.total_hours)}h): ${reason}`
          });
        }
        this.toast.success(res.message || 'Time log rejected successfully');
      },
      error: (err: any) => {
        this.rejectingLog = false;
        this.toast.error(err.error?.message || 'Failed to reject time log');
      }
    });
  }

  rejectIndividualLog(log: any): void {
    this.openRejectLogModal(log);
  }

  getSubmitProjectNames(): string {
    if (!this.createModalData || !this.createModalData.logs) return '--';
    const names = Array.from(new Set(this.createModalData.logs.map((l: any) => l.project_name || 'PRJ 1'))).filter(Boolean);
    return names.length > 0 ? names.join(', ') : 'PRJ 1';
  }

  triggerAttachmentUpload(): void {
    const fileInput = document.getElementById('timesheetSubmissionsImportInput') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  groupLogsForModal(logs: any[]): any[] {
    const map = new Map<string, any[]>();
    logs.forEach(l => {
      const d = l.log_date;
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(l);
    });

    const result: any[] = [];
    Array.from(map.keys()).sort().forEach(dateStr => {
      const dObj = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayMonth = `${months[dObj.getMonth()]} ${String(dObj.getDate()).padStart(2, '0')}`;
      const dayName = days[dObj.getDay()];

      result.push({
        dateStr,
        dayMonth,
        dayName,
        items: map.get(dateStr) || []
      });
    });
    return result;
  }

  selectedSubmissionGroupedLogs: any[] = [];

  get selectedSubmissionBillableHours(): number {
    if (!this.selectedSubmission || !this.selectedSubmission.logs) return 0;
    const billable = this.selectedSubmission.logs.filter((l: any) => l.is_billable && l.approval_status !== 'Rejected');
    const sum = billable.reduce((acc: number, l: any) => acc + (parseFloat(l.total_hours) || 0), 0);
    return Math.round(sum * 100) / 100;
  }

  getSelectedSubmissionProjectNames(): string {
    if (!this.selectedSubmission || !this.selectedSubmission.logs || this.selectedSubmission.logs.length === 0) {
      return '--';
    }
    const names = Array.from(new Set(this.selectedSubmission.logs.map((l: any) => l.project_name))).filter(Boolean);
    return names.length > 0 ? names.join(', ') : 'prj1';
  }

  getDetailsHeaderTitle(): string {
    if (!this.selectedSubmission || !this.selectedSubmission.submission) return 'Timesheet Details';
    const s = this.selectedSubmission.submission;
    const empId = s.employee_id || this.employeeId || '1';
    const empName = s.employee_name || this.employeeName || 'Ravi Pandey';
    const startStr = this.formatDdmmyyyy(s.period_start_date);
    const endStr = this.formatDdmmyyyy(s.period_end_date);
    return `${empId}- ${empName} ${startStr} - ${endStr}`;
  }

  getCreateHeaderTitle(): string {
    const empId = this.employeeId || '1';
    const empName = this.employeeName || 'Ravi Pandey';
    const startStr = this.formatDdmmyyyy(this.createModalData?.periodStart);
    const endStr = this.formatDdmmyyyy(this.createModalData?.periodEnd);
    return `${empId}- ${empName} ${startStr} - ${endStr}`;
  }

  trackBySubmissionId(index: number, item: any): any {
    return item?.submission_id ?? index;
  }

  onRowClick(event: MouseEvent, sub: any): void {
    const now = Date.now();
    const isDouble = event.detail === 2 || (now - this.lastSubmissionClickTime < 650 && String(this.lastSubmissionClickId) === String(sub?.submission_id));
    this.lastSubmissionClickTime = now;
    this.lastSubmissionClickId = sub?.submission_id;

    if (isDouble) {
      this.lastSubmissionClickTime = 0;
      this.lastSubmissionClickId = null;
      this.openDetails(sub);
    }
  }

  openDetails(sub: any): void {
    const now = Date.now();
    if (now - this.lastHandledDetailsTime < 400) return;
    this.lastHandledDetailsTime = now;

    this.loadingDetails = true;
    this.showDetailsModal = true;
    this.selectedSubmission = null;
    this.selectedSubmissionGroupedLogs = [];
    this.newComment = '';
    this.cdr.detectChanges();
    this.pmService.getSubmissionById(sub.submission_id).subscribe({
      next: (res: any) => {
        this.loadingDetails = false;
        if (res.success && res.data) {
          this.selectedSubmission = res.data;
          this.selectedSubmissionGroupedLogs = this.groupLogsForModal(res.data.logs || []);
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        this.loadingDetails = false;
        console.error('Error loading submission details:', err);
        this.toast.error('Failed to load submission details');
        this.cdr.detectChanges();
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedSubmission = null;
    this.cdr.detectChanges();
  }

  submitDetailsTimesheet(): void {
    if (!this.selectedSubmission || !this.selectedSubmission.submission) return;
    const sub = this.selectedSubmission.submission;
    this.pmService.updateSubmissionStatus(sub.submission_id, { status: 'Pending' }).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Timesheet submitted for approval');
        this.loadSubmissions();
        this.loadTeamSubmissions();
        this.openDetails(sub);
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Failed to submit timesheet');
      }
    });
  }

  sendComment(): void {
    if (!this.newComment || !this.newComment.trim() || !this.selectedSubmission) return;
    this.addingComment = true;
    const subId = this.selectedSubmission.submission.submission_id;
    this.pmService.addSubmissionComment(subId, this.newComment.trim()).subscribe({
      next: (res: any) => {
        this.addingComment = false;
        this.newComment = '';
        if (res.data) {
          if (!this.selectedSubmission.activities) this.selectedSubmission.activities = [];
          this.selectedSubmission.activities.push(res.data);
        }
        this.toast.success('Comment added');
      },
      error: () => {
        this.addingComment = false;
        this.toast.error('Failed to add comment');
      }
    });
  }

  approveSubmission(sub: any): void {
    if (!this.hasPayableHours(sub)) {
      this.toast.warning('Timesheet with 00:00 total hours cannot be approved');
      return;
    }

    if (!this.showDetailsModal || this.selectedSubmission?.submission?.submission_id !== sub.submission_id) {
      this.openDetails(sub);
      return;
    }

    const comment = (this.newComment || '').trim() || 'Approved';
    this.approvingSubmission = true;
    this.pmService.updateSubmissionStatus(sub.submission_id, { status: 'Approved', approver_comments: comment }).subscribe({
      next: (res: any) => {
        this.approvingSubmission = false;
        this.newComment = '';
        this.toast.success(res.message || 'Timesheet approved successfully');
        this.loadTeamSubmissions();
        this.loadSubmissions();
        if (this.showDetailsModal && this.selectedSubmission?.submission?.submission_id === sub.submission_id) {
          this.openDetails(sub);
        }
      },
      error: (err: any) => {
        this.approvingSubmission = false;
        this.toast.error(err.error?.message || 'Failed to approve timesheet');
      }
    });
  }

  rejectSubmission(sub: any): void {
    if (!this.hasPayableHours(sub)) {
      this.toast.warning('Timesheet with 00:00 total hours cannot be rejected');
      return;
    }

    if (!this.showDetailsModal || this.selectedSubmission?.submission?.submission_id !== sub.submission_id) {
      this.openDetails(sub);
      setTimeout(() => {
        const input = document.querySelector('.zm-comment-input') as HTMLInputElement;
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);
      this.toast.info('Please enter a rejection reason in the comment section before rejecting');
      return;
    }

    const reason = (this.newComment || '').trim();
    if (!reason) {
      this.toast.warning('Please enter a rejection reason in the comment section before rejecting');
      const input = document.querySelector('.zm-comment-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.pmService
      .updateSubmissionStatus(sub.submission_id, {
        status: 'Rejected',
        rejection_reason: reason
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success(res.message || 'Timesheet rejected successfully');
          this.newComment = '';
          this.loadTeamSubmissions();
          this.loadSubmissions();
          if (
            this.showDetailsModal &&
            this.selectedSubmission?.submission?.submission_id === sub.submission_id
          ) {
            this.openDetails(sub);
          }
        },
        error: (err: any) => {
          this.toast.error(err.error?.message || 'Failed to reject timesheet');
        }
      });
  }

  approveSelected(): void {
    const pendingToApprove = this.filteredTeamSubmissions.filter(
      s => this.selectedSubmissionIds.has(Number(s.submission_id)) && s.status === 'Pending' && this.hasPayableHours(s)
    );
    if (pendingToApprove.length === 0) {
      this.toast.info('No pending timesheets with payable hours selected to approve');
      return;
    }

    let completed = 0;
    pendingToApprove.forEach(s => {
      this.pmService.updateSubmissionStatus(s.submission_id, { status: 'Approved' }).subscribe({
        next: () => {
          completed++;
          if (completed === pendingToApprove.length) {
            this.toast.success(`${completed} timesheet(s) approved successfully`);
            this.selectedSubmissionIds.clear();
            this.loadTeamSubmissions();
            this.loadSubmissions();
          }
        },
        error: () => {
          completed++;
          if (completed === pendingToApprove.length) {
            this.selectedSubmissionIds.clear();
            this.loadTeamSubmissions();
          }
        }
      });
    });
  }

  private toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private parseDurationToHours(str: string): number {
    if (!str) return 0;
    if (str.includes(':')) {
      const parts = str.split(':').map(Number);
      return Math.round(((parts[0] || 0) + (parts[1] || 0) / 60) * 100) / 100;
    }
    return Math.round((parseFloat(str) || 0) * 100) / 100;
  }
}
