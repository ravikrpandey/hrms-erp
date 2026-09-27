import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';

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

  edited_ID: any;
  action_type: any;

  constructor(private location: Location, private activeroute: ActivatedRoute, private route: Router, private _empService: EmpRegistrationService,) { }

  ngOnInit(): void {
    this._empService.getEmpId().subscribe(
      (res: any) => {
        this.edited_ID = res
      })

    this._empService.getEmpTitle().subscribe(
      (res: any) => {
        this.title = res;
        
      })

    this.activeroute.queryParams.subscribe(params => {
      this.id = params;
      this.action_type = this.id?.action_type;
      this.employeId = this.id.employee_id

    })
    if (this.employeId) {
      this.active = true;
      this.edited_ID = this.employeId
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
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
    this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'], { queryParams: { employee_id: this.edited_ID, action_type: 'view' } })
    }
    else {
    this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'], { queryParams: { employee_id: this.edited_ID } })
    }
  };

  goToPersonalDetails(title: string) {
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/personal-details'], { queryParams: { employee_id: this.edited_ID, action_type: 'view' } })
    }
    else {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/personal-details'], { queryParams: { employee_id: this.edited_ID } })
    }
  };

  goToSalaryDetails(title: string) {
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/salary-details'], { queryParams: { employee_id: this.edited_ID, action_type: 'view' } })
    }
    else {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/salary-details'], { queryParams: { employee_id: this.edited_ID } })
    }
  };

  goToPaymentDetails(title: string) {
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/payment-details'], { queryParams: { employee_id: this.edited_ID, action_type: 'view' } })
    }
    else {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/payment-details'], { queryParams: { employee_id: this.edited_ID } })
    }
  };

  goToDocumentDetails(title: string) {
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/document-details'], { queryParams: { employee_id: this.edited_ID, action_type: 'view' } })
    }
    else {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/document-details'], { queryParams: { employee_id: this.edited_ID } })
    }
  };

  goToContractDetails(title: string) {
    console.log(this.edited_ID, "this.edited_ID")
    this.title = title
    if (this.action_type) {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/contract-details'], { queryParams: { employee_id: this.edited_ID, action_type: 'view' } })
    }
    else {
      this.route.navigate(['master/hrms/employee-master/employ/employee-create/contract-details'], { queryParams: { employee_id: this.edited_ID } })
    }
  };

  goBack() {
    this.location.back();
  }

}
