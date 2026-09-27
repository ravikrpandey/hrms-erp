import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-dialog-requested-course',
  templateUrl: './dialog-requested-course.component.html',
  styleUrls: ['./dialog-requested-course.component.scss']
})
export class DialogRequestedCourseComponent {
 form: FormGroup;
  dynamicOptions: any[] = []; 
  courses: any[] = []; 
  categoryList: any[] = []; 
  getAllDepartment: any[] = []; 
  getAllDesignation: any[] = []; 
  roleGetByemployee: any[] = []; 
  employeData :any[] =[]
  employeid :any[] =[]
  roleId:any
  roleGet:any
  loginUser:any
  loginUserDetails : any;
  constructor(public dialog: MatDialogRef<DialogRequestedCourseComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private toaster: ToastrService,
      private route :Router,
    private fb: FormBuilder, private _lmsService: LmsService,private _configurationalMasterService : ConfigurationalmasterService,private _empRegistration: EmpRegistrationService,private _rbacMasterService:RbacMasterService) {
      this.loginUserDetails = localStorage.getItem("loginUserDetails");
      this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.form = this.fb.group({
      remark: [null, Validators.required],
      course_id: [null, Validators.required],
      category: [null, Validators.required],
    });
    if(data?.id)
    this.getAssignCourseById()
  }
  filterCourseList:any;
  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this._lmsService.getAllCourses().subscribe((res: any) => {
      this.courses = res.data.filter((item: any) => item?.assessmentCount != 0);
      this.filterCourseList = [...this.courses]
    });
    this.getLmsCourseCategory()
  }


  
  onDesignationChange(e:any){
    
  
      this.roleGetByemployee = [];
      // this.roleAssignForm?.patchValue({ employee_id: null, entity_id: null })
  
     
  
      let entity_id = localStorage.getItem("selectedEntityId");
      this._rbacMasterService.employeGetByroleId(e, entity_id).subscribe((res: any) => {
        
        this.roleGetByemployee = res.data;
        // this.roleEmployeData = this.roleGetByemployee.map((res: any) => (res.first_name+res.last_name+res.employee_id));
        // this.roleEmployeData2 = this.roleGetByemployee;
      });
    
    
  }
  getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return today;
  }
  filterCategoryList:any;
  getLmsCourseCategory() {
    this._configurationalMasterService.getLmsCourseCategory().subscribe((res: any) => {
      this.categoryList = res.data;
      this.filterCategoryList = [...this.categoryList]
    })
  }

  getRoleAssign() {
   
    this._rbacMasterService.getRole(this.loginUser.role).subscribe((res: any) => {
      this.roleGet = res.data;
      this.roleId = res.data.role_master_id;
    });
  }

  addemploye() {
    const selectedDesignation = this.form.value.employe_designation;
    const selectedEmployees = this.form.value.employe;
console.log(selectedEmployees)
    if (!selectedDesignation || selectedEmployees.length === 0) {
      alert('Please select both Designation and Employees');
      return;
    }

  
    selectedEmployees.forEach((employeeId: string) => {
      const employee = this.roleGetByemployee.find(emp => emp.employee_id === employeeId);
      if (employee) {
        this.employeData.push({
          designation: this.roleGet.find((role:any) => role.role_master_id === selectedDesignation)?.role_master_name,
          employe_name: `${employee.first_name} ${employee.last_name}`,
          employe_code: employee.employee_id
        });
      }
    });

    this.employeid.push(...selectedEmployees)
    this.form.controls['employe'].reset();
    this.form.controls['employe_designation'].reset();
  }
  getAssignCourseById() {
    this._lmsService.getAssignCourseById(this.data.id).subscribe(
      (response: any) => {
        if (response?.data) {
          this.data = response.data
          console.log(this.data ,"res")
        this.form.patchValue({
          type: this.data?.type,
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          course_id: this.data.course_id ,
          category: this.data.category,
          department: this.data.LMS_DEPARTMENT_ALLOCATIONs.map((item:any)=>item.department_id),
          designation: this.data.LMS_DESIGNATION_ALLOCATIONs.map((item: any) => item.designation_id),
          // employe: ,
          // employe_designation :
        })
         
        }
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
  }
  payload : any
  onSubmit() {
    this.payload = {
        ...this.form.value,
        employee_id: this.loginUserDetails?.employee_id
    };

    if (this.form.valid) {
        this._lmsService.createRequestedCourse(this.payload).subscribe(
            (response: any) => {
                if (response) {
                 
                    this.toaster.success(response?.message || 'Course request created successfully!');
                    this.reloadCurrentRoute()
                    this.dialog.close();
                } else if (response?.code === 500) {
                    
                    this.toaster.error(response?.message || 'An unexpected error occurred!');
                } else {
                    
                    this.toaster.warning(response?.message || 'Something went wrong!');
                    this.dialog.close()
                }
            },
            (error: any) => {
                console.error(error.error.message);
                this.toaster.error(error.error.message);
                // this.dialog.close()
                
            }
        );
    } else {
        this.toaster.error('Please fill in all required fields before submitting!');
    }
}
reloadCurrentRoute() {
  let currentUrl = this.route.url;
  this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.route.navigate([currentUrl]);
  });
}}
