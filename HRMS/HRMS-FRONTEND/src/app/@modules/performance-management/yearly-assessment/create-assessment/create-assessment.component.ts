import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { YearlyAssessmentService } from '../../../../@shared/services/performance-management/yearly-assessment.service';
import { ListAssessmentComponent } from '../list-assessment/list-assessment.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.scss'],
})
export class CreateAssessmentComponent {
  action: any;
  yearlyAssessment: any = [];
  yearlyAssessmentForm: FormGroup;
  assessId: any;
  entity_id: any = '';
  financialYear: any = [];
  startDate: any;
  endDate: any;
  singlefinancialYear: any;
  assessmentName: any;
  employee_id: any;
  minEndDate: any;
  minStartDate: any;
  private subscription: Subscription = new Subscription();
  financialYearMap: any = {};
  financial_id: string | null;
  financial_year_local_storage: string | null;
  financialYear2: any;
  fYears: any;
  departments: any
  departmentdata: any[] = [];
  filteredDepartments: any[] = [];
  employeeName: any[] = [];
  departmentId: any[] = [];
  employeeNameData: any[] = [];
  dept_id: any = [];
  EmployeeId: any = [];

  constructor(
    private fb: FormBuilder,
    private assessmentService: YearlyAssessmentService,
    private $miscellaneous: MiscellaneousService,
    private _commonService: CommonService,
    private dialog: MatDialogRef<ListAssessmentComponent>,
    @Inject(MAT_DIALOG_DATA) public assessmentYearData: any,
    private toaster: ToastrService,
    private route: Router
  ) {
    this.entity_id = Number(localStorage.getItem('selectedEntityId'));
    this.employee_id = Number(localStorage.getItem('EmpMainId'));
    this.financial_id = localStorage.getItem('financial_id');
    this.yearlyAssessmentForm = this.fb.group({
      financial_year_id: [null, Validators.required],
      assessment_name: [
        '',
        [Validators.required, this.noSpacesAlphanumericValidator],
      ],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      entity_id: [this.entity_id],
      employee_id: [this.employee_id],
      dept_id: [this.dept_id, [Validators.required]],
      staus: ['Pending For Self Assessment'],
      assessment_degree: [null, Validators.required],
      employee: [[]],
    });
  }

  ngOnInit() {
    this.action = this.assessmentYearData?.action;
    this.minStartDate = new Date();
    this.minEndDate = new Date();
    this.financial_year_local_storage = localStorage.getItem('financial_id');
    this.yearlyAssessmentForm.patchValue({
      start_date: null,
      end_date: null,
    });
    if (this.action == 'edit') {
      this.assessId = this.assessmentYearData.data.id;
      this.yearlyAssessmentForm.patchValue({
        financial_year: this.assessmentYearData.data.financial_year,
        assessment_name: this.assessmentYearData.data.assessment_name,
        start_date: this.assessmentYearData.data.start_date,
        end_date: this.assessmentYearData.data.end_date,
        assessment_degree: this.assessmentYearData.data.assessment_degree,
        dept_id: this.assessmentYearData.data.dept_id,
        employee: this.assessmentYearData.data.employees.employee_id,
      });
      this.startDate = this.assessmentYearData.data.start_date;
      this.endDate = this.assessmentYearData.data.end_date;
      this.dept_id = this.assessmentYearData.data.dept_id;
      this.assessmentName = this.assessmentYearData.data.assessment_name;
      const currentDate = new Date();
      const startDate = new Date(this.assessmentYearData.data.start_date);
      if (currentDate < startDate) {
        this.minStartDate = currentDate;
      } else {
        this.minStartDate = startDate;
      }
    }
    this.yearlyAssessmentForm.get('employee')?.valueChanges.subscribe((selected: any[]) => {
       const currentDeptEmployeeIds = this.employeeNameData.map((emp) => emp.employee_id);
        if (
          selected?.length === currentDeptEmployeeIds.length &&
          currentDeptEmployeeIds.every((id) => selected.includes(id))
        ) {
          this.isAllSelect = true;
        } else {
          this.isAllSelect = false;
        }
      });
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res: any) => {
      if (res.code == 200) {
        this.yearlyAssessment = res.data;
        const currentYear = new Date().getFullYear();
        this.financialYear = this.yearlyAssessment.filter((assessment: any) => {
          const year = parseInt(assessment.financial_year);
          if (this.financial_year_local_storage == assessment.id) {
            return true;
          }
        });
        this.financialYear.forEach((item: any) => {
          this.financialYearMap[item.id] = item.financial_year;
        });
        this.financialYear2 = this.financialYear;
        this.fYears = this.financialYear.map(
          (value: any) => value.financial_year
        );
        this.subscription.add(
          this.yearlyAssessmentForm
            .get('financial_year_id')
            ?.valueChanges.subscribe((value) => {
              const financialYear = this.financialYearMap[value];
              this.enableStartdate2(financialYear);
            })
        );

        if (this.action == 'edit') {
          this.yearlyAssessmentForm.patchValue({
            financial_year_id: this.assessmentYearData.data.financial_year_id,
          });
        }

        if (this.action == 'view') {
          this.singlefinancialYear = this.yearlyAssessment.find(
            (assessment: any) => {
              if (
                assessment.id === this.assessmentYearData.data.financial_year_id
              ) {
                return assessment;
              }
            }
          );
        }
      }
    });
    this.getAllDepartmentData();
  }

  enableStartdate(value: any) {
    if (this.yearlyAssessmentForm.controls['financial_year_id'].valid) {
      this.yearlyAssessmentForm.get('start_date')?.enable();
    }
  }

  enableStartdate2(value: any) {
    const year = parseInt(value, 10);
    this.minStartDate = new Date();
    if (this.action == 'edit') {
      const currentDate = new Date();
      const startDate = new Date(this.assessmentYearData.data.start_date);
      if (currentDate < startDate) {
        this.minStartDate = currentDate;
      } else {
        this.minStartDate = startDate;
      }
    }
  }

  enableEnddate() {
    if (this.yearlyAssessmentForm.controls['start_date'].valid) {
      this.yearlyAssessmentForm.get('end_date')?.enable();
      this.yearlyAssessmentForm.get('end_date')?.markAllAsTouched();
    }
  }

  startDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const dateValue = new Date(control.value);
      const startDate = dateValue.getFullYear();
      const financial_year_id = control.root.get('financial_year_id')?.value;
      if (financial_year_id) {
        const selectedFinancialYear = this.financialYear.find(
          (data: any) => data.id == financial_year_id
        );
        const selectedFinYear = selectedFinancialYear.financial_year;
        if (startDate < selectedFinYear) {
          return { startDateInvalid: true };
        }
        this.enableEnddate();
      }
      return null;
    };
  }

  endDateValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const startDate = control.root.get('start_date')?.value;
    const endDate = control.value;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return { endDateInvalid: true };
    }
    return null;
  }

  noSpacesAlphanumericValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  }

  parseDDMMYYYY(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  onSubmitAssessmentYear() {
    this.yearlyAssessmentForm.value['filter_fy'] = Number(this.financial_id);
    Object.values(this.yearlyAssessmentForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.yearlyAssessmentForm.invalid) {
      this.toaster.error('Please fill all the fields valid');
      return;
    }

    this.yearlyAssessmentForm.get('start_date')?.enable();
    this.yearlyAssessmentForm.get('end_date')?.enable();
    let x = this.yearlyAssessmentForm.get('start_date')?.value;
    x = new Date(new Date(x).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    let y = this.yearlyAssessmentForm.get('end_date')?.value;
    y = new Date(new Date(y).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    this.yearlyAssessmentForm.get('start_date')?.setValue(x);
    this.yearlyAssessmentForm.get('end_date')?.setValue(y);
    let obj = this.yearlyAssessmentForm.value;
    obj.filter_fy = Number(this.financial_id);
    if (this.yearlyAssessmentForm.invalid) {
      return;
    } else {
      if (this.assessId) {
        this._commonService?.showLoader();
        this.assessmentService
          .updateYearlyAssessment(this.assessId, obj)
          .subscribe(
            (res) => {
              this.toaster.success(res.message);
              this._commonService?.hideLoader();
              this.confirmDialog();
              this.reloadCurrentRoute();
            },
            (err) => {
              this._commonService?.hideLoader();
              this.toaster.error(err.error.message);
            }
          );
      } else {
        this._commonService?.showLoader();
        this.assessmentService.createYearlyAssessment(obj).subscribe(
          (res) => {
            this.toaster.success(res.message);
            this._commonService?.hideLoader();
            this.confirmDialog();
            this.reloadCurrentRoute();
          },
          (err) => {
            this._commonService?.hideLoader();
            this.toaster.error(err.error.message);
          }
        );
      }
    }
  }

  fYearFilter(e: any) {
    const aa = e;
    let filteredVariable = this.financialYear2.filter((item: any) =>
      aa.includes(item.financial_year)
    );
    this.financialYear = filteredVariable;
  }

  confirmDialog() {
    this.dialog.close(this.yearlyAssessmentForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value ? new Date(event.value) : null;
    const nextDay = startDate ? new Date(startDate) : null;
    nextDay && startDate ? nextDay.setDate(startDate.getDate() + 1) : null;
    this.minEndDate = nextDay;
    this.yearlyAssessmentForm.controls['end_date'].setValue(null);
  }

  getAllDepartmentData() {
    const selectedEntityId = localStorage.getItem('selectedEntityId');
    this.assessmentService.getAllDepartmentData(selectedEntityId).subscribe(
      (res: any) => {
        this.departmentdata = res.data.departments;
        this.employeeName = res.data.employees;
        this.filteredDepartments = [...this.departmentdata];
        this.selectedDepartmentName(this.assessmentYearData?.data?.dept_id);
        let employees_id = this.assessmentYearData.data.employees.map(
          (item: any) => item.employee_id
        );
        console.log('Employee IDs:', employees_id);
        if (this.action == 'edit') {
          this.yearlyAssessmentForm.patchValue({
            employee: employees_id,
          });
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // selectedDepartmentName(deptId: any) {
  //   this.departmentId = this.employeeName.filter(
  //     (item: any) => item.dept_id == deptId
  //   );
  //   this.dept_id = deptId;
  //   console.log('Selected dept_id:', deptId);
  //   console.log('Type of selected dept_id:', typeof deptId);

  //   this.employeeNameData = [];

  //   if (this.departmentId.length === 0) {
  //     console.log('No employees found in the selected department.');
  //     this.yearlyAssessmentForm.patchValue({ employee: [] });
  //   } else {
  //     this.departmentId.forEach((employee: any) => {
  //       this.employeeNameData.push({
  //         first_name: employee.first_name,
  //         last_name: employee.last_name,
  //         employee_id: employee.employee_id,
  //       });
  //     });
  //     const allEmployeeIds = this.employeeNameData.map(
  //       (emp) => emp.employee_id
  //     );
  //     this.yearlyAssessmentForm.patchValue({ employee: allEmployeeIds });
  //     const selectedEmployees = this.yearlyAssessmentForm.get('employee')?.value || [];
  //     const currentDeptEmployeeIds = this.employeeNameData.map(emp => emp.employee_id);
  //     const allSelected = currentDeptEmployeeIds.every(empId => selectedEmployees.includes(empId));
  //     if (allSelected) {
  //       this.isAllSelect = true;
  //     } else {
  //       this.isAllSelect = false;
  //     }
  //     }
  // }
  selectedDepartmentName(deptIds: any) {

    // Ensure deptIds is an array
    const selectedDeptIds = Array.isArray(deptIds) ? deptIds : [deptIds];

    this.dept_id = selectedDeptIds;

    console.log('Selected dept_ids:', selectedDeptIds);
    console.log('Type of selected dept_ids:', typeof selectedDeptIds);

    // Filter employees matching any of the selected dept_ids
    this.departmentId = this.employeeName.filter((item: any) =>
      selectedDeptIds.includes(item.dept_id)
    );

    this.employeeNameData = [];

    if (this.departmentId.length === 0) {
      console.log('No employees found in the selected departments.');
      this.yearlyAssessmentForm.patchValue({ employee: [] });
      this.isAllSelect = false;
    } else {
      this.departmentId.forEach((employee: any) => {
        this.employeeNameData.push({
          first_name: employee.first_name,
          last_name: employee.last_name,
          employee_id: employee.employee_id,
        });
      });

      const allEmployeeIds = this.employeeNameData.map(emp => emp.employee_id);
      this.yearlyAssessmentForm.patchValue({ employee: allEmployeeIds });

      const selectedEmployees = this.yearlyAssessmentForm.get('employee')?.value || [];
      const currentDeptEmployeeIds = this.employeeNameData.map(emp => emp.employee_id);

      const allSelected = currentDeptEmployeeIds.every(empId =>
        selectedEmployees.includes(empId)
      );
      this.isAllSelect = allSelected;
    }
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

  filterEmployee(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!Array.isArray(this.employeeNameData)) {
      console.error('employeeNameData is not properly initialized');
      return;
    }
    if (!searchValue) {
      this.employeeNameData = this.employeeName.filter(
        (employee: any) => employee.dept_id === this.dept_id
      );
      return;
    }
    this.employeeNameData = this.employeeName
      .filter((employee: any) => employee.dept_id === this.dept_id)
      .filter((employee: any) =>
        (employee.first_name + ' ' + employee.last_name)
          .toLowerCase()
          .includes(searchValue)
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
      this.yearlyAssessmentForm.patchValue({ employee: allEmployeeIds });
    } else {
      this.yearlyAssessmentForm.patchValue({ employee: [] });
    }
  }

  checkIfAllSelected() {
    const selectedEmployees =
      this.yearlyAssessment.get('employee')?.value || [];
    this.isAllSelect =
      selectedEmployees.length === this.employeeNameData.length;
  }
}
