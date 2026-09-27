import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-reject-dailog',
  templateUrl: './reject-dailog.component.html',
  styleUrls: ['./reject-dailog.component.scss']
})
export class RejectDailogComponent {
  localTime:any;
  fromDate: any;
  toDate: any;
  vendor_id: any;
  singleVendorData: any;
  constructor(public dialog: MatDialogRef<RejectDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vendorService: VendorManagementService,
    private _commonService : CommonService
   ) {
    this.vendor_id = this.data.id;
    
  }

  ngOnInit(): void {
    this.getVendorById();
  }

  getVendorById(){
    this._commonService?.showLoader()
   this.vendorService.getVendorById(this.vendor_id).subscribe((res:any)=>{
    this.singleVendorData = res.data;
    this._commonService?.hideLoader()
    
   },(err:any) => {
    this._commonService?.hideLoader()
   })
  }
}
