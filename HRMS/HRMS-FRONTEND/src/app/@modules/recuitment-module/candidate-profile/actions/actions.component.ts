import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { EmailSendeComponent } from 'src/app/@shared/components/email-sende/email-sende.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ProfileActionsComponent implements OnInit {
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
  private paramsVal: any;
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

  edit(e: any) {
    console.log(this.cellValue);

    e.stopPropagation();
    this.route.navigate(['master/recruitment/profile-create'], {
      queryParams: { candidate_id: this.cellValue, },
    });
    // edit(e: any) {
    // e.stopPropagation();
    // }
  }
  requestApprove(e: any) {
    e.stopPropagation();
    if (this.paramsVal.status === 'Not Reviewed') {
      this.toaster.info(`${this.paramsVal.condidate_name} has not been reviewed by the assigned hiring manager`)
    } else {
      Swal.fire({
        title: 'Are you sure for Shortlist this Profile',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'Not Now'
      }).then((result) => {
        if (result.isConfirmed) {
          const data: any = {
            selection_status: 'approve',
            candidate_id: this.paramsVal?.id,
          };
          this.$condidateProfile.update_candidate_profile(data).subscribe(
            (res) => {
              this.toaster.success(`${this.paramsVal.condidate_name} has been shortlisted, Go and fixed the interview`, "Shortlisted successfully")
              this.reloadCurrentRoute();
            }, (err) => {
              this.toaster.error('Something went wrong please try again', "Error Message")
            }
          )
        }
      });
    }



  }

  openDialog() {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      panelClass: 'full-screen-modal',
      data: { id: this.cellValue },
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  emailSend(e: any) {
    e.stopPropagation();

    const dialogRef = this.dialog.open(EmailSendeComponent, {
      width: '40%',
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      height: '70%',
      position: { bottom: '10px', right: '10px' },
      panelClass: 'full-screen-modal',
      data: { id: this.cellValue },
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }

}
