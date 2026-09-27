import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-kt-assignment-create',
  templateUrl: './kt-assignment-create.html',
  styleUrls: ['./kt-assignment-create.scss']
})
export class KtAssignmentCreate {
  ktAssignform: FormGroup<any>;
  categoryList: any;
  employeeList: any;
  rowData: any;
  entity_Id: any;
  loginUser: any;
  employees: any;
  mode: string = 'add';
  editId: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private employeeService: EmpRegistrationService,
    private employeeMasterService: EmpMasterService,
    private toastr: ToastrService,


  ) { }


  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }
  ngOnInit(): void {
    this.localStorage();


    this.ktAssignform = this.fb.group({
      category_name: ['', Validators.required],
      created_by: ['', Validators.required],
      employee: [[], Validators.required],
      assigned_date: ['',new Date],
      remarks: [''],
      from_emp:['']
    });

    const userData = localStorage.getItem('signInUser');
    const loggedUser = userData ? JSON.parse(userData) : null;

    if (loggedUser) {
      this.ktAssignform.patchValue({
        created_by: loggedUser.employee_id
      });
    }

    this.route.queryParams.subscribe(params => {
  this.editId = params['id'];

  if (params['mode'] === 'editMode') {
    this.mode = 'edit';
  } else if (params['mode'] === 'viewMode') {
    this.mode = 'view';
  } else {
    this.mode = 'add';
  }

  if (this.mode === 'edit' || this.mode === 'view') {
    this.getDetailsById();
  }
});




    this.KtCategoryList();
    this.getEmployeeList();
  }

  getDetailsById() {
  this.employeeMasterService.getKtAssignmentById(this.editId).subscribe({
    next: (res: any) => {
      const data = res.data[0];

      // Convert CSV employee IDs → array of numbers
      const assignedEmployees = data.assigned_employee_ids
        ? data.assigned_employee_ids.split(',').map((id: any) => Number(id))
        : [];


         let categoryId = data.category_id;

      if (!categoryId) {
        const match = this.categoryList?.find(
          (c: any) => c.category_name === data.category_name
        );
        categoryId = match ? match.id : null;
      }




      this.ktAssignform.patchValue({
        category_name: data?.id,
        created_by: data.created_by,
        from_emp: data.from_emp,
        remarks: data.remarks,
        employee: assignedEmployees,
        assigned_date:data.created_date,
      });
    },
    error: (err: any) => {
      console.error("Error fetching by ID", err);
      this.toastr.error("Failed to fetch KT Assignment details!");
    }
  });
}



  KtCategoryList() {
    this._configurationalMasterService.KtCategoryList(this.entity_Id).subscribe((res: any) => {
      this.categoryList = res.data;

    });
  }

onCategoryChange(categoryId: any) {

  const selected = this.categoryList.find((x:any) => x.id == categoryId);
  if (!selected) return;

  // Always enable dropdown for any category
  this.ktAssignform.get("from_emp")?.enable();

  if (selected.category_name === "Resignation KT") {

    // API for resignation employees
    this.getResignationEmployees();

  } else {

    // Normal employee list API
    this.getEmployeeList();
  }
}



getResignationEmployees() {
  this.employeeMasterService.getAllResignationEmp(this.entity_Id)
    .subscribe((res: any) => {
      this.employeeList = res.data;
    });
}


  getEmployeeList() {
    this.employeeService.getemployeeListData(this.entity_Id).subscribe({
      next: (res: any) => {
        const employees = Array.isArray(res) ? res : res?.data || [];
        this.employeeList = employees.map((emp: any) => ({
          employee_id: emp.employee_id,
          first_name: emp.first_name || '',
          last_name: emp.last_name || '',
          full_name: `${(emp.first_name || '').trim()} ${(emp.last_name || '').trim()}`
        }));

        console.log('Employee list:', this.employeeList);
      },
      error: (err) => console.error('Error fetching employee list:', err)
    });
  }





  onSubmit() {
  if (this.ktAssignform.invalid) {
    this.ktAssignform.markAllAsTouched();
    return;
  }

  const rawDate = this.ktAssignform.value.assigned_date;

  let formattedDate = null;

  if (rawDate) {
    const dateObj = new Date(rawDate);  // <-- FIXED

    formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObj
        .getDate()
        .toString()
        .padStart(2, "0")}`;
  }

  const payload = {
    category_name: this.ktAssignform.value.category_name,
    created_by: this.ktAssignform.value.created_by,
    employee: this.ktAssignform.value.employee,
    assigned_date: formattedDate,
    remarks: this.ktAssignform.value.remarks,
    entity_id: this.entity_Id,
    from_emp: this.ktAssignform.value.from_emp
  };

  console.log("Final Payload:", payload);

  if (this.mode === "add") {
    this.employeeMasterService.createKtAssignment(payload).subscribe({
      next: (res) => {
        this.toastr.success("KT Assignment Created Successfully!");
        this.router.navigate(['/master/ess/kt-assignment']);
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    });
  }

  if (this.mode === "edit") {
    const id = this.editId;
    this.employeeMasterService.updateKtAssignment(id, payload).subscribe({
      next: (res) => {
        this.toastr.success("KT Assignment Updated Successfully!");
        this.router.navigate(['/master/ess/kt-assignment']);
      },
      error: (err) => {
        this.toastr.error("Failed to update KT Assignment!");
      }
    });
  }
}




}
