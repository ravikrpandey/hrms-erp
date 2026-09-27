
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
  selector: 'app-product-copy-dialog',
  templateUrl: './product-copy-dialog.component.html',
  styleUrls: ['./product-copy-dialog.component.scss']
})
export class ProductCopyDialogComponent {
  productForm :FormGroup;
    id: any;
    mainId: any;
    submitted: boolean | undefined;
    loginUser: any;
    loginUserID: any;
    areaData: any;
    service_categoryId: any;
    view: any;
    departmentList: any[] = [];
    entity_id : any;
    departmentList2: any;
    departments: any[];
    constructor(
      private fb: FormBuilder,
      private toast: ToastrService,
      private _configurationalMasterService: ConfigurationalmasterService,
      private route: Router,
      private activeroute: ActivatedRoute,
      private _commonService : CommonService,
      public dialog: MatDialogRef<ProductCopyDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.productForm = this.fb.group({
        // service_category_code: new FormControl(null, [Validators.required,noLeadingSpaces()]),
        amount: new FormControl(null, [Validators.required,noLeadingSpaces()]),
        // department: new FormControl(null, [Validators.required]),
      });
    }
    ngOnInit() {
      this.entity_id = localStorage.getItem('selectedEntityId');
      this.id = this.data?.id
      this.view = this.data?.view
      this.mainId = localStorage.getItem('EmpMainId');
      this.activeroute?.queryParams?.subscribe((params) => {
        // this.id = params;
      });
      let a:any = localStorage.getItem('signInUser');
      this.loginUser = JSON.parse(a)
      this.loginUserID = this.loginUser.id;
     
      if(this.id){
        this._commonService?.showLoader()
        this._configurationalMasterService.getByIdAreaMaster(this.id).subscribe((res: any) => {
          this.areaData = res.data;
          console.log("++++",this.areaData)
          if (this.departmentList.length > 0) {
            this.productForm.patchValue({
              amount: this.areaData?.amount,
              // department: this.areaData?.department_id,
            });
          }
          this._commonService?.hideLoader()
        },(err:any) => {
          this._commonService?.hideLoader()
        });
      }
    }
  
  
  
    onSubmitForm() {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.controls[key].markAsTouched();
      });
      this.submitted = false;
      if (this.productForm.invalid) {
        this.toast.error('Required fields should not be empty.', 'Error Occurred!');
        return;
      }
      let val = this.productForm.value;
      const data = {
        entity_id : this.entity_id,
        amount: val.amount,
        // department_id: val.department,
      };
      this._commonService?.showLoader()
      this._configurationalMasterService.createAreaMaster(data).subscribe(
        (res: any) => {
          this._commonService?.hideLoader()
          this.toast.success('Area Added Successfully');
          this.reloadCurrentRoute();
        //   if(res.message=="Area Name is Already Exits!"){
        //   this.toast.warning('Area Name Already Exist!');
        // }
        // else{
        //   this.route.navigate([
        //     'master/configurational-master/area',
        //   ]);
        //   this.confirmDialog();
        //   this.reloadCurrentRoute();
        // }
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
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.controls[key].markAsTouched();
      });
      this.submitted = false;
      if (this.productForm.invalid) {
        this.toast.error('Required fields should not be empty.', 'Error Occurred!');
        return;
      }
      let val = this.productForm.value;
      const data = {
        // service_category_code: val.service_category_code,
        entity_id : this.entity_id,
        area_name: val.area_name,
        department_id: val.department,
      };
      this._commonService?.showLoader()
      this._configurationalMasterService.areaMasterUpdate(this.id,data).subscribe(
        (res: any) => {
          this._commonService?.hideLoader()
          if(res.message=="Area Name is Already Exits!"){
          this.toast.warning('Area Name Already Exist!');
        }
        else{
          this._commonService?.hideLoader()
          this.toast.success('Area Update Successfully');
          this.route.navigate([
            'master/configurational-master/area',
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
            this.toast.error('Area Already Exist!');
          }else if(err.error.message) {
            this.toast.warning(err.error.message);
          }else {
            this.toast.error('Error in submission!');
          }
        }
      );
    }
    confirmDialog() {
      this.dialog.close(this.productForm.value);
    }
  
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
  
    departmentFilter(e: any) {
      const aa = e
      let filteredVariable = this.departmentList2.filter((item: any) => aa.includes(item.department_name));
      this.departmentList = filteredVariable
    }
  
  }