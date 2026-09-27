import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { InterviewRoundStatusDialogComponent } from 'src/app/@modules/recuitment-module/condidate-profile/interview-round-status-dialog/interview-round-status-dialog.component';
import { InterviewScheduleDialogComponent } from 'src/app/@modules/recuitment-module/condidate-profile/interview-schedule-dialog/interview-schedule-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  assignAction: any;
  baseUrl: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private _recrutmentService: RecruitService,
    private _rbackService: RbacMasterService,
    private $condidateProfile: CondidateProfileService,
  ) {

    this.baseUrl = environment?.servralUrl;
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

  changeStatus(e: any, status: any) {
    e.stopPropagation();
    if (this.paramsVal.status === 'Not Reviewed') {
      this.toaster.info(`${this.paramsVal.condidate_name} has not been reviewed by the assigned hiring manager`)
    } else {
      Swal.fire({
        title: `Are you sure for ${status} this Profile ?`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'Not Now'
      }).then((result) => {
        if (result.isConfirmed) {

          const data: any = {
            selection_status: status,
            candidate_id: this.paramsVal?.id,
          };
          this.$condidateProfile.update_candidate_profile(data).subscribe(
            (res) => {

              this.toaster.success(`Candidate has been ${status}`, "Shortlisted successfully")
              // this.reloadCurrentRoute();
            }, (err) => {
              this.toaster.error('Something went wrong please try again', "Error Message")
            }
          )
        }
      });
    }
  }

  openScheduleDialog(e: any) {

    e.stopPropagation()
    const dialogRef = this.dialog.open(InterviewScheduleDialogComponent, {
      width: '40%',
      data: { data: this.paramsVal }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  viewInterviewDetails() {

    console.log(this.paramsVal)
   // this.route.navigate(['master/recruitment/candidate-profile/view-interview-details'], { queryParams: { candidate_id: this.paramsVal?.id, jd_id: this.paramsVal?.job_descripition_id } })
  }

  viewStatus(e: any) {
    e.stopPropagation()
    const dialogRef = this.dialog.open(InterviewRoundStatusDialogComponent, {
      width: '40%',
      data: { data: this.paramsVal }
    });

    dialogRef.afterClosed().subscribe((result:any) => {
    });
  }

}

