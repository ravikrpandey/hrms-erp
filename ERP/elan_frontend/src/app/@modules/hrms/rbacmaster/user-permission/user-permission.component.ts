import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RbacModule } from 'src/app/@shared/interface/core.interface';
import { MenuManagementService } from 'src/app/@shared/services/menu-management.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss'],
})
export class UserPermissionComponent {
  employees: any[] = [];
  moduleList: RbacModule[] = [];
  originalModuleList: RbacModule[] = []; // Store original state
  form: FormGroup;
  isLoading = false;
  isSaving = false;

  constructor(
    private _rbacMasterService: RbacMasterService,
    private menuApi: MenuManagementService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      employee_id: new FormControl(null),
    });

    let entity_id = localStorage.getItem('selectedEntityId');
    this.form.get('employee_id')?.valueChanges.subscribe((value) => {
      if (value) {
        this.getRoleAndUserPermissions(entity_id, value);
      } else {
        this.moduleList = [];
        this.originalModuleList = [];
      }
    });
    this.getEmployeeData(entity_id);
  }

  getEmployeeData(entity_id: any) {
    this._rbacMasterService
      .getAllEmployeeByEntityId(entity_id)
      .subscribe((res: any) => {
        this.employees = res.data;
      });
  }

  getRoleAndUserPermissions(entity_id: any, employee_id: number) {
    const employee = this.employees.find(
      (e: any) => e.employee_id === employee_id
    );

    const role_master_id = employee?.role_master_id || null;
    
    this.isLoading = true;
    this.moduleList = [];

    this.menuApi
      .getRoleAndUserPermissions(entity_id, employee_id, role_master_id)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.moduleList = res.modules;
          // Deep clone to preserve original state
          this.originalModuleList = JSON.parse(JSON.stringify(res.modules));
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Failed to load permissions');
          this.isLoading = false;
        }
      });
  }

  toggleAll(module: RbacModule) {
    module.read = module.selected;
    module.write = module.selected;
    module.remove = module.selected;
    module.isUser = true; // Mark as user-modified

    module.children!.forEach((menu) => {
      menu.selected = module.selected;
      menu.read = module.selected;
      menu.isUser = true; // Mark as user-modified

      menu.children!.forEach((child) => {
        child.selected = module.selected;
        child.read = module.selected;
        child.isUser = true; // Mark as user-modified
      });
    });
    console.log(module);
  }

  toggleChildren(module: RbacModule, menu: RbacModule) {
    // Mark menu as user-modified
    menu.isUser = true;

    // 1️⃣ Toggle all child nodes
    if (menu.children && menu.children.length > 0) {
      menu.children.forEach((child) => {
        child.selected = menu.selected;
        child.read = menu.selected;
        child.write = menu.selected;
        child.remove = menu.selected;
        child.isUser = true; // Mark as user-modified
      });
    }

    // 2️⃣ Sync menu read/write/delete with its own selected state
    menu.read = menu.selected;
    menu.write = menu.selected;
    menu.remove = menu.selected;

    // 4️⃣ If all children of menu are selected → set menu as selected
    if (menu.children && menu.children.length > 0) {
      menu.selected = menu.children.every((c) => c.selected);
    }
  }

  updateParentStatus(module: RbacModule, menu: RbacModule, child: RbacModule) {
    child.read = child.selected;
    child.write = child.selected;
    child.remove = child.selected;
    child.isUser = true; // Mark as user-modified
  }

  // TrackBy function for better performance
  trackByModuleId(index: number, module: RbacModule): number {
    return module.id;
  }

  savePermissions() {
    if (this.isSaving) return; // Prevent double-click

    const payload: any[] = [];

    // Helper to find original module by id
    const findOriginalModule = (
      id: number,
      modules: RbacModule[]
    ): RbacModule | null => {
      for (const module of modules) {
        if (module.id === id) return module;
        if (module.children && module.children.length > 0) {
          const found = findOriginalModule(id, module.children);
          if (found) return found;
        }
      }
      return null;
    };

    // Recursive function to collect modified permissions
    const collectModifiedPermissions = (module: RbacModule) => {
      const original = findOriginalModule(module.id, this.originalModuleList);

      // Check if this module's permissions have changed
      if (original) {
        const hasChanged =
          module.read !== original.read ||
          module.write !== original.write ||
          module.remove !== original.remove;

        // Only save if changed OR if it was already a user permission
        if (hasChanged || module.isUser) {
          payload.push({
            moduleId: module.id,
            read: module.read || false,
            write: module.write || false,
            remove: module.remove || false,
          });
        }
      }

      // Process children recursively
      if (module.children && module.children.length > 0) {
        module.children.forEach((child) => collectModifiedPermissions(child));
      }
    };

    // Collect all modified permissions
    this.moduleList.forEach((module) => collectModifiedPermissions(module));

    const userId = this.form.get('employee_id')?.value;

    if (!userId) {
      this.toast.error('Please select an employee');
      return;
    }

    if (payload.length === 0) {
      this.toast.info('No changes to save');
      return;
    }

    const data = {
      userId: userId,
      permissions: payload,
    };

    console.log('USER PERMISSION PAYLOAD:', data);

    this.isSaving = true;

    this.menuApi.bulkSaveUserPermissions(data).subscribe({
      next: (res: any) => {
        this.toast.success(res.message);
        this.isSaving = false;
        // Refresh to get updated state
        const entity_id = localStorage.getItem('selectedEntityId');
        this.getRoleAndUserPermissions(entity_id, userId);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Failed to save permissions');
        this.isSaving = false;
      }
    });
  }
}
