import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreakdownManagementService } from 'src/app/@shared/services/breakdown-management/breakdown-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { MaintenanceService } from 'src/app/@shared/services/Maintenance/maintenance.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';
import { RemarkDialogueComponent } from '../remark-dialogue/remark-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { MaintenaceCheckComponent } from '../maintenace-check/maintenace-check.component';

@Component({
  selector: 'app-create-schedule-maintenance',
  templateUrl: './create-schedule-maintenance.component.html',
  styleUrls: ['./create-schedule-maintenance.component.scss']
})
export class CreateScheduleMaintenanceComponent {
cetegory: any;
productData: any[]=[];
AssetData: any[]=[];

createSchedualForm: FormGroup;
  entity_id: string | null;
  financial_year_id: string | null;
  getAllWorkStation: any;
id: any;
imageToUpload: any;
imageView: any;
  image: any;
  type: any;
  imagePath: any;
  allIssueType:any=[];
  loginUser: any;
  status: any;
  AllStatus:any=[];
  VendorData:any=[];
  TagIdData:any=[];
approval_require: boolean=false;
item_require: boolean=false;
asset_require: boolean=false;
minEndDate: Date;
fileArray: any[] = [];
formDisabled: boolean;
  fileGetCheck: any;
  value: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService:ConfigurationalmasterService,
    private $crm:CrmService,
    private breakdown_service:BreakdownManagementService,
    private prService:PurchaseRequestService,
      private recruitService: RecruitService,
      private vendorService:VendorManagementService,
      private maintenance_service:MaintenanceService,
       public dialog: MatDialog,
  ) {
    this.createSchedualForm = this.fb.group({
      workstation_id: new FormControl(null, Validators.required),
      vendor_id: new FormControl(null, Validators.required),
      priority: new FormControl(null, Validators.required),
      emp_id: new FormControl(null, Validators.required),
      end_date: new FormControl(null, Validators.required),
      financial_year_id: new FormControl(null, Validators.required),
      entity_id: new FormControl(null, Validators.required),
      start_date: new FormControl(null, Validators.required),
      maintenance_type: new FormControl(null, Validators.required),
      asset_tag_id: new FormControl(null, Validators.required),
      amc: new FormControl(null, Validators.required),
      asset_name: new FormControl(null, Validators.required),
      frequency: new FormControl(null, Validators.required),
      status: new FormControl(null),
      status_remark: new FormControl(null),
      remark: new FormControl(null),
     approver_remark: new FormControl(null),
     productDetailList: new FormArray([
              new FormGroup({
                id: new FormControl(null),
                category_id: new FormControl(null),
                item_id: new FormControl(null),
                quantity: new FormControl(null),

              }),
            ]),
     assetDetailList: new FormArray([
              new FormGroup({
                id: new FormControl(null),
                asset_category_id: new FormControl(null),
                asset_id: new FormControl(null),
                quantity: new FormControl(null),

              }),
            ]),
    });
    this.fileArray.push({ imagePath: null, url: null });
  }
  viewData:any;
  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');


    this.createSchedualForm.patchValue({
      entity_id:this.entity_id,
      financial_year_id:this.financial_year_id
    })
    this.getActive_IssueType();
    this.getAllShiftMaster();
    this.getAllWorkStationMaster();
    this.getEmployee();
    this.getAll_Status();
    this.getVendorData();
    this.getAllCategory();
    this.getallTagId();
    this.activeroute.queryParams.subscribe((params: any) => {
      
      this.id = params['id'];
      this.status = params['status'];
      this.value = params['value'];
        if(this.id){
           this.getSchedule_Maintenanceby_Id(this.id);
        }
    });
  }

  goBack() {
    this.router.navigate(['/master/maintenance-management/plan-maintenance'])
  }

  get CF_1(): any {
    return this.createSchedualForm.controls;
  };
  get CF_2(): any {
    return this.createSchedualForm.controls;
  };
  addrow() {

    <FormArray>this.CF_1.productDetailList.push(
      new FormGroup({
        category_id: new FormControl(null),
        item_id: new FormControl(null),
        quantity: new FormControl(null),


      }),
    );

  }
  addrow1() {

    <FormArray>this.CF_2.assetDetailList.push(
      new FormGroup({
        asset_category_id: new FormControl(null),
        asset_id: new FormControl(null),
        quantity: new FormControl(null),


      }),
    );

  }

  deleteRow(i: any, control: any) {
    if (this.CF_1.productDetailList.length >= 1) {
      this.CF_1.productDetailList.removeAt(i);
    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
  }
  deleteRow1(i: any, control: any) {
    if (this.CF_2.assetDetailList.length >= 1) {
      this.CF_2.assetDetailList.removeAt(i);
    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
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
  getActive_IssueType(){
     this.breakdown_service.getActive_IssueType(this.entity_id,this.financial_year_id).subscribe((res:any)=>{
         if(res){
          this.allIssueType=res.data;
         }
     },(err:any)=>{

     })
  }
  getAllWorkStationMaster() {
    this._configurationalMasterService
      .getWorkStationMasterList(this.entity_id,this.financial_year_id)
      .subscribe((res: any) => {
        this.getAllWorkStation = res.data;
      });
  }
  shiftData: any[] = [];
  getAllShiftMaster() {
    this._configurationalMasterService.getShiftList().subscribe((res: any) => {
      this.shiftData = res.data;

    });
  }
  onSubmitForm() {
   let data=this.createSchedualForm.value;
   if(data){
      data.image_upload=this.fileArray;
      data.approval_required=this.approval_require;
      data.item_required=this.item_require;
      data.asset_required=this.asset_require;
      data.asset_details=data.assetDetailList
      data.item_details=data.productDetailList;
      data.maintenance_details=this.closed;
     if(!this.id){
      this.maintenance_service.create_plan_maintenance(data).subscribe((res:any)=>{
        if(res){
         this.toast.success('Maintenance Create Successfully');
         this.router.navigate(['/master/maintenance-management/plan-maintenance'])
        }
     },(err:any)=>{

     })
     }
     else{
      this.maintenance_service.Update_plan_maintenance(this.id,data).subscribe((res:any)=>{
        if(res){
         this.toast.success('Maintenance Update Successfully');
         this.router.navigate(['/master/maintenance-management/schedule-maintenance'])
        }
     },(err:any)=>{

     })
     }

   }
  }

  employeeList: any = [];
  getEmployee() {
    try {
      this.$crm.registrationall(this.entity_id,this.loginUser?.roles).subscribe((response: any) => {
        if (response) {
          this.employeeList = response.data;
        }
      }, (err:any) => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  getAll_Status(){
    this.breakdown_service.getAll_Status().subscribe((res:any)=>{
       if(res){
        this.AllStatus=res.data;
       }
    },(err:any)=>{

    })
  }
  changevalue(){
    if(this.approval_require==false){
      this.approval_require=true;
    }
    else{
      this.approval_require=false;
    }
  }
  changeItem(){
    if(this.item_require==false){
      this.item_require=true;
    }
    else{
      this.item_require=false;
    }
  }
  changeAsset(){
    if(this.asset_require==false){
      this.asset_require=true;
    }
    else{
      this.asset_require=false;
    }
  }

  getAllCategory(){
    this._configurationalMasterService
    .getActiveAssetMasterList()
    .subscribe((res: any) => {
      this.cetegory = res.data;

    });
  }
  selectCateGory(e: any,index:any) {

    this.prService.getAssetByItem1(e.value??e).subscribe((res: any) => {
    if(res){
       this.productData[index]=res.data
    }

    },
      ((err: any) => {
        this.toast.error(err.error.message)
      }))
  }
  selectAssetCateGory(e: any,index:any) {

    this.prService.getAllAssetbyCat_id(this.entity_id,e.value??e).subscribe((res: any) => {
    if(res){
       this.AssetData[index]=res.data
    }

    },
      ((err: any) => {
        this.toast.error(err.error.message)
      }))
  }
  setMinEndDate(startDate: Date) {
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);
    this.minEndDate = minEndDate;
  }
  onChangefile(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imagePath =
          file.type === 'application/pdf'
            ? '/assets/icons/pdfimg.png'
            : e.target.result;
        this.fileArray[index].imagePath = imagePath;
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      this.fileGetCheck = formData;
      formData.append('file', file);
      this.recruitService.uploaddocumentsUpdate(formData).subscribe(
        (res: any) => {
          this.toast.success('File Uploaded Successfully');
          this.fileArray[index].url = res?.url;
        },
        (err: any) => {
          this.toast.error(`${err?.error?.message}`);
        }
      );
    }
  }
  addFileInput(index: number) {
    if (this.fileGetCheck !== undefined) {
      this.fileArray.splice(index + 1, 0, { imagePath: null, url: null });
      this.fileGetCheck = undefined;
    } else {
      this.toast.warning('First Upload The File.');
    }
  }

  removeFileInput(index: number) {
    if (this.fileArray.length > 1) {
      this.fileArray.splice(index, 1);
    } else {
      this.toast.warning('At least one file input must be present.');
    }
  }
  sevralUrl() {
    return environment.servralUrl + '/uploaded_files/';
  }
  openFileInNewTab(url: string) {
    window.open(this.sevralUrl() + url, '_blank');
  }
  changeMaintenance(event:any){
    this.type=event.value;
  }
  getVendorData() {
    this.vendorService.getAllVendorList(this.entity_id).subscribe(
      (res: any) => {
        this.VendorData = res.data;
      },

      (err: any) => {
        this.VendorData = [];
      }
    );
  }
  getallTagId() {
    this.recruitService.getAllAssetTag_id(this.entity_id).subscribe(
      (res: any) => {
        this.TagIdData = res.data;
      },

      (err: any) => {
        this.TagIdData = [];
      }
    );
  }
  changeAssetdata(event:any){
    let data=this.TagIdData.filter((res:any)=>res.id == event.value?event.value:event);
    if(data){
      this.createSchedualForm.patchValue({
        asset_name:data[0]?.item_name,
        amc:data[0]?.isUnderAmc
      })
    }

  }
  getSchedule_Maintenanceby_Id(id:any){
    this.maintenance_service.getSchedule_Maintenanceby_Id(id).subscribe((res:any)=>{
        if(res){
          let data=res.data;
          this.setAllData(data);
        }
    },(err:any)=>{

    })

  }
  setAllData(data:any){
    
    let plan_Maintenance=data?.planMaintenance;
    this.changeAssetdata(plan_Maintenance?.asset_tag_id);
    this.type=plan_Maintenance?.maintenance_type;
    this.asset_require=plan_Maintenance?.asset_require;
    this.item_require=plan_Maintenance?.item_require;
    this.approval_require=plan_Maintenance?.approval_require;

    this.createSchedualForm.patchValue({
      workstation_id: plan_Maintenance?.workstation_id,
      vendor_id: plan_Maintenance?.vendor_id,
      priority: plan_Maintenance?.priority,
      end_date: plan_Maintenance?.end_date,
      start_date: plan_Maintenance?.start_date,
      maintenance_type: plan_Maintenance?.maintenance_type,
      asset_tag_id: plan_Maintenance?.asset_tag_id,
      frequency: plan_Maintenance?.frequency,
      remark:plan_Maintenance?.remark,
      emp_id:plan_Maintenance?.employee_id,
      status:plan_Maintenance?.status_id,
      approver_remark:plan_Maintenance?.Approver_remark,

    })
    let product=data?.itemData;
    const productDetailList = this.createSchedualForm.get('productDetailList') as FormArray;

    productDetailList.clear();

    if (product) {
      product.forEach((detail: any,index:any) => {
        this.selectCateGory(detail?.category_id,index);
        const group = new FormGroup({
          id: new FormControl(detail?.id),
          category_id: new FormControl(detail?.category_id),
          item_id: new FormControl(detail?.item_id),
          quantity: new FormControl(detail?.quantity),
        });
        productDetailList.push(group);
      });
    }
    let Asset=data?.assetData;
    const assetDetailList = this.createSchedualForm.get('assetDetailList') as FormArray;

    assetDetailList.clear();

    if (Asset) {
      Asset.forEach((detail: any,index:any) => {
        this.selectAssetCateGory(detail?.aaset_category_id,index);
        const group = new FormGroup({
          id: new FormControl(detail?.id),
          asset_category_id: new FormControl(detail?.aaset_category_id),
          asset_id: new FormControl(detail?.asset_id),
          quantity: new FormControl(detail?.quantity),
        });
        assetDetailList.push(group);
      });
    }

  }
  updateStatus(event:any){
    let data=this.createSchedualForm.value;
    let value={
      id:this.id,
      status:event,
      remark:data?.approver_remark
    }
    this.maintenance_service.maintenanceApprove_Reject(value).subscribe((res:any)=>{
        if(res){
          if(event=='APPROVED'){
            this.toast.success('Maintenance Approved Successfully');
            this.router.navigate(['/master/maintenance-management/maintenance-request'])
          }
          else{
            this.toast.success('Maintenance Rejected Successfully');
            this.router.navigate(['/master/maintenance-management/maintenance-request'])
          }
        }
    },(err:any)=>{

    })
  }
     openDialog(e: any) {
       e.stopPropagation()
       const dialogRef
         = this.dialog.open(RemarkDialogueComponent, {
           width: '50%',
           data: { data: this.id },
            panelClass: 'chat-box-panel'
         });

       dialogRef.afterClosed().subscribe((result:any) => {
       });
     }
     closed: any=[];
     selectChange(fieldName: any) {
      
      let data=this.AllStatus.filter((res:any)=>res.id==this.createSchedualForm?.value?.status);
       if (fieldName == 'status' && data[0]?.status_name == 'CLOSED') {
         const dialogRef = this.dialog.open(MaintenaceCheckComponent, {
           width: '1200px',
           data: { id: this.createSchedualForm?.value?.workstation_id},
         });

         dialogRef.afterClosed().subscribe(result => {
           this.closed = result;
          console.log(this.closed)
         });
       }
     }
}



