import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { getCurrencySymbol } from '@angular/common';

@Component({
  selector: 'app-vendor-shipping-tracking-history',
  templateUrl: './vendor-shipping-tracking-history.component.html',
  styleUrls: ['./vendor-shipping-tracking-history.component.scss']
})
export class VendorShippingTrackingHistoryComponent {
  transport: { [key: string]: string }
  historyData:any;
  currencySymbols: string = '₹';
  currencyCode: string = 'INR';
constructor(
    private router: Router,
    private route: ActivatedRoute,
    private poService: PurchaseRequestService,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(){
    console.log("Data ==========>",this.data);
         
        this.getShippingAlertHistory(this.data.id);        
     
  }
  getShippingAlertHistory(id:any) {
    this.poService.getShippingAlertHistory(id).subscribe((res: any) => {
      this.historyData = res.data;
      const currencyData = res.data?.purchaseOrder?.MASTER_CURRENCY_CONVERT || res.data?.vendor?.MASTER_CURRENCY_CONVERT;
      this.currencySymbols = getCurrencySymbol(
        currencyData?.symbols || 'INR',
        'wide'
      );
      this.currencyCode = currencyData?.Currency_Type || 'INR';
    },
      ((err: any) => {
        // this.toast.error(`${err.error.message}`);
      })
    )
  }
  
  expandedCard: string | null = null;
get transportDetails(): any {

  switch (this.historyData?.mode) {

    case 'ROAD':
      return this.historyData?.roadDetails || {};

    case 'COURIER':
      return this.historyData?.courierDetails || {};

    case 'AIR':
      return this.historyData?.airDetails || {};

    case 'SEA':
      return this.historyData?.seaDetails || {};

    case 'RAIL':
      return this.historyData?.railDetails || {};

    default:
      return {};
  }
}

getStatusClass(status: string): string {

  if (!status) return '';

  return 'status-' + status
    .toLowerCase()
    .replaceAll('_', '-');
}
formatStatus(status: string): string {

  if (!status) return '';

  return status
    .replaceAll('_', ' ')
    .toUpperCase();
}
labelMap: any = {

  // COMMON
  // entryType: 'Entry Type',

  // COURIER
  courier_name: 'Courier Name',
  awb_number: 'AWB Number',
  tracking_url: 'Tracking URL',
  remarks: 'Remarks',

  // ROAD
  vehicle_number: 'Vehicle Number',
  driver_name: 'Driver Name',
  driver_mobile: 'Driver Mobile',
  transporter_name: 'Transporter Name',
  lr_number: 'LR Number',

  // AIR
  airway_bill_no: 'Airway Bill No',
  flight_number: 'Flight Number',
  airport_name: 'Airport Name',

  // SEA
  vessel_name: 'Vessel Name',
  container_number: 'Container Number',
  port_name: 'Port Name',

  // RAIL
  train_number: 'Train Number',
  wagon_number: 'Wagon Number',
  railway_receipt_no: 'Railway Receipt No'
};
  toggleCard(id: string) {
    this.expandedCard = this.expandedCard === id ? null : id;
  }

 objectKeys(obj: any): string[] {
  return Object.keys(obj)
}
}
