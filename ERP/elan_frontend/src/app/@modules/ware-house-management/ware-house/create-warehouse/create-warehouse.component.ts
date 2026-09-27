import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { debounceTime } from 'rxjs';
import { InventoryManagementService } from '../../inventory-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-create-warehouse',
  templateUrl: './create-warehouse.component.html',
  styleUrls: ['./create-warehouse.component.scss']
})

export class CreateWarehouseComponent {
  createWarehouseForm: FormGroup;
  filterCountryControl = new FormControl();
  filterStateControl = new FormControl();
  filterCityControl = new FormControl();
  isChecked: any;
  entity_id: any;
  countryList: any;
  AllStateList: any;
  allCityList: any;
  filteredCountryList: any;
  filteredStateList: any;
  filteredCityList: any;
  wareHouseCode: any;
  financial_year_id: string | null;
  branches: any;
  branchList2: any;
  entityList: any;
  branchList: any = [];
  plant: any = [];
  plantList1: any = [];
  employeeList: any = [];
  entities: any;
  getAllWareHouseType: any;

  constructor(
    private inventoryService: InventoryManagementService,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private route: Router,
    private activeroute: ActivatedRoute,
    private location: Location,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.createWarehouseForm = this.fb.group({
      warehouse_name: new FormControl(null, Validators.required),
      warehouse_type: new FormControl(null, Validators.required),
      warehouse_code: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      country_id: new FormControl(null, Validators.required),
      State_id: new FormControl(null, Validators.required),
      city_id: new FormControl(null, Validators.required),
      branch_id: new FormControl(null, Validators.required),
      plant_id: new FormControl(null, Validators.required),
      pin: new FormControl(null, Validators.required),
      mark_as_default: new FormControl(null),
      manager_name: new FormControl(null, Validators.required),
      contact_info: new FormControl(null, Validators.required),
      capacity: new FormControl(null, Validators.required),
    });
  }
  warehouse_id: any
  viewData: any;

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');

    this.activeroute.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.viewData = res.view
        this.warehouse_id = res.id
        this.getwarehouseById(res.id)
      } else if (res.view == 'view') {
        this.viewData = res.view
        this.getwarehouseById(res.id)
      }
    })
    this.getBranchList();
    this.getAllActivePlant();
    this.getAllCountry();
    this.generateWareHouseCode();
    this.filterCountryControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.countryList = this.filteredCountryList.filter((country: any) =>
        country.countryss_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterStateControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.AllStateList = this.filteredStateList.filter((state: any) =>
        state.states_name.toLowerCase().includes(value.toLowerCase())
      );
    });

    this.filterCityControl.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.allCityList = this.filteredCityList.filter((city: any) =>
        city.city_name.toLowerCase().includes(value.toLowerCase())
      );
    });
    this.getWareHouseType()
  }

  getWareHouseType() {
    this.inventoryService.getWarehouse_type().subscribe((res: any) => {
      this.getAllWareHouseType = res.data;
    })
  }

  getwarehouseById(id: any) {
    this.inventoryService.getWarehouseByid(id).subscribe((res: any) => {
      if (res) {
        this.getAllState(res.data?.country_id)
        this.getAllCity(res.data?.state_id)
        this.getEmployeeList({ value: res.data?.branch_id })

        this.createWarehouseForm.patchValue({
          warehouse_name: res.data.name,
          warehouse_type: res.data.type,
          warehouse_code: res.data.code,
          address: res.data.address,
          country_id: res.data.country_id,
          State_id: res.data.state_id,
          city_id: res.data.city_id,
          pin: res.data.pin,
          mark_as_default: res.data.mark_as_default,
          manager_name: res.data.HRMS_REGISTERED_USER.employee_id,
          contact_info: res.data.contact_info,
          capacity: res.data.capacity,
          branch_id: res.data?.branch_id,
          plant_id: res.data?.plant_id,
        })

      }
    })
  }



  generateWareHouseCode() {
    this.inventoryService.generateWareHouseCode().subscribe((response: any) => {
      this.wareHouseCode = response.data;
      this.createWarehouseForm.get('warehouse_code')?.setValue(this.wareHouseCode);
    })
  }
  goBack() {
    this.location.back();
  }

  toggle(event: any, checked: any) {
    if (event.checked) {
      this.createWarehouseForm.get('mark_as_default')?.setValue('ACTIVE');
    }
    else {
      this.createWarehouseForm.get('mark_as_default')?.setValue('INACTIVE');
    }
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.filteredCountryList = res.data;
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
  onChangeCity(e: any) {
    this.filterCountryControl;
    this.getAllUserByCountryStateCity(e?.value);
  }
  getAllUserByCountryStateCity(city_id: any) {
    let countryId = this.createWarehouseForm.get('country_id')?.value;
    let stateId = this.createWarehouseForm.get('State_id')?.value;
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      country_id: countryId,
      state_id: stateId,
      city_id: city_id
    }
    if (data) {
      this._empRegistration.getAllUserByCountryStateCity(data).subscribe((res: any) => {
        if (res) {
          console.log(res.data)
        }
      }, (err: any) => {

      })
    }
  }
  getAllState(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        if (res && res?.data.length > 0) {
          this.AllStateList = res?.data;
          this.filteredStateList = res?.data;
        }
        else {
          this.toast.warning('states are not exist in this country !');
        }
      }, (err: any) => {
        this.toast.warning('states are not exist in this country !');
      })
  }

  getAllCity(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        if (res && res?.data.length > 0) {
          this.allCityList = res?.data;
          this.filteredCityList = this.allCityList;
        }
        else {
          this.toast.warning('city not found !');
        }
      }, (err: any) => {
        this.toast.warning('city not found !');
      })
  }

  onSubmitForm() {

    if (this.createWarehouseForm.invalid) {
      return
    }

    if (this.warehouse_id) {
      this.createWarehouseForm.value.entity_id = this.entity_id
      this.inventoryService.updateWarehouseByid(this.warehouse_id, this.createWarehouseForm.value).subscribe((res: any) => {
        if (res) {
          this.toast.success(res.message)

          this.router.navigate(['master/warehouse-management/warehouse']);

        }
      }, (err: any) => {
        this.toast.error(err.error.message)
      })
    } else {
      this.inventoryService.createWarehouse(this.createWarehouseForm.value).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.router.navigate(['master/warehouse-management/warehouse']);
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

  }

  getBranchList() {
    this._configurationalMasterService.getListActiveBranchSetup().subscribe((res: any) => {
      this.branches = res.data.map((res: any) => res.branch_name);
      this.branchList = res.data
      this.branchList2 = res.data
    })
  }
  locationSearch(e: any) {
    const aa = e
    let filteredVariable = this.branchList2.filter((item: any) => aa.includes(item.branch_name));
    this.branchList = filteredVariable
  }

  getAllActivePlant() {
    this._configurationalMasterService.getAllActivePlant(this.entity_id).subscribe((res: any) => {
      if (res) {
        this.plant = res.data;
        this.plantList1 = res.data;
      }
    }, (err: any) => {

    })
  }
  plantSearch(e: any) {
    const aa = e
    let filteredVariable = this.plantList1.filter((item: any) => aa.includes(item.plant_name));
    this.entityList = filteredVariable
  }

  getEmployeeList(e: any) {
    this.createWarehouseForm.patchValue({
      contact_info: null
    })
    this._configurationalMasterService.getEmployeeByLocationId(this.entity_id, e.value).subscribe((res: any) => {
      if (res) {
        this.employeeList = res.data;
        if (!this.employeeList.length) {

          this.toast.warning('Manager not found on this branch!');
        }
      }
    }, (err: any) => {
      this.toast.error('Something went Wrong!');
    })
  }

  getEmployeeDetails(e: any) {
    const selectedEmployee = this.employeeList.find((a: { employee_id: any }) => a.employee_id === e.value);
    this.createWarehouseForm.patchValue({
      contact_info: selectedEmployee.contact_number
    });
  }
}
