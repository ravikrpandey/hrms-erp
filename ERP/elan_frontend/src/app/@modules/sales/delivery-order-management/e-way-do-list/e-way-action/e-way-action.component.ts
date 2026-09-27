import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EWayDialogComponent } from '../e-way-dialog/e-way-dialog.component';
@Component({
  selector: 'app-e-way-action',
  templateUrl: './e-way-action.component.html',
  styleUrls: ['./e-way-action.component.scss']
})
export class EWayActionComponent {
  assignAction: any;
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void { }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.data;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params;
  }
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  viewChallan(e: any) {
    const dialogRef = this.dialog.open(EWayDialogComponent, {
      width: '500px',
      data: { cellData: this.cellValue },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

}

