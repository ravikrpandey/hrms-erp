
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
   selector: 'app-additional-charge-dilog',
  templateUrl: './additional-charge-dilog.component.html',
  styleUrls: ['./additional-charge-dilog.component.scss']
})

export class AdditionalChargeDilogComponent {

  additionalForm :any;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  additionalCharge: any;
  view: any;
  hsnCodeList: any[] = [];
  entity_id : any;
  financial_id: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _commonService : CommonService,
    public dialog: MatDialogRef<AdditionalChargeDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.additionalForm = this.fb.group({
      // service_category_code: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      additionalCharge_name: new FormControl(null),
      hsn_code_id: new FormControl(null, [Validators.required]),
      description_additional : new FormControl(null, [Validators.required])
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
   this.getById(this.id)

    this.getHsnCode()
    
  }


getById(id: any) {

  this._configurationalMasterService.additionalCharge_getById(id).subscribe((res: any) => {
       
    this.additionalCharge = res.data;
    console.log("++++", this.additionalCharge);

    if (this.additionalCharge) {
      this.additionalForm.patchValue({
        additionalCharge_name: this.additionalCharge?.additional_name,
        hsn_code_id: this.additionalCharge?.additional_hsn_code,
        description_additional : this.additionalCharge?.description_additional,
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
     
    // let val = this.additionalForm.value;
    // console.log(val)
    Object.keys(this.additionalForm.controls).forEach(key => {
      this.additionalForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.additionalForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.additionalForm.value;
    const data = {
      entity_id : this.entity_id,
      financial_id: this.financial_id,
      additional_name: val.additionalCharge_name,
      additional_hsn_code: val.hsn_code_id,
      description_additional: val.description_additional,
    };
    console.log(data)
    this._commonService?.showLoader()
    this._configurationalMasterService.createAdditionalCharge(data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if(res.message=="Addition Charge Name is Already Exists!"){
        this.toast.warning('Addition Charge Name Already Exist!');
      }
      else{
        this.toast.success('Addition Charge Name Added Successfully');
        this.route.navigate([
          'master/configurational-master/addtional-charge',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
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
      
    Object.keys(this.additionalForm.controls).forEach(key => {
      this.additionalForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.additionalForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.additionalForm.value;
    const data = {
      entity_id : this.entity_id,
      financial_id: this.financial_id,
      additional_name: val.additionalCharge_name,
      additional_hsn_code: val.hsn_code_id,
      description_additional: val.description_additional, 
    };
    this._commonService?.showLoader()
    this._configurationalMasterService.additionalCharge_update(this.id,data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if(res.message=="Additional Charge Name is Already Exists!"){
        this.toast.warning('Additional Charge Already Exist!');
      }
      else{
        this._commonService?.hideLoader()
        this.toast.success('Additional Charge Name Updated Successfully');
        this.route.navigate([
          'master/configurational-master/additional-charge',
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
          this.toast.error('Additional Charge Name Already Exist!');
        }else if(err.error.message) {
          this.toast.warning(err.error.message);
        }else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.additionalForm.value);
  }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  // departmentFilter(e: any) {
  //   const aa = e
  //   let filteredVariable = this.departmentList2.filter((item: any) => aa.includes(item.department_name));
  //   this.departmentList = filteredVariable
  // }

}
