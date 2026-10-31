import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-task-action-cell',
  template: `
    <div class="action-buttons-cell">
      <button
        type="button"
        class="btn-action btn-review"
        [class.has-review-alert]="task?.review_status === 'Submitted'"
        title="Review & Approval"
        (click)="onReview($event)"
      >
        <i class="fa fa-clipboard-check"></i>
      </button>

      <button
        *ngIf="canEdit"
        type="button"
        class="btn-action btn-edit"
        title="Edit Task & Activity"
        (click)="onEdit($event)"
      >
        <i class="fa fa-edit"></i>
      </button>

      <button
        *ngIf="!canEdit"
        type="button"
        class="btn-action btn-view"
        title="View Task & Activity"
        (click)="onEdit($event)"
      >
        <i class="fa fa-eye"></i>
      </button>

      <button
        *ngIf="canDelete"
        type="button"
        class="btn-action btn-delete"
        title="Delete Task"
        (click)="onDelete($event)"
      >
        <i class="fa fa-trash"></i>
      </button>
    </div>
  `,
  styleUrls: ['./task-action-cell.component.scss']
})
export class TaskActionCellComponent implements ICellRendererAngularComp {
  params: any;
  task: any;
  canEdit: boolean = false;
  canDelete: boolean = false;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.task = params.data;
    if (params.colDef?.cellRendererParams) {
      const crp = params.colDef.cellRendererParams;
      this.canEdit = crp.canEdit ? crp.canEdit(this.task) : false;
      this.canDelete = crp.canDelete ? crp.canDelete(this.task) : false;
    }
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.task = params.data;
    if (params.colDef?.cellRendererParams) {
      const crp = params.colDef.cellRendererParams;
      this.canEdit = crp.canEdit ? crp.canEdit(this.task) : false;
      this.canDelete = crp.canDelete ? crp.canDelete(this.task) : false;
    }
    return true;
  }

  onReview(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params?.colDef?.cellRendererParams?.onReview) {
      this.params.colDef.cellRendererParams.onReview(this.task);
    }
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params?.colDef?.cellRendererParams?.onEdit) {
      this.params.colDef.cellRendererParams.onEdit(this.task);
    }
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params?.colDef?.cellRendererParams?.onDelete) {
      this.params.colDef.cellRendererParams.onDelete(this.task, event);
    }
  }
}
