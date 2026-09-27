import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent {

  dataObj: any = {}; 
  baseUrl: any; 
  documents_detail: any;
  constructor(
    private activeroute: ActivatedRoute,
    private _empRegistration: EmpRegistrationService,
    

  ) {
    this.baseUrl = environment.serverUrl;
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      let employee_id = params?.employee_id;
      if(employee_id){
        this.getByIdUse(employee_id);
      }
    });

  }

  getByIdUse(id: any) {
    
    this._empRegistration.getByUserId(id).subscribe((res: any) => {
   
      this.dataObj = res.data;
this.documents_detail=res.data?.contractDetails;
    });
  }
  viewImg() {
    window.open(this.baseUrl + '/' + this.dataObj?.employee_photo, '_blank');
  }

}

