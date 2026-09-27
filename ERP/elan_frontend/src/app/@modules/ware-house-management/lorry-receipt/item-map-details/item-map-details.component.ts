import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';

@Component({
  selector: 'app-item-map-details',
  templateUrl: './item-map-details.component.html',
  styleUrls: ['./item-map-details.component.scss']
})
export class ItemMapDetailsComponent {

  sale_orders: any[] = [];
  selectAllChecked = false;
  usedSerials = new Set<number>();
  usedBatchQty = new Map<number, number>();

  constructor(
    private dialogRef: MatDialogRef<ItemMapDetailsComponent>,
    private inventoryService: InventoryManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails() {
    this.inventoryService.getMapItemDetailsById(this.data.vehicle_planing_id).subscribe(
        (next: any) => {

          this.sale_orders = (next.data || []).map((item: any) => {

            // Batch selected quantity received from the backend
            const selectedBatches = (item.serialBatch || [])
              .filter(
                (batch: any) => Number(batch.selected_qty || 0) > 0
              )
              .map((batch: any) => ({
                id: batch.id,
                batchNo: batch.batchNo,
                qty: Number(batch.selected_qty)
              }));

            return {
              ...item,

              quantity: Number(item.quantity),

              // Serial selection
              selectedSerials: (item.serialBatch || []).filter(
                (serial: any) => Number(serial.isSelected) === 1
              ),

              // Load the saved batch selection here
              selectedBatches: selectedBatches,

              // Maintain the order of the existing selected batches
              batchSelectionOrder: selectedBatches.map(
                (batch: any) => batch.id
              )
            };
          });

          // =========================
          // Global used serials
          // =========================

          this.usedSerials.clear();

          this.sale_orders.forEach(item => {
            item.selectedSerials.forEach((serial: any) => {
              this.usedSerials.add(serial.id);
            });
          });

          // =========================
          // Global batch usage
          // =========================

          this.usedBatchQty.clear();

          this.sale_orders.forEach(item => {

            if (this.isBatchItem(item)) {

              this.addBatchUsage(item);

            }

          });

          // =========================
          // Select All state
          // =========================

          this.selectAllChecked = this.sale_orders.every(
            item =>
              this.getSelectedCount(item) === Number(item.quantity)
          );

        },
        (error: any) => {}
      );
  }

  getTotalItems(): number {
    return this.sale_orders.length;
  }

  getTotalQty(): number {
    return this.sale_orders.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }

  toggleSerial(item: any, serial: any) {

    const index = item.selectedSerials.findIndex(
      (x: any) => x.id === serial.id
    );

    if (index > -1) {

      item.selectedSerials.splice(index, 1);
      this.usedSerials.delete(serial.id);

    } else {
      // Already selected in another SO
      if (this.usedSerials.has(serial.id)) {
        return;
      }

      if (item.selectedSerials.length >= item.quantity) {
        return;
      }

      item.selectedSerials.push(serial);
      this.usedSerials.add(serial.id);
    }

    // Auto update checkbox state
    this.selectAllChecked = this.sale_orders.every(
      order => order.selectedSerials.length === Number(order.quantity)
    );
  }

  isSelected(item: any, serial: any): boolean {
    return item.selectedSerials.some(
      (x: any) => x.id === serial.id
    );
  }

  getSelectedCount(item: any): number {
    if(this.isBatchItem(item)){
      return this.getSelectedBatchQty(item);
    }
    return item.selectedSerials.length;
  }

  isItemCompleted(item: any): boolean {
    if(this.isBatchItem(item)){
      return this.getSelectedBatchQty(item)==item.quantity;
    }
    return item.selectedSerials.length === item.quantity;
  }

  toggleSelectAll() {
    this.usedSerials.clear();
    this.usedBatchQty.clear();
    if (this.selectAllChecked) {

      this.sale_orders.forEach(item => {
        if (this.isBatchItem(item)) {
          this.autoSelectBatch(item);
        } else {
        item.selectedSerials = [];
        for (const serial of item.serialBatch || []) {
          if (item.selectedSerials.length >= item.quantity) {
            break;
          }

          if (!this.usedSerials.has(serial.id)) {
            item.selectedSerials.push(serial);
            this.usedSerials.add(serial.id);
          }
        }
      }

      });

    } else {

      this.sale_orders.forEach(item => {
        if (this.isBatchItem(item)) {
          item.batchSelectionOrder = [];
          item.selectedBatches = [];
        } else {
          item.selectedSerials = [];
        }
      });
      this.usedSerials.clear();
    }
  }

  autoSelectBatch(item: any) {
    item.batchSelectionOrder = [];

    let remaining = Number(item.quantity);

    for (const batch of item.serialBatch || []) {

      if (remaining <= 0) {
        break;
      }

      if (Number(batch.available_qty) <= 0) {
        continue;
      }

      const available = this.getRemainingQty(batch);

      if (available <= 0) {
        continue;
      }

      item.batchSelectionOrder.push(batch.id);

      remaining -= Math.min(
        remaining,
        available
      );
    }

    // Allocation according to current global usage
    this.allocateBatch(item);

    // Add this item's allocation to the global batch usage
    this.addBatchUsage(item);
  }

  isBatchItem(item:any){
   return item.manage_by=="Batch Only";
  }

  getSelectedBatchQty(item:any){
   return item.selectedBatches.reduce((a:any,b:any)=>a+Number(b.qty),0);
  }

  isBatchSelected(item: any, batch: any): boolean {
    return item.selectedBatches.some(
      (x: any) => x.id === batch.id
    );
  }

  toggleBatch(item: any, batch: any) {
    if (!item.batchSelectionOrder) {
      item.batchSelectionOrder = [];
    }

    const index = item.batchSelectionOrder.findIndex(
      (id: number) => id === batch.id
    );

    if (index > -1) {
      item.batchSelectionOrder.splice(index, 1);
    } else {
      item.batchSelectionOrder.push(batch.id);
    }
    this.recalculateAllBatchAllocations();
  }

  recalculateAllBatchAllocations() {
    // Global usage fresh start
    this.usedBatchQty.clear();

    // Clear the previous allocations for all Batch Only SOs
    for (const item of this.sale_orders) {
      if (this.isBatchItem(item)) {
        item.selectedBatches = [];
      }
    }

    // Perform fresh allocation according to SO order
    for (const item of this.sale_orders) {
      if (!this.isBatchItem(item)) {
        continue;
      }

      // Allocation according to current global usage
      this.allocateBatch(item);

      // Add this item's allocation to the global batch usage
      this.addBatchUsage(item);
    }
  }

  allocateBatch(item: any) {
    item.selectedBatches = [];

    let remaining = Number(item.quantity);

    for (const batchId of item.batchSelectionOrder || []) {

      if (remaining <= 0) {
        break;
      }

      const batch = item.serialBatch.find(
        (x: any) => Number(x.id) === Number(batchId)
      );

      if (!batch) {
        continue;
      }

      // Only the used quantity from previous SOs will be considered here
      const available = this.getRemainingQty(batch);

      if (available <= 0) {
        continue;
      }

      const qty = Math.min(
        remaining,
        available
      );

      item.selectedBatches.push({
        id: batch.id,
        batchNo: batch.batchNo,
        qty: qty
      });

      remaining -= qty;
    }
  }

  addBatchUsage(item: any) {
    for (const batch of item.selectedBatches || []) {

      const batchId = Number(batch.id);

      const currentUsed =
        this.usedBatchQty.get(batchId) || 0;

      this.usedBatchQty.set(
        batchId,
        currentUsed + Number(batch.qty)
      );
    }
  }

  getRemainingQty(batch: any): number {
    const batchId = Number(batch.id);

    const used = this.usedBatchQty.get(batchId) || 0;

    return Math.max(
      0,
      Number(batch.available_qty) - used
    );
  }

  getUsedQty(item: any, batch: any): number {
    const selected = item.selectedBatches.find(
      (x: any) => x.id === batch.id
    );
    return selected ? Number(selected.qty) : 0;
  }

  canSave(): boolean {
    return this.sale_orders.every(item=>{
      if(this.isBatchItem(item)){
        return this.getSelectedBatchQty(item)==item.quantity;
      }
      return item.selectedSerials.length==item.quantity;
    });
  }

  save() {

    if (!this.canSave()) {
      return;
    }

    const payload = [];

    for (const item of this.sale_orders) {
      if (this.isBatchItem(item)) {

        payload.push({
          vehicle_planning_id: this.data.vehicle_planing_id,
          item_id: item.item_id,
          sales_order_id: item.sales_order_id,
          batchArray: item.selectedBatches
        });

      } else {
        for (const serial of item.selectedSerials) {

          payload.push({
            vehicle_planning_id: this.data.vehicle_planing_id,
            item_id: item.item_id,
            sales_order_id: item.sales_order_id,
            serial_id: serial.id, // GRN_ITEM_STATUS => id
            serial_no: serial.itemSerialNo,
            batch_no: serial.batchNo
          });
        }
      }
    }

    this.inventoryService.saveMappedItemsSerialNo(payload).subscribe(
      (res:any)=>{
        this.dialogRef.close({status: true});
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}