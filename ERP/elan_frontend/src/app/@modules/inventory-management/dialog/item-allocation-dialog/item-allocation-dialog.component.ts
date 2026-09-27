import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Bay, Bin, Rack, Zone } from '../../interface/bifurcation.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-item-allocation-dialog',
  templateUrl: './item-allocation-dialog.component.html',
  styleUrls: ['./item-allocation-dialog.component.scss'],
})
export class ItemAllocationDialogComponent implements OnInit {
  warehouseId: any;
  zoneTypes: any[] = [];
  form: FormGroup;
  serialNoList: any = [];
  zoneList: Zone[] = [];
  bayList: Bay[] = [];
  rackList: Rack[] = [];
  binList: Bin[] = [];
  rowZoneLists: any[][] = [];
  rowBayLists: any[][] = [];
  rowRackLists: any[][] = [];
  rowBinLists: any[][] = [];
  actions = [
    {
      label: 'Close',
      icon: 'close',
      color: 'warn',
      callback: () => this.dialogRef.close(),
    },
  ];
  i: any;

  constructor(
    private inventoryManagementService: InventoryManagementService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ItemAllocationDialogComponent>,
  ) {
    this.warehouseId = this.data?.warehouse_id;
    if (!this.warehouseId && this.data?.itemData) {
      this.warehouseId = this.data.itemData.warehouse_id;
    }

    console.log(this.data);

    this.form = this.fb.group({
      warehouse_id: [this.warehouseId, [Validators.required]],
      category_id: [this.data?.itemData?.asset_id, [Validators.required]],
      zone_type_id: [''],
      zone_id: [''],
      bay_id: [''],
      rack_id: [''],
      bin_id: [''],
      item_id: [this.data?.itemData?.item_id, [Validators.required]],
      receiveQty: [this.data?.itemData?.rcvd_qty, [Validators.required]],
      batchNo: [this.data?.itemData?.batchNo, Validators.required],
      area: [],
      serialAllocations: this.fb.array([]),
      bypass_approval: [false]
    });

    this.form.get('zone_type_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.getWarehouseBifurcationByTypeId(value, 'zone');
      }
    });
    this.form.get('zone_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.getWarehouseBifurcationByTypeId(value, 'bay');
      }
    });
    this.form.get('bay_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.getWarehouseBifurcationByTypeId(value, 'rack');
      }
    });
    this.form.get('rack_id')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.getWarehouseBifurcationByTypeId(value, 'bin');
      }
    });
    this.getsSerialNo(data?.itemData.grn_item_id);
  }

  get serialAllocations() {
    return this.form.get('serialAllocations') as any;
  }

  ngOnInit(): void {
    if (this.warehouseId) {
      this.getZoneTypes();
    } else {
      console.error('Cannot load zones without warehouse ID');
    }
  }

  getZoneTypes() {
    this._configurationalMasterService.zoneTypeList().subscribe(
      (res: any) => {
        this.zoneTypes = res.data;
      },
      (err) => {
        this.toast.error('Unable to load zone types');
      },
    );
  }

  getWarehouseBifurcationByTypeId(id: number, type: string) {
    if (!this.warehouseId) {
      console.error('Warehouse ID is missing for API call');
      return;
    }
    if (type === 'zone') {
      this.zoneList = [];
      this.bayList = [];
      this.rackList = [];
      this.binList = [];
    } else if (type === 'bay') {
      this.bayList = [];
      this.rackList = [];
      this.binList = [];
    } else if (type === 'rack') {
      this.rackList = [];
      this.binList = [];
    } else if (type === 'bin') {
      this.binList = [];
    }
    this.inventoryManagementService
      .getWarehouseBifurcationByTypeId(
        id,
        this.warehouseId,
        type,
        this.data?.itemData?.asset_id,
      )
      .subscribe(
        (res: any) => {
          if (type === 'zone') {
            this.zoneList = res.data;
          } else if (type === 'bay') {
            this.bayList = res.data;
          } else if (type === 'rack') {
            this.rackList = res.data;
          } else if (type === 'bin') {
            this.binList = res.data;
          }
        },
        (err: HttpErrorResponse) => {
          this.toast.error(err.error.message || 'Unable to load zones');
        },
      );
  }

  initSerialAllocations() {
    this.serialNoList.forEach((sr: any, index: number) => {
      this.rowZoneLists[index] = [];
      this.rowBayLists[index] = [];
      this.rowRackLists[index] = [];
      this.rowBinLists[index] = [];

      const group = this.fb.group({
        id: [sr.id],
        itemSerialNo: [sr.itemSerialNo],
        batchNo: [sr.batchNo],
        batchType: [sr.batchType],
        zone_type_id: [null, Validators.required],
        zone_id: [null, Validators.required],
        bay_id: [null],
        rack_id: [null],
        bin_id: [null],
      });

      group.get('zone_type_id')?.valueChanges.subscribe((value: any) => {
        if (value) {
          this.getRowWarehouseBifurcation(value, 'zone', index);
        }
      });
      group.get('zone_id')?.valueChanges.subscribe((value: any) => {
        if (value) {
          this.getRowWarehouseBifurcation(value, 'bay', index);
        }
      });
      group.get('bay_id')?.valueChanges.subscribe((value: any) => {
        if (value) {
          this.getRowWarehouseBifurcation(value, 'rack', index);
        }
      });
      group.get('rack_id')?.valueChanges.subscribe((value: any) => {
        if (value) {
          this.getRowWarehouseBifurcation(value, 'bin', index);
        }
      });

      this.serialAllocations.push(group);
    });
  }

  getRowWarehouseBifurcation(id: number, type: string, index: number) {
    if (!this.warehouseId) return;

    if (type === 'zone') {
      this.rowZoneLists[index] = [];
      this.rowBayLists[index] = [];
      this.rowRackLists[index] = [];
      this.rowBinLists[index] = [];
      this.serialAllocations
        .at(index)
        .patchValue(
          { zone_id: '', bay_id: '', rack_id: '', bin_id: '' },
          { emitEvent: false },
        );
    } else if (type === 'bay') {
      this.rowBayLists[index] = [];
      this.rowRackLists[index] = [];
      this.rowBinLists[index] = [];
      this.serialAllocations
        .at(index)
        .patchValue(
          { bay_id: '', rack_id: '', bin_id: '' },
          { emitEvent: false },
        );
    } else if (type === 'rack') {
      this.rowRackLists[index] = [];
      this.rowBinLists[index] = [];
      this.serialAllocations
        .at(index)
        .patchValue({ rack_id: '', bin_id: '' }, { emitEvent: false });
    } else if (type === 'bin') {
      this.rowBinLists[index] = [];
      this.serialAllocations
        .at(index)
        .patchValue({ bin_id: '' }, { emitEvent: false });
    }

    this.inventoryManagementService
      .getWarehouseBifurcationByTypeId(
        id,
        this.warehouseId,
        type,
        this.data?.itemData?.asset_id,
      )
      .subscribe(
        (res: any) => {
          if (type === 'zone') {
            this.rowZoneLists[index] = res.data;
          } else if (type === 'bay') {
            this.rowBayLists[index] = res.data;
          } else if (type === 'rack') {
            this.rowRackLists[index] = res.data;
          } else if (type === 'bin') {
            this.rowBinLists[index] = res.data;
          }
        },
        (err: HttpErrorResponse) => {
          this.toast.error(err.error.message || 'Unable to load data');
        },
      );
  }

  onSubmit() {
    if (this.form.valid) {
      let formData = this.form.value;
      if (this.serialNoList.length > 0) {
        formData.serialNoList = this.form.value.serialAllocations;
      } else {
        formData.serialNoList = [];
      }
      this.inventoryManagementService
        .allocateItemInWarehouse(formData)
        .subscribe(
          (res: any) => {
            this.toast.success('Item allocated successfully');
            this.dialogRef.close(true);
          },
          (err: HttpErrorResponse) => {
            this.toast.error(err.error.message || 'Unable to allocate item');
          },
        );
    } else {
      this.toast.error('Form is invalid');
    }
  }

  getsSerialNo(grn_item_id: any) {
    this.inventoryManagementService.getsSerialNo(grn_item_id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.serialNoList = (res.data || []).filter(
          (item: any) => item.itemStatus === 'SELECTED',
        );
        if (this.serialNoList.length > 0) {
          this.form.get('zone_type_id')?.clearValidators();
          this.form.get('zone_id')?.clearValidators();
          this.form.get('bay_id')?.clearValidators();
          this.form.get('rack_id')?.clearValidators();
          this.form.get('bin_id')?.clearValidators();

          this.form.get('zone_type_id')?.updateValueAndValidity();
          this.form.get('zone_id')?.updateValueAndValidity();
          this.form.get('bay_id')?.updateValueAndValidity();
          this.form.get('rack_id')?.updateValueAndValidity();
          this.form.get('bin_id')?.updateValueAndValidity();

          this.initSerialAllocations();
        } else {
          this.form.get('zone_type_id')?.setValidators([Validators.required]);
          this.form.get('zone_id')?.setValidators([Validators.required]);
          this.form.get('bay_id')?.setValidators([Validators.required]);
          this.form.get('rack_id')?.setValidators([Validators.required]);
          this.form.get('bin_id')?.setValidators([Validators.required]);

          this.form.get('zone_type_id')?.updateValueAndValidity();
          this.form.get('zone_id')?.updateValueAndValidity();
          this.form.get('bay_id')?.updateValueAndValidity();
          this.form.get('rack_id')?.updateValueAndValidity();
          this.form.get('bin_id')?.updateValueAndValidity();
        }
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
