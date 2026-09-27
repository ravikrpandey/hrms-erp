import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-pr-item-create',
  templateUrl: './pr-item-create.component.html',
  styleUrls: ['./pr-item-create.component.scss']
})
export class PrItemCreateComponent {
  imageToUpload: any;
  imagePath: any;
  editDocData: any
  createPrItemForm: FormGroup;
  id: any;
  singleItem: any;
  createdata: any;
  getCat_data: any;
  getUom_data: any;

  constructor(private fb: FormBuilder, private _configurationalMasterService: ConfigurationalmasterService, private prService: PurchaseRequestService, private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    private $common: CommonService,
    private route: Router
  ) {
    this.createPrItemForm = this.fb.group({
      item_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      description: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      threshold_stock: new FormControl(null, [Validators.required]),
      MVP: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required]),
      asset_id: new FormControl(null, [Validators.required]),
      Bar_QR_Code: new FormControl(null, [Validators.required]),
      manage_by: new FormControl(null, [Validators.required]),
      uom_id: new FormControl(null, [Validators.required]),
      itemSpecification: new FormArray([
        new FormGroup({
          specificationType: new FormControl(null),
          specificationDetails: new FormControl(null),
        }),
      ]),
    })
  }
  get CF_1(): any { return this.createPrItemForm.controls };

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.item_id;

    });
    if (this.id) {
      this.CF_1['image'].setErrors(null);
      while (this.CF_1.itemSpecification.length > 0) {
        this.CF_1.itemSpecification.removeAt(0);
      }
      this._configurationalMasterService.getByIdItemMaster(this.id).subscribe((res: any) => {
        this.singleItem = res.data;
        this.CF_1['image'].setErrors(null);
        this.createPrItemForm.patchValue({
          item_name: this.singleItem?.item_name,
          MVP: this.singleItem?.MVP,
          asset_id: this.singleItem?.asset_id,
          uom_id: this.singleItem?.uom_id,
          description: this.singleItem?.description,
          threshold_stock: this.singleItem?.threshold_stock,
          Bar_QR_Code: this.singleItem?.Bar_QR_Code,
          manage_by: this.singleItem?.manage_by,
          itemSpecification: this.singleItem?.itemSpecifications,
          // image: this.singleItem?.image, 
        })
        const itemSpecArray = this.createPrItemForm.get('itemSpecification') as FormArray;
        this.singleItem?.itemSpecifications.forEach((itemSpec: any) => {
          const newRow = this.fb.group({
            specificationType: itemSpec.specificationType,
            specificationDetails: itemSpec.specificationDetails,
          });
          itemSpecArray.push(newRow);
        });
      })
    }
    this._configurationalMasterService.getActiveAssetMasterList().subscribe((res: any) => {
      this.getCat_data = res.data;
    })
    this._configurationalMasterService.getActiveUOMList().subscribe((res: any) => {
      this.getUom_data = res.data;
    })

  }

  onChange(e: any) {
    let isValidExtension = this.$common.checkForValidFile(e,false,false);
    if (!isValidExtension){ 
      return 
        this.createPrItemForm.patchValue({
        image: null
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

  generateImageUrl(uploadDoc: any): string {
    const serverUrl = environment.serverUrl;
    return `${serverUrl}/${uploadDoc}`;
  }

  isImage(uploadDoc: any): boolean {
    // Check if the file has an image extension
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = this.getFileExtension(uploadDoc).toLowerCase();
    
    // return imageExtensions.includes(extension.toLowerCase());
    if (imageExtensions.includes(extension)) {
        return true;
    } else {
        return false;
    }
 }

 generateFileUrl(uploadDoc: any): string {
    const serverUrl = environment.serverUrl;
    return `${serverUrl}/${uploadDoc}`;
 }

 getFileName(uploadDoc: any): string {
    // Extract and return the file name from the path
    const pathParts = uploadDoc.split('/');
    return pathParts[pathParts.length - 1];
 }

 getFileExtension(filename: string): string {
  // Extract and return the file extension from the filename
  
  const parts = filename?.split('.');

    if ( parts ){
    return parts[parts.length - 1];
    }
    return "";
 }
  // seePreview(path: string) {
  //     if (path) {
  //       Swal.fire({
  //         imageUrl: environment.serverUrl+'/'+path,
  //         imageHeight: 250,
  //         imageAlt: 'Uploaded Document',
  //         confirmButtonColor: "#5d6c7c",
  //         confirmButtonText: 'Ok',
  //       })
  //     }
  // };
  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: environment.serverUrl+'/'+path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: "#5d6c7c",
          confirmButtonText: 'Ok',
        })
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: "#5d6c7c",
        confirmButtonText: 'Ok',
      })
    }
  };

  addrow() {
    const itemSpecificationArray = this.CF_1.itemSpecification as FormArray;
    const newRow = this.fb.group({
      specificationType: new FormControl(null, [Validators.required]),
      specificationDetails: new FormControl(null, [Validators.required]),
    });

    itemSpecificationArray.push(newRow);
  }

  deleteRow(i: any) {
    if (this.CF_1.itemSpecification.length >= 1) {
      this.CF_1.itemSpecification.removeAt(i);
    } else {
      this.toaster.error('must be one', "Can't Deleted!");
    }
  }

  onSubmit() {
    if (!this.isImage(this.createPrItemForm?.get('image')?.value)){
      this.toaster.error('Invalid File Format', 'Fields Error');
      return;
    }
    if (this.createPrItemForm.invalid) {
      this.toaster.error('Required fields should not be empty', 'Fields Error');
      return;
    }
    // let asset_category_name:any
    let val = this.createPrItemForm.value;
    // this.getCat_data.forEach((res:any) => {
    //   if(res.asset_id  == val.asset_id){
    //     asset_category_name = res.asset_category
    //   }
    // });
    const formData = new FormData();
    formData.append('item_name', val.item_name);
    formData.append('MVP', val.MVP);
    formData.append('image', this.imageToUpload);
    formData.append('asset_id', val.asset_id);
    formData.append('uom_id', val.uom_id);
    formData.append(`Bar_QR_Code`, val.Bar_QR_Code);
    formData.append(`manage_by`, val.manage_by);
    formData.append(`description`, val.description);
    formData.append(`threshold_stock`, val.threshold_stock);
    formData.append('itemSpecification', JSON.stringify(val.itemSpecification));

    if (this.id) {

      this._configurationalMasterService.updatItemMaster(this.id, formData).subscribe((res: any) => {

        this.toaster.success(res.message)
        this.route.navigate(['master/configurational-master/pr-item'])
      }, err => {
        this.toaster.error(err.error.message)
      })
    } else {

      this._configurationalMasterService.createItem(formData).subscribe((res: any) => {
        this.createdata = res.data
        if (res.code == 200) {
          this.toaster.success(res.message)
          this.route.navigate(['master/configurational-master/pr-item'])

        }
      }, err => {
        this.toaster.error(err.error.message)
      })
    }


  }

}
