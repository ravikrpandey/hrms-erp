import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-update-production-tracking',
  templateUrl: './update-production-tracking.component.html',
  styleUrls: ['./update-production-tracking.component.scss'],
})
export class UpdateProductionTrackingComponent {
  updateTracking: FormGroup
  constructor(
    private router: Router,
    private _productService: ProductionService,
    private _active: ActivatedRoute,
    private _fb:FormBuilder,private toaster:ToastrService,
    private location:Location
  ) {

this.updateTracking=_fb.group({
  product_name:new FormControl(),
  start_date:new FormControl(),
  end_date:new FormControl(),
  shiftList:new FormControl(),
  date:new FormControl('',Validators.required),
   shift_id:new FormControl('',[Validators.required]),

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
    this._active.queryParams.subscribe((res: any) => {
      this.tracking_id=res.id;
      this._productService.getTrackingById(res.id).subscribe((res: any) => {
        this.shiftList=res?.data?.shiftList
        this.workStationList=res?.data?.workstationList;
        console.log(this.workStationList,'this.workStationList');
        
        this.updateTracking.patchValue({
          product_name:res?.data?.plantList?.product_master?.product_name,
          start_date:moment(res?.data?.start_date).format('YYYY-MM-DD'),
          end_date:moment(res?.data?.end_date).format('YYYY-MM-DD'),
        })
        for(let index=0; index<this.workStationList.length;index++)
        {
         
          const formGroup = this.itemsFormArray.at(index) as FormGroup;
            if (formGroup) {
               formGroup.patchValue({
                qualityParameter:this.workStationList[index]?.Workstation?.name_of_workstation,
                net_production:this.workStationList[index]?.net_production,
                rework:this.workStationList[index]?.rework,
                new_id: this.workStationList[index]?.id
               });
               
             } 
           else {
             this.itemsFormArray.push(
               this._fb.group({
                qualityParameter:this.workStationList[index]?.Workstation?.name_of_workstation,
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

}
