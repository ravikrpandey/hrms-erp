import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() projectId: any = null;
  @Input() projectName: string = '';
  @Input() task: any = null;
  @Input() employees: any[] = [];
  @Input() projects: any[] = [];
  @Input() currentUser: any = null;
  @Input() canEdit: boolean = true;
  @Input() isProjectHeadOrAdmin: boolean = false;

  @Input() initialView: 'split' | 'details' | 'activity' | 'review' = 'split';

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();
  @Output() reviewed = new EventEmitter<any>();

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  filteredProjects: any[] = [];
  filteredAssignees: any[] = [];
  filteredReviewers: any[] = [];
  projectAssignees: any[] = [];
  milestones: any[] = [];
  minStartDate: Date = new Date();

  taskForm!: FormGroup;
  submitting: boolean = false;
  taskTypes: string[] = ['Task', 'Feature', 'Bug', 'Support', 'Documentation', 'Other'];
  priorities: string[] = ['Low', 'Medium', 'High', 'Urgent'];
  statuses: string[] = ['To Do', 'In Progress', 'In Review', 'Waiting for Information', 'Completed'];

  currentUserId: any = null;
  activities: any[] = [];
  activityLoading: boolean = false;
  commentSubmitting: boolean = false;
  newCommentMessage: string = '';
  activeActivityTab: string = 'ALL';
  autoScrollEnabled: boolean = true;
  activeDialogView: 'split' | 'details' | 'activity' | 'review' = 'split';
  reviewSubmitting: boolean = false;
  reviewCommentsInput: string = '';
  private shouldScrollBottom: boolean = false;

  constructor(
    private fb: FormBuilder,
    private pmService: ProjectManagementService,
    private toast: ToastrService
  ) {}

  compareIds(o1: any, o2: any): boolean {
    return o1 == o2;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] || changes['employees']) {
      this.syncFilterLists();
    }
    if (changes['task'] && !changes['task'].firstChange) {
      this.populateTaskData();
    }
    if (changes['initialView'] && changes['initialView'].currentValue) {
      this.activeDialogView = changes['initialView'].currentValue;
    }
  }

  syncFilterLists(): void {
    const rawProjects = Array.isArray(this.projects) ? this.projects : [];
    this.filteredProjects = rawProjects.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled');
    this.filteredReviewers = Array.isArray(this.employees) ? [...this.employees] : [];
    
    const activePId = this.taskForm?.get('project_id')?.value || this.projectId;
    if (activePId) {
      this.loadProjectAssignees(activePId);
    } else {
      this.filteredAssignees = [];
    }
  }

  get canReopen(): boolean {
    if (this.isProjectHeadOrAdmin) return true;
    const rName = (
      this.currentUser?.role_name ||
      this.currentUser?.role_master_name ||
      this.currentUser?.roles ||
      this.currentUser?.role ||
      localStorage.getItem('role') ||
      ''
    ).toString().toLowerCase();
    return rName.includes('admin') || rName.includes('super') || rName.includes('head');
  }

  ngOnInit(): void {
    this.minStartDate = new Date();
    this.minStartDate.setHours(0, 0, 0, 0);

    const userStr = localStorage.getItem('signInUser');
    if (this.currentUser?.employee_id) {
      this.currentUserId = this.currentUser.employee_id;
    } else if (userStr) {
      try {
        const u = JSON.parse(userStr);
        this.currentUserId = u.employee_id;
      } catch (e) {}
    }

    if (this.initialView) {
      this.activeDialogView = this.initialView;
    }

    this.initForm();
    this.syncFilterLists();
    this.populateTaskData();
  }

  populateTaskData(): void {
    if (!this.taskForm) return;

    if (this.task) {
      if (this.initialView) {
        this.activeDialogView = this.initialView;
      }
      this.reviewCommentsInput = '';
      this.taskForm.enable();
      let tType = this.task.task_type || 'Task';
      let otherType = '';
      if (tType.startsWith('Other:')) {
        otherType = tType.replace('Other:', '').trim();
        tType = 'Other';
      } else if (!this.taskTypes.includes(tType)) {
        otherType = tType;
        tType = 'Other';
      }

      this.taskForm.patchValue({
        project_id: this.task.project_id,
        project_name: this.task.project_name,
        task_name: this.task.task_name,
        task_type: tType,
        other_task_type: otherType,
        milestone_id: this.task.milestone_id || null,
        milestone_name: this.task.milestone_name || '',
        description: this.task.description,
        assigned_to_id: this.task.assigned_to_id,
        assigned_to_name: this.task.assigned_to_name,
        assigned_to_email: this.task.assigned_to_email,
        reviewer_id: this.task.reviewer_id,
        reviewer_name: this.task.reviewer_name,
        reviewer_email: this.task.reviewer_email,
        priority: this.task.priority || 'Medium',
        status: this.task.status || 'To Do',
        start_date: this.task.start_date ? new Date(this.task.start_date) : null,
        due_date: this.task.due_date ? new Date(this.task.due_date) : null,
        estimated_hours: this.task.estimated_hours || 0,
        progress: this.task.progress || 0
      });
      this.loadProjectAssignees(this.task.project_id);
      this.loadProjectMilestones(this.task.project_id);
      this.loadActivities();
      if (!this.canEdit) {
        this.taskForm.disable();
      }
    } else {
      this.taskForm.enable();
      this.activities = [];
      this.activeDialogView = 'split';
      this.reviewCommentsInput = '';
      this.initForm();
      if (this.projectId) {
        this.taskForm.patchValue({
          project_id: this.projectId,
          project_name: this.projectName,
          start_date: new Date()
        });
        this.autoSelectProjectReviewer(this.projectId);
        this.loadProjectAssignees(this.projectId);
        this.loadProjectMilestones(this.projectId);
      }
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollBottom && this.autoScrollEnabled) {
      this.scrollToBottom();
      this.shouldScrollBottom = false;
    }
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      project_id: [this.projectId, [Validators.required]],
      project_name: [this.projectName],
      task_name: ['', [Validators.required]],
      task_type: ['Task'],
      other_task_type: [''],
      milestone_id: [null],
      milestone_name: [''],
      description: [''],
      assigned_to_id: [null],
      assigned_to_name: [''],
      assigned_to_email: [''],
      reviewer_id: [null, [Validators.required]],
      reviewer_name: [''],
      reviewer_email: [''],
      priority: ['Medium'],
      status: ['To Do'],
      start_date: [new Date(), [Validators.required]],
      due_date: [null],
      estimated_hours: [0],
      progress: [0]
    });
  }

  loadProjectAssignees(pId: any): void {
    if (!pId) {
      this.projectAssignees = [];
      this.filteredAssignees = [];
      return;
    }
    this.pmService.getProjectById(pId).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const prj = res.data;
          const list: any[] = [];
          const seen = new Set();
          if (prj.project_manager_id) {
            seen.add(Number(prj.project_manager_id));
            list.push({
              employee_id: prj.project_manager_id,
              name: prj.project_manager_name,
              email: prj.project_manager_email,
              displayText: `${prj.project_manager_name} (Project Head)`
            });
          }
          if (Array.isArray(prj.members)) {
            prj.members.forEach((m: any) => {
              const empId = Number(m.employee_id);
              if (!seen.has(empId)) {
                seen.add(empId);
                list.push({
                  employee_id: m.employee_id,
                  name: m.employee_name,
                  email: m.employee_email,
                  displayText: m.employee_name ? `${m.employee_name} (${m.role_in_project || 'Member'})` : `Employee #${m.employee_id}`
                });
              }
            });
          }
          this.projectAssignees = list;
          this.filteredAssignees = [...list];

          const currAssignee = this.taskForm.get('assigned_to_id')?.value;
          if (currAssignee && !seen.has(Number(currAssignee))) {
            this.taskForm.patchValue({ assigned_to_id: null, assigned_to_name: '', assigned_to_email: '' });
          }
        }
      },
      error: () => {
        this.projectAssignees = [];
        this.filteredAssignees = [];
      }
    });
  }

  autoSelectProjectReviewer(pId: any): void {
    const selected = this.projects.find(p => p.project_id == pId);
    if (selected && selected.project_manager_id) {
      this.taskForm.patchValue({
        reviewer_id: selected.project_manager_id,
        reviewer_name: selected.project_manager_name,
        reviewer_email: selected.project_manager_email
      });
    }
  }

  loadProjectMilestones(pId: any): void {
    if (!pId) {
      this.milestones = [];
      return;
    }
    this.pmService.getProjectMilestones(pId).subscribe({
      next: (res: any) => {
        if (res && res.success && Array.isArray(res.data)) {
          this.milestones = res.data;
        } else {
          this.milestones = [];
        }
      },
      error: () => {
        this.milestones = [];
      }
    });
  }

  onMilestoneChange(mId: any): void {
    if (!mId) {
      this.taskForm.patchValue({ milestone_id: null, milestone_name: '' });
      return;
    }
    const selected = this.milestones.find(m => m.id == mId);
    if (selected) {
      this.taskForm.patchValue({
        milestone_id: selected.id,
        milestone_name: selected.name
      });
    }
  }

  onProjectChange(pId: any): void {
    const selected = this.projects.find(p => p.project_id == pId);
    if (selected) {
      this.taskForm.patchValue({
        project_name: selected.project_name,
        milestone_id: null,
        milestone_name: ''
      });
      if (!this.taskForm.get('reviewer_id')?.value && selected.project_manager_id) {
        this.taskForm.patchValue({
          reviewer_id: selected.project_manager_id,
          reviewer_name: selected.project_manager_name,
          reviewer_email: selected.project_manager_email
        });
      }
    }
    this.loadProjectAssignees(pId);
    this.loadProjectMilestones(pId);
  }

  onAssigneeChange(empId: any): void {
    const selected = this.filteredAssignees.find(e => e.employee_id == empId) ||
                     this.employees.find(e => e.employee_id == empId);
    if (selected) {
      this.taskForm.patchValue({
        assigned_to_name: selected.name,
        assigned_to_email: selected.email
      });
    } else {
      this.taskForm.patchValue({
        assigned_to_name: '',
        assigned_to_email: ''
      });
    }
  }

  onReviewerChange(empId: any): void {
    const selected = this.employees.find(e => e.employee_id == empId);
    if (selected) {
      this.taskForm.patchValue({
        reviewer_name: selected.name,
        reviewer_email: selected.email
      });
    } else {
      this.taskForm.patchValue({
        reviewer_name: '',
        reviewer_email: ''
      });
    }
  }

  isDateRangeInvalid(): boolean {
    const start = this.taskForm.get('start_date')?.value;
    const due = this.taskForm.get('due_date')?.value;
    if (start && due) {
      const s = new Date(start);
      const d = new Date(due);
      return d < s;
    }
    return false;
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    if (this.isDateRangeInvalid()) {
      this.toast.error('Task Due Date cannot be earlier than Start Date');
      return;
    }

    this.submitting = true;
    const val = { ...this.taskForm.getRawValue() };
    let taskType = val.task_type || 'Task';
    if (taskType === 'Other') {
      taskType = val.other_task_type?.trim() ? `Other: ${val.other_task_type.trim()}` : 'Other';
    }

    const payload: any = {
      ...val,
      task_type: taskType
    };
    delete payload.other_task_type;

    const formatDateStr = (d: any) => {
      if (!d) return null;
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return null;
      const yr = dt.getFullYear();
      const mo = String(dt.getMonth() + 1).padStart(2, '0');
      const da = String(dt.getDate()).padStart(2, '0');
      return `${yr}-${mo}-${da}`;
    };

    payload.start_date = formatDateStr(payload.start_date);
    payload.due_date = formatDateStr(payload.due_date);

    if (this.task && this.task.task_id) {
      const hasComment = !!this.newCommentMessage?.trim();
      const commentText = hasComment ? this.newCommentMessage.trim() : '';

      this.pmService.updateTask(this.task.task_id, payload).subscribe({
        next: (res: any) => {
          this.submitting = false;
          if (res.data) {
            this.task = { ...this.task, ...res.data };
          }
          this.saved.emit(res.data);

          if (hasComment) {
            this.newCommentMessage = '';
            this.pmService.createTaskComment(this.task.task_id, { message: commentText, comment: commentText }).subscribe({
              next: () => {
                this.toast.success('Task updated and comment posted successfully');
                this.loadActivities();
                this.close.emit();
              },
              error: () => {
                this.toast.success('Task updated successfully');
                this.close.emit();
              }
            });
          } else {
            this.toast.success('Task updated successfully');
            this.loadActivities();
            this.close.emit();
          }
        },
        error: (err) => {
          this.submitting = false;
          console.error('Error updating task:', err);
          this.toast.error(err.error?.message || 'Failed to update task');
        }
      });
    } else {
      this.pmService.createTask(payload).subscribe({
        next: (res: any) => {
          this.submitting = false;
          this.toast.success('Task created successfully');
          this.saved.emit(res.data);
          this.close.emit();
        },
        error: (err) => {
          this.submitting = false;
          console.error('Error creating task:', err);
          this.toast.error(err.error?.message || 'Failed to create task');
        }
      });
    }
  }

  onSubmitUnified(): void {
    if (!this.canEdit) {
      if (this.newCommentMessage?.trim()) {
        this.sendComment();
      } else {
        this.close.emit();
      }
      return;
    }
    this.onSubmit();
  }

  loadActivities(): void {
    if (!this.task?.task_id) return;
    this.activityLoading = true;
    this.pmService.getTaskActivity(this.task.task_id).subscribe({
      next: (res: any) => {
        this.activityLoading = false;
        if (res.success && Array.isArray(res.data)) {
          this.activities = res.data;
          this.shouldScrollBottom = true;
        }
      },
      error: () => {
        this.activityLoading = false;
      }
    });
  }

  sendComment(): void {
    if (!this.newCommentMessage?.trim() || !this.task?.task_id || this.commentSubmitting) return;
    this.commentSubmitting = true;
    this.pmService.createTaskComment(this.task.task_id, { message: this.newCommentMessage.trim(), comment: this.newCommentMessage.trim() }).subscribe({
      next: () => {
        this.commentSubmitting = false;
        this.newCommentMessage = '';
        this.toast.success('Comment posted');
        this.loadActivities();
      },
      error: (err: any) => {
        this.commentSubmitting = false;
        this.toast.error(err.error?.message || 'Failed to post comment');
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendComment();
    }
  }

  scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  scrollToTop(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = 0;
      }
    } catch (err) {}
  }

  get filteredActivities(): any[] {
    if (this.activeActivityTab === 'COMMENTS') {
      return this.activities.filter(a => a.activity_type === 'COMMENT');
    }
    if (this.activeActivityTab === 'SYSTEM') {
      return this.activities.filter(a => a.activity_type !== 'COMMENT');
    }
    return this.activities;
  }

  get commentsCount(): number {
    return this.activities.filter(a => a.activity_type === 'COMMENT').length;
  }

  get systemLogsCount(): number {
    return this.activities.filter(a => a.activity_type !== 'COMMENT').length;
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'TASK_CREATED': return 'fa-plus-circle text-primary';
      case 'ASSIGNED':
      case 'REASSIGNED': return 'fa-user text-info';
      case 'NAME_CHANGE': return 'fa-tag text-primary';
      case 'TYPE_CHANGE': return 'fa-cube text-secondary';
      case 'STATUS_CHANGE': return 'fa-exchange text-warning';
      case 'PRIORITY_CHANGE': return 'fa-flag text-danger';
      case 'START_DATE_CHANGE':
      case 'DUE_DATE_CHANGE': return 'fa-calendar text-secondary';
      case 'REVIEWER_CHANGE': return 'fa-user text-info';
      case 'REVIEW_ACTION': return 'fa-check-circle text-success';
      case 'EST_HOURS_CHANGE': return 'fa-clock-o text-warning';
      case 'PROGRESS_CHANGE': return 'fa-tasks text-info';
      case 'DESCRIPTION_CHANGE': return 'fa-align-left text-muted';
      default: return 'fa-history text-muted';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin': return 'role-admin';
      case 'Project Head': return 'role-head';
      case 'Assignee': return 'role-assignee';
      case 'Reviewer': return 'role-reviewer';
      default: return 'role-member';
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `Today at ${timeStr}`;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${timeStr}`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'To Do': return 'badge-todo';
      case 'In Progress': return 'badge-inprogress';
      case 'In Review': return 'badge-inreview';
      case 'Waiting for Information': return 'badge-waiting';
      case 'Completed': return 'badge-completed';
      default: return 'badge-default';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Urgent': return 'priority-urgent';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  get isReviewer(): boolean {
    if (!this.currentUser || !this.task) return true;
    const rId = Number(this.currentUser.role_master_id || this.currentUser.role_id);
    const rName = (this.currentUser.role_name || this.currentUser.role_master_name || this.currentUser.role || '').toString().toLowerCase();
    if (rId === 1 || rName.includes('admin') || rName.includes('super')) return true;
    if (this.task.reviewer_id && this.currentUser.employee_id == this.task.reviewer_id) return true;
    if (this.task.project_manager_id && this.currentUser.employee_id == this.task.project_manager_id) return true;
    return false;
  }

  get isAssignee(): boolean {
    if (!this.currentUser || !this.task) return true;
    return this.currentUser.employee_id == this.task.assigned_to_id;
  }

  get canSubmitForReview(): boolean {
    if (!this.task || this.task.status === 'Completed') return false;
    return this.task.review_status !== 'Submitted';
  }

  submitForReview(customComments?: string): void {
    if (!this.task?.task_id || this.reviewSubmitting) return;
    this.reviewSubmitting = true;
    const comments = (customComments || this.reviewCommentsInput || '').trim() || 'Submitted for reviewer approval';
    const payload = { action: 'submit', comments };
    this.pmService.reviewTask(this.task.task_id, payload).subscribe({
      next: (res: any) => {
        this.reviewSubmitting = false;
        this.reviewCommentsInput = '';
        this.toast.success('Task submitted for reviewer approval');
        if (res.data) {
          this.syncUpdatedTask(res.data);
        } else {
          this.task = { ...this.task, review_status: 'Submitted' };
        }
        this.loadActivities();
        this.saved.emit(this.task);
        this.reviewed.emit(this.task);
        this.close.emit();
      },
      error: (err: any) => {
        this.reviewSubmitting = false;
        console.error('Error submitting review:', err);
        this.toast.error(err.error?.message || 'Failed to submit task for review');
      }
    });
  }

  approveTask(customComments?: string): void {
    if (!this.task?.task_id || this.reviewSubmitting) return;
    this.reviewSubmitting = true;
    const comments = (customComments || this.reviewCommentsInput || '').trim() || 'Approved by reviewer';
    const payload = {
      action: 'approve',
      comments,
      reviewed_by: this.currentUser?.employee_id || this.task.reviewer_id
    };
    this.pmService.reviewTask(this.task.task_id, payload).subscribe({
      next: (res: any) => {
        this.reviewSubmitting = false;
        this.reviewCommentsInput = '';
        this.toast.success('Task approved and completed successfully');
        if (res.data) {
          this.syncUpdatedTask(res.data);
        } else {
          this.task = { ...this.task, status: 'Completed', progress: 100, review_status: 'Approved' };
          this.taskForm.patchValue({ status: 'Completed', progress: 100 });
        }
        this.loadActivities();
        this.saved.emit(this.task);
        this.reviewed.emit(this.task);
        this.close.emit();
      },
      error: (err: any) => {
        this.reviewSubmitting = false;
        console.error('Error approving task:', err);
        this.toast.error(err.error?.message || 'Failed to approve task');
      }
    });
  }

  requestChanges(customComments?: string): void {
    if (!this.task?.task_id || this.reviewSubmitting) return;
    const comments = (customComments || this.reviewCommentsInput || '').trim();
    if (!comments) {
      this.toast.warning('Please enter comments explaining what changes are needed');
      return;
    }
    this.reviewSubmitting = true;
    const payload = {
      action: 'request_changes',
      comments,
      reviewed_by: this.currentUser?.employee_id || this.task.reviewer_id
    };
    this.pmService.reviewTask(this.task.task_id, payload).subscribe({
      next: (res: any) => {
        this.reviewSubmitting = false;
        this.reviewCommentsInput = '';
        this.toast.info('Changes requested from assignee');
        if (res.data) {
          this.syncUpdatedTask(res.data);
        } else {
          this.task = { ...this.task, review_status: 'Changes Requested' };
        }
        this.loadActivities();
        this.saved.emit(this.task);
        this.reviewed.emit(this.task);
        this.close.emit();
      },
      error: (err: any) => {
        this.reviewSubmitting = false;
        console.error('Error requesting changes:', err);
        this.toast.error(err.error?.message || 'Failed to request changes');
      }
    });
  }

  reopenTask(): void {
    if (!this.task?.task_id || this.reviewSubmitting) return;
    if (!this.canReopen) {
      this.toast.warning('Only Project Head or Super Admin can reopen completed tasks');
      return;
    }
    this.reviewSubmitting = true;
    this.pmService.updateTask(this.task.task_id, { status: 'In Progress', progress: 50 }).subscribe({
      next: (res: any) => {
        this.reviewSubmitting = false;
        this.toast.success('Task reopened to In Progress');
        if (res.data) {
          this.syncUpdatedTask(res.data);
        } else {
          this.task = { ...this.task, status: 'In Progress', progress: 50, review_status: 'Pending' };
          this.taskForm.patchValue({ status: 'In Progress', progress: 50 });
        }
        this.loadActivities();
        this.saved.emit(this.task);
        this.reviewed.emit(this.task);
        this.close.emit();
      },
      error: (err: any) => {
        this.reviewSubmitting = false;
        console.error('Error reopening task:', err);
        this.toast.error('Failed to reopen task');
      }
    });
  }

  syncUpdatedTask(data: any): void {
    this.task = { ...this.task, ...data };
    this.taskForm.patchValue({
      status: this.task.status,
      progress: this.task.progress,
      task_name: this.task.task_name,
      reviewer_id: this.task.reviewer_id,
      reviewer_name: this.task.reviewer_name,
      assigned_to_id: this.task.assigned_to_id,
      assigned_to_name: this.task.assigned_to_name
    });
  }

  getReviewStatusBadgeClass(status: string): string {
    const s = (status || 'Pending').toLowerCase().replace(/\s+/g, '-');
    return `review-${s}`;
  }
}

