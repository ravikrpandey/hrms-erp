import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';

@Component({
  selector: 'app-leave-details-popup',
  templateUrl: './leave-details-popup.component.html',
  styleUrls: ['./leave-details-popup.component.scss']
})
export class LeaveDetailsPopupComponent {
  leaveDetails: any;
  isReject: boolean = false;
  actionVal: any;
  rejectReason: FormControl = new FormControl(null);

  constructor(
    public dialog: MatDialogRef<LeaveDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private _hrService: HrServiceService
  ) {
    
    this.leaveDetails = data;
  }

  action(e: any) {
    this.actionVal = e.value;
    if (e.value === "REJECTED") {
      this.isReject = true;
    } else {
      this.isReject = false;
    };
  }

  submit(Ap_leaveID: any, cr: FormControl) {
    
    if(!this.actionVal){
      this.toaster.error('Action failed should not be blank');
      return;
    }

    if (this.actionVal === 'APPROVED') {
      const data_1 = {
        leave_apply_status: 'APPROVED'
      };
      this.aproveAndRejctLeave(Ap_leaveID, data_1);

    }else if( this.actionVal === 'REJECTED'){
      if (cr.value === null || cr.value === "") {
        this.toaster.error('Give reason of leave rejection');
        return;
      };
      const data_2 = {
        leave_apply_status: 'REJECTED',
        reason_of_reject: cr.value
      }
      this.aproveAndRejctLeave(Ap_leaveID, data_2);
    };
  };

  aproveAndRejctLeave(id: any, data: any) {
    this._hrService.appliedLeaveStatus_update(id, data).subscribe(
      (res) => {
        
        this.toaster.success(`Applied leave ${this.actionVal} successfully`);
        this.dialog.close('done');
      }, (err) => {
        
        this.toaster.error('Somthing went wrong please try again', 'Error Message');
      }
    )
  };

  fondColor(){
    let status = this.leaveDetails.leave_apply_status;
    if(status === "APPROVED"){
      return 'color: green';
    }else if(status === "REJECTED"){
      return 'color: red';
    }else{
      return 'color: orange';
    }
  }
}
