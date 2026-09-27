import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-attendance-detail-dialog',
  templateUrl: './attendance-detail-dialog.component.html',
  styleUrls: ['./attendance-detail-dialog.component.scss']
})
export class AttendanceDetailDialogComponent implements OnInit {

  dataList: any = [];

  constructor(
    public dialog: MatDialogRef<AttendanceDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    
    this.dataList = this.data?.data?.details;
  }

  ngOnInit(): void {
  }

}

