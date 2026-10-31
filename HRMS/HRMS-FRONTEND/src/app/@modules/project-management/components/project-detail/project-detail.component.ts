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
  activeTab: 'overview' | 'milestones' | 'tasks' | 'members' = 'overview';

  milestones: any[] = [];
  filteredMilestones: any[] = [];
  milestoneSearchTerm: string = '';
  milestoneStatusFilter: string = 'All';
  showMilestoneModal: boolean = false;
  milestoneToEdit: any = null;
  milestoneForm: any = {
    milestone_code: '',
    name: '',
    description: '',
    start_date: null,
    due_date: null,
    status: 'Not Started',
    display_order: 1
  };
  savingMilestone: boolean = false;
  selectedMilestoneForTasks: any = null;
  showMilestoneTasksModal: boolean = false;

  members: any[] = [];
  filteredMembers: any[] = [];
  memberSearchTerm: string = '';
  showAssignModal: boolean = false;
  allEmployees: any[] = [];
  filteredAssignEmployees: any[] = [];
  selectedEmployeeId: any = null;
  selectedMemberRole: string = 'Member';
  selectedMemberHourlyRate: number | null = null;
  editingMemberId: number | null = null;
  editingMemberRate: number | null = null;
  savingMemberRate: boolean = false;
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
  showActivityModal: boolean = false;
  taskForActivity: any = null;
  currentUser: any = null;

  get isProjectAdmin(): boolean {
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
      localStorage.getItem('role') ||
      ''
    ).toString().toLowerCase();
    return (
      rId === 1 ||
      rName.includes('admin') ||
      rName.includes('super') ||
      this.project?.user_role === 'admin'
    );
  }

  get isProjectHead(): boolean {
    if (this.isProjectAdmin) return true;
    if (!this.currentUser || !this.project) return false;
    const userEmpId = Number(this.currentUser?.employee_id || this.currentUser?.id || localStorage.getItem('employee_id'));
    const rName = (
      this.currentUser?.role_name ||
      this.currentUser?.role_master_name ||
      this.currentUser?.roles ||
      this.currentUser?.role ||
      localStorage.getItem('role') ||
      ''
    ).toString().toLowerCase();
    return (
      rName.includes('head') ||
      this.project.user_role === 'head' ||
      this.project.user_role === 'admin' ||
      this.project.project_manager_id == userEmpId ||
      this.project.supervisor_id == userEmpId ||
      this.project.created_by == userEmpId
    );
  }

  get isProjectHeadOrAdmin(): boolean {
    return this.isProjectHead;
  }

  get canEditProject(): boolean {
    return this.isProjectHead;
  }

  get canManageMembers(): boolean {
    return this.isProjectHead;
  }

  get canManageMilestones(): boolean {
    return this.isProjectHead;
  }

  get canDeleteTasks(): boolean {
    return this.isProjectHead;
  }

  canEditTask(task: any): boolean {
    if (this.isProjectHead) return true;
    const userEmpId = Number(this.currentUser?.employee_id || this.currentUser?.id);
    if (task && task.created_by && task.created_by == userEmpId) return true;
    return false;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pmService: ProjectManagementService,
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

    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.loadProject();
      this.loadEmployeesDropdown();
    }
  }

  loadProject(showLoader: boolean = true): void {
    if (showLoader) {
      this.loading = true;
    }
    this.pmService.getProjectById(this.projectId).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.project = res.data;
          this.members = res.data.members || [];
          this.applyMemberSearch();
          this.tasks = res.data.tasks || [];
          this.applyTaskFilter();
          this.milestones = res.data.milestones || [];
          this.applyMilestoneFilter();
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 403) {
          this.toast.error('You do not have permission to access this project');
          this.router.navigate(['/master/project-management/projects']);
        } else if (showLoader) {
          this.toast.error('Failed to load project details');
        }
      }
    });
  }

  loadMilestones(): void {
    if (!this.projectId) return;
    this.pmService.getProjectMilestones(this.projectId).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.milestones = res.data;
          this.applyMilestoneFilter();
        }
      },
      error: (err) => console.error('Error fetching milestones:', err)
    });
  }

  applyMilestoneFilter(): void {
    let list = [...this.milestones];
    if (this.milestoneStatusFilter && this.milestoneStatusFilter !== 'All') {
      list = list.filter(m => m.status === this.milestoneStatusFilter);
    }
    if (this.milestoneSearchTerm && this.milestoneSearchTerm.trim()) {
      const q = this.milestoneSearchTerm.trim().toLowerCase();
      list = list.filter(m =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.milestone_id || '').toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q)
      );
    }
    this.filteredMilestones = list;
  }

  openCreateMilestoneModal(): void {
    this.milestoneToEdit = null;
    const nextNum = this.milestones.length + 1;
    this.milestoneForm = {
      milestone_code: `MS-${String(nextNum).padStart(3, '0')}`,
      name: '',
      description: '',
      start_date: null,
      due_date: null,
      status: 'Not Started',
      display_order: nextNum
    };
    this.showMilestoneModal = true;
  }

  openEditMilestoneModal(milestone: any): void {
    this.milestoneToEdit = milestone;
    this.milestoneForm = {
      milestone_code: milestone.milestone_code || milestone.milestone_id || '',
      name: milestone.name || '',
      description: milestone.description || '',
      start_date: milestone.start_date ? milestone.start_date.substring(0, 10) : null,
      due_date: milestone.due_date ? milestone.due_date.substring(0, 10) : null,
      status: milestone.status || 'Not Started',
      display_order: milestone.display_order !== undefined ? milestone.display_order : 0
    };
    this.showMilestoneModal = true;
  }

  closeMilestoneModal(): void {
    this.showMilestoneModal = false;
    this.milestoneToEdit = null;
  }

  saveMilestone(): void {
    if (!this.milestoneForm.name || !this.milestoneForm.name.trim()) {
      this.toast.warning('Milestone Name is required');
      return;
    }
    if (!this.milestoneForm.milestone_code || !this.milestoneForm.milestone_code.trim()) {
      this.toast.warning('Milestone Code is required');
      return;
    }
    this.savingMilestone = true;
    const payload = {
      milestone_code: this.milestoneForm.milestone_code.trim(),
      milestone_id: this.milestoneForm.milestone_code.trim(),
      name: this.milestoneForm.name.trim(),
      description: this.milestoneForm.description?.trim() || '',
      start_date: this.milestoneForm.start_date || null,
      due_date: this.milestoneForm.due_date || null,
      status: this.milestoneForm.status || 'Not Started',
      display_order: parseInt(this.milestoneForm.display_order, 10) || 0
    };

    if (this.milestoneToEdit) {
      this.pmService.updateProjectMilestone(this.projectId, this.milestoneToEdit.id, payload).subscribe({
        next: (res: any) => {
          this.savingMilestone = false;
          this.showMilestoneModal = false;
          this.toast.success(res.message || 'Milestone updated successfully');
          this.loadMilestones();
          this.loadProject();
        },
        error: (err: any) => {
          this.savingMilestone = false;
          this.toast.error(err.error?.message || 'Failed to update milestone');
        }
      });
    } else {
      this.pmService.createProjectMilestone(this.projectId, payload).subscribe({
        next: (res: any) => {
          this.savingMilestone = false;
          this.showMilestoneModal = false;
          this.toast.success(res.message || 'Milestone created successfully');
          this.loadMilestones();
          this.loadProject();
        },
        error: (err: any) => {
          this.savingMilestone = false;
          this.toast.error(err.error?.message || 'Failed to create milestone');
        }
      });
    }
  }

  deleteMilestone(milestone: any): void {
    if (!confirm(`Are you sure you want to delete milestone "${milestone.name}"?`)) {
      return;
    }
    this.pmService.deleteProjectMilestone(this.projectId, milestone.id).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Milestone deleted successfully');
        this.loadMilestones();
        this.loadProject();
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Failed to delete milestone');
      }
    });
  }

  moveMilestoneUp(milestone: any, event?: Event): void {
    if (event) event.stopPropagation();
    const idx = this.filteredMilestones.findIndex(m => m.id === milestone.id);
    if (idx <= 0) return;
    const prev = this.filteredMilestones[idx - 1];
    const prevOrder = prev.display_order || idx;
    const currOrder = milestone.display_order || (idx + 1);
    const orders = [
      { id: milestone.id, display_order: prevOrder },
      { id: prev.id, display_order: currOrder }
    ];
    this.pmService.reorderProjectMilestones(this.projectId, orders).subscribe({
      next: () => this.loadMilestones(),
      error: () => this.loadMilestones()
    });
  }

  moveMilestoneDown(milestone: any, event?: Event): void {
    if (event) event.stopPropagation();
    const idx = this.filteredMilestones.findIndex(m => m.id === milestone.id);
    if (idx < 0 || idx >= this.filteredMilestones.length - 1) return;
    const next = this.filteredMilestones[idx + 1];
    const nextOrder = next.display_order || (idx + 2);
    const currOrder = milestone.display_order || (idx + 1);
    const orders = [
      { id: milestone.id, display_order: nextOrder },
      { id: next.id, display_order: currOrder }
    ];
    this.pmService.reorderProjectMilestones(this.projectId, orders).subscribe({
      next: () => this.loadMilestones(),
      error: () => this.loadMilestones()
    });
  }

  openMilestoneTasksModal(milestone: any): void {
    this.selectedMilestoneForTasks = milestone;
    this.showMilestoneTasksModal = true;
  }

  closeMilestoneTasksModal(): void {
    this.showMilestoneTasksModal = false;
    this.selectedMilestoneForTasks = null;
  }

  getMilestoneTasks(milestone: any): any[] {
    if (!milestone) return [];
    if (Array.isArray(milestone.tasks) && milestone.tasks.length > 0) {
      return milestone.tasks;
    }
    return this.tasks.filter(
      t => t.milestone_id && (t.milestone_id == milestone.id || t.milestone_id == milestone.milestone_id || t.milestone_id == milestone.milestone_code)
    );
  }

  openAddTaskForMilestone(milestone: any): void {
    this.closeMilestoneTasksModal();
    this.taskToEdit = {
      project_id: this.projectId,
      project_name: this.project?.project_name,
      milestone_id: milestone.id,
      milestone_name: milestone.name
    };
    this.showTaskModal = true;
  }

  getMilestoneStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-inprogress';
      case 'Blocked':
        return 'status-blocked';
      case 'Not Started':
      case 'Pending':
      default:
        return 'status-pending';
    }
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
          this.filteredAssignEmployees = [...this.allEmployees];
        }
      },
      error: (err) => console.error('Error loading employees dropdown:', err)
    });
  }

  getMemberDepartment(m: any): string {
    return m.department_name || m.department || '-';
  }

  setTab(tab: 'overview' | 'milestones' | 'tasks' | 'members'): void {
    this.activeTab = tab;
    if (this.projectId) {
      this.loadProject(false);
      this.loadMilestones();
    }
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
      case 'To Do':
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

  get completedMilestonesCount(): number {
    return this.milestones.filter(m => m.status === 'Completed').length;
  }

  get overdueTasksCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.tasks.filter(t => t.status !== 'Completed' && t.due_date && new Date(t.due_date) < today).length;
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
    const existingIds = this.project?.members?.map((m: any) => m.employee_id) || [];
    this.filteredAssignEmployees = this.allEmployees.filter(
      e => !existingIds.includes(e.employee_id)
    );
    this.selectedEmployeeId = null;
    this.selectedMemberRole = 'Member';
    this.selectedMemberHourlyRate = null;
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedEmployeeId = null;
    this.selectedMemberHourlyRate = null;
  }

  assignMember(): void {
    if (!this.selectedEmployeeId) {
      this.toast.warning('Please select an employee');
      return;
    }

    const employee = this.allEmployees.find(e => e.employee_id == this.selectedEmployeeId);
    if (!employee) return;

    this.assigningMember = true;
    const payload: any = {
      employee_id: employee.employee_id,
      employee_name: employee.name,
      employee_email: employee.email,
      department_name: employee.department,
      role_in_project: this.selectedMemberRole || 'Member'
    };

    if (this.selectedMemberHourlyRate !== null && this.selectedMemberHourlyRate !== undefined && this.selectedMemberHourlyRate !== ('' as any)) {
      payload.hourly_rate = Number(this.selectedMemberHourlyRate);
    }

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

  startEditMemberRate(member: any): void {
    this.editingMemberId = member.id;
    this.editingMemberRate = member.hourly_rate !== null && member.hourly_rate !== undefined ? Number(member.hourly_rate) : null;
  }

  cancelEditMemberRate(): void {
    this.editingMemberId = null;
    this.editingMemberRate = null;
  }

  saveMemberRate(member: any): void {
    if (this.editingMemberRate !== null && this.editingMemberRate !== undefined && Number(this.editingMemberRate) < 0) {
      this.toast.warning('Hourly rate cannot be negative');
      return;
    }
    this.savingMemberRate = true;
    const rateVal = (this.editingMemberRate !== null && this.editingMemberRate !== undefined && this.editingMemberRate !== ('' as any))
      ? Number(this.editingMemberRate)
      : null;

    this.pmService.updateProjectMember(this.projectId, member.id, { hourly_rate: rateVal }).subscribe({
      next: (res: any) => {
        this.savingMemberRate = false;
        member.hourly_rate = rateVal;
        this.cancelEditMemberRate();
        this.toast.success('Member hourly rate updated successfully');
      },
      error: (err: any) => {
        this.savingMemberRate = false;
        console.error('Error updating member rate:', err);
        this.toast.error(err.error?.message || 'Failed to update member hourly rate');
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

  initialTaskDialogView: 'split' | 'details' | 'activity' | 'review' = 'split';

  openAddTaskModal(): void {
    this.taskToEdit = null;
    this.initialTaskDialogView = 'split';
    this.showTaskModal = true;
  }

  openEditTask(task: any): void {
    this.taskToEdit = task;
    this.initialTaskDialogView = 'split';
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.taskToEdit = null;
  }

  onTaskSaved(): void {
    this.loadProject();
  }

  openReviewTask(task: any): void {
    this.taskToEdit = task;
    this.initialTaskDialogView = 'review';
    this.showTaskModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.taskToReview = null;
  }

  openTaskActivity(task: any): void {
    this.taskToEdit = task;
    this.initialTaskDialogView = 'activity';
    this.showTaskModal = true;
  }

  closeTaskActivity(): void {
    this.showActivityModal = false;
    this.taskForActivity = null;
  }

  onActivityUpdated(): void {
    this.loadProject();
  }

  onTaskReviewed(updatedTask: any): void {
    this.closeReviewModal();
    this.loadProject();
  }

  toggleTaskStatus(task: any): void {
    if (task.status === 'Completed') {
      if (!this.isProjectHeadOrAdmin) {
        this.toast.error('Reopening completed tasks is not allowed for team members. Only Project Head or Admin can reopen tasks.');
        return;
      }
      if (confirm(`Do you want to reopen task "${task.task_name}" to In Progress?`)) {
        this.pmService.updateTask(task.task_id, { status: 'In Progress' }).subscribe({
          next: () => {
            task.status = 'In Progress';
            task.progress = 50;
            task.review_status = 'Pending';
            this.toast.success('Task reopened to In Progress');
            this.loadProject();
          },
          error: (err) => {
            console.error('Error reopening task:', err);
            this.toast.error(err.error?.message || 'Failed to reopen task');
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
