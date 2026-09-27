import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StoreManagementService } from '../../store-management.service';

@Component({
  selector: 'app-stock-status',
  templateUrl: './stock-status.component.html',
  styleUrls: ['./stock-status.component.scss']
})
export class StockStatusComponent {
  cellData: any;
  getData: any = [];
  notCreatedFlow: boolean=false;
  constructor(public dialog: MatDialogRef<StockStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private smService: StoreManagementService, private route: Router,) {
    this.cellData = this.data;
    console.log(data,'dataa');
    
  }

  ngOnInit(): void {
    this.stockTransferApprover();
  }

  stockTransferApprover() {
    this.smService.stockTransferApprover(this.cellData.store_id,this.cellData.stock_transfer_id).subscribe((res: any) => {
      this.getData = res.data;
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}

