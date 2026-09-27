import { Component, DebugNode, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-attendance-detail-dialog',
  templateUrl: './attendance-detail-dialog.component.html',
  styleUrls: ['./attendance-detail-dialog.component.scss'],
})
export class AttendanceDetailDialogComponent implements OnInit {
  dataList: any = [];
  lateIn: any;
  lateGo: any;
  shiftname: any;
  constructor(
    public dialog: MatDialogRef<AttendanceDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataList = this.data?.data;
    this.lateIn = this.data.LATEIN;
    this.lateGo = this.data.LATEGO;
    this.shiftname = this.data.shift_name;
  }

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialog.close();
  }
}
