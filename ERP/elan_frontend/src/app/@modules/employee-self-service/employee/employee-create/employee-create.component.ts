import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent {

  active: boolean = false;
  id: any;
  employeId: any;
  data: any;
  urll: any;
  urll2: any
  title: string = 'BASIC-DETAILS'
  mode: any;
  edited_ID: any;
  loginUserDetails: any;
  last_name:any = "";
  baseUrl: any;
  imagePath: any = 'assets//icons/icon_DQS/employee.png'

  constructor( private location: Location, private activeroute: ActivatedRoute, private route: Router, private _empService: EmpRegistrationService,) { 
    this.baseUrl = environment.servralUrl;
  }

  ngOnInit(): void {
    
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    if ( !(this.loginUserDetails.last_name == null || this.loginUserDetails.last_name == undefined || this.loginUserDetails.last_name == 'undefined')){
      this.last_name = this.loginUserDetails.last_name;
    }
    this._empService.getEmpId().subscribe(
      (res: any) => {
        this.edited_ID = res 
      })

    this._empService.getEmpTitle().subscribe(
      (res: any) => {
        this.title = res
      })

    this.activeroute.queryParams.subscribe(params => {
      this.id = params;
      this.employeId = this.id.employee_id
      this.mode = this.id.mode
    })
    if (this.employeId) {
      this.active = true;
      this.edited_ID=this.employeId
      
    }
    if (!this.employeId) {
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
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/basic-details'], { queryParams: { employee_id: this.edited_ID , mode: this.mode } })
  };

  goToPersonalDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/personal-details'], { queryParams: { employee_id: this.edited_ID , mode: this.mode } })
  };

  goToSalaryDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/salary-details'], { queryParams: { employee_id: this.edited_ID , mode: this.mode } })
  };

  goToPaymentDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/payment-details'], { queryParams: { employee_id: this.edited_ID , mode : this.mode } })
  };

  goToDocumentDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/document-details'], { queryParams: { employee_id: this.edited_ID , mode: this.mode } })
  };

  goToContractDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/contract-details'], { queryParams: { employee_id: this.edited_ID , mode: this.mode } })
  };
  
    
  goBack() {
    this.location.back();
  }

  onImageError(event: any) {
    event.target.src = '../../../../../../assets/profile-icon.png';
  }

}
