import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-timesheet-filter-panel',
  templateUrl: './timesheet-filter-panel.component.html',
  styleUrls: ['./timesheet-filter-panel.component.scss']
})
export class TimesheetFilterPanelComponent implements OnInit {
  @Input() clients: string[] = [];
  @Input() projects: any[] = [];
  @Input() jobs: any[] = [];
  @Input() employees: any[] = [];
  @Input() isManagerOrAdmin: boolean = false;
  @Input() selectedClient: string = '';
  @Input() selectedProjectId: any = '';
  @Input() selectedTaskId: any = '';
  @Input() selectedEmployeeId: any = '';
  @Input() selectedApprovalStatus: string = '';
  @Input() selectedWorkMode: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();

  approvalStatuses: string[] = ['Pending', 'Approved', 'Rejected'];
  workModes: string[] = ['Office', 'WFH', 'Client Site', 'Day Off'];

  localClient: string = '';
  localProjectId: any = '';
  localTaskId: any = '';
  localEmployeeId: any = '';
  localApprovalStatus: string = '';
  localWorkMode: string = '';

  constructor() {}

  ngOnInit(): void {
    this.localClient = this.selectedClient;
    this.localProjectId = this.selectedProjectId;
    this.localTaskId = this.selectedTaskId;
    this.localEmployeeId = this.selectedEmployeeId;
    this.localApprovalStatus = this.selectedApprovalStatus;
    this.localWorkMode = this.selectedWorkMode;
  }

  onApply(): void {
    this.apply.emit({
      client: this.localClient,
      project_id: this.localProjectId,
      task_id: this.localTaskId,
      employee_id: this.localEmployeeId,
      approval_status: this.localApprovalStatus,
      work_mode: this.localWorkMode
    });
  }

  onReset(): void {
    this.localClient = '';
    this.localProjectId = '';
    this.localTaskId = '';
    this.localEmployeeId = '';
    this.localApprovalStatus = '';
    this.localWorkMode = '';
    this.reset.emit();
  }
}
