import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InventoryManagementService } from '../../inventory-management.service';

@Component({
  selector: 'app-serial-selection-dialog',
  templateUrl: './serial-selection-dialog.component.html',
  styleUrls: ['./serial-selection-dialog.component.scss']
})
export class SerialSelectionDialogComponent implements OnInit {
  isLoading = false;
  serials: any[] = [];
  batches: any[] = [];
  selectedSerials: any[] = [];
  selectedBatch: string | null = null;
  manageBy: string = 'Batch Only';
  activeTab: string = 'batch'; // 'serial' | 'batch'
  requiredQty: number = 0;
  isReadOnly = false;

  constructor(
    public dialogRef: MatDialogRef<SerialSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventoryService: InventoryManagementService,
    private toastr: ToastrService
  ) {
    this.isReadOnly = data.isReadOnly || false;
    this.manageBy = data.manageBy || 'Batch Only';
    this.requiredQty = data.quantity || 0;
    this.selectedBatch = data.batch_no || null;
    if (data.serial_ids && Array.isArray(data.serial_ids)) {
      this.selectedSerials = [...data.serial_ids];
    }
    // Set initial active tab from manageBy
    this.activeTab = this.manageBy === 'S.No. Only' ? 'serial' : 'batch';
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.inventoryService.getAvailableSerialsAndBatches(
      this.data.item_id,
      this.data.warehouse_id,
      this.data.row_id,
      this.data.shelf_id,
      this.data.section_id,
      this.data.stock_transfer_id
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.data) {
          this.serials = res.data.serials || [];
          this.batches = res.data.batches || [];

          // Pre-check selected serials
          this.serials.forEach(s => {
            s.checked = this.selectedSerials.includes(s.grn_item_status_id);
          });

          // Ensure all previously selected serials are added to the list and checked
          if (this.data.serial_details && Array.isArray(this.data.serial_details)) {
            this.data.serial_details.forEach((sd: any) => {
              if (!this.serials.some(s => s.grn_item_status_id === sd.grn_item_status_id)) {
                this.serials.push({
                  grn_item_status_id: sd.grn_item_status_id,
                  itemSerialNo: sd.itemSerialNo || sd.serial_no || 'Unknown',
                  batchNo: sd.batchNo || sd.batch_no || 'N/A',
                  checked: true
                });
              }
            });
          }

          // If selectedBatch is present but not in batches, append it
          if (this.selectedBatch && !this.batches.some(b => b.batchNo === this.selectedBatch)) {
            this.batches.push({
              batchNo: this.selectedBatch,
              availableQty: '0.00'
            });
          }

          // Auto-detect the right tab based on actual available data
          // If manageBy says serial but no serials found (only batches), switch to batch tab
          if (this.manageBy === 'S.No. Only' && this.serials.length === 0 && this.batches.length > 0) {
            this.activeTab = 'batch';
          }
          // If manageBy says batch but no batches found (only serials), switch to serial tab
          if (this.manageBy === 'Batch Only' && this.batches.length === 0 && this.serials.length > 0) {
            this.activeTab = 'serial';
          }
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.toastr.error(err?.error?.message || 'Failed to fetch available items');
      }
    });
  }

  get hasSerials(): boolean {
    return this.serials.length > 0;
  }

  get hasBatches(): boolean {
    return this.batches.length > 0;
  }

  get showTabs(): boolean {
    return this.hasSerials && this.hasBatches;
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  onSerialChange(serial: any, event: any): void {
    if (this.isReadOnly) {
      event.preventDefault();
      serial.checked = !serial.checked;
      return;
    }
    if (event.checked) {
      if (this.selectedSerials.length >= this.requiredQty) {
        this.toastr.warning(`You can only select up to ${this.requiredQty} serial numbers.`);
        serial.checked = false;
        return;
      }
      if (!this.selectedSerials.includes(serial.grn_item_status_id)) {
        this.selectedSerials.push(serial.grn_item_status_id);
      }
    } else {
      const index = this.selectedSerials.indexOf(serial.grn_item_status_id);
      if (index > -1) {
        this.selectedSerials.splice(index, 1);
      }
    }
  }

  selectBatch(batch: any): void {
    if (this.isReadOnly) return;
    if (batch.availableQty < this.requiredQty) {
      this.toastr.warning(`Batch ${batch.batchNo} has only ${batch.availableQty} units available.`);
    }
    this.selectedBatch = batch.batchNo;
  }

  save(): void {
    if (this.activeTab === 'serial') {
      if (this.selectedSerials.length !== this.requiredQty) {
        this.toastr.error(`Please select exactly ${this.requiredQty} serial numbers. Currently selected: ${this.selectedSerials.length}`);
        return;
      }
      this.dialogRef.close({
        serial_ids: this.selectedSerials,
        batch_no: null
      });
    } else {
      if (!this.selectedBatch) {
        this.toastr.error('Please select a batch.');
        return;
      }
      this.dialogRef.close({
        serial_ids: [],
        batch_no: this.selectedBatch
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
