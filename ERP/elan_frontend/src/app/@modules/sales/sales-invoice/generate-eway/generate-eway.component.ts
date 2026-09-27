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
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
import { debounceTime } from 'rxjs';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-generate-eway',
  templateUrl: './generate-eway.component.html',
  styleUrls: ['./generate-eway.component.scss'],
})
export class GenerateEwayComponent {
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
  frmEwayBill: FormGroup;
  entityId: string | null;
  financial_year_id: string | null;
  today: Date = new Date();
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
  isSameState: boolean;
  CDKData: any;
  status_type: any = '';
  doId: number;
  do_id:any;
  invoiceDate: any;
  isEway: boolean = false;
  invoiceNo: string = '';
  selectedBranchStateId: any;
  selected_gstnumber: any;
  selected_supplier_name: any;
  doData: any;
  CustomerGst: any;
  IrnNumber: any;
  transportName:any;
  loginUser:any;
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
    private toast: ToastrService,
    private _commonService: CommonService
  ) {}
  invoiceMode :any;

  ngOnInit(): void {
    this.frmEwayBill = this._fb.group({
      do_type: [null, Validators.required],
      supply_type: [null, Validators.required],
      invoice_date: [null, Validators.required],
      invoice_no: [null, Validators.required],
      do_no: [null],
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
      // remark: [null, Validators.required],
      notes: [null],
      terms_and_conditions: [null],
      customer_gst_number: [null, Validators.required],
      Irn: [null, Validators.required],
      Distance: [null, Validators.required],
      TransMode: [null, Validators.required],
      Transname: [null, Validators.required],
      TransdocDt: [null, Validators.required],
      Transdocno: [null, Validators.required],
      Vehno: [null, Validators.required],
      Vehtype: [null, Validators.required],
      items: this._fb.array([this.createItems()]),
      chargesDetailList: new FormArray([]),
      returnableItems: this._fb.array([this.createReturnableItems()]),
    });
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
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
    this.getAllTranspostName();
    this.searchFilter();
    this._active.queryParams.subscribe((res: any) => {
      this.proposal_id = res?.sales_id;
this.invoiceMode = res?.invoiceMode;
      this.status_type = res?.status_type;
      this.doId = res?.id?res?.id:res?.invoice_id;
      this.do_id = res?.do_id;
      if (this.status_type === 'generate_eway_bill') {
        this.isEway = true;
        this.invoiceNo = res?.invoiceNo;
        this.invoiceDate = res?.invoiceDate;
        this.frmEwayBill.get('invoice_no')?.patchValue(this.invoiceNo);
        this.frmEwayBill.get('invoice_date')?.patchValue(this.invoiceDate);
      }
      this.getInvoiceIrnDataByDoId();

      if (this.doId || this.invoiceNo && this.status_type) {
        this.getDoData(this.doId?this.doId:res?.invoice_id, res?.invoiceMode);
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
    this.frmEwayBill.patchValue({
      customer_code: customer_code,
    });
  }

  getInvoiceIrnDataByDoId() {
    
    this.salesService.getInvoiceIrnDataByDoId(this.do_id).subscribe(
      (res: any) => {
        this.IrnNumber = res.data?.Irn;
        this.frmEwayBill.get('Irn')?.setValue(this.IrnNumber);
        // this.viewIrnData = res.data;
      },
      (err: any) => {
        if (err.status == 400) {
        }
      }
    );
  }

  onVehicleNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    this.frmEwayBill.get('Vehno')?.setValue(input.value, { emitEvent: false });
  }

  searchFilter() {
    this.filterbranchControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.branchList = this.filteredbranchList.filter((brnch: any) =>
          brnch.branch_name.toLowerCase().includes(value.toLowerCase())
        );
      });

    this.filtercityControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.billingCityList = this.filterBillingCityList.filter((city: any) =>
          city.city_name.toLowerCase().includes(value.toLowerCase())
        );
      });

    this.filterCountryControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.billingCountryList = this.filteredBillCountry.filter(
          (country: any) =>
            country.countryss_name.toLowerCase().includes(value.toLowerCase())
        );
      });

    this.filterStateControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.billingSteteData = this.filteredbillingSteteData.filter(
          (state: any) =>
            state.states_name.toLowerCase().includes(value.toLowerCase())
        );
      });

    // shipping section searching
    this.filterCountryControl2.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.shippingCountryList = this.filteredshippingCountry.filter(
          (country: any) =>
            country.countryss_name.toLowerCase().includes(value.toLowerCase())
        );
      });

    this.filterStateControl2.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.shippingSteteData = this.filteredShippingSteteData.filter(
          (state: any) =>
            state.states_name.toLowerCase().includes(value.toLowerCase())
        );
      });

    this.filtercityControl2.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.shippingCityList = this.filterShippingCityList.filter(
          (city: any) =>
            city.city_name.toLowerCase().includes(value.toLowerCase())
        );
      });
    // customer section searching
    this.customerFilterCountryControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.customerBillingCountryList =
          this.customerFilteredBillCountry.filter((country: any) =>
            country.countryss_name.toLowerCase().includes(value.toLowerCase())
          );
      });

    this.customerFilterStateControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.customerBillingSteteData =
          this.customerFilteredbillingSteteData.filter((state: any) =>
            state.states_name.toLowerCase().includes(value.toLowerCase())
          );
      });

    this.customerFiltercityControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.customerBillingCityList =
          this.customerFilterBillingCityList.filter((city: any) =>
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
      let obj = res.data;
      this.getAllProductDetails = obj?.productDetailList;

      if (res) {
        this.frmEwayBill.patchValue({
          customer_name: res.data.company_name,
        });
        this.patchItems(obj);
      }
    });
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
    return this.frmEwayBill.controls;
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
    let chargesDetailList = this.frmEwayBill.get(
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
  irnProductList: any = [];

  async getDoData(doId: any, invoiceMode:any) {
    
    await this.$crm.getDoData(doId,invoiceMode).subscribe({
      next: async (res) => {
        let data = { productDetailList: res.data?.productData };
        this.doData = res.data?.challanData;
        this.irnProductList = [...res.data?.productData];
        await this.patchDoData(this.doData);
        await this.patchItems(data);
        this.patchAddCharge(res.data?.charges);
      },
      error(err) {},
    });
  }
  async getCDKData(doId: any) {
    
    await this.$crm.getCDKData(doId).subscribe({
      next: async (res) => {
        this.CDKData = res.data;
      },
      error(err) {},
    });
  }

  async patchDoData(doData: any) {
    await this.frmEwayBill.patchValue({
      do_type: doData.do_type_id,
      supply_type: doData.supply_type_id,
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
      customer_gst_number: doData.customer_gst_number,
    });
    this.CustomerGst = doData.customer_gst_number;
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

  createItems(): FormGroup {
    return this._fb.group({
      product_category_id: [],
      product_master_id: [],
      product_sub_category_id:[],
      variant_id: [],
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
    return this.frmEwayBill.get('items') as FormArray;
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
        (err) => {}
      );
    } catch (error) {}
  }
  viewImg1() {
    window.open(environment.servralUrl + '/' + this.uploadedFile, '_blank');
  }
//   async patchItems(items: any) {
//     this.productItems.clear();

//     for (let i = 0; i < items?.productDetailList.length; i++) {
//       const ele = items.productDetailList[i];
//       this.addItem();
//       const lastItem = this.productItems.at(
//         this.productItems.length - 1
//       ) as FormGroup;
//       lastItem.patchValue({
//         product_category_id: ele.product_category_id,
//         product_master_id: ele.product_master_id,
//         variant_id: ele.variant_id,
//         product_description: ele.product_description,
//         hsn_code: ele.hsn_sac_code,
//         proposed_quantity: ele.proposed_quantity,
//         delivered_qty: ele.delivered_qty,
//         remaining_quantity: ele.remaining_quantity,
//         quantity: ele.tempQuantity,
//         uom_name: ele.uom_name,
//         maximum_discount: ele.maximum_discount,
//         discount_request: ele.discount_request,
//         igst: ele.igst,
//         sgst: ele.sgst,
//         cgst: ele.cgst,
//         price_per_unit: ele.price_per_unit,
//       });
// 
//       // await this.getAllCategory(i);
//       // await this.getAllActiveProduct(ele.product_category_id, i);
//       // await this.getAllProductVariant(ele.product_master_id, i);


//       await this.getAllCategory(i); // Ensure this completes first
//       await this.getProductList(ele.pro_sub_cat_id,ele.product_category_id, i); // Then, call this
//       await this.getSubCategory(ele.product_category_id,i);
//     }
//   }

  
//   getAllCategory(i: any) {
//     new Promise<void>((resolve, reject) => {
//       this.$productionService.getAllCetegory(this.entityId).subscribe(
//         (res: any) => {
//           this.categoryList[i] = res.data;
//           this.filterCategory[i] = res.data;
//           resolve();
//         },
//         (err: any) => {
//           reject(err);
//         }
//       );
//     });
//   }
//   getProductList(event: any, e:any,index: any) {
    
//     let id = event.value ? event.value : event;
    
//     new Promise<void>((resolve, reject) => {
//       this.$productionService.getItemsBySubCategory(event.id??event,e.item_category_id ??e).subscribe((res: any) => {
//         this.productList2[index] = res.data;
//         this.filterproduct2[index] = res.data;
//         // After getting the active product, we patch the product name (or other necessary values)
//         // this.patchProductName(index);
//         resolve();
//       },
//       (err: any) => {
//         reject(err);
//       }
//     );
//     });
//   }


//   subCategory:any[]=[];
//   getSubCategory(event: any, index: any) {  
//     new Promise<void>((resolve, reject) => {
//       this._configurationalMasterService.getSubCategory(event.value ?? event).subscribe((res: any) => {
        
//         this.subCategory[index] = res.data
//         resolve();
//       },
//       (err: any) => {
//         reject(err);
//       }
//     );
//   });  
  
// }

async patchItems(items: any) {
  this.productItems.clear();

  // Loop through productDetailList
  for (let i = 0; i < items?.productDetailList.length; i++) {
    const ele = items.productDetailList[i];

    this.addItem();
    const lastItem = this.productItems.at(this.productItems.length - 1) as FormGroup;

    // Patching the form with values from the current item
    lastItem.patchValue({
      product_category_id: ele.product_category_id,
      product_master_id: ele.product_master_id,
      product_sub_category_id:ele.pro_sub_cat_id,
      variant_id: ele.variant_id,
      product_description: ele.product_description,
      hsn_code: ele.hsn_sac_code,
      proposed_quantity: ele.proposed_quantity,
      delivered_qty: ele.delivered_qty,
      remaining_quantity: ele.remaining_quantity,
      quantity: ele.tempQuantity,
      uom_name: ele.uom_name,
      maximum_discount: ele.maximum_discount,
      discount_request: ele.discount_request,
      igst: ele.igst,
      sgst: ele.sgst,
      cgst: ele.cgst,
      price_per_unit: ele.price_per_unit,
    });

    // Await all the asynchronous calls concurrently
    await Promise.all([
      this.getAllCategory(i),
      this.getSubCategory(ele.product_category_id, i),
      this.getProductList(ele.pro_sub_cat_id, ele.product_category_id, i),
    ]);
  }
}

getAllCategory(i: any): Promise<void> {
  return new Promise((resolve, reject) => {
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

getProductList(event: any, e: any, index: any): Promise<void> {
  let id = event.value ? event.value : event;
  
  return new Promise((resolve, reject) => {
    this.$productionService.getItemsBySubCategory(event.id ?? event, e.item_category_id ?? e).subscribe(
      (res: any) => {
        this.productList[index] = res.data;
        this.filterproduct[index] = res.data;
        resolve();
      },
      (err: any) => {
        reject(err);
      }
    );
  });
}
subCategory:any []=[];
getSubCategory(event: any, index: any): Promise<void> {
  return new Promise((resolve, reject) => {
    this._configurationalMasterService.getSubCategory(event.value ?? event).subscribe(
      (res: any) => {
        this.subCategory[index] = res.data;
        resolve();
      },
      (err: any) => {
        reject(err);
      }
    );
  });
}

getAllActiveProduct(event: any, index: any) {
  let id = event.value ? event.value : event;

   new Promise<void>((resolve, reject) => {
    this.$productionService.getAllActiveProduct(id, this.entityId).subscribe(
      (res: any) => {
        this.productList[index] = res.data;
        this.filterproduct[index] = res.data;
        resolve();
      },
      (err: any) => {
        reject(err);
      }
    );
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
  createReturnableItems(): FormGroup {
    return this._fb.group({
      product_category_id: [],
      product_master_id: [],
      variant_id: [],
      product_description: [''],
      hsn_code: [''],
      proposed_quantity: [],
      uom_name: [''],
    });
  }

  get productReturnableItems(): FormArray {
    return this.frmEwayBill.get('returnableItems') as FormArray;
  }

  addReturnableItem() {
    if (this.frmEwayBill.get('returnableItems')?.invalid) {
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
        (err) => {}
      );
    } catch (error) {}
  }
  getAllSupplyType() {
    try {
      this.$crm.getSupplyType().subscribe(
        (response: any) => {
          if (response) {
            this.supplyTypeList = response.data;
          }
        },
        (err) => {}
      );
    } catch (error) {}
  }

  getAllTranspostName(){
    try {
      this.$crm.getAllTranspostName(this.entityId,this.financial_year_id,this.loginUser?.role).subscribe(
        (response: any) => {
          if (response) {
            this.transportName = response.data;
          }
        },
        (err) => {}
      );
    } catch (error) {}
  }
  getAllDocumentType() {
    try {
      this.$crm.getDocumentType().subscribe(
        (response: any) => {
          if (response) {
            this.docTypeList = response.data;
          }
        },
        (err) => {}
      );
    } catch (error) {}
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
        (err) => {}
      );
    } catch (error) {}
  }
  async checkApplicableGst(event: any) {
    const branchId = this.frmEwayBill.get('billing_branch')?.value;
    const transition_type = this.frmEwayBill.get('transition_type')?.value;
    let selectedBranchDetails = this.branchList.find(
      (branch: any) => branch.id == branchId
    );
    this.selected_gstnumber = selectedBranchDetails.branch_gstnumber;
    this.selected_supplier_name = selectedBranchDetails.branch_name;

    this.frmEwayBill.patchValue({
      billing_country: selectedBranchDetails.MASTER_COUNTRY.countryss_id,
      billing_state: selectedBranchDetails.MASTER_STATE.states_id,
      billing_city: selectedBranchDetails.MASTER_CITY.city_id,
      billing_pin: selectedBranchDetails.branch_pin_code,
      billing_add1: selectedBranchDetails.branch_address,
      billing_add2: selectedBranchDetails.branch_address,
    });
    if (transition_type === 3 || transition_type === 4) {
      this.frmEwayBill.patchValue({
        supplier_gst: this.selected_gstnumber,
        gst_supplier_name: this.selected_supplier_name,
      });
    } else {
      this.selected_gstnumber = null;
      this.selected_supplier_name = null;
      this.frmEwayBill.patchValue({
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
    if (
      this.frmEwayBill.get('customer_billing_state')?.value == selectedStateId
    ) {
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
      this.frmEwayBill.patchValue({
        supplier_gst: this.selected_gstnumber,
        gst_supplier_name: this.selected_supplier_name,
      });
    } else {
      this.selected_gstnumber = null;
      this.selected_supplier_name = null;
      this.frmEwayBill.patchValue({
        supplier_gst: null,
        gst_supplier_name: null,
      });
    }
  }

  addValidationForBilling() {
    this.frmEwayBill
      .get('customer_billing_country')
      ?.setValidators(Validators.required);
    this.frmEwayBill
      .get('customer_billing_state')
      ?.setValidators(Validators.required);
    this.frmEwayBill
      .get('customer_billing_city')
      ?.setValidators(Validators.required);
    this.frmEwayBill
      .get('customer_billing_pin')
      ?.setValidators(Validators.required);
    this.frmEwayBill
      .get('customer_billing_add1')
      ?.setValidators(Validators.required);
    this.frmEwayBill
      .get('customer_billing_add2')
      ?.setValidators(Validators.required);
  }

  addValidationForShipping() {
    this.frmEwayBill
      .get('shipping_country')
      ?.setValidators(Validators.required);
    this.frmEwayBill.get('shipping_state')?.setValidators(Validators.required);
    this.frmEwayBill.get('shipping_city')?.setValidators(Validators.required);
    this.frmEwayBill.get('shipping_pin')?.setValidators(Validators.required);
    this.frmEwayBill.get('shipping_add1')?.setValidators(Validators.required);
    this.frmEwayBill.get('shipping_add2')?.setValidators(Validators.required);
  }

  addValidationForGST() {
    this.frmEwayBill.get('supplier_gst')?.setValidators(Validators.required);
    this.frmEwayBill
      .get('gst_supplier_name')
      ?.setValidators(Validators.required);
    this.frmEwayBill.get('trade_name')?.setValidators(Validators.required);
  }

  removeValidation() {
    this.frmEwayBill.get('customer_billing_country')?.clearValidators();
    this.frmEwayBill.get('customer_billing_state')?.clearValidators();
    this.frmEwayBill.get('customer_billing_city')?.clearValidators();
    this.frmEwayBill.get('customer_billing_pin')?.clearValidators();
    this.frmEwayBill.get('customer_billing_add1')?.clearValidators();
    this.frmEwayBill.get('customer_billing_add2')?.clearValidators();
    this.frmEwayBill.get('supplier_gst')?.clearValidators();
    this.frmEwayBill.get('gst_supplier_name')?.clearValidators();
    this.frmEwayBill.get('trade_name')?.clearValidators();
    this.frmEwayBill.get('shipping_country')?.clearValidators();
    this.frmEwayBill.get('shipping_state')?.clearValidators();
    this.frmEwayBill.get('shipping_city')?.clearValidators();
    this.frmEwayBill.get('shipping_pin')?.clearValidators();
    this.frmEwayBill.get('shipping_add1')?.clearValidators();
    this.frmEwayBill.get('shipping_add2')?.clearValidators();
  }
  
  applyChanges() {
    Object.keys(this.frmEwayBill.controls).forEach((field) => {
      const control = this.frmEwayBill.get(field);
      control?.updateValueAndValidity();
    });
  }
  
  generateDeliveryOrderNumber(id: any) {
    this.salesService.generateDeliveryOrderNumber(id).subscribe((res: any) => {
      this.frmEwayBill.patchValue({
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
    this._configurationalMasterService.getSubCategory(event.value ?? event)
      .subscribe((res: any) => {
        this.productList2[index] = res.data;
        this.filterproduct2[index] = res.data;
      });
  }

  getAllCategory2(index: any) {
    this._configurationalMasterService.getActiveAssetMasterList()
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
    this._configurationalMasterService
      .getProductVariantByproduct_id(data?.value ?? data)
      .subscribe(
        (res: any) => {
          if (res) {
            this.varientList2[index] = res.data;
            this.filterVariant2[index] = res.data;
          }
        },
        (err: any) => {}
      );
  }

  selectedVarient(event: any, i: any) {}
  selectedVarient2(event: any, i: any) {
    this.selectedProduct;
    this.productReturnableItems.at(i).patchValue({
      product_description: this.selectedProduct.product_description,
      hsn_code: this.selectedProduct.hsn_sac_code,
      uom_name: this.selectedProduct.uom_name,
    });
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe((res: any) => {
      this.billingCountryList = res.data;
      this.customerBillingCountryList = res.data;
      this.customerFilteredBillCountry = res.data;
      this.shippingCountryList = res.data;
      this.filteredshippingCountry = res.data;
      this.filteredBillCountry = res.data;
    });
  }
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

  formatDate(dateInput: any): string {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    date.setHours(0, 0, 0, 0);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  async generateEwaybill() {
    // if (this.frmEwayBill.invalid) {
    //   return this.toast.error('Please fill all required fields!');
    // }
    this._commonService?.showLoader();

    let formData = this.frmEwayBill.value;

    let supplyTypeCode = await this.supplyTypeList.find(
      (x: any) => x.id === formData.supply_type
    )?.code;
    let branchData = await this.branchList.find(
      (x: any) => x.id === formData.billing_branch
    );
    let cust_state_code = await this.customerBillingSteteData.find(
      (x: any) => x.states_id === formData.customer_billing_state
    )?.states_code;
    let cust_city = await this.customerBillingCityList.find(
      (x: any) => x.city_id === formData.customer_billing_city
    )?.city_name;
    let ewayData = [
      {
        CDKey: this.CDKData.CDKey,
        EInvUserName: this.CDKData.EInvUserName,
        EInvPassword: this.CDKData.EInvPassword,
        EFUserName: this.CDKData.EFUserName,
        EFPassword: this.CDKData.EFPassword,
        GSTIN: this.CDKData.GSTIN,
        ShipFrom_Nm: branchData.branch_name,
        TransMode: this.frmEwayBill.get('TransMode')?.value,
        Irn: this.frmEwayBill.get('Irn')?.value,
        Distance: this.frmEwayBill.get('Distance')?.value,
        Transname: this.frmEwayBill.get('Transname')?.value,
        TransdocDt: this.formatDate(this.frmEwayBill.get('TransdocDt')?.value),
        Transdocno: this.frmEwayBill.get('Transdocno')?.value,
        Vehno: this.frmEwayBill.get('Vehno')?.value,
        Vehtype: this.frmEwayBill.get('Vehtype')?.value,
        ShipFrom_Addr1: branchData.branch_address,
        ShipFrom_Addr2: branchData.branch_address,
        ShipFrom_Loc: branchData.MASTER_STATE.states_name,
        ShipFrom_Pin: branchData.branch_pin_code,
        ShipFrom_Stcd: branchData.MASTER_STATE.states_code,
        ShipTo_Addr1: formData.customer_billing_add1,
        ShipTo_Addr2: formData.customer_billing_add2,
        ShipTo_Loc: cust_city,
        ShipTo_Pin: parseInt(formData.customer_billing_pin),
        ShipTo_Stcd: cust_state_code,
        Transid: this.frmEwayBill.get('customer_gst_number')?.value,
      },
    ];
    let requestBody = {
      Push_Data_List: ewayData.map((data) => ({
        Irn: data.Irn || '',
        TransMode: data.TransMode || '',
        Transid: data.Transid || '',
        Transname: data.Transname || '',
        Distance: data.Distance || 0,
        Transdocno: data.Transdocno || '',
        TransdocDt: data.TransdocDt || '',
        Vehno: data.Vehno || '',
        Vehtype: data.Vehtype || '',
        ShipFrom_Addr1: data.ShipFrom_Addr1 || '',
        ShipFrom_Addr2: data.ShipFrom_Addr2 || '',
        ShipFrom_Loc: data.ShipFrom_Loc || '',
        ShipFrom_Pin: data.ShipFrom_Pin || 0,
        ShipFrom_Stcd: data.ShipFrom_Stcd || '',
        ShipTo_Addr1: data.ShipTo_Addr1 || '',
        ShipTo_Addr2: data.ShipTo_Addr2 || '',
        ShipTo_Loc: data.ShipTo_Loc || '',
        ShipTo_Pin: data.ShipTo_Pin || 0,
        ShipTo_Stcd: data.ShipTo_Stcd || '',
        GSTIN: data.GSTIN || '',
        CDKey: data.CDKey || '',
        EWbUserName: data.EInvUserName || '',
        EWbPassword: data.EInvPassword || '',
        EFUserName: data.EFUserName || '',
        EFPassword: data.EFPassword || '',
        ShipFrom_Nm: data.ShipFrom_Nm || '',
      })),
    };
    this.$crm
      .generateEwaybill(
        this.entityId,
        this.financial_year_id,
        this.doId,
        requestBody,this.invoiceMode
      )
      .subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.toster.success(res.message);
            this.router.navigate(['/master/sales/delivery-e-way-list']);
          } else if (res.code === 201) {
            this.toster.warning(res.error);
          }
          this._commonService?.hideLoader();
        },
        (err: any) => {
          this._commonService?.hideLoader();
          this.toster.error(
            err.status === 400
              ? 'Something went wrong!'
              : 'Error in submission!'
          );
        }
      );
  }
}
