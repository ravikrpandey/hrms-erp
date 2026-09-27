import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyComponent } from '@fullcalendar/core/preact';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-view-scheduled-production',
  templateUrl: './view-scheduled-production.component.html',
  styleUrls: ['./view-scheduled-production.component.scss']
})
export class ViewScheduledProductionComponent implements OnInit {
viewScheduledProduction:FormGroup
constructor( private location:Location,private _fb:FormBuilder, private _activeRoute:ActivatedRoute,private _productionService:ProductionService,
  private _toaster:ToastrService,private router:Router){

this.viewScheduledProduction= _fb.group({
  product_order_no: new FormControl(''),
  product_name: new FormControl(''),
  product_variant: new FormControl(''),
  product_code: new FormControl(''),
  product_description: new FormControl(''),
  remark:new FormControl('',Validators.required),
  bomDetails: new FormArray([
    new FormGroup({
      item_id:new FormControl(null),
      itemName: new FormControl(null),
      itemCode: new FormControl(null),
      bomQty: new FormControl(null),
      total_required_qty: new FormControl(null),
      unit: new FormControl(null),
    }),
  ]),
})

}
product_id:any
production_mapping_id:any
bomDetailsData:any[]=[];
ngOnInit(): void {
  this._activeRoute.queryParams.subscribe((res:any)=>{
    this.production_mapping_id=res.id;
    console.warn(res.id);
    this._productionService.viewScheduledProduction(res.id).subscribe((res:any)=>{
      this.bomDetailsData=res.BomData
      this.product_id=res.data.plantList.product_id
     let bomDetails=res.BomData[0]?.PRO_BOM_DETAILS_MSTs
      this.viewScheduledProduction.patchValue({
      product_order_no: res.data.production_order_no,
      product_name : res.data.plantList.product_master.product_name,
      product_variant: res.product_varient.variant_name,  
      product_code: res.data.plantList.product_master.product_code,
      product_description: res.product_varient.product_description,
    })
      
  for(let index=0;index<bomDetails.length;index++){
    const formGroup = this.bomDetailsFormArray.at(index) as FormGroup;
    if (formGroup) {
      setTimeout(() => {
        formGroup.patchValue({
          item_id:bomDetails[index].ItemMaster.id,
          itemName:bomDetails[index].ItemMaster.item_name,
          itemCode:bomDetails[index].ItemMaster.item_code,
          bomQty:bomDetails[index].bom_qty,
          total_required_qty:bomDetails[index].bom_qty*res.data.production_qty,
          unit:bomDetails[index].ItemMaster.tbl_uom.uom_name,
        });
      }, 200);
    } else {
      this.bomDetailsFormArray.push(
        this._fb.group({
          item_id:bomDetails[index].ItemMaster.id,
          itemName:bomDetails[index].ItemMaster.item_name,
          itemCode:bomDetails[index].ItemMaster.item_code,
          bomQty:bomDetails[index].bom_qty,
          total_required_qty:bomDetails[index].bom_qty*res.data.production_qty,
          unit:bomDetails[index].ItemMaster.tbl_uom.uom_name, 
        })
      );
    }
  }
    })
    
  })
}

get bomDetailsFormArray() {
  return this.viewScheduledProduction.get("bomDetails") as FormArray;
}


goBack(){
this.location.back();
}


ngSubmitRaiseIndent(data:any){
   data.product_id=this.product_id;
   data.production_mapping_id=this.production_mapping_id;
     if(this.bomDetailsData.length<=0){
     this._toaster.error('Please Add the Bom Details on this product','Error Message')
     }
    else{
      this._productionService.postRaiseIndentData(data).subscribe((res:any)=>{
        if(res){
          this._toaster.success(res.message)
          this.router.navigate(['/master/production/schedule-production'])
        }
      },(err:any)=>{
        this._toaster.error(err.error.message)
      })
    }
  
}


}
