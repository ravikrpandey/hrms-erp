import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-vehicle-vendor-master-create',
  templateUrl: './vehicle-vendor-master-create.component.html',
  styleUrls: ['./vehicle-vendor-master-create.component.scss']
})
export class VehicleVendorMasterCreateComponent implements OnInit {
  vehicleVendorForm: FormGroup;
  readable: false;
  id: any;
  typeStatus: any;
  countryList: any[] = [];
  AllStateList: any[] = [];
  allCityList: any[] = [];
  entity_id: string | null = null;
  financial_year_id: string | null = null;
  emp_id: string | null = null;
  filterCountryControl = new FormControl();
  filterStateControl = new FormControl();
  filterCityControl = new FormControl();
  filteredCityList: any[];
  filteredStateList: any;
  filteredCountryList: any;
  getData: any;
  action_type: any;
  vid: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private location: Location,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private $common: CommonService,
    private transport_service: TransportManagementService
  ) {
    this.vehicleVendorForm = this.fb.group({
      // vendor_id : [null, Validators.required],
      vendor_name: [null, Validators.required],
      organization_name: [null, Validators.required],
      vendor_type: [null, Validators.required],
      contact_person_name: [null, Validators.required],
      contact_number: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email_address: [null, [Validators.required, Validators.email]],
      address: [null, Validators.required],
      country_id: [null, Validators.required],
      city_id: [null, Validators.required],
      state_id: [null, Validators.required],
      pincode: [null, [Validators.required, Validators.maxLength(6)]],
      gst_number: [null, [Validators.maxLength(15)]],
      pan_number: [null, [Validators.maxLength(10)]],
      bank_name: [null, Validators.required],
      account_number: [null, Validators.required],
      ifsc_code: [null, [Validators.required, Validators.maxLength(11)]],
      preferred_routes_regions: [null, Validators.required],
      payment_terms: [null, Validators.required],
      agreement_signed: [null, Validators.required],
      blacklist_status: [null, Validators.required],
      remarks: [null, Validators.required],
      // created_Date: [null, Validators.required],
      // updated_Date: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.emp_id = localStorage.getItem('EmpMainId');

    this.activetedRoute.queryParams.subscribe((params) => {
      this.vid = params

    });
    this.typeStatus =this.vid.action_type

    this.getVehicleVendorById();
    this.getAllCountry();

    this.filterCountryControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.countryList = this.filteredCountryList.filter((country: any) =>
        country.countryss_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterStateControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.AllStateList = this.filteredStateList.filter((state: any) =>
        state.states_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterCityControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.allCityList = this.filteredCityList.filter((city: any) =>
        city.city_name.toLowerCase().includes(value.toLowerCase())
      );
    });


  }






  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.filteredCountryList = res.data;
      })
  };

  onChangeCountry(e: any) {
    this.filterStateControl;
    this.getAllState(e?.value);
  }

  onChangeState(e: any) {
    this.filterCountryControl;
    this.getAllCity(e?.value);
  }
  onChangeCity(e: any) {
    this.filterCountryControl;
    this.getAllUserByCountryStateCity(e?.value);
  }
  getAllUserByCountryStateCity(city_id: any) {
    let countryId = this.vehicleVendorForm.get('country_id')?.value;
    let stateId = this.vehicleVendorForm.get('State_id')?.value;
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      country_id: countryId,
      state_id: stateId,
      city_id: city_id
    }
    if (data) {
      this._empRegistration.getAllUserByCountryStateCity(data).subscribe((res: any) => {
        if (res) {
          console.log(res.data)
        }
      }, (err: any) => {

      })
    }
  }
  getAllState(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        if (res && res?.data.length > 0) {
          this.AllStateList = res?.data;
          this.filteredStateList = res?.data;
        }
        else {
          // this.toast.warning('states are not exist in this country !');
        }
      }, (err: any) => {
        // this.toast.warning('states are not exist in this country !');
      })
  }

  getAllCity(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        if (res && res?.data.length > 0) {
          this.allCityList = res?.data;
          this.filteredCityList = this.allCityList;
        }
        else {

        }
      }, (err: any) => {

      })
  }
  vendor_id:any;
  basicFormPatch(data: any) {
   this.getAllState(data?.country_id)
   this.getAllCity(data?.state_id)
   this.vendor_id= data?.vendor_id,
    this.vehicleVendorForm.patchValue({
      vendor_name: data?.vendor_name,
      organization_name : data?.organization_name,
      vendor_type : data?.vendor_type,
      contact_person_name : data?.contact_person_name,
      contact_number : data?.contact_number,
      email_address : data?.email_address,
      address : data?.address,
      country_id : data?.country_id,
      city_id : data?.city_id,
      state_id : data?.state_id,
      pincode : data?.pincode,
      gst_number : data?.gst_number,
      pan_number : data?.pan_number,
      bank_name : data?.bank_name,
      account_number : data?.account_number,
      ifsc_code : data?.ifsc_code,
      preferred_routes_regions : data?.preferred_routes_regions,
      payment_terms : data?.payment_terms,
      agreement_signed : data?.agreement_signed,
      blacklist_status : data?.blacklist_status,
      remarks : data?.remarks,
      // created_Date : data?.createdAt,
      // updated_Date : data?.updatedAt,


    })

  }





  getVehicleVendorById() {
    this.transport_service.getVehicleVendorById(this.vid.id).subscribe((res: any) => {
      console.log(res, "<<<<<<<<<<<<<<<<<<<");

      this.getData = res.data;
      this.basicFormPatch(this.getData);
    })
  }

  goBack() {
    this.location.back();
  }

  back() {
    history.back();
  }


  onSubmitForm(): void {
    if (this.vehicleVendorForm.invalid) {
      this.vehicleVendorForm.markAllAsTouched();
      this.toast.error('Please fill all required fields correctly.');
      return;
    }

    const data = {
      ...this.vehicleVendorForm.value,
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      emp_id: this.emp_id,
      id:this.vid.id
    };
    if(this.typeStatus === 'update'){
   this.transport_service.editVehicleVendorById(data).subscribe({
      next: () => {
        this.toast.success('Vendor Updated successfully!');
        this.router.navigate(['master/transport-management/vendor-vehicle-master']); // Adjust path as needed
      },
      error: () => {
        this.toast.error('Something went wrong. Please try again.');
      }
    });
    console.log('Form Data:', data);
    // this.toast.success('Form data logged in console.');
  }else{

 this.transport_service.createVendor(data).subscribe({
      next: () => {
        this.toast.success('Vendor created successfully!');
        this.router.navigate(['master/transport-management/vendor-vehicle-master']); // Adjust path as needed
      },
      error: () => {
        this.toast.error('Something went wrong. Please try again.');
      }
    });
    console.log('Form Data:', data);
    // this.toast.success('Form data logged in console.');



  }
    }





}
