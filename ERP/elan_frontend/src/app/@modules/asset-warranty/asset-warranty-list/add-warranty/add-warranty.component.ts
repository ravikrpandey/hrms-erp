import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';

@Component({
  selector: 'app-add-warranty',
  templateUrl: './add-warranty.component.html',
  styleUrls: ['./add-warranty.component.scss']
})
export class AddWarrantyComponent implements OnInit {
id: any;
  entity_id: string | null;
  Asset: any=[];
  vendor: any=[];
  createwarrantyForm:FormGroup;
  mode: any;

constructor(private asset_service:AssetListService,
  private fb:FormBuilder,
  private toastr:ToastrService,
  private router:Router,
  private activeroute: ActivatedRoute,
) {
  this.activeroute.queryParams.subscribe((params: any) => {
    this.id = params.id;
    this.mode=params.mode;
  });
}
  ngOnInit(): void {
    this.createForm();
    this.entity_id = localStorage.getItem('selectedEntityId');
    if(this.entity_id){
      this.createwarrantyForm.get('entity_id')?.setValue(this.entity_id),
      this.getAllAssetsForMaintenance();
      this.getAllVendorsForMaintenance();
    }
    if(this.id){
    this.getAssetWarrantiesById();

    }
    this.createwarrantyForm.get('assetTagId')?.valueChanges.subscribe((selectedAssetId) => {
      if (selectedAssetId) {
        this.getInvoiceDetailsForAsset(selectedAssetId);
      }
    });
  }


  createForm() {
    this.createwarrantyForm = this.fb.group({
      entity_id: new FormControl(null, [Validators.required]),  
      assetTagId: new FormControl(null, [Validators.required]), 
      invoiceRefNumber: new FormControl(null, [Validators.required]),  
      warrantyNumber: new FormControl(null, [Validators.required]),  
      invoiceDate: new FormControl(null, [Validators.required]), 
      fromDate: new FormControl(null, [Validators.required]),  
      toDate: new FormControl(null, [Validators.required]),  
      supplierNameId: new FormControl(null, [Validators.required]),  
      remarks: new FormControl(null, [Validators.required]),  
    });
  }
  getInvoiceDetailsForAsset(selectedAssetId: string) {
    
    this.asset_service.getInvoiceDetailsForAsset(selectedAssetId).subscribe((res: any) => {
      if (res.data) {
        this.createwarrantyForm.patchValue({
          invoiceRefNumber: res.data.invoiceNo,
          invoiceDate: res.data.invoiceDate,
        });
      }
    }, (err: any) => {
      console.error(err);
    });
  }
  getAllAssetsForMaintenance(){
    this.asset_service.getAllAssetsForMaintenance(this.entity_id).subscribe((res:any)=>{
       if(res.data){ 
        this.Asset=res.data;
       }
    },(err:any)=>{

    })
  
 }
 getAllVendorsForMaintenance(){
  this.asset_service.getAllVendorsForMaintenance(this.entity_id).subscribe((res:any)=>{
     if(res.data){ 
      this.vendor=res.data;
     }
  },(err:any)=>{

  })

}

getAssetWarrantiesById(){
   this.asset_service.getAssetWarrantiesById(this.id).subscribe((res:any)=>{
  if(res.data){
     let data={
      entity_id: this.entity_id,  
      assetTagId: res.data?.assetTagId, 
      invoiceRefNumber: res.data?.invoiceRefNumber,  
      warrantyNumber: res.data.warrantyNumber,  
      invoiceDate: res.data?.invoiceDate, 
      fromDate: res.data?.fromDate,  
      toDate: res.data?.toDate,  
      supplierNameId: res.data?.supplierNameId,  
      remarks: res.data?.remarks,  
     };
     this.createwarrantyForm.patchValue(data);
  }
   },(err:any)=>{

   })
}

onSubmit(){
  if(this.createwarrantyForm.invalid){
    this.toastr.error('Please fill in all the required fields');
    return
  }
  let data = {
    entity_id: this.entity_id,
    assetTagId: this.createwarrantyForm.get('assetTagId')?.value,
    invoiceRefNumber: this.createwarrantyForm.get('invoiceRefNumber')?.value,
    warrantyNumber: this.createwarrantyForm.get('warrantyNumber')?.value,
    invoiceDate: this.createwarrantyForm.get('invoiceDate')?.value,
    fromDate: this.createwarrantyForm.get('fromDate')?.value,
    toDate: this.createwarrantyForm.get('toDate')?.value,
    supplierNameId: this.createwarrantyForm.get('supplierNameId')?.value,
    remarks: this.createwarrantyForm.get('remarks')?.value,
  };
  if(this.id){
    if(data){
      this.asset_service.updateAssetWarranty(this.id,data).subscribe((res:any)=>{
         if(res.data){
          this.toastr.success('Warranty Updated Successfully');
          this.router.navigate(['/master/asset-management/warranty-list'])
         }
      },(err:any)=>{
  
      })
    }
  }
  else{
    if(data){
      this.asset_service.createAssetWarranty(data).subscribe((res:any)=>{
         if(res.data){
          this.toastr.success('Warranty Create Successfully');
          this.router.navigate(['/master/asset-management/warranty-list'])
         }
      },(err:any)=>{
  
      })
    }
  }
  
}
}
