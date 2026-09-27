import { Component, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { PaySlipService } from 'src/app/@shared/services/payroll/pay-slip.service';

@Component({
  selector: 'app-salary-template-create',
  templateUrl: './salary-template-create.component.html',
  styleUrls: ['./salary-template-create.component.scss'],
})
export class SalaryTemplateCreateComponent {
  earningCompList: any = [];
  deductionCompList: any;
  riembursementCompList: any;
  variableearningCompList: any;
  ctcForm: FormGroup;
  totalMonthlyCTC: any = 0;
  totalAnnualCTC: any = 0;
  basicComp: boolean = true;
  totalVariableEarningsAnnual: number = 0;
  earningCompListReference: any;
  deductionCompListReference: any;
  riembursementCompListReference: any;
  variableearningCompListReference: any;
  gradeList: any;
  branchList: any;
  companyList: any;
  negativeAlert: boolean = false;
  negativeMonthly: any = 0;
  negativeAnualy: any = 0;
  signIn: any = localStorage.getItem('signInUser');
  singInUser = JSON.parse(this.signIn);
  entityList: any;
  getEntityId: any;
  branch: any;
  getEntityData: any;
  allCompanyData: any;
  companyId: any;
  isCheckedCondition: boolean = false;
  getCurrencyData: any;
  currencySymbol: any;
  saleryTemplateId: any;
  totalEPF: any;
  totalEpFAnnual: any;
  temppCurrencyId: any;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private payrollService: PayrollService,
    private _PaySlipService: PaySlipService
  ) {
    this.ctcForm = this.fb.group({
      templateName: new FormControl(null),
      // company: ['', Validators.required],
      // branch: [[], Validators.required],
      // grade: ['', Validators.required],
      description: new FormControl(null),
      annualCTC: [0, Validators.required],
      earningComponentList: this.fb.array([]),
      deductionComponentList: this.fb.array([]),
      reiembursementComponentList: this.fb.array([]),
      variableearningComponentList: this.fb.array([]),
      monthlyCTC: new FormControl(null),
      currency: new FormControl(null),
      pfCap: new FormControl(0),
      esiThreshold: new FormControl(0),
    });

    this.ctcForm.get('annualCTC')?.valueChanges.subscribe((value) => {
      this.updateCalculations(value);
    });
  }

  // isAllSelected(): boolean {
  //   const selected = this.ctcForm.get('branch')?.value;
  //   return selected && selected.length === this.branchList.length;
  // }

  // // Check if a specific branch is selected
  // isSelected(branchId: number): boolean {
  //   const selected = this.ctcForm.get('branch')?.value;
  //   return selected ? selected.includes(branchId) : false;
  // }

  // // Toggle "All Select" functionality
  // toggleAllSelection() {
  //   const allBranchIds = this.branchList.map((branch:any) => branch.id);
  //   const selected = this.ctcForm.get('branch')?.value;

  //   if (selected && selected.length === this.branchList.length) {
  //     // Unselect all
  //     this.ctcForm.get('branch')?.setValue([]);
  //   } else {
  //     // Select all
  //     this.ctcForm.get('branch')?.setValue(allBranchIds);
  //   }
  // }
  @ViewChild('select') select: MatSelect;

  allSelected = false;
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
    console.log(this.select.value, ' this.select.options1111');
  }
  optionClick() {
    console.log(this.select.value, ' this.select.options');

    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
    console.log(this.allSelected, 'this.allSelected');
  }
  onMonthlyAmountKeyup(index: number) {
    const reimbursementArray = this.ctcForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    const reimbursementGroup = reimbursementArray.at(index) as FormGroup;

    const fixedAmountLimit = reimbursementGroup.get('fixedAmountLimit')?.value;
    let monthlyAmount = reimbursementGroup.get('fixedAllowanceMonthly')?.value;
    console.log(fixedAmountLimit, 'fixedAmountLimit<<<<<<<<');
    console.log(monthlyAmount, 'monthlyAmount<<<<<<<<');
    // Ensure the monthly amount does not exceed the fixed amount limit
    // if (monthlyAmount > fixedAmountLimit) {
    //   monthlyAmount = fixedAmountLimit;
    //   reimbursementGroup.get('fixedAllowanceMonthly')?.setValue(fixedAmountLimit);
    //   this.toast.warning('Amount Limit is fixed.');
    // }else{
    // }
    // reimbursementGroup.get('fixedAllowanceMonthly')?.setValue(fixedAmountLimit)
    this.totalCountCreate();

    // Update the annual amount based on the monthly amount
    const annualAmount = monthlyAmount * 12;
    reimbursementGroup
      .get('fixedAllowanceAnnual')
      ?.setValue(annualAmount.toFixed(2));

    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  onAnnualVariableearningAmountKeyup(index: number) {
    const variableearningArray = this.ctcForm.get(
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

  onCheckboxChange(event: any): void {
    this.isCheckedCondition = event.checked;
    console.log('Checkbox checked:', this.isCheckedCondition);
  }

  updateFixedEarningAmount(index: number) {
    const earningArray = this.ctcForm.get('earningComponentList') as FormArray;
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
    const annualCTC = this.ctcForm.get('annualCTC')?.value;

    // Step 1: Calculate total reimbursement amount
    const reimbursementArray = this.ctcForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    let totalReimbursementAmount = 0;
    reimbursementArray.controls.forEach((reimbursement) => {
      const reimbursementAnnual =
        reimbursement.get('fixedAllowanceAnnual')?.value || 0;
      totalReimbursementAmount += parseFloat(reimbursementAnnual);
    });

    // Step 1: Calculate total reimbursement amount
    const variableearningArray = this.ctcForm.get(
      'variableearningComponentList'
    ) as FormArray;
    let totalVariableearningAmount = 0;
    variableearningArray.controls.forEach((variableearning) => {
      const variableearningAnnual =
        variableearning.get('fixedAllowanceAnnual')?.value || 0;
      totalVariableearningAmount += parseFloat(variableearningAnnual);
    });
    // Step 2: Calculate total earnings excluding Fixed Allowance
    const earningArray = this.ctcForm.get('earningComponentList') as FormArray;
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
    const deductionArray = this.ctcForm.get(
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
    console.log(earningArray.controls, 'earningArray.controls<<<<<<<<<<<');

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
  }

  onMonthlyDeductionAmountKeyup(index: number) {
    const deductionArray = this.ctcForm.get(
      'deductionComponentList'
    ) as FormArray;
    const deductionGroup = deductionArray.at(index) as FormGroup;

    const fixedAmountLimit = deductionGroup.get('fixedAmountLimit')?.value;
    let monthlyAmount = deductionGroup.get('fixedAllowanceMonthly')?.value;

    // Ensure the monthly amount does not exceed the fixed amount limit
    // if (monthlyAmount > fixedAmountLimit) {
    //   monthlyAmount = fixedAmountLimit;
    //   deductionGroup.get('fixedAllowanceMonthly')?.setValue(fixedAmountLimit);
    //   this.toast.warning('Amount Limit is fixed.')
    // }

    // Update the annual amount based on the monthly amount
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
    console.log(data, 'data earning<<<<<<<<<<<<');

    if (type === 'value-based') {
      return this.fb.group({
        componentName: [name, Validators.required],
        calculationType: [data?.earning_type],
        basicPercentage: [
          { value: data?.calculation_percentage || 0, disabled: false },
          Validators.required,
        ],
        monthlyBasic: [{ value: 0 }],
        earningTypeCode: [data?.earning_type_code],
        annualBasic: [{ value: 0 }],
        calculationTypeCode: [data.calculation_type_code],

        calculation_amount: [data.calculation_amount],
        calculation_type: [data.calculation_type],
        id: [data?.id],
        name_in_payslip: data?.name_in_payslip,
        mark_as_active: data?.mark_as_active,
        is_part_of_salary_structure: data?.is_part_of_salary_structure,
        is_taxable: data?.is_taxable,
        is_overtime: data?.is_overtime,
        is_pro_rata: data?.is_pro_rata,
        consider_for_epf: data?.consider_for_epf,
        consider_for_nps: data?.consider_for_nps,
        consider_for_saf: data?.consider_for_saf,
        epf_condition: data?.epf_condition,
        consider_for_esi: data?.consider_for_esi,
        show_in_payslip: data?.show_in_payslip,
        created_by: data?.created_by,
        is_active: data?.is_active,
      });
    } else if (type === 'fixed') {
      return this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        earningTypeCode: [data?.earning_type_code],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }],

        calculation_amount: [data.calculation_amount],
        calculation_type: [data.calculation_type],
        id: [data?.id],
        name_in_payslip: data?.name_in_payslip,
        mark_as_active: data?.mark_as_active,
        is_part_of_salary_structure: data?.is_part_of_salary_structure,
        is_taxable: data?.is_taxable,
        is_overtime: data?.is_overtime,
        is_pro_rata: data?.is_pro_rata,
        consider_for_epf: data?.consider_for_epf,
        consider_for_nps: data?.consider_for_nps,
        consider_for_saf: data?.consider_for_saf,
        epf_condition: data?.epf_condition,
        consider_for_esi: data?.consider_for_esi,
        show_in_payslip: data?.show_in_payslip,
        created_by: data?.created_by,
        is_active: data?.is_active,
      });
    }
    throw new Error('Invalid component type specified');
  }

  createDeductionComponent(
    name: string,
    type: 'value-based' | 'fixed',
    data?: any
  ): FormGroup {
    console.log(data, 'deductions');

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
        id: [data?.id],
        name_in_payslip: data?.name_in_payslip,
        calculation_percentage: data?.calculation_percentage,
        deduction_frequency: data?.deduction_frequency,
        mark_as_active: data?.mark_as_active,
        is_active: data?.is_active,
        deduction_type: data?.deduction_type,
        calculation_type_code: data?.calculation_type_code,
      });
    } else if (type === 'fixed') {
      const formGroup = this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }],
        fixedAmountLimit: [data?.calculation_amount || 0],
        calculation_type: [data?.calculation_type],
        id: [data?.id],
        name_in_payslip: data?.name_in_payslip,
        calculation_percentage: data?.calculation_percentage,
        deduction_frequency: data?.deduction_frequency,
        mark_as_active: data?.mark_as_active,
        is_active: data?.is_active,
        deduction_type: data?.deduction_type,
        calculation_type_code: data?.calculation_type_code,
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
    // return this.fb.group({
    //   componentName: [name, Validators.required],
    //   fixedAllowanceMonthly: [0, Validators.required],
    //   fixedAllowanceAnnual: [{ value: 0, disabled: true }]
    // });
    throw new Error('Invalid component type specified');
  }

  get earningComponentList(): FormArray {
    return this.ctcForm.get('earningComponentList') as FormArray;
  }

  get deductionComponentList(): FormArray {
    return this.ctcForm.get('deductionComponentList') as FormArray;
  }

  get reiembursementComponentList(): FormArray {
    return this.ctcForm.get('reiembursementComponentList') as FormArray;
  }

  get variableearningComponentList(): FormArray {
    return this.ctcForm.get('variableearningComponentList') as FormArray;
  }

  addEarningComponent(name: string, type: 'value-based' | 'fixed') {
    const earningComponent = this.createEarningComponent(name, type);
    this.earningComponentList.push(earningComponent);
  }

  removeEarningComponent(index: number) {
    const earningTypeCode = this.earningComponentList
      .at(index)
      .get('componentName')?.value;
    if (earningTypeCode !== 'BASIC1' && earningTypeCode !== 'FIXE33') {
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
      console.error('Cannot remove Basic or Fixed Allowance components');
    }
  }

  addEarningComp(data: any) {
    console.log(data, 'klklkl');
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
    this.calculateTotalCTC();
  }

  createReiembursementComponent(name: string, data?: any): FormGroup {
    return this.fb.group({
      componentName: [name, Validators.required],
      fixedAllowanceMonthly: [0, Validators.required],
      fixedAllowanceAnnual: [{ value: 0, disabled: true }],
      fixedAmountLimit: [data?.max_limit || 0],
      id: data?.id,
      reimbursement_type: data?.reimbursement_type,
      is_taxable: data?.is_taxable,
      name_in_payslip: data?.reimbursement_type,
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
      deduct_monthly: data?.deduct_monthly,
      deduct_when_credited: data?.deduct_when_credited,
      name_in_payslip: data?.name_in_payslip,
    });
  }

  ngOnInit(): void {
    this.getAllEarningComponentList();
    this.getAllRiembursementComponentList();
    this.getAllVariableearningComponentList();
    this.getAllDeductionComponentList();
    this.getLocalStorage();
    this.getAllCurrency();
    this.getAllBranchList();
    this.getAllCompanyList();
    this.getAllEntityMasterData();
    this.getAllCompanyWith();
  }

  getLocalStorage() {
    let getLocal: any = localStorage.getItem('selectedEntityId');
    this.getEntityId = JSON.parse(getLocal);

    let getEnityData: any = localStorage.getItem('entityList');
    this.getEntityData = JSON.parse(getEnityData);
    console.log(this.getEntityData, 'getEnityData');
    let entity = this.getEntityData.find(
      (res: any) => res.entity_id == this.getEntityId
    );
    this.ctcForm.patchValue({ company: entity?.company_name });
    this.companyId = entity?.company_id;

    this.activeroute.queryParams.subscribe((params: any) => {
      console.log(params, 'params');
      this.saleryTemplateId = params?.template_id;
      if (this.saleryTemplateId) {
        this.getSalaryTemplateById(this.saleryTemplateId);
      }
    });
  }

  getSalaryTemplateById(id: any) {
    this.payrollService.getSalaryTemplateByIdDuplicate(id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.temppCurrencyId = res.data.currency_id;
          this.isCheckedCondition = res.data?.isPF_calculate;
          // this.templateData = res.data;
          // console.log(this.templateData,'this.templateDatathis.templateDatathis.templateData');
          this.ctcForm.patchValue({
            templateName: res.data?.template_name,
            description: res.data?.description,
            currency: res.data?.currency_id,
            annualCTC: res.data?.ctc,
            monthlyCTC: res.data?.gross_salary,
            pfCap: res.data?.pfCap,
            esiThreshold: res.data?.esiThreshold,
          });
          let data = {
            earningComponentList: res.data?.earningComponentList,
            deductionComponentList: res.data?.deductionComponentList,
            reiembursementComponentList: res.data?.reiembursementComponentList,
            variableearningComponentList:
              res.data?.variableearningComponentList,
          };
          this.setEarningComponentList(data);
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  setEarningComponentList(data: any) {
    console.log(data, 'earning Data<<<<<<<<<<<');

    let temp = this.earningCompList;
    let temp2 = this.deductionCompList;
    let temp3 = this.riembursementCompList;
    let temp4 = this.variableearningCompList;

    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;
    // if (this.templateSeletc === true) {
    //   this.enterSalary('fromAnnualCtc')

    // }
    this.enterSalary('fromAnnualCtc');
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
              consider_for_nps: item?.consider_for_nps,
              consider_for_saf: item?.consider_for_saf,
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
              // basicPercentage: [{ value: item?.basicPercentage || 0, disabled: true }, Validators.required],
              // annualBasic: [{ value: item?.annualBasic || 0, disabled: true }],
              // monthlyBasic: [{ value: item?.monthlyBasic || 0, disabled: true }],
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
              consider_for_nps: item?.consider_for_nps,
              consider_for_saf: item?.consider_for_saf,
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
                consider_for_nps: item?.consider_for_nps,
                consider_for_saf: item?.consider_for_saf,
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
                consider_for_nps: item?.consider_for_nps,
                consider_for_saf: item?.consider_for_saf,
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
    const earningArray = this.ctcForm.get('earningComponentList') as FormArray;
    console.log(earningArray.value, 'earningArray<<<<<');
    const earningModify = earningArray.value;

    let basicEPFMonth: number = 0;
    let OtherAllownceEpfMonth: number = 0;
    let basicEPFAnnual: number = 0;
    let OtherAllownceEpfYear: number = 0;
    earningModify.forEach((val: any) => {
      // Check for 'Basic Salary' component
      if (val?.componentName === 'Basic Salary') {
        basicEPFMonth = Number(val?.monthlyBasic);
        basicEPFAnnual = Number(val?.annualBasic);
      }

      if (val?.componentName === 'Other Allowance') {
        OtherAllownceEpfMonth = Number(val?.monthlyBasic);
        OtherAllownceEpfYear = Number(val?.annualBasic);
      }
    });

    // Now calculate total EPF outside the loop
    this.totalEPF = basicEPFMonth + OtherAllownceEpfMonth;
    this.totalEpFAnnual = basicEPFAnnual + OtherAllownceEpfYear;
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
        }
        // else if (item?.deduction_plan == 'EPF') {
        //   item.monthlyBasic = (this.totalEPF * Number(item?.employee_contribution)) / 100;
        //   item.annualBasic = this.totalEpFAnnual * Number(item?.employee_contribution) / 100;
        //   totalDeductionMonthlyCTC += Number(item?.monthlyBasic);
        //   totalDeductionAnnualCTC += Number(item?.annualBasic);
        // } else if (item?.deduction_plan == 'ESI') {
        //   item.monthlyBasic = ((this.totalEPF * Number(item?.employee_contribution)) / 100).toFixed(2);
        //   item.annualBasic = (this.totalEpFAnnual * Number(item?.employee_contribution) / 100).toFixed(2);
        //   totalDeductionMonthlyCTC += Number(item?.monthlyBasic);
        //   totalDeductionAnnualCTC += Number(item?.annualBasic);
        // }
        else {
          console.log(item, 'item<<<<<<<<<<<<<<<<<<<<<<<<<<');

          if (item?.monthlyBasic)
            totalDeductionMonthlyCTC =
              totalDeductionMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic)
            totalDeductionAnnualCTC =
              totalDeductionAnnualCTC + Number(item?.annualBasic);
        }

        console.log(item, 'item<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>');
        console.log(
          this.deductionComponentList,
          'item<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>2'
        );

        const formGroup = this.deductionComponentList?.at(index) as FormGroup;
        if (formGroup) {
          if (item?.calculation_type == 'Flat Amount') {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName || item?.deduction_plan,
              calculationType: item?.calculationType,
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
              edli_rate: item?.edli_rate,
              admin_charges_rate: item?.admin_charges_rate,
              admin_charges_cap: item?.admin_charges_cap,
              override_at_employee_level: item?.override_at_employee_level,
              is_pro_rate_restricted_pf_wage:
                item?.is_pro_rate_restricted_pf_wage,
              consider_salary_components_if_low_pf:
                item?.consider_salary_components_if_low_pf,
              employee_contribution: item?.employee_contribution,
              employer_contribution: item?.employer_contribution,
              deduction_plan: item?.deduction_plan,
              esi_number: item?.esi_number,
              name_in_payslip: item?.name_in_payslip,
            });
          } else {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName || item?.deduction_plan,
              basicPercentage:
                item?.basicPercentage || item?.employee_contribution,
              annualBasic: item?.annualBasic,
              monthlyBasic: item?.monthlyBasic?.toFixed(2),
              calculationType: item?.calculationType,
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
              edli_rate: item?.edli_rate,
              admin_charges_rate: item?.admin_charges_rate,
              admin_charges_cap: item?.admin_charges_cap,
              override_at_employee_level: item?.override_at_employee_level,
              is_pro_rate_restricted_pf_wage:
                item?.is_pro_rate_restricted_pf_wage,
              consider_salary_components_if_low_pf:
                item?.consider_salary_components_if_low_pf,
              employee_contribution: item?.employee_contribution,
              employer_contribution: item?.employer_contribution,
              deduction_plan: item?.deduction_plan,
              esi_number: item?.esi_number,
              name_in_payslip: item?.name_in_payslip,
            });
          }
        } else {
          if (item?.calculation_type == 'Flat Amount') {
            this.deductionComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName || item?.deduction_plan,
                // basicPercentage: item?.basicPercentage,
                calculationType:
                  item?.calculationType || '(Basic Salary + Other Allowances)',
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
                edli_rate: item?.edli_rate,
                admin_charges_rate: item?.admin_charges_rate,
                admin_charges_cap: item?.admin_charges_cap,
                override_at_employee_level: item?.override_at_employee_level,
                is_pro_rate_restricted_pf_wage:
                  item?.is_pro_rate_restricted_pf_wage,
                consider_salary_components_if_low_pf:
                  item?.consider_salary_components_if_low_pf,
                employee_contribution: item?.employee_contribution,
                employer_contribution: item?.employer_contribution,
                deduction_plan: item?.deduction_plan,
                esi_number: item?.esi_number,
                name_in_payslip: item?.name_in_payslip,
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
                calculationType: item?.calculationType,
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
                edli_rate: item?.edli_rate,
                admin_charges_rate: item?.admin_charges_rate,
                admin_charges_cap: item?.admin_charges_cap,
                override_at_employee_level: item?.override_at_employee_level,
                is_pro_rate_restricted_pf_wage:
                  item?.is_pro_rate_restricted_pf_wage,
                consider_salary_components_if_low_pf:
                  item?.consider_salary_components_if_low_pf,
                employee_contribution: item?.employee_contribution,
                employer_contribution: item?.employer_contribution,
                deduction_plan: item?.deduction_plan,
                esi_number: item?.esi_number,
                name_in_payslip: item?.name_in_payslip,
              })
            );
          }
        }
      });
    }
    console.log(temp2, 'item<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>3');
    console.log(
      this.deductionComponentList,
      'this.deductionComponentList<<<<<<<>>>>>>>>'
    );

    // ***********************
    if (data?.reiembursementComponentList?.length) {
      data?.reiembursementComponentList?.forEach((item: any, index: number) => {
        this.riembursementCompList?.forEach((value: any, i: any) => {
          if (value?.reimbursement_name == item?.componentName) {
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
            name_in_payslip: item?.reimbursement_type,
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
              name_in_payslip: item?.reimbursement_type,
            })
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
              deduct_monthly: item?.deduct_monthly,
              deduct_when_credited: item?.deduct_when_credited,
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
                deduct_monthly: item?.deduct_monthly,
                deduct_when_credited: item?.deduct_when_credited,
                name_in_payslip: item?.name_in_payslip,
              })
            );
          }
        }
      );
    }
    // For Variableearning end //
    console.log(
      totalMonthlyCTC,
      'totalMonthlyCTC<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>'
    );
    console.log(totalDeductionMonthlyCTC, 'totalDeductionMonthlyCTC');

    this.totalMonthlyCTC = (totalMonthlyCTC - totalDeductionMonthlyCTC).toFixed(
      2
    );
    console.log(this.totalMonthlyCTC, 'this.totalMonthlyCTC<<<<<<<<<<<<');

    this.totalAnnualCTC = (totalAnnualCTC - totalDeductionAnnualCTC).toFixed(2);
    console.log(temp2, 'temp2<<<<<<<<<<<<<<<<<<<<<<<<<<<');

    // console.log(this.ctcForm);
    // this.earningCompList = temp;
    // this.deductionCompList = temp2;
    // this.riembursementCompList = temp3;
    // this.variableearningCompList = temp4;
    this.calculateTotalCTC();
  }

  getAllCompanyWith() {
    console.log(this.companyId, 'id>>>>>>>>>>>>>>>>>>');

    this._PaySlipService
      .getAllCompanyWith(this.companyId)
      .subscribe((res: any) => {
        console.log(res);
        this.allCompanyData = res.data;
      });
  }
  getAllEntityMasterData() {
    this.payrollService.getAllEntityMaster().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.entityList = res.data;
          // let entity = this.entityList.find((res: any) => res.id == this.getEntityId)
          // this.ctcForm.patchValue({ company: entity?.entity_name })
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }
  getAllEarningComponentList() {
    this.payrollService.getAllEarningCompList().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.earningCompList = res.data;
          this.earningCompListReference = [...this.earningCompList];

          this.earningCompList.forEach((erData: any) => {
            if (erData.earning_type_code == 'BASIC1') {
              // this.addEarningComp(erData);
            }
          });
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  getAllDeductionComponentList() {
    this.payrollService.getAllDeductionCompList().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.deductionCompList = res.data;
          this.deductionCompListReference = [...this.deductionCompList];
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  getAllRiembursementComponentList() {
    this.payrollService.getAllRiembursementCompList().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.riembursementCompList = res.data;
          this.riembursementCompListReference = [...this.riembursementCompList];
        }
      },
      (err) => {
        this.toast.error(err.error.message);
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
  currencySelect(e: any) {
    console.log(e, 'eeeeee');
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
          if (this.temppCurrencyId) {
            this.currencySelect({ value: this.temppCurrencyId });
          }
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  getAllBranchList() {
    this.payrollService.getAllBranch().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.branchList = res.data;
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }
  getAllCompanyList() {
    this.payrollService.getAllCompany().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.companyList = res.data;
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  addDeductionComp(data: any) {
    console.log(data, 'klklkl');
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
    this.calculateTotalCTC();
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
    console.log(data, 'klklkl');
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
  formSubmit() {
    try {
      // if (this.ctcForm.invalid) {
      //   return this.toast.error('Required fields should not be empty', 'Fields Error');
      // }
      // Calculate Variable Earnings totals for submission
      console.log(this.ctcForm.getRawValue(), 'klklklklkl');
      let data = this.ctcForm.getRawValue();
      const totalVariableEarningsAnnual =
        data?.variableearningComponentList?.reduce(
          (total: number, item: any) =>
            total + parseFloat(item?.fixedAllowanceAnnual || '0'),
          0
        ) || 0;
      let payload = {
        ...data,
        created_by: this.singInUser?.employee_id,
        totalMonthlyCTC: this.totalMonthlyCTC,
        totalAnnualCTC: this.totalAnnualCTC,
        totalVariableEarningsAnnual: totalVariableEarningsAnnual.toFixed(2),
        // branch:this.select.value,
        isPF_calculate: this.isCheckedCondition,
        gross_salary_monthly: data?.monthlyCTC,
        template_name: data.templateName,
        description: data.description,
        currency_id: data?.currency,
        ctc: data?.annualCTC,
        gross_salary: data?.monthlyCTC,
      };
      console.log(payload, 'ssssssssssssssssssssssssss');
      if (this.saleryTemplateId) {
        this.payrollService
          .saveSalaryTemplateUpdate(this.saleryTemplateId, payload)
          .subscribe(
            (res: any) => {
              if (res && res.data) {
                console.log(res.data);
                this.toast.success(res.message);
                this.route.navigateByUrl('master/payroll/salary-templates');
              }
            },
            (err) => {
              this.toast.error(err.error.message);
            }
          );
      } else {
        this.payrollService.saveSalaryTemplate(payload).subscribe(
          (res: any) => {
            if (res && res.data) {
              console.log(res.data);
              this.toast.success(data.message);
              this.route.navigateByUrl('master/payroll/salary-templates');
            }
          },
          (err) => {
            this.toast.error(err.error.message);
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Method to update all components based on the Annual CTC
  updateCalculations(annualCTC: number) {
    this.updateEarnings();
    this.calculateTotalCTC();
    this.updateDeduction();
  }

  // Method to handle earnings
  updateEarnings() {
    let annualCTC = this.ctcForm.get('annualCTC')?.value;
    const earningArray = this.ctcForm.get('earningComponentList') as FormArray;
    earningArray.controls.forEach((earning: any) => {
      const calculationTypeCode = earning.get('calculationTypeCode')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = earning.get('basicPercentage')?.value;
      const calculation_type = earning.get('calculation_type')?.value;
      const basicSalary = this.getAnnualBasic();

      let annualAmount = 0;
      let monthlyAmount = 0;
      console.log(annualCTC, 'annualCTC<<<<<<<<<');
      console.log(percentage, 'percentage>>>>>>>>>>>');
      console.log(calculationTypeCode, 'calculationTypeCode<<<<<');

      // if (calculationTypeCode === 'CTC') {
      //   annualAmount = (annualCTC * percentage) / 100;
      //   monthlyAmount = annualAmount / 12;
      // } else if (calculationTypeCode === 'BASIC1') {
      //   annualAmount = (basicSalary * percentage) / 100;
      //   monthlyAmount = annualAmount / 12;
      // }else{

      // }
      if (calculationTypeCode == 'gross_salary') {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }
      earning.get('annualBasic')?.setValue(annualAmount);
      earning.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
      if (calculation_type == 'Flat Amount') {
        let fixedAllowanceMonthly =
          (earning?.value?.calculation_amount).toFixed(2);
        let fixedAllowanceAnnual = earning?.value?.calculation_amount * 12;
        earning.get('fixedAllowanceAnnual')?.setValue(fixedAllowanceAnnual);
        earning.get('fixedAllowanceMonthly')?.setValue(fixedAllowanceMonthly);
      }
    });
    const earningArrayChck = this.ctcForm.get(
      'earningComponentList'
    ) as FormArray;
    console.log(earningArrayChck, 'earningArrayChck<<<<<<<<<<<<');

    this.updateFixedAllowancee();
  }

  updateDeduction() {
    let annualCTC = this.ctcForm.get('annualCTC')?.value;
    const deductionArray = this.ctcForm.get(
      'deductionComponentList'
    ) as FormArray;
    console.log(deductionArray, 'deductionArray<<<<<<<<<<<<<<<');

    let grossMonthlySalary = annualCTC / 12;
    deductionArray.controls.forEach((deduction: any) => {
      const calculationType = deduction.get('calculationType')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = deduction.get('basicPercentage')?.value;
      const calculationTypeCode = deduction.get('calculationTypeCode')?.value;
      const calculation_type = deduction.get('calculation_type')?.value;
      const basicSalary = this.getAnnualBasic();
      let annualAmount = 0;
      let monthlyAmount = 0;

      if (calculationTypeCode === 'CTC') {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else if (
        calculationTypeCode === 'EPF' ||
        calculationTypeCode === 'ESI' ||
        calculationTypeCode === 'BASIC1'
      ) {
        annualAmount = (basicSalary * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }

      if (
        deduction.get('componentName')?.value === 'ESI' &&
        grossMonthlySalary > 21000
      ) {
        annualAmount = 0; // Set annual amount to 0 if ESI and gross monthly salary exceeds ₹21,000
        monthlyAmount = 0; // Set monthly amount to 0 if ESI and gross monthly salary exceeds ₹21,000
      }

      if (calculation_type == 'Flat Amount') {
        let fixedAllowanceMonthly = deduction?.value?.fixedAmountLimit;
        let fixedAllowanceAnnual = deduction?.value?.fixedAmountLimit * 12;
        deduction.get('fixedAllowanceAnnual')?.setValue(fixedAllowanceAnnual);
        deduction.get('fixedAllowanceMonthly')?.setValue(fixedAllowanceMonthly);
      }

      deduction.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      deduction.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });
    this.updateFixedAllowancee();
  }

  // Get Basic Salary from dynamic earnings list
  getAnnualBasic(): number {
    const earningArray = this.ctcForm.get('earningComponentList') as FormArray;

    // Find Basic Salary component if it exists
    const basicSalaryComponent = earningArray.controls.find(
      (control) => control.get('earningTypeCode')?.value === 'BASIC1'
    );

    return basicSalaryComponent
      ? basicSalaryComponent.get('annualBasic')?.value
      : 0;
  }
  updateEarningsPercent(earning: any) {
    let annualCTC = this.ctcForm.get('annualCTC')?.value;
    const earningArray = this.ctcForm.get('earningComponentList') as FormArray;
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

      // if (calculationTypeCode === 'CTC') {
      //   annualAmount = (annualCTC * percentage) / 100;
      //   monthlyAmount = annualAmount / 12;
      // } else if (calculationTypeCode === 'EPF' || calculationTypeCode === 'ESI' || calculationTypeCode === 'BASIC1') {
      //   annualAmount = (basicSalary * percentage) / 100;
      //   monthlyAmount = annualAmount / 12;
      // }

      // if (deduction.get('componentName')?.value === 'ESI' && grossMonthlySalary > 21000) {
      //   annualAmount = 0; // Set annual amount to 0 if ESI and gross monthly salary exceeds ₹21,000
      //   monthlyAmount = 0; // Set monthly amount to 0 if ESI and gross monthly salary exceeds ₹21,000
      // }

      earning.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      earning.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  calculateTotalCTC() {
    // Get raw values from form arrays to ensure all values are included, even if inputs are disabled
    const earningArray = this.ctcForm.get('earningComponentList') as FormArray;
    const deductionArray = this.ctcForm.get(
      'deductionComponentList'
    ) as FormArray;
    const reimbursementArray = this.ctcForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    const variableearningArray = this.ctcForm.get(
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
        totalMonthlyCTC += parseFloat(deduction.monthlyBasic || '0');
        totalAnnualCTC += parseFloat(deduction.annualBasic || '0');
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

  back() {
    window.history.back();
  }

  totalCountCreate() {
    const earningComponentList = this.ctcForm.get(
      'earningComponentList'
    ) as FormArray;
    const deductionArray = this.ctcForm.get(
      'deductionComponentList'
    ) as FormArray;
    const reiembursementComponentList = this.ctcForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    const variableearningComponentList = this.ctcForm.get(
      'variableearningComponentList'
    ) as FormArray;
    let data: any = {
      earningComponentList: earningComponentList?.value,
      deductionArray: deductionArray?.value,
      reiembursementComponentList: reiembursementComponentList?.value,
      variableearningComponentList: variableearningComponentList?.value,
    };

    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;

    let totalDeductionMonthlyCTC = 0;
    let totalDeductionAnnualCTC = 0;
    console.log(data, 'data?.allll<<<<<<<<<<<<<<<');
    console.log(deductionArray, 'deductionArray<<<<<<<<<<<');

    if (data?.earningComponentList?.length) {
      data?.earningComponentList?.forEach((item: any, index: number) => {
        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly)
            totalMonthlyCTC =
              totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.calculation_amount)
            totalAnnualCTC = totalAnnualCTC + Number(item?.calculation_amount);
        } else {
          if (item?.monthlyBasic)
            totalMonthlyCTC = totalMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic)
            totalAnnualCTC = totalAnnualCTC + Number(item?.annualBasic);
        }
      });
    }

    // ****************
    if (data?.deductionComponentList?.length || data?.deductionArray?.length) {
      let deductData = data?.deductionComponentList || data?.deductionArray;
      deductData?.forEach((item: any, index: number) => {
        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly)
            totalDeductionMonthlyCTC =
              totalDeductionMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual)
            totalDeductionAnnualCTC =
              totalDeductionAnnualCTC + Number(item?.fixedAllowanceAnnual);
        } else {
          if (item?.monthlyBasic)
            totalDeductionMonthlyCTC =
              totalDeductionMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic)
            totalDeductionAnnualCTC =
              totalDeductionAnnualCTC + Number(item?.annualBasic);
        }
      });
    }

    // ***********************
    if (data?.reiembursementComponentList?.length) {
      data?.reiembursementComponentList?.forEach((item: any, index: number) => {
        if (item?.fixedAllowanceMonthly)
          totalMonthlyCTC =
            totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
        if (item?.fixedAllowanceAnnual)
          totalAnnualCTC = totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
      });
    }
    // For variable Earning //
    if (data?.variableearningComponentList?.length) {
      data?.variableearningComponentList?.forEach(
        (item: any, index: number) => {
          if (item?.fixedAllowanceMonthly)
            totalMonthlyCTC =
              totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual)
            totalAnnualCTC =
              totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
        }
      );
    }

    console.log(totalDeductionMonthlyCTC);
    if (totalDeductionMonthlyCTC) {
      this.totalMonthlyCTC = totalMonthlyCTC - totalDeductionMonthlyCTC;
      this.totalAnnualCTC = totalAnnualCTC - totalDeductionAnnualCTC;
    } else {
      this.totalMonthlyCTC = totalMonthlyCTC;
      this.totalAnnualCTC = totalAnnualCTC;
    }
    this.calculateTotalCTC();
  }

  enterSalary(actionType: any) {
    console.log(this.ctcForm?.value, 'this.ctcForm?.value');

    let annualCTC = this.ctcForm?.value?.annualCTC;
    console.log(annualCTC, 'annualCTC');

    let annualCTCAll = annualCTC / 12;
    console.log(annualCTCAll, 'annualCTCAll');

    // let salary_per_day = annualCTCAll / 30;
    // let salary_per_hr = salary_per_day / 8;
    this.ctcForm?.patchValue({
      // salary_per_day: salary_per_day?.toFixed(2),
      // salary_per_hr: salary_per_hr?.toFixed(2),
      // basic_salary: annualCTCAll?.toFixed(2),
      monthlyCTC: annualCTCAll?.toFixed(2),
    });
  }
  calculateVariableEarningsTotal() {
    const variableearningArray = this.ctcForm.get(
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
