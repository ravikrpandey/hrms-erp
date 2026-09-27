import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { InventoryManagementService } from '../../inventory-management.service';
import { ItemlistDialogComponent } from './itemlist-dialog/itemlist-dialog.component';

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
    private inventory_services: InventoryManagementService,
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

  onselect(e: any){
    const item_id = this.cellValue.item_id;
    this.inventory_services.GrnByItem(item_id).subscribe((res:any)=>{
      this.InventoryItem = res.data;
      // this.inventory_services.updateData(this.InventoryItem);
      this.openDialog();
    });
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(ItemlistDialogComponent, {
      data: { data: this.InventoryItem },
      width: '70%',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
