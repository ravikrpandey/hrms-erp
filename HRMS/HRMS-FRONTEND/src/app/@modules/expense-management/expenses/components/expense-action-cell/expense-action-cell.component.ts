import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-expense-action-cell',
  templateUrl: './expense-action-cell.component.html',
  styleUrls: ['./expense-action-cell.component.scss']
})
export class ExpenseActionCellComponent implements ICellRendererAngularComp {
  params: any;
  data: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.data = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.data = params.data;
    return true;
  }

  onView(e: MouseEvent): void {
    e.stopPropagation();
    this.params?.onView?.(this.data);
  }

  onApprove(e: MouseEvent): void {
    e.stopPropagation();
    this.params?.onApprove?.(this.data);
  }

  onReject(e: MouseEvent): void {
    e.stopPropagation();
    this.params?.onReject?.(this.data);
  }

  onEdit(e: MouseEvent): void {
    e.stopPropagation();
    this.params?.onEdit?.(this.data);
  }

  onResubmit(e: MouseEvent): void {
    e.stopPropagation();
    this.params?.onResubmit?.(this.data);
  }

  onDelete(e: MouseEvent): void {
    e.stopPropagation();
    this.params?.onDelete?.(this.data);
  }
}

