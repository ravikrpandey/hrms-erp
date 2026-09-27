import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control?.value && control?.value?.trimLeft() !== control?.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-customer-category-create',
  templateUrl: './customer-category-create.component.html',
  styleUrls: ['./customer-category-create.component.scss'],
})
export class CustomerCategoryCreateComponent {
  customerCategoryForm: FormGroup;
  MASTER_ITEM_SPECIFICATIONs: any[] = [];
  entity_id: any;
  subCategoryForm: FormGroup;
  id : any;
  action_type:any;
  data:any = [];
  response:any = null;
  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private prService: PurchaseRequestService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    public $common: CommonService,
    private route: Router
  ) {
    this.customerCategoryForm = this.fb.group({
      customer_category_name: new FormControl(null,[Validators.required]),
    });
  }
  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.action_type = params.action_type;
      if ( this.id ) {
        this.getById(this.id);
      }
      // this.getAllCategory()
    });
  }

  getById = (id: any) => {
    this._commonService?.showLoader();
    this._configurationalMasterService
      .getCustomerCategoryById(id)
      .subscribe(
        (res: any) => {
          this.response = res.data;
          
          this.customerCategoryForm.patchValue({
            customer_category_name: this.response.customer_category_name
          });
          ;
          this._commonService?.hideLoader();
          //this.toaster.success(res.message);
          // this.route.navigate(['master/configurational-master/pr-item']);
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        }
      );
  }

  onBack = () => {
    this.route.navigate(['master/configurational-master/customer-category']);
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  }

  onSubmit() {
    if (this.customerCategoryForm.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }

    this.customerCategoryForm.value.customer_category_name = this.customerCategoryForm.value.customer_category_name.trim();
    if (this.id) {
      this._commonService?.showLoader();
      this._configurationalMasterService
        .updateCustomerCategory(this.customerCategoryForm.value,this.id)
        .subscribe(
          (res: any) => {
            // this.data = res.data;
            ;
            console.log("++++",res)
            this._commonService?.hideLoader();
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/customer-category']);
          },
          (err) => {
            this._commonService?.hideLoader();
            this.toaster.error(err.error.message);
          }
        );
    } else {
      this._commonService?.showLoader();
      // console.log("som e text her")
      this._configurationalMasterService.createCustomerCategory(this.customerCategoryForm.value).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/customer-category']);
          }
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        }
      );
    }
  }
}
