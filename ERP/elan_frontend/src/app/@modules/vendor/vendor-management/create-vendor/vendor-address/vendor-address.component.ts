import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-address',
  templateUrl: './vendor-address.component.html',
  styleUrls: ['./vendor-address.component.scss'],
})
export class VendorAddressComponent {
  addressForm: any;
  entity_id: any;
  actionType: any;

  @Input() control!: AbstractControl;

  finance_id: any;
  employee_id: any;
  store_id: any = [];
  loginUserDetails: any;
  role: any;
  action_type: any;
  filteredshippingCountry: any;
  filteredBillCountry: any;
  filterBillCountryControl = new FormControl();
  filterShipCountryControl = new FormControl();
  filterBillStateControl = new FormControl();
  filterShipStateControl = new FormControl();
  filterShipCityControl = new FormControl();
  filterBillingCityControl = new FormControl();
  plant: any = [];
  plantList: any = [];
  billingCountryList: any;
  myFlagForSlideToggle: boolean = false;
  vendor_id: any;
  billingSteteData: any = [];
  shippingSteteData: any[] = [];
  billingCityList: any = [];
  shippingCityList: any[] = [];
  shippingCountryList: any = [];
  filteredshippingSteteData: any;
  filteredbillingSteteData: any;
  filtershippingCityList: any;
  filterBillingCityList: any;
  lead_id: any;
  singleData: any;
  id: any;
  postOffice: any[] = [];
  billingPostOffice: any[] = [];
  new_vendor: any;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private toaster: ToastrService,
    private salesService: SalesService,
    private router: Router,
    private vendorService: VendorManagementService,
    private acctivate: ActivatedRoute,
    private _empRegistration: EmpRegistrationService,
    private comman_service: CommonService,
  ) {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.finance_id = localStorage.getItem('financial_id');
    this.employee_id = localStorage.getItem('EmpMainId');
    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    this.addressForm = this.fb.group({
      same_as_bussiness_address: new FormControl(null),
      shipping_address_data: this.fb.array([this.shippingAddressRow()]),
      billing_address_data: this.fb.array([this.billingAddressRow()]),
      contact_info_data: new FormArray([
        new FormGroup({
          contact_person_name: new FormControl(null, [Validators.required]),
          mobile: new FormControl(null, [Validators.required]),
          email_id: new FormControl(null, [Validators.required]),
          designation: new FormControl(null),
          department: new FormControl(null),
          title: new FormControl(null),
          id: new FormControl(null),
        }),
      ]),
    });
  }

  ngOnInit(): void {
    this.getAllCountry();
    this.searchfilter();
    this.acctivate.queryParams.subscribe((params: any) => {
      this.vendor_id = params['id'];
      this.action_type = params['action_type'];
      this.lead_id = params.lead_id;
      this.new_vendor = params['new_vendor'];
      this.setValidators();
      if (this.vendor_id) {
        // this.getvendorAddressInfoById(this.vendor_id);
        this.getVendorAddressInfoById(this.vendor_id);
      }
      //  if(this.lead_id){
      // this.getLeadData()
      //       }
    });
  }

  setValidators() {
    // this.new_vendor = new_vendor;
    const contactArray = this.addressForm.get('contact_info_data') as FormArray;
    if (this.new_vendor == 'NO' || !this.new_vendor) {
      // Set Validators.required for required fields
      this.addressForm
        .get('billing_country_id')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('billing_city_id')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('billing_state_id')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('billing_pin_code')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('billing_address')
        ?.setValidators([Validators.required]);
      // this.addressForm.get('billing_postal_address')?.setValidators([Validators.required]);
      this.addressForm
        .get('shipping_address')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('shipping_postal_address')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('shipping_city_id')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('shipping_state_id')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('shipping_country_id')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('shipping_pin_code')
        ?.setValidators([Validators.required]);
      this.addressForm
        .get('same_as_bussiness_address')
        ?.setValidators([Validators.required]);

      contactArray.controls.forEach((group: AbstractControl) => {
        group.get('contact_person_name')?.setValidators([Validators.required]);
        group.get('mobile')?.setValidators([Validators.required]);
        group.get('email_id')?.setValidators([Validators.required]);
        // group.get('designation')?.setValidators([Validators.required]);
        // group.get('department')?.setValidators([Validators.required]);
      });
    } else {
      // Remove Validators.required from the fields
      this.addressForm.get('billing_country_id')?.clearValidators();
      this.addressForm.get('billing_city_id')?.clearValidators();
      this.addressForm.get('billing_state_id')?.clearValidators();
      this.addressForm.get('billing_pin_code')?.clearValidators();
      this.addressForm.get('billing_address')?.clearValidators();
      // this.addressForm.get('billing_postal_address')?.clearValidators();
      this.addressForm.get('shipping_address')?.clearValidators();
      this.addressForm.get('shipping_postal_address')?.clearValidators();
      this.addressForm.get('shipping_city_id')?.clearValidators();
      this.addressForm.get('shipping_state_id')?.clearValidators();
      this.addressForm.get('shipping_country_id')?.clearValidators();
      this.addressForm.get('shipping_pin_code')?.clearValidators();
      this.addressForm.get('same_as_bussiness_address')?.clearValidators();

      contactArray.controls.forEach((group: AbstractControl) => {
        group.get('contact_person_name')?.clearValidators();
        group.get('mobile')?.clearValidators();
        group.get('email_id')?.clearValidators();
        // group.get('designation')?.clearValidators();
        // group.get('department')?.clearValidators();
        group.get('title')?.clearValidators();
      });
    }
    this.addressForm.updateValueAndValidity();
    contactArray.controls.forEach((group) => group.updateValueAndValidity());
  }

  searchfilter() {
    this.filterBillCountryControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.billingCountryList = this.filteredBillCountry.filter(
          (country: any) =>
            country.countryss_name.toLowerCase().includes(value.toLowerCase()),
        );
      });

    this.filterShipCountryControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.shippingCountryList = this.filteredshippingCountry.filter(
          (country: any) =>
            country.countryss_name.toLowerCase().includes(value.toLowerCase()),
        );
      });

    this.filterBillStateControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.billingSteteData = this.filteredbillingSteteData.filter(
          (state: any) =>
            state.states_name.toLowerCase().includes(value.toLowerCase()),
        );
      });

    this.filterShipStateControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.shippingSteteData = this.filteredshippingSteteData.filter(
          (state: any) =>
            state.states_name.toLowerCase().includes(value.toLowerCase()),
        );
      });

    this.filterShipCityControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.shippingCityList = this.filtershippingCityList.filter(
          (city: any) =>
            city.city_name.toLowerCase().includes(value.toLowerCase()),
        );
      });

    this.filterBillingCityControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.billingCityList = this.filterBillingCityList.filter((city: any) =>
          city.city_name.toLowerCase().includes(value.toLowerCase()),
        );
      });
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe((res: any) => {
      this.billingCountryList = res.data;
      this.shippingCountryList = res.data;
      this.filteredshippingCountry = res.data;
      this.filteredBillCountry = res.data;
    });
  }
  presentCountryChange(e: any, index: any) {
    this.presentCountryMethod(e?.value, index);

    const row = this.billingAddressFormArray.at(index);
    const pin = row.get('billing_pin_code')?.value;
    const isIndia = e?.value; // India IDs
    this.setValidatorsByCountry(index, 'billing', isIndia);
    this.fetchBillingPinDetails(pin, index);
  }
  presentCountryMethod(id: any, index: any) {
    this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.billingSteteData[index] = res?.data;
        this.filteredbillingSteteData = res.data;
      }
    });
  }
  shippingCountryChange(e: any, index: number) {
    const isIndia = e?.value; // India IDs
    this.setValidatorsByCountry(index, 'shipping', isIndia);
    this.shippingCountryMethod(e?.value, index);
  }
  shippingCountryMethod(id: any, index: number) {
    this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.shippingSteteData[index] = res?.data;
        this.filteredshippingSteteData = res.data;
      }
    });
  }
  billingStateChange(e: any, index: any) {
    this.billingGetCityByState(e?.value, index);
  }
  billingGetCityByState(id: any, index: any) {
    this._empRegistration.getCityByState(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.billingCityList[index] = res?.data;
        this.filterBillingCityList = res?.data;
      }
    });
  }
  shippingStateChange(e: any, index: number) {
    this.shippingGetCityByState(e?.value, index);
  }
  shippingGetCityByState(id: any, index: number) {
    this._empRegistration.getCityByState(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.shippingCityList[index] = res?.data;
        this.filtershippingCityList = res?.data;
      }
    });
  }

  onToggleChange(event: any) {
    const billingLength = this.billingAddressFormArray.length;

    this.billingAddressFormArray.controls.forEach((billingRow, index) => {
      let shippingRow = this.shippingAddressFormArray.at(index);

      if (event.checked) {
        // If shipping row does not exist, create it
        if (!shippingRow) {
          this.addShippingAddressRow();
          shippingRow = this.shippingAddressFormArray.at(index);
        }

        // Copy billing values to shipping row
        shippingRow.patchValue({
          shipping_country_id: billingRow.get('billing_country_id')?.value,
          shipping_state_id: billingRow.get('billing_state_id')?.value,
          shipping_city_id: billingRow.get('billing_city_id')?.value,
          shipping_pin_code: billingRow.get('billing_pin_code')?.value,
          shipping_address: billingRow.get('billing_address')?.value,
          shipping_postal_address: billingRow.get('billing_postal_address')
            ?.value,
        });

        this.fetchPinDetails(billingRow.get('billing_pin_code')?.value, index);
      } else {
        // Toggle unchecked: just clear existing shipping row values
        if (shippingRow && index == 0) {
          this.shippingAddressFormArray.clear();
          this.shippingAddressFormArray.push(this.shippingAddressRow());

          // Clear row-specific state/city arrays
          this.shippingSteteData[index] = [];
          this.filteredshippingSteteData[index] = [];
          this.shippingCityList[index] = [];
          this.filtershippingCityList[index] = [];
        }
      }
    });
  }

  getVendorAddressInfoById(id: any) {
    this.vendorService.getVendorAddressInfoById(id).subscribe((resp: any) => {
      let data = resp.data?.vendorAddress;
      let shippingList = resp.data?.shipping_address_data;
      let billingList = resp.data?.billing_address_data;
      let list = resp.data?.vendorContactPerson;
      this.addressForm.patchValue({
        vendor_type: data?.billing_country_id,
      });

      for (let i = 0; i < list.length; i++) {
        let control = this.stakeHoldersFormArray.at(i);

        if (!control) {
          control = this.fb.group({
            id: list[i].id,
            contact_person_name: list[i].contact_person_name,
            mobile: list[i].mobile,
            email_id: list[i].email_id,
            designation: list[i].designation,
            department: list[i].department,
            title: list[i].title,
          });
          this.stakeHoldersFormArray.push(control);
        } else {
          control.patchValue({
            id: list[i].id,
            contact_person_name: list[i].contact_person_name,
            mobile: list[i].mobile,
            email_id: list[i].email_id,
            designation: list[i].designation,
            department: list[i].department,
            title: list[i].title,
          });
        }
      }
      if (list) {
        this._empRegistration
          .getCityByState(data?.billing_state_id)
          .subscribe((res: any) => {
            if (res && res?.data) {
              this.billingCityList = res?.data;
              this.filterBillingCityList = res?.data;
            }
          });
      }
      const shippingFA = this.shippingAddressFormArray;
      shippingFA.clear();
      const billingFA = this.billingAddressFormArray;
      billingFA.clear();

      if (billingList && billingList.length > 0) {
        billingList.forEach((item: any, index: number) => {
          this.oldGstNo[index] = item.gst_in;
          const row = this.fb.group({
            id: [item.id ? item.id : null],
            billing_country_id: [item.billing_country_id],
            billing_city_id: [item.billing_city_id],
            billing_state_id: [item.billing_state_id],
            billing_pin_code: [item.billing_pin_code],
            billing_address: [item.billing_address],
            billing_postal_address: [item.billing_postal_address],
            gst_in: [item.gst_in],
            gst_category: [item.gst_category],
            isGstType: [item.gst_category === 'URP'],
          });

          billingFA.push(row);
          const gstControl = row.get('gst_in');
          if (item.gst_category === 'URP') {
            // gstControl?.clearValidators();
            // gstControl?.updateValueAndValidity({ emitEvent: false });
          } else {
            // gstControl?.setValidators([Validators.required]);
            // gstControl?.updateValueAndValidity({ emitEvent: false });
          }
          this._empRegistration
            .getStateByCountry(item.billing_country_id)
            .subscribe((res: any) => {
              this.billingSteteData[index] = res.data; // Row wise states

              /* 3️⃣ Load Cities for this row */
              this._empRegistration
                .getCityByState(item.billing_state_id)
                .subscribe((res2: any) => {
                  this.billingCityList[index] = res2.data; // Row wise cities
                });
            });
          this.fetchBillingPinDetails(item.billing_pin_code, index);
        });
      } else {
        this.billingAddressFormArray.push(this.billingAddressRow());
      }
      if (shippingList && shippingList.length > 0) {
        shippingList.forEach((item: any, index: number) => {
          this.oldGstNo2[index] = item.gst_in;
          shippingFA.push(
            this.fb.group({
              id: [item.id ? item.id : null],
              shipping_country_id: [item.shipping_country_id],
              shipping_state_id: [item.shipping_state_id],
              shipping_city_id: [item.shipping_city_id],
              shipping_pin_code: [item.shipping_pin_code],
              shipping_address: [item.shipping_address],
              shipping_postal_address: [item.shipping_postal_address],
              gst_in: [item.gst_in],
              gst_category: [item.gst_category],
              isGstType: [item.gst_category === 'URP'],
            }),
          );
          this._empRegistration
            .getStateByCountry(item.shipping_country_id)
            .subscribe((res: any) => {
              this.shippingSteteData[index] = res.data; // Row wise states

              /* 3️⃣ Load Cities for this row */
              this._empRegistration
                .getCityByState(item.shipping_state_id)
                .subscribe((res2: any) => {
                  this.shippingCityList[index] = res2.data; // Row wise cities
                });
            });
          this.fetchPinDetails(item.shipping_pin_code, index);
        });
      } else {
        this.shippingAddressFormArray.push(this.shippingAddressRow());
      }
    });
  }
  // getvendorAddressInfoById(id: any) {
  //   this.salesService.getvendorAddressInfoById(id).subscribe((resp: any) => {
  //     let data = resp.data?.vendorAddress;
  //     let shippingList = resp.data?.shipping_address_data;
  //     let billingList = resp.data?.billing_address_data;
  //     let list = resp.data?.vendorContacts;
  //     this.addressForm.patchValue({

  //       vendor_type: data?.billing_country_id,

  //     });

  //     for (let i = 0; i < list.length; i++) {
  //       let control = this.stakeHoldersFormArray.at(i);

  //       if (!control) {
  //         control = this.fb.group({
  //           id: list[i].id,
  //           contact_person_name: list[i].contact_person_name,
  //           mobile: list[i].mobile,
  //           email_id: list[i].email_id,
  //           designation: list[i].designation,
  //           department: list[i].department,
  //           title: list[i].title,
  //         });
  //         this.stakeHoldersFormArray.push(control);
  //       } else {
  //         control.patchValue({
  //           id: list[i].id,
  //           contact_person_name: list[i].contact_person_name,
  //           mobile: list[i].mobile,
  //           email_id: list[i].email_id,
  //           designation: list[i].designation,
  //           department: list[i].department,
  //           title: list[i].title,
  //         });
  //       }
  //     }
  //     if (list) {
  //       this._empRegistration
  //         .getCityByState(data?.billing_state_id)
  //         .subscribe((res: any) => {
  //           if (res && res?.data) {
  //             this.billingCityList = res?.data;
  //             this.filterBillingCityList = res?.data;
  //           }
  //         });

  //     }
  //     const shippingFA = this.shippingAddressFormArray;
  //     shippingFA.clear();
  //     const billingFA = this.billingAddressFormArray;
  //     billingFA.clear();

  //     if (billingList && billingList.length > 0) {
  //       billingList.forEach((item: any, index: number) => {
  //         this.oldGstNo[index] = item.gst_in;
  //         const row = this.fb.group({
  //           id:[item.id?item.id:null],
  //           billing_country_id: [item.billing_country_id],
  //           billing_city_id: [item.billing_city_id],
  //           billing_state_id: [item.billing_state_id],
  //           billing_pin_code: [item.billing_pin_code],
  //           billing_address: [item.billing_address],
  //           billing_postal_address: [item.billing_postal_address],
  //           gst_in: [item.gst_in],
  //           gst_category: [item.gst_category],
  //           isGstType: [item.gst_category === 'URP'],
  //         });

  //         billingFA.push(row);
  //         const gstControl = row.get('gst_in');
  //         if (item.gst_category === 'URP') {
  //           // gstControl?.clearValidators();
  //           // gstControl?.updateValueAndValidity({ emitEvent: false });
  //         } else {
  //           // gstControl?.setValidators([Validators.required]);
  //           // gstControl?.updateValueAndValidity({ emitEvent: false });
  //         }
  //         this._empRegistration
  //           .getStateByCountry(item.billing_country_id)
  //           .subscribe((res: any) => {
  //             this.billingSteteData[index] = res.data; // Row wise states

  //             /* 3️⃣ Load Cities for this row */
  //             this._empRegistration
  //               .getCityByState(item.billing_state_id)
  //               .subscribe((res2: any) => {
  //                 this.billingCityList[index] = res2.data; // Row wise cities
  //               });
  //           });
  //         this.fetchBillingPinDetails(item.billing_pin_code, index);
  //       });
  //     } else {
  //       this.billingAddressFormArray.push(this.billingAddressRow());
  //     }
  //     if (shippingList && shippingList.length > 0) {
  //       shippingList.forEach((item: any, index: number) => {
  //         shippingFA.push(
  //           this.fb.group({
  //             id:[item.id?item.id:null],
  //             shipping_country_id: [item.shipping_country_id],
  //             shipping_state_id: [item.shipping_state_id],
  //             shipping_city_id: [item.shipping_city_id],
  //             shipping_pin_code: [item.shipping_pin_code],
  //             shipping_address: [item.shipping_address],
  //             shipping_postal_address: [item.shipping_postal_address],
  //           })
  //         );
  //         this._empRegistration
  //           .getStateByCountry(item.shipping_country_id)
  //           .subscribe((res: any) => {
  //             this.shippingSteteData[index] = res.data; // Row wise states

  //             /* 3️⃣ Load Cities for this row */
  //             this._empRegistration
  //               .getCityByState(item.shipping_state_id)
  //               .subscribe((res2: any) => {
  //                 this.shippingCityList[index] = res2.data; // Row wise cities
  //               });
  //           });
  //         this.fetchPinDetails(item.shipping_pin_code, index);
  //       });
  //     } else {
  //       this.shippingAddressFormArray.push(this.shippingAddressRow());
  //     }
  //   });
  // }

  goBack() {
    this.location.back();
  }

  get stakeHoldersFormArray() {
    return this.addressForm.get('contact_info_data') as FormArray;
  }

  contact_info_data: any = [];
  addNewItem() {
    if (this.addressForm.get('contact_info_data')?.invalid) {
      return this.toaster.warning('Please add row data !');
    }
    this.contact_info_data = this.addressForm.get(
      'contact_info_data',
    ) as FormArray;
    this.contact_info_data.push(this.createItemGroup());
  }

  shippingAddressRow() {
    return this.fb.group({
      id: [''],
      shipping_country_id: ['', Validators.required],
      shipping_state_id: ['', Validators.required],
      shipping_city_id: ['', Validators.required],
      shipping_pin_code: ['', Validators.required],
      shipping_address: ['', Validators.required],
      shipping_postal_address: [''],
      gst_category: ['', Validators.required],
      gst_in: [''],
      isGstType: new FormControl(true),
    });
  }
  billingAddressRow() {
    return this.fb.group({
      id: [],
      billing_country_id: ['', Validators.required],
      billing_city_id: ['', Validators.required],
      billing_state_id: ['', Validators.required],
      billing_pin_code: ['', Validators.required],
      billing_address: ['', Validators.required],
      billing_postal_address: [''],
      gst_category: ['', Validators.required],
      gst_in: [''],
      isGstType: new FormControl(true),
    });
  }
  get billingAddressFormArray() {
    return this.addressForm.get('billing_address_data') as FormArray;
  }
  get shippingAddressFormArray() {
    return this.addressForm.get('shipping_address_data') as FormArray;
  }
  addBillingAddressRow() {
    const lastIndex = this.billingAddressFormArray.length - 1;
    const lastRow = this.billingAddressFormArray.at(lastIndex);

    if (lastRow.invalid) {
      this.toaster.warning(
        'Please fill all required fields in the first billing address before adding a new row!',
      );

      lastRow.markAllAsTouched();
      return;
    }
    this.billingAddressFormArray.push(this.billingAddressRow());
  }
  addShippingAddressRow() {
    const lastIndex = this.shippingAddressFormArray.length - 1;
    const lastRow = this.shippingAddressFormArray.at(lastIndex);

    if (lastRow.invalid) {
      this.toaster.warning(
        'Please fill all required fields in the first shipping address before adding a new row!',
      );

      lastRow.markAllAsTouched();
      return;
    }
    this.shippingAddressFormArray.push(this.shippingAddressRow());
  }

  removeShippingAddressRow(i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this address?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shippingAddressFormArray.removeAt(i);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your address has been deleted.',
          icon: 'success',
        });
      }
    });
  }
  removeBillingAddressRow(i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this address?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.billingAddressFormArray.removeAt(i);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your address has been deleted.',
          icon: 'success',
        });
      }
    });
  }

  createItemGroup(flag?: any): FormGroup {
    if (this.new_vendor == 'NO' || flag) {
      return this.fb.group({
        contact_person_name: new FormControl(null, [Validators.required]),
        mobile: new FormControl(null, [Validators.required]),
        email_id: new FormControl(null, [Validators.required]),
        designation: new FormControl(null),
        department: new FormControl(null),
        title: new FormControl(null),
        id: new FormControl(null),
      });
    } else {
      return this.fb.group({
        id: new FormControl(null),
        contact_person_name: new FormControl(null),
        mobile: new FormControl(null),
        email_id: new FormControl(null),
        designation: new FormControl(null),
        department: new FormControl(null),
        title: new FormControl(null),
      });
    }
  }
  removeStakeHoldersRow(index: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this contact?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.stakeHoldersFormArray.removeAt(index);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your contact has been deleted.',
          icon: 'success',
        });
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any)
      .values(formGroup.controls)
      .forEach((control: FormGroup<any>) => {
        control.markAsTouched();

        // if (control.controls) {
        //   this.markFormGroupTouched(control);
        // }
      });

    const contactArray = this.addressForm.get('contact_info_data') as FormArray;
    contactArray.controls.forEach((group) => group.updateValueAndValidity());
    const contactInfoArray = this.addressForm.get(
      'contact_info_data',
    ) as FormArray;

    contactInfoArray.controls.forEach((group: AbstractControl) => {
      if (group instanceof FormGroup) {
        group.markAllAsTouched();
      }
    });
  }

  onSubmitForm() {
    if (this.addressForm.invalid) {
      this.markFormGroupTouched(this.addressForm);
      return this.toaster.warning('Please fill all required field!');
    }
    const lastIndex = this.billingAddressFormArray.length - 1;
    const lastRow = this.billingAddressFormArray.at(lastIndex);

    if (lastRow.invalid) {
      this.toaster.warning(
        'Please fill all required fields in the first billing address before adding a new row!',
      );

      lastRow.markAllAsTouched();
      return;
    }
    let formData = this.addressForm.value;
    formData.vendor_id = this.vendor_id;
    this.vendorService.createVendorAddressInfo(formData).subscribe(
      (res: any) => {
        if (res) {
          this.toaster.success(res.message);
          if (this.action_type) {
            this.router.navigate(
              ['/master/vendor/vendor-list/create-vendor/documents'],
              {
                queryParams: {
                  id: this.vendor_id,
                  action_type: this.action_type,
                  new_vendor: this.new_vendor,
                },
              },
            );
          } else {
            this.router.navigate(
              ['/master/vendor/vendor-list/create-vendor/documents'],
              {
                queryParams: {
                  id: this.vendor_id,
                  new_vendor: this.new_vendor,
                },
              },
            );
          }
        }
      },
      (err: any) => {
        this.toaster.error(err.error.message);
      },
    );
  }

  titlesArray: string[] = []; // yaha sab titles store honge

  typeChange(value: string, index: number) {
    this.titlesArray[index] = value; // usi index pe value daal do
    console.log('Updated Titles Array:', this.titlesArray);
  }

  fetchBillingPinDetails(pin: any, index: any) {
    const row = this.billingAddressFormArray.at(index); // <- Row access
    const country = row.get('billing_country_id');

    if (!row) return;
    const countryId = row.get('billing_country_id')?.value;
    const INDIA_COUNTRY_ID = 101;
    if (Number(countryId) !== INDIA_COUNTRY_ID) {

      this.billingPostOffice[index] = [];
      row.get('billing_city_id')?.patchValue(null);
      row.get('billing_state_id')?.patchValue(null);
      return;
    }

    if (!pin || !country || Number(country.value) !== 101) {
      this.postOffice[index] = [{ Name: '--', District: '--' }]; // use for other country
      return;
    }
    //this.presentCountryChange(country, index);
    this.comman_service.getPostOfficeByPincode(pin).subscribe(
      (response: any) => {
        if (response.PostOffice && response.PostOffice.length > 0) {
          this.billingPostOffice[index] = response.PostOffice;
          const post = response.PostOffice[0];

          let state_id = this.billingSteteData[index].find(
            (x: any) =>
              x.states_name.toLowerCase() === post.State.toLowerCase(),
          )?.states_id;

          if (state_id) {
            row.get('billing_state_id')?.patchValue(state_id);

            // this.proposalForm.get('shipping_state_id')?.disable();
            this.billingStateChange(row.get('billing_state_id'), index);

            // City patch
            setTimeout(() => {
              let city_id = this.billingCityList[index].find(
                (x: any) =>
                  x.city_name.toLowerCase() === post.District.toLowerCase(),
              )?.city_id;

              if (city_id) {
                row.get('billing_city_id')?.patchValue(city_id);
              }
            }, 800);
            if (this.myFlagForSlideToggle) {
            }
          }
        } else {
          this.toaster.error('Pin code details not found');
          this.billingPostOffice[index] = [];
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      },
    );
  }

  fetchPinDetails(pin: any, index: any) {
    const row = this.shippingAddressFormArray.at(index); // <- Row access
    const country = row.get('shipping_country_id');
 if (!row) return;
    const countryId = row.get('shipping_country_id')?.value;
    const INDIA_COUNTRY_ID = 101;
    if (Number(countryId) !== INDIA_COUNTRY_ID) {

      this.postOffice[index] = [];
      row.get('shipping_city_id')?.patchValue(null);
      row.get('shipping_state_id')?.patchValue(null);
      return;
    }
    if (!pin || !country || Number(country.value) !== 101) {
      this.postOffice[index] = [{ Name: '--', District: '--' }]; // use for other country
      return;
    }

    // this.shippingCountryChange(country, index);
    this.comman_service.getPostOfficeByPincode(pin).subscribe(
      (response: any) => {
        if (response.PostOffice && response.PostOffice.length > 0) {
          this.postOffice[index] = response.PostOffice;
          const post = response.PostOffice[0];

          let state_id = this.shippingSteteData[index].find(
            (x: any) =>
              x.states_name.toLowerCase() === post.State.toLowerCase(),
          )?.states_id;

          if (state_id) {
            row.get('shipping_state_id')?.patchValue(state_id);

            // this.proposalForm.get('shipping_state_id')?.disable();
            this.shippingStateChange(row.get('shipping_state_id'), index);

            // City patch
            setTimeout(() => {
              let city_id = this.shippingCityList[index].find(
                (x: any) =>
                  x.city_name.toLowerCase() === post.District.toLowerCase(),
              )?.city_id;

              if (city_id) {
                row.get('shipping_city_id')?.patchValue(city_id);
              }
            }, 800);
            if (this.myFlagForSlideToggle) {
            }
          }
        } else {
          this.toaster.error('Pin code details not found');
          this.postOffice[index] = [];
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      },
    );
  }
  // isGstType:boolean=true;
  oldGstNo: any[] = [];
  oldGstNo2: any[] = [];
  gstCategory: any = [
    { key: 'RP', value: 'RP (Registered Party)' },
    { key: 'URP', value: 'URP (Un-Registered Party)' },
  ];
  selectGstCat(event: any, index: any) {
    const row = this.billingAddressFormArray.at(index);

    if (event == 'URP') {
      row.get('isGstType')?.setValue(true);
      row.get('gst_in')?.reset();
      // row.get('gst_in')?.clearValidators();
      // row.get('gst_in')?.updateValueAndValidity();
    } else {
      // row.get('gst_in')?.setValidators([Validators.required]);
      row.get('gst_in')?.setValue(this.oldGstNo[index]);
      row.get('isGstType')?.setValue(false);
      // row.get('gst_in')?.updateValueAndValidity();
    }
  }

  selectGstCat2(event: any, index: any) {
    const row = this.shippingAddressFormArray.at(index);

    if (event == 'URP') {
      row.get('isGstType')?.setValue(true);
      row.get('gst_in')?.reset();
      // row.get('gst_in')?.clearValidators();
      // row.get('gst_in')?.updateValueAndValidity();
    } else {
      // row.get('gst_in')?.setValidators([Validators.required]);
      row.get('gst_in')?.setValue(this.oldGstNo2[index]);
      row.get('isGstType')?.setValue(false);
      // row.get('gst_in')?.updateValueAndValidity();
    }
  }

  setValidatorsByCountry(index: number, addressType: 'billing' | 'shipping', isIndia: number) {

    const formArray = this.addressForm.get(addressType === 'billing' ? 'billing_address_data' : 'shipping_address_data') as FormArray;

    const group = formArray.at(index) as FormGroup;

    if (!group) return;

    const controls = addressType === 'billing'
      ? [
        'billing_country_id',
        'billing_state_id',
        'billing_city_id',
        'billing_pin_code',
        'billing_address',
        'billing_postal_address'
      ]
      : [
        'shipping_country_id',
        'shipping_state_id',
        'shipping_city_id',
        'shipping_pin_code',
        'shipping_address',
        'shipping_postal_address'
      ];

    controls.forEach(controlName => {
      const control = group.get(controlName);

      if (!control) return;

      if (isIndia == 101) {
        control.setValidators([Validators.required]);
      } else {
        control.clearValidators();
        if (controlName !== 'billing_country_id' && controlName !== 'shipping_country_id') {
          control.setValue(null, { emitEvent: false });
          control.markAsPristine();
          control.markAsUntouched();
          control.setErrors(null);
        }
      }
      if (isIndia !== 101) {
        if (addressType === 'billing') {
          this.billingCityList[index] = [];
          this.billingSteteData[index] = [];
          this.billingPostOffice[index] = [];
        } else {
          this.shippingCityList[index] = [];
          this.shippingSteteData[index] = [];
          // this.shippingPostOffice[index] = [];
        }
      }
      control.updateValueAndValidity({ emitEvent: false });
    });
  }
}
