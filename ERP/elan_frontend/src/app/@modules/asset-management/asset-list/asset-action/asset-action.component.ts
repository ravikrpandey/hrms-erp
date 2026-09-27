import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import * as QRCode from 'qrcode';
import { CommonService } from 'src/app/@shared/services/common.service';
import { AssetAllocationComponent } from '../direct-asset/asset-allocation/asset-allocation.component';
import { AssetQRCodeComponent } from '../asset-qr-code/asset-qr-code.component';


@Component({
  selector: 'app-asset-action',
  templateUrl: './asset-action.component.html',
  styleUrls: ['./asset-action.component.scss']
})
export class AssetActionComponent {
  paramsVal: any;
  id: any;
  fid:any;
  singleData:any;
  params:any;
  assignAction: any;
  scannedData: any;
  qrCodeImageUrl: string | null = null;
  grn_id:any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _rbackService : RbacMasterService,
    private _commonService : CommonService,
  ) { 
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.singleData = params.data;
    this.grn_id = params.data.grn_id;
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
 
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.grn_item_status_id;
  }

  
  view(e:any){
    this.router.navigate(['/master/asset-management/asset-list/basic-details'], { queryParams: { id: this.cellValue,grn_id:this.grn_id } })
  }

    openDialog(e:any) {
      e.stopPropagation();
      const dialogRef
        = this.dialog.open(AssetAllocationComponent, {
          width: '60%',
          data: { itemSerialNo: this.singleData.itemSerialNo,batchNo: this.singleData.batchNo, Item_name: this.singleData.item_name, branch_name: this.singleData.branch_name,asset_category_name: this.singleData.asset_category_name, grn_item_status_id: this.singleData.grn_item_status_id ,grn_id: this.singleData.grn_id,manage_by:this.singleData.batchType}
        });
  
      dialogRef.afterClosed().subscribe((result:any) => {
       
      });
    }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  delete(e: any) {
   
  } 

  edit(){
    this.router.navigate(['/master/asset-management/asset-list/create-direct-asset'], { queryParams: { id: this.cellValue } })
  }

  // generateQRCode(e: any) {
  //   const qrData = `
  //     Item Name: ${this.params.data.item_name}
  //     Price: ${this.params.data.amount}
  //     Asset CategoryName: ${this.params.data.asset_category_name}
  //     Asset No: ${this.params.data.asset_tagId}
  //     Batch No: ${this.params.data.batchNo}
  //     Batch Type: ${this.params.data.batchType}
  //     Billing Address: ${this.params.data.branch_address}
  //     Location: ${this.params.data.allocated_branch}
  //     Serial No: ${this.params.data.itemSerialNo}
  //     Item Status: ${this.params.data.itemStatus}
  //     PO Date: ${this.params.data.po_date}
  //     PO NO: ${this.params.data.po_number}
  //   `.trim();

  //   e.stopPropagation();

  //   QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err: any, url: string) => {
  //     if (err) return;
  //     // this._commonService.downloadQRCode(url, this.params.data.item_name + '.png');
  //     const dialogRef = this.dialog.open(AssetQRCodeComponent, {
  //       width: '35%',
  //       data: {
  //         qrImageUrl: url,
  //         itemName: this.params.data.item_name
  //       }
  //     });

  //     dialogRef.afterClosed().subscribe((result: any) => {
        
  //     });
  //   });
  // }
}

