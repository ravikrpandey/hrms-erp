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
  selector: 'app-create-direct-delivery-challan',
  templateUrl: './create-direct-delivery-challan.component.html',
  styleUrls: ['./create-direct-delivery-challan.component.scss']
})
export class CreateDirectDeliveryChallanComponent {
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
  customerDetails:any;
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
  delveryChallanSubType:any;
  challandata:any;
  userLoginId: any;
  loginUser:any
  challanOutward:any = [
    { description: "Supply", code: 1 },
    { description: "Export", code: 3 },
    { description: "Job Work", code: 4 },
    { description: "For Own Use", code: 5 },
    { description: "Others", code: 8 },
    { description: "SKD/CKD", code: 9 },
    { description: "Line Sales", code: 10 },
    { description: "Recipient Not Known", code: 11 },
    { description: "Exhibition or Fairs", code: 12 },
  ];
  
  challanInward = [
    { description: "Supply", code: 1 },
    { description: "Import", code: 2 },
    { description: "For Own Use", code: 5 },
    { description: "Job work Returns", code: 6 },
    { description: "Sales Return", code: 7 },
    { description: "Others", code: 8 },
    { description: "SKD/CKD", code: 9 },
    { description: "Exhibition or Fairs", code: 12 },
  ];
  
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
     const customer_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
   
    this.frmDeliveryChallan = this._fb.group({
      do_type: [null, Validators.required],
      supply_type: [null, Validators.required],
      delChallan_supply_type: [null, Validators.required],
      do_date: [null, Validators.required],
      do_no: [null, Validators.required],
      customer_id: [null, Validators.required],
      customer_name: [null],
      customer_code: [customer_code, Validators.required],
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
      notes:  [null],
      terms_and_conditions:  [null],
      items: this._fb.array([this.createItems()]),
      returnableItems: this._fb.array([this.createReturnableItems()]),
    });

    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');

    let a: any = localStorage.getItem('signInUser');
    this.userLoginId = localStorage.getItem('EmpMainId');
    this.loginUser = JSON.parse(a);

    this.generateDeliveryOrderNumber(this.financial_year_id);
    this.getAllActiveTransType();
    this.branchSetup_get();
    this.getAllCategory(0);
    this.getAllCountry();
    this.getAllCategory2(0);
    this.getAllSupplyType();
    this.getAllDocumentType();
    this.searchFilter();
    this.getAllExistingClient();
    this._active.queryParams.subscribe((res: any) => {
      this.proposal_id = res?.sales_id;

      this.status_type = res?.status_type;
      this.doId = res?.id;
      if (this.status_type === 'viewChallan') {
        this.isView = true;
        // this.invoiceNo = res?.invoiceNo;
        // this.invoiceDate = res?.invoice_date
      }

      if (this.doId && this.status_type) {
        this.getChallaData(this.doId);
        this.getCDKData(this.entityId);
      }

      // "generate_irn"
      this.getAllCategory(0);
      if (res?.sales_id) {
        this.getsalesOrderListByid(res?.sales_id);
      }
    });
    // const customer_code = btoa(Math.random().toString())
    //   .slice(0, 10)
    //   .toUpperCase();
    // this.frmDeliveryChallan.patchValue({
    //   customer_code: customer_code,
    // });

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


  onchangeDeliveryChallan(event:any){
    let data;
    if(event.value){
      data = event.value;
    }else{
      data = event;
    }
   
    if(data == 1){
      this.delveryChallanSubType = this.challanInward;
    }else{
      this.delveryChallanSubType = this.challanOutward;
    }
  }

  getAllProductDetails: any = [];
  getsalesOrderListByid(id: any) {
    this.salesService.salesOderByid(id).subscribe((res: any) => {
      this.customerId=res.data.customer_id
      if(this.customerId){
        this.getCustomerDetailsById();
      }
      let obj = res.data;
      this.getAllProductDetails = obj?.productDetailList;

      if (res) {
        // setTimeout(() => {
        //   this.setAllData(obj);
        // }, 100);
        this.frmDeliveryChallan.patchValue({
          customer_id: this.customerId,
          // proposal_no: res.data.proposal_no,
          // company_name: res.data.company_name,
        });
        this.patchItems(obj);
      }
    });
  }

  irnProductList: any = [];

  async getChallaData(doId: any) {
    await this.$crm.getChallaData(doId).subscribe({
      next: async (res) => {
        
        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",res);
        let data = { productDetailList: res.data?.productData };
        let doData = res.data?.challanData;
        this.challandata = doData;
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
      delChallan_supply_type: parseInt(doData.delChallan_supply_type),
      do_date: doData.do_date,
      do_no: doData.do_no,
      customer_id: doData.customer_id,
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
      customer_gst_number:doData.customer_gst_number
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
    await this.onchangeDeliveryChallan(doData.supply_type_id);
  }

  clientData:any=[]
getAllExistingClient(){
  let data={
    entity_id:this.entityId,
    financial_year_id:this.financial_year_id,
    employee_id:this.userLoginId,
    userRole:this.loginUser?.role
  }
  this.salesService
  .getAllCustomersList(data)
  .subscribe((res: any) => {
    if (res) {
      this.clientData = res.data;
    }
  });
}
getCustomer(customer:any){
  this.customerId = customer;
  const client = this.clientData.find((element: any) => element.id === this.customerId);
  const companyName = client ? client.company_name : null;
  const customerCode = client ? client.customer_code : null;

  this.frmDeliveryChallan.patchValue({
    customer_name:companyName,
    customer_code:customerCode
  })

  this.getCustomerDetailsById();
}
  getCustomerDetailsById(){
    try {
      this.$crm.getCustomerDetailsById(this.customerId).subscribe(
        async (response: any) => {
          if (response) {
            this.customerDetails = response.data[0];
            await this.customerBillingCountryChange(this.customerDetails.billing_country_id);
            await this.customerBillingStateChange(this.customerDetails.billing_state_id);
            await this.shippingCountryChange(this.customerDetails.shipping_country_id);
            await this.shippingStateChange(this.customerDetails.shipping_state_id);

            this.frmDeliveryChallan.patchValue({
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
              // customer_code: this.customerDetails.customer_code,
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
      product_category_id: [null, Validators.required],
      product_master_id: [null, Validators.required],
      variant_id: [null, Validators.required],
      product_description: [],
      hsn_code: [null, Validators.required],
      product_sub_category_id:[null, Validators.required],
      // proposed_quantity: [],
      // delivered_qty: [],
      // remaining_quantity: [],
      quantity: [null, Validators.required],
      price_per_unit: [null, Validators.required],
      uom_name: [],
      maximum_discount: [],
      discount_request: [],
      discount_approved: [],
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

  addItemRow(index:any) {
    if (this.productItems.invalid) {
      return this.toast.warning("Please add row data!");
    }
  
    this.productItems.push(this.createItems());
    this.getAllCategory(index+1);
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
  // async patchItems(items: any) {
  //   this.productItems.clear();

  //   for (let i = 0; i < items?.productDetailList.length; i++) {
  //     const ele = items.productDetailList[i];
  //     this.addItem();

  //     // Patch the values to the newly added FormGroup
  //     const lastItem = this.productItems.at(
  //       this.productItems.length - 1
  //     ) as FormGroup;
  //     lastItem.patchValue({
  //       product_category_id: ele.product_category_id,
  //       product_master_id: ele.product_master_id,
  //       variant_id: ele.variant_id,
  //       product_description: ele.product_description,
  //       hsn_code: ele.hsn_sac_code,
  //       // proposed_quantity: ele.proposed_quantity,
  //       // delivered_qty: ele.delivered_qty,
  //       // remaining_quantity: ele.remaining_quantity,
  //       quantity: ele.quantity,
  //       uom_name: ele.uom_name,
  //       maximum_discount: ele.maximum_discount,
  //       discount_request: ele.discount_request,
  //       discount_approved: ele.discount_approved,
  //       igst: ele.igst,
  //       sgst: ele.sgst,
  //       cgst: ele.cgst,
  //       price_per_unit: ele.price_per_unit,
  //     });

  //     // Now, execute the asynchronous methods sequentially
  //     await this.getAllCategory(i); // Ensure this completes first
  //     await this.getAllActiveProduct(ele.product_category_id, i); // Then, call this
  //     await this.getAllProductVariant(ele.product_master_id, i); // Finally, this
  //   }
  // }
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
        product_sub_category_id: ele.pro_sub_cat_id || null,
        product_master_id: ele.product_master_id,
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

      await this.getAllCategory(i); // Ensure this completes first
      await this.getProductList(ele.pro_sub_cat_id,ele.product_category_id, i); // Then, call this
      await this.getSubCategory(ele.product_category_id,i);
      // Now, execute the asynchronous methods sequentially
      // await this.getAllProductVariant(ele.product_master_id, i); // Finally, this
    }
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
          this.categoryList = res.data;
          this.filterCategory[i] = res.data;
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

    return new Promise<void>((resolve, reject) => {
      this.$productionService.getAllActiveProduct(id, this.entityId).subscribe(
        (res: any) => {
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
  setItemDescription(item:any,index:number){
    

    let uom = item.MASTER_UOM.uom_name;
    let hsnCode = item.MASTER_HSN_SAC_CODE.hsn_sac_code
    this.productItems.at(index).patchValue({
      product_description: item.product_description,
      hsn_code: hsnCode,
      uom_name: uom,
      price_per_unit:item.product_list_price,
      igst: item.igst,
      sgst: item.sgst,
      cgst: item.cgst,
      

    });
  }
  // getAllCategory(i: any) {
  //   return new Promise<void>((resolve, reject) => {
  //     this.$productionService.getAllCetegory(this.entityId).subscribe(
  //       (res: any) => {
  //         this.categoryList[i] = res.data;
  //         console.log("this.categoryListthis.categoryList",this.categoryList)
  //         this.filterCategory[i] = res.data;
  //         resolve();
  //       },
  //       (err: any) => {
  //         reject(err);
  //       }
  //     );
  //   });
  // }

  getAllProductVariant(data: any, index: any) {
    let data2 = this.productList[index]?.find((x: any) => x.id === data.value);
console.log("data2data2data2",data2)
    return new Promise<void>((resolve, reject) => {
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
                  product_description: data2.product_description,
                  hsn_code: data2.hsn_sac_code,
                  uom_name: data2.uom_name,
                  maximum_discount: data2.maximum_discount,
                  igst: data2.igst,
                  sgst: data2.sgst,
                  cgst: data2.cgst,
                  price_per_unit: data2.product_mrp,
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
      variant_id: [],
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
            this.branchList = response.data.filter((element: any) => {
              return element.billing_status === true;
            });
            
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
      billing_country: selectedBranchDetails.MASTER_COUNTRY?.countryss_id,
      billing_state: selectedBranchDetails.MASTER_STATE?.states_id,
      billing_city: selectedBranchDetails.MASTER_CITY?.city_id,
      billing_pin: selectedBranchDetails?.branch_pin_code,
      billing_add1: selectedBranchDetails?.branch_address,
      billing_add2: selectedBranchDetails?.branch_address,
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
        (err: any) => {}
      );
  }

  selectedVarient(event: any, i: any) {}
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
        this.customerFilteredBillCountry =  res.data;
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
    // console.log("this.productItemsthis.productItems",this.productItems)
    let items = this.productItems.value.map((x: any) => ({
      ...x,
      igst: this.isSameState ? null : x.igst,
      sgst: this.isSameState ?x.igst/2: x.sgst ,
      cgst: this.isSameState ? x.igst/2:x.cgst ,
    }));

    data.items = items;
    // data.proposal_id = this.proposal_id;
    data.customer_id = this.customerId;
    data.challanDoc = this.uploadedFile;
    data.challan_type_status = 'DIRECT';
    data.states_code = this.selectedStateCode;
    
    this.salesService
      .createChallan(data, this.entityId, this.financial_year_id)
      .subscribe(
        (res: any) => {
          this.toster.success(res.message);
          this.router.navigate(['/master/sales/delivery-challan-list']);
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
  
}

