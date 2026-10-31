import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-project-action-cell',
  template: `
    <div class="action-buttons-cell">
      <button
        type="button"
        class="btn-action btn-view"
        title="View Project Details"
        (click)="onView($event)"
      >
        <i class="fa fa-eye"></i>
      </button>

      <button
        *ngIf="canEdit"
        type="button"
        class="btn-action btn-edit"
        title="Edit Project"
        (click)="onEdit($event)"
      >
        <i class="fa fa-edit"></i>
      </button>

      <button
        *ngIf="canDelete"
        type="button"
        class="btn-action btn-delete"
        title="Delete Project"
        (click)="onDelete($event)"
      >
        <i class="fa fa-trash"></i>
      </button>
    </div>
  `,
  styleUrls: ['./project-action-cell.component.scss']
})
export class ProjectActionCellComponent implements ICellRendererAngularComp {
  params: any;
  project: any;
  canEdit: boolean = false;
  canDelete: boolean = false;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.project = params.data;
    if (params.colDef?.cellRendererParams) {
      const crp = params.colDef.cellRendererParams;
      this.canEdit = crp.canEdit ? crp.canEdit(this.project) : false;
      this.canDelete = crp.canDelete ? crp.canDelete(this.project) : false;
    }
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.project = params.data;
    if (params.colDef?.cellRendererParams) {
      const crp = params.colDef.cellRendererParams;
      this.canEdit = crp.canEdit ? crp.canEdit(this.project) : false;
      this.canDelete = crp.canDelete ? crp.canDelete(this.project) : false;
    }
    return true;
  }

  onView(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params?.colDef?.cellRendererParams?.onView) {
      this.params.colDef.cellRendererParams.onView(this.project);
    }
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params?.colDef?.cellRendererParams?.onEdit) {
      this.params.colDef.cellRendererParams.onEdit(this.project, event);
    }
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (this.params?.colDef?.cellRendererParams?.onDelete) {
      this.params.colDef.cellRendererParams.onDelete(this.project, event);
    }
  }
}
