import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CompliancesService } from '../compliances-service';

@Component({
  selector: 'app-safety-create',
  templateUrl: './safety-create.html',
  styleUrls: ['./safety-create.scss'],
})
export class SafetyCreate {
  safetyhForm: FormGroup;
  mainId: string | null;
  entity_id: string | null;
  isAllSelectDepartment: boolean = false;
  public locations: any;
  actionType: any;
  id: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private _compliancesservice: CompliancesService,
    private $common: CommonService,
    private toast: ToastrService,
    private location: Location,
    private _commonService: CommonService,
    private _empRegistration: EmpRegistrationService,
    private _hrmkpaService: HrmServiceService,
    private $miscellaneous: MiscellaneousService,
    private configMaster: ConfigurationalmasterService,
  ) {
    this.safetyhForm = this.fb.group({
      branch_name: new FormControl(null, [Validators.required]),
      department_list: new FormControl([], [Validators.required]),
      employee_ids: new FormControl(null, [Validators.required]),
      date_of_inspec: new FormControl(null, [Validators.required]),
      supervisor: new FormControl(null, [Validators.required]),
      checklist: this.fb.array([])
    });
    this.loadChecklist();
  }
  get checklistFormArray(): FormArray {
    return this.safetyhForm.get('checklist') as FormArray;
  }

  loadChecklist() {
    // safetyConditions already loaded via API
    this.safetyConditions.forEach((item: any) => {
      this.checklistFormArray.push(
        this.fb.group({
          id: [item.id],
          checkpoint: [item.checkpoint],
          status: ['', Validators.required], // Required field
          remarks: ['', Validators.required] // You can add Validators.required if remarks required
        })
      );
    });
  }

  safetyConditions: any[] = [
    {
      id: '1',
      checkpoint: 'All machinery has proper guards?',
      status: '',
      remarks: ''
    },
    {
      id: '2',
      checkpoint: 'Emergency exits are accessible and marked?',
      status: '',
      remarks: ''
    },
    {
      id: '3',
      checkpoint: 'Fire extinguishers are serviced?',
      status: '',
      remarks: ''
    },
    {
      id: '4',
      checkpoint: 'PPE issued to all applicable workers?',
      status: '',
      remarks: ''
    },
    {
      id: '5',
      checkpoint: 'First-aid kits are available and stocked?',
      status: '',
      remarks: ''
    },
    {
      id: '6',
      checkpoint: 'Safety instructions displayed?',
      status: '',
      remarks: ''
    },
  ];

  ngOnInit(): void {
    this.getLocations();
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.id = params['id'];
      this.actionType = params['actionType'];
      if (params['entity_id']) {
        this.entity_id = params['entity_id'];
      }
      if ((this.actionType === 'edit' && this.id) || this.entity_id) {
        this.getSafetyInspectionById();
      }
      if (this.actionType === 'view') {
        this.safetyhForm.disable();
      }
    });

    this.getAllDepartment_dropDown();
    this.getAllEmployeeWithCode()

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

  getAllEmployeeWithCode() {
    this._empRegistration.getAllEmployeeWithCode().subscribe((res: any) => {
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
      this.safetyhForm.get('employee_list')?.setValue([]);
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
    // this.getAllemployeeById(this.selectedDepartment)
  }

  filterbybranchname: any = [];
  getLocations() {
    this.configMaster.branch_get_active().subscribe((params: any) => {
      const data = params.data;
      this.locations = Array.isArray(data) ? data : [data];
      this.filterbybranchname = [...this.locations];
    });
  }

  filterBylocation(event: any) {
    this.filterbybranchname = event.data;
  }

  back() {
    history.back()
  }

  goBack() {
    this.location.back();
  }

  onSubmitForm() {
    this.safetyhForm.markAllAsTouched();

    if (this.safetyhForm.invalid) {
      this.toast.error('Please fill all required fields', 'Validation Error');
      return;
    }

    const checklist = this.safetyhForm.value.checklist;

    const statusCounts = {
      yes: checklist.filter((i: any) => i.status === 'Yes').length,
      no: checklist.filter((i: any) => i.status === 'No').length,
      na: checklist.filter((i: any) => i.status === 'NA').length,
    };

    let inspectionStatus = 'YES';
    if (statusCounts.no > 0) inspectionStatus = 'NO';
    else if (statusCounts.yes === 0 && statusCounts.na > 0) inspectionStatus = 'NA';

    const val = this.safetyhForm.value;

    const payload: any = {
      entity_id: Number(this.entity_id),
      branch_id: val.branch_name,
      date_of_inspec: val.date_of_inspec,
      department_id: val.department_list,
      employee_id: val.employee_ids,
      supervisor: val.supervisor,
      remarks: {
        checkpoints: checklist
      }
    };

    if (this.id) payload.id = this.id;

    this._commonService?.showLoader();
    this._compliancesservice.createSafetyInspection(payload).subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        this.toast.success(
          this.id ? 'Safety Inspection updated successfully' : 'Safety Inspection created successfully',
          'Success'
        );
        this.goBack();
      },
      (err) => {
        this._commonService?.hideLoader();
        this.toast.error(err.error?.message || 'Something went wrong', 'Error');
        console.error('Submission error:', err);
      }
    );
  }

  getSafetyInspectionById() {
    this._compliancesservice.getSafetyInspectionById(this.entity_id, this.id).subscribe(
      (res: any) => {
        if (res && res.data && res.data.length > 0) {
          const response = res.data[0];

          /** ------------ Parse Remarks & Checkpoints ------------ **/
          let checkpoints = [];
          try {
            if (response?.remarks) {
              const parsedRemarks =
                typeof response.remarks === 'string'
                  ? JSON.parse(response.remarks)
                  : response.remarks;

              checkpoints = parsedRemarks?.checkpoints || [];
            }
          } catch (e) {
            console.error('Error parsing remarks:', e);
          }

          /** ------------ Rebuild FormArray with Saved Values ------------ **/
          const checklistFA = this.safetyhForm.get('checklist') as FormArray;
          checklistFA.clear(); // Clear old data

          checkpoints.forEach((item: any) => {
            checklistFA.push(
              this.fb.group({
                id: [item.id],
                checkpoint: [item.checkpoint],
                status: [item.status || '', Validators.required],
                remarks: [item.remarks || '']
              })
            );
          });

          /** ------------ Handle Department Values ------------ **/
          let deptArray: any[] = [];
          if (response?.department_id) {
            deptArray = Array.isArray(response.department_id)
              ? response.department_id
              : [response.department_id];

            this.selectedDepartment = deptArray;
            this.isAllSelectDepartment = deptArray.length === this.getAllDepartment?.length;
          }

          /** ------------ Patch Form Fields ------------ **/
          this.safetyhForm.patchValue({
            branch_name: response?.branch_id,
            date_of_inspec: response?.date_of_inspec,
            department_list: deptArray,
            employee_ids: response?.employee_id,
            supervisor: response?.supervisor
          });

        }
      },
      (err) => {
        this.toast.error('Error fetching health inspection record');
        console.error('Fetch error:', err);
      }
    );
  }

}