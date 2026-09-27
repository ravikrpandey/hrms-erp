import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/@shared/services/common.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
// import { UploadDocument } from '../../upload-document/upload-document';

@Component({
  selector: 'app-vendor-dilog',
  templateUrl: './vendor-dilog.component.html',
  styleUrls: ['./vendor-dilog.component.scss']
})
export class VendorDilogComponentApp {
  localTime:any;
  fromDate: any;
  toDate: any;
  vendor_id: any;
  singleVendorData: any;
  constructor(public dialog: MatDialogRef<VendorDilogComponentApp>,
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
