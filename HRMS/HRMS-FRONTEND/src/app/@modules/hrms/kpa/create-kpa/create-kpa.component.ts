import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      // Return an error object to indicate validation failure
      return { leadingSpaces: true };
    }
    // Return null if validation passes
    return null;
  };
}
@Component({
  selector: 'app-create-kpa',
  templateUrl: './create-kpa.component.html',
  styleUrls: ['./create-kpa.component.scss'],
})
export class CreateKpaComponent {
  kpaRegForm: FormGroup;
  selectedEmployee: any;
  objectiveList: any = [];
  getAllObjective: any = [];
  employeeList: any = [];
  isEmployeeRequired: boolean = false;
  applicableFor: any = '';
  paramsData: any;
  kpaId: Number;
  kpaData: any = [];
  AllDepartment: any = [];
  areaList: any = [];
  actionType: any;
  disableField: boolean = false;
  entity_id: any;
  department_and_user: boolean = false;
  department_user: boolean = false;
  aplicableEmp: any;
  employees: any;
  kpaEmp: any;
  probationEmployee: boolean = false;
  public Editor = ClassicEditor;
  endpoints: { financial_id: number; entity_id: number; employee_id: number };
  financial_id: string | null;
  EmpMainId: string | null;
  objective: any;
  editorInstance: any;
  department: any;
  employeesList: any = '';
  employeeNameList: any;
  employeeListName: string;
  // public editorConfig = {}

  constructor(
    private fb: FormBuilder,
    private _empRegistration: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _hrmkpaService: HrmServiceService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private toster: ToastrService
  ) {
    this.kpaRegForm = this.fb.group({
      objective_id: ['', Validators.required],
      activity: ['', [Validators.required, noLeadingSpaces()]],
      kpi_data: ['', Validators.required],
      aplicable_for: ['', Validators.required],
      probation_employee: [false],
      aplicable_department_id: [null],
      employee_name: [],
    });
    this.localStorage();
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.kpaId = Number(params?.id);
      this.actionType = params?.type;
      if (this.actionType == 'view') {
        this.disableField = true;
        this.disableForm();
        // this.kpaRegForm.get('objective_id')?.disable();
        // this.kpaRegForm.get('activity')?.disable();
        // this.kpaRegForm.get('aplicable_department_id')?.disable();
        // this.kpaRegForm.get('employee_name')?.disable();
        // this.kpaRegForm.get('aplicable_for')?.disable();
        // this.kpaRegForm.get('probation_employee')?.disable();
        // this.kpaRegForm.get('kpi_data')?.disable();
      } else {
        this.disableField = false;
      }
    });
    this.getAllDepartment_dropDown();
    this.getAllObjective_dropDown();
  }

  disableForm = () => {
    this.kpaRegForm.get('aplicable_for')?.disable();
    this.kpaRegForm.get('probation_employee')?.disable();
    //  this.kpaRegForm.get('aplicable_department_id')?.disable();
    //  this.kpaRegForm.get('employee_name')?.disable();
  };

  localStorage() {
    let entity: any = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.EmpMainId = localStorage.getItem('EmpMainId');
    this.entity_id = JSON.parse(entity);
    this.setEndPoint();
  }

  setEndPoint() {
    this.endpoints = {
      financial_id: Number(this.financial_id),
      entity_id: Number(this.entity_id),
      employee_id: Number(this.EmpMainId),
    };
  }

  getDepartment = (id: any) => {
    let x = '';
    this.AllDepartment.forEach((dep: any) => {
      if (id == dep.dept_id) {
        x = dep.department_name;
      }
    });
    return x;
  };

  getEmp = (empList: any) => {
    this.employeeListName = '';
    empList.forEach((empName: any) => {
      this.kpaEmp.forEach((empId: any) => {
        if (empId.employee_id == empName.employee_id) {
          this.employeeListName +=
            empName.first_name + ' ' + empName.last_name + ',';
        }
      });
    });
    if (this.employeeListName.length >= 2) {
      this.employeeListName = this.employeeListName.slice(0, -1);
    }
  };

  getByIdkpa() {
    this._hrmkpaService.getByKpaRequest(this.kpaId).subscribe((res: any) => {
      this.kpaData = res.data;
      this.kpaEmp = res.employee;
      console.log('this.kpaEmplll', this.kpaEmp);
      console.log('this.kpaDatathis.kpaData', this.kpaData);
      this.kpaRegForm.patchValue({
        objective_id: this.kpaData.objective_id,
        activity: this.kpaData.activity,
        kpi_data: this.kpaData.kpi_data,
        aplicable_for: this.kpaData.aplicable_for,
        aplicable_department_id: this.kpaEmp[0]?.applicable_department_id,
        probation_employee: this.kpaData.probation_employee,
        kpi_id: Number(this.kpaId),
      });

      this.objectiveList.forEach((value: any) => {
        if (value.id == this.kpaData.objective_id) {
          this.objective = value.objective_name;
        }
      });

      this.applicableFor = this.kpaData.aplicable_for;
      if (this.applicableFor == 'Selected_User') {
        this.department_and_user = false;
        this.department_user = true;
        let tempEmpList: any = [];
        this.kpaEmp?.map((item: any) => {
          tempEmpList?.push(item?.employee_id);
          // this.employeesList += item.employee_name+","
        });
        this.department = this.getDepartment(
          this.kpaEmp[0].applicable_department_id
        );
        this.kpaRegForm.patchValue({
          employee_name: tempEmpList,
        });
        this.selectedEmployee = tempEmpList;
        // this.kpaRegForm.patchValue({
        //   employee_name: [this.kpaEmp[0].employee_id]
        // });
        // this.selectedEmployee = [this.kpaEmp[0].employee_id];-
        this.getDepartmentEmployee(this.kpaEmp[0].applicable_department_id);
      } else if (this.applicableFor == 'Department_User') {
        this.department_user = false;
        this.department_and_user = true;
      }
    });
  }

  getAllObjective_dropDown() {
    this._hrmkpaService.getAllObjective_dropDown().subscribe((res: any) => {
      this.objectiveList = res.data;
      if (this.kpaId) {
        this.getByIdkpa();
      }
    });
  }

  onEditorReady(editor: ClassicEditor) {
    if (this.disableField) {
      editor.isReadOnly = true; // Set CKEditor to read-only mode
    }
  }

  filterWithDepartment: any;
  getAllDepartment_dropDown() {
    this._empRegistration
      .getAllDepartment_dropDown(this.entity_id)
      .subscribe((res) => {
        this.AllDepartment = res.data.filter(
          (res: any) => res.status === 'ACTIVE'
        );
        this.filterWithDepartment = [...this.AllDepartment];
      });
  }

  // Get all area start
  filterEmployeeData: any;
  getDepartmentEmployee(event: any) {
    this._hrmkpaService.getemployeeById(event).subscribe(
      (res: any) => {
        this.employeeList = [];
        this.employeeList = res.data;
        this.filterEmployeeData = [...this.employeeList];
        this.employeeNameList = this.getEmp(this.employeeList);
      },
      (err) => {
        this.toster.error(err.error.message);
        this.employeeList = [];
        this.selectedEmployee = '';
        this.kpaRegForm.get('employee_name')?.setValue([]);
      }
    );
  }

  onSelectedApplicable(event: any) {
    this.applicableFor = event;
    this.probationEmployee =
      this.applicableFor == 'Selected_User' ? false : true;
    if (event == 'Selected_User') {
      this.kpaRegForm
        .get('aplicable_department_id')
        ?.setValidators([Validators.required]);
      this.kpaRegForm.get('aplicable_department_id')?.updateValueAndValidity();
      this.kpaRegForm
        .get('employee_name')
        ?.setValidators([Validators.required]);
      this.kpaRegForm.get('employee_name')?.updateValueAndValidity();
      if (this.kpaRegForm.get('probation_employee')?.invalid) {
        this.kpaRegForm.get('probation_employee')?.setValue(false);
        this.kpaRegForm.get('probation_employee')?.setValidators([]);
        this.kpaRegForm.get('probation_employee')?.updateValueAndValidity();
      }
    } else {
      if (this.kpaRegForm.get('aplicable_department_id')?.invalid) {
        this.kpaRegForm.get('aplicable_department_id')?.setValue(null);
        this.kpaRegForm.get('aplicable_department_id')?.setValidators([]);
        this.kpaRegForm
          .get('aplicable_department_id')
          ?.updateValueAndValidity();
      }
      if (this.kpaRegForm.get('employee_name')?.invalid) {
        this.kpaRegForm.get('employee_name')?.setValue(null);
        this.kpaRegForm.get('employee_name')?.setValidators([]);
        this.kpaRegForm.get('employee_name')?.updateValueAndValidity();
      }
      this.kpaRegForm.get('probation_employee')?.setValue(false);
      // this.kpaRegForm.get('probation_employee')?.setValidators([Validators.required]);
      this.kpaRegForm.get('probation_employee')?.updateValueAndValidity();
    }
  }

  checkProbationEmployee(event: any) {
    if (event.checked) {
      this.probationEmployee = false;
    } else {
      this.probationEmployee = true;
    }
  }

  onReady(editor: any): void {
    this.editorInstance = editor;
    this.setEditorReadOnly();
  }

  private setEditorReadOnly(): void {
    if (this.editorInstance) {
      if (this.disableField) {
        this.editorInstance.enableReadOnlyMode('readonlyMode');
      } else {
        this.editorInstance.disableReadOnlyMode();
      }
    }
  }

  onSubmitKpa() {
    // if(this.kpaRegForm.invalid || this.probationEmployee){
    if (this.kpaRegForm.invalid) {
      Object.values(this.kpaRegForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      this.toster.error('All the fields should be valid');
      return;
    } else {
      // this.kpaRegForm.value.kpi_data = this.kpaRegForm.value.kpi_data.slice(3, -4); // removing p tags
      const payload = {
        endpoints: this.endpoints,
        body: this.kpaRegForm.value,
      };
      if (this.kpaId) {
        this._hrmkpaService
          .updateHrmKpa(this.kpaId, this.kpaRegForm.value)
          .subscribe(
            (res: any) => {
              this.toster.success(res.message);
              setTimeout(() => {
                this.router.navigate(['/master/performance/kpa-master']);
              }, 3000);
            },
            (err) => {
              this.toster.error(err.error.message);
            }
          );
      } else {
        this._hrmkpaService.createHrmKpa(payload).subscribe(
          (res: any) => {
            this.toster.success(res.message);
            setTimeout(() => {
              this.router.navigate(['/master/performance/kpa-master']);
            }, 3000);
          },
          (err) => {
            this.toster.error(err.error.message);
          }
        );
      }
    }
  }
}
