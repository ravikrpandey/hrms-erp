import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-review-dialog',
  templateUrl: './task-review-dialog.component.html',
  styleUrls: ['./task-review-dialog.component.scss']
})
export class TaskReviewDialogComponent implements OnInit {
  @Input() task: any = null;
  @Input() currentUser: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() reviewed = new EventEmitter<any>();

  submitting: boolean = false;
  comments: string = '';

  constructor(
    private pmService: ProjectManagementService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
  }

  get isReviewer(): boolean {
    if (!this.currentUser || !this.task) return true;
    if (this.currentUser.role_id === 1 || this.currentUser.role_id === '1') return true;
    if (this.currentUser.role?.toString().toLowerCase().includes('admin')) return true;
    if (this.task.reviewer_id && this.currentUser.employee_id == this.task.reviewer_id) return true;
    return false;
  }

  get isAssignee(): boolean {
    if (!this.currentUser || !this.task) return true;
    return this.currentUser.employee_id == this.task.assigned_to_id;
  }

  submitForReview(): void {
    this.submitting = true;
    const payload = {
      action: 'submit',
      comments: this.comments.trim() || 'Submitted for reviewer approval'
    };
    this.pmService.reviewTask(this.task.task_id, payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.toast.success('Task submitted for reviewer approval');
        this.reviewed.emit(res.data);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error submitting review:', err);
        this.toast.error(err.error?.message || 'Failed to submit task for review');
      }
    });
  }

  approveTask(): void {
    this.submitting = true;
    const payload = {
      action: 'approve',
      comments: this.comments.trim() || 'Approved by reviewer',
      reviewed_by: this.currentUser?.employee_id || this.task.reviewer_id
    };
    this.pmService.reviewTask(this.task.task_id, payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.toast.success('Task approved and completed successfully');
        this.reviewed.emit(res.data);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error approving task:', err);
        this.toast.error(err.error?.message || 'Failed to approve task');
      }
    });
  }

  requestChanges(): void {
    if (!this.comments.trim()) {
      this.toast.warning('Please enter comments explaining what changes are needed');
      return;
    }

    this.submitting = true;
    const payload = {
      action: 'request_changes',
      comments: this.comments.trim(),
      reviewed_by: this.currentUser?.employee_id || this.task.reviewer_id
    };
    this.pmService.reviewTask(this.task.task_id, payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.toast.info('Changes requested from assignee');
        this.reviewed.emit(res.data);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error requesting changes:', err);
        this.toast.error(err.error?.message || 'Failed to request changes');
      }
    });
  }

  reopenTask(): void {
    this.submitting = true;
    this.pmService.updateTask(this.task.task_id, { status: 'In Progress', progress: 50 }).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.toast.success('Task reopened to In Progress');
        this.reviewed.emit(res.data);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error reopening task:', err);
        this.toast.error('Failed to reopen task');
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
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}

