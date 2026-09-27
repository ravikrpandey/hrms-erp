import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PurchaseRequestService } from "../../../../@shared/services/purchase-request.service";
import * as moment from "moment";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { getCurrencySymbol } from '@angular/common';

@Component({
  selector: 'app-shipping-update',
  templateUrl: './shipping-update.component.html',
  styleUrls: ['./shipping-update.component.scss']
})
export class ShippingUpdateComponent implements OnInit {
  shippingStatus: string;
  frmShipmentView: FormGroup;
  items: any = [];
  documents: any = [];
  currencySymbols: string = '₹';
  currencyCode: string = 'INR';
  constructor(
    private prService: PurchaseRequestService,
    public dialogRef: MatDialogRef<ShippingUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private fb: FormBuilder
  ) {
    this.shippingStatus = data.shipping_status || '';
  }
  ngOnInit() {
    this.frmShipmentView = this.fb.group({
      po_no: [],
      vendor: [],
      shipment_type: [],
      transport_mode: [],
      shipment_date: [],
      invoice_amount: [],
      shiped_no: [],
      expected_delivery_date: [],
      freight_charges: [''],
      loading_unloading_charges: [''],
      cha_service_charges: [''],
      cha_other_charges: [''],
      buyer_remark: ['', Validators.required]

    })
    this.viewShipment(this.data.id);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  patchValue(data: any) {
    let transMode = '';
    if (data.roadDetails) {
      transMode = 'Road'
    } else if (data.courierDetails) {
      transMode = 'Courier'
    } else if (data.railDetails) {
      transMode = 'Rail'
    } else if (data?.seaDetails) {
      transMode = 'Sea'
    } else if (data?.airDetails) {
      transMode = 'Air'
    }
    this.frmShipmentView.patchValue({
      po_no: data.po_number,
      vendor: data.vendor_name,
      shipment_type: data.vendor_category,
      transport_mode: transMode,
      shipment_date: data.shipment_date,
      expected_delivery_date: data.expected_arrival,
      invoice_amount: data.invoice_amount,
      shiped_no: data.shiped_no,
    })
  }
  advance_amount:any;
  viewShipment(id: any) {
    this.prService.getShippingAlertHistory(id).subscribe({
      next: (res: any) => {
        console.log('=====>', res)
        const currencyData = res.data?.purchaseOrder?.MASTER_CURRENCY_CONVERT || res.data?.vendor?.MASTER_CURRENCY_CONVERT;
        this.currencySymbols = getCurrencySymbol(
          currencyData?.symbols || 'INR',
          'wide'
        );
        this.currencyCode = currencyData?.Currency_Type || 'INR';

        this.items = res.data?.items;
        this.advance_amount = res.data.vendor?.advance_amount
        this.documents = res.data?.documents.map((doc: any) => {

          const fileUrl = environment.servralUrl + '/uploaded_files/cha_documents/' + doc.document_name;
          const ext = doc.document_name.split('.').pop().toLowerCase();

          let icon = 'insert_drive_file';

          if (['pdf'].includes(ext)) icon = 'picture_as_pdf';
          else if (['xls', 'xlsx', 'csv'].includes(ext)) icon = 'table_chart';
          else if (['doc', 'docx'].includes(ext)) icon = 'description';
          else if (['jpg', 'jpeg', 'png'].includes(ext)) icon = 'image';

          return {
            ...doc,
            document_url: fileUrl,
            extension: ext,
            icon: icon
          };

        });

        this.patchValue(res.data)
      }, error(err) {
        console.log('errr=>', err)
      },
    })
  }
  viewDocument(url: string) {
  window.open(url, '_blank');
}

preventInvalidKeys(event: KeyboardEvent) {
  if (['e', 'E', '+', '-'].includes(event.key)) {
    event.preventDefault();
  }
}

downloadDocument(url: string) {

  const link = document.createElement('a');
  link.href = url;
  link.download = '';
  link.target = '_blank';
  link.click();

}
  buyerAction(status: any) {
    const freightControl = this.frmShipmentView.get('freight_charges');
    const loadingControl = this.frmShipmentView.get('loading_unloading_charges');
    const chaOtherControl = this.frmShipmentView.get('cha_other_charges');
    const cha_service_charges = this.frmShipmentView.get('cha_service_charges');

    if (this.frmShipmentView.value.shipment_type === 'Domestic' && status === 'APPROVED') {
      freightControl?.setValidators([Validators.required]);
      loadingControl?.setValidators([Validators.required]);
      chaOtherControl?.setValidators([Validators.required]);
      cha_service_charges?.setValidators([Validators.required]);
    } else {
      freightControl?.clearValidators();
      loadingControl?.clearValidators();
      chaOtherControl?.clearValidators();
      cha_service_charges?.clearValidators();
    }

    freightControl?.updateValueAndValidity();
    loadingControl?.updateValueAndValidity();
    chaOtherControl?.updateValueAndValidity();
    cha_service_charges?.updateValueAndValidity();

    if (this.frmShipmentView.invalid) {
      this.frmShipmentView.markAllAsTouched();
      this.toaster.warning('Please fill all mandatory fields!');
      return;
    }
    
    if (status) {
      const data = {
        ...this.frmShipmentView.value,
        buyer_status: status,
        buyer_remark: this.frmShipmentView.value.buyer_remark?.trim()
      };
      this.prService.updateBuyerStatus(this.data.id, data).subscribe(
        (response: any) => {
          this.toaster.success(response.message)
          this.dialogRef.close(data);
        },
        (error: any) => {
          console.error('Error updating shipping status:', error);
        }
      );
    }
  }
}
