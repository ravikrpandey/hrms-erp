import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-production-maintenance',
  templateUrl: './production-maintenance.component.html',
  styleUrls: ['./production-maintenance.component.scss']
})
export class ProductionMaintenanceComponent implements OnInit {
productionMaintenance:FormGroup;

constructor( private _location:Location,private _fb:FormBuilder, 
  private _activeRoute:ActivatedRoute,private _productionService:ProductionService,private _toaster:ToastrService,private router:Router){
    this.productionMaintenance=this._fb.group({
       product_name:new FormControl(''),
       shift_id:new FormControl('',Validators.required),
       workstation_id:new FormControl('',Validators.required),
       start_date:new FormControl('',Validators.required),
       start_time:new FormControl('',Validators.required),
       end_date:new FormControl('',Validators.required),
       end_time:new FormControl('',Validators.required),
       
    })
  }
shiftList:any;
workStationList:any;
product_mapping_id:any;
product_id:any
ngOnInit(): void {
  this._activeRoute.queryParams.subscribe((res:any)=>{
    this.product_mapping_id=res.id;
     this._productionService.getTrackingById(this.product_mapping_id).subscribe((res:any)=>{
      console.warn(res.data,'responses');
      this.shiftList=res.data.shiftList;
      this.workStationList=res.data.workstationList;
      this.product_id=res.data.plantList.product_id
       this.productionMaintenance.patchValue({
        product_name:res.data.plantList.product_master.product_name
       })
     })
  })
}

goBack(){
  this._location.back()
}
saveMaintenance(data:any){
  if(this.productionMaintenance.invalid){
    this.productionMaintenance.markAllAsTouched()
    this._toaster.error('Required field should not be blank','Error Messsge')
    return;
  }
  let maintenanceData={
    production_mapping_id:this.product_mapping_id,
    product_name:data.product_name,
    product_id:this.product_id,
    shift_id:data.shift_id,
    workstation_id:data.workstation_id,
    start_date:moment(data.start_date).format('YYYY-MM-DD'),
    end_date:moment(data.end_date).format('YYYY-MM-DD'),
    start_time:data.start_time,
    end_time:data.end_time,
    
  }
 
this._productionService.productionMaintenance(maintenanceData).subscribe((response:any)=>{
  if(response){
    this._toaster.success(response.message);
    this.router.navigate(['/master/production/production-tracking-list'])
  }
},(err:any)=>{
  this._toaster.success(err.error.message);

})

  
}


}
