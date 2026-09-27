import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  styleUrls: ['./department-dialog.component.scss'],
})
export class DepartmentDialogComponent {
  isAllSelect: boolean = false;
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
  departmentName: any = [];
  entityId: any = [];
  filterEntitylist: any = [];
  cc_code: any;
  status: any;
  old_department_name: any;
  headList: any[] = [];          // full employee list
  filteredHeadList: any[] = [];
  locationList: any[] = [];
  filteredLocationList: any[] = [];
  businessUnitList: any[] = [];
  filteredBusinessUnitList: any[] = [];
  departmentList: any[] = [];
  filteredDepartmentList: any[] = [];



  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<DepartmentDialogComponent>,
    private entityService: EntityMasterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      department_name: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      cc_code: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      role_name: new FormControl(null),
      employee_name: new FormControl(null),
      is_parent_dept: [false],
      bussiness_unit: new FormControl(null),
      head_of_dept: new FormControl(null),
      budget_allocation: new FormControl(null),
      parent_dept: new FormControl(''),
      location: new FormControl(null),
      entity_id: [[]],
    });
  }

  ngOnInit() {
    let dept_id: any;
    this.departmentName = this.data?.department;
    this.cc_code = this.data?.cc_code;
    this.status = this.data?.status;
    console.log(' this.cc_code', this.cc_code);
    this.view = this.data?.view;
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.loginUserID = this.loginUser.employee_id;
    let entityList: any = localStorage.getItem('entityList');
    this.entityList = JSON.parse(entityList);
    this.entityIds = this.entityList.map((entity: any) => entity.entity_id);
    this.departmentForm.get('is_parent_dept')?.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.departmentForm.get('parent_dept')?.reset();
      }
    });
    this.getallrole();
    this.getEntityList();
    this.DeparmentDataPatch();
    this.getEmplistData();
    this.getBusinessUnitList();
    this.getDepartment();
    this.getListBranchSetup();
  }


  // DeparmentDataPatch() {
  //   if (this.departmentName) {
  //     this._configurationalMasterService
  //       .departmentMasterById(this.departmentName)
  //       .subscribe((res: any) => {
  //         this.departmentData = res.data;
  //         this.entityId = res.entity_ids;

  //         this.departmentForm.patchValue({
  //           department_name: this.departmentData[0].department_name,
  //           cc_code: this.departmentData[0].cc_code,
  //           role_name: this.departmentData?.role_master_id,
  //           employee_name: this.departmentData?.employee_id,
  //           entity_id: this.entityId,
  //         });
  //         (this.old_department_name = this.departmentData[0].department_name),
  //           this.get_all_employeeBy_User_role(
  //             this.departmentData?.role_master_id
  //           );
  //         this.checkIfAllSelected();
  //       });
  //   }
  // }

  DeparmentDataPatch() {
    if (this.departmentName) {
      this._configurationalMasterService
        .departmentMasterById(this.departmentName)
        .subscribe((res: any) => {

          this.departmentData = res.data;
          let entityValue = this.departmentData.entity_id;

          if (entityValue && !Array.isArray(entityValue)) {
            entityValue = [entityValue];
          }


          console.log("Dept Data:", this.departmentData);
          console.log("Entity ID from API:", this.entityId);
          // Patch ALL keys dynamically
          this.departmentForm.patchValue({
            ...this.departmentData,
            parent_dept: Number(this.departmentData.parent_dept),
            entity_id: entityValue  // override if needed
          });

          console.log("FORM AFTER PATCH:", this.departmentForm.value);

          this.old_department_name = this.departmentData.department_name;

          this.get_all_employeeBy_User_role(this.departmentData.role_master_id);
          this.checkIfAllSelected();
        });
    }
  }


  onParentDeptToggle(event: MatCheckboxChange) {
    const checked = event.checked;
    const parentDeptControl = this.departmentForm.get('parent_dept');

    if (checked) {
      // Checkbox ticked → Hide + Reset + Remove validation
      parentDeptControl?.reset();
      parentDeptControl?.clearValidators();
      parentDeptControl?.updateValueAndValidity();
    } else {
      // Checkbox unticked → Show + Make required again
      parentDeptControl?.setValidators([Validators.required]);
      parentDeptControl?.updateValueAndValidity();
    }
  }


  getallrole() {
    this._configurationalMasterService
      .getAllRole(this.loginUser.role)
      .subscribe((res: any) => {
        this.roles = res.data;
      });
  }

  get_all_employeeBy_User_role(event: any) {
    let entity_id = localStorage.getItem('selectedEntityId');
    console.log(entity_id, 'entity_id');
    let val = this.departmentForm.value;
    this._configurationalMasterService
      .get_all_employeeBy_User_role(event, entity_id)
      .subscribe((res: any) => {
        this.employees = res.data;
      });
  }

  getDepartment() {
    this._configurationalMasterService.getDepartmentAll(this.entity_id).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.departmentList = res.data;
          this.filteredDepartmentList = [...this.departmentList];
        }
      },
      error: (err) => {
        console.error('Error fetching department list', err);
        this.departmentList = [];
        this.filteredDepartmentList = [];
      }
    });
  }

  getEmplistData() {
    this._configurationalMasterService.get_all_employe(this.entity_id).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.headList = res.data;
          this.filteredHeadList = [...this.headList]; // initialize filter list
        }
      },
      error: (err) => {
        console.error('Error fetching employee list', err);
      }
    });
  }

  getBusinessUnitList() {
    this._configurationalMasterService.businessunitList(this.entity_id).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.businessUnitList = res.data;
          this.filteredBusinessUnitList = [...this.businessUnitList];
        }
      },
      error: (err) => console.error('Error fetching location list', err)
    });
  }


  getListBranchSetup() {
    this._configurationalMasterService.getListBranchSetup(this.entityId).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.locationList = res.data;
          this.filteredLocationList = [...this.locationList];
        }
        console.log(this.locationList, "mfksd");
      },
      error: (err) => console.error('Error fetching country list', err),
    });
  }



  onSubmitForm() {
    console.log('🔹 Form Submitted');
    console.log('Form Raw Value:', this.departmentForm.value);

    // Mark all fields as touched for validation
    Object.keys(this.departmentForm.controls).forEach((key) => {
      this.departmentForm.controls[key].markAsTouched();
    });

    this.submitted = true;

    // Validation check
    if (this.departmentForm.invalid) {
      console.error('❌ Form Invalid:', this.departmentForm.errors);
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }

    const val = this.departmentForm.value;
    console.log('✅ Form Validated Successfully');

    // Prepare payload
    const data: any = {
      department_name: val.department_name,
      cc_code: val.cc_code,
      role_master_id: val.role_name,
      employee_id: val.employee_name,
      entity_id: val.entity_id,
      bussiness_unit: val.bussiness_unit,
      head_of_dept: val.head_of_dept,
      budget_allocation: val.budget_allocation,
      location: val.location,
      is_parent_dept: val.is_parent_dept ? 1 : 0,
    };

    // Only send parent_dept if NOT a parent department
    if (!val.is_parent_dept) {
      data.parent_dept = val.parent_dept;
    }

    console.log('📦 Final Payload for API:', data);

    // API Call
    this._configurationalMasterService.createMaterDepartment(data).subscribe(
      (res: any) => {
        console.log('✅ API Response:', res);

        if (res.message === 'Department Name is Already Exits!') {
          this.toast.warning('Department Name is Already Exits!');
        } else {
          this.toast.success('Department Added Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/department',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        console.error('❌ API Error:', err);
        this.toast.error(err.error.message);
      }
    );
  }


  onUpdateForm() {
    Object.keys(this.departmentForm.controls).forEach((key) => {
      this.departmentForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.departmentForm.invalid) {
      this.toast.error(
        'Required fields should not be empty.',
        'Error Occurred!'
      );
      return;
    }
    let val = this.departmentForm.value;
    const data = {
      department_name: val.department_name,
      cc_code: val.cc_code,
      role_master_id: val.role_name,
      employee_id: val.employee_name,
      entity_id: val.entity_id,
      old_department_name: this.old_department_name,
    };
    this._configurationalMasterService
      .updateDepartmentMaster(this.departmentName, data)
      .subscribe(
        (res: any) => {
          if (res.message == 'Department Name is Already Exits!') {
            this.toast.warning('Department Name is Already Exits!');
          } else {
            this.toast.success('Department Updated Successfully');
          }
          this.route.navigate([
            'master/itticket/configurational-master/department',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        },
        (err) => {
          this.toast.error(err.error.message);
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



  getEntityList = () => {
    this.entityService.getAll_active_Entity().subscribe((res: any) => {
      console.log(res.data);
      this.entityList = res.data;
      this.filterEntitylist = this.entityList;
    });
  };

  searchEntity(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.filterEntitylist = [...this.entityList];
    } else {
      this.filterEntitylist = this.entityList.filter((item: any) =>
        item?.entity_name?.toLowerCase().includes(searchValue)
      );
    }
  }

  selectallentityid(event: any) {
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      const allIds = this.filterEntitylist.map((item: any) => item.entity_id);
      this.departmentForm.get('entity_id')?.setValue(allIds);
    } else {
      this.departmentForm.get('entity_id')?.setValue([]);
    }
  }

  isIndeterminate(): boolean {
    const selected = this.departmentForm.get('entity_id')?.value || [];
    return (
      selected.length > 0 && selected.length < this.filterEntitylist.length
    );
  }

  checkIfAllSelected() {
    const selectedallentityid =
      this.departmentForm.get('entity_id')?.value || [];
    this.isAllSelect =
      selectedallentityid.length === this.filterEntitylist.length;
  }
}
