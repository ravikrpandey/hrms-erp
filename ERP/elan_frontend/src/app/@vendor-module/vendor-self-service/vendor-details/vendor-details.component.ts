import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {

  active: boolean = false;
  id: any;
  employeId: any;
  data: any;
  urll: any;
  urll2: any
  title: string = 'BASIC-DETAILS'
  mode: any;
  edited_ID: any;
  loginUserDetails: any;
  last_name:any = "";
  baseUrl: any;
  imagePath: any = 'assets//icons/icon_DQS/employee.png'
  /**
   *
   */
  constructor(private route:Router) {

  }
  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
  }

  goToBasicDetails(title: string) {
    this.title = title
    this.route.navigate(['/vendor/ess/vendor-details/basic-details'], { queryParams: { vendor_id: this.loginUserDetails?.id , mode: 'view' } })
  };

  goToBankDetails(title: string) {
    
    
    this.title = title
    this.route.navigate(['/vendor/ess/vendor-details/bank-details'], { queryParams: { vendor_id: this.loginUserDetails?.id, mode: 'view'} })
  };

  goTodocumentDetails(title: string) {
    this.title = title
    this.route.navigate(['/vendor/ess/vendor-details/document-details'], { queryParams: { vendor_id: this.loginUserDetails?.id, mode: 'view'} })
  };

  goToPaymentDetails(title: string) {
    this.title = title
    this.route.navigate(['/vendor/ess/vendor-details/account-details'], { queryParams: { vendor_id: this.loginUserDetails?.id, mode: 'view'} })
  };




  goBack() {

  }
}
