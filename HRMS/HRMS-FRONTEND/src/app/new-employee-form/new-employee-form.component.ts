import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpRegistrationService } from '../@shared/services/emp-registration.service';

@Component({
  selector: 'app-new-employee-form',
  templateUrl: './new-employee-form.component.html',
  styleUrls: ['./new-employee-form.component.scss']
})
export class NewEmployeeFormComponent {
  
  active: boolean = false;
  id: any;
  employeId: any;
  data: any;
  urll: any;
  urll2: any
  title: string = 'BASIC-DETAILS'

  edited_ID: any;
  constructor(private activeroute: ActivatedRoute, private route: Router, private _empService: EmpRegistrationService,) { }
  ngOnInit(): void {
    this._empService.getEmpId().subscribe(
      (res: any) => {
        console.log(res,"goToBasicDgetails")
        this.edited_ID = res
        console.log(this.edited_ID, 'eee');
        
      })

    this._empService.getEmpTitle().subscribe(
      (res: any) => {
        console.log(res,"goToBasicDgetails2")
        this.title = res
      })

    this.activeroute.queryParams.subscribe(params => {
      this.employeId = ''
      console.log(params,"goToBasicDgetails3")
      let id = localStorage.getItem('employee_id')
      console.log(id, 'dd');
      
      if (id) {        
        this.employeId = id
      }else{
        this.id = params;
        this.employeId = this.id?.condidateId
      }
      
    })
    if (this.employeId) {
      this.active = true;
      this.edited_ID=this.employeId
      console.log(this.edited_ID, 'afrer');
      
    }
  //   if (!this.employeId) {
  //     this.urll = this.route.url;
  //     this.urll2 = this.route.url.toString();
  //     this.data = (this.urll2.slice(45, 60)).toUpperCase()
  //   } else {
  //     this.urll = this.route.url;
  //     this.urll2 = this.route.url.toString();
  //     this.data = (this.urll2.slice(45, 58)).toUpperCase()
  //   }
    
  // }

  // url(elite: any) {
  //   this.data = elite
    
  }


  goToBasicDetails(title: string) {
    console.log(this.edited_ID,"this.edited_ID")
    this.title = title
    this.route.navigate(['new-employee-form/employee-details-form'], { queryParams: { employee_id: this.edited_ID } })
  };

  goToPersonalDetails(title: string) {
    console.log(this.edited_ID,"this.edited_ID")
    this.title = title
    this.route.navigate(['new-employee-form/personal-details-form'], { queryParams: { employee_id: this.edited_ID } })
  };

  goToSalaryDetails(title: string) {
    console.log(this.edited_ID,"this.edited_ID")
    this.title = title
    this.route.navigate(['new-employee-form/previous-details-form'], { queryParams: { employee_id: this.edited_ID } })
  };

  goToPaymentDetails(title: string) {
    console.log(this.edited_ID,"this.edited_ID")
    this.title = title
    this.route.navigate(['new-employee-form/payment-details-form'], { queryParams: { employee_id: this.edited_ID } })
  };

  goToDocumentDetails(title: string) {
    console.log(this.edited_ID,"this.edited_ID")
    this.title = title
    this.route.navigate(['new-employee-form/document-details-form'], { queryParams: { employee_id: this.edited_ID } })
  };
}
