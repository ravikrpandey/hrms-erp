
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
  selector: 'app-create-hsn-sac',
  templateUrl: './create-hsn-sac.component.html',
  styleUrls: ['./create-hsn-sac.component.scss']
})
export class CreateHsnSacComponent {
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
  hsnSacForm: any;
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

  view:any;
  entity_id:any;



  gstRateList:any[]=[];

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
    
    this.hsnSacForm = this.fb.group({
      code_type: new FormControl(null, [Validators.required]),
      hsn_sac_code: new FormControl(null),
      gst_rate_id: new FormControl(null, [
        Validators.required
      ]),
      exemption: new FormControl('NO', [Validators.required]),
      description: new FormControl(null),
 
    })
  }
 

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.form_id = params.id;
      this.view = params?.view;
      if(this.view == 'view'){
        this.hsnSacForm.disable();
      }
      else{
        this.hsnSacForm.enable();
      }
    })

    this.getGSTRate();
    this.getAssginSingle();
    if (this.form_id) {
      this.getHsnSacById();

    }

    let entity_id = localStorage.getItem("selectedEntityId");
  }

 

  getHsnSacById(){
   this._configurationalMasterService.getHsnSacById(this.form_id).subscribe((res:any)=>{
    this.hsnSacForm.patchValue({
      code_type: res.data[0]?.code_type,
      hsn_sac_code: res.data[0]?.hsn_sac_code,
      description: res.data[0]?.description,
      gst_rate_id: res.data[0]?.gst_rate_id,
      exemption: res.data[0]?.exemption

    })
   })
  }

  preventNonNumeric(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    if (!/^[0-9]*$/.test(char)) {
      event.preventDefault();
    }
  }

  getGSTRate(){
    this._configurationalMasterService.getGSTRate().subscribe((res:any)=>{
      this.gstRateList = res?.data;
    })
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
      const val1 = { value: this.getData.countryss_id }
      const val2 = { value: this.getData.states_id }
   
      // this.getStateByCountry(this.getData.countryss_id);
      // this.getCityByState(this.getData.states_id)

      // console.log(this.getData);
      // this.getAssginSingle()
    })
  }

  form_id:any;

  onSubmitForm() {
    if (this.hsnSacForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    let val = this.hsnSacForm?.value;
    let payload = {
      formData: val,
      entity_id: this.entity_id,
      form_id: this.form_id
    }
    
    this._configurationalMasterService.create_hsn_sac(payload).subscribe((response: any) => {
      if (response) {
        this.toast.success(response.message);
        this.hsnSacForm.reset();
        this.router.navigate(['master/configurational-master/hsn-sac-master']);
        
        // this.router.navigate(['master/finance/account-charts'])
      }
    }, (err: any) => {
      this.toast.error(err.error.message)
    })
  }



}
