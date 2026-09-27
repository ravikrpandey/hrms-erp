import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { de } from 'date-fns/locale';
import { ToastrService } from 'ngx-toastr';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss']
})
export class AddMaintenanceComponent implements OnInit {
 
  id: any;
  assetCatalogue: any;
  assetTags: any;
  companies: any;
  getCat_data: any;
  calculateData: any;
  status:boolean=false;
  entity_id: string | null;
  finacial_id: number;
  empId: any;
  vendor: any=[];
  Asset: any=[];
  createmaintenanceForm:FormGroup;
  mode: any;
selectedAssetTags: any;
entities: any;
  AssetList: any[]=[];
  getData: any;
  selectedEntity: FormControl<any>;
 constructor(private asset_service:AssetListService,
  private fb:FormBuilder,
  private router:Router,
  private toastr:ToastrService,
  private activeroute: ActivatedRoute,
 ) {
  this.activeroute.queryParams.subscribe((params: any) => {
    this.id = params.id;
    this.mode=params.mode;
  });
 }
  ngOnInit(): void {
   
    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id)

    var empData: any = localStorage.getItem('signInUser');
    const singleEmpData = JSON.parse(empData);
    let employee_id = singleEmpData?.employee_id;
    this.empId = employee_id;
    this.createForm();
    if(this.entity_id){
  
      this.getAllVendorsForMaintenance();
      this.getAllAssetsForMaintenance();
    }
    if(this.id){
      this.getMaintenanceListById();
    }
    
   
  }

  createForm() {
    this.createmaintenanceForm = this.fb.group({
      entity_id: new FormControl(this.entity_id || null, [Validators.required]), 
      asset_tagIds:  [[], Validators.required],
      maintenanceBy: new FormControl(null, [Validators.required]), 
      repairDetails: new FormControl(null, [Validators.required]), 
      completionDate: new FormControl(null, [Validators.required]), 
      scheduledDate: new FormControl(null, [Validators.required]), 
      amount: new FormControl(null, [Validators.required]), 
      maintenanceStatus: new FormControl(null, [Validators.required]) ,
      expireAmc: new FormControl(false, [Validators.required]) ,
      isUnderAmc: new FormControl(false, [Validators.required]) 
    });
    const isUnderAmcControl = this.createmaintenanceForm.get('isUnderAmc');
  const expireAmcControl = this.createmaintenanceForm.get('expireAmc');

  if (isUnderAmcControl && expireAmcControl) {
    isUnderAmcControl.valueChanges.subscribe((isChecked: boolean) => {
      if (isChecked) {
        expireAmcControl.setValue(false, { emitEvent: false });
      }
    });

    expireAmcControl.valueChanges.subscribe((isChecked: boolean) => {
      if (isChecked) {
        isUnderAmcControl.setValue(false, { emitEvent: false });
      }
    });
  }
}

  onAssetTagSelect(assetTagId: number) {
    const assetTagArray = this.createmaintenanceForm.get('asset_tagIds') as FormArray;
    if (assetTagArray.value.includes(assetTagId)) {
      const index = assetTagArray.controls.findIndex(x => x.value === assetTagId);
      assetTagArray.removeAt(index);
    } else {
      assetTagArray.push(new FormControl(assetTagId));
    }
  }
  
  showAsset() {
     if(!this.status){
      this.status=true;
     }
     else{
      this.status=false;
     }
   }

   getAllVendorsForMaintenance(){
      this.asset_service.getAllVendorsForMaintenance(this.entity_id).subscribe((res:any)=>{
         if(res.data){ 
          this.vendor=res.data;
         }
      },(err:any)=>{

      })
    
   }
   getAllAssetsForMaintenance(){
      this.asset_service.getAllAssetsForMaintenance(this.entity_id).subscribe((res:any)=>{
         if(res.data){ 
          this.AssetList=res.data;
          this.Asset=res.data;
          this.entities = this.AssetList.map((res: any) => res.asset_tagId);
         }
      },(err:any)=>{

      })
    
   }
   getMaintenanceListById(){
      this.asset_service.getMaintenanceListById(this.id).subscribe((res:any)=>{
         if(res.data){ 
          this.getData=res.data;
          let tempEntityList: any = [];
          const mappings = this.getData.ASSETMAINTENANCE_MAPPINGs || this.getData.tbl_assetMaintenanceMappings || [];
          mappings.map((item: any) => {
            tempEntityList?.push(item?.asset_tagIds);
          })
          this.selectedEntity = new FormControl(tempEntityList);
           this.pathcValue(this.getData)

         }
      },(err:any)=>{

      })
     
   }

   pathcValue(maintenanceData: any) {
    let tempEntityList: any = [];
    const mappings = this.getData.ASSETMAINTENANCE_MAPPINGs || this.getData.tbl_assetMaintenanceMappings || [];
    mappings.map((item: any) => {
      tempEntityList?.push(Number(item?.asset_tagIds));
    })
    if (tempEntityList.length > 0) {
      this.status = true;
    }
    this.createmaintenanceForm.patchValue({
      entity_id: maintenanceData.entity_id,
      maintenanceBy: maintenanceData.maintenanceBy,
      repairDetails: maintenanceData.repairDetails,
      completionDate: maintenanceData.completionDate,
      scheduledDate: maintenanceData.scheduledDate,
      amount: maintenanceData.amount,
      maintenanceStatus: maintenanceData.maintenanceStatus,
      expireAmc: maintenanceData.expireAmc,
      isUnderAmc: maintenanceData.isUnderAmc,
      asset_tagIds: tempEntityList
    });
     
  }
  entitySearch(e : any) {
    const aa = e
    let filteredVariable = this.AssetList.filter((item: any) => aa.includes(item.asset_tagId));
    this.Asset = filteredVariable
  }
  onEntitySelectionChange(selectedEntities: number[]): void {
    
  }
   onSubmit() {
    let data = {
      entity_id: this.entity_id,
      asset_tagIds: this.createmaintenanceForm.get('asset_tagIds')?.value,
      maintenanceBy: this.createmaintenanceForm.get('maintenanceBy')?.value,
      repairDetails: this.createmaintenanceForm.get('repairDetails')?.value,
      completionDate: this.createmaintenanceForm.get('completionDate')?.value,
      scheduledDate: this.createmaintenanceForm.get('scheduledDate')?.value,
      amount: this.createmaintenanceForm.get('amount')?.value,
      maintenanceStatus: this.createmaintenanceForm.get('maintenanceStatus')?.value,
      expireAmc: this.createmaintenanceForm.get('expireAmc')?.value,
      isUnderAmc: this.createmaintenanceForm.get('isUnderAmc')?.value
    };
    if(this.id){

      if (data) {
        this.asset_service.updateAssetMaintenance(this.id,data).subscribe(
          (res: any) => {
            if (res.data) {
              this.toastr.success('Maintenance Updated Successfully');
              this.router.navigate(['/master/asset-management/maintenance']);
            }
          },
          (err: any) => {
          }
        );
      }
    }
    else{
    if (data) {
      this.asset_service.createAssetMaintenance(data).subscribe(
        (res: any) => {
          if (res.data) {
            this.toastr.success('Maintenance Created Successfully');
            this.router.navigate(['/master/asset-management/maintenance']);
          }
        },
        (err: any) => {
        }
      );
    }
  }
  }
  
   
}
