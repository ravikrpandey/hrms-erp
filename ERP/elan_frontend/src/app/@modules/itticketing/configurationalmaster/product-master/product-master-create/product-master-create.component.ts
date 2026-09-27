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
import { CommonService } from 'src/app/@shared/services/common.service';
import Swal from 'sweetalert2';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && typeof control.value === 'string' && control.value.trimLeft() !== control.value) {
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
  getProductCat_data: any[] = [];
  getsubCat_data: any[] = [];
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
  hsnCodeList:any = [];
  checkData: any;
  showDropdown: boolean = false;
  productCtrl = new FormControl();
  filteredProducts: Observable<any[]>;
  products: any[] = [];
  image: any;
  readable: boolean = false;
  imageToUpload: any;
  imagePath: any;
  singlePrData: any;
  role: any;
  loginUser: any;
  entityId: string | null;
  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private locatin: Location,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private location: Location,
    private $common: CommonService,
  ) {
    // productMasterForm
    this.productMasterForm = this.fb.group({
      product_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      // product_code: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      // product_description: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      uom_id: new FormControl(null, [Validators.required]),
      product_model: new FormControl(null, [Validators.required, positiveValidator()]),
      product_rating: new FormControl(null, [positiveValidator()]),
      product_spv_wattage: new FormControl(null),
      product_warranty: new FormControl(null, [positiveValidator()]),
      product_spv_voc: new FormControl(null),
      product_list_price: new FormControl(null, [Validators.required, positiveValidator()]),
      product_mrp: new FormControl(null, [Validators.required, positiveValidator()]),
      product_length: new FormControl(null, [positiveValidator()]),
      product_breadth: new FormControl(null, [positiveValidator()]),
      product_height: new FormControl(null, [positiveValidator()]),
      product_weight: new FormControl(null, [positiveValidator()]),
      product_category_id: new FormControl(null, [Validators.required, positiveValidator()]),
      // product_subcategory_id: new FormControl(null, [Validators.required, positiveValidator()]),
      product_series: new FormControl(null, [Validators.required, positiveValidator()]),
      product_specification: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      varient_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      capacity: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      maximum_discount: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      product_image: new FormControl(null),
      product_description: new FormControl(null),
      entity_id: new FormControl(null),
      hsn_code_id:new FormControl(null),
      igst:new FormControl(null)
    })
  }
  ngOnInit(): void {
    var empData: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(empData);
    this.entityId = localStorage.getItem('selectedEntityId');

    this.activetedRoute.queryParams.subscribe((param: any) => {
      this.parm = param;
      this.id = param.id;
      this.role = param?.role;
      if (this.role == 'view') {
        this.readable = true;
      } else {
        this.readable = false;
      }
    })
    this.getAllProduct();
    this.getAssginSingle();
    if (this.id) {
      this.getByIdUse();

    }
    this.AutoGenerateRequestNo()
    this._empRegistration.grtEmployeeList(this.entityId,this.loginUser?.role).subscribe((res: any) => {
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
    this._configurationalMasterService.getAllActiveCategory(this.entityId).subscribe((res: any) => {
      this.getProductCat_data = res.data;
    })
    if (!this.id) {
      this.getuniqueNumber();
    }
    this.getHsnCode()
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
  getHsnCode() {
    this._configurationalMasterService.getHsnCode(this.entityId).subscribe((res: any) => {
    this.hsnCodeList = res.data;
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
    this._configurationalMasterService.getProductById(this.id).subscribe((res: any) => {
      this.getData = res.data;
      console.log(this.getData.product_image);

      this.basicFormPatch(this.getData)
      this.productMasterForm.patchValue({
        product_image: this.getData.product_image
      })
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

  uploadDoc(evemt: any) {
    try {
      const formData = new FormData();
      let uploadedFileType = evemt.target.files[0].type.split('/').pop().toLowerCase();
      let isValidExtension = this.$common.checkForValidFile(evemt, false);
      if (!isValidExtension) return this.productMasterForm.value.file.setValue(null)
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
        const data: FileList = evemt.target.files;
        this.imageToUpload = data.item(0) || null;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePath = uploadedFileType == 'pdf' ? "/assets/icons/pdfimg.png" : e.target.result
        };
        reader.readAsDataURL(this.imageToUpload);
      }
      this._configurationalMasterService.uploadDocuments(formData).subscribe((response: any) => {
        if (response) {
          this.image = response?.url;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }

  }
  // onChange(e: any) {
  //   let uploadedFileType = e.target.files[0].type.split('/').pop().toLowerCase();
  //   let isValidExtension = this.$common.checkForValidFile(e, false);
  //   if (!isValidExtension) return this.productMasterForm.value.file.setValue(null)
  //   if (e.target.files && e.target.files[0]) {
  //     const data: FileList = e.target.files;
  //     this.imageToUpload = data.item(0) || null;

  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.imagePath = uploadedFileType == 'pdf' ? "/assets/icons/pdfimg.png" : e.target.result
  //     };
  //     reader.readAsDataURL(this.imageToUpload);
  //   }

  // }
  seePreview(path: string, imagePath: any) {
    console.log(path);
    console.log(imagePath);

    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: '#063178',
          confirmButtonText: 'Ok',
        });
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: '#063178',
        confirmButtonText: 'Ok',
      });
    }
  }
  basicFormPatch(getData: any) {
    
    this.getSubcatbycatid(getData.product_category_id)
    this.productMasterForm.patchValue({
      product_name: getData?.product_name,
      // product_code: getData?.product_code,
      uom_id: getData?.uom_id,
      product_series: getData?.product_series,
      capacity: getData?.capacity,
      product_model: getData?.product_model,
      maximum_discount: getData?.maximum_discount,
      product_rating: getData?.product_rating,
      product_spv_wattage: getData?.product_spv_wattage,
      product_warranty: getData?.product_warranty,
      product_spv_voc: getData?.product_spv_voc,
      product_list_price: getData?.product_list_price,
      product_mrp: getData?.product_mrp,
      product_length: getData?.product_length,
      product_breadth: getData?.product_breadth,
      product_height: getData?.product_height,
      product_weight: getData?.product_weight,
      // product_image:getData?.product_image,
      product_category_id: getData?.product_category_id,
      // product_subcategory_id: getData?.product_subcategory_id,
      product_specification: getData?.product_specification,
      product_description: getData?.product_description,
      varient_name: getData?.MASTER_PRODUCT_VARIANT?.variant_name,
      hsn_code_id:getData?.hsn_code_id,
      igst:getData?.igst

    });
  }
  updateForm(e: any) {
    e.stopPropagation();
    let val = this.productMasterForm.value;
    console.log(val);
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
    val.product_image = this.image;
    val.entity_id=this.entityId;
    console.log(val);
    if (this.productMasterForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    if (this.id) {
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
    else {
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

  getSubcatbycatid(e: any) {
    this._configurationalMasterService.getAllActiveSubCategory(e).subscribe((res: any) => {
      this.getsubCat_data = res.data;
    })
  }
  allProduuct:any=[];
  getAllVariant:any=[];
  getAllProductbycat_id(event:any){
    this._configurationalMasterService.getProductBycat_Id(event.value).subscribe((res:any)=>{
      if(res){
        this.allProduuct=res.data;
      }
    },(err:any)=>{

    })
  }

  onOptionSelected(event: any) {
    let data=this.allProduuct.filter((res:any)=>res.product_name==event.option.value);
     this._configurationalMasterService.getProductVariantByproduct_id(data[0]?.id).subscribe((res:any)=>{
          if(res){
            this.getAllVariant=res.data;
          }
     },(err:any)=>{

     })
  }

  onVariantSelected(event:any){

  }
  onHSNCodeChange(data:any){
    this.productMasterForm.get('igst')?.patchValue(data?.value);
    }
}


