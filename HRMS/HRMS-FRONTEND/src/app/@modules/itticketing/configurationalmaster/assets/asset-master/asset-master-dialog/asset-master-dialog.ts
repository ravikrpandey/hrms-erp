import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-asset-master-dialog',
  templateUrl: './asset-master-dialog.html',
  styleUrls: ['./asset-master-dialog.scss'],
})
export class AssetMasterDialog {
  minEndDate: Date | null = null;
  listAssetcategory: any; // This holds the asset_master_id for edit mode
  singleGrade: any;
  singleAssetmaster: any;
  assetmasterForm: FormGroup;
  entity_Id: any;
  loginUser: any;
  mainId: any;
  add_assetmaster: any;
  editAssetmaster: any;
  assetcategorylist: any = [];
  assetsubcategorylist: any = [];
  assetmasterlist: any = [];
  filteredSubcategoryList: any[] = [];
  visible: any;

  constructor(
    private dialog: MatDialogRef<AssetMasterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _fb: FormBuilder,
    private route: Router,
    private toaster: ToastrService
  ) {
    this.assetmasterForm = _fb.group({
      asset_category_id: new FormControl(null, [Validators.required]),
      asset_subcategory_id: new FormControl(null, [Validators.required]),
      asset_master_name: new FormControl(null, [Validators.required]),
      brand: new FormControl(null, [Validators.required]),
      model: new FormControl(null, [Validators.required]),
      serial_no: new FormControl(null, [Validators.required]),
      purchase_date: new FormControl(null, [Validators.required]),
      purchase_cost: new FormControl(null, [Validators.required]),
      warranty_end_date: new FormControl(null),
      remark: new FormControl(null),
    });
    this.listAssetcategory = data.id; // This is the asset_master_id for edit
  }

  ngOnInit() {
    this.mainId = localStorage.getItem('EmpMainId');
    this.localStorage();
    this.add_assetmaster = this.data.assetmaster;
    this.editAssetmaster = this.data.assetmaster;
    this.visible = this.data.visible;
    
    // Load data using forkJoin to ensure all data is loaded before patching
    this.loadData();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }

  loadData() {
    // Load categories and subcategories first
    forkJoin({
      categories: this._configurationalmasterService.getassetCategoryListActiveStatus(this.entity_Id),
      subcategories: this._configurationalmasterService.getassetSubcategoryListActiveStatus(this.entity_Id)
    }).subscribe({
      next: (results: any) => {
        this.assetcategorylist = results.categories.data;
        this.assetsubcategorylist = results.subcategories.data;
        
        // After loading dropdown data, load asset master if in edit/view mode
        if (this.editAssetmaster === "edit" || this.visible) {
          this.getAssetMasterById();
        }
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.toaster.error('Error loading form data');
      }
    });
  }

  onCategoryChange(categoryId: any) {
    this.filteredSubcategoryList = this.assetsubcategorylist.filter(
      (x: any) => x.asset_category_id === categoryId
    );
    // Only reset subcategory if not in edit mode loading
    if (!this.singleAssetmaster) {
      this.assetmasterForm.get('asset_subcategory_id')?.setValue(null);
    }
  }

  getAssetMasterById() {
    if (!this.listAssetcategory) {
      console.error('No asset_master_id provided');
      return;
    }

    this._configurationalmasterService
      .getAssetMasterById(this.listAssetcategory) // Pass the asset_master_id
      .subscribe({
        next: (res: any) => {
          console.log('Asset Master Data:', res.data);
          this.singleAssetmaster = res.data;
          this.singleGrade = res.data; // For view mode

          // Find category name for display
          const category = this.assetcategorylist.find(
            (x: any) => x.asset_category_id === res.data.asset_category_id
          );
          if (category) {
            this.singleGrade.asset_category_name = category.asset_category_name;
          }

          // Find subcategory name for display
          const subcategory = this.assetsubcategorylist.find(
            (x: any) => x.asset_subcategory_id === res.data.asset_subcategory_id
          );
          if (subcategory) {
            this.singleGrade.asset_subcategory_name = subcategory.asset_subcategory_name;
          }

          // Filter subcategories based on selected category
          this.filteredSubcategoryList = this.assetsubcategorylist.filter(
            (sub: any) => sub.asset_category_id === res.data.asset_category_id
          );

          // Format dates if they exist
          let purchaseDate = null;
          let warrantyDate = null;

          if (res.data.purchase_date) {
            purchaseDate = new Date(res.data.purchase_date);
            this.minEndDate = purchaseDate;
          }

          if (res.data.warranty_end_date) {
            warrantyDate = new Date(res.data.warranty_end_date);
          }

          // Patch all form values
          this.assetmasterForm.patchValue({
            asset_category_id: res.data.asset_category_id,
            asset_subcategory_id: res.data.asset_subcategory_id,
            asset_master_name: res.data.asset_master_name,
            brand: res.data.brand,
            model: res.data.model,
            serial_no: res.data.serial_no,
            purchase_date: purchaseDate,
            purchase_cost: res.data.purchase_cost,
            warranty_end_date: warrantyDate,
            remark: res.data.remark
          });

          console.log('Form patched with values:', this.assetmasterForm.value);
        },
        error: (err) => {
          console.error('Error loading asset master:', err);
          this.toaster.error('Error loading asset data');
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
    if (this.assetmasterForm.invalid) {
      this.toaster.warning('Please fill all required fields');
      return;
    }

    // Get category name from ID
    const selectedCategory = this.assetcategorylist.find(
      (c: any) => c.asset_category_id === this.assetmasterForm.value.asset_category_id
    );

    // Get subcategory name from ID
    const selectedSubcategory = this.assetsubcategorylist.find(
      (c: any) => c.asset_subcategory_id === this.assetmasterForm.value.asset_subcategory_id
    );

    // Format dates for backend
    let purchaseDate = this.assetmasterForm.value.purchase_date;
    if (purchaseDate instanceof Date) {
      purchaseDate = purchaseDate.toISOString().split('T')[0];
    }

    let warrantyDate = this.assetmasterForm.value.warranty_end_date;
    if (warrantyDate instanceof Date) {
      warrantyDate = warrantyDate.toISOString().split('T')[0];
    }

    const payload = {
      asset_category_id: this.assetmasterForm.value.asset_category_id,
      asset_category_name: selectedCategory?.asset_category_name || null,
      asset_subcategory_id: this.assetmasterForm.value.asset_subcategory_id,
      asset_subcategory_name: selectedSubcategory?.asset_subcategory_name || null,
      asset_master_name: this.assetmasterForm.value.asset_master_name?.trim(),
      brand: this.assetmasterForm.value.brand?.trim(),
      model: this.assetmasterForm.value.model?.trim(),
      serial_no: this.assetmasterForm.value.serial_no,
      purchase_date: purchaseDate,
      purchase_cost: this.assetmasterForm.value.purchase_cost,
      warranty_end_date: warrantyDate,
      remark: this.assetmasterForm.value.remark?.trim() || null,
      entity_id: this.entity_Id
    };

    console.log('Submitting payload:', payload);

    if (this.listAssetcategory) {
      // UPDATE MODE
      this._configurationalmasterService
        .assetMasterUpdate(this.listAssetcategory, payload)
        .subscribe({
          next: (res: any) => {
            if (res.code === 409 || res.message === "Asset master already exists!") {
              this.toaster.warning('Asset master already exists!');
            } else if (res.code === 200) {
              this.toaster.success('Updated successfully!');
              this.dialog.close(true);
              this.assetmasterForm.reset();
            }
          },
          error: (err: any) => {
            console.error('Update error:', err);
            if (err.status === 400) {
              this.toaster.error('Invalid data provided!');
            } else if (err.status === 409) {
              this.toaster.warning('Asset master already exists!');
            } else if (err.status === 404) {
              this.toaster.error('Record not found!');
            } else {
              this.toaster.error('Error in submission!');
            }
          }
        });
    } else {
      // CREATE MODE
      this._configurationalmasterService.assetMasterCreate(payload).subscribe({
        next: (res: any) => {
          if (res.code === 409 || res.message === "Asset master already exists!") {
            this.toaster.warning('Asset master already exists!');
          } else if (res.code === 200) {
            this.toaster.success('Added successfully!');
            this.reloadCurrentRoute();
            this.dialog.close(true);
            this.assetmasterForm.reset();
          }
        },
        error: (err: any) => {
          console.error('Create error:', err);
          if (err.status === 400) {
            this.toaster.error('Invalid data provided!');
          } else if (err.status === 409) {
            this.toaster.error('Asset master already exists!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      });
    }
  }

  onStartDateChange(event: any): void {
    const startDate = event.value;
    this.minEndDate = startDate;

    const endDate = this.assetmasterForm.get('warranty_end_date')?.value;
    if (endDate && new Date(endDate) < new Date(startDate)) {
      this.assetmasterForm.get('warranty_end_date')?.setValue(null);
    }
  }
}