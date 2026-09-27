import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss']
})
export class PrintDialogComponent implements OnInit {
  onBoardingData:any;
  onBoardingId:any;
   constructor(private recruitService:RecruitService,
    public dialog: MatDialogRef<PrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){

      // if (this.data.onBoardingId) {
        this.onBoardingId = this.data;
        
        
      // }
   }
   ngOnInit(): void {
   //on-boarding
   // alert('view helpdisk')
   this.recruitService.getSingleOnBoarding(this.onBoardingId).subscribe((res: any) => {
   this.onBoardingData = res.data;
   
   })
   }
}
