import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
function positiveValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value < 0) {
      return { negative: true };
    }
    return null;
  };
}
function maximumDiscountValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < 0 || value > 100)) {
      return { 'invalidRange': true };
    }
    return null;
  };
}

@Component({
  selector: 'app-product-master-create',
  templateUrl: './product-master-create.component.html',
  styleUrls: ['./product-master-create.component.scss']
})
export class ProductMasterCreateComponent {

  productMasterForm: any;
  id: any;
  parm: any;
  getData: any;
  propertyManager: any;
  personalIdData: any;
  wordCount: any;
  getUOM_data: any[] = [];
  @ViewChild("text") text: ElementRef;
  words: any;
  extraWords: boolean = false;
  asignData: any;
  asignvariables: any;
  asignvariable: any;
  uniqueId: any;
  uniquedata: any;
  nameSearch: any = '';
  variables: any = [];
  variable: any = [];
  checkData: any;
  showDropdown: boolean = false;
  productCtrl = new FormControl();
  filteredProducts: Observable<any[]>;
  products: any[] = [];
  loginUser: any;
  
  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private locatin: Location,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private location: Location
  ) {
    // productMasterForm
    this.productMasterForm = this.fb.group({
      product_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      variant_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      product_description: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      uom_id: new FormControl(null, [Validators.required]),
      mvp: new FormControl(null, [Validators.required, positiveValidator()]),
      price_per_unit: new FormControl(null, [Validators.required, positiveValidator()]),
      maximum_discount: new FormControl(null, [Validators.required, Validators.maxLength(3), maximumDiscountValidator()]),
      average_production_cost: new FormControl(null, [Validators.required, positiveValidator()]),
      product_specification: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    })
  }
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.id = params.id;
    })
    this.getAllProduct();
    this.getAssginSingle();
    if (this.id) {
      this.getByIdUse();
    }
    this.AutoGenerateRequestNo()
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
      this.personalIdData = res.data;
      this.propertyManager = Array.from(this.personalIdData, (a: any) => `${a.first_name} ${a.last_name}`)
    })
    this._empRegistration.getByUserId(localStorage.getItem('EmpMainId')).subscribe((res: any) => {
      this.getData = res.data.first_name;
      this.productMasterForm?.controls['requester']?.setValue(this.getData);
    })
    this._configurationalMasterService.getActiveUOMList().subscribe((res: any) => {
      this.getUOM_data = res.data;
    })
    if (!this.id) {
      this.getuniqueNumber();
    }
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  getAllProduct() {
    this._configurationalMasterService.getProductMasterList().subscribe((res: any) => {
      const aa = res.data
      const newArray = aa.map((item: any, index: any) => ({ ...item, index: index + 1 }));
      this.products = newArray
      this.filteredProducts = this.productCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterProducts(value))
      );
    })
  }
  private _filterProducts(value: string): any[] {
    const filterValue = value;
    this.productMasterForm.get('product_name').setValue(filterValue);
    return this.products.filter(product => product.product_name.includes(filterValue));
  }
  goBack() {
    this.location.back();
  }
  getAssginSingle() {
    this.recruitService.getSpocRecruipment().subscribe((res: any) => {
      this.asignData = res.data;
      this.asignvariables = this.asignData.map((res: any) => res.first_name)
      this.asignvariable = this.asignData

    });
  }
  asignFilter(e: any) {
    const aa = e
    let filteredVariable = this.asignvariable.filter((item: any) => aa.includes(item.first_name));
    this.asignData = filteredVariable
  }
  changedText() {
    if (this.words >= 50) {
      this.extraWords = true;
      this.toast.warning('Please enter within the text limit..', 'Warning Message');
      return
    } else if (this.words < 50) {
      this.extraWords = false;
    }
  }
  back() {
    history.back()
  }
  getByIdUse() {
    this._configurationalMasterService.getByIdProductMaster(this.id).subscribe((res: any) => {
      this.getData = res.data.product_variant_masters;
      this.basicFormPatch(this.getData)
    })
  }
  AutoGenerateRequestNo() {
    this.emp_master.AutoGenerateRequestNo().subscribe((response: any) => {
      const apiRequestNo = response.data;
    },
      (error) => {
      }
    )
  }
  basicFormPatch(getData: any) {
    this.productMasterForm.patchValue({
      product_name: getData?.product_master.product_name,
      variant_name: getData?.variant_name,
      product_description: getData?.product_description,
      uom_id: getData?.uom_id,
      mvp: getData?.mvp,
      price_per_unit: getData?.price_per_unit,
      maximum_discount: getData?.maximum_discount,
      average_production_cost: getData?.average_production_cost,
      product_specification: getData?.product_specification
    })
  }
  updateForm(e: any) {
    e.stopPropagation();
    if (this.productMasterForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    let data = this.productMasterForm.value;
    data.id = this.id;
    this._configurationalMasterService.updateProductMasterNew(this.id, data).subscribe((res: any) => {
      this.toast.success("Product Master Updated successfully", "Updated successfully")
      this.router.navigate(['master/configurational-master/product-master']);
    }, (err) => {
      if (err.error.code === 403 || err.error.code === 400) {
        this.toast.error(`${err.error.message}`, "Error Massage");
      } else {
        this.toast.error("Something went wrong please try again", "Error Massage");
      }
    }
    )
  }
  onSubmitForm() {
    let val = this.productMasterForm.value;
    if (this.productMasterForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    this._configurationalMasterService.createProductMaster(val).subscribe((res: any) => {

      this.toast.success("Product Master created successfully", "Created Successfully");
      this.router.navigate(['master/configurational-master/product-master']);
    }, (err) => {

      if (err.error.code === 403 || err.error.code === 400) {
        this.toast.error(`${err.error.message}`, "Error Massage");
      } else {
        this.toast.error("Something went wrong please try again", "Error Massage");
      }
    }
    )
  }
  getuniqueNumber() {
    this.emp_master.getUniqueNumber().subscribe((res: any) => {
      this.uniquedata = res.data;
      this.productMasterForm.patchValue({
        request_no: this.uniquedata
      });
      this.productMasterForm?.controls['request_no']?.disable();
    })
  }
}


