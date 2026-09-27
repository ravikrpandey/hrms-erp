import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { Location } from '@angular/common';
import { Console } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent {

  planningData: any = [];
  vpId: any;
  mode: string = 'create';

  constructor(
    private toast: ToastrService,
    private inventoryService: InventoryManagementService,
    private route: ActivatedRoute,
    private location: Location,
    private salesService: SalesService,
    private router: Router,
  ) {
  }

  status:any
  irnstatus:any

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.vpId = params['id'];
      this.mode = params['action_type'];
      this.status = params['status'];
      this.irnstatus = params['irnStatus'];
      if (this.vpId) {
        this.getVpDetails(this.vpId)
      }
    });
  }

  getVpDetails(vpId: string) {
    this.inventoryService.getInvoiceById(vpId).subscribe(
      (next: any) => {
        this.planningData = next.data;
      },
      (error: any) => { }
    );
  }

  getParentItems(items: any[]): any[] {
    return items.filter(item => !item.parent_item_id);
  }
  
  getChildItems(items: any[], parentId: number): any[] {
    if (!items?.length) {
      return [];
    }

    return items.filter(
      (item: any) => Number(item.parent_item_id) === Number(parentId)
    );
  }

  viewSerialNo(soId: any, planningId: any) {
    this.inventoryService.getMapSerialNoBySOId(soId, planningId).subscribe(
      (next: any) => {
        this.showSerialBatchPopup(next.data);
      },
      (error: any) => { }
    );
  }

  showSerialBatchPopup(data: any[]) {

    let html = `
      <div style="max-height:500px;overflow:auto;">
        <table border="1" cellpadding="6" cellspacing="0"
          style="width:100%;border-collapse:collapse;text-align:left;">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Item Code</th>
              <th>Batch No</th>
              <th>Serial No</th>
            </tr>
          </thead>
          <tbody>
    `;

    data.forEach(item => {

      const batches = item.serial_batch_data
        .map((x: any) => x.batch_no)
        .filter((v: any) => v)
        .join('<br>');

      const serials = item.serial_batch_data
        .map((x: any) => x.serial_no || '-')
        .join('<br>');

      html += `
        <tr>
          <td>${item.item_name}</td>
          <td>${item.item_code}</td>
          <td>${batches}</td>
          <td>${serials}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    Swal.fire({
      title: 'Mapped Serial / Batch Details',
      html,
      width: '900px',
      confirmButtonText: 'Close'
    });
  }

  downloadpdf(id: any) {
    this.inventoryService.pdfDownload(this.vpId, id)
      .subscribe({
        next: (res) => {
          const blob = res.body as Blob;

          let fileName = "dispatch_pick_list.pdf";
          const contentDisposition = res.headers.get('Content-Disposition');
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match && match[1]) fileName = match[1];
          }

          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName;
          link.click();

          window.URL.revokeObjectURL(downloadUrl);
        },
        error: (err) => {
          this.toast.error(err.error?.message || "Failed to download PDF");
        }
      });
  }

  goBack() {
    this.location.back();
  }

  createIrn(){
    const payload ={
      vehicle_planing_id :this.vpId
    }
      this.salesService.genrateIRN(payload).subscribe(
            (response: any) => {
              this.toast.success('Generate IRN successFully');
              this.router.navigate([
                '/master/warehouse-management/e-invoice-list',
              ]);
            },
  
            (error: any) => {
            
              const errors = error.error?.message?.errors;
          
              if (Array.isArray(errors)) {
                errors.forEach((i: any) => {
                  this.toast.error(i.ErrorMessage || 'Error occurred');
                });
              } else {
                this.toast.error(error?.message || 'Something went wrong');
              }
            })
        
          
    }
}
