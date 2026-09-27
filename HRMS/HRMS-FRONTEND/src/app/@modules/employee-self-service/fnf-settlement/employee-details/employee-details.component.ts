import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FnfserviceServiceTsService } from 'src/app/@shared/services/fnfservice.service.ts.service';


@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employee_id: any;
  employeedetailsform: FormGroup;
  isEditMode: boolean = false;
   edited_ID:any

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fnfservice: FnfserviceServiceTsService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
  ) {}

  ngOnInit(): void {
    this.employeedetailsform = this.fb.group({
      employee_id: ['', Validators.required],
      employee_code: ['', Validators.required],
      employee_name: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      date_of_joining: ['', Validators.required],
      last_working_date: ['', Validators.required],
      resignation_type: ['', Validators.required],
      fnf_status: ['', Validators.required]
    });


     this.fnfservice.getEmpId().subscribe(
      (res: any) => {
        this.edited_ID = res 
      })
    this.activeroute.queryParamMap.subscribe(params => {
      this.employee_id = params.get('employee_id') || '';
      if (this.employee_id) {
        this.getFnfFullDataById(this.employee_id);
      }
    });

    
  }

  formatToMysqlDate(dateString: string): string {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  }

getFnfFullDataById(employee_id: any) {
  this.fnfservice.getFnfFullDataById(employee_id).subscribe({
    next: (res: any) => {
      if (res && res.data && res.data.employee_details) {
        const employeeData = res.data.employee_details;

        this.isEditMode = true; 

        this.employeedetailsform.patchValue({
          employee_id: employeeData.employee_id || '',
          employee_code: employeeData.employee_code || '',
          employee_name: employeeData.employee_name || '',
          department: employeeData.department_name || '',
          designation: employeeData.designation_name || '',
          date_of_joining: this.formatToMysqlDate(employeeData.date_of_joining),
          last_working_date: this.formatToMysqlDate(employeeData.last_working_day),
          resignation_type: employeeData.resignation_type || '',
          fnf_status: employeeData.fnf_status || 'PENDING'
        });

        console.log('Employee fetched:', employeeData);
      } else {
        this.toaster.info('Creating new employee FnF record');
        this.isEditMode = false;
      }
    },
    error: (err) => {
      console.error('Error fetching employee data:', err);
      this.toaster.error('Error fetching employee data');
    }
  });
}


  submit() {
    if (this.employeedetailsform.valid) {
      const raw = this.employeedetailsform.value;
      const employeeData = {
        employee_id: raw.employee_id,
        employee_name: raw.employee_name,
        department: raw.department,
        designation: raw.designation,
        date_of_joining: this.formatToMysqlDate(raw.date_of_joining),
        last_working_date: this.formatToMysqlDate(raw.last_working_date),
        resignation_type: raw.resignation_type,
        fnf_status: raw.fnf_status
      };

      const payload = {
        employee_details: employeeData
      };

      console.log('Submitting payload:', payload);

      const request$ = this.isEditMode
        ? this.fnfservice.updateFnfFullData(this.employee_id, payload)
        : this.fnfservice.createFnfFullData(payload);

      request$.subscribe({
        next: (res: any) => {
          const message = this.isEditMode ? 'Employee Details Updated' : 'Employee Details Saved';
          this.toaster.success(message);
          this.router.navigate(['/master/ess/fnf-settlement/common/earning-details'], {
            queryParams: { employee_id: employeeData.employee_id }
          });
        },
        error: (err) => {
          console.error('Error submitting data:', err);
          this.toaster.error(err?.error?.message || 'Error saving data');
        }
      });
    } else {
      this.toaster.warning('Please fill all required fields');
    }
  }
}
