import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { ConfigurationalmasterService } from "src/app/@shared/services/configurationalmaster.service";
import { EmpRegistrationService } from "src/app/@shared/services/emp-registration.service";
import { ProductionService } from "src/app/@shared/services/production/production.service";
import { ShiftServiceService } from "src/app/@shared/services/service/hrmServices/shift-service.service";
import { environment } from "src/app/environments/environment";

@Component({
  selector: "app-add-new-production",
  templateUrl: "./add-new-production.component.html",
  styleUrls: ["./add-new-production.component.scss"],
})
export class AddNewProductionComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  
  minEndDate: Date;
  setMinEndDate(startDate: Date) { 
   const minEndDate = new Date(startDate);
   minEndDate.setDate(minEndDate.getDate() + 1);
   this.minEndDate = minEndDate;
 }


  addProductionForm: FormGroup;
  imageToUpload: any;
  imagePath: any;
  singleItem: any;
  entity_id: any;
  id: any;
  getAllProductData: any;
  production_id: any;
  selectedPlantList: any[] = [];
  getAllSelectedShifts: any[] = [];
  getAllSelectedWorkStation: any[] = [];
  view: any;
  finalSubmit: boolean = false;
  selectedPlantsFormsArray: FormArray;
  // uploaded_image:any
  constructor(
    private location: Location,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _fb: FormBuilder,
    private _empService: EmpRegistrationService,
    private _productionService: ProductionService,
    private toaster: ToastrService,
    private route: Router,
    private activeRouter: ActivatedRoute,
    private service :ShiftServiceService,
  ) {
    this.addProductionForm = _fb.group({
      product_id: new FormControl("", Validators.required),
      total_qty: new FormControl(""),
      product_code: new FormControl(""),
      image_upload: new FormControl("", Validators.required),
      product_variant: new FormControl("", Validators.required),
      product_description: new FormControl(""),
      country: new FormControl(""),
      state: new FormControl(""), 
      plantID: new FormControl(""),
      plant_name: new FormControl(""),
      production_manager_id: new FormControl("", Validators.required),
      plant_address: new FormControl(""),
      production_qty: new FormControl("",  [Validators.required, Validators.min(0)]),
      start_date: new FormControl("", Validators.required),
      end_date: new FormControl("", Validators.required),
      shiftList: new FormControl([]),
      workstationList: new FormArray([
        new FormGroup({
          workstation_id: new FormControl(null, Validators.required),
          workstation_type: new FormControl(null),
          running_cost: new FormControl(null),
          description: new FormControl(null),
        }),
      ]),
      plantList: new FormControl([],Validators.required),
    });
  }
  loginUser: any;
  plantId: any;
  employee_id: any;
  product_Id: any;
  variant_id: any;
  signUpId:any;
  userRole:any;
  ngOnInit(): void {
    const empId = localStorage.getItem('signInUser');
    if (empId != null) {
      const signupUser = JSON.parse(empId);
      this.signUpId = signupUser.employee_id;
      this.userRole= signupUser.role
      
    }
    this.activeRouter.queryParams.subscribe((res: any) => {
      this.production_id = res.production_id;
      this.view = res.view;
    });
    if (this.production_id) {
      this._productionService
        .getProductionById(this.production_id)
        .subscribe((response: any) => {
          this.getVariantById(response.data.product_id);
          console.warn(this.getVariantList, "this.getVariantList");
          this.addProductionForm.patchValue({
            product_id: response.data.product_id,
            product_code: response.data.product_master.product_code,
            product_description:
              response.data.product_master.product_description,
            product_variant: +response.data.product_variant,
          });
          this.selectedPlantList = response.data.plantList;
          this.getSelectedPlants = this.selectedPlantList;
          this.getAllSelectedWorkStation =
            this.getSelectedPlants[0]?.workstationList;
          const shiftListData = this.getSelectedPlants[0]?.shiftList.map(
            (res: any) => res.id
          );
          this.variant_id = +response.data.product_variant;

          this.addProductionForm.patchValue({
            country:
              this.getSelectedPlants[0]?.plant_master.countryss.countryss_name,
            state: this.getSelectedPlants[0]?.plant_master.state.states_name,
            plant_name: this.getSelectedPlants[0]?.plant_master.plant_name,
            plant_address:
              this.getSelectedPlants[0]?.plant_master.plant_address,
            production_qty: this.getSelectedPlants[0]?.production_qty,
            total_qty: this.getSelectedPlants[0]?.production_qty,
            start_date: this.getSelectedPlants[0]?.start_date,
            end_date: this.getSelectedPlants[0]?.end_date,
            production_manager_id:
              this.getSelectedPlants[0]?.production_manager_id,
            shiftList: shiftListData || [],
          });

          console.warn(this.addProductionForm.value, "value");
          this.imageToUpload = `${environment.serverUrl}/${response.data.image_upload}`;
          this.getAllSelectedWorkStation.forEach((item: any, index: number) => {
            const formGroup = this.WorkStationFormArray.at(index) as FormGroup;
            if (formGroup) {
              setTimeout(() => {
                formGroup.patchValue({
                  workstation_id: item.workstation_id,
                  workstation_type: item.Workstation.type_of_workstation,
                  description: item.Workstation.description,
                  running_cost: item.Workstation.running_cost_per_hour,
                });
              }, 200);
            } else {
              this.WorkStationFormArray.push(
                this._fb.group({
                  workstation_id: item.workstation_id,
                  workstation_type: item.Workstation.type_of_workstation,
                  description: item.Workstation.description,
                  running_cost: item.Workstation.running_cost_per_hour,
                })
              );
            }
          });

          const selectedPlantIds = this.selectedPlantList.map(
            (plant) => plant.plant_id
          );
          console.log(selectedPlantIds, "selectedPlantIds");
          this.addProductionForm.patchValue({
            plantList: selectedPlantIds,
          });
        });
    }
    this.getAllWorkStationMaster();
    this.getEmployeeData();
    this.getAllShiftMaster();
    this.getAllPlantMaster();
    this._configurationalMasterService
      .getProductMasterList()
      .subscribe((res: any) => {
        this.getAllProductData = res.data;
      });
  }
  getVariantList: any[] = [];
  getVariantById(product_id: any) {
    this._productionService.getVariantById(product_id).subscribe((res: any) => {
      this.getVariantList = res.data;
      if (this.production_id)
        this.getVariantList.filter((res: any) => {
          if (res.id === this.variant_id) {
            console.log(res, "resto");
            this.addProductionForm.patchValue({
              product_description: res.product_description,
            });
          }
        });
    });
    console.warn(this.getVariantList, "this.getVariantList");
  }
variant_data:any
  getVariant(data: any) {
    
    this.variant_data=data.id;
    this.addProductionForm.patchValue({
      product_code:data.product_variant_code,
      product_description: data.product_description,
    });
    if(data){
      this.addProductionForm.patchValue({
        product_description: data.product_description,
      });
    }
  }

  get WorkStationFormArray() {
    return this.addProductionForm.get("workstationList") as FormArray;
  }
  addWorkStation() {
    let data = this._fb.group({
      workstation_id: new FormControl(null, Validators.required),
      workstation_type: new FormControl(null),
      running_cost: new FormControl(null),
      description: new FormControl(null),
    });
    this.WorkStationFormArray.push(data);
  }
  removeWorkStation(index: number): void {
    this.WorkStationFormArray.removeAt(index);
  }

  goBack() {
    this.location.back();
  }
  getProductVal(event: any) {
    this.getVariantById(event.value);
    this.addProductionForm.get('product_code')?.reset()
    this.getAllProductData.filter((res: any) => {
      if (res.id == event.value) {
        this.addProductionForm.patchValue({
          // product_code:res.product_code,
          product_variant: res.variant_name,
          product_description: res.product_description,
        });
      }
     
    });
  }
  // getAllShiftData

  shiftData: any[] = [];
  getAllShiftMaster() {
    this.service.getAllShift(this.entity_id).subscribe((res: any) => {
      this.shiftData = res.data;
      this.shiftData.forEach((shift: any) => {
        shift.formattedShiftTime = this.formatShiftTime(
          shift.shift_from_time,
          shift.shift_to_time
        );
      });
    });
  }
  formatShiftTime(fromTime: string, toTime: string): string {
    const formattedFromTime = this.formatTime(fromTime);
    const formattedToTime = this.formatTime(toTime);
    return `${formattedFromTime} to ${formattedToTime}`;
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    const period = parseInt(hours, 10) >= 12 ? "pm" : "am";
    return `${formattedHours}:${minutes} ${period}`;
  }
  // getAllWorkStationMaster
  getAllWorkStation: any;
  getAllWorkStationMaster() {
    this._configurationalMasterService
      .getWorkStationMasterList()
      .subscribe((res: any) => {
        this.getAllWorkStation = res.data;
      });
  }
  getWorkStationValue(data: any, index: any) {
    console.log(data, "data");
    const formGroup = this.WorkStationFormArray.at(index) as FormGroup;
    if (formGroup) {
      setTimeout(() => {
        formGroup.patchValue({
          workstation_type: data.type_of_workstation,
          running_cost: data.running_cost_per_hour,
          description: data.description,
        });
      }, 200);
    } else {    
      this.WorkStationFormArray.push(
        this._fb.group({
          workstation_type: data.type_of_workstation,
          running_cost: data.running_cost_per_hour,
          description: data.description,
        })
      );
    }
  }
  // getAllEmployeeList
  getAllData: any;
  getEmployeeData() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empService.grtEmployeeList(entity_id, this.userRole).subscribe((res: any) => {
      this.getAllData = res.data;
    });
  }
  // getAllPlanList
  getAllPlantsData: any[] = [];
  roleBasedplantData:any[]=[]
  getAllPlantMaster() {
    this._configurationalMasterService
      .getPlantMasterList()
      .subscribe((res: any) => {
        this.roleBasedplantData=res.data;
        if(this.userRole === 'Super Admin'){
          this.getAllPlantsData = res.data;  
        }
        else {
          const assignedPlant = this.getAllData.find((response:any) => response.employee_id === this.signUpId)?.reporting_plant_location;
             
if (assignedPlant) {
    this.roleBasedplantData.filter((res:any)=>{ 
      if(res.plant_name === assignedPlant){
        this.getAllPlantsData.push(res)
      }
    });
      
}
        } 
      });
  }
  getSelectedPlants: any[] = [];
  plantList_id: any;
  plantListArr: any[] = [];
  initialSelectedVal: any;
  data: any = {};
  getAllPlants(event: any, i: any) {
    console.log(event, "event");
    this.data = {
      index: i,
      plantId: event.id,
    };
    this.plantList_id = event;
    const index = this.getSelectedPlants.findIndex((pl) => pl.id === event.id);
    if (index !== -1) {
      this.getSelectedPlants.splice(index, 1);
      this.plantListArr.splice(index, 1);
    } else {
      this.getSelectedPlants.push(event);
      this.plantListArr.push(this.data);
    }
    console.log(this.getSelectedPlants,'this.getSelectedPlants');
    
    if (this.getSelectedPlants.length !== 0) {
      this.initialSelectedVal = this.getSelectedPlants[0].id;
      this.addProductionForm.patchValue({
        country: this.getSelectedPlants[0].countryss_name,
        state: this.getSelectedPlants[0].states_name,
        plant_name: this.getSelectedPlants[0].plant_name,
        plant_address: this.getSelectedPlants[0].plant_address,
      });
    }
  }
  plant_tab_id: any;
  production_QTY: any;
  pushfinalData: any[] = [];
  total_qty: any;

  getTabVal(event: MatTabChangeEvent) {
    this.addProductionForm.get('total_qty')?.reset()
    const selectedPlant = this.getSelectedPlants[event.index];
    console.warn(selectedPlant, "event");
    this.plant_tab_id = selectedPlant.id;
    if (event.index) {
      this.addProductionForm.get("start_date")?.reset();
      this.addProductionForm.get("end_date")?.reset();
      this.addProductionForm.get("workstationList")?.reset();
      this.addProductionForm.get("shiftList")?.reset();
      this.addProductionForm.get("production_manager_id")?.reset();
      this.addProductionForm.get("production_qty")?.reset();
    }
     
    this.addProductionForm.patchValue({
      plantID: selectedPlant.id,
    });
    this.addProductionForm.patchValue({
      country: selectedPlant.countryss_name,
      state: selectedPlant.states_name,
      plant_name: selectedPlant.plant_name,
      plant_address: selectedPlant.plant_address,
    });
    let plantList = {
      plantId: selectedPlant.id,
      production_qty: +this.addProductionForm.value.production_qty,
      start_date: moment(this.addProductionForm.value.start_date).format(
        "DD-MM-YYYY"
      ),
      end_date: moment(this.addProductionForm.value.end_date).format(
        "DD-MM-YYYY"
      ),

      production_manager_id: this.addProductionForm.value.production_manager_id,
    };
    this.pushfinalData.push(plantList);

    this.addProductionForm.patchValue({
      country: selectedPlant.countryss_name,
      state: selectedPlant.states_name,
      plant_name: selectedPlant.plant_name,
      plant_address: selectedPlant.plant_address,
    });
    const lastIndex = this.getSelectedPlants.length - 1;
    if (lastIndex === event.index) {
      this.finalSubmit = true;
    } else {
      this.finalSubmit = false;
    }
    if (this.production_id) {
      const shiftListData = selectedPlant.shiftList.map((res: any) => res.id);
      this.addProductionForm.patchValue({
        country: selectedPlant.plant_master.countryss.countryss_name,
        state: selectedPlant.plant_master.state.states_name,
        plant_name: selectedPlant.plant_master.plant_name,
        plant_address: selectedPlant.plant_master.plant_address,
        production_qty: selectedPlant.production_qty,
        total_qty: selectedPlant.production_qty,
        start_date: selectedPlant.start_date,
        end_date: selectedPlant.end_date,
        production_manager_id: selectedPlant.production_manager_id,
        shiftList: shiftListData || [],
      });
      selectedPlant.workstationList.forEach((item: any, index: number) => {
        const formGroup = this.WorkStationFormArray.at(index) as FormGroup;
        if (formGroup) {
          setTimeout(() => {
            formGroup.patchValue({
              workstation_id: item.workstation_id,
              workstation_type: item.Workstation.type_of_workstation,
              description: item.Workstation.description,
              running_cost: item.Workstation.running_cost_per_hour,
            });
          }, 200);
        } else {
          this.WorkStationFormArray.push(
            this._fb.group({
              workstation_id: item.workstation_id,
              workstation_type: item.Workstation.type_of_workstation,
              description: item.Workstation.description,
              running_cost: item.Workstation.running_cost_per_hour,
            })
          );
        }
      });
    }
  }

  // submitting form here
  total_qty_plant: any;
  onChange(e: any) {
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
    console.log(this.generateImageUrl(e));
  }
  generateImageUrl(uploadDoc: any): string {
    const serverUrl = environment.serverUrl;
    return `${serverUrl}/${uploadDoc}`;
  }
  getFileName(uploadDoc: any): string {
    const pathParts = uploadDoc.split("/");
    return pathParts[pathParts.length - 1];
  }
  getFileExtension(filename: string): string {
    const parts = filename.split(".");
    return parts[parts.length - 1];
  }

  calculateTotalQty() {
    let totalQty = 0;
    totalQty += +this.addProductionForm.get("production_qty")?.value || 0; // Convert to number and add
    // Patch the total quantity to the form
    this.addProductionForm.patchValue({
      total_qty: totalQty,
    });
  }

  displaySingleWorkStation() {
    this.WorkStationFormArray.clear();
    let data = this._fb.group({
      workstation_id: new FormControl(null, Validators.required),
      workstation_type: new FormControl(null),
      running_cost: new FormControl(null),
      description: new FormControl(null),
    });
    this.WorkStationFormArray.push(data);
  }


  production_Id: any;
  production: any;
  savePlantsData(i:any) {     
  // if (this.addProductionForm.invalid) {
  //   this.toaster.error('Please fill in all required fields for Plant ' + (i + 1), 'Error Message');
  //   return;
  // }

    let data = this.addProductionForm.value;
    const formData = new FormData();
    formData.append("product_id", data.product_id);
    formData.append("product_variant", data.product_variant);
    formData.append("employee_id", this.signUpId);
    formData.append("image_upload", this.imageToUpload);
    this._productionService.appProductionData(formData).subscribe(
      (response: any) => {
        if (response) {
          this.production_Id = response.data.id;
          let plantData = {
            production_id: response.data.id,
            plantId:
              data.plantID == "" ? this.getSelectedPlants[0].id : data.plantID,
            production_qty: data.production_qty,
            start_date: moment(data.start_date).format("YYYY-MM-DD"),
            end_date: moment(data.end_date).format("YYYY-MM-DD"),
            production_manager_id: data.production_manager_id,
            shiftList: data.shiftList,
            workstationList: data.workstationList,
          };
          this._productionService
            .createPlant(plantData)
            .subscribe((response: any) => {});
          this.toaster.success(response.message);
          const selectedIndex = this.tabGroup.selectedIndex;
          if (selectedIndex! < this.getSelectedPlants.length - 1) {
            this.tabGroup.selectedIndex = selectedIndex! + 1;
            this.displaySingleWorkStation()
          }
          if (this.finalSubmit) {
            let currentUrl = "/master/production/schedule-production";
            this.route
              .navigateByUrl("/", { skipLocationChange: true })
              .then(() => {
                this.route.navigate([currentUrl]);
              });
          } else if (this.getSelectedPlants.length === 1) {
            let currentUrl = "/master/production/schedule-production";
            this.route
              .navigateByUrl("/", { skipLocationChange: true })
              .then(() => {
                this.route.navigate([currentUrl]);
              });
          }
        }
      },
      (err: any) => {
        this.toaster.error(err.error.message);
      }
    );
  }
}
