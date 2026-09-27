import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-course-approval-dialog',
  templateUrl: './course-approval-dialog.component.html',
  styleUrls: ['./course-approval-dialog.component.scss'],
})
export class CourseApprovalDialogComponent {
  view: boolean = false;
  formModel: FormGroup;
  file_path: any;
  fileArray: any[] = [];
  baseUrl: any;
  loginUserDetails : any;
  constructor(
    public dialog: MatDialogRef<CourseApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private elRef: ElementRef,
    private $common: CommonService,
    private lmsService: LmsService
  ) {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.baseUrl = environment.serverUrl;
    this.formInitialization();
    this.getRequestDetail();

    console.log(this.data?.id);

    this.fileArray.push({ imagePath: null, url: null });
  }

  formInitialization() {
    this.formModel = this.fb.group({
      request_id : [null, Validators.required],
      employee_id : [null, Validators.required],
      employee_name: [null],
      employee_code: [null],
      course_category: [null],
      course_name: [null],
      department: [null],
      reporting_manager: [null],
      approval_manager: [null],
      req_remark: [null],
      designation: [null],
      remark: [null, Validators.required],
      approvel_status: [null],
    });
    // Object.keys(this.formModel.controls).forEach((control) => {
    //   if (control !== 'remark') {
    //     this.formModel.get(control)?.disable();
    //   }
    // })
  }

  ngOnInit() {}
  getRequestDetail() {
    this.lmsService.getRequestDetail(this.data.id).subscribe(
      (response: any) => {
        console.log(response);
        this.formModel.patchValue({
          employee_id : response?.data.employee.employee_id,
          request_id :response.data?.request.id,
          employee_name: response.data?.employee?.first_name,
          employee_code: response.data.employee?.employee_code,
          course_category: response.data.course?.category,
          course_name: response.data.course?.course_name,
          department: response.data.department?.department_name,
          reporting_manager: response.data.employee?.reporting_manager,
          approval_manager: response.data.employee?.approval_manager,
          req_remark: response.data.request?.remark,
          designation: response.data.designation?.designation_name,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit(): void {
  if (this.formModel.get('remark')?.invalid || !this.formModel.get('remark')?.value?.trim()) {
    this.toaster.error('Remark is required');
    return;
  }

  const payload = {
    ...this.formModel.value,
    approvel_status: 'APPROVED',
    employee_id: this.loginUserDetails?.employee_id,
  };
  this.lmsService.approvedRequestedCourse(payload).subscribe((response: any) => {
    try {
      if (response) {
        this.toaster.success(response?.data?.message || 'Course Approved Successfully');
      }
      this.router.navigate(['/master/ess/course-approval/pending-course-approval']);
      this.dialog.close();
      this.reloadCurrentRoute();
    } catch (error) {
      console.log(error);
    }
  });
}


  onReject(): void {
  if (this.formModel.get('remark')?.invalid || !this.formModel.get('remark')?.value?.trim()) {
    this.toaster.error('Remark is required');
    return;
  }

  const payload = {
    ...this.formModel.value,
    approvel_status: 'REJECTED',
    employee_id: this.loginUserDetails?.employee_id,
  };

  console.log(payload);

  this.lmsService.approvedRequestedCourse(payload).subscribe({
    next: (response: any) => {
      try {
        if (response.code === 200) {
          this.toaster.success(response.message);
          this.router.navigate(['/master/ess/course-approval/pending-course-approval']);
          this.dialog.close();
          this.reloadCurrentRoute();
        } else {
          this.toaster.error('Approval failed');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        this.toaster.error('An unexpected error occurred');
      }
    },
    error: (err) => {
      console.error('Error response:', err);
      this.toaster.error('Failed to reject the approval');
    }
  });
}
  
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}
