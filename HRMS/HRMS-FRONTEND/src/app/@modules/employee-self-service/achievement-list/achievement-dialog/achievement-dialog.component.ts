import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-achievement-dialog',
  templateUrl: './achievement-dialog.component.html',
  styleUrls: ['./achievement-dialog.component.scss']
})
export class AchievementDialogComponent {
  rowData: any;
  achievement_id: any;
  achievemenList: any;

  constructor(private _empService: EmpRegistrationService,
    private recruitService: RecruitService,
    public dialog: MatDialogRef<AchievementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.achievement_id = this.data.id
      
      
}
ngOnInit(): void {
  if(this.achievement_id){
    
    
    this.recruitService.achievementDetails(this.achievement_id).subscribe((res: any) => {
      this.achievemenList = res.data[0];
      
      // this.title = JSON.parse(res.data.reporting_manager).title;
      // this.lastName =  JSON.parse(res.data.reporting_manager).first_name;
      // this.reportingManager = JSON.parse(res.data.reporting_manager).reporting_manager;
    })
  }else{
    
  }
}
}
