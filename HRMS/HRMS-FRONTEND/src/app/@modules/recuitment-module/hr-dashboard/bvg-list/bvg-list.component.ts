import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-bvg-list',
  templateUrl: './bvg-list.component.html',
  styleUrls: ['./bvg-list.component.scss']
})
export class BvgListComponent {
  recData: any
  rowClass: any;
  canID: any;
  showLoader: boolean = false;
  lastInterview:any;
  // rowData:any;
  constructor(
    private _empService: EmpRegistrationService,
    private route: Router, public dialog: MatDialog, private toast: ToastrService,
    private hrService: HrServiceService,
    private _recruitService: RecruitService,
    private _activateRout: ActivatedRoute,
    public dialogRef: MatDialogRef<BvgListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rowClass = 'rowClass';
    

    this.canID = data;
  }
  ngOnInit(): void {

    if (this.canID) {
      this.getdatabyId(this.canID);
    }
  };

  getdatabyId(id: any) {
    this.showLoader = true;
    this._recruitService.singleCandidateInHrDashboard(id).subscribe(res => {
      this.showLoader = false;
      this.recData = res.result[0];
      if(this.recData.schedule_fixed_interviews !==0 ){
        this.lastInterview = this.recData.schedule_fixed_interviews.at(-1);
        
      }
      
      
      
    }, (err) => {
      this.showLoader = false;
      
    })
  }
}
