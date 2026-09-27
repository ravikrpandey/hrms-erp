import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ItticketingService } from 'src/app/@shared/services/itticketing.service';

@Component({
  selector: 'app-mydialog',
  templateUrl: './mydialog.component.html',
  styleUrls: ['./mydialog.component.scss']
})
export class MydialogComponent {
  singleTicket:any;
  constructor(
    public dialogRef: MatDialogRef<MydialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _itticketing:ItticketingService) {
      
      this.singleTicket = data
  }
  closeDialog(){
    this.dialogRef.close(); // <- Close the mat dialog
  }

  ngOnInit(): void {
    localStorage.setItem("employee_id:", "undefined");
  }
}
