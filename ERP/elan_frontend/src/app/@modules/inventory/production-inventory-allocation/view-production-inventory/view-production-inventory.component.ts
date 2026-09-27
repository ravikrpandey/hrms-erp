import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AnyComponent } from '@fullcalendar/core/preact';
import { ToastrService } from 'ngx-toastr';
import { InventoryAllocationService } from 'src/app/@shared/services/inventory/inventory-allocation.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-view-production-inventory',
  templateUrl: './view-production-inventory.component.html',
  styleUrls: ['./view-production-inventory.component.scss']
})
export class ViewProductionInventoryComponent {
  viewScheduledProduction: FormGroup
  constructor(
    private location: Location,
    private _fb: FormBuilder,
    private _activeRoute: ActivatedRoute,
    private _productionService: ProductionService,
    private inventory_allocation_service: InventoryAllocationService,
    private _toaster: ToastrService, 
    private router: Router
    ) {

    this.viewScheduledProduction = _fb.group({
      product_order_no: new FormControl(''),
      product_name: new FormControl(''),
      product_variant: new FormControl(''),
      product_code: new FormControl(''),
      product_description: new FormControl(''),
      remark: new FormControl('', Validators.required),
      bomDetails: new FormArray([
        new FormGroup({
          item_id: new FormControl(''),
          itemName: new FormControl(''),
          itemCode: new FormControl(''),
          bomQty: new FormControl(''),
          total_required_qty: new FormControl(''),
          available_inventory: new FormControl(''),
          unit: new FormControl(''),
        }),
      ]),
    })

  }
  product_id: any
  production_mapping_id: any
  bomDetailsData: any[] = [];
  ngOnInit(): void {
    this._activeRoute.queryParams.subscribe((res: any) => {
      this.production_mapping_id = res.id;
      console.log(res.id);
      const payload = {
        production_mapping_id: this.production_mapping_id 
      }
      this.inventory_allocation_service.getProductionbyId(payload).subscribe((res: any) => {
        this.bomDetailsData = res.data.productionQuery
        let bomDetails = this.bomDetailsData

        this.viewScheduledProduction.patchValue({
          product_order_no: res.data.production_order_no,
          product_name: res.data.product_name,
          product_variant: res.data.variant_name ,
          product_code: res.data.product_code,
          product_description: res.data.product_description,
          remark : res.data.remark
        })

        for (let index = 0; index < bomDetails.length; index++) {
          const formGroup = this.bomDetailsFormArray.at(index) as FormGroup;
          if (formGroup) {
            setTimeout(() => {
              formGroup.patchValue({
                id : bomDetails[index].id,
                item_id: bomDetails[index].item_master_id,
                itemName: bomDetails[index].item_name,
                itemCode: bomDetails[index].item_code,
                bomQty: bomDetails[index].BOM_qty,
                total_required_qty: bomDetails[index].total_required_qty,
                available_inventory: bomDetails[index].selection_item,
                unit: bomDetails[index].uom_name,
              });
            }, 200);
          } else {
            this.bomDetailsFormArray.push(
              this._fb.group({
                id : bomDetails[index].id,
                item_id: bomDetails[index].item_master_id,
                itemName: bomDetails[index].item_name,
                itemCode: bomDetails[index].item_code,
                bomQty: bomDetails[index].BOM_qty,
                total_required_qty: bomDetails[index].total_required_qty,
                available_inventory: bomDetails[index].selection_item,
                unit: bomDetails[index].uom_name,
              })
            );
          }
        }
      })

    })
  }

  get bomDetailsFormArray() {
    return this.viewScheduledProduction.get("bomDetails") as FormArray;
  }


  goBack() {
    this.location.back();
  }

  redirect(rowIndex: number) {
    const rowData = this.bomDetailsFormArray.at(rowIndex).value;
    const selectedRowData = this.bomDetailsData[rowIndex];
    console.warn(selectedRowData,'selectedRowData');
    
    const parmsdata = {
      item_name : selectedRowData.item_name,
      manage_by : selectedRowData.batchType,
      asset_category_name : selectedRowData.asset_category_name,
      total_inventory : selectedRowData.total_required_qty,
      totalReceiveQty : selectedRowData.selection_item,
      production_mapping_id: this.production_mapping_id,
      item_id:selectedRowData.item_master_id,
      id: selectedRowData.id,
    }
    console.log(selectedRowData, "this is the selected row data");
    if(selectedRowData.batchType == "S.No. Only"){
      console.log(parmsdata);
      const navigationExtras: NavigationExtras = {
        queryParams: {inventory_view: JSON.stringify(parmsdata)},
        skipLocationChange: true,
      };
    this.router.navigate(["master/inventory-management/inventory-allocation/production-serial-allocation"],navigationExtras);
    }
    else if (selectedRowData.batchType =="Batch Only") {
      console.log(parmsdata);
      const navigationExtras: NavigationExtras = {
        queryParams: {inventory_view: JSON.stringify(parmsdata)},
        skipLocationChange: true,
      };
      this.router.navigate(["master/inventory-management/inventory-allocation/production-batch-allocation"],navigationExtras);
    }
  }
}
