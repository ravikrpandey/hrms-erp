import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-subcategory-view',
  templateUrl: './subcategory-view.component.html',
  styleUrls: ['./subcategory-view.component.scss'],
})
export class SubcategoryViewComponent {
  imageToUpload: any;
  imagePath: any;
  editDocData: any;
  createPrItemForm: FormGroup;
  id: any;
  singleItem: any;
  createdata: any;
  getCat_data: any;
  getUom_data: any;
  MASTER_ITEM_SPECIFICATIONs: any[] = [];
  itemtypeData: any = [];
  dynamicFields: any = [];

  constructor(
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private prService: PurchaseRequestService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    private route: Router,
    private $common: CommonService
  ) {
    this.createPrItemForm = this.fb.group({
      item_type_id: new FormControl(null, [Validators.required]),
      asset_id: new FormControl(null, [Validators.required]),
      item_name: new FormControl(null, [Validators.required]),
      item_code: new FormControl(null, [Validators.required]),
      uom_id: new FormControl(null, [Validators.required]),
      manage_by: new FormControl(null, [Validators.required]),
      minimum_level: new FormControl(0),
      maximum_level: new FormControl(0),
      // cgst: new FormControl(null),
      // sgst: new FormControl(null),
      igst: new FormControl(null),
      MVP: new FormControl(null, [Validators.required]),
      usage_details: new FormControl(null, [Validators.required]),
      customerDetail: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required]),
    });
  }

  get CF_1(): any {
    return this.createPrItemForm.controls;
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.item_id;
    });

    this.getItemType();
    this.getAllUsesData();
    this.getAllCustomerType();

    this._configurationalMasterService
      .getAssetMasterList()
      .subscribe((res: any) => {
        this.getCat_data = res.data;
      });
    this._configurationalMasterService.getUOMList().subscribe((res: any) => {
      this.getUom_data = res.data;
    });
    this.getItemMasterById();
  }

  itemType: any = [];

  getItemType() {
    this._configurationalMasterService.getItemType().subscribe(
      (res: any) => {
        if (res.data) {
          this.itemType = res.data;
        }
      },
      (err: any) => {
        console.log(err.error.message);
      }
    );
  }

  getAllUsages: any = [];
  getAllUsesData() {
    this._configurationalMasterService
      .getAllUsesData()
      .subscribe((res: any) => {
        this.getAllUsages = res.data;
      });
  }
  customerType: any = [];
  getAllCustomerType() {
    this._configurationalMasterService
      .getAllCustomer()
      .subscribe((res: any) => {
        this.customerType = res.data;
      });
  }

  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }

  isImage(uploadDoc: any): boolean {
    // Check if the file has an image extension

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = this.getFileExtension(uploadDoc);

    return imageExtensions.includes(extension.toLowerCase());
  }

  generateFileUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }

  getFileName(uploadDoc: any): string {
    // Extract and return the file name from the path
    const pathParts = uploadDoc?.split('/');
    return pathParts[pathParts.length - 1];
  }

  getFileExtension(filename: string | null | undefined): string {
    if (!filename) {
      return '';
    }

    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  getItemMasterById() {
    this._configurationalMasterService
      .getByIdItemMaster(this.id)
      .subscribe((res: any) => {
        this.singleItem = res.data;
        this.imagePath = this.singleItem.ITEM_IMAGE_DOCUMENTs.map(
          (item: any) => {
            return `${environment.servralUrl}/${item.image.replace('\\', '/')}`;
          }
        );
        this.basicFormPatch(this.singleItem);
        const custData = this.singleItem.customerTypeData.map(
          (item: { id: any }) => item.id
        );
        this.createPrItemForm.patchValue({
          customerDetail: custData,
        });
        const usageDetails =
          typeof this.singleItem?.usage_details === 'string'
            ? this.singleItem.usage_details
                .split(',')
                .map((item: string) => parseInt(item.trim(), 10))
                .filter(Number.isInteger)
            : Array.isArray(this.singleItem?.usage_details)
            ? this.singleItem.usage_details
                .map((item: string) => parseInt(item, 10))
                .filter(Number.isInteger)
            : [];
        this.createPrItemForm.patchValue({ usage_details: usageDetails });
        this.singleItem.customerTypeData.forEach((customerType: any) => {
          const controlName = customerType.customer_type_name;
          this.dynamicFields.push({
            lavel: customerType.customer_type_name,
            customer_type_name: controlName,
            amount: customerType.amount || '',
          });

          if (!this.createPrItemForm.contains(controlName)) {
            this.createPrItemForm.addControl(
              controlName,
              new FormControl('', Validators.required)
            );
          }
        });

        const customerDetails: any = {};

        this.dynamicFields.forEach((field: any) => {
          customerDetails[field.customer_type_name] = field.amount;
        });
        this.createPrItemForm.patchValue(customerDetails);
      });
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
  basicFormPatch(singleItem: any) {
    let data = {
      item_type_id: this.singleItem?.item_type_id,
      asset_id: this.singleItem?.asset_id,
      item_name: this.singleItem?.item_name,
      item_code: this.singleItem?.item_code,
      uom_id: this.singleItem?.uom_id,
      manage_by: this.singleItem?.manage_by,
      minimum_level: this.singleItem?.minimum_level,
      maximum_level: this.singleItem?.maximum_level,
      // cgst: this.singleItem?.cgst,
      // sgst: this.singleItem?.sgst,
      igst: this.singleItem?.igst,
      MVP: this.singleItem?.MVP,
    };
    this.createPrItemForm.patchValue(data);
  }
  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: environment.servralUrl + '/' + path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: '#858586',
          confirmButtonText: 'Ok',
        });
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: '#858586',
        confirmButtonText: 'Ok',
      });
    }
  }

  onChange(e: any) {
    let isValidExtension = this.$common.checkForValidFile(e, false, false);
    if (!isValidExtension) {
      return;
      this.createPrItemForm.patchValue({
        image: null,
      });
    }
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
  }
  selectedCustomerTypes: any[] = [];

  onSelectionChange(event: any, i: any) {
    const index = this.selectedCustomerTypes.findIndex(
      (pl: any) => pl.id === event.id
    );
    if (index !== -1) {
      this.selectedCustomerTypes.splice(index, 1);
    } else {
      this.selectedCustomerTypes.push(event);
    }
    this.dynamicFields = [];
    this.selectedCustomerTypes.forEach((customerType: any) => {
      const controlName = customerType.customer_type_name;
      this.dynamicFields.push({
        lavel: customerType.customer_type_name,
        customer_type_name: controlName,
      });
      if (!this.createPrItemForm.contains(controlName)) {
        this.createPrItemForm.addControl(
          controlName,
          new FormControl('', Validators.required)
        );
      }
    });
  }
}
