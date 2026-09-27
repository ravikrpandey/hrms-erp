
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ApprovalDialogComponent } from '../approval-dialog/approval-dialog.component';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  cellValue: any;
  assignAction: any;
  private gridApi!: GridApi<any>;
  singleData:any;
  singlerowData: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private asset_service:AssetListService,
    private toster: ToastrService) { }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  agInit(params: ICellRendererParams): void {
    this.singleData = params.data;
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.data.disposition_id;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

   async getWriteOffAssetById(id:any) {
    this.asset_service.getWriteOffAssetById(id).subscribe((res: any) => {  
      this.singlerowData = res.data;
    },(err: any) => {
      this.singlerowData = []
    });
  }

    async openDialog(actionType:any) {
      await this.getWriteOffAssetById(this.cellValue)
      if (this.singlerowData.length === 0) {
        alert("Please select at least one asset.");
        return;
      }
        this.dialog.open(ApprovalDialogComponent, {
          width: '900px',
          data: {
            assets: this.singlerowData,
            actionType: actionType,
            actionMode: 'edit'
          }
        });
    }

    async viewDialog(actionType:any) {
      await this.getWriteOffAssetById(this.cellValue)
      if (this.singlerowData.length === 0) {
        alert("Please select at least one asset.");
        return;
      }
        this.dialog.open(ApprovalDialogComponent, {
          width: '900px',
          data: {
            assets: this.singlerowData,
            actionType: actionType,
            actionMode: 'view'
          }
        });
    }

}
