import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyComponent } from '@fullcalendar/core/preact';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-view-scheduled-production',
  templateUrl: './view-scheduled-production.component.html',
  styleUrls: ['./view-scheduled-production.component.scss']
})
export class ViewScheduledProductionComponent implements OnInit {
  viewScheduledProduction: FormGroup
  bomData: any;
  bomDetailsFormArray: any;
  getAllProductData: any;
  cetegory: any;
  subCetegory: any;
  productData: any;
  getProductVariant: any = [];
  variant_name: any;
  constructor(private location: Location, private _fb: FormBuilder, private _activeRoute: ActivatedRoute, private _productionService: ProductionService,
    private _toaster: ToastrService, private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,) {

    this.viewScheduledProduction = _fb.group({
      product_order_no: new FormControl(''),
      product_category_id: new FormControl(''),
      product_id: new FormControl(''),
      product_variant: new FormControl(''),
      product_code: new FormControl(''),
      product_description: new FormControl(''),
      remark: new FormControl('', Validators.required),
      bomDetails: new FormArray([
        new FormGroup({
          item_id: new FormControl(null),
          itemName: new FormControl(null),
          itemCode: new FormControl(null),
          bomQty: new FormControl(null),
          total_required_qty: new FormControl(null),
          unit: new FormControl(null),
        }),
      ]),
    })
    this.bomDetailsFormArray = this._fb.array([]);

  }
  product_id: any
  production_mapping_id: any
  product_category_id: any
  product_category_sub_id: any
  entityId:any;
  financial_year_id:any
  ngOnInit(): void {
  
  
    this.entityId = localStorage.getItem('selectedEntityId');
      this.financial_year_id = localStorage.getItem('financial_id');
      this.getAllCategory();
    this._activeRoute.queryParams.subscribe((res: any) => {
      this.production_mapping_id = res.id;
      console.warn(res.id);
      this._productionService.viewScheduledProduction(res.id).subscribe((res: any) => {
        
        this.bomData = res.BomData;
        console.log(this.bomData, 'Radhe Radhe')
        this.product_category_id = res.data?.ADD_PRODUCTION_MST?.product_category_id
        this.getAllActiveProduct(this.product_category_id)
        this.product_id = res.data.ADD_PRODUCTION_MST.product_id;
        this.viewScheduledProduction.patchValue({
          product_order_no: res.data.production_order_no,
          product_id: res.data.ADD_PRODUCTION_MST.product_id,
          product_category_id: res.data.ADD_PRODUCTION_MST.product_category_id,
          product_code: res.data.ADD_PRODUCTION_MST.MASTER_PRODUCT.product_code,
          product_description: res.data.ADD_PRODUCTION_MST.MASTER_PRODUCT.product_description,
        });
        this.bomDetailsFormArray?.clear();
        res.BomData[0]?.PRO_BOM_DETAILS_MSTs
        ?.forEach((item: any) => {
          this.bomDetailsFormArray.push(this._fb.group({
            bomQty: item.bom_qty,
            itemCode: item.MASTER_ITEM.item_code,
            itemName: item.MASTER_ITEM.item_name,
            item_id: item.MASTER_ITEM.id,
            total_required_qty: item.bom_qty * res.data.production_qty,
            unit: item.MASTER_ITEM.MASTER_UOM.uom_name,
          }));
        });
        this.viewScheduledProduction.patchValue({
          bomDetails: this.bomDetailsFormArray?.value
        });

        // if (this.product_category_id) {
        //   this._productionService.getAllCetegory(this.product_category_id).subscribe((subCetegoryRes: any) => {
        //     this.subCetegory = subCetegoryRes.data;
        //     if (this.product_category_sub_id) {
        //       this._productionService.getAllProductOncetegory(this.product_category_id, this.product_category_sub_id).subscribe((productDataRes: any) => {
        //         this.productData = productDataRes.data;

               
        //       });
        //     }
        //   });
        // }
      });
    });
    this._configurationalMasterService
      .getProductMasterList()
      .subscribe((res: any) => {
        this.getAllProductData = res.data;
      });
    this.getAllCategory();
  }
  goBack() {
    this.location.back();
  }
  getAllCategory() {
    this._productionService.getAllCetegory(this.entityId).subscribe((res: any) => {
      this.cetegory = res.data;

    })
  }

  getSubCetegoryDetail(event: any) {
    if (!event?.value) return; // <--- Add this check

    let cetegory = this.viewScheduledProduction.controls['product_category_id']?.value
    this._productionService.getAllProductOncetegory(cetegory, event?.value).subscribe((res: any) => {
      this.productData = res.data;
      console.log(this.productData, 'four Idiot')
    })
  }

  ngSubmitRaiseIndent(data: any) {
    data.product_id = this.product_id;
    data.production_mapping_id = this.production_mapping_id;
    data.remark = this.viewScheduledProduction?.value?.remark;
    let bom = this.viewScheduledProduction.value.bomDetails;
    if (bom?.length > 0) {
      data.bomDetails = bom.map((item: any) => {
        return {
          bomQty: item.bomQty,
          itemCode: item.itemCode,
          itemName: item.itemName,
          item_id: item.item_id,
          total_required_qty: item.total_required_qty,
          unit: item.unit
        };
      });
    }
    this._productionService.postRaiseIndentData(data).subscribe((res: any) => {
      if (res) {
        this._toaster.success(res.message);
        this.router.navigate(['/master/production/schedule-production']);
      }
    }, (err: any) => {
      this._toaster.error(err.error.message);
    });
  }
  getAllVariant: any[] = []
  getVariantByProduct(id: any) {
    this._productionService.getVariantById(id).subscribe((res: any) => {
      this.getAllVariant = res.data;
      this.viewScheduledProduction.patchValue({
        product_code: res?.product_code,
        product_description: res?.data?.product_description
      })
      this.getAllVariant?.filter((res: any) => {
        if (res.variant_name === this.variant_name) {
          this.viewScheduledProduction.patchValue({
            product_code: res.product_code,
            product_description: res?.data?.product_description
          })
        }
      })
    })
  }
  getProductItem(data: any) {
    this.getVariantByProduct(data.value)
    this.getProductVariant = []
    this.getAllProductData.filter((res: any) => {
      if (res.id == data.value) {
        this.viewScheduledProduction.patchValue({
          product_code: res.product_code,
          product_description: res.product_description,
        })
        this.getProductVariant.push(res)
      }
    })
    this.viewScheduledProduction.get('product_code')?.reset()
    this.viewScheduledProduction.get('product_description')?.reset()
  }
  getAllActiveProduct(event: any) {
    
    this._productionService.getAllActiveProduct(event.value??event,this.entityId).subscribe((res: any) => {
      this.productData = res.data
    })
  }
}
