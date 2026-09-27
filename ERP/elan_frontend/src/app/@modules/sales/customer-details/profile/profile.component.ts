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
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
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
  isGstType:boolean=true;
  oldGstNo:string;
  filteredCountryList: any;
  filteredStateList: any;
  filteredCityList: any;
  wareHouseCode: any;
  customer_id: any;
  entityList: any;
  plant: any = ['Retail', 'Corporate', 'Industrial', 'Government'];
  gstCategory: any = [{key:'RP',value:'RP (registered person)'},{key:'URP',value:'URP (un-registered person)'}];
  plantList: any = [];
  financial_year_id: any;
  loginUser: any;
  userLoginId: any;
  filemployeeList: any;
  industryTypeData: any;
  customerType: any = [];
  priceType: any = [];
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
  flag:any = false;
  parentCompanyList:any=[];
  customer_type:any;
  new_customer:any;
  supplyTypeList: any = [];
  constructor(
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private location: Location,
    private salesService: SalesService,  
    private _commonService:CommonService,
    private crm :CrmService  
  ) {
    this.customerProfileForm = this.fb.group({
      company_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      identification: new FormControl(null),
      customer_code: new FormControl(null),
      customer_type_id: new FormControl(null, [Validators.required]),
      price_type_id: new FormControl(null),
      customer_sub_category_id: new FormControl(null),
      customer_industry_type_id: new FormControl(null),
      gst_in: new FormControl(null),
      pan_number: new FormControl(null),
      customer_category_id: new FormControl(null, [Validators.required]),
      customer_status: new FormControl('ACTIVE'),
      website: new FormControl(null),
      // registration_date: new FormControl(null, [Validators.required]),
      customer_micro_category_id: new FormControl(null),
      gst_category: new FormControl(null),
      gst_registration_date: new FormControl(null),
      registration_date_of_party: new FormControl(null),
      is_group: new FormControl(null),
      parent_id: new FormControl(null),
      supply_type: new FormControl(null),
    });

    // if (!new_customer) {
    //   // Set Validators.required for required fields
    //   this.customerProfileForm.get('company_name')?.setValidators([Validators.required, noLeadingSpaces()]);
    //   this.customerProfileForm.get('customer_code')?.setValidators([Validators.required, noLeadingSpaces()]);
    //   this.customerProfileForm.get('customer_type_id')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('price_type_id')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('customer_sub_category_id')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('customer_industry_type_id')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('gst_in')?.setValidators([Validators.required, noLeadingSpaces()]);
    //   this.customerProfileForm.get('customer_category_id')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('customer_status')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('customer_micro_category_id')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('gst_category')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('gst_registration_date')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('registration_date_of_party')?.setValidators([Validators.required]);
    //   this.customerProfileForm.get('is_group')?.setValidators([Validators.required]);
    // } else {
    //   // Remove Validators.required from the fields
    //   this.customerProfileForm.get('company_name')?.setValidators([noLeadingSpaces()]);
    //   this.customerProfileForm.get('customer_code')?.setValidators([noLeadingSpaces()]);
    //   this.customerProfileForm.get('customer_type_id')?.clearValidators();
    //   this.customerProfileForm.get('price_type_id')?.clearValidators();
    //   this.customerProfileForm.get('customer_sub_category_id')?.clearValidators();
    //   this.customerProfileForm.get('customer_industry_type_id')?.clearValidators();
    //   this.customerProfileForm.get('gst_in')?.setValidators([noLeadingSpaces()]);
    //   this.customerProfileForm.get('customer_category_id')?.clearValidators();
    //   this.customerProfileForm.get('customer_status')?.clearValidators();
    //   this.customerProfileForm.get('customer_micro_category_id')?.clearValidators();
    //   this.customerProfileForm.get('gst_category')?.clearValidators();
    //   this.customerProfileForm.get('gst_registration_date')?.clearValidators();
    //   this.customerProfileForm.get('registration_date_of_party')?.clearValidators();
    //   this.customerProfileForm.get('is_group')?.clearValidators();
    // }
    
    // Call markAsTouched or update the form if necessary
    this.customerProfileForm.updateValueAndValidity();
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

    this.userLoginId = localStorage.getItem('EmpMainId');
    this.getAllCountry();
    this.getAllActiveIndustryType();
    this.searchfilter();
    this.getAllCategory();
    this.getAllCustomerType();
    this.getAllPriceType();
    this.activeroute.queryParams.subscribe((params:any) => {
      this.customer_id = params['id'];
      this.action_type = params['action_type'];
      this.new_customer = params?.new_customer;
      this.setValidators(this.new_customer);
      this.statusCustomer=params.status;
      if (this.customer_id) {
        this.getCustomerProfileById(this.customer_id);
      }
    });
    this.getparentCompanyList();
    this.getAllSupplyType();
  }

  newCustomer(){
    
    
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

  setValidators(new_customer: any) {
    this.new_customer = new_customer;
    if (new_customer=='NO' || !new_customer) {
      // Set Validators.required for required fields
      this.customerProfileForm.get('company_name')?.setValidators([Validators.required, noLeadingSpaces()]);
      // this.customerProfileForm.get('identification')?.setValidators([Validators.required]);
      //this.customerProfileForm.get('customer_code')?.setValidators([Validators.required, noLeadingSpaces()]);
      this.customerProfileForm.get('customer_type_id')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('price_type_id')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('customer_sub_category_id')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('customer_industry_type_id')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('gst_in')?.setValidators([Validators.required, noLeadingSpaces()]);
      this.customerProfileForm.get('customer_category_id')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('customer_status')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('customer_micro_category_id')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('gst_category')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('gst_registration_date')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('registration_date_of_party')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('is_group')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('pan_number')?.setValidators([Validators.required]);
      //this.customerProfileForm.get('website')?.setValidators([Validators.required]);
    } else {
      // Remove Validators.required from the fields
      this.customerProfileForm.get('company_name')?.setValidators([noLeadingSpaces()]);
      // this.customerProfileForm.get('identification')?.setValidators([noLeadingSpaces()]);
      //this.customerProfileForm.get('customer_code')?.setValidators([noLeadingSpaces()]);
      this.customerProfileForm.get('customer_type_id')?.clearValidators();
      // this.customerProfileForm.get('price_type_id')?.clearValidators();
      this.customerProfileForm.get('customer_category_id')?.clearValidators();
      // this.customerProfileForm.get('customer_industry_type_id')?.clearValidators();
      // this.customerProfileForm.get('gst_in')?.setValidators([noLeadingSpaces()]);
      // this.customerProfileForm.get('customer_category_id')?.clearValidators();
      // this.customerProfileForm.get('customer_status')?.clearValidators();
      // this.customerProfileForm.get('customer_micro_category_id')?.clearValidators();
      // this.customerProfileForm.get('gst_category')?.clearValidators();
      // this.customerProfileForm.get('gst_registration_date')?.clearValidators();
      // this.customerProfileForm.get('registration_date_of_party')?.clearValidators();
      // this.customerProfileForm.get('is_group')?.clearValidators();
      // this.customerProfileForm.get('pan_number')?.clearValidators();
      //this.customerProfileForm.get('website')?.clearValidators();
    }
    this.customerProfileForm.updateValueAndValidity();
    ;
  }

  getCustomerProfileById(id: any) {
    let data={
status:this.statusCustomer
    }
    this.salesService.getCustomerProfileById(id,data).subscribe((response: any) => {
      let data = response.data;
      this.lead_id=response?.data?.lead_id;
      this.onCustomerCategoryChange(data.customer_category_id);
      this.customerSubCategoryId = data.customer_sub_category_id;
      //
      this.customerMicroCategoryId = data.customer_micro_category_id;
      if ( data.id) {
        this.flag = true;
      }else {
        this.flag = false;
      }
      if (data) {
        this.customer_type = data.customer_type;
        this.setValidators(data.new_customer)
        this.selectGstCat(data.gst_category);
        this.oldGstNo=data.gst_in;
        this.customerProfileForm.patchValue({
          company_name: data.company_name,
          identification: data.identification,
          customer_code: data.customer_code,
          customer_type_id: data.customer_type_id,
          price_type_id: data.price_type_id,
          customer_category_id: data.customer_category_id,
          customer_sub_category_id: data.customer_subtype_id,
          customer_industry_type_id: data.customer_industry_type_id,
          gst_category:data.gst_category,
          gst_in: data.gst_in || null,
          pan_number: data.pan_number,
          // customer_category_id: data.customer_category,
          customer_status: data.customer_status,
          website: data.website,
          registration_date:data.registration_date,
          customer_id : data.id,
          customer_micro_category_id:data.customer_micro_category_id,
          registration_date_of_party:data.registration_date_of_party,
          gst_registration_date:data.gst_registration_date,
          is_group: data.is_group,
          parent_id: data.parent_id,
          supply_type: data.supply_type

        });
        // if (!data.customer_code){
        //   this.customerProfileForm.patchValue({
        //     customer_code: btoa(Math.random().toString())
        //       .slice(0, 10)
        //       .toUpperCase(),
        //   });
        // }
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe((res: any) => {
      this.countryList = res.data;
      this.filteredCountryList = res.data;
    });
  }

  getparentCompanyList() {
    this.salesService.getparentCompanyList(this.entity_id).subscribe((res: any) => {
      this.parentCompanyList = res.data;
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
    this._commonService?.hideLoader()
  },(err:any) => {
    this._commonService?.hideLoader()
  })
  }

  getAllPriceType() {
    this._commonService?.showLoader()
    this._configurationalMasterService.getPriceType('Customer',this.entity_id).subscribe((res: any) => {
      this.priceType = res.data;
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  getAllCategory() {
      this._commonService?.showLoader()
      this._configurationalMasterService.allCustomerCategory().subscribe((res: any) => {
      this.customerCategory = res.data;
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
    if (this.customerProfileForm.invalid) {
      this.toast.error('Required fields should not be empty!', 'Fields error!');
      return;
    }
   
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      company_name: this.customerProfileForm.value.company_name,
      identification: this.customerProfileForm.value.identification,
      customer_code: this.customerProfileForm.value.customer_code,
      customer_type_id: this.customerProfileForm.value.customer_type_id,
      price_type_id: this.customerProfileForm.value.price_type_id,
      customer_sub_category_id: this.customerProfileForm.value.customer_sub_category_id,
      customer_industry_type_id: this.customerProfileForm.value.customer_industry_type_id,
      gst_number: this.customerProfileForm.value.gst_number,
      pan_number: this.customerProfileForm.value.pan_number,
      customer_category_id: this.customerProfileForm.value.customer_category_id,
      customer_status: this.customerProfileForm.value.customer_status,
      website: this.customerProfileForm.value.website,
      gst_category:this.customerProfileForm.value.gst_category,
      registration_date:this.customerProfileForm.value.registration_date,
      gst_registration_date:this.customerProfileForm.value.gst_registration_date,
      customer_micro_category_id:this.customerProfileForm.value.customer_micro_category_id,
      employee_id:this.loginUser?.employee_id,
      gst_in:this.customerProfileForm.value.gst_in || null,
      registration_date_of_party:this.customerProfileForm.value.registration_date_of_party,
      is_group: this.customerProfileForm.value.is_group,
      parent_id: this.customerProfileForm.value.parent_id,
      supply_type: this.customerProfileForm.value.supply_type
      
    };
  
    if ( !this.flag) {
    this.salesService.createCustomerProfile(data).subscribe(
      (res: any) => {
        
        if(res.code == '201'){
         return this.toast.error(res.message);
        }
        this.toast.success(res.message);
        // this.comman_service.sendSelectedId(1);
        ;
        if(this.action_type){
          // this.router.navigate(['/master/sales/customer-details/billing'], { queryParams: { id: res.data.id,action_type: this.action_type ,lead_id:this.lead_id,new_customer:this.new_customer} })
          this.router.navigate(['/master/sales/customer-details/address'], { queryParams: { id: res.data.id,action_type: this.action_type ,lead_id:this.lead_id,new_customer:this.new_customer} })
        }
        // else if(this.statusCustomer === "Exit"){
        //   this.router.navigate(['/master/sales/customer-details/contact'],{ queryParams: { id:res.data.id} });

        // }
        else{
          // this.router.navigate(['/master/sales/customer-details/billing'],{ queryParams: { id:res.data.id, new_customer:this.new_customer} });
          this.router.navigate(['/master/sales/customer-details/address'],{ queryParams: { id:res.data.id, new_customer:this.new_customer} });
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
      this.salesService.updateCustomerProfile(this.customer_id,data).subscribe(
        (res: any) => {
          if(res.code == '201'){
           return this.toast.error(res.message);
          }
          this.toast.success(res.message);
          // this.comman_service.sendSelectedId(1);
          if(this.action_type){
            // this.router.navigate(['/master/sales/customer-details/billing'], { queryParams: { id: this.customer_id,action_type: this.action_type ,lead_id:this.lead_id,new_customer:this.new_customer  }})
            this.router.navigate(['/master/sales/customer-details/address'], { queryParams: { id: this.customer_id,action_type: this.action_type ,lead_id:this.lead_id,new_customer:this.new_customer  }})
          }
          // else if(this.statusCustomer === "Exit"){
          //   this.router.navigate(['/master/sales/customer-details/contact'],{ queryParams: { id:res.data.id} });
  
          // }
          else{
            // this.router.navigate(['/master/sales/customer-details/billing'],{ queryParams: { id:this.customer_id, new_customer:this.new_customer} });
            this.router.navigate(['/master/sales/customer-details/address'],{ queryParams: { id:this.customer_id, new_customer:this.new_customer} });
          }
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went wrong!');
          } else {
            this.toast.error('Error in submission!');
          }
        })
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

  selectGstCat(event:any){
    if(event=='URP'){
      this.isGstType=true;
      this.customerProfileForm.get('gst_in')?.patchValue(null)
    }else{
      this.isGstType=false;
      this.customerProfileForm.get('gst_in')?.patchValue(this.oldGstNo);
    }
  }

  getAllSupplyType() {
    try {
      this.crm.getSupplyType().subscribe(
        (response: any) => {
          if (response) {
            this.supplyTypeList = response.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}
