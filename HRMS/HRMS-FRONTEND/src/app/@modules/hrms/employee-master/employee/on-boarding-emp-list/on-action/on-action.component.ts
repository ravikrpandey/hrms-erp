import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { OnboardingService } from 'src/app/@shared/services/service/recruitment/onboarding.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { OnboardingApprovalDialogComponent } from '../onboarding-approval-dialog/onboarding-approval-dialog.component';

@Component({
  selector: 'app-on-action',
  templateUrl: './on-action.component.html',
  styleUrls: ['./on-action.component.scss']
})
export class OnActionComponent {
  // data: string | null;
  cellValue: any;
  singleData: any = {};
  joId: any;
  assignAction: any;
  employee_id: any;
  baseHref: any;

  constructor(
    private route: Router,
    private _rbackService: RbacMasterService,
    private recruitService: RecruitService,
    private toast: ToastrService,
    private employService: EmpRegistrationService,
    private onboarding: OnboardingService,
    public dialog: MatDialog,
  ) {
    this.baseHref = environment.baseHref;
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    this.employee_id = loginUser.employee_id;
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.data.employee_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


  deletes(e: any) {
    e.stopPropagation();

    Swal.fire({
      title: 'Are you sure to Approve this Candidate ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.cellValue);

        const data = localStorage.getItem('signInUser');
        let user = data ? JSON.parse(data) : null;
        if (user.role == 'Hr_Admin' || user.role == 'HR_Team') {
          this.toast.success('Employee Approved')
          this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'], { queryParams: { employee_id: this.cellValue } })
          this.employService.setEmpId(Number(this.cellValue))
        } else {

          this.toast.error('Your role is not Hr_Admin')
        }

      };
    });
  }

  sendLinkForCreateEmployeeDetail() {
    let entity_id = localStorage.getItem("selectedEntityId");
    let req = {
      candidate_id: this.singleData?.candidate_id,
      entityId: entity_id,
      link_url: this.baseHref + 'create-employee-module/employ/employee-create/basic-details',
    }
    this.onboarding.sendmail_to_fill_candidate_details(req).subscribe((res: any) => {
      if (res) {
        this.toast.success(res?.message);
        try {
          
          navigator.clipboard.writeText(res.link_url).then(() => {
            this.toast.success(`link:- ${res.link_url} copied successfully`);
          }).catch(err => {
            console.error('Failed to copy the link:', err);
            this.toast.error('Failed to copy link');
          });
        } catch (err) {
          console.error('Clipboard API not supported:', err);
          this.toast.error('Clipboard API not supported');
        }
      }
    },
      (err: any) => {
        if (err.error.code == 404) {
          this.toast.warning(err.error.message)
        }
        this.toast.error(err.error.message)

      }
    )
  }

  approveOnboardingEmployee(e: any) {
    e.stopPropagation()
    const dialogRef
      = this.dialog.open(OnboardingApprovalDialogComponent, {
        width: '30%',
        data: { data: this.singleData }
      });

    dialogRef.afterClosed().subscribe(result => {
      
      if (result) {
        this.singleData.onboarding_status = 'COMPLETED';
      }
    });
  }


}
