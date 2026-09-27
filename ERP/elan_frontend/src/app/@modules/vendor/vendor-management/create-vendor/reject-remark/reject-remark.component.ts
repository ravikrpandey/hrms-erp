import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-reject-remark',
  templateUrl: './reject-remark.component.html',
  styleUrls: ['./reject-remark.component.scss']
})
export class RejectRemarkComponent {
  itemData: any;
  RejectForm: FormGroup;
  Data: any;
  
  constructor(
    private dialog: MatDialogRef<RejectRemarkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vendorService: VendorManagementService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private _commonService : CommonService


  ) {
    this.itemData = data;
    

    this.RejectForm = this.fb.group({
     reject_remark: new FormControl(null , [Validators.required]),
     document_status: new FormControl('REJECT')
    }) 
  }

  ngOnInit() {
  }

  onReject(){
    if (this.RejectForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      
      return;
    }
    var formData: any = new FormData();
    formData.append('remarks', this.RejectForm.value.reject_remark);
    formData.append('document_status','REJECT' );
    this._commonService?.showLoader()
    this.vendorService.updateDocument(this.itemData,formData).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      this.Data = res.data;
      if(res){
        this.toast.success(res.message);
        this.route.navigate(['/master/vendor/vendor-management/vendor-list'])
        this.dialog.close();
      }
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

}
