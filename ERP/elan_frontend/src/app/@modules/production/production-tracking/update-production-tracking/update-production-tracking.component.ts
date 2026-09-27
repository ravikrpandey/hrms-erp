import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-update-production-tracking',
  templateUrl: './update-production-tracking.component.html',
  styleUrls: ['./update-production-tracking.component.scss'],
})
export class UpdateProductionTrackingComponent {
  updateTracking: FormGroup;
  entityId:any;
  financial_year_id:any

  constructor(
    private router: Router,
    private _productService: ProductionService,
    private _active: ActivatedRoute,
    private _fb:FormBuilder,private toaster:ToastrService,
    private location:Location,
    private productionService:ProductionService
  ) {

this.updateTracking=_fb.group({
  start_date:new FormControl(),
  end_date:new FormControl(),
  shiftList:new FormControl(),
  date:new FormControl('',Validators.required),
   shift_id:new FormControl('',[Validators.required]),
   product_category_id:new FormControl('',[Validators.required]),
   product_id:new FormControl('',[Validators.required]),
   product_variant:new FormControl('',[Validators.required]),

  workstationList: new FormArray([
    new FormGroup({ 
      qualityParameter: new FormControl(null),
      net_production: new FormControl(null, [Validators.required]),
      rework: new FormControl(null, [Validators.required]),
      new_id:new FormControl(null),
    }),
  ]),
  
})
  }

  get itemsFormArray():any {
    return this.updateTracking.get('workstationList') as FormArray;
  }

  addItem() {
    let data= this._fb.group({
      qualityParameter: new FormControl(null, ),
      net_production: new FormControl(null,  [Validators.required] ),
     rework: new FormControl(null, [Validators.required]),
     new_id:[]
    
});
this.itemsFormArray.push(data); 
}
shift_id:any
getShiftVal(event:any){
   this.shift_id=event.value
}

shiftList:any;
workStationList:any;
tracking_id:any;
new_key:any;
  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.getAllCategory();
    this._active.queryParams.subscribe((res: any) => {
      this.tracking_id=res.id;
      this._productService.getTrackingById(res.id).subscribe((res: any) => {
        
        this.shiftList=res?.data?.shiftList
        this.workStationList=res?.data?.workstationList;
        console.log(this.workStationList,'this.workStationList');
         this.getAllActiveProduct(res?.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.PRODUCT_CATEGORY?.id)
        this.updateTracking.patchValue({
          product_category_id:res?.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.PRODUCT_CATEGORY?.id,
          product_id:res?.data?.ADD_PRODUCTION_MST?.product_id,
          start_date:res?.data?.start_date,
          end_date:res?.data?.end_date,
          product_variant:res?.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.MASTER_PRODUCT_VARIANT?.variant_name
        })
        for(let index=0; index<this.workStationList.length;index++)
        {
         
          const formGroup = this.itemsFormArray.at(index) as FormGroup;
            if (formGroup) {
               formGroup.patchValue({
                qualityParameter:this.workStationList[index]?.MASTER_WORKSTATION?.name_of_workstation,
                net_production:this.workStationList[index]?.net_production,
                rework:this.workStationList[index]?.rework,
                new_id: this.workStationList[index]?.id
               });
               
             } 
           else {
             this.itemsFormArray.push(
               this._fb.group({
                qualityParameter:this.workStationList[index]?.MASTER_WORKSTATION?.name_of_workstation,
                net_production:this.workStationList[index]?.net_production ,
                rework:this.workStationList[index]?.rework,
                new_id:this.workStationList[index]?.id
               })
             );
           }
          }
         });
        
      });
   
  }
submitTracking(data:any){
 if(this.updateTracking.invalid){
  this.updateTracking.markAllAsTouched()
  this.toaster.error('Mendatory fields should not be empty','Error Message')
  return
 }

  const updatedWorkstationList = data.workstationList.map((workstation: any) => {
  const { qualityParameter, ...rest } = workstation;
  return rest;
});
    let tranckingData={
      shift_id:this.shift_id,
      date:moment(data.date).format('YYYY-MM-DD'),
      workstationList:updatedWorkstationList
    }
      this._productService.updateProductionTrackingDetails(this.tracking_id,tranckingData).subscribe((res:any)=>{
       if(res){
        this.router.navigate(['/master/production/production-tracking-list'])
        this.toaster.success(res.message)
       }
      },(err)=>{
        this.toaster.error(err.error.message)
      })
  }
  goBack()
  {
    this.location.back()
  }
  productData:any=[];
  cetegory:any=[];
  getAllCategory() {
    this.productionService.getAllCetegory(this.entityId).subscribe((res: any) => {
      this.cetegory = res.data;

    })
  }
  getAllActiveProduct(event: any) {
    
    this.productionService.getAllActiveProduct(event.value??event,this.entityId).subscribe((res: any) => {
      this.productData = res.data
    })
  }
}
