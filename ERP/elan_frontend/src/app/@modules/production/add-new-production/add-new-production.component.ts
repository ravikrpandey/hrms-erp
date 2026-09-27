import { Location } from "@angular/common";
import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { ConfigurationalmasterService } from "src/app/@shared/services/configurationalmaster.service";
import { EmpRegistrationService } from "src/app/@shared/services/emp-registration.service";
import { ProductionService } from "src/app/@shared/services/production/production.service";
import { environment } from "src/app/environments/environment";

@Component({
  selector: "app-add-new-production",
  templateUrl: "./add-new-production.component.html",
  styleUrls: ["./add-new-production.component.scss"],
})
export class AddNewProductionComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  minEndDate: Date;
  cetegory: any;
  subCetegory: any;
  productData: any;
  getProductVariant: any = [];
  variant_name: any;
  base64Image: any;
  imageView: File | null;
  image: any;
  id: any;
  setMinEndDate(startDate: Date) {
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);
    this.minEndDate = minEndDate;
  }


  addProductionForm: FormGroup;
  imageToUpload: any;
  imagePath: any;
  singleItem: any;
  getAllProductData: any;
  selectedPlantList: any[] = [];
  getAllSelectedShifts: any[] = [];
  getAllSelectedWorkStation: any[] = [];
  view: any;
  finalSubmit: boolean = false;
  selectedPlantsFormsArray: FormArray;

  entityId:any;
  financial_year_id:any
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
    private ngZone: NgZone,
    private productionService:ProductionService
  ) {
    this.addProductionForm = _fb.group({
      product_id: new FormControl("", Validators.required),
      total_qty: new FormControl(""),
      product_code: new FormControl('',),
      product_variant: new FormControl('',),
      client_name: new FormControl(''),
      product_category_id: new FormControl('', Validators.required),
      upload_file: new FormControl("", Validators.required),
      // product_variant: new FormControl("", Validators.required),
      product_description: new FormControl(""),
      entity_id: new FormControl(null),
      employee_id: new FormControl(null),
      financial_year_id: new FormControl(null),

      plantListDetails: new FormArray([]),

      plantList: new FormControl([], Validators.required),
    });

  }
  loginUser: any;
  plantId: any;
  employee_id: any;
  product_Id: any;
  variant_id: any;
  signUpId: any;
  userRole: any;
  doItem_id: any;
  sales_id: any;
  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.getAllCategory();
    const empId = localStorage.getItem('signInUser');
    if (empId != null) {
      const signupUser = JSON.parse(empId);
      this.signUpId = signupUser.employee_id;
      this.userRole = signupUser.role
    }
    this.activeRouter.queryParams.subscribe((res: any) => {
      if (res.id && res.do_id) {
        this.doItem_id = res.do_id;
        console.log(this.doItem_id);

        this.sales_id = res.id
        this.getProductByName(res.id, res.do_id);
      }
      this.id = res.id;
      this.view = res.view;
    });
    this.addProductionForm.patchValue({
      entity_id:this.entityId,
      financial_year_id:this.financial_year_id,
      employee_id:this.signUpId
    })
    // if (this.id) {
    //   this._productionService
    //     .getProductionById(this.id)
    //     .subscribe((response: any) => {
    //       this.getVariantById(response.data.product_id);
    //       console.warn(this.getVariantList, "this.getVariantList");
    //       this.addProductionForm.patchValue({
    //         product_id: response.data.product_id,
    //         product_code: response.data.product_master?.product_code,
    //         product_description:
    //           response.data.product_master?.product_description,
    //         product_variant: +response.data.product_variant,
    //       });
    //       this.selectedPlantList = response.data.plantList;
    //       this.getSelectedPlants = this.selectedPlantList;
    //       this.getAllSelectedWorkStation =
    //         this.getSelectedPlants[0]?.workstationList;
    //       const shiftListData = this.getSelectedPlants[0]?.shiftList.map(
    //         (res: any) => res.id
    //       );
    //       this.variant_id = +response.data.product_variant;

    //       this.addProductionForm.patchValue({
    //         country:
    //           this.getSelectedPlants[0]?.plant_master.countryss.countryss_name,
    //         state: this.getSelectedPlants[0]?.plant_master.state.states_name,
    //         plant_name: this.getSelectedPlants[0]?.plant_master.plant_name,
    //         plant_address:
    //           this.getSelectedPlants[0]?.plant_master.plant_address,
    //         production_qty: this.getSelectedPlants[0]?.production_qty,
    //         total_qty: this.getSelectedPlants[0]?.production_qty,
    //         start_date: this.getSelectedPlants[0]?.start_date,
    //         end_date: this.getSelectedPlants[0]?.end_date,
    //         production_manager_id:
    //           this.getSelectedPlants[0]?.production_manager_id,
    //         shiftList: shiftListData || [],
    //       });

    //       console.warn(this.addProductionForm.value, "value");
    //       this.imageToUpload = `${environment.servralUrl}/${response.data.upload_file}`;
    //       this.getAllSelectedWorkStation.forEach((item: any, index: number) => {
    //         const formGroup = this.WorkStationFormArray.at(index) as FormGroup;
    //         if (formGroup) {
    //           setTimeout(() => {
    //             formGroup.patchValue({
    //               workstation_id: item.workstation_id,
    //               workstation_type: item.Workstation.type_of_workstation,
    //               description: item.Workstation.description,
    //               running_cost: item.Workstation.running_cost_per_hour,
    //             });
    //           }, 200);
    //         } else {
    //           this.WorkStationFormArray.push(
    //             this._fb.group({
    //               workstation_id: item.workstation_id,
    //               workstation_type: item.Workstation.type_of_workstation,
    //               description: item.Workstation.description,
    //               running_cost: item.Workstation.running_cost_per_hour,
    //             })
    //           );
    //         }
    //       });

    //       const selectedPlantIds = this.selectedPlantList.map(
    //         (plant) => plant.plant_id
    //       );
    //       console.log(selectedPlantIds, "selectedPlantIds");
    //       this.addProductionForm.patchValue({
    //         plantList: selectedPlantIds,
    //       });
    //     });
    // }
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
  getProductQty: any;
  product_category_id: any
  product_category_sub_id: any
  getProductByName(id: any, doItem_id: any) {
    this._productionService.getforScheduleProduction(id, doItem_id).subscribe((res: any) => {
      
      console.log(res, 'res1');
      this.getProductQty = res.data.qty;
      this.product_category_id = res.data?.product_category_id;
      // this.product_category_sub_id = res.data.product_subcategory_id;
      this.productionService.getAllActiveProduct(this.product_category_id,this.entityId).subscribe((res: any) => {
        this.productData = res.data
        this.getProductItem(res.data.product_id);
      })

      this._configurationalMasterService.getProductVariantByproduct_id(res.data.product_id).subscribe((res:any)=>{
        if(res){
          this.getAllVariantData=res.data;
        }
      },(err:any)=>{

      })
      console.warn(this.product_category_id, ' this.product_category_id');

      if (res) {

            this.ngZone.run(() => {
              this.addProductionForm.patchValue({
                product_category_id: this.product_category_id,
                // product_subcategory_id: this.product_category_sub_id,
                client_name: res.data?.company_name,
                product_id: res.data?.product_id,
                 product_variant: res.data.product_varient_id,
                product_code: res.data?.product_code,
                product_description: res.data?.product_description,
                total_qty: res.data?.qty,
              });

              // if (this.productData.length > 0) {
              //   this.addProductionForm.patchValue({
              //     product_code: this.productData[0].product_code,
              //     product_description: this.productData[0].product_description,
              //   });
              // }
            });


      }
    });
  }
  getVariantList: any[] = [];
  getVariantById(product_id: any) {
    this._productionService.getVariantById(product_id).subscribe((res: any) => {
      this.getVariantList = res.data;
      if (this.id)
        this.getVariantList?.filter((res: any) => {
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
  variant_data: any
  getVariant(data: any) {

    this.variant_data = data.id;
    this.addProductionForm.patchValue({
      product_code: data.product_variant_code,
      product_description: data.product_description,
    });
    if (data) {
      this.addProductionForm.patchValue({
        product_description: data.product_description,
      });
    }
  }

  get WorkStationFormArray() {
    return this.addProductionForm.get("workstationList") as FormArray;
  }
  // addWorkStation() {
  //   let data = this._fb.group({
  //     workstation_id: new FormControl(null, Validators.required),
  //     workstation_type: new FormControl(null),
  //     running_cost: new FormControl(null),
  //     description: new FormControl(null),
  //   });
  //   this.WorkStationFormArray.push(data);
  // }
  // removeWorkStation(index: number): void {
  //   this.WorkStationFormArray.removeAt(index);
  // }

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
    this._configurationalMasterService.getShiftList().subscribe((res: any) => {
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
      .getWorkStationMasterList(this.entityId,this.financial_year_id)
      .subscribe((res: any) => {
        this.getAllWorkStation = res.data;
      });
  }
  // getWorkStationValue(data: any, index: any) {
  //   console.log(data, "data");
  //   const formGroup = this.WorkStationFormArray.at(index) as FormGroup;
  //   if (formGroup) {
  //     setTimeout(() => {
  //       formGroup.patchValue({
  //         workstation_type: data.type_of_workstation,
  //         running_cost: data.running_cost_per_hour,
  //         description: data.description,
  //       });
  //     }, 200);
  //   } else {
  //     this.WorkStationFormArray.push(
  //       this._fb.group({
  //         workstation_type: data.type_of_workstation,
  //         running_cost: data.running_cost_per_hour,
  //         description: data.description,
  //       })
  //     );
  //   }
  // }
  // getAllEmployeeList
  getAllData: any;
  getEmployeeData() {
    this._empService.grtEmployeeList(this.entityId,this. financial_year_id).subscribe((res: any) => {
      this.getAllData = res.data;
    });
  }
  // getAllPlanList
  getAllPlantsData: any[] = [];
  roleBasedplantData: any[] = []
  getAllPlantMaster() {
    this._configurationalMasterService
      .getPlantMasterList(this.entityId)
      .subscribe((res: any) => {
        this.roleBasedplantData = res.data;
        if (this.userRole === 'Super Admin') {
          this.getAllPlantsData = res.data;
        }
        else {
          const assignedPlant = this.getAllData.find((response: any) => response.employee_id === this.signUpId)?.reporting_plant_location;

          if (assignedPlant) {
            this.roleBasedplantData.filter((res: any) => {
              if (res.plant_name === assignedPlant) {
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
  get plantListDetails(): FormArray {
    return this.addProductionForm.get('plantListDetails') as FormArray;
  }

  // getWorkStationFormArray(plant: AbstractControl): FormArray<FormGroup> {
  //   return plant.get('workstationList') as FormArray<FormGroup>;
  // }
  // onSelectionChange(event: any): void {
  //   const selectedIds = event.value; // This gives you an array of selected IDs
  //   console.log(selectedIds); // For ing, you can see what values are selected
  //   // Call your method to process the selected plants
  //   this.getAllPlants(selectedIds);
  // }
  getAllPlants(event: any) {
    console.log(event, "event");
    // console.log(data, "data");
    // console.log(i,"index");
    if (event) {
      this.plantListDetails.push(this.createPlant(event))
    }
    console.log(this.plantListDetails, ' this.plantListDetails');

    // this.data = {
    //   index: i,
    //   plantId: event.id,
    // };
    // this.plantList_id = event;
    // const index = this.getSelectedPlants.findIndex((pl) => pl.id === event.id);
    // if (index !== -1) {
    //   this.getSelectedPlants.splice(index, 1);
    //   this.plantListArr.splice(index, 1);
    // } else {
    //   this.getSelectedPlants.push(event);
    //   this.plantListArr.push(this.data);
    // }
    // console.log(this.getSelectedPlants,'this.getSelectedPlants');

    // if (this.getSelectedPlants.length !== 0) {
    //   this.initialSelectedVal = this.getSelectedPlants[0].id;
    //   this.addProductionForm.patchValue({
    //     country: this.getSelectedPlants[0].countryss_name,
    //     state: this.getSelectedPlants[0].states_name,
    //     plant_name: this.getSelectedPlants[0].plant_name,
    //     plant_address: this.getSelectedPlants[0].plant_address,
    //   });
    // }
  }
  plant_tab_id: any;
  production_QTY: any;
  pushfinalData: any[] = [];
  total_qty: any;

  getTabVal(event: MatTabChangeEvent) {

  }

  // submitting form here
  total_qty_plant: any;
  onChange(e: any) {
    const formData = new FormData();
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageView = e.target.files[0]
      formData.append('file', e.target.files[0]);
      console.log(this.imageView);

      this.imageToUpload = data.item(0) || null;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
        // this.base64Image = e.target.result as String

      };
      reader.readAsDataURL(this.imageToUpload);
    }
    this._configurationalMasterService.uploadDocuments(formData).subscribe((response: any) => {
      if (response) {
        this.image = response?.url;
        this.addProductionForm.patchValue({
          upload_file: this.image
        })
      }
    }, err => {
      console.log(err);
    })
    console.log(this.generateImageUrl(e));
  }
  viewImage() {
    if (this.imageView) {
      const fileURL = URL.createObjectURL(this.imageView);
      window.open(fileURL, '_blank');
    }
  }
  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }
  getFileName(uploadDoc: any): string {
    const pathParts = uploadDoc.split("/");
    return pathParts[pathParts.length - 1];
  }
  getFileExtension(filename: string): string {
    const parts = filename.split(".");
    return parts[parts.length - 1];
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
  production: any;



  getAllCategory() {
    this._productionService.getAllCetegory(this.entityId).subscribe((res: any) => {
      this.cetegory = res.data;

    })
  }
  // getCetegoryDetail(event: any) {
  //   this._productionService.getAllSubCetegory(event.value).subscribe((res: any) => {
  //     this.subCetegory = res.data
  //   })
  // }
  getSubCetegoryDetail(event: any) {
    if (!event?.value) return; // <--- Add this check

    let cetegory = this.addProductionForm.controls['product_category_id']?.value
    this._productionService.getAllProductOncetegory(cetegory, event?.value).subscribe((res: any) => {
      this.productData = res.data;
      console.log(this.productData, 'four Idiot')
    })
  }

  getAllVariant: any[] = []
  getVariantByProduct(id: any) {
    this._productionService.getVariantById(id).subscribe((res: any) => {
      this.getAllVariant = res.data;
      this.addProductionForm.patchValue({
        product_code: res?.product_code,
        product_description: res?.data?.product_description
      })
      this.getAllVariant?.filter((res: any) => {
        if (res.variant_name === this.variant_name) {
          this.addProductionForm.patchValue({
            product_code: res.product_code,
            product_description: res?.data?.product_description
          })
        }
      })
    })
  }
  getAllVariantData:any=[];
  getProductItem(data: any) {
    
    // this.getVariantByProduct(data.value)
    // this.getProductVariant = []
    this.productData.filter((res: any) => {
      if (res.id == data.value) {
        this.addProductionForm.patchValue({
          product_code: res.product_code,
          product_description: res.product_description,

        })
        this.getProductVariant.push(res)
      }
    })
    this._configurationalMasterService.getProductVariantByproduct_id(data.value??data).subscribe((res:any)=>{
      if(res){
        this.getAllVariantData=res.data;
      }
    },(err:any)=>{

    })
    // this.addProductionForm.get('product_code')?.reset()
    // this.addProductionForm.get('product_description')?.reset()
  }

  createPlant(data: any): FormGroup {
    return this._fb.group({
      country: new FormControl(data.countryss_name),
      state: new FormControl(data.states_name),
      plantID: new FormControl(data.id),
      plant_name: new FormControl(data.plant_name),
      production_manager_id: new FormControl("", Validators.required),
      plant_address: new FormControl(data.plant_address),
      production_qty: new FormControl("", [Validators.required, Validators.min(0)]),
      start_date: new FormControl("", Validators.required),
      end_date: new FormControl("", Validators.required),
      shiftList: new FormControl([]),
      workstationList: new FormArray([
        new FormGroup({
          workstation_id: new FormControl(null, Validators.required),
          workstation_type: new FormControl({ value: null, disabled: true }),
          running_cost: new FormControl({ value: null, disabled: true }),
          description: new FormControl({ value: null, disabled: true }),
        }),
      ]),
    })
  }

  onSelectionChange(event: any) {
    const plantListDetails = this.addProductionForm.get('plantListDetails') as FormArray;
    const selectedPlantIds = event.value as number[];
    for (let i = plantListDetails.length - 1; i >= 0; i--) {
      const plantListGroup = plantListDetails.at(i) as FormGroup;
      const plantId = plantListGroup.get('plantID')?.value;

      if (!selectedPlantIds.includes(plantId)) {
        plantListDetails.removeAt(i);
      }
    }
    selectedPlantIds.forEach(id => {
      const exists = plantListDetails.controls.some(group => (group as FormGroup).get('plantID')?.value === id);
      if (!exists) {
        let selectedPlant = this.getAllPlantsData.find(res => res.id == id);
        console.log(selectedPlant, 'selectedPlant')
        plantListDetails.push(this.createPlant(selectedPlant));
      }
    });
    this.calculateTotalQty()
  }
  getWorkStationFormArray(plant: AbstractControl): FormArray {
    return plant.get('workstationList') as FormArray;
  }

  addWorkStation(plantIndex: number) {
    const workstationFormArray = this.getWorkStationFormArray(this.plantListDetails.controls[plantIndex]);
    let data = this._fb.group({
      workstation_id: new FormControl(null, Validators.required),
      workstation_type: new FormControl({ value: null, disabled: true }), // Disable if required
      running_cost: new FormControl({ value: null, disabled: true }), // Disable if required
      description: new FormControl({ value: null, disabled: true }), // Disable if required
    });
    workstationFormArray.push(data);
  }

  removeWorkStation(plantIndex: number, workstationIndex: number): void {
    const workstationFormArray = this.getWorkStationFormArray(this.plantListDetails.controls[plantIndex]);
    if (workstationFormArray.length > 1) { // Prevent removal if only one workstation remains
      workstationFormArray.removeAt(workstationIndex);
    }
  }

  getWorkStationValue(data: any, plantIndex: number, workstationIndex: number) {
    console.log(data, "data");

    // Get the correct FormGroup from the FormArray
    const workstationFormArray = this.getWorkStationFormArray(this.plantListDetails.controls[plantIndex]);
    const formGroup = workstationFormArray.at(workstationIndex) as FormGroup;

    if (formGroup) {
      formGroup.patchValue({
        workstation_type: data.type_of_workstation,
        running_cost: data.running_cost_per_hour,
        description: data.description,
      });
    } else {
      console.warn('Form group not found for the specified index');
    }
  }

  calculateTotalQty() {
    let totalQty = 0;

    this.plantListDetails.controls.forEach((plantGroup: any) => {
      const productionQty = +plantGroup.get("production_qty")?.value || 0; // Convert to number and add
      totalQty += productionQty;
    });

    this.addProductionForm.patchValue({
      total_qty: totalQty,
    });
  }


  savePlantsData() {
    if (this.addProductionForm.invalid) {
      this.toaster.error('Fill all the required field')
      return
    }
    let data = this.addProductionForm.getRawValue();
    console.log(data, "klklklklkl")
    this._configurationalMasterService.createProductSchedule(data).subscribe((res:any) => {
      if (res) {
        this.toaster.success('Saved Successfully')
        this.route.navigate(['master/production/schedule-production'])
      }
    }, (err:any) => {
      console.log(err);
      this.toaster.error(err.error.message)
    })

  }
  getAllActiveProduct(event: any) {
    this.getAllVariantData=[];
    this.productionService.getAllActiveProduct(event.value??event,this.entityId).subscribe((res: any) => {
      this.productData = res.data
    })
  }
}
