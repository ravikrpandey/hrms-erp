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
  selector: 'app-subcategory-create',
  templateUrl: './subcategory-create.component.html',
  styleUrls: ['./subcategory-create.component.scss'],
})
export class SubcategoryCreateComponent {
  createPrItemForm: FormGroup;
  MASTER_ITEM_SPECIFICATIONs: any[] = [];
  entity_id: any;
  subCategoryForm: FormGroup;
  id : any;
  action_type:any;
  data:any = [];
  response:any = null;
  financial_year_id:any = null;
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
    this.subCategoryForm = this.fb.group({
      customer_category_id: new FormControl(null,[Validators.required]),
      sub_category_name: new FormControl(null, [Validators.required]),
      sub_category_code: new FormControl(null, [Validators.required]),
    });
  }
  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.action_type = params.action_type;
      this.entity_id = localStorage.getItem('selectedEntityId');
      this.financial_year_id = localStorage.getItem('financial_id');
      if ( this.action_type != 'view' && this.action_type != 'edit') {
        const sub_category_code = btoa(Math.random().toString()).slice(0, 10).toUpperCase();
        this.subCategoryForm.patchValue({
          sub_category_code: sub_category_code
        });
      }
      this.getAllCategory()
    });
  }

  getById = (id: any) => {
    console.log("fsdffds",id)
    this._commonService?.showLoader();
    this._configurationalMasterService
      .getCustomerSubCategoryById(id)
      .subscribe(
        (res: any) => {
          this.response = res.data;
          this.subCategoryForm.patchValue({
            sub_category_name: this.response.sub_category_name,
            sub_category_code: this.response.sub_category_code,
            customer_category_id: this.response.customer_category_id
          });
          ;
          console.log("++++",res)
          this._commonService?.hideLoader();
          this.toaster.success(res.message);
          // this.route.navigate(['master/configurational-master/pr-item']);
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        }
      );
  }

  getAllCategory() {
      this._commonService?.showLoader()
      this._configurationalMasterService.allCustomerCategory().subscribe((res: any) => {
      this.data = res.data;
      console.log("++++",this.data)
      if ( this.id ) {
        this.getById(this.id);
      }
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
  })
  }

  onBack = () => {
    this.route.navigate(['master/configurational-master/customer-sub-category']);
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
    ;
    if (this.subCategoryForm.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }

    this.subCategoryForm.value.sub_category_name =this.subCategoryForm.value.sub_category_name.trim()
    if (this.id) {
      this._commonService?.showLoader();
      this._configurationalMasterService
        .updateCustomerSubCategory(this.id,this.subCategoryForm.value)
        .subscribe(
          (res: any) => {
            // this.data = res.data;
            ;
            console.log("++++",res)
            this._commonService?.hideLoader();
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/customer-sub-category']);
          },
          (err) => {
            this._commonService?.hideLoader();
            this.toaster.error(err.error.message);
          }
        );
    } else {
      this._commonService?.showLoader();
      // console.log("som e text her")
      this.subCategoryForm.value.entity_id = this.entity_id;
      this.subCategoryForm.value.financial_year_id = this.financial_year_id;
      this._configurationalMasterService.createCustomerSubCategory(this.subCategoryForm.value).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          this.route.navigate(['master/configurational-master/customer-sub-category']);
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/customer-sub-category']);
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
