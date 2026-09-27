import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PurchaseReturnService } from '../../../services/purchase-return.service';

@Component({
  selector: 'app-purchase-return-form',
  templateUrl: './purchase-return-form.component.html',
  styleUrls: ['./purchase-return-form.component.scss']
})
export class PurchaseReturnFormComponent implements OnInit, OnChanges {
  @Input() viewMode: 'create' | 'edit' = 'create';
  @Input() selectedReturn: any = null;
  @Input() vendorsList: any[] = [];
  @Input() grnsList: any[] = [];
  @Input() isVendor: boolean = false;
  @Input() vendorId: number | null = null;

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<{ payload: any, submitDirectly: boolean }>();

  returnForm!: FormGroup;
  filteredGrnsList: any[] = [];

  subTotal: number = 0;
  taxAmount: number = 0;
  finalAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private returnService: PurchaseReturnService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.filteredGrnsList = this.grnsList || [];
    if (this.isVendor && this.vendorId) {
      this.returnForm.get('vendor_id')?.setValue(this.vendorId);
      this.onVendorChange(this.vendorId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grnsList']) {
      this.filteredGrnsList = this.grnsList || [];
    }
    if (changes['selectedReturn'] && this.selectedReturn && this.viewMode === 'edit') {
      this.populateEditForm(this.selectedReturn);
    }
  }

  initForm() {
    this.returnForm = this.fb.group({
      vendor_id: ['', Validators.required],
      grn_id: ['', Validators.required],
      po_id: [null],
      invoice_id: [null],
      return_date: [new Date().toISOString().substring(0, 10), Validators.required],
      return_reason_id: [''],
      remarks: [''],
      items: this.fb.array([])
    });

    this.subTotal = 0;
    this.taxAmount = 0;
    this.finalAmount = 0;
  }

  get itemsArray() {
    return this.returnForm.get('items') as FormArray;
  }

  onVendorChange(vendorId: any) {
    this.filteredGrnsList = [];
    this.itemsArray.clear();
    this.returnForm.get('grn_id')?.setValue('');
    this.returnForm.get('po_id')?.setValue(null);
    this.returnForm.get('invoice_id')?.setValue(null);

    if (vendorId) {
      this.returnService.getGrnsByVendor(vendorId).subscribe((res: any) => {
        if (res.code === 200) {
          this.filteredGrnsList = res.data;
          // In edit mode, we want to make sure the selected return's GRN ID is preserved
          if (this.selectedReturn && this.viewMode === 'edit') {
            this.returnForm.get('grn_id')?.setValue(this.selectedReturn.grn_id);
          }
        }
      });
    }
  }

  onGrnChange(grnId: any) {
    this.itemsArray.clear();
    if (!grnId) return;

    const selectedGrn = this.filteredGrnsList.find(g => g.id === grnId);
    if (selectedGrn) {
      this.returnForm.get('po_id')?.setValue(selectedGrn.po_Id || null);
      this.returnForm.get('invoice_id')?.setValue(selectedGrn.invoice_id || null);
    }

    this.returnService.getGrnItemsForReturn(grnId).subscribe((res: any) => {
      if (res.code === 200 && res.data.length > 0) {
        res.data.forEach((item: any) => {
          this.itemsArray.push(this.fb.group({
            grn_item_id: [item.grn_item_id],
            item_id: [item.item_id],
            item_name: [item.item_name],
            item_code: [item.item_code],
            manage_by: [item.manage_by],
            received_qty: [item.received_qty],
            already_returned_qty: [item.already_returned_qty],
            remaining_qty: [item.remaining_qty],
            available_stock: [item.available_stock],
            return_qty: [0, [Validators.required, Validators.min(0), Validators.max(item.remaining_qty)]],
            rate: [item.rate],
            tax_percent: [item.tax_percent],
            discount_percentage: [item.discount_percentage || 0],
            gross_rate: [item.gross_rate || item.rate],
            tax_amount: [0],
            amount: [0],
            warehouse_id: [item.warehouse_id],
            warehouse_name: [item.warehouse_name],
            zone_id: [item.zone_id],
            rack_id: [item.rack_id],
            bin_id: [item.bin_id],
            batch_no: [item.batch_no],
            serial_no: [item.serial_no],
            remarks: ['']
          }));
        });
        this.calculateFormTotals();
      } else {
        this.toast.warning("No allocable/eligible items found in this GRN.");
      }
    });
  }

  populateEditForm(data: any) {
    this.returnForm.patchValue({
      vendor_id: data.vendor_id,
      grn_id: data.grn_id,
      po_id: data.po_id,
      invoice_id: data.invoice_id,
      return_date: data.return_date,
      return_reason_id: data.return_reason_id,
      remarks: data.remarks
    });

    this.onVendorChange(data.vendor_id);

    this.itemsArray.clear();
    data.items.forEach((item: any) => {
      const isSerialOnly = item.item?.manage_by === 'S.No. Only';
      const finalReceivedQty = isSerialOnly ? 1 : item.received_qty;
      const finalAlreadyReturned = isSerialOnly ? Math.min(1, item.already_returned_qty || 0) : (item.already_returned_qty || 0);
      const remainingQty = isSerialOnly ? Math.max(0, 1 - finalAlreadyReturned) : (finalReceivedQty - finalAlreadyReturned);
      const availableStock = isSerialOnly ? 1 : finalReceivedQty;

      this.itemsArray.push(this.fb.group({
        grn_item_id: [item.grn_item_id],
        item_id: [item.item_id],
        item_name: [item.item?.item_name],
        item_code: [item.item?.item_code],
        manage_by: [item.item?.manage_by],
        received_qty: [finalReceivedQty],
        already_returned_qty: [finalAlreadyReturned],
        remaining_qty: [remainingQty],
        available_stock: [availableStock],
        return_qty: [item.return_qty, [Validators.required, Validators.min(0), Validators.max(remainingQty)]],
        rate: [item.rate],
        tax_percent: [item.tax_percent],
        discount_percentage: [item.grnItem?.PROCUREMENT_PURCHASE_ORDER_ITEM?.discount_percentage || 0],
        gross_rate: [item.grnItem?.PROCUREMENT_PURCHASE_ORDER_ITEM?.unit_price || item.rate],
        tax_amount: [item.tax_amount],
        amount: [item.amount],
        warehouse_id: [item.warehouse_id],
        warehouse_name: [item.warehouse?.name],
        zone_id: [item.zone_id],
        rack_id: [item.rack_id],
        bin_id: [item.bin_id],
        batch_no: [item.batch_no],
        serial_no: [item.serial_no],
        remarks: [item.remarks]
      }));
    });

    this.calculateFormTotals();
  }

  calculateItemTotals(index: number) {
    const itemGroup = this.itemsArray.at(index);
    const qty = parseFloat(itemGroup.get('return_qty')?.value) || 0;
    const rate = parseFloat(itemGroup.get('rate')?.value) || 0;
    const taxPercent = parseFloat(itemGroup.get('tax_percent')?.value) || 0;

    const remaining = itemGroup.get('remaining_qty')?.value || 0;
    const available = itemGroup.get('available_stock')?.value || 0;

    if (qty < 0) {
      itemGroup.get('return_qty')?.setErrors({ min: true });
    } else if (qty > remaining) {
      itemGroup.get('return_qty')?.setErrors({ exceedRemaining: true });
    } else if (qty > available) {
      itemGroup.get('return_qty')?.setErrors({ exceedAvailable: true });
    } else {
      itemGroup.get('return_qty')?.setErrors(null);
    }

    const amount = qty * rate;
    const taxAmount = amount * (taxPercent / 100);
    const totalAmount = amount + taxAmount;

    itemGroup.get('tax_amount')?.setValue(parseFloat(taxAmount.toFixed(2)));
    itemGroup.get('amount')?.setValue(parseFloat(totalAmount.toFixed(2)));

    this.calculateFormTotals();
  }

  calculateFormTotals() {
    let subTotal = 0;
    let taxAmount = 0;
    let finalAmount = 0;

    this.itemsArray.controls.forEach(control => {
      const qty = parseFloat(control.get('return_qty')?.value) || 0;
      const rate = parseFloat(control.get('rate')?.value) || 0;
      const taxPercent = parseFloat(control.get('tax_percent')?.value) || 0;

      const amount = qty * rate;
      const taxAmt = amount * (taxPercent / 100);

      subTotal += amount;
      taxAmount += taxAmt;
      finalAmount += (amount + taxAmt);
    });

    this.subTotal = parseFloat(subTotal.toFixed(2));
    this.taxAmount = parseFloat(taxAmount.toFixed(2));
    this.finalAmount = parseFloat(finalAmount.toFixed(2));
  }

  submitForm(submitDirectly: boolean) {
    if (this.returnForm.invalid) {
      this.toast.error("Please fill all required fields and correct invalid quantities");
      return;
    }

    const payload = this.returnForm.value;
    // Emit only item rows with return_qty > 0
    const filteredItems = payload.items.filter((item: any) => item.return_qty > 0);

    if (filteredItems.length === 0) {
      this.toast.error("Please specify a return quantity greater than 0 for at least one item.");
      return;
    }

    this.onSave.emit({
      payload: {
        ...payload,
        items: filteredItems
      },
      submitDirectly
    });
  }
}
