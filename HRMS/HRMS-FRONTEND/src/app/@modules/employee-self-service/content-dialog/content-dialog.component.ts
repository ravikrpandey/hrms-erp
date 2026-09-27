import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-content-dialog',
  templateUrl: './content-dialog.component.html',
  styleUrls: ['./content-dialog.component.scss']
})
export class ContentDialogComponent {
  singleContent:any;
  constructor(
    public dialogRef: MatDialogRef<ContentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.singleContent = data
  }
  closeDialog(){
    this.dialogRef.close(); // <- Close the mat dialog
  }

  ngOnInit(): void {
    localStorage.setItem("employee_id:", "undefined");
  }
}
