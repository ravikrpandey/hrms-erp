import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-asset-transfer-node-action',
  templateUrl: './asset-transfer-node-action.component.html',
  styleUrls: ['./asset-transfer-node-action.component.scss']
})
export class AssetTransferNodeActionComponent {
  singleData:any;
  params:any;
  assignAction: any;
  urlData: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _rbackService : RbacMasterService,
    private asset_service:AssetListService,
    private toaster: ToastrService
  ) { 
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.urlData = environment.servralUrl;
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.singleData = params.data;
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.tranfer_node_id;
  }

  downloadAssetNote(){
   this.asset_service.downloadAssetNote(this.cellValue).subscribe(
    (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assetTransfer_${this.cellValue}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    (err: any) => {
      this.toaster.error("Failed to download PDF");
    }
  );
}

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}