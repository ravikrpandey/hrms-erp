import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DeliveryServicesService } from 'src/app/@shared/services/warehouse/delivery-services.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-delivery-action',
  templateUrl: './delivery-action.component.html',
  styleUrls: ['./delivery-action.component.scss']
})
export class DeliveryActionComponent {
params: any;

cellValue:any;
  constructor(private router:Router,public dialog: MatDialog, 
    private toasterService:ToastrService, 
    private deliveryServices: DeliveryServicesService){
  }

  ngOnInit(): void {

  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  return(){
    this.router.navigate(['master/sales/return/create-so-return'], {
      queryParams: { so_id: this.cellValue.salesOrderId,type:'RETURN' },
    });
  }

  podStatus() {
    Swal.fire({
      title: 'POD Verification',
      html: `
        <div style="padding:10px 0">

          <div style="display:flex;gap:10px;justify-content:center;margin-bottom:15px;">
            <button type="button" id="approveBtn"
              style="padding:8px 20px;border:1px solid #28a745;border-radius:6px;background:#fff;color:#28a745;cursor:pointer;">
              ✓ Approve
            </button>

            <button type="button" id="rejectBtn"
              style="padding:8px 20px;border:1px solid #dc3545;border-radius:6px;background:#fff;color:#dc3545;cursor:pointer;">
              ✕ Reject
            </button>
          </div>

          <textarea
            id="rejectReason"
            class="swal2-textarea"
            placeholder="Enter rejection reason..."
            style="display:none;width:100%;margin:0;resize:none;"
          ></textarea>

        </div>
      `,
      confirmButtonText: 'Submit',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      allowOutsideClick: () => !Swal.isLoading(),
      showLoaderOnConfirm: true,

      didOpen: () => {
        let selectedStatus = '';

        const approveBtn = document.getElementById('approveBtn') as HTMLButtonElement;
        const rejectBtn = document.getElementById('rejectBtn') as HTMLButtonElement;
        const reasonEl = document.getElementById('rejectReason') as HTMLTextAreaElement;

        approveBtn.onclick = () => {
          selectedStatus = 'APPROVED';

          approveBtn.style.background = '#28a745';
          approveBtn.style.color = '#fff';

          rejectBtn.style.background = '#fff';
          rejectBtn.style.color = '#dc3545';

          reasonEl.style.display = 'none';
          reasonEl.value = '';

          (window as any).selectedPodStatus = selectedStatus;
        };

        rejectBtn.onclick = () => {
          selectedStatus = 'REJECTED';

          rejectBtn.style.background = '#dc3545';
          rejectBtn.style.color = '#fff';

          approveBtn.style.background = '#fff';
          approveBtn.style.color = '#28a745';

          reasonEl.style.display = 'block';

          (window as any).selectedPodStatus = selectedStatus;
        };
      },

      preConfirm: async () => {
        const status = (window as any).selectedPodStatus;
        const reason = (
          document.getElementById('rejectReason') as HTMLTextAreaElement
        )?.value?.trim();

        if (!status) {
          Swal.showValidationMessage('Please select Approved or Rejected');
          return false;
        }

        if (status === 'REJECTED' && !reason) {
          Swal.showValidationMessage('Rejection reason is required');
          return false;
        }

        try {
          const payload = {
            so_id: this.cellValue.salesOrderId,
            dispatch_status: status,
            pod_remark: reason
          };

          const response: any = await firstValueFrom(
            this.deliveryServices.updatePodStatus(payload)
          );

          return response;

        } catch (err: any) {
          Swal.showValidationMessage(
            err?.error?.message || 'Something went wrong'
          );
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: result.value?.message || 'POD status updated successfully'
        }).then(() => {
          if (this.params?.refreshGrid) {
            this.params.refreshGrid();
          }
        });
      }
    });
  }

}