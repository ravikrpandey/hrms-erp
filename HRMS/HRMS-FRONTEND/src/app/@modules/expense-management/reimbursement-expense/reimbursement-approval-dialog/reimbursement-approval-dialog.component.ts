import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reimbursement-approval-dialog',
  templateUrl: './reimbursement-approval-dialog.component.html',
  styleUrls: ['./reimbursement-approval-dialog.component.scss'],
})
export class ReimbursementApprovalDialogComponent {
  travereqid: any;
  getData: any = [];
  remarksForm: FormGroup;
  loginUser: any;

  constructor(
    public dialog: MatDialogRef<ReimbursementApprovalDialogComponent>,
    public dialogf: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private route: Router,
    private _commonService: CommonService,
    public travelService: TravelRequestService,
    private fb: FormBuilder
  ) {
    this.travereqid = this.data;
    this.remarksForm = this.fb.group({
      remarks: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.localStorage();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
  }

  approve() {
    let val = this.remarksForm.value;
    const payload = {
      approvel_status: 'APPROVED',
      employee_id: this.loginUser.employee_id,
      remarks: val.remarks,
    };
    Swal.fire({
      title: 'Are you sure you want to approve it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader();
        this.travelService
          .expense_approve_level(this.travereqid, payload)
          .subscribe(
            (res) => {
              this._commonService?.hideLoader();
              this.toaster.success('Approved successfully');
              this.travelService.changeStatus('2');
              this.route.navigate([
                '/master/expense-management/reimbursement-expense',
              ]);
              this.dialogf.closeAll();
            },
            (err) => {
              this._commonService?.hideLoader();
              this.toaster.error(
                'Somthing went wrong Please try agin',
                'Error Message'
              );
            }
          );
      }
    });
  }

  reject() {
    let val = this.remarksForm.value;
    const payload = {
      approvel_status: 'REJECTED',
      employee_id: this.loginUser.employee_id,
      remarks: val.remarks,
    };
    Swal.fire({
      title: 'Are you sure you want to reject it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader();
        this.travelService
          .expense_approve_level(this.travereqid, payload)
          .subscribe(
            (res) => {
              this._commonService?.hideLoader();
              this.toaster.success('Rejected successfully');
              this.travelService.changeStatus('3');
              this.route.navigate([
                '/master/expense-management/reimbursement-expense',
              ]);
              this.dialogf.closeAll();
            },
            (err) => {
              this._commonService?.hideLoader();
              this.toaster.error(
                'Somthing went wrong Please try agin',
                'Error Message'
              );
            }
          );
      }
    });
  }
}
