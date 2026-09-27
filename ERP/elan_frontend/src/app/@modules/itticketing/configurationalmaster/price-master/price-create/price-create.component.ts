import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-price-create',
  templateUrl: './price-create.component.html',
  styleUrls: ['./price-create.component.scss']
})
export class PriceCreateComponent {
  createForm: FormGroup;
  financial_year_id: any;
  entity_id: any;
  id: any;
  action_type: any;
  response: any = null;
  categoryList: any;
  subCategoryList: any[] = [];
  customerTypes: any;
  customersName: any;
  productData: any;
  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    public $common: CommonService,
    private route: Router,
    private $productionService: ProductionService

  ) {
    this.createForm = this.fb.group({
      // price_type: new FormControl(null, [Validators.required]),
      customer_type: new FormControl(null, [Validators.required]),
      customer_type_view: new FormControl(null),
      // discount_flat_type: new FormControl(null, [Validators.required]),
      // discount_percent: new FormControl(null, [Validators.required]),
      category_id: new FormControl(null),
      sub_category_id: new FormControl(null),
      entity_id: new FormControl(this.entity_id),
      customer_name: new FormControl(null),
      sub_category_name: new FormControl(null),
      customer_name_view: new FormControl(null),
      itemList: this.fb.array([this.createItemsField()])
    });
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.action_type = params.action_type;
      if (this.id) {
        this.getById(this.id);
      }
      this.financial_year_id = localStorage.getItem('financial_id');
      this.entity_id = localStorage.getItem('selectedEntityId');
    });
    this.getAllCategory();
    this.customerType();
  }
  get itemList(): FormArray {
    return this.createForm.get('itemList') as FormArray;
  }

  customerType() {
    this._configurationalMasterService.getAllActiveCustomer().subscribe((res: any) => {
      console.log(res, "ressss");
      this.customerTypes = res.data;
    })
  }

  customerChange(e: any) {
    console.log(e, "eeeeeeee>>>>>");
    this._configurationalMasterService.customerlistBycustomertype(e.value || e).subscribe((res: any) => {
      this.customersName = res.data;
      
      this.customerList = this.customersName.map((res: any) => res.company_name);
      this.customerList2 = this.customersName;
      res.data?.forEach((val: any) => {
        if (val?.id === this.response?.customer_id) {
          this.createForm.patchValue({
            customer_name: val?.id,
            customer_name_view: val?.company_name
          })
        }
      })

    })
  }
  createItemsField(): FormGroup {
    return this.fb.group({
      product_master_id: [''],
      product_name: [''],
      minimumValue: [null],
      maximumValue: [null],
      dbp_price: [null],

      discount_one: [null],
      discount1Flat: [null],
      discount1Type: ['percentage'],  // 👈 default percentage

      discount_two: [null],
      discount2Flat: [null],
      discount2Type: ['percentage'],

      discount_three: [null],
      discount3Flat: [null],
      discount3Type: ['percentage'],

      final_price: [null],
    });
  }


  addItem() {
    for (let control of this.itemList.controls) {
      if (control.invalid) {
        control.markAllAsTouched();
        this.toaster.warning('Please fill all required fields before adding a new item.')
        return;
      }
    }
    this.itemList.push(this.createItemsField());
  }

  removeItem(index: number) {
    this.itemList.removeAt(index);
  }


  getById = (id: any) => {
    this._commonService?.showLoader();
    this._configurationalMasterService
      .getPriceMasterById(id)
      .subscribe(
        (res: any) => {
          this.response = res.data;
          this.getSubCategory(this.response?.category_id)
          this.customerChange(this.response?.customer_type_id)
          this.createForm.patchValue({

            customer_type_view: this.response.customer_type_name,
            customer_name: this.response?.company_name,
            category_id: this.response?.category_id,
            customer_type: this.response?.customer_type_id,
            sub_category_id: this.response?.sub_category_id
          });
          let data = {
            cat_id: this.response?.category_id,
            sub_id: this.response?.subcategory_id,

          }


          const itemListFormArray = this.createForm.get('itemList') as FormArray;
          itemListFormArray.clear();

          if (this.response.disList && this.response.disList.length) {
            this.response.disList.forEach((item: any, i: number) => {


              let discount1Type = 'percentage';
              if (item?.discount1Flat > 0) {
                discount1Type = 'flat';
              } else if (item?.discount_1 > 0) {
                discount1Type = 'percentage';
              }

              let discount2Type = 'percentage';
              if (item?.discount2Flat > 0) {
                discount2Type = 'flat';
              } else if (item?.discount_2 > 0) {
                discount2Type = 'percentage';
              }

              let discount3Type = 'percentage';
              if (item?.discount3Flat > 0) {
                discount3Type = 'flat';
              } else if (item?.discount_3 > 0) {
                discount3Type = 'percentage';
              }

              itemListFormArray.push(
                this.fb.group({
                  item: [item.item || ''],

                  product_master_id: [item?.item_id],
                  product_name: [item?.item_name],
                  minimumValue: [Number(item?.MVP)],
                  maximumValue: [Number(item?.MRP)],
                  dbp_price: [item?.final_price || 0],


                  discount1Type: [discount1Type],
                  discount_one: [
                    { value: item?.discount_1 || null, disabled: discount1Type !== 'percentage' }
                  ],
                  discount1Flat: [
                    { value: item?.discount1Flat || null, disabled: discount1Type !== 'flat' }
                  ],


                  discount2Type: [discount2Type],
                  discount_two: [
                    { value: item?.discount_2 || null, disabled: discount2Type !== 'percentage' }
                  ],
                  discount2Flat: [
                    { value: item?.discount2Flat || null, disabled: discount2Type !== 'flat' }
                  ],


                  discount3Type: [discount3Type],
                  discount_three: [
                    { value: item?.discount_3 || null, disabled: discount3Type !== 'percentage' }
                  ],
                  discount3Flat: [
                    { value: item?.discount3Flat || null, disabled: discount3Type !== 'flat' }
                  ],

                  final_price: [item?.final_price || 0]
                })
              );
            });
          }


          // this.getAllActiveProduct(data)

          this._commonService?.hideLoader();
          this.toaster.success(res.message);
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        }
      );
  }

  //   getAllActiveProduct(e:any) {
  //     
  //     this.$productionService.getItemsBySubCategory(e?.value?.id, e?.value?.item_category_id).subscribe((res: any) => {
  //       const products = res.data || [];
  //         this.productData= products;
  //         this.productData.forEach((item: any) => {
  //           this.itemList.push(this.fb.group({
  //             product_master_id: [item.id],
  //             discount_flat_type: [''],
  //             discount_percent: ['']
  //           }));
  //         });
  //         if (this.itemList.length > 0) {
  //           this.itemList.removeAt(0);
  //         }

  //     });

  // }

  getAllActiveProduct(e: any) {
    const inputValue = this.createForm.get('category_id')?.value;
    this.$productionService.getItemsBySubCategory(
      e?.value || e?.sub_id,
      inputValue || e?.cat_id
    ).subscribe((res: any) => {
      const products = res.data || [];

      while (this.itemList.length > 0) {
        this.itemList.removeAt(0);
      }
      this.productData = products;

      this.productData.forEach((item: any) => {
        const discount1Type: any = 'percentage';
        const discount2Type: any = 'percentage';
        const discount3Type: any = 'percentage';

        this.itemList.push(this.fb.group({
          product_master_id: [item.id],
          product_name: [item?.item_name],
          minimumValue: [Number(item?.MVP)],
          maximumValue: [Number(item?.MRP)],
          dbp_price: [null],
          discount1Type: [discount1Type],
          discount_one: [{ value: null, disabled: discount1Type !== 'percentage' }],
          discount1Flat: [{ value: null, disabled: discount1Type !== 'flat' }],
          discount2Type: [discount2Type],
          discount_two: [{ value: null, disabled: discount2Type !== 'percentage' }],
          discount2Flat: [{ value: null, disabled: discount2Type !== 'flat' }],
          discount3Type: [discount3Type],
          discount_three: [{ value: null, disabled: discount3Type !== 'percentage' }],
          discount3Flat: [{ value: null, disabled: discount3Type !== 'flat' }],
          final_price: [null]
        }));
      });
    });
  }

  onBack = () => {
    this.route.navigate(['master/configurational-master/price-master']);
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  }

  onKeyChange(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete'
    ];


    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  keyUpPrice(value: any, index: any, i: any, val: any) {
    const control = this.createForm.get('itemList') as FormArray;
    let list = control.value;

    let basePrice = Number(list[index]?.dbp_price);
    let finalPrice = basePrice;


    let maximumValue: any = list[index]?.maximumValue;
    if (basePrice > maximumValue) {
      this.toaster.warning("Your Price Limit", `Maximum price is ${maximumValue}`);

      list[index].dbp_price = maximumValue;
      finalPrice = maximumValue;
      this.createForm.patchValue({ itemList: list });
      return;
    }


    let minimumValue = list[index]?.minimumValue;
    if (basePrice < minimumValue) {
      list[index].discount_one = 0;
      list[index].discount_two = 0;
      list[index].discount_three = 0;
      list[index].discount1Flat = 0;
      list[index].discount2Flat = 0;
      list[index].discount3Flat = 0;

      const itemListControl = this.createForm.get('itemList') as FormArray;
      const itemControl = itemListControl.at(index);

      itemControl.get('discount_one')?.disable();
      itemControl.get('discount_two')?.disable();
      itemControl.get('discount_three')?.disable();
      itemControl.get('discount1Flat')?.disable();
      itemControl.get('discount2Flat')?.disable();
      itemControl.get('discount3Flat')?.disable();

      this.toaster.warning("Your Price is Below Minimum", `Minimum price is ${minimumValue}. Discounts are disabled.`);
    } else {
      const itemListControl = this.createForm.get('itemList') as FormArray;
      const itemControl = itemListControl.at(index);

      itemControl.get('discount_one')?.enable();
      itemControl.get('discount_two')?.enable();
      itemControl.get('discount_three')?.enable();
      itemControl.get('discount1Flat')?.enable();
      itemControl.get('discount2Flat')?.enable();
      itemControl.get('discount3Flat')?.enable();
    }


    if (
      val === 'discount1' || val === 'discount2' || val === 'discount3' ||
      val === 'discount1Flat' || val === 'discount2Flat' || val === 'discount3Flat'
    ) {

      if (list[index]?.discount1Type === 'percentage' && list[index]?.discount_one) {
        finalPrice -= (finalPrice * list[index].discount_one / 100);
      } else if (list[index]?.discount1Type === 'flat' && list[index]?.discount1Flat) {
        finalPrice -= list[index].discount1Flat;
      }


      if (list[index]?.discount2Type === 'percentage' && list[index]?.discount_two) {
        finalPrice -= (finalPrice * list[index].discount_two / 100);
      } else if (list[index]?.discount2Type === 'flat' && list[index]?.discount2Flat) {
        finalPrice -= list[index].discount2Flat;
      }


      if (list[index]?.discount3Type === 'percentage' && list[index]?.discount_three) {
        finalPrice -= (finalPrice * list[index].discount_three / 100);
      } else if (list[index]?.discount3Type === 'flat' && list[index]?.discount3Flat) {
        finalPrice -= list[index].discount3Flat;
      }
    }


    if (val !== "dbp") {
      if (minimumValue > finalPrice || maximumValue < finalPrice) {
        this.toaster.warning("Your Price Limit", `${minimumValue} To ${maximumValue}`);

        if (val === 'discount1' || val === 'discount1Flat') {
          list[index].discount_one = 0;
          list[index].discount1Flat = 0;
        } else if (val === 'discount2' || val === 'discount2Flat') {
          list[index].discount_two = 0;
          list[index].discount2Flat = 0;
        } else if (val === 'discount3' || val === 'discount3Flat') {
          list[index].discount_three = 0;
          list[index].discount3Flat = 0;
        }

        list[index].final_price = basePrice;
        this.createForm.patchValue({ itemList: list });
        return;
      }
    }


    list[index].final_price = finalPrice;

    this.createForm.patchValue({ itemList: list });

    console.log(list, "list");
  }


  toggleDiscountType(i: number, discountKey: 'discount1' | 'discount2' | 'discount3', selected: 'percentage' | 'flat') {
    const group = this.itemList.at(i);

    if (discountKey === 'discount1') {
      group.get('discount1Type')?.setValue(selected);

      if (selected === 'percentage') {
        group.get('discount_one')?.enable();
        group.get('discount1Flat')?.disable();
        group.get('discount1Flat')?.reset();
      } else {
        group.get('discount_one')?.disable();
        group.get('discount_one')?.reset();
        group.get('discount1Flat')?.enable();
      }
    }

    if (discountKey === 'discount2') {
      group.get('discount2Type')?.setValue(selected);

      if (selected === 'percentage') {
        group.get('discount_two')?.enable();
        group.get('discount2Flat')?.disable();
        group.get('discount2Flat')?.reset();
      } else {
        group.get('discount_two')?.disable();
        group.get('discount_two')?.reset();
        group.get('discount2Flat')?.enable();
      }
    }

    if (discountKey === 'discount3') {
      group.get('discount3Type')?.setValue(selected);

      if (selected === 'percentage') {
        group.get('discount_three')?.enable();
        group.get('discount3Flat')?.disable();
        group.get('discount3Flat')?.reset();
      } else {
        group.get('discount_three')?.disable();
        group.get('discount_three')?.reset();
        group.get('discount3Flat')?.enable();
      }
    }
  }





  onSubmit() {


    if (this.createForm.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }

    this.createForm.value.entity_id = this.entity_id;

    let val = this.createForm.value;
    console.log(val, "val<<<<<<<<<<<");

    const modifyArray: any = []
    val?.itemList?.map((item: any) => {
      modifyArray.push({
        discount_1: item?.discount_one,
        discount_2: item?.discount_two,
        discount_3: item?.discount_three,
        final_price: item?.dbp_price,
        item_id: item?.product_master_id,
        maximumValue: item?.maximumValue,
        minimumValue: item?.minimumValue,
        discount1Flat: item?.discount1Flat,
        discount2Flat: item?.discount2Flat,
        discount3Flat: item?.discount3Flat,

      })
    })
    let data = {
      customer_type_id: val?.customer_type,
      customer_id: val?.customer_name,
      category_id: val?.category_id,
      subcategory_id: val?.sub_category_id,
      entity_id: val?.entity_id,
      financial_year_id: this.financial_year_id,
      itemList: modifyArray
    }
    if (this.id) {
      this._commonService?.showLoader();
      this._configurationalMasterService
        .updatePriceMaster(data, this.id)
        .subscribe(
          (res: any) => {
            this._commonService?.hideLoader();
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/price-master']);
          },
          (err) => {
            this._commonService?.hideLoader();
            this.toaster.error(err.error.message);
          }
        );
    } else {

      this._commonService?.showLoader();
      this._configurationalMasterService.createPriceMaster(data).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/price-master']);
          }
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        }
      );
    }
  }

  getSubCategory(categoryId: any) {

    const categoryValue = categoryId?.value ?? categoryId;
    this._configurationalMasterService.getSubCategory(categoryValue).subscribe(
      (res: any) => {
        if (res.code === 201) {
          this.subCategoryList.length = 0;
          this.toaster.error(res.message);
          return;
        }
        this.subCategoryList = res.data;

        res.data?.forEach((val: any) => {
          if (val?.id === this.response?.subcategory_id)
            this.createForm.patchValue({
              sub_category_name: val?.sub_category_name,
              sub_category_id: val?.id

            })
        })


      },
      error => {
        this.toaster.error(error.message);
      }
    );
  }

  getAllCategory() {
    this._configurationalMasterService.getActiveAssetMasterList()
      .subscribe((res: any) => {
        this.categoryList = res.data;

      });
  }
  customerList: any = [];
  customerList2: any = [];
  customersFilter(event: any) {
    const aa = event
    let filteredVariable = this.customerList2.filter((item: any) => aa.includes(item.company_name));
    this.customersName = filteredVariable

  }
}
