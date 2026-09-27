import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-add-work-flow-rfp',
  templateUrl: './add-work-flow-rfp.component.html',
  styleUrls: ['./add-work-flow-rfp.component.scss']
})
export class AddWorkFlowRfpComponent implements OnInit {
  form: FormGroup;
  getCat_data: any[] = [];
  department: any;
  workflowId: any;
  employeeDetails: any = [];
  workflowTypeItem: any;
  loginUser: any;
  item_masterData: any;
  getAllBomData: { id: number; bomCategory: string; }[];
  idemp: any;
  conditioncheck: boolean = false;
  roleGetByemployee: any[] = []
  dept: any;
  entity_id:any;
  entityList : any = [];
  entityIds : any = [];
  constructor(private location: Location,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private _commonService : CommonService,
    private cdr: ChangeDetectorRef
    
  ) {
    this.form = this.fb.group({
      roleFiled: new FormArray([
        new FormGroup({
          roleId: new FormControl(null, [Validators.required]),
          employeeId: new FormControl(null, [Validators.required]),
        }),
      ]),
      workflowType: "RFP",
      workflowdepartment: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.workflowId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    let entityList: any = localStorage.getItem('entityList')
    this.entityList = JSON.parse(entityList);
    this.entityIds = this.entityList.map((entity:any) => entity.entity_id);
    this.getDepartment();
    this.getRoleAssign();
    if (this.workflowId) {
      this.getWrokflowById();
    }
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
        if (!obj.employeeId) {
          canAddNewRow = false;
          break;
        }
      }

      if (canAddNewRow) {
        let data = this.fb.group({
          roleId: new FormControl('', [Validators.required]),
          employeeId: new FormControl('', [Validators.required]),
        });

        this.itemsFormArray.push(data);
        console.log(this.itemsFormArray, 'this.itemsFormArray');
        this.conditioncheck = true
      } else {
        this.toast.warning("Please add first Row")
      }

    }



  }
  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }
  goBack() {
    this.location.back();
  }

  getDepartment() {
    this._commonService?.showLoader()
    this._configurationalMasterService.getDepartment(this.entity_id).subscribe((res: any) => {
      this.department = res.data.filter((res: any) => res.status == "ACTIVE");
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  onSubmit(data: any) {
    console.log(data, 'dataa');
    data.roleFiled.forEach((role: any, index: any) => {
      role['level'] = index + 1;
    });
    console.log(data, 'data modified');

    if (this.workflowId) {
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        return
      }
      this._commonService?.showLoader()
      this._configurationalMasterService.updateWorkflowRfpById(this.workflowId, data).subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader()
          if (response.message == "WorkFlow Already Exists") {
            this.toaster.error(response.message);
          } else {
            this.toaster.success(response.message);
          }
          this.router.navigate(['master/workflow/workflow-RFP'])
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message);
      })
    }
    else {
      this.workflowId = null;
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        this.toaster.error('All fields are Mendatory', 'Error Message')
        return
      }
      this._commonService?.showLoader()
      this._configurationalMasterService.createWorkflowRfp(data).subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader()
          if (response.message == "WorkFlow Already Exists") {
            this.toaster.error(response.message);
          } else {
            this.toaster.success(response.message);
          }
          this.router.navigate(['master/workflow/workflow-RFP'])
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message)
      })
    }
  }

  roleGet: any = []
  getRoleAssign() {
    this._rbacMasterService.getRole(this.loginUser.role).subscribe((res: any) => {
      this.roleGet = res.data;
    });
  }

  roleIdData(e: any, i: any) {
    console.log(e.value, 'eeeeee');
    console.log(i, 'iiii');
    this._commonService?.showLoader()
    this._rbacMasterService.employeGetByroleId(e.value,this.entityIds).subscribe((res: any) => {
      console.log(res, 'resdata');
      this._commonService?.hideLoader()
      this.roleGetByemployee[i] = res.data;
    },(err:any) => {
      this._commonService?.hideLoader()
    });
  };

  selectemp(e: any, index: any) {
    console.log(e, 'eeee');
    this.idemp = e.value;

    console.log(this.roleGetByemployee[index], 'this.roleGetByemployee');
    const roleData: any = this.roleGetByemployee[index]
    let currentList = this.itemsFormArray.value;

    console.log(this.itemsFormArray, 'this.itemsFormArray');


    console.log(currentList, 'currentList');
    let isDuplicate = true;
    let newList = currentList.slice();
    if (currentList && currentList.length > 0) newList.splice(index, 1)
    newList.map((item: any) => {
      console.log(item, 'iteeem');

      if (item.employeeId == this.idemp) {
        isDuplicate = false;
        this.toast.error('This EMP has been already added')
        this.resetEmployeeId(index);
        this.itemsFormArray?.at(index).get('employeeId').reset();
      }
    })
  }
  resetEmployeeId(index: any) {
    const control: any = (this.form.get('roleField') as FormArray)?.at(index).get('employeeId');
    control?.reset(); // Resetting the value of employeeId FormControl
  }
  getWrokflowById() {
    this._configurationalMasterService.getWorkflowRfpById(this.workflowId).subscribe((response: any) => {
      this.workflowTypeItem = response.data?.workflow_type;
      this.dept = response.data?.department_name
      this.employeeDetails = response.data.employeedetails;
      setTimeout(() => {
        this.form.patchValue({
          workflowdepartment: response.data?.dept_id,
        })
      }, 100);
      console.log(this.employeeDetails, 'this.employeeDetails');

      this.employeeDetails.forEach((item: any, index: number) => {
        console.log(item, 'itemmm');

        const formGroup = this.itemsFormArray.at(index) as FormGroup;
        console.log(formGroup, 'formgroup');
        this._rbacMasterService.employeGetByroleId(item.role_master_id,this.entityIds).subscribe((res: any) => {
          console.log(res, 'resdata');
          this.roleGetByemployee[index] = res.data;
        });
        if (formGroup) {
          setTimeout(() => {
            // this.roleIdData(item.role_master_id, index)
            formGroup.patchValue({
              roleId: item.role_master_id,
              employeeId: item.employee_id,
            });
          }, 200)
          this.cdr.detectChanges();
        }
        else {
          this.itemsFormArray.push(
            this.fb.group({
              roleId: item.role_master_id,
              employeeId: item.employee_id,
            })
          );
        }
      });
    }, (err: any) => {
      this.toaster.error(err.error.message);
    })
  }

  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  };
}