import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { RecruitService } from 'src/app/@service/recruitment.service';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { Candidate } from '../candidate-profile-list/candidate-profile-list.component';
@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent {
  candidateId?: number;
  singleCandidateData: Candidate={}as Candidate;

  constructor(
    private recruitService: RecruitService,
    private _recruitService: RecruitService,
    public dialog: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.candidateId = this.data.id;
    
  }

  ngOnInit(): void {
    if (this.data) {
      this._recruitService
        .singleCandidateInfoById(this.candidateId)
        .subscribe((res: any) => {
          
          this.singleCandidateData = res.data;
        });
    } else {
      
    }
  }
}
