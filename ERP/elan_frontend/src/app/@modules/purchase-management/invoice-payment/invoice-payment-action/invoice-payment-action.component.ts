import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-invoice-payment-action',
  templateUrl: './invoice-payment-action.component.html',
  styleUrls: ['./invoice-payment-action.component.scss']
})
export class InvoicePaymentActionComponent {

  assignAction: ModuleAction;
  public cellValue: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
  ) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigateByUrl(currentUrl);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  redirect = (e: any) => {
    this.router.navigate(['/master/purchase-management/invoice-payment/payment'], {
      queryParams: {
        id: this.cellValue.id,
        version_id: this.cellValue.version_id,
        vendor_name: this.cellValue.vendor_name,
        invoice_no: this.cellValue.invoice_no,
        date: this.cellValue.po_date,
        invoice_number: this.cellValue.invoice_number,
      },
    });
  };
}
