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
  selector: 'app-dialog-allocate-course',
  templateUrl: './dialog-allocate-course.component.html',
  styleUrls: ['./dialog-allocate-course.component.scss']
})
export class DialogAllocateCourseComponent {
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

  constructor(public dialog: MatDialogRef<DialogAllocateCourseComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private toaster: ToastrService,private route :Router,
    private fb: FormBuilder, private _lmsService: LmsService,private _configurationalMasterService : ConfigurationalmasterService,private _empRegistration: EmpRegistrationService,private _rbacMasterService:RbacMasterService) {
    this.form = this.fb.group({
      type: ['all', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      course_id: ['', Validators.required],
      category: ['', Validators.required],
      department: [[]],
      designation: [[]],
      employe: [[]],
      employe_designation :[''],
      entity_id: [[]]
    });
    if(data?.id)
    this.getAssignCourseById()
  }

  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
   
    this.getLmsCourseCategory()
    this.getAllDepartment_dropDown()
  this.getAllDesignation_dropDown()
  this.getRoleAssign();
  this.getEntityList();
  }

  onTypeChange(type: string) {
    if (type === 'all') {
      this.dynamicOptions = []; 
    } else {
      
      // this.courseService.getEmployees(type).subscribe((data: any[]) => {
      //   this.dynamicOptions = data;
      // });
    }
  }
  
  filterEmployeeList: any[] = [];

onDesignationChange(e: any) {
  this.roleGetByemployee = [];
  let entity_id = localStorage.getItem("selectedEntityId");

  this._rbacMasterService.employeGetByroleId(e, entity_id).subscribe((res: any) => {
    this.roleGetByemployee = res.data;
    this.filterEmployeeList = [...this.roleGetByemployee]; // Full list initially
  });
}

onEmployeeFilter(filtered: any[]) {
  const selectedIds = this.form.value.employe || [];

  const selectedItems = this.roleGetByemployee.filter(emp =>
    selectedIds.includes(emp.employee_id)
  );

  const merged = [...selectedItems, ...filtered].filter(
    (item, index, self) =>
      index === self.findIndex(t => t.employee_id === item.employee_id)
  );

  this.filterEmployeeList = merged;
}
  getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return today;
  }
  getEndDate(): Date {
    const startDate = this.form.get('startDate')?.value;
    if (startDate) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);
      return endDate;
    }
    return this.getTodayDate();
  }
  filterCategoryList:any
  getLmsCourseCategory() {
    this._configurationalMasterService.getLmsCourseCategory().subscribe((res: any) => {
      this.categoryList = res.data;
      this.filterCategoryList = [...this.categoryList]
    })
  }
  filterCourseList:any
  getCourseList(category: any) {
    let filter = {
      "category": category,
      "course_type" : "contentWithAssesment"
    }
    this._lmsService.getCoursesList(filter).subscribe((res: any) => {
      this.courses = res.data;
      this.filterCourseList = [...this.courses]
    });
  }
  filterDepartmentList:any;
  getAllDepartment_dropDown() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.getAllDepartment_dropDown(entity_id).subscribe(
      (res) => {

        this.getAllDepartment = res.data.filter((res: any) => res.status === "ACTIVE");
        this.filterDepartmentList =[...this.getAllDepartment]

      }
    );
  };

  
filterRoleList: any[] = [];

getRoleAssign() {
  this._rbacMasterService.getRole(this.loginUser.role).subscribe((res: any) => {
    this.roleGet = res.data;
    this.filterRoleList = [...this.roleGet]; // ← initialize the filtered list here
    this.roleId = res.data.role_master_id;
  });
}

  filterDesignationList:any;
  getAllDesignation_dropDown() {
    this._empRegistration.getAllDesignation_dropDown().subscribe(
      (res) => {
        this.getAllDesignation = res.data.filter((res: any) => res.status === "ACTIVE");
        this.filterDesignationList = [...this.getAllDesignation]

      }
    );
  };

  getMergedDesignationList() {
  const selectedIds = this.form.value.designation || [];
  const selectedItems = this.getAllDesignation.filter((item: any) =>
    selectedIds.includes(item.designation_id)
  );

  const merged = [...selectedItems, ...this.filterDesignationList];
  
  return merged.filter((v, i, a) => a.findIndex(t => t.designation_id === v.designation_id) === i);
}

allDepartmentsValue = 'ALL_DEPARTMENTS';
isAllSelected = false;

toggleSelectAllDepartments(event: any) {
  const selectedValues = event.value;

  if (selectedValues.includes(this.allDepartmentsValue)) {
    if (this.isAllSelected) {
      
      this.form.controls['department'].setValue([]);
      this.isAllSelected = false;
    } else {
      
      const allIds = this.filterDepartmentList.map((d: any) => d.dept_id);
      this.form.controls['department'].setValue(allIds);
      this.isAllSelected = true;
    }
  } else {
    const allIds = this.filterDepartmentList.map((d: any) => d.dept_id);
    this.isAllSelected = selectedValues.length === allIds.length;
  }
}

allDesignationsValue = 'ALL_DESIGNATIONS';
isAllDesignationsSelected = false;

toggleSelectAllDesignations(event: any) {
  const selectedValues = event.value;

  if (selectedValues.includes(this.allDesignationsValue)) {
    if (this.isAllDesignationsSelected) {
      // Unselect all
      this.form.controls['designation'].setValue([]);
      this.isAllDesignationsSelected = false;
    } else {
      // Select all designations
      const allIds = this.filterDesignationList.map((d: any) => d.designation_id);
      this.form.controls['designation'].setValue(allIds);
      this.isAllDesignationsSelected = true;
    }
  } else {
    const allIds = this.filterDesignationList.map((d: any) => d.designation_id);
    this.isAllDesignationsSelected = selectedValues.length === allIds.length;
  }
}


allEmployeesValue = 'ALL_EMPLOYEES';
isAllEmployeesSelected = false;

toggleSelectAllEmployees(event: any): void {
  const selectedValues = event.value;
  const allEmployeeIds = this.filterEmployeeList.map((emp: any) => emp.employee_id);

  if (selectedValues.includes(this.allEmployeesValue)) {
    if (this.isAllEmployeesSelected) {
      // Deselect all
      this.form.controls['employe'].setValue([]);
      this.isAllEmployeesSelected = false;
    } else {
      // Select all currently visible (filtered) employees
      this.form.controls['employe'].setValue(allEmployeeIds);
      this.isAllEmployeesSelected = true;
    }
  } else {
    this.isAllEmployeesSelected = selectedValues.length === allEmployeeIds.length;
  }
}

addemploye() {
  const selectedDesignation = this.form.value.employe_designation;
  const selectedEmployees = this.form.value.employe;

  if (!selectedDesignation || selectedEmployees.length === 0) {
    alert('Please select both Designation and Employees');
    return;
  }

  selectedEmployees.forEach((employeeId: string) => {
    const employee = this.roleGetByemployee.find(emp => emp.employee_id === employeeId);
    if (employee) {
      const designationName = this.getAllDesignation.find(
        (desig: any) => desig.designation_id === selectedDesignation
      )?.designation_name;

      this.employeData.push({
        employee_id: employee.employee_id,
        employee_name: `${employee.first_name} ${employee.last_name}`,
        employee_code: employee.employee_code,
        designation: designationName || "N/A"
      });
    }
  });

  // Clear the selection fields after adding
  this.employeid.push(...selectedEmployees);
  this.form.controls['employe'].reset();
  this.form.controls['employe_designation'].reset();
}

getMergedDepartmentList() {
  const selectedIds = this.form.value.department || [];
  const selectedItems = this.getAllDepartment.filter((item: any) =>
    selectedIds.includes(item.dept_id)
  );

  const merged = [...selectedItems, ...this.filterDepartmentList];

  return merged.filter((v, i, a) => a.findIndex(t => t.dept_id === v.dept_id) === i);
}

deleteEmployee(index: number) {
  this.employeData.splice(index, 1);
  this.toaster.success('Employee deleted successfully');
}

  getAssignCourseById() {
    this._lmsService.getAssignCourseById(this.data.id).subscribe(
      (response: any) => {
        if (response?.data) {
          this.data = response.data
          // console.log(this.data ,"res")
          this.employeData = this.data?.LMS_EMPLOYEE_ALLOCATIONs;
          console.log(this.employeData)
        this.form.patchValue({
          type: this.data?.type,
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          course_id: this.data.course_id ,
          category: this.data.category,
          department: this.data.LMS_DEPARTMENT_ALLOCATIONs.map((item:any)=>item.department_id),
          designation: this.data.LMS_DESIGNATION_ALLOCATIONs.map((item: any) => item.designation_id),
          entity_id: this.data.entity_id,
        })
        this.getCourseList(this.data.category)
         
        }
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
  }
  payload : any
 onSubmit() {
  const formValue = this.form.value;

  // Check by selected type
  if (formValue.type === 'department' && (!formValue.department || formValue.department.length === 0)) {
    this.toaster.error('Please select at least one department.');
    return;
  }

  if (formValue.type === 'designation' && (!formValue.designation || formValue.designation.length === 0)) {
    this.toaster.error('Please select at least one designation.');
    return;
  }

 if (formValue.type === 'employe') {
  if (!this.employeData || this.employeData.length === 0) {
    if (!formValue.employe_designation) {
      this.toaster.error('Please select a designation for employees.');
      return;
    }
    this.toaster.error('Please add at least one employee.');
    return;
  }
}

  // Proceed with payload
  this.payload = {
    ...formValue,
    employe: this.employeData
  };
debugger
  if (this.form.valid) {
    this._lmsService.allocateCourse(this.payload).subscribe(response => {
      if (response) {
        this.toaster.success('Course Allocated Successfully');
        this.reloadCurrentRoute();
        this.dialog.close();
      } else {
        this.toaster.error("Failed to allocate course");
      }
    }, err => {
      this.toaster.error("Error during course allocation");
    });
  } else {
    this.toaster.error("Please fill in all required fields.");
  }
}

  onupdate() {
  const formValue = this.form.value;

  if (formValue.type === 'department' && (!formValue.department || formValue.department.length === 0)) {
    this.toaster.error('Please select at least one department.');
    return;
  }

  if (formValue.type === 'designation' && (!formValue.designation || formValue.designation.length === 0)) {
    this.toaster.error('Please select at least one designation.');
    return;
  }

  if (formValue.type === 'employe') {
  if (!this.employeData || this.employeData.length === 0) {
    if (!formValue.employe_designation) {
      this.toaster.error('Please select a designation for employees.');
      return;
    }
    this.toaster.error('Please add at least one employee.');
    return;
  }
}


  this.payload = {
    ...formValue,
    employe: this.employeData
  };

  if (this.form.valid) {
    this._lmsService.updateAssignCourse(this.data.id, this.payload).subscribe(response => {
      if (response) {
        this.toaster.success('Course updated successfully');
        this.reloadCurrentRoute();
        this.dialog.close();
      } else {
        this.toaster.error("Failed to update course");
      }
    }, err => {
      this.toaster.error("Error during update");
    });
  } else {
    this.toaster.error("Please fill in all required fields.");
  }
} 
  entityList: any = [];
  originalEntityList: any = [];
  filterEntityList: any;
  selectedEntity: any;
  getEntityList = () => {
    let entityList: any = localStorage.getItem('entityList');
    this.entityList = JSON.parse(entityList);
    this.filterEntityList = [...this.entityList]
    this.originalEntityList = this.entityList
    let entity_id = localStorage.getItem('selectedEntityId');
    this.selectedEntity = Number(entity_id);
  };
  entityfilter(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.entityList = [...this.originalEntityList];
    } else {
      this.entityList = this.originalEntityList.filter((item: any) =>
        item?.company_branch?.toLowerCase().includes(searchValue)
      );
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
