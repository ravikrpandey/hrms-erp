import { Component,OnInit, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA ,MatDialog} from '@angular/material/dialog';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
// import { RecruitService } from 'src/app/@service/recruitment.service';

@Component({
  selector: 'app-fixedinterview-dialog',
  templateUrl: './fixedinterview-dialog.component.html',
  styleUrls: ['./fixedinterview-dialog.component.scss']
})
export class FixedinterviewDialogComponent {
  candidateId?: number;
  interviewCandidateData:any
  //interviewCandidateData: Candidate={}as Candidate;
 
   constructor(
     private recruitService: RecruitService,
     public dialog: MatDialogRef<FixedinterviewDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
   ) {
     this.candidateId = this.data.id;
     
   }
 
   ngOnInit(): void {
     this.recruitService.interViewGetIdBy(this.candidateId).subscribe((res:any)=>{
      
      this.interviewCandidateData = res.data;
     })
   }
}
