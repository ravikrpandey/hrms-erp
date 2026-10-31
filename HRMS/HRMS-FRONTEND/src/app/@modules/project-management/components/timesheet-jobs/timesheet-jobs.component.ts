import { Component, OnInit, HostListener } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from 'ag-grid-community';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timesheet-jobs',
  templateUrl: './timesheet-jobs.component.html',
  styleUrls: ['./timesheet-jobs.component.scss']
})
export class TimesheetJobsComponent implements OnInit {
  employeeId: any = null;
  currentUser: any = null;
  jobs: any[] = [];
  filteredJobs: any[] = [];
  allProjects: any[] = [];
  employees: any[] = [];
  loading: boolean = false;

  gridApi!: GridApi;
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    suppressMovable: true
  };

  viewType: 'Employee' | 'Department' = 'Employee';
  selectedFilter: string = 'Jobs';
  selectedJobIds: Set<number> = new Set();

  selectedJob: any = null;
  showJobDialog: boolean = false;

  sortColumn: string = '';
  sortAsc: boolean = true;

  showFilterPanel: boolean = false;
  showMoreMenu: boolean = false;

  filterJobName: string = 'All';
  filterClient: string = 'All Clients';
  filterProject: string = 'All Projects';
  filterAssignedTo: string = '';
  filterAssignedBy: string = 'Select';
  filterStatus: string = 'In-Progress';

  constructor(
    private pmService: ProjectManagementService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('signInUser');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        this.employeeId = this.currentUser.employee_id;
        const empName = this.currentUser.employee_name || this.currentUser.first_name || 'Ravi Pandey';
        this.filterAssignedTo = `${this.employeeId || 1} ${empName}`;
      } catch (e) {
        console.error('Error parsing signInUser:', e);
      }
    }
    this.setupColumnDefs();
    this.loadJobs();
    this.loadProjects();
    this.loadEmployees();
  }

  setupColumnDefs(): void {
    this.columnDefs = [
      {
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
      },
      {
        headerName: 'JOB NAME',
        field: 'task_name',
        minWidth: 220,
        flex: 1.8,
        cellRenderer: (params: any) => {
          if (!params.data) return '—';
          const j = params.data;
          const proj = j.project_name ? `<span class="job-sep">·</span><span class="job-project">${j.project_name}</span>` : '';
          return `
            <div class="job-cell-content" title="Click to view details">
              <span class="job-title">${j.task_name || '—'}</span>
              ${proj}
            </div>
          `;
        },
        onCellClicked: (params: any) => {
          if (params.data) this.openJob(params.data);
        }
      },
      {
        headerName: 'START DATE',
        field: 'start_date',
        minWidth: 120,
        flex: 1.0,
        valueFormatter: (params: any) => params.value ? this.formatDate(params.value) : '—'
      },
      {
        headerName: 'END DATE',
        field: 'due_date',
        minWidth: 120,
        flex: 1.0,
        valueFormatter: (params: any) => params.value ? this.formatDate(params.value) : '—'
      },
      {
        headerName: 'ESTIMATED HOURS',
        field: 'estimated_hours',
        minWidth: 130,
        flex: 1.0,
        valueFormatter: (params: any) => this.formatHours(params.value)
      },
      {
        headerName: 'LOGGED HOURS',
        field: 'hours_logged',
        minWidth: 140,
        flex: 1.1,
        cellRenderer: (params: any) => {
          if (!params.data) return '—';
          const j = params.data;
          const text = this.formatHoursCompact(j.hours_logged);
          const percent = this.getProgressPercent(j);
          return `
            <div class="logged-hours-cell">
              <span class="logged-text">${text}</span>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${percent}%;"></div>
              </div>
            </div>
          `;
        }
      },
      {
        headerName: 'STATUS',
        field: 'status',
        minWidth: 130,
        flex: 1.0,
        cellRenderer: (params: any) => {
          const status = this.formatStatus(params.value);
          const cls = this.getStatusClass(status);
          return `
            <span class="status-pill ${cls}">
              <span class="status-dot"></span>
              ${status}
            </span>
          `;
        }
      },
      {
        headerName: 'USER(S)',
        field: 'user_count',
        minWidth: 80,
        maxWidth: 100,
        flex: 0.8,
        headerClass: 'header-align-center',
        cellStyle: { 'justify-content': 'center' },
        cellRenderer: (params: any) => {
          if (!params.data) return '';
          const j = params.data;
          const title = j.assigned_to_name || 'Assigned user';
          const count = j.user_count || 1;
          return `
            <div class="zoho-badge-icon" title="${title}">
              <i class="fa fa-user-o user-icon"></i>
              <span class="badge-count">${count}</span>
            </div>
          `;
        }
      }
    ];
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    if (this.filteredJobs && this.filteredJobs.length > 0) {
      this.gridApi.setRowData(this.filteredJobs);
    }
    setTimeout(() => {
      this.gridApi?.sizeColumnsToFit();
    }, 50);
  }

  onGridSizeChanged(params: GridSizeChangedEvent): void {
    params.api?.sizeColumnsToFit();
  }

  onSelectionChanged(): void {
    if (!this.gridApi) return;
    const selectedRows = this.gridApi.getSelectedRows();
    this.selectedJobIds = new Set(selectedRows.map(r => r.task_id));
  }

  loadJobs(): void {
    if (!this.employeeId) return;
    this.loading = true;
    this.pmService.getJobs(this.employeeId).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.jobs = res.data;
          this.applyFilter();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching jobs:', err);
        this.toast.error('Failed to load jobs');
      }
    });
  }

  loadProjects(): void {
    this.pmService.getAllProjects().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.allProjects = res.data;
        }
      }
    });
  }

  loadEmployees(): void {
    this.pmService.getEmployees().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.employees = res.data;
        }
      }
    });
  }

  setViewType(type: 'Employee' | 'Department'): void {
    this.viewType = type;
    this.applyFilter();
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  get jobNames(): string[] {
    return Array.from(new Set((this.jobs || []).map(j => j.task_name).filter(Boolean)));
  }

  get projectNames(): string[] {
    const list: string[] = [];
    (this.allProjects || []).forEach(p => { if (p.project_name) list.push(p.project_name); });
    (this.jobs || []).forEach(j => { if (j.project_name) list.push(j.project_name); });
    return Array.from(new Set(list));
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  toggleMoreMenu(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.showMoreMenu = !this.showMoreMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showMoreMenu && !(event.target as HTMLElement).closest('.more-menu-container')) {
      this.showMoreMenu = false;
    }
  }

  clearAssignedTo(): void {
    this.filterAssignedTo = '';
  }

  setAssignedTo(): void {
    const empName = this.currentUser?.employee_name || this.currentUser?.first_name || 'Ravi Pandey';
    this.filterAssignedTo = `${this.employeeId || 1} ${empName}`;
  }

  applySideFilter(): void {
    this.showFilterPanel = false;
    this.applyFilter();
  }

  resetSideFilter(): void {
    this.filterJobName = 'All';
    this.filterClient = 'All Clients';
    this.filterProject = 'All Projects';
    const empName = this.currentUser?.employee_name || this.currentUser?.first_name || 'Ravi Pandey';
    this.filterAssignedTo = `${this.employeeId || 1} ${empName}`;
    this.filterAssignedBy = 'Select';
    this.filterStatus = 'In-Progress';
    this.showFilterPanel = false;
    this.applyFilter();
  }

  onImportClick(): void {
    this.showMoreMenu = false;
    const input = document.getElementById('jobsImportInput') as HTMLInputElement;
    if (input) input.click();
  }

  onExportClick(): void {
    this.showMoreMenu = false;
    if (!this.filteredJobs || this.filteredJobs.length === 0) {
      this.toast.info('No jobs available to export.');
      return;
    }
    const headers = ['Job Name', 'Project', 'Start Date', 'End Date', 'Estimated Hours', 'Logged Hours', 'Status'];
    const rows = this.filteredJobs.map(j => [
      `"${j.task_name || ''}"`,
      `"${j.project_name || ''}"`,
      `"${j.start_date || ''}"`,
      `"${j.due_date || ''}"`,
      `"${this.formatHours(j.estimated_hours)}"`,
      `"${this.formatHoursCompact(j.hours_logged)}"`,
      `"${this.formatStatus(j.status)}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Jobs_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.success('Jobs exported successfully');
  }

  handleFileImport(event: any): void {
    const file = event.target?.files?.[0];
    if (!file) return;
    this.toast.info(`Importing jobs file: ${file.name}`);
    this.loadJobs();
  }

  applyFilter(): void {
    let result = [...this.jobs];
    if (this.selectedFilter === 'My Jobs' && this.employeeId) {
      result = result.filter(j => j.assigned_to_id == this.employeeId);
    }
    if (this.filterJobName && this.filterJobName !== 'All') {
      result = result.filter(j => j.task_name === this.filterJobName);
    }
    if (this.filterProject && this.filterProject !== 'All Projects') {
      result = result.filter(j => j.project_name === this.filterProject);
    }
    if (this.filterStatus && this.filterStatus !== 'All') {
      result = result.filter(j => {
        const s = (j.status || '').toLowerCase().replace(/[\s-_]/g, '');
        const target = this.filterStatus.toLowerCase().replace(/[\s-_]/g, '');
        if (target === 'inprogress') {
          return s === 'inprogress' || s === 'active';
        }
        return s === target;
      });
    }
    this.filteredJobs = result;
    if (this.sortColumn) {
      this.sortData();
    }
    if (this.gridApi) {
      this.gridApi.setRowData(this.filteredJobs);
    }
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }
    this.sortData();
  }

  sortData(): void {
    this.filteredJobs.sort((a, b) => {
      let vA = a[this.sortColumn] || '';
      let vB = b[this.sortColumn] || '';
      if (typeof vA === 'string') vA = vA.toLowerCase();
      if (typeof vB === 'string') vB = vB.toLowerCase();
      if (vA < vB) return this.sortAsc ? -1 : 1;
      if (vA > vB) return this.sortAsc ? 1 : -1;
      return 0;
    });
    if (this.gridApi) {
      this.gridApi.setRowData(this.filteredJobs);
    }
  }

  openJob(job: any): void {
    this.pmService.getTaskById(job.task_id).subscribe({
      next: (res: any) => {
        this.selectedJob = (res.success && res.data) ? res.data : job;
        this.showJobDialog = true;
      },
      error: () => {
        this.selectedJob = job;
        this.showJobDialog = true;
      }
    });
  }

  openAddJob(): void {
    this.selectedJob = null;
    this.showJobDialog = true;
  }

  closeJobDialog(): void {
    this.showJobDialog = false;
    this.selectedJob = null;
  }

  onJobSaved(): void {
    this.showJobDialog = false;
    this.selectedJob = null;
    this.loadJobs();
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedJobIds = new Set(this.filteredJobs.map(j => j.task_id));
      this.gridApi?.selectAll();
    } else {
      this.selectedJobIds.clear();
      this.gridApi?.deselectAll();
    }
  }

  toggleSelectJob(jobId: number, event: any): void {
    event?.stopPropagation();
    if (this.selectedJobIds.has(jobId)) {
      this.selectedJobIds.delete(jobId);
    } else {
      this.selectedJobIds.add(jobId);
    }
  }

  isAllSelected(): boolean {
    return this.filteredJobs.length > 0 && this.selectedJobIds.size === this.filteredJobs.length;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  formatHours(val: any): string {
    const num = parseFloat(val) || 0;
    const h = Math.floor(num);
    const m = Math.round((num - h) * 60);
    return `${h} Hrs ${m} Mins`;
  }

  formatHoursCompact(val: any): string {
    const num = parseFloat(val) || 0;
    const h = Math.floor(num);
    const m = Math.round((num - h) * 60);
    return `${h}Hrs ${m} Mins`;
  }

  getProgressPercent(job: any): number {
    const logged = parseFloat(job.hours_logged) || 0;
    const est = parseFloat(job.estimated_hours) || 0;
    if (est > 0) return Math.min(100, Math.round((logged / est) * 100));
    return logged > 0 ? 100 : 0;
  }

  formatStatus(status: string): string {
    if (!status) return 'In-Progress';
    if (status === 'In Progress' || status === 'Active') return 'In-Progress';
    return status;
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('progress') || s.includes('active')) return 'badge-inprogress';
    if (s.includes('complete')) return 'badge-completed';
    if (s.includes('hold')) return 'badge-onhold';
    if (s.includes('todo') || s.includes('to do')) return 'badge-todo';
    return 'badge-default';
  }
}
