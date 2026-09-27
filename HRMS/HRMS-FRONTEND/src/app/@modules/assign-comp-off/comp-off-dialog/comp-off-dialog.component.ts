import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comp-off-dialog',
  templateUrl: './comp-off-dialog.component.html',
  styleUrls: ['./comp-off-dialog.component.scss'],
})
export class CompOffDialogComponent {
  displayedColumns: string[] = [
    'employee_code',
    'name',
    'department_name',
    'inDate',
    'outDate',
    "att_date",
    'workingHours',

  ];
  dataSource: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource = Array.isArray(data) ? data : [];
  }
}
