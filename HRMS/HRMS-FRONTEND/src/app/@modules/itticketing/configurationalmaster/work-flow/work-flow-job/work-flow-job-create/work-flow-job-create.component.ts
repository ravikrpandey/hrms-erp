import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';

@Component({
  selector: 'app-work-flow-job-create',
  templateUrl: './work-flow-job-create.component.html',
  styleUrls: ['./work-flow-job-create.component.scss'],
})
export class WorkFlowJobCreateComponent {
  form: FormGroup;
  getCat_data: any[] = [];
  department: any;
  workflowId: any;
  employeeDetails: any = [];
  workflowTypeItem: any;
  loginUser: any;
  item_masterData: any;
  getAllBomData: { id: number; bomCategory: string }[];
  idemp: any;
  conditioncheck: boolean = false;
  roleGetByemployee: any[] = [];
  dept: any;
  typeData: any;
  deptId: any;
  entity_id: any;
  showAddButton: any = true;
  entityList: any;
  entityIds: any;
  type: any;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private entityService: EntityMasterService
  ) {
    this.form = this.fb.group({
      job_request_id: new FormControl(null),
      department_id: new FormControl('', [Validators.required]),
      // entity_id: new FormControl('', [Validators.required]),
      budget_planning_type: new FormControl('', [Validators.required]),
      roleFiled: new FormArray([
        new FormGroup({
          role_id: new FormControl(null, [Validators.required]),
          employee_id: new FormControl(null, [Validators.required]),
        }),
      ]),
      // workflowType: "RFP",
    });
  }
  ngOnInit(): void {
    // this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.workflowId = res.id;
    });

    let idEntity = localStorage.getItem('selectedEntityId');
    this.entity_id = Number(idEntity);
    console.log(this.entity_id, 'this.entity_id');
    let lg: any = localStorage.getItem('signInUser');
    let entityList: any = localStorage.getItem('entityList');
    this.entityList = JSON.parse(entityList);
    this.entityIds = this.entityList.map((entity: any) => entity.entity_id);
    this.loginUser = JSON.parse(lg);
    this.getDepartment();
    this.getRoleAssign();
    this.getEntity();
    if (this.workflowId) {
      this.getWrokflowById();
    }
    this.getTYpe();
  }

  getEntity = () => {
    this.entityService.getEntityList().subscribe((res: any) => {
      this.entityList = res?.data;
    });
  };

  filterTypeofdata: any = [];
  getTYpe() {
    // this.typeData=[
    //   {type:"Job Request",id:1},
    //   {type:"Budget Planning",id:2}
    // ]
    // console.log(this.typeData,'data');
    this._configurationalMasterService
      .getTypeRequest()
      .subscribe((res: any) => {
        this.typeData = res?.data;
        this.filterTypeofdata = this.typeData;
        console.log('?{', this.typeData);
      });
  }
  get itemsFormArray(): any {
    return this.form.get('roleFiled') as FormArray;
  }

  get CF_3(): any {
    return this.form.controls;
  }
  addItem() {
    const tableRows = this.form.get('roleFiled') as FormArray;
    console.log(tableRows, 'tableRows');
    if (tableRows.value && tableRows?.value.length > 0) {
      let canAddNewRow = true;
      for (const obj of tableRows?.value) {
        if (!obj.employee_id) {
          canAddNewRow = false;
          break;
        }
      }

      if (canAddNewRow) {
        let data = this.fb.group({
          role_id: new FormControl('', [Validators.required]),
          employee_id: new FormControl('', [Validators.required]),
        });

        this.itemsFormArray.push(data);
        console.log(this.itemsFormArray, 'this.itemsFormArray');
        this.conditioncheck = true;
      } else {
        this.toast.warning('Please add first Row');
      }
    }
  }
  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }
  goBack() {
    this.location.back();
  }

  filterdepartmentdata: any = [];
  getDepartment() {
    this._configurationalMasterService
      .get_all_workflow_department(this.entity_id)
      .subscribe((res: any) => {
        this.department = res.data.filter((res: any) => res.status == 'ACTIVE');
        this.filterdepartmentdata = this.department;
      });
  }

  onSelectedType = (e: any) => {
    if (this.form.controls['job_request_id'].value == 'Budget Planning') {
      this.showAddButton = false;
      const roleFiledArray = this.form.get('roleFiled') as FormArray;
      for (let i = roleFiledArray.length - 1; i > 0; i--) {
        roleFiledArray.removeAt(i); // Remove FormGroup at index i
      }
    } else {
      this.showAddButton = true;
    }
  };

  onSubmit(data: any) {
    if (this.showAddButton) {
      this.form.controls['budget_planning_type'].setValue(null);
      const budgetPlanningTypeControl = this.form.get('budget_planning_type');
      budgetPlanningTypeControl?.clearValidators();
      budgetPlanningTypeControl?.updateValueAndValidity();
    }
    console.log(data, 'data');
    console.log(this.form.value);

    let checkData: any; // Assuming the type of items in typeData is 'any'

    // Find the item in typeData array that matches the condition
    checkData = this.typeData.find(
      (item: any) => item?.id == data?.job_request_id
    );
    console.log(checkData, 'checkData');

    if (this.workflowId) {
      // if (this.form.invalid) {
      //   this.form.markAllAsTouched()
      //   return
      // }
      let dataModify = {
        department_id: this.deptId,
        roleFiled: data?.roleFiled,
        job_request_id: checkData?.id,
        job_name: data?.job_request_id,
        budget_planning_type: data?.budget_planning_type,
        entity_id: this.entity_id,
      };
      console.log(data, 'dataa');
      dataModify.roleFiled.forEach((role: any, index: any) => {
        role['level'] = index + 1;
      });
      console.log(dataModify, 'data modified');
      this._configurationalMasterService
        .updateWorkFlowJob(this.workflowId, dataModify)
        .subscribe(
          (response: any) => {
            if (response) {
              if (response.message == 'WorkFlow Already Exists') {
                this.toaster.error(response.message);
              } else {
                this.toaster.success(response.message);
              }
               this.router.navigate(['/master/configurational-master/work-flow-job']);
            }
          },
          (err: any) => {
            this.toaster.error(err.error.message);
          }
        );
    } else {
      this.workflowId = null;
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.toaster.error('All fields are Mandatory', 'Error Message');
        return;
      }
      let dataModify = {
        department_id: data?.department_id,
        roleFiled: data?.roleFiled,
        job_request_id: checkData?.id,
        job_name: data?.job_request_id,
        budget_planning_type: data?.budget_planning_type,
        entity_id: this.entity_id,
      };
      console.log(data, 'dataa');
      dataModify.roleFiled.forEach((role: any, index: any) => {
        role['level'] = index + 1;
      });
      console.log(dataModify, 'data modified');
      this._configurationalMasterService
        .createWorkFlowJob(dataModify)
        .subscribe(
          (response: any) => {
            if (response) {
              if (response.message == 'WorkFlow Already Exists') {
                this.toaster.error(response.message);
              } else {
                this.toaster.success(response.message);
              }
              this.router.navigate(['/master/configurational-master/work-flow-job']);
            }
          },
          (err: any) => {
            this.toaster.error(err.error.message);
          }
        );
    }
  }

  roleGet: any = [];
  filterByroledata: any = [];
  getRoleAssign() {
    this._rbacMasterService
      .getRole(this.loginUser.role)
      .subscribe((res: any) => {
        this.roleGet = res.data;
        this.filterByroledata = this.roleGet;
        console.log(this.roleGet, 'this.roleGet');
      });
  }

  filterroledata: any[] = [];
  loading: boolean[] = [];
  error: string[] = [];

 

  // roleIdData(e: any, i: any) {
  //   console.log(e.value, 'eeeeee');
  //   console.log(i, 'iiii');
  //   this._rbacMasterService
  //     .employeGetByroleId(e.value, this.entity_id)
  //     .subscribe(
  //       (res: any) => {
  //         console.log(res, 'resdata');
  //         this.roleGetByemployee[i] = res.data;
  //         this.filterroledata[i] = this.roleGetByemployee[i]

  //       },
  //       (err: any) => {
  //         this.roleGetByemployee[i] = [];
  //       }
  //     );
  // }

  // roleIdData(e: { value: string }, i: number): void {
  //   this.loading[i] = true;
  //   this.error[i] = '';
  //   this._rbacMasterService
  //     .employeGetByroleId(e.value, this.entity_id)
  //     .subscribe(
  //       (res: { data: any[] }) => {
  //         this.roleGetByemployee[i] = res.data;
  //         this.filterroledata[i] = res.data;
  //         this.loading[i] = false;
  //       },
  //       (err) => {
  //         this.roleGetByemployee[i] = [];
  //         this.filterroledata[i] = [];
  //         this.loading[i] = false;
  //         this.error[i] = 'Failed to load data';
  //       }
  //     );
      
  // }
  // selectemp(e: any, index: any) {
  //   console.log(e, 'eeee');
  //   this.idemp = e.value;

  //   console.log(this.roleGetByemployee[index], 'this.roleGetByemployee');
  //   const roleData: any = this.roleGetByemployee[index];
  //   let currentList = this.itemsFormArray.value;

  //   console.log(this.itemsFormArray, 'this.itemsFormArray');

  //   console.log(currentList, 'currentList');
  //   let isDuplicate = true;
  //   let newList = currentList.slice();
  //   if (currentList && currentList.length > 0) newList.splice(index, 1);
  //   newList.map((item: any) => {
  //     console.log(item, 'iteeem');

  //     if (item.employee_id == this.idemp) {
  //       isDuplicate = false;
  //       this.toast.error('This EMP has been already added');
  //       this.resetEmployeeId(index);
  //       this.itemsFormArray?.at(index).get('employee_id').reset();
  //     }
  //   });
  // }
  
  // resetEmployeeId(index: any) {
  //   const control: any = (this.form.get('roleField') as FormArray)
  //     ?.at(index)
  //     .get('employee_id');
  //   control?.reset(); // Resetting the value of employeeId FormControl
  // }

  // getWrokflowById() {
  //   this._configurationalMasterService
  //     .getByWorkFlowJob(this.workflowId)
  //     .subscribe(
  //       (response: any) => {

  //         this.workflowTypeItem = response.data?.workflow_type;
  //         console.log("????????????", response)
  //         if (response.data?.job_name == 'Budget Planning') {
  //           this.showAddButton = false;
  //         }
  //         this.dept = response.data?.department_id;
  //         this.deptId = response.data?.department_id;
  //         this.employeeDetails = response.data.roleFiled;
  //         setTimeout(() => {
  //           this.form.patchValue({
  //             workflowdepartment: response.data?.dept_id,
  //             job_request_id: response.data?.job_name,
  //             department_id: response.data?.department_name,
  //             budget_planning_type: response.data?.budget_planning_type,
  //             entity_id: response.data?.entity_id,
  //           });
  //         }, 100);
  //         this.employeeDetails.forEach((item: any, index: number) => {
  //           this._rbacMasterService
  //             .employeGetByroleId(item.role_id, this.entity_id)
  //             .subscribe((res: any) => {
  //               this.roleGetByemployee[index] = res.data;
  //             });
  //           const formGroup = this.itemsFormArray.at(index) as FormGroup;
  //           if (formGroup) {
  //             debugger
  //             setTimeout(() => {
  //               formGroup.patchValue({
  //                 role_id: item.role_id,
  //                 employee_id: item.employee_id,
  //               });
  //             }, 200);
  //             this.cdr.detectChanges();
  //           } else {
  //             this.itemsFormArray.push(
  //               this.fb.group({
  //                 role_id: item.role_id,
  //                 employee_id: item.employee_id,
  //               })
  //             );
  //           }
  //         });
  //       },
  //       (err: any) => {
  //         this.toaster.error(err.error.message);
  //       }
  //     );
  // }

  // patchData(e: any): FormArray {
  //   return new FormArray(
  //     e.map((x: any) => {
  //       const obj = new FormGroup({});
  //       Object.keys(x).forEach((k) => {
  //         obj.addControl(k, new FormControl(x[k]));
  //       });
  //       return obj;
  //     })
  //   );
  // }
  

roleIdData(e: { value: string }, i: number): void {
  this.loading[i] = true;
  this.error[i] = '';
  this._rbacMasterService.employeGetByroleId(e.value, this.entity_id).subscribe(
    (res: { data: any[] }) => {
      this.roleGetByemployee[i] = res.data;
      this.filterroledata[i] = res.data;
      this.loading[i] = false;
      this.itemsFormArray.at(i).get('employee_id')?.reset();
    },
    (err) => {
      this.roleGetByemployee[i] = [];
      this.filterroledata[i] = [];
      this.loading[i] = false;
      this.error[i] = 'Failed to load data';
    }
  );
}

selectemp(e: any, index: number) {
  const selectedEmpId = e.value;
  let currentList = this.itemsFormArray.value;
  let newList = [...currentList];
  if (newList.length > 0) newList.splice(index, 1);

  const isDuplicate = newList.some((item: any) => item.employee_id === selectedEmpId);
  if (isDuplicate) {
    this.toast.error('This EMP has been already added');
    this.resetEmployeeId(index);
  }
}

resetEmployeeId(index: number) {
  const control = this.itemsFormArray.at(index).get('employee_id');
  control?.reset();
}

getWrokflowById() {
  this._configurationalMasterService.getByWorkFlowJob(this.workflowId).subscribe(
    (response: any) => {
      const data = response.data;
      this.employeeDetails = data.roleFiled;
      this.showAddButton = data.job_name !== 'Budget Planning';
      setTimeout(() => {
        this.form.patchValue({
          workflowdepartment: data.dept_id,
          job_request_id: data.job_name,
          department_id: data.department_name,
          budget_planning_type: data.budget_planning_type,
          entity_id: data.entity_id,
        });
      }, 100);

      // Patch form array for roles/employees
      this.employeeDetails.forEach((item: any, index: number) => {
        this._rbacMasterService.employeGetByroleId(item.role_id, this.entity_id).subscribe((res: any) => {
          this.roleGetByemployee[index] = res.data;
          this.filterroledata[index] = res.data;

          const formGroup = this.itemsFormArray.at(index);
          if (formGroup) {
            formGroup.patchValue({
              role_id: item.role_id,
              employee_id: item.employee_id,
            });
          } else {
            this.itemsFormArray.push(
              this.fb.group({
                role_id: item.role_id,
                employee_id: item.employee_id,
              })
            );
          }

          this.cdr.detectChanges();
        });
      });
    },
    (err: any) => {
      this.toast.error(err.error.message);
    }
  );
}

  filterByjobrequeset(event: any) {
    this.filterTypeofdata = event.data;
  }

  filterBydepartment(event: any) {
    this.filterdepartmentdata = event.data;
  }

  filterByRole(event: any) {
    this.filterByroledata = event.data;
  }

  filterByemployeement(event: { data: any[] }, i: number): void {
    this.filterroledata[i] = event.data;
  }
}
