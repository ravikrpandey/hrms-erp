import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-customer-category-dilog',
  templateUrl: './customer-category-dilog.component.html',
  styleUrls: ['./customer-category-dilog.component.scss']
})
export class CustomerCategoryDilogComponent {
  itemData: any;
  constructor(
    private dialog: MatDialogRef<CustomerCategoryDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prService: PurchaseRequestService,

  ) {
    this.itemData = data.cellData;
    
    
  }
  ngOnInit() {
  }

}
