import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ArrearSalary } from '../arrear-salary';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-arear-salary-create',
  templateUrl: './arear-salary-create.html',
  styleUrls: ['./arear-salary-create.scss'],
})
export class ArearSalaryCreate {
  minEndDate: Date | null = null;
  arrearsalaryForm: any;
  id: any;
  actionType: any;
  parm: any;
  isAllSelectDepartment: boolean = false;
  isDisabled: boolean = false;
  endDate: any;
  startDate: any;

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

  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private _arrearsalary: ArrearSalary,
    private $common: CommonService,
    private toast: ToastrService,
    private location: Location,
    private _commonService: CommonService,
    private _empRegistration: EmpRegistrationService,
    private _hrmkpaService: HrmServiceService,
    private $miscellaneous: MiscellaneousService
  ) {
    this.arrearsalaryForm = this.fb.group({
      financial_year_id: new FormControl(null, [Validators.required]),
      month: new FormControl([], [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      arrear_type: new FormControl(null, [Validators.required]),
      department_list: new FormControl([], [Validators.required]),
      employee_ids: new FormControl(null, [Validators.required]),
      remark: new FormControl(null, [Validators.required]),
      amount_type: new FormControl(false),
      is_epfapplicable: new FormControl(false),
      is_esiapplicable: new FormControl(false),
      is_taxable: new FormControl(false),
      start_arrear_date: new FormControl(null, [Validators.required]),
      end_arrear_date: new FormControl(null, [Validators.required]),
    })
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
        this.getArrearSalaryById();
      }
      if (this.actionType === 'view') {
        this.arrearsalaryForm.disable();
      }
    });
    this.arrearsalaryForm.get('bonus_type')?.valueChanges.subscribe((value: any) => {
      if (value === 'Deduction') {
        this.arrearsalaryForm.get('amount_type')?.reset();
      }
    });

    this.getAllDepartment_dropDown();
    this.getFinancialYear();
  }

  goBack() {
    this.location.back();
  }
  back() {
    history.back()
  }
  getArrearSalaryById() {
    this._arrearsalary.getArrearSalaryById(this.entity_id, this.id).subscribe({
      next: (res: any) => {
        if (res && res.code === 200 && res.data?.length > 0) {
          const response = res.data[0];
          const patchData = {
            financial_year_id: response.financial_year_id,
            amount: response.amount,
            month: response.month,
            arrear_type: response.arrear_type,
            department_list: [response.dept_id],
            // employee_ids: response.employee_id
            //   ? response.employee_id
            //   : [response.employee_id],
            employee_ids: response.employee_id,
            remark: response.remark,
            start_arrear_date: response.start_arrear_date,
            end_arrear_date: response.end_arrear_date,
            is_epfapplicable: !!response.is_epf_applicable,
            is_esiapplicable: !!response.is_esi_applicable,
            is_taxable: !!response.is_taxable,
          };
          this.arrearsalaryForm.patchValue(patchData);
          if (patchData.department_list && patchData.department_list.length > 0) {
            console.log("🚀 Calling getAllArea with:", patchData.department_list);
            console.log("pppppppppppppppppppppppp", this.arrearsalaryForm);
            this.getAllArea(patchData.department_list);
          }

        } else {
          console.warn("⚠️ No arrear salary data found.");
        }
      },
      error: (err) => {
        console.error("❌ Error fetching arrear salary:", err);
      }
    });
  }

  onSubmitForm() {
    if (this.arrearsalaryForm.invalid) {
      this.toast.error('Required fields should not be blank', 'Required Fields');
      return;
    }

    this._commonService?.showLoader();

    const val = this.arrearsalaryForm.value;
    // ✅ Build payload
    const payload = {
      id: this.id,
      financial_year_id: val.financial_year_id,
      month: val.month, // array
      amount: +val.amount, // ensure it's number
      arrear_type: val.arrear_type,
      employee_id: Array.isArray(val.employee_ids) ? val.employee_ids : [val.employee_ids], // always array
      remark: val.remark,
      is_epfapplicable: !!val.is_epfapplicable ? 1 : 0,
      is_esiapplicable: !!val.is_esiapplicable ? 1 : 0,
      is_taxable: val.is_taxable ? 1 : 0,
      start_arrear_date: val.start_arrear_date,
      end_arrear_date: val.end_arrear_date,
      entity_id: Number(this.entity_id),
      created_by: this.mainId,
    };

    console.log('✅ Final Payload:', payload);
    val.entity_id = this.entity_id;
    if (this.id) {
      val.id = this.id;
    }
    // ✅ Call API
    this._arrearsalary.createArrearSalary(payload).subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        this.toast.success(this.id ? 'Updated successfully' : 'Created successfully', 'Success');
        this.goBack();
      },
      (err) => {
        this._commonService?.hideLoader();
        if (err.error?.code === 403) {
          this.toast.error(`${err.error.message}`, 'Error Message');
        } else {
          this.toast.error('Something went wrong, please try again', 'Error Message');
        }
      }
    );
  }

  // Department
  getAllDepartment: any;
  getAllDepartment2: any = [];
  departments: any = [];
  getAllDepartment_dropDown() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.getAllDepartment_dropDown(entity_id).subscribe(
      (res) => {
        this.getAllDepartment = res.data.filter((res: any) => res.status === "ACTIVE");
        this.getAllDepartment2 = this.getAllDepartment;
        this.departments = this.getAllDepartment2.map((res: any) => res.department_name);
      }
    );
  };

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

  getAllArea(event: any) {
    console.log("Hiiiii", event)

    this._hrmkpaService.getemployeeById(event).subscribe((res: any) => {
      if (res) {
        this.employeeList = [];
        this.employeeList = res.data;
        this.employeeList2 = res.data;
        this.employees = this.employeeList2.map((res: any) => `${res.first_name} ${res?.middle_name || ''} ${res.last_name} ${res?.employee_code}`);
        this.employeeNameList = this.getEmp(this.employeeList)
      }
    }, err => {
      this.toast.error(err.error.message);
      this.employeeList = [];
      this.selectedEmployee = "";
      this.arrearsalaryForm.get('employee_list')?.setValue([]);
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

  onCheckboxChange(event: any): void {
    if (event.checked) {
      this.arrearsalaryForm.get('amount_type')?.setValue('TAXABLE');
    }
    else {
      this.arrearsalaryForm.get('amount_type')?.setValue(null);
    }
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

    const endDate = this.arrearsalaryForm.get('end_date')?.value;
    if (endDate && new Date(endDate) < new Date(startDate)) {
      this.arrearsalaryForm.get('end_date')?.setValue(null);
    }
  }

  // custom validator for date range
  dateRangeValidator(formGroup: any) {
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