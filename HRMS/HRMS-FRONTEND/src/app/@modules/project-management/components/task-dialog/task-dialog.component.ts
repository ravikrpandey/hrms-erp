import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {
  @Input() projectId: any = null;
  @Input() projectName: string = '';
  @Input() task: any = null;
  @Input() employees: any[] = [];
  @Input() projects: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  taskForm!: FormGroup;
  submitting: boolean = false;
  priorities: string[] = ['Low', 'Medium', 'High', 'Urgent'];
  statuses: string[] = ['To Do', 'In Progress', 'In Review', 'Completed'];

  constructor(
    private fb: FormBuilder,
    private pmService: ProjectManagementService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.task) {
      this.taskForm.patchValue({
        project_id: this.task.project_id,
        project_name: this.task.project_name,
        task_name: this.task.task_name,
        description: this.task.description,
        assigned_to_id: this.task.assigned_to_id,
        assigned_to_name: this.task.assigned_to_name,
        assigned_to_email: this.task.assigned_to_email,
        reviewer_id: this.task.reviewer_id,
        reviewer_name: this.task.reviewer_name,
        reviewer_email: this.task.reviewer_email,
        priority: this.task.priority || 'Medium',
        status: this.task.status || 'To Do',
        start_date: this.task.start_date,
        due_date: this.task.due_date,
        estimated_hours: this.task.estimated_hours || 0,
        progress: this.task.progress || 0
      });
    } else if (this.projectId) {
      this.taskForm.patchValue({
        project_id: this.projectId,
        project_name: this.projectName
      });
      this.autoSelectProjectReviewer(this.projectId);
    }
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      project_id: [this.projectId, [Validators.required]],
      project_name: [this.projectName],
      task_name: ['', [Validators.required]],
      description: [''],
      assigned_to_id: [null],
      assigned_to_name: [''],
      assigned_to_email: [''],
      reviewer_id: [null, [Validators.required]],
      reviewer_name: [''],
      reviewer_email: [''],
      priority: ['Medium'],
      status: ['To Do'],
      start_date: [null],
      due_date: [null],
      estimated_hours: [0],
      progress: [0]
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

  onProjectChange(pId: any): void {
    const selected = this.projects.find(p => p.project_id == pId);
    if (selected) {
      this.taskForm.patchValue({ project_name: selected.project_name });
      if (!this.taskForm.get('reviewer_id')?.value && selected.project_manager_id) {
        this.taskForm.patchValue({
          reviewer_id: selected.project_manager_id,
          reviewer_name: selected.project_manager_name,
          reviewer_email: selected.project_manager_email
        });
      }
    }
  }

  onAssigneeChange(empId: any): void {
    const selected = this.employees.find(e => e.employee_id == empId);
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

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = { ...this.taskForm.value };

    if (payload.start_date instanceof Date) {
      payload.start_date = payload.start_date.toISOString().split('T')[0];
    }
    if (payload.due_date instanceof Date) {
      payload.due_date = payload.due_date.toISOString().split('T')[0];
    }

    if (this.task && this.task.task_id) {
      this.pmService.updateTask(this.task.task_id, payload).subscribe({
        next: (res: any) => {
          this.submitting = false;
          this.toast.success('Task updated successfully');
          this.saved.emit(res.data);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Error updating task:', err);
          this.toast.error('Failed to update task');
        }
      });
    } else {
      this.pmService.createTask(payload).subscribe({
        next: (res: any) => {
          this.submitting = false;
          this.toast.success('Task created successfully');
          this.saved.emit(res.data);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Error creating task:', err);
          this.toast.error(err.error?.message || 'Failed to create task');
        }
      });
    }
  }
}

