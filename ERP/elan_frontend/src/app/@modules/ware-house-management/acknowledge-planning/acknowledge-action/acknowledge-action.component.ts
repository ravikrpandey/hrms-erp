import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-acknowledge-action',
  templateUrl: './acknowledge-action.component.html',
  styleUrls: ['./acknowledge-action.component.scss'],
})
export class AcknowledgeActionComponent {
  cellValue: any;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    console.log(this.cellValue);
    
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  viewDetails(event: any) {
    event.stopPropagation();
    this.router.navigate(
      ['/master/warehouse-management/dispatched-product'],
      { queryParams: { sales_id: this.cellValue.salesOrderId, status: 'view' } }
    );
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
