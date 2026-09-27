import { Component } from '@angular/core';
import {FormBuilder, FormControl,FormGroup,Validators} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { debounceTime } from 'rxjs';
import { StoreManagementService } from '../../store-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.scss']
})

export class CreateStoreComponent {
  createStoreForm: FormGroup; 
  filterCountryControl = new FormControl();
  filterStateControl = new FormControl();
  filterCityControl = new FormControl();
  filterPlantControl = new FormControl();
  filterEmpControl = new FormControl();
  isChecked:boolean = false;
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
  constructor(
    private storeService: StoreManagementService,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private $crm: CrmService,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private location: Location
  ) {
    this.createStoreForm = this.fb.group({
      store_name: new FormControl(null, Validators.required),
      plant_id: new FormControl(null,[Validators.required]),
      store_code: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      country_id: new FormControl(null, Validators.required),
      State_id: new FormControl(null, Validators.required),
      city_id: new FormControl(null, Validators.required),
      pin: new FormControl(null, Validators.required),
      mark_as_default: new FormControl(null),
      employee_id: new FormControl(null, Validators.required),
      contact_info: new FormControl(null),
    });
  }
  ngOnInit() {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_year_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    console.log("loginUserloginUserloginUser",this.loginUser);
    
    this.userLoginId = localStorage.getItem('EmpMainId')
    this.getAllCountry();
    this.generateWareHouseCode();
    this.getAllActivePlant();
    this.getEmployee();
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

    this.filterEmpControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.employeeList = this.filemployeeList.filter((employee:any) =>
        employee.first_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.activeroute.queryParams.subscribe(params => {
      this.warehouseId = params['id'];
      this.action_type = params['action_type'];
    if(params['id']){
      this.getWarehouseById(params['id'])
    }
    })
  }
  getWarehouseById(id:any){
    this.storeService.getWarehouseById(id).subscribe((response: any) => {
      let data = response.data;
      this.getAllState(data?.country_id);
      this.getAllCity(data?.state_id);
      if(data.mark_as_default ==="ACTIVE") this.isChecked = true
      if(data){
        this.createStoreForm.patchValue({
          store_name: data.name,
          plant_id: data.plant_id,
          store_code: data.code,
          address: data.address,
          country_id: data.country_id,
          State_id: data.state_id,
          city_id: data.city_id,
          pin: data.pin,
          employee_id: data.employee_id,
          contact_info: data.contact_info,
        })
      }
    })
  }
  generateWareHouseCode(){
    this.storeService.generateWareHouseCode().subscribe((response: any) => {
      this.wareHouseCode = response.data;
      this.createStoreForm.get('store_code')?.setValue(this.wareHouseCode);
    })
  }
  goBack() {
    this.location.back();
  }

  toggle(event:any,checked:any){
    if(event.checked){
      this.createStoreForm.get('mark_as_default')?.setValue('ACTIVE');
    }
    else{
      this.createStoreForm.get('mark_as_default')?.setValue('INACTIVE');
    }
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
    if(this.createStoreForm.invalid){
      return
    }
    this.storeService.createStock(this.createStoreForm.value,this.entity_id).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.router.navigate(['/master/store-management/store']);
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  editWarehouse(){
    if(this.createStoreForm.invalid){
      return
    }
    this.storeService.editWarehouse(this.createStoreForm.value,this.entity_id,this.warehouseId).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.router.navigate(['/master/store-management/store']);
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  getAllActivePlant(){
    this._configurationalMasterService.getAllActivePlant(this.entity_id).subscribe((res:any)=>{
      if(res){
          this.plant=res.data;
          this.plantList=res.data;
      }
    },(err:any)=>{

    })
  }

  employeeList: any = [];
  getEmployee() {
    try {
      this.$crm.registrationall(this.entity_id,this.loginUser?.role).subscribe((response: any) => {
        if (response) {
          this.employeeList = response.data;
          this.filemployeeList = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  getEmployeeContact(event:any){
    let emp = this.employeeList.filter((employee: any) => {
      return employee.employee_id == event.value;
    }).map((employee: any) => employee.contact_number);
    
    this.createStoreForm.get('contact_info')?.setValue(emp[0])
  }
}

