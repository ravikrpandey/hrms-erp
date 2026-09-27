import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  dataObj:any;

  constructor(private activeroute:ActivatedRoute,private _commonService:CommonService,
    private vendorService:VendorManagementService) {


  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      let vendor_id = params?.vendor_id;
      if(vendor_id){
        this.getvendordetails(vendor_id);
      }
    });
  }
  getvendordetails(id:any){
    this._commonService?.showLoader();
    this.vendorService.getByVendor(id).subscribe((res:any)=>{
      this._commonService?.hideLoader();
      if(res){
        this.dataObj=res.data?.bank_details;
      }
    },(err:any)=>{
      this._commonService?.hideLoader();
    })

    }

}
