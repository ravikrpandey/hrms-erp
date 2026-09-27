import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { YearlyAssessmentService } from 'src/app/@shared/services/performance-management/yearly-assessment.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { IncentiveService } from '../incentive-service/incentive-service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-incentive',
  templateUrl: './create-incentive.html',
  styleUrls: ['./create-incentive.scss']
})
export class CreateIncentive {
  minEndDate: Date | null = null;
  incentiveForm!: FormGroup;
  yearlyAssessment: any = [];
  action: any;
  departments: any
  departmentdata: any[] = [];
  filteredDepartments: any[] = [];
  employeeName: any[] = [];
  departmentId: any[] = [];
  employeeNameData: any[] = [];
  dept_id: any = [];
  employee_id: any;
  EmployeeId: any = [];
  mainId: string | null;
  entity_id: string | null;
  id: any;
  actionType: any;
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

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private assessmentService: YearlyAssessmentService,
    private $miscellaneous: MiscellaneousService,
    private _commonService: CommonService,
    private _incentiveservice: IncentiveService,
    private toaster: ToastrService,
    private route: Router,
    private activetedRoute: ActivatedRoute,
  ) {
    this.employee_id = Number(localStorage.getItem('EmpMainId'));

    // Initialize form with conditional validators
    this.incentiveForm = this.fb.group({
      financial_year_id: new FormControl(null, [Validators.required]),
      incentive_type: new FormControl(null, [Validators.required]),
      plan_name: new FormControl(null, [Validators.required]),
      start_date: new FormControl(null, [Validators.required]),
      end_date: new FormControl(null, [Validators.required]),
      target_kpi: new FormControl(null, [Validators.required]),
      target_value: new FormControl(null, [Validators.required]),
      achieved_value: new FormControl(null, [Validators.required]),
      multiplier: new FormControl(null, [Validators.required]),
      payment_mode: new FormControl(null, [Validators.required]),
      frequency: new FormControl(null, [Validators.required]),
      // One-time fields - validators will be added conditionally
      payroll_financial_year_id: new FormControl(null),
      payroll_month: new FormControl(null),
      // Recurring fields - validators will be added conditionally
      recurring_payroll_fy_id: new FormControl(null),
      payroll_start_month: new FormControl(null),
      payroll_end_month: new FormControl(null),
      is_taxable: [false],
      is_active: [true],
      employee: new FormControl(null, [Validators.required]), // Changed from employee_id
      dept_id: new FormControl(null, [Validators.required]),
      remark: new FormControl(null),
    },
      { validators: this.dateRangeValidator }
    );
  }

  ngOnInit(): void {
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.id = params['id'];
      this.actionType = params['actionType'];
      if (params['entity_id']) {
        this.entity_id = params['entity_id'];
      }
      if (this.actionType === 'edit' && this.id || this.entity_id) {
        this.getAllIncentiveById();
      } else {
        // Only load departments for create mode
        this.getAllDepartmentData();
      }
      if (this.actionType === 'view') {
        this.incentiveForm.disable();
      }
    });

    this.getFinancialYear();
    this.getAllDepartmentData();
  }

  selectedDepartmentName(deptIds: any) {
    const selectedDeptIds = Array.isArray(deptIds) ? deptIds : [deptIds];
    this.dept_id = selectedDeptIds;

    console.log('🏢 Selected dept_ids:', selectedDeptIds);
    console.log('👥 All employees:', this.employeeName);

    // Filter employees matching any of the selected dept_ids
    this.departmentId = this.employeeName.filter((item: any) =>
      selectedDeptIds.includes(item.dept_id)
    );

    console.log('✅ Filtered employees for selected departments:', this.departmentId);

    this.employeeNameData = [];

    if (this.departmentId.length === 0) {
      console.log('⚠️ No employees found in the selected departments.');
      this.incentiveForm.patchValue({ employee: null });
      this.isAllSelect = false;
    } else {
      this.departmentId.forEach((employee: any) => {
        this.employeeNameData.push({
          first_name: employee.first_name,
          last_name: employee.last_name,
          employee_id: employee.employee_id,
        });
      });

      console.log('📋 Employee dropdown data:', this.employeeNameData);

      // Reset employee selection when department changes
      this.incentiveForm.patchValue({ employee: null });
    }
  }

  getAllDepartmentData() {
    const selectedEntityId = localStorage.getItem('selectedEntityId');
    this.assessmentService.getAllDepartmentData(selectedEntityId).subscribe(
      (res: any) => {
        this.departmentdata = res.data.departments;
        this.employeeName = res.data.employees;
        this.filteredDepartments = [...this.departmentdata];
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  filterDepartment(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!Array.isArray(this.departmentdata)) {
      console.error('departmentdata is not properly initialized');
      return;
    }
    if (!searchValue) {
      this.filteredDepartments = [...this.departmentdata];
      return;
    }
    this.filteredDepartments = this.departmentdata.filter((item: any) =>
      item.department_name?.toLowerCase().includes(searchValue)
    );
  }

  isAllSelect: boolean = false;
  isIndeterminate = false;

  selectAllEmployee(event: any) {
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      const allEmployeeIds = this.employeeNameData.map(
        (emp: any) => emp.employee_id
      );
      this.incentiveForm.patchValue({ employee: allEmployeeIds });
    } else {
      this.incentiveForm.patchValue({ employee: [] });
    }
  }

  checkIfAllSelected() {
    const selectedEmployees = this.incentiveForm.get('employee')?.value || [];
    this.isAllSelect = selectedEmployees.length === this.employeeNameData.length;
  }

  financialYearList: any = [];

  getFinancialYear() {
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        this.financialYearList = res?.data;
        this.financialYearList?.map((item: any) => item.financial_year = item?.financial_year)
      }
    });
  }

  onFrequencyTypeChange(frequencyValue: any) {
    // Clear all frequency-related validators first
    this.incentiveForm.get('payroll_financial_year_id')?.clearValidators();
    this.incentiveForm.get('payroll_month')?.clearValidators();
    this.incentiveForm.get('recurring_payroll_fy_id')?.clearValidators();
    this.incentiveForm.get('payroll_start_month')?.clearValidators();
    this.incentiveForm.get('payroll_end_month')?.clearValidators();

    // Reset values
    this.incentiveForm.patchValue({
      payroll_financial_year_id: null,
      payroll_month: null,
      recurring_payroll_fy_id: null,
      payroll_start_month: null,
      payroll_end_month: null
    });

    // Add validators based on frequency type
    if (frequencyValue == 1) { // One Time
      this.incentiveForm.get('payroll_financial_year_id')?.setValidators([Validators.required]);
      this.incentiveForm.get('payroll_month')?.setValidators([Validators.required]);
    } else if (frequencyValue == 2) { // Recurring
      this.incentiveForm.get('recurring_payroll_fy_id')?.setValidators([Validators.required]);
      this.incentiveForm.get('payroll_start_month')?.setValidators([Validators.required]);
      this.incentiveForm.get('payroll_end_month')?.setValidators([Validators.required]);
    }

    // Update validity
    this.incentiveForm.get('payroll_financial_year_id')?.updateValueAndValidity();
    this.incentiveForm.get('payroll_month')?.updateValueAndValidity();
    this.incentiveForm.get('recurring_payroll_fy_id')?.updateValueAndValidity();
    this.incentiveForm.get('payroll_start_month')?.updateValueAndValidity();
    this.incentiveForm.get('payroll_end_month')?.updateValueAndValidity();
  }
  getAllIncentiveById() {
    this._incentiveservice.getIncentiveById(this.entity_id, this.id).subscribe({
      next: (res: any) => {
        if (res && res.code === 200 && res.data?.length > 0) {
          const response = res.data[0];

          console.log('📥 API Response:', response);

          // Load departments first, then patch form
          this.loadDepartmentsAndPatchForm(response);

        }
      },
      error: (err) => {
        console.error("❌ Error fetching incentive:", err);
        this.toaster.error('Failed to load incentive data', 'Error');
      }
    });
  }

  // New helper method for loading departments and patching
  loadDepartmentsAndPatchForm(response: any) {
    const selectedEntityId = localStorage.getItem('selectedEntityId');

    this.assessmentService.getAllDepartmentData(selectedEntityId).subscribe({
      next: (res: any) => {
        this.departmentdata = res.data.departments;
        this.employeeName = res.data.employees;
        this.filteredDepartments = [...this.departmentdata];

        // Now that departments are loaded, patch the form
        if (response.dept_id) {
          // Handle both single dept_id and array of dept_ids
          const deptIds = Array.isArray(response.dept_id)
            ? response.dept_id
            : [response.dept_id];

          // Trigger department selection to load employees
          this.selectedDepartmentName(deptIds);

          // Build patch data
          const patchData: any = {
            financial_year_id: response.financial_year_id,
            incentive_type: response.incentive_type,
            plan_name: response.plan_name,
            start_date: response.start_date ? new Date(response.start_date) : null,
            end_date: response.end_date ? new Date(response.end_date) : null,
            target_kpi: response.target_kpi,
            target_value: response.target_value,
            achieved_value: response.achieved_value,
            multiplier: response.multiplier,
            payment_mode: response.payment_mode,
            frequency: Number(response.frequency),
            is_taxable: !!response.is_taxable,
            remark: response.remark || '',
            employee: response.employee_id,
            dept_id: deptIds
          };

          // Add frequency-specific fields
          if (response.frequency == 1) {
            patchData.payroll_financial_year_id = response.payroll_financial_year_id;
            patchData.payroll_month = response.payroll_month;
          } else if (response.frequency == 2) {
            patchData.recurring_payroll_fy_id = response.recurring_payroll_fy_id;
            patchData.payroll_start_month = response.payroll_start_month;
            patchData.payroll_end_month = response.payroll_end_month;
          }

          console.log('✅ Patch Data:', patchData);
          this.incentiveForm.patchValue(patchData);

          // Set minEndDate for validation
          if (response.start_date) {
            this.minEndDate = new Date(response.start_date);
          }

          console.log('📋 Form After Patch:', this.incentiveForm.value);
        }
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
        this.toaster.error('Failed to load department data', 'Error');
      }
    });
  }
  onSubmitForm() {
    // Mark all fields as touched to show validation errors
    Object.keys(this.incentiveForm.controls).forEach(key => {
      this.incentiveForm.get(key)?.markAsTouched();
    });

    if (this.incentiveForm.invalid) {
      this.toaster.error('Please fill all required fields', 'Validation Error');
      console.log('Form errors:', this.getFormValidationErrors());
      return;
    }

    this._commonService?.showLoader();

    const val = this.incentiveForm.value;

    console.log('📋 Form Values:', val);
    console.log('🔍 Employee Value:', val.employee);
    console.log('🔍 Department Value:', val.dept_id);

    // Build payload with proper field mapping
    const payload: any = {
      entity_id: Number(this.entity_id),
      financial_year_id: val.financial_year_id,
      incentive_type: val.incentive_type,
      plan_name: val.plan_name,
      start_date: val.start_date ? new Date(val.start_date).toISOString() : null,
      end_date: val.end_date ? new Date(val.end_date).toISOString() : null,
      target_kpi: val.target_kpi,
      target_value: Number(val.target_value),
      achieved_value: Number(val.achieved_value),
      multiplier: Number(val.multiplier),
      payment_mode: val.payment_mode,
      frequency: Number(val.frequency),
      is_taxable: val.is_taxable || false,
      remark: val.remark || '',
    };

    // Handle employee_id - check if it should be array or single value
    // Based on your HTML, it looks like single select
    if (val.employee) {
      payload.employee_id = val.employee; // Single employee ID
    } else {
      payload.employee_id = null;
    }

    // Add frequency-specific fields
    if (val.frequency == 1) { // One Time
      payload.payroll_financial_year_id = val.payroll_financial_year_id;
      payload.payroll_month = val.payroll_month;
      // Don't include recurring fields
    } else if (val.frequency == 2) { // Recurring
      payload.recurring_payroll_fy_id = val.recurring_payroll_fy_id;
      payload.payroll_start_month = val.payroll_start_month;
      payload.payroll_end_month = val.payroll_end_month;
      // Don't include one-time fields
    }

    // Add ID for update
    if (this.id) {
      payload.id = this.id;
    }

    console.log('✅ Final Payload:', JSON.stringify(payload, null, 2));
    console.log('🔍 Payload Keys:', Object.keys(payload));
    console.log('🔍 Null/Undefined values:', Object.entries(payload).filter(([k, v]) => v === null || v === undefined));

    // Call API
    this._incentiveservice.createIncentive(payload).subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        this.toaster.success(
          this.id ? 'Incentive updated successfully' : 'Incentive created successfully',
          'Success'
        );
        this.goBack();
      },
      (err) => {
        this._commonService?.hideLoader();
        console.error('❌ Full API Error:', err);
        console.error('❌ Error Response:', err.error);
        console.error('❌ Error Status:', err.status);

        if (err.error?.message) {
          this.toaster.error(err.error.message, 'Error');
        } else if (err.error?.code === 403) {
          this.toaster.error('Access denied', 'Error');
        } else {
          this.toaster.error('Something went wrong, please try again', 'Error');
        }
      }
    );
  }

  // Helper method to debug form validation errors
  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.incentiveForm.controls).forEach(key => {
      const controlErrors = this.incentiveForm.get(key)?.errors;
      if (controlErrors) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }

  goBack(): void {
    this.location.back();
  }

  back() {
    history.back();
  }

  onCheckboxChange(event: any): void {
    // Just update the is_taxable value, no need for amount_type
    this.incentiveForm.patchValue({
      is_taxable: event.checked
    });
  }

  isAllSelectMonth: boolean = false;
  selectedMonth: any;

  selectAllMOnth(event: any): void {
    let checked = event?.target?.checked;
    if (checked) {
      this.selectedMonth = this.monthList.map((emp: { value: any; }) => emp.value);
    } else {
      this.selectedMonth = [];
    }
    this.isAllSelectMonth = checked;
  }
  onStartDateChange(event: any): void {
    const startDate = event.value;
    this.minEndDate = startDate; // restrict end date to be same or after start date

    const endDate = this.incentiveForm.get('end_date')?.value;
    if (endDate && new Date(endDate) < new Date(startDate)) {
      this.incentiveForm.get('end_date')?.setValue(null);
    }
  }

  // custom validator for date range
  dateRangeValidator(formGroup: FormGroup) {
    const start = formGroup.get('start_date')?.value;
    const end = formGroup.get('end_date')?.value;

    if (start && end && new Date(end) < new Date(start)) {
      formGroup.get('end_date')?.setErrors({ invalidEndDate: true });
    } else {
      return null;
    }
    return null;
  }
}