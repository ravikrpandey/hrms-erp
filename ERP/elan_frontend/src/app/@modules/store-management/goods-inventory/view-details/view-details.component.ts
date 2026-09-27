import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ItemlistDialogComponent } from './itemlist-dialog/itemlist-dialog.component';
import { StoreManagementService } from '../../store-management.service';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent {
  assignAction: any;
  rowData: any;
  InventoryItem: any;
  navWidth: number;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private stockServices: StoreManagementService,
  ) {}

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
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  
  openDialog() {
    let payload = JSON.stringify({
      store_id: this.cellValue.store_id,
      item_id: this.cellValue.item_id,
      goodInventoryStatus: this.cellValue.goodInventoryStatus,
    });

    this.route.navigate([`master/store-management/goods-inventory/item-details`], { queryParams: { data: payload } });
  }
}
