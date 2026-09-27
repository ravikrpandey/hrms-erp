import { Component } from '@angular/core';
import 'ag-grid-enterprise';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { SalaryDetailService } from 'src/app/@shared/services/payroll/salary-detail.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
// import { PaySlipService } from 'src/app/@shared/services/service/payroll/pay-slip.service';
// import { SalaryDetailService } from 'src/app/@shared/services/service/payroll/salary-detail.service';

@Component({
  selector: 'app-employee-attendance-detail',
  templateUrl: './employee-attendance-detail.component.html',
  styleUrls: ['./employee-attendance-detail.component.scss']
})
export class EmployeeAttendanceDetailComponent {

  employee_id: any;
  allowanceDetail: any;
  salaryForm: any;
  salaryGetData: any;
  earningCompList: any;
  earningCompListReference: any[];
  deductionCompList: any;
  deductionCompListReference: any[];
  riembursementCompList: any;
  riembursementCompListReference: any[];
  totalMonthlyCTC:any;
  totalAnnualCTC:any;
  data: { earningComponentList: any; deductionComponentList: any; reiembursementComponentList: any; };
  mergedArray: any;
  total1: any = 0;
  total2: any = 0;
  total3: any = 0;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private _salaryDetailService: SalaryDetailService,
    private fb: FormBuilder,
    private _empoloyeeService : EmpRegistrationService,
    private toastr: ToastrService,
  ) {
    this.salaryForm = this.fb.group({
      earningComponentList: this.fb.array([]),
      deductionComponentList: this.fb.array([]),
      reiembursementComponentList: this.fb.array([]),
    })
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
      // if (params.employee_id) {
      //   this.salaryGetBy(params.employee_id)
      // }
    });

    this.get_employeesdetails();
  }

  get earningComponentList(): FormArray {
    return this.salaryForm.get('earningComponentList') as FormArray;
  }

  get deductionComponentList(): FormArray {
    return this.salaryForm.get('deductionComponentList') as FormArray;
  }

  get reiembursementComponentList(): FormArray {
    return this.salaryForm.get('reiembursementComponentList') as FormArray;
  }


  get_employeesdetails() {
   
    let req = {
      employee_id: this.employee_id,
      entity_id: this.entity_id,
      financial_year_id: this.financial_id,
      att_month: this.month,
    }
    this._salaryDetailService.employee_salary_Details_BYID(req).subscribe((res: any) => {
      if (res) {
        this.allowanceDetail = {
          ...res?.data[0],
          allowance_details: res?.allowance_details
        };
       
        let data = {
          earningComponentList: res?.data[0]?.salary_data.earningComponentList,
          deductionComponentList: res?.data[0]?.salary_data.deductionComponentList,
          reiembursementComponentList: res?.data[0]?.salary_data.reiembursementComponentList,
        }
        data.earningComponentList.forEach((value:any) => {
          if ( value.monthlyBasic ) {
            this.total1 = this.total1 + Number(value.monthlyBasic)
          }
          if ( value.fixedAllowanceMonthly ) {
            this.total1 = this.total1 + Number(value.fixedAllowanceMonthly)
          }
          this.total2 = this.total2 + Number(value.salary_amt);
        })
        data.reiembursementComponentList.forEach((value:any) => {
          if ( value.monthlyBasic ) {
            this.total1 = this.total1 + Number(value.monthlyBasic)
          }
          if ( value.fixedAllowanceMonthly ) {
            this.total1 = this.total1 + Number(value.fixedAllowanceMonthly)
          }
          this.total2 = this.total2 + Number(value.salary_amt);
        })
        data.deductionComponentList.forEach((value:any) => {
          this.total3 = this.total3 + Number(value.salary_amt);
        })
        console.log(this.total3)
        this.mergedArray = data.earningComponentList.concat(data.reiembursementComponentList);
        this.data = data;
        this.setEarningComponentList(data);
      }
    })
  }

  goBack() {
    this.location.back();
  }

  setEarningComponentList(data: any) {
    console.log(data, 'earning Data<<<<<<<<<<<');
    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;
    // this.enterSalary('fromAnnualCtc')

    let totalDeductionMonthlyCTC = 0;
    let totalDeductionAnnualCTC = 0;
    if (data?.earningComponentList?.length) {
      data?.earningComponentList?.forEach((item: any, index: number) => {
   
        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly) totalMonthlyCTC = totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual) totalAnnualCTC = totalAnnualCTC + Number(item?.salary_amt);
        }
        else {
          if (item?.monthlyBasic) totalMonthlyCTC = totalMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic) totalAnnualCTC = totalAnnualCTC + Number(item?.salary_amt);
        }

        const formGroup = this.earningComponentList?.at(index) as FormGroup;

        if (formGroup) {
          if (item?.calculation_type == 'Flat Amount') {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              fixedAllowanceMonthly: Number(item?.fixedAllowanceMonthly).toFixed(2),
              fixedAllowanceAnnual: Number(item?.salary_amt).toFixed(2),
              calculation_type: item?.calculation_type,
              id: item?.id
            });
          }
          else {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              basicPercentage: item?.basicPercentage,
              annualBasic: Number(item?.salary_amt).toFixed(2),
              monthlyBasic: Number(item?.monthlyBasic).toFixed(2),
              // basicPercentage: [{ value: item?.basicPercentage || 0, disabled: true }, Validators.required],
              // annualBasic: [{ value: item?.annualBasic || 0, disabled: true }],
              // monthlyBasic: [{ value: item?.monthlyBasic || 0, disabled: true }],
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              calculation_type: item?.calculation_type,
              id: item?.id

            });
          }

        }
        else {
          if (item?.calculation_type == 'Flat Amount') {
            this.earningComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                fixedAllowanceMonthly: Number(item?.fixedAllowanceMonthly).toFixed(2),
                fixedAllowanceAnnual: Number(item?.salary_amt).toFixed(2),
                calculation_type: item?.calculation_type,
                id: item?.id

              })
            );
          }
          else {
            this.earningComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                basicPercentage: item?.basicPercentage,
                annualBasic: Number(item?.salary_amt).toFixed(2),
                monthlyBasic: Number(item?.monthlyBasic).toFixed(2),
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                calculation_type: item?.calculation_type,
                id: item?.id

              })
            );
          }
        }
      })
    }

    // ****************
    if (data?.deductionComponentList?.length) {
      data?.deductionComponentList?.forEach((item: any, index: number) => {
        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly) totalDeductionMonthlyCTC = totalDeductionMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual) totalDeductionAnnualCTC = totalDeductionAnnualCTC + Number(item?.salary_amt);
        }
        else {
          if (item?.monthlyBasic) totalDeductionMonthlyCTC = totalDeductionMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic) totalDeductionAnnualCTC = totalDeductionAnnualCTC + Number(item?.salary_amt);
        }

        const formGroup = this.deductionComponentList?.at(index) as FormGroup;
        if (formGroup) {
          if (item?.calculation_type == 'Flat Amount') {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              fixedAllowanceMonthly: Number(item?.fixedAllowanceMonthly).toFixed(2),
              fixedAllowanceAnnual: Number(item?.salary_amt).toFixed(2),
              calculation_type: item?.calculation_type,
              id: item?.id

            });
          }
          else {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              basicPercentage: item?.basicPercentage,
              annualBasic: Number(item?.salary_amt).toFixed(2),
              monthlyBasic: Number(item?.monthlyBasic).toFixed(2),
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              calculation_type: item?.calculation_type,
              id: item?.id

            });
          }
        }
        else {
          if (item?.calculation_type == 'Flat Amount') {
            this.deductionComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                // basicPercentage: item?.basicPercentage,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                fixedAllowanceMonthly: Number(item?.fixedAllowanceMonthly).toFixed(2),
                fixedAllowanceAnnual: Number(item?.salary_amt).toFixed(2),
                calculation_type: item?.calculation_type,
                id: item?.id

              })
            );
          }
          else {
            this.deductionComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                basicPercentage: item?.basicPercentage,
                annualBasic: Number(item?.salary_amt).toFixed(2),
                monthlyBasic: Number(item?.monthlyBasic).toFixed(2),
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                calculation_type: item?.calculation_type,
                id: item?.id

              })
            );
          }
        }
      })
    }

    // ***********************
    if (data?.reiembursementComponentList?.length) {
      data?.reiembursementComponentList?.forEach((item: any, index: number) => {
        if (item?.fixedAllowanceMonthly) totalMonthlyCTC = totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
        if (item?.fixedAllowanceAnnual) totalAnnualCTC = totalAnnualCTC + Number(item?.salary_amt);
        const formGroup = this.reiembursementComponentList?.at(index) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            componentName: item?.componentName,
            fixedAllowanceAnnual: Number(item?.salary_amt).toFixed(2),
            fixedAllowanceMonthly: Number(item?.fixedAllowanceMonthly).toFixed(2),
            fixedAmountLimit: item?.fixedAmountLimit,
          });
        }
        else {
          this.reiembursementComponentList.push(
            this.fb.group({
              componentName: item?.componentName,
              fixedAllowanceAnnual: Number(item?.salary_amt).toFixed(2),
              fixedAllowanceMonthly: Number(item?.fixedAllowanceMonthly).toFixed(2),
              fixedAmountLimit: item?.fixedAmountLimit,
            })
          );
        }
      })
    }
    this.totalMonthlyCTC = totalMonthlyCTC - totalDeductionMonthlyCTC;
    this.totalMonthlyCTC = Number(this.totalMonthlyCTC).toFixed(2)
    this.totalAnnualCTC = totalAnnualCTC - totalDeductionAnnualCTC;
    let x = this.totalAnnualCTC.toFixed(2)
    console.log("++++",x)
    this.totalAnnualCTC = x;
  }

}