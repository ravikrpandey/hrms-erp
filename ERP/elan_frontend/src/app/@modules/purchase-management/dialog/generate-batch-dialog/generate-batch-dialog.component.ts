import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { GrnServiceService } from '../../services/grn-service.service';

@Component({
  selector: 'app-generate-batch-dialog',
  templateUrl: './generate-batch-dialog.component.html',
  styleUrls: ['./generate-batch-dialog.component.scss'],
})
export class GenerateBatchDialogComponent implements OnInit {
  batachSerialform: FormGroup;
  today: Date = new Date();

  constructor(
    private _GrnService: GrnServiceService,
    public dialog: MatDialogRef<GenerateBatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private toasterService: ToastrService,
    private _active: ActivatedRoute,
  ) {
    this.batachSerialform = _fb.group({
      batchNo: new FormControl(),
      batchType: new FormControl(),
      expiryDate: new FormControl(this.today, [Validators.required]),
      po_item_id: new FormControl(),
      serialNoData: new FormArray([
        new FormGroup({
          Item_name: new FormControl(this.data.formData.item_name),
          itemSerialNo: new FormControl(''),
          itemStatus: new FormControl('SELECTED'),
          item_id: new FormControl(this.data.item_id.item_id),
          po_item_id: new FormControl(this.data.item_id.po_item_id),
        }),
      ]),
    });

    // Batch No automatically generate
    this.createCode();
  }

  get itemsFormArray() {
    return this.batachSerialform.get('serialNoData') as FormArray;
  }

  po_id: any;
  invoice_qty: any;
  invoice_qtyControls: number = 0;
  getAllGrnItems: any;
  grn_item_id: any;

  ngOnInit(): void {
    this._active.queryParams.subscribe((res: any) => {
      this.po_id = res.po_id;
    });
    // this.rcvd_qty = +this.data.formData?.rcvd_qty + (this.data.item_id?.MASTER_ITEM?.rejectedCount || 0);
    this.invoice_qtyControls = +this.data.formData?.rcvd_qty;
    for (let i = 0; i < this.invoice_qtyControls - 1; i++) {
      let data = this._fb.group({
        Item_name: new FormControl(this.data.formData.item_name),
        itemSerialNo: new FormControl(),
        itemStatus: new FormControl('SELECTED'),
        item_id: new FormControl(this.data.item_id.item_id),
        po_item_id: new FormControl(this.data.item_id.po_item_id),
      });
      this.itemsFormArray.push(data);
    }
    if (
      this.data.formData.manage_by == 'S.No. Only' &&
      this.data.formData.status == 'partial-list'
    ) {
      this._GrnService
        .getByIdItem(this.data.item_id.grn_item_id, this.data.status)
        .subscribe((resp: any) => {
          this.getAllGrnItems = resp.data?.itemList;
          this.grn_item_id = resp.data.grn_item_id;
          this.batachSerialform.patchValue({
            batchNo: resp.data.batchNo,
            expiryDate: resp.data.expiryDate,
          });
          for (let i = 0; i < this.getAllGrnItems.length; i++) {
            const formGroup = this.itemsFormArray.at(i) as FormGroup;
            if (formGroup) {
              formGroup.patchValue({
                itemStatus: this.getAllGrnItems[i].itemStatus,
                itemSerialNo: this.getAllGrnItems[i].itemSerialNo,
              });
            } else {
              this.itemsFormArray.push(
                this._fb.group({
                  itemStatus: this.getAllGrnItems[i].itemStatus,
                  itemSerialNo: this.getAllGrnItems[i]?.itemSerialNo,
                }),
              );
            }
          }
        });
    }

    // edit partial data

    if (this.data.formData.status == 'partial-list') {
      this._GrnService
        .getByIdItem(this.data.item_id.grn_item_id, this.data.status)
        .subscribe((resp: any) => {
          console.warn(resp, 'fered');
          if (resp.data.batchType == 'Batch Only') {
            this.batachSerialform.patchValue({
              expiryDate: resp.data.expiryDate,
              batchNo: resp.data.batchNo,
            });
          }
        });
    }
  }

  hasDuplicateSerialNo(items: any): boolean {
    const serialNos = items.map((item: any) => item.itemSerialNo);
    const uniqueSerialNos = new Set(serialNos);
    return uniqueSerialNos.size !== serialNos.length;
  }

  get serialNoDataControls() {
    return (this.batachSerialform.get('serialNoData') as FormArray).controls;
  }

  ngSubmitData(mydata: any) {
    if (this.data.item_id?.manage_by == 'S.No. Only') {
      this.serialNoDataControls.forEach((control) => {
        const itemStatus = control.get('itemStatus')?.value;
        if (itemStatus === 'NOT RECEIVED') {
          control.get('itemSerialNo')?.clearValidators();
        } else {
          control.get('itemSerialNo')?.setValidators([Validators.required]);
        }
        control.get('itemStatus')?.setValidators([Validators.required]);
        control.get('itemSerialNo')?.updateValueAndValidity();
        control.get('itemStatus')?.updateValueAndValidity();
      });
    }
    this.batachSerialform.markAllAsTouched();

    if (this.batachSerialform.invalid) {
      this.toasterService.error('Please complete all required fields');
      return;
    }

    const data = {
      invoice_qty: this.data.formData.invoice_qty,
      receiveQty: Number(this.data.formData.rcvd_qty),
      rejectQty: this.data?.formData?.reject_qty,
      batchType: this.data.item_id?.manage_by,
      batchNo: mydata.value.batchNo,
      po_qty: this.data?.formData?.po_qty,
      total_mvp: this.data?.formData?.amount,
      amount: this.data?.formData?.total_amount,
      expiryDate: moment(mydata.value.expiryDate).format('YYYY-MM-DD'),
      po_item_id: this.data.item_id.po_item_id,
      grn_item_id: this.data.item_id.grn_item_id,
      item_id: this.data.item_id.item_id,
      // remaining_qty: ,
      // remaining_qty: this.data.formData.remaining_qty,
      final_reject: this.data.formData.final_reject,
      item: mydata.value.serialNoData,
      claim_qty: this.data?.formData?.claim_qty,
    };
    if (this.data.item_id?.manage_by == 'Batch Only') {
      delete data.item;
    }

    if (this.data.item_id?.manage_by == 'S.No. Only') {
      let rejectQty = 0;
      let receiveQty = 0;
      data?.item?.map((item: any) => {
        if (item?.itemStatus == 'REJECTED') {
          rejectQty = rejectQty + 1;
        }
        if (item?.itemStatus == 'SELECTED') {
          receiveQty = receiveQty + 1;
        }
      });
      data.rejectQty = rejectQty;
      data.receiveQty = receiveQty;
    }

    if (this.data.formData.status == 'partial-list') {
      // Update existing item
      this._GrnService
        .updateGrnItem(this.data?.formData?.grn_item_id, data)
        .subscribe(
          (response: any) => {
            if (response) {
              this.toasterService.success('Item Data updated successfully');
              this.dialog.close(response);
            }
          },
          (err: any) => {
            this.toasterService.error(err.error.message);
          },
        );
    } else {
      // Create new item
      if (this.data.item_id?.manage_by == 'S.No. Only') {
        if (this.hasDuplicateSerialNo(data.item)) {
          this.toasterService.error('Serial No Must Be Unique For Every Item');
          return;
        }
      }

      this._GrnService.createGrnItem(data).subscribe(
        (response: any) => {
          if (response) {
            this.toasterService.success('Item Data created successfully');
            this.dialog.close(response);
          }
        },
        (err: any) => {
          this.toasterService.error(err.error.message);
        },
      );
    }
  }

  getPoListById(id: any) {
    this._GrnService.getPoListById(id).subscribe((response: any) => {
      return response;
    });
  }

  createCode() {
    this._GrnService
      .createCode(this.data.item_id.po_item_id)
      .subscribe((response: any) => {
        this.batachSerialform.patchValue({
          batchNo: response.data,
        });
      });
  }

  onStatusChange(status: string, index: number): void {
    const control = this.itemsFormArray.at(index);

    if (status === 'NOT RECEIVED') {
      control.get('itemSerialNo')?.clearValidators();
      control.get('itemSerialNo')?.setValue('');
    } else {
      control.get('itemSerialNo')?.setValidators([Validators.required]);
    }

    control.get('itemSerialNo')?.updateValueAndValidity();
  }

  editPartialData(mydata: any) {
    const data = {
      invoice_qty: this.data.formData.invoice_qty,
      receiveQty: Number(this.data.formData.rcvd_qty),
      rejectQty: this.data?.formData?.reject_qty,
      po_qty: this.data?.formData?.po_qty,
      batchType: this.data.item_id?.manage_by,
      batchNo: mydata.value.batchNo,
      expiryDate: moment(mydata.value.expiryDate).format('YYYY-MM-DD'),
      po_item_id: this.data.item_id.po_item_id,
      item_id: this.data.item_id.item_id,
      item: mydata.value.serialNoData,
      final_reject: this.data?.formData?.final_reject,
      amount: this.data?.formData?.amount,
      total_mvp: this.data?.formData?.total_amount,
    };
    if (this.data.formData?.manage_by === 'S.No. Only') {
      mydata.item = mydata.value.serialNoData;
    }
    this._GrnService
      .updateGrnItem(this.data?.formData?.grn_item_id, data)
      .subscribe(
        (response: any) => {
          if (response) {
            this.toasterService.success('Item Data updated successfully');
            this.dialog.close(response);
          }
        },
        (err: any) => {
          this.toasterService.error(err.error.message);
        },
      );
  }
}
