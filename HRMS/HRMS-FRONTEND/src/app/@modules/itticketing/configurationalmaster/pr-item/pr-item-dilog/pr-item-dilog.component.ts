import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-pr-item-dilog',
  templateUrl: './pr-item-dilog.component.html',
  styleUrls: ['./pr-item-dilog.component.scss']
})
export class PrItemDilogComponent {
  itemData: any;
  constructor(
    private dialog: MatDialogRef<PrItemDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prService: PurchaseRequestService,

  ) {
    this.itemData = data.cellData;
    
    
  }
  ngOnInit() {
  }

}
