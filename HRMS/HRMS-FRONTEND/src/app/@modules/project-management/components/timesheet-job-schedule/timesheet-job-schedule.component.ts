import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from 'ag-grid-community';
import { ProjectManagementService } from '../../services/project-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timesheet-job-schedule',
  templateUrl: './timesheet-job-schedule.component.html',
  styleUrls: ['./timesheet-job-schedule.component.scss']
})
export class TimesheetJobScheduleComponent implements OnInit {
  employeeId: any = null;
  tasks: any[] = [];
  loading: boolean = false;

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
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('signInUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.employeeId = user.employee_id;
      } catch (e) {
        console.error('Error parsing signInUser:', e);
      }
    }
    this.setupColumnDefs();
    this.loadSchedule();
  }

  setupColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: 'JOB NAME',
        field: 'task_name',
        minWidth: 180,
        flex: 1.5,
        cellRenderer: (params: any) => {
          return `<span class="job-title">${params.value || '—'}</span>`;
        }
      },
      {
        headerName: 'PROJECT',
        field: 'project_name',
        minWidth: 150,
        flex: 1.2,
        cellRenderer: (params: any) => {
          return `<span class="project-title">${params.value || '—'}</span>`;
        }
      },
      {
        headerName: 'START DATE',
        field: 'start_date',
        minWidth: 120,
        flex: 1.0,
        valueFormatter: (params: any) => this.formatDate(params.value)
      },
      {
        headerName: 'END DATE',
        field: 'due_date',
        minWidth: 120,
        flex: 1.0,
        valueFormatter: (params: any) => this.formatDate(params.value)
      },
      {
        headerName: 'PRIORITY',
        field: 'priority',
        minWidth: 110,
        flex: 0.9,
        cellRenderer: (params: any) => {
          const priority = params.value || 'Medium';
          const cls = this.getPriorityClass(priority);
          return `<span class="priority-text ${cls}">${priority}</span>`;
        }
      },
      {
        headerName: 'STATUS',
        field: 'status',
        minWidth: 160,
        flex: 1.3,
        cellRenderer: (params: any) => {
          const status = params.value || 'To Do';
          const cls = this.getStatusClass(status);
          const isOverdue = this.isOverdue(params.data);
          const overdueTag = isOverdue ? '<span class="overdue-tag"><i class="fa fa-exclamation-circle"></i> Overdue</span>' : '';
          return `
            <div class="status-cell-wrapper">
              <span class="status-pill ${cls}">
                <span class="status-dot"></span>
                ${status}
              </span>
              ${overdueTag}
            </div>
          `;
        }
      }
    ];
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    if (this.tasks && this.tasks.length > 0) {
      this.gridApi.setRowData(this.tasks);
    }
    setTimeout(() => {
      this.gridApi?.sizeColumnsToFit();
    }, 50);
  }

  onGridSizeChanged(params: GridSizeChangedEvent): void {
    params.api?.sizeColumnsToFit();
  }

  loadSchedule(): void {
    if (!this.employeeId) return;
    this.loading = true;
    this.pmService.getJobSchedule(this.employeeId).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success && res.data) {
          this.tasks = res.data;
          if (this.gridApi) {
            this.gridApi.setRowData(this.tasks);
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching job schedule:', err);
        this.toast.error('Failed to load job schedule');
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
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

  isOverdue(task: any): boolean {
    if (!task || !task.due_date || task.status === 'Completed') return false;
    return new Date(task.due_date) < new Date();
  }
}
