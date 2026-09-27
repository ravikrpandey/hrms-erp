import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { SalesService } from '../../service/sales.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { debounceTime } from 'rxjs';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent {
  customerProfileForm: FormGroup;
  filterCountryControl = new FormControl();
  filterStateControl = new FormControl();
  filtersubtypeControl = new FormControl();
  filterIndustControl = new FormControl();
  filterEmpControl = new FormControl();
  action_type: any = "";
  entity_id: any;
  countryList: any;
  AllStateList: any;
  allCityList: any;
  filteredCountryList: any;
  filteredStateList: any;
  filteredCityList: any;
  wareHouseCode: any;
  customer_id: any;
  entityList: any;
  plant: any = ['Retail', 'Corporate', 'Industrial', 'Government'];
  plantList: any = [];
  financial_year_id: any;
  loginUser: any;
  userLoginId: any;
  filemployeeList: any;
  industryTypeData: any;
  customerType: any = [];
  filteredcustomerType: any = [];
  filteredindustryType: any = [];
  statusCustomer:any;
  lead_id:any;
  data:any;
  customerCategory:any;
  customerTypeData: any;
  customerCategoryData: any;
  customerSubCategoryData: any;
  customerSubCategory:any;
  customerMicroCategory:any;
  microCategoryData:any;
  customerSubCategoryId:any;
  customerMicroCategoryId:any;
  stateList:any;
  cityList:any;
  states_id:any;
  city_id:any;
  flag:any = false;
  new_customer:any;
  constructor(
    private _empRegistration: EmpRegistrationService,
    private travelReqService: TravelRequestService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private location: Location,
    private salesService: SalesService,
    private comman_service:CommonService,
    private _commonService:CommonService  
  ) {

    this.customerProfileForm = this.fb.group({
      full_billing_add: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      full_billing_land_add: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      billing_loc_code: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      billing_pin_code: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      billing_mobile_no1: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      billing_mobile_no2: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      billing_mobile_no3: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      land_line_no: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      billing_email_id1: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      billing_email_id2: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      billing_email_id3: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      // customer_id: new FormControl(null, [Validators.required]),
      city_id: new FormControl(null, [Validators.required]),
      states_id: new FormControl(null, [Validators.required]),
      countryss_id: new FormControl(null, [Validators.required]),
      tds_app: new FormControl(null, [Validators.required]),
      tcs_app: new FormControl(null, [Validators.required]),
    });

    
    
  }

  setValidators = () => {
    if (this.new_customer == 'NO' || !this.new_customer) {
      // Set Validators.required for required fields
      this.customerProfileForm.get('full_billing_add')?.setValidators([Validators.required, noLeadingSpaces()]);
      this.customerProfileForm.get('full_billing_land_add')?.setValidators([Validators.required, noLeadingSpaces()]);
      this.customerProfileForm.get('billing_loc_code')?.setValidators([Validators.required]);
      this.customerProfileForm.get('billing_pin_code')?.setValidators([Validators.required]);
      this.customerProfileForm.get('billing_mobile_pin_code')?.setValidators([Validators.required]);
      this.customerProfileForm.get('billing_mobile_no1')?.setValidators([Validators.required]);
      this.customerProfileForm.get('billing_mobile_no2')?.setValidators([Validators.required, noLeadingSpaces()]);
      this.customerProfileForm.get('billing_mobile_no3')?.setValidators([Validators.required]);
      this.customerProfileForm.get('land_line_no')?.setValidators([Validators.required]);
      this.customerProfileForm.get('billing_email_id1')?.setValidators([Validators.required]);
      this.customerProfileForm.get('billing_email_id2')?.setValidators([Validators.required]);
      this.customerProfileForm.get('billing_email_id3')?.setValidators([Validators.required]);
      this.customerProfileForm.get('city_id')?.setValidators([Validators.required]);
      this.customerProfileForm.get('states_id')?.setValidators([Validators.required]);
      this.customerProfileForm.get('countryss_id')?.setValidators([Validators.required]);
      this.customerProfileForm.get('tds_app')?.setValidators([Validators.required]);
      this.customerProfileForm.get('tcs_app')?.setValidators([Validators.required]);
    } else {
      // Remove Validators.required from the fields
      this.customerProfileForm.get('full_billing_add')?.setValidators([noLeadingSpaces()]);
      this.customerProfileForm.get('full_billing_land_add')?.setValidators([noLeadingSpaces()]);
      this.customerProfileForm.get('billing_loc_code')?.clearValidators();
      this.customerProfileForm.get('billing_pin_code')?.clearValidators();
      this.customerProfileForm.get('billing_mobile_pin_code')?.clearValidators();
      this.customerProfileForm.get('billing_mobile_no1')?.clearValidators();
      this.customerProfileForm.get('billing_mobile_no2')?.setValidators([noLeadingSpaces()]);
      this.customerProfileForm.get('billing_mobile_no3')?.clearValidators();
      this.customerProfileForm.get('land_line_no')?.clearValidators();
      this.customerProfileForm.get('billing_email_id1')?.clearValidators();
      this.customerProfileForm.get('billing_email_id2')?.clearValidators();
      this.customerProfileForm.get('billing_email_id3')?.clearValidators();
      this.customerProfileForm.get('city_id')?.clearValidators();
      this.customerProfileForm.get('states_id')?.clearValidators();
      this.customerProfileForm.get('countryss_id')?.clearValidators();
      this.customerProfileForm.get('tds_app')?.clearValidators();
      this.customerProfileForm.get('tcs_app')?.clearValidators();
    }
  }



  ngOnInit() {
    const customer_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
    this.customerProfileForm.patchValue({
      customer_code: customer_code,
    });
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    console.log('loginUserloginUserloginUser', this.loginUser);
    this.getAllCountry();
    this.userLoginId = localStorage.getItem('EmpMainId');
    // this.getAllCountry();
    this.getAllCustomerType();
    this.activeroute.queryParams.subscribe((params:any) => {
      this.customer_id = params['id'];
      this.action_type = params['action_type'];
      this.new_customer = params['new_customer'];
      this.setValidators();
      this.statusCustomer=params.status;
      if (this.customer_id) {
        this.getCustomerProfileById(this.customer_id);
      }
    });
  }

  searchfilter(){
    this.filtersubtypeControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.customerType = this.filteredcustomerType.filter((laveln:any) =>
        laveln.lavel.toLowerCase().includes(value.toLowerCase())
      );
    });

     this.filterIndustControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.industryTypeData = this.filteredindustryType.filter((name:any) =>
        name.industry_type_name.toLowerCase().includes(value.toLowerCase())
      );
    });
    
  }

  getCustomerProfileById(id: any) {
    let data={
status:this.statusCustomer
    }
    this.salesService.getBillingById(id).subscribe((response: any) => {
      let data = response.data[0];
      this.lead_id=response?.data?.lead_id;
      console.log("++++++",data)
      if (data?.full_billing_add){
        this.flag = true;
      }else {
        this.flag = false;
      }
      // this.onCustomerCategoryChange(data.customer_category_id);
      this.states_id = data.states_id;
      this.city_id = data.city_id;
      this.getStatesByCountryId(data.countryss_id);
      if (data) {
        this.customerProfileForm.patchValue({
           "full_billing_add": data.full_billing_add,
      "full_billing_land_add": data.full_billing_land_add,
      "billing_loc_code": data.billing_loc_code,
      "billing_pin_code": data.billing_pin_code,
      "billing_mobile_no1": data.billing_mobile_no1,
      "billing_mobile_no2": data.billing_mobile_no2,
      "billing_mobile_no3": data.billing_mobile_no3,
      "land_line_no": data.land_line_no,
      "billing_email_id1": data.billing_email_id1,
      "billing_email_id2": data.billing_email_id2,
      "billing_email_id3": data.billing_email_id3,
      "tds_app": data.tds_app,
      "tcs_app": data.tcs_app,
      "customer_id": this.customer_id,
      "countryss_id":data.countryss_id,
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/master/sales/customer-details/profile'],{ queryParams: { id:this.customer_id, new_customer:this.new_customer} });
    // this.location.back();
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe((res: any) => {
      this.countryList = res.data;
      console.log('countryList', this.countryList);
    });
  }

  getStatesByCountryId(countryId: any) {
    this.travelReqService
      .getstatesbycountryid(countryId)
      .subscribe((res: any) => {
        if (res && res?.data) {
          this.stateList = res.data;
          console.log("state list",this.stateList)
          this.customerProfileForm.patchValue({city_id:null})
          if ( this.states_id){
            this.customerProfileForm.patchValue({states_id:this.states_id})
            this.getCityByStateId(this.states_id);
          }
        }
      });
  }

   getCityByStateId(stateId: any) {
    this.travelReqService.getcitybystateid(stateId)
      .subscribe((res: any) => {
        if (res && res?.data) {
          this.cityList = res.data;
          if ( this.city_id){
            this.customerProfileForm.patchValue({city_id:this.city_id})
          }
          console.log("city list",this.cityList)
        }
      });
  }




  onChangeCountry(e: any) {
    this.filterStateControl;
    this.getAllState(e?.value);
  }

  onChangeState(e: any) {
    this.filterCountryControl;
    this.getAllCity(e?.value);
  }

  getAllState(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        if (res && res?.data.length > 0) {
          this.AllStateList = res?.data;
          this.filteredStateList = res?.data;
        } else {
          this.toast.warning('states are not exist in this country !');
        }
      },
      (err: any) => {
        this.toast.warning('states are not exist in this country !');
      }
    );
  }

  getAllCustomerType() {
    this._commonService?.showLoader()
    this._configurationalMasterService.getAllCustomer().subscribe((res: any) => {
    this.customerType = res.data;
    console.log("++++",this.customerType)
    this._commonService?.hideLoader()
  },(err:any) => {
    this._commonService?.hideLoader()
  })
  }

  getAllCategory() {
      this._commonService?.showLoader()
      this._configurationalMasterService.allCustomerCategory().subscribe((res: any) => {
      this.customerCategory = res.data;
      console.log("customer Cate++",this.customerCategory)
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
  })
  }

  onCustomerCategoryChange(e: any) {
    this._commonService?.showLoader()
      this._configurationalMasterService.getSubCategoryByCustomerCategory(this.entity_id,this.financial_year_id,e).subscribe((res: any) => {
      this.customerSubCategory = res.data;
      this.customerProfileForm.patchValue({customer_sub_category_id:this.customerSubCategoryId})
      this.customerProfileForm.patchValue({customer_micro_category_id:this.customerMicroCategoryId})
      this.onCustomerSubCategoryChange(this.customerSubCategoryId)
      console.log("++wwwwww++",this.customerSubCategory)
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  onCustomerSubCategoryChange(e:any) {
    this._commonService?.showLoader()
    this._configurationalMasterService.getMicroCategoryBySubCategory(e).subscribe((res: any) => {
    this.microCategoryData = res.data;
    this.customerProfileForm.patchValue({customer_micro_category_id:this.customerMicroCategoryId})
    console.log("micro category data",this.microCategoryData)
    this._commonService?.hideLoader()
    },(err:any) => {
    this._commonService?.hideLoader()
    })
  }

  getAllCity(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        if (res && res?.data.length > 0) {
          this.allCityList = res?.data;
          this.filteredCityList = this.allCityList;
        } else {
          this.toast.warning('city not found !');
        }
      },
      (err: any) => {
        this.toast.warning('city not found !');
      }
    );
  }

  onSubmitForm() {
    ;
    // return;
    if (this.customerProfileForm.invalid) {
      this.toast.error('Required fields should not be empty!', 'Fields error!');
      return;
    }
   
    let data = {
      "full_billing_add": this.customerProfileForm.value.full_billing_add,
      "full_billing_land_add": this.customerProfileForm.value.full_billing_land_add,
      "billing_loc_code": this.customerProfileForm.value.billing_loc_code,
      "billing_pin_code": this.customerProfileForm.value.billing_pin_code,
      "billing_mobile_no1": this.customerProfileForm.value.billing_mobile_no1,
      "billing_mobile_no2": this.customerProfileForm.value.billing_mobile_no2,
      "billing_mobile_no3": this.customerProfileForm.value.billing_mobile_no3,
      "land_line_no": this.customerProfileForm.value.land_line_no,
      "billing_email_id1": this.customerProfileForm.value.billing_email_id1,
      "billing_email_id2": this.customerProfileForm.value.billing_email_id2,
      "billing_email_id3": this.customerProfileForm.value.billing_email_id3,
      "tds_app": this.customerProfileForm.value.tds_app,
      "tcs_app": this.customerProfileForm.value.tcs_app,
      "customer_id": this.customer_id,
      "city_id": this.customerProfileForm.value.city_id,
      "states_id":this.customerProfileForm.value.states_id,
      "countryss_id":this.customerProfileForm.value.countryss_id,
    };
    if (!this.flag) {
      
      this.salesService.createBillingAddress(data).subscribe(
        (res: any) => {
          if(res.code == '201'){
          return this.toast.error(res.message);
          }
          this.toast.success(res.message);
          this.comman_service.sendSelectedId(1);
          if(this.action_type){
            this.router.navigate(['/master/sales/customer-details/customer-delivery'], { queryParams: { id: this.customer_id,action_type: this.action_type ,lead_id:this.lead_id,new_customer:this.new_customer  }})
          }
          // else if(this.statusCustomer === "Exit"){
          //   this.router.navigate(['/master/sales/customer-details/contact'],{ queryParams: { id:res.data.id} });

          // }
          else{
            this.router.navigate(['/master/sales/customer-details/customer-delivery'],{ queryParams: { id:this.customer_id,new_customer:this.new_customer} });
          }
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went wrong!');
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    }else {
      this.salesService.updateBilling(data,this.customer_id).subscribe(
        (res: any) => {
          if(res.code == '201'){
          return this.toast.error(res.message);
          }
          this.toast.success(res.message);
          this.comman_service.sendSelectedId(1);
          if(this.action_type){
            this.router.navigate(['/master/sales/customer-details/customer-delivery'], { queryParams: { id: this.customer_id,action_type: this.action_type ,lead_id:this.lead_id,new_customer:this.new_customer  }})
          }
          // else if(this.statusCustomer === "Exit"){
          //   this.router.navigate(['/master/sales/customer-details/contact'],{ queryParams: { id:res.data.id} });

          // }
          else{
            this.router.navigate(['/master/sales/customer-details/customer-delivery'],{ queryParams: { id:this.customer_id,new_customer:this.new_customer} });
          }
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went wrong!');
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    }
  }
/* */
  getAllActiveIndustryType() {
    this.salesService.getCustomerIndustryType(this.entity_id,this.financial_year_id).subscribe(
      (res: any) => {
        if (res) {
          this.industryTypeData = res.data;
          this.filteredindustryType = this.industryTypeData;
          console.log("+++++++++",this.industryTypeData)
        }
      },
      (err: any) => {}
    );
  }
}
