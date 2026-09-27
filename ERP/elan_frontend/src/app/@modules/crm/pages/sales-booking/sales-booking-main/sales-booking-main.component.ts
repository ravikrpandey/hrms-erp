import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-booking-main',
  templateUrl: './sales-booking-main.component.html',
  styleUrls: ['./sales-booking-main.component.scss']
})
export class SalesBookingMainComponent {
  constructor(
    private route: Router
  ) {
  }

  navigate() {
    this.route.navigate(['master/purchase-main/purchase-request/create-pr'])
  }
  createSalesBooking(){
   this.route.navigate(['master', 'sales', 'quotation'], {
  queryParams: { quotationType: 'direct' }
});

  }
}
