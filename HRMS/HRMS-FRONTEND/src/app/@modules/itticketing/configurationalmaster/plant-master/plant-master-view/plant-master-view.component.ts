import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-plant-master-view',
  templateUrl: './plant-master-view.component.html',
  styleUrls: ['./plant-master-view.component.scss']
})
export class PlantMasterViewComponent {
  plantMasterForm: any;
  plantMasterId: any;
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
  variables: any = [];
  variable: any = [];
  countryList: any;
  phoneCode: any;
  newPhoneCode: string;
  stateList: any;
  stateVar: any = [];
  stateVar2: any = [];
  checkData: any;


  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private toast: ToastrService,
    private locatin: Location,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private location: Location
  ) {

    this.plantMasterForm = this.fb.group({
      plant_code: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      plant_name: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      country_id: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      plant_location: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      plant_pincode: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(6)]),
      plant_address: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      plant_contactno: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
      plant_altcontactno: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
      plant_emailid: new FormControl(null, [Validators.required, Validators.email]),
      plant_headname: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      plant_headcontactno: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
    })
  }

  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.plantMasterId = params.id;
    })
    this.getAllCountry();
    if (this.plantMasterId) {
      this.getByIdPlantMaster();
    }
  }
  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.variables = this.countryList.map((res: any) => res.countryss_name)
        this.checkData = this.countryList
        this.variable = this.countryList

      })
  };

  optionEaCode(event: any) {

    for (let item of this.countryList) {
      if (item.countryss_id == event?.value) {
        this.phoneCode = item?.phone_code;

      }
    }

    this.newPhoneCode = "+" + this.phoneCode;
    const code = this.newPhoneCode.toString();

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

  getStateByCountry(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this.stateList = res.data;
        this.stateVar = this.stateList.map((res: any) => res.states_name);
        this.stateVar2 = this.stateList;

        if (this.getData) {


          this.plantMasterForm.controls['state_id'].patchValue(Number(this.getData?.state_id))
        }
      }
    )
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

  getByIdPlantMaster() {
    this._configurationalMasterService.getByIdPlantMaster(this.plantMasterId).subscribe((res: any) => {
      this.getData = res.data;
      // console.log(this.asignData);


      // console.log(this.getData);
      // this.getAssginSingle()
      this.basicFormPatch(this.getData)
      this.getStateByCountry(this.getData.country_id)
    })
  }

  basicFormPatch(getData: any) {

    this.plantMasterForm.patchValue({
      plant_code: getData?.plant_code,
      plant_name: getData?.plant_name,
      country_id: getData?.country_id,
      state_id: getData?.state_id,
      plant_location: getData?.plant_location,
      plant_pincode: getData?.plant_pincode,
      plant_address: getData?.plant_address,
      plant_contactno: getData?.plant_contactno,
      plant_altcontactno: getData?.plant_altcontactno,
      plant_emailid: getData?.plant_emailid,
      plant_headname: getData?.plant_headname,
      plant_headcontactno: getData?.plant_headcontactno,
    })
  }

}
