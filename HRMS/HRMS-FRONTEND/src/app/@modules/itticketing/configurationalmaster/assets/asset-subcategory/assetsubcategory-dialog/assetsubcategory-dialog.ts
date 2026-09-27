import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

// function noLeadingSpaces(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: boolean } | null => {
//     if (control.value && control.value.trimLeft() !== control.value) {
//       return { leadingSpaces: true };
//     }
//     return null;
//   };
// }


@Component({
  selector: 'app-assetsubcategory-dialog',
  templateUrl: './assetsubcategory-dialog.html',
  styleUrls: ['./assetsubcategory-dialog.scss'],
})
export class AssetsubcategoryDialog {
  country_id: any;
  listAssetcategory: any;
  singleGrade: any;
  assetcategoryForm: FormGroup;
  entity_Id: any;
  loginUser: any;
  mainId: any;
  add_subcategory: any;
  editSubcategory: any;
  assetcategorylist: any = [];
  visible: any;

  constructor(
    private dialog: MatDialogRef<AssetsubcategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _fb: FormBuilder,
    private route: Router,
    private toaster: ToastrService
  ) {
    this.assetcategoryForm = _fb.group({
      asset_category_id: new FormControl(null, [Validators.required]),
      asset_subcategory_name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });
    this.listAssetcategory = data.id;
  }

  ngOnInit() {
    this.mainId = localStorage.getItem('EmpMainId');
    this.localStorage();
    this.add_subcategory = this.data.subcategory;
    this.editSubcategory = this.data.subcategory;
    this.visible = this.data.visible;
    if (this.editSubcategory == "edit" || this.visible) {
      this.getassetSubcategoryById();
    }
    this.getassetCategoryListActiveStatus();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }
  getassetCategoryListActiveStatus() {
    this._configurationalmasterService.getassetCategoryListActiveStatus(this.entity_Id).subscribe((res: any) => {
      this.assetcategorylist = res.data;

    });
  }
  getassetSubcategoryById() {
    this._configurationalmasterService
      .getassetSubcategoryById(this.listAssetcategory)
      .subscribe((res: any) => {
        this.singleGrade = res.data;

        const category = this.assetcategorylist.find((cat: any) =>
          cat.asset_category_id === res.data.asset_category_id
        );

        this.singleGrade.asset_category_name = category?.asset_category_name || 'N/A';

        this.assetcategoryForm.patchValue({
          asset_category_id: res.data.asset_category_id,
          asset_subcategory_name: res.data.asset_subcategory_name,
          description: res.data.description
        });

      });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  ngSubmitEmp(data: any) {
    if (this.assetcategoryForm.invalid) {
      this.toaster.warning('Please fill all required fields');
      return;
    }
    // Get category name from ID
    const selectedCategory = this.assetcategorylist.find(
      (c: any) => c.asset_category_id === this.assetcategoryForm.value.asset_category_id
    );

    const payload = {
      asset_category_id: this.assetcategoryForm.value.asset_category_id,
      asset_category_name: selectedCategory?.asset_category_name || null,
      asset_subcategory_name: this.assetcategoryForm.value.asset_subcategory_name?.trim(),
      description: this.assetcategoryForm.value.description?.trim(),
      created_by: this.mainId,
      entity_id: this.entity_Id
    };
    console.log('Submitting payload:', payload); // Debug log

    if (this.listAssetcategory) {
      // UPDATE MODE
      this._configurationalmasterService.assetSubcategoryEdit(this.listAssetcategory, payload).subscribe(
        (res: any) => {
          if (res.code === 409 || res.message === "Asset subcategory already exists!") {
            this.toaster.warning('Asset subcategory already exists!');
          } else if (res.code === 200) {
            this.toaster.success('Updated successfully!');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.assetcategoryForm.reset();
          }
        },
        (err: any) => {
          console.error('Update error:', err);
          if (err.status === 400) {
            this.toaster.error('Invalid data provided!');
          } else if (err.status === 409) {
            this.toaster.warning('Asset subcategory already exists!');
          } else if (err.status === 404) {
            this.toaster.error('Record not found!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    } else {
      // CREATE MODE
      this._configurationalmasterService.assetSubcategoryCreate(payload).subscribe(
        (res: any) => {
          if (res.code === 409 || res.code === 201 || res.message === "Asset subcategory already exists!") {
            this.toaster.warning('Asset subcategory already exists!');
          } else if (res.code === 200) {
            this.toaster.success('Added successfully!');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.assetcategoryForm.reset();
          }
        },
        (err: any) => {
          console.error('Create error:', err);
          if (err.status === 400) {
            this.toaster.error('Invalid data provided!');
          } else if (err.status === 201 || err.status === 409) {
            this.toaster.error('Asset subcategory already exists!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    }
  }
}