import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-assetcategory-dialog',
  templateUrl: './assetcategory-dialog.html',
  styleUrls: ['./assetcategory-dialog.scss'],
})
export class AssetcategoryDialog {
  country_id: any;
  listAssetcategory: any;
  singleGrade: any;
  assetcategoryForm: FormGroup;
  entity_Id: any;
  loginUser: any;
  mainId: any;
  add_category: any;
  editCategory: any;
  visible: any;

  constructor(
    private dialog: MatDialogRef<AssetcategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _fb: FormBuilder,
    private route: Router,
    private toaster: ToastrService
  ) {
    this.assetcategoryForm = _fb.group({
      asset_category_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      description: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    });
    this.listAssetcategory = data.id;
  }

  ngOnInit() {
    this.mainId = localStorage.getItem('EmpMainId');
    this.localStorage();
    this.add_category = this.data.category;
    this.editCategory = this.data.category;
    this.visible = this.data.visible;
    if (this.editCategory == "edit" || this.visible) {
      this.getassetCategoryById();
    }
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }

  getassetCategoryById() {
    this._configurationalmasterService
      .getassetCategoryById(this.listAssetcategory)
      .subscribe((res: any) => {
        this.singleGrade = res.data;
        if (this.editCategory == 'edit') {
          this.assetcategoryForm.patchValue({
            asset_category_name: this.singleGrade.asset_category_name || '',
            description: this.singleGrade.description || '',
          });
        }
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

    const payload = {
      asset_category_name: data.asset_category_name?.trim(),
      description: data.description?.trim(),
      created_by: this.mainId,
      entity_id: this.entity_Id
    };

    console.log('Submitting payload:', payload); // Debug log

    if (this.listAssetcategory) {
      // UPDATE MODE
      this._configurationalmasterService.assetCategoryEdit(this.listAssetcategory, payload).subscribe(
        (res: any) => {
          if (res.code === 409 || res.message === "Asset category already exists!") {
            this.toaster.warning('Asset category already exists!');
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
            this.toaster.warning('Asset category already exists!');
          } else if (err.status === 404) {
            this.toaster.error('Record not found!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    } else {
      // CREATE MODE
      this._configurationalmasterService.assetCategoryCreate(payload).subscribe(
        (res: any) => {
          if (res.code === 409 || res.code === 201 || res.message === "Asset category already exists!") {
            this.toaster.warning('Asset category already exists!');
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
            this.toaster.error('Asset category already exists!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    }
  }
}