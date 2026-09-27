import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit {
  id: any;
  asset: any;
 
  constructor(private asset_service:AssetListService,
    private activeroute:ActivatedRoute,private router:Router  ) {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      if(this.id){
        this.getAllbasicdetails();
      }
    });
  }
  ngOnInit(): void {
  
  }

getAllbasicdetails(){
  this.asset_service.getBasicDetailsForAsset(this.id).subscribe((res:any)=>{
    if(res.response){
      this.asset=res.response;
      console.log("@@@@@@@@@@@@@+++++++++++++++++++++", this.asset)
    }
 },(err:any)=>{
 })
}

poView(id:any){
  this.router.navigate(['/master/asset-management/asset-list/po-view'],{queryParams:{poid:id}})
}

}
