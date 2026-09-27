import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rfp-quotation-details',
  templateUrl: './rfp-quotation-details.component.html',
  styleUrls: ['./rfp-quotation-details.component.scss']
})
export class RfpQuotationDetailsComponent {
  constructor(private toast: ToastrService,
    private prService: PurchaseRequestService,
    public dialog: MatDialog,
    private route: Router) { }

  onApproval(form: FormGroup) {
    try {
      let val = form.value;
      Swal.fire({
        title: 'Are you sure to send this Approval?',
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
            items_data: null,
            service_data: null,
            bom_data: null,
            department_id: val.department_id,
            pr_type: val?.type,
            entity_id: val.entity_id,
            financial_year_id: val.financial_year_id,
            approval_for: "RFP",
            remarks_approvel: val.remarks_approvel,
            purchase_request_id: val.id,
            approval_code: val.rfp_approval_id,
            workflow_type: "RFP",
            rfp_number: val.rfp_number,
          };
          if (form?.value.prCategory == 'Item') {
            payload.items_data = val.approvalQuoteTable;
          }
          this.prService.createApprovelRfp(payload).subscribe((res: any) => {
            if (res.code == 200) {
              this.toast.success('Quotation send successfully for approval', 'Fields Success');
              this.route.navigate(['master/purchase-management/vendor-quotation'], { queryParams: { tab: 'pending-approval' } })
            }
          }, err => {
            if (err) {
              this.toast.error(`${err.error.message}`);
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } catch (error) {

    }
  }
}

