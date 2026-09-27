import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
export interface SerialModel {
  serial_no: string;
  batch: string;
  status: string;
  checked: boolean;
}
@Component({
  selector: 'app-serial-selection-modal',
  templateUrl: './serial-selection-modal.component.html',
  styleUrls: ['./serial-selection-modal.component.scss']
})
export class SerialSelectionModalComponent implements OnInit {
  type: boolean = false;
  serials: SerialModel[] = [];
  formData: any;
  frmReason: FormGroup;
  returnReasonList: string[] = [
    'Wrong Item',
    'Customer Rejection',
  ];
  constructor(
    public dialogRef: MatDialogRef<SerialSelectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,private toaster:ToastrService
  ) { }
  ngOnInit(): void {
    

    this.frmReason = this.fb.group({
      return_reason: [],
      remark: []
    })

    this.type = this.data?.type || false;
    
    this.serials = this.data.serials.STOCK_TRANSFER_SERIAL_NEWs.map((x: any) => ({
      serial_no: x.GRN_ITEM_STATUS.itemSerialNo,
      batch: x.GRN_ITEM_STATUS.batchNo,
      status: x.status,
      sales_order_id:this.data.serials.sales_order_id,
      soi_id:this.data.serials.id,
      sts_id:x.id,
      gis_id:x.GRN_ITEM_STATUS?.id,
      checked: false,
      return_qty:this.data.serials.return_qty,
      qty:this.data.serials.qty,
      price_per_unit:this.data?.serials?.price_per_unit,
      igst:this.data?.serials?.igst,
      item_id:this.data?.serials?.item_id,
    }));
    this.formData = this.data?.formData || null;
  }
  toggle(index: number) {
    this.data.serials[index].checked =
      !this.data.serials[index].checked;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    const selected = this.serials.filter((x: any) => x.checked);
    if(this.data.serials.return_qty!=selected.length && this.type){
    this.toaster.warning(`Please select exactly ${this.data.serials.return_qty} serial number(s) for return.`);
    return;
    }
    console.log('oooooooooooooo',selected)
    this.dialogRef.close(selected);


  }
}
