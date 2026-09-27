import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { AttendenceDialogueComponent } from '../attendence-dialogue/attendence-dialogue.component';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {
  extraHourForm: FormGroup;
  id: any;
  actionType: any;
  entity_id: string | null;
  employee_login: any;
  formSubmitted = false;
  selectAll: boolean = false;
  selectedRows: boolean[] = [];
  selectedRowIds: number[] = [];
  selectedEmployee: any;
  employees: any[] = [];
  employeeList2: any;
  employeeslist: any;
  payroll_month:any;
  payroll_year:any;


  constructor(private _fb: FormBuilder, private toast: ToastrService,
     private router: Router,
     private $miscellaneous: MiscellaneousService,
    private ess_service: EmployeSelfService, 
    private activetedRoute: ActivatedRoute, 
    private dialog: MatDialog, 
    private services: AttendanceService,
    private cd: ChangeDetectorRef
  ) {
    this.extraHourForm = this._fb.group({
      employee_code: new FormControl(null, [Validators.required]),
      employee_id: new FormControl(null, [Validators.required]),
      department_name: new FormControl(null, [Validators.required]),
      department_id: new FormControl(null, [Validators.required]),
      approver_remark: new FormControl(null),
      entity_id: new FormControl(null),
      created_by: new FormControl(null),
      rows: this._fb.array([this.createRow()])
    })
  }
  ngOnInit(): void {
  this.entity_id = localStorage.getItem('selectedEntityId');
  let lg: any = localStorage.getItem('loginUserDetails');
  this.employee_login = JSON.parse(lg);
  
  this.activetedRoute.queryParams.subscribe((params: any) => {
    this.id = params.id;
    this.actionType = params.type;
    if (this.id) {
      this.get_requestById();
    }
    // if (this.actionType === 'approver') {
    //   this.rows.controls.forEach(row => {
    //     row.get('approve_hours')?.setValidators(Validators.required);
    //     row.get('approve_hours')?.updateValueAndValidity();
    //   });
    // }
    if (this.actionType == 'approver') {
  this.rows.controls.forEach(row => {
    row.get('approve_hours')?.setValidators(Validators.required);
    row.get('payroll_year')?.setValidators(Validators.required);
    row.get('payroll_month')?.setValidators(Validators.required);
    row.get('payroll_year')?.setValidators(Validators.required);
    row.updateValueAndValidity();
  });
}
    this.getFinancialYear();
  });

  this.loadEmployees();
  
  // if (this.employee_login && !this.id) {
  //   debugger
  //   let employeeData = this.employees.find(item => item.employee_id == this.employee_login?.employee_id);


  //   this.extraHourForm.patchValue({
  //     employee_code: this.employee_login?.employee_code,
  //     employee_id: this.employee_login?.employee_id,
  //     department_name: this.employee_login?.department_name,
  //     department_id: this.employee_login?.department_id
  //   });
  // }
}
  

  get rows() {
    return this.extraHourForm.get('rows') as FormArray;
  }

  createRow(): FormGroup {
  return this._fb.group({
    id: [null], // <-- Add this
    from_date: ['', Validators.required],
    from_time: ['', Validators.required],
    to_date: ['', Validators.required],
    to_time: ['', Validators.required],
    employee_remark: ['', Validators.required],
    total_hours: [''],
    approve_hours: [''],
    payroll_month: [''],
    payroll_year: [''],
    selected: [false],
  });
}



  addRow() {
    const lastRowIndex = this.rows.length - 1;
    const lastRow = this.rows.at(lastRowIndex);

    if (!lastRow.valid) {
      this.toast.error('Please fill the current row completely before adding a new one!');
      lastRow.markAllAsTouched();
      return;
    }

    const newRow = this.createRow();

    if (this.actionType === 'approver') {
      newRow.get('approve_hours')?.setValidators(Validators.required);
      newRow.get('payroll_year')?.setValidators(Validators.required);
      newRow.get('payroll_month')?.setValidators(Validators.required);
      newRow.get('approve_hours')?.setValidators(Validators.required);
      newRow.get('approve_hours')?.updateValueAndValidity();
    }

    this.rows.push(newRow);
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  calculateHours(index: number) {
    const row = this.rows.at(index);
    const fromDate = row.get('from_date')?.value;
    const fromTime = row.get('from_time')?.value;
    const toDate = row.get('to_date')?.value;
    const toTime = row.get('to_time')?.value;

    if (fromDate && fromTime && toDate && toTime) {
      const start = new Date(`${fromDate}T${fromTime}`);
      const end = new Date(`${toDate}T${toTime}`);

      if (end > start) {
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        row.get('total_hours')?.setValue(diff.toFixed(2));
      } else {
        this.toast.error('To Date and Time must be greater than From Date and Time!');
        row.get('to_date')?.setValue(null);
        row.get('to_time')?.setValue(null);
        row.get('total_hours')?.setValue('');
      }
    }
  }
months: { value: number; name: string; disabled?: boolean }[] = [
  { value: 1, name: 'January' },
  { value: 2, name: 'February' },
  { value: 3, name: 'March' },
  { value: 4, name: 'April' },
  { value: 5, name: 'May' },
  { value: 6, name: 'June' },
  { value: 7, name: 'July' },
  { value: 8, name: 'August' },
  { value: 9, name: 'September' },
  { value: 10, name: 'October' },
  { value: 11, name: 'November' },
  { value: 12, name: 'December' }
];


currentMonth = new Date().getMonth() + 1; 
currentYear = new Date().getFullYear();

updateMonthsDisable(selectedYear: number,i:any) {
  const row = this.rows.at(i) as FormGroup;
  if (row) {
    row.get('payroll_month')?.reset(null);
  }
  selectedYear = Number(selectedYear); 

  
  this.months = this.months.map(m => ({
    ...m,
    disabled: selectedYear === this.currentYear ? m.value < this.currentMonth : false
  }));

 
  
}


financialYearList: any = [];
  getFinancialYear() {

    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        this.financialYearList = res?.data;
        this.financialYearList?.map((item: any) => item.financial_year = item?.financial_year)
      }      
    })
  }

// financialYearList: any = [];

// getFinancialYear() {
//   const currentYear = new Date().getFullYear();

//   this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
//     if (res) {
//       this.financialYearList = res?.data
//         ?.filter(
//           (item: any) =>
//             item.financial_year === currentYear ||
//             item.financial_year === currentYear + 1
//         )
//         .map((item: any) => ({
//           ...item,
//           financial_year: item.financial_year   // force number
//         }));
//     }
//   });
// }



  onSubmitForm() {
    this.formSubmitted = true;

    if (this.actionType !== 'approver') {
      this.rows.controls.forEach(row => {
        const total = row.get('total_hours')?.value;
        const approve = row.get('approve_hours')?.value;

        if (!approve) {
          row.get('approve_hours')?.setValue(total);
        }
      });
    }

    if (this.extraHourForm.invalid) {
  console.log('%cForm is invalid. Details:', 'color: red');

  Object.keys(this.extraHourForm.controls).forEach(controlName => {
    const control = this.extraHourForm.get(controlName);
    if (control instanceof FormControl && control.invalid) {
      console.log(`Main control "${controlName}" is invalid:`, control.errors);
    }
  });

  this.rows.controls.forEach((row:any, idx) => {
    Object.keys(row.controls).forEach(field => {
      const control = row.get(field);
      if (control && control.invalid) {
        console.log(`Row[${idx}] field "${field}" is invalid:`, control.errors);
      }
    });
  });

  this.toast.error('All fields required!');
  return;
}
    let val = this.extraHourForm.value;
    val.entity_id = this.entity_id;
    val.employee_id = val?.employee_id;
    val.department_id = val?.department_id;
    val.created_by = this.employee_login?.employee_id;
    

     if (this.actionType === 'edit') {
   val.id = this.id
    this.ess_service.update_OvertimeRequest(val).subscribe(
      (res: any) => {
        if (res) {
          this.toast.success(res.message);
          this.goBack();
        }
      },
      (err: any) => {
        this.toast.error(err.error.message);
      }
    );
  } else {
    
    this.ess_service.create_OvertimeRequest(val).subscribe(
      (res: any) => {
        if (res) {
          this.toast.success(res.message);
          this.goBack();
        }
      },
      (err: any) => {
        this.toast.error(err.error.message);
      }
    );
  }
  }


  get_requestById() {
    let status;
    let employee_id = 0;
    if (this.actionType == 'approver' || this.actionType == 'edit' || this.actionType == 'PENDING') {
      status = 'PENDING'
    } else if (this.actionType == 'APPROVED') {
      status = 'APPROVED'
      employee_id = this.employee_login.employee_id;
    } else {
      status = 'REJECTED'
      employee_id = this.employee_login.employee_id;
    }
    this.ess_service.get_requestById(this.id, employee_id).subscribe((res: any) => {
      if (res) {
        this.patchData(res.data)
      }
    }, (err: any) => {

    })
  }
  employee_id: any;
  created_by: any;
  approver_Data: any = [];
 patchData(data: any) {
  let request = data.request;
  let request_details = data.request_details;
  this.approver_Data = data?.Approver_details;
  this.employee_id = request.employee_id;
  this.created_by = request.created_by;

  if (request) {
    this.extraHourForm.patchValue({
      employee_code: request.employee_code,
      employee_name: request?.employee_id,
      department_name: request?.department_name,
      department_id: request?.department_id,
      employee_id: request.employee_id,
      created_by: request.created_by,
      payroll_month: request.payroll_month,
      payroll_year: request.payroll_year,
      entity_id: request.entity_id,
      approver_remark: request.approver_remark
    });
  }
  if (request_details && request_details.length) {
    const rowsFormArray = this.extraHourForm.get('rows') as FormArray;
    rowsFormArray.clear();

    request_details.forEach((row: any) => {
      const rowGroup = this.createRow();
      rowGroup.patchValue({
        id: row.id,   // <-- keep id
        from_date: row.from_date,
        from_time: row.from_time,
        to_date: row.to_date,
        to_time: row.to_time,
        payroll_month: row.payroll_month,
        payroll_year: row.payroll_year,
        employee_remark: row.employee_remark,
        total_hours: row.total_hour,
        approve_hours: row.approve_hours ?? row.total_hour,
        selected: false,
      });
      rowsFormArray.push(rowGroup);
    });
  }
}
  //  this.extraHourForm.get('rows')
  // }
  goBack() {
    this.router.navigate(['/master/ess/overtime-request'])
  }
  toggleAllSelection(): void {
    this.selectedRowIds = [];
    this.selectedRows = this.rows.controls.map((_, index) => {
      if (this.selectAll) {
        this.selectedRowIds.push(index);
      }
      return this.selectAll;
    });
  }

 updateSelectedRows(index: number): void {
  const row = this.rows.at(index);
  const isSelected = row.get('selected')?.value === true;

  if (isSelected && !this.selectedRowIds.includes(index)) {
    this.selectedRowIds.push(index);  // store index instead of row.value
  } else if (!isSelected && this.selectedRowIds.includes(index)) {
    this.selectedRowIds = this.selectedRowIds.filter(i => i !== index);
  }
}


onApproveOrReject(status: any) {
  let val = this.extraHourForm.value;
      console.log( this.extraHourForm.value,'HHHHHHHHHHHHHHHHH666666666666666666666666')


  if (!val.approver_remark) {
    this.toast.error('Remark is required!');
    return;
  }

  
  const row = this.rows.at(0).value;

  if (!row.payroll_year) {
    this.toast.error('Payroll year is required!');
    return;
  }
  if (!row.payroll_month) {
    this.toast.error('Payroll month is required!');
    return;
  }

  let data1: any = {
    selectedId: [row],   
    status: status,
    entity_id: this.entity_id,
    employee_id: this.employee_id,
    created_by: this.created_by,
    approver_remark: val.approver_remark,
    request_id: this.id
  };

  this.ess_service.approveORReject_Request(data1).subscribe(
    (res: any) => {
      if (res) {
        if (status === 'APPROVED') {
          this.toast.success('Request approved successfully!');
        } else {
          this.toast.success('Request rejected successfully!');
        }
        this.goBack();
      }
    },
    (err: any) => {
      this.toast.error(err.error.message);
    }
  );
}






  viewAttendance = (index: any) => {
    const row = this.rows.at(index);
    let val = row.value;
    let data = {
      from_date: val?.from_date,
      to_date: val?.to_date,
      employee_id: this.employee_id
    }
    const dialogRef = this.dialog.open(AttendenceDialogueComponent, {
      width: '30%',
      data: data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
    })
  }
  keyUpHour(e: any, i: any) {
    const row = this.rows.at(i);
    let val = row.value;
    const approve = Number(val.approve_hours);
    const total = Number(val.total_hours);

    if (approve > total) {
      this.toast.error("Approve hour can not be greater than total hour!");
      row.get('approve_hours')?.setValue(total);
      return;
    }

  }
  employeeSearch(e: any) {
    const aa = e
    let filteredVariable = this.employeeList2.filter((item: any) => aa.includes(item.first_name + ' ' + item.last_name));
    this.employees = filteredVariable
  }

onEmployeeChange(event: any) {
  const employee_id = event?.value ?? event;
  const employee_data = this.employees.find(
    (res: any) => res.employee_id == employee_id
  );

  if (employee_data) {
    this.extraHourForm.patchValue({
      employee_code: employee_data?.employee_code,
      employee_id: employee_data?.employee_id,
      department_name: employee_data?.department_name,
      department_id: employee_data?.dept_id 
    });
  } else {
    console.warn('No employee data found for ID:', employee_id);
  }
}

  loadEmployees() {
    let selectedEntityId = localStorage.getItem('selectedEntityId');
    this.services.get_all_employe(selectedEntityId)
      .subscribe(
        response => {
          console.log('Employee Data:', response);
          if (response && response.data) {

            this.employees = response.data;
            this.employeeList2 = response.data;
            this.employeeslist = this.employeeList2.map((res: any) => `${res.first_name} ${res.last_name}`);
            if (this.employee_login && !this.id) {
              let employeeData = this.employees.find(item => item.employee_id == this.employee_login?.employee_id);
              this.extraHourForm.patchValue({
                employee_code: employeeData?.employee_code,
                employee_id: employeeData?.employee_id,
                department_name: employeeData?.department_name,
                department_id: employeeData?.dept_id
              });
            }

          } else {
            console.error('No employee data found.');
          }
        },
        error => {
          console.error('Error fetching employee data:', error);
        }
      );
  }
}
