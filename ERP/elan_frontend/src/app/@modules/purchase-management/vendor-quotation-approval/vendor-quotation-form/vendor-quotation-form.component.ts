import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-quotation-form',
  templateUrl: './vendor-quotation-form.component.html',
  styleUrls: ['./vendor-quotation-form.component.scss']
})
export class VendorQuotationFormComponent {
  constructor(private toast: ToastrService,
    private prService: PurchaseRequestService,
    public dialog: MatDialog,
    private route: Router) { }

  onRejected(form: FormGroup) {
    try {
      const val = form.value;

      Swal.fire({
        title: 'Are you sure to reject this Quotation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#063178',
        cancelButtonColor: '#f44336',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          let payload = {
            approval_status: "REJECTED",
            progress_status: "CLOSE",
            department_id: val.department_id,
            employee_id: val.employee_id,
            pr_type: val?.type,
            entity_id: val.entity_id,
            financial_year_id: val.financial_year_id,
            workflow_type: val.quotation_for,
            remark: val.remarks_approvel,
            final_approval_status: "REJECTED",
            rfp_approval_id: val.rfp_approval_id,
          }

          this.prService.updateApproverMYRequestRfp(val.id, payload).subscribe((res: any) => {
            if (res.code == 200) {
              this.toast.success('Rejected successfully for approval', 'Success');
              this.route.navigate(['master/purchase-management/vendor-quotation'], { queryParams: { tab: 'rejected' } })
            }
          }, err => {
            if (err) {
              this.toast.error('Something Went Wrong', 'Fields Error');
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } catch (e: any) {
      console.log(e);
      this.toast.error(e?.message);
    }
  }

  onApproval(form: FormGroup) {
    try {
      const val = form.value;

      Swal.fire({
        title: 'Are you sure to approve this Quotation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#063178',
        cancelButtonColor: '#f44336',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          let payload = {
            approval_status: "APPROVED",
            progress_status: "CLOSE",
            department_id: val.department_id,
            employee_id: val.employee_id,
            pr_type: val?.type,
            entity_id: val.entity_id,
            financial_year_id: val.financial_year_id,
            workflow_type: val.quotation_for,
            remark: val.remarks_approvel,
            final_approval_status: "APPROVED",
            rfp_approval_id: val.rfp_approval_id,
          }

          this.prService.updateApproverMYRequestRfp(val.id, payload).subscribe((res: any) => {
            if (res.code == 200) {
              this.toast.success('Updated successfully for approval', 'Success');
              this.route.navigate(['master/purchase-management/vendor-quotation'], { queryParams: { tab: 'approved-cost' } })
            }
          }, err => {
            if (err) {
              this.toast.error('Something Went Wrong', 'Fields Error');
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } catch (error) {

    }
  }
}

