import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-timesheet-action-cell',
  template: `
    <div class="action-buttons-cell">
      <button
        *ngIf="canApprove"
        type="button"
        class="btn-action btn-approve"
        title="Approve Timesheet"
        (click)="onApprove($event)"
      >
        <i class="fa fa-check"></i>
      </button>

      <button
        *ngIf="canReject"
        type="button"
        class="btn-action btn-reject"
        title="Reject Timesheet"
        (click)="onReject($event)"
      >
        <i class="fa fa-times"></i>
      </button>

      <button
        type="button"
        class="btn-action btn-view"
        title="View Details"
        (click)="onView($event)"
      >
        <i class="fa fa-eye"></i>
      </button>
    </div>
  `,
  styleUrls: ['./timesheet-action-cell.component.scss']
})
export class TimesheetActionCellComponent implements ICellRendererAngularComp {
  params: any;
  submission: any;
  canApprove: boolean = false;
  canReject: boolean = false;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.submission = params.data;
    this.evaluatePermissions();
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.submission = params.data;
    this.evaluatePermissions();
    return true;
  }

  evaluatePermissions(): void {
    if (!this.submission || !this.params?.colDef?.cellRendererParams) {
      this.canApprove = false;
      this.canReject = false;
      return;
    }
    const crp = this.params.colDef.cellRendererParams;
    const isTeamTab = crp.isTeamTab || false;
    const isPending = this.submission.status === 'Pending' || this.submission.status === 'Submitted';
    const hasHours = crp.hasPayableHours ? crp.hasPayableHours(this.submission) : true;

    this.canApprove = isTeamTab && isPending && hasHours;
    this.canReject = isTeamTab && isPending && hasHours;
  }

  onApprove(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params?.onApprove) {
      this.params.onApprove(this.submission);
    }
  }

  onReject(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params?.onReject) {
      this.params.onReject(this.submission);
    }
  }

  onView(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params?.onView) {
      this.params.onView(this.submission);
    }
  }
}

