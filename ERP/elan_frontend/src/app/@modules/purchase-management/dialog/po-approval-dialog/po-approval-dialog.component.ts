import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-po-approval-dialog',
  templateUrl: './po-approval-dialog.component.html',
  styleUrls: ['./po-approval-dialog.component.scss']
})
export class PoApprovalDialogComponent {
  form: FormGroup;

  constructor(
    public dialog: MatDialogRef<PoApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prService: PurchaseRequestService,
    private toast: ToastrService,
    private route: Router,
    private fb: FormBuilder,
    private accessCtrl: AccessControlService) {
    this.form = this.fb.group({
      approvel_status: new FormControl(null, [Validators.required]),
      remark: new FormControl(null, [Validators.required])
    })
  }

  onApprove() {
    let val = this.form.value;
    if (this.form.invalid) {
      this.toast.error("This is required fields");
      return
    }

    Swal.fire({
      title: `Do You Want to  ${val?.approvel_status} This PO ?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          approvel_status: val?.approvel_status,
          remark: val.remark,
          Approvel_status: val?.approvel_status,
          progressStatus: val?.approvel_status == "PUSH BACK" ? "OPEN" : "CLOSE",
          employee_id: this.accessCtrl.getEmployeeId(),
          warehouse_id: this.data?.warehouse_id,
          item_detail: this.data?.item_detail,
          service_detail: this.data?.data_service,
          final_status: val?.approvel_status,
          workflow_type: this.data?.po_category
        };
        this.prService.updateApprovelPO(this.data?.id, data).subscribe((res: any) => {
          this.dialog.close()
          this.toast.success(res.message);

          if (val?.approvel_status == "PUSH BACK") {
            this.route.navigate([
              'master/purchase-management/purchase-order',
            ], { queryParams: { tab: "po-issued" } });
          } else if (val?.approvel_status == "APPROVED") {
            this.route.navigate([
              'master/purchase-management/purchase-order',
            ], { queryParams: { tab: "approved-po" } });
          } else if (val?.approvel_status == "REJECTED") {
            this.route.navigate([
              'master/purchase-management/purchase-order',
            ], { queryParams: { tab: "rejected-po" } });
          }

        })
      }
    });
  }
}