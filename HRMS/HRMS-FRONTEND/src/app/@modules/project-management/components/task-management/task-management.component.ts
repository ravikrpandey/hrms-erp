import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

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
  employees: any[] = [];

  showTaskDialog: boolean = false;
  editingTask: any = null;
  showReviewDialog: boolean = false;
  taskToReview: any = null;
  currentUser: any = null;

  statuses: string[] = ['All', 'To Do', 'In Progress', 'In Review', 'Completed'];
  priorities: string[] = ['All', 'Low', 'Medium', 'High', 'Urgent'];

  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  constructor(
    private pmService: ProjectManagementService,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('signInUser');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing signInUser:', e);
      }
    }

    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      if (params['project_id']) {
        this.selectedProjectId = params['project_id'];
      }
    });

    this.loadLookups();
    this.loadTasks();
  }

  loadLookups(): void {
    this.pmService.getAllProjects().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.projects = res.data;
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

  loadTasks(): void {
    this.loading = true;
    const params: any = {};
    if (this.selectedProjectId) params.project_id = this.selectedProjectId;
    if (this.selectedStatus && this.selectedStatus !== 'All') params.status = this.selectedStatus;
    if (this.selectedPriority && this.selectedPriority !== 'All') params.priority = this.selectedPriority;
    if (this.searchTerm) params.search = this.searchTerm;

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
        this.toast.error('Failed to load tasks');
      }
    });
  }

  setStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.loadTasks();
  }

  applyFilter(): void {
    let result = [...this.tasks];

    if (this.selectedStatus && this.selectedStatus !== 'All') {
      result = result.filter(t => t.status === this.selectedStatus);
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
    this.currentPage = 1;
  }

  get paginatedTasks(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTasks.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTasks.length / this.pageSize) || 1;
  }

  get totalCount(): number {
    return this.filteredTasks.length;
  }

  get startItemIndex(): number {
    if (this.totalCount === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItemIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalCount ? this.totalCount : end;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
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

  get completedCount(): number {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  openCreateTask(): void {
    this.editingTask = null;
    this.showTaskDialog = true;
  }

  openEditTask(task: any): void {
    this.editingTask = task;
    this.showTaskDialog = true;
  }

  closeTaskDialog(): void {
    this.showTaskDialog = false;
    this.editingTask = null;
  }

  onTaskSaved(): void {
    this.closeTaskDialog();
    this.loadTasks();
  }

  openReviewTask(task: any): void {
    this.taskToReview = task;
    this.showReviewDialog = true;
  }

  closeReviewDialog(): void {
    this.showReviewDialog = false;
    this.taskToReview = null;
  }

  onTaskReviewed(updatedTask: any): void {
    this.closeReviewDialog();
    this.loadTasks();
  }

  toggleTaskStatus(task: any): void {
    if (task.status === 'Completed') {
      if (confirm(`Do you want to reopen task "${task.task_name}" to In Progress?`)) {
        this.pmService.updateTask(task.task_id, { status: 'In Progress', progress: 50 }).subscribe({
          next: () => {
            task.status = 'In Progress';
            task.progress = 50;
            task.review_status = 'Pending';
            this.toast.success('Task reopened to In Progress');
            this.loadTasks();
          },
          error: (err) => {
            console.error('Error reopening task:', err);
            this.toast.error('Failed to reopen task');
          }
        });
      }
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

  deleteTask(task: any, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete task "${task.task_name}"?`)) {
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
      case 'Completed':
        return 'badge-completed';
      default:
        return 'badge-default';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Urgent':
        return 'priority-urgent';
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return 'priority-medium';
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
        return 'fa-check-circle text-success';
      case 'Submitted':
        return 'fa-clock-o text-primary';
      case 'Changes Requested':
        return 'fa-exclamation-circle text-danger';
      case 'Pending':
      default:
        return 'fa-shield text-muted';
    }
  }
}
