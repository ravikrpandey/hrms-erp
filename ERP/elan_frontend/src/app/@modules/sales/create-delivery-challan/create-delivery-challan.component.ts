import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { SalesService } from '../service/sales.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-create-delivery-challan',
  templateUrl: './create-delivery-challan.component.html',
  styleUrls: ['./create-delivery-challan.component.scss'],
})
export class CreateDeliveryChallanComponent {
  countryList: any = [];
  stateList: any = [];
  cityList: any = [];
  categoryList: any[] = [];
  productList: any[] = [];
  filterproduct: any[] = [];
  varientList: any[] = [];
  filterVariant: any[] = [];
  categoryList2: any[] = [];
  filterCategory2: any[] = [];
  productList2: any[] = [];
  filterproduct2: any[] = [];
  varientList2: any[] = [];
  filterVariant2: any[] = [];
  transTypeList: any = [];
  isReturnableChecked: boolean = false;
  isShippingAddress: boolean = false;
  isGst: boolean = false;
  frmDeliveryChallan: FormGroup;
  entityId: string | null;
  financial_year_id: string | null;
  customerDetails: any;
  billingCountryList: any = [];
  customerBillingCountryList: any = [];
  shippingCountryList: any = [];
  filteredshippingCountry: any = [];
  filteredBillCountry: any = [];
  customerFilteredBillCountry: any = [];
  billingSteteData: any = [];
  filteredbillingSteteData: any = [];
  customerBillingSteteData: any = [];
  customerFilteredbillingSteteData: any = [];
  billingCityList: any = [];
  filterBillingCityList: any = [];
  customerBillingCityList: any = [];
  customerFilterBillingCityList: any = [];
  shippingSteteData: any = [];
  filteredShippingSteteData: any = [];
  shippingCityList: any = [];
  filterShippingCityList: any = [];

  proposal_id: any;
  customerId: any;
  billing_address_id: any;
  filterbranchControl = new FormControl();
  filtercityControl = new FormControl();
  customerFiltercityControl = new FormControl();
  filterCountryControl = new FormControl();
  customerFilterCountryControl = new FormControl();
  filterStateControl = new FormControl();
  customerFilterStateControl = new FormControl();
  filterCountryControl2 = new FormControl();
  filterStateControl2 = new FormControl();
  filtercityControl2 = new FormControl();
  branchList: any = [];
  filteredbranchList: any;
  filterCategory: any[] = [];
  isSameState: boolean = false;
  CDKData: any;
  status_type: any = '';
  doId: number;
  isView: boolean = false;
  invoiceNo: string = '';
  invoiceDate: string = '';
  selectedBranchStateId: any;
  selected_gstnumber: any;
  selected_supplier_name: any;
  constructor(
    private _active: ActivatedRoute,
    private router: Router,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService,
    private _fb: FormBuilder,
    private $crm: CrmService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private salesService: SalesService,
    private $productionService: ProductionService,
    private toster: ToastrService,
    private toast: ToastrService
  ) { }
  invoice_id: any;
  ngOnInit(): void {
    this.frmDeliveryChallan = this._fb.group({
      do_type: [null, Validators.required],
      supply_type: [null, Validators.required],
      do_date: [null, Validators.required],
      do_no: [null, Validators.required],
      customer_name: [null, Validators.required],
      customer_code: [null, Validators.required],
      transition_type: [null, Validators.required],
      billing_branch: [null, Validators.required],
      billing_country: [null, Validators.required],
      billing_state: [null, Validators.required],
      billing_city: [null, Validators.required],
      billing_pin: [null, Validators.required],
      billing_add1: [null, Validators.required],
      billing_add2: [null, Validators.required],
      customer_billing_country: [null],
      customer_billing_state: [null],
      customer_billing_city: [null],
      customer_billing_pin: [null],
      customer_billing_add1: [null],
      customer_billing_add2: [null],
      supplier_gst: [null],
      gst_supplier_name: [null],
      trade_name: [null],
      shipping_country: [null],
      shipping_state: [null],
      shipping_city: [null],
      shipping_pin: [null],
      shipping_add1: [null],
      shipping_add2: [null],
      customer_gst_number: [null, Validators.required],
      // remark: [null, Validators.required],
      notes: [null],
      terms_and_conditions: [null],
      items: this._fb.array([this.createItems()]),
      chargesDetailList: new FormArray([]),
      returnableItems: this._fb.array([this.createReturnableItems()]),
    });

    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.generateDeliveryOrderNumber(this.financial_year_id);
    this.getAllActiveTransType();
    this.branchSetup_get();
    this.getAllCategory(0);
    this.getAllCountry();
    this.getAllCategory2(0);
    this.getAllSupplyType();
    this.getAllDocumentType();
    this.searchFilter();
    this._active.queryParams.subscribe((res: any) => {
      this.proposal_id = res?.sales_id;
      this.invoice_id = res?.invoice_id;
      this.status_type = res?.status_type;
      this.doId = res?.id;
      if (this.status_type === 'viewChallan') {
        this.isView = true;
        // this.invoiceNo = res?.invoiceNo;
        // this.invoiceDate = res?.invoice_date
      }

      if (this.doId && this.status_type) {
        this.getDoData(this.doId);
        this.getCDKData(this.entityId);
      }

      // "generate_irn"
      this.getAllCategory(0);
      if (res?.sales_id) {
        this.getsalesOrderListByid(res?.sales_id);
      }
    });
    const customer_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
    this.frmDeliveryChallan.patchValue({
      customer_code: customer_code,
    });
    this.getHsnCode() ;
  }
  searchFilter() {
    this.filterbranchControl.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      this.branchList = this.filteredbranchList.filter((brnch: any) =>
        brnch.branch_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filtercityControl.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      this.billingCityList = this.filterBillingCityList.filter((city: any) =>
        city.city_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterCountryControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.billingCountryList = this.filteredBillCountry.filter((country: any) =>
        country.countryss_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterStateControl.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      this.billingSteteData = this.filteredbillingSteteData.filter((state: any) =>
        state.states_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    // shipping section searching
    this.filterCountryControl2.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.shippingCountryList = this.filteredshippingCountry.filter((country: any) =>
        country.countryss_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterStateControl2.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      this.shippingSteteData = this.filteredShippingSteteData.filter(
        (state: any) =>
          state.states_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filtercityControl2.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.shippingCityList = this.filterShippingCityList.filter((city: any) =>
        city.city_name.toLowerCase().includes(value.toLowerCase())
      );
    });
    // customer section searching
    this.customerFilterCountryControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.customerBillingCountryList = this.customerFilteredBillCountry.filter((country: any) =>
        country.countryss_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.customerFilterStateControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.customerBillingSteteData = this.customerFilteredbillingSteteData.filter((state: any) =>
        state.states_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.customerFiltercityControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.customerBillingCityList = this.customerFilterBillingCityList.filter((city: any) =>
        city.city_name.toLowerCase().includes(value.toLowerCase())
      );
    });


  }

  filterCategories(event: any, index: number) {
    this.categoryList[index] = this.filterCategory[index].filter(
      (category: any) =>
        category.category_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );
  }

  filterProduct(event: any, index: number) {
    this.productList[index] = this.filterproduct[index].filter((product: any) =>
      product.product_name
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
  }

  filterProductVariant(event: any, index: number) {
    this.varientList[index] = this.filterVariant[index].filter((variant: any) =>
      variant.variant_name
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
  }

  filterCategories2(event: any, index: number) {
    this.categoryList2[index] = this.filterCategory2[index].filter(
      (category: any) =>
        category.category_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );
  }

  filterProduct2(event: any, index: number) {
    this.productList2[index] = this.filterproduct2[index].filter(
      (product: any) =>
        product.product_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );
  }

  filterProductVariant2(event: any, index: number) {
    this.varientList2[index] = this.filterVariant2[index].filter(
      (variant: any) =>
        variant.variant_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );
  }

  getAllProductDetails: any = [];
  getsalesOrderListByid(id: any) {

    this.salesService.salesOderByid(id).subscribe((res: any) => {
      this.customerId = res.data.customer_id
      this.billing_address_id = res.data.billing_address_id

      if (this.customerId) {
        this.getCustomerDetailsById();
      }
      let obj = res.data;
      this.getAllProductDetails = obj?.productDetailList;

      if (res) {
        // setTimeout(() => {
        //   this.setAllData(obj);
        // }, 100);
        
        this.frmDeliveryChallan.patchValue({
          customer_name: res?.data?.contact_person_name,
       
          do_no:res?.data?.sales_order_no,
          customer_code:res?.data?.customer_code,
          supply_type:res?.data?.supply_type
          
          // proposal_no: res.data.proposal_no,
          // company_name: res.data.company_name,
        });
        this.patchItems(obj);
        this.patchAddCharge(obj?.charges);
      }
    });
  }

  irnProductList: any = [];

  async getDoData(doId: any) {
    await this.$crm.getDoData(doId, '').subscribe({
      next: async (res) => {

        console.log(res);
        let data = { productDetailList: res.data?.productData };
        let doData = res.data?.challanData;
        this.irnProductList = [...res.data?.productData];
        await this.patchDoData(doData);
        await this.patchItems(data);
      },
      error(err) {
        console.log(err);
      },
    });
  }
  async getCDKData(doId: any) {
    await this.$crm.getCDKData(doId).subscribe({
      next: async (res) => {
        console.log(res);
        this.CDKData = res.data;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  async patchDoData(doData: any) {
    
    await this.frmDeliveryChallan.patchValue({
      do_type: doData.do_type_id,
      supply_type: doData.supply_type_id,
      do_date: doData.do_date,
      do_no: doData.do_no,
      customer_name: doData.customer_name,
      customer_code: doData.customer_code,
      transition_type: doData.trans_type_id,
      billing_branch: doData.billing_branch_id,
      billing_country: doData.billing_country_id,
      billing_state: doData.billing_state_id,
      billing_city: doData.billing_city_id,
      billing_pin: doData.billing_pin,
      billing_add1: doData.billing_add1,
      billing_add2: doData.billing_add2,
      customer_billing_country: doData.customer_billing_country_id,
      customer_billing_state: doData.customer_billing_state_id,
      customer_billing_city: doData.customer_billing_city_id,
      customer_billing_pin: doData.customer_billing_pin,
      customer_billing_add1: doData.customer_billing_add1,
      customer_billing_add2: doData.customer_billing_add2,
      supplier_gst: doData.supplier_gst,
      gst_supplier_name: doData.gst_supplier_name,
      trade_name: doData.trade_name,
      shipping_country: doData.shipping_country_id,
      shipping_state: doData.shipping_state_id,
      shipping_city: doData.shipping_city_id,
      shipping_pin: doData.shipping_pin,
      shipping_add1: doData.shipping_add1,
      shipping_add2: doData.shipping_add2,
      // remark: doData.remark,
      notes: doData.notes,
      terms_and_conditions: doData.terms_and_conditions,
      customer_gst_number: doData.gst_in
    });
    let trans = await this.transTypeList.find(
      (x: any) => x.id === doData.trans_type_id
    );
    await this.selectTransType(trans);
    await this.checkApplicableGst(doData.billing_branch_id);
    await this.billingCountryChange(doData.billing_country_id);
    await this.billingStateChange(doData.billing_state_id);

    await this.customerBillingCountryChange(doData.customer_billing_country_id);
    await this.customerBillingStateChange(doData.customer_billing_state_id);

    await this.shippingCountryChange(doData.shipping_country_id);
    await this.shippingStateChange(doData.shipping_state_id);
  }

  getCustomerDetailsById() {
    try {
      this.$crm.getCustomerDetailsById(this.billing_address_id).subscribe(
        async (response: any) => {
          if (response) {
            
            let customerData = response.data[0];
            this.customerDetails = customerData;
            await this.customerBillingCountryChange(customerData?.billing_country_id);
            await this.customerBillingStateChange(customerData?.billing_state_id);
            await this.shippingCountryChange(customerData?.shipping_country_id);
            await this.shippingStateChange(customerData?.shipping_state_id);

            this.frmDeliveryChallan.patchValue({
              customer_billing_country: customerData?.billing_country_id,
              customer_billing_state: customerData?.billing_state_id,
              customer_billing_city: customerData?.billing_city_id,
              customer_billing_pin: customerData?.billing_pin_code,
              customer_billing_add1: customerData?.billing_address,
              customer_billing_add2: customerData?.billing_address,
              shipping_country: customerData?.shipping_country_id,
              shipping_state: customerData?.shipping_state_id,
              shipping_city: customerData?.shipping_city_id,
              shipping_pin: customerData?.shipping_pin_code,
              shipping_add1: customerData?.shipping_address,
              shipping_add2: customerData?.shipping_address,
              customer_gst_number: customerData?.gst_in,
            });

          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  createItems(): FormGroup {
    return this._fb.group({
      product_category_id: [],
      product_sub_category_id: [],
      product_master_id: [],
      
      product_description: [],
      hsn_code: [],
      proposed_quantity: [],
      delivered_qty: [],
      remaining_quantity: [],
      quantity: [null, Validators.required],
      price_per_unit: [null, Validators.required],
      uom_name: [],
      maximum_discount: [],
      discount_request: [],
      igst: [],
      sgst: [],
      cgst: [],
    });
  }

  get productItems(): FormArray {
    return this.frmDeliveryChallan.get('items') as FormArray;
  }

  addItem() {
    this.productItems.push(this.createItems());
  }

  removeItem(index: number) {
    this.productItems.removeAt(index);
  }
  public returnableCheckbox(event: MatCheckboxChange) {
    this.isReturnableChecked = event.source.checked;
  }
  uploadedFile: any;
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(
        event,
        false,
        true,
        false
      );
      if (!isValidExtension) {
        return;
      }

      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }

      this.$miscellaneousService.documents(formData).subscribe(
        (response: any) => {
          if (response) {
            this.uploadedFile = `uploaded_files/${response?.url}`;
            this.toster.success('Document uploaded successfully');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  viewImg1() {
    window.open(environment.servralUrl + '/' + this.uploadedFile, '_blank');
  }

  chargesToggle: boolean = false;
  toggleChargesRow(event: any) {
    if (this.chargesToggle) {
      if (this.CF_2.chargesDetailList.length === 0) {
        this.addChargesRow();
      }
    } else {
      const chargesFormArray = <FormArray>this.CF_2.chargesDetailList;
      while (chargesFormArray.length !== 0) {
        chargesFormArray.removeAt(0);
      }
      // this.productCalculation();
    }
  }
  get CF_2(): any {
    return this.frmDeliveryChallan.controls;
  }
  addChargesRow() {
    if (!this.chargesToggle) return; // Prevent adding if toggle is off
    (<FormArray>this.CF_2.chargesDetailList).push(
      new FormGroup({
        charges_name: new FormControl(null, Validators.required),
        charges_amount: new FormControl(null, Validators.required),
        charges_hsn_id: new FormControl(null, Validators.required),
        charges_rate: new FormControl(null),
        charges_desc: new FormControl(null),
      })
    );
  }

  deleteChargesRow(i: any, control: any) {
    if (this.CF_2.chargesDetailList.length >= 1) {
      this.CF_2.chargesDetailList.removeAt(i);

    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
  }
  hsnCodeList2: any;
  hsnCodeList: any = [];
  hsn: any;
  getHsnCode() {
    this._configurationalMasterService
      .getHsnCode(this.entityId)
      .subscribe((res: any) => {
        this.hsnCodeList = res.data;
        this.hsnCodeList2 = this.hsnCodeList;
        this.hsn = this.hsnCodeList2.map((res: any) => res.hsn_sac_code);
      });
  }
  hsnSearch(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList2.filter((item: any) =>
      aa.includes(item.hsn_sac_code)
    );
    this.hsnCodeList = filteredVariable;
  }

  onHSNCodeChange(value: any, index: number): void {
    let chargesDetailList = this.frmDeliveryChallan.get(
      'chargesDetailList'
    ) as FormArray;
    const selectedHSN = this.hsnCodeList.find(
      (hsn: { id: any }) => hsn.id == value
    );
    chargesDetailList.at(index).patchValue({
      charges_rate: selectedHSN.value,
      charges_desc: selectedHSN.description,
    });
  }
  keyPress2(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    const currentValue = (event.target as HTMLInputElement).value;

    const isNumber = /[0-9]/.test(inputChar);
    const isDot = inputChar === '.';

    if (event.keyCode !== 8 && !isNumber) {
      if (isDot) {
        if (currentValue.includes('.')) {
          event.preventDefault();
        }
      } else {
        event.preventDefault();
      }
    }

    if (event.key === ' ' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }
  async patchAddCharge(charge: any) {
    if (charge.length > 0) this.chargesToggle = true;
    this.CF_2.chargesDetailList.clear;

    
    charge.forEach((elem: any, i: number) => {
      this.addChargesRow();
      this.CF_2.chargesDetailList.at(i).patchValue({
        charges_name: elem.charge_name,
        charges_amount: elem.amount,
        charges_hsn_id: elem.hsn_code_id,
        charges_rate: elem.tax_rate,
        charges_desc: elem.description
      })
    })
  }
  async patchItems(items: any) {

    this.productItems.clear();

    for (let i = 0; i < items?.productDetailList.length; i++) {
      const ele = items.productDetailList[i];
      this.addItem();

      // Patch the values to the newly added FormGroup
      const lastItem = this.productItems.at(
        this.productItems.length - 1
      ) as FormGroup;
      
      lastItem.patchValue({
        product_category_id: ele.product_category_id,
        product_sub_category_id: ele.product_sub_category_id || null,
        product_master_id: ele.product_master_id,
      
        product_description: ele.product_description,
        hsn_code: ele.hsn_code,
        proposed_quantity: ele.proposed_quantity,
        delivered_qty: ele.delivered_qty,
        remaining_quantity: ele.remaining_quantity,
        quantity: ele.quantity,
        uom_name: ele.uom_name,
        maximum_discount: ele.maximum_discount,
        discount_request: ele.discount_request,
        igst: ele.igst,
        sgst: ele.sgst,
        cgst: ele.cgst,
        price_per_unit: ele.price_per_unit,
      });

      await this.getAllCategory(i); // Ensure this completes first
      await this.getProductList(ele.product_sub_category_id, ele.product_category_id, i); // Then, call this
      await this.getSubCategory(ele.product_category_id, i);
      // Now, execute the asynchronous methods sequentially
      // await this.getAllProductVariant(ele.product_master_id, i); // Finally, this
    }
  }

  getProductList(event: any, e: any, index: any) {

    let id = event.value ? event.value : event;

    new Promise<void>((resolve, reject) => {
      this.$productionService.getItemsBySubCategory(event.id ?? event, e.item_category_id ?? e).subscribe((res: any) => {
        if(res.code===201){
          this.toast.error(res.message);
        }
        this.productList[index] = res.data;
        this.filterproduct[index] = res.data;

        // After getting the active product, we patch the product name (or other necessary values)
        // this.patchProductName(index);
        resolve();
      },
        (err: any) => {
          reject(err);
        }
      );
    });
  }

  subCategory: any[] = [];
  getSubCategory(event: any, index: any) {
    new Promise<void>((resolve, reject) => {
      this._configurationalMasterService.getSubCategory(event.value ?? event).subscribe((res: any) => {
        if(res.code===201){
          this.toast.error(res.message);
        }
        this.subCategory[index] = res.data
      },
        (err: any) => {
          reject(err);
        }
      );
    });

  }
  getAllCategory(i: any) {
    new Promise<void>((resolve, reject) => {
      this._configurationalMasterService.getActiveAssetMasterList().subscribe(
        (res: any) => {
          this.categoryList[i] = res.data;
          this.filterCategory[i] = res.data;
          resolve();
        },
        (err: any) => {
          reject(err);
        }
      );
    });
  }
  setItemDescription(item: any, index: number) {

    this.productItems.at(index).patchValue({
      product_description: item.product_description,
      hsn_code: item.hsn_sac_code,
      uom_name: item?.MASTER_UOM.uom_name_name,
      cgst: item?.MASTER_UOM.cgst,
      igst: item?.MASTER_UOM.igst,
      sgst: item?.MASTER_UOM.sgst
    });
  }

  getAllProductVariant(data: any, index: any) {
    let data2 = this.productList[index]?.find((x: any) => x.id === data.value);

    new Promise<void>((resolve, reject) => {
      this._configurationalMasterService
        .getProductVariantByproduct_id(data?.value ?? data)
        .subscribe(
          (res: any) => {
            if (res) {
              this.varientList[index] = res.data;
              this.filterVariant[index] = res.data;
              // After getting the product variant data, we patch values like product_description, hsn_code, etc.
              if (data2) {
                this.productItems.at(index).patchValue({
                  product_description: data2.product_product_description,
                  hsn_code: data2.hsn_sac_code,
                  uom_name: data2.uom_name_name,
                });
              }
            }
            resolve();
          },
          (err: any) => {
            reject(err);
          }
        );
    });
  }

  // patchProductName(index: number) {
  //   const product = this.productList[index];
  //   if (product && this.productItems.at(index)) {
  //     // Patch product name (or any other field you want to display)
  //     const lastItem = this.productItems.at(index) as FormGroup;
  //     lastItem.patchValue({
  //       product_name: product.product_name, // Or whichever field you want to display
  //     });
  //   }
  // }

  createReturnableItems(): FormGroup {
    return this._fb.group({
      product_category_id: [],
      product_master_id: [],
      
      product_description: [''],
      hsn_code: [''],
      proposed_quantity: [],
      uom_name: [''],
    });
  }

  get productReturnableItems(): FormArray {
    return this.frmDeliveryChallan.get('returnableItems') as FormArray;
  }

  addReturnableItem() {
    if (this.frmDeliveryChallan.get('returnableItems')?.invalid) {
      return this.toast.warning('Cannot add a new row, fields are empty! !');
    }
    this.getAllCategory2(this.productReturnableItems.length);
    this.productReturnableItems.push(this.createReturnableItems());
  }

  removeReturnableItem(index: number) {
    this.productReturnableItems.removeAt(index);
  }
  isReturnableFormArrayEmpty(): boolean {
    for (const row of this.productReturnableItems.controls) {
      if (row.invalid) {
        return true;
      }
    }
    return false;
  }
  supplyTypeList: any = [];
  docTypeList: any = [];
  getAllActiveTransType() {
    try {
      this.$crm.getAllActiveTransType().subscribe(
        (response: any) => {
          if (response) {
            this.transTypeList = response.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  getAllSupplyType() {
    try {
      this.$crm.getSupplyType().subscribe(
        (response: any) => {
          if (response) {
            this.supplyTypeList = response.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  getAllDocumentType() {
    try {
      this.$crm.getDocumentType().subscribe(
        (response: any) => {
          if (response) {
            this.docTypeList = response.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  branchSetup_get() {
    try {
      this.$crm.branchSetup_get().subscribe(
        (response: any) => {
          if (response) {
            this.branchList = response.data;
            this.filteredbranchList = response.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async checkApplicableGst(event: any) {

    const branchId = this.frmDeliveryChallan.get('billing_branch')?.value;
    const transition_type =
      this.frmDeliveryChallan.get('transition_type')?.value;
    let selectedBranchDetails = this.branchList.find(
      (branch: any) => branch.id == branchId
    );
    this.selected_gstnumber = selectedBranchDetails.branch_gstnumber;
    this.selected_supplier_name = selectedBranchDetails.branch_name;

    this.frmDeliveryChallan.patchValue({
      billing_country: selectedBranchDetails.MASTER_COUNTRY.countryss_id,
      billing_state: selectedBranchDetails.MASTER_STATE.states_id,
      billing_city: selectedBranchDetails.MASTER_CITY.city_id,
      billing_pin: selectedBranchDetails.branch_pin_code,
      billing_add1: selectedBranchDetails.branch_address,
      billing_add2: selectedBranchDetails.branch_address,
    });
    if (transition_type === 3 || transition_type === 4) {
      this.frmDeliveryChallan.patchValue({
        supplier_gst: this.selected_gstnumber,
        gst_supplier_name: this.selected_supplier_name,
      });
    } else {
      this.selected_gstnumber = null;
      this.selected_supplier_name = null;
      this.frmDeliveryChallan.patchValue({
        supplier_gst: null,
        gst_supplier_name: null,
      });
    }
    this.selectedBranchStateId = selectedBranchDetails.MASTER_STATE.states_id;
    await this.billingCountryChange(
      selectedBranchDetails.MASTER_COUNTRY.countryss_id
    );
    await this.billingStateChange(this.selectedBranchStateId);
  }
  selectedStateCode: any;
  stateChange(e: any) {
    const selectedStateId = e;
    if (this.frmDeliveryChallan.get('customer_billing_state')?.value == selectedStateId) {
      this.isSameState = true;
    } else {
      this.isSameState = false;
    }
    const selectedState = this.billingSteteData.find(
      (state: any) => state.states_id === selectedStateId
    );
    if (selectedState) {
      this.selectedStateCode = selectedState.states_code;
    }
  }
  customerAddress: boolean = false;
  selectTransType(event: any) {
    this.removeValidation();
    let selectedVal = event.code;
    if (selectedVal === 'REG') {
      this.isGst = false;
      this.isShippingAddress = false;
      this.customerAddress = true;

      this.addValidationForBilling();
    }
    if (selectedVal === 'SHP') {
      this.isGst = false;
      this.isShippingAddress = true;
      this.customerAddress = true;
      this.addValidationForBilling();
      this.addValidationForShipping();
    }
    if (selectedVal === 'DIS') {
      this.isGst = true;
      this.customerAddress = false;
      this.isShippingAddress = true;
      this.addValidationForShipping();
      this.addValidationForGST();
    }
    if (selectedVal === 'CMB') {
      this.isGst = true;
      this.customerAddress = true;
      this.isShippingAddress = true;
      this.addValidationForGST();
      this.addValidationForShipping();
      this.addValidationForBilling();
    }
    this.applyChanges();
    if (selectedVal == 'DIS' || selectedVal == 'CMB') {
      this.frmDeliveryChallan.patchValue({
        supplier_gst: this.selected_gstnumber,
        gst_supplier_name: this.selected_supplier_name,
      });
    } else {
      this.selected_gstnumber = null;
      this.selected_supplier_name = null;
      this.frmDeliveryChallan.patchValue({
        supplier_gst: null,
        gst_supplier_name: null,
      });
    }
  }

  addValidationForBilling() {
    this.frmDeliveryChallan
      .get('customer_billing_country')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('customer_billing_state')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('customer_billing_city')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('customer_billing_pin')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('customer_billing_add1')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('customer_billing_add2')
      ?.setValidators(Validators.required);
  }

  addValidationForShipping() {
    this.frmDeliveryChallan
      .get('shipping_country')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('shipping_state')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('shipping_city')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('shipping_pin')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('shipping_add1')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('shipping_add2')
      ?.setValidators(Validators.required);
  }

  addValidationForGST() {
    this.frmDeliveryChallan
      .get('supplier_gst')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('gst_supplier_name')
      ?.setValidators(Validators.required);
    this.frmDeliveryChallan
      .get('trade_name')
      ?.setValidators(Validators.required);
  }

  removeValidation() {
    this.frmDeliveryChallan.get('customer_billing_country')?.clearValidators();
    this.frmDeliveryChallan.get('customer_billing_state')?.clearValidators();
    this.frmDeliveryChallan.get('customer_billing_city')?.clearValidators();
    this.frmDeliveryChallan.get('customer_billing_pin')?.clearValidators();
    this.frmDeliveryChallan.get('customer_billing_add1')?.clearValidators();
    this.frmDeliveryChallan.get('customer_billing_add2')?.clearValidators();
    this.frmDeliveryChallan.get('supplier_gst')?.clearValidators();
    this.frmDeliveryChallan.get('gst_supplier_name')?.clearValidators();
    this.frmDeliveryChallan.get('trade_name')?.clearValidators();
    this.frmDeliveryChallan.get('shipping_country')?.clearValidators();
    this.frmDeliveryChallan.get('shipping_state')?.clearValidators();
    this.frmDeliveryChallan.get('shipping_city')?.clearValidators();
    this.frmDeliveryChallan.get('shipping_pin')?.clearValidators();
    this.frmDeliveryChallan.get('shipping_add1')?.clearValidators();
    this.frmDeliveryChallan.get('shipping_add2')?.clearValidators();
  }

  applyChanges() {
    Object.keys(this.frmDeliveryChallan.controls).forEach((field) => {
      const control = this.frmDeliveryChallan.get(field);
      control?.updateValueAndValidity();
    });
  }

  generateDeliveryOrderNumber(id: any) {
    this.salesService.generateDeliveryOrderNumber(id).subscribe((res: any) => {
      this.frmDeliveryChallan.patchValue({
        do_no: res.data,
      });
    });
  }
  checkQuantity(e: any, i: any) {
    let qty = parseInt(this.productItems.at(i).value.quantity);
    let remaining_qty = this.productItems.at(i).value.remaining_quantity;
    if (qty > remaining_qty) {
      this.productItems.at(i).patchValue({ quantity: null });
      return this.toster.error('Can not input more than remaining quantity!');
    }
  }

  getAllActiveProduct2(event: any, index: any) {
    this.$productionService
      .getAllActiveProduct(event.value ?? event, this.entityId)
      .subscribe((res: any) => {
        this.productList2[index] = res.data;
        this.filterproduct2[index] = res.data;
      });
  }
  getAllCategory2(index: any) {
    this.$productionService
      .getAllCetegory(this.entityId)
      .subscribe((res: any) => {
        this.categoryList2[index] = res.data;
        this.filterCategory2[index] = res.data;
      });
  }
  selectedProduct: any;
  getAllProductVariant2(data: any, index: any) {
    this.selectedProduct = this.productList2[index].find(
      (x: any) => x.id === data.value
    );
    // uom_name_name  hsn_code_id  product_product_description

    this._configurationalMasterService
      .getProductVariantByproduct_id(data?.value ?? data)
      .subscribe(
        (res: any) => {
          if (res) {
            this.varientList2[index] = res.data;
            this.filterVariant2[index] = res.data;
          }
        },
        (err: any) => { }
      );
  }

  selectedVarient(event: any, i: any) { }
  selectedVarient2(event: any, i: any) {
    this.selectedProduct;
    this.productReturnableItems.at(i).patchValue({
      product_description: this.selectedProduct.product_description,
      hsn_code: this.selectedProduct.hsn_sac_code,
      // proposed_quantity
      uom_name: this.selectedProduct.uom_name,
    });
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe(
      (res: any) => {
        this.billingCountryList = res.data;
        this.customerBillingCountryList = res.data;
        this.customerFilteredBillCountry = res.data;
        this.shippingCountryList = res.data;
        this.filteredshippingCountry = res.data;
        this.filteredBillCountry = res.data;
      })
  };
  async billingCountryChange(e: any) {
    let countryId;
    if (e?.value) {
      countryId = e?.value;
    } else {
      countryId = e;
    }
    await this.billingCountryMethod(countryId);
  }
  async billingCountryMethod(id: any) {
    await this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.billingSteteData = res?.data;
        this.filteredbillingSteteData = res.data;
      }
    });
  }
  customerBillingCountryChange(e: any) {
    let countryId;
    if (e?.value) {
      countryId = e?.value;
    } else {
      countryId = e;
    }
    this.customerBillingCountryMethod(countryId);
  }
  customerBillingCountryMethod(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.customerBillingSteteData = res?.data;
        this.customerFilteredbillingSteteData = res.data;
      }
    });
  }
  shippingCountryChange(e: any) {
    let countryId;
    if (e?.value) {
      countryId = e?.value;
    } else {
      countryId = e;
    }
    this.shippingCountryMethod(countryId);
  }
  shippingCountryMethod(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.shippingSteteData = res?.data;
        this.filteredShippingSteteData = res.data;
      }
    });
  }
  billingStateChange(e: any) {
    let stateId;
    if (e?.value) {
      stateId = e?.value;
    } else {
      stateId = e;
    }
    this.billingGetCityByState(stateId);
    this.stateChange(e);
  }
  billingGetCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.billingCityList = res?.data;
        this.filterBillingCityList = res?.data;
      }
    });
  }
  customerBillingStateChange(e: any) {
    let stateId;
    if (e?.value) {
      stateId = e?.value;
    } else {
      stateId = e;
    }
    this.customerBillingGetCityByState(stateId);
    // this.stateChange(e);
  }
  customerBillingGetCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.customerBillingCityList = res?.data;
        this.customerFilterBillingCityList = res?.data;
      }
    });
  }
  shippingStateChange(e: any) {
    let stateId;
    if (e?.value) {
      stateId = e?.value;
    } else {
      stateId = e;
    }
    this.shippingGetCityByState(stateId);
  }
  shippingGetCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.shippingCityList = res?.data;
        this.filterShippingCityList = res?.data;
      }
    });
  }

  createChallan() {

    // if (this.frmDeliveryChallan.invalid) {
    //   return this.toast.warning("Please fill all required fields!")
    // }
    const productDetailList = this.frmDeliveryChallan.get(
      'items'
    ) as FormArray;
    const totalQty = productDetailList.controls.reduce((sum, fg) => {
      const qty = fg.get('quantity')?.value || 0;
      return sum + Number(qty);
    }, 0);

    if (totalQty <= 0) {
      return this.toast.error(
        'Total delivery quantity must be greater than 0!'
      );
    }

    let data = this.frmDeliveryChallan.value;

    let items = this.productItems.value.map((x: any) => ({
      ...x,
      igst: this.isSameState ? null : x.igst,
      sgst: this.isSameState ? x.igst / 2 : null,
      cgst: this.isSameState ? x.igst / 2 : null,
    }));

    data.items = items;
    data.proposal_id = this.proposal_id;
    data.challanDoc = this.uploadedFile;
    data.challan_type_status = 'INDIRECT';
    data.states_code = this.selectedStateCode;
    // this.salesService.createSalesInvoice(data).subscribe(
    //   (res: any) => {
    //     if (res) {
    //       this.toster.success(res.message);
    //       this.$common?.hideLoader();
    //       this.router.navigate(['/master/sales/sales-invoice-list']);
    //     }
    //   },
    //   (err: any) => {
    //     if (err) {
    //       this.toster.error('Something went wrong');
    //       this.$common?.hideLoader();
    //     }
    //   }
    // );
    this.salesService
      .createChallan(data, this.entityId, this.financial_year_id)
      .subscribe(
        (res: any) => {
          this.toster.success(res.message);
          this.router.navigate(['/master/sales/sales-invoice-list']);
        },
        (err) => {
          if (err.status == 400) {
            this.toster.error('Something went Wrong!');
          } else {
            this.toster.error('Error in submission!');
          }
        }
      );
  }
  async generateIrn() {
    let formData = this.frmDeliveryChallan.value;
    let supplyTypeCode = await this.supplyTypeList.find((x: any) => x.id === formData.supply_type)?.code;
    let branchData = await this.branchList.find((x: any) => x.id === formData.billing_branch);
    let itemDetailsawait = await this.setItems();

    let gstData = {
      CDKey: this.CDKData.CDKey,
      EInvUserName: this.CDKData.EInvUserName,
      EInvPassword: this.CDKData.EInvPassword,
      EFUserName: this.CDKData.EFUserName,
      EFPassword: this.CDKData.EFPassword,
      GSTIN: this.CDKData.GSTIN,
      GetQRImg: 1,
      GetSignedInvoice: 1,
      TranDtls: {
        SupTyp: supplyTypeCode,
        RegRev: 'N',
        EcmGstin: null,
        IgstOnIntra: 'N',
      },
      DocDtls: {
        Typ: 'INV',
        No: this.invoiceNo,
        Dt: '04/03/2025',
        // Dt: this.invoiceDate
      },
      SellerDtls: {
        Gstin: '29AAACW3775F000',
        // Gstin: branchData.branch_gstnumber,
        LglNm: 'NIC company pvt ltd',
        TrdNm: '',
        Addr1: '5th block, kuvempu layout',
        Addr2: branchData.branch_address,
        Loc: 'GANDHINAGAR',
        Pin: 562160,
        Stcd: 29,
        Ph: branchData.branch_contact_no,
        Em: branchData.branch_email,
      },
      BuyerDtls: {
        Gstin: '29AWGPV7107B1Z1',
        LglNm: formData.customer_name,
        TrdNm: '',
        Pos: 12,
        // Pos: cust_state_code.states_name,
        Addr1: formData.customer_billing_add1,
        Addr2: formData.customer_billing_add2,
        Loc: 'GANDHINAGAR',
        Pin: 562160,
        Stcd: 29,
        Ph: '',
        Em: '',
      },
      DispDtls: {
        Nm: 'ABC company pvt ltd',
        Addr1: '7th block, kuvempu layout',
        Addr2: 'kuvempu layout',
        Loc: 'Banagalore',
        Pin: 562160,
        Stcd: '29',
      },
      ItemList: itemDetailsawait,

      ValDtls: {
        AssVal: 10000,
        CgstVal: 0,
        SgstVal: 0,
        IgstVal: 1200,
        CesVal: 0,
        StCesVal: 0,
        Discount: 0,
        OthChrg: 0,
        RndOffAmt: 0,
        TotInvVal: 11200,
        TotInvValFc: 11200,
      },
      PayDtls: {
        Nm: 'ABCDE',
        Accdet: '5697389713210',
        Mode: 'Cash',
        Fininsbr: 'SBIN11000',
        Payterm: '100',

        Payinstr: 'Gift',
        Crtrn: 'test',
        Dirdr: 'test',
        Crday: 100,
        Paidamt: 10000,
        Paymtdue: 5000,
      },
      RefDtls: {
        InvRm: 'TEST',
        DocPerdDtls: {
          InvStDt: '11/08/2020',
          InvEndDt: '11/09/2020',
        },
        PrecDocDtls: [
          {
            InvNo: 'DOC/002',
            InvDt: '10/08/2020',
            OthRefNo: '123456',
          },
        ],
        ContrDtls: [
          {
            RecAdvRefr: 'Doc/003',

            RecAdvDt: '01/08/2020',
            Tendrefr: 'Abc001',
            Contrrefr: 'Co123',
            Extrefr: 'Yo456',
            Projrefr: 'Doc-456',
            Porefr: 'Doc-789',
            PoRefDt: '01/08/2020',
          },
        ],
      },
      AddlDocDtls: [
        {
          Url: 'https://einv-apisandbox.nic.in',
          Docs: 'Test Doc',
          Info: 'Document Test',
        },
      ],
      ExpDtls: {
        ShipBNo: 'A-248',
        ShipBDt: '01/08/2020',
        Port: 'INABG1',
        RefClm: 'N',
        ForCur: 'AED',
        CntCode: 'AE',
        ExpDuty: null,
      },
      EwbDtls: {
        Transid: '12AWGPV7107B1Z1',
        Transname: 'XYZ EXPORTS',
        Distance: 100,
        Transdocno: 'DOC01',
        TransdocDt: '10/08/2020',
        Vehno: 'ka123456',
        Vehtype: 'R',
        TransMode: '1',
      },
    };

    this.$crm
      .generateIRN(this.entityId, this.financial_year_id, this.doId, gstData, this.invoice_id)
      .subscribe({
        next(res: any) {
          console.log(res);
        },
        error(err) {
          console.log(err);
        },
      });

    console.log(gstData);
  }
  itemList: any[] = [];
  async setItems() {
    return this.irnProductList.map((x: any, i: number) => ({
      SlNo: i + 1,
      PrdDesc: x.product_name + ' ' + x.product_description,
      IsServc: 'N',
      HsnCd: x.hsn_sac_code,
      Barcde: '',
      Qty: x.delivered_qty,
      FreeQty: 0,
      Unit: x.uom_name,
      UnitPrice: x.price_per_unit,
      TotAmt: 100,
      Discount: 0,
      PreTaxVal: 0,
      AssAmt: 100,
      GstRt: 12.0,
      IgstAmt: x.igst,
      CgstAmt: x.cgst,
      SgstAmt: x.sgst,
      CesRt: 0,
      CesAmt: 0,
      CesNonAdvlAmt: 0,
      StateCesRt: 0,
      StateCesAmt: 0,
      StateCesNonAdvlAmt: 0,
      OthChrg: 0,
      TotItemVal: 11200,
      OrdLineRef: '3256',
      OrgCntry: 'IN',
      PrdSlNo: '12345',
      BchDtls: {
        Nm: '123456',
        Expdt: '01/08/2020',
        wrDt: '01/09/2020',
      },
      AttribDtls: [
        {
          Nm: 'Rice',
          Val: '10000',
        },
      ],
    }));
  }
}
