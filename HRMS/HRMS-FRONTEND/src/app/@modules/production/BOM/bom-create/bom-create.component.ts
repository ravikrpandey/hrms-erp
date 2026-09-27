import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-bom-create',
  templateUrl: './bom-create.component.html',
  styleUrls: ['./bom-create.component.scss']
})
export class BomCreateComponent implements OnInit {
  AddNewForm:FormGroup; 
  constructor(private location:Location,private _fb:FormBuilder,private _configurationalMasterService:ConfigurationalmasterService ,private productionService: ProductionService,private toaster:ToastrService,private route:Router,private activeRoute:ActivatedRoute){
    this.AddNewForm=_fb.group({
      bom_type:new FormControl('',Validators.required),
      product_id:new FormControl('',Validators.required),
      product_variant:new FormControl('',Validators.required),
      product_code:new FormControl('',),
      product_description:new FormControl('',),
      bomDetails : new FormArray([
        new FormGroup({
          asset_id: new FormControl(null, Validators.required),
          item_master_id: new FormControl(null, Validators.required ),
          item_code: new FormControl('',),
          bom_qty: new FormControl(null,Validators.required),
          type: new FormControl(null,Validators.required),
          scrape:new FormControl(null, Validators.compose([
            Validators.required,
            this.minMaxValidator
          ])),
          scrape_reuseable: new FormControl(null,Validators.required),
          uom_id: new FormControl(null,Validators.required),
        }),
      ]),
    })

  }
EmpId:any;
UOMID:any
bomDetails:any[]=[];
viewDetails:any;
productVariantData:any[]=[]
variant_name:any
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((res:any)=>{
      console.log(res.uomId,'response');
      this.viewDetails=res.view;
      this.UOMID=res.uomId
      if(this.UOMID){
        this.getAllProduct();
        this.productionService.getBomAllListByID(this.UOMID).subscribe((response:any)=>{
          this.getVariantByProduct(response.data.product_id)
          this.variant_name=response.data.product_variant
          this.productVariantData.push(response.data)
           this.getAllProductData.filter((res:any)=>{
            if(res.product_name==response.data.product_name)
            {
               this.AddNewForm.patchValue({
                product_code:res.product_code,
                product_description:res.product_description
               }) 
            }
           }) 
       
     

           this.AddNewForm.patchValue({
            bom_type:response.data.bom_type,
            product_id:response.data.product_id,
            product_variant:this.productVariantData[0].product_variant,
           })
           this.bomDetails=response.data.bomDetails
            
           this.bomDetails.forEach((item: any, index: number) => {
           const formGroup = this.itemsFormArray.at(index) as FormGroup;
           this.getAssetCateVal(item.asset_id, index)
            if (formGroup) {
                setTimeout(() => {
                formGroup.patchValue({
                  asset_id:item.asset_id,
                  item_master_id:item.item_master_id,
                  item_code: item?.item_code,
                  bom_qty:item.bom_qty,  
                  type: item.type,
                  scrape: item.scrape,
                  scrape_reuseable:item.scrape_reuseable,  
                  uom_id:item?.uom_name
                });
              },200 ) 
              } 
            else {
              this.itemsFormArray.push(
                this._fb.group({
                  asset_id:item.asset_id,
                  item_master_id:item.item_master_id,
                  item_code: item?.item_code,
                  bom_qty:item.bom_qty,  
                  type: item.type,
                  scrape: item.scrape,
                  scrape_reuseable:item.scrape_reuseable,  
                  uom_id:item?.uom_name
                })
              );
            }
          });
        })
      }
     })
    this.EmpId=localStorage.getItem('EmpMainId')
    this.getAllProduct();
    this.getAllCategory();
    this.getAllItem();
   
  }
  getAllProductData:any[]=[]
  getAllProduct(){
      this._configurationalMasterService.getProductMasterList().subscribe((res: any) => {
        this.getAllProductData = res.data
      }) 
  }
 

    minMaxValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < 1 || value > 100)) {
      return { 'invalidRange': true };
    }
    return null;
  }

  ngSubmitBom(value:any){
    if(this.AddNewForm.invalid){
      this.toaster.error('Mendatory field should not be blank','Error')
      return
    }
    let data={
      bom_type:value.bom_type,
      product_id:value.product_id,
      product_variant:value.product_variant,
      employee_id:this.EmpId,
      bomDetails:value.bomDetails  
    }
    if(this.UOMID){
        this.productionService.updateBomMaster(this.UOMID,data).subscribe((res:any)=>{
           if(res){
            this.toaster.success(res.message);
            this.route.navigate(['/master/production/bom-list'])
              this.AddNewForm.reset();
           }
        },(err:any)=>{
          this.toaster.error(err.error.message)
        })
    }
    else{
      this.productionService.createBomMaster(data).subscribe((response:any)=>{
        if(response){
      this.toaster.success(response.message)
      this.route.navigate(['/master/production/bom-list'])
      this.AddNewForm.reset();
        }
      },(err:any)=>{
        this.toaster.error(err.error.message)
      }) 
    }
  }
  getProductVariant:any[]=[]
  getProductItem(data:any){
    this.getVariantByProduct(data.value)
    this.getProductVariant=[]
    console.log(data.value,'data');
    this.getAllProductData.filter((res:any)=>{
      if(res.id==data.value){
        console.log(res,'data');
        this.AddNewForm.patchValue({
          // product_code:res.product_code,
          product_description:res.product_description,
          
        })
        this.getProductVariant.push(res)
      }
    })
   this.AddNewForm.get('product_code')?.reset()
   this.AddNewForm.get('product_description')?.reset()
  }

  getProductionType(){
    this.AddNewForm.get('product_code')?.reset()
   this.AddNewForm.get('product_description')?.reset()
   this.AddNewForm.get('product_id')?.reset()
   this.AddNewForm.get('product_variant')?.reset()
  }



getAllVariant:any[]=[]
  getVariantByProduct(id:any){
    this.productionService.getVariantById(id).subscribe((res:any)=>{
 this.getAllVariant=res.data;
 console.warn(this.getAllVariant,'this.getAllVariant');
  
 this.getAllVariant.filter((res:any)=>{
  if(res.variant_name===this.variant_name){
 console.warn(res,'trtrtrtrtrt');
 
 this.AddNewForm.patchValue({
   product_code:res.product_variant_code,
   product_description:res.product_description
 })
}
})
    })
  }

  getVariantData(data:any){
    console.warn(data,'datasss');
    this.AddNewForm.patchValue({
      product_description:data.product_description,
      product_code:data.product_variant_code
    })
  }

assetData:any
  getAllCategory() {
    this._configurationalMasterService.getAssetMasterList().subscribe((res: any) => {
      this.assetData = res.data;  
    })
  }
  getAllItemMaster:any
  getAllItem() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.getAllItemMaster = res.data;
         
    })
  }
item_code_data:any
  getItemData(data:any,index:any){
          const formGroup = this.itemsFormArray.at(index) as FormGroup;
          if (formGroup) {
              setTimeout(() => {
              formGroup.patchValue({
                item_code:data.ItemMaster.item_code,
                uom_id:data.ItemMaster.tbl_uom.uom_name
              });
            },200 )
            } 
          else {
            this.itemsFormArray.push(
              this._fb.group({
                item_code:data.ItemMaster.item_code,
                uom_id:data.ItemMaster.tbl_uom.uom_name
              })
            );
          }
  }

  goBack(){
    this.location.back();
  }
  get itemsFormArray() {
    return this.AddNewForm.get('bomDetails') as FormArray;
  }
  addItem() {
         let data= this._fb.group({
          asset_id: new FormControl(null, ),
          item_master_id: new FormControl(null,  ),
          item_code: new FormControl(null,),
          bom_qty: new FormControl(null,),
          type: new FormControl(null,),
          scrape: new FormControl(null,),
          scrape_reuseable: new FormControl(null,),
          uom_id: new FormControl(null,),
    });
    this.itemsFormArray.push(data); 
 
    
  }
   
  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index); 
  }
 getItemById:any[]=[]
  getAssetCateVal(data:any,i:any){
    this.productionService.getItemById(data).subscribe((response:any)=>{
      this.getItemById[i]=response.data;
      console.log(this.getItemById[i],'this.getItemById[i]');
     if(!this.UOMID)
      {
        const bomDetailsArray = this.AddNewForm.get('bomDetails') as FormArray;
        if (i >= 0 && i < bomDetailsArray.length) {
          const control = bomDetailsArray.at(i) as FormGroup;
          control.get('item_code')?.reset('');
          control.get('uom_id')?.reset(null);
        }
      }
    
      
    })
  }


}
