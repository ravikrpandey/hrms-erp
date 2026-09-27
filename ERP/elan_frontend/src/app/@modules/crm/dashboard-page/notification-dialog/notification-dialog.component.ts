import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent {
  assessData:any;
  constructor(public dialog: MatDialogRef<NotificationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ){
    }
}
