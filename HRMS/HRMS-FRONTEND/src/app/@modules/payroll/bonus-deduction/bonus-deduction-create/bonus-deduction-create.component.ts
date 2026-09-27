import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-bonus-deduction-create',
  templateUrl: './bonus-deduction-create.component.html',
  styleUrls: ['./bonus-deduction-create.component.scss']
})
export class BonusDeductionCreateComponent {

  bonusDeductionForm: any;
  bonus_id: any;
  actionType: any;
  parm: any;
  isAllSelectDepartment: boolean = false;

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
      financial_year_id: new FormControl(null, [Validators.required]),
      month: new FormControl([], [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      bonus_type: new FormControl(null, [Validators.required]),
      bonus_name: new FormControl(null, [Validators.required]),
      department_list: new FormControl([], [Validators.required]),
      employee_ids: new FormControl([], [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      amount_type: new FormControl(false),
    })
  }
  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.bonus_id = params.id;
      this.actionType = params.actionType;
      if (this.bonus_id) {
        this.getBonusById()
      }
      if (this.actionType === 'view') {
        this.bonusDeductionForm.disable();
      }
    });

    // reset amount_type when deduction is selected
    this.bonusDeductionForm.get('bonus_type')?.valueChanges.subscribe((value: any) => {
      if (value === 'Deduction') {
        this.bonusDeductionForm.get('amount_type')?.reset();
      }
    });

    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.getAllDepartment_dropDown();
    this.getFinancialYear();
  }

  goBack() {
    this.location.back();
  }
  back() {
    history.back()
  }

  // get by bonus id start
  getBonusById() {

    this._configurationalMasterService.getBonusById(this.bonus_id).subscribe((res) => {
      if (res) {
        let response = res.data[0];
        const monthArray = response?.month ? [response.month] : [];
        const isTaxable = response?.amount_type === 'TAXABLE';
        this.getAllArea(response?.department_id)
        this.bonusDeductionForm.patchValue({
          financial_year_id: response?.financial_year_id,
          amount: response?.amount,
          bonus_type: response?.bonus_type,
          bonus_name: response?.bonus_name,
          department_list: [response?.department_id],
          employee_ids: [response?.employee_id],
          description: response?.description,
          month: monthArray,
          amount_type: isTaxable,
        });
        this.selectedMonth = monthArray;
      }
    }
    );
  };
  // get by bonus id end

  onSubmitForm() {

    if (this.bonusDeductionForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    let val = this.bonusDeductionForm.value;
    this._commonService?.showLoader()
    val.entity_id = this.entity_id;
    val.created_by = this.mainId;
    if (this.bonus_id) {
      val.bonus_id = this.bonus_id
    }
    this._configurationalMasterService.create_bonus(val).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.toast.success("created successfully", "Created Successfully");
      this.goBack()
    }, (err) => {
      this._commonService?.hideLoader()
      if (err.error.code === 403) {
        this.toast.error(`${err.error.message}`, "Error Massage");
      } else {
        this.toast.error("Something went wrong please try again", "Error Massage");
      }
    }
    )
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
      this.bonusDeductionForm.get('employee_list')?.setValue([]);
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

  onCheckboxChange(event: any): void {
    if (event.checked) {
      this.bonusDeductionForm.get('amount_type')?.setValue('TAXABLE');
    }
    else {
      this.bonusDeductionForm.get('amount_type')?.setValue(null);
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

}

