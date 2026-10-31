import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from 'ag-grid-community';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';
import { ProjectActionCellComponent } from '../project-action-cell/project-action-cell.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  departments: string[] = [];
  departmentsListObjects: { name: string }[] = [];
  filteredDepartmentsList: { name: string }[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  selectedStatus: string = 'All';
  selectedDepartment: string = 'All';

  allCount: number = 0;
  activeCount: number = 0;
  completedCount: number = 0;
  onHoldCount: number = 0;
  overdueCount: number = 0;

  pageSize: number = 10;
  pageSizeOptions: number[] = [7, 10, 25, 50];
  currentUser: any = null;

  gridApi!: GridApi;
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    suppressMovable: true
  };

  get isAdmin(): boolean {
    const rId = Number(
      this.currentUser?.role_master_id ||
      this.currentUser?.role_id ||
      localStorage.getItem('role_master_id')
    );
    const rName = (
      this.currentUser?.role_name ||
      this.currentUser?.role_master_name ||
      this.currentUser?.roles ||
      this.currentUser?.role ||
      ''
    ).toString().toLowerCase();
    return rId === 1 || rName.includes('admin') || rName.includes('super');
  }

  get canCreateProject(): boolean {
    if (this.isAdmin) return true;
    if (!this.currentUser) return false;
    const rName = (
      this.currentUser?.role_name ||
      this.currentUser?.role_master_name ||
      this.currentUser?.roles ||
      this.currentUser?.role ||
      localStorage.getItem('role') ||
      ''
    ).toString().toLowerCase();
    return rName.includes('project head') || rName.includes('head');
  }

  canEditProject(project: any): boolean {
    if (this.isAdmin) return true;
    if (!this.currentUser) return false;
    return (
      project.user_role === 'head' ||
      project.user_role === 'admin' ||
      project.project_manager_id == this.currentUser.employee_id ||
      project.created_by == this.currentUser.employee_id
    );
  }

  constructor(
    private pmService: ProjectManagementService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('signInUser');
    const detailsStr = localStorage.getItem('loginUserDetails');
    let user: any = {};
    if (detailsStr) {
      try { user = { ...user, ...JSON.parse(detailsStr) }; } catch (e) {}
    }
    if (userStr) {
      try { user = { ...user, ...JSON.parse(userStr) }; } catch (e) {}
    }
    if (Object.keys(user).length > 0) {
      this.currentUser = user;
    }

    this.setupColumnDefs();
    this.loadProjects();
  }

  setupColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: 'PROJECT NAME & CODE',
        field: 'project_name',
        minWidth: 230,
        flex: 1.7,
        cellRenderer: (params: any) => {
          if (!params.data) return '—';
          const p = params.data;
          const initials = this.getInitials(p.project_name);
          const code = p.project_code || ('PRJ-' + p.project_id);
          return `
            <div class="project-info-cell" title="Click to view details">
              <div class="project-avatar">${initials}</div>
              <div class="project-title-block">
                <span class="project-title-link">${p.project_name || '—'}</span>
                <span class="project-code-tag">${code}</span>
              </div>
            </div>
          `;
        },
        onCellClicked: (params: any) => this.goToDetail(params.data)
      },
      {
        headerName: 'CLIENT',
        field: 'client_name',
        minWidth: 130,
        flex: 1.0,
        valueFormatter: (params: any) => params.value || '—'
      },
      {
        headerName: 'DEPARTMENT',
        field: 'department_name',
        minWidth: 130,
        flex: 1.0,
        cellRenderer: (params: any) => {
          const val = params.value || 'General';
          return `<span class="dept-badge">${val}</span>`;
        }
      },
      {
        headerName: 'PROJECT HEAD',
        field: 'project_manager_name',
        minWidth: 150,
        flex: 1.1,
        cellRenderer: (params: any) => {
          if (!params.value) return '<span class="text-muted">—</span>';
          const initials = this.getInitials(params.value);
          return `
            <div class="manager-info">
              <span class="manager-avatar">${initials}</span>
              <span class="manager-name">${params.value}</span>
            </div>
          `;
        }
      },
      {
        headerName: 'BILLING',
        field: 'billing_method',
        minWidth: 110,
        flex: 0.9,
        cellRenderer: (params: any) => {
          const val = params.value || 'Fixed Cost';
          return `<span class="billing-tag">${val}</span>`;
        }
      },
      {
        headerName: 'TIMELINE',
        field: 'start_date',
        minWidth: 175,
        flex: 1.3,
        cellRenderer: (params: any) => {
          if (!params.data) return '—';
          const p = params.data;
          const dates = `${this.formatDate(p.start_date)} - ${this.formatDate(p.end_date)}`;
          const overdueBadge = p.is_overdue ? '<span class="badge-overdue">OVERDUE</span>' : '';
          return `
            <div class="timeline-wrapper">
              <span class="timeline-date"><i class="fa fa-calendar-o mr-1"></i>${dates}</span>
              ${overdueBadge}
            </div>
          `;
        }
      },
      {
        headerName: 'PROGRESS',
        field: 'progress',
        minWidth: 120,
        flex: 1.0,
        cellRenderer: (params: any) => {
          const prog = params.value || 0;
          let barClass = 'bg-info';
          if (prog === 100) barClass = 'bg-success';
          else if (prog === 0) barClass = 'bg-secondary';
          return `
            <div class="progress-bar-wrapper">
              <div class="progress" style="height: 6px; flex: 1;">
                <div class="progress-bar ${barClass}" style="width: ${prog}%;"></div>
              </div>
              <span class="progress-percentage">${prog}%</span>
            </div>
          `;
        }
      },
      {
        headerName: 'STATUS',
        field: 'status',
        minWidth: 120,
        flex: 0.9,
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
      },
      {
        headerName: 'ACTIONS',
        field: 'project_id',
        sortable: false,
        filter: false,
        headerClass: 'header-align-center',
        cellStyle: { 'justify-content': 'center' },
        minWidth: 115,
        maxWidth: 135,
        flex: 0.8,
        cellClass: 'action-cell-renderer',
        cellRenderer: ProjectActionCellComponent,
        cellRendererParams: {
          onView: (p: any) => this.goToDetail(p),
          onEdit: (p: any, e: any) => this.goToEdit(p, e),
          onDelete: (p: any, e: any) => this.deleteProject(p, e),
          canEdit: (p: any) => this.canEditProject(p),
          canDelete: () => this.isAdmin
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

  @HostListener('window:resize')
  onResize(): void {
    this.gridApi?.sizeColumnsToFit();
  }

  loadProjects(showLoader: boolean = true): void {
    if (showLoader) {
      this.loading = true;
    }
    this.pmService.getAllProjects().subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.projects = res.data;
          this.computeDepartments();
          this.computeCounts();
          this.applyFilter();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching projects:', err);
        if (showLoader) {
          this.toast.error('Failed to load projects');
        }
      }
    });
  }

  computeDepartments(): void {
    const deptSet = new Set<string>();
    this.projects.forEach(p => {
      if (p.department_name && p.department_name.trim()) {
        deptSet.add(p.department_name.trim());
      }
    });
    this.departments = Array.from(deptSet).sort();
    this.departmentsListObjects = this.departments.map(d => ({ name: d }));
    this.filteredDepartmentsList = [...this.departmentsListObjects];
  }

  computeCounts(): void {
    this.allCount = this.projects.length;
    this.activeCount = this.projects.filter(p => p.status === 'Active' || p.status === 'In Progress').length;
    this.completedCount = this.projects.filter(p => p.status === 'Completed').length;
    this.onHoldCount = this.projects.filter(p => p.status === 'On Hold').length;
    this.overdueCount = this.projects.filter(p => p.is_overdue).length;
  }

  setStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  onDepartmentChange(): void {
    this.applyFilter();
  }

  onFilterTextBoxChanged(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.projects];

    if (this.selectedStatus === 'Active') {
      result = result.filter(p => p.status === 'Active' || p.status === 'In Progress');
    } else if (this.selectedStatus === 'Completed') {
      result = result.filter(p => p.status === 'Completed');
    } else if (this.selectedStatus === 'On Hold') {
      result = result.filter(p => p.status === 'On Hold');
    } else if (this.selectedStatus === 'Overdue') {
      result = result.filter(p => p.is_overdue);
    }

    if (this.selectedDepartment !== 'All') {
      result = result.filter(p => p.department_name === this.selectedDepartment);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        (p.project_name && p.project_name.toLowerCase().includes(term)) ||
        (p.project_code && p.project_code.toLowerCase().includes(term)) ||
        (p.client_name && p.client_name.toLowerCase().includes(term)) ||
        (p.department_name && p.department_name.toLowerCase().includes(term)) ||
        (p.project_manager_name && p.project_manager_name.toLowerCase().includes(term))
      );
    }

    this.filteredProjects = result;
    if (this.gridApi) {
      this.gridApi.setRowData(this.filteredProjects);
      setTimeout(() => this.gridApi?.sizeColumnsToFit(), 30);
    }
  }

  onPageSizeChange(): void {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(this.pageSize));
    }
  }

  goToCreate(): void {
    this.router.navigate(['/master/project-management/projects/create']);
  }

  goToDetail(project: any): void {
    if (!project?.project_id) return;
    this.router.navigate(['/master/project-management/projects', project.project_id]);
  }

  goToEdit(project: any, event?: Event): void {
    if (event) event.stopPropagation();
    this.router.navigate(['/master/project-management/projects/edit', project.project_id]);
  }

  deleteProject(project: any, event?: Event): void {
    if (event) event.stopPropagation();
    Swal.fire({
      title: 'Delete Project?',
      text: `Are you sure you want to delete project "${project.project_name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.pmService.deleteProject(project.project_id).subscribe({
          next: () => {
            this.toast.success('Project deleted successfully');
            this.loadProjects();
          },
          error: (err) => {
            console.error('Error deleting project:', err);
            this.toast.error('Failed to delete project');
          }
        });
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  formatBudget(val: any): string {
    const num = parseFloat(val) || 0;
    return '₹' + num.toLocaleString('en-IN');
  }

  getInitials(name: string): string {
    if (!name) return 'PR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
      case 'In Progress':
        return 'badge-active';
      case 'Completed':
        return 'badge-completed';
      case 'On Hold':
        return 'badge-onhold';
      case 'Cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  }
}
