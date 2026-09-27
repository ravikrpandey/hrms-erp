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

@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.scss'],
})
export class SalaryDetailsComponent implements OnInit {
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
  totalVariableEarningsAnnual: number = 0;
  basicComp: boolean = true;
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
    variableearningComponentList: any;
  };
  gradePay: boolean = false;
  getCurrencyData: any;
  currencySymbol: any;
  toast: any;
  enabledNote: boolean = false;
  currency_id: any = null;
  totalEsiMonth: number;
  totalEsiAnnual: number;
  labelCalculation: string;
  employeerContribution: any;
  employeerContributionEsi: any;
  employeerContributionMatched: any;
  getHistorySalaryData: any;
  dataBind: any;
  pfCap: any;
  esiThreshold: any;
  isDisabled: boolean;
  employerAdminCharges: any;
  employerEdli: any;
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
    private payrollService: PayrollService
  ) {
    this.salaryForm = this.fb.group({
      basic_salary: new FormControl(null, [Validators.required]),
      salary_per_day: new FormControl(null, [Validators.required]),
      salary_per_hr: new FormControl(null, [Validators.required]),
      salary_temp_data: new FormControl(null),
      tax_slab: new FormControl(null),
      tax_calculation: new FormControl('false'),
      salary_temp_data_check: new FormControl(null),

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
          remarks: new FormControl(null),
        }),
      ]),

      epf: new FormControl(false),
      epf_capping: new FormControl(false),
      edli: new FormControl(false),
      esi: new FormControl(false),
      professional_tax: new FormControl(false),
      labour_welfare_fund: new FormControl(false),
      gratuity_employer: new FormControl(false),
      overtime: new FormControl(false),
      select_all: new FormControl(false),
      nps: new FormControl(false),
      saf: new FormControl(false),

      annualCTC: [0, Validators.required],
      monthlyCTC: new FormControl(),
      earningComponentList: this.fb.array([]),
      deductionComponentList: this.fb.array([]),
      reiembursementComponentList: this.fb.array([]),
      variableearningComponentList: this.fb.array([]),
      UAN_number: new FormControl(null),
      pf_account_number: new FormControl(null),
      epf_type: ['NA', Validators.required],
    });
    this.salaryForm.get('annualCTC')?.valueChanges.subscribe((value: any) => {
      this.updateCalculations(value);
    });
  }

  ngOnInit(): void {
    // 1. Initialize basic data and route parameters
    this.initializeRouteParams();

    // 2. Initialize dropdown data and basic setup
    this.initializeBasicData();

    // 3. Load employee-specific data if available
    this.loadEmployeeData();

    // 4. Setup form subscriptions
    this.setupFormSubscriptions();

    // 5. Load compliance and calculation data
    this.loadComplianceData();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log(
        'Before setting tax_calculation value:',
        this.salaryForm.get('tax_calculation')?.value
      );
      this.salaryForm
        .get('tax_calculation')
        ?.setValue('false', { emitEvent: false });
      this.selectedValueTax = false;
      console.log(
        'After setting tax_calculation value:',
        this.salaryForm.get('tax_calculation')?.value
      );
    }, 1);
  }
  private initializeRouteParams(): void {
    this._activeRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.salaryId = params.employee_id;
      this.employee_id = params.employee_id;
      this.action_type = params.action_type;
    });

    this._empoloyeeService.setEmpTitle('SALARY DETAILS');
  }

  private initializeBasicData(): void {
    // Initialize months array
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

    // Set default form values
    this.salaryForm.patchValue({ tax_calculation: 'false' });

    // Load basic dropdown data
    this.localStorage();
    this.getAllDesignation_dropDown();
    this.get_all_active_grade();
    this.getAllEarningComponentList();
    this.getAllRiembursementComponentList();
    this.getAllDeductionComponentList();
    this.getAllVariableearningComponentList();
    this.getActive_Allowance();
    this.generateYears();
    this.getAllSaleryTemp();
    this.getAllCreatedTaxslabList();
  }

  private loadEmployeeData(): void {
    if (this.employee_id) {
      this.salaryGetBy(this.employee_id);
      this.getHistorySalary();
    }
  }
  private setupFormSubscriptions(): void {
    // EPF Toggle Subscription
    this.salaryForm.get('epf')?.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.checkCompliance('epf', this.complianceDetails?.epf_id, 'EPF');
      } else {
        // Auto-disable EPF Capping when EPF is OFF
        this.salaryForm
          .get('epf_capping')
          ?.setValue(false, { emitEvent: false });
        this.salaryForm.get('edli')?.setValue(false, { emitEvent: false });
      }
      this.updateDeduction();
      this.totalCountCreate();
      this.checkSelectAllStatus();
    });

    // EPF Capping Toggle Subscription
    this.salaryForm
      .get('epf_capping')
      ?.valueChanges.subscribe((val: boolean) => {
        if (val) {
          console.log('EPF Capping enabled at', this.pfCap);
        } else {
          console.log('EPF Capping disabled, using full EPF calculation');
        }
        this.updateDeduction();
        this.totalCountCreate();
        this.checkSelectAllStatus();
      });
    this.salaryForm.get('edli')?.valueChanges.subscribe((val: boolean) => {
      if (val) {
        console.log('EDLI enabled');
      } else {
        console.log('EDLI disabled');
      }
      this.updateDeduction();
      this.totalCountCreate();
      this.checkSelectAllStatus();
    });

    // ESI Toggle Subscription
    this.salaryForm.get('esi')?.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.checkCompliance('esi', this.complianceDetails?.esi_id, 'ESI');
      }
      this.updateDeduction();
      this.totalCountCreate();
      this.checkSelectAllStatus();
    });

    // Professional Tax Toggle Subscription
    this.salaryForm
      .get('professional_tax')
      ?.valueChanges.subscribe((val: boolean) => {
        if (val) {
          this.checkCompliance(
            'professional_tax',
            this.complianceDetails?.pt_id,
            'Professional Tax'
          );
        }
        this.checkSelectAllStatus();
      });

    // Labour Welfare Fund Toggle Subscription
    this.salaryForm
      .get('labour_welfare_fund')
      ?.valueChanges.subscribe((val: boolean) => {
        if (val) {
          this.checkCompliance(
            'labour_welfare_fund',
            this.complianceDetails?.lwf_id,
            'Labour Welfare Fund'
          );
        }
        this.checkSelectAllStatus();
      });

    // Gratuity Employer Toggle Subscription
    this.salaryForm
      .get('gratuity_employer')
      ?.valueChanges.subscribe((val: boolean) => {
        if (val) {
          this.checkCompliance(
            'gratuity_employer',
            this.complianceDetails?.gratuity_id,
            'Gratuity'
          );
        }
        this.checkSelectAllStatus();
      });
    this.salaryForm.get('overtime')?.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.checkCompliance(
          'overtime',
          this.complianceDetails?.overtime_id,
          'Overtime'
        );
      }
      this.checkSelectAllStatus();
    });
    this.salaryForm.get('nps')?.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.checkCompliance('nps', this.complianceDetails?.nps_id, 'NPS');
      }
      this.checkSelectAllStatus();
    });
    this.salaryForm.get('saf')?.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.checkCompliance('saf', this.complianceDetails?.saf_id, 'SAF');
      }
      this.checkSelectAllStatus();
    });

    // Select All Toggle Subscription - CORRECTED VERSION
    this.salaryForm
      .get('select_all')
      ?.valueChanges.subscribe((val: boolean) => {
        if (val) {
          // When Select All is ON - Check compliance for each toggle before enabling
          this.checkCompliance('epf', this.complianceDetails?.epf_id, 'EPF');
          this.checkCompliance('esi', this.complianceDetails?.esi_id, 'ESI');
          this.checkCompliance(
            'professional_tax',
            this.complianceDetails?.pt_id,
            'Professional Tax'
          );
          this.checkCompliance(
            'labour_welfare_fund',
            this.complianceDetails?.lwf_id,
            'Labour Welfare Fund'
          );
          this.checkCompliance(
            'gratuity_employer',
            this.complianceDetails?.gratuity_id,
            'Gratuity'
          );
          this.checkCompliance(
            'overtime',
            this.complianceDetails?.overtime_id,
            'Overtime'
          );
          this.checkCompliance('nps', this.complianceDetails?.nps_id, 'NPS');
          this.checkCompliance('saf', this.complianceDetails?.saf_id, 'SAF');

          // EPF Capping should only be enabled if EPF is enabled (compliance passed)
          if (this.salaryForm.get('epf')?.value) {
            this.salaryForm
              .get('epf_capping')
              ?.setValue(true, { emitEvent: false });
            this.salaryForm.get('edli')?.setValue(true, { emitEvent: false });
          }
        } else {
          // When Select All is OFF - Disable all compliance toggles
          this.salaryForm.patchValue(
            {
              epf: false,
              epf_capping: false,
              edli: false,
              esi: false,
              professional_tax: false,
              labour_welfare_fund: false,
              gratuity_employer: false,
              overtime: false,
              nps: false,
              saf: false,
            },
            { emitEvent: false }
          );
        }

        // Manually trigger calculations since we disabled events
        this.updateDeduction();
        this.totalCountCreate();
      });
  }

  // CORRECTED Helper method to check if all required toggles are selected
  private checkSelectAllStatus(): void {
    if (!this.complianceDetails) {
      this.salaryForm.get('select_all')?.setValue(false, { emitEvent: false });
      return;
    }

    // Check each compliance control based on what's configured
    const epfConfigured = !!this.complianceDetails?.epf_id;
    const esiConfigured = !!this.complianceDetails?.esi_id;
    const ptConfigured = !!this.complianceDetails?.pt_id;
    const lwfConfigured = !!this.complianceDetails?.lwf_id;
    const gratuityConfigured = !!this.complianceDetails?.gratuity_id;
    const overtimeConfigured = !!this.complianceDetails?.overtime_id;
    const npsConfigured = !!this.complianceDetails?.nps_id;
    const safConfigured = !!this.complianceDetails?.saf_id;

    // Get current form values
    const epf = this.salaryForm.get('epf')?.value;
    const epfCapping = this.salaryForm.get('epf_capping')?.value;
    const edli = this.salaryForm.get('edli')?.value;
    const esi = this.salaryForm.get('esi')?.value;
    const professionalTax = this.salaryForm.get('professional_tax')?.value;
    const labourWelfareFund = this.salaryForm.get('labour_welfare_fund')?.value;
    const gratuityEmployer = this.salaryForm.get('gratuity_employer')?.value;
    const overTime = this.salaryForm.get('overtime')?.value;
    const nps = this.salaryForm.get('nps')?.value;
    const saf = this.salaryForm.get('saf')?.value;

    // Check if all configured compliances are enabled
    let allConfiguredSelected = true;

    if (epfConfigured && !epf) allConfiguredSelected = false;
    if (epfConfigured && epf && !epfCapping) allConfiguredSelected = false; // EPF Capping should be on if EPF is on
    if (epfConfigured && epf && !edli) allConfiguredSelected = false; // EPF Capping should be on if EPF is on
    if (esiConfigured && !esi) allConfiguredSelected = false;
    if (ptConfigured && !professionalTax) allConfiguredSelected = false;
    if (lwfConfigured && !labourWelfareFund) allConfiguredSelected = false;
    if (gratuityConfigured && !gratuityEmployer) allConfiguredSelected = false;
    if (overtimeConfigured && !overTime) allConfiguredSelected = false;
    if (npsConfigured && !nps) allConfiguredSelected = false;
    if (safConfigured && !saf) allConfiguredSelected = false;

    // Update select_all based on whether all configured compliances are selected
    this.salaryForm
      .get('select_all')
      ?.setValue(allConfiguredSelected, { emitEvent: false });
  }
  private loadComplianceData(): void {
    this.getComplianceDetails();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.finacialId = localStorage.getItem('financial_id');
    this.salaryForm.patchValue({ tax_calculation: 'false' });
    this.selectedValueTax = false;
  }

  getHistorySalary() {
    let data = {
      employee_id: this.id?.employee_id,
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

  get historySalaryFormArray() {
    return this.salaryForm.get('history_salary') as FormArray;
  }
  get SL(): any {
    return this.salaryForm.controls;
  }

  selectEpf(e: any) {
    const salaryTempControl = this.salaryForm.get('salary_temp_data');
    if (e) {
      this.enabledNote = true;
    } else {
    }
    this.salaryForm.get('salary_temp_data')?.reset();
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

  onSubmitForm() {
    const val = this.salaryForm.getRawValue();
    val.earningComponentList?.forEach((item: any, index: number) => {});
    const totalDeductSalary = val?.deductionComponentList?.reduce(
      (total: number, item: any) =>
        total +
        parseFloat(item?.fixedAllowanceMonthly || item?.monthlyBasic || '0'),
      0
    );
    const totalDeduct = totalDeductSalary.toFixed(2);
    if (this.salaryForm.invalid) {
      this.salaryForm.markAllAsTouched();
      this.toastr.error('Required fields should not be empty');
      return;
    }
    // Calculate Variable Earnings totals for submission
    const totalVariableEarningsAnnual =
      val?.variableearningComponentList?.reduce(
        (total: number, item: any) =>
          total + parseFloat(item?.fixedAllowanceAnnual || '0'),
        0
      ) || 0;
    const financial_id = localStorage.getItem('financial_id');
    const empMainId = localStorage.getItem('EmpMainId');
    const gradeSalaryData = this.salaryGetData?.gradeSalaryData[0];
    const req: any = {
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
      template_name: this.gradIdDetail?.template_name || this.templateName,
      payroll_template_id: val.salary_temp_data_check,
      tax_calculation: val?.tax_calculation || 'false',
      tax_slab_id: val?.tax_slab,
      grade_pay: this.gradePay,
      currency_id: this.currency_id || gradeSalaryData?.currency_id,
      grade_template_id: gradeSalaryData?.id || null,
      employer_contri_epf_amt: this.employeerContributionMatched,
      employer_contri_esi_amt: this.employeerContributionEsi,
    };
    if (this.employee_id) {
      req.employee_id = this.employee_id;
    }
    req.earningComponentList?.forEach((item: any) => {
      item.componenet_type =
        item?.calculation_type == 'Flat Amount' ? 'flat' : 'percentage';
    });

    req.deductionComponentList?.forEach((item: any) => {
      console.log(item.calculation_type, '+362+65129+');
      item.componenet_type =
        item?.calculation_type == 'Flat Amount' ? 'flat' : 'percentage';
      // set name_in_payslip automatically
      if (item.componentName === 'EPF') {
        item.name_in_payslip = 'EPF';
      } else if (item.componentName === 'ESI') {
        item.name_in_payslip = 'ESI';
      }
    });

    req.reiembursementComponentList?.forEach((item: any) => {
      item.componenet_type =
        item?.calculation_type == 'Flat Amount' ? 'flat' : 'percentage';
    });
    // Add componenet_type for Variable Earnings
    req.variableearningComponentList?.forEach((item: any) => {
      item?.componenet_type == 'Flat Amount' ? 'flat' : 'percentage'; // Variable earnings are typically flat amounts
    });
    this._empoloyeeService.basicSignUp(req).subscribe(
      (res: any) => {
        if (res) {
          this.salaryData = res;
          this.route.navigate(
            [
              'master/hrms/employee-master/employ',
            ],
            // { queryParams: { employee_id: this.salaryId } }
          );
          this.toastr.success('Salary Details Submitted successfully.');
        }
      },
      (err) => {
        this.toastr.error(
          'Something went wrong, please try again',
          'Error Message'
        );
      }
    );
  }

  Skip() {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/payment-details'],
      { queryParams: { employee_id: this.salaryId } }
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
        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please add Allowance Details first');
        // Display an error message for the user
      }
    } else {
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

    // Update the annual amount based on the monthly amount
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

  monthlyAssign: any = [];
  updateFixedEarningAmount(index: number) {
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    const earningGroup = earningArray.at(index) as FormGroup;

    // Get the current monthly and annual values
    let monthlyAmount = earningGroup.get('fixedAllowanceMonthly')?.value || 0;
    let annualAmount = monthlyAmount * 12;

    // Update the monthly and annual values for the specific index
    earningGroup.get('fixedAllowanceAnnual')?.setValue(annualAmount);
    earningGroup.get('fixedAllowanceMonthly')?.setValue(monthlyAmount);

    this.updateFixedAllowancee();
  }

  updateFixedAllowancee() {
    const annualCTC = this.salaryForm.get('annualCTC')?.value;

    // Step 1: Calculate total reimbursement amount
    const reimbursementArray = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    let totalReimbursementAmount = 0;
    reimbursementArray.controls.forEach((reimbursement) => {
      const reimbursementAnnual =
        reimbursement.get('fixedAllowanceAnnual')?.value || 0;
      totalReimbursementAmount += parseFloat(reimbursementAnnual);
    });

    // Step 1: Calculate total reimbursement amount
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
      totalVariableearningAmount +
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

    // if (monthlyAmount > fixedAmountLimit) {
    //   monthlyAmount = fixedAmountLimit;
    //   deductionGroup.get('fixedAllowanceMonthly')?.setValue(fixedAmountLimit);
    //   this.toastr.warning('Amount Limit is fixed.');
    // }

    const annualAmount = monthlyAmount * 12;
    deductionGroup
      .get('fixedAllowanceAnnual')
      ?.setValue(annualAmount.toFixed(2));
    this.calculateTotalCTC();
    this.updateFixedAllowancee();
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
          { value: data?.calculation_percentage, disabled: false },
          Validators.required,
        ],
        monthlyBasic: [{ value: 0, disabled: true }],
        earningTypeCode: [data?.earning_type_code],
        annualBasic: [{ value: 0, disabled: true }],
        calculationTypeCode: [data?.calculation_type_code],
        consider_for_epf: [data?.consider_for_epf || false],
        consider_for_esi: [data?.consider_for_esi || false],
        consider_for_nps: [data?.consider_for_nps || false],
        consider_for_saf: [data?.consider_for_saf || false],
        name_in_payslip: [data?.name_in_payslip],
      });
    } else if (type === 'fixed') {
      const formGroup = this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        earningTypeCode: [data?.earning_type_code],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }],
        consider_for_epf: [data?.consider_for_epf || false],
        consider_for_esi: [data?.consider_for_esi || false],
        consider_for_nps: [data?.consider_for_nps || false],
        consider_for_saf: [data?.consider_for_saf || false],
        name_in_payslip: [data?.name_in_payslip],
      });

      // If there is any `data` passed, patch values for fixedAllowanceMonthly
      if (data) {
        // Enable the fields to allow patching values
        formGroup.get('fixedAllowanceMonthly')?.enable();
        formGroup.get('fixedAllowanceAnnual')?.enable();

        // Patch the value for fixedAllowanceMonthly
        formGroup.patchValue({
          fixedAllowanceMonthly: data.calculation_amount || 0, // Patch the fixedAllowanceMonthly
          fixedAllowanceAnnual: data.calculation_amount
            ? data.calculation_amount * 12
            : 0, // Assuming annual is monthly * 12
        });

        // Optionally, disable fixedAllowanceAnnual after patching (if needed)
        formGroup.get('fixedAllowanceAnnual')?.disable();
      }

      return formGroup;
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

      let basicPercent =
        data?.employer_contribution ?? data?.calculation_percentage ?? 0;

      let calculationLabel = '';
      if (name === 'EPF' || name === 'ESI') {
        calculationLabel = 'fixed basic + fixed hra';
      } else if (data?.calculation_type_label) {
        calculationLabel = data.calculation_type_label;
      } else {
        calculationLabel = 'Gross';
      }

      const isEditable = name === 'EPF' || name === 'ESI' ? false : true;

      return this.fb.group({
        componentName: [name, Validators.required],
        calculationType: [calculationType],
        basicPercentage: [
          { value: basicPercent || 0, disabled: !isEditable },
          Validators.required,
        ],
        monthlyBasic: [{ value: 0, disabled: true }],
        annualBasic: [{ value: 0, disabled: true }],
        calculationTypeCode: [calculation_type_code],
        calculationLabel: [calculationLabel], // ✅ this is used in HTML
        epf_deduction: new FormControl(null),
        name_in_payslip: [data?.name_in_payslip],
      });
    } else if (type === 'fixed') {
      const formGroup = this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }],
        fixedAmountLimit: [data?.calculation_amount || 0],
        epf_deduction: new FormControl(null),
        calculation_type: new FormControl('Flat Amount'),
        name_in_payslip: [data?.name_in_payslip],
      });
      if (data) {
        // Enable the fields to allow patching values
        formGroup.get('fixedAllowanceMonthly')?.enable();
        formGroup.get('fixedAllowanceAnnual')?.enable();

        // Patch the value for fixedAllowanceMonthly
        formGroup.patchValue({
          fixedAllowanceMonthly: data.calculation_amount || 0, // Patch the fixedAllowanceMonthly
          fixedAllowanceAnnual: data.calculation_amount
            ? data.calculation_amount * 12
            : 0, // Assuming annual is monthly * 12
        });

        // Optionally, disable fixedAllowanceAnnual after patching (if needed)
        formGroup.get('fixedAllowanceAnnual')?.disable();
      }
      return formGroup;
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
    console.log('Hiiiiiiiiiiiii', this.earningComponentList);
    console.log('222222222222222', this.earningCompListReference);
    console.log('indexxxxxxxxxxxxxx', index);
    const earningTypeCode = this.earningComponentList
      .at(index)
      .get('componentName')?.value;
    console.log('33333333333333333333333', earningTypeCode);

    if (earningTypeCode !== 'BASIC1') {
      this.earningComponentList.removeAt(index);
      const restoredComponent = this.earningCompListReference.find(
        (item: any) => item.earning_name === earningTypeCode
      );
      if (restoredComponent) {
        this.earningCompList.push(restoredComponent);
      }
      this.updateFixedAllowancee();
      this.calculateTotalCTC();
    } else {
    }
    this.updateEpfEsiLabels();
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
    this.updateEpfEsiLabels();
    this.updateDeduction();
    // this.totalCountCreate();
  }

  createReiembursementComponent(name: string, data?: any): FormGroup {
    return this.fb.group({
      componentName: [name, Validators.required],
      fixedAllowanceMonthly: [0, Validators.required],
      fixedAllowanceAnnual: [{ value: 0, disabled: true }],
      fixedAmountLimit: [data?.max_limit || 0],
      is_taxable: data?.is_taxable,
      is_overtime: data?.is_overtime,
      id: data?.id,
      reimbursement_type: data?.reimbursement_type,
      name_in_payslip: data?.reimbursement_type,
    });
  }

  createVariableearningComponent(name: string, data?: any): FormGroup {
    console.log(data, 'KKKKKKKKKKKKKKKKKKKKKKKKKKKKK');
    return this.fb.group({
      componentName: [name, Validators.required],
      fixedAllowanceMonthly: [''],
      fixedAllowanceAnnual: [data.calculation_amount],
      fixedAmountLimit: [data?.max_limit || 0],
      id: data?.id,
      variableearning_type: data?.variableearning_type,
      is_taxable: data?.is_taxable,
      name_in_payslip: data?.name_in_payslip,
      deduct_monthly: data?.deduct_monthly,
      deduct_when_credited: data?.deduct_when_credited,
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
          this.variableearningCompListReference = [
            ...this.variableearningCompList,
          ];
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  addDeductionComp(data: any) {
    let selecteddata = data;
    let type: any =
      data.calculation_type === 'Flat Amount' ? 'fixed' : 'value-based';
    console.log(data.calculation_type, 'GGGGGGGGGGGGGGGGGGGGGG');
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
        selecteddata.reimbursement_name,
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
      (item: any) => item.reimbursement_name === componentName
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
    });
    this.updateFixedAllowancee();
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

  updateEarningsPercent() {
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

  // start
  gradIdDetail: any;
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
    });
  }

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
    this.getAllEarningComponentList();
    this.getAllDeductionComponentList();
    this.getAllRiembursementComponentList();
    this.getAllVariableearningComponentList();
    let value = this.salaryForm.value;
    this.saleryTempData.forEach((res: any) => {
      if (res?.id === e?.value) {
        this.templateName = res?.template_name;
      }
    });

    this.deductionComponentList.clear();
    this.earningComponentList.clear();
    this.reiembursementComponentList.clear();
    this.variableearningComponentList.clear();

    this._empoloyeeService
      .getBySaleryTemplate(e.value)
      .subscribe((res: any) => {
        this.getByTempData = res.data;
        this.pfCap = res.data.pfCap;
        this.esiThreshold = res.data.esiThreshold;
        this.templateSeletc = true;
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
          variableearningComponentList:
            this.getByTempData?.variableearningComponentList,
        };

        this.setEarningComponentList(this.selectTempdata);
        this.getCurrencyData?.forEach((cur: any) => {
          if (this.getByTempData?.currency_id === cur?.Currency_Convert_id) {
            this.currencySymbol = cur?.symbols;
            this.currency_id = this.getByTempData?.currency_id;
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
    setTimeout(() => {
      // Recalculate employer contributions
      this.calculateEmployerContributions();
      // Recalculate total CTC
      this.calculateTotalCTC();
    }, 0);
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

  // onSelectionChange(event: any): void {
  //   const selectedValue = event.value;
  //   this.salaryForm.get('tax_slab')?.reset();

  //   if (selectedValue === 'true') {
  //     this.selectedValueTax = true;
  //   } else {
  //     this.selectedValueTax = false;
  //   }
  // }
  onSelectionChange(event: any): void {
    const selectedValue = event.value;

    this.salaryForm.get('tax_slab')?.reset();

    if (selectedValue === 'true') {
      this.selectedValueTax = true;
      // 👇 Make tax_slab required
      this.salaryForm.get('tax_slab')?.setValidators([Validators.required]);
    } else {
      this.selectedValueTax = false;
      // 👇 Remove validators if tax calc is No
      this.salaryForm.get('tax_slab')?.clearValidators();
    }

    // 👇 Important: update validity after changing validators
    this.salaryForm.get('tax_slab')?.updateValueAndValidity();
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
        this.toast.error(err.error.message);
      }
    );
  }
  complianceDetails: any;
  getComplianceDetails() {
    this.payrollService
      .getComplianceDetails(this.employee_id)
      .subscribe((res: any) => {
        if (res && res.data) {
          this.complianceDetails = res.data;
          console.log(
            this.complianceDetails,
            'this.complianceDetailsthis.complianceDetailsthis.complianceDetails'
          );
          // this.loadComplianceDetails();
        }
      });
  }
  loadComplianceDetails() {
    this.checkCompliance('epf', this.complianceDetails.epf_id, 'EPF');
    this.checkCompliance('esi', this.complianceDetails.esi_id, 'ESI');
    this.checkCompliance(
      'professional_tax',
      this.complianceDetails.pt_id,
      'Professional Tax'
    );
    this.checkCompliance(
      'labour_welfare_fund',
      this.complianceDetails.lwf_id,
      'Labour Welfare Fund'
    );
    this.checkCompliance(
      'gratuity_employer',
      this.complianceDetails.gratuity_id,
      'Gratuity'
    );
    this.checkCompliance(
      'overtime',
      this.complianceDetails.overtime_id,
      'Overtime'
    );
    this.checkCompliance('nps', this.complianceDetails.overtime_id, 'NPS');
    this.checkCompliance('saf', this.complianceDetails.overtime_id, 'SAF');
  }

  // 2. COMPLETELY REWRITTEN updateDeduction method
  updateDeduction() {
    const annualCTC = this.salaryForm.get('annualCTC')?.value;
    if (!annualCTC) return;

    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    const earningValues = earningArray.value;

    const grossMonthlySalary = annualCTC / 12;

    // Reset totals
    this.totalEPF = 0;
    this.totalEpFAnnual = 0;
    this.totalEsiMonth = 0;
    this.totalEsiAnnual = 0;

    let epfComponents: string[] = [];
    let esiComponents: string[] = [];

    // Calculate EPF and ESI eligible amounts from earnings
    earningArray.controls.forEach((control: any) => {
      const monthly = Number(
        control.get('monthlyBasic')?.value ||
          control.get('fixedAllowanceMonthly')?.value ||
          0
      );
      const annual = Number(
        control.get('annualBasic')?.value ||
          control.get('fixedAllowanceAnnual')?.value ||
          0
      );

      if (control.get('consider_for_epf')?.value) {
        this.totalEPF += monthly;
        this.totalEpFAnnual += annual;
        epfComponents.push(control.get('componentName')?.value);
      }

      if (control.get('consider_for_esi')?.value) {
        this.totalEsiMonth += monthly;
        this.totalEsiAnnual += annual;
        esiComponents.push(control.get('componentName')?.value);
      }
    });

    // Update each deduction component
    deductionArray.controls.forEach((deduction: any) => {
      const componentName = deduction
        .get('componentName')
        ?.value?.toUpperCase();
      const calculationTypeCode = deduction.get('calculationTypeCode')?.value;
      const percentage = Number(deduction.get('basicPercentage')?.value || 0);
      const employeeContribution = Number(
        deduction.get('employee_contribution')?.value || percentage
      );
      const employerContribution = Number(
        deduction.get('employer_contribution')?.value || percentage
      );

      let monthlyAmount = 0;
      let annualAmount = 0;

      // --- EPF CALCULATION ---
      if (componentName === 'EPF') {
        if (
          this.salaryForm.get('epf')?.value &&
          this.complianceDetails?.epf_id
        ) {
          monthlyAmount = (this.totalEPF * employeeContribution) / 100;

          if (this.salaryForm.get('epf_capping')?.value && this.pfCap) {
            monthlyAmount = Math.min(monthlyAmount, this.pfCap);
          }

          annualAmount = monthlyAmount * 12;

          let epfEmployerMonthly = (this.totalEPF * employerContribution) / 100;
          if (this.salaryForm.get('epf_capping')?.value && this.pfCap) {
            epfEmployerMonthly = Math.min(epfEmployerMonthly, this.pfCap);
          }

          this.employeerContributionMatched = epfEmployerMonthly;
          this.labelCalculation = `(${epfComponents.join(' + ')})`;
        } else {
          monthlyAmount = 0;
          annualAmount = 0;
          this.employeerContributionMatched = 0;
        }

        // --- ESI CALCULATION ---
      } else if (componentName === 'ESI') {
        if (
          this.salaryForm.get('esi')?.value &&
          this.complianceDetails?.esi_id
        ) {
          if (grossMonthlySalary <= this.esiThreshold) {
            monthlyAmount = (this.totalEsiMonth * employeeContribution) / 100;
            annualAmount = monthlyAmount * 12;

            this.employeerContributionEsi =
              (this.totalEsiMonth * employerContribution) / 100;
            this.labelCalculation = `(${esiComponents.join(' + ')})`;
          } else {
            monthlyAmount = 0;
            annualAmount = 0;
            this.employeerContributionEsi = 0;
          }
        } else {
          monthlyAmount = 0;
          annualAmount = 0;
          this.employeerContributionEsi = 0;
        }

        // --- OTHER DEDUCTIONS ---
      } else {
        switch (calculationTypeCode) {
          case 'CTC':
            annualAmount = (annualCTC * percentage) / 100;
            break;
          case 'BASIC1':
            const basicSalary = this.getAnnualBasic(); // implement this properly
            annualAmount = (basicSalary * percentage) / 100;
            break;
          default:
            annualAmount = (annualCTC * percentage) / 100;
            break;
        }

        monthlyAmount = annualAmount / 12;
      }

      // Set calculated values
      deduction
        .get('monthlyBasic')
        ?.setValue(+monthlyAmount.toFixed(2), { emitEvent: false });
      deduction
        .get('annualBasic')
        ?.setValue(+annualAmount.toFixed(2), { emitEvent: false });
    });

    // Final updates
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  // 3. FIXED setEarningComponentList method - streamlined deduction handling
  setEarningComponentList(data: any) {
    console.log('iiiiiiii111111111111');
    let temp = this.earningCompList;
    let temp2 = this.deductionCompList;
    let temp3 = this.riembursementCompList;
    let temp4 = this.variableearningCompList;

    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;
    let employerExcludedMonthly = 0;
    let employerExcludedAnnual = 0;

    if (this.templateSeletc === true) {
      this.enterSalary('fromAnnualCtc');
    }

    let totalDeductionMonthlyCTC = 0;
    let totalDeductionAnnualCTC = 0;

    // Handle earnings components
    if (data?.earningComponentList?.length) {
      data?.earningComponentList?.forEach((item: any, index: number) => {
        // Calculate totals
        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly)
            totalMonthlyCTC += Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual)
            totalAnnualCTC += Number(item?.fixedAllowanceAnnual);
        } else {
          if (item?.monthlyBasic) totalMonthlyCTC += Number(item?.monthlyBasic);
          if (item?.annualBasic) totalAnnualCTC += Number(item?.annualBasic);
        }

        // Remove from available list
        this.earningCompList.forEach((value: any, i: any) => {
          if (value.earning_name == item?.componentName) {
            temp.splice(i, 1);
          }
        });

        // Update or create form group
        const formGroup = this.earningComponentList?.at(index) as FormGroup;
        if (formGroup) {
          this.updateEarningFormGroup(formGroup, item);
        } else {
          this.earningComponentList.push(this.createEarningFormGroup(item));
        }
      });
    }

    // Recalculate EPF/ESI eligible amounts after earnings are set
    this.recalculateEpfEsiTotals();

    // Handle deduction components - SIMPLIFIED LOGIC
    if (data?.deductionComponentList?.length || data?.deductionArray?.length) {
      let deductData = data?.deductionComponentList || data?.deductionArray;

      deductData?.forEach((item: any, index: number) => {
        // Remove from available list
        this.deductionCompList?.forEach((value: any, i: any) => {
          if (
            value.deduction_plan == item?.componentName ||
            value.deduction_plan == item?.deduction_plan
          ) {
            temp2.splice(i, 1);
          }
        });
        // Add dynamic label for EPF/ESI
        const isEPF = item.componentName?.toLowerCase() === 'epf';
        const isESI = item.componentName?.toLowerCase() === 'esi';

        if (isEPF) {
          item.calculationLabel = this.getEpfEsiCalculationLabel('epf');
        } else if (isESI) {
          item.calculationLabel = this.getEpfEsiCalculationLabel('esi');
        } else {
          item.calculationLabel = item.calculationType;
        }

        // For EPF and ESI, let updateDeduction() handle the calculation
        // Just set up the form group structure
        const formGroup = this.deductionComponentList?.at(index) as FormGroup;
        if (formGroup) {
          this.updateDeductionFormGroup(formGroup, item);
        } else {
          this.deductionComponentList.push(this.createDeductionFormGroup(item));
        }
      });

      // Trigger deduction calculations after form groups are set up
      this.updateDeduction();
    }

    // Handle reimbursement components
    if (data?.reiembursementComponentList?.length) {
      data?.reiembursementComponentList?.forEach((item: any, index: number) => {
        this.riembursementCompList.forEach((value: any, i: any) => {
          if (value.reimbursement_name == item?.componentName) {
            temp3.splice(i, 1);
          }
        });

        if (item?.fixedAllowanceMonthly)
          totalMonthlyCTC += Number(item?.fixedAllowanceMonthly);
        if (item?.fixedAllowanceAnnual)
          totalAnnualCTC += Number(item?.fixedAllowanceAnnual);

        const formGroup = this.reiembursementComponentList?.at(
          index
        ) as FormGroup;
        if (formGroup) {
          this.updateReimbursementFormGroup(formGroup, item);
        } else {
          this.reiembursementComponentList.push(
            this.createReimbursementFormGroup(item)
          );
        }
      });
    }
    // For Variableearning  start //
    if (data?.variableearningComponentList?.length) {
      data?.variableearningComponentList?.forEach(
        (item: any, index: number) => {
          this.variableearningCompList?.forEach((value: any, i: any) => {
            if (value?.variable_earning_name == item?.componentName) {
              temp4.splice(i, 1);
            }
          });

          if (item?.fixedAllowanceMonthly)
            totalMonthlyCTC =
              totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual)
            totalAnnualCTC =
              totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
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
              deduct_monthly: data?.deduct_monthly,
              deduct_when_credited: data?.deduct_when_credited,
              name_in_payslip: item?.name_in_payslip,
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
                deduct_monthly: data?.deduct_monthly,
                deduct_when_credited: data?.deduct_when_credited,
                name_in_payslip: item?.name_in_payslip,
              })
            );
          }
        }
      );
    }
    // For Variableearning end //
    // // Update available component lists
    // this.earningCompList = temp;
    // this.deductionCompList = temp2;
    // this.riembursementCompList = temp3;

    // Final calculation
    this.calculateTotalCTC();
  }

  // 4. Helper method to recalculate EPF/ESI totals from current earnings
  recalculateEpfEsiTotals() {
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    const earningValues = earningArray.value;

    this.totalEPF = 0;
    this.totalEpFAnnual = 0;
    this.totalEsiMonth = 0;
    this.totalEsiAnnual = 0;

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
  }

  // 5. Helper methods to update form groups
  updateEarningFormGroup(formGroup: FormGroup, item: any) {
    if (item?.calculation_type == 'Flat Amount') {
      formGroup.patchValue({
        earningTypeCode: item?.earningTypeCode,
        componentName: item?.componentName,
        calculationType: item?.calculationType,
        calculationTypeCode: item?.calculationTypeCode,
        fixedAllowanceMonthly:
          item?.monthlyBasic || item?.fixedAllowanceMonthly,
        fixedAllowanceAnnual: item?.annualBasic || item?.fixedAllowanceAnnual,
        calculation_type: item?.calculation_type,
        id: item?.id,
        consider_for_epf: item?.consider_for_epf,
        consider_for_esi: item?.consider_for_esi,
        consider_for_nps: item?.consider_for_nps,
        consider_for_saf: item?.consider_for_saf,
        is_taxable: item?.is_taxable,
        is_overtime: item?.is_overtime,
        name_in_payslip: item?.name_in_payslip,
        // ... other properties
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
        consider_for_epf: item?.consider_for_epf,
        consider_for_esi: item?.consider_for_esi,
        consider_for_nps: item?.consider_for_nps,
        consider_for_saf: item?.consider_for_saf,
        is_taxable: item?.is_taxable,
        is_overtime: item?.is_overtime,
        name_in_payslip: item?.name_in_payslip,
        // ... other properties
      });
    }
  }

  createEarningFormGroup(item: any): FormGroup {
    if (item?.calculation_type == 'Flat Amount') {
      return this.fb.group({
        earningTypeCode: item?.earningTypeCode,
        componentName: item?.componentName,
        calculationType: item?.calculationType,
        calculationTypeCode: item?.calculationTypeCode,
        fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
        fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
        calculation_type: item?.calculation_type,
        id: item?.id,
        consider_for_epf: item?.consider_for_epf,
        consider_for_esi: item?.consider_for_esi,
        consider_for_nps: item?.consider_for_nps,
        consider_for_saf: item?.consider_for_saf,
        is_taxable: item?.is_taxable,
        is_overtime: item?.is_overtime,
        name_in_payslip: item?.name_in_payslip,
        // ... other properties
      });
    } else {
      return this.fb.group({
        earningTypeCode: item?.earningTypeCode,
        componentName: item?.componentName,
        basicPercentage: item?.basicPercentage,
        annualBasic: item?.annualBasic,
        monthlyBasic: item?.monthlyBasic,
        calculationType: item?.calculationType,
        calculationTypeCode: item?.calculationTypeCode,
        calculation_type: item?.calculation_type,
        id: item?.id,
        consider_for_epf: item?.consider_for_epf,
        consider_for_esi: item?.consider_for_esi,
        consider_for_nps: item?.consider_for_nps,
        consider_for_saf: item?.consider_for_saf,
        is_taxable: item?.is_taxable,
        is_overtime: item?.is_overtime,
        name_in_payslip: item?.name_in_payslip,
        // ... other properties
      });
    }
  }
  private getEpfEsiCalculationLabel(type: 'epf' | 'esi'): string {
    const includedComponents = this.earningComponentList.controls
      .filter((control: any) => {
        if (type === 'epf') {
          return control.get('consider_for_epf')?.value;
        } else {
          return control.get('consider_for_esi')?.value;
        }
      })
      .map((control) => control.get('componentName')?.value)
      .filter(Boolean);

    return includedComponents.join(' + ');
  }

  private updateEpfEsiLabels(): void {
    this.deductionComponentList.controls.forEach((control: any) => {
      const componentName = control.get('componentName')?.value?.toLowerCase();
      if (componentName === 'epf') {
        control
          .get('calculationLabel')
          ?.setValue(this.getEpfEsiCalculationLabel('epf'));
      } else if (componentName === 'esi') {
        control
          .get('calculationLabel')
          ?.setValue(this.getEpfEsiCalculationLabel('esi'));
      }
    });

    // Optionally re-run deduction calculations if needed
    this.updateDeduction();
  }

  updateDeductionFormGroup(formGroup: FormGroup, item: any) {
    formGroup.patchValue({
      earningTypeCode: item?.earningTypeCode,
      componentName: item?.componentName || item?.deduction_plan,
      basicPercentage: item?.basicPercentage || item?.employee_contribution,
      // Don't set calculated values here - let updateDeduction() handle them
      calculationType: item?.calculationType,
      calculationTypeCode: item?.calculationTypeCode,
      calculation_type: item?.calculation_type,
      id: item?.id,
      employee_contribution: item?.employee_contribution,
      employer_contribution: item?.employer_contribution,
      deduction_plan: item?.deduction_plan,
      is_employer_contribution_in_ctc: item?.is_employer_contribution_in_ctc,
      is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
      is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
      edli_rate: item?.edli_rate,
      admin_charges_rate: item?.admin_charges_rate,
      admin_charges_cap: item?.admin_charges_cap,
      employer_contribution_in_ctc: item?.employer_contribution_in_ctc,
      is_taxable: item?.is_taxable,
      name_in_payslip: item?.name_in_payslip,
      // ... other properties
    });
  }

  createDeductionFormGroup(item: any): FormGroup {
    if (item?.calculation_type == 'Flat Amount') {
      return this.fb.group({
        earningTypeCode: item?.earningTypeCode,
        componentName: item?.componentName || item?.deduction_plan,
        fixedAllowanceMonthly: item?.fixedAllowanceMonthly || 0,
        fixedAllowanceAnnual: item?.fixedAllowanceAnnual || 0,
        calculationType: item?.calculationType,
        calculationTypeCode: item?.calculationTypeCode,
        calculation_type: item?.calculation_type,
        id: item?.id,
        employee_contribution: item?.employee_contribution,
        employer_contribution: item?.employer_contribution,
        deduction_plan: item?.deduction_plan,
        fixedAmountLimit: item?.calculation_amount || 0,
        is_taxable: item?.is_taxable,
        calculationLabel: item?.calculationLabel || item?.calculationType,
        name_in_payslip: item?.name_in_payslip,
        // ... other properties
      });
    } else {
      return this.fb.group({
        earningTypeCode: item?.earningTypeCode,
        componentName: item?.componentName || item?.deduction_plan,
        basicPercentage: item?.basicPercentage || item?.employee_contribution,
        monthlyBasic: [{ value: 0, disabled: true }],
        annualBasic: [{ value: 0, disabled: true }],
        calculationType: item?.calculationType,
        calculationTypeCode: item?.calculationTypeCode,
        calculation_type: item?.calculation_type,
        id: item?.id,
        employee_contribution: item?.employee_contribution,
        employer_contribution: item?.employer_contribution,
        deduction_plan: item?.deduction_plan,
        is_employer_contribution_in_ctc: item?.is_employer_contribution_in_ctc,
        is_edli_contribution_in_ctc: item?.is_edli_contribution_in_ctc,
        is_admin_charges_in_ctc: item?.is_admin_charges_in_ctc,
        edli_rate: item?.edli_rate,
        admin_charges_rate: item?.admin_charges_rate,
        admin_charges_cap: item?.admin_charges_cap,
        employer_contribution_in_ctc: item?.employer_contribution_in_ctc,
        is_taxable: item?.is_taxable,
        calculationLabel: item?.calculationLabel || item?.calculationType,
        name_in_payslip: item?.name_in_payslip,
        // ... other properties
      });
    }
  }

  updateReimbursementFormGroup(formGroup: FormGroup, item: any) {
    formGroup.patchValue({
      componentName: item?.componentName,
      fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
      fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
      fixedAmountLimit: item?.fixedAmountLimit,
      id: item?.id,
      reimbursement_type: item?.reimbursement_type,
      is_taxable: item?.is_taxable,
      name_in_payslip: item?.reimbursement_type,
    });
  }

  createReimbursementFormGroup(item: any): FormGroup {
    return this.fb.group({
      componentName: item?.componentName,
      fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
      fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
      fixedAmountLimit: item?.fixedAmountLimit,
      id: item?.id,
      reimbursement_type: item?.reimbursement_type,
      is_taxable: item?.is_taxable,
      name_in_payslip: item?.reimbursement_type,
    });
  }

  // 6. Fix the totalCountCreate method
  totalCountCreate() {
    // First update earnings calculations
    this.updateEarnings();

    // Then update deductions (which depend on earnings)
    this.updateDeduction();

    // Finally update fixed allowance and total CTC
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  // 7. Enhanced calculateTotalCTC method
  calculateTotalCTC() {
    debugger;
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
    let employerExcludedMonthly = 0;
    let employerExcludedAnnual = 0;

    // Add all earnings
    earningArray.getRawValue().forEach((earning: any) => {
      const monthly = parseFloat(
        earning.monthlyBasic || earning.fixedAllowanceMonthly || '0'
      );
      const annual = parseFloat(
        earning.annualBasic || earning.fixedAllowanceAnnual || '0'
      );

      totalMonthlyCTC += monthly;
      totalAnnualCTC += annual;
    });

    // Subtract deductions and handle employer contributions
    deductionArray.getRawValue().forEach((deduction: any) => {
      const monthly = parseFloat(
        deduction.monthlyBasic || deduction.fixedAllowanceMonthly || '0'
      );
      const annual = parseFloat(
        deduction.annualBasic || deduction.fixedAllowanceAnnual || '0'
      );

      totalMonthlyCTC -= monthly;
      totalAnnualCTC -= annual;

      // Handle employer contributions that should be excluded from CTC
      if (
        deduction.is_employer_contribution_in_ctc === 1 ||
        deduction.employer_contribution_in_ctc === 1
      ) {
        if (deduction.componentName === 'EPF') {
          employerExcludedMonthly += this.employeerContributionMatched || 0;
          employerExcludedAnnual +=
            (this.employeerContributionMatched || 0) * 12;
          ////////////////////
          //   if (deduction.is_admin_charges_in_ctc === 1) {
          //     console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",earningArray)
          //     const rate = parseFloat(deduction.admin_charges_rate || '0');
          //     const cap = parseFloat(deduction.admin_charges_cap || '0');
          //     let adminCharge =
          //       (this.employeerContributionMatched || 0) * (rate / 100);
          //     adminCharge = parseFloat(adminCharge.toFixed(2));

          //     if (cap && adminCharge > cap) adminCharge = cap;
          //     this.employerAdminCharges = adminCharge;
          //     employerExcludedMonthly += adminCharge;
          //     employerExcludedAnnual += adminCharge * 12;
          //   }

          //   if (deduction.is_edli_contribution_in_ctc === 1) {
          //     const edliRate = parseFloat(deduction.edli_rate || '0');
          //     let edliAmount =
          //       (this.employeerContributionMatched || 0) * (edliRate / 100);
          //     edliAmount = parseFloat(edliAmount.toFixed(2));
          //     this.employerEdli = edliAmount;
          //     employerExcludedMonthly += edliAmount;
          //     employerExcludedAnnual += edliAmount * 12;
          //   }
          //   console.log("111111111111111111111111111111111111111111111",this.employerAdminCharges)
          //   console.log("222222222222222222222222222222222222222222222",this.employerEdli)

          // === Admin Charges & EDLI based on Earning Array ===
          const earningArrayValues = earningArray.getRawValue();
          const epfEligibleEarnings = earningArrayValues
            .filter((e: any) => e.consider_for_epf == 1)
            .reduce(
              (sum: number, e: any) =>
                sum +
                parseFloat(e.monthlyBasic || e.fixedAllowanceMonthly || '0'),
              0
            );

          // Apply statutory PF wage cap if needed
          const pfCap = 15000;
          const epfBase =
            epfEligibleEarnings > pfCap ? pfCap : epfEligibleEarnings;

          // 🧾 Admin Charges Calculation
          if (deduction.is_admin_charges_in_ctc === 1) {
            const rate = parseFloat(deduction.admin_charges_rate || '0');
            const cap = parseFloat(deduction.admin_charges_cap || '0');

            let adminCharge = (epfBase * rate) / 100;
            adminCharge = parseFloat(adminCharge.toFixed(2));
            if (cap && adminCharge > cap) adminCharge = cap;

            this.employerAdminCharges = adminCharge;
            employerExcludedMonthly += adminCharge;
            employerExcludedAnnual += adminCharge * 12;
          }

          // 🧾 EDLI Calculation
          if (deduction.is_edli_contribution_in_ctc === 1) {
            const edliRate = parseFloat(deduction.edli_rate || '0');
            let edliAmount = (epfBase * edliRate) / 100;
            edliAmount = parseFloat(edliAmount.toFixed(2));

            this.employerEdli = edliAmount;
            employerExcludedMonthly += edliAmount;
            employerExcludedAnnual += edliAmount * 12;
          }
        }

        // ////////////////////
        else if (deduction.componentName === 'ESI') {
          employerExcludedMonthly += this.employeerContributionEsi || 0;
          employerExcludedAnnual += (this.employeerContributionEsi || 0) * 12;
        }
      }
    });

    // Add reimbursements
    reimbursementArray.getRawValue().forEach((reimbursement: any) => {
      totalMonthlyCTC += parseFloat(reimbursement.fixedAllowanceMonthly || '0');
      totalAnnualCTC += parseFloat(reimbursement.fixedAllowanceAnnual || '0');
    });

    // DON'T add variable earnings to main CTC - calculate separately
    this.calculateVariableEarningsTotal();

    // Final CTC calculation
    this.totalMonthlyCTC = (totalMonthlyCTC - employerExcludedMonthly).toFixed(
      2
    );
    this.totalAnnualCTC = (totalAnnualCTC - employerExcludedAnnual).toFixed(2);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Method to calculate employer contributions
  calculateEmployerContributions() {
    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;

    deductionArray.getRawValue().forEach((deduction: any) => {
      if (deduction.componentName === 'EPF') {
        const employeeMonthly = parseFloat(deduction.monthlyBasic || '0');
        this.employeerContributionMatched = employeeMonthly; // Employer EPF = Employee EPF
      } else if (deduction.componentName === 'ESI') {
        const employeeMonthly = parseFloat(deduction.monthlyBasic || '0');
        this.employeerContributionEsi = employeeMonthly * (3.25 / 0.75); // Calculate employer ESI
      }
    });
  }
  // 8. Fix the checkCompliance method to ensure calculations trigger
  checkCompliance(controlName: string, id: any, label: string) {
    if (!this.complianceDetails) {
      return;
    }

    if (id) {
      this.salaryForm.get(controlName)?.setValue(true, { emitEvent: false });
      // Manually trigger calculation since we disabled events
      if (controlName === 'epf' || controlName === 'esi') {
        setTimeout(() => this.updateDeduction(), 0);
      }
    } else {
      this.salaryForm.get(controlName)?.setValue(false, { emitEvent: false });
      this.toastr.error(
        `${label} is not configured/applicable for this state/entity!`
      );
      // Trigger calculation to reset values
      if (controlName === 'epf' || controlName === 'esi') {
        setTimeout(() => this.updateDeduction(), 0);
      }
    }
  }
  salaryGetBy(id: any) {
    this._empoloyeeService.getByUserId(id).subscribe((res: any) => {
      this.salaryGetData = res.data;
      this.currency_id = res.data?.gradeSalaryData[0]?.currency_id;
      this.pfCap = res.data?.gradeSalaryData[0]?.pfCap;
      this.esiThreshold = res.data?.gradeSalaryData[0]?.esiThreshold;
      console.log('pfffff--->', this.pfCap, 'esiii---->', this.esiThreshold);

      this.salaryPatchData(res.data);
      this.getAllCurrency();

      if (this.salaryGetData?.gradeSalaryData?.length) {
        this.templateSeletc = true;

        this.salaryForm?.patchValue({
          annualCTC: res.data?.gradeSalaryData[0]?.ctc,
          monthlyCTC: res.data?.gradeSalaryData[0]?.ctc / 12,
        });
        console.log(this.salaryGetData, 'kkkkklllll');

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
          variableearningComponentList:
            res.data?.gradeSalaryData[0]?.variableearningComponentList,
        };

        // Set the component data and patch the form values
        this.setEarningComponentList(data);

        // After setting the component lists, patch the monthlyBasic and annualBasic values
        this.patchComponentValues(res.data);

        this.calculateEmployerContributions();

        // Calculate total CTC after all patching and calculations are complete
        setTimeout(() => {
          this.calculateTotalCTC();
        }, 0);
      }

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
    });
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
      epf: Number(salaryGetData?.epf) || 0,
      epf_capping: Number(salaryGetData?.epf_capping) || 0,
      edli: Number(salaryGetData?.edli) || 0,
      professional_tax: Number(salaryGetData?.professional_tax) || 0,
      esi: Number(salaryGetData?.esi) || 0,
      labour_welfare_fund: Number(salaryGetData?.labour_welfare_fund) || 0,
      gratuity_employer: Number(salaryGetData?.gratuity_employer) || 0,
      overtime: Number(salaryGetData?.overtime) || 0,
      nps: Number(salaryGetData?.nps) || 0,
      saf: Number(salaryGetData?.saf) || 0,
    });

    const salaryTempControl = this.salaryForm.get('salary_temp_data');
    if (salaryGetData?.epf_type) {
      salaryTempControl?.enable();
    } else {
      salaryTempControl?.disable();
    }

    if (salaryGetData?.gradeSalaryData[0]?.tax_calculation == 1) {
      this.salaryForm.patchValue({
        tax_calculation: 'true',
      });
      this.selectedValueTax = true;
    } else if (salaryGetData?.gradeSalaryData[0]?.tax_calculation == 0) {
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

  // New method to patch component values after form arrays are initialized
  patchComponentValues(salaryGetData: any) {
    // Patch deduction component values
    const deductionFormArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    if (
      deductionFormArray &&
      salaryGetData?.gradeSalaryData?.[0]?.deductionComponentList
    ) {
      salaryGetData.gradeSalaryData[0].deductionComponentList.forEach(
        (deduction: any, index: number) => {
          const formGroup = deductionFormArray.at(index) as FormGroup;
          if (formGroup) {
            // Patch monthlyBasic and annualBasic values
            if (deduction.monthlyBasic !== undefined) {
              formGroup.patchValue({
                monthlyBasic: deduction.monthlyBasic,
              });
            }
            if (deduction.annualBasic !== undefined) {
              formGroup.patchValue({
                annualBasic: deduction.annualBasic,
              });
            }
            // Patch other component values as needed
            if (deduction.basicPercentage !== undefined) {
              formGroup.patchValue({
                basicPercentage: deduction.basicPercentage,
              });
            }
            if (deduction.fixedAllowanceMonthly !== undefined) {
              formGroup.patchValue({
                fixedAllowanceMonthly: deduction.fixedAllowanceMonthly,
              });
            }
            if (deduction.fixedAllowanceAnnual !== undefined) {
              formGroup.patchValue({
                fixedAllowanceAnnual: deduction.fixedAllowanceAnnual,
              });
            }
          }
        }
      );
    }

    // Similarly patch earning component values if needed
    const earningFormArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    if (
      earningFormArray &&
      salaryGetData?.gradeSalaryData?.[0]?.earningComponentList
    ) {
      salaryGetData.gradeSalaryData[0].earningComponentList.forEach(
        (earning: any, index: number) => {
          const formGroup = earningFormArray.at(index) as FormGroup;
          if (formGroup) {
            // Patch monthlyBasic and annualBasic values for earnings as well
            if (earning.monthlyBasic !== undefined) {
              formGroup.patchValue({
                monthlyBasic: earning.monthlyBasic,
              });
            }
            if (earning.annualBasic !== undefined) {
              formGroup.patchValue({
                annualBasic: earning.annualBasic,
              });
            }
          }
        }
      );
    }

    // Patch reimbursement component values if needed
    const reimbursementFormArray = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    if (
      reimbursementFormArray &&
      salaryGetData?.gradeSalaryData?.[0]?.reiembursementComponentList
    ) {
      salaryGetData.gradeSalaryData[0].reiembursementComponentList.forEach(
        (reimbursement: any, index: number) => {
          const formGroup = reimbursementFormArray.at(index) as FormGroup;
          if (formGroup) {
            // Patch values for reimbursement components
            if (reimbursement.monthlyBasic !== undefined) {
              formGroup.patchValue({
                monthlyBasic: reimbursement.monthlyBasic,
              });
            }
            if (reimbursement.annualBasic !== undefined) {
              formGroup.patchValue({
                annualBasic: reimbursement.annualBasic,
              });
            }
          }
        }
      );
    }

    // Patch variableearning component values if needed
    const variableearningArray = this.salaryForm.get(
      'variableearningComponentList'
    ) as FormArray;
    if (
      variableearningArray &&
      salaryGetData?.gradeSalaryData?.[0]?.variableearningComponentList
    ) {
      salaryGetData.gradeSalaryData[0].variableearningComponentList.forEach(
        (variableearning: any, index: number) => {
          const formGroup = variableearningArray.at(index) as FormGroup;
          if (formGroup) {
            // Patch values for reimbursement components
            if (variableearning.monthlyBasic !== undefined) {
              formGroup.patchValue({
                monthlyBasic: variableearning.monthlyBasic,
              });
            }
            if (variableearning.annualBasic !== undefined) {
              formGroup.patchValue({
                annualBasic: variableearning.annualBasic,
              });
            }
          }
        }
      );
    }
  }
  get epfSelected(): boolean {
    const epfFromForm = this.salaryForm.get('epf')?.value;

    const epfFromList = this.salaryForm.value?.deductionComponentList?.some(
      (comp: any) =>
        comp.componentName === 'EPF' &&
        comp.is_employer_contribution_in_ctc === 1
    );

    return !!(epfFromForm && epfFromList);
  }

  get edliSelected(): boolean {
    const edliFromForm = this.salaryForm.get('edli')?.value;
    const edliFromList = this.salaryForm.value?.deductionComponentList?.some(
      (comp: any) =>
        comp.componentName === 'EPF' && comp.is_edli_contribution_in_ctc === 1
    );
    console.log(
      '11111111111111111111111111111',
      this.salaryForm.value?.deductionComponentList
    );
    return !!(edliFromForm && edliFromList);
  }
  get adminChargesSelected(): boolean {
    const adminFromForm = this.salaryForm.get('edli')?.value;
    const adminFromList = this.salaryForm.value?.deductionComponentList?.some(
      (comp: any) =>
        comp.componentName === 'EPF' && comp.is_admin_charges_in_ctc === 1
    );
    return !!(adminFromForm && adminFromList);
  }

  get esiSelected(): boolean {
    const esiFromForm = this.salaryForm.get('esi')?.value;

    const esiFromList = this.salaryForm.value?.deductionComponentList?.some(
      (comp: any) =>
        comp.componentName === 'ESI' && comp.employer_contribution_in_ctc === 1
    );

    return !!(esiFromForm && esiFromList);
  }

  getEmployeeShareWithAmount(): string {
    const shares: string[] = [];

    if (this.epfSelected) {
      shares.push(
        `EPF ₹${parseFloat(this.employeerContributionMatched || 0).toFixed(2)}`
      );
    }

    if (this.esiSelected) {
      shares.push(
        `ESI ₹${parseFloat(this.employeerContributionEsi || 0).toFixed(2)}`
      );
    }

    if (this.edliSelected) {
      shares.push(`EDLI ₹${parseFloat(this.employerEdli || 0).toFixed(2)}`);
    }

    if (this.adminChargesSelected) {
      shares.push(
        `Admin Charge ₹${parseFloat(this.employerAdminCharges || 0).toFixed(2)}`
      );
    }

    return shares.length > 0 ? shares.join(' + ') : 'None';
  }

  // getEmployeeShareText(): string {
  //   const shares: string[] = [];

  //   if (this.epfSelected) shares.push('EPF');
  //   if (this.esiSelected) shares.push('ESI');
  //   if (this.edliSelected) shares.push('EDLI');
  //   if (this.adminChargesSelected) shares.push('Admin Charge');

  //   return shares.length > 0 ? shares.join(' + ') : 'None';
  // }

  // Add this method to calculate Variable Earnings total
  calculateVariableEarningsTotal() {
    const variableearningArray = this.salaryForm.get(
      'variableearningComponentList'
    ) as FormArray;
    this.totalVariableEarningsAnnual = 0;

    variableearningArray.getRawValue().forEach((variableearning: any) => {
      this.totalVariableEarningsAnnual += parseFloat(
        variableearning.fixedAllowanceAnnual || '0'
      );
    });

    return this.totalVariableEarningsAnnual;
  }
}
