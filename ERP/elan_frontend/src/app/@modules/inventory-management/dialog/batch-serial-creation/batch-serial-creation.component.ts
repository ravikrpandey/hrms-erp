import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';

@Component({
  selector: 'app-batch-serial-creation',
  templateUrl: './batch-serial-creation.component.html',
  styleUrls: ['./batch-serial-creation.component.scss']
})
export class BatchSerialCreationComponent {

  expiryDate = new FormControl(null);
  serialNumbers: FormControl[] = [];
  today = new Date();
  unitPrice = new FormControl(null);
  zone_type_id = new FormControl(null);
  zone_id = new FormControl(null);
  bay_id = new FormControl(null);
  rack_id = new FormControl(null);
  bin_id = new FormControl(null);
  zoneTypes: any[] = [];
  sublocationList: any[] = [];
  bayList: any[] = [];
  rackList: any[] = [];
  binList: any[] = [];

  constructor(private toast: ToastrService, private _configurationalMasterService: ConfigurationalmasterService,
    private inventoryManagementService: InventoryManagementService,
    private dialogRef: MatDialogRef<BatchSerialCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // console.log('Popup Data:', data);
    // Already selected data
    this.expiryDate.setValue(data.expiryDate || this.today);
    this.unitPrice.setValue(data.unitPrice !== undefined && data.unitPrice !== null ? data.unitPrice : null);
    this.zone_type_id.setValue(data.zone_type_id || null);

    if (data.zone_type_id) {
      this.getAllSubLocationList(data.zone_type_id, 'zone');
    }

    this.zone_id.setValue(data.zone_id || null);

    if (data.zone_id) {
      this.getAllSubLocationList(data.zone_id, 'bay');
    }

    this.bay_id.setValue(data.bay_id || null);

    if (data.bay_id) {
      this.getAllSubLocationList(data.bay_id, 'rack');
    }

    this.rack_id.setValue(data.rack_id || null);

    if (data.rack_id) {
      this.getAllSubLocationList(data.rack_id, 'bin');
    }

    this.bin_id.setValue(data.bin_id || null);

    // Create serial inputs according to quantity
    if (data.manageBy === 'S.No. Only') {
      const existingSerials = data.serialNumbers || [];
      for (let i = 0; i < data.quantity; i++) {
        this.serialNumbers.push(
          new FormControl(existingSerials[i] || '')
        );
      }
    }
  }

  ngOnInit(): void {
    this.getZoneTypes();

    this.zone_type_id.valueChanges.subscribe((id: any) => {
      this.sublocationList = [];

      if (id) {
        this.getAllSubLocationList(id, 'zone');
      }
    });

    this.zone_id.valueChanges.subscribe((id: any) => {
      this.bayList = [];

      if (id) {
        this.getAllSubLocationList(id, 'bay');
      }
    });

    this.bay_id.valueChanges.subscribe((id: any) => {
      this.rackList = [];

      if (id) {
        this.getAllSubLocationList(id, 'rack');
      }
    });

    this.rack_id.valueChanges.subscribe((id: any) => {
      this.binList = [];

      if (id) {
        this.getAllSubLocationList(id, 'bin');
      }
    });
  }

  getZoneTypes() {
    this._configurationalMasterService.zoneTypeList().subscribe(
      (res: any) => {
        this.zoneTypes = res.data;
      },
      (err) => {
        this.toast.error('Unable to load sub location types');
      }
    );
  }

  getAllSubLocationList(id: any, type: any){
    const fetchType = type === 'zone' ? 'sub location' : type;
    this.inventoryManagementService.getWarehouseBifurcationByTypeId(id,this.data?.warehouse_id, type, this.data?.item_category_id).subscribe(
      (res: any) => {
        if(type == 'zone'){
          this.sublocationList = res.data;
        }

        if(type == 'bay'){
          this.bayList = res.data;
        }

        if(type == 'rack'){
          this.rackList = res.data;
        }

        if(type == 'bin'){
          this.binList = res.data;
        }
      },
      (err) => {
        this.toast.error(`Unable to load ${fetchType}. Please check if a ${fetchType} is available for this item category in warehouse bifurcation.`);
      }
    );
  }

  onSerialChange(index: number) {
    const control = this.serialNumbers[index];
    const value = control.value?.trim();

    if (!value) {
      return;
    }

    const normalizedValue = value.toLowerCase();

    // Duplicate serial number in the current popup
    const currentDuplicate = this.serialNumbers.some(
      (serialControl, i) =>
        i !== index &&
        serialControl.value?.trim()?.toLowerCase() === normalizedValue
    );

    const existingDuplicate =
    (this.data.existingSerialNumbers || []).some(
      (serial: string) =>
        serial?.trim()?.toLowerCase() === normalizedValue
    );

    if (currentDuplicate || existingDuplicate) {
      this.toast.error(`Serial No. ${value} is already added for the same or another item`);
      control.setValue('');
      control.markAsTouched();
      return;
    }
  }

  confirm() {
    const expiryDate = this.expiryDate.value;
    const unitPrice = Number(this.unitPrice.value);
    const zone_type_id = this.zone_type_id.value;
    const zone_id = this.zone_id.value;
    const bay_id = this.bay_id.value;
    const rack_id = this.rack_id.value;
    const bin_id = this.bin_id.value;

    if (!this.unitPrice.value || unitPrice <= 0 || isNaN(unitPrice)) {
      this.toast.error('Please enter unit price');
      return;
    }

    if (!zone_type_id) {
      this.toast.error('Please select sub location type');
      return;
    }

    if (!zone_id) {
      this.toast.error('Please select sub location');
      return;
    }

    if (!expiryDate) {
      this.toast.error(`Please select expiry date`);
      return;
    }

    // Serial Only
    if (this.data.manageBy === 'S.No. Only') {

      const serials = this.serialNumbers.map(
        control => control.value?.trim()
      );

      // Empty check
      if (serials.some(serial => !serial)) {
        this.toast.error(`Please enter all serial numbers`);
        return;
      }

      // Duplicate check inside popup
      const normalizedSerials = serials.map(
        serial => serial.toLowerCase()
      );

      const duplicate = normalizedSerials.some(
        (serial, index) =>
          normalizedSerials.indexOf(serial) !== index
      );

      if (duplicate) {
        this.toast.error(`Duplicate serial number is not allowed`);
        return;
      }

      this.dialogRef.close({
        itemId: this.data.itemId,
        itemName: this.data.itemName,
        quantity: this.data.quantity,
        manageBy: this.data.manageBy,
        unitPrice: unitPrice,
        totalAmount: Number(this.data.quantity) * unitPrice,
        expiryDate: expiryDate,
        serialNumbers: serials,
        zone_type_id: zone_type_id,
        zone_id: zone_id,
        bay_id: bay_id,
        rack_id: rack_id,
        bin_id: bin_id
      });
      return;
    }

    // Batch Only
    if (this.data.manageBy === 'Batch Only') {
      this.dialogRef.close({
        itemId: this.data.itemId,
        itemName: this.data.itemName,
        quantity: this.data.quantity,
        manageBy: this.data.manageBy,
        unitPrice: unitPrice,
        totalAmount: Number(this.data.quantity) * unitPrice,
        expiryDate: expiryDate,
        serialNumbers: [],
        zone_type_id: zone_type_id,
        zone_id: zone_id,
        bay_id: bay_id,
        rack_id: rack_id,
        bin_id: bin_id
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

}