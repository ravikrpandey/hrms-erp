import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-add-stock-action',
  templateUrl: './add-stock-action.component.html',
  styleUrls: ['./add-stock-action.component.scss']
})
export class AddStockActionComponent {

  constructor(private route: Router,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
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

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(["/master/warehouse-management/stock-list/stock-status"], { queryParams: { id: this.cellValue } });
  }

  openDialog() {
    this.route.navigate(["/master/warehouse-management/add-stock/grn-warehouse-allocation"], { queryParams: { po_id: this.cellValue.id, status: this.cellValue.status, version_id: this.cellValue.version_id, rejectGRN: this.cellValue.discardStatus, RejectStatus: 'RejectView' } });

  }
}

