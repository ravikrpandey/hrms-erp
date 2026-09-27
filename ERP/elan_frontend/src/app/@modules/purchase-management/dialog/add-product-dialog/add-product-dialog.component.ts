import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ItemInterface,
  ItemResponseInterface,
} from 'src/app/@shared/interface/item.interface';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
})
export class AddProductDialogComponent {
  form: FormGroup;
  categories: any[] = [];
  subCategoryList: any[] = [];
  itemList: ItemInterface[] = [];
  selectItem: ItemInterface[] = [];
  originalCategories: any[] = [];
  itemTypes: any[] = [];

  constructor(
    public dialog: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prService: PurchaseRequestService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      asset_category_id: [null, Validators.required],
      sub_category_id: [null, Validators.required],
      item_type_id: [null, Validators.required],
    });

    this.form.get('item_type_id')?.valueChanges.subscribe((value: any) => {
      this.form.get('asset_category_id')?.setValue(null);
      this.form.get('sub_category_id')?.setValue(null);
      this.itemList = [];
      this.filterCategories();
    });
    this.form.get('asset_category_id')?.valueChanges.subscribe((value: any) => {
      this.getItemSubCategory(value);
    });
    this.form.get('sub_category_id')?.valueChanges.subscribe((value: any) => {
      this.getItemName(
        this.form.get('asset_category_id')?.value,
        this.form.get('sub_category_id')?.value,
      );
    });
  }

  ngOnInit() {
    this.getAllCategory();
    this.getItemType();
  }

  filterCategories() {
    const selectedTypeId = this.form.get('item_type_id')?.value;
    const selectedTypeObj = this.itemTypes.find((t: any) => Number(t.id) === Number(selectedTypeId));
    const selectedTypeName = selectedTypeObj?.itemType?.toLowerCase() || '';

    if (selectedTypeName === 'basket') {
      this.categories = this.originalCategories.filter(
        (cat: any) => cat.asset_category_name?.toLowerCase() === 'basket'
      );
    } else {
      this.categories = this.originalCategories.filter(
        (cat: any) => cat.asset_category_name?.toLowerCase() !== 'basket'
      );
    }
  }

  getItemName(categoryId: number, subCategoryId: number) {
    this._configurationalMasterService
      .getItemName(
        categoryId,
        subCategoryId,
        this.form.get('item_type_id')?.value,
      )
      .subscribe(
        (res: ItemResponseInterface) => {
          if (res && res.data) {
            this.itemList = res.data;
          }
        },
        (err: any) => {
          console.log(err.error.message);
        },
      );
  }

  getItemType() {
    this._configurationalMasterService.getItemType().subscribe(
      (res: any) => {
        if (res.data) {
          this.itemTypes = res.data;
          if (this.data.indentype?.toLowerCase() === 'item') {
            this.itemTypes = this.itemTypes.filter(
              (item: any) => item.itemType?.toLowerCase() !== 'service',
            );
          }
          if (this.data.indentype?.toLowerCase() === 'service') {
            let itemTypeId = this.itemTypes.find(
              (item: any) => item.itemType?.toLowerCase() === 'service',
            )?.id;
            this.form.get('item_type_id')?.setValue(itemTypeId);
          } else {
            let itemTypeId = this.itemTypes.find(
              (item: any) => item.itemType?.toLowerCase() === 'item',
            )?.id;
            this.form.get('item_type_id')?.setValue(itemTypeId);
          }
          this.filterCategories();
        }
      },
      (err: any) => {
        console.log(err.error.message);
      },
    );
  }

  getAllCategory() {
    this.prService.getAllCategory().subscribe((res: any) => {
      this.originalCategories = res.data;
      this.filterCategories();
    });
  }

  getItemSubCategory(id: number) {
    this._configurationalMasterService
      .getSubCategory(id)
      .subscribe((res: any) => {
        this.subCategoryList = res.data;
      });
  }

  checkboxClicked(event: MatCheckboxChange, data: ItemInterface) {
    if (event.checked) {
      this.selectItem.push(data);
    } else {
      let index = this.selectItem.findIndex(
        (a: ItemInterface) => a.id === data.id,
      );
      this.selectItem.splice(index, 1);
    }
  }

  closeDialog() {
    if (this.selectItem.length > 0) {
      this.dialog.close(this.selectItem);
    }
  }
}
