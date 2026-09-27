import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { SendEmailComponent } from '../send-email/send-email.component';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { environment } from 'src/app/environments/environment';
@Component({
  selector: 'app-sales-order-action',
  templateUrl: './sales-order-action.component.html',
  styleUrls: ['./sales-order-action.component.scss'],
})
export class SalesOrderActionComponent {
  cellValue: any;
  assignAction: any;
  urlData: any;
  deliveredQty: any;
  proposedQuantity: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _production: ProductionService
  ) {}
  ngOnInit(): void {
    this.urlData = environment.servralUrl;
  }

  ngAfterViewInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.deliveredQty = params.data.delivered_qty;
    this.proposedQuantity = params.data.total_proposed_qty;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  // send email

  sendEmail() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '40%',
      height: '70%',
      position: { bottom: '10px', right: '10px' },
      panelClass: 'full-screen-modal',
      data: { id: this.cellValue },
    });
  }

  downloadData() {
    // this._production.downloadPDf(this.cellValue.id).subscribe((res: any) => {
    //   console.log(res);
    //   window.open(
    //     this.urlData + '/api/v1/salesOrderDownload/' + res.backend_url,
    //     '_blank'
    //   );
    // });
  }

  addDoformValue() {
    this.route.navigate(['/master/sales/add-DO'], {
      queryParams: { sales_id: this.cellValue.id },
    });
  }
  addChallanformValue() {
    this.route.navigate(['/master/sales/create-delivery-challan'], {
      queryParams: { sales_id: this.cellValue.id },
    });
  }

  historyOfDO() {
    this.route.navigate(['/master/sales/DO-history'], {
      queryParams: { do_history: this.cellValue.proposal_id },
    });
  }
}
