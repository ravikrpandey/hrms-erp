import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';


function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}


@Component({
  selector: 'app-department-dialog',
  templateUrl: './department-dialog.component.html',
  styleUrls: ['./department-dialog.component.scss']
})
export class DepartmentDialogComponent {
  departmentForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  departmentId: any;
  view: any;
  entity_id: any;
  roles: any[] = [];
  roleSelected: boolean = false;
  employees: any;
  entityList: any;
  entityIds: any;
  roles2: any;
  rolesList: any[];
  employees2: any;
  employeesList: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _commonService : CommonService,
    public dialog: MatDialogRef<DepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      department_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      cc_code: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      role_name: new FormControl(null),
      employee_name: new FormControl(null),
    });
  }
  ngOnInit() {
    let dept_id: any;

    this.departmentId = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    let entityList: any = localStorage.getItem('entityList')
    this.entityList = JSON.parse(entityList);
    this.entityIds = this.entityList.map((entity: any) => entity.entity_id);
    this.getallrole()
    this.departmentById()
  }

  departmentById() {
    if (this.departmentId) {
      this._commonService?.showLoader()
      this._configurationalMasterService.departmentById(this.departmentId).subscribe((res: any) => {
        this.departmentData = res.data;
        this._commonService?.hideLoader()
        this.departmentForm.patchValue({
          department_name: this.departmentData?.department_name,
          cc_code: this.departmentData?.cc_code,
          role_name: this.departmentData?.role_master_id,
          employee_name: this.departmentData?.employee_id,
        })
        this.get_all_employeeBy_User_role({ value: this.departmentData?.role_master_id })
      },(err:any) => {
        this._commonService?.hideLoader()
      });
    }
  }

  getallrole() {
    this._configurationalMasterService.getAllRole(this.loginUser.role).subscribe((res: any) => {
      this.roles = res.data;
      this.roles2 = res.data;
      this.rolesList = this.roles.map((value:any) => value.role_master_name)
    })
  }

  roleFilter(e: any) {
    const aa = e
    let filteredVariable = this.roles2.filter((item: any) => aa.includes(item.role_master_name));
    this.roles = filteredVariable
  }

  employeeFilter(e: any) {
    const aa = e
    let filteredVariable = this.employees2.filter((item: any) => aa.includes(item.first_name + ' ' + item.middle_name + ' ' + item.last_name));
    this.employees = filteredVariable
  }

  get_all_employeeBy_User_role(event: any) {
    console.log(event);
  
    let entity_id = localStorage.getItem("selectedEntityId");
    console.log(entity_id, 'entity_id')
    let val = this.departmentForm.value;
    this._configurationalMasterService.get_all_employeeBy_User_role(event.value, entity_id).subscribe((res: any) => {
      this.employees = res.data;
      this.employees2 = res.data;
      this.employeesList = this.employees.map((value:any) => value.first_name + ' ' + value.middle_name + ' ' + value.last_name)
    })

  }
  onSubmitForm() {
    this._commonService?.showLoader()
    Object.keys(this.departmentForm.controls).forEach(key => {
      this.departmentForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.departmentForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.departmentForm.value;
    const data = {
      department_name: val.department_name.trim(),
      cc_code: val.cc_code.trim(),
      role_master_id: val.role_name,
      employee_id: val.employee_name,
      entity_id: this.entity_id
    };
    this._configurationalMasterService.createDepartment(data, this.entity_id).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if (res.message === "Department Name is Already Exits!") {
          this.toast.warning('Department Name is Already Exits!');
        }
        else {
          this.toast.success('Department Added Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/department',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        this._commonService?.hideLoader()
        this.toast.error(err.error.message)
        // if (err.status == 400) {
        //   this.toast.error('Something went Wrong!');
        // } else if(err.status == 201){
        //   this.toast.error('Department Name is Already Exits!');
        // }else{
        //   this.toast.error('Error in submission!');
        // }
      }
    );
  }

  onUpdateForm() {
    
    Object.keys(this.departmentForm.controls).forEach(key => {
      this.departmentForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.departmentForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.departmentForm.value;
    const data = {
      department_name: val.department_name.trim(),
      cc_code: val.cc_code.trim(),
      role_master_id: val.role_name,
      employee_id: val.employee_name,
      entity_id: this.entity_id
    };
    this._commonService?.showLoader()
    this._configurationalMasterService.updateDepartment(this.data.id, data, this.entity_id).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if (res.message == "Department Name is Already Exits!") {
          this.toast.warning('Department Name is Already Exits!');
        }
        else {
          this.toast.success('Department Updated Successfully');
        }
        this.route.navigate([
          'master/itticket/configurational-master/department',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        this._commonService?.hideLoader()
        this.toast.error(err.error.message)
        // if (err.status == 400) {
        //   this.toast.error('Something went Wrong!');
        // } else if(err.status == 409){
        //   this.toast.error('Department Name is Already Exits!');
        // }else{
        //   this.toast.error('Error in submission!');
        // }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.departmentForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}
