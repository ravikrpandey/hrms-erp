import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { QualityManagementService } from '../../../quantity-management.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-add-sample',
  templateUrl: './add-sample.component.html',
  styleUrls: ['./add-sample.component.scss']
})
export class AddSampleComponent {
  addSample:FormGroup
  constructor( private _fb:FormBuilder, private _activeRoute:ActivatedRoute,private _productionService:ProductionService,
    private _toaster:ToastrService,private router:Router,private _qualityParameter:QualityManagementService){
  
  this.addSample= _fb.group({
    shift_id: new FormControl('',Validators.required),
    workstation_id: new FormControl('',Validators.required),
    workstation_incharge_name: new FormControl('',Validators.required),
    date: new FormControl('',Validators.required),
    sample_no : new FormControl(''),
    qualityParameter: new FormArray([
      new FormGroup({
        quality_parameter_id:new FormControl(null),
        quality_parameter_name: new FormControl(null),
        quality_status: new FormControl(null,Validators.required),
        value: new FormControl(null),
        remark: new FormControl(null,Validators.required),
      }),
    ]),
    
     
  })
  
  }
 workStationList:any[]=[]
 shiftList:any[]=[]
 qualityParameterList:any[]=[];
 product_id:any;
 product_variant_name:any;
 product_mapping_id:any
 workStationData:boolean=false;
  ngOnInit(): void {
    this._activeRoute.queryParams.subscribe((res: any) => {
      this.product_mapping_id=res.plant_id;
      this._productionService.getTrackingById(res.plant_id).subscribe((res: any) => {
        
         console.warn(res,'data');
         this.product_id=res.data?.ADD_PRODUCTION_MST?.product_id;
         this.product_variant_name=res.data?.ADD_PRODUCTION_MST?.MASTER_PRODUCT?.MASTER_PRODUCT_VARIANT?.variant_name
         this.workStationList=res.data.workstationList;
         this.shiftList=res.data.shiftList;
         
         });
        
      });
  }
  errorMessage:any
  getWorkStation(item:any){
     console.log(item,'itemData');
     let data={
      product_master_id:this.product_id,
      work_station_id:item.workstation_id,
      product_variant_name:this.product_variant_name
     }
     if(item){
      this._qualityParameter.getQualityParameter(data).subscribe((res:any)=>{
        
        this.errorMessage=res.data;
        this.workStationData=true;
          this.addSample.patchValue({
            sample_no:res.sample_code
          })
          res.data.MASTER_QUALITY_PARAMETRs.forEach((item: any, index: number) => {
            const formGroup = this.qualityParameterFormArray.at(index) as FormGroup;
            if (formGroup) {
              setTimeout(() => {
                formGroup.patchValue({
                  quality_parameter_id:item.id,
                  quality_parameter_name: item.quality_parameter,
                  quality_status: '',
                  value: item.value,
                  remark: '',
                });
              }, 200);
            } else {
              this.qualityParameterFormArray.push(
                this._fb.group({
                  quality_parameter_id: item.id,
                  quality_parameter_name: item.quality_parameter,
                  quality_status: '',
                  value: item.value,
                  remark: '',
                })
              );
            }
          });
        
      },(err:any)=>{
        this.workStationData=false;
       this._toaster.warning(err.error.message);
        this.addSample.get( 'sample_no' )?.reset();
        this.qualityParameterFormArray.clear()
      })
     }
    
     
     


  }
  get qualityParameterFormArray() {
    return this.addSample.get("qualityParameter") as FormArray;
  }
  
  goBack(){
  //this.location.back();
  }
 
  saveSampleData(data:any){
    console.warn(data,'data');
   
    if(this.addSample.invalid){
      this._toaster.error('Required field should not be blank','Error Message')
      return this.addSample.markAllAsTouched;

    }
    else if(data.qualityParameter.length===0){
      this._toaster.error('Quality parameter not found on this workstation','Error Message')
    }
  else{
    let sampleData={
      production_mapping_id:this.product_mapping_id,
      product_id:this.product_id,
      shift_id:data.shift_id,
      workstation_id:data.workstation_id,
      date:moment(data.date).format('YYYY-MM-DD'),
      workstation_incharge_name:data.workstation_incharge_name,
      sample_no:data.sample_no,
      quality_parameter:data.qualityParameter
    }
    console.warn(sampleData,'datatatata');
    
    this._qualityParameter.createQualityControl(sampleData).subscribe((res:any)=>{
      if(res){
         
        this._toaster.success(res.message)
        window.history.back();

      }
    },(err:any)=>{
      this._toaster.error(err.error.message)
      this.workStationData=false;
    })
    
  }
  }

   
  
}
