import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
import { InterviewerStatusDialogComponent } from '../interviewer-status-dialog/interviewer-status-dialog.component';

@Component({
  selector: 'app-interview-round-status-dialog',
  templateUrl: './interview-round-status-dialog.component.html',
  styleUrls: ['./interview-round-status-dialog.component.scss']
})


export class InterviewRoundStatusDialogComponent implements OnInit {

  rowData: any = {};
  dataList: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private condidateProfile: CondidateProfileService,
    public dialog: MatDialogRef<InterviewRoundStatusDialogComponent>,
    public dialogg: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.rowData = this.data?.data;
  }

  ngOnInit(): void {
    this.getApprovedJob();
  }

  getApprovedJob() {

    let query = {
      candidate_id: this.rowData?.id,
      jd_id: this.rowData?.job_descripition_id,
    }
    this.condidateProfile.get_interview_round_details_byID(query).subscribe((res: any) => {
      if (res) {
        this.dataList = res?.data;
      }
    })
  }

  viewInterviewStatus(e: any, data: any) {
    e.stopPropagation()
    const dialogRef = this.dialogg.open(InterviewerStatusDialogComponent, {
      width: '40%',
      data: { data: data }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
