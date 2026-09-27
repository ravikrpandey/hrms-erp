import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { DocManagSystemServices } from '../../doc-manag-system-services';

@Component({
  selector: 'app-document-management-dialog',
  templateUrl: './document-management-dialog.html',
  styleUrls: ['./document-management-dialog.scss'],
})
export class DocumentManagementDialog implements OnInit {
  docForm!: FormGroup;
  mainId: string | null = null;
  id: any = null;
  entity_id: string | null = null;
  uploadedBy: string;
  isAllSelectDepartment = false;
  isDisabled = false;
  allRoleMaster: any[] = [];
  loginUser: any = null;
  assignDesignationArr1: any[] = [];
  assignDesignationArr2: any[] = [];
  stateVar: any[] = [];
  stateVar2: any[] = [];
  showDepartment = false;
  showEmployee = false;
  showDesignation = false;
  showState = false;

  isDragOver = false;
  uploadedFiles: File[] = [];

  categories: string[] = [
    'Employee-related',
    'Company Policies',
    'Compliance Documents',
    'Training & Performance',
  ];

  getAllDepartment: any[] = [];
  getAllDepartment2: any[] = [];
  departments: string[] = [];

  StateDataList: any[] = [];
  employeeList: any[] = [];
  employeeList2: any[] = [];
  selectedDepartment: any[] = [];

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _commonService: CommonService,
    private toast: ToastrService,
    private dialogRef: MatDialogRef<DocumentManagementDialog>,
    private _docmanagsystemservices: DocManagSystemServices,
    private _empRegistration: EmpRegistrationService,
    private _hrmkpaService: HrmServiceService,
    private $miscellaneous: MiscellaneousService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);

    this.getAllRoleMaster();
    this.getStateList();
    this.getAllDepartment_dropDown();
  }

  private initializeForm(): void {
    this.docForm = this.fb.group({
      document_category: ['', Validators.required],
      department_list: [[]],
      employee_id: [''],
      role_master_id: [''],
      states_id: [''],
      version: ['1.0', Validators.required],
      upload_document: [null],
    });
  }

  onCategoryChange(category: string) {
    this.showDepartment = false;
    this.showEmployee = false;
    this.showDesignation = false;
    this.showState = false;

    // Reset dependent fields
    this.docForm.patchValue({
      department_list: [],
      employee_id: '',
      role_master_id: '',
      states_id: '',
    });

    // Clear validators first
    const departmentControl = this.docForm.get('department_list');
    const employeeControl = this.docForm.get('employee_id');
    const designationControl = this.docForm.get('role_master_id');
    const stateControl = this.docForm.get('states_id');

    departmentControl?.clearValidators();
    employeeControl?.clearValidators();
    designationControl?.clearValidators();
    stateControl?.clearValidators();

    // Set visibility and validators based on category
    switch (category) {
      case 'Employee-related':
        this.showDepartment = true;
        this.showEmployee = true;
        departmentControl?.setValidators([Validators.required]);
        employeeControl?.setValidators([Validators.required]);
        break;
      case 'Company Policies':
        this.showDepartment = true;
        this.showDesignation = true;
        departmentControl?.setValidators([Validators.required]);
        designationControl?.setValidators([Validators.required]);
        break;
      case 'Compliance Documents':
        this.showState = true;
        this.showDesignation = true;
        stateControl?.setValidators([Validators.required]);
        designationControl?.setValidators([Validators.required]);
        break;
      case 'Training & Performance':
        this.showDepartment = true;
        this.showEmployee = true;
        departmentControl?.setValidators([Validators.required]);
        employeeControl?.setValidators([Validators.required]);
        break;
    }

    // Update validity
    departmentControl?.updateValueAndValidity();
    employeeControl?.updateValueAndValidity();
    designationControl?.updateValueAndValidity();
    stateControl?.updateValueAndValidity();
  }

  dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  dragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  dropFile(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length) {
      this.addFiles(files);
    }
  }

  uploadFile(event: any) {
    const files = event.target.files as FileList;
    if (files && files.length) {
      this.addFiles(files);
      event.target.value = '';
    }
  }

  private addFiles(fileList: FileList | File[]) {
    const maxSizeBytes = 50 * 1024 * 1024; // 50 MB
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(ext)) {
        this.toast.error(`${file.name} is not a supported file type`, 'Invalid File');
        continue;
      }

      if (file.size > maxSizeBytes) {
        this.toast.error(`${file.name} exceeds 50MB limit`, 'File too large');
        continue;
      }

      this.uploadedFiles.push(file);
    }

    this.docForm.patchValue({ upload_document: this.uploadedFiles.length > 0 ? 'files' : null });
  }

  removeFile(index: number) {
    if (index >= 0 && index < this.uploadedFiles.length) {
      this.uploadedFiles.splice(index, 1);
      this.docForm.patchValue({ upload_document: this.uploadedFiles.length > 0 ? 'files' : null });
    }
  }

  getFileIcon(filename: string) {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'fa-file-pdf-o';
      case 'doc':
      case 'docx': return 'fa-file-word-o';
      case 'xls':
      case 'xlsx': return 'fa-file-excel-o';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'fa-file-image-o';
      default: return 'fa-file-o';
    }
  }

  formatFileSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  onSubmitForm() {
    // Mark all controls as touched
    Object.keys(this.docForm.controls).forEach(key => {
      this.docForm.get(key)?.markAsTouched();
    });

    // Validate form
    if (this.docForm.invalid) {
      this.toast.error('Please fill all required fields', 'Validation Error');
      console.log('Form errors:', this.getFormValidationErrors());
      return;
    }

    // Validate files
    if (this.uploadedFiles.length === 0) {
      this.toast.error('Please upload at least one file', 'Validation Error');
      return;
    }

    // Validate entity_id
    if (!this.entity_id) {
      this.toast.error('Entity ID is missing', 'Validation Error');
      return;
    }

    this.isSubmitting = true;
    this._commonService?.showLoader();

    const formData = new FormData();
    const formValue = this.docForm.value;

    // Required fields
    formData.append('uploaded_by', String(this.loginUser?.employee_id || this.loginUser?.id || this.loginUser));
    formData.append('entity_id', String(this.entity_id));
    formData.append('document_category', formValue.document_category);
    formData.append('version', String(formValue.version || '1.0'));
    formData.append('uploaded_date', new Date().toISOString());

    // ✅ WORKAROUND: Send all fields with values or defaults (use 0 or -1 as "not applicable")
    // Only use this if you CANNOT change the database schema

    if (this.showDepartment && formValue.department_list?.length > 0) {
      formData.append('department_id', String(formValue.department_list[0]));
    } else {
      formData.append('department_id', '0'); // Default value meaning "N/A"
    }

    if (this.showEmployee && formValue.employee_id) {
      formData.append('employee_id', String(formValue.employee_id));
    } else {
      formData.append('employee_id', '0'); // Default value meaning "N/A"
    }

    if (this.showDesignation && formValue.role_master_id) {
      formData.append('designation_id', String(formValue.role_master_id));
    } else {
      formData.append('designation_id', '0'); // Default value meaning "N/A"
    }

    if (this.showState && formValue.states_id) {
      formData.append('states_id', String(formValue.states_id));
    } else {
      formData.append('states_id', '0'); // Default value meaning "N/A"
    }

    // Append files
    this.uploadedFiles.forEach((file) => {
      formData.append('documents', file, file.name);
    });

    // Debug: Log what we're sending
    console.log('Category:', formValue.document_category);
    console.log('Show flags:', {
      department: this.showDepartment,
      employee: this.showEmployee,
      designation: this.showDesignation,
      state: this.showState
    });
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Submit
    this._docmanagsystemservices.createDocumentManagementSystem(formData).subscribe(
      (res: any) => {
        this.stopSubmitting();
        this.toast.success(res?.message || 'Document uploaded successfully', 'Success');
        this.dialogRef.close(true);
        this.reloadCurrentRoute();
      },
      (err: any) => {
        this.stopSubmitting();
        console.error('Upload error:', err);
        const errorMsg = err?.error?.message || 'Failed to upload document. Please try again.';
        this.toast.error(errorMsg, 'Error');
      }
    );
  }

  private stopSubmitting() {
    this._commonService?.hideLoader();
    this.isSubmitting = false;
  }

  private getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.docForm.controls).forEach(key => {
      const control = this.docForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  getAllDepartment_dropDown() {
    const entity_id = localStorage.getItem('selectedEntityId');
    this._empRegistration.getAllDepartment_dropDown(entity_id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.getAllDepartment = res.data.filter((r: any) => r.status === 'ACTIVE');
          this.getAllDepartment2 = [...this.getAllDepartment];
          this.departments = this.getAllDepartment2.map((r: any) => r.department_name);
        }
      },
      (err) => {
        this.toast.error(err?.error?.message || 'Error fetching departments');
      }
    );
  }

  departmentSearch(e: any) {
    const selectedNames = e || [];
    this.getAllDepartment = this.getAllDepartment2.filter((item: any) =>
      selectedNames.includes(item.department_name)
    );
  }

  getAllArea(event: any) {
    const deptIds = Array.isArray(event) ? event : [event];

    this._hrmkpaService.getemployeeById(deptIds).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.employeeList = res.data;
          this.employeeList2 = res.data;
        }
      },
      (err) => {
        this.toast.error(err?.error?.message || 'Error fetching employees');
        this.employeeList = [];
        this.docForm.get('employee_id')?.setValue('');
      }
    );
  }

  selectAllDepartment(event: any): void {
    const checked = !!event?.target?.checked;
    if (checked) {
      this.selectedDepartment = this.getAllDepartment.map((d) => d.dept_id);
    } else {
      this.selectedDepartment = [];
    }
    this.isAllSelectDepartment = checked;
    this.docForm.get('department_list')?.setValue(this.selectedDepartment);
    this.getAllArea(this.selectedDepartment);
  }

  getAllRoleMaster() {
    this._empRegistration.getAllRoleMaster(this.loginUser).subscribe(
      (res: any) => {
        this.allRoleMaster = res.data || [];
        this.assignDesignationArr1 = this.allRoleMaster.map((r: any) => r.role_master_name);
        this.assignDesignationArr2 = [...this.allRoleMaster];
      },
      (err) => {
        this.toast.error(err?.error?.message || 'Error fetching roles');
      }
    );
  }

  getStateList() {
    this._empRegistration.getAllstate().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.StateDataList = res.data;
          this.stateVar = this.StateDataList.map((r: any) => r.states_name);
          this.stateVar2 = [...this.StateDataList];
          this.StateDataList = [...this.stateVar2];
        }
      },
      (err) => {
        this.toast.error(err?.error?.message || 'Error fetching states');
      }
    );
  }

  goBack() {
    this.dialogRef.close(false);
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}