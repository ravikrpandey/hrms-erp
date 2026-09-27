import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}


@Component({
  selector: 'app-branch-setup-create',
  templateUrl: './branch-setup-create.component.html',
  styleUrls: ['./branch-setup-create.component.scss']
})
export class BranchSetupCreateComponent {

  helpDiskForm: any;
  branchSetupForm: any;
  employeId: any;
  parm: any;
  getData: any;
  propertyManager: any;
  firstLastName: any;
  personalIdData: any;
  wordCount: any;

  @ViewChild("text") text: ElementRef;
  words: any;
  extraWords: boolean = false;

  asignData: any;
  asignvariables: any;
  asignvariable: any;
  uniqueId: any;
  uniquedata: any;
  countrey_id: any;
  stateList: any;
  cityList: any;
  nameSearch: any = '';
  countryList: any = [];
  state_id: any;
  phoneCode: any;
  variables: any = [];
  variable: any = [];
  checkData: any;
  stateVar: any = [];
  stateVar2: any = [];
  cityVar: any = [];
  cityVar2: any = [];
  loginUser: any;
  entity_id: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private locatin: Location,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private location: Location
  ) {
    // branchSetupForm
    this.branchSetupForm = this.fb.group({
      branch_name: new FormControl(null, [Validators.required, noLeadingSpaces(), Validators.minLength(2), Validators.maxLength(150)]),
      branch_gstnumber: new FormControl(null, []),
      branch_contact_person_name: new FormControl(null, [Validators.required]),
      branch_contact_no: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{7,13}$/)]),
      branch_alt_contact_no: new FormControl(null, [Validators.pattern(/^[0-9]{7,13}$/)]),
      branch_email: new FormControl(null, [Validators.required, Validators.email]),
      branch_alt_email: new FormControl(null, [Validators.email]),
      country_id: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, []),
      city_id: new FormControl(null, []),
      branch_pin_code: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(6)]),
      branch_address: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      useAsBillingAddress: new FormControl(null),
      branch_code: new FormControl(null, [Validators.required]),
      contact_country_code:new FormControl(null),
      alt_contact_country_code:new FormControl(null),
      latitude: new FormControl(null),
      longitude: new FormControl(null),
      geofence_radius_meters: new FormControl(150),
      is_geofence_active: new FormControl(true)
    })
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.employeId = params.id;

    })
    this.getAssginSingle();
    this.getAllActiveCountry();
    if (this.employeId) {
      this.getByIdUse();
      this.getByUniqueNumber()

    }
    this.AutoGenerateRequestNo();
    this.getAll_Country_codes();


    this.entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(this.entity_id, this.loginUser?.role).subscribe((res: any) => {

      this.personalIdData = res.data;
      this.propertyManager = Array.from(this.personalIdData, (a: any) => `${a.first_name} ${a.last_name}`)

    })

    this._empRegistration.getByUserId(localStorage.getItem('EmpMainId')).subscribe((res: any) => {

      this.getData = res.data.first_name;
      // this.branchSetupForm.controls['requester'].setValue(this.getData);
    })

    if (!this.employeId) {
      this.getuniqueNumber();

    }
  }

  optionEaCode(event: any) {

    for (let item of this.countryList) {
      if (item.countryss_id == event?.value) {
        this.phoneCode = item?.phone_code;

      }
    }

    // this.newPhoneCode = "+" + this.phoneCode;
    // const code = this.newPhoneCode.toString();

    // this.basicForm.patchValue({
    //   mobile_code: this.newPhoneCode
    // })
    //   let newStatus = true;
    //   this.productselect.options.forEach((item: MatOption) => {
    //     if (!item.selected) {
    //       newStatus = false;
    //     }
    //   });
    //   this.allSelectedProduct = newStatus;

    this.getStateByCountry(event.value);

  }

  stateChange(e: any) {


    this.state_id = e.value;
    this.getCityByState(e.value);
  };

  countryFilter(e: any) {

    const aa = e
    let filteredVariable = this.variable.filter((item: any) => aa.includes(item.countryss_name));
    this.checkData = filteredVariable
  }

  stateFilter(e: any) {
    const aa = e
    let filteredVariable = this.stateVar2.filter((item: any) => aa.includes(item.states_name));
    this.stateList = filteredVariable
  }

  cityFilter(e: any) {
    const aa = e
    let filteredVariable = this.cityVar2.filter((item: any) => aa.includes(item.city_name));
    this.cityList = filteredVariable
  }

  filterCountryName:any =[]

  getAllActiveCountry() {
    this._empRegistration.getAllActivecountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.variables = this.countryList.map((res: any) => res.countryss_name)
       
        this.checkData = this.countryList
        this.variable = this.countryList
         this.filterCountryName = [...this.checkData]
      })
  };

  filterStateName:any =[]
  getStateByCountry(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this.stateList = res.data;
        this.stateVar = this.stateList.map((res: any) => res.states_name);
        this.stateVar2 = this.stateList;
        this.filterStateName= [...this.stateVar2]
        // this.contryName =res.data[0].countryss_name;

        // if (this.getData) {
        //   this.branchSetupForm.controls['state_id'].patchValue(Number(this.getData?.state_id))
        // }
      }
    )
  }

  filterCityName:any =[]

  getCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        this.cityList = res.data;
        this.cityVar = this.cityList.map((res: any) => res.city_name);
        this.cityVar2 = this.cityList;
        this.filterCityName = [...this.cityVar2]

        // if (this.getData) {
        //   this.branchSetupForm.controls['city_id'].patchValue(Number(this.getData?.city_id))
        // }
      }
    )
  };

  goBack() {
    this.location.back();
  }
  getAssginSingle() {
    this.recruitService.getSpocRecruipment().subscribe((res: any) => {
      this.asignData = res.data;
      this.asignvariables = this.asignData.map((res: any) => res.first_name)
      this.asignvariable = this.asignData

    });
  }

  asignFilter(e: any) {
    const aa = e
    let filteredVariable = this.asignvariable.filter((item: any) => aa.includes(item.first_name));
    this.asignData = filteredVariable

  }

  wordCounter() {
    //alert(this.text.nativeElement.value)
    this.wordCount = this.text ? this.text.nativeElement.value.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
  }

  changedText() {
    if (this.words >= 50) {
      this.extraWords = true;
      this.toast.warning('Please enter within the text limit..', 'Warning Message');
      return
    } else if (this.words < 50) {
      this.extraWords = false;
    }
  }

  back() {
    history.back()
  }

  getByIdUse() {
    this._configurationalMasterService.branchSetupGetById(this.employeId).subscribe((res: any) => {
      this.getData = res.data;

      const val1 = { value: this.getData.countryss_id }
      const val2 = { value: this.getData.states_id }
      this.optionEaCode(val1)
      this.stateChange(val2)
      // this.getStateByCountry(this.getData.countryss_id);
      // this.getCityByState(this.getData.states_id)

      // console.log(this.getData);
      // this.getAssginSingle()
      this.basicFormPatch(this.getData)
    })
  }

  AutoGenerateRequestNo() {
    this.emp_master.AutoGenerateRequestNo().subscribe((response: any) => {

      const apiRequestNo = response.data;
      // this.helpDiskForm.patchValue({
      //   request_no: apiRequestNo
      // });
      // this.helpDiskForm.controls['request_no'].disable();
    },
      (error) => {
        // Handle error
      }
    )
  }

  getByUniqueNumber() {
    this.emp_master.getByUniqueNumber(this.employeId).subscribe((res: any) => {
      this.uniqueId = res?.data;
      this.branchSetupForm.patchValue({
        request_no: this.uniqueId
      });
      this.branchSetupForm.controls['request_no'].disable();
    })
  }

  basicFormPatch(getData: any) {
    this.branchSetupForm.patchValue({
      branch_name: getData?.branch_name,
      branch_gstnumber: getData?.branch_gstnumber,
      branch_contact_person_name: getData?.branch_contact_person_name,
      branch_contact_no: getData?.branch_contact_no,
      branch_alt_contact_no: getData?.branch_alt_contact_no,
      branch_email: getData?.branch_email,
      branch_alt_email: getData?.branch_alt_email,
      country_id: getData?.countryss_id,
      state_id: getData?.states_id,
      city_id: getData?.city_id,
      branch_pin_code: getData?.branch_pin_code,
      branch_address: getData?.branch_address,
      branch_code: getData?.branch_code,
      useAsBillingAddress: getData?.billing_status == 1 ? true : false,
      contact_country_code:getData?.contact_country_code,
      alt_contact_country_code:getData?.alt_contact_country_code,
      latitude: getData?.latitude,
      longitude: getData?.longitude,
      geofence_radius_meters: getData?.geofence_radius_meters || 150,
      is_geofence_active: getData?.is_geofence_active !== undefined ? Boolean(getData?.is_geofence_active) : true
    })
  }

  isFetchingLocation: boolean = false;

  fetchCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.toast.error('Geolocation is not supported by your browser.', 'GPS Error');
      return;
    }

    this.isFetchingLocation = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.isFetchingLocation = false;
        const lat = Number(position.coords.latitude.toFixed(7));
        const lng = Number(position.coords.longitude.toFixed(7));
        this.branchSetupForm.patchValue({
          latitude: lat,
          longitude: lng
        });
        this.toast.success(`Acquired Coordinates: ${lat}, ${lng}`, 'GPS Location Acquired');
      },
      (error) => {
        this.isFetchingLocation = false;
        console.error('Geolocation error:', error);
        this.toast.error(error.message || 'Unable to retrieve location. Check browser location permissions.', 'GPS Error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  openGoogleMapsPreview(): void {
    const lat = this.branchSetupForm.get('latitude')?.value;
    const lng = this.branchSetupForm.get('longitude')?.value;
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
      this.toast.warning('Please enter or fetch Latitude and Longitude first.', 'Location Required');
    }
  }

  updateForm(e: any) {
    if (this.branchSetupForm.invalid) {
      this.toast.error('required fields should be valid', 'Required fields');
      return
    }
    e.stopPropagation();
    let req = this.branchSetupForm.value;
    req.entity_id = Number(this.entity_id);

    if (req?.useAsBillingAddress) req.billing_status = 1;
    else req.billing_status = 0;
    this._configurationalMasterService.updateBranchSetup(this.employeId, req).subscribe((res: any) => {
      this.toast.success("Branch Setup Updated successfully", "Updated successfully")
      this.router.navigate(['master/configurational-master/branch-setup']);


    }, (err) => {
      this.toast.error(`${err.error.message}`, "Error Message");
    }

    )
  }

  onSubmitForm() {
    let val = this.branchSetupForm.value;
    val.entity_id = Number(this.entity_id);
    if (val?.useAsBillingAddress) val.billing_status = 1;
    else val.billing_status = 0;
    if (this.branchSetupForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    this._configurationalMasterService.branchSetupCreate(val).subscribe((res: any) => {

      this.toast.success("Branch Setup created successfully", "Created Successfully");
      this.router.navigate(['master/configurational-master/branch-setup']);
    }, (err) => {

      if (err.error.code === 403 || err.erro.code === 400) {
        this.toast.error(`${err.error.message}`, "Error Massage");
      } else {
        this.toast.error("Something went wrong please try again", "Error Massage");
      }
    }
    )
  }

  getuniqueNumber() {
    this.emp_master.getUniqueNumber().subscribe((res: any) => {
      this.uniquedata = res.data;

      this.branchSetupForm.patchValue({
        request_no: this.uniquedata
      });
      this.branchSetupForm?.controls['request_no']?.disable();
    })
  }


  countryCodeList: any = [];
  getAll_Country_codes() {

    this._configurationalMasterService.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList = res.data
      console.log("dsdssdsd", this.countryCodeList)
    })
  }


}
