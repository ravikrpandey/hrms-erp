import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-apply-loan-create',
  templateUrl: './advance-payment-create.html',
  styleUrls: ['./advance-payment-create.scss']
})
export class AdvancePaymentCreate {
  bonusDeductionForm: FormGroup;
  id: any;
  actionType: any;
  parm: any;
  isAllSelectDepartment: boolean = false;
  isOneTimeSelected: boolean = false;
  selectedMonths: number[] = [];
  teammateEmpIdFromApi: number | null = null;
  monthList = [
    { "value": 1, "label": "January" },
    { "value": 2, "label": "February" },
    { "value": 3, "label": "March" },
    { "value": 4, "label": "April" },
    { "value": 5, "label": "May" },
    { "value": 6, "label": "June" },
    { "value": 7, "label": "July" },
    { "value": 8, "label": "August" },
    { "value": 9, "label": "September" },
    { "value": 10, "label": "October" },
    { "value": 11, "label": "November" },
    { "value": 12, "label": "December" }
  ];
  mainId: string | null;
  entity_id: string | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private $common: CommonService,
    private toast: ToastrService,
    private location: Location,
    private _commonService: CommonService,
    private _empRegistration: EmpRegistrationService,
    private _hrmkpaService: HrmServiceService,
    private $miscellaneous: MiscellaneousService
  ) {
    this.bonusDeductionForm = this.fb.group({
      financial_year_id: [null, Validators.required],
      disbursal_month: [null, Validators.required],
      department_list: [null, Validators.required],
      employee_ids: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      payroll_adjustment_type: [null, Validators.required],
      adjustments: this.fb.array([this.createAdjustment()]),
      allotment_type: [null],
      total_adjustment_amount: [{ value: 0, disabled: true }],
      advanceFor: ['ME', Validators.required],
    });
  }

  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.id = params['id'];
      this.actionType = params['actionType'];
      if (this.actionType === 'edit' && this.id) {
        this.getadvancepaymentById(this.id);
      }

      if (this.actionType === 'view' && this.id) {
        this.getadvancepaymentById(this.id, true);
      }
    });
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.getAllDepartment_dropDown();
    this.getFinancialYear();

    this.bonusDeductionForm.get('amount')?.valueChanges.subscribe((amount: number) => {
      const payrollAdjustmentType = this.bonusDeductionForm.get('payroll_adjustment_type')?.value;
      const allotmentType = this.bonusDeductionForm.get('allotment_type')?.value;

      if (payrollAdjustmentType === 1) {
        if (this.adjustments.length > 0) {
          this.adjustments.at(0).get('amount')?.setValue(amount);
        }
      } else if (payrollAdjustmentType === 2 && allotmentType === 1) {
        this.onAllotmentTypeChange(1);
      }
    });
    this.bonusDeductionForm.valueChanges.subscribe(() => {
      this.checkAmountMatch();
    });
    this.bonusDeductionForm.get('advanceFor')?.valueChanges.subscribe((value) => {
      this.toggleDepartmentField(value);
    });

    this.bonusDeductionForm.get('advanceFor')?.valueChanges.subscribe((value) => {
      this.toggleDepartmentField(value);
      this.toggleFieldsBasedOnAdvanceFor(value);

      // 🧠 Reload employee list when switching between Me/Teammate
      const deptId = this.bonusDeductionForm.get('department_list')?.value;
      if (deptId) {
        this.getEmployeesByDepartment(deptId);
      }
    });
    // Call once on init to set correct state if patched from API
    this.toggleFieldsBasedOnAdvanceFor(this.bonusDeductionForm.get('advanceFor')?.value);
    const savedEmpId = localStorage.getItem('EmpMainId');
    // if (savedEmpId) {
    //   this.currentEmpId = Number(savedEmpId);
    // }


  }
  toggleFieldsBasedOnAdvanceFor(advanceForValue: string) {
    const deptControl = this.bonusDeductionForm.get('department_list');
    const empControl = this.bonusDeductionForm.get('employee_ids');

    if (advanceForValue === 'ME') {
      deptControl?.disable({ emitEvent: false });
      empControl?.disable({ emitEvent: false });

      // Auto-select current employee
      const empId = Number(localStorage.getItem('EmpMainId'));
      if (empId) {
        empControl?.setValue(empId, { emitEvent: false });
      }

    } else if (advanceForValue === 'TEAMMATE') {
      deptControl?.enable({ emitEvent: false });
      empControl?.enable({ emitEvent: false });

      // ✅ Restore teammate employee from API if available
      if (this.teammateEmpIdFromApi) {
        empControl?.setValue(this.teammateEmpIdFromApi, { emitEvent: false });
      }
    }
  }


  toggleDepartmentField(advanceForValue: string) {
    const deptControl = this.bonusDeductionForm.get('department_list');
    if (advanceForValue === 'ME') {
      deptControl?.disable({ emitEvent: false });
    } else {
      deptControl?.enable({ emitEvent: false });
    }
  }
  get adjustments(): FormArray {
    return this.bonusDeductionForm.get('adjustments') as FormArray;
  }

  createAdjustment(): FormGroup {
    return this.fb.group({
      year: ['', Validators.required],
      month: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]]
    });
  }
  // Updated onAllotmentTypeChange method
  onAllotmentTypeChange(allotmentType: number) {
    const totalAmount = this.bonusDeductionForm.get('amount')?.value || 0;

    if (allotmentType === 1) {
      // Divide Equally logic: distribute totalAmount equally among all adjustment rows
      const rowsCount = this.adjustments.length;
      if (rowsCount > 0) {
        const equalAmount = +(totalAmount / rowsCount).toFixed(2);

        this.adjustments.controls.forEach((control, idx) => {
          control.get('amount')?.setValue(equalAmount);
        });

        // If there's rounding difference, adjust the last row
        const sumOfAll = this.getTotalAmount();
        if (sumOfAll !== totalAmount) {
          const diff = +(totalAmount - sumOfAll).toFixed(2);
          const lastControl = this.adjustments.at(rowsCount - 1);
          const lastAmount = lastControl.get('amount')?.value || 0;
          lastControl.get('amount')?.setValue(+(lastAmount + diff).toFixed(2));
        }
      }
    } else if (allotmentType === 2) {
      // Divide Manually: clear all amounts to allow manual input
      this.adjustments.controls.forEach((control) => {
        control.get('amount')?.setValue(0);
      });
    }
  }

  onPayrollAdjustmentTypeChange(value: number): void {
    this.adjustments.clear();

    if (value === 1) {
      this.isOneTimeSelected = true;

      // Remove allotment_type validator
      this.bonusDeductionForm.get('allotment_type')?.clearValidators();
      this.bonusDeductionForm.get('allotment_type')?.updateValueAndValidity();

      this.adjustments.push(this.createAdjustment());

      const amount = this.bonusDeductionForm.get('amount')?.value;
      if (amount !== null && amount !== undefined) {
        this.adjustments.at(0).get('amount')?.setValue(amount);
      }
    } else if (value === 2) {
      this.isOneTimeSelected = false;

      // Add allotment_type validator
      this.bonusDeductionForm.get('allotment_type')?.setValidators(Validators.required);
      this.bonusDeductionForm.get('allotment_type')?.updateValueAndValidity();

      this.adjustments.push(this.createAdjustment());
      this.adjustments.push(this.createAdjustment());

      const currentAllotmentType = this.bonusDeductionForm.get('allotment_type')?.value;
      if (currentAllotmentType === 1) {
        this.onAllotmentTypeChange(1);
      } else if (currentAllotmentType === 2) {
        this.onAllotmentTypeChange(2);
      }
    }
  }

  getTotalAmount(): number {
    return this.adjustments.controls.reduce((sum, group) => {
      const amount = group.get('amount')?.value || 0;
      return sum + Number(amount);
    }, 0);
  }

  // Updated addItem method
  addItem() {
    this.adjustments.push(this.createAdjustment());

    // Only auto-divide if allotment type is "Divide Equally"
    const allotmentType = this.bonusDeductionForm.get('allotment_type')?.value;
    if (allotmentType === 1) {
      this.onAllotmentTypeChange(1);
    }
  }

  // Updated removeItem method
  removeItem(index: number) {
    this.adjustments.removeAt(index);

    // Only auto-divide if allotment type is "Divide Equally"
    const allotmentType = this.bonusDeductionForm.get('allotment_type')?.value;
    if (allotmentType === 1) {
      this.onAllotmentTypeChange(1);
    }
  }
  goBack() {
    this.location.back();
  }
  back() {
    history.back()
  }

  // Updated getadvancepaymentById function (only the relevant part)
  getadvancepaymentById(id: any, disableForm: boolean = false) {
    this._configurationalMasterService.getadvancepaymentById(id).subscribe((res) => {
      if (res && res.data) {
        const response = res.data;

        if (response.advance_for === 'TEAMMATE') {
          this.teammateEmpIdFromApi = response.employee_id;
        }

        const deptControl = this.bonusDeductionForm.get('department_list');
        const empControl = this.bonusDeductionForm.get('employee_ids');

        deptControl?.enable({ emitEvent: false });
        empControl?.enable({ emitEvent: false });

        // Load employees FIRST, then patch form
        this._hrmkpaService.getemployeeById(response?.department_id).subscribe((empRes: any) => {
          if (empRes && empRes.data) {
            this.employees = empRes.data;
            this.employeeList = empRes.data;
            this.employeeList2 = empRes.data;
            // Now patch the form
            this.bonusDeductionForm.patchValue({
              financial_year_id: response?.financial_year_id,
              disbursal_month: response?.month,
              department_list: response?.department_id,
              advanceFor: response.advance_for,
              employee_ids: response?.employee_id,
              amount: Number(response?.amount),
              total_adjustment_amount: Number(response?.total_adjustment_amount),
            }, { emitEvent: false });

            // Apply correct disabled state
            if (response.advance_for === 'ME') {
              deptControl?.disable({ emitEvent: false });
              empControl?.disable({ emitEvent: false });
            } else if (response.advance_for === 'TEAMMATE') {
              deptControl?.enable({ emitEvent: false });
              empControl?.enable({ emitEvent: false });
            }

            // Patch payroll adjustment type
            if (response.payroll_adjustment_type === "One Time") {
              this.bonusDeductionForm.get('payroll_adjustment_type')?.setValue(1);
            } else if (response.payroll_adjustment_type === "Multiple Time") {
              this.bonusDeductionForm.get('payroll_adjustment_type')?.setValue(2);
            }

            // Patch allotment type
            if (response.allotment_type === "1" || response.allotment_type === 1) {
              this.bonusDeductionForm.get('allotment_type')?.setValue(1);
            } else if (response.allotment_type === "2" || response.allotment_type === 2) {
              this.bonusDeductionForm.get('allotment_type')?.setValue(2);
            }

            // Clear and rebuild adjustments
            this.adjustments.clear();


            if (response.payroll_adjustment_type === "One Time") {
              if (response.adjustments && response.adjustments.length > 0) {
                // Use the first adjustment for One Time
                const adj = response.adjustments[0];
                const adjGroup = this.fb.group({
                  year: [adj.year, Validators.required],
                  month: [adj.month, Validators.required],
                  amount: [Number(adj.amount), [Validators.required, Validators.min(1)]]
                });
                this.adjustments.push(adjGroup);

                // Patch top-level controls for UI if needed
                this.bonusDeductionForm.patchValue({
                  payroll_adjustment_year: adj.year,
                  payroll_adjustment_month: adj.month
                }, { emitEvent: false });
              }
            }
            else if (response.payroll_adjustment_type === "Multiple Time") {
              // ✅ For Multiple Time, each adjustment has its own year
              if (response.adjustments && Array.isArray(response.adjustments) && response.adjustments.length > 0) {
                response.adjustments.forEach((adj: any, index: number) => {
                  console.log(`✅ Adjustment ${index + 1} year:`, adj.year);

                  const adjGroup = this.fb.group({
                    year: [adj.year, Validators.required], // ✅ Each adjustment keeps its own year
                    month: [adj.month, Validators.required],
                    amount: [adj.amount, [Validators.required, Validators.min(1)]]
                  });
                  this.adjustments.push(adjGroup);
                });
              } else {
                // Fallback if no adjustments array
                this.adjustments.push(this.createAdjustment());
                this.adjustments.push(this.createAdjustment());
              }
            }
            this.checkAmountMatch();

            if (disableForm) {
              this.bonusDeductionForm.disable({ emitEvent: false });
            }
          }
        });
      }
    });
  }

  getFormValidationErrors(formGroup: FormGroup, parentKey: string = ''): string[] {
    let invalidFields: string[] = [];

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        invalidFields = invalidFields.concat(this.getFormValidationErrors(control, key));
      } else if (control && control.invalid) {
        const fieldName = parentKey ? `${parentKey}.${key}` : key;
        invalidFields.push(fieldName);
      }
    });

    return invalidFields;
  }

  onSubmitForm() {
    if (this.bonusDeductionForm.invalid) {
      this.bonusDeductionForm.markAllAsTouched();
      const invalidFields = this.getFormValidationErrors(this.bonusDeductionForm);
      if (invalidFields.length > 0) {
        this.toast.error(
          `Required fields missing: ${invalidFields.join(', ')}`,
          'Validation Error'
        );
      } else {
        this.toast.error('Required fields should not be blank', 'Validation Error');
      }
      return;
    }
    const advanceAmount = this.bonusDeductionForm.get('amount')?.value;
    const totalAdjustmentAmount = this.getTotalAmount();
    if (advanceAmount !== totalAdjustmentAmount) {
      this.toast.error('Error: Advance Amount does not match the total of adjustment amounts.');
      return;
    }

    let val: any = { ...this.bonusDeductionForm.getRawValue() };
    val.month = val.disbursal_month

    // Backend expects a single employee_id (not array)
    val.employee_id = Array.isArray(val.employee_ids) ? val.employee_ids[0] : val.employee_ids;
    delete val.employee_ids;

    // Backend expects a single department_id (not array)
    val.department_id = Array.isArray(val.department_list) ? val.department_list[0] : val.department_list;
    delete val.department_list;

    // 🔹 Add department_name from dropdown list
    const deptObj = this.getAllDepartment?.find((d: any) => d.dept_id == val.department_id);
    val.department_name = deptObj ? deptObj.department_name : '';

    // 🔹 Add employee_name from employee list
    const empObj = this.employeeList?.find((e: any) => e.employee_id == val.employee_id);
    val.employee_name = empObj ? `${empObj.first_name} ${empObj.middle_name || ''} ${empObj.last_name}`.trim() : '';

    // Convert payroll_adjustment_type into string ("One Time" / "Multiple Time")
    if (val.payroll_adjustment_type === 1) {
      val.payroll_adjustment_type = "One Time";
      delete val.allotment_type; // backend doesn't want null
    } else if (val.payroll_adjustment_type === 2) {
      val.payroll_adjustment_type = "Multiple Time";
    }

    // 🔹 Add financial_year from financial year list
    const financialYearObj = this.financialYearList?.find((f: any) => f.id == val.financial_year_id);
    val.financial_year = financialYearObj ? financialYearObj.financial_year : '';

    // Add extra required fields
    val.entity_id = this.entity_id;
    val.created_by = this.mainId;
    val.status = "ACTIVE";

    if (this.id) {
      val.id = this.id;
    }

    console.log("Submitting payload:", val);

    this._commonService?.showLoader();
    this._configurationalMasterService.create_advancepayment(val).subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        this.toast.success(this.id ? 'Updated Advance Payments successfully' : 'Created Advance Payments successfully', 'Success');
        this.goBack();
      },
      (err) => {
        this._commonService?.hideLoader();
        if (err.error.code === 403) {
          this.toast.error(`${err.error.message}`, 'Error');
        } else {
          this.toast.error('Something went wrong please try again', 'Error');
        }
      }
    );
  }

  // Department
  getAllDepartment: any;
  getAllDepartment2: any = [];
  departments: any = [];

  getAllDepartment_dropDown() {
    this._empRegistration.getAllDepartment_dropDown(this.entity_id).subscribe((res: any) => {
      if (res?.data) {
        this.getAllDepartment = res.data;
        this.getAllDepartment2 = res.data;

        const type = this.bonusDeductionForm.get('advanceFor')?.value;

        if (type === 'ME') {
          const savedDeptId = localStorage.getItem('department_id');
          if (savedDeptId) {
            const deptIdNum = Number(savedDeptId);
            const deptExists = this.getAllDepartment.some((d: any) => d.dept_id === deptIdNum);

            if (deptExists) {
              this.bonusDeductionForm.patchValue({
                department_list: deptIdNum
              });
              this.getEmployeesByDepartment(deptIdNum);
            }
          }
        }
      }
    }, err => {
      this.toast.error(err?.error?.message || 'Failed to load departments');
    });
  }


  getEmployeesByDepartment(deptId: number) {
    this._hrmkpaService.getemployeeById(deptId).subscribe(
      (res: any) => {
        if (res && res.data) {
          let allEmployees = res.data;
          const type = this.bonusDeductionForm.get('advanceFor')?.value;
          const savedEmpId = Number(localStorage.getItem('EmpMainId'));

          if (type === "TEAMMATE") {
            // Filter out logged-in employee
            allEmployees = allEmployees.filter(
              (e: any) => e.employee_id !== savedEmpId
            );

            // Optionally, auto-select first teammate
            if (allEmployees.length > 0) {
              this.bonusDeductionForm.patchValue({
                employee_ids: allEmployees[0].employee_id
              }, { emitEvent: false });
            } else {
              this.bonusDeductionForm.patchValue({
                employee_ids: null
              }, { emitEvent: false });
            }
          } else if (type === "ME") {
            // Auto-select logged-in employee
            if (savedEmpId && allEmployees.some((e: any) => e.employee_id === savedEmpId)) {
              this.bonusDeductionForm.patchValue({
                employee_ids: savedEmpId,
              }, { emitEvent: false });
            }
          }

          // Update employee list
          this.employees = allEmployees;
          this.employeeList = allEmployees;
          this.employeeList2 = allEmployees;
        }
      },
      (err) => {
        this.toast.error(err?.error?.message || 'Failed to load employees');
        this.employees = [];
        this.employeeList = [];
        this.bonusDeductionForm.get('employee_ids')?.setValue(null);
      }
    );
  }

  getEmployeesByDepartmentForTeam(deptId: number) {
    this._hrmkpaService.getemployeeById(deptId).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.employees = res.data;
          this.employeeList = res.data;
          this.employeeList2 = res.data;

          // Patch employee_ids only if API has a saved value for this department
          const currentEmpId = this.teammateEmpIdFromApi;

          if (currentEmpId && this.employees.some((e: { employee_id: number; }) => e.employee_id === currentEmpId)) {
            this.bonusDeductionForm.get('employee_ids')?.setValue(currentEmpId, { emitEvent: false });
          } else {
            // Reset if no valid employee in this department
            this.bonusDeductionForm.get('employee_ids')?.setValue(null, { emitEvent: false });
          }
        } else {
          this.employees = [];
          this.employeeList = [];
          this.bonusDeductionForm.get('employee_ids')?.setValue(null, { emitEvent: false });
        }
      },
      err => {
        this.toast.error(err?.error?.message || 'Failed to load employees');
        this.employees = [];
        this.employeeList = [];
        this.bonusDeductionForm.get('employee_ids')?.setValue(null, { emitEvent: false });
      }
    );
  }

  departmentSearch(e: any) {
    const aa = e
    let filteredVariable = this.getAllDepartment2.filter((item: any) => aa.includes(item.department_name));
    this.getAllDepartment = filteredVariable
  }

  // get all employee
  employeeListName: string;
  kpaEmp: any;
  employeeList: any = [];
  employeeList2: any;
  employees: any;
  employeeNameList: any;
  selectedEmployee: any;
  selectedDepartment: any;
  disableField: boolean = false;

  getAllArea(deptId: any) {
    this._hrmkpaService.getemployeeById(deptId).subscribe((res: any) => {
      if (res && res.data) {
        this.employeeList = res.data;
        this.employeeList2 = res.data;
        this.employees = res.data;
      }
    }, err => {
      this.toast.error(err?.error?.message || 'Failed to load employees');
      this.employeeList = [];
      this.employees = [];
      this.bonusDeductionForm.get('employee_ids')?.setValue(null);
    });
  }
  getEmp = (empList: any) => {
    this.employeeListName = ""
    empList.forEach((empName: any) => {
      this.kpaEmp.forEach((empId: any) => {
        if (empId.employee_id == empName.employee_id) {
          this.employeeListName += empName.first_name + " " + empName.last_name + ",";
        }
      })
    })

    if (this.employeeListName.length >= 2) {
      this.employeeListName = this.employeeListName.slice(0, -1)
    }
  }

  employeeSearch(e: any) {
    const aa = e
    let filteredVariable = this.employeeList2.filter((item: any) => aa.includes(`${item.first_name} ${item?.middle_name || ''} ${item.last_name} ${item?.employee_code}`));
    this.employeeList = filteredVariable
  }
  isAllSelect: boolean = false;
  selectAllEmployee(event: any): void {

    let checked = event?.target?.checked;

    if (checked) {
      this.selectedEmployee = this.employeeList.map((emp: { employee_id: any; }) => emp.employee_id);
    } else {
      this.selectedEmployee = [];
    }
    this.isAllSelect = checked;

  }
  selectAllDepartment(event: any): void {
    let checked = event?.target?.checked;

    if (checked) {
      this.selectedDepartment = this.getAllDepartment.map((emp: { dept_id: any; }) => emp.dept_id);
    } else {
      this.selectedDepartment = [];
    }
    this.isAllSelectDepartment = checked;
    this.getAllArea(this.selectedDepartment)
  }

  // Financ year get start
  financialYearList: any = [];
  getFinancialYear() {

    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        this.financialYearList = res?.data;
        this.financialYearList?.map((item: any) => item.financial_year = item?.financial_year)
      }
    }
    )
  }

  blinkActive: boolean = false;
  blinkTimeout: any;

  checkAmountMatch(): void {
    const amount = this.bonusDeductionForm.get('amount')?.value;
    const total = this.getTotalAmount();

    // 🔹 Always patch total to form control
    this.bonusDeductionForm.get('total_adjustment_amount')?.setValue(total, { emitEvent: false });

    const payrollAdjustmentType = this.bonusDeductionForm.get('payroll_adjustment_type')?.value;
    const allotmentType = this.bonusDeductionForm.get('allotment_type')?.value;

    const shouldBlink = payrollAdjustmentType === 2 && allotmentType === 2 && amount === total;

    if (shouldBlink && !this.blinkActive) {
      this.blinkActive = true;
      if (this.blinkTimeout) clearTimeout(this.blinkTimeout);
      this.blinkTimeout = setTimeout(() => {
        this.blinkActive = false;
      }, 3000);
    } else if (!shouldBlink) {
      this.blinkActive = false;
      if (this.blinkTimeout) clearTimeout(this.blinkTimeout);
    }
  }

  // When month changes
  onMonthChange(month: number, index: number): void {
    // Update selectedMonths list
    this.selectedMonths = this.adjustments.controls
      .map((control: any) => control.get('month')?.value)
      .filter((val: number) => val); // keep only valid months
  }

  isMonthDisabled(month: number, index: number): boolean {
    const currentYear = this.adjustments.at(index).get('year')?.value;
    if (!currentYear) return false;

    return this.adjustments.controls.some((control, idx) => {
      if (idx === index) return false;
      return control.get('year')?.value === currentYear &&
        control.get('month')?.value === month;
    });
  }

}

