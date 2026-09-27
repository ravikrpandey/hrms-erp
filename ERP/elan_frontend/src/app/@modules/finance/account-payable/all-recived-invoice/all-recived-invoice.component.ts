import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-recived-invoice',
  templateUrl: './all-recived-invoice.component.html',
  styleUrls: ['./all-recived-invoice.component.scss']
})
export class AllRecivedInvoiceComponent {
  active:boolean = false;

  constructor(private activeroute: ActivatedRoute, private route: Router) {

   }

   ngOnInit(): void {
    // this.active=true;
   }

  expenseInvoice(){
    this.route.navigate(['master/finance/account-payable/all-recived-invoice/expense-invoice'])

  }

  vendorInvoice(){
    this.route.navigate(['master/finance/account-payable/all-recived-invoice/vendor-invoice-list'])

  }
  auditorInvoice(){
    this.route.navigate(['master/finance/account-payable/all-recived-invoice/auditor-invoice-list'])

  }
  cpInvoice(){

  }
}
