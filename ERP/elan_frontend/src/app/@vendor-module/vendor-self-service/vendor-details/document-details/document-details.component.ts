import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent {
 dataObj:any;
  baseUrl: any;

  constructor(private activeroute:ActivatedRoute,private _commonService:CommonService,
    private vendorService:VendorManagementService) {
  this.baseUrl = environment.servralUrl;

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
        this.dataObj=res.data;
      }
    },(err:any)=>{
      this._commonService?.hideLoader();
    })

    }
    viewImg(url: any) {

      window.open(this.baseUrl + '/' + url, '_blank');
    }
}
