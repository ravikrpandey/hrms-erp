import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RbacRoleMasterRoutingModule } from './rbac-role-master-routing.module';
import { RbacRoleListComponent } from './rbac-role-list/rbac-role-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { RbacRoleCreateComponent } from './rbac-role-create/rbac-role-create.component';
import {MatIconModule} from '@angular/material/icon';
import { ActionsComponent } from './actions/actions.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NewRoleDialogComponent } from './new-role-dialog/new-role-dialog.component';

@NgModule({
  declarations: [
    RbacRoleListComponent,
    RbacRoleCreateComponent,
    ActionsComponent,
    NewRoleDialogComponent
  ],
  imports: [
    CommonModule,
    RbacRoleMasterRoutingModule,
    AgGridModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ]
})
export class RbacRoleMasterModule { }
