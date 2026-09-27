import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pr-item-view',
  templateUrl: './pr-item-view.component.html',
  styleUrls: ['./pr-item-view.component.scss']
})
export class PrItemViewComponent {
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
    private route: Router
  ) {
    this.createPrItemForm = this.fb.group({
      item_name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      threshold_stock: new FormControl(null, [Validators.required]),
      MVP: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required]),
      asset_id: new FormControl(null, [Validators.required]),
      Bar_QR_Code: new FormControl(null, [Validators.required]),
      manage_by: new FormControl(null, [Validators.required]),
      uom_id: new FormControl(null, [Validators.required]),
      itemSpecification: new FormArray([
        new FormGroup({
          specificationType: new FormControl(null, [Validators.required]),
          specificationDetails: new FormControl(null, [Validators.required]),
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
          asset_id: this.singleItem?.asset_category.asset_category_name,
          uom_id: this.singleItem?.tbl_uom.uom_name,
          description: this.singleItem?.description,
          threshold_stock: this.singleItem?.threshold_stock,
          Bar_QR_Code: this.singleItem?.Bar_QR_Code == "ACTIVE"?"YES":"NO",
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
      });
    }
    this._configurationalMasterService.getAssetMasterList().subscribe((res: any) => {
      this.getCat_data = res.data;
    })
    this._configurationalMasterService.getUOMList().subscribe((res: any) => {
      this.getUom_data = res.data;
    })

  }

  generateImageUrl(uploadDoc: any): string {
    const serverUrl = environment.serverUrl;
    return `${serverUrl}/${uploadDoc}`;
  }

  isImage(uploadDoc: any): boolean {
    // Check if the file has an image extension
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = this.getFileExtension(uploadDoc);
    
    return imageExtensions.includes(extension.toLowerCase());
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
    const parts = filename.split('.');
    return parts[parts.length - 1];
 }
  seePreview(path: string) {
      if (path) {
        Swal.fire({
          imageUrl: environment.serverUrl+'/'+path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonColor: "#5d6c7c",
          confirmButtonText: 'Ok',
        })
      }
  };
}
