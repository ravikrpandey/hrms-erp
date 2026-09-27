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
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branding-master-create',
  templateUrl: './branding-master-create.component.html',
  styleUrls: ['./branding-master-create.component.scss']
})
export class BrandingMasterCreateComponent {
  environment = environment;
  createPrItemForm: FormGroup;
  brandingForm: FormGroup;
  id: any;
  action_type: any;
  data: any = [];
  response: any = null;
  financial_year_id: string | null;
  imagePath: string[];
  imageToUpload: File[];
  singleItem: any;
  uomList: any=[];
  existingFiles: string[] = [];
  newFiles: File[] = [];
  previewUrls: string[] = [];
  maxFiles = 6;
  entity_id:any;
  hsnCodeList:any[]=[];
  userLoginId: any;
  loginUser: any;
  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    public $common: CommonService,
    private salesService: SalesService,
    private route: Router
  ) {
    this.brandingForm = this.fb.group({
      type_of_branding: new FormControl(null, [Validators.required]),
      branding_sides: new FormControl(null, [Validators.required]),
      price_per_unit: new FormControl(null, [Validators.required]),
      hsn_code_id: new FormControl(null, [Validators.required]),  
      gst: new FormControl(null, [Validators.required,  Validators.min(0), Validators.max(100)]), 
      image: new FormControl([]),
      uom_id: new FormControl(null, [Validators.required]),
      customer_name: new FormControl(null),
      item_id: new FormControl(null, [Validators.required])
    });

  }

  ngOnInit() {
     this.financial_year_id = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem('selectedEntityId');

    let a: any = localStorage.getItem('signInUser');
    this.userLoginId = localStorage.getItem('EmpMainId');
  
    this.loginUser = JSON.parse(a);
    this.getAllExistingClient();
    this.getsItemList();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.action_type = params.action_type;
    });

    this.getHSNCodeList(this.entity_id)
    
    // Call UOM List API
    this._configurationalMasterService.getActiveUOMList().subscribe((res: any) => {
      this.uomList = res.data;
    });

    // if (this.id) {
    //   this.getBrandingById(this.id);
    // }
  }

  searchListHSN: any;
  getHSNCodeList(id:any){
    this._configurationalMasterService.getHSNCode(id).subscribe((res:any)=>{
      this.hsnCodeList = res?.data;
      this.searchListHSN = this.hsnCodeList.map((value: any) => value.hsn_sac_code);
      if (this.id) {
        this.getBrandingById(this.id);
      }
    })
  }

  searchFilterHSN(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList.filter((item: any) =>
      aa.includes(item.hsn_sac_code)
    );
    this.hsnCodeList = filteredVariable;
  }

  onHSNCodeChange(data:any){
  this.brandingForm.get('gst')?.patchValue(data?.value);

  this.hsnCodeList?.find((name:any)=>{
    if(data?.value){
  this.brandingForm.get('hsn_name')?.patchValue(name?.hsn_sac_code);
      
    }
  })

  }
  allowOnlyNumber(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  allowDecimalNumber(event: KeyboardEvent) {
  const pattern = /^[0-9]*\.?[0-9]*$/;
  const inputChar = String.fromCharCode(event.charCode);

  if (!pattern.test((event.target as HTMLInputElement).value + inputChar)) {
    event.preventDefault();
  }
}


  getBrandingById(id: any) {
    this._configurationalMasterService.getById_brandingMaster(id).subscribe(
      (res: any) => {
        if (res.code === 200 && res.data) {
          const brandingData = res.data;

          const getGST = this.hsnCodeList.find(a => a.id === brandingData.hsn_code_id)?.value;

          this.brandingForm.patchValue({
            type_of_branding: brandingData.type_of_branding,
            price_per_unit: brandingData.price_per_unit,
            gst: getGST,//brandingData.gst,
            hsn_code_id: brandingData.hsn_code_id,
            branding_sides: brandingData.branding_sides || [],
            uom_id: brandingData.uom_id,
            customer_name:brandingData.customer_id,
            item_id:brandingData.item_id
          });

          if (brandingData.image && brandingData.image.length > 0) {
            this.existingFiles = brandingData.image.map((img: string) =>
              this.generateImageUrl(img)
            );
          }
        }
      },
      (err: any) => {
        this.toaster.error(err.error.message || "Failed to fetch data");
      }
    );
  }


  /*FOR FILE/IMAGE*/
  onChange(e: any) {
    let isValidExtension = this.$common.checkForValidFile(e, false, true);
    if (!isValidExtension) return;

    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles: FileList = e.target.files;

      if (
        this.existingFiles.length +
        this.newFiles.length +
        selectedFiles.length >
        this.maxFiles
      ) {
        this.toaster.error("Maximum 6 images/files allowed!");
        return;
      }

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        this.newFiles.push(file);

        const reader = new FileReader();
        reader.onload = (ev: any) => {
          this.previewUrls.push(ev.target.result);
        };
        reader.readAsDataURL(file);
      }

      this.brandingForm.patchValue({ image: this.newFiles });
    }
  }

  removeExistingFile(index: number) {
    this.existingFiles.splice(index, 1);
  }

  removeNewFile(index: number) {
    this.newFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }


  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }


  isImage(file: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    return imageExtensions.includes(this.getFileExtension(file));
  }

  generateFileUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }

  getFileName(uploadDoc: any): string {
    const pathParts = uploadDoc.split('/');
    return pathParts[pathParts.length - 1];
  }

  getFileExtension(filename: string): string {
    const parts = filename?.split('.');
    if (parts) {
      return parts[parts.length - 1];
    }
    return '';
  }


  seePreview(image: string) {
    const fileUrl = image.startsWith('http') ? image : `${environment.servralUrl}/${image}`;
    const ext = this.getFileExtension(image);

    const extension = this.getFileExtension(fileUrl).toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      Swal.fire({
        imageUrl: fileUrl,
        imageHeight: 450,
        imageAlt: 'Preview',
        confirmButtonColor: '#858586',
        confirmButtonText: 'Ok',
      });
    } else {
      window.open(fileUrl, '_blank');      
    }
  }

  onSubmit() {
    if (this.brandingForm.invalid) {
      this.toaster.error("Required fields should not be empty", "Fields Error");
      return;
    }

    const formData = new FormData();
    formData.append("type_of_branding", this.brandingForm.value.type_of_branding);
    formData.append("price_per_unit", this.brandingForm.value.price_per_unit);
    formData.append("hsn_code_id", this.brandingForm.value.hsn_code_id);
    formData.append("gst", this.brandingForm.value.gst);
    formData.append("uom_id", this.brandingForm.value.uom_id);
    formData.append("customer_name", this.brandingForm.value.customer_name);
    formData.append("item_id", this.brandingForm.value.item_id);
    this.brandingForm.value.branding_sides.forEach((side: string) => {
      formData.append("branding_sides[]", side);
    });


    this.existingFiles.forEach((file) => {
      formData.append("existing_files[]", this.getFileName(file));
    });


    if (this.newFiles.length > 0) {
      this.newFiles.forEach((file: File) => {
        formData.append("image", file, file.name);
      });
    }


    if (this.id) {
      this._configurationalMasterService
        .updateBrandingMaster(this.id, formData)
        .subscribe(
          (res: any) => {
            this.toaster.success(res.message);
            this.route.navigate([
              "master/configurational-master/branding-master",
            ]);
          },
          (err) => this.toaster.error(err.error.message)
        );
    } else {
      this._configurationalMasterService
        .createBrandingMaster(formData)
        .subscribe(
          (res: any) => {
            if (res.code == 201) {
              this.toaster.success(res.message);
              this.route.navigate([
                "master/configurational-master/branding-master",
              ]);
            }
          },
          (err) => this.toaster.error(err.error.message)
        );
    }
  }

  onBack = () => {
    this.route.navigate(['master/configurational-master/branding-master']);
  }


  getAllExistingClient() {
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      employee_id: this.userLoginId,
      userRole: this.loginUser?.role,
      status: 'Quotation',
    };
    this.salesService.getAllCustomersList(data).subscribe((res: any) => {
      if (res) {        
        this.customersName = res.data;  
        this.customerList = this.customersName.map((res: any) => res.company_name);
        this.customerList2 = this.customersName;
        }
      });
  }
  getsItemList() {  

  
      // let data = {
      //   page: this.pageNo,
      //   pageSize: this.pageSize,
      //   search: this.searchText,
      // };
      this._configurationalMasterService
        .getAllActiveItem()
        .subscribe((res: any) => {
          this.itemList3 = res.data;  
        this.itemList = this.itemList3.map((res: any) => res.item_name);
        this.itemList2 = this.itemList3;
          // setTimeout(() => {
          //   if (this.gridParams) {
          //     this.gridParams.successCallback(rows, totalRows);
          //   }
          // });
        });
    
   
  }
  customersName: any;
  customerList: any = [];
  customerList2: any = [];
  customersFilter(event: any) {
    const aa = event
    let filteredVariable = this.customerList2.filter((item: any) => aa.includes(item.company_name));
    this.customersName = filteredVariable

  }
  itemList3: any;
  itemList: any = [];
  itemList2: any = [];
  itemFilter(event: any) {
    const aa = event
    let filteredVariable = this.itemList2.filter((item: any) => aa.includes(item.item_name));
    this.itemList3 = filteredVariable

  }


}
