import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {
  loginUserDetails: any;
  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
  }

}
