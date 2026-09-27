import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { GrnServiceService } from '../../services/grn-service.service';

@Component({
  selector: 'app-invoice-action',
  templateUrl: './invoice-action.component.html',
  styleUrls: ['./invoice-action.component.scss'],
})
export class InvoiceActionComponent implements OnInit, AfterViewInit {
  assignAction: ModuleAction;
  public cellValue: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private grnService: GrnServiceService,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  navigateToPaymentCheck(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['/master/purchase-management/invoice/po-details-invoice'],
      {
        queryParams: {
          po_id: this.cellValue.po_Id,
          status: this.cellValue.status,
          version_id: this.cellValue.version_id,
          shiping_id: this.cellValue?.shiping_id,
          rejectGRN: this.cellValue.discardStatus,
          RejectStatus: 'RejectView',
        },
      },
    );
  }

  navigateToPaymentView(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['/master/purchase-management/invoice/po-details-invoice'],
      {
        queryParams: {
          po_id: this.cellValue.po_Id,
          status: this.cellValue.status,
          version_id: this.cellValue.version_id,
          rejectGRN: this.cellValue.discardStatus,
          actionType: 'View',
          shiping_id: this.cellValue?.shiping_id,
          invoiceNo: this.cellValue.invoiceNo,
        },
      },
    );
  }

  addNewGRNForReject() {
    this.router.navigate(
      ['/master/purchase-management/invoice/po-details-invoice'],
      {
        queryParams: {
          po_id: this.cellValue.po_Id,
          status: this.cellValue.status,
          version_id: this.cellValue.version_id,
          rejectGRN: this.cellValue.discardStatus,
        },
      },
    );
  }

  rejectFile() {
    Swal.fire({
      title: 'Do You Want to Close this PO?',
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
        };

        this.grnService
          .rejectedGRN(this.cellValue.grn_id)
          .subscribe((res: any) => {
            if (res.code == 200) {
              this.toast.success('Approved PR Successfully');
              this.reloadCurrentRoute();
            }
          });
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigateByUrl(currentUrl);
    });
  }

  downloadPDF(e: Event) {
    this.grnService
      .downloadPurchaseInvoiceById(this.cellValue.id, this.cellValue.version_id)
      .subscribe(
        (res: any) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = `GRN_${this.cellValue.grn_number}_PO_${this.cellValue.po_number}.pdf`;
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
