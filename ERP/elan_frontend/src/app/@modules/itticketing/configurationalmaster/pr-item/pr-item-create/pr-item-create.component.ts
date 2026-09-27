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
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pr-item-create',
  templateUrl: './pr-item-create.component.html',
  styleUrls: ['./pr-item-create.component.scss'],
})
export class PrItemCreateComponent {
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
  entity_id: any;
  itemType: any = [];
  getCat_data2: any;
  itemCategoryList: any;
  getUom_data2: any;
  uomList: any;
  itemType2: any;
  itemTypeList: any;
  status: any;
  items: any;
  action_type: any;
  financial_year_id: any;
  subCategoryList: any;
  colors = [
    'MediumVioletRed',
    'DeepPink',
    'PaleVioletRed',
    'HotPink',
    'LightPink',
    'Pink',
    'DarkRed',
    'Red',
    'Firebrick',
    'Crimson',
    'IndianRed',
    'LightCoral',
    'Salmon',
    'DarkSalmon',
    'LightSalmon',
    'OrangeRed',
    'Tomato',
    'DarkOrange',
    'Coral',
    'Orange',
    'DarkKhaki',
    'Gold',
    'Khaki',
    'PeachPuff',
    'Yellow',
    'PaleGoldenrod',
    'Moccasin',
    'PapayaWhip',
    'LightGoldenrodYellow',
    'LemonChiffon',
    'LightYellow',
    'Maroon',
    'Brown',
    'SaddleBrown',
    'Sienna',
    'Chocolate',
    'DarkGoldenrod',
    'Peru',
    'RosyBrown',
    'Goldenrod',
    'SandyBrown',
    'Tan',
    'Burlywood',
    'Wheat',
    'NavajoWhite',
    'Bisque',
    'BlanchedAlmond',
    'Cornsilk',
    'DarkGreen',
    'Green',
    'DarkOliveGreen',
    'ForestGreen',
    'SeaGreen',
    'Olive',
    'OliveDrab',
    'MediumSeaGreen',
    'LimeGreen',
    'Lime',
    'SpringGreen',
    'MediumSpringGreen',
    'DarkSeaGreen',
    'MediumAquamarine',
    'YellowGreen',
    'LawnGreen',
    'Chartreuse',
    'LightGreen',
    'GreenYellow',
    'PaleGreen',
    'Teal',
    'DarkCyan',
    'LightSeaGreen',
    'CadelBlue',
    'DarkTurquoise',
    'MediumTurquoise',
    'Turquoise',
    'Aqua',
    'Cyan',
    'AquaMarine',
    'PaleTurquoise',
    'LightCyan',
    'Navy',
    'DarkBlue',
    'MediumBlue',
    'Blue',
    'MidnightBlue',
    'RoyalBlue',
    'SteelBlue',
    'DodgerBlue',
    'DeepSkyBlue',
    'CornFlowerBlue',
    'SkyBlue',
    'LightSkyBlue',
    'LightSteelBlue',
    'LightBlue',
    'PowderBlue',
    'Indigo',
    'Purple',
    'DarkMagenta',
    'DarkViolet',
    'DarkSlateBlue',
    'BlueViolet',
    'DarkOrchid',
    'Fuchsia',
    'Magenta',
    'SlateBlue',
    'MediumSlateBlue',
    'MediumOrchid',
    'MediumPurple',
    'Orchid',
    'Violet',
    'Plum',
    'Thistle',
    'Lavender',
    'MistyRose',
    'AntiqueWhite',
    'Linen',
    'Beige',
    'WhiteSmoke',
    'LavenderBlush',
    'OldLace',
    'AliceBlue',
    'Seashell',
    'GhostWhite',
    'Honeydew',
    'ForalWhite',
    'Azure',
    'MintCream',
    'Snow',
    'Ivory',
    'White',
    'Black',
    'DarkSlateGray',
    'DimGray',
    'SlateGrey',
    'Gray',
    'LightSlateGray',
    'DarkGray',
    'Silver',
    'LightGray',
    'Gainsboro',
  ];
  controls: any;

  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    public $common: CommonService,
    private route: Router,
  ) {
    this.createPrItemForm = this.fb.group({
      item_type_id: new FormControl(null, [Validators.required]),
      asset_id: new FormControl(null, [Validators.required]),
      item_name: new FormControl(null, [Validators.required]),
      item_code: new FormControl(null, [Validators.required]),
      uom_id: new FormControl(null, [Validators.required]),
      hsn_code_id: new FormControl(null, [Validators.required]),
      manage_by: new FormControl(null, [Validators.required]),
      MVP: new FormControl(null, [Validators.required]),
      MRP: new FormControl(null, [Validators.required]),
      image: new FormControl([]),
      item_description: new FormControl(null, [Validators.required]),
      color: new FormControl(null, [Validators.required]),
      sub_category_name: new FormControl(null, [Validators.required]),
      sub_category_code: new FormControl(null, [Validators.required]),
      Variant: new FormControl(null, [Validators.required]),
      Item_length_before: new FormControl(null, [Validators.required]),
      Item_width_before: new FormControl(null, [Validators.required]),
      Item_height_before: new FormControl(null, [Validators.required]),
      external_volume_after: new FormControl(null, [Validators.required]),
      external_length_after: new FormControl(null, [Validators.required]),
      external_width_after: new FormControl(null, [Validators.required]),
      external_height_after: new FormControl(null, [Validators.required]),
      item_weight: new FormControl(null, [Validators.required]),
      warranty_applicable: new FormControl(null, [Validators.required]),
      warranty_period: new FormControl(null, [Validators.required]),
    });
  }

  get CF_1(): any {
    return this.createPrItemForm.controls;
  }

  ngOnInit() {
    const item_group_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
    const elan_pro_item_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
    const factory_item_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
    const sub_category_code = btoa(Math.random().toString())
      .slice(0, 10)
      .toUpperCase();
    const item_code = btoa(Math.random().toString()).slice(0, 10).toUpperCase();
    if (this.action_type != 'view' && this.action_type != 'edit') {
      this.createPrItemForm.patchValue({
        Item_group_code: item_group_code,
        elan_pro_item_code: elan_pro_item_code,
        factory_item_code: factory_item_code,
        sub_category_code: sub_category_code,
        item_code: item_code,
      });
    }
    this.financial_year_id = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem('selectedEntityId');
    if (this.entity_id) {
      this.getItemType();
    }

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.item_id;
      this.action_type = params.action_type;
      if (this.id) this.getItemMasterById();
    });

    this._configurationalMasterService
      .getActiveAssetMasterList()
      .subscribe((res: any) => {
        this.getCat_data = res.data;
        this.getCat_data2 = res.data;
        this.itemCategoryList = this.getCat_data.map(
          (value: any) => value.asset_category_name,
        );
      });
    this._configurationalMasterService
      .getActiveUOMList()
      .subscribe((res: any) => {
        this.getUom_data = res.data;
        this.getUom_data2 = res.data;
        this.uomList = this.getUom_data.map((value: any) => value.uom_name);
      });

    this.createPrItemForm.valueChanges.subscribe(() => {
      this.calculateVolume();
    });

    this.createPrItemForm
      .get('item_type_id')
      ?.valueChanges.subscribe((res: any) => {
        const findType = this.itemType.find((item: any) => item.id === res);
        const isService = findType && findType.itemType === 'Service';
        if (findType && findType.itemType === 'Basket') {
          this.toaster.error('Please Create Basket Item from Basket Master');
        }
        if (findType && findType.itemType === 'Accessory') {
          this.toaster.error(
            'Please Create Accessory Item from Accessory Master',
          );
        }
        if (isService) {
          this.getHSNCodeList(this.entity_id, 'SAC');
        } else {
          this.getHSNCodeList(this.entity_id, 'HSN');
        }
        this.toggleValidators(isService);
      });

      if (this.action_type === 'edit') {
        this.createPrItemForm.get('item_type_id')?.disable({ emitEvent: false });
        this.createPrItemForm.get('manage_by')?.disable({ emitEvent: false });
      }
  }

  toggleValidators(isService: boolean) {
    const fieldsToToggle = [
      'warranty_period',
      'warranty_applicable',
      'item_weight',
      'external_height_after',
      'external_width_after',
      'external_length_after',
      'external_volume_after',
      'Item_height_before',
      'Item_width_before',
      'Item_length_before',
      'Variant',
    ];

    fieldsToToggle.forEach((field) => {
      const control = this.createPrItemForm.get(field);
      if (control) {
        if (isService) {
          control.clearValidators();
        } else {
          control.setValidators([Validators.required]);
        }
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  get isService() {
    return (
      this.itemType?.find(
        (item: any) =>
          item.id === this.createPrItemForm.get('item_type_id')?.value,
      )?.itemType === 'Service'
    );
  }

  calculateVolume() {
    const l = Number(this.createPrItemForm.get('external_length_after')?.value);
    const w = Number(this.createPrItemForm.get('external_width_after')?.value);
    const h = Number(this.createPrItemForm.get('external_height_after')?.value);

    if (l && w && h) {
      // volume in cubic cm
      const volumeCm3 = l * w * h;

      // convert to cubic feet
      const volumeFt3 = volumeCm3 / 28316.8;

      // keep decimal (4 precision)
      const finalVolume = parseFloat(volumeFt3.toFixed(4));

      this.createPrItemForm
        .get('external_volume_after')
        ?.setValue(finalVolume, { emitEvent: false });
    }
  }

  manageBy(event: any) {
    if (event.value == 'S.No. Only') {
      this.createPrItemForm.get('Bar_QR_Code')?.setValue('Yes');
    } else {
      this.createPrItemForm.get('Bar_QR_Code')?.setValue('No');
    }
  }

  onCategorySelect(event: any) {
    this.getItemSubCategory(event.value);
  }

  getItemSubCategory(id: any) {
    this._configurationalMasterService.getSubCategory(id).subscribe(
      (res: any) => {
        this.subCategoryList = res.data;
        if (res.data) {
          this.itemType2 = res.data;
          this.itemTypeList = this.itemType.map((value: any) => value.itemType);
        }
      },
      (err: any) => {
        console.log(err.error.message);
      },
    );
  }

  onItemSelect(event: any) {
    const selectedItem = this.items.find(
      (item: any) => item.id === event.value,
    );

    if (selectedItem) {
      this.createPrItemForm.patchValue({
        item_code: selectedItem.item_code,
      });

      this.createPrItemForm.patchValue({
        Item_group: '',
      });
    }
  }

  uomFilter(e: any) {
    const aa = e;
    let filteredVariable = this.getUom_data2.filter((item: any) =>
      aa.includes(item.uom_name),
    );
    this.getUom_data = filteredVariable;
  }
  getItemType() {
    this._configurationalMasterService.getItemType().subscribe(
      (res: any) => {
        if (res.data) {
          this.itemType = res.data;
          this.itemType2 = res.data;
          this.itemTypeList = this.itemType.map((value: any) => value.itemType);
        }
      },
      (err: any) => {
        console.log(err.error.message);
      },
    );
  }

  itemTypeFilter(e: any) {
    const aa = e;
    let filteredVariable = this.itemType2.filter((item: any) =>
      aa.includes(item.itemType),
    );
    this.itemType = filteredVariable;
  }

  //locked
  onChange(e: any) {
    let isValidExtension = this.$common.checkForValidFile(e, false, false);
    if (!isValidExtension) {
      // Handle invalid extension
      this.createPrItemForm.patchValue({
        image: null,
      });
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      const files: FileList = e.target.files;
      const images: File[] = [];
      const previews: string[] = [];

      // Loop through all selected files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        images.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          previews.push(e.target.result);
          if (previews.length === files.length) {
            this.imagePath = previews;
          }
        };
        reader.readAsDataURL(file);
      }

      this.imageToUpload = images;
      // this.createPrItemForm?.get("image")?.value.patchValue(this.imageToUpload)
    }
  }

  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
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
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }

  getFileName(uploadDoc: any): string {
    // Extract and return the file name from the path
    const pathParts = uploadDoc.split('/');
    return pathParts[pathParts.length - 1];
  }

  getFileExtension(filename: string): string {
    // Extract and return the file extension from the filename
    const parts = filename?.split('.');
    if (parts) {
      return parts[parts.length - 1];
    }
    return '';
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

  itemImgaes: any;
  getItemMasterById() {
    this._configurationalMasterService
      .getByIdItemMaster(this.id)
      .subscribe((res: any) => {
        this.singleItem = res.data;
        this.itemImgaes =
          environment.servralUrl +
          '/' +
          this.singleItem?.MASTER_ITEM_IMAGE_DOCUMENTs[0]?.image;
        this._configurationalMasterService
          .getActiveAssetMasterList()
          .subscribe((res: any) => {
            this.getCat_data = res.data;
            this.getCat_data2 = res.data;
            this.itemCategoryList = this.getCat_data.map(
              (value: any) => value.asset_category_name,
            );

            this._configurationalMasterService
              .fetchSubCategory(
                this.entity_id,
                this.financial_year_id,
                this.singleItem.asset_id,
                { status: this.status },
              )
              .subscribe(
                (res: any) => {
                  this.subCategoryList = res.data;
                  this.createPrItemForm
                    .get('sub_category_name')
                    ?.setValue(this.singleItem.sub_category_id);

                  this._commonService?.hideLoader();
                },
                (err) => {
                  this._commonService?.hideLoader();
                  this.toaster.error(err.error.message);
                },
              );
          });

        this.imagePath = this.singleItem?.ITEM_IMAGE_DOCUMENTs?.map(
          (item: any) => {
            return `${environment.servralUrl}/${item.image.replace('\\', '/')}`;
          },
        );
        this.selectedCustomerTypes = this.singleItem.customerTypeData;
        this.createPrItemForm.get('image')?.setValue(this.imagePath);
        this.basicFormPatch(this.singleItem);
        this.singleItem.MASTER_ITEM_SPECIFICATIONs.forEach((item: any) => {
          const newRow = this.fb.group({
            specificationType: new FormControl(item.specificationType, [
              Validators.required,
            ]),
            specificationDetails: new FormControl(item.specificationDetails, [
              Validators.required,
            ]),
          });
          (this.createPrItemForm.get('itemSpecification') as FormArray).push(
            newRow,
          );
        });

        const custData = this.singleItem?.customerTypeData?.map(
          (item: { id: any }) => item.id,
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
        this.singleItem.customerTypeData?.forEach((customerType: any) => {
          const controlName = customerType.customer_type_name;
          this.dynamicFields.push({
            lavel: customerType.customer_type_name,
            customer_type_name: controlName,
            amount: customerType.amount || '',
          });

          if (!this.createPrItemForm.contains(controlName)) {
            this.createPrItemForm.addControl(
              controlName,
              new FormControl('', Validators.required),
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
      }),
    );
  }

  onSelectionChange2 = (e: any) => {
    this._commonService?.showLoader();
    this._configurationalMasterService
      .fetchSubCategory(this.entity_id, this.financial_year_id, e.value, {
        status: this.status,
      })
      .subscribe(
        (res: any) => {
          this.subCategoryList = res.data;

          this._commonService?.hideLoader();
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        },
      );
  };

  basicFormPatch(singleItem: any) {
    let data = {
      item_type_id: this.singleItem?.item_type_id,
      asset_id: this.singleItem?.asset_id,
      item_name: this.singleItem?.item_name,
      item_code: this.singleItem?.item_code,
      Item_group_code: this.singleItem?.Item_group_code,
      Item_group: this.singleItem?.item_group_id,
      uom_id: this.singleItem?.uom_id,
      hsn_code_id: this.singleItem?.hsn_code_id,
      manage_by: this.singleItem?.manage_by,
      minimum_level: this.singleItem?.minimum_level,
      maximum_discount: this.singleItem?.maximum_discount,
      maximum_level: this.singleItem?.maximum_level,
      Item_length_before: this.singleItem?.Item_length_before,
      Item_width_before: this.singleItem?.Item_width_before,
      Item_height_before: this.singleItem?.Item_height_before,
      external_volume_after: this.singleItem.external_volume_after,
      external_length_after: this.singleItem.external_length_after,
      external_width_after: this.singleItem.external_width_after,
      external_height_after: this.singleItem.external_height_after,
      item_weight: this.singleItem.item_weight,
      // volumetric_weight_air_international: this.singleItem.volumetric_weight_air_international,
      // volumetric_weight_by_sea: this.singleItem.volumetric_weight_by_sea,
      // volumetric_weight_by_road: this.singleItem.volumetric_weight_by_road,
      // volumetric_space: this.singleItem.volumetric_space,
      // default_lead_time_for_sales: this.singleItem.default_lead_time_for_sales,
      // default_lead_time_for_purchase: this.singleItem.default_lead_time_for_purchase,
      // auto_requisition_on_level: this.singleItem.auto_requisition_on_level,
      warranty_applicable: this.singleItem.warranty_applicable,
      warranty_period: this.singleItem.warranty_period,
      Variant: this.singleItem.Variant,
      // item_print_name: this.singleItem.Item_Print_Name,
      item_description: this.singleItem.description,
      //igst: this.singleItem.igst,
      // item_gst: this.getHSNData(this.singleItem?.hsn_code_id),
      MVP: this.singleItem.MVP,
      MRP: this.singleItem.MRP,
      // color: this.singleItem.Color,
      sub_category_id: this.singleItem.sub_category_id,
    };

    this.createPrItemForm.patchValue(data);
    this.toggleValidators(this.isService);
    if (singleItem.manage_by == 'S.No. Only') {
      this.createPrItemForm.get('Bar_QR_Code')?.setValue('Yes');
    } else {
      this.createPrItemForm.get('Bar_QR_Code')?.setValue('No');
    }
  }

  onSubmit() {
    // return;
    // if (this.createPrItemForm.invalid) {
    //   this.toaster.error('Required fields should not be empty', 'Fields Error');
    //   return;
    // }
    // if (!this.imageToUpload && this.action_type != 'edit') {
    //   this.toaster.error('Please Upload File', 'Fields Error');
    //   return;
    // }
    // if (this.areAllSelected()) {
    // } else {
    //   this.toaster.warning('Please Select All Customer Type Price');
    //   return;
    // }

    // let val1 = this.createPrItemForm.value;
    // this.createPrItemForm?.get('cgst')?.patchValue(val1.igst / 2);
    // this.createPrItemForm?.get('sgst')?.patchValue(val1.igst / 2);
    // let val = this.createPrItemForm.value;
    // include Disabled controls
    const val = this.createPrItemForm.getRawValue();

    const mrp = Number(val.MRP);
    const mvp = Number(val.MVP);

    if (!mvp || mvp < 1) {
      this.toaster.error('Minimum Billing Rate should be at least 1');
      return; // stop submit
    }

    if (!mrp || mrp < mvp) {
      this.toaster.error(
        'Maximum Billing Rate should be greater than or equal to Minimum Billing Rate',
      );
      return; // stop submit
    }

    const formData = new FormData();
    formData.append('item_type_id', val.item_type_id);
    formData.append('asset_id', val.asset_id);
    formData.append('item_name', val.item_name);
    formData.append('item_code', val.item_code);
    // formData.append('Item_group_code', val.Item_group_code);
    // formData.append('item_group_id', val.Item_group);
    formData.append(`uom_id`, val.uom_id);
    formData.append(`hsn_code_id`, val.hsn_code_id);
    formData.append(`manage_by`, val.manage_by);
    // formData.append(`minimum_level`, val.minimum_level);
    // formData.append(`maximum_level`, val.maximum_level);
    // formData.append(`cgst`, val.cgst);
    // formData.append(`sgst`, val.sgst);
    // formData.append(`igst`, val.igst);
    formData.append(`MVP`, val.MVP);
    formData.append(`MRP`, val.MRP);
    formData.append(`entity_id`, this.entity_id);
    formData.append(`financial_year_id`, this.financial_year_id);
    // formData.append(`usage_details`, val.usage_details);
    // formData.append(`Bar_QR_Code`, val.Bar_QR_Code);

    // formData.append(`Item_Print_Name`, val.item_print_name);
    formData.append(`description`, val.item_description);
    // formData.append(`Color`, val.color);
    // formData.append(`Elanpro_Item_Code`, val.elan_pro_item_code);
    // formData.append(`Factory_Item_Code`, val.factory_item_code);
    formData.append('Variant', val.Variant);
    formData.append('sub_category_name', val.sub_category_name);
    // formData.append('sub_category_code', val.sub_category_code);
    // formData.append(
    //   'Item_length_before',
    //   typeof val.Item_length_before == 'string' ? null : val.Item_length_before,
    // );
    formData.append('Item_length_before', val.Item_length_before);
    formData.append('Item_width_before', val.Item_width_before);
    formData.append('Item_height_before', val.Item_height_before);
    formData.append('external_volume_after', val.external_volume_after);
    formData.append('external_length_after', val.external_length_after);
    formData.append('external_width_after', val.external_width_after);
    formData.append('external_height_after', val.external_height_after);
    formData.append('item_weight', val.item_weight);
    // formData.append('volumetric_weight_air_international', val.volumetric_weight_air_international);
    // formData.append('volumetric_weight_by_sea', val.volumetric_weight_by_sea);
    // formData.append('volumetric_weight_by_road', val.volumetric_weight_by_road);
    // formData.append('volumetric_space', val.volumetric_space);
    // formData.append('default_lead_time_for_sales', val.default_lead_time_for_sales);
    // formData.append('default_lead_time_for_purchase', val.default_lead_time_for_purchase);
    // formData.append('auto_requisition_on_level', val.auto_requisition_on_level);
    formData.append('warranty_applicable', val.warranty_applicable);
    formData.append('warranty_period', val.warranty_period);
    formData.append('sub_category_id', val.sub_category_name);
    // formData.append('maximum_discount', val.maximum_discount);
    // formData.append('maximum_discount', '0');

    if (this.imageToUpload && this.imageToUpload.length > 0) {
      for (let i = 0; i < this.imageToUpload.length; i++) {
        formData.append(
          'images',
          this.imageToUpload[i],
          this.imageToUpload[i].name,
        );
      }
    }
    // Serialize customerDetail into a JSON string and append
    val.customerDetail = this.selectedCustomerTypes?.map((customer: any) => {
      const customerTypeKey = customer.customer_type_name;

      if (val[customerTypeKey] !== undefined) {
        customer.amount = val[customerTypeKey];
      }
      return customer;
    });

    this.selectedCustomerTypes?.forEach((customer: any) => {
      const customerTypeKey = customer.customer_type_name;
      delete val[customerTypeKey];
    });

    // formData.append('customerDetail', JSON.stringify(val.customerDetail));

    if (this.id) {
      this._commonService?.showLoader();
      this._configurationalMasterService
        .updatItemMaster(this.id, formData)
        .subscribe(
          (res: any) => {
            this._commonService?.hideLoader();
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/pr-item']);
          },
          (err) => {
            this._commonService?.hideLoader();
            this.toaster.error(err.error.message);
          },
        );
    } else {
      this._commonService?.showLoader();
      this._configurationalMasterService.createItem(formData).subscribe(
        (res: any) => {
          this.createdata = res.data;
          this._commonService?.hideLoader();
          if (res.code == 200) {
            this.toaster.success(res.message);
            this.route.navigate(['master/configurational-master/pr-item']);
          }
        },
        (err) => {
          this._commonService?.hideLoader();
          this.toaster.error(err.error.message);
        },
      );
    }
  }

  ///////////////////////////////////////////////

  removePlus(event: any): void {
    const key = event.key;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }

  itemFilter(e: any) {
    const aa = e;
    let filteredVariable = this.getCat_data2.filter((item: any) =>
      aa.includes(item.asset_category_name),
    );
    this.getCat_data = filteredVariable;
  }

  // for the increment and decrement input

  minMax_lavel: number = 0;
  increaselevel(): void {
    this.minMax_lavel++;
    this.createPrItemForm.get('minimum_level')?.patchValue(this.minMax_lavel);
  }
  decreaselevel(): void {
    if (this.minMax_lavel > 0) {
      this.minMax_lavel--;
      this.createPrItemForm.get('minimum_level')?.patchValue(this.minMax_lavel);
    }
  }

  maximunm_lavel: number = 0;
  increaseMax(): void {
    this.maximunm_lavel++;
    this.createPrItemForm.get('maximum_level')?.patchValue(this.maximunm_lavel);
  }
  decreaseMax(): void {
    if (this.maximunm_lavel > 0) {
      this.maximunm_lavel--;
      this.createPrItemForm
        .get('maximum_level')
        ?.patchValue(this.maximunm_lavel);
    }
  }

  dynamicFields: any = [];
  selectedCustomerTypes: any[] = [];

  onSelectionChange(event: any, i: any) {
    if (this.id) {
      this.selectedCustomerTypes = this.singleItem.customerTypeData;
    }
    const index = this.selectedCustomerTypes.findIndex(
      (pl: any) => pl.id === event.id,
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
          new FormControl('', Validators.required),
        );
      }
    });
  }

  hsnCodeList: any[] = [];
  searchListHSN: any;
  getHSNCodeList(id: any, code_type: string = 'HSN') {
    this._configurationalMasterService
      .getHSNCode(id, code_type)
      .subscribe((res: any) => {
        this.hsnCodeList = res?.data;
        this.searchListHSN = this.hsnCodeList.map(
          (value: any) => value.hsn_sac_code,
        );
      });
  }

  searchFilterHSN(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList.filter((item: any) =>
      aa.includes(item.hsn_sac_code),
    );
    this.hsnCodeList = filteredVariable;
  }

  getHSNData(id: number) {
    return this.hsnCodeList.find((x) => x.id === id)?.value;
  }

  onImgError(event: any) {
    event.target.src = '../../../../../../assets/No-Image.png';
  }
}
