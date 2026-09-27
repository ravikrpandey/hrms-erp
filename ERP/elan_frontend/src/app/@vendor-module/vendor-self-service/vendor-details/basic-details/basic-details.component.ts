import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/@shared/services/common.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit {

  dataObj:any;
  loginUserDetails: any;

  constructor(private _commonService:CommonService,private vendorService:VendorManagementService) {
  }
  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.getvendordetails();
  }
  getvendordetails(){
  this._commonService?.showLoader();
  this.vendorService.getByVendor(this.loginUserDetails?.id).subscribe((res:any)=>{
    this._commonService?.hideLoader();
    if(res){
      this.dataObj=res.data;
    }
  },(err:any)=>{
    this._commonService?.hideLoader();
  })

  }
}
