import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-po-view',
  templateUrl: './po-view.component.html',
  styleUrls: ['./po-view.component.scss']
})
export class PoViewComponent implements OnInit {
  poid: any;
  data: any;


  constructor(private activeroute:ActivatedRoute,
              private asset_service:AssetListService,
              private location: Location
  ) {
     this.activeroute.queryParams.subscribe((param:any)=>{
      
      this.poid=param.poid;
     })
  }
  ngOnInit(): void {
   this.getAllPoDetails();
  }


  getAllPoDetails(){
    if(this.poid){
       this.asset_service.getAllPoDetails(this.poid).subscribe((res:any)=>{
        
        if(res.data){
           this.data=res.data
        }
       },(err:any)=>{

       })
    }
  }
  goBack(): void {
    this.location.back(); 
  }
}
