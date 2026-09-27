import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField, NgxIntlTelInputModule } from 'ngx-intl-tel-input';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

export function exactLength(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && value.length === length ? null : { exactLength: true };
  };
}

@Component({
  selector: 'app-branch-setup-create',
  templateUrl: './branch-setup-create.component.html',
  styleUrls: ['./branch-setup-create.component.scss']
})
export class BranchSetupCreateComponent {
  NgxIntlTelInputModule: any;

  // For contact form
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  selectedCountryISO: CountryISO = CountryISO.India;
  selectedAltCountryISO: CountryISO = CountryISO.India;
  dynamicPlaceholder: string = 'Enter your phone number';

  // For contact form

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
  countryList: any;
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
  countryCodeListA: any;
  countryCodeListA2: any;
  countryCodeListB: any;
  countryCodeListB2: any;
  codesA: any;
  codesB: any;


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
      branch_gstnumber: new FormControl(null, [Validators.required]),
      branch_contact_person_name: new FormControl(null, [Validators.required]),
      // branch_contact_no: new FormControl(null, [Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
      branch_contact_no: new FormControl(null, [
        Validators.required
      ]),
      pan_number: [
        '',
        [
          Validators.required,
          Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/),
        ],
      ],
      contact_no: new FormControl(null, [
        Validators.required, exactLength(9)]),
      branch_email: new FormControl(null, [Validators.required, Validators.email]),
      branch_alt_email: new FormControl(null, [Validators.email]),
      country_id: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      city_id: new FormControl(null, [Validators.required]),
      branch_pin_code: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(6)]),
      branch_address: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      useAsBillingAddress: new FormControl(null),
      country_code: new FormControl(258),
      alt_country_code: new FormControl(258),
      reverse_charge_applicable: [false],
      gst_composition_scheme: [false],
      gst_lut_bond: [false],
      gst_filing_cycle: ['', Validators.required],
      type_gst_registration: ['', Validators.required],
      e_wayBill: [false],
      sez_registration: [false],
      eway_amount: new FormControl(0)
    })
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.employeId = params.id;
    })

    this.getAll_Country_codes();
    this.getAssginSingle();
    this.getAllActiveCountry();
    if (this.employeId) {
      this.getByIdUse();
      this.getByUniqueNumber()

    }
    this.AutoGenerateRequestNo()

    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
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
  transformUppercase(event: any): void {
    const input = event.target;
    input.value = input.value.toUpperCase();
    this.panNumber.setValue(input.value);
    this.panNumber.updateValueAndValidity();
  }

  get panNumber() {
    return this.branchSetupForm.get('pan_number');
  }
  onCountryCodeChange(code: any) {
    const selectedCode = code;
    // Clear existing validators
    this.branchSetupForm.get('branch_contact_no')?.clearValidators();

    // Set new validators based on the selected country code
    if (selectedCode === '258') {
      this.branchSetupForm.get('branch_contact_no').clearValidators()
      this.branchSetupForm.get('branch_contact_no')?.setValidators([exactLength(9), Validators.required]);
    } else {
      this.branchSetupForm.get('branch_contact_no').clearValidators()
      this.branchSetupForm.get('branch_contact_no')?.setValidators([
        Validators.minLength(5),
        Validators.maxLength(15),
        Validators.required
      ]);
    }
    // Update the control's status to re-evaluate validators
    this.branchSetupForm.get('branch_contact_no')?.updateValueAndValidity();
  }

  codeSearchA(e: any) {
    const aa = e
    let filteredVariable = this.countryCodeListA2.filter((item: any) => aa.includes(item.dialing_code));
    this.countryCodeListA = filteredVariable
  }

  codeSearchB(e: any) {
    const aa = e
    let filteredVariable = this.countryCodeListB2.filter((item: any) => aa.includes(item.dialing_code));
    this.countryCodeListB = filteredVariable
  }

  onAltCountryCodeChange(code: any) {
    const selectedCode = code;
    // Clear existing validators
    this.branchSetupForm.get('contact_no')?.clearValidators();
    // Set new validators based on the selected country code
    if (selectedCode === '258') {
      this.branchSetupForm.get('contact_no').clearValidators()
      this.branchSetupForm.get('contact_no')?.setValidators([exactLength(9)]);
    } else {
      this.branchSetupForm.get('contact_no').clearValidators()
      this.branchSetupForm.get('contact_no')?.setValidators([
        Validators.minLength(5),
        Validators.maxLength(15)
      ]);
    }

    // Update the control's status to re-evaluate validators
    this.branchSetupForm.get('contact_no')?.updateValueAndValidity();
  }

  optionEaCode(event: any) {
    // for (let item of this?.countryList) {
    //   if (item.countryss_id == event?.value) {
    //     this.phoneCode = item?.phone_code;
    //   }
    // }

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

  preventNonNumeric(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    if (!/^[0-9]*$/.test(char)) {
      event.preventDefault();
    }
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

  getAllActiveCountry() {
    this._empRegistration.getAllActivecountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.variables = this.countryList.map((res: any) => res.countryss_name)
        this.checkData = this.countryList
        this.variable = this.countryList
      })
  };

  getStateByCountry(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this.stateList = res.data;
        this.stateVar = this.stateList.map((res: any) => res.states_name);
        this.stateVar2 = this.stateList;
        // this.contryName =res.data[0].countryss_name;
        // if (this.getData) {
        //   this.branchSetupForm.controls['state_id'].patchValue(Number(this.getData?.state_id))
        // }
      }
    )
  }

  getCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        this.cityList = res.data;
        this.cityVar = this.cityList.map((res: any) => res.city_name);
        this.cityVar2 = this.cityList;
        // if (this.getData) {
        //   this.branchSetupForm.controls['city_id'].patchValue(Number(this.getData?.city_id))
        // }
      }
    )
  };
  get reverseChargeApplicable() {
    return this.branchSetupForm.get('reverse_charge_applicable');
  }

  get gstCompositionScheme() {
    return this.branchSetupForm.get('gst_composition_scheme');
  }

  get gstLutBond() {
    return this.branchSetupForm.get('gst_lut_bond');
  }

  get gstFilingCycle() {
    return this.branchSetupForm.get('gst_filing_cycle');
  }
  get gstTypeRegistration() {
    return this.branchSetupForm.get('type_gst_registration')
  }
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
      const val1 = { value: this.getData.MASTER_COUNTRY.countryss_id }
      const val2 = { value: this.getData.MASTER_STATE.states_id }
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
    if (this.getData?.branch_contact_detail) {
      const branch_contact_detail = JSON.parse(this.getData?.branch_contact_detail);
      if (branch_contact_detail?.countryCode) {
        this.selectedCountryISO = branch_contact_detail?.countryCode;
      }
    }

    if (this.getData?.branch_alt_contact_detail) {
      const branch_alt_contact_detail = JSON.parse(this.getData?.branch_alt_contact_detail);
      if (branch_alt_contact_detail?.countryCode) {
        this.selectedAltCountryISO = branch_alt_contact_detail?.countryCode;
      }
    }


    this.branchSetupForm.patchValue({
      branch_name: getData?.branch_name,
      branch_gstnumber: getData?.branch_gstnumber,
      branch_contact_person_name: getData?.branch_contact_person_name,
      country_code: getData?.phone_country_code,
      alt_country_code: getData?.alt_country_code,
      branch_contact_no: getData?.branch_contact_no,
      contact_no: getData?.contact_no,
      branch_email: getData?.branch_email,
      branch_alt_email: getData?.branch_alt_email,
      country_id: getData?.MASTER_COUNTRY.countryss_id,
      state_id: getData?.MASTER_STATE.states_id,
      city_id: getData?.MASTER_CITY.city_id,
      branch_pin_code: getData?.branch_pin_code,
      branch_address: getData?.branch_address,
      useAsBillingAddress: getData?.billing_status == 1 ? true : false,
      pan_number: getData?.pan_number,
      reverse_charge_applicable: getData?.reverse_charge_applicable,
      gst_composition_scheme: getData?.gst_composition_scheme,
      gst_lut_bond: getData?.gst_lut_bond,
      gst_filing_cycle: getData?.gst_filing_cycle,
      type_gst_registration: getData?.type_gst_registration,
      e_wayBill: getData?.e_wayBill,
      sez_registration: getData?.sez_registration,
      eway_amount: getData?.eway_amount
    })
    this.onAltCountryCodeChange(getData?.phone_code)
    this.onCountryCodeChange(getData?.phone_code)
  }

  updateForm(e: any) {
    if (this.branchSetupForm.invalid) {
      this.toast.error('required fields should be valid', 'Required fields');
      return
    }
    e.stopPropagation();
    let req = this.branchSetupForm.value;
    if (req?.useAsBillingAddress) req.billing_status = 1;
    else req.billing_status = 0;

    req.branch_contact_detail = JSON.stringify(req?.branch_contact_no)
    req.country_code = req?.branch_contact_no?.country_code
    req.branch_contact_no = req?.branch_contact_no?.number

    req.branch_alt_contact_detail = JSON.stringify(req?.contact_no)
    req.country_code = req?.contact_no?.country_code
    req.contact_no = req?.contact_no?.number

    this._configurationalMasterService.updateBranchSetup(this.employeId, req).subscribe((res: any) => {
      this.toast.success("Branch Setup Updated successfully", "Updated successfully")
      this.router.navigate(['master/configurational-master/branch-setup']);
    }, (err) => {
      this.toast.error(`${err.error.message}`, "Error Message");
    }
    )
  }

  onSubmitForm() {
    if (this.branchSetupForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    let val = this.branchSetupForm.value;
    if (val?.useAsBillingAddress) val.billing_status = 1;
    else val.billing_status = 0;
    val.branch_contact_detail = JSON.stringify(val?.branch_contact_no)
    val.country_code = val?.branch_contact_no?.country_code
    val.branch_contact_no = val?.branch_contact_no?.number

    val.branch_alt_contact_detail = JSON.stringify(val?.contact_no)
    val.country_code = val?.contact_no?.country_code
    val.contact_no = val?.contact_no?.number

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
      this.countryCodeListA = res.data
      this.countryCodeListA2 = res.data
      this.countryCodeListB = res.data
      this.countryCodeListB2 = res.data
      this.codesA = this.countryCodeListA.map((value: any) => value.dialing_code)
      this.codesB = this.codesA
      this.branchSetupForm.get('country_code').setValue("258")
      this.branchSetupForm.get('alt_country_code').setValue("258")

      console.log("dsdssdsd", this.countryCodeList)
    })
  }

}
