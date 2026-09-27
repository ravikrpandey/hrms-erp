import { Component } from '@angular/core';
import 'ag-grid-enterprise';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { SalaryDetailService } from 'src/app/@shared/services/payroll/salary-detail.service';
// import { SalaryDetailService } from 'src/app/@shared/services/service/payroll/salary-detail.service';

@Component({
  selector: 'app-pay-slip-detail',
  templateUrl: './pay-slip-detail.component.html',
  styleUrls: ['./pay-slip-detail.component.scss']
})
export class PaySlipDetailComponent {

  employee_id: any;
  allowanceDetail: any;
  allDetails: any;
  totalEarningCal: any;
  totalEarningGrossCal: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private _salaryDetailService: SalaryDetailService,
  ) {
  }

  entity_id: any;
  financial_id: any;
  loginUserDetails: any;
  month: any;

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');

    let loginUserDetails: any = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(loginUserDetails);

    this.route.queryParams.subscribe((params: any) => {
      this.employee_id = params?.id;
      this.month = params?.month;
    });

    this.get_employeesdetails();
  }

  get_employeesdetails() {
    
    let req = {
      employee_id: this.employee_id,
      entity_id: this.entity_id,
      financial_year_id: this.financial_id,
      att_month: this.month,
    }
    this._salaryDetailService.employee_salary_Details_BYID(req).subscribe((res: any) => {
      console.log(res,'res<<<<<<<<');
      
      if (res) {
        this.allowanceDetail = {
          ...res?.data[0],
          allowance_details: res?.allowance_details
        };
      }
      console.log(this.allowanceDetail,'this.allowanceDetail>>>>>>>');
      this.allDetails=res?.data[0]?.salary_data[0];
      const totalSalary = this.allDetails?.earningComponentList.reduce((total:any, item:any) => {
        return total + parseFloat(item.salary_amt || '0');
    }, 0);
    
    console.log("Total salary_amt: ", totalSalary.toFixed(2));
    this.totalEarningCal=totalSalary.toFixed(2);
    const totalGrossSalary = this.allDetails?.earningComponentList.reduce((total:any, item:any) => {
      return total + parseFloat(item?.monthlyBasic || item?.fixedAllowanceMonthly || '0');
  }, 0);
  
  console.log("Total salary_amt: ", totalGrossSalary.toFixed(2));
  this.totalEarningGrossCal=totalGrossSalary.toFixed(2)
    })
  }

  goBack() {
    this.location.back();
  }

}