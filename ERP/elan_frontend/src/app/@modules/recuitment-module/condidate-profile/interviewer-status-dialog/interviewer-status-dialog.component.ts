import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';

@Component({
  selector: 'app-interviewer-status-dialog',
  templateUrl: './interviewer-status-dialog.component.html',
  styleUrls: ['./interviewer-status-dialog.component.scss']
})


export class InterviewerStatusDialogComponent implements OnInit {

  rowData: any = {};
  dataList: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private condidateProfile: CondidateProfileService,
    public dialog: MatDialogRef<InterviewerStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.rowData = this.data?.data;
  }

  ngOnInit(): void {
    this.get_cand_interviewer_details();
  }

  get_cand_interviewer_details() {
    let query = {
      candidate_id: this.rowData?.candidate_id,
      jd_id: this.rowData?.jd_id,
      interview_round: this.rowData?.interview_round,
    }
    this.condidateProfile.get_cand_interviewer_details(query).subscribe((res: any) => {
      if (res) {
        this.dataList = res?.data;
      }
    })
  }

}
