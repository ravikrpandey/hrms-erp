      import { Component } from '@angular/core';
import {FormBuilder, FormControl,FormGroup,Validators} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { debounceTime } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { StoreManagementService } from 'src/app/@modules/store-management/store-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss']
})

export class BusinessDetailsComponent {
  customerProfileForm: FormGroup; 
  filterCountryControl = new FormControl();
  filterStateControl = new FormControl();
  filterCityControl = new FormControl();
  filterPlantControl = new FormControl();
  filterEmpControl = new FormControl();
  action_type:any;
  entity_id: any;
  countryList: any;
  AllStateList: any;
  allCityList: any;
  filteredCountryList: any;
  filteredStateList: any;
  filteredCityList: any;
  wareHouseCode: any;
  warehouseId:any;
  entityList: any;
  plant:any=[];
  plantList:any=[];
  financial_year_id: any;
  loginUser: any;
  userLoginId: any;
  filemployeeList: any;
  new_customer:any
  constructor(
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private toaster: ToastrService,

    private $crm: CrmService,
    private salesService: SalesService,
    private activeroute: ActivatedRoute,
    private location: Location,
    private comman_service:CommonService
  ) {
    this.customerProfileForm = this.fb.group({
      preffered_payment_terms: new FormControl(null, Validators.required),
      existing_vendor_code: new FormControl(null),
      bank_name: new FormControl(null),
      bank_account_number: new FormControl(null),
      total_purchase_value: new FormControl(0),
      amc_status: new FormControl(null),
      amc_expiry_date: new FormControl(null),
      beneficiary_name: new FormControl(null,Validators.required),
      account_type: new FormControl(null,Validators.required),
      ifsc_code: new FormControl(null,Validators.required),
    });

  
  }

 
  customer_id:any;
  ngOnInit() {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_year_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    console.log("loginUserloginUserloginUser",this.loginUser);
    
    this.userLoginId = localStorage.getItem('EmpMainId')
    this.getAllCountry();
    this.filterCountryControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.countryList = this.filteredCountryList.filter((country:any) =>
        country.countryss_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterStateControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.AllStateList = this.filteredStateList.filter((state:any) =>
        state.states_name.toLowerCase().includes(value.toLowerCase())
      );
    });
    
    this.filterCityControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.allCityList = this.filteredCityList.filter((city:any) =>
        city.city_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterPlantControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.plant = this.plantList.filter((plant:any) =>
        plant.plant_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.activeroute.queryParams.subscribe((params) => {
      this.customer_id = params['id'];
      this.action_type = params['action_type'];
      this.new_customer = params['new_customer'];
      this.setValidators();
      if (this.customer_id) {
        this.getCustomerBusinessById(this.customer_id);
      }
    });
  }

  setValidators() {
    if ( this.new_customer == 'NO'  || !this.new_customer) {
      // Set Validators.required for required fields
      this.customerProfileForm.get('preffered_payment_terms')?.setValidators([Validators.required]);
      //this.customerProfileForm.get('existing_vendor_code')?.setValidators([Validators.required]);
      this.customerProfileForm.get('bank_name')?.setValidators([Validators.required]);
      this.customerProfileForm.get('bank_account_number')?.setValidators([Validators.required]);
      //this.customerProfileForm.get('total_purchase_value')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('amc_status')?.setValidators([Validators.required]);
      // this.customerProfileForm.get('amc_expiry_date')?.setValidators([Validators.required]);
    } else {
      // Remove Validators.required from the fields
      this.customerProfileForm.get('preffered_payment_terms')?.clearValidators();
      //this.customerProfileForm.get('existing_vendor_code')?.clearValidators();
      this.customerProfileForm.get('bank_name')?.clearValidators();
      this.customerProfileForm.get('bank_account_number')?.clearValidators();
      //this.customerProfileForm.get('total_purchase_value')?.clearValidators();
      // this.customerProfileForm.get('amc_status')?.clearValidators();
      // this.customerProfileForm.get('amc_expiry_date')?.clearValidators();
    }
  }

  getCustomerBusinessById(id:any){
    this.salesService.getCustomerBusinessById(id).subscribe((response: any) => {
      let data = response.data;
      if(data){
        this.customerProfileForm.patchValue({
          preffered_payment_terms: data.preffered_payment_terms,
          existing_vendor_code:data.existing_vendor_code,
          bank_name: data.bank_name,
          bank_account_number: data.bank_account_number,
          total_purchase_value: data.total_purchase_value,
          amc_status: data.amc_status,
          beneficiary_name:data?.beneficiary_name,
account_type:data?.account_type,
ifsc_code:data?.ifsc_code,
          amc_expiry_date: data.amc_expiry_date
        })
      }
    })
  }

  goBack() {
    this.location.back();
  }
  
  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.filteredCountryList =  res.data;
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

  getAllState(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        if (res && res?.data.length >0) {
          this.AllStateList = res?.data;
          this.filteredStateList = res?.data;
        }
        else{
          this.toast.warning('states are not exist in this country !');
        }
      },(err: any) => {
        this.toast.warning('states are not exist in this country !');
      })
  }

  getAllCity(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        if (res && res?.data.length >0) {
          this.allCityList = res?.data;
          this.filteredCityList = this.allCityList;
        }
        else{
          this.toast.warning('city not found !');
        } 
      },(err: any) => {
        this.toast.warning('city not found !');
      })
  }

  onSubmitForm() {
    if(this.customerProfileForm.invalid){
      return
    }
    let formData = this.customerProfileForm.value;
    formData.customer_id=this.customer_id;
    this.salesService.createCustomerBusinessDetails(formData).subscribe((res: any) => {
      if (res) {
        this.toaster.success(res.message);
        if(this.action_type){
          this.router.navigate(['/master/sales/customer-details/documents'], { queryParams: { id: this.customer_id,action_type: this.action_type,new_customer:this.new_customer  }})
        }else{
          this.router.navigate(['/master/sales/customer-details/documents'], { queryParams: { id: this.customer_id, new_customer:this.new_customer } });
        }
      }
    }, (err: any) => {
      this.toaster.error(err.error.message);
    });
  }

}


