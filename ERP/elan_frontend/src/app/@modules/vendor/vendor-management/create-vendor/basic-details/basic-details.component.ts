import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss'],
})
export class BasicDetailsComponent {
  basicForm: any;
  entity_id: any;
  financial_year_id: any;
  vendor_id: any;
  type: any;
  vendorParentList: any[] = [];
  vendorParentListCopy: any[] = [];
  vendorParentArray: any;
  editbasicData: any;
  arrayData: any[] = [];
  currencyData: any;
  currencies: any;
  currencyDataArray: any;
  countryList: any;
  allCountryList: any = [];
  country: any = [];
  stateList: any;
  stateList2: any;
  states: any;
  cities: any;
  cityList: any;
  cityList2: any;
  countrey_id: any;
  state_id: any;
  city_id: any;

  paymentTerm: any = [];
  vendorTypeList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _empRegistration: EmpRegistrationService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private vendorService: VendorManagementService,
    private accessData: AccessControlService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _commonService: CommonService,
  ) {
    this.basicForm = this.fb.group({
      parent_company_id: new FormControl(null),
      vendor_category: new FormControl(null, [Validators.required]),
      currency_id: new FormControl(null, [Validators.required]),
      trade_currency_ids: new FormControl([], [Validators.required]),
      vendor_type: new FormControl(null, [Validators.required]),
      vendor_name: new FormControl(null, [Validators.required]),
      vendor_email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      contact_number: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{5,15}$/),
      ]),
      alternative_number: new FormControl(null),
      country_id: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      city_id: new FormControl(null, [Validators.required]),
      vendor_address: new FormControl(null, [Validators.required]),
      vendor_pincode: new FormControl(null, [Validators.required]),
      pan_number: new FormControl(null),
      payment_term_id: new FormControl(null, [Validators.required]),
      effective_date: new FormControl(null),
      discount: new FormControl(null),
      cin_number: new FormControl(null),
      gst_in: new FormControl(null),
      msme_number: new FormControl(null),
      tan_number: new FormControl(null),
      ice_code: new FormControl(null),
      rcm_charge: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId();
    this.financial_year_id = this.accessData.getFinancialId();
    this.getAllVendorList();
    this.getAllCountry();
    this.getCurrency();
    this.getPaymentTermMasterList();
    this.getVendorTypeList();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.vendor_id = params.id;
      this.type = params.type;
      if (this.type === 'View') {
        this.basicForm.disable();
      }
    });
    if (this.vendor_id) {
      this.getVendorBasicDetails();
    }
  }

  getVendorTypeList() {
    this._configurationalMasterService.getAllTravelType('vendor-type').subscribe((res: any) => {
      this.vendorTypeList = res.data;
    });
  }

  getAllVendorList() {
    this.vendorService.getAllVendorList(this.entity_id).subscribe(
      (res: any) => {
        this.vendorParentList = res.data;
        this.vendorParentListCopy = res.data;
        this.vendorParentArray = this.vendorParentList.map(
          (value: any) => value.vendor_name,
        );
      },
      (err: any) => {
        this.vendorParentList = [];
      },
    );
  }

  vendorParentFilter(e: any) {
    const aa = e;
    this.vendorParentList = this.vendorParentListCopy.filter(
      (item: any) =>
        aa.includes(item.vendor_name) || aa.includes(item.vendor_category),
    );
  }

  getVendorBasicDetails() {
    this.vendorService.getByVendor(this.vendor_id).subscribe((res: any) => {
      this._commonService?.hideLoader();
      this.basicForm.patchValue(res.data);
      this.editbasicData = res.data;
      this.getStateByCountry(this.editbasicData?.country_id);
      if (this.type === 'View') {
        this.basicForm.disable();
      }
    });
  }

  getCurrency() {
    this._commonService?.showLoader();
    this._configurationalMasterService.CurrencyList().subscribe(
      (res: any) => {
        this.currencyDataArray = res.data;
        this.currencyData = this.currencyDataArray;
        this.currencies = this.currencyData.map(
          (value: any) => value.Currency_Type,
        );
      },
      (err: any) => {
        this._commonService?.hideLoader();
      },
    );
  }

  currencyFilter(e: any) {
    const aa = e;
    let filteredVariable = this.currencyDataArray.filter((item: any) =>
      aa.includes(item.Currency_Type),
    );
    this.currencyData = filteredVariable;
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.allCountryList = this.countryList;
        this.country = this.countryList.map((res: any) => res.countryss_name);
      },
      (err: any) => {},
    );
  }

  countryChange(e: any) {
    this.countrey_id = e.value;
    this.getStateByCountry(e.value);
  }

  countryFilter(e: any) {
    const aa = e;
    let filteredVariable = this.countryList.filter((item: any) =>
      aa.includes(item.countryss_name),
    );
    this.allCountryList = filteredVariable;
  }

  getStateByCountry(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this.stateList = res.data;
        this.stateList2 = res.data;
        this.states = this.stateList.map((value: any) => value.states_name);
        if (this.editbasicData) {
          this.basicForm.controls['state_id'].patchValue(
            Number(this.editbasicData?.state_id),
          );
          this.getCityByState(this.editbasicData?.state_id);
        }
      },
      (err: any) => {},
    );
  }

  stateChange(e: any) {
    this.state_id = e.value;
    this.getCityByState(e.value);
  }

  stateFilter(e: any) {
    const aa = e;
    let filteredVariable = this.stateList2.filter((item: any) =>
      aa.includes(item.states_name),
    );
    this.stateList = filteredVariable;
  }

  getCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        this.cityList = res.data;
        this.cityList2 = res.data;
        this.cities = this.cityList.map((value: any) => value.city_name);

        if (this.editbasicData) {
          this.basicForm.controls['city_id'].patchValue(
            Number(this.editbasicData?.city_id),
          );
        }
      },
      (err: any) => {},
    );
  }

  cityChange(e: any) {
    this.city_id = e.value;
  }

  cityFilter(e: any) {
    const aa = e;
    let filteredVariable = this.cityList2.filter((item: any) =>
      aa.includes(item.city_name),
    );
    this.cityList = filteredVariable;
  }

  getPaymentTermMasterList() {
    this._configurationalMasterService
      .getPaymentTermMasterList(this.entity_id, 'ACTIVE')
      .subscribe(
        (res: any) => {
          this.paymentTerm = res.data;
        },
        (err) => {
          this.paymentTerm = [];
        },
      );
  }

  onSubmit() {
    if (this.basicForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    }

    let val = this.basicForm.value;
    val.id = this.vendor_id;
    val.entity_id = this.entity_id;
    val.financial_year_id = this.financial_year_id;
    val.tab_type = 'Basic_Details';
    val.rcm_charge = val.rcm_charge;

    this._commonService?.showLoader();
    this.vendorService.createVendorNew(val).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.vendor_id = res.data;
        this.route.navigate(
          ['master/vendor/vendor-list/create-vendor/bank-details'],
          { queryParams: { id: this.vendor_id, type: 'Edit' } },
        );
        this._commonService?.hideLoader();
      },
      (err) => {
        this._commonService?.hideLoader();
        this.toast.error(err.error.message);
      },
    );
  }
}
