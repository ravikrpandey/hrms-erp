import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RbacModule } from 'src/app/@shared/interface/core.interface';
import { MenuManagementService } from 'src/app/@shared/services/menu-management.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss'],
})
export class RolePermissionComponent implements OnInit {
  moduleList: RbacModule[] = [];

  constructor(
    private menuApi: MenuManagementService,
    private dialog: MatDialogRef<RolePermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getMenuList();
  }

  getMenuList() {
    this.menuApi
      .getRolePermissions(this.data.role_master_id)
      .subscribe((res: any) => {
        this.moduleList = res.modules;
      });
  }

  // Expand all panels
  expandAll() {
    this.moduleList.forEach((module) => {
      module.expanded = true;
      if (module.children) {
        module.children.forEach((menu) => {
          menu.expanded = true;
        });
      }
    });
  }

  // Collapse all panels
  collapseAll() {
    this.moduleList.forEach((module) => {
      module.expanded = false;
      if (module.children) {
        module.children.forEach((menu) => {
          menu.expanded = false;
        });
      }
    });
  }

  // Clear all permissions
  clearAll() {
    if (confirm('Are you sure you want to clear all permissions?')) {
      this.moduleList.forEach((module) => {
        module.selected = false;
        module.read = false;
        module.write = false;
        module.remove = false;

        if (module.children) {
          module.children.forEach((menu) => {
            menu.selected = false;
            menu.read = false;
            menu.write = false;
            menu.remove = false;

            if (menu.children) {
              menu.children.forEach((child) => {
                child.selected = false;
                child.read = false;
                child.write = false;
                child.remove = false;
              });
            }
          });
        }
      });
      this.toast.info('All permissions cleared');
    }
  }

  // Add extra properties for checkboxes
  convertToPermissionStructure(arr: RbacModule[]) {
    return arr.map((m) => ({
      ...m,
      selected: false,
      children:
        m.children?.map((c) => ({
          ...c,
          selected: false,
          read: false,
          write: false,
          remove: false,
          children:
            c.children?.map((s) => ({
              ...s,
              selected: false,
              read: false,
              write: false,
              remove: false,
            })) || [],
        })) || [],
    }));
  }

  toggleAll(module: RbacModule) {
    module.read = module.selected;
    module.write = module.selected;
    module.remove = module.selected;
    module.children!.forEach((menu) => {
      menu.selected = module.selected;
      menu.read = module.selected;
      menu.write = module.selected;
      menu.remove = module.selected;
      menu.children!.forEach((child) => {
        child.selected = module.selected;
        child.read = module.selected;
        child.write = module.selected;
        child.remove = module.selected;
      });
    });
  }

  toggleChildren(module: RbacModule, menu: RbacModule) {
    // 1️⃣ Toggle all child nodes
    if (menu.children && menu.children.length > 0) {
      menu.children.forEach((child) => {
        child.selected = menu.selected;
        child.read = menu.selected;
        child.write = menu.selected;
        child.remove = menu.selected;
      });
    }

    // 2️⃣ Sync menu read/write/delete with its own selected state
    menu.read = menu.selected;
    menu.write = menu.selected;
    menu.remove = menu.selected;

    // 3️⃣ Update module parent based on all menus
    // module.selected = module.children!.every((m) => m.selected);

    // 4️⃣ If all children of menu are selected → set menu as selected
    if (menu.children && menu.children.length > 0) {
      menu.selected = menu.children.every((c) => c.selected);
    }
  }

  updateParentStatus(module: RbacModule, menu: RbacModule, child: RbacModule) {
    child.read = child.selected;
    child.write = child.selected;
    child.remove = child.selected;
    // const hasChildren = menu.children && menu.children.length > 0;

    // if (hasChildren) {
    //   // 1️⃣ Menu selected only if ALL children selected
    //   menu.selected = menu.children!.every((c) => c.selected);

    //   // 2️⃣ If ANY child has read/write/delete → menu should inherit
    //   const anyChildSelected = menu.children!.some((c) => c.selected);

    //   menu.read = anyChildSelected;
    //   menu.write = anyChildSelected;
    //   menu.remove = anyChildSelected;
    // }

    // Module selected only if all menus selected
    // const allMenusSelected = module.children!.every((m) => m.selected);
    // const anyMenuSelected = module.children!.some((m) => m.selected);

    // // Fix: only update module.selected when needed
    // if (allMenusSelected) {
    //   module.selected = true; // all selected
    // } else if (!anyMenuSelected) {
    //   module.selected = false; // all unselected
    // } else {
    //   // Mixed state (some selected, some not)
    //   module.selected = false; // prevent auto-check
    // }
  }

  savePermissions() {
    const payload: any[] = [];

    this.moduleList.forEach((module) => {
      // ALWAYS PUSH MAIN MODULE
      payload.push({
        moduleId: module.id,
        read: module.read || false,
        write: module.write || false,
        remove: module.remove || false,
      });

      module.children!.forEach((menu) => {
        // ALWAYS PUSH LEVEL 1 CHILDREN
        payload.push({
          moduleId: menu.id,
          read: menu.read || false,
          write: menu.write || false,
          remove: menu.remove || false,
        });

        menu.children!.forEach((child) => {
          // ALWAYS PUSH LEVEL 2 CHILDREN
          payload.push({
            moduleId: child.id,
            read: child.read || false,
            write: child.write || false,
            remove: child.remove || false,
          });
        });
      });
    });

    const entityId = JSON.parse(localStorage.getItem('selectedEntityId')!);

    const data = {
      roleId: this.data.role_master_id,
      permissions: payload,
      entityId,
    };

    this.menuApi.bulkSaveRolePermissions(data).subscribe((res: any) => {
      this.toast.success(res.message);
      this.dialog.close();
    });
  }

  onClose(): () => void {
    return () => this.dialog.close(false);
  }
}
