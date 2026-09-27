import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { environment } from 'src/app/environments/environment';



@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.scss']
})
export class SalaryDetailsComponent{
  dataObj: any = {}; 
  baseUrl: any; 
  finacialId: string | null;
  loginUser: any;
  entity_Id: any;
  employee_id: any;
  dataBind: string;
  getHistorySalaryData: any;
  
  constructor(
    private activeroute: ActivatedRoute,
    private _empRegistration: EmpRegistrationService,
    private _empoloyeeService: EmpRegistrationService,
    

  ) {
    this.baseUrl = environment.serverUrl;
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.employee_id = params?.employee_id;
      if(this.employee_id){
        this.getByIdUse(this.employee_id);
        this.localStorage();
      }
    });

  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.finacialId = localStorage.getItem('financial_id');
    this.getHistorySalary();
  }


  getHistorySalary() {
    let data = {
      employee_id:this.employee_id ,
      entity_id: this.entity_Id,
      financial_year_id: this.finacialId,
    };
    this._empoloyeeService.getHistorySalary(data).subscribe(
      (res: any) => {
        this.getHistorySalaryData = res.data;
      },
      (err: any) => {
        if (err.error?.code === 404) {
          this.dataBind = 'Record Not Found';
        }
      }
    );
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
