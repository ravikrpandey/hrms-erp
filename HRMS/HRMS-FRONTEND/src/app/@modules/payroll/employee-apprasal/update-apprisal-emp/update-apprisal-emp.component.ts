import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';
import { HeadService } from 'src/app/@shared/services/head.service';
import Swal from 'sweetalert2';
import { ShortlistedCandidateService } from 'src/app/@shared/services/service/recruitment/shortlisted-candidate.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewPerformanceEmpComponent } from '../view-performance-emp/view-performance-emp.component';
import moment from 'moment';

@Component({
  selector: 'app-update-apprisal-emp',
  templateUrl: './update-apprisal-emp.component.html',
  styleUrls: ['./update-apprisal-emp.component.scss'],
})
export class UpdateApprisalEmpComponent {
  salaryForm: any;
  id: any;
  salaryData: any;
  salaryGetData: any;
  empId: any;
  years: string[] = [];
  percentIncrement: number = 0;
  salaryId: any;
  employee_id: any;
  index: any;
  action_type: any;
  months: any = [];
  getAllDesignation: any;
  get_all_grade: any;
  loginUser: any;
  entity_Id: any;
  entity_id: any;
  earningCompList: any = [];
  deductionCompList: any;
  riembursementCompList: any;
  variableearningCompList: any;
  totalMonthlyCTC: any = 0;
  totalAnnualCTC: any = 0;
  basicComp: boolean = true;
  totalVariableEarningsAnnual: number = 0;
  earningCompListReference: any;
  deductionCompListReference: any;
  riembursementCompListReference: any;
  variableearningCompListReference: any;
  negativeAlert: boolean = false;
  negativeMonthly: any = 0;
  negativeAnualy: any = 0;
  finacialId: any;
  saleryTempData: any;
  salary_temp_data: any;
  getByTempData: any;
  totalEPF: any;
  totalEpFAnnual: any;
  templateSeletc: boolean = false;
  slabData: any;
  selectedValue: boolean;
  selectedValueTax: boolean = false;
  templateName: any;
  selectTempdata: {
    earningComponentList: any;
    deductionComponentList: any;
    reiembursementComponentList: any;
  };
  gradePay: boolean = false;
  getCurrencyData: any;
  currencySymbol: any;
  enabledNote: boolean = false;
  currency_id: any = null;
  totalEsiMonth: number;
  totalEsiAnnual: number;
  labelCalculation: string;
  employeerContribution: any;
  employeerContributionEsi: any;
  employeerContributionMatched: any;
  remarksForm: any;
  selectFlat: boolean = false;
  percentage: boolean = false;
  payrollApprisalId: any;
  apprisalData: any;
  monthlyBasicAmount: any;
  annulaCalculation: number;
  loading: boolean = false;
  pfCap: any;
  esiThreshold: any;

  constructor(
    private fb: FormBuilder,
    private _empoloyeeService: EmpRegistrationService,
    private _shortListedCandidate: ShortlistedCandidateService,
    private head: HeadService,
    private route: Router,
    private toastr: ToastrService,
    private _activeRoute: ActivatedRoute,
    private locatin: Location,
    public common: CommonService,
    private payrollService: PayrollService,
    public dialog: MatDialog
  ) {
    this.salaryForm = this.fb.group({
      basic_salary: new FormControl(null, [Validators.required]),
      salary_per_day: new FormControl(null, [Validators.required]),
      salary_per_hr: new FormControl(null, [Validators.required]),
      salary_temp_data: new FormControl(null),
      tax_slab: new FormControl(null),
      tax_calculation: new FormControl('false'),
      salary_temp_data_check: new FormControl(null),
      remarks: new FormControl(null),
      salary_apply_date: new FormControl(null),
      // PRIVIUS EMPOYER DETAILS
      history_salary: new FormArray([
        new FormGroup({
          salary_Year: new FormControl(null),
          salary_month: new FormControl(null),
          new_salary: new FormControl(null),
          old_salary: new FormControl(null),
          from_designation_id: new FormControl(null),
          to_designation_id: new FormControl(null),
          from_grade_id: new FormControl(null),
          to_grade_id: new FormControl(null),
          percent_increment: new FormControl(null),
        }),
      ]),
      annualCTC: [0, Validators.required],
      monthlyCTC: new FormControl(),
      earningComponentList: this.fb.array([]),
      deductionComponentList: this.fb.array([]),
      reiembursementComponentList: this.fb.array([]),
      variableearningComponentList: this.fb.array([]),
      UAN_number: new FormControl(null),
      pf_account_number: new FormControl(null),
      epf_type: ['NA', Validators.required],
      annualCTC_sep: new FormControl(null),
      monthlyCTC_sep: new FormControl(null),
    });
    this.remarksForm = this.fb.group({
      salarytype: new FormControl(null),
      salary_mode: new FormControl(null),
      select_component: new FormControl(null),
      calculation_percentage: new FormControl(null),
      type: new FormControl(null),
      flat_amount: new FormControl(null),
      remarks: new FormControl(null),
      performance_rating: new FormControl(null),
      salary_apply_date: new FormControl(null),
    });
    this.salaryForm.get('annualCTC')?.valueChanges.subscribe((value: any) => {
      this.updateCalculations(value);
    });
  }

  ngOnInit(): void {
    this.salaryForm.patchValue({ tax_calculation: 'false' });
    this.localStorage();
    this.getAllDesignation_dropDown();
    this.get_all_active_grade();
    this.getAllEarningComponentList();
    this.getAllRiembursementComponentList();
    this.getAllVariableearningComponentList();
    this.getAllDeductionComponentList();
    this._activeRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.months = [
        { name: 'January', id: 1 },
        { name: 'February', id: 2 },
        { name: 'March', id: 3 },
        { name: 'April', id: 4 },
        { name: 'May', id: 5 },
        { name: 'June', id: 6 },
        { name: 'July', id: 7 },
        { name: 'August', id: 8 },
        { name: 'September', id: 9 },
        { name: 'October', id: 10 },
        { name: 'November', id: 11 },
        { name: 'December', id: 12 },
      ];
      this.salaryId = this.id.EmpId;
      this.employee_id = this.id.EmpId;
      this.action_type = this.id.action_type;
      this.payrollApprisalId = params?.id;
      if (params.EmpId) {
        this.salaryGetBy(params.EmpId);
      }
    });
    this._empoloyeeService.setEmpTitle('SALARY DETAILS');
    this.getActive_Allowance();
    this.generateYears();
    this.getAllSaleryTemp();
    this.getAllCreatedTaxslabList();
    this.getEmployeePMS();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.finacialId = localStorage.getItem('financial_id');
    this.salaryForm.patchValue({
      tax_calculation: 'false',
      performance_rating: '12',
    });
    this.remarksForm.patchValue({});
    this.selectedValueTax = false;
    this.getAllCurrency();
  }

  selectsalary(e: any) {
    if (e?.value === 'flat') {
      this.selectFlat = true;
      this.percentage = false;
    } else {
      this.percentage = true;
      this.selectFlat = false;
    }
  }

  getByData() {
    this.payrollService
      .getByApprisal(this.payrollApprisalId)
      .subscribe((res: any) => {
        this.currency_id = res.data.currency_id;
        this.getAllCurrency();
        this.apprisalData = res.data;
        this.remarksForm.patchValue({
          salarytype: res.data?.salary_type,
          salary_mode: res.data?.appraisal_mode,
          select_component: res.data?.appraisal_comp_type,
          calculation_percentage: res.data?.appraisal_percentage,
          type: res.data?.appraisal_type,
          flat_amount: res.data?.appraisal_amount,
          performance_rating: '2',
          salary_apply_date: res.data?.salary_apply_date,
        });
        if (res.data?.appraisal_mode === 'Flat') {
          this.selectFlat = true;
          this.percentage = false;
        } else {
          this.percentage = true;
          this.selectFlat = false;
        }

        if (this.apprisalData?.appraisal_mode === 'Flat') {
          if (this.apprisalData?.appraisal_type === 'Increment') {
            const annualMonthSep =
              Number(this.salaryGetData?.gradeSalaryData[0]?.ctc) +
              Number(res.data?.appraisal_amount);
            const formattedAnnualCTC: any = new Intl.NumberFormat().format(
              Number(annualMonthSep)
            );

            this.salaryForm?.patchValue({
              annualCTC:
                Number(this.salaryGetData?.gradeSalaryData[0]?.ctc) +
                Number(res.data?.appraisal_amount),
              annualCTC_sep: formattedAnnualCTC,
            });
            const annualCTC = this.salaryForm.get('annualCTC')?.value;
            const formattedMonthlyCTC: any = new Intl.NumberFormat().format(
              Number((annualCTC / 12).toFixed(2))
            );

            this.salaryForm?.patchValue({
              monthlyCTC: (annualCTC / 12).toFixed(2),
              monthlyCTC_sep: formattedMonthlyCTC,
            });
          } else {
            const annualCtsSeprate =
              Number(this.salaryGetData?.gradeSalaryData[0]?.ctc) -
              Number(res.data?.appraisal_amount);
            const formattedAnnualCTC_dec: any = new Intl.NumberFormat().format(
              Number(annualCtsSeprate)
            );

            this.salaryForm?.patchValue({
              annualCTC:
                Number(this.salaryGetData?.gradeSalaryData[0]?.ctc) -
                Number(res.data?.appraisal_amount),
              annualCTC_sep: formattedAnnualCTC_dec,
            });
            const annualCTC = this.salaryForm.get('annualCTC')?.value;
            const formattedmonthCTC_dec: any = new Intl.NumberFormat().format(
              Number((annualCTC / 12).toFixed(2))
            );

            this.salaryForm?.patchValue({
              monthlyCTC: (annualCTC / 12).toFixed(2),
              monthlyCTC_sep: formattedmonthCTC_dec,
            });
          }
        } else if (this.apprisalData?.appraisal_mode === 'Percentage') {
          if (this.apprisalData?.appraisal_comp_type === 'Basic Salary') {
            const easrningObj =
              this.salaryGetData?.gradeSalaryData[0]?.earningComponentList;
            easrningObj?.forEach((basic: any) => {
              if (basic?.earningTypeCode === 'BASI1') {
                this.monthlyBasicAmount = Number(basic?.monthlyBasic);
              }
            });
            const calculateAmount =
              (this.monthlyBasicAmount *
                Number(this.apprisalData?.appraisal_percentage)) /
              100;
            if (this.apprisalData?.appraisal_type === 'Increment') {
              this.annulaCalculation =
                Number(this.salaryGetData?.gradeSalaryData[0]?.ctc) +
                calculateAmount;
            } else {
              this.annulaCalculation =
                Number(this.salaryGetData?.gradeSalaryData[0]?.ctc) -
                calculateAmount;
            }
            const annualCalculation_sep = this.annulaCalculation.toFixed(2);
            const monthlyCalculation_sep = (
              this.annulaCalculation / 12
            ).toFixed(2);
            const formattedAnnualCTC: any = new Intl.NumberFormat().format(
              Number(annualCalculation_sep)
            );
            const formattedMonthCTC: any = new Intl.NumberFormat().format(
              Number(monthlyCalculation_sep)
            );

            this.salaryForm?.patchValue({
              annualCTC: this.annulaCalculation.toFixed(2),
              monthlyCTC: (this.annulaCalculation / 12).toFixed(2),
              annualCTC_sep: formattedAnnualCTC,
              monthlyCTC_sep: formattedMonthCTC,
            });
          } else if (
            this.apprisalData?.appraisal_comp_type === 'Gross Salary'
          ) {
            const monthlyCTC = this.salaryForm.get('monthlyCTC')?.value;
            const checkMontAmt = Number(monthlyCTC);
            const annualCTCAmount = this.salaryForm.get('annualCTC')?.value;
            const checkNumber = Number(annualCTCAmount);
            const grossCtccalculation =
              (Number(monthlyCTC) *
                Number(this.apprisalData?.appraisal_percentage)) /
              100;
            if (this.apprisalData?.appraisal_type === 'Increment') {
              const annualCalculation_sep = (
                checkNumber + grossCtccalculation
              ).toFixed(2);
              const monthlyCalculation_sep = (
                (checkNumber + grossCtccalculation) /
                12
              ).toFixed(2);
              const formattedAnnualCTC: any = new Intl.NumberFormat().format(
                Number(annualCalculation_sep)
              );
              const formattedMonthCTC: any = new Intl.NumberFormat().format(
                Number(monthlyCalculation_sep)
              );
              this.salaryForm?.patchValue({
                annualCTC: (checkNumber + grossCtccalculation).toFixed(2),
                monthlyCTC: ((checkNumber + grossCtccalculation) / 12).toFixed(
                  2
                ),
                annualCTC_sep: formattedAnnualCTC,
                monthlyCTC_sep: formattedMonthCTC,
              });
            } else {
              const annualCalculation_sep = (
                checkNumber - grossCtccalculation
              ).toFixed(2);
              const monthlyCalculation_sep = (
                (checkNumber - grossCtccalculation) /
                12
              ).toFixed(2);
              const formattedAnnualCTC: any = new Intl.NumberFormat().format(
                Number(annualCalculation_sep)
              );
              const formattedMonthCTC: any = new Intl.NumberFormat().format(
                Number(monthlyCalculation_sep)
              );
              this.salaryForm?.patchValue({
                annualCTC: checkNumber - grossCtccalculation,
                monthlyCTC: (checkNumber - grossCtccalculation) / 12,
                annualCTC_sep: formattedAnnualCTC,
                monthlyCTC_sep: formattedMonthCTC,
              });
            }
          } else if (this.apprisalData?.appraisal_comp_type === 'CTC') {
            const annualCTCAmount = this.salaryForm.get('annualCTC')?.value;
            const checkNumber = Number(annualCTCAmount);
            const monthlyCTCAmount = this.salaryForm.get('monthlyCTC')?.value;
            const finalAnnualAmt =
              (annualCTCAmount * this.apprisalData?.appraisal_percentage) / 100;
            if (this.apprisalData?.appraisal_type === 'Increment') {
              const annualCalculation_sep = (
                checkNumber + finalAnnualAmt
              ).toFixed(2);
              const monthlyCalculation_sep =
                (checkNumber + finalAnnualAmt) / 12;
              const formattedAnnualCTC: any = new Intl.NumberFormat().format(
                Number(annualCalculation_sep)
              );
              const formattedMonthCTC: any = new Intl.NumberFormat().format(
                Number(monthlyCalculation_sep)
              );
              this.salaryForm?.patchValue({
                annualCTC: (checkNumber + finalAnnualAmt).toFixed(2),
                monthlyCTC: (checkNumber + finalAnnualAmt) / 12,
                annualCTC_sep: formattedAnnualCTC,
                monthlyCTC_sep: formattedMonthCTC,
              });
            } else {
              const annualCalculation_sep = (
                checkNumber - finalAnnualAmt
              ).toFixed(2);
              const monthlyCalculation_sep = (
                (checkNumber - finalAnnualAmt) /
                12
              ).toFixed(2);
              const formattedAnnualCTC: any = new Intl.NumberFormat().format(
                Number(annualCalculation_sep)
              );
              const formattedMonthCTC: any = new Intl.NumberFormat().format(
                Number(monthlyCalculation_sep)
              );
              this.salaryForm?.patchValue({
                annualCTC: (checkNumber - finalAnnualAmt).toFixed(2),
                monthlyCTC: ((checkNumber - finalAnnualAmt) / 12).toFixed(2),
                annualCTC_sep: formattedAnnualCTC,
                monthlyCTC_sep: formattedMonthCTC,
              });
            }
          }
        }
      });
  }

  getEmployeePMS() {
    let data = {
      login_id: this.payrollApprisalId,
      entity_id: this.entity_Id,
      filter_fy: this.finacialId,
    };
    this.payrollService.getEmployeePMSRating(data).subscribe((res: any) => { });
  }

  viewData(e: any) {
    let data = {
      employee_id: this.payrollApprisalId,
      login_id: this.loginUser?.employee_id,
      financial_year_id: this.finacialId,
    };
    const dialogRef = this.dialog.open(ViewPerformanceEmpComponent, {
      width: '80%',
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  // end apprisal form

  get historySalaryFormArray() {
    return this.salaryForm.get('history_salary') as FormArray;
  }

  get SL(): any {
    return this.salaryForm.controls;
  }

  salaryGetBy(id: any) {
    this._empoloyeeService.getByUserId(id).subscribe((res: any) => {
      this.salaryGetData = res.data;
      this.pfCap = res.data.gradeSalaryData[0].pfCap;
      this.esiThreshold = res.data.gradeSalaryData[0].esiThreshold;
      this.salaryPatchData(res.data);
      if (this.salaryGetData?.gradeSalaryData?.length) {
        this.templateSeletc = true;
        this.salaryForm?.patchValue({
          annualCTC: res.data?.gradeSalaryData[0]?.ctc,
          monthlyCTC: res.data?.gradeSalaryData[0]?.ctc / 12,
        });
        if (this.salaryGetData?.epf_type === 'FORM_11') {
          res.data.gradeSalaryData = res.data?.gradeSalaryData?.filter(
            (item: any) =>
              item.deduction_plan !== 'EPF' && item.deduction_plan !== 'ESI'
          );
        }
        let data = {
          earningComponentList:
            res.data?.gradeSalaryData[0]?.earningComponentList,
          deductionComponentList:
            res.data?.gradeSalaryData[0]?.deductionComponentList,
          reiembursementComponentList:
            res.data?.gradeSalaryData[0]?.reiembursementComponentList,
          variableearningComponentList: res.data?.gradeSalaryData[0]?.variableearningComponentList,
        };
        this.setEarningComponentList(data);
      }
      this.getByData();
      this.saleryTempData?.forEach((tem: any) => {
        if (
          this.salaryGetData?.gradeSalaryData?.length > 0 &&
          this.salaryGetData?.gradeSalaryData?.payroll_template_id == tem?.id
        ) {
          this.gradePay = false;
        } else if (this.salaryGetData?.gradeSalaryData.length === 0) {
          this.gradePay = true;
        }
      });
      this.getCurrencyData?.forEach((cur: any) => {
        if (this.salaryGetData?.currency_id === cur?.Currency_Convert_id) {
          this.currencySymbol = cur?.symbols;
        }
      });
    });
  }

  selectEpf(e: any) {
    const salaryTempControl = this.salaryForm.get('salary_temp_data');
    if (e) {
      this.enabledNote = true;
    } else {
    }
    this.salaryForm.get('salary_temp_data')?.reset();
  }

  salaryPatchData(salaryGetData: any) {
    this.salaryForm.patchValue({
      basic_salary: salaryGetData?.basic_salary,
      salary_per_day: salaryGetData?.salary_per_day,
      salary_per_hr: salaryGetData?.salary_per_hr,
      salary_temp_data_check:
        salaryGetData?.gradeSalaryData[0]?.payroll_template_id,
      tax_slab: salaryGetData?.gradeSalaryData[0]?.tax_slab_id,
      tax_calculation: salaryGetData?.gradeSalaryData[0]?.tax_calculation,
      epf_type: salaryGetData?.epf_type || 'NA',
      pf_account_number: salaryGetData?.pf_account_number,
      UAN_number: salaryGetData?.UAN_number,
    });
    const salaryTempControl = this.salaryForm.get('salary_temp_data');
    if (salaryGetData?.epf_type) {
      salaryTempControl?.enable();
    } else {
      salaryTempControl?.disable();
    }
    if (salaryGetData?.gradeSalaryData[0]?.tax_calculation === true) {
      this.salaryForm.patchValue({
        tax_calculation: 'true',
      });
      this.selectedValueTax = true;
    } else if (salaryGetData?.gradeSalaryData[0]?.tax_calculation === false) {
      this.salaryForm.patchValue({
        tax_calculation: 'false',
      });
      this.selectedValueTax = false;
    }
    if (salaryGetData?.history_salary?.length) {
      salaryGetData?.history_salary?.forEach((item: any, index: number) => {
        const formGroup = this.historySalaryFormArray?.at(index) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            salary_Year: item.salary_Year,
            salary_month: item.salary_month,
            new_salary: item.new_salary,
            old_salary: item.old_salary,
            from_designation_id: item.from_designation_id,
            to_designation_id: item.to_designation_id,
            from_grade_id: item.from_grade_id,
            to_grade_id: item.to_grade_id,
            percent_increment: item.percent_increment,
            remarks: item.remarks,
          });
        } else {
          this.historySalaryFormArray.push(
            this.fb.group({
              salary_Year: item.salary_Year,
              salary_month: item.salary_month,
              new_salary: item.new_salary,
              old_salary: item.old_salary,
              from_designation_id: item.from_designation_id,
              to_designation_id: item.to_designation_id,
              from_grade_id: item.from_grade_id,
              to_grade_id: item.to_grade_id,
              percent_increment: item.percent_increment,
              remarks: item.remarks,
            })
          );
        }
      });
    }
  }

  allowanceList: any = [];

  getActive_Allowance() {
    let entity_id = localStorage.getItem('selectedEntityId');
    let financial_id = localStorage.getItem('financial_id');
    let req = {
      entity_id: entity_id,
      fy_id: financial_id,
    };
    this._shortListedCandidate
      .getActive_Allowancenw(req)
      .subscribe((res: any) => {
        if (res) {
          this.allowanceList = res?.data;
        }
      });
  }

  prevTab = () => {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/personal-details'],
      { queryParams: { employee_id: this.salaryId } }
    );
  };

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 20; i++) {
      this.years.push((currentYear - i).toString()); // Convert each year to a string
    }
  }

  calculatePercentIncrement(index: number): void {
    const history_salary = this.CF_1.history_salary;
    const row = history_salary.at(index) as FormGroup;
    const newSalary = row.controls['new_salary'].value;
    const oldSalary = row.controls['old_salary'].value;
    if (newSalary && oldSalary && oldSalary !== 0) {
      const increment = ((newSalary - oldSalary) / oldSalary) * 100;
      row.patchValue({ percent_increment: increment.toFixed(2) });
    } else {
      row.patchValue({ percent_increment: null });
    }
  }

  back() {
    window.history.back();
  }

  //1
  onSubmitForm() {
    let val = this.salaryForm.value;
    let remarksVal = this.remarksForm.value;
    const totalDeductSalary = val?.deductionComponentList?.reduce(
      (total: any, item: any) => {
        return (
          total +
          parseFloat(item?.fixedAllowanceMonthly || item?.monthlyBasic || '0')
        );
      },
      0
    );

    const totalDeduct = totalDeductSalary.toFixed(2);
    if (this.salaryForm.invalid) {
      this.toastr.error('Required fields should not be empty');
      return;
    }
    let financial_id = localStorage.getItem('financial_id');
    let empMainId = localStorage.getItem('EmpMainId');
    let gradeSalaryData = this.salaryGetData?.gradeSalaryData[0];

    const totalVariableEarningsAnnual = val?.variableearningComponentList?.reduce(
      (total: number, item: any) =>
        total + parseFloat(item?.fixedAllowanceAnnual || '0'),
      0
    ) || 0;

    let req = {
      ...val,
      monthly_ctc: val?.monthlyCTC,
      deduction_amt: Number(totalDeduct),
      tab_type: 'Salary',
      totalMonthlyCTC: this.totalMonthlyCTC,
      totalAnnualCTC: this.totalAnnualCTC,
      totalVariableEarningsAnnual: totalVariableEarningsAnnual.toFixed(2),
      financial_year_id: financial_id,
      entity_id: this.entity_Id,
      company: this.gradIdDetail?.entity_name,
      branch: this.gradIdDetail?.branch_name,
      grade: this.gradIdDetail?.grade_name,
      description: this.gradIdDetail?.description,
      created_by: empMainId,
      payroll_template_id: val.salary_temp_data_check,
      tax_calculation: val?.tax_calculation || 'false',
      tax_slab_id: val?.tax_slab,
      grade_pay: this.gradePay,
      currency_id:
        this.currency_id || this.salaryGetData?.gradeSalaryData[0]?.currency_id,
      grade_template_id: this.salaryGetData?.gradeSalaryData[0]?.id || null,
      employer_contri_epf_amt: this.employeerContributionMatched,
      employer_contri_esi_amt: this.employeerContributionEsi,
      approval_status: 'APPROVED',
      progress_status: 'CLOSE',
      employee_id: this.loginUser?.employee_id,
      final_status: 'APPROVED',
      remarks: remarksVal?.remarks,
      template_name: this.salaryGetData?.gradeSalaryData[0]?.template_name,
      salary_apply_date: moment(remarksVal?.salary_apply_date).format(
        'YYYY-MM-DD'
      ),
    };
    req?.earningComponentList?.map((item: any) => {
      if (item?.calculation_type == 'Flat Amount')
        item.componenet_type = 'flat';
      else item.componenet_type = 'percentage';
    });
    req?.deductionComponentList?.map((item: any) => {
      if (item?.calculation_type == 'Flat Amount')
        item.componenet_type = 'flat';
      else item.componenet_type = 'percentage';
    });
    req?.reiembursementComponentList?.map((item: any) => {
      if (item?.calculation_type == 'Flat Amount')
        item.componenet_type = 'flat';
      else item.componenet_type = 'percentage';
    });
    this.loading = true;
    this.payrollService
      .pendingToBeUpdate(this.payrollApprisalId, req)
      .subscribe(
        (res: any) => {
          if (res) {
            this.salaryData = res;
            this.loading = false;
            this.route.navigate([
              'master/payroll/employee-appraisal/approved-list-emp',
            ]);
            this.toastr.success('Employee appraisal approved successfully.');
          }
        },
        (err) => {
          this.toastr.error(
            'Someting went wron please try again',
            'Error Message'
          );
          this.loading = false;
        }
      );
  }

  Skip() {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/payment-details'],
      { queryParams: { employee_id: this.salaryId } }
    );
  }

  reject() {
    let val = this.remarksForm.value;
    let dataUpdate = {
      approval_status: 'REJECTED',
      progress_status: 'CLOSE',
      employee_id: this.loginUser?.employee_id,
      final_status: 'REJECTED',
      remarks: val?.remarks,
    };
    this.payrollService
      .pendingToBeUpdate(this.payrollApprisalId, dataUpdate)
      .subscribe(
        (res: any) => {
          this.toastr.success('Appraisal Request Rejected Successfully!');
          this.route.navigate([
            'master/payroll/employee-appraisal/reject-list-emp',
          ]);
        },
        (err: any) => {
          this.toastr.error(`${err?.error?.message}`);
        }
      );
  }

  // table start
  addFamilyDisable: boolean = false;
  allFamilyData: any;
  allEmployeerData: any;
  deletedFamilyData: any = [];

  get CF_1(): any {
    return this.salaryForm.controls;
  }

  addRow() {
    const allowanace_details = this.salaryForm.get(
      'allowanace_details'
    ) as FormArray;
    if (allowanace_details.value && allowanace_details?.value.length > 0) {
      let canAddNewRow = true;
      for (const obj of allowanace_details?.value) {
        if (!obj.allowance_name) {
          canAddNewRow = false;
          break;
        }
      }
      if (canAddNewRow) {
        const allowanace_details = this.salaryForm.get(
          'allowanace_details'
        ) as FormArray;
        this.CF_1.allowanace_details.push(
          new FormGroup({
            allowance_name: new FormControl(null),
            allowance_amount: new FormControl(null),
          })
        );
      } else {
        this.toastr.error('Please add Allowance Details first');
      }
    }
  }

  deleteallowanace_details(i: number, d: any) {
    if (this.CF_1.allowanace_details.length > 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want be delete !',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#5d6c7c',
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.allowanace_details.length >= 1) {
            this.CF_1.allowanace_details.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        }
      });
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  // Employee
  addRowEmploy() {
    const history_salary = this.salaryForm.get('history_salary') as FormArray;
    if (history_salary.value && history_salary?.value.length > 0) {
      let canAddNewRow = true;
      for (const obj of history_salary?.value) {
        if (!obj.salary_Year) {
          canAddNewRow = false;
          break;
        }
      }
      if (canAddNewRow) {
        // Logic to add a new row
        const history_salary = this.salaryForm.get(
          'history_salary'
        ) as FormArray;
        this.CF_1.history_salary.push(
          new FormGroup({
            salary_Year: new FormControl(null),
            salary_month: new FormControl(null),
            new_salary: new FormControl(null),
            old_salary: new FormControl(null),
            from_designation_id: new FormControl(null),
            to_designation_id: new FormControl(null),
            from_grade_id: new FormControl(null),
            to_grade_id: new FormControl(null),
            percent_increment: new FormControl(null),
            remarks: new FormControl(null),
          })
        );
        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please History of Salary Revision details first');
        // Display an error message for the user
      }
    } else {
    }
  }

  deleteEmployerRow(i: number, d: any) {
    if (this.CF_1.history_salary.length > 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#5d6c7c',
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.history_salary.length >= 1) {
            this.CF_1.history_salary.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        }
      });
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  // table end

  // handleSalary(historyIndex: any) {

  //   let currentList = this.salaryForm?.controls?.['history_salary']?.value;
  //   let currentObj = this.salaryForm?.controls?.['history_salary']?.value[historyIndex];
  //   if (currentObj?.new_salary && currentObj?.old_salary) {
  //     currentObj.percent_increment = (currentObj?.new_salary * currentObj?.old_salary / 100) / 100;
  //   }
  //   currentList[historyIndex] = currentObj
  //   this.salaryForm?.patchValue({ history_salary: currentList })
  // }

  getAllDesignation_dropDown() {
    this._empoloyeeService.getAllDesignation_dropDown().subscribe((res) => {
      this.getAllDesignation = res.data.filter(
        (res: any) => res.status === 'ACTIVE'
      );
    });
  }

  get_all_active_grade() {
    this._empoloyeeService
      .get_all_active_grade(this.entity_Id)
      .subscribe((res) => {
        this.get_all_grade = res.data;
      });
  }

  onMonthlyAmountKeyup(index: number) {
    const reimbursementArray = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    const reimbursementGroup = reimbursementArray.at(index) as FormGroup;
    const fixedAmountLimit = reimbursementGroup.get('fixedAmountLimit')?.value;
    let monthlyAmount = reimbursementGroup.get('fixedAllowanceMonthly')?.value;
    this.totalCountCreate();
    const annualAmount = monthlyAmount * 12;
    reimbursementGroup
      .get('fixedAllowanceAnnual')
      ?.setValue(annualAmount.toFixed(2));
    this.updateFixedAllowancee();
  }

  onAnnualVariableearningAmountKeyup(index: number) {
    const variableearningArray = this.salaryForm.get(
      'variableearningComponentList'
    ) as FormArray;

    const variableearningGroup = variableearningArray.at(index) as FormGroup;

    let annualAmount =
      Number(variableearningGroup.get('fixedAllowanceAnnual')?.value) || 0;

    // ✅ Auto-calculate Monthly from Annual
    const monthlyAmount = annualAmount / 12;

    variableearningGroup
      .get('fixedAllowanceMonthly')
      ?.setValue(monthlyAmount.toFixed(2), { emitEvent: false });

    this.totalCountCreate();
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  updateFixedEarningAmount(index: number) {
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    const earningGroup = earningArray.at(index) as FormGroup;
    let monthlyAmount = earningGroup.get('fixedAllowanceMonthly')?.value || 0;
    let annualAmount = monthlyAmount * 12;
    // Update the monthly and annual values for the specific index
    earningGroup.get('fixedAllowanceAnnual')?.setValue(annualAmount);
    earningGroup.get('fixedAllowanceMonthly')?.setValue(monthlyAmount);
    this.updateFixedAllowancee();
  }

  updateFixedAllowancee() {
    const annualCTC = this.salaryForm.get('annualCTC')?.value;
    const reimbursementArray = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    let totalReimbursementAmount = 0;
    reimbursementArray.controls.forEach((reimbursement) => {
      const reimbursementAnnual =
        reimbursement.get('fixedAllowanceAnnual')?.value || 0;
      totalReimbursementAmount += parseFloat(reimbursementAnnual);
    });
    const variableearningArray = this.salaryForm.get(
      'variableearningComponentList'
    ) as FormArray;
    let totalVariableearningAmount = 0;
    variableearningArray.controls.forEach((variableearning) => {
      const variableearningAnnual =
        variableearning.get('fixedAllowanceAnnual')?.value || 0;
      totalVariableearningAmount += parseFloat(variableearningAnnual);
    });
    // Step 2: Calculate total earnings excluding Fixed Allowance
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    let totalEarningsExcludingFixedAllowance = 0;

    // First loop: calculate total earnings (excluding Fixed Allowance)
    earningArray.controls.forEach((control) => {
      const earningTypeCode = control.get('earningTypeCode')?.value;
      // Include HRA and all other earnings except Fixed Allowance
      if (earningTypeCode !== 'FIXE33') {
        let annualValue: any = 0;
        if (control.get('annualBasic')?.value) {
          annualValue = control.get('annualBasic')?.value || 0;
        } else {
          annualValue = control.get('fixedAllowanceAnnual')?.value || 0;
        }
        totalEarningsExcludingFixedAllowance += parseFloat(annualValue);
      }
    });

    // Step 2: Calculate total deduction
    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    let totalDeductionAmount = 0;
    deductionArray.controls.forEach((control) => {
      let annualValue: any = 0;
      if (control.get('annualBasic')?.value) {
        annualValue = control.get('annualBasic')?.value || 0;
      } else {
        annualValue = control.get('fixedAllowanceAnnual')?.value || 0;
      }
      totalDeductionAmount += parseFloat(annualValue);
    });

    // Step 3: Calculate remaining CTC for Fixed Allowance
    let totalUsedAmount =
      totalEarningsExcludingFixedAllowance +
      totalReimbursementAmount +
      totalDeductionAmount;
    let remainingCTCForFixedAllowance = annualCTC - totalUsedAmount;

    // Step 4: Update Fixed Allowance
    earningArray.controls.forEach((control) => {
      const earningTypeCode = control.get('earningTypeCode')?.value;
      if (earningTypeCode === 'FIXE33') {
        let monthlyAmount = remainingCTCForFixedAllowance / 12;
        let annualAmount = monthlyAmount * 12;
        // Update the Fixed Allowance amounts
        control.get('fixedAllowanceAnnual')?.setValue(annualAmount.toFixed(2));
        control
          .get('fixedAllowanceMonthly')
          ?.setValue(monthlyAmount.toFixed(2));
        if (monthlyAmount < 0) {
          this.negativeAlert = true;
          this.negativeMonthly = monthlyAmount.toFixed(2);
          this.negativeAnualy = annualAmount.toFixed(2);
        } else {
          this.negativeAlert = false;
        }
      }
    });
    // this.totalCountCreate()
  }

  onMonthlyDeductionAmountKeyup(index: number) {
    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    const deductionGroup = deductionArray.at(index) as FormGroup;
    const fixedAmountLimit = deductionGroup.get('fixedAmountLimit')?.value;
    let monthlyAmount = deductionGroup.get('fixedAllowanceMonthly')?.value;
    // Ensure the monthly amount does not exceed the fixed amount limit
    if (monthlyAmount > fixedAmountLimit) {
      monthlyAmount = fixedAmountLimit;
      deductionGroup.get('fixedAllowanceMonthly')?.setValue(fixedAmountLimit);
      this.toastr.warning('Amount Limit is fixed.');
    }
    // Update the annual amount based on the monthly amount
    const annualAmount = monthlyAmount * 12;
    deductionGroup
      .get('fixedAllowanceAnnual')
      ?.setValue(annualAmount.toFixed(2));
    this.calculateTotalCTC();
    this.updateFixedAllowancee();
  }

  totalCountCreate() {
    const earningComponentList = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    const reiembursementComponentList = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    const variableearningComponentList = this.salaryForm.get(
      'variableearningComponentList'
    ) as FormArray;
    let obj = {
      earningComponentList: earningComponentList?.value,
      deductionArray: deductionArray?.value,
      reiembursementComponentList: reiembursementComponentList?.value,
      variableearningComponentList: variableearningComponentList?.value,
    };
    this.setEarningComponentList(obj);
  }

  createEarningComponent(
    name: string,
    type: 'value-based' | 'fixed',
    data?: any
  ): FormGroup {
    if (type === 'value-based') {
      return this.fb.group({
        componentName: [name, Validators.required],
        calculationType: [data?.earning_type],
        basicPercentage: [
          { value: data?.calculation_percentage, disabled: true },
          Validators.required,
        ],
        monthlyBasic: [{ value: 0, disabled: true }],
        earningTypeCode: [data?.earning_type_code],
        annualBasic: [{ value: 0, disabled: true }],
        calculationTypeCode: [data.calculation_type_code],
      });
    } else if (type === 'fixed') {
      return this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        earningTypeCode: [data?.earning_type_code],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }],
      });
    }
    throw new Error('Invalid component type specified');
  }

  setFormcontrolDeduction() {
    return this.fb.group({
      componentName: new FormControl(),
      calculationType: new FormControl(),
      basicPercentage: new FormControl(),
      monthlyBasic: new FormControl(),
      earningTypeCode: new FormControl(),
      annualBasic: new FormControl(),
      calculationTypeCode: new FormControl(),
    });
  }

  createDeductionComponent(
    name: string,
    type: 'value-based' | 'fixed',
    data?: any
  ): FormGroup {
    if (type === 'value-based') {
      let calculationType =
        name === 'EPF'
          ? 'PF Wages'
          : name === 'ESI'
            ? 'ESI Wages'
            : data?.deduction_type;
      let calculation_type_code =
        name === 'EPF'
          ? 'EPF'
          : name === 'ESI'
            ? 'ESI'
            : data?.calculation_type_code;
      let basicPercent;
      if (
        data?.employer_contribution != undefined ||
        data?.employer_contribution != null
      ) {
        basicPercent = parseFloat(data?.employer_contribution);
      } else if (
        data?.calculation_percentage != undefined ||
        data?.calculation_percentage != null
      ) {
        basicPercent = parseFloat(data?.calculation_percentage);
      }
      const isOverrideAtEmployeeLevel =
        data?.override_at_employee_level == 1
          ? false
          : data?.override_at_employee_level == 0
            ? true
            : true;
      return this.fb.group({
        componentName: [name, Validators.required],
        calculationType: [calculationType],
        basicPercentage: [
          { value: basicPercent || 0, disabled: isOverrideAtEmployeeLevel },
          Validators.required,
        ],
        monthlyBasic: [{ value: 0, disabled: true }],
        annualBasic: [{ value: 0, disabled: true }],
        calculationTypeCode: [calculation_type_code],
        epf_deduction: new FormControl(null),
      });
    } else if (type === 'fixed') {
      return this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }],
        fixedAmountLimit: [data?.calculation_amount || 0],
        epf_deduction: new FormControl(null),
      });
    }
    throw new Error('Invalid component type specified');
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

  get variableearningComponentList(): FormArray {
    return this.salaryForm.get('variableearningComponentList') as FormArray;
  }

  addEarningComponent(name: string, type: 'value-based' | 'fixed') {
    const earningComponent = this.createEarningComponent(name, type);
    this.earningComponentList.push(earningComponent);
  }

  removeEarningComponent(index: number) {
    const earningTypeCode = this.earningComponentList
      .at(index)
      .get('earningTypeCode')?.value;
    if (earningTypeCode !== 'BASIC1') {
      this.earningComponentList.removeAt(index);
      const restoredComponent = this.earningCompListReference.find(
        (item: any) => item.earning_type_code === earningTypeCode
      );
      if (restoredComponent) {
        this.earningCompList.push(restoredComponent);
      }
      this.updateFixedAllowancee();
      this.calculateTotalCTC();
    } else {
      console.error('Cannot remove Basic or Fixed Allowance components');
    }
    this.totalCountCreate();
  }

  addEarningComp(data: any) {
    let selecteddata = data;

    let type: any =
      data.calculation_type === 'Flat Amount' ||
        data.calculation_type === 'Not Applicable'
        ? 'fixed'
        : 'value-based';
    this.earningCompList = this.earningCompList.filter(
      (item: any) => item !== selecteddata
    );
    this.earningComponentList.push(
      this.createEarningComponent(selecteddata.earning_name, type, selecteddata)
    );
    this.updateEarnings();
    // this.totalCountCreate();
  }

  createReiembursementComponent(name: string, data?: any): FormGroup {
    return this.fb.group({
      componentName: [name, Validators.required],
      fixedAllowanceMonthly: [0, Validators.required],
      fixedAllowanceAnnual: [{ value: 0, disabled: true }],
      fixedAmountLimit: [data?.max_limit || 0],
      is_taxable: data?.is_taxable,
      id: data?.id,
      reimbursement_type: data?.reimbursement_type,
      name_in_payslip: data?.reimbursement_type
    });
  }

  createVariableearningComponent(name: string, data?: any): FormGroup {
    return this.fb.group({
      componentName: [name, Validators.required],
      fixedAllowanceMonthly: [''],
      fixedAllowanceAnnual: [data.calculation_amount],
      fixedAmountLimit: [data?.max_limit || 0],
      id: data?.id,
      variableearning_type: data?.variableearning_type,
      is_taxable: data?.is_taxable,
      name_in_payslip: data?.name_in_payslip
    });
  }

  getAllEarningComponentList() {
    const entityType: any = localStorage.getItem('selectedEntityId');
    const financialYear: any = localStorage.getItem('financial_id');
    this._empoloyeeService
      .getAllEarningCompList(entityType, financialYear)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.earningCompList = res.data;
            this.earningCompListReference = [...this.earningCompList];

            this.earningCompList.forEach((erData: any) => {
              if (
                erData.earning_type_code == 'BASIC1' ||
                erData.earning_type_code == 'FIXE33'
              ) {
                // this.addEarningComp(erData);
              }
            });
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
        }
      );
  }

  getAllDeductionComponentList() {
    const entityType: any = localStorage.getItem('selectedEntityId');
    const financialYear: any = localStorage.getItem('financial_id');
    this._empoloyeeService
      .getAllDeductionCompList(entityType, financialYear)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.deductionCompList = res.data;
            this.deductionCompListReference = [...this.deductionCompList];
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
        }
      );
  }

  getAllRiembursementComponentList() {
    const entityType: any = localStorage.getItem('selectedEntityId');
    const financialYear: any = localStorage.getItem('financial_id');
    this._empoloyeeService
      .getAllRiembursementCompList(entityType, financialYear)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.riembursementCompList = res.data;
            this.riembursementCompListReference = [
              ...this.riembursementCompList,
            ];
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
        }
      );
  }
  getAllVariableearningComponentList() {
    this.payrollService.getAllVariableearningComponentList().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.variableearningCompList = res.data;
          this.variableearningCompListReference = [...this.variableearningCompList];
        }
      },
      (err) => {
        this.toastr.error(err.error.message);
      }
    );
  }
  addDeductionComp(data: any) {
    let selecteddata = data;
    let type: any =
      data.calculation_type === 'Flat Amount' ? 'fixed' : 'value-based';
    this.deductionCompList = this.deductionCompList.filter(
      (item: any) => item !== selecteddata
    );
    this.deductionComponentList.push(
      this.createDeductionComponent(selecteddata.deduction_plan, type, data)
    );
    this.updateDeduction();
  }

  removeDeductionComponent(index: number) {
    const componentName = this.deductionComponentList
      .at(index)
      .get('componentName')?.value;
    this.deductionComponentList.removeAt(index);
    const restoredComponent = this.deductionCompListReference.find(
      (item: any) => item.deduction_plan === componentName
    );
    if (restoredComponent) {
      this.deductionCompList.push(restoredComponent);
    }
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  addRiembursementComp(data: any) {
    let selecteddata = data;
    this.riembursementCompList = this.riembursementCompList.filter(
      (item: any) => item !== selecteddata
    );
    this.reiembursementComponentList.push(
      this.createReiembursementComponent(
        selecteddata.reimbursement_type,
        selecteddata
      )
    );
  }
  addVariableearningComp(data: any) {
    console.log(data, 'klklkl');
    let selecteddata = data;
    this.variableearningCompList = this.variableearningCompList.filter(
      (item: any) => item !== selecteddata
    );
    this.variableearningComponentList.push(
      this.createVariableearningComponent(
        selecteddata.variable_earning_name,
        selecteddata
      )
    );
    this.totalCountCreate();
  }

  removeRiembursementComponent(index: number) {
    const componentName = this.reiembursementComponentList
      .at(index)
      .get('componentName')?.value;
    this.reiembursementComponentList.removeAt(index);
    const restoredComponent = this.riembursementCompListReference.find(
      (item: any) => item.reimbursement_type === componentName
    );
    if (restoredComponent) {
      this.riembursementCompList.push(restoredComponent);
    }
    this.updateFixedAllowancee();
    this.totalCountCreate();
  }

  removeVariableearningComponent(index: number) {
    const componentName = this.variableearningComponentList
      .at(index)
      .get('componentName')?.value;
    this.variableearningComponentList.removeAt(index);
    const restoredComponent = this.variableearningCompListReference.find(
      (item: any) => item.variable_earning_name === componentName
    );
    if (restoredComponent) {
      this.variableearningCompList.push(restoredComponent);
    }
    this.totalCountCreate();
  }

  // Method to update all components based on the Annual CTC
  updateCalculations(annualCTC: number) {
    this.updateEarnings();
    this.calculateTotalCTC();
    this.updateDeduction();
  }

  // Method to handle earnings
  updateEarnings() {
    let annualCTC = this.salaryForm.get('annualCTC')?.value;
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    earningArray.controls.forEach((earning: any) => {
      const calculationTypeCode = earning.get('calculationTypeCode')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = earning.get('basicPercentage')?.value;
      const basicSalary = this.getAnnualBasic();
      let annualAmount = 0;
      let monthlyAmount = 0;
      if (calculationTypeCode === 'CTC') {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else if (calculationTypeCode === 'BASIC1') {
        annualAmount = (basicSalary * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }
      if (calculationTypeCode == 'gross_salary') {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }
      earning.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      earning.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
      const formattedAnnualCTC: any = new Intl.NumberFormat().format(
        Number(annualAmount)
      );
      const formattedMonthlyCTC: any = new Intl.NumberFormat().format(
        Number(monthlyAmount)
      );
      earning.get('annualBasic_sep')?.setValue(formattedAnnualCTC.toFixed(2));
      earning.get('monthlyBasic_sep')?.setValue(formattedMonthlyCTC.toFixed(2));
    });
    this.updateFixedAllowancee();
  }

  updateDeduction() {
    let annualCTC = this.salaryForm.get('annualCTC')?.value;
    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    const earningValues = earningArray.value;

    let grossMonthlySalary = annualCTC / 12;
    console.log('Gross Monthly Salary:', grossMonthlySalary);

    // Initialize totals
    this.totalEPF = 0;
    this.totalEpFAnnual = 0;
    this.totalEsiMonth = 0;
    this.totalEsiAnnual = 0;

    // Calculate EPF and ESI base values from eligible components
    earningValues.forEach((val: any) => {
      const monthly = Number(
        val?.monthlyBasic || val?.fixedAllowanceMonthly || 0
      );
      const annual = Number(val?.annualBasic || val?.fixedAllowanceAnnual || 0);

      if (val?.consider_for_epf) {
        this.totalEPF += monthly;
        this.totalEpFAnnual += annual;
      }

      if (val?.consider_for_esi) {
        this.totalEsiMonth += monthly;
        this.totalEsiAnnual += annual;
      }
    });

    deductionArray.controls.forEach((deduction: any) => {
      const calculationType = deduction.get('calculationType')?.value;
      const percentage = Number(deduction.get('basicPercentage')?.value);
      const calculationTypeCode = deduction.get('calculationTypeCode')?.value;
      const componentNameDeduct = deduction.get('componentName')?.value;
      const employeeContribution = Number(
        deduction.get('employee_contribution')?.value || 0
      );

      let annualAmount = 0;
      let monthlyAmount = 0;
      console.log(calculationType, 'kkkkk1111');

      // Generic CTC-based or basic-based calculation
      if (calculationTypeCode === 'CTC') {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else if (calculationTypeCode === 'BASIC1') {
        const basicSalary = this.getAnnualBasic(); // Assume this returns full annual basic
        annualAmount = (basicSalary * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else if (componentNameDeduct === 'EPF') {
        // Employee EPF Contribution
        let epfMonthly = (this.totalEPF * employeeContribution) / 100;
        let epfAnnual = (this.totalEpFAnnual * employeeContribution) / 100;

        // Apply PF Cap
        epfMonthly = Math.min(epfMonthly, this.pfCap);
        epfAnnual = epfMonthly * 12;

        annualAmount = epfAnnual;
        monthlyAmount = epfMonthly;
      } else if (componentNameDeduct === 'ESI') {
        // Use grossMonthlySalary instead of totalEsiMonth for threshold check
        if (grossMonthlySalary <= this.esiThreshold) {
          let esiMonthly = (this.totalEsiMonth * employeeContribution) / 100;
          let esiAnnual = (this.totalEsiAnnual * employeeContribution) / 100;

          annualAmount = esiAnnual;
          monthlyAmount = esiMonthly;
        } else {
          annualAmount = 0;
          monthlyAmount = 0;
        }
      }

      // Set values in the form
      deduction.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      deduction.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });

    // Recalculate totals
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  // Get Basic Salary from dynamic earnings list
  getAnnualBasic(): number {
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    // Find Basic Salary component if it exists
    const basicSalaryComponent = earningArray.controls.find(
      (control) => control.get('earningTypeCode')?.value === 'BASIC1'
    );
    return basicSalaryComponent
      ? basicSalaryComponent.get('annualBasic')?.value
      : 0;
  }

  updateEarningsPercent(earning: any) {
    let annualCTC = this.salaryForm.get('annualCTC')?.value;
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    let grossMonthlySalary = annualCTC / 12;
    earningArray.controls.forEach((earning: any) => {
      const calculationType = earning.get('calculationType')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = earning.get('basicPercentage')?.value;
      const calculationTypeCode = earning.get('calculationTypeCode')?.value;
      const basicSalary = this.getAnnualBasic();
      let tempList = this.earningComponentList.value.find(
        (elem: any) => elem.componentName == earning.value.calculationType
      );
      if (!tempList) {
        tempList = this.deductionComponentList.value.find(
          (elem: any) => elem.componentName == earning.value.calculationType
        );
      }
      if (!tempList) {
        tempList = this.reiembursementComponentList.value.find(
          (elem: any) => elem.componentName == earning.value.calculationType
        );
      }
      if (!tempList) {
        tempList = this.variableearningComponentList.value.find(
          (elem: any) => elem.componentName == earning.value.calculationType
        );
      }
      let annualAmount = 0;
      let monthlyAmount = 0;
      if (tempList) {
        annualAmount = (tempList.annualBasic * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }
      earning.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      earning.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  calculateTotalCTC() {
    // Get raw values from form arrays to ensure all values are included, even if inputs are disabled
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;

    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;

    const reimbursementArray = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    const variableearningArray = this.salaryForm.get(
      'variableearningComponentList'
    ) as FormArray;
    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;
    // Add all earnings (both 'value-based' and 'fixed')
    earningArray.getRawValue().forEach((earning: any) => {
      if (earning.monthlyBasic) {
        // This is a 'value-based' earning
        totalMonthlyCTC += parseFloat(earning.monthlyBasic || '0');
        totalAnnualCTC += parseFloat(earning.annualBasic || '0');
      } else if (earning.fixedAllowanceMonthly) {
        // This is a 'fixed' earning
        totalMonthlyCTC += parseFloat(earning.fixedAllowanceMonthly || '0');
        totalAnnualCTC += parseFloat(earning.fixedAllowanceAnnual || '0');
      }
    });

    // Subtract deductions
    deductionArray.getRawValue().forEach((deduction: any) => {
      if (deduction.monthlyBasic) {
        // This is a 'value-based' earning
        totalMonthlyCTC -= parseFloat(deduction.monthlyBasic || '0');
        totalAnnualCTC -= parseFloat(deduction.annualBasic || '0');
      } else if (deduction.fixedAllowanceMonthly) {
        // This is a 'fixed' earning
        totalMonthlyCTC -= parseFloat(deduction.fixedAllowanceMonthly || '0');
        totalAnnualCTC -= parseFloat(deduction.fixedAllowanceAnnual || '0');
      }
    });

    // Add reimbursements
    reimbursementArray.getRawValue().forEach((reimbursement: any) => {
      totalMonthlyCTC += parseFloat(reimbursement.fixedAllowanceMonthly || '0');
      totalAnnualCTC += parseFloat(reimbursement.fixedAllowanceAnnual || '0');
    });

    // DON'T add variable earnings to main CTC - calculate separately
    this.calculateVariableEarningsTotal();

    // Update form controls or display total CTC wherever needed
    this.totalMonthlyCTC = totalMonthlyCTC.toFixed(2);
    this.totalAnnualCTC = totalAnnualCTC.toFixed(2);
  }

  // start
  gradIdDetail: any;
  // getSalaryTemplateByGradeId() {
  //   let entity_id: any = localStorage.getItem('selectedEntityId');
  //   let financial_id: any = localStorage.getItem('financial_id');
  //   let req = {
  //     id: this.salaryGetData?.grade_id,
  //     entityType: entity_id,
  //     financialYear: financial_id,
  //   };
  //   this._empoloyeeService.salaryTemplateByGradeId(req).subscribe((res) => {
  //     let data = res.data;
  //     const matchedIds = res.data.earningComponentList.map(
  //       (item: any) => item.id
  //     );
  //     const unmatchedDataArray = this.earningCompList.filter(
  //       (item: any) => !matchedIds.includes(item.id)
  //     );
  //     this.earningCompList = unmatchedDataArray;
  //     this.salaryForm?.patchValue({ annualCTC: data?.ctc });
  //     this.gradIdDetail = data;
  //     this.setEarningComponentList(data);
  //   });
  // }

  getSalaryTemplateByGradeId() {
    let entity_id: any = localStorage.getItem('selectedEntityId');
    let financial_id: any = localStorage.getItem('financial_id');

    let req = {
      id: this.salaryGetData?.grade_id,
      entityType: entity_id,
      financialYear: financial_id,
    };

    this._empoloyeeService.salaryTemplateByGradeId(req).subscribe((res) => {
      let data = res.data;
      const matchedIds = res.data.earningComponentList.map(
        (item: any) => item.id
      );

      const unmatchedDataArray = this.earningCompList.filter(
        (item: any) => !matchedIds.includes(item.id)
      );

      this.earningCompList = unmatchedDataArray;
      this.salaryForm?.patchValue({ annualCTC: data?.ctc });
      this.gradIdDetail = data;

      this.setEarningComponentList(data);
      // this.setDeductionComponentList(data)
      // this.setReiembursementComponentList(data)
    });
  }

  setEarningComponentList(data: any) {
    let temp = this.earningCompList;
    let temp2 = this.deductionCompList;
    let temp3 = this.riembursementCompList;
    let temp4 = this.variableearningCompList;

    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;
    if (this.templateSeletc === true) {
      this.enterSalary('fromAnnualCtc');
    }

    let totalDeductionMonthlyCTC = 0;
    let totalDeductionAnnualCTC = 0;
    if (data?.earningComponentList?.length) {
      data?.earningComponentList?.forEach((item: any, index: number) => {
        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly)
            totalMonthlyCTC =
              totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual)
            totalAnnualCTC =
              totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
        } else {
          if (item?.monthlyBasic)
            totalMonthlyCTC = totalMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic)
            totalAnnualCTC = totalAnnualCTC + Number(item?.annualBasic);
        }
        this.earningCompList.forEach((value: any, i: any) => {
          if (value.earning_name == item?.componentName) {
            temp.splice(i, 1);
          }
        });

        const formGroup = this.earningComponentList?.at(index) as FormGroup;

        if (formGroup) {
          if (item?.calculation_type == 'Flat Amount') {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              fixedAllowanceMonthly: item?.monthlyBasic,
              fixedAllowanceAnnual: item?.annualBasic,
              calculation_type: item?.calculation_type,
              id: item?.id,
              name_in_payslip: item?.name_in_payslip,
              mark_as_active: item?.mark_as_active,
              is_part_of_salary_structure: item?.is_part_of_salary_structure,
              is_taxable: item?.is_taxable,
              is_pro_rata: item?.is_pro_rata,
              consider_for_epf: item?.consider_for_epf,
              epf_condition: item?.epf_condition,
              consider_for_esi: item?.consider_for_esi,
              show_in_payslip: item?.show_in_payslip,
              created_by: item?.created_by,
              is_active: item?.is_active,
            });
          } else {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              basicPercentage: item?.basicPercentage,
              annualBasic: item?.annualBasic,
              monthlyBasic: item?.monthlyBasic,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              calculation_type: item?.calculation_type,
              id: item?.id,
              name_in_payslip: item?.name_in_payslip,
              mark_as_active: item?.mark_as_active,
              is_part_of_salary_structure: item?.is_part_of_salary_structure,
              is_taxable: item?.is_taxable,
              is_pro_rata: item?.is_pro_rata,
              consider_for_epf: item?.consider_for_epf,
              epf_condition: item?.epf_condition,
              consider_for_esi: item?.consider_for_esi,
              show_in_payslip: item?.show_in_payslip,
              created_by: item?.created_by,
              is_active: item?.is_active,
            });
          }
        } else {
          if (item?.calculation_type == 'Flat Amount') {
            this.earningComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
                fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
                calculation_type: item?.calculation_type,
                id: item?.id,
                name_in_payslip: item?.name_in_payslip,
                mark_as_active: item?.mark_as_active,
                is_part_of_salary_structure: item?.is_part_of_salary_structure,
                is_taxable: item?.is_taxable,
                is_pro_rata: item?.is_pro_rata,
                consider_for_epf: item?.consider_for_epf,
                epf_condition: item?.epf_condition,
                consider_for_esi: item?.consider_for_esi,
                show_in_payslip: item?.show_in_payslip,
                created_by: item?.created_by,
                is_active: item?.is_active,
              })
            );
          } else {
            this.earningComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                basicPercentage: item?.basicPercentage,
                annualBasic: item?.annualBasic,
                monthlyBasic: item?.monthlyBasic,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                calculation_type: item?.calculation_type,
                id: item?.id,
                name_in_payslip: item?.name_in_payslip,
                mark_as_active: item?.mark_as_active,
                is_part_of_salary_structure: item?.is_part_of_salary_structure,
                is_taxable: item?.is_taxable,
                is_pro_rata: item?.is_pro_rata,
                consider_for_epf: item?.consider_for_epf,
                epf_condition: item?.epf_condition,
                consider_for_esi: item?.consider_for_esi,
                show_in_payslip: item?.show_in_payslip,
                created_by: item?.created_by,
                is_active: item?.is_active,
              })
            );
          }
        }
      });
    }

    // ****************
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;

    const earningModify = earningArray.value;

    this.totalEPF = 0;
    this.totalEpFAnnual = 0;
    this.totalEsiMonth = 0;
    this.totalEsiAnnual = 0;

    earningModify.forEach((val: any) => {
      const monthly = Number(
        val?.monthlyBasic || val?.fixedAllowanceMonthly || 0
      );
      const annual = Number(val?.annualBasic || val?.fixedAllowanceAnnual || 0);

      if (val?.consider_for_epf) {
        this.totalEPF += monthly;
        this.totalEpFAnnual += annual;
      }

      if (val?.consider_for_esi) {
        this.totalEsiMonth += monthly;
        this.totalEsiAnnual += annual;
      }
    });

    earningModify.forEach((data: any) => {
      if (data?.componentName == 'Basic Salary') {
        const monthlyBasicGet = data;
      }
    });

    if (data?.deductionComponentList?.length || data?.deductionArray?.length) {
      let deductData = data?.deductionComponentList || data?.deductionArray;
      deductData?.forEach((item: any, index: number) => {
        this.deductionCompList?.forEach((value: any, i: any) => {
          if (value.deduction_plan == item?.componentName) {
            temp2.splice(i, 1);
          }
        });

        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly)
            totalDeductionMonthlyCTC =
              totalDeductionMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual)
            totalDeductionAnnualCTC =
              totalDeductionAnnualCTC + Number(item?.fixedAllowanceAnnual);
        } else if (item?.deduction_plan == 'EPF') {
          const epfEmployeeMonthly =
            (this.totalEPF * Number(item?.employee_contribution)) / 100;
          const epfMonthlyCapped = Math.min(epfEmployeeMonthly, this.pfCap);

          item.monthlyBasic = epfMonthlyCapped;
          item.annualBasic = epfMonthlyCapped * 12;

          totalDeductionMonthlyCTC += epfMonthlyCapped;
          totalDeductionAnnualCTC += epfMonthlyCapped * 12;

          this.employeerContribution =
            (this.totalEPF * Number(item?.employer_contribution)) / 100;
          this.employeerContributionMatched = Math.min(
            this.employeerContribution,
            this.pfCap
          );

          const finalEpfMatched =
            epfMonthlyCapped + this.employeerContributionMatched;

          const epfComponents = earningModify
            .filter((e: any) => e?.consider_for_epf)
            .map((e: any) => e?.componentName)
            .join(' + ');

          this.labelCalculation = `(${epfComponents})`;
        } else if (item?.deduction_plan == 'ESI') {
          if (totalMonthlyCTC <= this.esiThreshold) {
            const esiMonthly =
              (this.totalEsiMonth * Number(item?.employee_contribution)) / 100;
            const esiAnnual =
              (this.totalEsiAnnual * Number(item?.employee_contribution)) / 100;

            item.monthlyBasic = esiMonthly.toFixed(2);
            item.annualBasic = esiAnnual.toFixed(2);

            totalDeductionMonthlyCTC += esiMonthly;
            totalDeductionAnnualCTC += esiAnnual;

            this.employeerContributionEsi =
              (this.totalEsiMonth * Number(item?.employer_contribution)) / 100;
          } else {
            item.monthlyBasic = 0;
            item.annualBasic = 0;
            this.employeerContributionEsi = 0;
          }

          const esiComponents = earningModify
            .filter((e: any) => e?.consider_for_esi)
            .map((e: any) => e?.componentName)
            .join(' + ');

          this.labelCalculation = `(${esiComponents})`;
        } else {
          totalDeductionMonthlyCTC += Number(item?.monthlyBasic || 0);
          totalDeductionAnnualCTC += Number(item?.annualBasic || 0);
        }
        const formGroup = this.deductionComponentList?.at(index) as FormGroup;
        if (formGroup) {
          if (item?.calculation_type == 'Flat Amount') {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName || item?.deduction_plan,
              calculationType: item?.calculationType || this.labelCalculation,
              calculationTypeCode: item?.calculationTypeCode,
              fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
              fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
              calculation_type: item?.calculation_type,
              id: item?.id,
              epf_number: item?.epf_number,
              deduction_cycle: item?.deduction_cycle,
              employer_contribution_rate: item?.employee_contribution_rate,
              is_employer_contribution_in_ctc:
                item?.is_employer_contribution_in_ctc,
              is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
              is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
              override_at_employee_level: item?.override_at_employee_level,
              is_pro_rate_restricted_pf_wage:
                item?.is_pro_rate_restricted_pf_wage,
              consider_salary_components_if_low_pf:
                item?.consider_salary_components_if_low_pf,
              employee_contribution: item?.employee_contribution,
              employer_contribution: item?.employer_contribution,
              deduction_plan: item?.deduction_plan,
              esi_number: item?.esi_number,
              name_in_payslip: item?.name_in_payslip
            });
          } else {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName || item?.deduction_plan,
              basicPercentage:
                item?.basicPercentage || item?.employee_contribution,
              annualBasic: item?.annualBasic,
              monthlyBasic: item?.monthlyBasic?.toFixed(2),
              calculationType: item?.calculationType || this.labelCalculation,
              calculationTypeCode: item?.calculationTypeCode,
              calculation_type: item?.calculation_type,
              id: item?.id,
              epf_number: item?.epf_number,
              deduction_cycle: item?.deduction_cycle,
              employer_contribution_rate: item?.employee_contribution_rate,
              is_employer_contribution_in_ctc:
                item?.is_employer_contribution_in_ctc,
              is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
              is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
              override_at_employee_level: item?.override_at_employee_level,
              is_pro_rate_restricted_pf_wage:
                item?.is_pro_rate_restricted_pf_wage,
              consider_salary_components_if_low_pf:
                item?.consider_salary_components_if_low_pf,
              employee_contribution: item?.employee_contribution,
              employer_contribution: item?.employer_contribution,
              deduction_plan: item?.deduction_plan,
              esi_number: item?.esi_number,
              name_in_payslip: item?.name_in_payslip
            });
          }
        } else {
          if (item?.calculation_type == 'Flat Amount') {
            this.deductionComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName || item?.deduction_plan,
                calculationType: item?.calculationType || this.labelCalculation,
                calculationTypeCode: item?.calculationTypeCode,
                fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
                fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
                calculation_type: item?.calculation_type,
                id: item?.id,
                epf_number: item?.epf_number,
                deduction_cycle: item?.deduction_cycle,
                employer_contribution_rate: item?.employee_contribution_rate,
                is_employer_contribution_in_ctc:
                  item?.is_employer_contribution_in_ctc,
                is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
                is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
                override_at_employee_level: item?.override_at_employee_level,
                is_pro_rate_restricted_pf_wage:
                  item?.is_pro_rate_restricted_pf_wage,
                consider_salary_components_if_low_pf:
                  item?.consider_salary_components_if_low_pf,
                employee_contribution: item?.employee_contribution,
                employer_contribution: item?.employer_contribution,
                deduction_plan: item?.deduction_plan,
                esi_number: item?.esi_number,
                name_in_payslip: item?.name_in_payslip
              })
            );
          } else {
            this.deductionComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName || item?.deduction_plan,
                basicPercentage:
                  item?.basicPercentage || item?.employee_contribution,
                annualBasic: item?.annualBasic,
                monthlyBasic: item?.monthlyBasic,
                calculationType: item?.calculationType || this.labelCalculation,
                calculationTypeCode: item?.calculationTypeCode,
                calculation_type: item?.calculation_type,
                id: item?.id,
                epf_number: item?.epf_number,
                deduction_cycle: item?.deduction_cycle,
                employer_contribution_rate: item?.employee_contribution_rate,
                is_employer_contribution_in_ctc:
                  item?.is_employer_contribution_in_ctc,
                is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
                is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
                override_at_employee_level: item?.override_at_employee_level,
                is_pro_rate_restricted_pf_wage:
                  item?.is_pro_rate_restricted_pf_wage,
                consider_salary_components_if_low_pf:
                  item?.consider_salary_components_if_low_pf,
                employee_contribution: item?.employee_contribution,
                employer_contribution: item?.employer_contribution,
                deduction_plan: item?.deduction_plan,
                esi_number: item?.esi_number,
                name_in_payslip: item?.name_in_payslip
              })
            );
          }
        }
      });
    }

    // ***********************
    if (data?.reiembursementComponentList?.length) {
      data?.reiembursementComponentList?.forEach((item: any, index: number) => {
        this.riembursementCompList.forEach((value: any, i: any) => {
          if (value.reimbursement_name == item?.componentName) {
            temp3.splice(i, 1);
          }
        });

        if (item?.fixedAllowanceMonthly)
          totalMonthlyCTC =
            totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
        if (item?.fixedAllowanceAnnual)
          totalAnnualCTC = totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
        const formGroup = this.reiembursementComponentList?.at(
          index
        ) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            componentName: item?.componentName,
            fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
            fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
            fixedAmountLimit: item?.fixedAmountLimit,
            id: item?.id,
            reimbursement_type: item?.reimbursement_type,
            is_taxable: item?.is_taxable,
            name_in_payslip: item?.reimbursement_type
          });
        } else {
          this.reiembursementComponentList.push(
            this.fb.group({
              componentName: item?.componentName,
              fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
              fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
              fixedAmountLimit: item?.fixedAmountLimit,
              id: item?.id,
              reimbursement_type: item?.reimbursement_type,
              is_taxable: item?.is_taxable,
              name_in_payslip: item?.reimbursement_type
            })
          );
        }
      });
    }
    // For Variableearning  start //
    if (data?.variableearningComponentList?.length) {
      data?.variableearningComponentList?.forEach((item: any, index: number) => {
        this.variableearningCompList?.forEach((value: any, i: any) => {
          if (value?.variable_earning_name == item?.componentName) {
            temp4.splice(i, 1);
          }
        });

        if (item?.fixedAllowanceMonthly)
          totalMonthlyCTC =
            totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
        if (item?.fixedAllowanceAnnual)
          totalAnnualCTC = totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
        const formGroup = this.variableearningComponentList?.at(
          index
        ) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            componentName: item?.componentName,
            fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
            fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
            fixedAmountLimit: item?.fixedAmountLimit,
            id: item?.id,
            variableearning_type: item?.variableearning_type,
            is_taxable: item?.is_taxable,
            name_in_payslip: item?.name_in_payslip
          });
        } else {
          this.variableearningComponentList.push(
            this.fb.group({
              componentName: item?.componentName,
              fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
              fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
              fixedAmountLimit: item?.fixedAmountLimit,
              id: item?.id,
              variableearning_type: item?.variableearning_type,
              is_taxable: item?.is_taxable,
              name_in_payslip: item?.name_in_payslip
            })
          );
        }
      });
    }
    this.totalMonthlyCTC = (totalMonthlyCTC - totalDeductionMonthlyCTC).toFixed(
      2
    );

    this.totalAnnualCTC = (totalAnnualCTC - totalDeductionAnnualCTC).toFixed(2);

    // this.earningCompList = temp;
    // this.deductionCompList = temp2;
    // this.riembursementCompList = temp3;
    this.calculateTotalCTC();
  }
  // setEarningComponentList(data: any) {
  //   let temp = this.earningCompList;
  //   let temp2 = this.deductionCompList;
  //   let temp3 = this.riembursementCompList;
  //   let totalMonthlyCTC = 0;
  //   let totalAnnualCTC = 0;
  //   if (this.templateSeletc === true) {
  //     this.enterSalary('fromAnnualCtc');
  //   }
  //   let totalDeductionMonthlyCTC = 0;
  //   let totalDeductionAnnualCTC = 0;
  //   if (data?.earningComponentList?.length) {
  //     data?.earningComponentList?.forEach((item: any, index: number) => {
  //       if (item?.calculation_type == 'Flat Amount') {
  //         if (item?.fixedAllowanceMonthly)
  //           totalMonthlyCTC =
  //             totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
  //         if (item?.fixedAllowanceAnnual)
  //           totalAnnualCTC =
  //             totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
  //       } else {
  //         if (item?.monthlyBasic)
  //           totalMonthlyCTC = totalMonthlyCTC + Number(item?.monthlyBasic);
  //         if (item?.annualBasic)
  //           totalAnnualCTC = totalAnnualCTC + Number(item?.annualBasic);
  //       }
  //       this.earningCompList.forEach((value: any, i: any) => {
  //         if (value.earning_name == item?.componentName) {
  //           temp.splice(i, 1);
  //         }
  //       });

  //       const formGroup = this.earningComponentList?.at(index) as FormGroup;
  //       if (formGroup) {
  //         if (item?.calculation_type == 'Flat Amount') {
  //           formGroup.patchValue({
  //             earningTypeCode: item?.earningTypeCode,
  //             componentName: item?.componentName,
  //             calculationType: item?.calculationType,
  //             calculationTypeCode: item?.calculationTypeCode,
  //             fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
  //             fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
  //             calculation_type: item?.calculation_type,
  //             id: item?.id,
  //             name_in_payslip: item?.name_in_payslip,
  //             mark_as_active: item?.mark_as_active,
  //             is_part_of_salary_structure: item?.is_part_of_salary_structure,
  //             is_taxable: item?.is_taxable,
  //             is_pro_rata: item?.is_pro_rata,
  //             consider_for_epf: item?.consider_for_epf,
  //             epf_condition: item?.epf_condition,
  //             consider_for_esi: item?.consider_for_esi,
  //             show_in_payslip: item?.show_in_payslip,
  //             created_by: item?.created_by,
  //             is_active: item?.is_active,
  //           });
  //         } else {
  //           formGroup.patchValue({
  //             earningTypeCode: item?.earningTypeCode,
  //             componentName: item?.componentName,
  //             basicPercentage: item?.basicPercentage,
  //             annualBasic: item?.annualBasic,
  //             monthlyBasic: item?.monthlyBasic,
  //             calculationType: item?.calculationType,
  //             calculationTypeCode: item?.calculationTypeCode,
  //             calculation_type: item?.calculation_type,
  //             id: item?.id,
  //             name_in_payslip: item?.name_in_payslip,
  //             mark_as_active: item?.mark_as_active,
  //             is_part_of_salary_structure: item?.is_part_of_salary_structure,
  //             is_taxable: item?.is_taxable,
  //             is_pro_rata: item?.is_pro_rata,
  //             consider_for_epf: item?.consider_for_epf,
  //             epf_condition: item?.epf_condition,
  //             consider_for_esi: item?.consider_for_esi,
  //             show_in_payslip: item?.show_in_payslip,
  //             created_by: item?.created_by,
  //             is_active: item?.is_active,
  //             annualBasic_sep: item?.annualBasic,
  //             monthlyBasic_sep: item?.monthlyBasic,
  //           });
  //         }
  //       } else {
  //         if (item?.calculation_type == 'Flat Amount') {
  //           this.earningComponentList.push(
  //             this.fb.group({
  //               earningTypeCode: item?.earningTypeCode,
  //               componentName: item?.componentName,
  //               calculationType: item?.calculationType,
  //               calculationTypeCode: item?.calculationTypeCode,
  //               fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
  //               fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
  //               calculation_type: item?.calculation_type,
  //               id: item?.id,
  //               name_in_payslip: item?.name_in_payslip,
  //               mark_as_active: item?.mark_as_active,
  //               is_part_of_salary_structure: item?.is_part_of_salary_structure,
  //               is_taxable: item?.is_taxable,
  //               is_pro_rata: item?.is_pro_rata,
  //               consider_for_epf: item?.consider_for_epf,
  //               epf_condition: item?.epf_condition,
  //               consider_for_esi: item?.consider_for_esi,
  //               show_in_payslip: item?.show_in_payslip,
  //               created_by: item?.created_by,
  //               is_active: item?.is_active,
  //             })
  //           );
  //         } else {
  //           this.earningComponentList.push(
  //             this.fb.group({
  //               earningTypeCode: item?.earningTypeCode,
  //               componentName: item?.componentName,
  //               basicPercentage: item?.basicPercentage,
  //               annualBasic: item?.annualBasic,
  //               monthlyBasic: item?.monthlyBasic,
  //               calculationType: item?.calculationType,
  //               calculationTypeCode: item?.calculationTypeCode,
  //               calculation_type: item?.calculation_type,
  //               id: item?.id,
  //               name_in_payslip: item?.name_in_payslip,
  //               mark_as_active: item?.mark_as_active,
  //               is_part_of_salary_structure: item?.is_part_of_salary_structure,
  //               is_taxable: item?.is_taxable,
  //               is_pro_rata: item?.is_pro_rata,
  //               consider_for_epf: item?.consider_for_epf,
  //               epf_condition: item?.epf_condition,
  //               consider_for_esi: item?.consider_for_esi,
  //               show_in_payslip: item?.show_in_payslip,
  //               created_by: item?.created_by,
  //               is_active: item?.is_active,
  //               annualBasic_sep: item?.annualBasic,
  //               monthlyBasic_sep: item?.monthlyBasic,
  //             })
  //           );
  //         }
  //       }
  //     });
  //   }

  //   // ****************
  //   const earningArray = this.salaryForm.get(
  //     'earningComponentList'
  //   ) as FormArray;
  //   console.log(earningArray.value, 'earningArray<<<<<');
  //   const earningModify = earningArray.value;
  //   let basicEPFMonth: number = 0;
  //   let OtherAllownceEpfMonth: number = 0;
  //   let basicEPFAnnual: number = 0;
  //   let OtherAllownceEpfYear: number = 0;
  //   let basicEsiMonth: number = 0;
  //   let basicEsiAnnual: number = 0;
  //   earningModify.forEach((val: any) => {
  //     // Check for 'Basic Salary' component
  //     if (val?.componentName === 'Basic Salary') {
  //       basicEPFMonth = Number(val?.monthlyBasic);
  //       basicEPFAnnual = Number(val?.annualBasic);
  //     }
  //     if (val?.componentName === 'Other Allowance') {
  //       OtherAllownceEpfMonth = Number(val?.monthlyBasic);
  //       OtherAllownceEpfYear = Number(val?.annualBasic);
  //     }
  //     if (val?.earningTypeCode === 'HRA2') {
  //       basicEsiMonth = Number(val?.monthlyBasic);
  //       basicEsiAnnual = Number(val?.annualBasic);
  //     }
  //   });
  //   // Now calculate total EPF outside the loop
  //   this.totalEPF = basicEPFMonth + OtherAllownceEpfMonth;
  //   this.totalEpFAnnual = basicEPFAnnual + OtherAllownceEpfYear;
  //   this.totalEsiMonth = basicEPFMonth + basicEsiMonth;
  //   this.totalEsiAnnual = basicEPFAnnual + basicEsiAnnual;
  //   earningModify.forEach((data: any) => {
  //     if (data?.componentName == 'Basic Salary') {
  //       const monthlyBasicGet = data;
  //     }
  //   });
  //   if (data?.deductionComponentList?.length || data?.deductionArray?.length) {
  //     let deductData = data?.deductionComponentList || data?.deductionArray;
  //     deductData?.forEach((item: any, index: number) => {
  //       this.deductionCompList?.forEach((value: any, i: any) => {
  //         if (value.deduction_plan == item?.componentName) {
  //           temp2.splice(i, 1);
  //         }
  //       });

  //       if (item?.calculation_type == 'Flat Amount') {
  //         if (item?.fixedAllowanceMonthly)
  //           totalDeductionMonthlyCTC =
  //             totalDeductionMonthlyCTC + Number(item?.fixedAllowanceMonthly);
  //         if (item?.fixedAllowanceAnnual)
  //           totalDeductionAnnualCTC =
  //             totalDeductionAnnualCTC + Number(item?.fixedAllowanceAnnual);
  //       } else if (item?.deduction_plan == 'EPF') {
  //         item.monthlyBasic =
  //           (this.totalEPF * Number(item?.employee_contribution)) / 100;
  //         item.annualBasic =
  //           (this.totalEpFAnnual * Number(item?.employee_contribution)) / 100;
  //         if (item.monthlyBasic >= 13200) {
  //           totalDeductionMonthlyCTC += 13200;
  //         } else if (item.monthlyBasic < 13200) {
  //           totalDeductionMonthlyCTC += Number(item?.monthlyBasic);
  //         }
  //         totalDeductionAnnualCTC += Number(item?.annualBasic);
  //         this.employeerContribution =
  //           (this.totalEPF * Number(item?.employer_contribution)) / 100;
  //         if (this.employeerContribution >= 1800) {
  //           this.employeerContributionMatched = 1800;
  //         } else if (this.employeerContribution <= 1800) {
  //           this.employeerContributionMatched = this.employeerContribution;
  //         }

  //         const finalEpfMatcd =
  //           Number(item?.monthlyBasic) + this.employeerContributionMatched;
  //         if (finalEpfMatcd >= 15000) {
  //         }
  //         this.labelCalculation = '(Basic Salary + Other Allowances)';
  //       } else if (item?.deduction_plan == 'ESI') {
  //         item.monthlyBasic = (
  //           (this.totalEsiMonth * Number(item?.employee_contribution)) /
  //           100
  //         ).toFixed(2);
  //         item.annualBasic = (
  //           (this.totalEsiAnnual * Number(item?.employee_contribution)) /
  //           100
  //         ).toFixed(2);
  //         totalDeductionMonthlyCTC += Number(item?.monthlyBasic);
  //         totalDeductionAnnualCTC += Number(item?.annualBasic);
  //         this.employeerContributionEsi =
  //           (this.totalEsiMonth * Number(item?.employer_contribution)) / 100;
  //         this.labelCalculation = '(Basic Salary + HRA)';
  //       } else {
  //         console.log(item, 'item<<<<<<<<<<<<<<<<<<<<<<<<<<');

  //         if (item?.monthlyBasic)
  //           totalDeductionMonthlyCTC =
  //             totalDeductionMonthlyCTC + Number(item?.monthlyBasic);
  //         if (item?.annualBasic)
  //           totalDeductionAnnualCTC =
  //             totalDeductionAnnualCTC + Number(item?.annualBasic);
  //       }
  //       const formGroup = this.deductionComponentList?.at(index) as FormGroup;
  //       if (formGroup) {
  //         if (item?.calculation_type == 'Flat Amount') {
  //           formGroup.patchValue({
  //             earningTypeCode: item?.earningTypeCode,
  //             componentName: item?.componentName || item?.deduction_plan,
  //             calculationType: item?.calculationType || this.labelCalculation,
  //             calculationTypeCode: item?.calculationTypeCode,
  //             fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
  //             fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
  //             calculation_type: item?.calculation_type,
  //             id: item?.id,
  //             epf_number: item?.epf_number,
  //             deduction_cycle: item?.deduction_cycle,
  //             employer_contribution_rate: item?.employee_contribution_rate,
  //             is_employer_contribution_in_ctc:
  //               item?.is_employer_contribution_in_ctc,
  //             is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
  //             is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
  //             override_at_employee_level: item?.override_at_employee_level,
  //             is_pro_rate_restricted_pf_wage:
  //               item?.is_pro_rate_restricted_pf_wage,
  //             consider_salary_components_if_low_pf:
  //               item?.consider_salary_components_if_low_pf,
  //             employee_contribution: item?.employee_contribution,
  //             employer_contribution: item?.employer_contribution,
  //             deduction_plan: item?.deduction_plan,
  //             esi_number: item?.esi_number,
  //           });
  //         } else {
  //           formGroup.patchValue({
  //             earningTypeCode: item?.earningTypeCode,
  //             componentName: item?.componentName || item?.deduction_plan,
  //             basicPercentage:
  //               item?.basicPercentage || item?.employee_contribution,
  //             annualBasic: item?.annualBasic,
  //             monthlyBasic: item?.monthlyBasic?.toFixed(2),
  //             calculationType: item?.calculationType || this.labelCalculation,
  //             calculationTypeCode: item?.calculationTypeCode,
  //             calculation_type: item?.calculation_type,
  //             id: item?.id,
  //             epf_number: item?.epf_number,
  //             deduction_cycle: item?.deduction_cycle,
  //             employer_contribution_rate: item?.employee_contribution_rate,
  //             is_employer_contribution_in_ctc:
  //               item?.is_employer_contribution_in_ctc,
  //             is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
  //             is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
  //             override_at_employee_level: item?.override_at_employee_level,
  //             is_pro_rate_restricted_pf_wage:
  //               item?.is_pro_rate_restricted_pf_wage,
  //             consider_salary_components_if_low_pf:
  //               item?.consider_salary_components_if_low_pf,
  //             employee_contribution: item?.employee_contribution,
  //             employer_contribution: item?.employer_contribution,
  //             deduction_plan: item?.deduction_plan,
  //             esi_number: item?.esi_number,
  //           });
  //         }
  //       } else {
  //         if (item?.calculation_type == 'Flat Amount') {
  //           this.deductionComponentList.push(
  //             this.fb.group({
  //               earningTypeCode: item?.earningTypeCode,
  //               componentName: item?.componentName || item?.deduction_plan,
  //               // basicPercentage: item?.basicPercentage,
  //               calculationType: item?.calculationType || this.labelCalculation,
  //               calculationTypeCode: item?.calculationTypeCode,
  //               fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
  //               fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
  //               calculation_type: item?.calculation_type,
  //               id: item?.id,
  //               epf_number: item?.epf_number,
  //               deduction_cycle: item?.deduction_cycle,
  //               employer_contribution_rate: item?.employee_contribution_rate,
  //               is_employer_contribution_in_ctc:
  //                 item?.is_employer_contribution_in_ctc,
  //               is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
  //               is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
  //               override_at_employee_level: item?.override_at_employee_level,
  //               is_pro_rate_restricted_pf_wage:
  //                 item?.is_pro_rate_restricted_pf_wage,
  //               consider_salary_components_if_low_pf:
  //                 item?.consider_salary_components_if_low_pf,
  //               employee_contribution: item?.employee_contribution,
  //               employer_contribution: item?.employer_contribution,
  //               deduction_plan: item?.deduction_plan,
  //               esi_number: item?.esi_number,
  //             })
  //           );
  //         } else {
  //           this.deductionComponentList.push(
  //             this.fb.group({
  //               earningTypeCode: item?.earningTypeCode,
  //               componentName: item?.componentName || item?.deduction_plan,
  //               basicPercentage:
  //                 item?.basicPercentage || item?.employee_contribution,
  //               annualBasic: item?.annualBasic,
  //               monthlyBasic: item?.monthlyBasic,
  //               calculationType: item?.calculationType || this.labelCalculation,
  //               calculationTypeCode: item?.calculationTypeCode,
  //               calculation_type: item?.calculation_type,
  //               id: item?.id,
  //               epf_number: item?.epf_number,
  //               deduction_cycle: item?.deduction_cycle,
  //               employer_contribution_rate: item?.employee_contribution_rate,
  //               is_employer_contribution_in_ctc:
  //                 item?.is_employer_contribution_in_ctc,
  //               is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
  //               is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
  //               override_at_employee_level: item?.override_at_employee_level,
  //               is_pro_rate_restricted_pf_wage:
  //                 item?.is_pro_rate_restricted_pf_wage,
  //               consider_salary_components_if_low_pf:
  //                 item?.consider_salary_components_if_low_pf,
  //               employee_contribution: item?.employee_contribution,
  //               employer_contribution: item?.employer_contribution,
  //               deduction_plan: item?.deduction_plan,
  //               esi_number: item?.esi_number,
  //             })
  //           );
  //         }
  //       }
  //     });
  //   }
  //   // ***********************
  //   if (data?.reiembursementComponentList?.length) {

  //     data?.reiembursementComponentList?.forEach((item: any, index: number) => {
  //       this.riembursementCompList.forEach((value: any, i: any) => {
  //         if (value.reimbursement_name == item?.componentName) {
  //           temp3.splice(i, 1);
  //         }
  //       });

  //       if (item?.fixedAllowanceMonthly)
  //         totalMonthlyCTC =
  //           totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
  //       if (item?.fixedAllowanceAnnual)
  //         totalAnnualCTC = totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
  //       const formGroup = this.reiembursementComponentList?.at(
  //         index
  //       ) as FormGroup;
  //       if (formGroup) {
  //         formGroup.patchValue({
  //           componentName: item?.componentName,
  //           fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
  //           fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
  //           fixedAmountLimit: item?.fixedAmountLimit,
  //           id: item?.id,
  //           reimbursement_type: item?.reimbursement_type,
  //           is_taxable: item?.is_taxable,
  //         });
  //       } else {
  //         this.reiembursementComponentList.push(
  //           this.fb.group({
  //             componentName: item?.componentName,
  //             fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
  //             fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
  //             fixedAmountLimit: item?.fixedAmountLimit,
  //             id: item?.id,
  //             reimbursement_type: item?.reimbursement_type,
  //             is_taxable: item?.is_taxable,
  //           })
  //         );
  //       }
  //     });
  //   }

  //   this.totalMonthlyCTC = (totalMonthlyCTC - totalDeductionMonthlyCTC).toFixed(
  //     2
  //   );
  //   this.totalAnnualCTC = (totalAnnualCTC - totalDeductionAnnualCTC).toFixed(2);
  //   this.earningCompList = temp;
  //   this.deductionCompList = temp2;
  //   this.riembursementCompList = temp3;
  // }

  // enterSalary(actionType: any) {
  //   if (actionType == 'fromAnnualCtc') {
  //     let annualCTC = this.salaryForm?.value?.annualCTC;
  //     let annualCTCAll = annualCTC / 12;
  //     let salary_per_day = annualCTCAll / 30;
  //     let salary_per_hr = salary_per_day / 8;
  //     this.salaryForm?.patchValue({
  //       salary_per_day: salary_per_day?.toFixed(2),
  //       salary_per_hr: salary_per_hr?.toFixed(2),
  //       basic_salary: annualCTCAll?.toFixed(2),
  //       monthlyCTC: (annualCTC / 12).toFixed(2),
  //     });
  //   } else {
  //     let basic_salary = this.salaryForm?.value?.basic_salary;
  //     let salary_per_day = basic_salary / 30;
  //     let salary_per_hr = salary_per_day / 8;
  //     this.salaryForm?.patchValue({
  //       salary_per_day: salary_per_day?.toFixed(2),
  //       salary_per_hr: salary_per_hr?.toFixed(2),
  //       annualCTC: basic_salary,
  //     });
  //   }
  // }

  enterSalary(actionType: any) {
    if (actionType == 'fromAnnualCtc') {
      let annualCTC = this.salaryForm?.value?.annualCTC;
      let annualCTCAll = annualCTC / 12;

      let salary_per_day = annualCTCAll / 30;
      let salary_per_hr = salary_per_day / 8;
      this.salaryForm?.patchValue({
        salary_per_day: salary_per_day?.toFixed(2),
        salary_per_hr: salary_per_hr?.toFixed(2),
        basic_salary: annualCTCAll?.toFixed(2),
        monthlyCTC: (annualCTC / 12).toFixed(2),
      });
    } else {
      let basic_salary = this.salaryForm?.value?.basic_salary;
      let salary_per_day = basic_salary / 30;
      let salary_per_hr = salary_per_day / 8;
      this.salaryForm?.patchValue({
        salary_per_day: salary_per_day?.toFixed(2),
        salary_per_hr: salary_per_hr?.toFixed(2),
        annualCTC: basic_salary,
      });
    }
  }

  getAllSaleryTemp() {
    let data = {
      entityType: this.entity_Id,
      financialYear: this.finacialId,
    };
    this._empoloyeeService.getAllSaleryTemplate(data).subscribe((res: any) => {
      this.saleryTempData = res.data;
    });
  }

  selectTemp(e: any) {
    let value = this.salaryForm.value;
    this.saleryTempData.forEach((res: any) => {
      if (res?.id === e?.value) {
        this.templateName = res?.template_name;
      }
    });
    this.deductionComponentList.clear();
    this.reiembursementComponentList.clear();

    this._empoloyeeService
      .getBySaleryTemplate(e.value)
      .subscribe((res: any) => {
        this.getByTempData = res.data;
        this.templateSeletc = true;
        this.currency_id = this.getByTempData.currency_id;
        this.salaryPatch(this.getByTempData);
        const ctsCountValue = this.getByTempData?.ctc / 12;
        this.salaryForm?.patchValue({
          annualCTC: this.getByTempData?.ctc,
          monthlyCTC: ctsCountValue,
        });
        if (value?.epf_type === 'FORM_11') {
          this.getByTempData.deductionComponentList =
            this.getByTempData?.deductionComponentList?.filter(
              (item: any) =>
                item.deduction_plan !== 'EPF' && item.deduction_plan !== 'ESI'
            );
        }
        this.selectTempdata = {
          earningComponentList: this.getByTempData?.earningComponentList,
          deductionComponentList: this.getByTempData?.deductionComponentList,
          reiembursementComponentList:
            this.getByTempData?.reiembursementComponentList,
        };
        this.setEarningComponentList(this.selectTempdata);
        this.getCurrencyData?.forEach((cur: any) => {
          if (this.getByTempData?.currency_id === cur?.Currency_Convert_id) {
            this.currencySymbol = cur?.symbols;
          }
        });
      });
    if (this.salaryGetData?.gradeSalaryData?.length === 0) {
      this.gradePay = true;
    }
    if (
      this.salaryGetData?.gradeSalaryData?.length > 0 &&
      this.salaryGetData?.gradeSalaryData[0]?.payroll_template_id != e.value
    ) {
      this.gradePay = true;
    } else if (
      this.salaryGetData?.gradeSalaryData?.length > 0 &&
      this.salaryGetData?.gradeSalaryData[0]?.payroll_template_id === e.value
    ) {
      this.gradePay = false;
    }
  }

  salaryPatch(salaryGetData: any) {
    this.salaryForm.patchValue({
      basic_salary: salaryGetData?.basic_salary,
      salary_per_day: salaryGetData?.salary_per_day,
      salary_per_hr: salaryGetData?.salary_per_hr,
    });
    if (salaryGetData?.history_salary?.length) {
      salaryGetData?.history_salary?.forEach((item: any, index: number) => {
        const formGroup = this.historySalaryFormArray?.at(index) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            salary_Year: item.salary_Year,
            salary_month: item.salary_month,
            new_salary: item.new_salary,
            old_salary: item.old_salary,
            from_designation_id: item.from_designation_id,
            to_designation_id: item.to_designation_id,
            from_grade_id: item.from_grade_id,
            to_grade_id: item.to_grade_id,
            percent_increment: item.percent_increment,
            remarks: item.remarks,
          });
        } else {
          this.historySalaryFormArray.push(
            this.fb.group({
              salary_Year: item.salary_Year,
              salary_month: item.salary_month,
              new_salary: item.new_salary,
              old_salary: item.old_salary,
              from_designation_id: item.from_designation_id,
              to_designation_id: item.to_designation_id,
              from_grade_id: item.from_grade_id,
              to_grade_id: item.to_grade_id,
              percent_increment: item.percent_increment,
              remarks: item.remarks,
            })
          );
        }
      });
    }
  }

  getAllCreatedTaxslabList() {
    this.payrollService.getAllCreatedTaxslabList().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.slabData = res.data;
        }
      },
      (err) => {
        this.toastr.error(err.error.message);
      }
    );
  }

  onSelectionChange(event: any): void {
    const selectedValue = event.value;
    this.salaryForm.get('tax_slab')?.reset();
    if (selectedValue == 'true') {
      this.selectedValueTax = true;
    } else {
      this.selectedValueTax = false;
    }
  }

  onSelectionEfp(event: any) {
    this.salaryForm.get('salary_temp_data_check')?.reset();
    this.templateSeletc = false;
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

          if (this.currency_id) {
            this.currencySelect({ value: this.currency_id });
          }
        }
      },
      (err) => {
        this.toastr.error(err.error.message);
      }
    );
  }
  calculateVariableEarningsTotal() {
    const variableearningArray = this.salaryForm.get('variableearningComponentList') as FormArray;
    this.totalVariableEarningsAnnual = 0;

    variableearningArray.getRawValue().forEach((variableearning: any) => {
      this.totalVariableEarningsAnnual += parseFloat(variableearning.fixedAllowanceAnnual || '0');
    });

    return this.totalVariableEarningsAnnual;
  }
}
