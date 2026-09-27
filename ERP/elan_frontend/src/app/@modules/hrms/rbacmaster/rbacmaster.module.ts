import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RbacmasterRoutingModule } from './rbacmaster-routing.module';
import { RbacmasterComponent } from './rbacmaster.component';
import { RbacRoleMasterModule } from './rbac-role-master/rbac-role-master.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { UserPermissionComponent } from './user-permission/user-permission.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';

@NgModule({
  declarations: [RbacmasterComponent, UserPermissionComponent],
  imports: [
    CommonModule,
    RbacmasterRoutingModule,
    RbacRoleMasterModule,
    AgGridModule,
    FormsModule,
    MaterialModule,
    MatSelectFilterModule,
    ShairedModule,
    ReactiveFormsModule
  ],
})
export class RbacmasterModule {}
