import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-bank-dailog',
  templateUrl: './bank-dailog.component.html',
  styleUrls: ['./bank-dailog.component.scss']
})
export class BankDailogComponent {
  localTime:any;
  fromDate: any;
  toDate: any;
  vendor_id: any;
  singleVendorData: any;
  constructor(public dialog: MatDialogRef<BankDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vendorService: VendorManagementService
   ) {
    this.singleVendorData = this.data;
    console.log('data',this.singleVendorData);
    
    
  }

  ngOnInit(): void {
  }
}
