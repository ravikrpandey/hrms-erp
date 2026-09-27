import { Component, Inject } from '@angular/core';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}


@Component({
  selector: 'app-accessory-category-dilog',
  templateUrl: './accessory-category-dilog.component.html',
  styleUrls: ['./accessory-category-dilog.component.scss']
})
export class AccessoryCategoryDilogComponent {
 
 AssetCategoryForm :FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  asset_categoryData: any;
  entity_id:any;
  asset_categoryId: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _commonService : CommonService,
    public dialog: MatDialogRef<AccessoryCategoryDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AssetCategoryForm = this.fb.group({

      // asset_category_code: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      asset_category_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      asset_category_description: new FormControl(null, [Validators.required,noLeadingSpaces()]),


    });
  }
  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.asset_categoryId = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a:any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    if(this.asset_categoryId){
      this._commonService?.showLoader()
      this._configurationalMasterService.getByIdAssetMaster(this.asset_categoryId).subscribe((res: any) => {
        this._commonService?.hideLoader()
        this.asset_categoryData = res.data;
          this.AssetCategoryForm.patchValue({
            // asset_category_code: this.asset_categoryData?.asset_category_code,
            asset_category_name: this.asset_categoryData?.asset_category_name,
            asset_category_description: this.asset_categoryData?.asset_category_description,

          }),(err:any) => {
            this._commonService?.hideLoader()
          }
      });
    }
  }

  onSubmitForm() {
    Object.keys(this.AssetCategoryForm.controls).forEach(key => {
      this.AssetCategoryForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.AssetCategoryForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.AssetCategoryForm.value;
    const data = {
      // asset_category_code: val.asset_category_code,
      asset_category_name: val.asset_category_name.trim(),
      asset_category_description: val.asset_category_description,
      entity_id:this.entity_id

    };
    this._commonService?.showLoader()
    this._configurationalMasterService.createAssetMaster(data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if(res.message=="product Cateogry Already Exists!"){
        this.toast.warning('Item Cateogry Already Exists');
      }
      else{
        this._commonService?.hideLoader()
        this.toast.success('Item Cateogry Created Successfully');
        this.route.navigate([
          'master/itticket/configurational-master/asset-category',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201){
          this.toast.error('Item Category Already Exists');
        }else{
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.AssetCategoryForm.controls).forEach(key => {
      this.AssetCategoryForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.AssetCategoryForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.AssetCategoryForm.value;
    const data = {
      // asset_category_code: val.asset_category_code,
      asset_category_name: val.asset_category_name.trim(),
      asset_category_description: val.asset_category_description,
    };
    this._commonService?.showLoader()
    this._configurationalMasterService.updateAssetMaster(this.data.id,data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if(res.message=="Item Category Already Exists!"){
        this.toast.warning('Item Category Already Exists!');
      }
      else{
        this.toast.success('Item Category Updated Successfully');
        this.route.navigate([
          'master/itticket/configurational-master/asset-category',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        this._commonService?.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409){
          this.toast.error('Asset Category Already Exists');
        }else{
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.AssetCategoryForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}
