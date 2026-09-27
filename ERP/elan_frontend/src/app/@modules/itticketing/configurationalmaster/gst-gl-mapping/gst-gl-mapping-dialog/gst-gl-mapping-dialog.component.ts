
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
   selector: 'app-gst-gl-mapping-dialog',
  templateUrl: './gst-gl-mapping-dialog.component.html',
  styleUrls: ['./gst-gl-mapping-dialog.component.scss']
})

export class GstGlMappingDialogComponent {

  glMappingForm :any;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  additionalCharge:any;
  gstGlMappingData: any;
  view: any;
  hsnCodeList: any[] = [];
  entity_id : any;
  financial_id: any;






  gstTypeList:any[]=[];
  directionList = [{
    direction_name: 'Input GST (Purchase/ITC)'
  },
{
  direction_name: 'Output GST (Sales/Payable)'
}]
  accountList:any[]=[];
  applicableForList = [
    {
      applicable_for: 'All Transactions'
    }
    ,{
    applicable_for: 'Specific Categories'
  },
{
  applicable_for: 'Specific Vendors'
}];

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _commonService : CommonService,
    private _finaceService: FinaceService,
    public dialog: MatDialogRef<GstGlMappingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.glMappingForm = this.fb.group({
      // service_category_code: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      gst_type_id: new FormControl(null,  [Validators.required]),
      direction: new FormControl(null,  [Validators.required]),
      description: new FormControl(null),
      chart_account_id: new FormControl(null, [Validators.required]),
      applicable_for: new FormControl('All Transactions'),
      status: new FormControl('ACTIVE'),
    });
  }
  ngOnInit() {
    ;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id')
    
    this.id = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
   
    let a:any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.id;
   this.getById(this.id);
    this.get_GST_Type();
    this.getChartAccountList();
    // this.getHsnCode()
    
  }


getById(id: any) {

  this._configurationalMasterService.get_GST_GL_Mapping_By_Id(id).subscribe((res: any) => {
       
    this.gstGlMappingData = res.data;
    console.log("++++", this.gstGlMappingData);



    if (this.gstGlMappingData) {
      this.glMappingForm.patchValue({
        gst_type_id: this.gstGlMappingData[0]?.gst_type_id,
       direction: this.gstGlMappingData[0]?.direction,
       description: this.gstGlMappingData[0]?.description,
       chart_account_id: this.gstGlMappingData[0]?.chart_account_id,
       applicable_for: this.gstGlMappingData[0]?.applicable_for,
       status: this.gstGlMappingData[0]?.status
      });
    }
  }, (err: any) => {
    this._commonService?.hideLoader();
  });
}

getHsnCode() {

  
  this._commonService.showLoader()
  this._configurationalMasterService.getHsnSacList().subscribe((res:any)=>{
    this._commonService?.hideLoader()
    this.hsnCodeList = res.data;
    
  })
}




  onSubmitForm() {
     
    // let val = this.glMappingForm.value;
    // console.log(val)
    Object.keys(this.glMappingForm.controls).forEach(key => {
      this.glMappingForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.glMappingForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.glMappingForm.value;

      // gst_type_id: new FormControl(null,  [Validators.required]),
      // direction: new FormControl(null,  [Validators.required]),
      // description: new FormControl(null),
      // chart_account_id: new FormControl(null, [Validators.required]),
      // applicable_for: new FormControl('All Transactions'),
      // status: new FormControl('ACTIVE'),
    const data = {
      entity_id : this.entity_id,
      gst_type_id: val.gst_type_id,
      direction: val.direction,
      description: val.description,
      chart_account_id: val.chart_account_id,
      applicable_for: val.applicable_for,
      status: val.status,
    };
    console.log(data)
    this._commonService?.showLoader();
    this._configurationalMasterService.addGSTGlMapping(data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if(res.message=="Addition Charge Name is Already Exists!"){
        this.toast.warning('Addition Charge Name Already Exist!');
      }
      else{
        this.toast.success('GST GL Account Mapping Successfully');
        this.route.navigate([
          'master/configurational-master/gst-gl-account-mapping',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err:any) => {
        this._commonService?.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 201) {
          this.toast.warning('Area Name Already Exist!');
        }else if(err.error.message) {
          this.toast.warning(err.error.message);
        }else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
      
    Object.keys(this.glMappingForm.controls).forEach(key => {
      this.glMappingForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.glMappingForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.glMappingForm.value;
    // const data = {
    //   entity_id : this.entity_id,
    //   financial_id: this.financial_id,
    //   additional_name: val.additionalCharge_name,
    //   additional_hsn_code: val.hsn_code_id,
    //   description_additional: val.description_additional, 
    // };

     const data = {
      entity_id : this.entity_id,
      gst_type_id: val.gst_type_id,
      direction: val.direction,
      description: val.description,
      chart_account_id: val.chart_account_id,
      applicable_for: val.applicable_for,
      status: val.status,
    };
    this._commonService?.showLoader()
    this._configurationalMasterService.updateGstGlMapping(this.id,data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if(res.message=="Additional Charge Name is Already Exists!"){
        this.toast.warning('Additional Charge Already Exist!');
      }
      else{
        this._commonService?.hideLoader()
        this.toast.success('Updated Successfully');
        this.route.navigate([
          'master/configurational-master/gst-gl-account-mapping',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        this._commonService?.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 409) {
          this.toast.error('Already Exist!');
        }else if(err.error.message) {
          this.toast.warning(err.error.message);
        }else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.glMappingForm.value);
  }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  get_GST_Type(){
    this._configurationalMasterService.get_GST_Type().subscribe((res:any)=>{
      this.gstTypeList = res?.data;
    })
  }

    getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {

      this.accountList = res.data.filter((element: any) => element.is_group === 'no');
      // this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      // this.chartedAccount2 = this.chartedAccount;

    });
  }


  // departmentFilter(e: any) {
  //   const aa = e
  //   let filteredVariable = this.departmentList2.filter((item: any) => aa.includes(item.department_name));
  //   this.departmentList = filteredVariable
  // }

}
