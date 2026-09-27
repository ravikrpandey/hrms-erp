import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererParams } from 'ag-grid-community';
import { DepartmentCityDialogeComponent } from '../department-city-dialoge/department-city-dialoge.component';

@Component({
  selector: 'app-department-report-action',
  templateUrl: './department-report-action.component.html',
  styleUrls: ['./department-report-action.component.scss']
})
export class DepartmentReportActionComponent {
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
    const dialogRef = this.dialog.open(DepartmentCityDialogeComponent, {
      data: { id: this.cellValue }
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
