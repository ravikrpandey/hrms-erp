import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from 'ag-grid-community';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';
import { TaskActionCellComponent } from '../task-action-cell/task-action-cell.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  loading: boolean = false;

  searchTerm: string = '';
  selectedProjectId: any = '';
  selectedStatus: string = 'All';
  selectedPriority: string = 'All';

  projects: any[] = [];
  filteredToolbarProjects: any[] = [];
  employees: any[] = [];

  showTaskDialog: boolean = false;
  editingTask: any = null;
  showReviewDialog: boolean = false;
  taskToReview: any = null;
  showActivityDialog: boolean = false;
  taskForActivity: any = null;
  currentUser: any = null;

  statuses: string[] = ['All', 'To Do', 'In Progress', 'In Review', 'Waiting for Information', 'Completed', 'Overdue'];
  priorities: string[] = ['All', 'Low', 'Medium', 'High', 'Urgent'];

  pageSize: number = 10;
  pageSizeOptions: number[] = [7, 10, 25, 50];

  gridApi!: GridApi;
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    suppressMovable: true
  };

  constructor(
    private pmService: ProjectManagementService,
    private route: ActivatedRoute,
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

    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      if (params['project_id']) {
        this.selectedProjectId = params['project_id'];
      }
    });

    this.setupColumnDefs();
    this.loadLookups();
    this.loadTasks();
  }

  setupColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: '',
        field: 'status',
        width: 48,
        minWidth: 48,
        maxWidth: 48,
        sortable: false,
        filter: false,
        cellStyle: { 'justify-content': 'center', 'padding': '0' },
        cellRenderer: (params: any) => {
          if (!params.data) return '';
          const t = params.data;
          const isDone = t.status === 'Completed';
          const canReopen = this.canReopenTask(t);
          const disabled = isDone && !canReopen ? 'disabled' : '';
          const checked = isDone ? 'checked' : '';
          const title = isDone
            ? (canReopen ? 'Click to reopen task' : 'Reopening restricted to Head/Admin')
            : (t.review_status === 'Approved' ? 'Click to complete task' : 'Requires review approval before closing');
          return `<input type="checkbox" class="task-grid-checkbox" ${checked} ${disabled} title="${title}" />`;
        },
        onCellClicked: (params: any) => {
          if (params.event?.target?.tagName === 'INPUT') {
            this.toggleTaskStatus(params.data);
          }
        }
      },
      {
        headerName: 'TASK NAME',
        field: 'task_name',
        minWidth: 220,
        flex: 1.6,
        cellRenderer: (params: any) => {
          if (!params.data) return '—';
          const t = params.data;
          const isDone = t.status === 'Completed';
          const typeBadge = t.task_type ? `<span class="task-type-badge">${t.task_type}</span>` : '';
          const milestonePill = t.milestone_name ? `
            <span class="task-milestone-pill" title="Milestone: ${t.milestone_name}">
              <i class="fa fa-flag mr-1"></i>${t.milestone_name}
            </span>` : '';
          const desc = t.description ? `<small class="task-desc-text">${t.description}</small>` : '';
          return `
            <div class="task-name-cell ${isDone ? 'task-done' : ''}">
              <div class="d-flex align-items-center flex-wrap" style="gap: 5px;">
                ${typeBadge}
                <span class="task-title-link" title="Click to view/edit">${t.task_name}</span>
                ${milestonePill}
              </div>
              ${desc}
            </div>
          `;
        },
        onCellClicked: (params: any) => this.openEditTask(params.data)
      },
      {
        headerName: 'PROJECT',
        field: 'project_name',
        minWidth: 150,
        flex: 1.1,
        cellRenderer: (params: any) => {
          if (!params.data) return '—';
          const pName = params.value || ('Project #' + params.data.project_id);
          return `<span class="project-table-link"><i class="fa fa-folder-o mr-1"></i>${pName}</span>`;
        },
        onCellClicked: (params: any) => {
          if (params.data?.project_id) {
            window.location.href = `#/master/project-management/projects/${params.data.project_id}`;
          }
        }
      },
      {
        headerName: 'ASSIGNED TO',
        field: 'assigned_to_name',
        minWidth: 140,
        flex: 1.1,
        cellRenderer: (params: any) => {
          if (!params.value) return '<span class="text-muted">Unassigned</span>';
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
        headerName: 'REVIEWER',
        field: 'reviewer_name',
        minWidth: 140,
        flex: 1.1,
        cellRenderer: (params: any) => {
          if (!params.value) return '<span class="text-danger small"><i class="fa fa-warning mr-1"></i>Not assigned</span>';
          const initials = this.getInitials(params.value);
          return `
            <div class="manager-info">
              <span class="manager-avatar reviewer-avatar">${initials}</span>
              <span class="manager-name font-semibold">${params.value}</span>
            </div>
          `;
        }
      },
      {
        headerName: 'PRIORITY',
        field: 'priority',
        minWidth: 95,
        flex: 0.8,
        cellRenderer: (params: any) => {
          const raw = params.value || 'Medium';
          const val = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
          const cls = this.getPriorityClass(raw);
          return `<span class="priority-pill ${cls}">${val}</span>`;
        }
      },
      {
        headerName: 'CONSUMED HRS',
        field: 'consumed_hours',
        minWidth: 155,
        flex: 1.2,
        cellRenderer: (params: any) => {
          if (!params.data) return '—';
          const t = params.data;
          const rawHrs = t.consumed_hours !== undefined && t.consumed_hours !== null
            ? t.consumed_hours
            : (t.logged_hours || 0);
          const numHrs = typeof rawHrs === 'number' ? rawHrs : parseFloat(rawHrs || 0);
          const hrsText = Number.isInteger(numHrs) ? `${numHrs}` : numHrs.toFixed(2);

          let rangeText = '';
          if (numHrs > 0) {
            const start = t.first_log_date || t.start_date;
            const end = t.last_log_date || t.completed_date || (t.status === 'Completed' ? t.due_date : null);
            const startStr = start ? this.formatDate(start) : '-';
            const endStr = end ? this.formatDate(end) : (t.status === 'Completed' ? 'Completed' : '<span class="text-info font-weight-500">Ongoing</span>');
            rangeText = `${startStr} &rarr; ${endStr}`;
          } else {
            rangeText = '<span class="text-muted">No time logged</span>';
          }

          return `
            <div class="consumed-hrs-cell">
              <span class="consumed-hours-val">
                <i class="fa fa-clock-o mr-1 text-primary"></i>${hrsText} hrs
              </span>
              <small class="consumed-date-range text-muted">${rangeText}</small>
            </div>
          `;
        }
      },
      {
        headerName: 'DUE DATE',
        field: 'due_date',
        minWidth: 125,
        flex: 0.9,
        cellRenderer: (params: any) => {
          if (!params.data) return '—';
          const t = params.data;
          const isOverdue = this.isTaskOverdue(t);
          const overdueTag = isOverdue ? '<span class="overdue-tag">OVERDUE</span>' : '';
          return `
            <span class="timeline-date ${isOverdue ? 'overdue-date-text' : ''}">
              <i class="fa fa-calendar-o mr-1"></i>${this.formatDate(t.due_date)}
              ${overdueTag}
            </span>
          `;
        }
      },
      {
        headerName: 'STATUS',
        field: 'status',
        minWidth: 110,
        flex: 0.9,
        cellRenderer: (params: any) => {
          const val = params.value || 'To Do';
          const cls = this.getStatusClass(val);
          return `
            <span class="status-pill ${cls}">
              <span class="status-dot"></span>
              ${val}
            </span>
          `;
        }
      },
      {
        headerName: 'REVIEW STATUS',
        field: 'review_status',
        minWidth: 135,
        flex: 1.0,
        cellRenderer: (params: any) => {
          const val = params.value || 'Pending';
          const cls = this.getReviewStatusClass(val);
          const icon = this.getReviewStatusIcon(val);
          return `
            <span class="review-status-pill clickable-pill ${cls}" title="Click to view/perform review">
              <i class="${icon} mr-1"></i>${val}
            </span>
          `;
        },
        onCellClicked: (params: any) => this.openReviewTask(params.data)
      },
      {
        headerName: 'ACTIONS',
        field: 'task_id',
        sortable: false,
        filter: false,
        headerClass: 'header-align-center',
        cellStyle: { 'justify-content': 'center' },
        minWidth: 130,
        maxWidth: 155,
        flex: 0.9,
        cellClass: 'action-cell-renderer',
        cellRenderer: TaskActionCellComponent,
        cellRendererParams: {
          onReview: (t: any) => this.openReviewTask(t),
          onEdit: (t: any) => this.openEditTask(t),
          onDelete: (t: any, e: any) => this.deleteTask(t, e),
          canEdit: (t: any) => this.canEditTask(t),
          canDelete: (t: any) => this.canDeleteTask(t)
        }
      }
    ];
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    if (this.filteredTasks && this.filteredTasks.length > 0) {
      this.gridApi.setRowData(this.filteredTasks);
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

  loadLookups(): void {
    this.pmService.getAllProjects().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.projects = res.data.filter((p: any) => p.status !== 'Completed' && p.status !== 'Cancelled');
          this.filteredToolbarProjects = [...this.projects];
        }
      }
    });

    this.pmService.getEmployees().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.employees = res.data.map((e: any) => {
            const rawName = e.name || e.fullName || e.employee_name || `${e.first_name || ''} ${e.last_name || ''}`.trim();
            const displayName = rawName && rawName !== 'Employee' ? rawName : (e.employee_code ? `Employee (${e.employee_code})` : `Emp #${e.employee_id}`);
            const desig = e.designation || e.role_name || e.role_master_name || e.department || '';
            const empCode = e.employee_code || '';
            return {
              employee_id: e.employee_id,
              employee_code: empCode,
              name: displayName,
              email: e.email || e.official_email || e.employee_official_email || '',
              department: e.department || '',
              designation: desig,
              displayText: empCode ? `[${empCode}] ${displayName}${desig ? ' (' + desig + ')' : ''}` : `${displayName}${desig ? ' (' + desig + ')' : ''}`
            };
          });
        }
      }
    });
  }

  compareIds(o1: any, o2: any): boolean {
    return o1 == o2;
  }

  loadTasks(showLoader: boolean = true): void {
    if (showLoader) {
      this.loading = true;
    }
    const params: any = {};
    if (this.selectedProjectId) params.project_id = this.selectedProjectId;

    this.pmService.getAllTasks(params).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.tasks = res.data;
          this.applyFilter();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching tasks:', err);
        if (showLoader) {
          this.toast.error('Failed to load tasks');
        }
      }
    });
  }

  setStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  onFilterTextBoxChanged(): void {
    this.applyFilter();
  }

  onProjectChange(): void {
    this.applyFilter();
  }

  onPriorityChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.tasks];

    if (this.selectedStatus && this.selectedStatus !== 'All') {
      if (this.selectedStatus === 'Overdue') {
        const todayMs = new Date().setHours(0, 0, 0, 0);
        result = result.filter(t => t.status !== 'Completed' && t.due_date && new Date(t.due_date).getTime() < todayMs);
      } else {
        result = result.filter(t => t.status === this.selectedStatus);
      }
    }

    if (this.selectedPriority && this.selectedPriority !== 'All') {
      result = result.filter(t => t.priority === this.selectedPriority);
    }

    if (this.selectedProjectId) {
      result = result.filter(t => t.project_id == this.selectedProjectId);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(t =>
        (t.task_name && t.task_name.toLowerCase().includes(term)) ||
        (t.project_name && t.project_name.toLowerCase().includes(term)) ||
        (t.assigned_to_name && t.assigned_to_name.toLowerCase().includes(term))
      );
    }

    this.filteredTasks = result;
    if (this.gridApi) {
      this.gridApi.setRowData(this.filteredTasks);
      setTimeout(() => this.gridApi?.sizeColumnsToFit(), 30);
    }
  }

  onPageSizeChange(): void {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(this.pageSize));
    }
  }

  get allCount(): number {
    return this.tasks.length;
  }

  get todoCount(): number {
    return this.tasks.filter(t => t.status === 'To Do').length;
  }

  get inProgressCount(): number {
    return this.tasks.filter(t => t.status === 'In Progress').length;
  }

  get inReviewCount(): number {
    return this.tasks.filter(t => t.status === 'In Review').length;
  }

  get waitingForInfoCount(): number {
    return this.tasks.filter(t => t.status === 'Waiting for Information').length;
  }

  get overdueCount(): number {
    const todayMs = new Date().setHours(0, 0, 0, 0);
    return this.tasks.filter(t => t.status !== 'Completed' && t.due_date && new Date(t.due_date).getTime() < todayMs).length;
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  isTaskOverdue(task: any): boolean {
    if (!task || task.status === 'Completed' || !task.due_date) return false;
    const todayMs = new Date().setHours(0, 0, 0, 0);
    return new Date(task.due_date).getTime() < todayMs;
  }

  initialTaskDialogView: 'split' | 'details' | 'activity' | 'review' = 'split';

  openCreateTask(): void {
    this.editingTask = null;
    this.initialTaskDialogView = 'split';
    this.showTaskDialog = true;
  }

  openEditTask(task: any): void {
    this.editingTask = task;
    this.initialTaskDialogView = 'split';
    this.showTaskDialog = true;
  }

  closeTaskDialog(): void {
    this.showTaskDialog = false;
    this.editingTask = null;
  }

  onTaskSaved(): void {
    this.loadTasks();
  }

  openReviewTask(task: any): void {
    this.editingTask = task;
    this.initialTaskDialogView = 'review';
    this.showTaskDialog = true;
  }

  closeReviewDialog(): void {
    this.showReviewDialog = false;
    this.taskToReview = null;
  }

  openTaskActivity(task: any): void {
    this.editingTask = task;
    this.initialTaskDialogView = 'activity';
    this.showTaskDialog = true;
  }

  closeActivityDialog(): void {
    this.showActivityDialog = false;
    this.taskForActivity = null;
  }

  canEditTask(task: any): boolean {
    if (!this.currentUser) return false;
    const rId = Number(this.currentUser?.role_master_id || this.currentUser?.role_id);
    const rName = (this.currentUser?.role_name || this.currentUser?.role_master_name || '').toLowerCase();
    if (rId === 1 || rName.includes('admin') || rName.includes('super')) return true;
    const userEmpId = Number(this.currentUser?.employee_id || this.currentUser?.id);
    if (task?.project_manager_id && task.project_manager_id == userEmpId) return true;
    if (task?.created_by && task.created_by == userEmpId) return true;
    if (task?.project_creator_id && task.project_creator_id == userEmpId) return true;
    if (rName.includes('head') || rName.includes('creator')) return true;
    return false;
  }

  canDeleteTask(task: any): boolean {
    if (!this.currentUser) return false;
    const rId = Number(this.currentUser?.role_master_id || this.currentUser?.role_id);
    const rName = (this.currentUser?.role_name || this.currentUser?.role_master_name || '').toLowerCase();
    if (rId === 1 || rName.includes('admin') || rName.includes('super')) return true;
    const userEmpId = Number(this.currentUser?.employee_id || this.currentUser?.id);
    if (task?.project_manager_id && task.project_manager_id == userEmpId) return true;
    if (task?.created_by && task.created_by == userEmpId) return true;
    if (rName.includes('head') || rName.includes('creator')) return true;
    return false;
  }

  canReopenTask(task: any): boolean {
    if (!this.currentUser) return false;
    const rId = Number(this.currentUser?.role_master_id || this.currentUser?.role_id);
    const rName = (this.currentUser?.role_name || this.currentUser?.role_master_name || localStorage.getItem('role') || '').toLowerCase();
    if (rId === 1 || rName.includes('admin') || rName.includes('super')) return true;
    const userEmpId = Number(this.currentUser?.employee_id || this.currentUser?.id || localStorage.getItem('employee_id'));
    if (task?.project_manager_id && task.project_manager_id == userEmpId) return true;
    if (task?.supervisor_id && task.supervisor_id == userEmpId) return true;
    if (task?.created_by && task.created_by == userEmpId) return true;
    if (task?.project_creator_id && task.project_creator_id == userEmpId) return true;
    if (rName.includes('head')) return true;
    return false;
  }

  onTaskReviewed(updatedTask: any): void {
    this.closeReviewDialog();
    this.loadTasks();
  }

  toggleTaskStatus(task: any): void {
    if (task.status === 'Completed') {
      if (!this.canReopenTask(task)) {
        this.toast.error('Reopening completed tasks is not allowed for team members. Only Project Head or Admin can reopen tasks.');
        return;
      }
      Swal.fire({
        title: 'Reopen Task?',
        text: `Do you want to reopen task "${task.task_name}" to In Progress?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0c85c0',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, reopen',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.pmService.updateTask(task.task_id, { status: 'In Progress' }).subscribe({
            next: () => {
              task.status = 'In Progress';
              task.progress = 50;
              task.review_status = 'Pending';
              this.toast.success('Task reopened to In Progress');
              this.loadTasks();
            },
            error: (err) => {
              console.error('Error reopening task:', err);
              this.toast.error(err.error?.message || 'Failed to reopen task');
            }
          });
        }
      });
      return;
    }

    if (task.review_status !== 'Approved') {
      this.toast.info('Task cannot be closed until it is approved by the reviewer.');
      this.openReviewTask(task);
      return;
    }

    this.pmService.updateTask(task.task_id, { status: 'Completed', progress: 100 }).subscribe({
      next: () => {
        task.status = 'Completed';
        task.progress = 100;
        this.toast.success('Task marked as Completed');
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error completing task:', err);
        this.toast.error(err.error?.message || 'Failed to complete task');
      }
    });
  }

  deleteTask(task: any, event?: Event): void {
    if (event) event.stopPropagation();
    Swal.fire({
      title: 'Delete Task?',
      text: `Are you sure you want to delete task "${task.task_name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.pmService.deleteTask(task.task_id).subscribe({
          next: () => {
            this.toast.success('Task deleted successfully');
            this.loadTasks();
          },
          error: (err) => {
            console.error('Error deleting task:', err);
            this.toast.error('Failed to delete task');
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

  getInitials(name: string): string {
    if (!name) return 'TK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'To Do':
        return 'badge-todo';
      case 'In Progress':
        return 'badge-inprogress';
      case 'In Review':
        return 'badge-inreview';
      case 'Waiting for Information':
        return 'badge-waiting';
      case 'Completed':
        return 'badge-completed';
      default:
        return 'badge-default';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'urgent':
      case 'critical':
        return 'priority-urgent';
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'urgent':
      case 'critical':
        return 'fa fa-angle-double-up';
      case 'high':
        return 'fa fa-arrow-up';
      case 'medium':
        return 'fa fa-minus';
      case 'low':
        return 'fa fa-arrow-down';
      default:
        return 'fa fa-minus';
    }
  }

  getReviewStatusClass(reviewStatus: string): string {
    switch (reviewStatus) {
      case 'Approved':
        return 'review-status-approved';
      case 'Submitted':
        return 'review-status-submitted';
      case 'Changes Requested':
        return 'review-status-changes';
      case 'Pending':
      default:
        return 'review-status-pending';
    }
  }

  getReviewStatusIcon(reviewStatus: string): string {
    switch (reviewStatus) {
      case 'Approved':
        return 'fa fa-check-circle';
      case 'Submitted':
        return 'fa fa-clock-o';
      case 'Changes Requested':
        return 'fa fa-exclamation-circle';
      case 'Pending':
      default:
        return 'fa fa-clock-o';
    }
  }
}
