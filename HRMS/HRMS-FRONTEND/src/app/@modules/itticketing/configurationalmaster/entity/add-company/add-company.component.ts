import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CompanyMasterService } from '../company-master/company-master.service';
import { LeadService } from 'src/app/@shared/services/lead.service';



@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent {
  CompanyMasterform: any;
  shiftMasterForm: any;
  companyID: any;
  parm: any;
  getData: any;
  propertyManager: any;
  firstLastName: any;
  personalIdData: any;
  wordCount: any;

  @ViewChild("text") text: ElementRef;
  words: any;
  extraWords: boolean = false;
  loginUser: any;



  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private locatin: Location,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private location: Location,
    private _companyMaster: CompanyMasterService,
    private _leadService: LeadService
  ) {
    // shiftMasterForm
    this.CompanyMasterform = this.fb.group({
      company_name: new FormControl(null, [Validators.required,]),
      company_contact: new FormControl(null, [Validators.required]),
      company_alt_contact_no: new FormControl(null,),
      company_email: new FormControl(null, [Validators.required]),
      company_country: new FormControl(null, [Validators.required,]),
      company_state: new FormControl(null, [Validators.required,]),
      company_city: new FormControl(null, [Validators.required,]),
      company_pincode: new FormControl(null, [Validators.required,]),
      company_address: new FormControl(null, [Validators.required,]),
      company_website: new FormControl(null, [Validators.required,]),
      company_gst: new FormControl(null, [Validators.required,]),
    })
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

    this.getAllCountry()
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params.view;
      console.warn(this.parm, 'this.parm');

      this.companyID = params.id;

    })
    if (this.companyID) {
      this.getByIdUse();
    }

    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {

      this.personalIdData = res.data;
      this.propertyManager = Array.from(this.personalIdData, (a: any) => `${a.first_name} ${a.last_name}`)

    })

    this._empRegistration.getByUserId(localStorage.getItem('EmpMainId')).subscribe((res: any) => {

      this.getData = res.data.first_name;
      this.shiftMasterForm?.controls['requester']?.setValue(this.getData);
    })
  }




  // get All state
  getAllCountryData: any
  getAllCountry() {
    this._configurationalMasterService.getCountry().subscribe((res: any) => {
      this.getAllCountryData = res.data
    })
  }
  // get All state
  getAllStateData: any
  getAllState(id: any) {
    this._leadService.getStateByID(id).subscribe((res: any) => {
      this.getAllStateData = res.data
    })
  }

  getStateId(event: any) {
    console.log(event);

    this.getAllState(event.value)
  }
  getCityData: any
  getByCity(event: any) {
    let id = event.value
    this.getAllCityData(id)
  }

  getAllCityData(id: any) {
    this._leadService.getCityByID(id).subscribe((res: any) => {
      this.getCityData = res.data;
    })
  }

  goBack() {
    this.location.back();
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
    this._companyMaster.getByIDCompany(this.companyID).subscribe((res: any) => {
      this.getData = res.data;
      this.basicFormPatch(this.getData)
    })
  }

  basicFormPatch(getData: any) {
    if (this.parm == 'view') {
      this.CompanyMasterform.disable()
      console.log(getData);
      this.getAllCountry()
      this.getAllState(getData.company_country)
      this.getAllCityData(getData.company_state)
      this.CompanyMasterform.patchValue({
        company_name: getData.company_name,
        company_contact: getData.company_contact,
        company_alt_contact_no: getData.company_alt_contact_no,
        company_email: getData.company_email,
        company_country: getData.company_country,
        company_state: getData.company_state,
        company_city: getData.company_city,
        company_pincode: getData.company_pincode,
        company_address: getData.company_address,
        company_website: getData.company_website,
        company_gst: getData.company_gst
        ,
      })
    }
    else {
      this.getAllCountry()
      this.getAllState(getData.company_country)
      this.getAllCityData(getData.company_state)
      this.CompanyMasterform.patchValue({
        company_name: getData.company_name,
        company_contact: getData.company_contact,
        company_alt_contact_no: getData.company_alt_contact_no,
        company_email: getData.company_email,
        company_country: getData.company_country,
        company_state: getData.company_state,
        company_city: getData.company_city,
        company_pincode: getData.company_pincode,
        company_address: getData.company_address,
        company_website: getData.company_website,
        company_gst: getData.company_gst
        ,
      })
    }

  }

  updateForm(e: any) {
    ;

    if (this.CompanyMasterform.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    e.stopPropagation();
    this._companyMaster.updateByIdCompany(this.companyID, this.CompanyMasterform.value).subscribe((res: any) => {
      this.toast.success(res.message, "Success Message")
      this.router.navigate(['/master/configurational-master/company-master']);


    }, (err) => {

      this.toast.error(err.error.message, "Error Massage");
    }

    )
  }

  onSubmitForm() {
    if (this.CompanyMasterform.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    this._companyMaster.addCompanyData(this.CompanyMasterform.value).subscribe((res: any) => {

      this.toast.success(res.message, "Created Successfully");
      this.router.navigate(['/master/configurational-master/company-master']);
    }, (err) => {
      this.toast.error(err.error.message)
    }
    )
  }
}
