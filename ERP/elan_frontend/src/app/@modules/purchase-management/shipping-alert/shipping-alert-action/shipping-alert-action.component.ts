import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ShippingUpdateComponent } from 'src/app/@modules/purchase-management/shipping-alert/shipping-update/shipping-update.component';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ShippingAlertStatusDialogComponent } from '../shipping-alert-status-dialog/shipping-alert-status-dialog.component';
import { VendorShippingTrackingHistoryComponent } from '../vendor-shipping-tracking-history/vendor-shipping-tracking-history.component';

@Component({
  selector: 'app-shipping-alert-action',
  templateUrl: './shipping-alert-action.component.html',
  styleUrls: ['./shipping-alert-action.component.scss']
})
export class ShippingAlertActionComponent {

  assignAction: ModuleAction;
  public cellValue: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = params?.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params;
  }

  edit(e: any) {
    e.stopPropagation();
   const dialogRef = this.dialog.open(ShippingUpdateComponent, {
      data: this.cellValue,
      // width:'500px',
      // height:'400px'

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.cellValue.expected_ship_date = result.expected_ship_date;
        this.cellValue.shipping_status = result.shipping_status;
        dialogRef.close();
        this.reloadCurrentRoute();
      }
    });
  }
  onCellClicked(e: any) {
    e.stopPropagation();
    this.dialog.open(VendorShippingTrackingHistoryComponent,{
      width:'900px',
      // height:'600px'
      data:this.cellValue
    })
    // this.openDialog();
  }

  openDialog(): void {
    this.router.navigate(['master/purchase-management/shipping-alert/shipping-history'], {
      queryParams: {shipped_id: this.cellValue.id},
    });
    
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
