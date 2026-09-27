import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-sfg-dialog-box',
  templateUrl: './view-sfg-dialog-box.component.html',
  styleUrls: ['./view-sfg-dialog-box.component.scss']
})
export class ViewSfgDialogBoxComponent {
  details: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.details = data
    console.log(this.details);
    
  }
}
