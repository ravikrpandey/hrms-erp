import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { HttpClient } from '@angular/common/http';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-tax-slab-create',
  templateUrl: './variable-earning-create.component.html',
  styleUrls: ['./variable-earning-create.component.scss']
})
export class VariableEarningCreateComponent {
  @ViewChild('filterInput') filterInput!: ElementRef;
  selectedYear: any;
  gridApi!: GridApi;
  selectedEmployee: any[] = [];
  departmentdata: any[] = [];
  filterDepartment: any[] = [];
  dept_id: any[] = [];
  rowClass = '';
  selectedYearId: number | null = null;
  employeeList: any[] = [];
  filteredEmployees: any[] = [];
  isAllDepartmentSelected = false;
  isAllEmployeeSelected = false;
  entity_id: any;
  rowData: any[] = [];
  financialYearList: any[] = [];
  exportToExceldata: any;
  columnDefs: any;
  entityData: any;
  componentName: string = '';
  variableearningComponentList: any[] = [];
  componentAmount: number | null = null;
  id: any = null;
  isViewMode = false;
  isEditMode = false;
  creditType: 'oneTime' | 'multiple' | null = null;
  creditRows: { year: number | null, month: number | null, amount: number | null }[] = [];
  monthList: any[] = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  selectedMonths: number[] = [];
  allotmentType: 'divideEqually' | 'enterManually' | null = null;


  constructor(
    private toaster: ToastrService,
    private $miscellaneous: MiscellaneousService,
    private http: HttpClient,
    private entityService: EntityMasterService,
    private services: AttendanceService,
    private payrollService: PayrollService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const currentDate = new Date();
    this.selectedYear = currentDate.getFullYear();
    this.getFinancialYear();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getDepartments();

    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'] || null;
      const mode = params['Type']; // "edit" or "view"

      if (this.id) {
        this.getVariableEarningById(this.id, mode);
      }
    });
  }



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  makeFormReadOnly() {
    setTimeout(() => {
      const inputs = document.querySelectorAll('input, select, textarea, mat-select, button');
      inputs.forEach((el: any) => {
        el.setAttribute('disabled', 'true');
      });
    }, 100);
  }

  getDepartments() {
    this.services.getAllActDeptForReports(this.entity_id).subscribe(
      (res: any) => {
        this.departmentdata = res.data || [];
        this.filterDepartment = [...this.departmentdata];
      },
      (err: any) => {
        this.toaster.error('Failed to load departments');
      }
    );
  }
  getVariableEarningById(id: number, mode: string) {
    this.payrollService.getVariableEarningById(id).subscribe({
      next: (res: any) => {
        if (res?.data) {
          const data = res.data;

          // patch your variables
          this.selectedYearId = data.financial_id;
          this.entity_id = data.entity_id;
          this.componentName = data.approve_salary_percentage;
          this.componentAmount = data.approve_salary_amount;

          //  Patch employee & department
          this.selectedEmployee = data.employee_id;   // for mat-select binding
          this.dept_id = [data.HRMS_REGISTERED_USER?.department_id];

          //  Ensure employee is in list
          this.employeeList = [{
            employee_id: data.employee_id,
            full_name: data.full_name
          }];
          this.filteredEmployees = [...this.employeeList];

          //  Ensure department is in list
          this.departmentdata = [{
            dept_id: data.HRMS_REGISTERED_USER?.department_id,
            department_name: data.HRMS_REGISTERED_USER?.MASTER_DEPARTMENT?.department_name
          }];
          this.filterDepartment = [...this.departmentdata];

          this.variableearningComponentList = data.variable_component_details?.map((item: any) => ({
            componentName: item.component_name,
            fixedAllowanceAnnual: Number(item.annual_amount)
          })) || [];

          this.creditType = data.credit_type;
          this.allotmentType = data.allotment_type;

          if (data.credit_type === 'oneTime') {
            // one-time allotment → no year field
            this.creditRows = data.credit_allotment_details?.map((row: any) => ({
              year: row.year,
              month: row.month,
              amount: row.amount ?? this.componentAmount
            })) || [
                { month: null, amount: this.componentAmount }
              ];
          } else {
            // multiple allotment → year + month
            this.creditRows = data.credit_allotment_details?.map((row: any) => ({
              year: row.year,
              month: row.month,
              amount: row.amount
            })) || [];
          }


          if (mode === 'view') {
            this.isViewMode = true;
          }
          else if (mode === 'edit') {
            this.isEditMode = true;
          }
        }
      },
      error: (err: any) => {
        this.toaster.error(err.error?.message || 'Failed to fetch record');
      }
    });
  }



  getVariableEarningComponents(employeeIds: number[]): void {
    if (!employeeIds || employeeIds.length === 0) {
      this.variableearningComponentList = [];
      return;
    }
    const payload = { employee_ids: employeeIds };
    this.entityService.getAllVarEarning(payload).subscribe(
      (res: any) => {
        if (res?.data?.length) {
          this.variableearningComponentList = res.data[0].variableearningComponentList || [];
        } else {
          this.variableearningComponentList = [];
        }
      },
      (err: any) => {
        console.error("Error fetching components:", err);
        this.toaster.error(err.error?.message || 'Failed to load variable earning components');
      }
    );

  }
  onEmployeeChange(employeeId: number) {
    if (employeeId) {
      this.getVariableEarningComponents([employeeId]); // pass as array since API expects array
    } else {
      this.variableearningComponentList = [];
    }
  }

  getAllEmployeesBySelectedDepartments(deptIds: number[]) {
    if (!deptIds || deptIds.length === 0) {
      this.employeeList = [];
      this.filteredEmployees = [];
      return;
    }

    const payload = { deptIds };

    this.entityService.getAllEmployeeByVarEarning(payload).subscribe(
      (res: any) => {
        this.employeeList = res.data || [];
        this.filteredEmployees = [...this.employeeList];
        this.selectedEmployee = [];
        this.isAllEmployeeSelected = false;
      },
      (err: any) => {
        console.log("---------->", err);
        this.toaster.error(err.error.message || 'Failed to load employees');
      }
    );
  }

  get selectedMonthLabels(): string {
    if (!this.selectedMonths || this.selectedMonths.length === 0) {
      return 'Select months';
    }
    return this.monthList
      .filter(m => this.selectedMonths.includes(m.value))
      .map(m => m.label)
      .join(', ');
  }

  onCreditTypeChange(type: 'oneTime' | 'multiple') {
    this.creditType = type;

    if (type === 'oneTime') {
      this.creditRows = [
        { year: null, month: null, amount: this.componentAmount }
      ];
    } else if (type === 'multiple') {
      this.creditRows = [
        { year: null, month: null, amount: this.componentAmount },
        { year: null, month: null, amount: this.componentAmount }
      ];
    }
  }


isMonthDisabled(month: string, rowIndex: number): boolean {
  const row = this.creditRows[rowIndex];
  if (!row.year) return false; // if year not selected yet, don’t disable anything

  return this.creditRows.some((r:any, i) =>
    i !== rowIndex && r.year === row.year && r.month === month
  );
}
  isMonthSelected(monthValue: number, yearValue: number | null, currentIndex: number): boolean {
    if (yearValue === null) return false; // if year not selected, don't block any month
    return this.creditRows.some((row, i) =>
      i !== currentIndex &&
      row.month === monthValue &&
      row.year === yearValue
    );
  }

  // Add row
  addRow() {
    this.creditRows.push({ year: null, month: null, amount: null });
    if (this.allotmentType === 'divideEqually') {
      this.onAllotmentTypeChange(this.allotmentType);
    }
  }

  removeRow(index: number) {
    if (this.creditRows.length > 1) {
      this.creditRows.splice(index, 1);
      if (this.allotmentType == 'divideEqually') {
        this.onAllotmentTypeChange(this.allotmentType)
      }
    }
  }

  checkAlldepartment() {
    this.isAllDepartmentSelected =
      this.dept_id?.length === this.departmentdata?.length;

    this.getAllEmployeesBySelectedDepartments(this.dept_id);
  }

  selectAllDepartments(event: any) {
    this.isAllDepartmentSelected = event.checked;
    this.dept_id = event.checked
      ? this.departmentdata.map((d) => d.dept_id)
      : [];

    this.getAllEmployeesBySelectedDepartments(this.dept_id);

    // Reapply grid filter based on text box (if needed)
    this.onFilterTextBoxChanged();
  }

  checkAllEmployeeSelected() {
    this.isAllEmployeeSelected =
      this.selectedEmployee.length === this.employeeList.length;
    this.getVariableEarningComponents(this.selectedEmployee);
  }

  selectAllEmployee(event: any) {
    this.isAllEmployeeSelected = event.checked;
    this.selectedEmployee = event.checked
      ? this.employeeList.map((emp) => emp.employee_id)
      : [];
    this.getVariableEarningComponents(this.selectedEmployee);
  }

  cancelFun(): void {
    this.selectedYear = null;
    this.dept_id = [];
    this.selectedEmployee = [];
    this.isAllDepartmentSelected = false;
    this.isAllEmployeeSelected = false;

    // Optionally reset filtered lists to original data
    this.filterDepartment = [...this.departmentdata];
    this.filteredEmployees = [...this.employeeList];

    this.toaster.info('Data cleared successfully!');
  }
  get totalAnnualAmount(): number {
    return this.variableearningComponentList
      .reduce((sum, comp) => sum + (Number(comp.fixedAllowanceAnnual) || 0), 0);
  }
  updatePercentageAmount(): void {
    if (this.componentName && this.totalAnnualAmount) {
      const percentage = Number(this.componentName);
      this.componentAmount = (this.totalAnnualAmount * percentage) / 100;
    } else {
      this.componentAmount = null;
    }
  }
  get totalCreditAmount(): number {
    return this.creditRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  }


  // Called when allotment type changes
  onAllotmentTypeChange(type: 'divideEqually' | 'enterManually') {
    this.allotmentType = type;   // 👈 keep track of current type
    if (type === 'divideEqually') {
      if (this.creditRows.length > 0 && this.componentAmount) {
        const equalAmount = this.componentAmount / this.creditRows.length;
        this.creditRows = this.creditRows.map(row => ({
          ...row,
          amount: Number(equalAmount.toFixed(2))
        }));
      }
    } else if (type === 'enterManually') {
      this.creditRows = this.creditRows.map(row => ({ ...row, amount: null }));
    }
  }

  // onAllotmentTypeChange(type: 'divideEqually' | 'enterManually') {
  //   this.allotmentType = type;

  //   if (type === 'divideEqually') {
  //     if (this.creditRows.length > 0 && this.componentAmount) {
  //       const equalAmount = this.componentAmount / this.creditRows.length;
  //       this.creditRows = this.creditRows.map(row => ({
  //         ...row,
  //         amount: Number(equalAmount.toFixed(2))
  //       }));
  //     }
  //   } else if (type === 'enterManually') {
  //     // ✅ Only reset when switching from divideEqually → enterManually
  //     this.creditRows = this.creditRows.map(row => ({
  //       ...row,
  //       amount: row.amount ?? null
  //     }));
  //   }
  // }


  onAmountChange() {
    if (this.allotmentType === 'enterManually') {
      if (this.totalCreditAmount !== this.totalAnnualAmount) {
        // do nothing until submit
      }
    }
  }
  // getTotalAmount(): number {
  //   if (this.allotmentType === 'enterManually') {
  //     return this.creditRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  //   }
  //   return this.componentAmount || 0;
  // }

  //////////
  getTotalAmount(): number {
    if (this.allotmentType === 'enterManually') {
      const total = this.creditRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      return Number(total.toFixed(2));
    }
    return Number((this.componentAmount || 0));
  }
  // check duplicate (year + month) after user changes year/month
  validateDuplicateRow(index: number) {
  const row = this.creditRows[index];
  if (!row.year || !row.month) return;

  const duplicate = this.creditRows.some((r, i) =>
    i !== index && r.year === row.year && r.month === row.month
  );

  if (duplicate) {
    this.toaster.error(`Row ${index + 1}: Same year & month already selected.`);
    // Reset so user must pick again
    row.month = null;
    row.year = null;
  }
}


  validateCreditRows(): boolean {
    for (let i = 0; i < this.creditRows.length; i++) {
      const row = this.creditRows[i];

      if (!row.year) {
        this.toaster.error(`Row ${i + 1}: Financial Year is required.`);
        return false;
      }
      if (!row.month) {
        this.toaster.error(`Row ${i + 1}: Month is required.`);
        return false;
      }
      if (this.allotmentType === 'enterManually' && (!row.amount || row.amount <= 0)) {
        this.toaster.error(`Row ${i + 1}: Amount is required.`);
        return false;
      }
    }
    return true;
  }
  toNumber(value: any): number {
    return Number(Number(value || 0).toFixed(2));
  }


  onFilterTextBoxChanged() {
    const value = this.filterInput.nativeElement.value;
    this.gridApi.setQuickFilter(value);
  }

  onSubmit(): void {
    if (!this.selectedYearId || !this.dept_id?.length || !this.selectedEmployee ||
      !this.componentName || !this.totalAnnualAmount || !this.creditType) {
      this.toaster.error("Please fill all required fields.");
      return;
    }
    if (this.creditType == "multiple" && !this.allotmentType){
      this.toaster.error("Please fill allotment type!");
      return;
    }
    if (!this.validateCreditRows()) {
      return;
    }
    ///////////////////
    const total = Number(this.getTotalAmount().toFixed(2));
    const comp = Number(Number(this.componentAmount || 0).toFixed(2));

    if (total !== comp) {
      this.toaster.error(
        `Credit Allotment total (${total}) must be equal to Approve Salary Amount (${comp}).`
      );
      return;
    }

    const payload = {
      id: this.id,
      entity_id: this.entity_id,
      financial_year_id: this.selectedYearId,
      employee_ids: [this.selectedEmployee],
      total_annual_amount: this.totalAnnualAmount,
      approve_salary_percentage: this.componentName,
      approve_salary_amount: this.componentAmount,
      variable_component_details: this.variableearningComponentList.map(comp => ({
        component_name: comp.componentName,
        annual_amount: comp.fixedAllowanceAnnual
      })),

      credit_type: this.creditType,
      allotment_type: this.creditType === "multiple" ? this.allotmentType : null,
      credit_allotment_details:
        this.creditType === "oneTime"
          ? this.creditRows.map(row => ({
            year: row.year,
            month: row.month,
            amount: row.amount
          }))
          : this.creditRows.map(row => ({
            year: row.year,
            month: row.month,
            amount: row.amount
          })),

    };
    if (this.isEditMode) {
      this.payrollService.updateVariableAllotmentEarning(this.id, payload).subscribe(
        (res: any) => {
          this.toaster.success(res.message || 'Updated successfully!');
          this.route.navigate(['/master/payroll/variable-earning-allotment']);
        },
        (err: any) => {
          this.toaster.error(err.error?.message || 'Failed to update');
        }
      );
    } else {
      this.payrollService.addVariablEarning(payload).subscribe(
        (res: any) => {
          this.toaster.success(res.message || 'Created successfully!');
          this.route.navigate(['/master/payroll/variable-earning-allotment']);
        },
        (err: any) => {
          this.toaster.error(err.error?.message || 'Failed to create');
        }
      );
    }
    console.log("Final Payload --->", payload);
    // call API with this payload
  }


  getFinancialYear(): void {
    this.$miscellaneous.getAllActivefinancial_year().subscribe(
      (res: any) => {
        this.financialYearList = res?.data || [];
        // Keep both id and financial_year
      },
      (err) => {
        console.error('Error fetching financial years', err);
        this.toaster.error('Failed to load financial years');
      }
    );
  }

}

