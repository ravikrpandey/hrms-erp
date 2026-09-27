import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-create-digital-signature',
  templateUrl: './create-digital-signature.component.html',
  styleUrls: ['./create-digital-signature.component.scss'],
})
export class CreateDigitalSignatureComponent {
  digitalform: FormGroup;
  signatureError: string = '';
  rowData: any;
  getAllData: any;
  employeeFilterCtrl = new FormControl();
  filteredEmployees: Observable<any[]>;
  employees: any;
  fileDetails: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,
  };
  mainData: any;
  digitalSignaturedata: any;
  entity_id: string | null;
  departments: any;
  signaturePreview: string | null = null;
  showOldSignaturePreview: boolean = true;
  baseUrl: string = environment.serverUrl;
  status: string = '';

  constructor(
    private fb: FormBuilder,
    private _empService: EmpRegistrationService,
    private toast: ToastrService,
    private route: Router,
    private activetedRoute: ActivatedRoute,
    private hrmsService: HrmServiceService
  ) {
    this.digitalform = this.fb.group({
      department: [null, Validators.required],
      employee: [null, Validators.required],
      digital_signature: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activetedRoute.params.subscribe((params) => {
      this.mainData = params['id'];
    });

    if (this.mainData) {
      this.digitalform.get('employee')?.disable();
      this.digitalform.get('department')?.disable();
    } else {
      this.digitalform.get('employee')?.enable();
      this.digitalform.get('department')?.enable();
    }

    localStorage.setItem('employee_id:', 'undefined');
    const signInUserData = localStorage.getItem('signInUser');

    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
    }
    this._empService.getAllRegisterUserDigSign().subscribe((res: any) => {
      this.employees = res.data;
      this.employees = res.data
        .filter((emp: any) => emp.status === 'ACTIVE')
        .map((emp: any) => ({
          ...emp,
          full_name: `${emp.first_name} ${emp.last_name || ''}`.trim(),
        }));
      this.getdigitalSignatureById(this.mainData);
    });

    this.getAllDepartments();
  }

  getAllDepartments() {
    this.hrmsService.getAllDepartments(this.entity_id).subscribe({
      next: (res: any) => {
        this.departments = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.departments = [];
        } else {
          console.error('Error fetching report:', err);
        }
      },
    });
  }

  onDepartmentChange(deptId: number) {
    const filtered = this.employees.filter(
      (emp: any) => emp.department_id === deptId && emp.status === 'ACTIVE'
    );
    this.filteredEmployees = this.employeeFilterCtrl.valueChanges.pipe(
      startWith(''),
      map((search) =>
        search ? this.filterEmployees(search, filtered) : filtered.slice()
      )
    );
    this.digitalform.get('employee')?.reset();
  }

  getdigitalSignatureById(mainData: any) {
    this._empService.digitalSignatureDetailById(mainData).subscribe(
      (res: any) => {
        if (res?.code === 200 && res?.data?.length > 0) {
          const signature = res.data[0];
          const matchingEmployee = this.employees.find(
            (emp: any) => emp.employee_id === signature.employee_id
          );

          const departmentId =
            matchingEmployee?.department_id || signature.department_id;
          this.digitalform.patchValue({
            department: departmentId,
          });
          this.onDepartmentChange(departmentId);

          this.digitalform.patchValue({
            employee: matchingEmployee || null,
            digital_signature: signature.digital_signature,
          });
          this.status = res.data[0]?.status;
          this.signaturePreview = signature.digital_signature.replace(
            /\\/g,
            '/'
          );
          this.showOldSignaturePreview = true;
        }
      },
      (error) => {
        console.error('Error fetching digital signature details:', error);
      }
    );
  }

  filterEmployees(search: string, list: any[] = this.employees): any[] {
    const term = search.toLowerCase();
    return list.filter((emp) => emp.full_name.toLowerCase().includes(term));
  }

  fileInputChange(event: any) {
    this.signatureError = '';
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      const sizeInKB = file.size / 1024;

      if (sizeInKB < 4 || sizeInKB > 50) {
        this.signatureError = 'Signature size must be between 4KB and 50KB!';
        this.fileDetails = { filePath: '', file: null };
        this.digitalform.get('digital_signature')?.setValue(null);
        return;
      }

      reader.onload = () => {
        this.fileDetails.filePath = reader.result;
      };
      reader.readAsDataURL(file);

      this.fileDetails.file = file;
      this.digitalform.get('digital_signature')?.setValue(file);

      this.showOldSignaturePreview = false;
    } else {
      this.fileDetails = { filePath: '', file: null };
    }
  }

  onSubmit() {
    const formValue = this.digitalform.value;
    this.digitalform.markAllAsTouched();
    if (!this.digitalform.valid) {
      return;
    }
    const data = {
      employee_id: formValue.employee.employee_id,
      employee_name: formValue.employee.full_name,
      department_id: formValue.department,
      digital_signature: formValue.digital_signature?.name || '',
      baseUrl: this.baseUrl + '/',
    };
    this._empService.createEmpSignature(data, this.fileDetails.file).subscribe(
      (res: any) => {
        this.toast.success('Signature uploaded successfully!');
        this.route.navigate([
          '/master/hrms/employee-master/employee-digital-signature',
        ]);
      },
      (error: any) => {
        this.toast.error(error.error.message);
      }
    );
  }

  updateSignature() {
    let formValue = this.digitalform.value;
    let data = {
      digital_signature: formValue.digital_signature?.name || '',
      baseUrl: this.baseUrl + '/',
    };
    this._empService
      .updateEmpSignature(this.mainData, data, this.fileDetails.file)
      .subscribe(
        (res: any) => {
          this.toast.success('Digital signature updated successfully!');
          this.route.navigate([
            '/master/hrms/employee-master/employee-digital-signature',
          ]);
        },
        (error: any) => {
          this.toast.error(error.error.message);
        }
      );
  }

  resubmitSignature() {
    let formValue = this.digitalform.value;
    let data = {
      digital_signature: formValue.digital_signature?.name || '',
      status: 'Resubmit',
      remark: '',
      baseUrl: this.baseUrl + '/',
    };

    this._empService
      .updateEmpSignature(this.mainData, data, this.fileDetails.file)
      .subscribe(
        (res: any) => {
          this.toast.success('Digital signature resubmitted successfully!');
          this.route.navigate([
            '/master/hrms/employee-master/employee-digital-signature',
          ]);
        },
        (error: any) => {
          this.toast.error(error.error.message);
        }
      );
  }
}
