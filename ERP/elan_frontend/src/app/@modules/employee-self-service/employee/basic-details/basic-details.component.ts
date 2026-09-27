import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss'],
})
export class BasicDetailsComponent {
  dataObj: any = {};
  baseUrl: any;
entityList: any;
  constructor(
    private activeroute: ActivatedRoute,
    private _empRegistration: EmpRegistrationService,
    

  ) {
    this.baseUrl = environment.servralUrl;
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
    });
  }
  viewImg() {
    window.open(this.baseUrl + '/' + this.dataObj?.employee_photo, '_blank');
  }

}

