import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-activity-dialog',
  templateUrl: './task-activity-dialog.component.html',
  styleUrls: ['./task-activity-dialog.component.scss']
})
export class TaskActivityDialogComponent implements OnInit, AfterViewChecked {
  @Input() task: any;
  @Input() currentUser: any;
  @Input() isProjectHeadOrAdmin: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() activityUpdated = new EventEmitter<void>();

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  activities: any[] = [];
  loading: boolean = false;
  submitting: boolean = false;
  newMessage: string = '';

  taskDetails: any = null;
  activeFilterTab: string = 'ALL';
  autoScrollEnabled: boolean = true;

  editingCommentId: number | null = null;
  editMessageText: string = '';
  updating: boolean = false;

  private shouldScrollBottom: boolean = false;

  constructor(
    private pmService: ProjectManagementService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.taskDetails = { ...this.task };
    if (this.task && this.task.task_id) {
      this.fetchFreshTaskDetails();
      this.loadActivities();
    }
  }

  fetchFreshTaskDetails(): void {
    if (!this.task?.task_id) return;
    this.pmService.getTaskById(this.task.task_id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.taskDetails = res.data;
        }
      },
      error: () => {
        this.taskDetails = { ...this.task };
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollBottom && this.autoScrollEnabled) {
      this.scrollToBottom();
      this.shouldScrollBottom = false;
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
    if (this.activeFilterTab === 'COMMENTS') {
      return this.activities.filter(a => a.activity_type === 'COMMENT');
    }
    if (this.activeFilterTab === 'SYSTEM') {
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

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  isTaskOverdue(): boolean {
    const t = this.taskDetails || this.task;
    if (!t || t.status === 'Completed' || !t.due_date) return false;
    return new Date(t.due_date).getTime() < new Date().setHours(0, 0, 0, 0);
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

  get currentUserId(): number {
    return Number(this.currentUser?.employee_id || this.currentUser?.id || 0);
  }

  get isHeadOrAdmin(): boolean {
    if (this.isProjectHeadOrAdmin) return true;
    const rId = Number(this.currentUser?.role_master_id || this.currentUser?.role_id);
    const rName = (this.currentUser?.role_name || this.currentUser?.role_master_name || '').toLowerCase();
    return rId === 1 || rName.includes('admin') || rName.includes('super');
  }

  loadActivities(): void {
    this.loading = true;
    this.pmService.getTaskActivity(this.task.task_id).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.activities = res.data;
          this.shouldScrollBottom = true;
        }
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Failed to load task activity');
      }
    });
  }

  sendComment(): void {
    if (!this.newMessage.trim() || this.submitting) return;

    this.submitting = true;
    this.pmService.createTaskComment(this.task.task_id, { message: this.newMessage.trim() }).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.newMessage = '';
        if (res.success && res.data) {
          this.activities.push(res.data);
          this.shouldScrollBottom = true;
        } else {
          this.loadActivities();
        }
        this.activityUpdated.emit();
      },
      error: (err) => {
        this.submitting = false;
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

  canEdit(item: any): boolean {
    return item.activity_type === 'COMMENT' && item.sender_id == this.currentUserId;
  }

  canDelete(item: any): boolean {
    return item.activity_type === 'COMMENT' && (item.sender_id == this.currentUserId || this.isHeadOrAdmin);
  }

  startEdit(item: any): void {
    this.editingCommentId = item.comment_id;
    this.editMessageText = item.message;
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editMessageText = '';
  }

  saveEdit(item: any): void {
    if (!this.editMessageText.trim() || this.updating) return;

    this.updating = true;
    this.pmService.updateTaskComment(this.task.task_id, item.comment_id, { message: this.editMessageText.trim() }).subscribe({
      next: (res: any) => {
        this.updating = false;
        item.message = this.editMessageText.trim();
        item.is_edited = true;
        this.editingCommentId = null;
        this.editMessageText = '';
        this.toast.success('Comment updated');
      },
      error: (err) => {
        this.updating = false;
        this.toast.error(err.error?.message || 'Failed to update comment');
      }
    });
  }

  deleteComment(item: any): void {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.pmService.deleteTaskComment(this.task.task_id, item.comment_id).subscribe({
      next: () => {
        this.activities = this.activities.filter(a => a.comment_id !== item.comment_id);
        this.toast.success('Comment deleted');
        this.activityUpdated.emit();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to delete comment');
      }
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'TASK_CREATED': return 'fa-plus-circle text-primary';
      case 'ASSIGNED':
      case 'REASSIGNED': return 'fa-user-check text-info';
      case 'STATUS_CHANGE': return 'fa-exchange-alt text-warning';
      case 'PRIORITY_CHANGE': return 'fa-flag text-danger';
      case 'DUE_DATE_CHANGE': return 'fa-calendar-alt text-secondary';
      case 'REVIEW_ACTION': return 'fa-clipboard-check text-success';
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
}
