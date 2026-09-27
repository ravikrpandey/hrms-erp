import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-vendor-dilog',
  templateUrl: './vendor-dilog.component.html',
  styleUrls: ['./vendor-dilog.component.scss']
})
export class VendorDilogComponent {
  localTime:any;
  fromDate: any;
  toDate: any;
  vendor_id: any;
  singleVendorData: any;
  statusForm:FormGroup;
  constructor(public dialog: MatDialogRef<VendorDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: Router,
    private vendorService: VendorManagementService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private _commonService : CommonService
   ) {
    this.vendor_id = this.data.id;
    
    this.statusForm =this.fb.group({
      vendor_status: new FormControl(null,[Validators.required])
    })
  }

  ngOnInit(): void {
    this.getVendorById();
  }

  getVendorById(){
   this.vendorService.getVendorById(this.vendor_id).subscribe((res:any)=>{
    this.singleVendorData = res.data;
    
    
   })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  stausUpdate(){
    if (this.statusForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      
      return;
    }
    let val = this.statusForm.value;
    this._commonService?.showLoader()
      this.vendorService.updateStatus(this.vendor_id,val).subscribe((res:any) =>{        
        if(res){
          this._commonService?.hideLoader()
          this.toast.success(res.message);
          this.reloadCurrentRoute();
          this.dialog.close();
        }
      },(err:any) => {
        this._commonService?.hideLoader()
      })
    }
}
