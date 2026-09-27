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
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
import { debounceTime } from 'rxjs';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-create-direct-invoice',
  templateUrl: './create-direct-invoice.component.html',
  styleUrls: ['./create-direct-invoice.component.scss'],
})
export class CreateDirectInvoiceComponent {
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
  formDirectInvoice: FormGroup;
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
  today: Date = new Date();
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
  filterbranchControl = new FormControl();
  filterCustomerControl = new FormControl();
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
  filteredCustomerList: any;
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
  loginUser: any;
  customerList: any;
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
  ) {}

  ngOnInit(): void {
    this.formDirectInvoice = this._fb.group({
      sales_invoice_no: [this.genInvNoWithDate(), Validators.required],
      sales_invoice_date: [null, Validators.required],
      supply_type: [null, Validators.required],
      customer_name: [null, Validators.required],
      customer_id: [null, Validators.required],
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
      additional_charges: [null],
      total_discount: [null],
      total_gst: [null],
      grand_total: [null],
      notes: [null],
      terms_and_conditions: [null],
      payment_terms: [null, Validators.required],
      items: this._fb.array([this.createItems()]),
    });

    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.getAllActiveTransType();
    this.getBranchData();
    this.getAllCategory(0);
    this.getAllCountry();
    this.getAllSupplyType();
    this.getAllCustomerList();
    this.searchFilter();
    this._active.queryParams.subscribe((res: any) => {
      this.proposal_id = res?.sales_id;

      this.status_type = res?.status_type;
      this.doId = res?.id;
      if (this.status_type === 'viewChallan') {
        this.isView = true;
      }
      this.getAllCategory(0);
    });
  }

  searchFilter() {
    this.filterbranchControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.branchList = this.filteredbranchList.filter((brnch: any) =>
          brnch.branch_name.toLowerCase().includes(value.toLowerCase())
        );
      });
    this.filterCustomerControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.customerList = this.filteredCustomerList.filter((customer: any) =>
          customer.company_name.toLowerCase().includes(value.toLowerCase())
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

  irnProductList: any = [];

  getCustomerDetailsById() {
    try {
      this.$crm.getCustomerDetailsById(this.customerId).subscribe(
        async (response: any) => {
          if (response) {
            this.customerDetails = response.data[0];
            await this.customerBillingCountryChange(
              this.customerDetails.billing_country_id
            );
            await this.customerBillingStateChange(
              this.customerDetails.billing_state_id
            );
            await this.shippingCountryChange(
              this.customerDetails.shipping_country_id
            );
            await this.shippingStateChange(
              this.customerDetails.shipping_state_id
            );

            this.formDirectInvoice.patchValue({
              customer_billing_country: this.customerDetails.billing_country_id,
              customer_billing_state: this.customerDetails.billing_state_id,
              customer_billing_city: this.customerDetails.billing_city_id,
              customer_billing_pin: this.customerDetails.billing_pin_code,
              customer_billing_add1: this.customerDetails.billing_address,
              customer_billing_add2: this.customerDetails.billing_address,
              shipping_country: this.customerDetails.shipping_country_id,
              shipping_state: this.customerDetails.shipping_state_id,
              shipping_city: this.customerDetails.shipping_city_id,
              shipping_pin: this.customerDetails.shipping_pin_code,
              shipping_add1: this.customerDetails.shipping_address,
              shipping_add2: this.customerDetails.shipping_address,
              customer_gst_number: this.customerDetails.gst_number,
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
  async patchCustomerData() {
    this.customerId = this.formDirectInvoice.get('customer_id')?.value;
    let selectedCustDetails = this.customerList.find(
      (customer: any) => customer.id == this.customerId
    );

    this.formDirectInvoice.patchValue({
      customer_code: selectedCustDetails?.customer_code,
      customer_name: selectedCustDetails?.company_name,

    });
    this.getCustomerDetailsById();
  }

  createItems(): FormGroup {
    return this._fb.group({
      product_category_id: [],
      product_master_id: [],
      product_sub_category_id:[],
      product_code: [],      
      product_description: [],
      hsn_code: [],
      uom_name: [],
      quantity: [null, Validators.required],
      price_per_unit: [],
      discount: [],
      gst: [],
    });
  }

  get productItems(): FormArray {
    return this.formDirectInvoice.get('items') as FormArray;
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

  getBranchData() {
    try {
      this.$crm.branchSetup_get().subscribe(
        (response: any) => {
          if (response) {
            this.branchList = response.data.filter(
              (branch: any) => branch.billing_status === true
            );
            this.filteredbranchList = this.branchList;
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
    const branchId = this.formDirectInvoice.get('billing_branch')?.value;
    const transition_type =
      this.formDirectInvoice.get('transition_type')?.value;
    let selectedBranchDetails = this.branchList.find(
      (branch: any) => branch.id == branchId
    );
    this.selected_gstnumber = selectedBranchDetails.branch_gstnumber;
    this.selected_supplier_name = selectedBranchDetails.branch_name;

    this.formDirectInvoice.patchValue({
      billing_country: selectedBranchDetails.MASTER_COUNTRY?.countryss_id,
      billing_state: selectedBranchDetails.MASTER_STATE?.states_id,
      billing_city: selectedBranchDetails.MASTER_CITY?.city_id,
      billing_pin: selectedBranchDetails?.branch_pin_code,
      billing_add1: selectedBranchDetails?.branch_address,
      billing_add2: selectedBranchDetails?.branch_address,
      trade_name: selectedBranchDetails?.branch_name,
    });
    if (transition_type === 3 || transition_type === 4) {
      this.formDirectInvoice.patchValue({
        supplier_gst: this.selected_gstnumber,
        gst_supplier_name: this.selected_supplier_name,
      });
    } else {
      this.selected_gstnumber = null;
      this.selected_supplier_name = null;
      this.formDirectInvoice.patchValue({
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
      this.formDirectInvoice.get('customer_billing_state')?.value ==
      selectedStateId
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
      this.formDirectInvoice.patchValue({
        supplier_gst: this.selected_gstnumber,
        gst_supplier_name: this.selected_supplier_name,
      });
    } else {
      this.selected_gstnumber = null;
      this.selected_supplier_name = null;
      this.formDirectInvoice.patchValue({
        supplier_gst: null,
        gst_supplier_name: null,
      });
    }
  }

  addValidationForBilling() {
    this.formDirectInvoice
      .get('customer_billing_country')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('customer_billing_state')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('customer_billing_city')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('customer_billing_pin')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('customer_billing_add1')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('customer_billing_add2')
      ?.setValidators(Validators.required);
  }

  addValidationForShipping() {
    this.formDirectInvoice
      .get('shipping_country')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('shipping_state')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('shipping_city')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('shipping_pin')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('shipping_add1')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('shipping_add2')
      ?.setValidators(Validators.required);
  }

  addValidationForGST() {
    this.formDirectInvoice
      .get('supplier_gst')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('gst_supplier_name')
      ?.setValidators(Validators.required);
    this.formDirectInvoice
      .get('trade_name')
      ?.setValidators(Validators.required);
  }

  removeValidation() {
    this.formDirectInvoice.get('customer_billing_country')?.clearValidators();
    this.formDirectInvoice.get('customer_billing_state')?.clearValidators();
    this.formDirectInvoice.get('customer_billing_city')?.clearValidators();
    this.formDirectInvoice.get('customer_billing_pin')?.clearValidators();
    this.formDirectInvoice.get('customer_billing_add1')?.clearValidators();
    this.formDirectInvoice.get('customer_billing_add2')?.clearValidators();
    this.formDirectInvoice.get('supplier_gst')?.clearValidators();
    this.formDirectInvoice.get('gst_supplier_name')?.clearValidators();
    this.formDirectInvoice.get('trade_name')?.clearValidators();
    this.formDirectInvoice.get('shipping_country')?.clearValidators();
    this.formDirectInvoice.get('shipping_state')?.clearValidators();
    this.formDirectInvoice.get('shipping_city')?.clearValidators();
    this.formDirectInvoice.get('shipping_pin')?.clearValidators();
    this.formDirectInvoice.get('shipping_add1')?.clearValidators();
    this.formDirectInvoice.get('shipping_add2')?.clearValidators();
  }

  applyChanges() {
    Object.keys(this.formDirectInvoice.controls).forEach((field) => {
      const control = this.formDirectInvoice.get(field);
      control?.updateValueAndValidity();
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

 
  getAllCustomerList() {
    let data = {
      entity_id: this.entityId,
      financial_year_id: this.financial_year_id,
      employee_id: this.loginUser?.employee_id,
      userRole: this.loginUser?.role,
    };
    this.salesService.getAllCustomersList(data).subscribe((res: any) => {
      if (res) {
        this.customerList = res.data;
        this.filteredCustomerList = this.customerList;
      }
    });
  }

  ////////////////////Product
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

  getProductList(event: any, e:any,index: any) {
    
    let id = event.value ? event.value : event;

     new Promise<void>((resolve, reject) => {
      this.$productionService.getItemsBySubCategory(event.id??event,e.item_category_id ??e).subscribe((res: any) => {
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
  
  subCategory:any[]=[];
  getSubCategory(event: any, index: any) {  
     new Promise<void>((resolve, reject) => {
      this._configurationalMasterService.getSubCategory(event.value ?? event).subscribe((res: any) => {

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
  setItemDescription(item:any,index:number){
    
    this.productItems.at(index).patchValue({
      product_description: item.product_description,
      hsn_code: item?.MASTER_HSN_SAC_CODE.hsn_sac_code,
      uom_name: item?.MASTER_UOM.uom_name,
      cgst: item?.cgst,
      igst: item.igst,
      sgst: item.sgst,
      gst:item.isGst,
      discount:item.maximum_discount,
      price_per_unit: item.product_list_price,
    });
  }

  getAllProductVariant(data: any, index: any) {
    let data2 = this.productList[index]?.find((x: any) => x.id === data.value);

    return new Promise<void>((resolve, reject) => {
      this._configurationalMasterService
        .getProductVariantByproduct_id(data?.value ?? data)
        .subscribe(
          (res: any) => {
            if (res) {
              this.varientList[index] = res.data;
              this.filterVariant[index] = res.data;
              ;
              if (data2) {
                this.productItems.at(index).patchValue({
                  product_code: data2.product_code,
                  product_description: data2.product_description,
                  hsn_code: data2.hsn_sac_code,
                  uom_name: data2.uom_name,
                  price_per_unit: data2.product_list_price,
                  gst: data2.igst,
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
  checkQuantity(e: any, i: any) {
    let qty = parseInt(this.productItems.at(i).value.quantity);
    let remaining_qty = this.productItems.at(i).value.remaining_quantity;
    if (qty > remaining_qty) {
      this.productItems.at(i).patchValue({ quantity: null });
      return this.toster.error('Can not input more than remaining quantity!');
    }
  }
  addrow() {
    this.productItems.push(
      this._fb.group({
        product_category_id: [],
        product_master_id: [],
        product_code: [],
        variant_id: [],
        product_description: [],
        hsn_code: [],
        uom_name: [],
        quantity: [null, Validators.required],
        price_per_unit: [],
        discount: [],
        gst: [],
      })
    );
    this.getAllCategory(this.productItems.length - 1);
  }

  deleteRow(i: number) {
    if (this.productItems.length > 1) {
      this.productItems.removeAt(i);
      this.productCalculation();
    } else {
      this.toast.error('Must be at least one item', "Can't be deleted!");
    }
  }

  totalGST: number = 0;
  totalDiscount: number = 0;
  totalGSTPercent: number = 0;
  grandTotal: number = 0;
  formattedTotalIGST: any;
  formattedTotalDiscount: any;
  formattedGrandTotal: any;
  formattedTotalCGSTPercent: any;
  formattedTotalSGSTPercent: any;
  formattedTotalGSTPercent: any;
  totalCGSTforAdditionalCharge: any;
  totalSGSTforAdditionalCharge: any;
  totalIGSTforAdditionalCharge: any;

  productCalculation() {
    let formObj = this.formDirectInvoice?.value;
    let currentList = this.productItems.controls.map(
      (control) => control.value
    );

    this.totalGST = 0;
    this.totalDiscount = 0;
    this.grandTotal = 0;

    this.totalGSTPercent = 0;

    const additionalCharges = parseFloat(formObj?.additional_charges) || 0;

    currentList.forEach((item: any) => {
      const qty = Number(item?.quantity);
      let discountPercent;
      const pricePerUnit = Number(item?.price_per_unit);

      discountPercent = Number(item?.discount) || 0;

      const gstPercent = Number(item?.gst) || 0;

      const totalPrice = qty * pricePerUnit;
      const discountAmount = (totalPrice * discountPercent) / 100;
      const discountedPrice = totalPrice - discountAmount;

      const gstAmount = (gstPercent * discountedPrice) / 100;

      this.totalGST += gstAmount;
      this.totalDiscount += discountAmount;
      this.grandTotal += discountedPrice + gstAmount;

      this.totalGSTPercent += gstPercent;
    });

    this.grandTotal += additionalCharges;

    this.formattedTotalIGST = this.totalGST.toFixed(2);
    this.formattedTotalDiscount = this.totalDiscount.toFixed(2);
    this.formattedGrandTotal = this.grandTotal.toFixed(2);

    this.formattedTotalGSTPercent = this.totalGSTPercent.toFixed(2);

    this.totalIGSTforAdditionalCharge =
      (this.totalGSTPercent * additionalCharges) / 100;

    this.totalGST += this.totalIGSTforAdditionalCharge;
    this.formattedTotalIGST = this.totalGST.toFixed(2);

    this.grandTotal += this.totalIGSTforAdditionalCharge;
    this.formattedGrandTotal = this.grandTotal.toFixed(2);

    this.formDirectInvoice.patchValue({
      total_discount: this.formattedTotalDiscount,
      total_gst: this.formattedTotalIGST,
      grand_total: this.formattedGrandTotal,
    });
  }


  // createDirectInvoice() {
  //   console.log(this.formDirectInvoice,"kkkkkkkkkkkkkkkkkkkk")
  //   if (this.formDirectInvoice.invalid) {
  //     return this.toast.warning('Please fill all required fields!');
  //   }
  //   const productDetailList = this.formDirectInvoice.get('items') as FormArray;
  //   const totalQty = productDetailList.controls.reduce((sum, fg) => {
  //     const qty = fg.get('quantity')?.value || 0;
  //     return sum + Number(qty);
  //   }, 0);

  //   if (totalQty <= 0) {
  //     return this.toast.error(
  //       'Total quantity must be greater than 0!'
  //     );
  //   }

  //   let data = this.formDirectInvoice.value;

  //   let items = this.productItems.value.map((x: any) => ({
  //     ...x,
  //     igst: this.isSameState ? null : x.gst,
  //     sgst: this.isSameState ? x.gst/2 : null,
  //     cgst: this.isSameState ? x.gst/2 : null,
  //   }));

  //   data.items = items;
  //   data.customer_id = this.customerId;
  //   data.invoice_doc = this.uploadedFile;
  //   data.entity_id = this.entityId;
  //   data.financial_year_id = this.financial_year_id;
  //   // return
  //   this.salesService
  //     .createDirectInvoice(data)
  //     .subscribe(
  //       (res: any) => {
  //         this.toster.success(res.message);
  //         this.router.navigate(['/master/sales/sales-invoice-list']);
  //       },
  //       (err) => {
  //         if (err.status == 400) {
  //           this.toster.error('Something went Wrong!');
  //         } else {
  //           this.toster.error('Error in submission!');
  //         }
  //       }
  //     );
  // }
  createDirectInvoice() {
    console.log(this.formDirectInvoice, "kkkkkkkkkkkkkkkkkkkk");
  
    if (this.formDirectInvoice.invalid) {
      return this.toast.warning('Please fill all required fields!');
    }
  
    const productDetailList = this.formDirectInvoice.get('items') as FormArray;
    const totalQty = productDetailList.controls.reduce((sum, fg) => {
      const qty = fg.get('quantity')?.value || 0;
      return sum + Number(qty);
    }, 0);
  
    if (totalQty <= 0) {
      return this.toast.error('Total quantity must be greater than 0!');
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this invoice?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = this.formDirectInvoice.value;
  
        let items = this.productItems.value.map((x: any) => ({
          ...x,
          igst: this.isSameState ? null : x.gst,
          sgst: this.isSameState ? x.gst / 2 : null,
          cgst: this.isSameState ? x.gst / 2 : null,
        }));
  
        data.items = items;
        data.customer_id = this.customerId;
        data.invoice_doc = this.uploadedFile;
        data.entity_id = this.entityId;
        data.financial_year_id = this.financial_year_id;
  
        this.salesService.createDirectInvoice(data).subscribe(
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
      } else {
        this.toast.info('Invoice creation cancelled.');
      }
    });
  }

  genInvNoWithDate() {
      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '');
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      return 'INV' + formattedDate + randomNumber;
    
  }
}
