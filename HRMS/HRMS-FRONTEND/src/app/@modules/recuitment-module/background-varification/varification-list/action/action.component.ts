import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EmailSendeComponent } from 'src/app/@shared/components/email-sende/email-sende.component';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';
import { ProfileDialogComponent } from '../../../candidate-profile/profile-dialog/profile-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  assignAction:any;
  employee_id: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private _recrutmentService: RecruitService,
    private _rbackService:RbacMasterService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    console.log('loginUser', loginUser);
    this.employee_id = loginUser.employee_id;
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
    console.log('cell',this.cellValue);
    
    

  }

  getValueToDisplay(params: ICellRendererParams) {
    
    return params.data.candidate_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  candidateOnboard(e: any) {
    e.stopPropagation();
    if (this.paramsVal.status === 'Not Reviewed') {
      this.toaster.info(`${this.paramsVal.condidate_name} has not been reviewed by the assigned hiring manager`)
    } else {
      Swal.fire({
        title: 'Are you sure to onboard this candidate',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'Not Now'
      }).then((result) => {
        if (result.isConfirmed) {
          const data: any = {
            employee_id: this.employee_id,
          };
          this._recrutmentService.goFor_onboard(this.cellValue, data).subscribe(
            (res) => {
              
               this.toaster.success(res.message)
              this.reloadCurrentRoute();
            }, (err) => {
           
              
              this.toaster.error(err.error.message)
            }
          )
          
          
        }
      });
    }
    
    

  }

}
