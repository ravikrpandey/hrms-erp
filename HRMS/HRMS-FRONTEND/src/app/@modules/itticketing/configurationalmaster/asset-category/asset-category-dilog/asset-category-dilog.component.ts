import { Component, Inject } from '@angular/core';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}


@Component({
  selector: 'app-asset-category-dilog',
  templateUrl: './asset-category-dilog.component.html',
  styleUrls: ['./asset-category-dilog.component.scss']
})
export class AssetCategoryDilogComponent {
 
 AssetCategoryForm :FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  asset_categoryData: any;
  asset_categoryId: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<AssetCategoryDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AssetCategoryForm = this.fb.group({

      // asset_category_code: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      asset_category_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      asset_category_description: new FormControl(null, [Validators.required,noLeadingSpaces()]),


    });
  }
  ngOnInit() {
    this.asset_categoryId = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a:any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    if(this.asset_categoryId){
      this._configurationalMasterService.getByIdAssetMaster(this.asset_categoryId).subscribe((res: any) => {
        this.asset_categoryData = res.data;
          this.AssetCategoryForm.patchValue({
            // asset_category_code: this.asset_categoryData?.asset_category_code,
            asset_category_name: this.asset_categoryData?.asset_category_name,
            asset_category_description: this.asset_categoryData?.asset_category_description,

          })
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
      asset_category_name: val.asset_category_name,
      asset_category_description: val.asset_category_description,

    };
    this._configurationalMasterService.createAssetMaster(data).subscribe(
      (res: any) => {
        if(res.message=="Assets  Already Exists!"){
        this.toast.warning('Asset Category Already Exist');
      }
      else{
        this.toast.success('Asset Category Added Successfully');
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
          this.toast.error('Asset Category Already Exist');
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
      asset_category_name: val.asset_category_name,
      asset_category_description: val.asset_category_description,
    };
    this._configurationalMasterService.updateAssetMaster(this.data.id,data).subscribe(
      (res: any) => {
        if(res.message=="Assets  Already Exists!"){
        this.toast.warning('Asset Category Already Exist');
      }
      else{
        this.toast.success('Asset Category Update Successfully');
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
        } else if (err.status == 409){
          this.toast.error('Asset Category Already Exist');
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
