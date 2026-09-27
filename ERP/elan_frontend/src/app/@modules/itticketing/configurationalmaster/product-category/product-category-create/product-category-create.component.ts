import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-product-category-create',
  templateUrl: './product-category-create.component.html',
  styleUrls: ['./product-category-create.component.scss']
})
export class ProductCategoryCreateComponent {
  designation_id: any;
  singleProductData: any;
  productCategoryForm: FormGroup
  entityId: string | null;
  constructor(
    private dialog: MatDialogRef<ProductCategoryCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService, public _fb: FormBuilder, public toaster: ToastrService,
     public route: Router
  ) {
    this.designation_id = Number(data?.id);
    this.productCategoryForm = this._fb.group({
      category_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      entity_id: new FormControl(null),
    })
  }
  editDesignation: any
  addDesignation: any;
  visibility: any;
  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    if (this.designation_id) {
      this.getCategoryById();
    }
    this.addDesignation = this.data.data;
    this.editDesignation = this.data.edit;
    this.visibility = this.data.view;
  }

  getCategoryById() {
    this._configurationalmasterService.getCategoryById(this.designation_id).subscribe((res: any) => {
      this.singleProductData = res.data;
      if (this.designation_id) {
        this.productCategoryForm.patchValue({
          category_name:this.singleProductData.category_name,
          // category_code:this.singleProductData.category_code
        })
      }
    })
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  SubmitProductCategory(data: any) {
    if (this.productCategoryForm.invalid) {
      this.productCategoryForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }

    data.value.category_name=data.value.category_name.trim()
    if (this.addDesignation == 'Add_Designation') {
      if (this.productCategoryForm.invalid) {
        this.productCategoryForm.markAllAsTouched()
        return
      }
      data.value.entity_id=this.entityId
      this._configurationalmasterService.createProductCategory(data.value).subscribe((res: any) => {
        if (res) {
          if (res.message === "Category Name is Already Exits!") {
            this.toaster.warning('Category Name is Already Exits!');
          }
          else {
            this.toaster.success('Category is created successfully!');
            this.dialog.close();
            this.reloadCurrentRoute()
          }
        }
      }, (err: any) => {
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toaster.error('Product Category Name is Already Exits!');
        } else {
          this.toaster.error('Error in submission!');
        }
      })
    }
    else if (this.addDesignation !== 'Add_Designation'){
      this._configurationalmasterService.editCategoryById(this.designation_id,data.value).subscribe((res: any) => {
        if (res) {
          if (res.message === "Category Name is Already Exits!") {
            this.toaster.warning('Category Name is Already Exits!');
          }
          else {
            this.toaster.success('Category is updated successfully!');
            this.dialog.close();
            this.reloadCurrentRoute()
          }
        }
      }, (err: any) => {
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toaster.error('Category Name is Already Exits!');
        } else {
          this.toaster.error('Error in submission!');
        }
      })
    }
  }
}
