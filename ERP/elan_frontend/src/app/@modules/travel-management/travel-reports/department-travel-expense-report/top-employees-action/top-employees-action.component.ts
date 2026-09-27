import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererParams } from 'ag-grid-community';
import { TopEmployeesDialogComponent } from '../top-employees-dialog/top-employees-dialog.component';

@Component({
  selector: 'app-top-employees-action',
  templateUrl: './top-employees-action.component.html',
  styleUrls: ['./top-employees-action.component.scss']
})
export class TopEmployeesActionComponent {
  public cellValue: any;

  constructor( public dialog: MatDialog) {}

  ngOnInit(): void {
  }
  
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.department_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  openDialog() {
    const dialogRef = this.dialog.open(TopEmployeesDialogComponent, {
      data: { id: this.cellValue }
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
