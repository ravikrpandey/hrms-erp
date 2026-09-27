import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
// import { RecruitService } from 'src/app/@service/recruitment.service';
@Component({
  selector: 'app-view-lead-status-dialog',
  templateUrl: './view-lead-status-dialog.component.html',
  styleUrls: ['./view-lead-status-dialog.component.scss'],
})
export class ViewLeadStatusDialogComponent {
  singleLeadStatusData: any;
  fileUrl;

  constructor(
    public dialog: MatDialogRef<ViewLeadStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fileUrl = environment.servralUrl+'/uploadDoc/';
    this.singleLeadStatusData = this.data;
    
  }

  ngOnInit(): void {
  }
}
