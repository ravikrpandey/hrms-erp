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
import { FineManagementService } from '../fine-management-service';

@Component({
  selector: 'app-fine-management-create',
  templateUrl: './fine-management-create.html',
  styleUrls: ['./fine-management-create.scss']
})
export class FineManagementCreate {
  startDate: any;
  fineManagementForm: any;
  id: any;
  actionType: any;
  parm: any;
  isAllSelectDepartment: boolean = false;
  isDisabled: boolean = false;

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
    private $miscellaneous: MiscellaneousService,
    private _filemanagementservice: FineManagementService
  ) {
    this.fineManagementForm = this.fb.group({
      department_list: new FormControl([], [Validators.required]),
      employee_id: new FormControl(null, [Validators.required]),
      financial_year_id: new FormControl(null, [Validators.required]),
      month: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      fine_date: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
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
      if ((this.actionType === 'edit' && this.id) || this.entity_id) {
        this.getFineManagementById();
      }
      if (this.actionType === 'view') {
        this.fineManagementForm.disable();
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

  getFineManagementById() {
    this._filemanagementservice.getFineManagementById(this.entity_id, this.id).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        let response = res.data[0];
        const departmentId = response?.dept_id || response?.department_id;
        const employeeId = response?.employee_id;
        if (departmentId) {
          this.getAllArea([departmentId]);
        }
        setTimeout(() => {
          this.fineManagementForm.patchValue({
            department_list: departmentId ? [departmentId] : [],
            employee_id: employeeId,
            financial_year_id: response?.financial_year_id,
            month: response?.month,
            amount: response?.amount,
            fine_date: response?.fine_date ? new Date(response?.fine_date) : null,
            description: response?.description || ''
          });
        }, 200);
      }
    }, err => {
      this.toast.error('Error fetching fine management record');
      console.error('Error:', err);
    });
  }

  onSubmitForm() {
    Object.keys(this.fineManagementForm.controls).forEach(key => {
      this.fineManagementForm.get(key)?.markAsTouched();
    });

    if (this.fineManagementForm.invalid) {
      this.toast.error('Please fill all required fields', 'Validation Error');
      return;
    }

    this._commonService?.showLoader();
    const val = this.fineManagementForm.value;
    const selectedEmployeeId = Array.isArray(val.employee_id)
      ? val.employee_id[0]
      : val.employee_id;

    const selectedDepartmentId = Array.isArray(val.department_list) && val.department_list.length > 0
      ? val.department_list[0]
      : null;
    const payload: any = {
      entity_id: Number(this.entity_id),
      financial_year_id: val.financial_year_id,
      employee_id: selectedEmployeeId,
      month: val.month,
      amount: Number(val.amount),
      fine_date: val.fine_date ? new Date(val.fine_date).toISOString() : null,
      description: val.description || '',
    };

    if (this.id) {
      payload.id = this.id;
    }
    this._filemanagementservice.createFineManagement(payload).subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        this.toast.success(
          this.id ? 'Fine Management updated successfully' : 'Fine Management created successfully',
          'Success'
        );
        this.goBack();
      },
      (err) => {
        this._commonService?.hideLoader();
        if (err.error?.message) {
          this.toast.error(err.error.message, 'Error');
        } else if (err.error?.code === 403) {
          this.toast.error('Access denied', 'Error');
        } else {
          this.toast.error('Something went wrong, please try again', 'Error');
        }
      }
    );
  }

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
  }

  departmentSearch(e: any) {
    const aa = e;
    let filteredVariable = this.getAllDepartment2.filter((item: any) => aa.includes(item.department_name));
    this.getAllDepartment = filteredVariable;
  }

  employeeListName: string = '';
  kpaEmp: any;
  employeeList: any = [];
  employeeList2: any;
  employees: any;
  employeeNameList: any;
  selectedDepartment: any;
  disableField: boolean = false;

  getAllArea(event: any) {
    // Handle both array and single value
    const deptIds = Array.isArray(event) ? event : [event];

    this._hrmkpaService.getemployeeById(deptIds).subscribe((res: any) => {
      if (res && res.data) {
        this.employeeList = res.data;
        this.employeeList2 = res.data;
        this.employees = this.employeeList2.map((res: any) =>
          `${res.first_name} ${res?.middle_name || ''} ${res.last_name} ${res?.employee_code}`
        );
      }
    }, err => {
      this.toast.error(err.error?.message || 'Error fetching employees');
      this.employeeList = [];
      this.fineManagementForm.get('employee_id')?.setValue(null);
    });
  }

  employeeSearch(e: any) {
    const aa = e;
    let filteredVariable = this.employeeList2.filter((item: any) =>
      aa.includes(`${item.first_name} ${item?.middle_name || ''} ${item.last_name} ${item?.employee_code}`)
    );
    this.employeeList = filteredVariable;
  }

  selectAllDepartment(event: any): void {
    let checked = event?.target?.checked;

    if (checked) {
      this.selectedDepartment = this.getAllDepartment.map((emp: { dept_id: any; }) => emp.dept_id);
    } else {
      this.selectedDepartment = [];
    }
    this.isAllSelectDepartment = checked;
    this.getAllArea(this.selectedDepartment);
  }

  financialYearList: any = [];

  getFinancialYear() {
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res && res.data) {
        this.financialYearList = res.data;
      }
    });
  }
}