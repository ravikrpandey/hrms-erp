import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';
import { ToastrService } from 'ngx-toastr';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { BatchSerialCreationComponent } from '../dialog/batch-serial-creation/batch-serial-creation.component';

@Component({
  selector: 'app-add-direct-inventory',
  templateUrl: './add-direct-inventory.component.html',
  styleUrls: ['./add-direct-inventory.component.scss']
})
export class AddDirectInventoryComponent {

  mainForm: FormGroup;
  entity_id: any;
  financial_year_id: any;
  warehouseList: any[] = [];
  today = new Date();
  itemList: any[] = [];
  rowFilterData = new Map<AbstractControl, {
    filteredItems: any[],
    searchList: string[]
  }>();
  grandTotal = 0;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private inventoryService: InventoryManagementService,
    private accessData: AccessControlService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private router: Router
  ) { 

  }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();

    this.mainForm = this.fb.group({
      warehouse_id: ['', Validators.required],
      inventory_date: ['', Validators.required],
      items: this.fb.array([])
    });

    this.getWarehouseList();
    this.getItemListData();
  }

  goBack(): void {
    this.location.back();
  }

  getWarehouseList() {
    this.inventoryService.getInventoryStockData(this.entity_id, null).subscribe((res: any) => {
      this.warehouseList = res?.data?.WarehouseList || [];
    });
  }

  get items(): FormArray {
    return this.mainForm.get('items') as FormArray;
  }

  getItemListData() {
    this.inventoryService.getItemList(this.entity_id).subscribe(
      (res: any) => {
      this.itemList = (res?.data || []).map((item: any) => ({
        id: item.id,
        manage_by: item.manage_by,
        item_category_id: item.asset_id,
        item_name: `${item.item_name} | ${item.item_code} | ${item.MASTER_ITEM_ITEMTYPE?.itemType || ''} | ${item.manage_by}`
      }));
      
      // Default first row
      if (this.items.length === 0) {
        this.addRow();
      } else {
        this.updateFilteredItems();
      }
    });
  }

  createRow(): FormGroup {
    return this.fb.group({
      itemId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      manageBy: [''],
      item_category_id: [null],
      expiryDate: [null],
      unitPrice: [null],
      totalAmount: [0],
      serialNumbers: [[]],
      batchSerialMapped: [false],
      zone_type_id: [null],
      zone_id: [null],
      bay_id: [null],
      rack_id: [null],
      bin_id: [null]
    });
  }

  addRow(): void {
    const row = this.createRow();
    this.items.push(row);

    this.rowFilterData.set(row, {
      filteredItems: [...this.itemList],
      searchList: this.itemList.map(item => item.item_name)
    });

    this.updateFilteredItems();
  }

  removeRow(index: number): void {

    if (this.items.length <= 1) {
      return;
    }

    const row = this.items.at(index);
    this.rowFilterData.delete(row);
    this.items.removeAt(index);

    this.updateFilteredItems();
  }

  trackByControl(index: number, control: any): any {
    return control;
  }

  getFilteredItems(row: AbstractControl): any[] {
    return this.rowFilterData.get(row)?.filteredItems || [];
  }

  getItemSearchList(row: AbstractControl): string[] {
    return this.rowFilterData.get(row)?.searchList || [];
  }

  onItemSearch(filteredNames: string[], row: AbstractControl): void {
    const filteredItems = this.itemList.filter(
      item => filteredNames.includes(item.item_name)
    );

    this.rowFilterData.set(row, {
      filteredItems,
      searchList: filteredNames
    });
  }

  updateFilteredItems(): void {
    const selectedIds = this.items.controls
      .map(row => row.get('itemId')?.value)
      .filter(id => id !== null && id !== undefined);

    this.items.controls.forEach(row => {
      const currentItemId = row.get('itemId')?.value;
      const filteredItems = this.itemList.filter(item => {

        if (Number(item.id) === Number(currentItemId)) {
          return true;
        }

        return !selectedIds.some(
          selectedId =>
            Number(selectedId) === Number(item.id)
        );
      });

      this.rowFilterData.set(row, {
        filteredItems,
        searchList: filteredItems.map(
          item => item.item_name
        )
      });
    });
  }                     

  onItemChange(itemId: number, index: number): void {
    const row = this.items.at(index);

    const item = this.itemList.find(
      x => Number(x.id) === Number(itemId)
    );

    row.patchValue({
      manageBy: item ? item.manage_by : '',
      item_category_id: item ? item.item_category_id : '',
      batchSerialMapped: false,
      expiryDate: null,
      serialNumbers: [],
      unitPrice: [null],
      totalAmount: [0],
      zone_type_id: null,
      zone_id: null,
      bay_id: null,
      rack_id: null,
      bin_id: null
    });

    this.updateFilteredItems();
  }

  openBatchSerialPopup(index: number) {
    const warehouseId = this.mainForm.value.warehouse_id;
    if (!warehouseId) {
      this.toast.warning('Please select a warehouse first.');
      return;
    }

    const row = this.items.at(index);
    const itemId = row.get('itemId')?.value;
    const quantity = row.get('quantity')?.value;
    const manageBy = row.get('manageBy')?.value;

    if (!itemId) {
      this.toast.warning('Please select an item');
      return;
    }

    if (!quantity || quantity <= 0) {
      this.toast.warning('Please enter a valid quantity');
      return;
    }

    if (!manageBy) {
      this.toast.warning('Manage By not found');
      return;
    }

    const selectedItem = this.itemList.find(
      (item: any) => Number(item.id) === Number(itemId)
    );

    const existingSerialNumbers = this.getExistingSerialNumbers(index);

    const dialogRef = this.dialog.open(BatchSerialCreationComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        itemId: itemId,
        itemName: selectedItem.item_name,
        quantity: Number(quantity),
        manageBy: manageBy,
        item_category_id: selectedItem.item_category_id,
        warehouse_id: warehouseId,
        index: index,
        // Already selected data
        expiryDate: row.get('expiryDate')?.value || null,
        unitPrice: row.get('unitPrice')?.value ?? null,
        serialNumbers: row.get('serialNumbers')?.value || [],
        existingSerialNumbers,
        zone_type_id: row.get('zone_type_id')?.value || null,
        zone_id: row.get('zone_id')?.value || null,
        bay_id: row.get('bay_id')?.value || null,
        rack_id: row.get('rack_id')?.value || null,
        bin_id: row.get('bin_id')?.value || null
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Popup Result:', result);
        const quantity = Number(row.get('quantity')?.value || 0);
        const unitPrice = Number(result.unitPrice || 0);
        const itemTotal = quantity * unitPrice;

        row.patchValue({
          expiryDate: result.expiryDate,
          unitPrice: unitPrice,
          totalAmount: itemTotal,
          serialNumbers: result.serialNumbers,
          zone_type_id: result.zone_type_id,
          zone_id: result.zone_id,
          bay_id: result.bay_id,
          rack_id: result.rack_id,
          bin_id: result.bin_id
        });

        // Grand total recalculate
        this.calculateGrandTotal();

        // Optional local flag
        row.patchValue({
          batchSerialMapped: true
        });
      }
    });
  }

  calculateGrandTotal(): void {
    this.grandTotal = this.items.controls.reduce(
      (total: number, control: any) => {
        return total + Number(control.get('totalAmount')?.value || 0);
      },
      0
    );
  }

  getExistingSerialNumbers(currentIndex: number): string[] {
    const serials: string[] = [];
    this.items.controls.forEach((row, index) => {

      if (index === currentIndex) {
        return;
      }

      const rowSerials = row.get('serialNumbers')?.value || [];
      if (Array.isArray(rowSerials)) {
        rowSerials.forEach((serial: string) => {
          if (serial?.trim()) {
            serials.push(serial.trim().toLowerCase());
          }
        });
      }
    });
    return serials;
  }

  saveData(): void {
    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      return;
    }

    // Batch / Serial Mapping Validation
    const unmappedItem = this.items.controls.find(
      (row: any) => row.get('batchSerialMapped')?.value !== true
    );

    if (unmappedItem) {
      this.toast.warning('Please enter batch/serial details for all items before saving');
      return;
    }

    const formData = this.mainForm.getRawValue();

    const payload = {
      ...formData,
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      totalAmount: this.grandTotal
    };

    // console.log(payload,"___Final")
    
    this.inventoryService.insertDirectInventory(payload).subscribe((response: any) => {
      if (response) {
        this.toast.success(response.message);
        this.router.navigate(['master/inventory-management/stock-list']);
      }
    }, (err: any) => {
      this.toast.error(err.error.message)
    })
  }

}