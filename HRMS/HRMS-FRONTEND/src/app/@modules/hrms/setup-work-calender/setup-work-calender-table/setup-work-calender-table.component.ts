import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { WorkSetupService } from 'src/app/@shared/services/service/hrmServices/Work-setup-service.service';

@Component({
  selector: 'app-setup-work-calender-table',
  templateUrl: './setup-work-calender-table.component.html',
  styleUrls: ['./setup-work-calender-table.component.scss'],
})
export class SetupWorkCalenderTableComponent {
  attForm: FormGroup;
  userdata: any = [];
  router: any;
  selectedEmployee: any;
  AllDepartment: any = [];
  employeeList: any = [];
  employeeNameList: any;
  entity: any;
  employeeListName: string;
  id: any;
  allData: any;
  dept_id: any;
  originalEmployeeList: any[] = [];
  originalDepartmentList: any[] = [];
  selectedEntityId: any;
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  selectedMonth: string = this.months[new Date().getMonth()];
  employeeList2: any;
  employees: any;
  isAllSelect: boolean = false;

  constructor(
    private fb: FormBuilder,
    private language_service: LanguageTranslateService,
    private _empRegistration: EmpRegistrationService,
    private services: WorkSetupService,
    private http: HttpClient,
    private _hrmkpaService: HrmServiceService,
    private toast: ToastrService
  ) {
    this.attForm = this.fb.group({
      dept_id: [null, Validators.required],
      employee_id: [[]],
    });
  }

  ngOnInit() {
    this.languageSwitch();
    this.checkGet();
    this.getAllDepartment_dropDown();
    this.entity = localStorage.getItem('selectedEntityId');
    const department_id = parseInt(
      localStorage.getItem('department_id') || '0'
    );
    this.getDepartmentEmployee(department_id);
    this.getAll();
  }

  calenderList: any = [
    {
      week_name: 'Sunday',
      allCheck: false,
      firstCheck: false,
      week_1st: null,

      secondCheck: false,
      week_2nd: null,

      thirdCheck: false,
      week_3rd: null,

      fourthCheck: false,
      week_4th: null,

      fifthCheck: false,
      week_5th: null,
    },
    {
      week_name: 'Monday',
      allCheck: false,
      firstCheck: false,
      week_1st: null,

      secondCheck: false,
      week_2nd: null,

      thirdCheck: false,
      week_3rd: null,

      fourthCheck: false,
      week_4th: null,

      fifthCheck: false,
      week_5th: null,
    },
    {
      week_name: 'Tuesday',
      allCheck: false,
      firstCheck: false,
      week_1st: null,

      secondCheck: false,
      week_2nd: null,

      thirdCheck: false,
      week_3rd: null,

      fourthCheck: false,
      week_4th: null,

      fifthCheck: false,
      week_5th: null,
    },
    {
      week_name: 'Wednesday',
      allCheck: false,
      firstCheck: false,
      week_1st: null,

      secondCheck: false,
      week_2nd: null,

      thirdCheck: false,
      week_3rd: null,

      fourthCheck: false,
      week_4th: null,

      fifthCheck: false,
      week_5th: null,
    },
    {
      week_name: 'Thursday',
      allCheck: false,
      firstCheck: false,
      week_1st: null,

      secondCheck: false,
      week_2nd: null,

      thirdCheck: false,
      week_3rd: null,

      fourthCheck: false,
      week_4th: null,

      fifthCheck: false,
      week_5th: null,
    },
    {
      week_name: 'Friday',
      allCheck: false,
      firstCheck: false,
      week_1st: null,

      secondCheck: false,
      week_2nd: null,

      thirdCheck: false,
      week_3rd: null,

      fourthCheck: false,
      week_4th: null,

      fifthCheck: false,
      week_5th: null,
    },
    {
      week_name: 'Saturday',
      allCheck: false,
      firstCheck: false,
      week_1st: null,

      secondCheck: false,
      week_2nd: null,

      thirdCheck: false,
      week_3rd: null,

      fourthCheck: false,
      week_4th: null,

      fifthCheck: false,
      week_5th: null,
    },
  ];

  checkAll(day: any) {
    day.firstCheck = day.allCheck;
    day.secondCheck = day.allCheck;
    day.thirdCheck = day.allCheck;
    day.fourthCheck = day.allCheck;
    day.fifthCheck = day.allCheck;

    if (day.allCheck) {
      day.week_1st = 'Full Day';
      day.week_2nd = 'Full Day';
      day.week_3rd = 'Full Day';
      day.week_4th = 'Full Day';
      day.week_5th = 'Full Day';
    } else {
      day.week_1st = null;
      day.week_2nd = null;
      day.week_3rd = null;
      day.week_4th = null;
      day.week_5th = null;
    }
    this.updateDropdowns(day);
  }

  toggleCheckbox(day: any) {
    day.allCheck =
      day.firstCheck &&
      day.secondCheck &&
      day.thirdCheck &&
      day.fourthCheck &&
      day.fifthCheck;
    if (day.allCheck) {
      day.week_1st = 'Full Day';
      day.week_2nd = 'Full Day';
      day.week_3rd = 'Full Day';
      day.week_4th = 'Full Day';
      day.week_5th = 'Full Day';
    } else {
      day.week_1st = day.firstCheck ? day.week_1st || 'Full Day' : null;
      day.week_2nd = day.secondCheck ? day.week_2nd || 'Full Day' : null;
      day.week_3rd = day.thirdCheck ? day.week_3rd || 'Full Day' : null;
      day.week_4th = day.fourthCheck ? day.week_4th || 'Full Day' : null;
      day.week_5th = day.fifthCheck ? day.week_5th || 'Full Day' : null;
    }
    this.updateDropdowns(day);
  }

  updateDropdowns(day: any) {
    day.dropdownDisabled_1st = !day.firstCheck;
    day.dropdownDisabled_2nd = !day.secondCheck;
    day.dropdownDisabled_3rd = !day.thirdCheck;
    day.dropdownDisabled_4th = !day.fourthCheck;
    day.dropdownDisabled_5th = !day.fifthCheck;
  }
  selectedOption: string;

  languageFlag: 'en' | 'pt' = 'en';
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');

  translations = {
    en: {
      pageTitle: 'HRMS',
      master: 'Setup-Work-Calender',
      masterTable: 'Setup-Work-Calender-Table',
    },
    pt: {
      pageTitle: 'HRMS',
      master: 'Configuração-Calendário de Trabalho',
      masterTable: 'Configuração-Tabela-Calendário-Trabalho',
      placeholder: 'Pesquisar',
      addButton: 'Adicionar',
    },
  };

  languageSwitch() {
    this.language_service.data$.subscribe((languagetype: any) => {
      this.languageFlag = languagetype || 'en';
      this.languageSubject.next(this.languageFlag);
    });
  }

  translate(
    key: keyof (typeof SetupWorkCalenderTableComponent.prototype.translations)['en']
  ): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }

  submitForm() {
    let entity_id = localStorage.getItem('selectedEntityId');
    let financial_id = localStorage.getItem('financial_id');
    let createdBy = localStorage.getItem('EmpMainId');
    let dept_id = this.attForm.get('dept_id')?.value;
    let employee_id = this.attForm.get('employee_id')?.value;

    // Validation: Prevent submission if dept_id or employee_id is missing
    if (!dept_id || !employee_id) {
      this.toast.error(
        'Please select a department and an employee before submitting.'
      );
      return;
    }

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const currentMonth = new Date().getMonth();

    let req = {
      financial_year_id: Number(financial_id),
      entity_id: Number(entity_id),
      createdBy: Number(createdBy),
      month_name: currentMonth,
      weekDetails: this.calenderList,
      dept_id: dept_id,
      employee_id: employee_id,
    };

    this.services.createSetupWorkCalendder(req).subscribe(
      (response: any) => {
        this.toast.success('Work Calendar Created Successfully');
      },
      (error: any) => {
        console.error('API Error:', error);
      }
    );
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

  filteractivedepartment: any;
  getAllDepartment_dropDown() {
    let entity = localStorage.getItem('selectedEntityId');
    this._empRegistration.getAllDepartment_dropDown(entity).subscribe((res) => {
      const activeDepartments = res.data.filter(
        (res: any) => res.status === 'ACTIVE'
      );
      this.AllDepartment = activeDepartments;
      this.filteractivedepartment = [...this.AllDepartment];
      this.originalDepartmentList = [...activeDepartments];
    });
  }

  filterThedepartment(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!Array.isArray(this.originalDepartmentList)) {
      return;
    }
    if (!searchValue) {
      this.AllDepartment = [...this.originalDepartmentList];
    } else {
      this.AllDepartment = this.originalDepartmentList.filter((item: any) =>
        item.department_name?.toLowerCase().includes(searchValue)
      );
    }
  }

  getEmp = (empList: any) => {
    this.employeeListName = '';
    empList.forEach((empName: any) => {
      Object.values(this.attForm.controls).forEach((empId: any) => {
        if (empId.value.employee_id == empName.employee_id) {
          this.employeeListName +=
            empName.first_name + ' ' + empName.last_name + ',';
        }
      });
    });
    if (this.employeeListName.length >= 2) {
      this.employeeListName = this.employeeListName.slice(0, -1);
    }
  };

  filterEmployeedata: any;
  getDepartmentEmployee(event: any) {
    this.dept_id = event;
    this._hrmkpaService.getemployeeById(this.dept_id).subscribe(
      (res: any) => {
        this.employeeList = res.data;
        this.filterEmployeedata = [...this.employeeList];
        this.originalEmployeeList = [...this.employeeList];
        this.employeeList2 = res.data;
        this.employeeList2.forEach((res: any, index: number) => {
          if (!res || res.employee_id == null) {
            console.warn(`Invalid employee at index ${index}:`, res);
          }
        });
        this.employees = (this.employeeList2 || [])
          .filter((emp: any) => emp && emp.employee_id != null)
          .map((emp: any) => emp.employee_id);
        this.employeeNameList = this.getEmp(this.employeeList);
        this.checkIfAllSelected();
        this.getAll();
      },
      (err) => {
        this.toast.error(err.error.message);
        this.employeeList = [];
        this.selectedEmployee = '';
        this.attForm.get('employee_name')?.setValue([]);
      }
    );
  }

  selectAllEmployee(event: MatCheckboxChange) {
    console.log('Checkbox Event: ', event);
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      const allEmployeeIds = this.employeeList.map(
        (emp: any) => emp.employee_id
      );
      this.attForm.controls['employee_id'].setValue(allEmployeeIds);
    } else {
      this.attForm.controls['employee_id'].setValue([]);
    }
  }

  employeeSearch(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!Array.isArray(this.employeeList2)) {
      console.error('employeeList2 is not an array or is undefined');
      return;
    }
    this.employeeList = this.employeeList2.filter((item: any) =>
      item.first_name.toLowerCase().includes(searchValue)
    );
    console.log('Filtered Employee List:', this.employeeList);
  }

  checkIfAllSelected() {
    const selectedEmployees = this.attForm.get('employee_id')?.value || [];
    this.isAllSelect = selectedEmployees.length === this.employeeList.length;
  }

  getAll() {
    const defaultGrid = [
      {
        week_name: 'Sunday',
        allCheck: false,
        firstCheck: false,
        week_1st: null,
        secondCheck: false,
        week_2nd: null,
        thirdCheck: false,
        week_3rd: null,
        fourthCheck: false,
        week_4th: null,
        fifthCheck: false,
        week_5th: null,
      },
      {
        week_name: 'Monday',
        allCheck: false,
        firstCheck: false,
        week_1st: null,
        secondCheck: false,
        week_2nd: null,
        thirdCheck: false,
        week_3rd: null,
        fourthCheck: false,
        week_4th: null,
        fifthCheck: false,
        week_5th: null,
      },
      {
        week_name: 'Tuesday',
        allCheck: false,
        firstCheck: false,
        week_1st: null,

        secondCheck: false,
        week_2nd: null,

        thirdCheck: false,
        week_3rd: null,

        fourthCheck: false,
        week_4th: null,

        fifthCheck: false,
        week_5th: null,
      },
      {
        week_name: 'Wednesday',
        allCheck: false,
        firstCheck: false,
        week_1st: null,

        secondCheck: false,
        week_2nd: null,

        thirdCheck: false,
        week_3rd: null,

        fourthCheck: false,
        week_4th: null,

        fifthCheck: false,
        week_5th: null,
      },
      {
        week_name: 'Thursday',
        allCheck: false,
        firstCheck: false,
        week_1st: null,

        secondCheck: false,
        week_2nd: null,

        thirdCheck: false,
        week_3rd: null,

        fourthCheck: false,
        week_4th: null,

        fifthCheck: false,
        week_5th: null,
      },
      {
        week_name: 'Friday',
        allCheck: false,
        firstCheck: false,
        week_1st: null,

        secondCheck: false,
        week_2nd: null,

        thirdCheck: false,
        week_3rd: null,

        fourthCheck: false,
        week_4th: null,

        fifthCheck: false,
        week_5th: null,
      },
      {
        week_name: 'Saturday',
        allCheck: false,
        firstCheck: false,
        week_1st: null,
        secondCheck: false,
        week_2nd: null,
        thirdCheck: false,
        week_3rd: null,
        fourthCheck: false,
        week_4th: null,
        fifthCheck: false,
        week_5th: null,
      },
    ];
    if (!this.dept_id) {
      console.log('No department selected, resetting calendar data.');
      this.calenderList = defaultGrid;
      return;
    }
    this.id =
      this.dept_id || parseInt(localStorage.getItem('department_id') || '0');
    let entity = localStorage.getItem('selectedEntityId');
    if (entity) {
      this.selectedEntityId = parseInt(entity, 10);
    } else {
      console.error('No selectedEntityId found in localStorage');
      return;
    }
    this.services
      .getDepartmentWiseData(this.id, this.selectedEntityId)
      .subscribe(
        (res: any) => {
          this.userdata = res.data;
          this.calenderList = this.userdata;
          this.checkGet();
          console.log('Fetched User Data:', this.userdata);
          if (!this.userdata || this.userdata.length === 0) {
            console.log('No employees found, setting default grid.');
            this.calenderList = defaultGrid;
            return;
          }
          const newDeptId = Number(this.userdata[0]?.dept_id);
          if (newDeptId && newDeptId !== this.id) {
            console.log(
              'Updating department ID from',
              this.id,
              'to',
              newDeptId
            );
            this.id = newDeptId;
          }
          const employeeIds = this.userdata[0]?.employee_ids;
          if (Array.isArray(employeeIds) && employeeIds.length > 0) {
            this.attForm.patchValue({
              dept_id: this.id,
              employee_id: employeeIds,
            });
            const selectedEmployees = this.userdata.filter((emp: any) =>
              employeeIds.includes(emp.employee_id)
            );
            const selectedEmployeeNames = selectedEmployees.map(
              (emp: any) => `${emp.first_name} ${emp.last_name}`
            );
            this.attForm.patchValue({
              employee_name: selectedEmployeeNames.join(', '),
            });
            setTimeout(() => this.checkIfAllSelected(), 500);
          } else {
            console.log(
              'No employees found in this department, setting default grid.'
            );
            this.calenderList = defaultGrid;
          }
        },
        (err) => {
          console.error('Error fetching employees:', err);
          this.calenderList = defaultGrid;
        }
      );
  }

  checkGet() {
    const modify: any = [];
    this.calenderList?.map((main: any) => {
      if (
        main?.week_name === 'Sunday' ||
        main?.week_name === 'Monday' ||
        main?.week_name === 'Tuesday' ||
        main?.week_name === 'Wednesday' ||
        main?.week_name === 'Thursday' ||
        main?.week_name === 'Friday' ||
        main?.week_name === 'Saturday'
      ) {
        main.allCheck =
          main?.week_1st &&
          main?.week_2nd &&
          main?.week_3rd &&
          main?.week_4th &&
          main?.week_5th;
        main.firstCheck = !!main?.week_1st;
        main.secondCheck = !!main?.week_2nd;
        main.thirdCheck = !!main?.week_3rd;
        main.fourthCheck = !!main?.week_4th;
        main.fifthCheck = !!main?.week_5th;
        this.updateDropdowns(main);
      }
    });
  }
}
