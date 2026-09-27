import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pr-approval-dialog',
  templateUrl: './pr-approval-dialog.component.html',
  styleUrls: ['./pr-approval-dialog.component.scss'],
})
export class PrApprovalDialogComponent {
  form: FormGroup;
  workflow_type: string;
  procurement_id: number;

  constructor(
    public dialog: MatDialogRef<PrApprovalDialogComponent>,
    private prService: PurchaseRequestService,
    private toast: ToastrService,
    private route: Router,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accessCtrl: AccessControlService,
  ) {
    this.workflow_type = data?.prCategory;
    this.procurement_id = data?.id;

    this.form = this.fb.group({
      remarks: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  updatePrRemarkApprove() {
    const val = this.form.value;
    if (this.form.invalid) {
      return this.toast.error('Remark Is required');
    }

    Swal.fire({
      title: 'Do You Want to Approve This PR?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          approvel_status: 'APPROVED',
          progressStatus: 'CLOSE',
          employee_id: this.accessCtrl.getEmployeeId(),
          final_status: 'APPROVED',
          workflow_type: 'Purchase',
          remark: val.remarks,
        };

        this.prService.approvelUpdate(this.procurement_id, data).subscribe(
          (res: any) => {
            this.dialog.close();
            if (res.code == 200) {
              this.toast.success(res.message);
              this.route.navigate([
                'master/purchase-management/purchase-request',
                { queryParams: { tab: 'approved-pr' } },
              ]);
            }
          },
          (err: any) => {},
        );
      }
    });
  }

  updatePrRemarkReject() {
    let val = this.form.value;
    if (this.form.invalid) {
      this.toast.error('Remark Is required');
      return;
    }
    Swal.fire({
      title: 'Do You Want to Reject This PR?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          approvel_status: 'REJECTED',
          progressStatus: 'CLOSE',
          employee_id: this.accessCtrl.getEmployeeId(),
          final_status: 'REJECTED',
          workflow_type: this.data?.workflow_type,
          remark: val.remarks,
        };

        this.prService
          .approvelUpdate(this.procurement_id, data)
          .subscribe((res: any) => {
            this.dialog.close();
            if (res.code == 200) {
              this.toast.success(res.message);
              this.route.navigate([
                'master/purchase-management/purchase-request',
                { queryParams: { tab: 'rejected-pr' } },
              ]);
            }
          });
      }
    });
  }
}
