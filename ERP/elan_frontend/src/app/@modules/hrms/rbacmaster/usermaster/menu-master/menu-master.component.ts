import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { AssignActionPopupComponent } from './assign-action-popup/assign-action-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';

@Component({
  selector: 'app-menu-master',
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.scss'],
})
export class menuMasterComponent {
  menuAll: any;
  // subMenu: any;
  checkForm: FormGroup;
  masterSelected: boolean = false;
  roles: any;
  data: any = [];
  val: any = '';
  roleGet: any;
  trueData: any[] = [];
  falseData: any[] = [];
  isTrade: boolean = false;
  checkAllTrades: boolean = false;
  allComplete: boolean = false;
  roleAssignForm: FormGroup;
  subMenuValueId: any;
  menuValueId: any;
  masterId: any;
  menuData: any;
  subMenuData: any[] = [];
  menuCompData: any[] = [];
  roleData: any[] = [];
  subCompData: any[] = [];
  subIdData: any[] = [];
  idData: any[] = [];
  checkedData: any[] = [];
  subMenuDataNew: any[] = [];
  roleId: any;
  roleGetBy: any;
  roleGetByemployee: any;
  btnActive: boolean = false;
  selectFunctiona: boolean = false;
  subMenuItems: any;
  formulalist: any[] = [];
  newArr: never[];
  Login_user_id: any = localStorage.getItem('signInUser');
  loginUserId: any = JSON.parse(this.Login_user_id).employee_id;
  updateRole: any;
  roleMasterId: any;
  submenuDataTwo: any[] = [];
  subMenuId: number;
  role_id: number;
  Main_Array: any = [];
  roleAll: any;
  user_id: any;
  mdata: any;
  loginUser: any;
  entityIds: any;
  roleGet2: any;
  roleGetByemployee2: any;
  employees: any;
  entityList2: any;
  entities: any;
  employeeId: any;
  loginUserRoleId: any;
  entityId: any;
  roleAssignBackup: any;
  employeeFilterCtrl = new FormControl('');
  filteredEmployees: any[] = [];

  constructor(
    private _rbacMasterService: RbacMasterService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private route: Router,
    private toast: ToastrService,
    public dialog: MatDialog,
    private entityService: EntityMasterService
  ) {
    this.roleAssignForm = this.fb.group({
      role_master_id: new FormControl(),
      // employee_id: new FormControl(),
      employee_ids: new FormControl([]),
      entity_id: new FormControl(),
      roleType: new FormControl(),
    });
  }
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    this.getRoleAssign();
    this.entityIds = localStorage.getItem('entityList');
    this.entityIds = JSON.parse(this.entityIds);
    this.entityIds = this.entityIds.map((entity: any) => entity.entity_id);
    // this.Main_Array = this.mdata
    this.employeeId = Number(localStorage.getItem('EmpMainId'));
    this.loginUserRoleId = Number(localStorage.getItem('role_master_id'));
    this.entityId = Number(localStorage.getItem('selectedEntityId'));

    /*for multiple select with search*/
    this.employeeFilterCtrl.valueChanges.subscribe((search: any) => {
      if (!search) {
        this.filteredEmployees = this.roleGetByemployee;
        return;
      }
      this.filteredEmployees = this.roleGetByemployee.filter((emp: any) =>
        (emp.first_name + ' ' + emp.last_name + ' ' + emp.employee_code)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }

  getRoleAssign() {
    this._rbacMasterService
      .getRole(this.loginUser.role)
      .subscribe((res: any) => {
        this.roleGet = res.data;
        this.roleGet2 = res.data;
        this.roles = this.roleGet2.map((res: any) => res.role_master_name);
        this.roleId = res.data.role_master_id;
      });
  }

  roleSearch(e: any) {
    const aa = e;
    let filteredVariable = this.roleGet2.filter((item: any) =>
      aa.includes(item.role_master_name)
    );
    this.roleGet = filteredVariable;
  }

  employeeSearch(e: any) {
    const aa = e;
    let filteredVariable = this.roleGetByemployee2.filter((item: any) =>
      aa.includes(
        item.first_name + ' ' + item.last_name + ' ' + item.employee_code
      )
    );
    this.roleGetByemployee = filteredVariable;
  }

  entitySearch(e: any) {
    const aa = e;
    let filteredVariable = this.entityList2.filter((item: any) =>
      aa.includes(item.entity_name)
    );
    this.entityList = filteredVariable;
  }

  get CF_1(): any {
    return this.checkForm.controls;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      window.location.reload();
      this.route.navigate([currentUrl]);
    });
  }

  //updateRoleAssign
  updateRoleAssign() {
    // this.loginUserId = 2
    let query = this.roleAssignForm?.value;
    console.log(query, this.Main_Array);
    this._rbacMasterService
      .updateRoleAssign(query, this.Main_Array)
      .subscribe((res: any) => {
        this.toast.success('Modules Assign Successfully');
        this.reloadCurrentRoute();
      });
    this.mdata = this.Main_Array;
  }

  changed(e: any) {}

  getMenu() {
    this._rbacMasterService.getAllMenu().subscribe((res: any) => {
      this.roles = res.data;
    });
  }

  onCheckboxChange(e: any) {}

  changeRoleModule(
    e: any,
    index: any,
    role: any,
    menu: any,
    role_id: any,
    menuName: any
  ) {
    let menus: any = [];
    let sub_menus: any = [];
    this.role_id = index;
    let formObj = this.roleAssignForm?.value;

    if (e.checked) {
      let data = {
        role_module_master_id: role_id,
        moduleName: menuName,
        forAll: true,
        forSingle: false,
        title: `Assign action of all ${menuName} modules`,
        role_id: this.user_id,

        role_master_id: formObj?.role_master_id,
        // employee_id: formObj?.employee_id,
        employee_ids: formObj?.employee_ids ?? [],
        entity_id: formObj?.entity_id,
      };

      console.log('#####1223', data);
      this.openAssignActionPopup(data);
    }
    for (let m = 0; m < menu.length; m++) {
      if (menu[m]?.HRMS_RBAC_SUBMENU_MASTER?.length > 0) {
        for (let s = 0; s < menu[m].HRMS_RBAC_SUBMENU_MASTER.length; s++) {
          if (e.checked) {
            role.role_module_master_completed = true;
            role.HRMS_RBAC_MENU_MASTER[m].menu_completed = true;
            // menu[m].menu_completed = true
            role.HRMS_RBAC_MENU_MASTER[m].HRMS_RBAC_SUBMENU_MASTER[
              s
            ].submenu_completed = true;
          } else {
            role.role_module_master_completed = false;
            role.HRMS_RBAC_MENU_MASTER[m].menu_completed = false;
            role.HRMS_RBAC_MENU_MASTER[m].HRMS_RBAC_SUBMENU_MASTER[
              s
            ].submenu_completed = false;
          }
        }
      } else {
        if (e.checked) {
          role.role_module_master_completed = true;
          role.HRMS_RBAC_MENU_MASTER[m].role_module_master_completed = true;
          role.HRMS_RBAC_MENU_MASTER[m].menu_completed = true;
        } else {
          role.role_module_master_completed = false;
          role.HRMS_RBAC_MENU_MASTER[m].role_module_master_completed = false;
          role.HRMS_RBAC_MENU_MASTER[m].menu_completed = false;
        }
      }
    }
    this.Main_Array[this.role_id] = role;
  }

  changeMenuAndSetAll(
    e: any,
    role: any,
    menu: any,
    submenue: any,
    menu_id: any,
    index: any,
    role_id: any,
    menuName: any
  ) {
    let submenue_temp: any = [];
    let main: any = [];
    this.role_id = role_id - 1;
    this.roleAll = role.HRMS_RBAC_MENU_MASTER;
    let formObj = this.roleAssignForm?.value;

    if (e.checked) {
      let data = {
        role_module_master_id: role_id,
        menu_master_id: menu_id,
        moduleName: menuName,
        forAll: true,
        forSingle: false,
        title: `Assign action of all ${menuName} modules`,
        role_id: this.user_id,

        role_master_id: formObj?.role_master_id,
        // employee_id: formObj?.employee_id,
        employee_ids: formObj?.employee_ids ?? [],
        entity_id: formObj?.entity_id,
      };
      this.openAssignActionPopup(data);
    }
    for (let m = 0; m < role.HRMS_RBAC_MENU_MASTER.length; m++) {
      if (
        role?.HRMS_RBAC_MENU_MASTER[m]?.HRMS_RBAC_SUBMENU_MASTER?.length > 0
      ) {
        for (
          let s = 0;
          s < role.HRMS_RBAC_MENU_MASTER[m].HRMS_RBAC_SUBMENU_MASTER.length;
          s++
        ) {
          if (m == index) {
            if (e.checked) {
              role.role_module_master_completed = true;
              role.HRMS_RBAC_MENU_MASTER[index].menu_completed = true;
              role.HRMS_RBAC_MENU_MASTER[index].HRMS_RBAC_SUBMENU_MASTER[
                s
              ].submenu_completed = true;
            } else {
              role.HRMS_RBAC_MENU_MASTER[index].menu_completed = false;
              role.HRMS_RBAC_MENU_MASTER[index].HRMS_RBAC_SUBMENU_MASTER[
                s
              ].submenu_completed = false;
            }
          }
        }
      } else {
        if (m == index) {
          if (e.checked) {
            role.role_module_master_completed = true;
            role.HRMS_RBAC_MENU_MASTER[index].menu_completed = true;
            role.HRMS_RBAC_MENU_MASTER[index].role_module_master_completed =
              true;
          } else {
            role.HRMS_RBAC_MENU_MASTER[index].menu_completed = false;
            role.HRMS_RBAC_MENU_MASTER[index].role_module_master_completed =
              false;
          }
        }
      }
    }

    let mains: any = [];
    for (let k = 0; k < role.HRMS_RBAC_MENU_MASTER.length; k++) {
      mains.push(role.HRMS_RBAC_MENU_MASTER[k].menu_completed);
    }
    if (mains.includes(true)) {
      role.role_module_master_completed = true;
    } else {
      role.role_module_master_completed = false;
    }
    this.Main_Array[this.role_id] = role;
  }

  changeSubModule(
    e: any,
    role: any,
    menu: any,
    submenue: any,
    submenue_id: any,
    menu_id: any,
    index: any,
    index_i: any,
    role_id: any,
    menuName: any
  ) {
    this.role_id = role_id - 1;

    let sub_menus: any = [];
    let sub_menus_all: any = [];
    let m_sb: any = [];
    let formObj = this.roleAssignForm?.value;

    if (e.checked) {
      let data = {
        role_module_master_id: role_id,
        menu_master_id: menu_id,
        submenu_master_id: submenue_id,
        moduleName: menuName,
        forAll: false,
        forSingle: true,
        title: `Assign action of ${menuName} module`,
        role_id: this.user_id,
        // employee_id: this.user_id,
        role_master_id: formObj?.role_master_id,
        // employee_id: formObj?.employee_id,
        employee_ids: formObj?.employee_ids ?? [],
        entity_id: formObj?.entity_id,
      };
      this.openAssignActionPopup(data);
    }

    for (let m = 0; m < role?.HRMS_RBAC_MENU_MASTER?.length; m++) {
      for (
        let s = 0;
        s < role?.HRMS_RBAC_MENU_MASTER[m]?.HRMS_RBAC_SUBMENU_MASTER?.length;
        s++
      ) {
        m_sb = sub_menus_all;
        if (m == index_i) {
          if (e.checked) {
            role.HRMS_RBAC_MENU_MASTER[m].HRMS_RBAC_SUBMENU_MASTER[
              index
            ].submenu_completed = true;
          } else {
            role.HRMS_RBAC_MENU_MASTER[m].HRMS_RBAC_SUBMENU_MASTER[
              index
            ].submenu_completed = false;
          }
          sub_menus.push(
            role.HRMS_RBAC_MENU_MASTER[m].HRMS_RBAC_SUBMENU_MASTER[s]
              .submenu_completed
          );
        }
        sub_menus_all.push(
          role.HRMS_RBAC_MENU_MASTER[m].HRMS_RBAC_SUBMENU_MASTER[s]
            .submenu_completed
        );
      }
    }
    if (sub_menus.includes(true)) {
      // role.role_module_master_completed = true
      role.HRMS_RBAC_MENU_MASTER[index_i].menu_completed = true;
    } else {
      role.HRMS_RBAC_MENU_MASTER[index_i].menu_completed = false;
    }
    if (sub_menus_all.includes(true)) {
      role.role_module_master_completed = true;
    } else {
      role.role_module_master_completed = false;
    }
    this.Main_Array[this.role_id] = role;
  }

  // roleIdData(e: any) {

  //   this.roleGetByemployee = [];
  //   this.entityList = [];
  //   this.roleAssignForm?.patchValue({ employee_id: null, entity_id: null })

  //   // this.selectFunctiona = true;
  //   // this.user_id = e
  //   // this.getMenu();
  //   // this.btnActive = true;
  //   // this._rbacMasterService.roleGetById(e).subscribe((res: any) => {
  //   //   this.roleGetBy = res.data;
  //   //   let moduledata = res.data;
  //   //   this.mdata = this.roleGetBy
  //   //   this.Main_Array = this.mdata
  //   // });

  //   let entity_id = localStorage.getItem("selectedEntityId");
  //   this._rbacMasterService.employeGetByroleId(e, entity_id).subscribe((res: any) => {
  //     this.roleGetByemployee = res.data;
  //     this.roleGetByemployee2 = res.data;
  //     this.employees = this.roleGetByemployee?.map((res: any) =>  { return res.first_name + " " + res.last_name + " " + res.employee_code })
  //   });
  // };

  // roleMenuAccessIdData() {
  //   let data;
  //   if (this.loginUserRoleId == 1) {
  //     this.roleAssignForm.get('roleType')?.setValue('superAdmin')
  //     data = { ...this.roleAssignForm?.value };
  //     console.log("admin+++++++++++++", data);
  //   }
  //   else {
  //     this.roleAssignBackup = this.roleAssignForm?.value;
  //     this.roleAssignForm.patchValue({
  //       role_master_id: this.loginUserRoleId,
  //       employee_id: this.employeeId,
  //       entity_id: this.entityId
  //     });
  //     data = { ...this.roleAssignForm?.value };
  //     console.log("customer", data);
  //   }

  //   this.selectFunctiona = true;
  //   // this.getMenu();
  //   this.btnActive = true;
  //   this._rbacMasterService.roleGetById(data).subscribe((res: any) => {
  //     this.roleGetBy = res.data;
  //     let moduledata = res.data;
  //     this.mdata = this.roleGetBy;
  //     this.Main_Array = this.mdata;

  //     if (this.loginUserRoleId != 1) {
  //       this.roleAssignForm.patchValue({
  //         role_master_id: this.roleAssignBackup.role_master_id,
  //         employee_id: this.roleAssignBackup.employee_id,
  //         entity_id: this.roleAssignBackup.entity_id
  //       });
  //       console.log('this.roleAssignForm', this.roleAssignForm.value)
  //     }
  //   });
  // };

  roleIdData(e: any) {
    this.roleGetByemployee = [];
    this.entityList = [];
    this.roleAssignForm?.patchValue({ employee_ids: [] });

    let entity_id = localStorage.getItem('selectedEntityId');
    this._rbacMasterService
      .employeGetByroleId(e, entity_id)
      .subscribe((res: any) => {
        this.roleGetByemployee = res.data;
        this.roleGetByemployee2 = res.data;
        this.filteredEmployees = [...this.roleGetByemployee];

        // const allIds = this.roleGetByemployee.map((emp: any) => emp.employee_id);
        // this.roleAssignForm.patchValue({ employee_ids: allIds });
        this.roleAssignForm.patchValue({ employee_ids: [] });

        this.getEntityList();
      });
  }

  roleMenuAccessIdData() {
    let data;
    if (this.loginUserRoleId == 1) {
      this.roleAssignForm.get('roleType')?.setValue('superAdmin');

      data = { ...this.roleAssignForm?.value };
      if (Array.isArray(data.employee_ids) && data.employee_ids.length > 0) {
        data.employee_id = data.employee_ids[0];
      }
    } else {
      this.roleAssignBackup = this.roleAssignForm?.value;

      this.roleAssignForm.patchValue({
        role_master_id: this.loginUserRoleId,
        employee_id:
          Array.isArray(this.roleAssignBackup.employee_ids) &&
          this.roleAssignBackup.employee_ids.length > 0
            ? this.roleAssignBackup.employee_ids[0]
            : this.employeeId,
        entity_id: this.entityId,
      });

      data = { ...this.roleAssignForm?.value };
    }

    this.selectFunctiona = true;
    this.btnActive = true;

    this._rbacMasterService.roleGetById(data).subscribe((res: any) => {
      this.roleGetBy = res.data;
      this.mdata = res.data;
      this.Main_Array = this.mdata;

      if (this.loginUserRoleId != 1) {
        this.roleAssignForm.patchValue({
          role_master_id: this.roleAssignBackup.role_master_id,
          employee_ids: this.roleAssignBackup.employee_ids, // 👈 restore array
          entity_id: this.roleAssignBackup.entity_id,
        });
        console.log('this.roleAssignForm', this.roleAssignForm.value);
      }
    });
  }

  createRoleAssign(e: any) {}

  refresh() {
    window.location.reload();
  }

  openAssignActionPopup(data: any) {
    console.log(data, 'data Popup Popup');
    const dialogRef = this.dialog.open(AssignActionPopupComponent, {
      width: '400px',
      disableClose: true,
      data: { ...data },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  // Entity list start
  entityList: any = [];
  selectedEntity: any;
  // getEntityList = () => {
  //   this.entityList = [];
  //   let req = this.roleAssignForm?.value;
  //   this.roleAssignForm?.patchValue({ entity_id: null })
  //   this.entityService.get_entity_list(req).subscribe((res: any) => {
  //     this.entityList = res?.Entity_List;
  //     this.entityList2 = res?.Entity_List;
  //     this.entities = this.entityList2?.map((res: any) =>  { return res.entity_name  })
  //   })
  // }

  // getEntityList = () => {
  //   this.entityList = [];
  //   let req = { ...this.roleAssignForm.value };
  //   console.log

  //   if (Array.isArray(req.employee_ids) && req.employee_ids.length > 0) {
  //     req.employee_id = req.employee_ids[0];
  //   }

  //   this.roleAssignForm.patchValue({ entity_id: null });
  //   this.entityService.get_entity_list(req).subscribe((res: any) => {
  //     this.entityList = res?.Entity_List || [];
  //     this.entityList2 = this.entityList;
  //     this.entities = this.entityList2?.map((res: any) => res.entity_name);

  //     // if (this.entityList.length > 0) {
  //     //   this.roleAssignForm.patchValue({ entity_id: this.entityList[0].entity_id });
  //     // }

  //   });
  // }

  getEntityList = () => {
    this.entityList = [];
    let req = { ...this.roleAssignForm.value };
    if (Array.isArray(req.employee_ids) && req.employee_ids.length > 0) {
      req.employee_id = req.employee_ids[0];
    } else {
      console.warn('No employee selected, skipping entity list fetch.');
      return;
    }

    this.roleAssignForm.patchValue({ entity_id: null });

    this.entityService.get_entity_list(req).subscribe((res: any) => {
      this.entityList = res?.Entity_List || [];
      this.entityList2 = this.entityList;
      this.entities = this.entityList2?.map((res: any) => res.entity_name);
    });
  };

  allSelected: boolean = false;

  selectAllEmployees() {
    const allIds = this.filteredEmployees.map((emp: any) => emp.employee_id);
    this.roleAssignForm.patchValue({ employee_ids: allIds });
    this.allSelected = true;
    this.getEntityList();
  }

  clearAllEmployees() {
    this.roleAssignForm.patchValue({ employee_ids: [] });
    this.allSelected = false;
    this.getEntityList();
  }

  onEmployeeSelectionChange(event: any) {
    const selected = this.roleAssignForm.value.employee_ids || [];
    this.allSelected = selected.length === this.filteredEmployees.length;
    //manual selection employee
    if (selected.length > 0) {
      this.getEntityList();
    } else {
      this.entityList = [];
      this.roleAssignForm.patchValue({ entity_id: null });
    }
  }
}
