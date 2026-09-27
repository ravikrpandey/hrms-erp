import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppListDialogComponent } from '../app-list-dialog/app-list-dialog.component';
import { EmpMasterService } from '../services/emp-master.service';
import { RecruitService } from '../services/recruitment.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from '../services/rbac-master.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {
  jobIdNew: any;
  // data: string | null;
  emailIdNew: any;
  achivementId: any;
  grivanceId: any;
  complaint_id: any;
  helpDeskId: any;
  achieveId: any;
  resignId: any;
  announcmentStatus: any;
  openHouseTraining: any;
  assignAction: any;

  constructor(
    private route: Router,
    private _rbackService: RbacMasterService,
    private recruitService: RecruitService,
    private toast: ToastrService,
    private _empMasterService: EmpMasterService,
    public dialog: MatDialog
  ) {
    // this.data = localStorage.getItem("jobId");
    //
  }

  ngOnInit(): void {}
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }
  
  getValueToDisplay(params: ICellRendererParams) {
    if (params.data.id) {
      this.jobIdNew = params.data.id;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.id;
    }

    //internal announcement
    if (params.data.email_id) {
      this.emailIdNew = params.data.email_id;
      this.announcmentStatus = params.data.email_status;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.email_id;
    }

    // achivement
    if (params.data.achievement_id) {
      this.achivementId = params.data.achievement_id;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.achievement_id;
    }

    // griviance

    if (params.data.employee_grievance_id) {
      this.grivanceId = params.data.employee_grievance_id;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.employee_grievance_id;
    }

    // complaint

    if (params.data.employee_complaint_id) {
      this.complaint_id = params.data.employee_complaint_id;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.employee_complaint_id;
    }

    //help disk

    if (params.data.employee_helpDesk_id) {
      this.helpDeskId = params.data.employee_helpDesk_id;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.employee_helpDesk_id;
    }

    // resignation
    if (params.data.employee_resignation_id) {
      this.resignId = params.data.employee_resignation_id;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.employee_resignation_id;
    }

    //open house training
    if (params.data.open_house_training_id) {
      this.openHouseTraining = params.data.open_house_training_id;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.open_house_training_id;
    }
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    e.stopPropagation();

    // if (this.resignId) {
    //   this.route.navigate(['master/hrms/employee-master/resignation-create'], { queryParams: { resign_id: this.cellValue } })
    // }

    //
    if (this.jobIdNew) {
      this.route.navigate(['master/recruitment/job-create'], {
        queryParams: { job_id: this.cellValue },
      });
    }
    // edit(e: any) {
    //   e.stopPropagation();
    // }
    //internal announcement
    if (this.emailIdNew) {
      if (this.announcmentStatus == 'draft') {
        this.route.navigate(
          ['master/ess/announcement-create'],
          { queryParams: { email_id: this.cellValue } }
        );
      } else if (this.announcmentStatus == 'send') {
        this.toast.warning('Email Allready Send');
      }
    }

    //achivement
    if (this.achivementId) {
      this.route.navigate(['master/ess/achievement-create'], {
        queryParams: { achievement_id: this.cellValue },
      });
    }

    //grivance
    if (this.grivanceId) {
      this.route.navigate(
        ['master/ess/grievance/grievance_create'],
        { queryParams: { employee_grievance_id: this.cellValue } }
      );
    }

    //complaint
    if (this.complaint_id) {
      this.route.navigate(['master/ess/complaint-create'], {
        queryParams: { complaintId: this.cellValue },
      });
    }

    //help-disk
    if (this.helpDeskId) {
      // alert(1)
      this.route.navigate(
        ['master/ess/help-disk/help-disk-create'],
        { queryParams: { employee_helpDesk_id: this.cellValue } }
      );
    }

    if (this.openHouseTraining) {
      this.route.navigate(
        ['master/audit/pre-audit/open-house-training/create-training'],
        { queryParams: { openHousetrainingId: this.cellValue } }
      );
    }
  }

  calculateRatio(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/audit/pre-audit/revenue-list'], {
      queryParams: { open_house_training_id: this.cellValue },
    });
  }
    delete(e: any) {
    //

    if (this.jobIdNew) {
      this.jobDescription();
    }
    if (this.resignId) {
      this.deleteResignation();
    }

    //announcement
    if (this.emailIdNew) {
      this.announcementDelete();
    }

    //grivance
    if (this.grivanceId) {
      this.grivanceDelete();
    }

    //complaint
    if (this.complaint_id) {
      this.complaintDelete();
    }

    if (this.helpDeskId) {
      // alert('delete helpdesk')
      this.helpDiskDelete();
    }

    if (this.achivementId) {
      // alert('delete achive')
      this.achivementDelete();
    }

    e.stopPropagation();
  }

  // job description
  jobDescription() {
    const data = {
      jobId: Number(this.cellValue),
    };
    this.recruitService.deleteJob(data).subscribe((res: any) => {
      this.toast.success('Job Details Deleted successfully..');
      window.location.reload();
    });
  }

  deleteResignation() {
    const data = {
      resign_id: Number(this.cellValue),
    };
    this.recruitService
      .deleteResignation(this.resignId, data)
      .subscribe((res: any) => {
        this.toast.success('Resignation Deleted Successfully..');
        window.location.reload();
      });
  }

  //announcement
  announcementDelete() {
    const data2 = {
      email_id: Number(this.cellValue),
    };

    const emilId = data2.email_id;
    this._empMasterService
      .deleteAnnounce(this.emailIdNew, data2)
      .subscribe((res: any) => {
        this.toast.success(' Deleted successfully..');
        window.location.reload();
      });
  }

  //grivance
  grivanceDelete() {
    Swal.fire({
      title: 'Are you sure want to remove it?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#858586',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Skip',
    }).then((result) => {
      if (result.value) {
        this._empMasterService
          .deleteGrievanceById(this.grivanceId)
          .subscribe((res) => {
            window.location.reload();
          });
        // Swal.fire(
        //   'Deleted!',
        //   'Your imaginary file has been deleted.',
        //   'success'
        // )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    });
  }

  //complaint
  complaintDelete() {
    Swal.fire({
      title: 'Are you sure want to remove it?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this._empMasterService
          .deleteCompalintById(this.complaint_id)
          .subscribe((res) => {
            window.location.reload();
          });
        // Swal.fire(
        //   'Deleted!',
        //   'Your imaginary file has been deleted.',
        //   'success'
        // )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    });
  }

  //help-disk
  helpDiskDelete() {
    if (
      confirm('Are you sure you want to Delete this thing into the database?')
    ) {
      this._empMasterService
        .deleteHelpDesk(this.helpDeskId)
        .subscribe((res) => {
          this.toast.success('Grievancy Data is Deleted Successfully!');
          window.location.reload();
        });
    }
  }

  //achivement delete

  achivementDelete() {
    const data = {
      achieveId: this.cellValue,
    };
    this.achieveId = Number(this.cellValue);
    this.recruitService
      .deleteAchievement(this.achieveId, data)
      .subscribe((res: any) => {
        this.toast.success('Achievement Deleted successfully..');
        window.location.reload();
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AppListDialogComponent, {
      width: '150%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      panelClass: 'full-screen-modal',
      data: { id: this.cellValue },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
