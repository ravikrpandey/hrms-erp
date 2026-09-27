import { Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AddVendorVehicleComponent } from '../add-vendor-vehicle/add-vendor-vehicle.component';
import { MatDialog } from '@angular/material/dialog';
import { VehicleDetailsComponent } from '../vehicle-details/vehicle-details.component';
@Component({
  selector: 'app-create-transport-request',
  templateUrl: './create-transport-request.component.html',
  styleUrls: ['./create-transport-request.component.scss']
})
export class CreateTransportRequestComponent {


  employee_id: any;
  UOMID: any;
  transportedByValue: any;
  vendorList: any;
  rowData: any[];
  action_type: any;
  pickupDateTimeMaterial: any;
  bomDetailsData: any;
  bomDetailsFormArray: any;
  taxStatus: any;
  getAllProductDetails: any;
  leadId: any;
  actionType: any;
  type: any;
  // CF_1: any;
  formDisabled: boolean;
  cetegory: any;
  productData: any;
  newRequestForm: FormGroup;
  entity_id: string | null;
  financial_year_id: string | null;
  loginUser: any;
  userLoginId: string | null;
  filterCountryControl: any;
  filteredCountryList: any;
  countryList: any;
  filterStateControl: any;
  filteredStateList: any;
  AllStateList: any;
  filterCityControl: any;
  allCityList: any;
  filteredCityList: any;
  categoryList: any[] = [];
  filterCategory2: any[] = [];
  filterCategory: any[] = [];
  productList: any[] = [];
  filterproduct: any[] = [];
  varientList2: any[] = [];
  varientList: any[] = [];
  filterVariant2: any[] = [];
  filterVariant: any[] = [];
  userDetail: any;
  private _commonService: any;
  states: any;
  stateList2: any;
  cityVar2: any;
  cityList: any;
  cityList2: any;
  cities: any;
  countryList2: any;
  stateList2D: any;
  AllStateListD: any;
  statesD: any;
  filteredCountryListD: any;
  cityListD: any;
  cityList2D: any;
  citiesD: any;
  showAction: any = [];
  itemType: any[] = [];         // Populate this with your actual item type data
  assetData: any[][] = [];      // 2D array for each row's asset categories
  getItemById: any[][] = [];
  vehicleTypeList: any[] = [];   // 2D array for each row's item master data
  viewDetails: string = '';     // e.g., 'view', 'edit', etc.
  itemsFormArray: any;
  typeStatus: any;
  id: any;
  getData: any;
  getData2: any;
  status: any;
  departments: any;
  departmentList: any;
  departmentList2: any;
  // router: any;
  tabTypeProduct: boolean = true
  tabTypeItem: boolean = false
  selectedVendorId: any;
  vehicleTypeList2: any;
  vendorList2: any;
  vendors: any;
  vehicles: any;
  constructor(private fb: FormBuilder,
    private location: Location,
    private $productionService: ProductionService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toster: ToastrService,
    private _empRegistration: EmpRegistrationService,
    private _transport_service: TransportManagementService,
    private router: Router, private activeroute: ActivatedRoute,
    private dialog: MatDialog

  ) {
    let userDetail: any = localStorage.getItem('signInUser');
    this.userDetail = JSON.parse(userDetail);
    console.log(this.userDetail)
    this.newRequestForm = this.fb.group({
      entity_id: [null, Validators.required],
      financial_year_id: [null, Validators.required],
      requestDateTime: [new Date(), Validators.required],
      requestId: [null, Validators.required],
      requestedBy: [(this.userDetail?.first_name + ' ' + this.userDetail?.last_name), Validators.required],
      department: [null, Validators.required],
      priority: [null, Validators.required],
      via: [null, Validators.required],
      transported_by: ['', Validators.required],
      vendor_id: [{ value: '', disabled: true }, Validators.required],
      vehicle_master_id: [{ value: '', disabled: true }, Validators.required],
      vehicle_category_id: [null, Validators.required],
      type_of_delivey: [null, Validators.required],
      type_of_sub_delivey: [null, Validators.required],
      type_of_supply: [null, Validators.required],
      pickaddress: [null, Validators.required],
      pickcountry_id: [null, Validators.required],
      pickstate_id: [null, Validators.required],
      pick_city_id: [null, Validators.required],
      pickup_pincode: [null, [Validators.required, Validators.maxLength(6)]],
      picktDateTime: [null, Validators.required],
      address: [null, Validators.required],
      delivery_country_id: [null, Validators.required],
      delivery_state_id: [null, Validators.required],
      delivery_city_id: [null, Validators.required],
      delivery_pincode: [null, [Validators.required, Validators.maxLength(6)]],
      deliverDateTime: [null, Validators.required],
      remarks: [null, Validators.required],
      selectedType: new FormControl(null),
      productItems: this.fb.array([this.createItems()]),
      ItemDetails: this.fb.array([this.createItemDetails()]),
      isProduct: [false],
      isItem: [false]
    });


    if (this.showAction === 'view') {
      this.newRequestForm.disable();  // disables all form controls — makes them read-only
    } else {
      this.newRequestForm.enable();   // enable if not view mode, just in case
    }
    this.newRequestForm.get('selectedType')?.valueChanges.subscribe(value => {
      this.productChargeTab(value);
    });
    this.productChargeTab(this.newRequestForm.get('selectedType')?.value);
  }

  goBack(): void {
    this.location.back();
  }



  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.employee_id = localStorage.getItem('EmpMainId')

    const storedUser = localStorage.getItem('signInUser');
    this.loginUser = storedUser ? JSON.parse(storedUser) : null;
    this.newRequestForm.get('entity_id')?.setValue(this.entity_id);
    this.newRequestForm.get('financial_year_id')?.setValue(this.financial_year_id);
    // 👇 Assuming your login object has name or user_id
    this.userLoginId = this.loginUser?.name || this.loginUser?.user_id || this.loginUser?.id || '';
    this.activeroute.queryParams.subscribe((params: any) => {
      this.typeStatus = params.status;
      this.id = params.id,
        console.log("params=======>", params)
    })
    this.getAllCategory(0);
    this.getAllCountry();
    this.TransportRequestGetById()
    this.getDepartment();
    this.getItemType();
    // this.getVehicleTypes()

    this.newRequestForm.get('transported_by')?.valueChanges.subscribe((value) => {
      this.transportedByValue = value;
      this.selectedVendorId = '';

      if (value === 'self') {
        setTimeout(() => {
          this.newRequestForm.get('vehicle_type')?.enable();
        });
        this.getAll_SelfvehicleMaster();
        this.newRequestForm.get('vendor_id')?.reset();
        this.newRequestForm.get('vendor_id')?.disable();
      } else if (value === 'vendor') {
        this.newRequestForm.get('vendor_id')?.enable();
        this.getAllVehicleVendor();
        this.newRequestForm.get('vehicle_type')?.reset();
        this.newRequestForm.get('vehicle_type')?.disable(); // enable later on vendor select
      } else {
        this.newRequestForm.get('vehicle_type')?.disable();
        this.newRequestForm.get('vendor_id')?.disable();
      }
    });

    // When a vendor is selected
    this.newRequestForm.get('vendor_id')?.valueChanges.subscribe((vendorId) => {
      this.selectedVendorId = vendorId;
      if (vendorId) {
        this.newRequestForm.get('vehicle_type')?.enable();
        this.getVehicleByVendor(vendorId);
      } else {
        this.newRequestForm.get('vehicle_type')?.reset();
        this.newRequestForm.get('vehicle_type')?.disable();
      }
    });

  }

  onVehicleSelect(selectedVehicleId: any) {
    this.viewVehicleDetails = selectedVehicleId
    const selectedVehicle = this.vehicleTypeList.find(v => v.id === selectedVehicleId);
    if (selectedVehicle) {
      this.newRequestForm.patchValue({
        vehicle_category_id: selectedVehicle.vehicle_category_id
      });
    }
  }
  changeTransaport(event: any) {
    this.viewVehicleDetails = ''
  }

  viewVehicleDetails: any;
  onVehicleSelect2(selectedVehicleId: any) {
    console.warn(selectedVehicleId, 'selectedVehicleId');
    this.viewVehicleDetails = selectedVehicleId
    const selectedVehicle = this.vehicleTypeList2.find((v: any) => v.id === selectedVehicleId);
    if (selectedVehicle) {
      this.newRequestForm.patchValue({
        vehicle_category_id: selectedVehicle.vehicle_category_id
      });
    }
  }



  getSelectedVendorText(): string {
    const selectedVendorId = this.newRequestForm.get('vendor_id')?.value;
    if (!selectedVendorId) {
      return 'Select Vendor';
    }

    const selectedVendor = this.vendorList?.find((vendor: any) => vendor?.id === selectedVendorId);
    return selectedVendor ? selectedVendor.vendor_name : 'Select Vendor';
  }



  getAllVehicleVendor() {
    this._transport_service.getAllVehicleVendor(this.entity_id, this.financial_year_id, this.employee_id)
      .subscribe({
        next: (res: any) => {
          this.vendorList = res?.data;
          this.vendorList2 = res?.data;
          console.log('Vendor List:', this.vendorList);

          this.rowData = [...this.vendorList];
          this.vendors = this.vendorList?.map((value: any) => value?.vendor_name)
        },
        error: (err) => {
          console.error('Error fetching vendors:', err);
        }
      });
  }

  getSelectedVehicleText(): string {

    const selectedId = this.newRequestForm.get('vehicle_master_id')?.value;
    const selectedVehicle = this.vehicleTypeList2?.find((v: any) => v?.id === selectedId);
    return selectedVehicle
      ? `${selectedVehicle.TM_VEHICAL_CATEGORY?.vehical_category_name || 'N/A'} --- ${selectedVehicle.vehicle_number}`
      : '';
  }


  // getVehicleByVendor(vendorId: any) {
  //   this._transport_service.getVehiclesByVendor(vendorId).subscribe({
  //     next: (res: any) => {
  //       this.vehicleTypeList2 = res.data;
  //        this.vehicles = this.vehicleTypeList2.map((value: any) => value.vehical_category_name && value.vehicle_number)
  //     },
  //     error: (err: any) => {
  //       console.error('Failed to load vehicles for vendor', err);
  //     }
  //   });
  // }
  getVehicleByVendor(vendorId: any) {
    this._transport_service.getVehiclesByVendor(vendorId).subscribe({
      next: (res: any) => {
        this.vehicleTypeList2 = res.data;

        this.vehicles = this.vehicleTypeList2.map((value: any) => {
          const category = value.TM_VEHICAL_CATEGORY?.vehical_category_name || 'N/A';
          return `${category} - ${value.vehicle_number}`;
        });
      },
      error: (err: any) => {
        console.error('Failed to load vehicles for vendor', err);
      }
    });
  }


  get CF_1(): any {
    return this.newRequestForm.controls;
  }

  getItemType() {
    this._configurationalMasterService.getItemType().subscribe(
      (res: any) => {
        if (res.data) {
          this.itemType = res.data;

        }
      },
      (err: any) => {
        console.log(err.error.message);
      }
    );
  }

  onTypeChange(value: any, isChecked: any): void {
    if (isChecked) {
      this.newRequestForm.get('selectedType')?.setValue(value);
    } else {

      this.newRequestForm.get('selectedType')?.setValue(null);
    }
  }
  TransportRequestGetById() {
    this._transport_service.getTransportRequestById(this.id).subscribe((res: any) => {
      console.log(res, "<<<<<<<<<<<<<<<<<<<");

      this.getData = res.data;
      // this.getData2 = res.itemData[0];

      let productData = res?.productData
      let itemData = res?.itemData


      this.basicFormPatch(this.getData, productData, itemData);
      this.CF_1.productItems = this.patchData(productData);
      this.CF_1.ItemDetails = this.patchDataItem(itemData);

    })
  }

  basicFormPatch(data: any, product: any, item: any) {

    this.getStateByCountry(data.pick_country_id);
    this.getCityByState(data.pick_state_id);
    this.getStateByCountryD(data.delivery_country_id);
    this.getCityByStateD(data.delivery_state_id);
    this.viewVehicleDetails = data.vehicle_master_id
    this.newRequestForm.patchValue({
      requestId: data?.request_id,
      requestDateTime: data.request_datetime,
      requestedBy: data.requested_by,
      department: data.department_id,
      pickaddress: data.pickup_location,
      address: data.delivery_location,
      picktDateTime: data.requested_pickup_datetime,
      deliverDateTime: data.requested_delivery_datetime,
      priority: data.priority_level,
      vendor_id: data.vendor_id,
      vehicle_master_id: data.vehicle_master_id,
      transported_by: data.transported_by,
      type_of_delivey: data.delivery_type,
      type_of_sub_delivey: data.subdelivery_type,
      type_of_supply: data.supply_type,
      vehicle_type: data.vehicle_type_id || null,
      itemCategory: data.item_category,
      itemDescription: data.item_description,
      hsn: data.hsn,
      uom: data.uom,
      quantity: data.quantity,
      amount: data.amount,
      gst: data.gst,
      totalAmount: data.total_amount,
      via: data.via,
      remark: data.remark,
      status: data.status,
      statusType: data.status_type,
      entityId: data.entity_id,
      financialYearId: data.financial_year_id,
      pickcountry_id: data.pick_country_id,
      // pickstate_id: data.pick_state_id,// ok
      pick_city_id: data.pick_city_id,//
      pickup_pincode: data.pickup_pincode || 0,//
      delivery_country_id: data.delivery_country_id,
      // delivery_state_id: data.delivery_state_id,  //
      delivery_city_id: data.delivery_city_id,//
      delivery_pincode: data.delivery_pincode || 0,//
      remarks: data?.remark,
      isProduct: data?.isProduct,
      isItem: data?.isItem


    });
    const formArray = this.newRequestForm.get('ItemDetails') as FormArray;
    while (formArray.length < item.length) {
      formArray.push(this.createItemDetails());

    }
    formArray.patchValue(item)


  }

  patchData(data: any[]): FormArray {
    const formArray: any = new FormArray([]);

    data?.forEach((item, index) => {
      const group: any = new FormGroup({
        id: new FormControl(item?.id || null),
        product_category_id: new FormControl(item?.product_cat_id || null),
        product_sub_category_id: new FormControl(item?.pro_sub_cat_id || null),
        product_master_id: new FormControl(item?.product_master_id || null),
        variant_id: new FormControl(item?.variant_id || null),
        product_description: new FormControl(item?.product_description || null),
        hsn_code: new FormControl(item?.hsn_code || null),
        quantity: new FormControl(item?.quantity || null, Validators.required),
        price_per_unit: new FormControl(item?.price_per_unit || null, Validators.required),
        total_price: new FormControl(item?.total_price || null),
        uom_name: new FormControl(item?.uom_name || null),

        // Optional fields
        delivered_qty: new FormControl(item?.delivered_qty || null),
        discount_approved: new FormControl(item?.discount_approved || null),
        discount_request: new FormControl(item?.discount_request || null),
        maximum_discount: new FormControl(item?.maximum_discount || null),
        tax: new FormControl(item?.tax || null),

        // Extra placeholders
        readonly: new FormControl(false),
        gst_type: new FormControl(null),
        cgst: new FormControl(null),
        sgst: new FormControl(null),
        igst: new FormControl(null),
        product_code: new FormControl(null),
        select_scheme: new FormControl(null),
        hsn_code_id: new FormControl(null),
        uom_id: new FormControl(null),
      });

      formArray.push(group);

      // Fetch dependent dropdowns after pushing
      this.getAllActiveProduct(item.product_cat_id, index).then(() => {
        this.getAllProductVariant(item?.product_master_id, index);
      });
    });

    return formArray;
  }

  patchDataItem(data: any[] = []): FormArray {

    const formArray: any = new FormArray([]);

    // If data exists, patch each item
    if (data.length > 0) {
      data.forEach((item, index) => {
        ;
        const group: any = new FormGroup({
          id: new FormControl(item?.id || null),
          item_type_id: new FormControl(item?.item_type_id || null, Validators.required),
          asset_id: new FormControl(item?.asset_id || null, Validators.required),
          item_master_id: new FormControl(item?.item_master_id || null, Validators.required),
          item_code: new FormControl(item?.item_code || null),
          bom_qty: new FormControl(item?.bom_qty || null, Validators.required),
          type: new FormControl(item?.type || null, Validators.required),
          price: new FormControl(item?.price || null, Validators.required),
          uom_id: new FormControl(item?.MASTER_UOM?.uom_name || null, Validators.required),
        });

        formArray.push(group);

        // Load dependent dropdown data
        this.getCategoryVal(item.item_type_id, index);
        this.getAssetCateVal(item.asset_id, index);
      });
    } else {
      // No data — add one empty row
      formArray.push(this.createItemDetails());
    }

    return formArray;
  }

  openVendorDialog() {


    const dialogRef = this.dialog.open(AddVendorVehicleComponent, {
      width: '600px',
      data: { id: this.selectedVendorId },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.warn(result, 'result');

      this.getVehicleByVendor(result.vendor_id)
    });

  };



  get productItems(): FormArray {
    return this.newRequestForm.get('productItems') as FormArray;
  }

  get ItemDetails(): FormArray {
    return this.newRequestForm.get('ItemDetails') as FormArray;
  }

  createItems(): FormGroup {
    const group = this.fb.group({
      product_category_id: [],
      product_master_id: [],
      variant_id: [],
      product_description: [],
      hsn_code: [],
      delivered_qty: [],
      quantity: [null, Validators.required],
      price_per_unit: [null, Validators.required],
      uom_name: [],
      maximum_discount: [],
      discount_request: [],
      discount_approved: [],
      tax: [],
      total_price: [{ value: null, disabled: true }],
    });


    group.get('quantity')!.valueChanges.subscribe(() => {
      this.updateTotalPrice(group);
    });

    group.get('price_per_unit')!.valueChanges.subscribe(() => {
      this.updateTotalPrice(group);
    });

    return group;
  }

  updateTotalPrice(group: FormGroup) {
    const quantity = group.get('quantity')!.value || 0;
    const pricePerUnit = group.get('price_per_unit')!.value || 0;
    const total = quantity * pricePerUnit;
    group.get('total_price')!.setValue(total, { emitEvent: false });
  }




  createItemDetails(): FormGroup {
    return this.fb.group({
      item_type_id: [null, Validators.required],
      asset_id: [null, Validators.required],
      item_master_id: [null, Validators.required],
      item_code: [{ value: '', disabled: true }, Validators.required],
      bom_qty: [null, Validators.required],
      type: [null, Validators.required],
      price: [null, Validators.required],
      uom_id: [null, Validators.required]
    });
  }


  addItem2(): void {
    this.ItemDetails.push(this.createItemDetails());
    this.assetData.push([]); // Add a new array for assetData per row
    this.getItemById.push([]); // Add a new array for item data per row
  }

  removeItem2(index: number): void {
    this.itemsFormArray.removeAt(index);
    this.assetData.splice(index, 1);
    this.getItemById.splice(index, 1);
  }


  getCategoryVal(data: any, index: any): void {
    // Fetch and update assetData[index] based on selected item type
    this.assetData[index] = []
    this._configurationalMasterService.getSfgType(data).subscribe((res: any) => {
      let a = res.data
      console.log(a);

      this.assetData[index] = a;
      console.log(this.assetData);

    })
  }

  getAssetCateVal(data: any, i: any) {
    this.$productionService.getItemById(data).subscribe((response: any) => {
      this.getItemById[i] = response.data;
      // if (!this.UOMID) {
      //   const bomDetailsArray = this.addProductionForm.get('bomDetails') as FormArray;
      //   if (i >= 0 && i < bomDetailsArray.length) {
      //     const control = bomDetailsArray.at(i) as FormGroup;
      //     control.get('item_code')?.reset('');
      //     control.get('uom_id')?.reset(null);
      //   }
      // }
    })
  }

  getItemData(data: any, index: number): void {
    console.log(data);
    const control = this.ItemDetails.at(index);
    control.patchValue({
      item_code: data.MASTER_ITEM?.item_code || '',
      uom_id: data.MASTER_ITEM?.MASTER_UOM?.uom_name || ''
    });
  }

  viewItem(index: number): void {
    // Implement view logic
  }

  addItem(i: any) {
    const newIndex = i + 1;

    // Add form group
    this.productItems.push(this.createItems());

    // Initialize lists
    this.categoryList[newIndex] = [];
    this.productList[newIndex] = [];
    this.varientList[newIndex] = [];
    this.filterproduct[newIndex] = [];

    // Fetch categories for the new row
    this.getAllCategory(newIndex);

  }


  removeItem(index: number) {
    this.productItems.removeAt(index);
  }


  filterCategories(event: any, index: number) {
    this.categoryList[index] = this.filterCategory[index].filter(
      (category: any) =>
        category.category_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );
  }
  selectedVarient(event: any, i: any) { }

  filterProductVariant(event: any, index: number) {
    this.varientList[index] = this.filterVariant[index].filter((variant: any) =>
      variant.variant_name
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
  }
  stateFilter(e: any) {
    const aa = e
    let filteredVariable = this.stateList3.filter((item: any) => aa.includes(item.states_name));
    this.AllStateList = filteredVariable
  }


  stateFilterD(filteredNames: string[]) {
    this.AllStateListD = this.stateListDel.filter((state: any) =>
      filteredNames.includes(state.states_name)
    );
  }

  checkQuantity(e: any, i: any) {
    let qty = parseInt(this.productItems.at(i).value.quantity);
    let remaining_qty = this.productItems.at(i).value.remaining_quantity;
    if (qty > remaining_qty) {
      this.productItems.at(i).patchValue({ quantity: null });
      return this.toster.error('Can not input more than remaining quantity!');
    }
  }

  filterProduct(event: any, index: number) {
    this.productList[index] = this.filterproduct[index].filter((product: any) =>
      product.product_name
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
  }

  getAllActiveProduct(event: any, index: any) {
    let id = event.value ? event.value : event;

    return new Promise<void>((resolve, reject) => {
      this.$productionService.getAllActiveProduct(id, this.entity_id).subscribe(
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

  getAllCategory(i: any) {
    return new Promise<void>((resolve, reject) => {
      this.$productionService.getAllCetegory(this.entity_id).subscribe(
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
              // After getting the product variant data, we patch values like product_description, hsn_code, etc.
              if (data2) {
                this.productItems.at(index).patchValue({
                  product_description: data2.product_description,
                  hsn_code: data2.hsn_sac_code,
                  uom_name: data2.uom_name,
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

  departmentFilter(e: any) {
    const aa = e
    let filteredVariable = this.departmentList2.filter((item: any) => aa.includes(item.department_name));
    this.departmentList = filteredVariable
  }

  vendorFilter(e: any) {
    const aa = e
    let filteredVariable = this.vendorList2.filter((item: any) => aa.includes(item.vendor_name))
    this.vendorList = filteredVariable
  }

  vehicleFilter(e: any) {
    const aa = e
    let filteredVariable = this.vehicleTypeList2.filter((item: any) => aa.includes(item.vehical_category_name && item.vehicle_number))
    this.vehicleTypeList2 = filteredVariable
  }


  onCancel(): void {
    this.newRequestForm.reset();
  }
  countryList3: any = []
  countryList4: any = []
  countryList5: any = []
  countryListD: any = []
  countryListD1: any = []
  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.countryList2 = res.data;
        this.countryList5 = res.data;
        this.countryList3 = this.countryList2.map((res: any) => { return res.countryss_name })
        this.countryListD = this.countryList5
        this.countryListD1 = this.countryList5


      })

  };
  countryFilterDeliver(e: any) {
    const aa = e
    let filteredVariable = this.countryListD1.filter((item: any) => aa.includes(item.countryss_name));
    this.countryListD = filteredVariable
  }
  countryFilterPick(e: any) {
    const aa = e
    let filteredVariable = this.countryList2.filter((item: any) => aa.includes(item.countryss_name));
    this.countryList = filteredVariable
  }

  stateList3: any = []
  stateList4: any = []
  getStateByCountry(id: any) {
    this._commonService?.showLoader()
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        this.AllStateList = res.data;
        this.stateList2 = res.data;
        this.stateList4 = res.data;
        this.states = this.stateList2.map((value: any) => value.states_name)
        this.stateList3 = this.stateList4
        this.AllStateList?.forEach((element: any) => {
          if (this.getData?.pick_state_id === element?.states_id) {
            this.newRequestForm.patchValue({
              pickstate_id: element?.states_id
            })
          }
        });

      }, (err: any) => {
        this._commonService?.hideLoader()
      }
    )
  }

  AllStateListD1: any = []
  stateListDel: any = []
  getStateByCountryD(id: any) {
    this._commonService?.showLoader()
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        this.AllStateListD = res.data;
        this.stateList2D = res.data;
        this.AllStateListD1 = res.data;
        this.statesD = this.stateList2D.map((value: any) => value.states_name)
        this.stateListDel = this.AllStateListD1
        this.AllStateListD?.forEach((element: any) => {
          if (this.getData?.delivery_state_id === element?.states_id) {
            this.newRequestForm.patchValue({
              delivery_state_id: element?.states_id
            })
          }
        });
      }, (err: any) => {
        this._commonService?.hideLoader()
      }
    )

  }


  getCityByState(id: any) {
    this._commonService?.showLoader()
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        this.cityList = res.data;
        this.cityList2 = res.data;
        this.cities = this.cityList.map((value: any) => value.city_name)
        // if(this.editBankData || this.pachdata){
        //   this.bankForm.controls['branch_id'].patchValue(Number(this.editBankData?.branch_id || this.pachdata.branch_id))
        // }
      }, (err: any) => {
        this._commonService?.hideLoader()
      }
    )
  };
  getCityByStateD(id: any) {
    this._commonService?.showLoader()
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        this.cityListD = res.data;
        this.cityList2D = res.data;
        this.citiesD = this.cityListD.map((value: any) => value.city_name)
        // if(this.editBankData || this.pachdata){
        //   this.bankForm.controls['branch_id'].patchValue(Number(this.editBankData?.branch_id || this.pachdata.branch_id))
        // }
        this.cityListD?.forEach((element: any) => {
          if (this.getData?.delivery_city_id === element?.city_id) {
            this.newRequestForm.patchValue({
              delivery_city_id: element?.city_id
            })
          }
        });
      }, (err: any) => {
        this._commonService?.hideLoader()
      }
    )
  };
  cityFilter(e: any) {
    const aa = e
    let filteredVariable = this.cityList2.filter((item: any) => aa.includes(item.city_name));
    this.cityList = filteredVariable
  }
  cityFilterD(e: any) {
    const aa = e
    let filteredVariable = this.cityList2D.filter((item: any) => aa.includes(item.city_name));
    this.cityListD = filteredVariable
  }

  stateChangeD(e: any) {
    this.getCityByStateD(e.value);

  }
  stateChange(e: any) {
    this.getCityByState(e.value);

  }

  onChangeCountry(e: any) {
    this.filterStateControl;
    this.getStateByCountry(e.value);
  }
  onChangeCountryD(e: any) {
    this.filterStateControl;
    this.getStateByCountryD(e.value);
  }

  getDepartment() {

    this._commonService?.showLoader()
    this._configurationalMasterService.getDepartmentActive(this.entity_id).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.departmentList = res.data;
      this.departmentList2 = res.data;
      this.departments = this.departmentList.map((value: any) => value.department_name)
    }, (err: any) => {

      console.log(err)
      this._commonService?.hideLoader()
    });
  }
  getAll_SelfvehicleMaster() {
    this._transport_service.getAll_SelfvehicleMaster(
      this.entity_id,
      this.financial_year_id,
      // this.loginUser?.role,
      this.loginUser?.employee_id
    ).subscribe(
      (res: any) => {
        console.log('Vehicle Type Response:', res);
        if (res && res.data) {
          this.vehicleTypeList = res.data;
          console.log('Dropdown List:', this.vehicleTypeList);
          console.log(Array.isArray(this.vehicleTypeList));

        }
      },
      (err: any) => {
        console.error('Error fetching vehicle types:', err);
      }
    );
  }



  // tabType: any;
  productChargeTab(value: string) {
    if (value === 'product') {
      this.tabTypeProduct = true;
      this.tabTypeItem = false;
    } else {
      this.tabTypeItem = true;
      this.tabTypeProduct = false;
    }
  }


  toggleProductTab(isChecked: boolean) {
    this.tabTypeProduct = isChecked;
  }

  toggleItemTab(isChecked: boolean) {
    this.tabTypeItem = isChecked;
  }



  // onSubmit(): void {
  //   if (this.newRequestForm) {
  //     let data={
  //       ...this.newRequestForm.value,
  //       employee_id:this.employee_id
  //     }
  //     this._transport_service.createTransportRequest(data).subscribe({
  //       next: (res: any) => {
  //         console.log('Transport Request created successfully:', res);
  //         // Optionally, reset form or navigate to another page
  //         this.newRequestForm.reset();
  //         this.router.navigate(['master/transport-management/transport-request/request-list']);
  //       },
  //       error: (err: any) => {
  //         console.error('Error while creating Transport Request:', err);
  //         // Show user-friendly error message
  //       }
  //     });

  //   } else {
  //     // this.newRequestForm.markAllAsTouched(); // show validation errors
  //     console.warn('Form is invalid');
  //   }
  // }



  //   onSubmit(): void {
  //   if (!this.newRequestForm) {
  //     console.warn('Form is invalid');
  //     return;
  //   }

  //   const data = {
  //     ...this.newRequestForm.value,
  //     employee_id: this.employee_id
  //   };

  //   this._transport_service.createTransportRequest(data).subscribe((res:any)=> {
  //       console.log('Transport Request created successfully:', res);
  //       this.newRequestForm.reset();
  //       this.router.navigate(['master/transport-management/transport-request/request-list']);
  //     },
  //     err => {
  //       console.log('Error while creating Transport Request:', err);
  //     }
  //   );
  // }


  onSubmit() {
    if (this.typeStatus === 'update') {
      this.updateRequest(); // Call update API
    } else {
      this.createRequest(); // Call create API
    }
  }

  createRequest() {
    if (!this.newRequestForm) {
      console.warn('Form is invalid');
      return;
    }

    const data = {
      ...this.newRequestForm.value,
      employee_id: this.employee_id
    };

    this._transport_service.createTransportRequest(data).subscribe((res: any) => {
      console.log('Transport Request created successfully:', res);
      this.newRequestForm.reset();
      this.router.navigate(['master/transport-management/transport-request/request-list']);
    },
      err => {
        console.log('Error while creating Transport Request:', err);
      }
    );
  }

  updateRequest() {
    if (!this.newRequestForm) {
      console.warn('Form is invalid');
      return;
    }

    // Clone form value and remove 'id' field from payload if it exists
    const formData = { ...this.newRequestForm.value };
    delete formData.id; // Important step

    const data = {
      ...formData,
      employee_id: this.employee_id
    };

    this._transport_service.updateRequest(this.id, data).subscribe({
      next: (response: any) => {
        console.log('Request updated successfully:', response);
        // Reset or navigate
        this.newRequestForm.reset();
        this.router.navigate(['master/transport-management/transport-request/request-list']);
      },
      error: (error: any) => {
        console.error('Error updating request:', error);
      }
    });
  }




  openVehicleDetailsDialog(): void {



    const dialogRef = this.dialog.open(VehicleDetailsComponent, {
      width: '500px',
      data: this.viewVehicleDetails

    });

    dialogRef.afterClosed().subscribe(result => {
      // Optional: handle after close
      console.log('Dialog closed');
    });
  }
  vehicle_id: any;
  getVehicleId(data: any) {
    if (data.id) {
      this.vehicle_id = data.id;
    } else {
      this.vehicle_id = '';
    }

  }



}


