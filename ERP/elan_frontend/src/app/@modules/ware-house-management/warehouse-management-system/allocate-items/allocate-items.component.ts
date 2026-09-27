import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogAllocateCourseComponent } from 'src/app/@modules/lms/assign-course/dialog-allocate-course/dialog-allocate-course.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { InventoryManagementService } from '../../inventory-management.service';

@Component({
  selector: 'app-allocate-items',
  templateUrl: './allocate-items.component.html',
  styleUrls: ['./allocate-items.component.scss']
})
export class AllocateItemsComponent {
  form: FormGroup;
  dynamicOptions: any[] = [];
  courses: any[] = [];
 
  roleId: any
  roleGet: any
  loginUser: any
  entity_id: any = localStorage.getItem("selectedEntityId");
  mode: any

  constructor(public dialog: MatDialogRef<AllocateItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toaster: ToastrService, private route: Router,
    private fb: FormBuilder, private _lmsService: LmsService, private _configurationalMasterService: ConfigurationalmasterService, private _empRegistration: EmpRegistrationService, private _rbacMasterService: RbacMasterService,
    private inventoryService: InventoryManagementService,
  
  ) {
    this.form = this.fb.group({
      items: ['all', Validators.required],
      area: [Validators.required],
      zone_type: [''],
      rack_id: [''],
      shelf_id: [''],
      bin_id: [''],
    
       
      
    });
    if (data?.id) {
     
      this.mode = data.type
    }


  }

  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
  this.getAllZonesByWarehouseId()
 console.log(this.data,'data')
 this.form.patchValue({
  items:this.data?.data.length,
  area:this.data?.data.reduce((acc:number,res:any)=>{
    return acc + res.area 
  },0)
 })
  }

  onTypeChange(type: string) {
    if (type === 'all') {
      this.dynamicOptions = [];
    } else {

      // this.courseService.getEmployees(type).subscribe((data: any[]) => {
      //   this.dynamicOptions = data;
      // });
    }
  }
getAllzonesData:any=[]
  getAllZonesByWarehouseId(){
    this.inventoryService.getAllZonesByWarehouseId(this.data.id).subscribe((res:any)=>{
   this.getAllzonesData = res.data
    })
  }
   zonesData:any=[];
   areaWarehouse:any
  getWarehouseId(data:any){
    this.areaWarehouse = data
    console.log(this.areaWarehouse,'areaWarehouse')
    this.inventoryService.getAllRacksByZoneId(data.warehouse_zone_id).subscribe((res:any)=>{
      console.log(res.data,'ddd');
       this.zonesData = res.data;
       if(data.zone_type=='2'){
        this.form.get('rack_id')?.reset()
        this.form.get('shelf_id')?.reset()
        this.form.get('bin_id')?.reset()
       }
    },(err:any)=>{
      this.toaster.error(err.error.message)
    })
  }
  rackarea:any;
   shelfData:any=[]
  getRackById(data:any){
    this.rackarea = data
    this.inventoryService.getAllShelfByRackId(data.id).subscribe((res:any)=>{
      this.shelfData = res.data
    },(err:any)=>{
      this.toaster.error(err.error.message)
    })
  }
  getAllBinsData:any=[]
  shelfarea:any
  getShelfData(data:any){
    this.shelfarea = data;
    this.inventoryService.getAllBinByShelfId(data.id).subscribe((res:any)=>{
      this.getAllBinsData = res.data
    },(err:any)=>{
      this.toaster.error(err.error.message)
    })
  }
binarea:any;
  getBinData(data:any){
     this.binarea = data
     console.log(data,'data')
  }

  close(){
    this.dialog.close()
  }
   
 
 
   
 
  allocateItems(){
    let payload={
      ...this.form.value,
      items:this.data?.data
    }
  this.inventoryService.allocateItemInWarehouse(payload).subscribe((res:any)=>{
    if(res){
      this.toaster.success(res.message)
      this.dialog.close(res.data)
      // this.reloadCurrentRoute()
    }
  },(err:any)=>{
    this.toaster.error(err.error?.message)
  })
  }
 

 
 
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
