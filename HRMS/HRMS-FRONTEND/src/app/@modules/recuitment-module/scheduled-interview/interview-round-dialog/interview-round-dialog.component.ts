import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-interview-round-dialog',
  templateUrl: './interview-round-dialog.component.html',
  styleUrls: ['./interview-round-dialog.component.scss']
})


export class InterviewRoundDialogComponent implements OnInit {

  rowData: any = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    public dialog: MatDialogRef<InterviewRoundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
   
    this.rowData = this.data?.data;
  }

  ngOnInit(): void {
  }

  openInterview(data: any) {
   
    this.router.navigate(['master/recruitment/scheduled-interview/interview'], { queryParams: { id: this.data?.data?.candidate_id, interview_round: data?.interview_round } })
    this.dialog.close();
  }

  viewInterviewDetail(data: any) {
    this.router.navigate(['master/recruitment/scheduled-interview/interview'], { queryParams: { id: this.data?.data?.candidate_id, interview_round: data?.interview_round, status: 'completed' } })
    this.dialog.close();
  }

}
