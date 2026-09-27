import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { ViewSfgDialogBoxComponent } from '../view-sfg-dialog-box/view-sfg-dialog-box.component';

@Component({
  selector: 'app-bom-create',
  templateUrl: './bom-create.component.html',
  styleUrls: ['./bom-create.component.scss']
})
export class BomCreateComponent implements OnInit {
  AddNewForm: FormGroup;
  cetegory: any;
  subCetegory: any;
  productData: any;
  itemType: any;
  allDetails: any;
  getAllSFG: any;
  sfgBtn: any;
  sfgDetails: any =[];
  assetId: any;
  entityId: string | null;
  financial_year_id: string | null;
  constructor(private location: Location, private _fb: FormBuilder, private _configurationalMasterService: ConfigurationalmasterService,
     private productionService: ProductionService, private toaster: ToastrService, private route: Router, private activeRoute: ActivatedRoute, private dialog: MatDialog) {
    this.AddNewForm = _fb.group({
      bom_type: new FormControl('', Validators.required),
      product_id: new FormControl(''),
      entity_id: new FormControl(''),
      financial_year_id: new FormControl(''),
      product_code: new FormControl('',),
      product_rating:new FormControl('',),
      cetegory: new FormControl(''),
      subCetegory: new FormControl(''),
      sfg_id: new FormControl(''),
      product_description: new FormControl('',),
      product_variant: new FormControl('',),
      bomDetails: new FormArray([
        new FormGroup({
          item_type_id: new FormControl(null, Validators.required),
          asset_id: new FormControl(null, Validators.required),
          item_master_id: new FormControl(null, Validators.required),
          item_code: new FormControl('',),
          bom_qty: new FormControl(null, Validators.required),
          type: new FormControl(null, Validators.required),
          scrape: new FormControl(null, Validators.compose([
            Validators.required,
            this.minMaxValidator
          ])),
          scrape_reuseable: new FormControl(null, Validators.required),
          uom_id: new FormControl(null, Validators.required),
        }),
      ]),
    })

  }
  EmpId: any;
  UOMID: any
  bomDetails: any[] = [];
  viewDetails: any;
  productVariantData: any[] = []
  variant_name: any
  ngOnInit(): void {
    this.getItemType()
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.viewDetails = res.view;
      this.UOMID = res.uomId

    })
    this.EmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.AddNewForm.patchValue({
      entity_id: this.entityId,
      financial_year_id: this.financial_year_id
    });
    // this.getAllItemCategory()
    this.getAllProduct();
    this.getAllCategory();
    this.getAllItem();
    this.getAllSfgType()
    if (this.UOMID) {
      this.getAllDetails(this.UOMID)
    }
  }
  getAllDetails(data: any) {
    
    // this.getAllItemType()
    this.productionService.getBomDetailsById(data).subscribe((res: any) => {
      this.allDetails = res.data;
      this.getAllActiveProduct(this.allDetails?.PRODUCT_CATEGORY?.id);
      this.AddNewForm.patchValue({
        bom_type: this.allDetails.bom_type,
        sfg_id: this.allDetails?.sfg_id,
        cetegory: this.allDetails?.PRODUCT_CATEGORY?.id,
        product_id: this.allDetails?.MASTER_PRODUCT?.id,
        product_code: this.allDetails?.MASTER_PRODUCT?.product_code,
        product_description: this.allDetails?.MASTER_PRODUCT?.product_description,
        product_rating:this.allDetails?.MASTER_PRODUCT?.product_rating,
       // product_variant:this.allDetails?.MASTER_PRODUCT_VARIANT?.variant_name
      })
      this.getAllSFG?.filter((res: any) => {
        if (res.id === this.allDetails?.sfg_id) {
          this.AddNewForm.patchValue({
            product_description: res.description
          })
        }
      })
    
      this.productionService.getAllProductOncetegory(this.allDetails?.PRODUCT_CATEGORY?.id, this.allDetails?.PRODUCT_SUBCATEGORY?.id).subscribe((res: any) => {
        this.productData = res.data
        this.productData.filter((res: any) => {
          if (res.product_code === this.allDetails?.PRODUCT_MASTER?.product_code) {
            this.AddNewForm.patchValue({
              product_description: res.product_description
            })
          }

        })

      })

      this.bomDetails = res.data.PRO_BOM_DETAILS_MSTs

      const bomDetails = res.data.PRO_BOM_DETAILS_MSTs;

      const bomDetailsFormArray = this.AddNewForm.get('bomDetails') as FormArray;
      bomDetailsFormArray.clear();

      bomDetails.forEach((bomDetail: any, index: any) => {
        this.getAssetCateVal(bomDetail.asset_id, index)
        this.getCategoryVal(bomDetail.item_type_id, index)
        setTimeout(() => {
          const dd = this.getItemById[index];
          if (dd) {
            bomDetailsFormArray.push(
              new FormGroup({
                item_type_id: new FormControl(bomDetail.item_type_id, Validators.required),
                asset_id: new FormControl(bomDetail.asset_id, Validators.required),
                item_master_id: new FormControl(bomDetail.item_master_id, Validators.required),
                item_code: new FormControl(dd[0]?.ItemMaster?.item_code),
                bom_qty: new FormControl(bomDetail.bom_qty, Validators.required),
                type: new FormControl(bomDetail.type, Validators.required),
                scrape: new FormControl(bomDetail.scrape, Validators.compose([
                  Validators.required,
                  this.minMaxValidator
                ])),
                scrape_reuseable: new FormControl(bomDetail.scrape_reuseable, Validators.required),
                uom_id: new FormControl(dd[0]?.ItemMaster?.tbl_uom?.uom_name, Validators.required),
              })
            );
          }
        }, 500);
      });

    })
  }
  getAllProductData: any[] = []
  getAllProduct() {
    this._configurationalMasterService.getProductMasterList().subscribe((res: any) => {
      this.getAllProductData = res.data
    })
  }
  getAllSfgType() {
    this._configurationalMasterService.getAllSfgType(this.entityId).subscribe((res: any) => {
      this.getAllSFG = res.data

    })
  }
  getSFGItem(e: any) {
    console.log(e.value);
    this.getAllSFG.filter((res: any) => {
      if (res.id === e.value) {
        this.AddNewForm.patchValue({
          product_description: res?.description??'N/A'
        })
      }
    })
  }

  getCategoryVal(data: any, index: any) {
    this.assetData[index]= []
    this._configurationalMasterService.getSfgType(data).subscribe((res: any) => {
      let a = res.data
      console.log(a);
      
      this.assetData[index] = a;
      console.log(this.assetData);
      
    })
  }

  minMaxValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < 1 || value > 100)) {
      return { 'invalidRange': true };
    }
    return null;
  }

  ngSubmitBom(value: any) {
    if (this.AddNewForm.invalid) {
      this.toaster.error('Mendatory field should not be blank', 'Error')
      return
    }
    console.log(value);
    
    let data = {
      bom_type: value.bom_type,
      product_id: value.product_id,
      product_category_id: value.cetegory,
      employee_id: this.EmpId,
      sfg_id: value.sfg_id,
      bomDetails: value.bomDetails,
      entity_id:this.entityId,
      financial_year_id:this.financial_year_id
      
    }
console.log(data);

    if (this.UOMID) {
      this.productionService.updateBomMaster(this.UOMID, data).subscribe((res: any) => {
        if (res) {
          this.toaster.success(res.message);
          this.route.navigate(['/master/production/bom'])
          this.AddNewForm.reset();
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
      })
    }
    else {
      this.productionService.createBomMaster(data).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message)
          this.route.navigate(['/master/production/bom'])
          this.AddNewForm.reset();
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
      })
    }
  }
  getProductVariant: any[] = [];
  getAllVariantData:any=[];

  getProductItem(data: any) {
    this.getProductVariant = []
    this.productData.filter((res: any) => {
      
      if (res.id == data.value) {
        this.AddNewForm.patchValue({
          product_code: res.product_code,
          product_description: res.product_description,
          product_rating: res.product_rating,
         // product_variant:res?.MASTER_PRODUCT_VARIANT?.variant_name
        })
        this.getProductVariant.push(res)
      }
    })
    this._configurationalMasterService.getProductVariantByproduct_id(data.value).subscribe((res:any)=>{
      if(res){
        this.getAllVariantData=res.data;
      }
    },(err:any)=>{

    })
    // this.AddNewForm.get('product_code')?.reset()
    // this.AddNewForm.get('product_description')?.reset()
    // this.AddNewForm.get('product_variant')?.reset()
  }

 
  getProductionType() {
    this.AddNewForm.get('product_code')?.reset()
    this.AddNewForm.get('product_description')?.reset()
    this.AddNewForm.get('product_id')?.reset()
    this.AddNewForm.get('product_variant')?.reset()
  }
  getAllCategory() {
    this.productionService.getAllCetegory(this.entityId).subscribe((res: any) => {
      this.cetegory = res.data;

    })
  }
  getAllActiveProduct(event: any) {
    
    this.productionService.getAllActiveProduct(event.value??event,this.entityId).subscribe((res: any) => {
      this.productData = res.data
    })
  }

  getSubCetegoryDetail(event: any) {
    let cetegory = this.AddNewForm.controls['cetegory'].value
    this.productionService.getAllProductOncetegory(cetegory, event.value).subscribe((res: any) => {
      this.productData = res.data
    })

  }
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

  getAllVariant: any[] = []
  getVariantByProduct(id: any) {
    this.productionService.getVariantById(id).subscribe((res: any) => {
      this.getAllVariant = res.data;
      this.AddNewForm.patchValue({
        product_code: res?.product_code,
        product_description: res?.data?.product_description,
        product_rating:res?.data?.product_rating
      })
      this.getAllVariant.filter((res: any) => {
        if (res.variant_name === this.variant_name) {
          this.AddNewForm.patchValue({
            product_code: res.product_code,
            product_description: res?.data?.product_description,
            product_rating:res?.data?.product_rating
          })
        }
      })
    })
  }

  getVariantData(data: any) {
    this.AddNewForm.patchValue({
      product_description: data.product_description,
      product_code: data.product_variant_code,
      product_rating:data?.product_rating
    })
  }

  assetData: any = []
  getAllItemMaster: any
  getAllItem() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.getAllItemMaster = res.data;
    })
  }

  item_code_data: any
  getItemData(data: any, index: any) {
    
    const formGroup = this.itemsFormArray.at(index) as FormGroup;
    if (formGroup) {
      setTimeout(() => {
        formGroup.patchValue({
          item_code: data.MASTER_ITEM?.item_code,
          uom_id: data.MASTER_ITEM?.MASTER_UOM?.uom_name
        });
      }, 200)
    }
    else {
      this.itemsFormArray.push(
        this._fb.group({
          item_code: data.MASTER_ITEM?.item_code,
          uom_id: data.MASTER_ITEM?.MASTER_UOM?.uom_name
        })
      );
    }
  }

  goBack() {
    this.location.back();
  }
  get itemsFormArray() {
    return this.AddNewForm.get('bomDetails') as FormArray;
  }
  addItem() {
    let data = this._fb.group({
      item_type_id: new FormControl(null,),
      asset_id: new FormControl(null,),
      item_master_id: new FormControl(null,),
      item_code: new FormControl(null,),
      bom_qty: new FormControl(null,),
      type: new FormControl(null,),
      scrape: new FormControl(null,),
      scrape_reuseable: new FormControl(null,),
      uom_id: new FormControl(null,),
    });
    this.itemsFormArray.push(data);
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  getItemById: any[] = []
  getAssetCateVal(data: any, i: any) {
    this.productionService.getItemById(data).subscribe((response: any) => {
      this.getItemById[i] = response.data;
      if (!this.UOMID) {
        const bomDetailsArray = this.AddNewForm.get('bomDetails') as FormArray;
        if (i >= 0 && i < bomDetailsArray.length) {
          const control = bomDetailsArray.at(i) as FormGroup;
          control.get('item_code')?.reset('');
          control.get('uom_id')?.reset(null);
        }
      }
    })
  }

  viewItem(index: number) {
    const itemDetails = this.itemsFormArray.controls[index].value;
    console.log(itemDetails);
    
    if(itemDetails.item_type_id == '3'){
      let aa = {
        item_type: "SFG",
        item_master_id: itemDetails.item_master_id,
      
      }
 this.getSfDetail(aa)
    }

 
  }



  getSfDetail(data: any) {
    console.log(data);

    this.productionService.getSfgDetailsByID(data).subscribe((res: any) => {
      console.log(res);
      this.sfgDetails = res.data
      this.dialog.open(ViewSfgDialogBoxComponent, {
        width: '170vh',
        data: this.sfgDetails
      });
    })
  }


}
