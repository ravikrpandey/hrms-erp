import { Component, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';
import { ICellRendererParams } from 'ag-grid-community';
@Component({
  selector: 'app-course-request-allocate',
  templateUrl: './course-request-allocate.component.html',
  styleUrls: ['./course-request-allocate.component.scss']
})
export class CourseRequestAllocateComponent {
  view: boolean = false;
  formModel: FormGroup;
  file_path: any;
  fileArray: any[] = [];
  baseUrl: any;
  loginUserDetails : any;
  data : any
  column : any
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private lmsService: LmsService,
    private activeroute: ActivatedRoute,
  ) {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.baseUrl = environment.serverUrl;
    this.activeroute.queryParams.subscribe((params)=>{
      this.data = params;
    })
    this.formInitialization();
    this.getRequestDetail();

    // console.log(this.data?.id);

    this.fileArray.push({ imagePath: null, url: null });
  }

  formInitialization() {
    this.formModel = this.fb.group({
      request_id : [null],
      allocate_by_id : [null],
      course_id : [null],
      employee_name: [null],
      employee_code: [null],
      category: [null],
      course_name: [null],
      department: [null],
      reporting_manager: [null],
      approval_manager: [null],
      req_remark: [null],
      designation: [null],
      remark: [null],
      approvel_status: [null],
      endDate : [null,Validators.required],
      startDate : [null,Validators.required],
    });
    // Object.keys(this.formModel.controls).forEach((control) => {
    //   if (control !== 'remark') {
    //     this.formModel.get(control)?.disable();
    //   }
    // })
  }

  ngOnInit() {}
  getRequestDetail() {
    this.lmsService.getRequestDetail(this.data.req_id).subscribe(
      (response: any) => {
        console.log(response);
        this.formModel.patchValue({
          employee_id : response?.data.employee.employee_id,
          request_id :response.data?.request.id,
          employee_name: response.data?.employee?.first_name,
          employee_code: response.data.employee?.employee_code,
          category: response.data.course?.category,
          course_name: response.data.course?.course_name,
          department: response.data.department?.department_name,
          reporting_manager: response.data.employee?.reporting_manager,
          approval_manager: response.data.employee?.approval_manager,
          req_remark: response.data.request?.remark,
          designation: response.data.designation?.designation_name,
          endDate : response.data.request?.end_date,
        });
        this.column = response.data.course
      },
      (error) => {
        console.error(error);
      }
    );
  }
  getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return today;
  }
  getEndDate(): Date {
    const startDate = this.formModel.get('startDate')?.value;
    if (startDate) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);
      return endDate;
    }
    return this.getTodayDate();
  }
  onSubmit(): void {
    if(this.formModel.invalid){
      this.toaster.error("Please fill all required fields!")
      return
    }
    var payload = {
      "allocate_by_id":this.loginUserDetails?.employee_id,
      "course_id" :this.column.id,
      "request_id" : this.data.req_id,
      "startDate" : this.formModel.get('startDate')?.value,
      "endDate" : this.formModel.get('endDate')?.value,
      "category" : this.column.category,

    };
    this.lmsService.requestCourseAllocate(payload).subscribe((response: any) => {
      try {
        if (response) {
          this.toaster.success(response?.data?.message ? response?.data?.message : 'Course Allocate Successfully');
this.router.navigate(['/master/lms/course-request'])
        }

      } catch (error) {
console.log(error)
      }
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}
