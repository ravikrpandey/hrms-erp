
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-service-category-dilog',
  templateUrl: './service-category-dilog.component.html',
  styleUrls: ['./service-category-dilog.component.scss']
})

export class ServiceCategoryDilogComponent {

  ServiceCategoryForm :FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  service_categoryData: any;
  service_categoryId: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<ServiceCategoryDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.ServiceCategoryForm = this.fb.group({

      // service_category_code: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      service_category_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      service_category_description: new FormControl(null, [Validators.required,noLeadingSpaces()]),


    });
  }
  ngOnInit() {
    this.service_categoryId = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute?.queryParams?.subscribe((params) => {
      this.id = params;
    });
    let a:any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.id;
    if(this.service_categoryId){
      this._configurationalMasterService.getByIdServiceCategoryMaster(this.service_categoryId).subscribe((res: any) => {
        this.service_categoryData = res.data;
          this.ServiceCategoryForm.patchValue({
            // service_category_code: this.service_categoryData?.service_category_code,
            service_category_name: this.service_categoryData?.service_category_name,
            service_category_description: this.service_categoryData?.service_category_description,

          })
      });
    }
  }

  onSubmitForm() {
    Object.keys(this.ServiceCategoryForm.controls).forEach(key => {
      this.ServiceCategoryForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.ServiceCategoryForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.ServiceCategoryForm.value;
    const data = {
      // service_category_code: val.service_category_code,
      service_category_name: val.service_category_name,
      service_category_description: val.service_category_description,

    };
    this._configurationalMasterService.createServiceCategoryMaster(data).subscribe(
      (res: any) => {
        if(res.message=="Service Category already exist!"){
        this.toast.warning('Service Category Name Already Exist!');
      }
      else{
        this.toast.success('Service Category Added Successfully');
        this.route.navigate([
          'master/itticket/configurational-master/service-category',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 201) {
          this.toast.warning('Service Category Name Already Exist!');
        }else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.ServiceCategoryForm.controls).forEach(key => {
      this.ServiceCategoryForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.ServiceCategoryForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.ServiceCategoryForm.value;
    const data = {
      // service_category_code: val.service_category_code,
      service_category_name: val.service_category_name,
      service_category_description: val.service_category_description,
    };
    this._configurationalMasterService.updateServiceCategoryMaster(this.data.id,data).subscribe(
      (res: any) => {
        if(res.message=="Service Category already exist!"){
        this.toast.warning('Service Category Name Already Exist!');
      }
      else{
        this.toast.success('Service Category Update Successfully');
        this.route.navigate([
          'master/itticket/configurational-master/service-category',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 409) {
          this.toast.error('Service Category Name Already Exist!');
        }else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.ServiceCategoryForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}
