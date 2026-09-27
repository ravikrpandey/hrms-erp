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
  selector: 'app-customer-micro-category-create',
  templateUrl: './customer-micro-category-create.component.html',
  styleUrls: ['./customer-micro-category-create.component.scss'],
})
export class CustomerMicroCategoryCreateComponent {
  createPrItemForm: FormGroup;
  MASTER_ITEM_SPECIFICATIONs: any[] = [];
  entity_id: any;
  subCategoryForm: FormGroup;
  id : any;
  action_type:any;
  data:any = [];
  data2:any = [];
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
      customer_sub_category_id: new FormControl(null, [Validators.required]),
      micro_category_name: new FormControl(null, [Validators.required]),
      micro_category_code: new FormControl(null, [Validators.required]),
    });
  }
  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      if ( this.id ) {
        this.getById(this.id);
      }
      this.action_type = params.action_type;
      this.entity_id = localStorage.getItem('selectedEntityId');
      this.financial_year_id = localStorage.getItem('financial_id');
      if ( this.action_type != 'view' && this.action_type != 'edit') {
        const micro_category_code = btoa(Math.random().toString()).slice(0, 10).toUpperCase();
        this.subCategoryForm.patchValue({
          micro_category_code: micro_category_code
        });
      }
      this.getAllCategory()
    });
  }

  getById = (id: any) => {
    this._commonService?.showLoader();
    this._configurationalMasterService.getCustomerMicroCategoryById(id)
      .subscribe(
        (res: any) => {
          this.response = res.data;
          console.log("fdasfsdfds",this.response)
          this.subCategoryForm.patchValue({
            micro_category_name: this.response.micro_category_name,
            micro_category_code: this.response.micro_category_code,
            customer_category_id: this.response.customer_category_id
          });
          this.onCategoryChange(this.response.customer_category_id);
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

  onCategoryChange(e: any) {
    this._commonService?.showLoader()
      this._configurationalMasterService.getSubCategoryByCustomerCategory(this.entity_id,this.financial_year_id,e).subscribe((res: any) => {
      this.data2 = res.data;
      console.log("++wwwwww++",this.data)
       if ( this.id ) { 
        this.subCategoryForm.patchValue({
          customer_sub_category_id: this.response.customer_sub_category_id,
        })
        ;
      }
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
  })
  }

  onBack = () => {
    this.route.navigate(['master/configurational-master/customer-micro-category']);
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

    this.subCategoryForm.value.micro_category_name = this.subCategoryForm.value.micro_category_name.trim()
    if (this.id) {
      this._commonService?.showLoader();
      this._configurationalMasterService
        .updateCustomerMicroCategory(this.id,this.subCategoryForm.value)
        .subscribe(
          (res: any) => {
            // this.data = res.data;
            ;
            console.log("++++",res)
            this._commonService?.hideLoader();
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/customer-micro-category']);
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
      this._configurationalMasterService.createCustomerMicroCategory(this.subCategoryForm.value).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/customer-micro-category']);
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
