import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.scss']
})
export class CreateVendorComponent {
  title: string;
  edited_ID: any;
  id: any;
  vendor_id: any;
  urll: string;
  urll2: string;
  data: string;
  active: boolean =false;
  status: any;
  disable: boolean=false;
  typeCheck: any;

  constructor( private route: Router,
    private vendorService: VendorManagementService,
    private activeroute: ActivatedRoute,
    private _commonService : CommonService
    ) {}

  ngOnInit(): void {

    this.vendorService.getVendorId().subscribe(
      (res: any) => {
        this._commonService?.showLoader()
        this.edited_ID = res;
      },(err:any) => {
        this._commonService?.hideLoader()
      })

    this.vendorService.getVendorTitle().subscribe(
      (res: any) => {
        this.title = res
        this._commonService?.showLoader()
      },(err:any) => {
        this._commonService?.hideLoader()
      })

      this.activeroute.queryParams.subscribe((params: any) => {
        this.id = params;
        console.log(params,'params');
        
        this.vendor_id = params.id;
        this.status =params.status;
        this.typeCheck=params?.type;
        
      });
    if(this.typeCheck || this.vendor_id){
      this.active = true;
    }
    // if (this.vendor_id) {
    //   this.active = true;
    // }
    if (!this.vendor_id) {
      this.urll = this.route.url;
      this.urll2 = this.route.url.toString();
      this.data = (this.urll2.slice(45, 60)).toUpperCase()
    } else {
      this.urll = this.route.url;
      this.urll2 = this.route.url.toString();
      this.data = (this.urll2.slice(45, 58)).toUpperCase()
    }
    
  }

  url(elite: any) {
    this.data = elite
    
  }


  goToBasicDetails(title: string) {
    this.title = title;
    if(this.typeCheck === "View"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/basic-details'], { queryParams: { id:this.vendor_id,type:"View" } }) :null

    }else if(this.typeCheck === "Edit"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/basic-details'], { queryParams: { id:this.vendor_id,type:"Edit" } }) :null

    }else if(this.vendor_id){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/basic-details'], { queryParams: { id:this.vendor_id} }) :null

    }
     else{
    this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/basic-details'], { queryParams: { id: this.vendor_id } }) :null
}
  };

  goToBankDetails(title: string) {
    this.title = title
    if(this.typeCheck === "View"){
     this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/bank-details'], { queryParams: { id: this.vendor_id,type:"View"} }) :null
       }else if(this.typeCheck === "Edit"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/bank-details'], { queryParams: { id: this.vendor_id,type:"Edit"} }) :null
      } else if(this.vendor_id){
        this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/bank-details'], { queryParams: { id:this.vendor_id} }) :null
  
      }
     else{
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/bank-details'], { queryParams: { id: this.vendor_id} }):null
     }
  };
  goToAddressDetails(title: string) {
    this.title = title
    if(this.typeCheck === "View"){
     this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/address'], { queryParams: { id: this.vendor_id,type:"View"} }) :null
       }else if(this.typeCheck === "Edit"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/address'], { queryParams: { id: this.vendor_id,type:"Edit"} }) :null
      } else if(this.vendor_id){
        this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/address'], { queryParams: { id:this.vendor_id} }) :null
  
      }
     else{
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/address'], { queryParams: { id: this.vendor_id} }):null
     }
  };

  goToDocumentDetails(title: string) {
    this.title = title;
    if(this.typeCheck === "View"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/documents'], { queryParams: {id: this.vendor_id,type:"View"} }):null

    }else if(this.typeCheck === "Edit"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/documents'], { queryParams: {id: this.vendor_id,type:"Edit"} }):null

    }
    
    else{
    this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/documents'], { queryParams: { id: this.vendor_id } }):null

    }
  };

  goTopayble(title: string) {
    this.title = title;

    if(this.typeCheck === "View"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/account-payble'], { queryParams: { id:this.vendor_id,type:"View"} }):null

    }  else if(this.typeCheck === "Edit"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/account-payble'], { queryParams: { id:this.vendor_id,type:"Edit"} }):null
  
    }
    else {
    this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/account-payble'], { queryParams: { id: this.vendor_id } }):null

    }
  };

  gotoTdsSection(title:string){
    this.title = title;

    if(this.typeCheck === "View"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/tds-sections'], { queryParams: { id:this.vendor_id,type:"View"} }):null

    }  else if(this.typeCheck === "Edit"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/tds-sections'], { queryParams: { id:this.vendor_id,type:"Edit"} }):null
  
    }
    else {
    this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/tds-sections'], { queryParams: { id: this.vendor_id } }):null

    }
  }
  gotoAdvanceAmountSection(title:string){
    this.title = title;

    if(this.typeCheck === "View"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/vendor-advance-amount'], { queryParams: { id:this.vendor_id,type:"View"} }):null

    }  else if(this.typeCheck === "Edit"){
      this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/vendor-advance-amount'], { queryParams: { id:this.vendor_id,type:"Edit"} }):null
  
    }
    else {
    this.vendor_id? this.route.navigate(['master/vendor/vendor-list/create-vendor/vendor-advance-amount'], { queryParams: { id: this.vendor_id } }):null

    }
  }
}
