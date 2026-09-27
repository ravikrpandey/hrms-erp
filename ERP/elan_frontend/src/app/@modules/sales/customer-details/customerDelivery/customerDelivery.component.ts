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
// import { customerDeliveryComponent } from './customerDelivery.component';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-customer-delivery',
  templateUrl: './customerDelivery.component.html',
  styleUrls: ['./customerDelivery.component.scss'],
})
export class customerDeliveryComponent {
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
  flag : any = false;
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
      full_delivery_add: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      delivery_loc_code: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      full_delivery_land_add: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      delivery_pin_code: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      delivery_mobile_no1: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      delivery_mobile_no2: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      delivery_mobile_no3: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      delivery_land_line_no: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      delivery_email_id1: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      delivery_email_id2: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      delivery_email_id3: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      // customer_id: new FormControl(null, [Validators.required]),
      city_id: new FormControl(null, [Validators.required]),
      states_id: new FormControl(null, [Validators.required]),
      countryss_id: new FormControl(null, [Validators.required]),
    });

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
      this.setValidators()
      this.statusCustomer=params.status;
      if (this.customer_id) {
        this.getCustomerProfileById(this.customer_id);
      }
    });
  }

  setValidators = () => {
    if (this.new_customer == 'NO' || !this.new_customer) {
      // Set Validators.required for required fields
      this.customerProfileForm.get('full_delivery_add')?.setValidators([Validators.required, noLeadingSpaces()]);
      this.customerProfileForm.get('delivery_loc_code')?.setValidators([Validators.required, noLeadingSpaces()]);
      this.customerProfileForm.get('full_delivery_land_add')?.setValidators([Validators.required]);
      this.customerProfileForm.get('delivery_pin_code')?.setValidators([Validators.required]);
      this.customerProfileForm.get('delivery_mobile_no1')?.setValidators([Validators.required]);
      this.customerProfileForm.get('delivery_mobile_no2')?.setValidators([Validators.required]);
      this.customerProfileForm.get('delivery_mobile_no3')?.setValidators([Validators.required, noLeadingSpaces()]);
      this.customerProfileForm.get('delivery_land_line_no')?.setValidators([Validators.required]);
      this.customerProfileForm.get('delivery_email_id1')?.setValidators([Validators.required]);
      this.customerProfileForm.get('delivery_email_id2')?.setValidators([Validators.required]);
      this.customerProfileForm.get('delivery_email_id3')?.setValidators([Validators.required]);
      this.customerProfileForm.get('billing_email_id3')?.setValidators([Validators.required]);
      this.customerProfileForm.get('city_id')?.setValidators([Validators.required]);
      this.customerProfileForm.get('states_id')?.setValidators([Validators.required]);
      this.customerProfileForm.get('countryss_id')?.setValidators([Validators.required]);
    } else {
      // Remove Validators.required from the fields
      this.customerProfileForm.get('full_delivery_add')?.clearValidators();
      this.customerProfileForm.get('delivery_loc_code')?.clearValidators();
      this.customerProfileForm.get('full_delivery_land_add')?.clearValidators();
      this.customerProfileForm.get('delivery_pin_code')?.clearValidators();
      this.customerProfileForm.get('delivery_mobile_no1')?.clearValidators();
      this.customerProfileForm.get('delivery_mobile_no2')?.clearValidators();
      this.customerProfileForm.get('delivery_mobile_no3')?.setValidators([noLeadingSpaces()]);
      this.customerProfileForm.get('delivery_land_line_no')?.clearValidators();
      this.customerProfileForm.get('delivery_email_id1')?.clearValidators();
      this.customerProfileForm.get('delivery_email_id2')?.clearValidators();
      this.customerProfileForm.get('delivery_email_id3')?.clearValidators();
      this.customerProfileForm.get('billing_email_id3')?.clearValidators();
      this.customerProfileForm.get('city_id')?.clearValidators();
      this.customerProfileForm.get('states_id')?.clearValidators();
      this.customerProfileForm.get('countryss_id')?.clearValidators();
    }
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
    this.salesService.getCustomerDeliveryById(id).subscribe((response: any) => {
      let data = response.data[0];
      this.lead_id=response?.data?.lead_id;
      console.log("++++++",data)
      // this.onCustomerCategoryChange(data.customer_category_id);
      this.states_id = data.states_id;
      this.city_id = data.city_id;
      ;
      if (data.full_delivery_add){
        this.flag = true;
      }else {
        this.flag = false;
      }
      this.getStatesByCountryId(data.countryss_id);
      if (data) {
        this.customerProfileForm.patchValue({
          full_delivery_add: data.full_delivery_add,
          delivery_loc_code: data.delivery_loc_code,
          full_delivery_land_add: data.full_delivery_land_add,
          delivery_pin_code: data.delivery_pin_code,
          delivery_mobile_no1: data.delivery_mobile_no1,
          delivery_mobile_no2: data.delivery_mobile_no2,
          delivery_mobile_no3: data.delivery_mobile_no3,
          delivery_land_line_no:data.delivery_land_line_no,
          delivery_email_id1: data.delivery_email_id1,
          delivery_email_id2: data.delivery_email_id2,
          delivery_email_id3: data.delivery_email_id3,
          // customer_id: new FormControl(null, [Validators.required]),
          city_id: data.city_id,
          states_id: data.states_id,
          countryss_id: data.countryss_id,
        });
      }
    });
  }

  goBack() {
    this.location.back();
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
      full_delivery_add: this.customerProfileForm.value.full_delivery_add,
      delivery_loc_code: this.customerProfileForm.value.delivery_loc_code,
      full_delivery_land_add: this.customerProfileForm.value.full_delivery_land_add,
      delivery_pin_code: this.customerProfileForm.value.delivery_pin_code,
      delivery_mobile_no1: this.customerProfileForm.value.delivery_mobile_no1,
      delivery_mobile_no2: this.customerProfileForm.value.delivery_mobile_no2,
      delivery_mobile_no3: this.customerProfileForm.value.delivery_mobile_no3,
      delivery_land_line_no: this.customerProfileForm.value.delivery_land_line_no,
      delivery_email_id1: this.customerProfileForm.value.delivery_email_id1,
      delivery_email_id2: this.customerProfileForm.value.delivery_email_id2,
      delivery_email_id3: this.customerProfileForm.value.delivery_email_id3,
      customer_id: this.customer_id,
      city_id: this.customerProfileForm.value.city_id,
      states_id: this.customerProfileForm.value.states_id,
      countryss_id: this.customerProfileForm.value.countryss_id,
    };
    if ( !this.flag ) {
      this.salesService.createCustomerDelivery(data).subscribe(
        (res: any) => {
          if(res.code == '201'){
          return this.toast.error(res.message);
          }
          this.toast.success(res.message);
          this.comman_service.sendSelectedId(1);
          if(this.action_type){
            this.router.navigate(['/master/sales/customer-details/documents'], { queryParams: { id: this.customer_id,action_type: this.action_type ,lead_id:this.lead_id,new_customer:this.new_customer}  })
          }
          // else if(this.statusCustomer === "Exit"){
          //   this.router.navigate(['/master/sales/customer-details/contact'],{ queryParams: { id:res.data.id} });

          // }
          else{
            this.router.navigate(['/master/sales/customer-details/documents'],{ queryParams: { id:this.customer_id,new_customer:this.new_customer} });
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
        this.salesService.updateCustomerDelivery(this.customer_id,data).subscribe(
          (res: any) => {
            if(res.code == '201'){
            return this.toast.error(res.message);
            }
            this.toast.success(res.message);
            // this.comman_service.sendSelectedId(1);
            if(this.action_type){
              this.router.navigate(['/master/sales/customer-details/documents'], { queryParams: { id: this.customer_id,action_type: this.action_type ,lead_id:this.lead_id,new_customer:this.new_customer  }})
            }
            // else if(this.statusCustomer === "Exit"){
            //   this.router.navigate(['/master/sales/customer-details/contact'],{ queryParams: { id:res.data.id} });
  
            // }
            else{
              this.router.navigate(['/master/sales/customer-details/documents'],{ queryParams: { id:this.customer_id,new_customer:this.new_customer} });
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
