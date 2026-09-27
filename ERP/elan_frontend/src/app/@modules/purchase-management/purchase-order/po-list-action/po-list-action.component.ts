import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-po-list-action',
  templateUrl: './po-list-action.component.html',
  styleUrls: ['./po-list-action.component.scss'],
})
export class PoListActionComponent {
  public cellValue: any;
  assignAction: ModuleAction;
  paramsData: any;
  params: ICellRendererParams;
  serviceType: string;
  getdataCopy: any;
  approvedCondi: boolean = false;
  tab: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private prService: PurchaseRequestService,
    private cryptoService: CryptoService,
    private route: ActivatedRoute,
    private toast: ToastrService,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.tab = params['tab'];
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 200);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.paramsData = params?.data;
  }

  onCellClicked(e: any) {
    e.stopPropagation();
    let flag = 0;
    if (
      this.paramsData.final_status == 'APPROVED' ||
      this.paramsData.final_status == 'REJECTED'
    ) {
      flag = 1;
    }
    this.router.navigate(
      ['master/purchase-management/purchase-order/create-po'],
      {
        queryParams: {
          id: this.paramsData.PO_id,
          type: 'View',
          status: this.paramsData?.po_category,
          flag: flag,
        },
      },
    );
  }

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['master/purchase-management/purchase-order/create-po'],
      {
        queryParams: {
          id: this.paramsData.PO_id || this.paramsData.id,
          type: 'Edit',
          status: this.paramsData?.po_category,
        },
      },
    );
  }

  proceedToApp(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['master/purchase-management/purchase-order/create-po'],
      {
        queryParams: {
          id: this.paramsData.PO_id,
          status: this.paramsData?.po_category,
          type: 'Approval',
        },
      },
    );
  }

  createShippingAlert(e: any) {
    e.stopPropagation();

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['approved-shipping-alert'], {
        queryParams: {
          po_id: this.cryptoService.encrypt(this.paramsData.PO_id),
          vendor_id: this.cryptoService.encrypt(this.paramsData.vendor_id),
        },
      }),
    );
    window.open(url, '_blank');
  }

  onDelete(e: any) {
    e.stopPropagation();
    const poId = this.paramsData.PO_id || this.paramsData.id;
    if (!poId) {
      this.toast.error('Purchase Order ID not found');
      return;
    }

    Swal.fire({
      title: 'Are you sure you want to Delete this Purchase Order?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#858586',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.prService.deletePo(poId).subscribe({
          next: (res: any) => {
            this.toast.success(
              res.message || 'Purchase Order deleted successfully',
            );
            // remove the deleted row from ag-grid if available to avoid full route reload
            try {
              if (this.params && (this.params as any).api) {
                (this.params as any).api.applyTransaction({
                  remove: [this.paramsData],
                });
              } else {
                // fallback to full reload if grid API is not accessible
                window.location.reload();
              }
            } catch (err) {
              window.location.reload();
            }
          },
          error: (err: any) => {
            this.toast.error(
              err.error?.message || 'Failed to delete Purchase Order',
            );
          },
        });
      }
    });
  }

  reloadCurrentRoute(e: any) {
    e.stopPropagation();
    const currentUrl = this.router.url;
    // avoid navigating to '/' (can trigger auth/logout). Force a route reload
    // by temporarily disabling reuse for this navigation.
    const reuseStrategy = this.router.routeReuseStrategy;
    // disable reuse
    (this.router.routeReuseStrategy as any).shouldReuseRoute = () => false;
    this.router.navigateByUrl(currentUrl).finally(() => {
      // restore default reuse behavior
      (this.router.routeReuseStrategy as any).shouldReuseRoute =
        reuseStrategy.shouldReuseRoute.bind(reuseStrategy);
    });
  }

  downloadPDF(e: Event) {
    e.stopPropagation();
    this.prService.downloadPurchaseOrderById(this.paramsData.PO_id).subscribe(
      (res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `PO_${this.paramsData.po_number}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (err: any) => {
        console.log(err);
        if (err.status == 400) {
        }
      },
    );
  }
}
