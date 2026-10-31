import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectManagementService } from '../../services/project-management.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timesheet-log-dialog',
  templateUrl: './timesheet-log-dialog.component.html',
  styleUrls: ['./timesheet-log-dialog.component.scss']
})
export class TimesheetLogDialogComponent implements OnInit {
  @Input() employeeId: any = null;
  @Input() employeeName: string = '';
  @Input() projects: any[] = [];
  @Input() log: any = null;
  @Input() defaultDate: Date | null = null;
  @Input() logMode: string = 'Log Time';
  @Input() isReadOnly: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  logForm!: FormGroup;
  submitting: boolean = false;
  tasks: any[] = [];
  loadingTasks: boolean = false;
  descriptionMaxLength: number = 15000;

  timerRunning: boolean = false;
  timerSeconds: number = 0;
  timerInterval: any = null;

  uploading: boolean = false;
  selectedFileName: string = '';

  workModes: { label: string; value: string; icon: string }[] = [
    { label: 'Office', value: 'Office', icon: 'fa fa-building-o' },
    { label: 'WFH', value: 'WFH', icon: 'fa fa-home' },
    { label: 'Client Site', value: 'Client Site', icon: 'fa fa-map-marker' },
    { label: 'Day Off', value: 'Day Off', icon: 'fa fa-coffee' }
  ];

  constructor(
    private fb: FormBuilder,
    private pmService: ProjectManagementService,
    private miscService: MiscellaneousService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.log) {
      this.logForm.patchValue({
        project_id: this.log.project_id,
        project_name: this.log.project_name,
        task_id: this.log.task_id,
        task_name: this.log.task_name,
        work_item: this.log.work_item,
        log_date: this.log.log_date ? new Date(this.log.log_date) : new Date(),
        work_mode: this.log.work_mode || 'Office',
        description: this.log.description,
        hours_mode: this.log.hours_mode || 'Total Hours',
        start_time: this.log.start_time,
        end_time: this.log.end_time,
        total_hours: this.log.total_hours,
        is_billable: this.log.is_billable !== undefined ? this.log.is_billable : true,
        attachment_path: this.log.attachment_path
      });
      this.selectedFileName = this.log.attachment_path ? this.log.attachment_path.split('/').pop() : '';
      if (this.log.project_id) {
        this.loadTasksForProject(this.log.project_id);
      }
    } else {
      this.logForm.patchValue({
        log_date: this.defaultDate || new Date(),
        work_mode: 'Office',
        is_billable: true
      });
    }

    if (this.isReadOnly) {
      this.logForm.disable();
    }
  }

  hasProject(projectId: any): boolean {
    return !!(this.projects && Array.isArray(this.projects) && this.projects.some(p => p && String(p.project_id) === String(projectId)));
  }

  hasTask(taskId: any): boolean {
    return !!(this.tasks && Array.isArray(this.tasks) && this.tasks.some(t => t && String(t.task_id) === String(taskId)));
  }

  initForm(): void {
    this.logForm = this.fb.group({
      project_id: [null, [Validators.required]],
      project_name: [''],
      task_id: [null, [Validators.required]],
      task_name: [''],
      work_item: [''],
      log_date: [new Date(), [Validators.required]],
      work_mode: ['Office', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(this.descriptionMaxLength)]],
      hours_mode: ['Total Hours'],
      start_time: [''],
      end_time: [''],
      total_hours: [0, [Validators.min(0)]],
      is_billable: [true],
      attachment_path: ['']
    });
  }

  setWorkMode(mode: string): void {
    if (this.isReadOnly) return;
    this.logForm.patchValue({ work_mode: mode });
  }

  get descriptionLength(): number {
    return (this.logForm.get('description')?.value || '').length;
  }

  onProjectChange(projectId: any): void {
    const selected = this.projects.find(p => p.project_id == projectId);
    this.logForm.patchValue({
      project_name: selected ? selected.project_name : '',
      task_id: null,
      task_name: ''
    });
    this.tasks = [];
    if (projectId) {
      this.loadTasksForProject(projectId);
    }
  }

  loadTasksForProject(projectId: any): void {
    this.loadingTasks = true;
    this.pmService.getAllTasks({ project_id: projectId }).subscribe({
      next: (res: any) => {
        this.loadingTasks = false;
        if (res.success && res.data) {
          this.tasks = res.data;
        }
      },
      error: (err) => {
        this.loadingTasks = false;
        console.error('Error fetching jobs/goals:', err);
      }
    });
  }

  onTaskChange(taskId: any): void {
    const selected = this.tasks.find(t => t.task_id == taskId);
    this.logForm.patchValue({
      task_name: selected ? selected.task_name : ''
    });
  }

  setHoursMode(mode: string): void {
    if (this.isReadOnly) return;
    this.logForm.patchValue({ hours_mode: mode });
    if (mode !== 'Timer' && this.timerRunning) {
      this.stopTimer();
    }
  }

  get computedRangeHours(): number {
    const start = this.logForm.get('start_time')?.value;
    const end = this.logForm.get('end_time')?.value;
    if (!start || !end) return 0;
    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map((v: string) => parseInt(v, 10));
      return (h || 0) * 60 + (m || 0);
    };
    const diff = toMinutes(end) - toMinutes(start);
    if (diff <= 0) return 0;
    return Math.round((diff / 60) * 100) / 100;
  }

  toggleTimer(): void {
    if (this.isReadOnly) return;
    if (this.timerRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timerRunning = true;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
    }, 1000);
  }

  stopTimer(): void {
    this.timerRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    const hours = Math.round((this.timerSeconds / 3600) * 100) / 100;
    this.logForm.patchValue({ total_hours: hours });
  }

  get timerDisplay(): string {
    const h = Math.floor(this.timerSeconds / 3600);
    const m = Math.floor((this.timerSeconds % 3600) / 60);
    const s = this.timerSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  onFileSelected(event: Event): void {
    if (this.isReadOnly) return;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.selectedFileName = file.name;
    const formData = new FormData();
    formData.append('file', file);

    this.uploading = true;
    this.miscService.documents(formData).subscribe({
      next: (res: any) => {
        this.uploading = false;
        if (res && res.url) {
          this.logForm.patchValue({ attachment_path: res.url });
          this.toast.success('Attachment uploaded');
        }
      },
      error: (err) => {
        this.uploading = false;
        console.error('Error uploading attachment:', err);
        this.toast.error('Failed to upload attachment');
      }
    });
  }

  removeAttachment(): void {
    if (this.isReadOnly) return;
    this.logForm.patchValue({ attachment_path: '' });
    this.selectedFileName = '';
  }

  onSubmit(): void {
    if (this.isReadOnly) return;
    if (this.logForm.invalid) {
      this.logForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: any = { ...this.logForm.value };

    if (payload.log_date instanceof Date) {
      const d = payload.log_date;
      payload.log_date = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    }

    if (payload.hours_mode === 'Start-End Time') {
      payload.total_hours = this.computedRangeHours;
    }

    payload.employee_id = this.employeeId;
    payload.employee_name = this.employeeName;
    payload.created_by = this.employeeId;

    if (this.log && this.log.log_id) {
      this.pmService.updateLog(this.log.log_id, payload).subscribe({
        next: (res: any) => {
          this.submitting = false;
          this.toast.success('Time log updated successfully');
          this.saved.emit(res.data);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Error updating time log:', err);
          this.toast.error(err.error?.message || 'Failed to update time log');
        }
      });
    } else {
      this.pmService.createLog(payload).subscribe({
        next: (res: any) => {
          this.submitting = false;
          this.toast.success('Time log saved successfully');
          this.saved.emit(res.data);
        },
        error: (err) => {
          this.submitting = false;
          console.error('Error creating time log:', err);
          this.toast.error(err.error?.message || 'Failed to save time log');
        }
      });
    }
  }
}
