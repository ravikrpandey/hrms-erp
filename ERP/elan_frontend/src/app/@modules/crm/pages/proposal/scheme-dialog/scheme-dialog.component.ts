import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { SalesService } from '../../sales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scheme-dialog',
  templateUrl: './scheme-dialog.component.html',
  styleUrls: ['./scheme-dialog.component.scss']
})
export class SchemeDialogComponent {
  // data:any;
  proposalForm: any;
  entityId: any;
  financial_year_id: any;
  userLoginId: any;
  cetegory: any = [];
  productData: any[] = [];
  productDataOut: any[] = []
  totalCGST: number = 0;
  totalSGST: number = 0;
  totalIGST: number = 0;
  totalDiscount: number = 0;
  totalCGSTPercent: number = 0;
  totalSGSTPercent: number = 0;
  totalIGSTPercent: number = 0;
  grandTotal: number = 0;
  formattedTotalCGST: any;
  formattedTotalSGST: any;
  formattedTotalIGST: any;
  formattedTotalDiscount: any;
  formattedGrandTotal: any;
  formattedTotalCGSTPercent: any;
  formattedTotalSGSTPercent: any;
  formattedTotalIGSTPercent: any;
  totalCGSTforAdditionalCharge: any;
  totalSGSTforAdditionalCharge: any;
  totalIGSTforAdditionalCharge: any;
  totalAMTAfterDiscount: any;
  allDataGet: any;
  totalAmountItem: any;
  totalGSTAmount: any;
  totalGrandAmountPrice: number = 0;
  totalGSTAmountBasket: any;
  totalGrandAmountPriceBasket: number = 0;
  totalGSTAmountOut: any;
  totalGrandAmountPriceOut: any;
  customizationCheck: boolean = false;
  bradingCheck: boolean = false;
  dataSchemeAll: any;
  dataSchemeAllOut: any;
  maxQuantity: number = 0;
  // subtractFromTotal:any;
  customer_type: any;
  client_id: any;
  dataCheck: any;
  schemeDataArray: any;
  getAllBasketData: any;
  getAllBrandingData: any;
  totalGrandWithoutGst: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private $crm: CrmService,
    private dialog: MatDialog,
    private $productionService: ProductionService,
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialogs: MatDialogRef<SchemeDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.proposalForm = this.fb.group({
      // id: new FormControl(null),_type
      item_name: new FormControl(null),
      item_quantity: new FormControl(null),
      selectedType: new FormControl(null),
      description: new FormControl(null),
      branding_sides: new FormControl(null),
      branding_amt: new FormControl(null),
      original_branding_amt: new FormControl(null),
      subtractFromTotal: new FormControl(null),
      item_quantity_view: new FormControl(null),
      item_quantity_branding: new FormControl(null),
      item_quantity_branding_view: new FormControl(null),
      remaining_quantity: new FormControl(null),
      typeCheck: new FormControl(null),
      brandingTypes: new FormControl(null),
      hsn_code_branding: new FormControl(null),
      gst_value_branding: new FormControl(null),
      productDetailList: new FormArray([
        new FormGroup({
          product_master_id: new FormControl(null),
          product_sub_category_id: new FormControl(null),
          product_category_id: new FormControl(null),
          qty: new FormControl(null),
          accessories_name: new FormControl(null),

          price: new FormControl(null),
          gst_type: new FormControl(null),
          total_price: new FormControl(null),
          product_category_name: new FormControl(null),
          product_sub_category_name: new FormControl(null),
          product_name: new FormControl(null),
          discount: new FormControl(null),
          hsn_code: new FormControl(null)
        }),
      ]),
      productDetailListOut: new FormArray([
        new FormGroup({
          accessories_name: new FormControl(null),

          product_master_id: new FormControl(null),
          product_sub_category_id: new FormControl(null),
          product_category_id: new FormControl(null),
          qty: new FormControl(null),
          price: new FormControl(null),
          gst_type_out: new FormControl(null),
          total_price: new FormControl(null),
          product_category_name: new FormControl(null),
          product_sub_category_name: new FormControl(null),
          product_name: new FormControl(null),
          discount: new FormControl(null),
          hsn_code_out: new FormControl(null)
        }),
      ]),

      basketDetailList: new FormArray([
        new FormGroup({
          typeOfBasket: new FormControl(null),
          no_of_partition: new FormControl(null),
          qty_of_basket: new FormControl(null),
          price_per_unit: new FormControl(null),
          type_basket_name: new FormControl(null),
          hsn_code: new FormControl(null),
          gst_value: new FormControl(null),
          total_priceBasket: new FormControl(null)
        })
      ])


    });

    this.allDataGet = data;
    console.log(data, "data<<<<<<<<<<<");
    this.customer_type = data?.customer_type;
    this.client_id = data?.client_id
    this.proposalForm.patchValue({
      item_name: this.allDataGet?.data?.product_name,
      item_quantity_view: this.allDataGet?.data?.qty,
      item_quantity_branding_view: this.allDataGet?.schemeData?.branding?.qty
    })
  }

  getBrandingObjects(data: any): any[] {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    }

    if (typeof data === 'object') {
      return [data]; // wrap object in array
    }

    return [];
  }

  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.userLoginId = localStorage.getItem('EmpMainId');
    this.proposalForm.patchValue({
      selectedType: "In",
      typeCheck: "Accessories"
    })
    this.getAllCategory();

    if (this.customer_type === "NEW") {
      this.schemeDataArray = this.allDataGet?.schemeData || [];
      let totalQty = 0;

      this.schemeDataArray?.forEach((entry: any) => {
        totalQty += Number(entry?.qty) || 0;
      });

      let remainingQty = Math.max(Number(this.allDataGet?.data?.qty) - totalQty, 0);
      this.proposalForm.patchValue({
        remaining_quantity: remainingQty || 0
      })

    } else if (this.allDataGet?.type == "addSO") {

      this.addSoData(this.allDataGet?.data)
      this.schemeDataArray = this.allDataGet?.schemeData || [];
      let totalQty = 0;

      this.schemeDataArray?.forEach((entry: any) => {
        totalQty += Number(entry?.qty) || 0;
      });

      let remainingQty = Math.max(Number(this.allDataGet?.data?.qty) - totalQty, 0);
      this.proposalForm.patchValue({
        remaining_quantity: remainingQty || 0
      })
    }

    else {
      if (this.allDataGet?.schemeData?.length > 0) {
        this.schemeDataArray = this.allDataGet?.schemeData || [];
        let totalQty = 0;

        this.schemeDataArray?.forEach((entry: any) => {
          totalQty += Number(entry?.qty) || 0;
        });

        let remainingQty = Math.max(Number(this.allDataGet?.data?.qty) - totalQty, 0);
        this.proposalForm.patchValue({
          remaining_quantity: remainingQty || 0
        })
      } else {
        this.proposalForm.patchValue({
          remaining_quantity: Number(this.allDataGet?.data?.qty) || 0
        })
      }
    }

    this.dataShow();
    const remainingQty = this.proposalForm.get('remaining_quantity')?.value;
    this.$crm.updateMessage(remainingQty);

    this.getAllActiveProductAccessories();
    this.getAllBasket();
    this.getAllBranding()
  }

  getAllBranding() {
    let data = this.allDataGet?.otherData ? this.allDataGet.otherData : this.allDataGet.data;
    this._configurationalMasterService.getBrandingWithCustomerItem(this.client_id, data).subscribe((res: any) => {
      this.getAllBrandingData = res.data;
    })
  }

  dataShow() {
    const schemes = this.allDataGet?.data?.select_scheme;

    if (schemes?.includes("1") && schemes.includes("2")) {
      this.customizationCheck = true;
      this.bradingCheck = true;
    } else if (schemes?.includes("1")) {
      this.customizationCheck = true;
    } else if (schemes?.includes("2")) {
      this.bradingCheck = true;
    } else {
      console.log("No valid scheme selected");
    }

    const remainingQty = this.proposalForm.get('remaining_quantity')?.value;
    const patchedQty = remainingQty;
    this.maxQuantity = Number(patchedQty) || 0;

    this.proposalForm.get('item_quantity')?.setValidators([
      Validators.required,
      Validators.max(this.maxQuantity)
    ]);
    this.proposalForm.get('item_quantity_branding')?.setValidators([
      Validators.required,
      Validators.max(this.maxQuantity)
    ]);
  }

  addSoData(data: any) {
    const inData: any = []
    const outData: any = []
    data?.customisation_data?.map((item: any) => {
      if (item?.customization_type === "IN") {
        inData?.push(item)
      } else if (item?.customization_type === "OUT") {
        outData?.push(item)
      }

      this.dataSchemeAll = inData;
      this.dataSchemeAllOut = outData;
      this.proposalForm.patchValue({
        item_quantity_view: data?.customisation?.qty,
        item_name: this.allDataGet?.data?.product_name,
        item_quantity_branding_view: data?.branding_data[0]?.qty,
        branding_amt: data?.branding_amt?.branding_amt,
        hsn_code_branding: data?.branding_data[0]?.hsn_code_branding,
        gst_value_branding: data?.branding_data[0]?.gst_value_branding,
        description: data?.branding_data[0]?.branding_description,
        branding_sides: data?.branding_data[0]?.branding_sides,
        brandingTypes: data?.branding_data[0]?.branding_mst_id
      })
      
      this.brandingChange({
        value: data?.branding_data[0]?.branding_mst_id
      });
    })
  }

  onQuantityInput() {
    const qtyCtrl = this.proposalForm.get('item_quantity');
    if (qtyCtrl && qtyCtrl.value > this.maxQuantity) {
      qtyCtrl.setValue(this.maxQuantity);
    }

    const parentQty = Number(qtyCtrl?.value || 0);

    if (!parentQty) return;

    // Accessories
    const accArray = this.proposalForm.get('productDetailList') as FormArray;

    accArray.controls.forEach((row: any) => {
      const currentQty = Number(row.get('qty')?.value || 0);

      if (currentQty > 0) {
        const multiplier = Math.max(1, Math.round(currentQty / parentQty));
        row.get('qty')?.setValue(parentQty * multiplier);
      }
    });

    // Basket
    const basketArray = this.proposalForm.get('basketDetailList') as FormArray;

    basketArray.controls.forEach((row: any) => {
      const currentQty = Number(row.get('qty_of_basket')?.value || 0);

      if (currentQty > 0) {
        const multiplier = Math.max(1, Math.round(currentQty / parentQty));
        row.get('qty_of_basket')?.setValue(parentQty * multiplier);
      }
    });

    this.acc_calculation();
    this.basket_calculation();
  }

  onQuantityInputBranding() {
    const qtyCtrl = this.proposalForm.get('item_quantity_branding');
    if (qtyCtrl && qtyCtrl.value > this.maxQuantity) {
      qtyCtrl.setValue(this.maxQuantity);
    }
  }

  getByCutomize() {
    let data = {
      proposal_no: this.allDataGet?.data?.proposal_no
    }
    if (this.allDataGet?.data?.actionType === "edit" || this.allDataGet?.data?.actionType === "view") {

      this.$crm.getByCustomizeVersion(this.allDataGet?.data?.id, data).subscribe((res: any) => {
        this.CF_1.productDetailList = this.patchData(res?.data);
        this.CF_1.productDetailListOut = this.patchDataOut(res.data);

        this.totalGSTAmount = res.data[0]?.total_in_gst;
        this.totalGrandAmountPrice = res.data[0]?.grand_in_total;
        this.totalGSTAmountOut = res.data[0]?.total_out_gst;
        this.totalGrandAmountPriceOut = res.data[0]?.grand_out_total;
        this.proposalForm.patchValue({
          branding_amt: res.data[0]?.branding?.branding_amt,
          description: res.data[0]?.branding?.branding_description,
          branding_sides: res.data[0]?.branding?.branding_sides,
          item_quantity: res.data[0]?.qty,
          item_quantity_branding: res.data[0]?.branding?.qty,
          item_quantity_branding_view: res.data[0]?.branding?.qty,
          brandingTypes: res.data[0]?.branding?.brandingTypes
        })
        if (res.data[0]?.substract_total === 1) {
          this.proposalForm.patchValue({
            subtractFromTotal: true
          })
        } else {
          this.proposalForm.patchValue({
            subtractFromTotal: false
          })
        }
      }, ((err: any) => {
        this.toast.error(`${err?.error?.message || "Internal Server Error"}`)
      }))
    }
  }

  getByCutomizeExiting() {
    let data = {
      proposal_no: this.allDataGet?.data?.proposal_no
    }

    this.$crm.getByCustomizeExisting(this.allDataGet?.data?.id, data).subscribe((res: any) => {
      this.CF_1.productDetailList = this.patchData(res?.data);
      this.CF_1.productDetailListOut = this.patchDataOut(res.data);

      this.totalGSTAmount = res.data[0]?.total_in_gst;
      this.totalGrandAmountPrice = res.data[0]?.grand_in_total;
      this.totalGSTAmountOut = res.data[0]?.total_out_gst;
      this.totalGrandAmountPriceOut = res.data[0]?.grand_out_total;
      this.proposalForm.patchValue({
        branding_amt: res.data[0]?.branding?.branding_amt,
        description: res.data[0]?.branding?.branding_description,
        branding_sides: res.data[0]?.branding?.branding_sides,
        item_quantity: res.data[0]?.qty,
        item_quantity_branding: res.data[0]?.branding?.qty,
        brandingTypes: res.data[0]?.branding?.brandingTypes
      })
    },
      ((err: any) => {
        this.toast.error(`${err?.error?.message || "Internal Server Error"}`);
        this.dataCheck = "Not Found Data"
      })
    )
  }

  patchData(e: any): FormArray {
    this.proposalForm.patchValue({
      branding_amt: this.allDataGet?.schemeData?.branding?.branding_amt || null,
      description: this.allDataGet?.schemeData?.branding?.branding_description || null,
      branding_sides: this.allDataGet?.schemeData?.branding?.branding_sides || null,
      item_quantity: this.allDataGet?.schemeData?.customization[0]?.qty || null,
      item_quantity_branding: this.allDataGet?.schemeData?.branding?.qty || null,
      brandingTypes: this.allDataGet?.schemeData?.branding?.brandingTypes || null
    });

    // Set total values
    this.totalGSTAmount = e[0]?.total_in_gst;
    this.totalGrandAmountPrice = e[0]?.grand_in_total;
    this.totalGSTAmountOut = e[0]?.total_out_gst;
    this.totalGrandAmountPriceOut = e[0]?.grand_out_total;
    if (this.allDataGet?.schemeData?.customization[0]?.substract_total === 1 || this.allDataGet?.schemeData?.customization[0]?.substract_total === true) {
      this.proposalForm.patchValue({
        subtractFromTotal: true
      })
    } else {
      this.proposalForm.patchValue({
        subtractFromTotal: false
      })
    }

    const modifyData: any[] = e[0]?.customization?.filter((item: any) =>
      (item?.customization_type || '').toLowerCase() === 'in'
    );

    this.dataSchemeAll = modifyData;

    return new FormArray(
      modifyData?.map((x: any, index: number) => {

        setTimeout(() => {
          this.getSubCategory(x?.accessory_in_category, index);
          this.getAllActiveProduct(x?.accessory_in_sub_category, x?.accessory_in_category, index);
        }, 100);

        const defaultControls: any = {
          product_category_id: x?.accessory_in_category ?? null,
          product_sub_category_id: x?.accessory_in_sub_category ?? null,
          product_master_id: x?.accessory_in_name ?? null,
          qty: x?.qty ?? null,
          price: x?.price_per_unit ?? null,
          total_price: x?.total_price ?? null,
          gst_type: x?.gst ?? null,
          discount_approved: null,
          discount_request: null,
          readonly: false,
          discount: x?.discount,
          id: x?.id ?? null,
          hsn_code: x?.hsn_sac_code || null
        };

        const group = new FormGroup({});
        Object.keys(defaultControls).forEach(key => {
          group.addControl(key, new FormControl(defaultControls[key]));
        });

        return group;
      })
    );
  }


  patchDataOut(e: any): FormArray {
    // Set total amounts from response
    this.totalGSTAmount = e[0]?.customization?.total_in_gst;
    this.totalGrandAmountPrice = e[0]?.customization?.grand_in_total;
    this.totalGSTAmountOut = e[0]?.customization?.total_out_gst;
    this.totalGrandAmountPriceOut = e[0]?.customization?.grand_out_total;
    const modifyData: any[] = e[0]?.customization?.filter((item: any) =>
      (item?.customization_type || '').toLowerCase() === 'out'
    );

    this.dataSchemeAllOut = modifyData;

    return new FormArray(
      modifyData?.map((x: any, index: any) => {
        setTimeout(() => {
          this.getSubCategoryOut(x?.accessory_in_category, index);
          this.getAllActiveProductOut(x?.accessory_in_sub_category, x?.accessory_in_category, index);
        }, 100);

        const defaultControls: any = {
          product_category_id: x?.accessory_in_category ?? null,
          product_master_id: x?.product_id ?? x?.product_master_id ?? x?.accessory_in_name ?? null,
          qty: x?.qty ?? null,
          price: x?.price_per_unit ?? null,
          total_price: x?.total_price ?? null,
          gst_type_out: x?.gst ?? null,
          discount_approved: null,
          discount_request: null,
          readonly: false,
          discount: null,
          id: x?.id ?? null,
          hsn_code_out: null
        };

        const group = new FormGroup({});
        Object.keys(defaultControls).forEach(key => {
          group.addControl(key, new FormControl(defaultControls[key]));
        });
        group.addControl('product_sub_category_id', new FormControl(x?.accessory_in_sub_category));

        return group;
      })
    );
  }

  get CF_1(): any {
    return this.proposalForm.controls;
  }

  addrow() {
    <FormArray>this.CF_1.productDetailList.push(
      new FormGroup({
        product_master_id: new FormControl(null),
        product_sub_category_id: new FormControl(null),
        accessories_name: new FormControl(null),
        product_category_id: new FormControl(null),
        qty: new FormControl(null),
        price: new FormControl(null),
        gst_type: new FormControl(null),
        discount: new FormControl(null),
        total_price: new FormControl(null),
        product_category_name: new FormControl(null),
        product_sub_category_name: new FormControl(null),
        product_name: new FormControl(null),
        hsn_code: new FormControl(null)
      })
    );
  }

  addBasket(i: any) {
    const control = this.proposalForm?.get('basketDetailList') as FormArray;
    <FormArray>this.CF_1.basketDetailList.push(
      new FormGroup({
        typeOfBasket: new FormControl(null),
        no_of_partition: new FormControl(null),
        qty_of_basket: new FormControl(null),
        price_per_unit: new FormControl(null),
        type_basket_name: new FormControl(null),
        hsn_code: new FormControl(null),
        gst_value: new FormControl(null),
        total_priceBasket: new FormControl(null)
      })
    )
  }

  addrowOut() {
    <FormArray>this.CF_1.productDetailListOut.push(
      new FormGroup({
        product_master_id: new FormControl(null),
        product_sub_category_id: new FormControl(null),
        product_category_id: new FormControl(null),
        accessories_name: new FormControl(null),
        qty: new FormControl(null),
        price: new FormControl(null),
        gst_type_out: new FormControl(null),
        total_price: new FormControl(null),
        product_category_name: new FormControl(null),
        product_sub_category_name: new FormControl(null),
        product_name: new FormControl(null),
        discount: new FormControl(null),
        hsn_code_out: new FormControl(null)
      })
    );
  }
  get productDetailList(): FormArray {
    return this.CF_1.get('productDetailList') as FormArray;
  }

  get basketDetailList(): FormArray {
    return this.CF_1.get('basketDetailList') as FormArray;
  }

  removedQty: number = 0;
  removeScheme(index: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this customization?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const removed = this.schemeDataArray.splice(index, 1);
        this.removedQty = Number(removed[0]?.customization?.[0]?.qty || 0);

        // Close the dialog and send qty to parent
        this.dialogs.close(this.removedQty);
      }
    });
  }

  hasAnyCustomizationOrBranding(): boolean {
    return this.schemeDataArray.some((scheme: any) =>
      (scheme?.customisation_data && scheme?.customisation_data.length > 0) ||
      (scheme?.branding_data && Object.keys(scheme?.branding_data).length > 0)
    );
  }

  deleteRow(i: any, control: any, deleteType: any) {

    if (deleteType == 'Baskets') {
      if (this.CF_1.basketDetailList.length >= 1) {
        this.CF_1.basketDetailList.removeAt(i);
        this.basket_calculation();

      } else {
        this.toast.error('must be one', "Can't Deleted!");
      }
    } else {
      if (this.CF_1.productDetailList.length >= 1) {
        this.CF_1.productDetailList.removeAt(i);
        this.acc_calculation();

      } else {
        this.toast.error('must be one', "Can't Deleted!");
      }
    }
  }

  acc_calculation() {
    const controls = this.proposalForm?.get('productDetailList') as FormArray;
    console.log(controls, 'acc_calculation');

    let list = controls.value;
    let totalAmountPrice = 0;
    let totalGrandAmountPrice = 0;
    for (let a = 0; a <= list.length - 1; a++) {
      const item = list[a];
      const pricePerUnit = Number(item?.price || 0);
      const qty = Number(item?.qty || 0);
      const gst = Number(item?.gst_type || 0);
      const baseTotal = pricePerUnit * qty;
      const gstAmount = (baseTotal * gst) / 100;
      totalAmountPrice += gstAmount;
      totalGrandAmountPrice += baseTotal;
    }
    this.totalGSTAmount = totalAmountPrice;
    this.totalGrandAmountPrice = totalGrandAmountPrice + this.totalGSTAmount;
    this.totalGrandWithoutGst = totalGrandAmountPrice
  }

  basket_calculation() {
    const controls = this.proposalForm?.get('basketDetailList') as FormArray;
    console.log(controls, 'basket_calculation');


    let list = controls.value;
    let totalAmountPrice = 0;
    let totalGrandAmountPrice = 0;
    for (let a = 0; a <= list.length - 1; a++) {
      const item = list[a];
      const pricePerUnit = Number(item?.price_per_unit || 0);
      const qty = Number(item?.qty_of_basket || 0);
      const gst = Number(item?.gst_value || 0);
      const baseTotal = pricePerUnit * qty;
      const gstAmount = (baseTotal * gst) / 100;
      totalAmountPrice += gstAmount;
      totalGrandAmountPrice += baseTotal;

    }
    this.totalGSTAmountBasket = totalAmountPrice;
    this.totalGrandAmountPriceBasket = totalGrandAmountPrice + this.totalGSTAmountBasket;
  }

  subCategory: any[][] = [];

  getSubCategory(event: any, index: number): void {
    const categoryId = event?.value ?? event;
    const selectedCategory = this.cetegory?.find((c: any) => c?.id === categoryId);

    if (selectedCategory) {
      const formItem = this.CF_1.productDetailList.at(index);
      const formItemOut = this.CF_1.productDetailListOut.at(index);

      formItem?.patchValue({
        product_category_name: selectedCategory?.asset_category_name
      });
      formItemOut?.patchValue({
        product_category_name: selectedCategory?.asset_category_name
      });

      this._configurationalMasterService.getSubCategory(categoryId).subscribe((res: any) => {
        this.subCategory[index] = res?.data || [];
      });
    }
  }

  subCategoryOut: any[][] = [];
  getSubCategoryOut(event: any, index: number): void {
    const categoryId = event?.value ?? event;
    const selectedCategory = this.cetegory?.find((c: any) => c?.id === categoryId);

    if (selectedCategory) {
      const formItem = this.CF_1.productDetailList.at(index);
      const formItemOut = this.CF_1.productDetailListOut.at(index);

      formItem?.patchValue({
        product_category_name: selectedCategory?.asset_category_name
      });
      formItemOut?.patchValue({
        product_category_name: selectedCategory?.asset_category_name
      });

      this._configurationalMasterService.getSubCategory(categoryId).subscribe((res: any) => {
        this.subCategoryOut[index] = res?.data || [];
      });
    }
  }

  getAllCategory() {
    this._configurationalMasterService.getActiveAssetMasterList()
      .subscribe((res: any) => {
        this.cetegory = res.data;
      });
  }

  getAllActiveProduct(subCategory: any, category: any, index: number): void {
    console.log(subCategory);
    console.log(category);
    console.log(index);

    const subCategoryId = subCategory?.id ?? subCategory;
    const categoryId = category?.item_category_id ?? category;
    const formItem = this.CF_1.productDetailList.at(index);
    const formItemOut = this.CF_1.productDetailListOut.at(index);

    formItem?.patchValue({
      product_sub_category_name: subCategory?.sub_category_name
    });

    formItemOut?.patchValue({
      product_sub_category_name: subCategory?.sub_category_name
    });

    this.$crm.getAccessoriesBySubCategory(categoryId, subCategoryId).subscribe((res: any) => {
      this.productData[index] = res?.data || [];
    });
  }

  getAllActiveProductAccessories(): void {
    const subCategoryId = this.allDataGet?.otherData?.product_sub_category_id;
    const categoryId = this.allDataGet?.otherData?.product_category_id;

    this.$crm.getAccessoriesBySubCategory(categoryId, subCategoryId).subscribe((res: any) => {
      this.productData = res[0]?.accessories || [];
      this.productDataOut = res?.data;
    });
  }

  getAllActiveProductOut(subCategory: any, category: any, index: number): void {
    const subCategoryId = subCategory?.id ?? subCategory;
    const categoryId = category?.item_category_id ?? category;
    const formItem = this.CF_1.productDetailList.at(index);
    const formItemOut = this.CF_1.productDetailListOut.at(index);

    formItem?.patchValue({
      product_sub_category_name: subCategory?.sub_category_name
    });

    formItemOut?.patchValue({
      product_sub_category_name: subCategory?.sub_category_name
    });

    this.$productionService.getItemsBySubCategory(subCategoryId, categoryId).subscribe((res: any) => {
      this.productDataOut[index] = res?.data || [];
    });
  }

  getProductData(data: any, index: any) {
    const rate = Number(this.data?.selectedCurrency?.rate || 1);

    const originalPrice = Number(data?.accessories_price || 0);
    this.CF_1.productDetailList.at(index)?.patchValue({
      uom_name: data?.MASTER_UOM?.uom_name, uom_id: data?.uom_id,
      product_name: data?.product_name || data?.item_name,
      accessories_name: data?.accessories_name,
      price_per_unit: data?.product_list_price,
      price:
        this.data?.selectedCurrency?.Currency_Type === 'INR'
          ? originalPrice
          : originalPrice * rate,
      // price: data?.accessories_price,
      discount: data?.accessories_discount,
      hsn_code: data?.MASTER_HSN_SAC_CODE?.hsn_sac_code || data?.hsn_sac_code,
      gst_type: data?.MASTER_HSN_SAC_CODE?.gst_value || data?.value,
      qty: null,
      total_price: null
    });

    this.acc_calculation(); // again calculation start

  }

  keyPress(event: Event | any) {

    const key = event.key;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }

  productCalculation() {
    let formObj = this.proposalForm?.value;
    let currentList = this.CF_1.productDetailList.value || [];

    this.totalCGST = 0;
    this.totalSGST = 0;
    this.totalIGST = 0;
    this.totalDiscount = 0;
    this.grandTotal = 0;

    this.totalCGSTPercent = 0;
    this.totalSGSTPercent = 0;
    this.totalIGSTPercent = 0;

    const additionalCharges = parseFloat(formObj?.additional_charges) || 0;
    let totalAMTwithout: any = 0
    currentList.forEach((item: any) => {
      const qty = Number(item?.qty);
      let discountPercent;
      const pricePerUnit = Number(item?.price_per_unit);
      if (!item.discount_approved) {
        discountPercent = Number(item?.maximum_discount) || 0;

      }
      else {
        discountPercent = Number(item?.discount_approved) || 0;

      }
      const cgstPercent = Number(item?.cgst) || 0;
      const sgstPercent = Number(item?.sgst) || 0;
      const igstPercent = Number(item?.igst) || 0;

      const totalPrice = qty * pricePerUnit;
      const discountAmount = (totalPrice * discountPercent) / 100;
      const discountedPrice = totalPrice - discountAmount;
      totalAMTwithout += discountedPrice;
      const cgstAmount = (cgstPercent * discountedPrice) / 100;
      const sgstAmount = (sgstPercent * discountedPrice) / 100;
      const igstAmount = (igstPercent * discountedPrice) / 100;

      this.totalCGST += cgstAmount;
      this.totalSGST += sgstAmount;
      this.totalIGST += igstAmount;
      this.totalDiscount += discountAmount;
      this.grandTotal += discountedPrice + cgstAmount + sgstAmount + igstAmount;

      this.totalCGSTPercent += cgstPercent;
      this.totalSGSTPercent += sgstPercent;
      this.totalIGSTPercent += igstPercent;
    });
    this.totalAMTAfterDiscount = totalAMTwithout
    this.grandTotal += additionalCharges;

    this.formattedTotalCGST = this.totalCGST.toFixed(2);
    this.formattedTotalSGST = this.totalSGST.toFixed(2);
    this.formattedTotalIGST = this.totalIGST.toFixed(2);
    this.formattedTotalDiscount = this.totalDiscount.toFixed(2);
    this.formattedGrandTotal = this.grandTotal.toFixed(2);

    this.formattedTotalCGSTPercent = this.totalCGSTPercent.toFixed(2);
    this.formattedTotalSGSTPercent = this.totalSGSTPercent.toFixed(2);
    this.formattedTotalIGSTPercent = this.totalIGSTPercent.toFixed(2);

    this.totalCGSTforAdditionalCharge = (this.totalCGSTPercent * additionalCharges) / 100;
    this.totalSGSTforAdditionalCharge = (this.totalSGSTPercent * additionalCharges) / 100;
    this.totalIGSTforAdditionalCharge = (this.totalIGSTPercent * additionalCharges) / 100;

    this.totalCGST += this.totalCGSTforAdditionalCharge;
    this.totalSGST += this.totalSGSTforAdditionalCharge;
    this.totalIGST += this.totalIGSTforAdditionalCharge;

    this.formattedTotalCGST = this.totalCGST.toFixed(2);
    this.formattedTotalSGST = this.totalSGST.toFixed(2);
    this.formattedTotalIGST = this.totalIGST.toFixed(2);

    this.grandTotal += this.totalCGSTforAdditionalCharge + this.totalSGSTforAdditionalCharge + this.totalIGSTforAdditionalCharge;
    this.formattedGrandTotal = this.grandTotal.toFixed(2);

    this.proposalForm.patchValue({
      discount: this.formattedTotalDiscount,
      cgst: this.formattedTotalCGST,
      sgst: this.formattedTotalSGST,
      igst: this.formattedTotalIGST,
      grant_total: this.formattedGrandTotal,
      totalAMTAfterDiscount: this.totalAMTAfterDiscount
    });
  }

  keyUpItem(event: any, i: any, data: any) {

    const parentQty = Number(
      this.proposalForm.get('item_quantity')?.value || 0
    );

    const control = this.proposalForm.get('productDetailList') as FormArray;

    const enteredQty = Number(control.at(i).get('qty')?.value || 0);

    if (
      parentQty > 0 &&
      enteredQty > 0 &&
      enteredQty % parentQty !== 0
    ) {
      this.toast.error(
        `Quantity must be multiple of ${parentQty}`
      );

      control.at(i).get('qty')?.setValue(null);
      return;
    }

    let list = control.value;

    list[i].total_price =
      Number(list[i]?.qty) * Number(list[i]?.price);

    this.proposalForm.patchValue({
      productDetailList: list
    });

    this.acc_calculation();
  }

  // keyUpItem(event: any, i: any, data: any) {
  //   const control = this.proposalForm?.get('productDetailList') as FormArray;

  //   let list = control.value;
  //   for (let a = 0; a <= i; a++) {

  //     list[i].total_price = Number(list[i]?.qty) * Number(list[i]?.price);
  //   }
  //   this.proposalForm.patchValue({
  //     productDetailList: list,
  //   })

  //   this.acc_calculation();
  // }

  // keyUpItemBasket(event: any, i: any, data: any) {
  //   const control = this.proposalForm?.get('basketDetailList') as FormArray;

  //   let list = control.value;
  //   for (let a = 0; a <= i; a++) {

  //     list[i].total_priceBasket = Number(list[i]?.qty_of_basket || Number(data?.basket_qty)) * Number(list[i]?.price_per_unit || Number(data.price_per_unit));
  //   }
  //   this.proposalForm.patchValue({
  //     basketDetailList: list,
  //   })

  //   this.basket_calculation();
  // }

  keyUpItemBasket(event: any, i: any, data: any) {

    const parentQty = Number(
      this.proposalForm.get('item_quantity')?.value || 0
    );

    const control = this.proposalForm.get('basketDetailList') as FormArray;

    const enteredQty = Number(
      control.at(i).get('qty_of_basket')?.value || 0
    );

    if (
      parentQty > 0 &&
      enteredQty > 0 &&
      enteredQty % parentQty !== 0
    ) {
      this.toast.error(
        `Basket quantity must be multiple of ${parentQty}`
      );

      control.at(i).get('qty_of_basket')?.setValue(null);
      return;
    }

    let list = control.value;

    list[i].total_priceBasket =
      Number(list[i]?.qty_of_basket) *
      Number(list[i]?.price_per_unit);

    this.proposalForm.patchValue({
      basketDetailList: list
    });

    this.basket_calculation();
  }

  keyUpItemOut(event: any, i: any, data: any) {
    const control = this.proposalForm?.get('productDetailListOut') as FormArray;

    let list = control.value;
    for (let a = 0; a <= i; a++) {

      list[i].total_price = Number(list[i]?.qty) * Number(list[i]?.price);
    }
    this.proposalForm.patchValue({
      productDetailListOut: list,
    })

    let totalAmountPrice = 0;
    let totalGrandAmountPrice = 0;
    for (let a = 0; a <= list.length - 1; a++) {

      totalAmountPrice += Number(list[a]?.total_price) * Number(list[a]?.gst_type) / 100;
      totalGrandAmountPrice += Number(list[a]?.total_price);

    }
    this.totalGSTAmountOut = totalAmountPrice;
    this.totalGrandAmountPriceOut = Number(totalGrandAmountPrice);
  }

  customizationValidation(val: any): boolean {
    const acc = val.productDetailList || [];
    const basket = val.basketDetailList || [];

    // Step 1: Check whether user filled any real data in each list
    const hasAccData = acc.some((item: any) => item.product_master_id != null || item.qty != null);
    const hasBasketData = basket.some((item: any) => item.typeOfBasket != null || item.qty_of_basket != null || item.no_of_partition != null);

    // Step 2: If both empty → stop here
    if (!hasAccData && !hasBasketData) {
      this.toast.warning('Please add at least accessories or basket data');
      return false;
    }

    // Step 3: If accessories section has data → validate all its required fields
    if (hasAccData) {
      for (let i = 0; i < acc.length; i++) {
        const item = acc[i];
        const started = item.product_master_id != null || item.qty != null;
        // If second row or further is completely empty → warning
        if (i > 0 && !started) {
          this.toast.warning(`Empty accessory row at ${i + 1} is not allowed`);
          return false;
        }
        // left field validation check
        if (started && (item.product_master_id == null || item.qty == null)) {
          this.toast.warning(`Please complete accessories data in row ${i + 1}`);
          return false;
        }
        // quantity check (add this below)
        if (started && parseFloat(item.qty) <= 0) {
          this.toast.warning(`Accessories quantity must be greater than 0 in row ${i + 1}`);
          return false;
        }
      }
    }

    // Step 4: If basket section has data → validate all its required fields
    if (hasBasketData) {
      for (let i = 0; i < basket.length; i++) {
        const item = basket[i];
        const started = item.typeOfBasket != null || item.qty_of_basket != null || item.no_of_partition != null;
        // If second row or further is completely empty → warning
        if (i > 0 && !started) {
          this.toast.warning(`Empty basket row at ${i + 1} is not allowed`);
          return false;
        }
        // left field validation check
        if (started && (item.typeOfBasket == null || item.qty_of_basket == null || item.no_of_partition == null)) {
          this.toast.warning(`Please complete baskets data in row ${i + 1}`);
          return false;
        }
        // quantity check (add this below)
        if (started && parseFloat(item.qty_of_basket) <= 0) {
          this.toast.warning(`Basket quantity must be greater than 0 in row ${i + 1}`);
          return false;
        }
      }
    }
    return true; // validation passed
  }

  brandingValidation(val: any): boolean {
    const hasBrandingTypes = val.brandingTypes != null && val.brandingTypes !== '';
    const hasBrandingSides = Array.isArray(val.branding_sides) && val.branding_sides.length > 0;
    const hasDescription = val.description != null && val.description.trim() !== '';
    if (!hasBrandingTypes || !hasBrandingSides || !hasDescription) {
      this.toast.warning("Please add branding data");
      return false;
    }
    return true; // validation passed
  }

  onSubmit() {
    let val = this.proposalForm.value;
    if (val?.remaining_quantity === 0) {
      this.toast.warning("Insufficient Remaimimg Quantity")
      return
    }
    if (val?.item_quantity === null) {
      this.toast.warning("Please Add Quantity")
      return
    }

    if (this.bradingCheck && this.customizationCheck) {
      const validCustom = this.customizationValidation(val);
      const validBranding = this.brandingValidation(val);
      if (!validCustom || !validBranding) return;
    } else {
      if (this.bradingCheck) {
        if (!this.brandingValidation(val)) return;
      } else if (this.customizationCheck) {
        if (!this.customizationValidation(val)) return;
      }
    }

    if (val?.selectedType === "In") {
      var selectType = "In"
    } else {
      var selectType = "Out"
    }

    let currentList = this.CF_1.productDetailList.value;
    let basketDetailList = this.CF_1.basketDetailList.value;

    const modifyData: any = []
    if (currentList[0]?.product_master_id) {
      currentList?.forEach((item: any) => {
        modifyData.push({
          qty: item?.qty,
          price_per_unit: item?.price,
          accessory_in_category: item?.product_category_id,
          accessory_in_sub_category: item?.product_sub_category_id,
          accessory_in_name: item?.product_master_id,
          accessories_name: item?.accessories_name,
          total_price: item?.total_price,
          totalPrice: item?.total_price,
          gst: item?.gst_type,
          discount: item?.discount,
          order_qty: 5,
          product_category_name: item?.product_category_name,
          product_sub_category_name: item?.product_sub_category_name,
          product_name: item?.product_name,
          hsn_code: item?.hsn_code,
          customization_type: "In",
          basket_mst_id: null,
          no_of_partician: null,
          totalWithGst: item?.total_price + (item?.total_price * item?.gst_type) / 100,
          custome_type: "Accessories"
        })
      })
    }

    // basket data 
    if (basketDetailList[0]?.typeOfBasket) {

      basketDetailList?.forEach((item: any) => {
        const countTotal = item?.price_per_unit * item?.qty_of_basket
        modifyData.push({
          qty: item?.qty_of_basket || null,
          accessory_in_category: null,
          accessory_in_sub_category: null,
          accessory_in_name: null,
          accessories_name: null,
          total_price: countTotal || null,
          gst: item?.gst_value || null,
          discount: null,
          order_qty: null,
          product_category_name: item?.product_category_name || null,
          product_sub_category_name: item?.product_sub_category_name || null,
          product_name: item?.product_name || null,
          hsn_code: item?.hsn_code || null,
          type_OfBasket: item?.typeOfBasket,
          no_of_partition: item?.no_of_partition,
          qty_of_basket: item?.qty_of_basket,
          price_per_unit: item?.price_per_unit,
          type_basket_name: item?.type_basket_name,
          customization_type: null,
          custome_type: "Baskets",
          basket_mst_id: item?.typeOfBasket,
          no_of_partician: item?.no_of_partition,
          after_discount: null,
          with_gst: null,
          proposal_customisation_id: null,
          totalWithGst: countTotal + (countTotal * item?.gst_value) / 100,
          totalPrice: countTotal
        })
      })
    }

    if (val?.productDetailListOut[0]?.product_master_id) {
      val?.productDetailListOut?.forEach((item: any) => {
        modifyData.push({
          qty: item?.qty,
          price_per_unit: item?.price,
          accessory_in_category: item?.product_category_id,
          accessory_in_sub_category: item?.product_sub_category_id,
          accessory_in_name: item?.product_master_id,
          total_price: item?.total_price,
          gst: item?.gst_type,
          accessories_name: item?.accessories_name,
          order_qty: 5,
          product_category_name: item?.product_category_name,
          product_sub_category_name: item?.product_sub_category_name,
          product_name: item?.product_name,
          discount: item?.discount,
          hsn_code_out: item?.hsn_code_out,
          customization_type: "Out"
        })
      })
    }

    const qtyCtrl = this.proposalForm.get('item_quantity');
    const totalPrice = Number(qtyCtrl?.value) * val?.branding_amt
    if (this.bradingCheck === true) {
      if (this.customer_type === "NEW") {
        var branding: any = {
          proposal_item_id: this.allDataGet?.data?.id || null,
          qty: Number(val?.item_quantity_branding) || null,
          select_scheme: this.allDataGet?.data?.select_scheme,
          branding_description: val?.description,
          branding_amt: val?.branding_amt,
          branding_sides: val?.branding_sides,
          brandingTypes: val?.brandingTypes,
          hsn_code_branding: val?.hsn_code_branding,
          gst: val?.gst_value_branding,
          totalPrice: totalPrice,
          totalWithGst: totalPrice + (totalPrice * val?.gst_value_branding) / 100,
        }
      } else {
        var branding: any = {
          customer_item_id: this.allDataGet?.data?.id || null,
          qty: Number(val?.item_quantity_branding) || null,
          select_scheme: this.allDataGet?.data?.select_scheme,
          branding_description: val?.description,
          branding_sides: val?.branding_sides,
          branding_amt: val?.branding_amt,
          brandingTypes: val?.brandingTypes,
          hsn_code_branding: val?.hsn_code_branding,
          gst: val?.gst_value_branding,
          totalPrice: Number(qtyCtrl?.value) * val?.branding_amt,
          totalWithGst: totalPrice + (totalPrice * val?.gst_value_branding) / 100,
        }
      }
    }

    if (this.customer_type === "NEW") {
      var data: any = {
        customer_type: this.customer_type,
        customisation_data: modifyData,
        proposal_item_id: this.allDataGet?.data?.id || null,
        qty: Number(val?.item_quantity) || null,
        select_scheme: this.allDataGet?.data?.select_scheme,
        total_in_gst: this.totalGSTAmount,
        grand_in_total: this.totalGrandAmountPrice + this.totalGrandAmountPriceBasket,
        totalGrandWithoutGst: this.totalGrandWithoutGst,
        grand_out_total: this.totalGrandAmountPriceOut,
        total_out_gst: this.totalGSTAmountOut,
        substract_total: val?.subtractFromTotal,
        order_qty: this.allDataGet?.data?.qty || null,
        branding_data: branding || null,
        createLeadDetails: this.allDataGet?.otherData,
        quotation_id: Number(this.allDataGet?.id),
        proposal_no: this.allDataGet?.data?.proposal_no,
        version_id: this.allDataGet?.data?.version_id || null,
        proposal_id: this.allDataGet?.data?.proposal_id || null,
        action_type: false,
        remaining_qty: val?.remaining_quantity,
        basketDetailList: basketDetailList,
        typeCheck: val?.typeCheck
      }
    } else {
      var data: any = {
        customer_type: this.customer_type,
        customisation_data: modifyData,
        branding_data: branding || null,
        createLeadDetails: this.allDataGet?.otherData,
        order_qty: this.allDataGet?.data?.qty || null,
        customer_id: this.client_id || null,
        proposal_no: this.allDataGet?.data?.proposal_no,
        version_id: this.allDataGet?.data?.version_id || null,
        proposal_id: this.allDataGet?.data?.proposal_id || null,
        action_type: false,
        total_in_gst: this.totalGSTAmount,
        grand_in_total: this.totalGrandAmountPrice + this.totalGrandAmountPriceBasket,
        totalGrandWithoutGst: this.totalGrandWithoutGst,
        grand_out_total: this.totalGrandAmountPriceOut,
        total_out_gst: this.totalGSTAmountOut,
        substract_total: val?.subtractFromTotal,
        customer_item_id: this.allDataGet?.data?.id || null,
        qty: Number(val?.item_quantity) || null || null,
        select_scheme: this.allDataGet?.data?.select_scheme,
        remaining_qty: val?.remaining_quantity,
        basketDetailList: basketDetailList,
        typeCheck: val?.typeCheck
      }
    }

    if (!val?.description) {
      data.branding_data = null;
    }
    console.log(data, "finaldata");
    this.dialogs.close(data)
  }

  getAllBasket() {
    this._configurationalMasterService.getAllBasket(this.entityId).subscribe((res: any) => {
      this.getAllBasketData = res.data;

    })
  }

  getBasketData(data: any, index: any) {
    const rate = Number(this.data?.selectedCurrency?.rate || 1);

    const originalPrice = Number(data?.price_per_unit || 0);

    this.CF_1.basketDetailList.at(index)?.patchValue({
      type_basket_name: data?.type_of_basket,
      no_of_partition: data?.no_of_partition,
      qty_of_basket: null,//data?.basket_qty,
      price_per_unit: this.data?.selectedCurrency?.Currency_Type === 'INR' ? originalPrice : originalPrice * rate,
      gst_value: data?.basket_gst_value,
      hsn_code: data?.basket_hsn_code,
      total_priceBasket: (data?.price_per_unit * data?.basket_qty)
    });

    this.basket_calculation(); // again calculation start
  }

  brandingChange(e: any) {
    let id = e?.value || e?.id;
    const FindData = this.getAllBrandingData?.find((data: any) => data?.id === id);
    
    const rate = Number(this.data?.selectedCurrency?.rate || 1);
    const originalPrice = Number(FindData?.price_per_unit || 0);
    this.proposalForm.patchValue({
      brandingTypes: FindData?.id,
      branding_amt: FindData?.price_per_unit,
      original_branding_amt: this.data?.selectedCurrency?.Currency_Type === 'INR' ? originalPrice : originalPrice * rate,

      branding_sides: FindData?.branding_sides,
      hsn_code_branding: FindData?.hsn_sac_code,
      gst_value_branding: FindData?.gst_value
    })
  }
}