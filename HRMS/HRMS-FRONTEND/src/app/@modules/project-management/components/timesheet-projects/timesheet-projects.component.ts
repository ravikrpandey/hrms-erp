import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from 'ag-grid-community';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timesheet-projects',
  templateUrl: './timesheet-projects.component.html',
  styleUrls: ['./timesheet-projects.component.scss']
})
export class TimesheetProjectsComponent implements OnInit {
  employeeId: any = null;
  currentUser: any = null;
  projects: any[] = [];
  filteredProjects: any[] = [];
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
  selectedFilter: string = 'Projects';
  selectedProjectIds: Set<number> = new Set();

  selectedProject: any = null;
  projectJobs: any[] = [];
  projectMembers: any[] = [];
  showProjectModal: boolean = false;
  loadingProjectDetails: boolean = false;

  selectedJobForDialog: any = null;
  showTaskDialog: boolean = false;

  sortColumn: string = '';
  sortAsc: boolean = true;

  showFilterPanel: boolean = false;
  showMoreMenu: boolean = false;

  filterProjectName: string = 'All';
  filterClient: string = 'All Clients';
  filterProjectHead: string = 'All Users';
  filterProjectManager: string = 'All Users';
  filterAssignedTo: string = '';
  filterStatus: string = 'In-Progress';

  get canCreateProject(): boolean {
    if (!this.currentUser) return false;
    const rId = Number(this.currentUser.role_master_id || this.currentUser.role_id || localStorage.getItem('role_master_id'));
    const role = (this.currentUser.role_master_name || this.currentUser.roles || this.currentUser.role || localStorage.getItem('role') || '').toLowerCase();
    return rId === 1 ||
           this.currentUser.employee_id === 1 ||
           role.includes('admin') ||
           role.includes('super') ||
           role.includes('project head') ||
           role.includes('head');
  }

  constructor(
    private pmService: ProjectManagementService,
    private router: Router,
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
    this.loadProjects();
    this.loadAllProjectsList();
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
        headerName: 'PROJECT NAME',
        field: 'project_name',
        minWidth: 200,
        flex: 1.8,
        cellRenderer: (params: any) => {
          if (!params.value) return '—';
          return `<span class="project-title-link" title="Click to view details">${params.value}</span>`;
        },
        onCellClicked: (params: any) => {
          if (params.data) this.openProject(params.data);
        }
      },
      {
        headerName: 'ESTIMATED HOURS',
        field: 'estimated_hours',
        minWidth: 140,
        flex: 1.0,
        valueFormatter: (params: any) => {
          return (params.value && params.value > 0) ? this.formatHours(params.value) : '—';
        }
      },
      {
        headerName: 'LOGGED HOURS',
        field: 'hours_logged',
        minWidth: 140,
        flex: 1.1,
        cellRenderer: (params: any) => {
          const hours = params.value;
          if (!hours || hours <= 0) return '—';
          const text = this.formatHoursCompact(hours);
          return `
            <div class="logged-hours-cell">
              <span class="logged-text">${text}</span>
              <div class="progress-track">
                <div class="progress-fill" style="width: 100%;"></div>
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
        headerName: 'JOBS',
        field: 'jobs_count',
        minWidth: 80,
        maxWidth: 100,
        flex: 0.8,
        headerClass: 'header-align-center',
        cellStyle: { 'justify-content': 'center' },
        cellRenderer: (params: any) => {
          const count = params.value || 0;
          return `
            <div class="zoho-badge-icon" title="${count} Jobs">
              <i class="fa fa-briefcase briefcase-icon"></i>
              <span class="badge-count">${count}</span>
            </div>
          `;
        },
        onCellClicked: (params: any) => {
          if (params.data) this.openProject(params.data);
        }
      }
    ];
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    if (this.filteredProjects && this.filteredProjects.length > 0) {
      this.gridApi.setRowData(this.filteredProjects);
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
    this.selectedProjectIds = new Set(selectedRows.map(r => r.project_id));
  }

  loadProjects(): void {
    if (!this.employeeId) return;
    this.loading = true;
    this.pmService.getProjectsSummary(this.employeeId).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.projects = res.data;
          this.applyFilter();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching projects summary:', err);
        this.toast.error('Failed to load projects');
      }
    });
  }

  loadAllProjectsList(): void {
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

  get projectNames(): string[] {
    return Array.from(new Set((this.projects || []).map(p => p.project_name).filter(Boolean)));
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
    this.filterProjectName = 'All';
    this.filterClient = 'All Clients';
    this.filterProjectHead = 'All Users';
    this.filterProjectManager = 'All Users';
    const empName = this.currentUser?.employee_name || this.currentUser?.first_name || 'Ravi Pandey';
    this.filterAssignedTo = `${this.employeeId || 1} ${empName}`;
    this.filterStatus = 'In-Progress';
    this.showFilterPanel = false;
    this.applyFilter();
  }

  onImportClick(): void {
    this.showMoreMenu = false;
    const input = document.getElementById('projectsImportInput') as HTMLInputElement;
    if (input) input.click();
  }

  onExportClick(): void {
    this.showMoreMenu = false;
    if (!this.filteredProjects || this.filteredProjects.length === 0) {
      this.toast.info('No projects available to export.');
      return;
    }
    const headers = ['Project Name', 'Project Code', 'Estimated Hours', 'Logged Hours', 'Status', 'Jobs Count'];
    const rows = this.filteredProjects.map(p => [
      `"${p.project_name || ''}"`,
      `"${p.project_code || ''}"`,
      `"${p.estimated_hours || '-'}"`,
      `"${p.hours_logged || '-'}"`,
      `"${this.formatStatus(p.status)}"`,
      `"${p.jobs_count || 0}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Projects_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.success('Projects exported successfully');
  }

  handleFileImport(event: any): void {
    const file = event.target?.files?.[0];
    if (!file) return;
    this.toast.info(`Importing projects file: ${file.name}`);
    this.loadProjects();
  }

  applyFilter(): void {
    let result = [...this.projects];
    if (this.filterProjectName && this.filterProjectName !== 'All') {
      result = result.filter(p => p.project_name === this.filterProjectName);
    }
    if (this.filterStatus && this.filterStatus !== 'All') {
      result = result.filter(p => {
        const s = (p.status || '').toLowerCase().replace(/[\s-_]/g, '');
        const target = this.filterStatus.toLowerCase().replace(/[\s-_]/g, '');
        if (target === 'inprogress') {
          return s === 'inprogress' || s === 'active';
        }
        return s === target;
      });
    }
    this.filteredProjects = result;
    if (this.sortColumn) {
      this.sortData();
    }
    if (this.gridApi) {
      this.gridApi.setRowData(this.filteredProjects);
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
    this.filteredProjects.sort((a, b) => {
      let vA = a[this.sortColumn] || '';
      let vB = b[this.sortColumn] || '';
      if (typeof vA === 'string') vA = vA.toLowerCase();
      if (typeof vB === 'string') vB = vB.toLowerCase();
      if (vA < vB) return this.sortAsc ? -1 : 1;
      if (vA > vB) return this.sortAsc ? 1 : -1;
      return 0;
    });
    if (this.gridApi) {
      this.gridApi.setRowData(this.filteredProjects);
    }
  }

  openProject(project: any): void {
    this.selectedProject = project;
    this.showProjectModal = true;
    this.loadingProjectDetails = true;
    this.projectJobs = [];
    this.projectMembers = [];

    this.pmService.getProjectById(project.project_id).subscribe({
      next: (res: any) => {
        this.loadingProjectDetails = false;
        if (res.success && res.data) {
          this.selectedProject = { ...project, ...res.data };
          this.projectJobs = res.data.tasks || [];
          this.projectMembers = res.data.members || [];
        }
      },
      error: () => {
        this.loadingProjectDetails = false;
      }
    });
  }

  goToFullProject(project: any): void {
    this.showProjectModal = false;
    this.router.navigate(['/master/project-management/projects', project.project_id]);
  }

  openAddProject(): void {
    this.router.navigate(['/master/project-management/projects/create']);
  }

  closeProjectModal(): void {
    this.showProjectModal = false;
    this.selectedProject = null;
  }

  openJobInDialog(job: any): void {
    this.pmService.getTaskById(job.task_id).subscribe({
      next: (res: any) => {
        this.selectedJobForDialog = (res.success && res.data) ? res.data : job;
        this.showTaskDialog = true;
      },
      error: () => {
        this.selectedJobForDialog = job;
        this.showTaskDialog = true;
      }
    });
  }

  closeTaskDialog(): void {
    this.showTaskDialog = false;
    this.selectedJobForDialog = null;
  }

  onTaskSaved(): void {
    this.showTaskDialog = false;
    this.selectedJobForDialog = null;
    if (this.selectedProject) {
      this.openProject(this.selectedProject);
    }
    this.loadProjects();
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedProjectIds = new Set(this.filteredProjects.map(p => p.project_id));
      this.gridApi?.selectAll();
    } else {
      this.selectedProjectIds.clear();
      this.gridApi?.deselectAll();
    }
  }

  toggleSelectProject(projectId: number, event: any): void {
    event?.stopPropagation();
    if (this.selectedProjectIds.has(projectId)) {
      this.selectedProjectIds.delete(projectId);
    } else {
      this.selectedProjectIds.add(projectId);
    }
  }

  isAllSelected(): boolean {
    return this.filteredProjects.length > 0 && this.selectedProjectIds.size === this.filteredProjects.length;
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

  formatStatus(status: string): string {
    if (!status) return 'In-Progress';
    if (status === 'Active' || status === 'In Progress') return 'In-Progress';
    return status;
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('progress') || s.includes('active')) return 'badge-inprogress';
    if (s.includes('complete')) return 'badge-completed';
    if (s.includes('hold')) return 'badge-onhold';
    return 'badge-default';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
}
