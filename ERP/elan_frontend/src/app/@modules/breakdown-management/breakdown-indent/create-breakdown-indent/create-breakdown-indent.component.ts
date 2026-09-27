import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { BreakdownManagementService } from 'src/app/@shared/services/breakdown-management/breakdown-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-create-breakdown-indent',
  templateUrl: './create-breakdown-indent.component.html',
  styleUrls: ['./create-breakdown-indent.component.scss']
})
export class CreateBreakdownIndentComponent {
cetegory: any;
productData: any[]=[];
getAllActiveProduct($event: MatSelectChange,_t225: number) {
throw new Error('Method not implemented.');
}
  createBreakIndentForm: FormGroup;
  entity_id: string | null;
  financial_year_id: string | null;
  getAllWorkStation: any;
id: any;
imageToUpload: any;
imageView: any;
  image: any;
  imagePath: any;
  allIssueType:any=[];
  loginUser: any;
  status: any;
  AllStatus:any=[];
isPartRequired: boolean=false;;
formDisabled: boolean;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService:ConfigurationalmasterService,
    private breakdown_service:BreakdownManagementService,
    private $crm:CrmService,
    private prService:PurchaseRequestService
  ) {
    this.createBreakIndentForm = this.fb.group({
      workstation_id: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      priority: new FormControl(null, Validators.required),
      issue_id: new FormControl(null, Validators.required),
      shift_id: new FormControl(null, Validators.required),
      financial_year_id: new FormControl(null, Validators.required),
      entity_id: new FormControl(null, Validators.required),
      image_upload: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      line: new FormControl(null, Validators.required),
      allocated_emp_id: new FormControl(null),
      status: new FormControl(null),
      remark: new FormControl(null),
     productDetailList: new FormArray([
              new FormGroup({
                id: new FormControl(null),
                category_id: new FormControl(null),
                item_id: new FormControl(null),
                quantity: new FormControl(null),

              }),
            ]),
    });
  }
  viewData:any;
  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');


    this.createBreakIndentForm.patchValue({
      name:this.loginUser?.first_name,
      entity_id:this.entity_id,
      financial_year_id:this.financial_year_id
    })
    this.getActive_IssueType();
    this.getAllShiftMaster();
    this.getAllWorkStationMaster();
    this.getEmployee();
    this.getAll_Status();
    this.getAllCategory();
    this.activeroute.queryParams.subscribe((params: any) => {
      this. id = params['id'];
      this. status = params['status'];
        if(this.id){
           this.getBreakIndent_byId(this.id);
        }
    });
  }

  goBack() {
    this.router.navigate(['/master/breakdown-management/breakdown-indent'])
  }

  get CF_1(): any {
    return this.createBreakIndentForm.controls;
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

  deleteRow(i: any, control: any) {
    if (this.CF_1.productDetailList.length >= 1) {
      this.CF_1.productDetailList.removeAt(i);
    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
  }
  onChange(e: any) {
    const formData = new FormData();
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageView = e.target.files[0]
      formData.append('file', e.target.files[0]);
      console.log(this.imageView);

      this.imageToUpload = data.item(0) || null;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
        // this.base64Image = e.target.result as String

      };
      reader.readAsDataURL(this.imageToUpload);
    }
    this._configurationalMasterService.uploadDocuments(formData).subscribe((response: any) => {
      if (response) {
        this.image = response?.url;
        this.createBreakIndentForm.patchValue({
          image_upload: this.image
        })
      }
    }, err => {
      console.log(err);
    })
    console.log(this.generateImageUrl(e));
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
    let data=this.createBreakIndentForm.value;
    if(data)
    {
      if(!this.id){
        this.breakdown_service.createBreakdownIndent(data).subscribe((res:any)=>{
          if(res){
             this.toast.success('Breakdown Indent Create Successfully');
             this.router.navigate(['/master/breakdown-management/breakdown-indent'])
          }
      },(err:any)=>{

      })
      }
      else{
        let value={
          emp_id:data?.allocated_emp_id,
          id:this.id,
          remark:data?.remark,
          item_details:data?.productDetailList,
          status:data?.status,
          spare_part:this.isPartRequired
        }
        this.breakdown_service.assigned_breakdownIndent(value).subscribe((res:any)=>{
          if(res){
             this.toast.success('Breakdown  Updated Successfully');
             this.router.navigate(['/master/breakdown-management/breakdown-indent'])
          }
      },(err:any)=>{

      })
      }

    }
  }
  getBreakIndent_byId(id:any){
    this.breakdown_service.getBreakIndent_byId(id).subscribe((res:any)=>{
       if(res){
        let data =res.data;
        this.setAllData(data[0]);
       }
    },(err:any)=>{

    })
  }
  setAllData(data:any){
    this.createBreakIndentForm.patchValue({
      workstation_id: data?.workstation_id,
      description:data?.description,
      priority: data?.priority,
      issue_id: data?.issue_id,
      shift_id: data?.shift_id,
      line: data?.line,
      remark:data?.remark,
      status:data?.status_id
      // image_upload: data?.image_upload,

    })
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
    if(this.isPartRequired==false){
      this.isPartRequired=true;
    }
    else{
      this.isPartRequired=false;
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

    this.prService.getAssetByItem1(e.value).subscribe((res: any) => {
    if(res){
       this.productData[index]=res.data
    }

    },
      ((err: any) => {
        this.toast.error(err.error.message)
      }))
  }
}


