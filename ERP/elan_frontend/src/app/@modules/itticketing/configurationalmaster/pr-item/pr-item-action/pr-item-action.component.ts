import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';
import * as QRCode from 'qrcode';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-pr-item-action',
  templateUrl: './pr-item-action.component.html',
  styleUrls: ['./pr-item-action.component.scss'],
})
export class PrItemActionComponent {
  singleId: any;
  paramsVal: any;
  params: any;
  cellValue1: any;
  assignAction: any;
  scannedData: any;
  qrCodeImageUrl: string | null = null;
  itemType: any = [];

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.paramsVal = params.data?.id;
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data?.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  generateQRCode() {
    this.itemType = this.params.context?.componentParent?.itemType || [];
    let itemObject = this.itemType.find(
      (c: any) => c.id === this.params.data.item_type_id
    );
    const qrData = `
    Item Name: ${this.params.data.item_name}\n
    Item Type: ${itemObject?.itemType}\n
    Price: ${this.params.data.MVP}\n
    Asset CategoryName: ${this.params.data.asset_category_name}\n
    Item Code: ${this.params.data.item_code}\n
    UOM: ${this.params.data.uom_name}\n
    GST: ${this.params.data.gstRate}\n
    Item Status: ${this.params.data.status}\n
  
    `.trim();

    QRCode.toDataURL(
      qrData,
      { errorCorrectionLevel: 'H' },
      (err: any, url: any) => {
        if (err) {
          // console.error('Error generating QR code:', err);
          return;
        }
        this._commonService.downloadQRCode(
          url,
          this.params.data.item_name + '.png'
        );
      }
    );
  }

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['master/configurational-master/pr-item/create-item'],
      { queryParams: { item_id: this.cellValue, action_type: 'edit' } }
    );
  }

  view(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['master/configurational-master/pr-item/create-item'],
      { queryParams: { item_id: this.cellValue, action_type: 'view' } }
    );
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader();
        this._configurationalmasterService
          .deleteItemMaster(this.cellValue)
          .subscribe(
            (res) => {
              this._commonService?.hideLoader();
              this.toaster.success('Delete successfully ');
              this.reloadCurrentRoute();
            },
            (err) => {
              this._commonService?.hideLoader();
              this.toaster.error(
                'Somthing went wrong.. Please try agin',
                'Error Message'
              );
            }
          );
      }
    });
  }
}
