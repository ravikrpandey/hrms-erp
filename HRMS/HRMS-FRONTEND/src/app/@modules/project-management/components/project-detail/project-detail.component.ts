import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  projectId: any;
  project: any = null;
  loading: boolean = true;
  activeTab: 'overview' | 'tasks' | 'members' = 'overview';

  members: any[] = [];
  filteredMembers: any[] = [];
  memberSearchTerm: string = '';
  showAssignModal: boolean = false;
  allEmployees: any[] = [];
  selectedEmployeeId: any = null;
  selectedMemberRole: string = 'Member';
  assigningMember: boolean = false;

  memberRoles: string[] = [
    'Tech Lead',
    'Senior Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'QA Engineer',
    'UI/UX Designer',
    'DevOps Engineer',
    'Business Analyst',
    'Member'
  ];

  tasks: any[] = [];
  filteredTasks: any[] = [];
  taskSearchTerm: string = '';
  taskStatusFilter: string = 'All';
  showTaskModal: boolean = false;
  taskToEdit: any = null;
  showReviewModal: boolean = false;
  taskToReview: any = null;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pmService: ProjectManagementService,
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

    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.loadProject();
      this.loadEmployeesDropdown();
    }
  }

  loadProject(): void {
    this.loading = true;
    this.pmService.getProjectById(this.projectId).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.project = res.data;
          this.members = res.data.members || [];
          this.filteredMembers = [...this.members];
          this.tasks = res.data.tasks || [];
          this.applyTaskFilter();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching project:', err);
        this.toast.error('Failed to load project details');
      }
    });
  }

  loadEmployeesDropdown(): void {
    this.pmService.getEmployees().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.allEmployees = res.data.map((e: any) => {
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
      },
      error: (err) => console.error('Error loading employees dropdown:', err)
    });
  }

  setTab(tab: 'overview' | 'tasks' | 'members'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/master/project-management/projects']);
  }

  goToEdit(): void {
    this.router.navigate(['/master/project-management/projects/edit', this.projectId]);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  formatCurrency(val: any): string {
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

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Critical':
        return 'priority-critical';
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

  get completedTaskCount(): number {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  get pendingTaskCount(): number {
    return this.tasks.filter(t => t.status !== 'Completed').length;
  }

  get calculatedProgress(): number {
    if (!this.tasks || this.tasks.length === 0) {
      return this.project?.progress || 0;
    }
    return Math.round((this.completedTaskCount / this.tasks.length) * 100);
  }

  applyMemberSearch(): void {
    if (!this.memberSearchTerm.trim()) {
      this.filteredMembers = [...this.members];
    } else {
      const term = this.memberSearchTerm.toLowerCase();
      this.filteredMembers = this.members.filter(m =>
        (m.employee_name && m.employee_name.toLowerCase().includes(term)) ||
        (m.role_in_project && m.role_in_project.toLowerCase().includes(term)) ||
        (m.employee_email && m.employee_email.toLowerCase().includes(term))
      );
    }
  }

  openAssignModal(): void {
    this.selectedEmployeeId = null;
    this.selectedMemberRole = 'Member';
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedEmployeeId = null;
  }

  assignMember(): void {
    if (!this.selectedEmployeeId) {
      this.toast.warning('Please select an employee');
      return;
    }

    const employee = this.allEmployees.find(e => e.employee_id == this.selectedEmployeeId);
    if (!employee) return;

    this.assigningMember = true;
    const payload = {
      employee_id: employee.employee_id,
      employee_name: employee.name,
      employee_email: employee.email,
      department_name: employee.department,
      role_in_project: this.selectedMemberRole || 'Member'
    };

    this.pmService.addProjectMember(this.projectId, payload).subscribe({
      next: (res: any) => {
        this.assigningMember = false;
        this.closeAssignModal();
        this.toast.success('Team member assigned successfully');
        this.loadProject();
      },
      error: (err) => {
        this.assigningMember = false;
        console.error('Error assigning member:', err);
        this.toast.error(err.error?.message || 'Failed to assign team member');
      }
    });
  }

  removeMember(member: any): void {
    if (confirm(`Are you sure you want to remove ${member.employee_name} from this project?`)) {
      this.pmService.removeProjectMember(this.projectId, member.id).subscribe({
        next: (res: any) => {
          this.toast.success('Team member removed');
          this.loadProject();
        },
        error: (err) => {
          console.error('Error removing member:', err);
          this.toast.error('Failed to remove team member');
        }
      });
    }
  }

  applyTaskFilter(): void {
    let result = [...this.tasks];

    if (this.taskStatusFilter !== 'All') {
      result = result.filter(t => t.status === this.taskStatusFilter);
    }

    if (this.taskSearchTerm.trim()) {
      const term = this.taskSearchTerm.toLowerCase();
      result = result.filter(t =>
        (t.task_name && t.task_name.toLowerCase().includes(term)) ||
        (t.assigned_to_name && t.assigned_to_name.toLowerCase().includes(term))
      );
    }

    this.filteredTasks = result;
  }

  openAddTaskModal(): void {
    this.taskToEdit = null;
    this.showTaskModal = true;
  }

  openEditTask(task: any): void {
    this.taskToEdit = task;
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.taskToEdit = null;
  }

  onTaskSaved(): void {
    this.closeTaskModal();
    this.loadProject();
  }

  openReviewTask(task: any): void {
    this.taskToReview = task;
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.taskToReview = null;
  }

  onTaskReviewed(updatedTask: any): void {
    this.closeReviewModal();
    this.loadProject();
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
            this.loadProject();
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
        this.loadProject();
      },
      error: (err) => {
        console.error('Error completing task:', err);
        this.toast.error(err.error?.message || 'Failed to complete task');
      }
    });
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

  deleteTask(task: any, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete task "${task.task_name}"?`)) {
      this.pmService.deleteTask(task.task_id).subscribe({
        next: () => {
          this.toast.success('Task deleted successfully');
          this.loadProject();
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          this.toast.error('Failed to delete task');
        }
      });
    }
  }
}
