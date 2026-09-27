import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { EmailSendeComponent } from 'src/app/@shared/components/email-sende/email-sende.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
import { ProfileDialogComponent } from '../../candidate-profile/profile-dialog/profile-dialog.component';
import { InterviewRoundDialogComponent } from '../interview-round-dialog/interview-round-dialog.component';

@Component({
  selector: 'app-schedule-interview-action',
  templateUrl: './schedule-interview-action.component.html',
  styleUrls: ['./schedule-interview-action.component.scss'],
})
export class ScheduleInterviewActionComponent implements OnInit {
  assignAction: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private _recrutmentService: RecruitService,
    private _rbackService: RbacMasterService,
    private $condidateProfile: CondidateProfileService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  public paramsVal: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
  
    this.paramsVal = params.data;
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data.candidate_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  // openInterview() {
 
  //   this.route.navigate(['master/recruitment/scheduled-interview/interview'], { queryParams: { id: this.paramsVal?.id } })
  // }

  openInterviewRound(e: any) {
    
    e.stopPropagation()
    const dialogRef = this.dialog.open(InterviewRoundDialogComponent, {
      width: '40%',
      data: { data: this.paramsVal }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
