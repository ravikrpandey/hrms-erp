import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonService } from 'src/app/@shared/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map-address-qty-dialog',
  templateUrl: './map-address-qty-dialog.component.html',
  styleUrls: ['./map-address-qty-dialog.component.scss'],
})
export class MapAddressQtyDialogComponent implements OnInit {
  
  form: FormGroup;
  postOffice: any[] = [];
  getAllData: any;
  bomArray: any;
  shippingAddress: any;
  stockSummary: any;
  originalStockSummary: any = {};
  productGroups:any[]=[];
  bomMap: { [key: number]: any[] } = {};
  stockMap: { [key: number]: any } = {};

  constructor(
    public dialogRef: MatDialogRef<MapAddressQtyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toaster : ToastrService,
    protected commonService: CommonService
  ) {
    console.log(data, '======DATA======');
    this.getAllData = this.data.getAllData;
    // this.bomArray = this.data.selectedData?.bomArray ?? this.getAllData.bomArray;
    this.bomArray = JSON.parse(
      JSON.stringify(
        this.data.selectedData?.bomArray ?? this.getAllData.bomArray
      )
    );
    this.shippingAddress = this.data.shippingAddress;
    this.stockSummary = this.getAllData.stockSummary;
    this.originalStockSummary = JSON.parse(JSON.stringify(this.stockSummary));
    this.prepareBomMap();
  }

  ngOnInit(): void {
    const selectedData = this.data.selectedData;
    this.form = this.fb.group({
      pincode: [selectedData?.pincode ?? this.shippingAddress.shipping_pin_code, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      postal_address: [selectedData?.postal_address ?? this.shippingAddress.shipping_postal_address, Validators.required],
      address: [selectedData?.address ?? this.shippingAddress.shipping_address, Validators.required],
      expected_delivery_date: [selectedData?.expected_delivery_date ?? '', Validators.required],
      // contact_person_name: [selectedData?.contact_person_name ?? this.getAllData.contact_person_name, Validators.required],
      // mobile: [selectedData?.mobile ?? this.getAllData.contact_number, [Validators.required, Validators.pattern('^[0-9]{10,14}$')]],
      // email_id: [selectedData?.email_id ?? this.getAllData.mail_id, [Validators.required, Validators.email]],
      products: this.fb.array(
        (selectedData?.products ?? this.getAllData.productDetailList)
          .map((product: any) => this.createProductGroup(product))
      )
    });

    // On pincode change
    this.form.get('pincode')!.valueChanges.pipe().subscribe((value) => {
      this.callPostOfficeAPI(value);
    });

    // On initial form load
    const initialValue = this.form.get('pincode')!.value;
    if (initialValue) {
      this.callPostOfficeAPI(initialValue);
    }

    this.productGroups=this.groupProducts();

    this.stockSummary.forEach((x: any) => {
      this.stockMap[x.item_id] = x;
    });
  }

  callPostOfficeAPI(value: string | null) {
    if (value && value.length === 6) {
      this.commonService.getPostOfficeByPincode(value).subscribe(
        (response: any) => {
          this.postOffice = response.PostOffice;
          if (this.postOffice && this.postOffice.length) {
            const shippingPostalAddress = (this.data.selectedData?.postal_address ?? this.shippingAddress.shipping_postal_address)?.trim().toLowerCase();
          
            const postalAdd = this.postOffice.find((x: any) => {
              const combined = `${x.Name}, ${x.District}`.toLowerCase().trim();
              return combined === shippingPostalAddress;
            });
          
            if (postalAdd) {
              this.form.patchValue({
                address:this.data.selectedData?.address ?? this.shippingAddress.shipping_address,
                postal_address: this.data.selectedData?.postal_address ?? `${postalAdd.Name}, ${postalAdd.District}, ${postalAdd.State}, ${postalAdd.Country}`
              });
            }
          }
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  createProductGroup(product: any): FormGroup {
    const fb = this.fb.group({
      selected: [product.selected ?? false],
      select_scheme: [product.select_scheme],
      item_id: [product.product_master_id],
      item_list_id: [product.item_list_id ?? product.id],
      avlStock: [product.avlStock],
      product_name: [product.product_name],
      product_code: [product.product_code],
      product_master_id: [product.product_master_id],
      product_category_id: [product.product_category_id],
      product_sub_category_id: [product.product_sub_category_id],
      product_master_name: [product.product_master_name],
      product_description: [product.product_description],
      hsn_code: [product.hsn_sac_code],
      gst_per: [product.igst],
      proposed_quantity: [product.proposed_quantity],
      remaining_quantity: [product.remaining_quantity],
      totalDiscountAmountPerQTY: [product.totalDiscountAmountPerQTY],
      uom_name: [product.uom_name],
      quantity: [
        { value: product.quantity || 0, 
          disabled: !product.selected 
        },
        [
          Validators.required,
          Validators.min(0),
          Validators.max(product.remaining_quantity || 0),
        ]
      ],
      price_per_unit: [
        product.price_per_unit || 0,
        [Validators.required, Validators.min(0)],
      ],
      amount: [
        product.price_per_unit
          ? product.price_per_unit * (product.quantity || 0)
          : product.amount || 0,
      ],
      item_type: this.commonService.getType(product.select_scheme),
      customization_type_id: [product.customization_type_id],
      branding_data_id: [product.branding_data_id],
      customisation_data: [product.customisation_data || []],
      branding_data: [product.branding_data || []],
    });
    if (product.remaining_quantity === 0) {
      fb.disable();
    }
    return fb;
  }

  get productsFormArray(): FormArray {
    return this.form.get('products') as FormArray;
  }

  groupProducts(): any[] {
    const groups: any[] = [];
    this.productsFormArray.controls.forEach((control: any, index: number) => {
      const product = control.value;
      const key = `${product.product_name}_${product.product_code}`;
      let group = groups.find(x => x.key === key);
      if (!group) {
        group = {
          key,
          product,
          indexes: []
        };
        groups.push(group);
      }
      group.indexes.push(index);
    });
    return groups;
  }

  isFirstOccurrence(index: number): boolean {
    const current = this.productsFormArray.at(index).value;

    return !this.productsFormArray.controls
      .slice(0, index)
      .some((x: any) => x.value.product_master_id === current.product_master_id);
  }

  isLastOccurrence(index: number): boolean {
    const currentItemListId =
      this.productsFormArray.at(index).get('item_list_id')?.value;
    for (let i = index + 1; i < this.productsFormArray.length; i++) {
      if (
        this.productsFormArray.at(i).get('item_list_id')?.value ===
        currentItemListId
      ) {
        return false;
      }
    }
    return true;
  }

  getTotalOrderQty(productMasterId: number): number {
    return this.productsFormArray.controls
      .filter((x: any) => x.get('product_master_id')?.value === productMasterId)
      .reduce((sum: number, x: any) => {
        return sum + Number(x.get('proposed_quantity')?.value || 0);
      }, 0);
  }

  getTotalPendingQty(productMasterId: number): number {
    return this.productsFormArray.controls
      .filter((x: any) => x.get('product_master_id')?.value === productMasterId)
      .reduce((sum: number, x: any) => {
        return sum + Number(x.get('remaining_quantity')?.value || 0);
      }, 0);
  }

  prepareBomMap() {
    this.bomMap = {};

    this.bomArray.forEach((bom: any) => {
      bom.selected = bom.selected ?? false;
      bom.enterDispatchQty = bom.enterDispatchQty ?? 0;
      bom.dispatch_qty = bom.dispatch_qty ?? 0;
      bom.pending_qty = bom.pending_qty ?? bom.bom_qty;

      // Disable fully dispatched BOM
      if (bom.pending_qty <= 0) {
        bom.selected = false;
        bom.disabled = true;
      } else {
        bom.disabled = false;
      }

      if (!this.bomMap[bom.item_list_id]) {
        this.bomMap[bom.item_list_id] = [];
      }

      this.bomMap[bom.item_list_id].push(bom);
    });
  }

  onCheckboxChange(index: number): void {
    const productGroup = this.productsFormArray.at(index);
    const isSelected = productGroup.get('selected')?.value;
    const qtyControl = productGroup.get('quantity');

    if (isSelected) {
      qtyControl?.enable();
      // If checkbox is checked, ensure quantity is set to remaining quantity
      productGroup.get('quantity')?.setValue(productGroup.get('remaining_quantity')?.value || 0);
    } else {
      qtyControl?.disable();
      // If checkbox is unchecked, reset quantity to 0
      productGroup.get('quantity')?.setValue(0);
      productGroup.get('quantity')?.clearValidators();
    }
    this.onQuantityOrPriceChange(index);
  }

  onQuantityOrPriceChange(index: number): void {
    const productGroup = this.productsFormArray.at(index);
    if (!productGroup.get('selected')?.value) {
      productGroup.patchValue({
        quantity: 0
      });
    }

    const quantity = productGroup.get('quantity')!.value;
    const proposedQty = Number(productGroup.get('proposed_quantity')?.value || 0 );
    const customisationData = productGroup.get('customisation_data')?.value || [];

    const updatedCustomisationData = customisationData.map((item: any) => {
      const customQty = Number(item.qty || 0);
      return {
          ...item,
          dispatchQty: proposedQty > 0 ? (customQty / proposedQty) * quantity : 0
        };
    });

    productGroup.get('customisation_data')?.setValue(updatedCustomisationData);
    this.recalculateStock();
  }

  onBomCheckboxChange(bom: any): void {
    if (bom.selected) {
      bom.enterDispatchQty = bom.pending_qty || 0;
    } else {
      bom.enterDispatchQty = 0;
    }
    this.onBomDispatchQtyChange(bom);
  }

  onBomDispatchQtyChange(bom: any) {
    if (!bom.selected) {
      bom.enterDispatchQty = 0;
      bom.dispatch_qty = 0;
    }

    const dispatchQty = Number(bom.enterDispatchQty || 0);
    bom.dispatch_qty = dispatchQty;
    bom.pending_qty = bom.bom_qty - dispatchQty;

    bom.bom_items.forEach((item: any) => {
      item.dispatchQty = 0;
      item.pendingQty = item.qty_per_bom * bom.pending_qty;

      item.substitute_items?.forEach((sub: any) => {
        sub.dispatchQty = 0;
        sub.pendingQty = item.qty_per_bom * bom.pending_qty;
      });
    });
    this.recalculateStock();
  }

  recalculateStock() {
    // 1. Reset stock
    this.stockSummary = JSON.parse(JSON.stringify(this.originalStockSummary));

    // old object clear
    this.stockMap = {};

    this.stockSummary.forEach((x: any) => {
        this.stockMap[x.item_id] = x;
    });

    this.applyProductStock();
    this.applyBomStock();
    this.refreshStockUI();
  }

  refreshStockUI() {
    // Products
    this.productsFormArray.controls.forEach((fg: any) => {
      const stock = this.stockMap[fg.get('item_id')?.value];
      if (stock) {
          fg.get('avlStock')?.setValue(stock.available_qty, {
              emitEvent: false,
          });
      }

      const customs = fg.get('customisation_data')?.value || [];
      customs.forEach((c: any) => {
        const id = c.accessory_item_id || c.basket_item_id;
        if (this.stockMap[id]) {
            c.avlStock = this.stockMap[id].available_qty;
        }
      });
    });

    // BOM
    this.bomArray.forEach((bom: any) => {
      bom.bom_items.forEach((item: any) => {
        if (item.avlStock >= 0) {
          item.avlStock =
            this.stockMap[item.item_id]?.available_qty ?? 0;
        }

        item.substitute_items?.forEach((sub: any) => {
          if (Number(sub.dispatchQty || 0) === 0) {
            sub.avlStock = this.stockMap[sub.item_id]?.available_qty ?? 0;
          }
        });
      });
    });
  }

  applyProductStock() {
    this.productsFormArray.controls.forEach((fg:any)=>{
        const qty = Number(fg.get('quantity')?.value || 0);
        this.minusStock(fg.get('item_id')?.value, qty); // Main Product

        const customs = fg.get('customisation_data')?.value || []; // Customisation data
        customs.forEach((c:any)=>{
          const customItemId = c.accessory_item_id || c.basket_item_id;
            this.minusStock(
                customItemId,
                c.dispatchQty
            );
        });
    });
  }

  applyBomStock() {
    this.bomArray.forEach((bom: any) => {
      // if (!bom.selected || bom.dispatch_qty <= 0) {
      //   return;
      // }
      if (!bom.selected || bom.dispatch_qty <= 0) {
        bom.bom_items.forEach((item: any) => {

            // Primary
            const stock = this.stockMap[item.item_id]?.available_qty ?? 0;
            item.dispatchQty = 0;
            item.avlStock = stock;
            this.updateItemAvailability(item.item_id, stock);

            // Substitute
            item.substitute_items?.forEach((sub: any) => {
                const subStock =
                    this.stockMap[sub.item_id]?.available_qty ?? 0;

                sub.dispatchQty = 0;
                sub.avlStock = subStock;
                this.updateItemAvailability(sub.item_id, subStock);
            });
        });
        return;
      }

      bom.bom_items.forEach((item: any) => {
        const required = item.qty_per_bom * Number(bom.dispatch_qty);
        item.dispatchQty = 0;

        item.substitute_items?.forEach((sub: any) => {
          sub.dispatchQty = 0;
        });

        let remaining = required;
        const originalPrimaryStock = this.stockMap[item.item_id]?.available_qty ?? 0;
        let primaryStock = originalPrimaryStock;
        const primaryDispatch = Math.min(primaryStock, remaining);
        item.dispatchQty = primaryDispatch;
        remaining -= primaryDispatch;
        primaryStock -= primaryDispatch;
        this.stockMap[item.item_id].available_qty = primaryStock;
        let totalDispatch = primaryDispatch;

        item.substitute_items?.forEach((sub: any) => {
          if (remaining <= 0) {
              return;
          }

          let subStock = this.stockMap[sub.item_id]?.available_qty ?? 0;
          const subDispatch = Math.min(subStock, remaining);
          sub.dispatchQty = subDispatch;
          remaining -= subDispatch;
          subStock -= subDispatch;
          sub.avlStock = subStock;
          this.stockMap[sub.item_id].available_qty = subStock;
          sub.dispatchQty = subDispatch;
          totalDispatch += subDispatch;
        });

        const shortage = required - totalDispatch;
        if (shortage > 0) {
            item.avlStock = -shortage;

            this.updateItemAvailability(item.item_id, -shortage);
            this.stockMap[item.item_id].available_qty = 0;
        } else {
            const avl = this.stockMap[item.item_id].available_qty;
            item.avlStock = avl;

            this.updateItemAvailability(item.item_id, avl);
        }
      });
    });
  }

  updateItemAvailability(itemId: number, avlStock: number) {
    // Products
    this.productsFormArray.controls.forEach((fg: any) => {

      if (fg.get('item_id')?.value == itemId) {
        fg.get('avlStock')?.setValue(avlStock, { emitEvent: false });
      }

      const customs = fg.get('customisation_data')?.value || [];
      customs.forEach((c: any) => {
        const customItemId = c.accessory_item_id || c.basket_item_id;
        if (customItemId == itemId) {
          c.avlStock = avlStock;
        }
      });
    });

    // BOM
    this.bomArray.forEach((bom: any) => {
      bom.bom_items.forEach((item: any) => {
        if (item.item_id == itemId) {
          item.avlStock = avlStock;
        }

        item.substitute_items?.forEach((sub: any) => {
          if (sub.item_id == itemId) {
            sub.avlStock = avlStock;
          }
        });
      });
    });
  }

  minusStock(itemId:number, qty:number){
    const stock = this.stockMap[itemId];
    if (!stock) return;
    stock.available_qty = stock.available_qty - qty;
    const currentStock = stock.available_qty;
    this.updateItemAvailability(itemId, currentStock);
  }

  onSubmit(): void {

    if (!this.form.get('expected_delivery_date')?.value) {
      this.toaster.warning('Please select Expected Delivery Date.');
      return;
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const products = this.productsFormArray.value;

    // Product Dispatch Qty Validation
    for (let product of products) {
      if (product.selected && (!product.quantity || product.quantity <= 0)) {
        this.toaster.error(
          `Please enter dispatch quantity for ${product.product_name}`
        );
        return;
      }
    }

    const formValue = this.form.getRawValue();
    // formValue.bomArray = JSON.parse(JSON.stringify(this.bomArray));
    formValue.bomArray = this.bomArray;

    formValue.shippingAddress = {
      ...this.shippingAddress,
      shipping_address: formValue.address,
      shipping_postal_address: formValue.postal_address,
      shipping_pin_code: formValue.pincode
    };

    formValue.contact_person_id = this.getAllData.contact_person_id;

    // Selected Products
    const selectedProducts = formValue.products.filter(
      (product: any) => product.selected && product.quantity > 0
    );

    // Selected BOM
    const selectedBom = this.bomArray.filter(
      (bom: any) => bom.selected
    );

    // Nothing Selected
    if (selectedProducts.length === 0 && selectedBom.length === 0) {
      this.toaster.warning(
        'Please select at least one Item or BOM.'
      );
      return;
    }

    // BOM Dispatch Qty Validation
    const invalidBom = selectedBom.find(
      (bom: any) => !bom.enterDispatchQty || bom.enterDispatchQty <= 0
    );

    if (invalidBom) {
      this.toaster.warning(
        `Please enter BOM Dispatch Qty for ${invalidBom.bom_name}.`
      );
      return;
    }

    // Product Stock Validation
    const selectedProductsAvlStock = selectedProducts.filter(
      (product: any) => product.avlStock < 0
    );

    if (selectedProductsAvlStock.length) {
      this.toaster.warning(
        `${selectedProductsAvlStock[0].product_name} has insufficient stock.`
      );
      return;
    }

    // Customization Stock Validation
    const selectedCustomization = selectedProducts
      .flatMap((product: any) => product.customisation_data || [])
      .filter(
        (item: any) => item.avlStock < 0
      );

    if (selectedCustomization.length) {
      this.toaster.warning(
        `${selectedCustomization[0].accessories_name || selectedCustomization[0].type_of_basket} has insufficient stock.`
      );
      return;
    }

    // BOM Stock Validation
    const insufficientBomItems: any[] = [];
    selectedBom.forEach((bom: any) => {
      bom.bom_items.forEach((item: any) => {

        const totalDispatch =
          Number(item.dispatchQty || 0) +
          (item.substitute_items || []).reduce(
            (total: number, sub: any) =>
              total + Number(sub.dispatchQty || 0),
            0
          );

        const required =
          Number(item.qty_per_bom || 0) *
          Number(bom.dispatch_qty || 0);

        if (totalDispatch < required) {
          insufficientBomItems.push({
            bom: bom.bom_name,
            item: item.item_name
          });
        }
      });
    });

    if (insufficientBomItems.length) {
      this.toaster.warning(
        `${insufficientBomItems[0].bom} - ${insufficientBomItems[0].item} has insufficient stock.`
      );
      return;
    }
    console.log(formValue, "___finalData");
    this.dialogRef.close(formValue);
  }

  onClose(): void {
    this.dialogRef.close();
  }

}