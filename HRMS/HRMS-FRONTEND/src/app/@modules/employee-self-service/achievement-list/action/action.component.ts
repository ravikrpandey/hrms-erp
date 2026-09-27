import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { AchievementDialogComponent } from '../achievement-dialog/achievement-dialog.component';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  achieveId: any;

  constructor(private route: Router, private recruitservice : RecruitService ,
    public dialog: MatDialog, private toast: ToastrService, private recruitService: RecruitService) {
  }

  ngOnInit(): void {
    
    
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.data.achievement_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e:any) {
    e.stopPropagation();
    // 
    this.route.navigate(['master/ess/achievement-create'], { queryParams: { achievement_id: this.cellValue }})
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }

  delete(e:any){
    
    const data = {
      achieveId: this.cellValue
    }
    this.achieveId = Number(this.cellValue)
    this.recruitService.deleteAchievement(this.achieveId, data).subscribe((res:any)=>{
      
      this.toast.success("Achievement Deleted successfully..");
      window.location.reload();
    })
    e.stopPropagation();

    
  }
  openDialog() {
    const dialogRef
      = this.dialog.open(AchievementDialogComponent, {
        width: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        panelClass: 'full-screen-modal',
        data: { id: this.cellValue }
      });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
