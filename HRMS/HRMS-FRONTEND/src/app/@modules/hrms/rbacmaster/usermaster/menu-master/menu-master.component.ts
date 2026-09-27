import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { AssignActionPopupComponent } from './assign-action-popup/assign-action-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { e } from '@fullcalendar/core/internal-common';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';

@Component({
  selector: 'app-menu-master',
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.scss'],
})
export class menuMasterComponent {
  menuAll: any;
  checkForm: FormGroup;
  masterSelected: boolean = false;
  isAllSelect: boolean = false;
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
  designationData: any = [];
  designationData2: any = [];
  roleEmployeData: any;
  roleEmployeData2: any = [];
  entityData: any = [];
  entityData2: any = [];
  event: any;
  filteredEntityList: any;
  entityArr1: any[] = [];
  primaryEntityId: number | null = null;

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
      employee_id: new FormControl(),
      entity_id: new FormControl(),
    });
  }
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);

    this.getRoleAssign();

    let rawEntityList = localStorage.getItem('entityList');
    if (rawEntityList) {
      const parsedEntities = JSON.parse(rawEntityList);
      this.entityList = parsedEntities;
      this.filteredEntityList = [...this.entityList]; // Important!
    }
  }


  filterDesignation: any = []
  filterEmployee: any = []
  getRoleAssign() {
    this._rbacMasterService
      .getRole(this.loginUser.role)
      .subscribe((res: any) => {
        this.roleGet = res.data;
        this.filterDesignation = [...this.roleGet]
        this.filterEmployee = [...this.roleEmployeData]
        this.roleId = res.data.role_master_id;
        this.designationData = this.roleGet.map(
          (res: any) => res.role_master_name
        );
        this.designationData2 = this.roleGet;
      });
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

  submit() {
    let val = this.checkForm.value;
  }
  updateRoleAssign() {
    let query = this.roleAssignForm?.value;
    if (!query?.entity_id || query?.entity_id.length === 0) {
      this.toast.error('Please select at least one entity.');
      return;
    }

    let req = {
      ...query,
      entity_list: query?.entity_id,
      main_array: this.Main_Array,
    };
    this._rbacMasterService.updateRoleAssign(req).subscribe((res: any) => {
      this.toast.success('Modules Assign Successfully');
      this.reloadCurrentRoute();
    });

    this.mdata = this.Main_Array;
  }

  changed(e: any) { }
  designationFilter(e: any) {
    let filteredVariables = this.designationData2.filter((item: any) =>
      e.includes(item.role_master_name)
    );
    this.roleGet = filteredVariables;
  }
  roleFilter(e: any) {
    let filteredVariable = this.roleEmployeData2.filter((item: any) =>
      e.includes(item.first_name + item.last_name + item.employee_id)
    );
    this.roleGetByemployee = filteredVariable;
  }
  // entityFilter(e: any) {
  //   let filterVariable = this.entityData2.filter((item: any) => e.includes(item.entity_name));
  //   this.entityList = filterVariable
  // }

  entityFilter(e: any): void {
  const filtered = this.entityData2.filter((item: any) =>
    e.includes(item.entity_name)
  );

  const selectedIds = this.roleAssignForm?.value?.entity_id || [];
  const selectedItems = this.entityData2.filter((item: any) =>
    selectedIds.includes(item.entity_id)
  );

  const merged = [...filtered, ...selectedItems];
  this.entityList = Array.from(
    new Map(merged.map((item) => [item.entity_id, item])).values()
  );
}

// 4. Select All function
selectAllEntities(event: any): void {
  this.isAllSelect = !this.isAllSelect;

  const allEntityIds = this.entityList.map((item: any) => item.entity_id);

  this.roleAssignForm.controls['entity_id'].setValue(
    this.isAllSelect ? allEntityIds : []
  );
}

  getMenu() {
    this._rbacMasterService.getAllMenu().subscribe((res: any) => {
      this.roles = res.data;
    });
  }

  onCheckboxChange(e: any) { }

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
        employee_id: formObj?.employee_id,
        entity_id: formObj?.entity_id,
      };
      this.openAssignActionPopup(data);
    }
    for (let m = 0; m < menu.length; m++) {
      if (menu[m]?.HRMS_RBAC_SUBMENU_MASTER?.length > 0) {
        for (let s = 0; s < menu[m].HRMS_RBAC_SUBMENU_MASTER.length; s++) {
          if (e.checked) {
            role.role_module_master_completed = true;
            role.HRMS_RBAC_MENU_MASTER[m].menu_completed = true;
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
    this.Main_Array[index] = role;
  }

  changeMenuAndSetAll(
    e: any,
    role: any,
    menu: any,
    submenue: any,
    menu_id: any,
    index: any,
    role_id: any,
    menuName: any,
    mainIndex: any
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
        employee_id: formObj?.employee_id,
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
    this.Main_Array[mainIndex] = role;
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
    menuName: any,
    mainIndex: any
  ) {
    this.role_id = role_id - 1;

    let sub_menus: any = [];
    let sub_menus_all: any = [];
    let m_sb: any = [];
    let formObj = this.roleAssignForm?.value;
    this.event = e;
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
        employee_id: formObj?.employee_id,
        entity_id: formObj?.entity_id,
      };
      this.openAssignActionPopup(data);
    }
    for (let m = 0; m < role.HRMS_RBAC_MENU_MASTER?.length; m++) {
      for (
        let s = 0;
        s < role.HRMS_RBAC_MENU_MASTER[m].HRMS_RBAC_SUBMENU_MASTER?.length;
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
    let mains: any = [];
    for (let k = 0; k < role.HRMS_RBAC_MENU_MASTER.length; k++) {
      mains.push(role.HRMS_RBAC_MENU_MASTER[k].menu_completed);
    }
    if (sub_menus.includes(true)) {
      role.role_module_master_completed = true;
      role.HRMS_RBAC_MENU_MASTER[index_i].menu_completed = true;
    } else {
      role.HRMS_RBAC_MENU_MASTER[index_i].menu_completed = false;
    }
    if (sub_menus_all.includes(true)) {
      role.role_module_master_completed = true;
    } else if (mains.includes(true)) {
      role.role_module_master_completed = true;
    } else {
      role.role_module_master_completed = false;
    }
    this.Main_Array[mainIndex] = role;
  }

  roleIdData(e: any) {
     this.roleGetByemployee = [];
  this.entityList = [];
  this.selectFunctiona = false;
  this.mdata = []; // Reset menu data
  this.roleAssignForm?.patchValue({ employee_id: null, entity_id: null });

  let entity_id = localStorage.getItem('selectedEntityId');
    this._rbacMasterService
      .employeGetByroleId(e, entity_id)
      .subscribe((res: any) => {
        this.roleGetByemployee = res.data;
        this.roleEmployeData = this.roleGetByemployee.map(
          (res: any) => res.first_name + res.last_name + res.employee_id
        );
        this.roleEmployeData2 = [...this.roleGetByemployee];
        this.filterEmployee = [...this.roleEmployeData2];
      });
      
  }

  filterMenu: any;

  roleMenuAccessIdData() {
    let data = { ...this.roleAssignForm?.value };
    this.selectFunctiona = true;
    data.entity_list = this.entityList;
    this.btnActive = true;
    this._rbacMasterService.roleGetById(data).subscribe((res: any) => {
      // this.roleGetBy = res.data;
      this.filterMenu = res.data;
      this.roleGetBy = this.filterMenu.filter((item: any) => {
        return item.allocation === 'HRMS';
      });
      this.mdata = this.roleGetBy;
      this.Main_Array = this.mdata;

      let tempEntityArray: any = [];
      this.entityList?.map((item: any) => {
        let findData = res.entity_list.find(
          (elem: any) => elem.entity_id == item?.entity_id
        );
        if (findData?.entity_id) {
          tempEntityArray.push(findData?.entity_id);
        }
      });
      this.roleAssignForm.patchValue({ entity_id: tempEntityArray });
    });
  }

  createRoleAssign(e: any) { }

  // selectAllEntities(event: any): void {
  //   const checked = event?.source?.checked ?? !this.isAllSelect;
  //   this.isAllSelect = checked;
  //   const allEntity: number[] =
  //     this.entityList?.map((item: any) => Number(item?.entity_id)) || [];

  //   this.roleAssignForm.controls['entity_id'].setValue(
  //     this.isAllSelect ? allEntity : []
  //   );
  // }

  refresh() {
    window.location.reload();
  }

  onEntitySelectionChange(selectedEntities: number[]): void {
  if (!this.primaryEntityId) {
    if (selectedEntities.length > 0) {
      this.primaryEntityId = selectedEntities[0];
    } else {
      this.primaryEntityId = null;
    }
  }
}

  openAssignActionPopup(data: any) {
    console.log(data, 'data Popup Popup');

    const dialogRef = this.dialog.open(AssignActionPopupComponent, {
      width: '400px',
      disableClose: true,
      data: { ...data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.roleMenuAccessIdData();
      }
    });
  }

  // Entity list start
  entityList: any = [];
  selectedEntity: any;
  filterEnityBranch: any;
 getEntityList = () => {
  let req = this.roleAssignForm?.value;
  this.roleAssignForm?.patchValue({ entity_id: null });

  this.entityService.get_entity_list(req).subscribe((res: any) => {
    this.entityList = res?.Entity_List || [];
    this.entityData2 = [...this.entityList]; // Master copy for filtering
    this.entityArr1 = this.entityList.map((e: any) => e.entity_name);

    this.roleMenuAccessIdData();
  });
};
}
