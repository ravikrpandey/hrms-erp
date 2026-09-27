import { Component } from '@angular/core';
import 'ag-grid-enterprise';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { SalaryDetailService } from 'src/app/@shared/services/payroll/salary-detail.service';
// import { SalaryDetailService } from 'src/app/@shared/services/service/payroll/salary-detail.service';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss']
})
export class ViewDetailComponent {
  employee_id: any;
  allowanceDetail: any;
  allDetails: any;
  totalEarningCal: any;
  totalEarningGrossCal: any;
  att_month: any;

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

    let loginUserDetails: any = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(loginUserDetails);

    this.route.queryParams.subscribe((params: any) => {
      this.employee_id = params?.id;
      this.month = params?.month;
      this.att_month = Number(params?.per_month);
    });

    this.get_employeesdetails();
  }

  get_employeesdetails() {

    let req = {
      employee_id: this.employee_id,
      entity_id: this.entity_id,
      financial_year_id: this.financial_id,
      att_month: this.att_month || this.month,
    }
    this._salaryDetailService.employee_salary_Details_BYID(req).subscribe((res: any) => {
      console.log(res, 'res<<<<<<<<');

      if (res) {
        this.allowanceDetail = {
          ...res?.data[0],
          allowance_details: res?.allowance_details
        };
        this.calculateTotals()

      }
      console.log(this.allowanceDetail, 'this.allowanceDetail>>>>>>>');
      this.allDetails = res?.data[0]?.salary_data;
      const totalSalary = this.allDetails?.earningComponentList.reduce((total: any, item: any) => {
        return total + parseFloat(item.salary_amt || '0');
      }, 0);

      console.log("Total salary_amt: ", totalSalary.toFixed(2));
      this.totalEarningCal = totalSalary.toFixed(2);
      const totalGrossSalary = this.allDetails?.earningComponentList.reduce((total: any, item: any) => {
        return total + parseFloat(item?.monthlyBasic || item?.fixedAllowanceMonthly || '0');
      }, 0);

      console.log("Total salary_amt: ", totalGrossSalary.toFixed(2));
      this.totalEarningGrossCal = totalGrossSalary.toFixed(2)
      this.calculateTotals()

    })
  }

  goBack() {
    this.location.back();
  }
  totalGrossSalary: number = 0;
  totalEarning: number = 0;

  calculateTotals() {
    this.totalGrossSalary = 0;
    this.totalEarning = 0;

    // From earning components
    this.allDetails?.earningComponentList?.forEach((item: { monthlyBasic: any; fixedAllowanceMonthly: any; salary_amt: number; }) => {
      const gross = item?.monthlyBasic ?? item?.fixedAllowanceMonthly ?? 0;
      const earning = item?.salary_amt ?? 0;

      this.totalGrossSalary += +gross;
      this.totalEarning += +earning;
    });

    // From reimbursement components (considered part of gross and earning)
    this.allDetails?.reiembursementComponentList?.forEach((item: { fixedAllowanceMonthly: number; }) => {
      const fixed = item?.fixedAllowanceMonthly ?? 0;

      this.totalGrossSalary += +fixed;
      this.totalEarning += +fixed;
    });
  }

}