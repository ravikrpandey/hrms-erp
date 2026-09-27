
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-payable',
  templateUrl: './all-payable.component.html',
  styleUrls: ['./all-payable.component.scss']
})
export class AllPayableComponent {
  active:boolean = false;

  constructor(private activeroute: ActivatedRoute, private route: Router) {

   }

   ngOnInit(): void {
    // this.active=true;
   }

  expenseInvoice(){
    this.route.navigate(['master/finance/account-payable/all-payable/expense-invoice-payble'])

  }
  
  vendorInvoice(){
    this.route.navigate(['master/finance/account-payable/all-payable/vendor-invoice-payble'])

  }
  auditorInvoice(){
    this.route.navigate(['master/finance/account-payable/all-payable/auditor-invoice-payble'])

  }

  cpInvoice(){
    this.route.navigate(['master/finance/account-payable/all-payable/cp-invoice-payble'])

  }
}
