import { ConditionalExpr } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-salary-template-view',
  templateUrl: './salary-template-view.component.html',
  styleUrls: ['./salary-template-view.component.scss'],
})
export class SalaryTemplateViewComponent {
  templateId: any;
  templateData: any;
  totalEPF: number;
  totalEpFAnnual: number;
  efpDeduction: number;
  efpDeductionMonth: number;
  currencyId: number;
  efpDeductionAnnual: number;
  esiDeductionMonth: any;
  esiDeductionAnnual: any;
  deductionFinalMonth: number;
  deductionFinalYear: number;
  currencySymbol: any;
  getCurrencyData: any;
  constructor(
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService: PayrollService
  ) {}

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.templateId = params.template_id;
    });
    if (this.templateId != undefined || null) {
      this.getSalaryTemplateById(this.templateId);
    }
  }

  getSalaryTemplateById(id: any) {
    this.payrollService.getSalaryTemplateById(id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.templateData = res.data;
          this.currencyId = res.data.currency_id;
          this.calculationEfpEsi(res.data);
          this.getAllCurrency();
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  currencySelect(e: any) {
    this.getCurrencyData?.forEach((cur: any) => {
      if (e?.value === cur?.Currency_Convert_id) {
        this.currencySymbol = cur?.symbols;
      }
    });
  }
  getAllCurrency() {
    this.payrollService.getCurrency().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.getCurrencyData = res.data;
          if (this.currencyId) {
            this.currencySelect({ value: this.currencyId });
          }
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  // calculationEfpEsi(data: any) {
  //   console.log(data,"kkkkkkkkkkkkkkkkkkkkkkkkkkkk")
  //   const earningData = data?.earningComponentList;
  //   const deductionData = data?.deductionComponentList;
  //   let basicEPFMonth: number = 0;
  //   let OtherAllownceEpfMonth: number = 0;
  //   let basicEPFAnnual: number = 0;
  //   let OtherAllownceEpfYear: number = 0;
  //   earningData.forEach((item: any) => {
  //     if (item?.componentName === 'Basic Salary') {
  //       basicEPFMonth = Number(item?.monthlyBasic);
  //       basicEPFAnnual = Number(item?.annualBasic);
  //     }

  //     if (item?.componentName === 'Other Allowance') {
  //       OtherAllownceEpfMonth = Number(item?.monthlyBasic);
  //       OtherAllownceEpfYear = Number(item?.annualBasic);
  //     }
  //   });

  //   this.totalEPF = basicEPFMonth + OtherAllownceEpfMonth;
  //   this.totalEpFAnnual = basicEPFAnnual + OtherAllownceEpfYear;
  //   deductionData.forEach((deduct: any) => {
  //     if (deduct?.deduction_plan == 'EPF') {
  //       this.efpDeductionMonth =
  //         (this.totalEPF * Number(deduct?.employee_contribution)) / 100;
  //       this.efpDeductionAnnual =
  //         (this.totalEpFAnnual * Number(deduct?.employee_contribution)) / 100;
  //     }
  //     if (deduct?.deduction_plan == 'ESI') {
  //       this.esiDeductionMonth = (
  //         (this.totalEPF * Number(deduct?.employee_contribution)) /
  //         100
  //       ).toFixed(2);
  //       this.esiDeductionAnnual = (
  //         (this.totalEpFAnnual * Number(deduct?.employee_contribution)) /
  //         100
  //       ).toFixed(2);
  //     }
  //   });

  //   const addEpFEsiMonth =
  //     this.efpDeductionMonth + Number(this.esiDeductionMonth);
  //   const addEpFEsiAnnual =
  //     this.efpDeductionAnnual + Number(this.esiDeductionAnnual);

  //   this.deductionFinalMonth =
  //     Number(data?.total_monthly_gross) - addEpFEsiMonth;
  //   this.deductionFinalYear =
  //     Number(data?.total_annual_gross) - addEpFEsiAnnual;
  // }

calculationEfpEsi(response: any) {
  const data = response;
  console.log(data, "Final Parsed Salary Data");

  const earnings = data?.earningComponentList || [];
  const deductions = data?.deductionComponentList || [];

  const grossMonthly = Number(data?.total_monthly_gross || 0);
  const grossAnnual = Number(data?.total_annual_gross || 0);

  // Parse PF cap and ESI threshold
  const pfCapAmount = Number(data?.pfCap || 0); // Max deduction allowed (₹)
  const esiThresholdAmount = Number(data?.esiThreshold || 0); // ESI applies if gross <= this

  let epfBaseMonthly = 0;
  let epfBaseAnnual = 0;
  let esiBaseMonthly = 0;
  let esiBaseAnnual = 0;

  // Build monthly/annual base for each
  earnings.forEach((component: any) => {
    const monthly = Number(component?.monthlyBasic || 0);
    const annual = Number(component?.annualBasic || 0);

    if (component?.consider_for_epf === 1) {
      epfBaseMonthly += monthly;
      epfBaseAnnual += annual;
    }

    if (component?.consider_for_esi === 1) {
      esiBaseMonthly += monthly;
      esiBaseAnnual += annual;
    }
  });

  let epfRate = 0;
  let esiRate = 0;

  deductions.forEach((deduct: any) => {
    if (deduct?.deduction_plan === 'EPF') {
      epfRate = Number(deduct?.employee_contribution) || 0;
    } else if (deduct?.deduction_plan === 'ESI') {
      esiRate = Number(deduct?.employee_contribution) || 0;
    }
  });

  // Calculate EPF (apply cap)
  const calculatedEpfMonthly = +(epfBaseMonthly * epfRate / 100).toFixed(2);
  const calculatedEpfAnnual = +(epfBaseAnnual * epfRate / 100).toFixed(2);

  this.efpDeductionMonth = Math.min(calculatedEpfMonthly, pfCapAmount);
  this.efpDeductionAnnual = Math.min(calculatedEpfAnnual, pfCapAmount * 12);

  // ESI applicable only if gross ≤ threshold
  const isEsiApplicable = grossMonthly <= esiThresholdAmount;

  this.esiDeductionMonth = isEsiApplicable
    ? +(esiBaseMonthly * esiRate / 100).toFixed(2)
    : 0;

  this.esiDeductionAnnual = isEsiApplicable
    ? +(esiBaseAnnual * esiRate / 100).toFixed(2)
    : 0;

  // Final totals
  this.totalEPF = epfBaseMonthly;
  this.totalEpFAnnual = epfBaseAnnual;

  const totalDeductionMonth = this.efpDeductionMonth + this.esiDeductionMonth;
  const totalDeductionAnnual = this.efpDeductionAnnual + this.esiDeductionAnnual;

  this.deductionFinalMonth = +(grossMonthly - totalDeductionMonth).toFixed(2);
  this.deductionFinalYear = +(grossAnnual - totalDeductionAnnual).toFixed(2);
}





  back() {
    window.history.back();
  }
}
