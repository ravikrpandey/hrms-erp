import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';


@Component({
  selector: 'app-location-master-create',
  templateUrl: './location-master-create.component.html',
  styleUrls: ['./location-master-create.component.scss']
})
export class LocationMasterCreateComponent {
  createPrItemForm: FormGroup;
  MASTER_ITEM_SPECIFICATIONs: any[] = [];
  entity_id: any;
  LocationForm: FormGroup;
  id: any;
  isView:boolean=false;
  action_type: any;
  data: any = [];
  response: any = null;
  presentSteteData: any;
  presentSteteData2: any;
  states1: any;
  countryList: any;
  variables: any;
  countryList2: any;
  countries1: any;
  permanentcountryList: any;
  permanentcountryList2: any;
  presentCountryList: any;
  presentCountryList2: any;
  countries2: any;
  countries3: any;
  checkData: any;
  variable: any;
  permanentCityList: any;
  permanentCityList2: any;
  cities2: any;
  presentCityList: any;
  presentCityList12: any;
  cities1: any;
  location_id:number;
  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    public $common: CommonService,
    private route: Router,
    private _empRegistration: EmpRegistrationService,
  ) {
    this.LocationForm = this.fb.group({

      present_country_id: new FormControl(null,),
      present_state_id: new FormControl(null),
      city_id: new FormControl(null, [Validators.required]),
      location_name: new FormControl(null, [Validators.required]),
      location_code: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this._empRegistration.setEmpTitle('PERSONAL DETAILS');
    this.getAllCountry();
    this.getAll_Country_codes();
    this.activeroute.queryParams.subscribe({
      next:(res:any)=> {
        this.getLocation(res.id);
        this.action_type = res.action_type;
        this.isView= res.action_type =='view'?true:false;
        if(this.isView){

          this.LocationForm.disable()
        }
        this.location_id = res.id;
      },error:(err)=> {
        console.log(err)
      },
    })
  }
  getLocation(id:any){
  this._empRegistration.getLocation(id).subscribe({
    next:(res:any)=> {
      console.log("location master ===========>",res);
      this.presentCountryMethod(res.data.countryss_id);
      this.presentGetCityByState(res.data.states_id);
      let respData = res.data;
this.LocationForm.patchValue({
  present_country_id:respData.countryss_id,
present_state_id:respData.states_id,
city_id:respData.city_id,
location_name:respData.location_name,
location_code:respData.location_code
});
    },error:(err)=> {
      console.log(err)
      this.toaster.error(err.error.message);
    },
  })
  }
  /*regarding country*/
  presentCountryChange(e: any) {
    this.presentCountryMethod(e?.value);
  }
  presentCountryMethod(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        if (res && res?.data) {
          this.presentSteteData = res?.data;
          this.presentSteteData2 = res?.data;
          this.states1 = this.presentSteteData2.map((item: any) => item.states_name)
        }
      }
    );
  }

  /*regarding state*/
  permanentState(e: any) {
    this.permanentGetCityByState(e?.value);
  }
  permanentGetCityByState(id: any) {
    if (id) {
      this._empRegistration.getCityByState(id).subscribe(
        (res: any) => {
          if (res && res.data) {
            this.permanentCityList = res.data;
            this.permanentCityList2 = res.data;
            this.cities2 = this.permanentCityList2.map((item: any) => item.city_name)
          }
        }
      );
    }

  }

  /*regarding city*/
  presentStateChange(e: any) {
    this.presentGetCityByState(e?.value);
  }
  presentGetCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        if (res && res?.data) {
          this.presentCityList = res?.data;
          this.presentCityList12 = res?.data;
          this.cities1 = this.presentCityList.map((item: any) => item.city_name)
        }
      }
    );
  }


  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.variables = this.countryList.map((res: any) => res.countryss_name)
        this.countryList2 = res?.data;
        this.countries1 = this.countryList.map((item: any) => item.countryss_name)
        this.permanentcountryList = res?.data;
        this.permanentcountryList2 = res?.data;
        this.presentCountryList = res?.data;
        this.presentCountryList2 = res?.data;
        this.countries2 = this.countryList.map((item: any) => item.countryss_name)
        this.countries3 = this.countryList.map((item: any) => item.countryss_name)
        this.checkData = this.countryList
        this.variable = this.countryList
      })
  };

  countryCodeList: any = [[]];
  countryCodeList2: any = [[]];
  codes: any = [[]];
  getAll_Country_codes() {

    this._configurationalMasterService.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList[0] = res.data
      this.countryCodeList2[0] = res.data
      this.codes[0] = this.countryCodeList[0].map((value: any) => value.dialing_code)
      console.log("dsdssdsd", this.countryCodeList)
      // this.getById()
    })
  }

  stateSearch1(e: any) {
    const aa = e
    let filteredVariable = this.presentSteteData2.filter((item: any) => aa.includes(item.states_name));
    this.presentSteteData = filteredVariable
  }

  countrySearch1(e: any) {
    const aa = e
    let filteredVariable = this.countryList2.filter((item: any) => aa.includes(item.countryss_name));
    this.countryList = filteredVariable
  }

  citySearch1(e: any) {
    const aa = e
    let filteredVariable = this.presentCityList12.filter((item: any) => aa.includes(item.city_name));
    this.presentCityList = filteredVariable
  }



onSubmit() {
  if (this.LocationForm.invalid) {
    this.LocationForm.markAllAsTouched();
    return;
  }

  const payload = {
    // present_country_id: this.LocationForm.value.present_country_id,
    // present_state_id: this.LocationForm.value.present_state_id,
    city_id: this.LocationForm.value.city_id,
    location_code: this.LocationForm.value.location_code,
    location_name: this.LocationForm.value.location_name,
  };

  console.log("checked here all data ****", payload);
  if(!this.location_id){

    this._empRegistration.saveLocation(payload).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.toaster.success("Location saved successfully!");
          this.route.navigate(['master/configurational-master/location-master']);
        } else {
          this.toaster.error("Something went wrong while saving!");
        }
      },
      error: (err: any) => {
        console.error("Error saving location:", err);
        this.toaster.error("Failed to save location!");
      }
    });
  }else{
    this._empRegistration.updateLocation(payload,this.location_id).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.toaster.success("Location saved successfully!");
          this.route.navigate(['master/configurational-master/location-master']);
        } else {
          this.toaster.error("Something went wrong while saving!");
        }
      },
      error: (err: any) => {
        console.error("Error saving location:", err);
        this.toaster.error("Failed to save location!");
      }
    });

  }
}





  onBack = () => {
    this.route.navigate(['master/configurational-master/location-master']);
  }




}
